//新建一个 ev.js，引入 events 包，并向外提供一个事件对象，供通信时使用：

import { EventEmitter } from 'events';

export default new EventEmitter();
