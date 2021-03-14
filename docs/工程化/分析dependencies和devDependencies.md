---
title: 分析dependencies和devDependencies
date: 2021-03-11 9:35:35
permalink: /pages/分析dependencies和devDependencies
author: kcy
---

# 分析dependencies和devDependencies

## 基本区别
* dependencies是生产环境下的依赖（只包含正式运行是必须依赖的插件，比如vue、react、jquery等）
* devDependencies是开发环境下的依赖（比如webpack、babel、eslint等辅助打包插件）

### 场景
* 问题一：为何一个依赖（比如jquery）不管是放到dependencies还是devDependencies下，在打包的时候（NODE_ENV两种情况下都试过）都会把jquery打进去（按照上面的理解如果是放到devDependencies里面并且在production环境下，jquery不应该被打进去的呀？？?）
    + webpack 构建项目是根据入口文件的引用树来构建的，跟你放在哪个 dependency 里面没有关系，就算你没有放在 dependency 里面，只要你文件中引用了这个库并且 webpack 能在 node_modules 文件夹中找到这个库，就会打包进去

* 问题二：当我把这个npm包当做lib包发布到npm库中后，再去require/import使用这个库的时候，不管是npm install mylib --save-dev 还是npm install mylib --save 还是直接npm insatll mylib 最终下载到node_modules下面的依赖都一模一样（都只有mylib包和mylib包自身package.dependencies中唯一指定的jquery包，一共2个包被下载下来）
    + npm install mylib --save-dev 还是 npm install mylib --save 还是直接 npm insatll mylib，这三条指令都会把依赖下载到 node_modules 文件夹。不同的是 --save-dev 还会修改 devDependencies 对象，把 mylib 添加进去；同理，--save 或者不加参数则是把 mylib 添加到 dependencies 对象中。

