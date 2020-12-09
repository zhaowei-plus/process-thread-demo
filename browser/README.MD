
# WebWorker
为 JavaScript 引入线程技术 不必再用 setTimeout()、setInterval()、XMLHttpRequest 来模拟并行
Worker 利用类似线程的消息传递实现并行。这非常适合您确保对 UI 的刷新、性能以及对用户的响应。
Web Worker 的三大主要特征：能够长时间运行（响应），理想的启动性能以及理想的内存消耗。

允许在 Web 程序中并发执行多个 JavaScript 脚本，每个脚本执行流都称为一个线程，彼此间互相独立，并且有浏览器中的 JavaScript 引擎负责管理。这将使得线程级别的消息通信成为现实。使得在 Web 页面中进行多线程编程成为可能。

专用 Web Worker (Dedicated Web Worker) 提供了一个简单的方法使得 web 内容能够在后台运行脚本。一旦 worker 创建后，它可以向由它的创建者指定的事件监听函数传递消息，这样该 worker 生成的所有任务就都会接收到这些消息。

Worker的作用域
self 和 this 指的都是 Worker 的全局作用域

WebWorker

-  Dedicated Worker

SharedWorker
ServiceWorker

https://www.cnblogs.com/cangqinglang/p/8963557.html
C10K问题
