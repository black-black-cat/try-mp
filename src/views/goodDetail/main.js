import Vue from 'vue'
import App from './App.vue'
import viewport from 'lib/comp/viewport'
import 'common/plugin/href'
import {index_proxy } from 'common/config'
import lazyImage from 'common/plugin/lazyImage'

import FastClick from 'fastclick' // 解决移动端300毫秒延迟
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body)
    }, false)
}

Vue.use(lazyImage);

viewport.init(1);

Vue.config.productionTip = false;

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