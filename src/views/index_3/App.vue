<template>
    <div class="m-count">
        <template v-if="!queryParams.a && options.data.isSelectCity == 3">
            <app-select-city
                @close="close"
                :url="apiLocation"
                :btnCloseSwitch="'off'"
                ref='selectCity'
            ></app-select-city>
        </template>
        <template v-else>
            <top-nav :nav="nav" :mode="navMode" :options="options" v-if="options.data.isSelectCity == 3 || options.data.isSelectCity == 2"></top-nav>
            <ul class="m-movies-nav fixed-top" v-if="show && nav[0].active" v-show="activeView == nav[0].title">
                <li class="item selected">正在热映</li>
                <li class="item" v-href="options.href.urlNew" data-target="self">即将上映</li>
                <li class="item vh-center hide"><span>票房榜</span><i class="arrow-right"></i></li>
            </ul>
            <div class="scrolling movie" v-show="nav[0].active">
                <promotion
                    :images="options.bannerImage"
                    :apiActi="options.href.urlActview"
                    :apiCode="options.href.apiSendsmsmobile"
                    :apiBind="options.href.apiBindmobile"
                    :boundMobile.sync="options.data.bindMobile"
                    :is-login="options.data.is_login"
                    :ajax-url="options.href"
                ></promotion>
                <movies :options="options" :image="image" ref="movies"></movies>
            </div>

            <!-- <div class="scrolling cinema" v-show="nav[1].active">
				<cinemas :options="options" ref="cinemas"></cinemas>
			</div> -->

            <app-nav-items v-if="options.bottomNavItems">
                <app-item icon="home" selected="true" name="推荐"></app-item>
                <app-item icon="find" :href="options.bottomNavItems[1]" name="发现"></app-item>
                <app-item icon="store" :href="options.bottomNavItems[2]" name="商城"></app-item>
                <app-item icon="me" :href="options.bottomNavItems[3]" name="我的" :is-login="options.data.is_login" :ajax-url="options.href"></app-item>
            </app-nav-items>

            <popup-ad
                :adData="adData"
                :apiCode="apiCode"
                :apiActi="apiActi"
                :apiBind="apiBind"
                :boundMobile.sync="options.data.bindMobile"
                v-if="adData && adData.img"
                :is-login="options.data.is_login"
                :ajax-url="options.href"
            ></popup-ad>
        </template>
        <version-update :show.sync="showUpdate" :appInfo="appInfo" :has-new="hasNew" />
    </div>
</template>

<script>
import Promotion from 'common/components/promotionSlides'
import TopNav from './TopNavLite'
import Movies from './Movies'
import viewport from 'lib/comp/viewport'
import {bind, fire} from 'lib/comp/bus'
import {object} from 'common/utils/defaultProps'
import AppSelectCity from 'common/plugin/selectCity/content'
import query from 'lib/json/query'
import urlUtil from "lib/util/URL"
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"

let queryParams = query.parse(location.search.slice(1));
let urlParams = urlUtil.parse(location.href);

export default {
    props: {
        options: object,
    },
    data() {
        return {
            image: this.options.bannerImage && this.options.bannerImage.length > 0,
            show: false,
            height: 312,
            queryParams,
            apiLocation: this.options.href.apiCitylist,
            isShowNav: true,
            activeView: "movie", // movie | cinema
            nav: [
                {
                    title: "movie",
                    active: true
                },
                {
                    title: "cinema",
                    active: false
                }
            ],
            navMode: null,
            apiCode: this.options.href.apiSendsmsmobile,
            apiBind: this.options.href.apiBindmobile,
            apiActi: this.options.href.urlActview,
            isLogin: this.options.data.is_login,
            agreement: this.options.data.agreement,
            showUpdate: false,
            appInfo: JSON.parse(this.options.data.appInfo || '{}'),
            hasNew: null,
        }
    },
    computed: {
        adData(){
            if (this.options.popup) {
                return this.options.popup[0]
            }
        },
    },
    components: {
        TopNav,
        Promotion,
        Movies,
        AppSelectCity
    },
    mounted () {
        this.scroll();
        this.image && window.addEventListener("scroll", this.scroll);
        this.height = viewport.rem() / 75 * this.height;
        this.show = !this.image;

        this.navMode = this.show ? 2 : 1;

        if(!browser.WX){
            setTimeout(this.compareVer,2000);
        }
    },
    methods: {
        scroll () {
            if (this.nav[1].active) {
                return;
            }
            this.show = window.scrollY > this.height;
            this.navMode = this.show ? 2 : 1;
        },
        showView (viewName) {
            const vm = this;
            vm.nav.forEach((item) => {
                if (item.title == viewName) {
                    item.active = true;
                } else {
                    item.active = false;
                }
            });

            if (viewName == "cinema") {
                vm.navMode = 3
            } else {
                vm.scroll();
            }
        },
        close(opt) {
            if (!opt) {
                return;
            }
            let params = {
                a: opt.cityCode,
            };
            params = Object.assign({}, urlParams.queryJson, params);
            location.assign(query.url(location.pathname, params));
        },
        compareVer(){
            let vm = this;
            if(!this.options.data.appInfo) return;
            let version_code = +vm.appInfo.version_code;
            let versionName = vm.appInfo.version_name;
            webBridge.checkHaveNewApp(versionName, res=>{
                if(res.code != 0) return;
                let n = version_code - (+res.data.versionCode);
                if(res.data.alreadyDownload == 0 && n > 0){
                    vm.hasNew = false;
                    vm.showUpdate = true;
                    if(n > 1) vm.appInfo.strong = 0;
                }else if(res.data.alreadyDownload == 1){
                    vm.hasNew = true;
                    vm.showUpdate = true;
                }
            })
        }
    }
}

</script>

<style lang="scss" scoped>
    @import '../../common/style/mixin';

    .m-movies-nav {
        @include display-flex;
        @include justify-content(space-around);
        @include align-items(center);
        @include height(80px);
        padding: rem(0 20px);
        width: 100%;
        @include box-sizing;
        &.fixed-top{
            position: fixed;
            top: 0;
            left: 0;
            z-index: 12;
            @include height(100px);
            padding: rem(20px 20px 0);
        }
        .item{
            @include font-size(28px);
            width: 100%;
            text-align: center;
            .arrow-right{
                @include arrow-right;
                margin: rem(3px -10px 0 10px);
            }
        }
        .selected{
            position: relative;
            &:before{
                content: "";
                position: absolute;
                @include wh(54px, 4px);
                bottom: rem(-24px);
                left: 50%;
                margin-left: rem(-27px);
            }
        }
    }
</style>
