module.exports = function typora({ defaultExpandedKeys, treeData }) {
  return `
  import Tree from "rc-tree";
  import "rc-tree/assets/index.css";
  import React, { Suspense, useState, useCallback } from 'react';
  import "./typora.css"
  import FileIcon from './FileIcon'
  import DirIcon from './DirIcon'
  import SwitcherOpen from "./SwitcherOpen"
  import SwitcherClose from "./SwitcherClose"
  
  const icon = ({isLeaf}) => isLeaf? <FileIcon /> : <DirIcon />

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

    const onSelect = useCallback((_,{node}) => {
      const OtherComponent = React.lazy(() => import(\`./$\{node.componentName}\`));
      setComponent(OtherComponent)
    },[])

    return (
      <div className='typora-wrapper'>
        <Tree
          blockNode
          icon={icon}
          switcherIcon={switcherIcon}
          className='typora-tree'
          defaultExpandedKeys={${defaultExpandedKeys}}
          treeData={${treeData}} 
          onSelect={onSelect} 
        />
        <div className='typora-content'>
          <Suspense>
            {Component && <Component />}
          </Suspense>
        </div>
      </div>);
  }
  
  export default App;
  `
}
