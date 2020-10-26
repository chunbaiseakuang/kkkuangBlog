module.exports = {
  title: 'kkkuang的知识库',
  description: '呜哇',
  // 注入到当前页面的 HTML <head> 中的标签
  head: [
    ['link', {
      rel: 'icon',
      href: '/img/jennie1.ico'
    }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  // base: '/web_accumulate/', // 这是部署到github相关的配置 下面会讲
  markdown: {
    lineNumbers: true // 代码块显示行号
  },
  themeConfig: {
    sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
    sidebar: 'structuring',
    lastUpdated: 'Last Updated', // 文档更新时间：每个文件git最后提交的时间
    nav: [
      {
        text: 'Home',
        link: '/'
      }, 
      {
        text: 'ES6',
        link: '/es6/'
      },
      {
        text: 'CSS',
        link: 'http://obkoro1.com'
      }, // 内部链接 以docs为根目录
      {
        text: 'JavaScript',
        link: '/JavaScript/'
      }, // 外部链接
      // 下拉列表
      {
        text: 'GitHub',
        items: [{
            text: 'GitHub地址',
            link: 'https://github.com/OBKoro1'
          },
          {
            text: '算法仓库',
            link: 'https://github.com/OBKoro1/Brush_algorithm'
          }
        ]
      }
    ],

    sidebar: {
      // '/es6/':"auto"
      // docs文件夹下面的es6文件夹 文档中md文件 书写的位置(命名随意)
      '/es6/': [
        {
          title: 'ECMAScript 6',
          collapsable: false,
          children: [
            { title: '01.ECMAScript 6 简介', path:'/es6/01.ECMAScript 6 简介'},
            { title: '02.let 和 const 命令', path:'/es6/02.let 和 const 命令'},
            { title: '03.变量的解构赋值', path:'/es6/03.变量的解构赋值'},
            { title: '04.字符串的扩展', path:'/es6/04.字符串的扩展'},
            { title: '05.字符串的新增方法', path:'/es6/05.字符串的新增方法'},
            { title: '06.正则的扩展', path:'/es6/06.正则的扩展'},
            { title: '07.数值的扩展', path:'/es6/07.数值的扩展'},
            { title: '08.函数的扩展', path:'/es6/08.函数的扩展'},
            { title: '09.数组的扩展', path:'/es6/09.数组的扩展'},
            { title: '10.对象的扩展', path:'/es6/08.函数的扩展'},
            { title: '11.对象的新增方法', path:'11.对象的新增方法'},
            { title: '12.Symbol', path:'12.Symbol'},
            { title: '13.Set 和 Map 数据结构', path:'13.Set 和 Map 数据结构'},
            { title: '14.Proxy', path:'14.Proxy'},
            { title: '15.Reflect', path:'15.Reflect'},
            { title: '16.Promise 对象', path:'16.Promise 对象'},
            { title: '17.Iterator 和 for-of 循环', path:'17.Iterator 和 for-of 循环'},
            { title: '18.Generator 函数的语法', path:'18.Generator 函数的语法'},
            { title: '19.Generator 函数的异步应用', path:'19.Generator 函数的异步应用'},
            { title: '20.async 函数', path:'20.async 函数'},
            { title: '21.Class 的基本语法', path:'21.Class 的基本语法'},
            { title: '22.Class 的继承', path:'22.Class 的继承'},
            { title: '23.Module 的语法', path:'23.Module 的语法'},
            { title: '24.Module 的加载实现', path:'24.Module 的加载实现'},
            { title: '25.编程风格', path:'25.编程风格'},
            { title: '26.读懂 ECMAScript 规格', path:'26.读懂 ECMAScript 规格'},
            { title: '27.异步遍历器', path:'27.异步遍历器'},
            { title: '28.ArrayBuffer', path:'28.ArrayBuffer'},
            { title: '29.最新提案', path:'29.最新提案'},
            { title: '30.装饰器', path:'30.装饰器'},
            { title: '31.函数式编程', path:'31.函数式编程'},
            { title: '32.Mixin', path:'32.Mixin'},
            { title: '33.SIMD', path:'33.SIMD'},
            { title: '34.参考链接', path:'34.参考链接'},
            // 自动加.md 每个子选项的标题 是该md文件中的第一个h1/h2/h3标题
          ]
        }
      ],
      // // docs文件夹下面的algorithm文件夹 这是第二组侧边栏 跟第一组侧边栏没关系
      // '/algorithm/': [
      //   '/algorithm/', 
      //   {
      //     title: '第二组侧边栏下拉框的标题1',
      //     children: [
      //       '/algorithm/simple/test' 
      //     ]
      //   }
      // ]
    }

  }
};