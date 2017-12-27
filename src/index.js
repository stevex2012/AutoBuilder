import React, { Component } from 'react';
import ReactDom from 'react-dom';
import './index.css';
import Header from './web/components/Header';
import FuncPanel from './web/components/FuncPanel';
import OptPanel from './web/components/OptPanel';

// 显示头部信息
const headerTitle = "专题可视化构建工具"
// 左侧 导航栏 数据
const leftNavList = [
  {
    val: '添加点击框',
    type: 'addBox'
  }
]


class App extends Component {
  constructor() {
    super();
    this.state = {
      imgList: [],
      choosed: {

      }
    }
  }

  render() {
    return (
      <div id="root">
        <Header header={headerTitle} />
        <div className="wrap">
          <div className="left">
            <FuncPanel list={leftNavList} />
          </div>
          <div className="right">
            <OptPanel />
          </div>
        </div>
      </div>
    )
  }
}

ReactDom.render(<App />, document.getElementById('content'));