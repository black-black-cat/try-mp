/**
 * webBridge模块
 */

import URL from "lib/util/URL";
import query from "lib/json/query";
import merge from "lib/json/merge";

// define(function(require, exports, module) {
	//---------- require begin -------------
	var geoLocation = require("lib/util/geoLocation");
	//---------- require end -------------
	var keyAt = 0;
	var openingWebview = false;
	var list = {};
	var geolocation = navigator.geolocation == null ? false : true;
	var that = {};

	var errResult = {
		"code": -1,
		"msg": "webBridge: 环境不支持App调用",
		"data": null
	}

	/**
	 * 调用app方法
	 * @param  {string} 方法名称
	 * @param  {Function} 回调函数
	 * @param  {object} 附加数据
	 */
	that.callApp = function(funcName, handler, params) {
		if (!that.isReady()) {
			console.error(errResult["msg"] + "(" + funcName + ")");

			try {
				handler && handler(errResult);
			}catch(ex) {
				console.error(ex);
			}

			return;
		}

		if (handler == null && params == null) {
			try {
				appBridge[funcName]();
			}catch(ex) {
				console.error(ex);
			}

			return;
		}

		var key = "key" + (keyAt++);
		var obj = {};

		if (handler != null) {
			list[key] = handler;
			obj.key = key;
		}

		if (params) {
			obj.data = params;
		}

		try {
			appBridge[funcName](JSON.stringify(obj));
		}catch(ex){
			console.error(ex);
		}
	}

	that.appCallback = function(key, data) {

		data = JSON.parse(data);

		if (data["code"] != 0) {
			console.error("webBridge: app调用执行结果返回错误(" + data["msg"] + ")");
		}

		try {
			list[key](data);
		}catch(ex) {
			console.error(ex);
		}
	}

	that.isReady = function() {
		return "appBridge" in window;
	}

	/**
	 * 获取当前城市
	 */
	that.getCurrentRegion = function(handler) {
		that.callApp("getCurrentRegion", handler);
	}

	/**
	 * 获取当前的经纬度
	 * 规则：优先使用app的，否则使用geolocation
	 * @param  {Boolean} isRelacate 默认是false，不强制重新定位，app从数据库中拿出最近半小时内的定位数据。
	 * 如果是true则强制重新定位，app返回最新的定位数据
	 */
	that.getCurrentPosition = function(handler, isRelocate) {
		isRelocate = isRelocate ? isRelocate : false;

		if (that.isReady()) {
			that.callApp("getCurrentPosition", function(result) {
				if (result["code"] != 0) {
					geoLocation(handler);
				} else {
					try {
						handler(result)
					}catch(ex) {
						console.error(ex);
					}
				}
			}, {
				isRelocate: isRelocate
			});
		} else {
			geoLocation(handler);
		}
	}

	/**
	 * 获取用户选择的城市
	 * 如果获取不到则会使用南京并保存为用户选择的城市
	 */
	that.getSelectedRegion = function(handler) {
		var defResult = {
			"code": 0,
			"msg": "success",
			"data": {
				"areaNo": "320100",
				"areaName": "南京市",
				"pAreaNo": "320000",
				"areaLevel": 2
			}
		}

		if (that.isReady()) {
			that.callApp("getSelectedRegion", function(result) {
				if (result["code"] != 0) {
					// 获取当前城市代替
					console.error("webBridge: 获取选定城市失败，默认使用南京");
					that.setSelectedRegion(defResult["data"]);

					try {
						handler(defResult)
					}catch(ex) {
						console.error(ex);
					}
					return;
				}

				try {
					handler(result);
				}catch(ex) {
					console.error(ex);
				}
			});
		} else {
			try {
				console.error("webBridge: 环境不支持app调用，默认使用南京");
				handler(defResult)
			}catch(ex) {
				console.error(ex);
			}
		}
	}

	/**
	 * 设置用户选择的城市
	 */
	that.setSelectedRegion = function(data) {
		// data: areaNo, areaName, pAreaNo, areaLevel
		that.callApp("setSelectedRegion", null, data);
	}

	/**
	 * 打开一个URL
	 * @param  {[type]} url    需要打开的url
	 * @param  {[type]} target blank/self，默认是blank
	 * @param  {[type]} style 0:返回+标题；1：隐藏导航条
	 */
	that.openUrl = function(url,target ,style) {
		if (openingWebview) {
			return;
		}

		target = target || "blank";
		style = style || 0;

		// 转成完整路径
		var link = document.createElement("A");
		link.href = url;

		if (that.isReady()) {
			openingWebview = true;
			that.callApp("openUrl", null, {
				"url": link.href,
				"target": target,
				"param":{
					"style":String(style)
				}				
			});
			setTimeout(function() {
					openingWebview = false;
				}
				, 1500);
		} else {
			console.error("webBridge: 环境不支持App调用(openUrl)");
			(style == 1 && target == "self") ? location.replace(url) :location.href = url;
		}
	}

	/**
	 * 关闭当前子webview，并指定是否返回最顶层
	 * @param  {Boolean} isRoot 默认是0，返回上一层页面。如果是1则关闭所有子webview，返回根页面
	 * 0: 关闭当前，返回上一层
	 * 1：关闭所有子webview，返回根页面
	 * 2 删除中间的控制器
     * 3 删除指定数量的控制器
	 * 4：关闭当前页面，返回上一层页面并刷新
	 */
	that.close = function(isRoot) {
		isRoot = isRoot || 0;
		if(that.isReady()){
			that.callApp("close", null, {
				"isRoot": String(isRoot)
			});
		}else if(isRoot == 0 || isRoot == 4){
			console.error("webBridge: 环境不支持App调用(close)");
			window.history.go(-1);
		}else if(isRoot == 1){
			console.error("webBridge: 环境不支持App调用(close)");
			window.history.go(1 - window.history.length);
		}
	}
	//清楚缓存
	that.clearCache = function(handler){
		that.callApp("clearCache",handler);
	}
	//获取缓存size
	that.getCacheSize = function(callblack){
		that.callApp("getCacheSize", callblack);
	}
	//通知其他页面
	that.onNotifyChange = function(){
		that.callApp("onNotifyChange");
	}

	that.userIsLogin = function(userIsLogin) {
		that.callApp("userIsLogin", null, {
			"userIsLogin": userIsLogin
		});
	}

	/*
	检查是否有新的安装包
	data:{versionName: ""}
	*/
	that.checkHaveNewApp = function(versionName,handle) {
		that.callApp("checkHaveNewApp", handle, {
			"versionName": versionName
		});
	}

	/*
	下载新的APP
	data:{url:'',versionName: ""}
	*/
	that.downLoadApp = function(params,handle) {
		that.callApp("downLoadApp", handle, params);
	}

	that.getCurrentVersion = function(handle) {
		that.callApp("getCurrentVersion", handle, {});
	}

	/*
	* 更新APP版本信息
	*/
	that.toUpdateApp = function(data){
		that.callApp("toUpdateApp", null, data);
	}
    /**
     *  传递用户信息给APP
     */
	that.setUserInfo = function(data) {
		that.callApp("setUserInfo", null,data);
	}

	/**
	 * 用于页面初始化完关闭loading
	 */
	that.closeLoading = function() {
		that.callApp("closeLoading");
	}

	/**
	 * 用户退出登录时与APP通信
	 * 0 :退出
	 */
	that.logout = function() {
		that.callApp("logout");
	}

	/**
	 * [popToSelectedController description]
	 * @param  {url:url} index [要跳转的主页的index]
	 * 首页:homePage
	 * 活动:activity
	 * 购票:buyTicket
	 * 我的:mine
	 */
	that.popToSelectedController = function(url) {
		// 转成完整路径
		var link = document.createElement("A");
		link.href = url;
		if(that.isReady()){
			that.callApp("popToSelectedController", null, {
				'url': link.href
			});
		}else{
			console.error("webBridge: 环境不支持App调用(popToSelectedController)");
			location.href = url;
		}
	}

	/**
	 * 重新加载本页
	 * @return {[type]} [description]
	 */
	that.reload = function() {
		var url = URL.parse(location.href);

		var parma = url["query"].length ? query.parse(url["query"]) : {};

		if ("_target" in parma) {
			delete parma["_target"];
		}

		parma["_ts"] = new Date().getTime();
		url["query"] = query.stringify(parma);
		that.openUrl(URL.build(url), "self");
	}

	/**
	 * 拨打电话
	 */
	that.makeCall = function(number) {
		that.callApp("makeCall", null, {
			'tel': number
		});
	}
	that.login = function(){
		that.openUrl("/login.html",{style:0,isRefresh:1,target:"blank",segmentArray:[{url:location.origin + "/login.html",title:""}]});
	}
	that.onRefresh = function(){
	}

	/*
	*第三方支付
	*/
	that.launchAppPay = function (data, handler) {
        that.callApp("launchAppPay",handler, {
            payResponse: data
        });
    }

    /*
	* 关闭显示导航条
	* 是否显示topBar;
     * hide
  * 0 显示白色返回按钮
    1 显示黑色返回按钮
    2 显示黑色关闭按钮
    3 隐藏导航条

    */
    that.topBarVisible = function(n){
    	that.callApp("topBarVisible", null, {
    		hide: String(n)
    	});
    }

    /*
	* 点击返回按钮回调
    */

    //android上的返回键调用的方法
    /*that.onBackPressed = function() {
        var isIPhone = navigator.appVersion.match(/iphone/gi);
        if (isIPhone) {
            return "turnBackSucceed";
        }
    };*/

	window.webBridge = that;

	export default window.webBridge;
// });
