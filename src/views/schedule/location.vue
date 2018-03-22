<template>
    <div class="top" :class="{p_b: !!data.firstAd}">
        <!--<div class="cinema vh-left" @click="showDialog">-->
            <!--<i class="icon-location"></i>-->
            <!--<div class="cinemaName">{{cinema.cinema_name}}</div>-->
            <!--<div class="arrow"></div>-->
        <!--</div>-->
        <cinema-location @show="showDialog" @change="changeCinema"
                :name="data.cinema.cinema_name"
                :address="data.cinema.cinema_address"
                :can-select="canSelect"
        ></cinema-location>
        <select-cinema v-if="data.isSelectCinema == 2" :show.sync="show" @select="selectCinema"  :callback-url="data.callbackUrl" :url="data.url"/>
        <template v-if="data.firstAd">
            <div class="ad-img" v-if="data.firstAd.img" v-href="data.firstAd.url">
                <lazy-image :src="data.firstAd.img" init-src="/images/common/702x286.jpg"/>                
            </div>
            <div class="ad vh-left" v-else v-href="data.firstAd.url">
                <div class="info">
                    <div class="name">{{data.firstAd.title}}</div>
                    <!-- <div class="information">购票享8折 开通首单9.9元购票</div> -->
                </div>
                <i class="arrow-right" v-if="data.firstAd.url"></i>
            </div>
            <ad-compass :ad='data.firstAd' v-if="data.firstAd.contentID"/>
        </template>
    </div>
</template>

<script>
    import popup from 'lib/layer/popup'
    import slideBottom from 'common/components/cinemaDetails'
    import cinemaLocation from "common/components/cinemaLocation.vue"
    import adCompass from "common/components/adCompass"
    import {fire} from 'lib/comp/bus'

    export default {
        props: {
            data : {
                type: Object,
                default () {
                    return {};
                }
            }
        },
        components: {
            cinemaLocation,
            adCompass
        },
        data () {
            return {
                bottomPopup: null,
                canSelect: this.data.isSelectCinema == 2,
                show: false
            }
        },
        methods: {
            showDialog() {
                this.bottomPopup.show();
            },
            changeCinema() {
                this.show = true;
            },
            selectCinema(opt) {
                opt && fire("changeCinema", opt);
            }
        },
        mounted () {
            const self = this;
            self.bottomPopup = popup("<slide-bottom :cinema='cinema' @close='close'/>",{
                option: {
                    autoHide: true,
                    animate: {
                        name: "slide-bottom"
                    }
                },
                popup: {
                    data () {
                        return {
                            cinema: self.data.cinema
                        }
                    },
                    methods: {
                        close () {
                            self.bottomPopup.hide();
                        }
                    },
                    components: {
                        slideBottom
                    }
                }
            });
            self.bottomPopup.setPosition(0,"auto","auto",0);
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../common/style/mixin";
    .arrow-right {
        @include arrow-right;
        margin-right: rem(-10px);
        margin-left: rem(15px);
    }
    .top {
        .m-cinema-location{
            margin-bottom: 0;
        }
        &.p_b{
            padding-bottom: rem(34px);
            .m-select-cinema{
                margin-bottom: rem(6px);
            }
        }
        @include box-sizing(border-box);
        /*.cinema {
            position: relative;
            padding:rem(34px 0);
            @include font-size(28px);
            .arrow {
                @include arrow-right;
                margin-right: rem(-10px);
            }
            .cinemaName{
                @include flex(1);
                padding-left: rem(12px);
                @extend %ellipsis-basic;
            }
        }*/
        .ad {
            padding: rem(0 20px);
            height: rem(90px);
            margin: rem(0 24px);
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

        .ad-img {
            >img {
                max-width: 100%;
            }
        }
    }
</style>
