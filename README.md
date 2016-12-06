<<<<<<< HEAD
# inputNumber-000000
=======
# inputNumber v1.0
>>>>>>> 3044e3ebe6348279134b213a138e4bf2ab4481c5
限制input内容为多种数字形式


## 安装(不依赖任何第三方)
1. 通用形式：`<script src="inputNumber.js"></script>`
2. 支持AMD

## 使用方式
`<input type="text" id="t1">`<br>
`<input type="text" name="t2">`<br>
`inputNumber.init(window.document.getElementById("t1"));`<br>
`inputNumber.init(window.document.getElementsByName("t2"));`<br>

<b>支持jquery选择器</b><br>
`inputNumber.init($("#t1"));`<br>
`inputNumber.init($("input[name=t2]"));`<br>

## API
### init(dom, [config]);
通过init方法对input进行绑定，config为可选配置，当没有config时，默认配置如下：
~~~js
// 默认配置
var defaultConfig = {

    // 是否可为负
    negative: true,

    // 是否可为小数
    decimal: true,

    // 整数位数
    intSize: 12,

    // 小数位数
    decimalSize: 4
};

参数config可覆写配置信息：`init(dom, {negative : false});`
~~~

### clear(dom);
解绑input中涉及到的相关事件

## 兼容性
ie8及以上、现代浏览器测试正常，ie8以下没有测试过，希望测过的同学可以把结果反馈给我O(∩_∩)O~
