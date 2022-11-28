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

const text = `#### 排序算法时间复杂度和空间复杂度

| **排序算法** | **平均时间复杂度** | **最坏时间复杂度** | **最好时间复杂度** | **空间复杂度** | **稳定性** |
| ------------ | ------------------ | ------------------ | ------------------ | -------------- | ---------- |
| **冒泡排序** | O(n²)              | O(n²)              | O(n)               | O(1)           | 稳定       |
| **选择排序** | O(n²)              | O(n²)              | O(n)               | O(1)           | 不稳定     |
| **插入排序** | O(n²)              | O(n²)              | O(n)               | O(1)           | 稳定       |
| **快速排序** | O(nlogn)           | O(n²)              | O(nlogn)           | O(nlogn)       | 不稳定     |
| **堆排序**   | O(nlogn)           | O(nlogn)           | O(nlogn)           | O(1)           | 不稳定     |
| **希尔排序** | O(nlogn)           | O(ns)              | O(n)               | O(1)           | 不稳定     |
| **归并排序** | O(nlogn)           | O(nlogn)           | O(nlogn)           | O(n)           | 稳定       |
| **计数排序** | O(n+k)             | O(n+k)             | O(n+k)             | O(k)           | 稳定       |
| **桶排序**   | O(n+k)             | O(n²)              | O(n+k)             | O(n+k)         | 稳定       |
| **基数排序** | O(N*M)             | O(N*M)             | O(N*M)             | O(M)           | 稳定       |

#### 冒泡排序

步骤：

1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。
2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。这步做完后，最后的元素会是最大的数。
3. 针对所有的元素重复以上的步骤，除了最后一个。
4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。

~~~js
function bubbleSort(array) {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - 1 - i; j++) {
      if (array[j] > array[j + 1]) {
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
  }
  return array;
}
~~~



#### 选择排序

步骤：

1. 首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置。
2. 再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。
3. 重复第二步，直到所有元素均排序完毕。

~~~js
function selectitonSort(array) {
  let minIndex = 0,
    length = array.length,
    temp = null;
  for (let i = 0; i < length; i++) {
    minIndex = i;
    for (let j = i + 1; j < length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex != i) {
      temp = array[minIndex];
      array[minIndex] = array[i];
      array[i] = temp;
    }
  }
  return array;
}
~~~

#### 插入排序

步骤：

1. 将第一待排序序列第一个元素看做一个有序序列，把第二个元素到最后一个元素当成是未排序序列。
2. 从头到尾依次扫描未排序序列，将扫描到的每个元素插入有序序列的适当位置。
3. 如果待插入的元素与有序序列中的某个元素相等，则将待插入元素插入到相等元素的后面。

~~~js
function insertionSort(a) {
  for (let i = 1; i < a.length; i++) {
    const c = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > c) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = c;
  }
  return a;
}
~~~

#### 希尔排序

希尔排序是基于插入排序的以下两点性质而提出改进方法的：

- 插入排序在对几乎已经排好序的数据操作时，效率高，即可以达到线性排序的效率。
- 但插入排序一般来说是低效的，因为插入排序每次只能将数据移动一位。

也就是说希尔排序，开始时元素每次插入时移动的步长不为1，以一定的步长（3、5、9等）进行排序。然后会继续以一定步长进行排序，最终算法以步长为1进行排序。当步长为1时，算法变为普通插入排序，这就保证了数据一定会被排序。

~~~js
function shellSort(arr) {
  for (let gap = arr.length >> 1; gap > 0; gap >>= 1) {
    for (let i = gap; i < arr.length; i++) {
      let temp = arr[i],
        j;
      for (j = i - gap; j >= 0 && arr[j] > temp; j -= gap) {
        arr[j + gap] = arr[j];
      }
      arr[j + gap] = temp;
    }
  }
  return arr;
}
~~~

#### 归并排序

归并排序（Merge sort）是建立在归并操作上的一种有效的排序算法。该算法是采用分治法的一个非常典型的应用。

采用递归将数组分成两个子数组，直至子数组长度为1，将两个子数组排序后在合并一起。

步骤：

1. 申请空间，使其大小为两个已经排序序列之和，该空间用来存放合并后的序列；
2. 设定两个指针，最初位置分别为两个已经排序序列的起始位置；
3. 比较两个指针所指向的元素，选择相对小的元素放入到合并空间，并移动指针到下一位置；
4. 重复步骤 3 直到某一指针达到序列尾；
5. 将另一序列剩下的所有元素直接复制到合并序列尾。

~~~js
function mergeSort(arr) {
  const len = arr.length;
  if (len < 2) {
    return arr;
  }

  let middle = Math.floor(len / 2);
  let left = arr.slice(0, middle);
  let right = arr.slice(middle);
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let i = 0,
    j = 0,
    arr = [];

  while (i < left.length || j < right.length) {
    if (left[i] < right[j] || right[j] === undefined) {
      arr[arr.length] = left[i];
      i++;
    } else {
      arr[arr.length] = right[j];
      j++;
    }
  }
  return arr;
}
~~~

#### 快速排序

快速排序使用分治法策略来把一个序列分为较小和较大的2个子序列，然后递归地排序两个子序列。

步骤

1. 从数列中挑出一个元素，称为 "基准"（pivot）;
2. 重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区退出之后，该基准就处于数列的中间位置。这个称为分区（partition）操作；
3. 递归地（recursive）把小于基准值元素的子数列和大于基准值元素的子数列排序；

~~~js
// 简单版本的缺点是，需要O(n)的额外存储空间。
function quicksort(array) {
  if (array.length <= 1) {
    return array;
  }

  const pivot = array[0],
    left = [],
    right = [];

  for (let i = 1; i < array.length; i++) {
    array[i] < pivot ? left.push(array[i]) : right.push(array[i]);
  }

  return quicksort(left).concat(pivot, quicksort(right));
}

// 原地分割需要O(log n)的额外存储空间。
function quickSort(arr, left, right) {
  if (left < right) {
    const partitionIndex = partition(arr, left, right);
    quickSort(arr, left, partitionIndex - 1);
    quickSort(arr, partitionIndex + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  let pivot = left,
     // j表示的是值比pivot大的索引。
    j = pivot + 1;
  for (let i = j; i <= right; i++) {
    if (arr[i] < arr[pivot]) {
      swap(arr, i, j);
      j++;
    }
  }
  swap(arr, pivot, j - 1);
  return j - 1;
}

function swap(arr, i, j) {
  var temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

~~~

#### 计数排序

计数排序使用一个额外的数组C，其中第i个元素是待排序数组A中值等于i的元素个数，然后根据数组C来将A中的元素排到正确的位置。由于用来计数的数组C的长度取决于待排序数组中数据的范围（等于待排序数组的最大值与最小值的差加上1），这使得计数排序对于数据范围很大的数组，需要大量时间和内存。

 算法的步骤如下：

1. 找出待排序的数组中最大和最小的元素
2. 统计数组中每个值为i的元素出现的次数，存入数组C的第i项
3. 对所有的计数累加（从C中的第一个元素开始，每一项和前一项相加）
4. 反向填充目标数组：将每个元素i放在新数组的第C(i)项，每放一个元素就将C(i)减去1

~~~js
function countingSort(arr, maxValue) {
  let bucket = new Array(maxValue + 1),
    sortedIndex = 0,
    arrLen = arr.length,
    bucketLen = maxValue + 1;

  for (let i = 0; i < arrLen; i++) {
    if (!bucket[arr[i]]) {
      bucket[arr[i]] = 0;
    }
    bucket[arr[i]]++;
  }

  for (let j = 0; j < bucketLen; j++) {
    if (bucket[j]) {
      while (bucket[j] > 0) {
        arr[sortedIndex++] = j;
        bucket[j]--;
      }
    }
  }

  return arr;
}

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
