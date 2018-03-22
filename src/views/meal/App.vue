<template>
    <div class="m-views-meal">
        <app-cinema v-if="isSelectCinemaView" :iphone-x="iphoneX" ref="cinema" :url="url" :close-show="false" @close="close"></app-cinema>
        <template v-else>
            <div class="meal">
                <app-header :images="images"></app-header>
                <app-content :options='options'></app-content>
            </div>
            <app-foot :options="options" @showMobile="open"></app-foot>
            <app-nav-items v-if="options.bottomNavItems">
                <app-item icon="home" :href="options.bottomNavItems[0]"  name="推荐"></app-item>
                <app-item icon="find" :href="options.bottomNavItems[1]" name="发现"></app-item>
                <app-item icon="store" selected="true" :href="options.bottomNavItems[2]" name="商城"></app-item>
                <app-item icon="me" :href="options.bottomNavItems[3]" name="我的" :is-login="options.data.is_login" :ajax-url="options.href"></app-item>
            </app-nav-items>
        </template>
        <bind-mobile :show.sync="show" @onBindSuccess="bindSuccess"  :url="options.href.apiSendsmsmobile" :subUrl="options.href.apiBindmobile"/>
    </div>
</template>
<script>
import { swiper, swiperSlide } from 'common/plugin/swiper'
import appContent from './Content';
import appFoot from './Foot';
import appHeader from 'common/components/promotionSlides'
import query from 'lib/json/query'
import appCinema from 'common/plugin/selectCinema/content.vue'

let urlParams = query.parse(location.search.slice(1));

export default {
    props: ["options"],
    data() {
        return {
            images: this.options.bannerImage || [],
            show: false,
            cinemaCode: urlParams.ci,
            mode: this.options.data.isSelectCinema,
            url: this.options.href.apiCinemalist,
            swiperOption: {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                autoplay: 3000
            },
            iphoneX:"selectCinema"
        }
    },
    computed: {
        isSelectCinemaView() {
            return this.mode == 3 && !this.cinemaCode;
        }
    },
    components: {
        appHeader,
        appContent,
        appFoot,
        swiper,
        swiperSlide,
        appCinema
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.cinema && this.$refs.cinema.initShow()
        })
    },
    methods: {
        open () {
            this.show = true;
        },
        bindSuccess() {
            this.options.data.bindMobile = 1
        },
        close (opt){
            const data = opt.data;
            location.assign(query.url(opt.url, {
                url: this.options.data.callbackUrl,
                a: data.area_code,
                ci: data.cinema_code
            }));
        },
//        isSelectCinemaView() {
//            return this.mode == 3 && !this.cinemaCode;
//        }
    }
}
</script>
<style lang="scss">
@import "../../common/style/mixin";
html,body {
    height: 100%;
}
.m-views-meal {
    @include display-flex(flex);
    @include flex-direction(column);
    height: 100%;
    @include flex(1);
    .meal {
        padding-bottom: rem(98px);
        height: 100%;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
    }
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: rgba(255,255,255,0);
}
</style>
