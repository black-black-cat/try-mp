<template>
    <section class="m-content" :class="{m_top: !image, 'min-h': films && films.length}">
        <ul class="m-index-tab" v-if="image">
            <li class="item selected">正在热映</li>
            <li class="item" v-href="options.href.urlNew" data-target="self">即将上映</li>
            <li class="item vh-center hide"><span>票房榜</span><i class="arrow-right"></i></li>
        </ul>

        <template v-if="films && films.length">
            <app-swiper @change="change" :options="options" :films="films"></app-swiper>
            <div class="film-info" v-href="options.href.urlFilm" :data-query="'film_code='+film.code">
            <div class="film-name"><span class="text">{{ film.name }}</span><span class="score" v-html="setScore(film.score)"></span></div>
            <div class="film-type vh-left"><span>{{ film.show_type_names }}</span><span class="line"></span><span>{{ film.type }}</span></div>
            <div class="film-desc">{{ (film.highlight || "").replace(/^\-/, "") || (film.intro||"").replace(/^\-/, "") }}</div>
            <div class="give-like vh-center" @click.stop="toggle($event)" v-if="false">
                <i data-type="like" class="icon-hand-like"></i>
                <span class="line"></span>
                <i data-type="dislike" class="icon-hand-dislike"></i>
            </div>
            <ul class="film-photos vh-left">
                <li class="photo" v-for="(actor, i) in (film.creator || []).slice(0, 4)" :key="i" v-if="actor.pic">
                    <!--<lazy-image :src="actor.pic" init-src="/images/common/152x152.jpg"/>-->
                    <img v-if="actor.pic" :src="actor.pic" alt="">
                    <lazy-image v-else scale="1" :src="actor.pic" init-src="/images/common/152x152.jpg"/>
                </li>
                <li class="photo more vh-center" style="opacity: 0;height: 0"><i class="icon-more"></i></li>
            </ul>
            
            <div class="activity vh-left" v-if="film.activity_no && film.activity_tag && film.activity_type" v-href="film.activity_url">
                <span class="icon" :class="device" >活动</span>
                <span class="text">{{film.activity_tag}}</span>
            </div>
            <div class="video-signal vh-left" v-if="discoverys && discoverys[film.code]" v-href="options.href.urlFind" :data-query="'id='+discoverys[film.code].id">
                <span class="icon" :class="device">影讯</span>
                <span class="text">{{discoverys[film.code].title}}</span>
            </div>
            <div class="shop-btn vh-center" v-href="options.href.urlCinemafilmlist" :data-query="'film_code='+film.code">
                <span class="name">购票</span>
                <span class="sub" v-if="film.activity_price">特惠 {{film.activity_price}} 元</span>
                <span class="sub" v-else>{{film.min_show_price}}元起</span>
            </div>
        </div>
        </template>
        <div class="vh-center error-info" v-if="isShowError">
            <error :msg="errorTip" refresh="true"></error>
        </div>

        <template v-if="firstAd">
            <div class="ad-image scroll-fix" v-if="firstAd.img" v-href="firstAd.url">
                <lazy-image :src="firstAd.img" init-src="/images/common/702x286.jpg"/>
            </div>
            <div class="ad-info vh-between" v-else @click="openCards">
                <div class="info">
                    <div class="name">{{firstAd.title}}</div>
                    <div class="information">购票享8折 开通首单9.9元购票</div>
                </div>
                <i class="icon-star"></i>
                <!--<i class="arrow-right" v-if="firstAd.url"></i>-->
            </div>
        </template>
        <app-show :option="showList" :href="options.href" v-if="!isShowError"></app-show>
        <version-update :show.sync="showUpdate" :appInfo="appInfo" :has-new="hasNew" />
    </section>
</template>
<script>
    import dialogManager from 'common/plugin/dialog'
    import viewport from 'lib/comp/viewport'
    import appSwiper from './Swiper.vue'
    import appShow from './ShowTime.vue'
    import openUrl from 'common/utils/openUrl'
    import error from 'common/components/error.vue'
    import browser from "lib/util/browser"
    import webBridge from "common/utils/webBridge"

    export default {
        props: {
            options: {
                type: Object,
                default () {
                    return {}
                }
            }
        },
        data () {
            return {
                apiFilms: this.options.href.apiFilms,
                isShowError: false,
                errorTip: "",
                films: null,
                discoverys: null,
                film: {},
                showList: {},
                href: {},
                firstAd: '', //{title: "影城会员卡", url: this.options.href.urlMcard}
                image: this.options.bannerImage && this.options.bannerImage.length > 0,
                device: viewport.getDeviceType() === 'iphone' ? 'iphone vh-center': 'android line-center',
                showUpdate: false,
                appInfo: JSON.parse(this.options.data.appInfo || '{}'),
                hasNew: null,
            }
        },

        components: {
            appSwiper,
            appShow,
            error
        },
        created() {
            this.getFilms()
        },
        mounted(){
            if(!browser.WX){
                setTimeout(this.compareVer,2000); 
            }
        },
        methods: {
            getFilms() {
                const vm = this;
                if(!!vm.apiFilms) {
                    vm.films = vm.apiFilms.data.films || [];
                    if (!vm.films.length) {
                        vm.showError();
                    }
                    vm.discoverys = vm.apiFilms.data.discoverys || {};
                } else {
                    vm.showError("获取影片失败");
                }
                // dialogManager.wait();
                // vm.$http.get(vm.apiFilms).then((res) => {
                //     // console.dir(res)
                //     vm.films = res.data.films || [];
                //     if (!vm.films.length) {
                //         vm.showError();
                //     }
                //     vm.discoverys = res.data.discoverys || {};
                //     dialogManager.closeWait();
                // }).catch((errData) => {
                //     dialogManager.closeWait();
                //     vm.showError("获取影片失败");
                // })
            },
            showError(tip = "空空如也~") {
                const vm = this;
                vm.errorTip = tip;
                vm.isShowError = true;
            },
            change (opt) {
                this.film = opt;
                this.showList = {code: opt.code};
            },
            setScore (str = "0.0") {
                const arr = str.toString().match(/^(\d+)\.?(\d*)$/);
                return arr ? `<span>${arr[1]}</span><span class="small">.${arr[2].length > 0 ? arr[2] : 0}</span>` : 0;
            },
            openCards() {
                if (this.options.data.bindMobile == 0) {
                    this.$emit("showBindMobile");
                    return;
                }
                openUrl(this.options.href.urlMcard)
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
<style lang="scss">
    @import "../../common/style/mixin";
    @import "../../../font/scoreFont/index.css";

    //iphone和android
    @mixin iphone($w, $h) {
        &.line-center {
            @include width($w);
            @include lt($h - 2px);
            text-align: center;
        }
        &.vh-center {
            @include wh($w, $h);
            @include box-sizing;
        }
    }

    .error-info {
        height: rem(500);
    }

    %title{
        @include font-size(26px);
        padding: rem(34px 0 24px);
        .line{
            @include wh(40px, 1px);
        }
    }
    %item{
        @include height(84px);
        padding-left: rem(24px);
        .icon{
            @include font-size(18px);
            @include iphone(50px, 30px);
            @include radius(rem(4px));
        }
        .text{
            @include flex(1);
            @extend %ellipsis-basic;
            @include font-size(28px);
            padding-left: rem(10px);
        }
    }
    .m-content{
        @include clearfix();
        padding-bottom: rem(140px);

        &.min-h {
            min-height: rem(2500);
        }
    }
    .m-scroll-loading{
        padding-top: rem(40px);
    }

    .film-info{
        @include radius(rem(10px));
        margin: rem(491px 24px 0);
        position: relative;
    }

    .film-name{
        padding: rem(60px 0 0 24px);
        @include font-size(36px);
        @include display-flex;
        @include align-items(flex-start);
        .text{
            padding-right: rem(10px);
            max-width: rem(600px);
            @extend %ellipsis-basic;
        }
        .score{
            font-family: 'scoreFont';
            @include font-size(32px);
            @include display-flex;
            @include align-items(flex-start);
            .small{
                @include font-size(24px);
                margin-top: rem(2px);
            }
        }
    }
    .film-type{
        padding: rem(20px 0 0 24px);
        width: 100%;
        @extend %ellipsis-basic;
        @include font-size(22px);
        .line{
            @include wh(0, 18px);
            margin: rem(2px 10px 0);
        }
    }
    .film-desc{
        box-sizing: border-box;
        padding: rem(30px 0 0 24px);
        width: 100%;
        // @extend %ellipsis-basic;
        line-height: rem(40px);
        @include line-clamp(2);
        @include font-size(26px);
    }
    .give-like{
        position: absolute;
        top: rem(78px);
        right: rem(32px);
        z-index: 1;
        .line{
            @include wh(0, 26px);
            margin: rem(0 32px);
        }
    }
    .activity,.video-signal{
        @extend %item;
    }
    .shop-btn{
        @include left_center;
        top: rem(-36px);
        @include box-sizing;
        @include wh(238px, 72px);
        @include radius(rem(238px));
        .name{
            @include font-size(36px);
        }
        .sub{
            padding: rem(14px 0 0 10px);
            @include font-size(22px);
        }
    }
    .film-photos{
        padding: rem(32px 0 32px 24px);
        .photo{
            @include wh(72px);
            @include radius(rem(72px));
            overflow: hidden;
            margin: rem(0 14px);
            img{
                width: 100%;
                height: 100%;
            }
        }
    }

    .ad-info {
        margin: rem(24px);
        height: rem(90px);
        padding: rem(0 24px);
        @include box-sizing;
        @include radius(rem(5px));
        overflow: auto;
        .info{
            @include flex(1);
        }
        .name {
            @include font-size(28px);
            @include ellipsis(80vw);
        }
        .information {
            padding-top: rem(10px);
            @include font-size(20px);
            @include ellipsis(80vw);
        }

    }

    .ad-image {
        margin: rem(24px);
        >img {
            max-width: 100%;
        }
    }
</style>
