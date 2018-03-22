import Vue from 'vue'
import App from './App.vue'
import Axios from 'common/utils/diyaxios'
import viewport from 'lib/comp/viewport'
import 'common/plugin/href'
import FastClick from 'fastclick' // 解决移动端300毫秒延迟
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body)
    }, false)
}

import selectCinema from 'common/plugin/selectCinema';
import countdown from "common/plugin/countdown";
import bindMobile from 'common/plugin/bindMobile';
Vue.use(selectCinema);
Vue.use(countdown);
Vue.use(bindMobile);

viewport.init(1);
Vue.config.productionTip = false;
Vue.prototype.$http = Axios; // 类似于vue-resource的调用方法，之后可以在实例里直接用this.$http.get()等
document.body.classList.add("m-views-bind-member-card");

new Vue({
    el: '#app',
    data: function () {
        return {
            options: options
        }
    },
    template: '<app :options="options"></app>',
    components: { App }
});