// @ts-nocheck
/* eslint-disable */
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
                    componentName: "MD_b2057c1b",
                  },
                  {
                    title: "HTTP HTTPS WebSocket.md",
                    key: "HTTP HTTPS WebSocket.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_ab4a1526",
                  },
                  {
                    title: "垃圾回收.md",
                    key: "垃圾回收.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_27e31d58",
                  },
                  {
                    title: "强缓存 协商缓存.md",
                    key: "强缓存 协商缓存.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_b1b9330d",
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
                    componentName: "MD_1f7d8deb",
                  },
                  {
                    title: "CSS选择器.md",
                    key: "CSS选择器.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_3e58a542",
                  },
                  {
                    title: "Float.md",
                    key: "Float.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_6ba89929",
                  },
                  {
                    title: "盒模型.md",
                    key: "盒模型.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_5f481a1b",
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
                    componentName: "MD_559a21f6",
                  },
                  {
                    title: "revert reset.md",
                    key: "revert reset.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_04d5b24a",
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
                    componentName: "MD_c937e8e8",
                  },
                  {
                    title: "PromiseA+ 规范.md",
                    key: "PromiseA+ 规范.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_5a7611d6",
                  },
                  {
                    title: "执行上下文.md",
                    key: "执行上下文.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_16c01042",
                  },
                  {
                    title: "浅拷贝 深拷贝.md",
                    key: "浅拷贝 深拷贝.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_f56d09b8",
                  },
                  {
                    title: "类型转换.md",
                    key: "类型转换.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_076e6123",
                  },
                  {
                    title: "超小编译器.md",
                    key: "超小编译器.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_577a43c5",
                  },
                  {
                    title: "防抖 节流.md",
                    key: "防抖 节流.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_5fc896bc",
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
                    componentName: "MD_a606efa3",
                  },
                  {
                    title: "question.md",
                    key: "question.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_17273f33",
                  },
                  {
                    title: "redux源码.md",
                    key: "redux源码.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_c886c4df",
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
                    componentName: "MD_5b095010",
                  },
                  {
                    title: "eslintrc.md",
                    key: "eslintrc.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_b966dc55",
                  },
                  {
                    title: "npm.md",
                    key: "npm.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_de96d2e9",
                  },
                  {
                    title: "vscode-keyboard-shortcuts.md",
                    key: "vscode-keyboard-shortcuts.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_52922922",
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
                    componentName: "MD_c60641a2",
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
                    componentName: "MD_dbc928b1",
                  },
                  {
                    title: "config.md",
                    key: "config.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_26b09a0b",
                  },
                  {
                    title: "import required原理.md",
                    key: "import required原理.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_c087483a",
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
                    componentName: "MD_d065dec6",
                  },
                  {
                    title: "动态加载.md",
                    key: "动态加载.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_bc9f91e2",
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
                    componentName: "MD_efbd5346",
                  },
                  {
                    title: "数组.md",
                    key: "数组.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_fa360429",
                  },
                  {
                    title: "树.md",
                    key: "树.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_e339e0ef",
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
                    componentName: "MD_80f7a68b",
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
                            componentName: "MD_ac315924",
                          },
                          {
                            title: "工厂模式.md",
                            key: "工厂模式.md",
                            style: { fontSize: 14 },
                            isLeaf: true,
                            componentName: "MD_449f9582",
                          },
                        ],
                      },
                      {
                        title: "简介.md",
                        key: "简介.md",
                        style: { fontSize: 14 },
                        isLeaf: true,
                        componentName: "MD_b61d6382",
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
                            componentName: "MD_d6e41d57",
                          },
                          {
                            title: "外观模式.md",
                            key: "外观模式.md",
                            style: { fontSize: 14 },
                            isLeaf: true,
                            componentName: "MD_4bece48a",
                          },
                          {
                            title: "适配器模式.md",
                            key: "适配器模式.md",
                            style: { fontSize: 14 },
                            isLeaf: true,
                            componentName: "MD_8b9417ac",
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
                    componentName: "MD_29303baa",
                  },
                  {
                    title: "常见面试题.md",
                    key: "常见面试题.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_36b47698",
                  },
                  {
                    title: "性能优化.md",
                    key: "性能优化.md",
                    style: { fontSize: 14 },
                    isLeaf: true,
                    componentName: "MD_e2f64695",
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
