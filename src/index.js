// 要去 app.js 里面调用。
const yargs = require('yargs');
const Server = require('./app');

const argv = yargs
  .usage('anywhere [options]') // 一句话告诉大家怎么用
  .option('p', {
    alias: 'port', //要和defaultConfig.js里面的名字保持一致。
    describe: '端口号',
    default: 9527 //这个也可以不写，因为defaultConfig.js里面有。如果没有就得写。完全靠输入。
  })
  .option('h', {
    alias: 'hostname',
    describe: 'host',
    default: '127.0.0.1'
  })
  .option('d', {
    alias: 'root',
    describe: 'root path',
    default: process.cwd()
  })
  .version()
  .alias('v', 'version')
  .help()
  .argv;

const server = new Server(argv);
server.start();
