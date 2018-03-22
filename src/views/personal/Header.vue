<template>
    <div class="m-banner">
        <div class="cinema-group vh-between">
            <div class="cinema vh-left" @click="showCinema" v-if="user.isSelectCinema == 2">
                <i class="icon-cinema"></i>
                <span class="name">{{user.cinema.cinema_name}}</span>
                <i class="arrow-right"></i>
            </div>
            <div v-if="user.isSelectCinema != 2"></div>
            <i class="icon-setting" @click="setting"></i>
        </div>
        <div class="photo">
            <div class="me vh-center" @click="showMobile">
                <lazy-image :src="user.data.face_url" init-src="/images/common/152x152.jpg"/>
                <div class="icon-pen"></div>
            </div>
            <div class="name">{{user.data.nick}}</div>
        </div>
        <ul class="nav-items">
            <li class="item" v-href="user.nav[0]">
                <i class="icon-order"></i>
                <span class="name">票务</span>
            </li>
            <li class="item" v-href="user.nav[1]">
                <em class="vh-center hide">20</em>
                <i class="icon-pay"></i>
                <span class="name">卖品</span>
            </li>
            <li class="item" v-href="user.nav[2]">
                <em class="vh-center hide">8</em>
                <i class="icon-use"></i>
                <span class="name">会员卡</span>
            </li>
            <li class="item hide" @click="showMobile">
                <i class="icon-used"></i>
                <span class="name">已使用</span>
            </li>
        </ul>
        <select-cinema v-if="user.isSelectCinema == 2" :iphone-x="iphoneX" :url="user.url" :callback-url="user.callbackUrl" :show.sync="show" :select="selectCinema"/>
    </div>

</template>
<script>
    import {fire} from 'lib/comp/bus'
    import browser from "lib/util/browser"
    import webBridge from "common/utils/webBridge"
    export default {
        props: {user: Object},
        data () {
            return {
                show: false,
                iphoneX:"selectCinema"
            }
        },
        methods: {
            showMobile () {
                (this.user.bindMobile === 0) && fire("mobile");
            },
            showCinema () {
                this.show = true;
            },
            selectCinema (opt) {
                opt && fire("selectCinema");
            },
            setting(){
                if(browser.WX){
                    if(this.user.bindMobile === 0){
                        fire("mobile")
                    }else{
                        location.href = this.user.urlSettings;
                    }                    
                }else{
                    webBridge.openUrl(this.user.urlSettings);
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../common/style/mixin";
    .m-banner{
        @include wh(100%, 434px);
        @include size;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 100;
        &.fix{
            top: rem(-304px);
            position: fixed;
        }
    }
    .cinema-group{
        padding: rem(32px 24px 0);
    }
    .cinema{
        @include wh(226px, 52px);
        @include radius(rem(52px));
        padding: rem(0 16px 0 20px);
        @include box-sizing;
        .name{
            @include flex(1);
            @include font-size(24px);
            @extend %ellipsis-basic;
            padding: rem(0 8px);
        }
        .arrow-right{
            @include arrow-right;
        }
    }
    .photo{
        @include left_center;
        top: rem(59px);
        text-align: center;
        background: img-url("personal_banner.png") no-repeat;
        background-size: 100% 60%;
        background-position-y: rem(20px);
        .me{
            position: relative;
            margin: auto;
            @include wh(160px);
            @include radius(rem(160px));
            img{
                @include wh(142px);
                @include radius(rem(142px));
            }
            .icon-pen {
                position: absolute;
                right: rem(4px);
                bottom: 0;
            }
        }
        .name{
            padding-top: rem(15px);
            @include font-size(32px);
            @include ellipsis(rem(300px));
            margin: auto;
        }
    }
    .nav-items{
        @include display-flex;
        @include justify-content(space-around);
        @include align-items(center);
        @include wh(100%, 130px);
        position: absolute;
        bottom: 0;
        left: 0;
        .item{
            text-align: center;
            @include wh(100%, 130px);
            @include display-flex;
            @include flex-wrap(wrap);
            @include align-content(space-between);
            @include justify-content(center);
            position: relative;
            em{
                position: absolute;
                @include height(26px);
                @include radius(rem(26px));
                padding: rem(0 8px);
                @include font-size(18px);
                right: rem(55px);
                top: rem(12px);
            }
            i{
                margin-top: rem(23px);
            }
            .name{
                padding-top: rem(6px);
                display: block;
                width: 100%;
                @include font-size(26px);
                padding-bottom: rem(23px);
            }
        }
    }
</style>