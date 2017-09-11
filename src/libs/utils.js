module.exports = {
    pad: function(string, length, pad) {
        var len = length - String(string).length
        if (len < 0) {
            return string;
        }
        var arr = new Array(length - String(string).length || 0)
        arr.push(string);
        return arr.join(pad || '0');
    },
    flat: function(param) {
        var str = ""
        for (var key in param) {
            str += key + "=" + (param[key] != undefined ? encodeURIComponent(param[key]) : "") + "&"
        }
        return str.slice(0, -1);
    },
    https: function(a) {
        return String(a).replace("http://", "//");
    },
    //可视化object把假值转换为 ""
    vis: function(json) {
        for (var key in json) {
            // || isNaN(json[key])
            if (json[key] === undefined || json[key] === null) {
                json[key] = "";
            }
        }
        return json;
    },
    forEach(object, callback) {
        var list = []
        for (var key in object) {
            list.push(callback(object[key], key))
        }
        return list;
    },
    flatStr: function(str, param) {
        return str + this.flat(param);
    },

    is: function(is, str) {
        return is ? str : ""
    },
    rmb: function(rmb, dot) {

        dot = dot == undefined ? 4 : dot;

        if (rmb == 0) {
            return 0
        }

        if (dot == 2) {
            return (rmb).toFixed(2)
        }

        if (dot == 4 && (rmb).toFixed(2) * 10000 == (rmb).toFixed(4) * 10000) {
            return (rmb).toFixed(2);
        }

        return (rmb).toFixed(dot);
    },
    getSID: function() {


        if (this.isLogin()) {
            var cookie = document.cookie;
            var sids = cookie.match(/sid=(\w+)/);
            if (sids && sids[1]) {
                return sids[1];
            }
        }

        return null;
    },

    getUID: function() {

        if (this.isLogin()) {
            var cookie = document.cookie;
            var sids = cookie.match(/[^u]uid=(\d+)/);
            if (sids && sids[1]) {
                return sids[1];
            }
        }

        return null;
    },
    getTID: function() {
        if (this.isLogin()) {
            var cookie = document.cookie;
            var sids = cookie.match(/tid=([\-\w]+)/);
            if (sids && sids[1]) {
                return sids[1];
            }
        }
        return null;
    },
    dateFormatGMT: function(source, pattern) {
        let time = new Date(source);
        time.setUTCHours(time.getUTCHours() + ((time.getTimezoneOffset() + 8 * 60) / 60));
        return this.dateFormat(time, pattern);
    },
    dateFormat: function(source, pattern) {
        // Jun.com.format(new Date(),"yyyy-MM-dd hh:mm:ss");
        //Jun.com.format(new Date(),"yyyy年MM月dd日 hh时:mm分:ss秒");
        if (!source) {
            return "";
        }

        source = new Date(source);
        var pad = nihao.pad,
            date = {
                yy: String(source.getFullYear()).slice(-2),
                yyyy: source.getFullYear(),
                M: source.getMonth() + 1,
                MM: pad(source.getMonth() + 1, 2, '0'),
                d: source.getDate(),
                dd: pad(source.getDate(), 2, '0'),
                h: source.getHours(),
                hh: pad(source.getHours(), 2, '0'),
                m: source.getMinutes(),
                mm: pad(source.getMinutes(), 2, '0'),
                s: source.getSeconds(),
                ss: pad(source.getSeconds(), 2, '0')
            };
        return (pattern || "yyyy-MM-dd hh:mm:ss").replace(/yyyy|yy|MM|M|dd|d|hh|h|mm|m|ss|s/g, function(v) {
            return date[v];
        });

    },
    query: function() {
        var params = {};
        location.href.split('?').map((str) => {
            str.split('#').map((subStr) => {
                subStr.split("&").map((paramStr) => {
                    var param = paramStr.split("=");
                    if (param.length == 2) {
                        params[param[0]] = param[1]
                    }
                })
            })
        });
        return params;
    },
    //将金额*100的整数转换成 千分位金额 1,234.00
    moneyFormat: function(money, fixed) {
        if (!fixed) {
            fixed = 2
        }
        if (!money || Number(money) == 0) {
            return 0; //(0).toFixed(fixed)
        }
        var negative = false;

        var mStr = money.toString().split(".");
        mStr[1] = Number('0.00' + (mStr[1] || ""));

        if (mStr[0].indexOf('-') == 0) {
            negative = true;
            mStr[0] = mStr[0].replace("-", '');
        }

        var len = mStr[0].length;

        if (len <= 5) {
            if (negative) {
                return '-' + (mStr[0] / 100 + mStr[1]).toFixed(fixed)
            } else {
                return (mStr[0] / 100 + mStr[1]).toFixed(fixed)
            }
        }

        var decimal = (Number('0.' + mStr[0].slice(-2)) + mStr[1]).toFixed(fixed).replace("0.", "");
        var num = [];
        for (var i = -5; i > -len - 3; i = i - 3) {
            var part = [];
            part[0] = mStr[0].slice(i, i + 3);
            num = part.concat(num);
        }
        var round = num.join(",");
        //return (round + '.' + decimal );
        if (negative) {
            return ('-' + round + '.' + decimal);
        } else {
            return (round + '.' + decimal);
        }
    },

    //获取标准时差
    getTimezoneOffset: function() {
        var now = new Date();
        return now.getTimezoneOffset() * 60 * 1000;
    },
    isLogin: function() {
        return /sid\=\w+/.test(document.cookie);
    },

    isInYuantuApp: function() {

        //临时
        //return navigator.userAgent.indexOf("MicroMessage") != -1;
        return navigator.userAgent.indexOf("YuanTu(") != -1;
        // return navigator.userAgent.indexOf("YuanTu(") != -1;
    },
    //在微信中
    isInMicroMessenger: function() {
        return navigator.userAgent.indexOf("MicroMessenger") != -1;
    },
    isInAliPay: function() {
        return navigator.userAgent.indexOf("AliPay") != -1;
    },
    isInZhifubao: function() {
        return navigator.userAgent.indexOf("AliApp(AP") != -1;
    },

    getPlatform: function() {
        var ua = navigator.userAgent
        if (ua.indexOf("iPhone") != -1 || ua.indexOf("iPad") != -1) {
            return "ios";
        }

        if (ua.indexOf("Android") != -1) {
            return "android";
        }
        return null;
    },

    keys: function(obj) {
        var keys = [];
        for (var key in obj) {
            keys.push(key);
        }
        return keys;
    }
}