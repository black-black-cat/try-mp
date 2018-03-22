import Vue from 'vue'
import App from './App.vue'
import Axios from 'common/utils/diyaxios'
import viewport from 'lib/comp/viewport'

import FastClick from 'fastclick' // 解决移动端300毫秒延迟
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body)
    }, false)
}

viewport.init(1);

Vue.config.productionTip = false;
Vue.prototype.$http = Axios;

new Vue({
    el: "#app",
    data () {
        return {
            options: options
        }
    },
    template: '<app :options="options"/>',
    components: { App }
});
window.onerror = function (msg, url, lineNo, columnNo, error) {
    var string = msg.toLowerCase();
    var substring = "script error";
    if (string.indexOf(substring) > -1){
        alert('Script Error: See Browser Console for Detail');
    } else {
        var message = [
            'Message: ' + msg,
            'URL: ' + url,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
        ].join('\n');

        alert(message);
    }
};