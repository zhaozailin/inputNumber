(function() {

    // 兼容IE8的indexOf
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (el) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === el) {
                    return i;
                }
            }
            return -1;
        };
    }

    // 可以输入的键：数字、退格、删除、左右、home、end
    var enableKey = [48,49,50,51,52,53,54,55,56,57,8,46,37,39,35,36];

    // 阻止事件发生
    var preventDefault = function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        // 支持IE
        else {
            e.returnValue = false;
        }
    };

    // 标注浏览器下获取光标位置
    // 1.勾选内容时返回[start,end]
    // 2.没有勾选内容时返回光标位置
    var getNormalCaret = function(el) {
        var start = el.selectionStart;
        var end = el.selectionEnd;

        // 没有勾选内容
        if (start === end) {
            return start;
        }

        // 勾选了内容
        return [start, end];
    };

    // 在IE下获取光标位置(不区分是否勾选)
    var getIECaret = function(el) {
        var start = 0;
        var range = el.createTextRange();
        var range2 = document.selection.createRange().duplicate();

        // get the opaque string
        var range2Bookmark = range2.getBookmark();

        // move the current range to the duplicate range
        range.moveToBookmark(range2Bookmark);

        var end = 0;

        // counts how many units moved (range calculated as before char and after char, loop count is the position)
        while (range.moveStart('character' , -1) !== 0) {
            start++;
        }

        while (range.moveStart('character' , 1) !== 0) {
            end++;
        }

        return start;
    };

    // 处理keydown
    var keyDownEventListener = function(e) {
        var which = e.charCode ? e.charCode : e.keyCode;
        var target = e.target ? e.target : e.srcElement;

        // 从根本上禁止输入中文标点，但是会漏掉第一个，所以需要keyup事件配合使用
        if (which === 229) {
            target.value = target.value.replace(/[^\x00-\xff]/g, "");
            preventDefault(e);
            return;
        }

        if (enableKey.indexOf(which) === -1) {
            preventDefault(e);
            return;
        }

        // 小数点不超过2个
        if (which === 190 && target.value.indexOf(".") !== -1) {
            preventDefault(e);
            return;
        }

        // -不超过2位
        if ((which === 189 || which === 173) && (target.value.indexOf("-") !== -1)) {
            preventDefault(e);
            return;
        }

        // 小数位不超过指定长度
        var digits = target.value.split(".");

        // 计算光标位置
        var position = target.selectionStart !== undefined ? getNormalCaret(target) : getIECaret(target);

        // 有小数位&&小数位>=设置的长度&&只处理数字(功能键依然可用，比如删除)
        if (digits.length === 2 && digits[1].length >= defaultConfig.decimalSize && (which >=48 && which <= 57)) {

            // 非勾选内容且光标位于小数点之后时，禁止输入
            if (typeof position === "number" && position > digits[0].length) {
                preventDefault(e);
                return;
            }
        }

        // 整数位不超过指定长度
        if (digits.length > 0 && digits[0].length >= defaultConfig.intSize && (which >=48 && which <= 57)) {

            // 非勾选内容且光标位于小数点之后时，禁止输入
            if (typeof position === "number" && position <= defaultConfig.intSize) {
                preventDefault(e);
                return;
            }
        }
    };

    // 处理keyup
    var keyUpEventListener = function(e) {
        var target = e.target ? e.target : e.srcElement;
        var digits = target.value.split(".");

        // 删除输入的双字节字符
        if (/[^\x00-\xff]/g.test(target.value)) {
            target.value = target.value.replace(/[^\x00-\xff]/g, "");
        }

        // 删除与-同一键位的_
        else if (/[_]/g.test(target.value)) {
            target.value = target.value.replace(/[_]/g, "");
        }

        // -只能出现在第一位
        else if (/^.+-.*$/.test(target.value)) {
            var tmp = target.value.substring(1);
            target.value = target.value.charAt(0) + tmp.replace(/[-]/g, "");
        }

        // 整数位不超过指定长度：当勾选了小数点，并将其替换为整数时的保险措施
        else if (digits.length > 0 && digits[0].length > defaultConfig.intSize) {
            target.value = target.value.substring(digits[0].length - defaultConfig.intSize);
        }
    };

    // 不可拖入内容
    var dropEventListener = function(e) {
        preventDefault(e);
    };

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

    var inputNumber = {

        // 初始化
        init: function(dom, config) {

            // 组装自定义配置与默认配置
            if (config) {
                for (var attr in config) {
                    if (config.hasOwnProperty(attr)) {
                        defaultConfig[attr] = config[attr];
                    }
                }
            }

            // 可为负数(189,firefox:173)
            if (defaultConfig.negative) {
                enableKey.push(189);
                enableKey.push(173);
            }

            // 可为小数(190)
            if (defaultConfig.decimal) {
                enableKey.push(190);
            }

            if (dom.addEventListener) {
                dom.addEventListener("drop", dropEventListener, false);
                dom.addEventListener("keydown", keyDownEventListener, false);
                dom.addEventListener("keyup", keyUpEventListener, false);
            }

            // 支持IE
            else {
                dom.attachEvent("ondrop", dropEventListener);
                dom.attachEvent("onkeydown", keyDownEventListener);
                dom.attachEvent("onkeyup", keyUpEventListener);
            }
        },

        // 清理事件监听
        clear : function(dom) {
            if (dom.removeEventListener) {
                dom.removeEventListener("drop", dropEventListener, false);
                dom.removeEventListener("keydown", keyDownEventListener, false);
                dom.removeEventListener("keyup", keyUpEventListener, false);
            }

            // 支持IE
            else {
                dom.detachEvent("ondrop", dropEventListener);
                dom.detachEvent("onkeydown", keyDownEventListener);
                dom.detachEvent("onkeyup", keyUpEventListener);
            }
        }
    };

    // 支持AMD
    if ( typeof define === "function" && define.amd ) {
        define(function() {
            return inputNumber;
        });
    }
    else {
        window.inputNumber = inputNumber;
    }
})();