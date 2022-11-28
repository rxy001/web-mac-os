import Tree from "rc-tree"
import "rc-tree/assets/index.css"
import React, { Suspense, useState, useCallback } from "react"
import "./typora.css"
import FileIcon from "./FileIcon"
import DirIcon from "./DirIcon"
import SwitcherOpen from "./SwitcherOpen"
import SwitcherClose from "./SwitcherClose"

const icon = ({ isLeaf }) => (isLeaf ? <FileIcon /> : <DirIcon />)

const switcherIcon = (p) => {
  if (!p.isLeaf) {
    if (p.expanded) {
      return <SwitcherOpen />
    }
    return <SwitcherClose />
  }
}

function App() {
  const [Component, setComponent] = useState()

  const onSelect = useCallback((_, { node }) => {
    const OtherComponent = React.lazy(() => import(`./${node.componentName}`))
    setComponent(OtherComponent)
  }, [])

  return (
    <div className="typora-wrapper">
      <Tree
        blockNode
        icon={icon}
        switcherIcon={switcherIcon}
        className="typora-tree"
        defaultExpandedKeys={["notes"]}
        treeData={[
          {
            title: "notes",
            key: "notes",
            style: { fontSize: 14 },
            isLeaf: false,
            selectable: false,
            children: [
              {
                title: "browser",
                key: "browser",
                style: { fontSize: 14 },
                isLeaf: false,
                selectable: false,
                children: [
                  {
                    title: "Event Loop.md",
                    key: "Event Loop.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_47b60bef",
                  },
                  {
                    title: "HTTP HTTPS WebSocket.md",
                    key: "HTTP HTTPS WebSocket.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_998cdfb2",
                  },
                  {
                    title: "垃圾回收.md",
                    key: "垃圾回收.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_564b62c0",
                  },
                  {
                    title: "强缓存 协商缓存.md",
                    key: "强缓存 协商缓存.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_956c80e8",
                  },
                ],
              },
              {
                title: "css",
                key: "css",
                style: { fontSize: 14 },
                isLeaf: false,
                selectable: false,
                children: [
                  {
                    title: "BFC.md",
                    key: "BFC.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_dede880d",
                  },
                  {
                    title: "CSS选择器.md",
                    key: "CSS选择器.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_ba0d214e",
                  },
                  {
                    title: "Float.md",
                    key: "Float.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_fbd40276",
                  },
                  {
                    title: "盒模型.md",
                    key: "盒模型.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_1e0175e5",
                  },
                ],
              },
              {
                title: "git",
                key: "git",
                style: { fontSize: 14 },
                isLeaf: false,
                selectable: false,
                children: [
                  {
                    title: "merge rebase.md",
                    key: "merge rebase.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_b1fb46ce",
                  },
                  {
                    title: "revert reset.md",
                    key: "revert reset.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_dcc9f482",
                  },
                ],
              },
              {
                title: "js",
                key: "js",
                style: { fontSize: 14 },
                isLeaf: false,
                selectable: false,
                children: [
                  {
                    title: "PromiseA+ 实现.md",
                    key: "PromiseA+ 实现.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_d4271f79",
                  },
                  {
                    title: "PromiseA+ 规范.md",
                    key: "PromiseA+ 规范.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_dd060779",
                  },
                  {
                    title: "执行上下文.md",
                    key: "执行上下文.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_54bf6dad",
                  },
                  {
                    title: "浅拷贝 深拷贝.md",
                    key: "浅拷贝 深拷贝.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_f7c66ce1",
                  },
                  {
                    title: "类型转换.md",
                    key: "类型转换.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_e1c72523",
                  },
                  {
                    title: "超小编译器.md",
                    key: "超小编译器.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_3100aeb8",
                  },
                  {
                    title: "防抖 节流.md",
                    key: "防抖 节流.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_0baef051",
                  },
                ],
              },
              {
                title: "react",
                key: "react",
                style: { fontSize: 14 },
                isLeaf: false,
                selectable: false,
                children: [
                  {
                    title: "batchedUpdates.md",
                    key: "batchedUpdates.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_e3b0c442",
                  },
                  {
                    title: "fiber.md",
                    key: "fiber.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_e77ddf3f",
                  },
                  {
                    title: "question.md",
                    key: "question.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_e2f79fce",
                  },
                  {
                    title: "redux源码.md",
                    key: "redux源码.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_ddd9f39d",
                  },
                ],
              },
              {
                title: "tools",
                key: "tools",
                style: { fontSize: 14 },
                isLeaf: false,
                selectable: false,
                children: [
                  {
                    title: "Iterm 快捷键.md",
                    key: "Iterm 快捷键.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_2bc9adad",
                  },
                  {
                    title: "eslintrc.md",
                    key: "eslintrc.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_6ea15e8a",
                  },
                  {
                    title: "npm.md",
                    key: "npm.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_fb4ecd00",
                  },
                  {
                    title: "vscode-keyboard-shortcuts.md",
                    key: "vscode-keyboard-shortcuts.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_aaa0b1dc",
                  },
                ],
              },
              {
                title: "typescript",
                key: "typescript",
                style: { fontSize: 14 },
                isLeaf: false,
                selectable: false,
                children: [
                  {
                    title: "基础类型.md",
                    key: "基础类型.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_35cff87d",
                  },
                ],
              },
              {
                title: "webpack",
                key: "webpack",
                style: { fontSize: 14 },
                isLeaf: false,
                selectable: false,
                children: [
                  {
                    title: "chunk vs bundle.md",
                    key: "chunk vs bundle.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_0924a79d",
                  },
                  {
                    title: "config.md",
                    key: "config.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_cfb3a360",
                  },
                  {
                    title: "import required原理.md",
                    key: "import required原理.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_5ac8db4e",
                  },
                  {
                    title: "plugin loader.md",
                    key: "plugin loader.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_53b42415",
                  },
                  {
                    title: "wepback使用问题.md",
                    key: "wepback使用问题.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_e944a224",
                  },
                  {
                    title: "动态加载.md",
                    key: "动态加载.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_6217e999",
                  },
                ],
              },
              {
                title: "算法",
                key: "算法",
                style: { fontSize: 14 },
                isLeaf: false,
                selectable: false,
                children: [
                  {
                    title: "排序.md",
                    key: "排序.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_a0cc6dbb",
                  },
                  {
                    title: "数组.md",
                    key: "数组.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_3dfdc2d8",
                  },
                  {
                    title: "树.md",
                    key: "树.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_c9e441c7",
                  },
                ],
              },
              {
                title: "编程",
                key: "编程",
                style: { fontSize: 14 },
                isLeaf: false,
                selectable: false,
                children: [
                  {
                    title: "并发、并行.md",
                    key: "并发、并行.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_2b9143ed",
                  },
                  {
                    title: "设计模式",
                    key: "设计模式",
                    style: { fontSize: 14 },
                    isLeaf: false,
                    selectable: false,
                    children: [
                      {
                        title: "创建型模式",
                        key: "创建型模式",
                        style: { fontSize: 14 },
                        isLeaf: false,
                        selectable: false,
                        children: [
                          {
                            title: "单例模式.md",
                            key: "单例模式.md",
                            style: { fontSize: 14 },
                            isLeaf: true,
                            componentName: "MD_cc709002",
                          },
                          {
                            title: "工厂模式.md",
                            key: "工厂模式.md",
                            style: { fontSize: 14 },
                            isLeaf: true,
                            componentName: "MD_93c7ce3d",
                          },
                        ],
                      },
                      {
                        title: "简介.md",
                        key: "简介.md",
                        style: { fontSize: 14 },
                        isLeaf: true,
                        componentName: "MD_e76926d0",
                      },
                      {
                        title: "结构型模式",
                        key: "结构型模式",
                        style: { fontSize: 14 },
                        isLeaf: false,
                        selectable: false,
                        children: [
                          {
                            title: "代理模式.md",
                            key: "代理模式.md",
                            style: { fontSize: 14 },
                            isLeaf: true,
                            componentName: "MD_d4786b02",
                          },
                          {
                            title: "外观模式.md",
                            key: "外观模式.md",
                            style: { fontSize: 14 },
                            isLeaf: true,
                            componentName: "MD_40df6074",
                          },
                          {
                            title: "适配器模式.md",
                            key: "适配器模式.md",
                            style: { fontSize: 14 },
                            isLeaf: true,
                            componentName: "MD_213c7eeb",
                          },
                        ],
                      },
                      {
                        title: "行为型模式",
                        key: "行为型模式",
                        style: { fontSize: 14 },
                        isLeaf: false,
                        selectable: false,
                        children: [
                          {
                            title: "观察者模式.md",
                            key: "观察者模式.md",
                            style: { fontSize: 14 },
                            isLeaf: true,
                            componentName: "MD_52990366",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                title: "面试",
                key: "面试",
                style: { fontSize: 14 },
                isLeaf: false,
                selectable: false,
                children: [
                  {
                    title: "函数式组件、类组件.md",
                    key: "函数式组件、类组件.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_9c8620b1",
                  },
                  {
                    title: "常见面试题.md",
                    key: "常见面试题.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_c296e49a",
                  },
                  {
                    title: "性能优化.md",
                    key: "性能优化.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_d2975528",
                  },
                ],
              },
            ],
          },
        ]}
        onSelect={onSelect}
      />
      <div className="typora-content">
        <Suspense>{Component && <Component />}</Suspense>
      </div>
    </div>
  )
}

export default App
