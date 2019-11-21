const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/defaultConfig.js');
const route = require('./helper/route.js');
const openUrl = require('./helper/openUrl');

class Server {
  constructor (config) { // 把用户的输入传进来
    this.conf = Object.assign({}, conf, config); // merge 合并 和 index的
  }

  start() { //要传入config才可以启动，等着别人调用就好了。
    const server = http.createServer((req, res) => {
      const filePath = path.join(this.conf.root, req.url);
      route(req, res, filePath, this.conf);
    });

    server.listen(this.conf.port, this.conf.hostname, () => {
      const addr = `http://${this.conf.hostname}:${this.conf.port}`;
      console.info(`Server started at ${chalk.green(addr)}`)
      openUrl(addr)
    });
  }
}

module.exports = Server;

// 再分个 index.js 绕来绕去的好处：这个包可以做 cli 工具使用，也可以被人 require 使用。