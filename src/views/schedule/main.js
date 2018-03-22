import Vue from 'vue'
import App from './App.vue'
import Axios from 'common/utils/diyaxios'
import viewport from 'lib/comp/viewport'
import 'common/plugin/href'
import lazyImage from 'common/plugin/lazyImage'
import scrollLoad from 'common/plugin/scrollLoad'
import selectCinema from 'common/plugin/selectCinema'

import FastClick from 'fastclick' // 解决移动端300毫秒延迟
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body)
    }, false)
}

Vue.use(lazyImage);
Vue.use(scrollLoad);
Vue.use(selectCinema);

viewport.init(1);
Vue.config.productionTip = false;
Vue.prototype.$http = Axios;
document.body.classList.add("m-views-schedule");

new Vue({
    el: "#app",
    data () {
        return {
           options
        }
    },
    template: '<app :options="options"></app>',
    components: { App }
});