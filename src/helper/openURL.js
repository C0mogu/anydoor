const { exec } = require('child_process'); // exec可以自动帮我们打开进程。调用系统的默认命令

module.exports = url => {
  switch (process.platform) {
    case 'darwin':
      exec(`open ${url}`);
      break;
    case 'win32':
      exec(`start ${url}`);
      break;
  }
};
