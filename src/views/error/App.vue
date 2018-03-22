<template>
    <div class="m-count">
        <error :msg="errorMsg" refresh="true" :back="back" @onBack='onBack'></error>
        <app-nav-items v-if="options.bottomNavItems">
            <app-item icon="home" :href="options.bottomNavItems[0]" :selected="getSel(options.bottomNavItems[0])"  name="推荐"></app-item>
            <app-item icon="find" :href="options.bottomNavItems[1]"  :selected="getSel(options.bottomNavItems[1])" name="发现"></app-item>
            <app-item icon="store" :href="options.bottomNavItems[2]" :selected="getSel(options.bottomNavItems[2])"  name="商城"></app-item>
            <app-item icon="me" :href="options.bottomNavItems[3]" :selected="getSel(options.bottomNavItems[3])"  :is-login="options.data.is_login" :ajax-url="options.href" name="我的"></app-item>
        </app-nav-items>
    </div>
</template>

<script>
import error from "common/components/error";
import browser from "lib/util/browser";
import query from 'lib/json/query'
import { bus, get } from 'lib/comp/bus';

export default {
    props: {
        errorMsg: {
            type: String,
            default: "系统异常"
        },
        options: Object
    },
    data(){
        return {
            queryParams:query.parse(location.search.slice(1)),
            type: this.options.data.type,
            back: true
        }
    },
    mounted(){
        let vm = this;
        setTimeout(()=>{//无法获取初始type值
            if((this.options.data.type == 1) && (location.pathname.indexOf('index/index')!= -1)){
                vm.back = false;
                bus.$emit(get("back"), vm.back);
            }            
        },20);
    },
    components: {
        error
    },
    methods: {
        getSel(href){
            return href.indexOf(location.pathname) != -1;
        },
        onBack(){
            if((location.pathname.indexOf('index/index')!= -1 || history.length == 1) && this.queryParams.a && this.options.data.type != 1){
                this.queryParams.a = "";
                webBridge.openUrl(query.url(location.pathname, this.queryParams), "self");
            }else{
                history.go(-1);
            }         
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";
.m-count {
    @include display-flex();
    @include flex-direction(column);
    height: 100%;
}
.m-error {
    position: absolute;
    left: 50%;
    top: 50%;
    @include transform(translate(-50%, -50%));
}
</style>

<style lang="scss">
@import "../../common/style/mixin";
html,
body {
    height: 100%;
}
</style>
