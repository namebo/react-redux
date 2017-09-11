// Ajax 方法

// 惰性载入创建 xhr 对象
let JSON = function(ajaxData) {
	var xhr ;
	if ('XMLHttpRequest' in window) {
		xhr =  new XMLHttpRequest();
	} else if ('ActiveXObject' in window) {
		xhr = new ActiveXObject("Msxml2.XMLHTTP");
	} else {
		throw new Error("Ajax is not supported by this browser");
	}

// Ajax 执行


		// ajaxData.before && ajaxData.before();

		// 通过事件来处理异步请求
		xhr.onreadystatechange = function () {
// console.log('111',xhr)
			if (xhr.readyState == 4) {

				if (xhr.status == 200) {

					if (ajaxData.dataType == 'json') {

						// 获取服务器返回的 json 对象
						jsonStr = xhr.responseText;
						json1 = eval('(' + jsonStr + ')'),
							json2 = (new Function('return ' + jsonStr))();
						ajaxData.success(json2);
						// ajaxData.callback(JSON.parse(xhr.responseText)); // 原生方法，IE6/7 不支持

					} else

						ajaxData.success(xhr.responseText);

				} else {
					console.log('222',xhr.responseText,xhr)
					ajaxData.error && ajaxData.error(xhr);
				}
			}
		};

		// 设置请求参数
		xhr.open(ajaxData.type, ajaxData.url);

		if (ajaxData.noCache == true) xhr.setRequestHeader('If-Modified-Since', '0');

		if (ajaxData.data) {

			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(ajaxData.data);

		} else {
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.send(null);
		}

}

module.exports = JSON;