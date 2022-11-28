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

const text = `#### 删除排序数组中的重复项

给你一个 升序排列 的数组 nums ，请你 原地 删除重复出现的元素，使每个元素 只出现一次 ，返回删除后数组的新长度。元素的 相对顺序 应该保持 一致 ，并使用 O(1) 额外空间。

解题思路：
使用两个指针，右指针始终往右移动，

1. 如果右指针指向的值等于左指针指向的值，左指针不动。
2. 如果右指针指向的值不等于左指针指向的值，那么左指针往右移一步，然后再把右指针指向的值赋给左指针。

~~~js
var removeDuplicates = function (nums) {
  let i = 0,
    j = 0;
  for (; j < nums.length; j++) {
    if (nums[i] !== nums[j]) {
      nums[++i] = nums[j];
    }
  }
  return i + 1;
};
~~~

### 买卖股票的最佳时机 II

给你一个整数数组 prices ，其中 prices[i] 表示某支股票第 i 天的价格。在每一天，你可以决定是否购买和/或出售股票。你在任何时候 最多 只能持有 一股 股票。你也可以先购买，然后在 同一天 出售。返回 你能获得的 最大 利润 。

解题思路：

1. 找到股票下降的那天，计算前面的利润。
2. 当最后一天时，\`i < j -1\` 说明股票还在上涨。

~~~js
var maxProfit = function (prices) {
  let i = 0,
    j = 0,
    n = 0,
    profit = 0;

  while (j < prices.length) {
    n = j + 1;
    if (prices[j] > prices[n]) {
      profit += prices[j] - prices[i];
      i = n;
    }
    j++;
  }

  if (i < j - 1) {
    profit += prices[j - 1] - prices[i];
  }

  return profit;
};
~~~

1. 当股票下降时，一直往下找，直到上涨为止。
2. 当股票上涨时，一直往下找，直到下涨为止。
3. 计算这段时间的利润。

~~~js
var maxProfit = function (prices) {
  let i = 0,
    p = 0,
    l = prices.length;
  while (i < l) {
    let v = 0;
    while (i < l - 1 && prices[i] >= prices[i + 1]) i++;
    v = prices[i];
    while (i < l - 1 && prices[i] <= prices[i + 1]) i++;
    p += prices[i++] - v;
  }
  return p;
};
~~~

#### 旋转数组

给你一个数组，将数组中的元素向右轮转 \`k\` 个位置，其中 \`k\` 是非负数。

解题思路：

每个元素向右移动 k 个位置，实际上最后 k 个元素整体移动到开头就行。

~~~js
var rotate = function (nums, k) {
  const i = k % nums.length;
  nums.unshift(...nums.splice(nums.length - i, i));
  return nums;
};
~~~

使用临时数组，遍历原数组，每个元素以 \`(i + k) % nums.length\` 的位置添加到临时数组中。

~~~js
// leetcode 好蠢，结果不一致。
var rotate = function (nums, k) {
  let i = 0,
    array = [];
  while (i < nums.length) {
    const j = (i + k) % nums.length;
    array[j] = nums[i++];
  }
  return array;
};
~~~

#### 存在重复元素

给你一个整数数组 \`nums\` 。如果任一值在数组中出现 **至少两次** ，返回 \`true\` ；如果数组中每个元素互不相同，返回 \`false\` 。

解题思路：

Set 不能有重复的值。

~~~js
var containsDuplicate = function (nums) {
  const set = new Set();
  let i = 0;
  while (i < nums.length) {
    if (!set.has(nums[i])) {
      set.add(nums[i++]);
    } else {
      return true;
    }
  }
  return false;
};
~~~

两次循环或者先排序在循环判断相邻元素的值。

#### 只出现一次的数字

给定一个**非空**整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。你的算法应该具有线性时间复杂度。 你可以不使用额外空间来实现吗？

解题思路：

额外空间：使用 Set

不使用额外空间：位运算符 ^ , \`^\` 如果对应两个操作位有且仅有一个 1 时结果为 1，其他都是 0。

~~~js
var singleNumber = function (nums) {
  let i = 0;
  let n = 0;
  while (i < nums.length) {
    n ^= nums[i++];
  }
  return n;
};
~~~

#### 两个数组的交集 II

给你两个整数数组 nums1 和 nums2 ，请你以数组形式返回两数组的交集。返回结果中每个元素出现的次数，应与元素在两个数组中都出现的次数一致（如果出现次数不一致，则考虑取较小值）。可以不考虑输出结果的顺序。

解题思路：

1. 遍历 nums1 中的所有元素，把它存放到 map 中，其中 key 就是 nums1 中的元素，value 就是这个元素在数组 nums1 中出现的次数。
2. 遍历 nums2 中的所有元素，查看 map 中是否包含 nums2 的元素，如果包含，就把当前值加入到集合 list 中，然后对应的 value 要减 1。

~~~js
var intersect = function (nums1, nums2) {
  const map = new Map();
  nums1.forEach((n) => {
    map.set(n, (map.get(n) ?? 0) + 1);
  });
  const array = [];
  nums2.forEach((n) => {
    if (map.has(n)) {
      array.push(n);
      const t = map.get(n);
      if (t > 1) {
        map.set(n, t - 1);
      } else {
        map.delete(n);
      }
    }
  });
  return array;
};
~~~

先对两个数组进行排序，然后使用两个指针，分别指向两个数组开始的位置。

1. 如果两个指针指向的值相同，说明这个值是他们的交集，就把这个值加入到集合 list 中，然后两个指针在分别往后移一步。
2. 如果两个指针指向的值不同，那么指向的值相对小的往后移一步，相对大的先不动，然后再比较。

~~~js
var intersect = function (nums1, nums2) {
  const sort = (arr) => arr.sort((a, b) => a - b);
  sort(nums1);
  sort(nums2);
  let i = 0,
    j = 0,
    array = [];
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] === nums2[j]) {
      array.push(nums1[i]);
      i++;
      j++;
    } else if (nums1[i] < nums2[j]) {
      i++;
    } else {
      j++;
    }
  }
  return array;
};
~~~

#### 加一

给定一个由 整数 组成的 非空 数组所表示的非负整数，在该数的基础上加一。最高位数字存放在数组的首位， 数组中每个元素只存储单个数字。你可以假设除了整数 0 之外，这个整数不会以零开头。

解题思路：

倒叙遍历数组

1. 如果数组的元素只要有一个不是 9，加 1 之后直接返回即可。
2. 如果数组中的所有元素都是 9，数组长度增加 1 位。

~~~js
var plusOne = function (digits) {
  let i = 0;
  while (i < digits.length) {
    let j = digits.length - 1 - i;
    if (digits[j] != 9) {
      digits[j]++;
      return digits;
    } else {
      digits[j] = 0;
    }
    i++;
  }
  return [1, ...new Array(digits.length).fill(0)];
};
~~~

#### 移动零

给定一个数组 \`nums\`，编写一个函数将所有 \`0\` 移动到数组的末尾，同时保持非零元素的相对顺序。**请注意** ，必须在不复制数组的情况下原地对数组进行操作。

解题思路：

把非 0 的往前移动，j 表示第一个 0 的位置。当循环结束后，j 之后的都是 0。

~~~js
var moveZeroes = function (nums) {
  let i = 0,
    j = 0;
  while (i < nums.length) {
    if (nums[i] != 0) {
      nums[j++] = nums[i];
    }
    i++;
  }
  while (j < nums.length) {
    nums[j++] = 0;
  }
  return nums;
};
~~~

#### 两数之和

给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target 的那 两个 整数，并返回它们的数组下标。你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

解题思路：

使用 map，key 为数字，value 为索引。

~~~js
var twoSum = function (nums, target) {
  const map = new Map();
  let i = 0;
  while (i < nums.length) {
    const n = nums[i];
    const j = map.get(target - n);
    if (j !== undefined) {
      return [j, i];
    }
    map.set(n, i++);
  }
};
~~~

#### 二分查找

~~~js
var binarySearch = function (nums, target) {
  let left = 0,
    right = nums.length - 1;

  while (left <= right) {
    let middle = Math.floor((left + right) / 2);
    if (target < nums[middle]) {
      right = middle - 1;
    } else if (target > nums[middle]) {
      left = middle + 1;
    } else if (nums[middle] === target) {
      return middle;
    }
  }

  return -1;
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
