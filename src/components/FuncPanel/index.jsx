// app/components/left_nav/left_nav.jsx
// 
import React, { Component } from 'react';

import './index.css';

import emitter from '../EventEmitter';

class FuncPanel extends Component {
  constructor() {
    super();
  }
  render(props) {
    const addBox = () => {
      return () => {
        // 触发自定义事件按 写个函数节流 一秒 内执行一次，，         
        emitter.emit('addbox')
      }
    }
    return (
      <ul className="nav">
        {
          this.props.list.map((elm, idx) => (
            <li key={idx} data-type={elm.type} onClick={addBox()}>
              {elm.val}
            </li>
          ))
        }
      </ul>
    )
  }
}
export default FuncPanel;
