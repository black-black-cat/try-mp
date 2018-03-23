import Vue from 'vue'
import App from './index.vue'
import fly from 'common/utils/fly'
// import Axios from 'common/utils/diyaxios'
// import axios from 'axios'
// import viewport from 'lib/comp/viewport'
// import 'common/plugin/href'
// import {index_proxy } from 'common/config'
// import lazyImage from 'common/plugin/lazyImage'
// import appNav from 'common/plugin/appNav'
// import bindMobile from 'common/plugin/bindMobile'
// import popupAD from 'common/plugin/popupAD'
// import versionUpdate from 'common/plugin/versionUpdate'
// import selectCinema from 'common/plugin/selectCinema'

// import FastClick from 'fastclick' // 解决移动端300毫秒延迟
// if ('addEventListener' in document) {
//     document.addEventListener('DOMContentLoaded', function () {
//         FastClick.attach(document.body)
//     }, false)
// }

// Vue.use(lazyImage);
// Vue.use(appNav);
// Vue.use(bindMobile);
// Vue.use(popupAD);
// Vue.use(versionUpdate);
// Vue.use(selectCinema);

// viewport.init(1);

// Vue.config.productionTip = false;
Vue.prototype.$http = fly
// document.body.classList.add("m-views-index");
// new Vue({
//     el: "#app",
//     data () {
//         return {
//             options,
//             index_proxy
//         }
//     },
//     template: '<app :options="options" :proxy="index_proxy"></app>',
//     components: { App }
// });

const app = new Vue(App)
app.$mount()

// window.onerror = function (msg, url, lineNo, columnNo, error) {
//     var string = msg.toLowerCase();
//     var substring = "script error";
//     if (string.indexOf(substring) > -1){
//         alert('Script Error: See Browser Console for Detail');
//     } else {
//         var message = [
//             'Message: ' + msg,
//             'URL: ' + url,
//             'Line: ' + lineNo,
//             'Column: ' + columnNo,
//             'Error object: ' + JSON.stringify(error)
//         ].join('\n');
//
//         alert(message);
//     }
// };

