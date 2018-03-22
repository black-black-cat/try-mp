<template>
    <div>
        <div class="m-swiper" ref="swipe">
            <swiper :options="swiperOption1" :not-next-tick="notNextTick" ref="mySwipe1">
                <swiper-slide v-for="(item,index) in films" :key="index">
                    <div class="scale-image"><lazy-image class="image" scale="0.7" :src="item.poster" init-src="/images/common/292x410.jpg"/></div>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </div>
        <div class="m-swiper-fix" ref="swipeFix">
            <div class="movie-title">{{filmName}}</div>
            <swiper :options="swiperOption2" :not-next-tick="notNextTick" ref="mySwipe2">
                <swiper-slide v-for="(item,index) in films" :key="index">
                    <lazy-image class="image" scale="0.7" :src="item.poster" init-src="/images/common/292x410.jpg"/>
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>
<script>
    import { swiper, swiperSlide } from 'common/plugin/swiper'
    import {bind, fire} from 'lib/comp/bus'
    import viewport from 'lib/comp/viewport'
    import openUrl from 'common/utils/openUrl'

    export default {
        props: {
            films: {type: Array, default () {return []}},
            options: {type: Object, default () {return {}}},
            isOpenUrl: {
                type: Boolean,
                default: true
            }
        },
        components: {
            swiper,
            swiperSlide
        },
        mounted () {
            bind("scroll.fix", this.scroll);
            const rem = viewport.rem();
            this.height = rem / 75 * this.height;
        },
        data() {
            const vm = this;
            return {
                notNextTick: true,
                fix: false,
                isChange: false,
                height: 235,
                filmName: "",
                swiperOption1: {
                    pagination: '.swiper-pagination',
                    initialSlide: 1,
                    slidesPerView: "auto",
                    centeredSlides: true,
                    onInit(ev) {
                        const item = vm.films[ev.activeIndex];
                        vm.filmName = item.name;
                        vm.$emit("change", item);
                    },
                    onTap(swiper) {
                        let clickedIndex = swiper.clickedIndex;
                        if (vm.isOpenUrl && clickedIndex == swiper.activeIndex) {
                            vm.openMovie(clickedIndex)
                        }
                        vm.$refs.mySwipe1.swiper.slideTo(clickedIndex);
                    },
                    onSlideChangeStart(ev) {
                        const item = vm.films[ev.activeIndex];
                        vm.filmName = item.name;
                        !vm.isChange && vm.$refs.mySwipe2.swiper && vm.$refs.mySwipe2.swiper.slideTo(ev.activeIndex);
                        vm.$emit("change", item);
                    }
                },
                swiperOption2: {
                    initialSlide: 1,
                    slidesPerView: "auto",
                    centeredSlides: true,
                    onInit(ev) {
                        const item = vm.films[ev.activeIndex];
                        vm.filmName = item.name;
                        vm.$emit("change", item);
                    },
                    onTap(swiper) {
                        vm.$refs.mySwipe2.swiper.slideTo(swiper.clickedIndex);
                    },
                    onSlideChangeStart(ev) {
                        const item = vm.films[ev.activeIndex];
                        vm.filmName = item.name;
                        vm.isChange && vm.$refs.mySwipe1.swiper && vm.$refs.mySwipe1.swiper.slideTo(ev.activeIndex);
                        vm.$emit("change", item);
                    }
                }
            }
        },
        methods: {
            scroll (obj) {
                const y = obj.top - obj.height;
                if(!this.isChange && y >= this.height){
                    this.isChange = true;
                    this.$refs.swipeFix.classList.add("show-swipe");
                    this.$refs.swipe.classList.add("hide-swipe");
                    fire("fixedDateTab", true);
                }else if(this.isChange && y < this.height){
                    this.isChange = false;
                    this.$refs.swipeFix.classList.remove("show-swipe");
                    this.$refs.swipe.classList.remove("hide-swipe");
                    fire("fixedDateTab", false);
                }
            },
            openMovie(index) {
                const vm = this;
                const item = vm.films[index];
                openUrl(vm.options.href.urlFilm, {film_code: item.code});
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../common/style/mixin";
    .m-swiper {
        position: absolute;
        overflow: hidden;
        width: 100%;
        @include height(435px);
        @include transition(all 0.5s);
        @include translateY(0%);
        @include opacity(100);
        &.hide-swipe{
            @include translateY(100%);
            @include opacity(0);
        }
        .swiper-container {
            @include wh(100%, 412px);
            overflow: visible !important;
        }
        .swiper-slide {
            margin: rem(0 17px);
            @include wh(294px, 410px);
            .scale-image{
                @include radius(rem(10px));
                @include wh(231px, 330px);
                overflow: hidden;
                margin: rem(67px auto 0);
                @include transition(all 0.3s ease);
            }
        }

        .swiper-slide-active{
            //margin-top: rem(25px);
            //@include wh(294px, 410px);
            .scale-image{
                margin-top: rem(25px);
                @include wh(294px, 410px);
            }
        }
        .swiper-pagination{
            bottom: 0;
        }
    }

    .m-swiper-fix{
        position: fixed;
        /*top: rem(80px);*/
        top: 0;
        left: 0;
        z-index: 10;
        @include wh(750px, 200px);
        @include transition(all 0.5s);
        @include translateY(-100%);
        @include opacity(0);
        &.show-swipe{
            @include translateY(0);
            @include opacity(100);
        }
        .swiper-container {
            @include wh(750px, 200px);
        }
        .swiper-slide {
            margin: rem(0 21px -30px);
            @include wh(0.8*94px, 0.8*132px);
            @include radius(7px);
            @include transition(all 0.3s ease);
            overflow: hidden;
        }
        .swiper-slide-active{
            //@include wh(128px, 178px);
            //margin-bottom: rem(-38px);
            @include wh(94px, 132px);
            @include radius(7px);
            @include box-sizing;
        }
    }

    .movie-title{
        text-align: center;
        width: 100%;
        @include font-size(28px);
        @include lt(60px);
        position: absolute;
        top: 0;
        z-index: 10;
    }

    .image{
        width: 100%;
        height: 100%;
    }
</style>
<style lang="scss">
    @import "../../common/style/mixin";
    .m-swiper-fix .swiper-wrapper{
        @include align-items(flex-end);
    }
    .m-swiper .swiper-wrapper{
        //position: absolute;
        //left: rem(-26px);
    }
    .swiper-pagination-bullet{
        @include wh(12px);
        opacity: 1 !important;
        margin: rem(0 5px) !important;
    }

    .swiper-pagination-bullet-active{
        @include wh(16px);
    }
</style>
