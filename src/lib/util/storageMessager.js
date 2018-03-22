/**
 * 调用localStorage实现不同页面通讯机制
 * 建议仅在移动端使用
 */

import each from "lib/util/each";
import clone from "lib/json/clone";
    
var globalKey = "lib/evt/storageMessager";
var that = {};
var events = {};
var timeout = 1;

/*if (!("localStorage" in window)) {
    console.error("lib/evt/storageMessager无法在本环境下工作");
    return null;
}*/

var lastValue = localStorage.getItem(globalKey);

var checkStorage = function() {
    var newValue = localStorage.getItem(globalKey);
    var json = null;
    if (lastValue == newValue) {
        setTimeout(checkStorage, timeout);
        return;
    }

    if (newValue == null) {
        lastValue = null;
        setTimeout(checkStorage, timeout);
        return;
    }

    lastValue = newValue;

    try {
        json = JSON.parse(newValue);
    }catch(ex) {
        console.error(ex);
        setTimeout(checkStorage, timeout);
        return;
    }

    if (!(json.name in events)) {
        setTimeout(checkStorage, timeout);
        return;
    }

    var handlers = events[json.name];

    each(handlers,function(hld) {
        try {
            hld.call(that, {
                "type": json.name,
                "data": clone(json.data),
                "time": json.time
            });
        }catch(ex) {
            console.error(ex);
        }
    });

    setTimeout(checkStorage, timeout);
}

that.send = function(evtType, data) {
    globalKey = evtType;
    localStorage.setItem(globalKey, JSON.stringify({
        "name": evtType,
        "data": data,
        "time": new Date().getTime(),
        "url": location.href
    }));
}

that.bind = function(evtType, handler) {
    if (typeof(handler) != "function") {
        return;
    }

    if (!(evtType in events)) {
        events[evtType] = [];
    }

    each(events[evtType], function(item, index) {
        if (item === handler) {
            return;
        }
    });

    events[evtType].push(handler);
}

that.unbind = function(evtType, handler) {
    if (!(evtType in events)) {
        return;
    }

    var tmp = [];

    each(events[evtType], function(item, index) {
        if (item === handler) {
            return;
        }

        tmp.push(item);
    });

    if (tmp.length) {
        events[evtType] = tmp;
    } else {
        delete events[evtType];
    }
}

/*
* 取出localStroage,如果过期就不使用
* day: 过期期限，单位：天,默认3天
*/
that.getItem = function(evtType, day){
    day = day || 3;
    if(!localStorage.getItem(evtType)) return false;
    let now = new Date().getTime();
    let data =  JSON.parse(localStorage.getItem(evtType));
    let n = now - data.time;
    if (n < day*24*60*60*1000){
        return data.data;
    }else{
        return false;
    }
}

// 开始检查
checkStorage();

export default that;