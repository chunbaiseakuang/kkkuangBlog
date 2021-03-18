---
title: npm install 原理
date: 2021-03-11 9:35:35
permalink: /pages/npm install 原理
author: kcy
---

# npm install 原理
## 嵌套结构
* 我们都知道，执行 npm install 后，依赖包被安装到了 node_modules ，下面我们来具体了解下，npm 将依赖包安装到 node_modules 的具体机制是什么?
* 早期版本：以递归的形式，严格按照 package.json 结构以及子依赖包的 package.json 结构将依赖安装到他们各自的 node_modules 中。直到有子依赖包不在依赖其他模块
* 举个例子，我们的模块 my-app 现在依赖了两个模块：buffer、ignore
```javascript
{
  "name": "my-app",
  "dependencies": {
    "buffer": "^5.4.3",
    "ignore": "^5.1.4",
  }
}
```
* ignore是一个纯 JS 模块，不依赖任何其他模块，而 buffer 又依赖了下面两个模块：base64-js 、 ieee754
```javascript
{
  "name": "buffer",
  "dependencies": {
    "base64-js": "^1.0.2",
    "ieee754": "^1.1.4"
  }
}
```
* 那么，执行 npm install 后，得到的 node_modules 中模块目录结构就是下面这样的：
<img :src="$withBase('/img/npm1.png')" alt="嵌套结构">

* 如果你依赖的模块非常之多，你的 node_modules 将非常庞大，嵌套层级非常之深。在不同层级的依赖中，可能引用了同一个模块，导致大量冗余；在 Windows 系统中，文件路径最大长度为260个字符，嵌套层级过深可能导致不可预知的问题

## 扁平结构
* 安装模块时，不管其是直接依赖还是子依赖的依赖，优先将其安装在 node_modules 根目录
<img :src="$withBase('/img/npm2.png')" alt="扁平结构">

* 此时我们若在模块中又依赖了 base64-js@1.0.1 版本,注意这里package.json没有^，表示一定要1.0.1才符合
* 当安装到相同模块时，判断已安装的模块版本是否符合新模块的版本范围，如果符合则跳过，不符合则在当前模块的 node_modules 下安装该模块（不符合，按嵌套结构排下去）。
```javascript
{
  "name": "my-app",
  "dependencies": {
    "buffer": "^5.4.3",
    "ignore": "^5.1.4",
    "base64-js": "1.0.1",
  }
}
```
<img :src="$withBase('/img/npm3.png')" alt="不符合，按嵌套结构排下去">

* 对应的，如果我们在项目代码中引用了一个模块，模块查找流程也是先 在当前模块路径下搜索=>在当前模块 node_modules 路径下搜素 =>在上级模块的 node_modules 路径下搜索 => 直到搜索到全局路径中的 node_modules
* 试想一下，你的APP假设没有依赖 base64-js@1.0.1 版本，而你同时依赖了依赖不同 base64-js 版本的 buffer 和 buffer2。由于在执行 npm install 的时候，按照 package.json 里依赖的顺序<strong>依次</strong>解析，则 buffer 和 buffer2 在  package.json 的放置顺序则决定了 node_modules 的依赖结构(就是说谁先放在根目录下面的node modules)

## Lock文件
* 为了解决 npm install 的不确定性问题，在 npm 5.x 版本新增了 package-lock.json 文件，而安装方式还沿用了 npm 3.x 的扁平化的方式。package-lock.json 的作用是锁定依赖结构，即只要你目录下有 package-lock.json 文件，那么你每次执行 npm install 后生成的 node_modules 目录结构一定是完全相同的。
```javascript
{
  "name": "my-app",
  "dependencies": {
    "buffer": "^5.4.3",
    "ignore": "^5.1.4",
    "base64-js": "1.0.1",
  }
}

// 在执行 npm install 后生成的 package-lock.json 如下：
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "base64-js": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/base64-js/-/base64-js-1.0.1.tgz",
      "integrity": "sha1-aSbRsZT7xze47tUTdW3i/Np+pAg="
    },
    "buffer": {
      "version": "5.4.3",
      "resolved": "https://registry.npmjs.org/buffer/-/buffer-5.4.3.tgz",
      "integrity": "sha512-zvj65TkFeIt3i6aj5bIvJDzjjQQGs4o/sNoezg1F1kYap9Nu2jcUdpwzRSJTHMMzG0H7bZkn4rNQpImhuxWX2A==",
      "requires": {
        "base64-js": "^1.0.2",
        "ieee754": "^1.1.4"
      },
      "dependencies": {
        "base64-js": {
          "version": "1.3.1",
          "resolved": "https://registry.npmjs.org/base64-js/-/base64-js-1.3.1.tgz",
          "integrity": "sha512-mLQ4i2QO1ytvGWFWmcngKO//JXAQueZvwEKtjgQFM4jIK0kU+ytMfplL8j+n5mspOfjHwoAg+9yhb7BwAHm36g=="
        }
      }
    },
    "ieee754": {
      "version": "1.1.13",
      "resolved": "https://registry.npmjs.org/ieee754/-/ieee754-1.1.13.tgz",
      "integrity": "sha512-4vf7I2LYV/HaWerSo3XmlMkp5eZ83i+/CDluXi/IGTs/O1sejBNhTtnxzmRZfvOUqj7lZjqHkeTvpgSFDlWZTg=="
    },
    "ignore": {
      "version": "5.1.4",
      "resolved": "https://registry.npmjs.org/ignore/-/ignore-5.1.4.tgz",
      "integrity": "sha512-MzbUSahkTW1u7JpKKjY7LCARd1fU5W2rLdxlM4kdkayuCwZImjkpluF9CM1aLewYJguPDqewLam18Y6AU69A8A=="
    }
  }
}
```
* package-lock.json属性介绍：
<img :src="$withBase('/img/npm4.png')" alt="lock属性介绍">

* requires：对应子依赖的依赖，与子依赖的 package.json 中 dependencies的依赖项相同。
* dependencies：结构和外层的 dependencies 结构相同，存储安装在子依赖 node_modules 中的依赖包。
* 这里注意，并不是所有的子依赖都有 dependencies 属性，只有子依赖的依赖和当前已安装在根目录的  node_modules 中的依赖冲突之后，才会有这个属性
* resolved：包具体的安装来源
* integrity：包 hash 值，基于 Subresource Integrity 来验证已安装的软件包是否被改动过、是否已失效

<img :src="$withBase('/img/npm5.png')" alt="目前的依赖结构">

* 我们在 my-app 中依赖的 base64-js@1.0.1 版本与 buffer 中依赖的 base64-js@^1.0.2 发生冲突，所以  base64-js@1.0.1  需要安装在 buffer 包的 node_modules 中，对应了 package-lock.json 中 buffer 的 dependencies 属性。这也对应了 npm 对依赖的扁平化处理方式。所以，根据上面的分析， package-lock.json 文件 和 node_modules 目录结构是一一对应的，即项目目录下存在  package-lock.json 可以让每次安装生成的依赖目录结构保持相同。
* 项目中使用了 package-lock.json 可以显著加速依赖安装时间，package-lock.json 中已经缓存了每个包的具体版本和下载链接，不需要再去远程仓库进行查询，然后直接进入文件完整性校验环节，减少了大量网络请求;锁定安装时的包版本号，以保证其他人在install时候，大家的依赖版本相同,一般为了稳定性考虑我们不能随意升级依赖包，因为如果换包导致兼容性bug出现很难排查，所以package-lock.json就是来解决包锁定不升级问题的

## 缓存 
* 在执行 npm install 或 npm update命令下载依赖后，除了将依赖包安装在node_modules 目录下外，还会在本地的缓存目录缓存一份。通过 npm config get cache 命令可以查询到：在 Linux 或 Mac 默认是用户主目录下的 .npm/_cacache 目录(C:\Users\kuangchaoyu\AppData\Roaming\npm-cache\_cacache)。
* 在这个目录下又存在两个目录：content-v2、index-v5，content-v2 目录用于存储 tar包的缓存，而index-v5目录用于存储tar包的 hash。
* npm 在执行安装时，可以根据 <strong>package-lock.json</strong> 中存储的 integrity、version、name 生成一个唯一的 key 对应到 index-v5 目录下的缓存记录，从而找到 tar包的 hash，然后根据 hash 再去找缓存的 tar包直接使用(省去了查询远程仓库步骤)。

## 文件完整性
* 用户下载依赖包到本地后，需要确定在下载过程中没有出现错误，所以在下载完成之后需要在本地在计算一次文件的 hash 值，如果两个 hash 值是相同的，则确保下载的依赖是完整的，如果不同，则进行重新下载

## 整体流程 
* 检查 .npmrc 文件：优先级为：项目级的 .npmrc 文件 > 用户级的 .npmrc 文件> 全局级的 .npmrc 文件 > npm 内置的 .npmrc 文件 （registry=http://registry.npm.xxxx.com，在npm i 的时候，如果项目根目录下有这个文件，会自动从这个镜像地址下安装node_modules，不需要手动设置镜像地址）
* 检查项目中有无 lock 文件。
    + 无 lock 文件：
        * 从 npm 远程仓库获取包信息
        * 根据 package.json 构建依赖树，构建过程：
        构建依赖树时，不管其是直接依赖还是子依赖的依赖，优先将其放置在 node_modules 根目录。当遇到相同模块时，判断已放置在依赖树的模块版本是否符合新模块的版本范围，如果符合则跳过，不符合则在当前模块的 node_modules 下放置该模块。注意这一步只是确定逻辑上的依赖树，并非真正的安装，后面会根据这个依赖结构去下载或拿到缓存中的依赖包
        * 在缓存中依次查找依赖树中的每个包     
            + 不存在缓存：
                * 从 npm 远程仓库下载包（npm 模块仓库提供了一个查询服务，叫做 registry 。以 npmjs.org 为例，它的查询服务网址是 https://registry.npmjs.org/ 。这个网址后面跟上模块名，就会得到一个 JSON 对象，里面是该模块所有版本的信息。比如，访问 https://registry.npmjs.org/react，就会看到 react 模块所有版本的信息）
                * 校验包的完整性
                * 校验不通过：重新下载 
                * 校验通过：将下载的包复制到 npm 缓存目录；将下载的包按照依赖结构解压到 node_modules
            + 存在缓存：将缓存按照依赖结构解压到 node_modules
        * 将包解压到 node_modules
        * 生成 lock 文件
    + 有 lock 文件：检查 package.json 中的依赖版本是否和 package-lock.json 中的依赖有冲突。如果没有冲突，直接跳过获取包信息、构建依赖树过程，开始在缓存中查找包信息，后续过程相同

    <img :src="$withBase('/img/npm6.png')" alt="npm安装流程">

## 注意点
* npm install 命令用来安装模块到node_modules目录。安装之前，npm install会先检查，node_modules目录之中是否已经存在指定模块。如果存在，就不再重新安装了，即使远程仓库已经有了一个新版本，也是如此。如果你希望，一个模块不管是否安装过，npm 都要强制重新安装，可以使用-f或--force参数
* 如果想更新已安装模块，就要用到npm update命令。
```javascript
  npm update <packageName>
  npm i packageName@next
```
* 在 package.json 中定义这样的依赖项的真正好处是，任何有权访问 package.json 的人都可以创建一个包含运行应用程序所需模块的依赖项文件夹，但是让我们来看看事情可能出错的具体方式。假设我们创建了一个将使用 express 的新项目。 运行npm init后，我们安装express：npm install express - save。在编写代码时，最新的版本是4.15.4，所以 “express”：“^ 4.15.4”作为我的package.json中的依赖项添加，并且我的电脑安装了确切的版本。现在也许明天，express 的维护者会发布 bug 修复，因此最新版本变为4.15.5。 然后，如果有人想要为我的项目做贡献，他们会克隆它，然后运行`npm install。'因为4.15.5是具有相同主要版本的更高版本，所以为它们安装。 我们都安装 express ，但我们却是不同的版本。从理论上讲，它们应该仍然是兼容的，但也许bugfix会影响我们正在使用的功能，而且当使用Express版本4.15.4和4.15.5运行时，我们的应用程序会产生不同的结果，package-lock.json就是解决这样的问题
* 语义版本控制由三部分组成：X，Y，Z，分别是主要版本，次要版本和补丁版本。例如：1.2.3，主要版本1，次要版本2，补丁3，补丁中的更改表示不会破坏任何内容的错误修复。 次要版本的更改表示不会破坏任何内容的新功能。 主要版本的更改代表了一个破坏兼容性的大变化。 如果用户不适应主要版本更改，则内容将无法正常工作
