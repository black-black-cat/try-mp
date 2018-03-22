<template>
    <div class="m-banner">
        <!--<swiper :options="swiperOption" ref="swiper" v-if="images.length > 0">
            <swiper-slide v-for="(item, index) in images" :key="index"><lazy-image v-href="item.url" :src="item.img" init-src="/images/common/750x312.jpg"/></swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>-->
        <promotion :images="images" :apiActi="href.urlActview" :apiCode="href.apiSendsmsmobile" :apiBind="href.apiBindmobile" :boundMobile.sync="options.data.bindMobile" :is-login="isLogin" :ajax-url="href"></promotion>
        <div class="tap-cinema vh-center" @click="showPopup" v-if="options.data.isSelectCinema == 1"><i class="icon-cinema"></i></div>
    </div>
</template>
<script>
    import { swiper, swiperSlide } from 'common/plugin/swiper'
    import {array, object} from 'common/utils/defaultProps'
    import CinemaDetails from "common/components/cinemaDetails";
    import popup from 'lib/layer/popup';
    import Promotion from "common/components/promotionSlides";

    export default {
        props: {
            images: array,
            cinema: object,
            href: object,
            options: object,
            isLogin:{
                type:String
            }
        },
        data () {
            return {
                swiperOption: {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    autoplay: 3000
                }
            }
        },
        mounted() {
            this.createPopup();
        },
        components: {
            swiper,
            swiperSlide,
            CinemaDetails,
            Promotion
        },
        methods: {
            createPopup() {
                const vm = this;
                vm.popup = popup('<cinema-details :cinema="cinema"  @close="close"/>', {
                    option: {
                        autoHide: true,
                        animate: {
                            name: "slide-bottom"
                        }
                    },
                    popup: {
                        data () {
                            return {
                                cinema: vm.cinema
                            }
                        },
                        methods: {
                            close () {
                                vm.popup.hide();
                            }
                        },
                        components: {
                            CinemaDetails
                        }
                    }
                });
                vm.popup.setFullScreen(true, false);
                vm.popup.setPosition(0, "auto", "auto", 0);

            },
            showPopup() {
                const vm = this;
                vm.popup.show();
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../common/style/mixin";

    /*.swiper-container{
        @include wh(100%, 312px);
        img{
            width: 100%;
            height: 100%;
        }
    }*/
    .m-banner{
        position: relative;
        min-height: rem(84);
    }
    .tap-cinema{
        position: absolute;
        z-index: 10;
        top: rem(24px);
        right: rem(20px);
        @include wh(62px);
        @include radius(rem(62px));
    }
</style>