<template >
    <div v-if="isLogin == 0 && !isWX"   class="nav-item" @click="changeSelect" >
        <i :class="'icon-'+icon+(isSelect ? '-selected' : '')"></i>
        <span :class="'name'+ (isSelect ? ' selected' : '')">{{ name }}</span>
    </div>
    <div v-else  class="nav-item" v-href.lazy="href" @click="changeSelect" data-target="self" data-istop="true">
        <i :class="'icon-'+icon+(isSelect ? '-selected' : '')"></i>
        <span :class="'name'+ (isSelect ? ' selected' : '')">{{ name }}</span>
    </div>
</template>
<script>
    import browser from "lib/util/browser"
    import toLogin from "common/plugin/toLogin"
    import {bus, get} from "lib/comp/bus"
    import webBridge from "common/utils/webBridge"
    import storageMessager from "lib/util/storageMessager"

    const _appItems = [];
    export default {
        props: ["icon", "selected", "name", "href","isLogin", "ajaxUrl"],
        data () {
            return {
                isSelect: this.selected,
                isLogin: this.isLogin,
                isWX :browser.WX,             
            }
        },
        mounted () {
            _appItems.push(this);
            window.addEventListener('pageshow', e => {
                e.persisted && this.resetSelect();
            }, false);
        },
        methods: {
            resetSelect () {
                _appItems.forEach(item => {
                   item.isSelect = item.selected;
                });
            },
            changeSelect (href) {
                let isLogin = storageMessager.getItem("isLogin", 0.5);
                if(this.isLogin == 0 && !isLogin){ 
                    storageMessager.send("loginSuc",this.href);
                    webBridge.openUrl(this.ajaxUrl.urlLogin, "blank", 1);                 
                }else if(this.isLogin == 0 && isLogin){
                    webBridge.popToSelectedController(this.href);
                }else{
                    this.isSelect = true;
                    _appItems.forEach(item => {
                        if(item !== this) item.isSelect = false;
                    })                    
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../../common/style/mixin";
    .nav-item{
        text-align: center;
        @include wh(100%, 98px);
        @include display-flex;
        @include flex-wrap(wrap);
        @include align-content(flex-start);
        @include justify-content(center);
        i{
            margin-top: rem(12px);
        }
        .name{
            padding-top: rem(6px);
            display: block;
            width: 100%;
            @include font-size(22px);
        }
    }
</style>