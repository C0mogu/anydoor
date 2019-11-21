module.exports = {
  root: process.cwd(),
  hostname: '127.0.0.1',
  port: '9527',
  compress: /\.(html|js|css|md)/, // 不是所有文件都要压缩，所以要配置。
  cache: {  // 缓存header。设置打开。
    maxAge: 600,
    expires: true,
    cacheControl: true,
    lastModified: true,
    etag: true
  }
};
