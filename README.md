# unbundled-example
unbundled轮子仓库

-----

## 本仓库为一篇博客的demo

[所谓Unbundled](https://blog.lishunyang.com/2020/08/unbundled.html)

## 如何使用

仓库下一共有5个分支，分别为：

1. step1-esm-simple-demo - 基础分支（没有任何工作）
2. step2-add-css-loader - 添加功能：将css内联至js中
3. step3-cjs-to-esm - 添加功能：将cjs转换成esm
4. step4-convert-node_modules-to-mokapack - 添加功能：改写node_modules依赖路径
5. step5-add-react - 添加功能：引入react

除了第一个分支外，其他分支的目录结构为：

```
src/
  client/      <-- 前端代码
    a.js
  server.js    <-- 后端代码
public/        <-- 静态资源，html所在位置
```

启动命令均为

`npm i`和`npm run dev`

然后访问

[http://localhost:5600](http://localhost:5600)
