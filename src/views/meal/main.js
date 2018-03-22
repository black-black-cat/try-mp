import Vue from 'vue'
import App from './App.vue'
import Axios from 'common/utils/diyaxios'
import viewport from 'lib/comp/viewport'
import 'common/plugin/href'
import FastClick from 'fastclick' // 解决移动端300毫秒延迟
import lazyImage from  'common/plugin/lazyImage'
import bindMobile from 'common/plugin/bindMobile'
import appNav from 'common/plugin/appNav'
import selectCinema from 'common/plugin/selectCinema'
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body)
    }, false)
}
Vue.use(lazyImage);
Vue.use(bindMobile);
Vue.use(appNav);
Vue.use(selectCinema);

viewport.init(1);

Vue.config.productionTip = false;
Vue.prototype.$http = Axios;

new Vue({
    el: '#app',
    data: function () {
        return {
            options
        }
    },
    template: '<app :options="options"></app>',
    components: { App }
});