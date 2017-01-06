/**
 * Created by zhaozailin on 2016/11/13.
 * 使用oninput重构
 */
var inputNumber = (function () {

    // 初始化
    var init = function (domObj, config) {

        // 初始化配置信息
        var curConfig = initConfig(config);

        for (var i = 0; i < domObj.length; i++) {
            handlePerDom(domObj.eq(i), curConfig);
        }
    };

    // 初始化配置信息
    var initConfig = function (config) {

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

    // 处理单个元素
    var handlePerDom = function (dom, config) {
        var oriVal = '';

        // 监控oninput事件
        dom.on('input', function (e) {
            var curVal = e.target.value;

            // 校验正负
            // 负
            if (config.negative) {
                if (!/^[-]?[\.|\d]*$/.test(curVal)) {
                    e.target.value = oriVal;
                    return false;
                }
            }

            // 正
            else {

            }

            oriVal = curVal;

        });
    };

    return {
        init: init
    };
})();
