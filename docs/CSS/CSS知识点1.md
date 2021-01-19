---
title: CSS知识点1
date: 2020-12-9 15:35:35
permalink: /pages/CSS知识点1
author: kcy
---

# CSS知识点1

## 介绍一下标准的CSS的盒子模型？与低版本IE的盒子模型有什么不同的？
* 标准盒子模型：宽度=内容的宽度（content）+ border + padding + margin
* 低版本IE盒子模型：宽度=内容宽度（content+border+padding）+ margin

## 用纯CSS创建一个三角形的原理是什么？
* 首先，需要把元素的宽度、高度设为0。然后设置边框样式。
```css
    width: 0;
    height: 0;
    border-top: 40px solid transparent;
    border-left: 40px solid transparent;
    border-right: 40px solid transparent;
    border-bottom: 40px solid #ff0000;
```
## CSS 预处理器
### sass
* 嵌套规则
```css
//编译前
.mk-cell {
  display: flex;
  width: 100%;
  padding: 6px 12px;
  overflow: hidden;
  .mk-cell__title {
      width: 80px;
      flex-shrink: 0;
      color: #666;
  }
  .mk-cell__value {
      flex-basis: auto;
      font-weight: 600;
  }
}
//编译后
.mk-cell {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 100%;
  padding: 6px 12px;
  overflow: hidden;
}

.mk-cell .mk-cell__title {
  width: 80px;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  color: #666;
}

.mk-cell .mk-cell__value {
  -ms-flex-preferred-size: auto;
  flex-basis: auto;
  font-weight: 600;
}

/* 父选择器:&的巧用 */
//编译前
.mk-cell {
  background: #fff;
  &:hover{
    background: #eee;
  }
}
//编译后
.mk-cell {
  background: #fff;
}
.mk-cell:hover {
  background: #eee;
}
```
* 属性嵌套：有些 CSS 属性遵循相同的命名空间 (namespace)，比如 font-family, font-size, font-weight 都以 font 作为属性的命名空间。为了便于管理这样的属性，同时也为了避免了重复输入，Sass 允许将属性嵌套在命名空间中
```css
//编译前
.mk-cell {
  background: #fff;
  font: {
    family: fantasy;
    size: 30em;
    weight: bold;
  }
}
//编译后
.mk-cell {
  background: #fff;
  font-family: fantasy;
  font-size: 30em;
  font-weight: bold;
}
```
* 变量
```css
// 变量的结尾添加 !default可指定默认值，此时，如果变量已经被赋值，不会再被重新赋值，如果变量未被赋值，则会被赋予新的值
// 编译前
$primary-dark : pink;
$primary-dark : red  !default;
.block{
  color: $primary-dark;
}

// 编译后 （变量值还是前面声明的值）
.block {
  color: pink;
}

```
* 混合指令:定义可重复使用的样式，避免了使用无语意的 class;使用 @include 指令引用混合样式，格式是在其后添加混合名称
```css
@mixin commonBackground {
  background-repeat: no-repeat;
  background-size: 100%;
}
.shine{
  background: url('../assets/images/shine.png');
  @include commonBackground;
  width: 750px;
  height: 300px;
}
```
* 参数 (Arguments):参数用于给混合指令中的样式设定变量，并且赋值使用。在定义混合指令的时候，按照变量的格式，通过逗号分隔，将参数写进圆括号里。引用指令时，按照参数的顺序，再将所赋的值对应写进括号
```css
@mixin sexy-border($color, $width) {
  border: {
    color: $color;
    width: $width;
    style: dashed;
  }
}
p { @include sexy-border(blue, 1in); }
/* 编译后 */
p {
  border-color: blue;
  border-width: 1in;
  border-style: dashed; 
}
```
