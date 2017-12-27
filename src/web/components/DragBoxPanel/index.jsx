import React, { Component } from 'react';
import './index.css'
// 引入 删除 图标
import DelBtn from '../DelBtn';

class RightNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: 'data-title',
      type: 'dataTitle',
      value: ''
    }
  }
  changeValue(e) {
    const target = e.target;
    const value = target.value;
    const id = target.id
    const type = target.getAttribute('data-type')
    console.log('change input value');
    this.props.changeValue({
      id: id,
      value: value,
      type: type
    });
  }
  // 清空value 值
  clearValue(data) {
    const { id, type } = data;
    this.props.changeValue({
      id: id,
      value: '',
      type: type
    });
    this.refs.inputVal.value = '';
  }
  render() {
    // return (
    //     <ul className="right_nav">
    //         {   

    //             this.props.list.map((elm,idx)=>(
    //                 <li key={idx}>
    //                     <div className="titel">{elm.title}</div>
    //                     <div className='content'>
    //                         {/* 清空 input valu 组建 */}
    //                         <DelBtn 
    //                         needData={elm.id}
    //                         clickCb={this.clearValue.bind(this)}
    //                         styleObj={}/>
    //                         <input type='text' 
    //                         defaultValue={elm.value} 
    //                         id={idx}
    //                         data-type={elm.type}
    //                         placeholder={`请输入点击区域${elm.type}`}
    //                         onChange={this.changeValue.bind(this)}/>
    //                     </div>
    //                 </li>
    //             ))
    //         }
    //     </ul>
    // )
    return (
      <div className='content-right-nav'>

        <div className="title">{this.props.title}</div>        
        {/* 清空 input valu 组建 */}                  
        <input type='text'
          defaultValue={this.props.value}
          id={this.props.id}
          data-type={this.props.type}
          placeholder={`请输入点击区域${this.props.type}`}
          ref='inputVal'
          onChange={this.changeValue.bind(this)} />
        <DelBtn
          needData={{
            id: this.props.id,
            type: this.props.type
          }}
          styleObj={{
            top: 'auto',
            width: '13px',
            height: '13px',
            right: '6px',
            bottom: '6px'
          }}
          clickCb={this.clearValue.bind(this)}
        />
      </div>
    )
  }
}

export default RightNav;