# 线程与进程

## 进程（Process）

进程是一个具有一定独立功能的程序在一个数据集上的一次动态执行的过程，是操作系统进行资源分配和调度的一个独立单位，是应用程序运行的载体。

进程是一种抽象的概念，从来没有统一的标准定义。
进程一般由程序、数据集合和进程控制块三部分组成：
-   程序用于描述进程要完成的功能，是控制进程执行的指令集；
-   数据集合是程序在执行时所需要的数据和工作区；
-   程序控制块(Program Control Block，简称PCB)，包含进程的描述信息和控制信息，是进程存在的唯一标志。

在某一时刻，一个 CPU 中只能运行一个进程，它是在各个进程之间来回切换的，每个进程执行的速度也不确定。

## 线程（Thread）

线程是程序执行中一个单一的顺序控制流程，是程序执行流的最小单元，是处理器调度和分派的基本单位。

线程的运行状态：
![](https://gw.aikan.miguvideo.com/ifs/img/b45a60769b3655c321ec921b36f99241_2.png)

## 进程与线程的区别与联系

1. 线程是程序执行的最小单位，而进程是操作系统分配资源的最小单位；
2. 一个进程由一个或多个线程组成，线程是一个进程中代码的不同执行路线；
3. 进程之间相互独立，但同一进程下的各个线程之间共享程序的内存空间(包括代码段、数据集、堆等)及一些进程级的资源(如打开文件和信号)，某进程内的线程在其它进程不可见；
4. 调度和切换：线程上下文切换比进程上下文切换要快得多。

线程与进程关系的示意图：

![111](https://gw.aikan.miguvideo.com/ifs/img/12204f0ca1fb0b5f996991f02fb8b6c9_1.png)


扩展：[关于 cpu 进程调度算法](https://juejin.cn/post/6844903756866256909)

## JavaScript中的线程与进程

众所周知，javascript是单线程的，这是由于在早期js作为脚本语言只是用来辅助优化用户交互的，并没有赋予多线程能力。

针对现在的js的线程和进程处理能力，主要区分为浏览器环境和node环境

### 浏览器

浏览器是多进程的，系统给每个进程分配了资源（CPU、内存等），每打开一个Tab页，就相当于创建了一个独立的浏览器进程。

浏览器主要包含了下面这个进程：

- Browser进程：浏览器的主进程，有且只有一个，负责协调和主控，只要有以下作用

	-	负责浏览器界面显示，与用户交互，如前进、后退等
	-	负责各个页面的管理、创建和销毁其他进程
	-	将Renderer进程得到的内存中的Bitmap，绘制到用户界面上
	-	网络资源的管理、下载等

-	Renderer进程（浏览器渲染进程，浏览器内核，内部是多线程的）：默认每一个Tab页面都是一个进程，互不影响。主要作用是 页面渲染、脚本执行、事件处理等

-	GPU进程：最多只有一个，用户3D绘制等

-	第三方插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建

#### 浏览器多进程的优势

相比较与单进程浏览器，多进程有如下优势：

-	避免单个Page Crash影响到整个浏览器
-	避免第三方插件Crash于影响到整个浏览器
-	多进程充分利用多核优势
-	方便使用沙盒模型隔离插件等进程，提高浏览器的稳定性

#### 渲染进程

对于前端开发人员来说，接触到最多的可能就是浏览器的渲染进程，渲染进程内部是多线程的，主要包括以下几个线程：

1. GUI渲染线程
-	负责渲染浏览器界面，解析HTML、CSS、构建DOM树和RenderObject树，布局和绘制等
-	当界面需要重绘（Repaint）或由于某种操作引发回流(Reflow)时，改建成就绘制执行
-	注意：GUI渲染线程和JS引擎线程是互斥的，当JS引擎执行时GUI线程绘被挂起（相当于被冻结），GUI更新会被保存在一个队列中等JS引擎空闲时立即被执行
2. JS引擎线程
-	JS引擎线程也被成为JS内核，负责处理JavaScript脚本程序，如V8引擎
-	JS引擎线程负责解析JavaScript脚本，运行代码
-	JS引擎一直等待着任务队列中任务的到来，然后加以处理，一个Tab页（Renderer进程）中无论什么时候只有一个JS线程在执行JS程序
-	同样注意，GUI渲染线程与JS引擎线程是互斥的，所以如果JS执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞。
3. 事件触发线程
-	归属于浏览器而不是JS引擎，用来控制事件循环
-	当JS引擎执行代码块如setTimeout时（也可来自浏览器内核的其他线程，如鼠标点击、Ajax异步请求等），会将对应的任务添加到事件线程中
-	当对应的事件符合触发条件时被触发时，事件触发线程会把事件添加到等待处理队列中，等待JS引擎的处理
-	注意：由于JS的但线程关系，所以这些待处理队列中的事件都得排队等待JS引擎处理（当JS引擎空闲时才会去执行）
4. 定时器触发线程
-	setInterval与setTimeout所在的线程
-	浏览器定时器并不是有JavaScript引擎计数的（因为JavaScript引擎是但线程的，如果处于阻塞线程状态就会影响计时的准确性）
-	通过单线程来计时并触发定时器事件（计时完毕后，添加到事件对勒中，等待JS引擎空闲后执行）
-	注意：W3C在HTML标准中规定，要求setTimeout中低于4ms的时间间隔算为4ms
5. 异步Http请求线程
-	XMLHttpRequest在连接后，是通过浏览器新开一个线程来请求数据
-	当监测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件，将回调放置事件队列中，再由JavaScript引擎执行


#### 从Event Loop谈JS的运行机制

到这里我们已经知道了JS引擎是单线程的，在浏览器Event Loop中会涉及到下面几个线程概念：

-	JS引擎线程
-	事件触发线程
-	定时触发线程

对于JS中的其他概念如下：

-	JS分为同步任务和异步任务
-	同步任务都在主线程上执行，形成一个执行栈
-	主线程之外，事件触发线程管理者一个任务队列，只要异步任务有了执行结果，就在任务队列中放置一个事件
-	一旦执行栈中的所有同步任务执行完毕（此时JS引擎空闲），系统就会读取任务队列，将可运行的异步任务添加到执行栈中，开始继续执行

![](https://gw.aikan.miguvideo.com/ifs/img/682ca4ec5157e7dac5f8dcecb2a7e0ec_4.png)


#### JS多线程的实现

由于JS引擎是单线程的，当JS执行事件过长会阻塞页面渲染，那么真多CPU密集型的计算该如何处理呢？

针对这样的问题，在HTML5中支持了 [Web Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)

在MDN的解释中，一个Worker是使用一个构造函数创建的一个对象(e.g.worker())运行一个命名的JavaScript文件，这个文件包含将在工作线程中运行的代码

workers运行在一个全局上下文中，不同于当前的window环境，所以在worker线程中，是不能通过window获取当前全局范围的数据

可以这么理解：

-	创建Worker时，JS引擎项浏览器申请新开一个子线程（子线程是浏览器创建的，完全手祝线程控制，并且不能操作DOM）
-	JS引擎线程与worker线程间通过特定的方式通信（postMessage API，需要通过序列化对象来与线程交互特定的数据）

扩展：[关于Web Worker(专有) 和 SharedWorker（共享）线程通信](https://juejin.cn/post/6844903589924569101)
https://juejin.cn/post/6844903736238669837

一个Nodejs服务的简单构成：一个进程 + 一个线程 + 一个事件循环 + 一个 JS 引擎 + 一个 Node.js 实例

### Node

Node.js 是 Javascript 在服务端的运行环境，构建在 chrome 的 V8 引擎之上，基于事件驱动、非阻塞I/O模型，充分利用操作系统提供的异步 I/O 进行多任务的执行，适合于 I/O 密集型的应用场景，因为异步，程序无需阻塞等待结果返回，而是基于回调通知的机制，原本同步模式等待的时间，则可以用来处理其它任务

> 科普：在 Web 服务器方面，著名的 Nginx 也是采用此模式（事件驱动），避免了多线程的线程创建、线程上下文切换的开销，Nginx 采用 C 语言进行编写，主要用来做高性能的 Web 服务器，不适合做业务。

#### Node中的进程

nodejs中的进程Process是一个全局对象，给我们提供了进程相关信息，针对Node中的多进程模型，则是利用Node [Cluster模块](http://nodejs.cn/api/cluster.html#cluster_cluster)和 [child_process模块](http://nodejs.cn/api/child_process.html#child_process_child_process)，具体可以查看eggjs官方文档：[多进程模型和进程间通讯](https://eggjs.org/zh-cn/core/cluster-and-ipc.html)

##### Node中的多进程

利用[Cluster模块](http://nodejs.cn/api/cluster.html#cluster_cluster)和 [child_process模块](http://nodejs.cn/api/child_process.html#child_process_child_process)可以实现多进程

- 守护进程

后台运行的特殊进程，不受任何终端控制的进程。

- 工作进程

##### Node中的多线程

利用[worker_threads（工作线程）模块](http://nodejs.cn/api/worker_threads.html#worker_threads_worker_threads)可以实现多线程

worker_threads模块提供了同时运行多个线程的能力

# 总结

# 参考文章

-	[1] [Eggjs 多进程模型和进程间通讯](https://eggjs.org/zh-cn/core/cluster-and-ipc.html)
-	[2] [深入理解 Node.js 进程与线程](https://www.cnblogs.com/zhangguicheng/p/12092058.html)