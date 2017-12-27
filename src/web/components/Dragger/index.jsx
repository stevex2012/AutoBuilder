import React, { Component } from 'react';

import './index.css'

import Dragger from 'react-dragger-r';

// 右侧 属性添加模块 ===
import RightNav from '../DragBoxPanel';

//  // 引入 右上角 删除 按钮 组件
import DelBtn from '../DelBtn';

const doc = document;

class Drag extends Component {
  constructor(props) {
    super(props)
    this.move = this.move.bind(this)
    this.resizeEnd = this.resizeEnd.bind(this)
    this.state = {
      oringX: 0,
      oringY: 0,
      width: 50,
      height: 50,
      left: 0,
      top: 0,
      lastW: 50,
      lastH: 50,
      id: this.props.id,
      attrList: [
        {
          title: 'data-title',
          type: 'dataTitle',
          value: '',
          id: 1
        },
        {
          title: 'data-type',
          type: 'dataType',
          value: '',
          id: 2
        },
        {
          title: '链接',
          type: 'url',
          value: '',
          id: 3
        }
      ]


    }
  }
  move(e) {
    const startX = e.clientX;
    const startY = e.clientY;
    //console.log(startX,startY);
    //console.log(this.state);
    var width = this.state.lastW;
    var height = this.state.lastH;

    const difWidth = startX - this.state.oringX + width;

    const difHeight = startY - this.state.oringY + height;

    this.setState({
      width: difWidth,
      height: difHeight
    })
    e.stopPropagation();
  }
  resizeStart(e) {
    doc.body.style.userSelect = 'none'
    const startX = e.clientX;
    const startY = e.clientY;
    // console.log(startX,startY);
    this.setState({
      oringX: startX,
      oringY: startY
    })
    doc.addEventListener('mousemove', this.move)
    doc.addEventListener('mouseup', this.resizeEnd)
    //doc.addEventListener('mouseout', this.handleMouseOut.bind(this))
    e.stopPropagation();
  }
  resizeEnd(e) {
    doc.body.style.userSelect = ''

    const lastW = this.state.width;
    const lastH = this.state.height;

    console.log('up')
    doc.onmousemove = null;
    doc.removeEventListener('mousemove', this.move)

    doc.removeEventListener('mouseup', this.resizeEnd)
    this.setState({
      lastW,
      lastH
    })
    e.stopPropagation();
    //  回调 给 父组件  的方法 


  }
  handleMouseOut(e) {
    console.log('out');
    doc.removeEventListener('mousemove', this.move, false)
    doc.addEventListener('mouseup', this.resizeEnd.bind(this))

    e.stopPropagation();
  }
  handleMouseUp(e) {
    const obj = {
      width: this.state.width,
      height: this.state.height,
      id: this.props.id,
      parentId: this.props.parentId
    }

    this.props.handleMouseUp(obj);
    e.stopPropagation();
  }
  componentWillUnmount() {

  }
  dragMove(ve, x, y) {// x,y , 获取 拖拽的   x,y
    const obj = {
      left: x,
      top: y,
      id: this.props.id,
      parentId: this.props.parentId
    }

    this.props.dragMove(obj);

  }
  // 那个插件 传过来 的数据 ，这这里修改
  changeValue(data) {
    const arr = this.state.attrList;
    // 改变 input 框的 对应 数组的id
    const id = data.id;
    // input   改变值
    const value = data.value;
    // input 框的 类型  dataTile ，？ dataType ? url 三 in 一  
    const type = data.type

    arr.map((elm, idx) => {
      if (elm.id == id) {
        elm.value = value;
      }
    })
    this.setState({
      attrList: arr
    })
    console.log(arr);
    // 组装数据 传到 父组件
    const sendToParentObj = {
      id: this.props.id,
      parentId: this.props.parentId,
      // keyVal 是为了 父组件 读取 子组件 传过去的 识别 添加 什么key 
      key: type,
      // value  对应那面的 value  父组件表现形式 key:value
      value: value
    }
    console.log(sendToParentObj);
    // 因为 type 为变量，所以给 对象赋值的时候，不能使用上面的 字面量方法
    //sendToParentObj[type] = value;
    // 这里吧参数，传入到 addImg 组建中，给 点击区域的 数据 总揽添加 list 属性
    this.props.changeAttrList(sendToParentObj);
  }
  // 删除 组建 点击删除 
  // 向父组件 同行，利用this.props
  doDelete(data) {
    const delData = {
      id: this.props.id,
      parentId: this.props.parentId
    }
    this.props.delDragArea(delData);
    // 阻止 事件冒泡==============

  }
  // 清空 input 框 value 值
  clearInputVal(data) {
    console.log('dragger' + data);
    const id = data;
    const temArr = this.state.attrList;
    temArr.map((elm, idx) => {
      if (id == elm.id) {
        elm.value = '';

      }
    })
    this.setState({
      attrList: temArr
    })
  }
  componentWillUnmount() {
    console.log('removed a dragger')
  }
  render() {
    const styleObj = {
      left: `${this.state.left}px`,
      top: `${this.state.top}px`,
      width: `${this.state.width}px`,
      height: `${this.state.height}px`
    }
    return (
      <Dragger
        onMove={this.dragMove.bind(this)}
        bounds='parent'
        style={styleObj}
        className="clkArea">
        <div
          className="content">simple drag
                    {/* 点击删除 */}
          <DelBtn
            clickCb={this.doDelete.bind(this)}
          />

          {/* 拖住啊，改变w，h */}
          <i className="dragable"
            onMouseDown={this.resizeStart.bind(this)}
            onMouseUp={this.handleMouseUp.bind(this)}
          //onMouseOut={this.handleMouseOut.bind(this)}
          ></i>
          <div className="right-coperation">
            {
              this.state.attrList.length && this.state.attrList.map((elm, idx) => {
                return (
                  <RightNav
                    key={idx}
                    title={elm.title}
                    type={elm.type}
                    value={elm.value}
                    id={elm.id}
                    clearInputVal={this.clearInputVal.bind(this)}
                    changeValue={this.changeValue.bind(this)} />
                )
              })
            }
          </div>
        </div>
      </Dragger>
    )
  }
}

export default Drag;