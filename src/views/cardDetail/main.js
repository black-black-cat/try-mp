import Vue from 'vue'
import App from './App.vue'
import Axios from 'common/utils/diyaxios'
import viewport from 'lib/comp/viewport'
import 'common/plugin/href'
import FastClick from 'fastclick' // 解决移动端300毫秒延迟
import lazyImage from  'common/plugin/lazyImage'
import scrollLoad from 'common/plugin/scrollLoad'
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body)
    }, false)
}

viewport.init(1);
Vue.config.productionTip = false;
Vue.prototype.$http = Axios; // 类似于vue-resource的调用方法，之后可以在实例里直接用this.$http.get()等
// Vue.use(Swiper);
//Vue.use(lazyImage);
//Vue.use(scrollLoad);
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