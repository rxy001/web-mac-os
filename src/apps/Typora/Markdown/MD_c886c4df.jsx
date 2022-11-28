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

const text = `redux 5.0.0

### 1. createStore

~~~js
function createStore(reducer, preloadState, enhancer) {
  if (
    (typeof preloadedState === "function" && typeof enhancer === "function") ||
    (typeof enhancer === "function" && typeof arguments[3] === "function")
  )
    return;

  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== "undefined") {
    if (typeof enhancer !== "function") return;

    return enhancer(createStore)(reducer, preloadedState);
  }

  let currentReducer = reducer;
  let currentState = preloadedState;
  let currentListeners = [];
  let nextListeners = currentListeners;
  let isDispatching = false;

  // 浅拷贝 currentListeners，在 dispatching 中使用临时的 nextListeners。
  // 这可以防止用户在分派过程中调用subscribe/unsubscribe时出现任何bug。
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  // 在每次' dispatch() '调用之前对订阅进行快照。如果您在监听器被调用时订阅或取消订阅，这将不会对当前正在进行	// 的' dispatch() '产生任何影响。但是，下一次' dispatch() '调用， 无论是否嵌套，都将使用订阅列表的最新快 	 // 照。订阅器不应期望看到所有状态更改，因为在调用订阅器之前，往往由于嵌套的 dispatch() 导致 state 发生   	 	 // 多次的改变。但是，可以保证在 \`dispatch()\` 开始之前注册的所有订阅者将在退出时以最新状态调用。
  function subscribe(listener) {
    if (typeof listener !== "function") return;

    if (isDispatching) return;

    let isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) return;

      if (isDispatching) return;

      isSubscribed = false;

      ensureCanMutateNextListeners();
      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }

  function dispatch(action) {
    if (Object.prototype.toString.call(action) !== "[object Object]") return;

    if (typeof action.type === "undefined") return;

    if (isDispatching) return;

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    const listeners = (currentListeners = nextListeners);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }

    return action;
  }

  function getState() {
    if (isDispatching) return;

    return currentState;
  }

  dispatch({ type: ActionTypes.INIT });

  return {
    dispatch,
    subscribe,
    getState,
    // 如果应用需要代码分割或者动态加载些 reducers 或为 Redux 实现热加载机制，可能需要这个api
    // replaceReducer
    // observable 是为了支持 ECMA Observable
    // observable
  };
}
~~~

### 2. combineReducers

简易版：

~~~js
// 合并 reducers，循环遍历 reducers 通过 key 组合新的 store
function combineReducers(reducers) {
  const keys = Object.keys(reducers);
  // 省略了检查 reducer是否为函数， reducer 的 initialState，以及 reducer() 是否返回了默认值的代码。
  return function combination(state = {}, action) {
    let hasChanged = false;
    const nextState = keys.reduce((obj, key) => {
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      hasChanged = hasChanged || previousStateForKey !== nextStateForKey;
      obj[key] = nextStateForKey;
      return obj;
    }, {});
    return hasChanged ? nextState : state;
  };
}
~~~

### 3. compose

~~~js
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}

// 例如compose([fn1, fn2, fn3, fn4]) 返回值相当于是  (...args) => fn1(fn2(fn3(fn4(...args))))
~~~

### 4. applyMiddleware

middleware 是扩展 dispatch，而 enhancer 是扩展 store 。 \`applyMiddleware(...middleware)\`值即为 enhancer

~~~js
// middleware
function applyMiddleware(...middlewares) {
  return (createStore) =>
    (...args) => {
      const store = createStore(...args);
      let dispatch = () => {};

      const middlewareAPI = {
        getState: store.getState,
        dispatch: (...args) => dispatch(...args),
      };

      const chain = middlewares.map((middleware) => middleware(middlewareAPI));

      // 假如 chain = [next1, next2, next3, next4]
      // compose(chain) 结果为 (...args) => next1(next2(next3(next4(...args))))
      // 调用顺序为 next4()、next3()、next2()、next1()
      // 后一个 middleware 作为前一个 middleware 的实参，store.dispatch 为最后一个 middleware 实参
      // dispatch = next1()
      dispatch = compose(...chain)(store.dispatch);

      return {
        ...store,
        dispatch,
      };
    };
}

// 例子
const funcs = [
  (next) => {
    console.log("a");
    return (action) => {
      console.log("will dispatch 1");

      let returnValue = next(action);

      return returnValue;
    };
  },
  (next) => {
    console.log("b");

    return (action) => {
      console.log("will dispatch 2");

      let returnValue = next(action);

      return returnValue;
    };
  },
  (next) => {
    console.log("c");
    return (action) => {
      console.log("will dispatch 3");

      let returnValue = next(action);

      return returnValue;
    };
  },
];

const compose = function (...funcs) {
  return funcs.reduce((a, b) => {
    return (...args) => a(b(...args));
  });
};
// console.log(a)

const dispatch = function () {
  console.log("dispatch");
};

compose(...funcs)(dispatch)();
// c b a
// will dispatch 1
// will dispatch 2
// will dispatch 3
// dispatch
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
