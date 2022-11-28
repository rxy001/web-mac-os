import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm"
import "highlight.js/styles/atom-one-dark.css"

/* eslint-disable */
const components = {
  img: ({ node, ...props }) => <img className="typora-img" {...props} />,
  td: ({ node, isHeader, ...props }) => <td {...props} className="typora-td" />,
  th: ({ node, isHeader, ...props }) => <th {...props} className="typora-th" />,
  table: ({ node, ...props }) => <table {...props} className="typora-table" />,
  code: ({ node, inline, ...props }) => (
    <code {...props} className={`${props.className ?? ""} typora-code`} />
  ),
  li: ({ node, ordered, inline, ...props }) => (
    <li {...props} className="typora-li" />
  ),
}

const text = `#### 栈垃圾回收

当函数执行结束，JS 引擎通过向下移动 ESP 指针（记录调用栈当前执行状态的指针），来销毁该函数保存在栈中的执行上下文。

#### 垃圾回收原理

其实不论什么类型的垃圾回收器，它们都有一套共同的执行流程。第一步是标记空间中活动对象和非活动对象。所谓活动对象就是还在使用的对象，非活动对象就是可以进行垃圾回收的对象。第二步是回收非活动对象所占据的内存。其实就是在所有的标记完成之后，统一清理内存中所有被标记为可回收的对象。第三步是做内存整理。一般来说，频繁回收对象后，内存中就会存在大量不连续空间，我们把这些不连续的内存空间称为内存碎片。当内存中出现了大量的内存碎片之后，如果需要分配较大连续内存的时候，就有可能出现内存不足的情况。所以最后一步需要整理这些内存碎片，但这步其实是可选的，因为有的垃圾回收器不会产生内存碎片。

#### 代际假说

1. 大部分对象存活时间很短。

2. 没有被销毁的对象，会活的更久。

#### 分代收集

V8 中会把堆分为新生代和老生代两个区域，新生代中存放的是生存时间短的对象（区域较小），老生代中存放的生存时间久的对象。

#### 标记阶段：

确定哪些对象可以被回收是垃圾回收中重要的一步。垃圾回收器通过可访问性（reachability）来确定对象的 “活跃度”（liveness）。这意味着任何对象如果在运行时是可访问的（reachable），那么必须保证这些对象应该在内存中保留，如果对象是不可访问的（unreachable）那么这些对象就可能被回收。

标记阶段就是找到可访问对象的一个过程；垃圾回收是从一组对象的指针（objects pointers）开始的，我们将其称之为根集（root set），这其中包括了执行栈和全局对象；然后垃圾回收器会跟踪每一个指向 JavaScript 对象的指针，并将对象标记为可访问的，同时跟踪对象中每一个属性的指针并标记为可访问的，这个过程会递归地进行，直到标记到运行时每一个可访问的对象。

#### 新生代区域副垃圾回收器

算法：Scavenge 算法

原理： 1、把新生代空间划分相等的半空间( semispace ) **from space** 与 **to space**。

2、新加入的对象都会存放到 **from space** ，当快被写满时，就需要执行一次垃圾清理操作。

3、先对 **from space** 中的垃圾做标记，标记完成之后，复制活动对象，放到 **to space** 中。

4、清除 **from space** 中的数据，同时置为空闲状态，即变成 **to space**，相应的 **to space ** 变成 **from space**。 对象晋升策略： 经过两次垃圾回收依然还存活的对象，会被移动到老生代区域中。

5、把移动后的对象的指针地址更新，每一个被复制对象都会留下一个转发地址（forwarding-address），用于更新指针以指向新的地址。

#### 老生代区域主垃圾回收器

算法：标记 - 清除（Mark-Sweep）

原理：标记 - 清除

缺点：对一块内存多次执行标记 - 清除算法后，会产生大量不连续的内存碎片。而碎片过多会导致大对象无法分配到足够的连续内存。

算法：标记 - 整理（Mark-Compact）

原理：标记 - 整理（将所有活动对象都向内存的一端移动 ）- 清除（清理掉端边界以外的内存 ）

#### 全停顿

一旦执行垃圾回收算法，都需要将正在执行的 JavaScript 脚本暂停下来，待垃圾回收完毕后再恢复脚本执行。我们把这种行为叫做全停顿（Stop-The-World）。

在 V8 新生代的垃圾回收中，因其空间较小，且存活对象较少，所以全停顿的影响不大，但老生代就不一样了。如果在执行垃圾回收的过程中，占用主线程时间过久将会造成页面的卡顿现象。

### 优化 Orinoco

#### 增量标记（Incremental Marking）

增量式垃圾回收是主线程间歇性的去做少量的垃圾回收的方式。我们不会在增量式垃圾回收的时候执行整个垃圾回收的过程，只是整个垃圾回收过程中的一小部分工作。做这样的工作是极其困难的，因为 JavaScript 也在做增量式垃圾回收的时候同时执行，这意味着堆的状态已经发生了变化，这有可能会导致之前的增量回收工作完全无效。从图中可以看出并没有减少主线程暂停的时间（事实上，通常会略微增加），只会随着时间的推移而增长。但这仍然是解决问题的的好方法，通过 JavaScript 间歇性的执行，同时也间歇性的去做垃圾回收工作，JavaScript 的执行仍然可以在用户输入或者执行动画的时候得到及时的响应。

![img](https://v8.js.cn/_img/trash-talk/06.svg)

#### 并行（Concurrent）

并行是主线程和协助线程同时执行同样的工作，但是这仍然是一种 ‘stop-the-world’ 的垃圾回收方式，但是垃圾回收所耗费的时间等于总时间除以参与的线程数量（加上一些同步开销）。这是这三种技术中最简单的 JavaScript 垃圾回收方式；因为没有 JavaScript 的执行，因此只要确保同时只有一个协助线程在访问对象就好了。

![img](https://v8.js.cn/_img/trash-talk/05.svg)

#### 并发（Concurrent）

并发是主线程一直执行 JavaScript，而辅助线程在后台完全的执行垃圾回收。这种方式是这三种技术中最难的一种，JavaScript 堆里面的内容随时都有可能发生变化，从而使之前做的工作完全无效。最重要的是，现在有读/写竞争（read/write races)，主线程和辅助线程极有可能在同一时间去更改同一个对象。这种方式的优势也非常明显，主线程不会被挂起，JavaScript 可以自由地执行 ，尽管为了保证同一对象同一时间只有一个辅助线程在修改而带来的一些同步开销。

#### WeakMap/WeakSet

WeakSet 中的对象以及 WeakMap 的键名都是弱引用，即垃圾回收机制不考虑 WeakSet/WeakMap 对该对象的引用。因此只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。WeakMap 弱引用的只是键名，而不是键值，键值依然是正常引用。
`

export default function Markdown() {
  return (
    <ReactMarkdown
      children={text}
      rehypePlugins={[rehypeHighlight]}
      remarkPlugins={[remarkGfm]}
      components={components}
    />
  )
}
