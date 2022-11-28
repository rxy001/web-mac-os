const { PREFIX } = require("../constants")

module.exports = function css() {
  return `.${PREFIX}-tree{
    width: 270px;
    overflow: auto;
  }
  
  .${PREFIX}-wrapper {
    display:flex; 
    width: 100%; 
    height: 100%;
    line-height: 1.8em;
  }
  
  .${PREFIX}-content {
    flex: 1; 
    padding: 10px;
    overflow: auto; 
    font-size: 16px;
  }

  .${PREFIX}-img {
    width: 100%;
  }

  .${PREFIX}-table {
    border-collapse: collapse;
    width: 100%;
  }
  
  .${PREFIX}-td {
    border: 1px solid black;
    padding: 10px;
  }
  
  .${PREFIX}-th {
    border: 1px solid black;
    padding: 10px;
  }
  .${PREFIX}-code {
    font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
    line-height: 22px;
  }
  .${PREFIX}-li {
    margin-top: .25em
  }
  
  .${PREFIX}-img {
    width: 100%;
  }

  .${PREFIX}-icon{
    width: 14px;
    height: 14px;
    fill: var(--app-font-color)
  }
  
  .typora-tree .rc-tree-node-selected{
    background-color: #91919185;
    box-shadow: 0 0 0 1px #91919185;
  }
  
  .typora-tree .rc-tree-switcher{
    background-image: none !important;
  }

  .typora-tree .rc-tree-treenode {
    line-height: 30px;
  }

  .typora-tree .rc-tree-node-content-wrapper{
    height: 30px !important;
  }
  
  .${PREFIX}-switcher-icon{
    width: 14px;
    height: 14px;
    fill: var(--app-font-color);
  }

  `
}
