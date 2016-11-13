/**
 * Created by zhaozailin on 2016/11/13.
 * 使用oninput重构
 */
var inputNumber = (function () {

    // 处理oninput事件
    var handleOninputEvent = function (e, config) {
        console.log(e.target.value);

        console.log(config);
        e.preventDefault();
    };

    // 处理单个元素
    var handlePerDom = function (dom, config) {

        // 监控oninput事件
        dom.addEventListener("input", function (e) {
            console.log(1);
            return "123";
            // handleOninputEvent(e, config);
        }, false);
    };

    // 初始化配置信息
    var initConfig = function(config) {

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

        // 组装自定义配置与当前默认配置
        if (config) {
            for (var attr in config) {
                if (config.hasOwnProperty(attr)) {
                    defaultConfig[attr] = config[attr];
                }
            }
        }

        return defaultConfig;
    };

    var init = function(domObj, config) {

        // 初始化配置信息
        var curConfig = initConfig(config);

        // jquery对象
        if (jQuery && domObj instanceof jQuery) {
            for (var i = 0; i < domObj.length; i++) {
                handlePerDom(domObj.eq(i)[0], curConfig);
            }

        }
    };
    
    return {
        init: init
    };
})();
