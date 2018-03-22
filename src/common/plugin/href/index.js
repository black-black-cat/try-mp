import Vue from 'vue';

import {getUniqueId } from 'lib/comp/bus'
import closest from 'lib/dom/closest'
import webBridge from 'common/utils/webBridge'
import browser from 'lib/util/browser'
import pageSwitch from 'common/utils/pageSwitch'

var _vHrefList = {bind: true};
var animated;
// alert(animated)
function _bodyClickJump(ev){
    let key = ev.target.dataset.vkey;
    let query = ev.target.dataset.query;
    let target = ev.target.dataset.target;
    animated = ev.target.dataset.animated;
    let isTop = ev.target.dataset.istop;
    if(!key){
        const node = closest(ev.target, "[data-vkey]");
        if(node){
            key = node.dataset.vkey;
            query = node.dataset.query;
            target = node.dataset.target;
            animated = node.dataset.animated;
            isTop = node.dataset.istop;
        }
    }
    if(browser.WX) animated = true;
    const obj = _vHrefList[key];
    if(obj) {
        const value = obj.value;
        const arg = obj.arg;
        const lazy = obj.lazy;
        function openURL(){
            let url = query ? (value + (value.includes("?") ? "&" : "?") + query) : value;
            if(!url) return;            
            if (!animated) {
                if(browser.WX){
                    if(arg === "top"){
                        window.top.location.href = url;
                    }else{
                        location.href = url;
                    }
                }else{
                    isTop ? webBridge.popToSelectedController(url) : webBridge.openUrl(url, target);
                }
                return;
            }
            pageSwitch.start(() => {
                if(browser.WX){
                    if(arg === "top"){
                        window.top.location.href = url;
                    }else{
                        location.href = url;
                    }
                }else{
                    isTop ? webBridge.popToSelectedController(url) : webBridge.openUrl(url, target);
                }
            });
        }
        if(browser.WX){
            document.body.removeEventListener("click", _bodyClickJump, false);
            _vHrefList.bind = false;
        }
        if(lazy){
            setTimeout(openURL, 20);
        }else {
            openURL();            
        }
    }
}

document.body.addEventListener("click", _bodyClickJump, false);
window.addEventListener('pageshow', function(e) {
    // alert(e.persisted)
    if(e.persisted && !_vHrefList.bind){
        animated && pageSwitch.end();
        document.body.addEventListener("click", _bodyClickJump, false);
    }
}, false);

Vue.directive('href', {
    bind (el, binding) {
        const value = binding.value;
        if(typeof value !== "string" || value === "") return;
        const arg = binding.arg;
        el.dataset.vkey = getUniqueId();
        _vHrefList[el.dataset.vkey] = {arg: arg, value: value, lazy: binding.modifiers.lazy};
    }
});