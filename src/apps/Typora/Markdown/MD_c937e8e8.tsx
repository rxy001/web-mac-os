// @ts-nocheck
/* eslint-disable */

import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm"
import "highlight.js/styles/atom-one-dark.css"

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

const text = `~~~js
const REJECTED = 0;
const RESOLVED = 1;
const PENDING = 2;

// resolve(x) x 为 Promise 时的状态
const DEFERRED = 3;

function isFunction(f) {
  return typeof f === "function";
}

function isObject(o) {
  return typeof o === "object";
}

function noop() {}

function doResolve(fn, promise) {
  let called = false;

  try {
    fn(
      function (value) {
        called = true;
        resolve(promise, value);
      },
      function (reason) {
        called = true;

        reject(promise, reason);
      }
    );
  } catch (err) {
    if (!called) {
      reject(promise, err);
    }
  }
}

function Promise(executor) {
  // 状态
  this._state = PENDING;

  // 值
  this._value = void 0;

  // .then() 所创建的 promise 集合
  this._deferreds = void 0;

  if (executor === noop) return;

  doResolve(executor, this);
}

function Handler(promise, onFulfilled, onRejected) {
  this.onFulfilled = isFunction(onFulfilled) ? onFulfilled : void 0;
  this.onRejected = isFunction(onRejected) ? onRejected : void 0;
  this.promise = promise;
}

Promise.prototype.then = function (onFulfilled, onRejected) {
  const promise = new Promise(noop);

  handler(this, new Handler(promise, onFulfilled, onRejected));

  // 2.2.27
  return promise;
};

// promise state 改变后， 处理 promise callback
function handler(promise, deferred) {
  // 2.3.2
  while (promise._state === DEFERRED) {
    promise = promise._value;
  }

  if (promise._state === PENDING) {
    promise._deferreds = [...(promise._deferreds ?? []), deferred];
    return;
  }

  // 2.2.4
  asap(() => {
    const cb =
      promise._state === RESOLVED ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      // 2.2.1
      if (promise._state === RESOLVED) {
        // 2.2.7.3
        resolve(deferred.promise, promise._value);
      } else {
        // 2.2.7.4
        reject(deferred.promise, promise._value);
      }
      return;
    } else {
      try {
        // 2.2.2.1、 2.2.3.1、2.2.5
        const x = cb(promise._value);
        // 2.2.7.1
        resolve(deferred.promise, x);
      } catch (error) {
        // 2.2.7.2
        reject(deferred.promise, error);
      }
    }
  });
}

function resolve(promise, x) {
  // 2.3.1
  if (promise === x) {
    reject(promise, new TypeError("promise_circular_chain"));
    return;
  }

  // 2.3.3
  if (x != null && (isFunction(x) || isObject(x))) {
    let then;
    try {
      // 2.3.3.1
      then = x.then;
    } catch (err) {
      // 2.3.3.2
      reject(promise, err);
    }
    // 2.3.2
    if (then === promise.then && x instanceof Promise) {
      promise._state = DEFERRED;
      promise._value = x;
      dispatch(promise);
      return;
    } else if (isFunction(then)) {
      // 2.3.3.3
      doResolve(then.bind(this), promise);
      return;
    }
  }

  // 2.3.3.4
  promise._state = RESOLVED;
  promise._value = x;

  dispatch(promise);
}

function dispatch(promise) {
  if (promise._deferreds?.length > 0) {
    // 2.2.6
    for (let index = 0; index < promise._deferreds.length; index++) {
      handler(promise, promise._deferreds[index]);
    }
    promise._deferreds = null;
  }
}

function reject(promise, value) {
  promise._state = REJECTED;
  promise._value = value;

  dispatch(promise);
}
~~~

~~~js
function asap(task) {
  if (!queue.length) {
    requestFlush();
    flushing = true;
  }
  queue[queue.length] = task;
}

var queue = [];

var flushing = false;

var requestFlush;

var index = 0;

var capacity = 1024;

function flush() {
  while (index < queue.length) {
    var currentIndex = index;

    index = index + 1;
    queue[currentIndex].call();

    if (index > capacity) {
      for (
        var scan = 0, newLength = queue.length - index;
        scan < newLength;
        scan++
      ) {
        queue[scan] = queue[scan + index];
      }
      queue.length -= index;
      index = 0;
    }
  }
  queue.length = 0;
  index = 0;
  flushing = false;
}

var scope = typeof global !== "undefined" ? global : self;

var BrowserMutationObserver =
  scope.MutationObserver || scope.WebKitMutationObserver;

if (typeof BrowserMutationObserver === "function") {
  requestFlush = makeRequestCallFromMutationObserver(flush);
} else {
  requestFlush = makeRequestCallFromTimer(flush);
}

asap.requestFlush = requestFlush;

function makeRequestCallFromMutationObserver(callback) {
  var toggle = 1;
  var observer = new BrowserMutationObserver(callback);
  var node = document.createTextNode("");
  observer.observe(node, { characterData: true });
  return function requestCall() {
    toggle = -toggle;
    node.data = toggle;
  };
}

function makeRequestCallFromMessageChannel(callback) {
  var channel = new MessageChannel();
  channel.port1.onmessage = callback;
  return function requestCall() {
    channel.port2.postMessage(0);
  };
}

function makeRequestCallFromTimer(callback) {
  return function requestCall() {
    var timeoutHandle = setTimeout(handleTimer, 0);
    var intervalHandle = setInterval(handleTimer, 50);
    function handleTimer() {
      clearTimeout(timeoutHandle);
      clearInterval(intervalHandle);
      callback();
    }
  };
}

asap.makeRequestCallFromTimer = makeRequestCallFromTimer;
~~~
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
