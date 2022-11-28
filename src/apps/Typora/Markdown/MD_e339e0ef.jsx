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

const text = `#### [104. 二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

给定一个二叉树，找出其最大深度。二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

~~~js
var maxDepth = function (root) {
  if (!root) {
    return 0;
  }

  const letfDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);
  return Math.max(letfDepth, rightDepth) + 1;
};
~~~

#### [559. N 叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-n-ary-tree/)

~~~js
var maxDepth = function (root) {
  if (!root) {
    return 0;
  }
  let maxDepthChild = 0;
  for (let index = 0; index < root.children.length; index++) {
    maxDepthChild = Math.max(maxDepth(root.children[index]), maxDepthChild);
  }
  return maxDepthChild + 1;
};
~~~

#### [98. 验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/)

~~~js
var isValidBST = function (root) {
  return isValidBSTImpl(root, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
};

var isValidBSTImpl = function (root, minVal, maxVal) {
  if (root === null) {
    return true;
  }

  if (root.val <= minVal || root.val >= maxVal) {
    return false;
  }
  return (
    isValidBSTImpl(root.left, minVal, root.val) &&
    isValidBSTImpl(root.right, root.val, maxVal)
  );
};
~~~

#### [101. 对称二叉树](https://leetcode.cn/problems/symmetric-tree/)

~~~js
var isSymmetric = function (root) {
  return isSymmetricImpl(root.left, root.right);
};

var isSymmetricImpl = function (left, right) {
  if (left == null && right == null) {
    return true;
  }

  if (!left || !right || left.val !== right.val) {
    return false;
  }

  // 判断二叉树是否是对称，需要从子节点开始比较，两个子节点的值必须相同，并且左子节点的右子节点（如果有）必须等于右子节点的左子节		点，左子节点的左子节点必须等于右子节点的右子节点。
  return (
    isSymmetricImpl(left.left, right.right) &&
    isSymmetricImpl(left.right, right.left)
  );
};
~~~

#### [102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

~~~js
// 输入：root = [3,9,20,null,null,15,7]
// 输出：[[3],[9,20],[15,7]]
var levelOrder = function (root) {
  var arr = [];
  var queue = [root];
  while (queue.length > 0) {
    var index = 0;
    var children = [];
    var values = [];
    while (index < queue.length) {
      const node = queue[index];
      if (node) {
        values.push(queue[index].val);
        children.push(queue[index].left);
        children.push(queue[index].right);
      }
      index++;
    }
    values.length && arr.push(values);
    queue = children;
  }
  return arr;
};
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
