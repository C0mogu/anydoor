const fs = require('fs');
const Handlebars = require('handlebars');
const path = require('path')
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
// const config = require('../config/defaultConfig.js');  这个是不变的，读不到用户的自定义输入，所以要删掉。让外面app.js传给它。
const mime = require('./mime.js');
const compress = require('./compress.js');
const range = require('./range.js');
const isFresh = require('./cache');

const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath); // 用同步是因为 ①下面的要进行工作必须等待这一个结果， ②只会执行一次。默认读出来的是Buffer （记得‘utf8’or 下面去转换）
// 预编译模板。
const template = Handlebars.compile(source.toString());

module.exports = async (req, res, filePath, config) => {
  try {
    const stats = await stat(filePath);
    if (stats.isFile()) {
      const contentType = mime(filePath); // 是文件的话 就得去识别什么文件，识别不出来就 txt
      res.setHeader('Content-Type', contentType);
// 万一不用返回 200 给拦截一下。
      if (isFresh(stats, req,  res)) {
        res.statusCode = 304;
        res.end();
        return;
      }

      let rs;
      const {code, start, end} = range(stats.size, req, res);
      if (code === 200) {
        res.statusCode = 200;
        rs = fs.createReadStream(filePath);
      } else {
          res.statusCode = 206;
          rs = fs.createReadStream(filePath, {start, end});
      }
      if (filePath.match(config.compress)) {
        rs = compress(rs, req, res)
      }
      rs.pipe(res);
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html','utf-8'); // 对于文件夹的话就返回 html 不用算了。
      const dir = path.relative(config.root, filePath);
      const data = {
        title: path.basename(filePath),
        dir: dir ? `/${dir}` : '', // 因为relative 的路径是根路径 就会返回 空 字符串。
        files: files.map(file => {
          return {
            file,
            icon: mime(file)
          }
        })
      };
      res.end(template(data))
    }
  } catch (ex) {
      console.error(ex);
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain','utf-8');
      res.end(`${filePath} is not a directory or file/n ${ex.toString()}`);
  }}