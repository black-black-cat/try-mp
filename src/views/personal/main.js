import Vue from 'vue'
import App from './App.vue'
import Axios from 'common/utils/diyaxios'
import viewport from 'lib/comp/viewport'
import 'common/plugin/href'
import {index_proxy } from 'common/config'
import lazyImage from 'common/plugin/lazyImage'
import appNav from 'common/plugin/appNav'
import bindMobile from 'common/plugin/bindMobile'
import selectCinema from 'common/plugin/selectCinema'

import FastClick from 'fastclick' // 解决移动端300毫秒延迟
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body)
    }, false)
}

Vue.use(lazyImage);
Vue.use(appNav);
Vue.use(bindMobile);
Vue.use(selectCinema);

viewport.init(1);

Vue.config.productionTip = false;
Vue.prototype.$http = Axios;
document.body.classList.add("m-views-personal");
new Vue({
    el: "#app",
    data () {
        return {
            options,
            index_proxy
        }
    },
    template: '<app :options="options" :proxy="index_proxy"></app>',
    components: { App }
});