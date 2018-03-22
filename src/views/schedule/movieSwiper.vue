<template>
    <div class="banner">
        <!--<div class="movie-bg"></div>-->
        <div class="filter-blur">
            <lazy-image :src="bgSrc" init-src="/images/common/292x410.jpg" auto-destroy="no"/>
            <div class="overlay"></div>
        </div>
        <swiper class="movie-swiper" :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
            <swiper-slide v-for="(item,index) in movies" :key="index">
                <div class="wrap-img"><lazy-image class="image" scale="0.7" :src="item.poster" init-src="/images/common/292x410.jpg"/></div>
            </swiper-slide>
        </swiper>
        <shows :href="href" :option="option" :actConfig="actConfig"></shows>
    </div>
</template>
<script>
    import { swiper, swiperSlide } from 'common/plugin/swiper'
    import Shows from "./shows"
    import query from "lib/json/query"

    export default {
        props: {
            movies: {
                type: Array,
                default() {
                    return []
                }
            },
            href: {
                type: Object,
                default() {
                    return {}
                }
            },
            filmCode: String,
            actConfig: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        components: {
            swiper, swiperSlide,
            Shows
        },
        data() {
            const vm = this;
            let index = 2, stop =false;
            this.movies.forEach((item, i) => {
                 if(!stop && item.code === this.filmCode){
                     index = i;
                     stop = true;
                 }
            });
            return {
                bgSrc: "",
                code: null,
                score: null,
                option: {},
                notNextTick: true,
                swiperOption: {
                    initialSlide: index,
                    slidesPerView: 5,
                    centeredSlides: true,
                    onInit(ev) {
                        const item = vm.movies[ev.activeIndex];
                        vm.bgSrc = item.poster;
                        vm.option = item;
                    },
                    onTap(swiper) {
                        vm.$refs.mySwiper.swiper.slideTo(swiper.clickedIndex);
                    },
                    onSlideChangeStart(ev) {
                        const item = vm.movies[ev.activeIndex];
                        vm.bgSrc = item.poster;
                        vm.option = item;
                        vm.updateUrlState(item.code);
                    }
                }
            }
        },
        methods: {
            updateUrlState(filmCode) {
                let queryJson = query.parse(location.search.slice(1));
                queryJson.film_code = filmCode;
                let queryStr = query.stringify(queryJson);
                history.replaceState(null, "", "?" + queryStr)
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../common/style/mixin";
    .banner {
        position: relative;
        overflow: hidden;
        @include min-height(300px);
    }

    .movie-swiper {
        @include wh(100%, 234px);
        position: absolute;
        left: rem(-6px);
        top: 0;
    }
    .filter-blur{
        @include wh(100%, 234px);
        overflow: hidden;
        position: relative;
        img{
            width: 120%;
            margin: rem(-10% 0 0 -10%);
            @include filter-blur(10px);
        }
        .overlay{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }
    }
    .swiper-container {
        overflow: visible !important;
    }
    .wrap-img {
        margin-top: rem(28px);
        @include wh(127px, 180px);
        @include radius(rem(6px));
        @include transition(all 0.3s ease);
        overflow: hidden;
    }
    .image{
        width: 100%;
        height: 100%;
    }
    .swiper-slide-active{
        width: rem(186px) !important;
        .wrap-img {
            @include wh(164px, 234px);
            @include box-sizing;
        }

    }
</style>
