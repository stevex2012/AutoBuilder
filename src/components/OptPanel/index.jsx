// 添加，删除，图片
import React, { Component } from 'react';
import emitter from '../EventEmitter';
import $ from 'jquery';

import './index.css';

// 引入 右上角 删除 按钮 组件
import DelBtn from '../DelBtn';

// 引入 添加 拖拽块 jsx
import Drag from '../Dragger';

// 测试 点击 区域 数据
class OptPanel extends Component {
  constructor() {
    super();
    this.state = {
      imgSrc: [],
      choosedId: '',
      downloadurl: '',//下载 按钮
      title: '',// 网页title
      keyword: '',//网页 keyword
      description: '',//网页 description
      pageType: '',// 网页 类型 app ，pc
      test: ''
    }
  }
  // 测试，组件生命 周期  在组件 绘画之前 调用
  componentWillMount() {
    //  这里设置 state 不会 发生重绘，
    // var storageData = JSON.parse(localStorage.getItem('themePageStorage'));
    // storageData && this.setState(storageData)
    console.log('start componentWillMount before render');
  }
  // 测试 组件生命 周期 在组件 绘画之后 调用
  // componentDidMount(){
  //     // 可以在这个回调 函数里面 执行数据 操作 ==    
  //     // 任何dom  都可以在 这里操作，但绝对不可以在 render 里面执行  
  //     console.log('start componentDidMount afer render');
  // }
  //更新state
  //  shouldComponentUpdate 方法会在  render  方法调用之前调用
  //在这个方法里可以控制是否绘制组件，或者直接跳过。
  //显然，这个方法一定不会在初始化的时候调用。
  //在这个方法里需要返回一个boolean类型的值，默认返回true。
  shouldComponentUpdate(nextProps, nextState) {
    console.log('do shouldComponentUpdate,can get nexrProps and nextState' + nextProps, nextState)
    return true;
  }
  // componentWillUpdate
  // componentWillUpdate方法在shouldComponentUpdate方法返回true之后就会被调用。
  // 在和方法里任何的this.setState方法调用都是不允许的
  // ，因为这个方法是用来为接下来的绘制做准备的，不是用来触发重绘的。
  componentWillUpdate() {
    console.log('do componentWillUpdate only shouldComponentUpdate return true');
  }
  // componentDidUpdate方法在render方法之后调用。
  //和componentDidMount方法类似，这个方法里也可以执行DOM操作。
  componentDidUpdate(prevProps, prevState) {
    console.log('do componentDidUpdate after render' + prevProps, prevState);
  }
  //Props改变引发的绘制
  // componentWillRecieveProps(nextProps){
  //     console.log('--------------------------');
  //     conosle.log(nextProps);
  // }
  
  // 测试===============================================
  choose(e) {
    //console.log(e.target.value)
    var fileReader = new FileReader();
    var file = e.target.files[0];
    fileReader.readAsDataURL(file);
    var arr = this.state.imgSrc;
    //console.log(file);
    fileReader.onloadend = (onEv) => {
      var src = onEv.target.result;//base64
      var img = new Image();
      img.src = src;
      img.onload = function () {
        //console.log(img.width,img.height);
      }
      var obj = {
        id: new Date().getTime(),
        src: src,
        isActive: false
      }
      // 获取图片的宽和高，w，h 不是真实的，是相对的，要获取百分比
      arr.push(obj)
      this.setState({ imgSrc: arr })
    }
  }
  // 图片onload 事件
  imgOnload(e) {
    console.log(e.target.offsetWidth, e.target.offsetHeight);
    const trgt = e.target;
    const id = trgt.id;
    const width = trgt.offsetWidth;
    const height = trgt.offsetHeight;
    const tplArr = this.state.imgSrc;
    tplArr.map((elm, idx) => {
      if (elm.id == id) {//  如果这个对象没有 widht ,height 则设置，
        elm.width = !elm.width && width;
        elm.height = !elm.height && height;
      }
    })
    this.setState({
      imgSrc: tplArr
    })
    // e.target.width, e.target.heigt ,获取 图片的高度，宽度
  }
  choosedImg(e) {
    var id = e.target.id;
    var imgArr = this.state.imgSrc;
    imgArr.map((elm, idx) => {// 设置对应的 key 的值
      elm.isActive = elm.id == id ? true : false;
    })
    this.setChoosedImg(imgArr, id);
    e.stopPropagation();
  }
  setChoosedImg(arr, id) {
    this.setState({ imgSrc: arr })
    this.setState({ choosedId: id })// 记录 选中 img的id
  }
  componentDidMount() {
    // var dom = this.getDOMNode()

    //console.log(this.getDOMNode());

    console.log('start componentDidMount after render');
    /// 声明一个自定义事件
    // 在组件装载完成以后 
    this.eventEmitter = emitter.addListener('addbox', () => {
      console.log('add');
      // 得到选中中的 id this.state.choosedId, 找到这数据中额id 向这里对象中添加 数据 
      var imgArr = this.state.imgSrc;
      var choosedId = this.state.choosedId;
      imgArr.map((elm, idx) => {
        if (elm.id == choosedId) {
          if (!elm.clkArr) {// 如果 没有这个属性，就设置，有了就直接push
            elm.clkArr = []
          }
          var obj = {// 设置添加对象=============
            left: '',
            top: '',
            width: 50,
            height: 50,
            id: new Date().getTime()
          }
          elm.clkArr.push(obj)
        }
      })
      // 刷新数据====================
      this.setState({ imgSrc: imgArr });
    })
    // 在这里在 使用 emitter ，注册一个事件，有drag.jsx来触发
    this.drager = emitter.addListener('dragBox', (obj) => {
      console.log(obj);
      const changeId = obj && obj.id || '';
      // 标志位，是否有改变 isChanged
      const isChanged = false;
      // 得到 那面返回来的数据，使用setState 
      var tplArr = this.state.imgSrc;
      tplArr.map((elm, idx) => {

        elm.clkArr.map((clkElm, index) => {
          if (changeId == clkElm.id) {
            //isChanged = true;
            clkElm.left = obj.left;
            clkElm.top = obj.top;
          }
        })
      })
      this.setState({ imgSrc: tplArr })
    })

  }

  // 组件销毁前移除事件监听
  componentWillUnmount() {
    emitter.removeListener(this.eventEmitter);
    emitter.removeListener(this.drager);
  }
  handleMouseUp(val) {// 改变 拖拽 组建 w ，h 的回调 val obj
    // 得到 parentId，和id
    //{
    //width:this.state.width,
    // height:this.state.height,
    // id:this.props.id,
    // parentId:this.props.parentId
    //}
    const valObj = val || '';
    // 
    // 数据源
    const imgArr = this.state.imgSrc;
    //  根据id 查询要改变的 数据
    const changeData = this.acordIdChangeDate(valObj, imgArr)
    this.setState({
      imgSrc: changeData
    })
  }
  dragMove(val) {//  改变 拖拽 组件 positon x,y 回调
    const valObj = val || '';
    // 
    // 数据源
    const imgArr = this.state.imgSrc;
    //  根据id 查询要改变的 数据
    const changeData = this.acordIdChangeDate(valObj, imgArr)
    this.setState({
      imgSrc: changeData
    })

  }
  // 根据 点击区域的 来设置 imgSrc 下面的clkArr
  acordIdChangeDate(changeData, sourceData) {
    const parentdId = (changeData && changeData.parentId) || '';
    const childId = (changeData && changeData.id) || '';
    //  两次轮询
    sourceData && sourceData.map((elm, idx) => {
      if (elm.id == parentdId) {
        elm.clkArr && elm.clkArr.map((elmt, indx) => {
          if (elmt.id == childId) {
            elmt.width = changeData.width ? changeData.width : elmt.width;
            elmt.height = changeData.height ? changeData.height : elmt.height;
            elmt.left = changeData.left ? changeData.left : elmt.left;
            elmt.top = changeData.top ? changeData.top : elmt.top;
            // 这里对每个 点击区域 的 dataTitle dataType url value
            if (changeData.key) {
              elmt[changeData.key] = changeData.value || 　'';
            }
          }
        })
      }
    })
    return sourceData;
  }
  // 得到布局 数据函数==============向后台发起  ajax 通信，数据，
  getLayData() {
    const data = this.state.imgSrc;
    // 根据 imgSrc 数据算取，点击区域的 left ,top,width,height,css 样式

    const totalArr = []
    data.map((elm, idx) => {
      const parentWidth = elm.width || '';
      const parentHeight = elm.height || '';
      const index_idx = idx;
      const arr = [];
      // 轮询 点击区域
      elm.clkArr && elm.clkArr.map((elmt, index) => {
        const width = `${(elmt.width / parentWidth * 100).toFixed(2)}%`;
        const height = `${(elmt.height / parentHeight * 100).toFixed(2)}%`;
        const left = `${(elmt.left / parentWidth * 100).toFixed(2)}%`;
        const top = `${(elmt.top / parentHeight * 100).toFixed(2)}%`;
        const url = `${elmt.url || ''}`;
        const dataTitle = `${elmt.dataTitle || ''}`;
        const dataType = `${elmt.dataType || ''}`;
        const obj = {
          width,
          height,
          left,
          top,
          dataTitle,
          dataType,
          url
        }
        arr.push(obj)
      })
      totalArr.push({
        // 图片索引，第几章图片
        index: index_idx + 1,
        // 没张图片的 点击区域 的样式 百分比 eg{left：'',top:'',width:'',height:''}
        data: arr.length && arr || '',
        // 图片的 base64编码 
        base64Src: elm.src
      })
    })
    console.log(totalArr);
    // 发起ajax 请求，server。js来获取并相应
    const sendData = JSON.stringify(totalArr)
    // 这里要组装 html 的title，标签，的内容
    // meta标签 的 keyword属性 和 description 属性
    const title = this.state.title;
    const description = this.state.description;
    const keyword = this.state.keyword;
    // 得到 生成 网页 的 类型 pc app

    const isPc = (this.state.pageType == 'pc' && 1) || (this.state.pageType == 'app' && 2) || '';
    // 闭包
    const _this = this;

    const BasePath = `${window.location.protocol}//${window.location.host}`;
    // 发起请求 前验证数据 的有效性==============
    // 发起ajax 请求，server。js来获取并相应
    if (totalArr.length) {
      $.ajax({
        data: {
          data: sendData,
          isPc: isPc,// 是1--> pc 还是 2--->app
          title: title,
          description: description,
          keyword: keyword
        },
        timeout: 30000,
        type: 'post',
        url: `${BasePath}/getjson`,
        success: function (data) {
          console.log(data);
          data.result == 0 && data.data && data.data.downloadUrl && _this.setState({ downloadurl: data.data.downloadUrl })
        },
        error: function (err) {
          console.log(err);
        }
      })
    } else {
      alert('请先选择图片')
    }
    //emitter.emit('buildfile');
    //   这里我要去调用一个 事件，emitter.emit('addbox') 
  }
  // 这里是，那面 拖住啊 组建的 属性值的 ，函数回调 
  changeAttrList(data) {
    // 这里添加属性 
    console.log(data);
    const changeData = data;
    const sourceData = this.state.imgSrc;
    // 数据
    var changedData = this.acordIdChangeDate(changeData, sourceData);
    this.setState({
      imgSrc: changedData
    });
  }
  /// 设置 生成网页 title 
  setHTMLTitle(e) {
    const target = e.target;
    const value = target.value;
    this.setState({
      title: value
    })
  }
  /// 设置 生成网页 keyword 
  setHTMLKeyWord(e) {
    const target = e.target;
    const value = target.value;
    this.setState({
      keyword: value
    })
  }
  /// 设置 生成网页 description 
  setHTMLDecription(e) {
    const target = e.target;
    const value = target.value;
    this.setState({
      description: value
    })
  }
  // 选择 网页 类型 pc，app
  setPageType(e) {
    const target = e.target;
    const value = target.value;
    this.setState({
      pageType: value
    })
  }
  // 点击下载  ===============
  download(e) {
    const url = this.state.downloadurl
    url && $.ajax({
      type: 'get',
      url: url,
      success: function (data) {
        console.log('下载文件成功');
      },
      error: function (err) {
        alert(err)
      }
    })
  }
  // 需要对 this.state.imgSrc 数组，进行 改变 left，top，width，height
  // 删除 点击区域
  delDragArea(data) {
    // 解构 == 》赋值 es6
    const { parentId, id } = data;
    // 改变数据 源
    var temArr = this.state.imgSrc;
    temArr.map((elm, idx) => {
      if (elm.id == parentId) {
        var delTarget = elm.clkArr
        delTarget.map((elm, idx) => {
          if (elm.id == id) {
            delTarget.splice(idx, 1);
            return;
          }
        })
      }
    })
    this.setState({
      imgSrc: temArr
    })
  }
  // 删除图片=====================================
  delImg(data) {
    const id = data;
    const temArr = this.state.imgSrc;
    temArr.map((elm, idx) => {
      if (elm.id == id) {
        temArr.splice(idx, 1)
      }
    })
    this.setState({
      imgSrc: temArr
    })
  }
  // 点击 保存 当前 页面 配置数据==========
  storageData() {
    var storageData = JSON.stringify(this.state);
    localStorage.setItem('themePageStorage', storageData)
  }
  // 拖拽 元素===============
  render(props) {

    console.log('start render after componentWillMount');

    console.log('------------------------------------------');
    return (
      <div className="img_coporation">
        <div className="page-config">
          {/*专题页 类型 pc  app  */}
          <div className="pageType">
            <span className="txt">专题类型：</span>
            <label htmlFor="">
              <input type="radio" name="pageName" onClick={this.setPageType.bind(this)} value="pc" /><span>PC端</span>
            </label>
            <label htmlFor="">
              <input type="radio" name="pageName" onClick={this.setPageType.bind(this)} value="app" /><span>APP端</span>
            </label>
          </div>
          {/* 网页 配置，名称，关键字，描述 */}
          <div className="htmlTitle">
            <label htmlFor="">
              <span className="txt">网页标题：</span>
              <input type="text" onChange={this.setHTMLTitle.bind(this)} placeholder="请输入网页 名称" />
            </label>          
            <label htmlFor="">
              <span className="txt">网页关键字：</span>
              <input type="text" onChange={this.setHTMLKeyWord.bind(this)} placeholder="请输入网页 关键字" />
            </label>          
            <label htmlFor="">
              <span className="txt">网页描述：</span>
              <input type="text" onChange={this.setHTMLDecription.bind(this)} placeholder="请输入网页 描述" />
            </label>
          </div>
        </div>

        {
          this.state.imgSrc.map((elm, idx) => {
            var indexTag = elm.id;
            return (
              <div className="img_wrap" key={idx}  >
                <div className={elm.isActive ? "img_box bounds ac" : "img_box bounds"}
                  id={elm.id}
                  onClick={this.choosedImg.bind(this)}>
                  {/* 删除图片 ===按钮 */}
                  {/* <i className="remove-img"></i> */}
                  <DelBtn
                    needData={elm.id}
                    clickCb={this.delImg.bind(this)} />
                  <img src={elm.src} alt="" id={elm.id} onLoad={this.imgOnload.bind(this)} />
                  {
                    elm.clkArr && elm.clkArr.map((elm, index) => {
                      return <Drag
                        key={index}
                        id={elm.id}
                        delDragArea={this.delDragArea.bind(this)}
                        parentId={indexTag}
                        dragMove={this.dragMove.bind(this)}
                        changeAttrList={this.changeAttrList.bind(this)}
                        handleMouseUp={this.handleMouseUp.bind(this)} />
                    })
                  }

                </div>
              </div>
            )
          })
        }

        <div className="page-func">
          <input type="file" onChange={this.choose.bind(this)} />
          <button onClick={this.getLayData.bind(this)}>开始构建</button>
          {
            <a href={this.state.downloadurl}
              style={{ display: this.state.downloadurl ? 'inline-block' : 'none' }}
              download={this.state.downloadurl}>点击下载</a>
          }
          {/* <button onClick = {this.storageData.bind(this)}>保存当前配置数据</button> */}
        </div>
      </div>
    )
  }
}

export default OptPanel;


