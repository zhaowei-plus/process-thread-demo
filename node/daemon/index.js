const spawn = require('child_process').spawn

function startDaemon () {
  // 运行一个守护进程
  const daemon = spawn('node', ['daemon.js'], {
    cwd: '/usr',
    detached: true,
    stdio: 'ignore'
  })

  console.log('守护进程开启 父进程 pid：%s，守护进程 pid：%s', process.pid, daemon.id)
  daemon.unref()
  daemon.on('exit', (code) => {
    console.log('exit :', code)
  })
}

startDaemon()
