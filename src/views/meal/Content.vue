<template>
    <div class="content" :class="boxClass">
        <div class="address" v-if="options.data.isSelectCinema != 1" @click="showCinema">{{this.cinemaName}}<i class="arrow-down"></i></div>
        <select-cinema :show.sync="show" v-if="options.data.isSelectCinema != 1" :iphone-x="iphoneX" @select="selectCinema" :callback-url="options.data.callbackUrl" :url="options.href.apiCinemalist"/>
        <template v-for="item in snackList">
            <div class="meal">
                <div class="img">
                    <lazy-image :src="item.image" init-src="/images/common/meal-default.jpg"/>
                </div>
                <div class="info">
                    <div>{{item.name}}</div>
                    <div>{{item.remark}}</div>
                    <div><span>¥{{item.net_price}}</span><span class="std-price">门市价<span>¥{{item.std_price}}</span></span></div>
                </div>
                <div class="sum" :data-code="item.code">
                    <transition name="slide-right">
                        <div class="reduce" v-show="item.count > 0" @click.stop="count"></div>
                    </transition>
                    <transition name="slide-right">
                        <div class="count" v-show="item.count > 0">{{item.count}}</div>
                    </transition>
                    <div class="add" @click.stop="count"></div>
                </div>
            </div>
        </template>
        <template v-if="!!snackList && snackList.length == 0">
            <div class="blank">
                <div><img src="/images/common/error.png" alt=""></div>
                <div>空空如也~</div>
            </div>
        </template>
        <template v-else-if="!!snackList && snackList.length > 0">
            <div class="more vh-center"><span class="line"></span><span class="text">哟哟~到底了</span><span class="line"></span></div>
        </template>
    </div>
</template>
<script>
import {bus, get, lock, unLock, isLock} from 'lib/comp/bus'
import viewport from 'lib/comp/viewport'
import dialogManager from 'common/plugin/dialog';
import browser from "lib/util/browser"
export default {
    props: ["options"],
    data() {
        return {
            snackList: null,
            device: viewport.getDeviceType() === 'iphone' ? 'iphone vh-center': 'android line-center',
            cinemaName: options.data.cinema.cinema_name,
            show: false,
            isWX: browser.WX,
            iphoneX:"selectCinema"
        }
    },
    computed:{
        boxClass(){
            return (!this.isWX && (!this.options.bannerImage || this.options.bannerImage && this.options.bannerImage.length < 1)) ? "content_box" : ""; 
        }
    },
    methods: {
        count(ev) {
            let self = this;
            let num = 0;
            for(let item in self.snackList) {
                num += self.snackList[item]["count"];
            }
            if(ev.target.classList.contains("add") && (num == 4)) {
                dialogManager.toast("卖品最多选择4个，请重新选择");
                return;
            }
            for(let item in self.snackList) {
                if(self.snackList[item].code == ev.target.parentNode.dataset.code) {
                    if(ev.target.classList.contains("add")) {
                        self.snackList[item]["count"] += 1;
                        self.payAmount += +self.snackList[item]["settle_price"];
                        break;
                    }
                    if(ev.target.classList.contains("reduce")) {
                        self.snackList[item]["count"] -= 1;
                        self.payAmount -= +self.snackList[item]["settle_price"];
                        break;
                    }
                }
            }
            bus.$emit(get("snack"), self.snackList);
        },
        showCinema() {
            this.show = true;
        },
        selectCinema(opt) {
            console.log(opt);
        },
        lock() {
            lock();
            dialogManager.wait();
        },
        unLock() {
            unLock();
            dialogManager.closeWait();
        },
        getSnack() {
            if(isLock()) return;
            this.lock();
            this.$http.get(this.options.href.apiSnacks).then(res=> {
                if(!!res["data"]["snacks"] && res["data"]["snacks"].length > 0) {
                    this.snackList = res["data"]["snacks"];
                } else {
                    this.snackList = [];
                }
                this.unLock();
            }).catch(res=> {
                this.unLock();
                console.error(res);
            })
        }
     },
     mounted() {
         this.getSnack();
     }
}
</script>
<style lang="scss" scoped>
@import "../../common/style/mixin";

.m-views-meal {
    .content {
        &:nth-child(2) {
            padding-top: rem(20px);
        }
        &_box{
            padding-top: rem(30px);
        }

        .arrow-down {
            @include arrow-right;
            transform: rotate(90deg);
            padding-left: rem(10px);
        }
        .address {
            @include display-flex(flex);
            @include align-items(center);
            padding: rem(32px 24px 26px 24px);
            font-size: rem(28px);
        }
        .meal {
            position: relative;
            @include display-flex(flex);
            @include flex(1);
            padding: rem(24px 0 30px 0);
            margin-left: rem(24px);
        }
        .meal:last-child {
            border-bottom: none;
        }
        .img {
            @include wh(162px);
            @include radius(rem(10px));
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }

        .info {
            position: relative;
            margin-top: rem(10px);
            margin-left: rem(20px);
            max-width: rem(470px);
            div:nth-child(1) {
                font-size: rem(28px);
            }
            div:nth-child(2) {
                max-width: rem(450px);
                margin-top: rem(0px);
                font-size: rem(24px);
                line-height: 1.5;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }
            div:nth-child(3) {
                position: absolute;
                bottom: rem(0px);
                font-size: rem(30px);
                white-space: nowrap;
            }
            .std-price {
                margin-left: rem(18px);
                font-size: rem(20px);
                white-space: nowrap;
            }
        }
        .sum {
            @include display-flex(flex);
            @include align-items(center);
            position: absolute;
            right: rem(24px);
            bottom: rem(20px);
            overflow: hidden;
        }
        .slide-right-enter-active, .slide-right-leave-active {
            @include transition(all .5s ease);
        }
        .slide-right-enter, .slide-right-leave-active {
            @include opacity(50);
        }
        .slide-right-enter {
            @include translateX(200%);
        }
        .slide-right-leave-active {
            transform: translateX(200%);
        }
        .add,
        .reduce {
            font-size: rem(40px);
            @include wh(40px);
            @include radius(rem(40px));
            position: relative;
            margin: rem(2px);
        }

        .add{
            @include plus;
        }
        .reduce{
            @include minus;
        }

        .count {
            font-size: rem(36px);
            line-height: rem(40px);
            padding: rem(0 26px);
        }

        .more {
            font-size: rem(22px);
            line-height: rem(80px);
            .line{
                @include wh(40px, 0);
            }
            .text{
                padding: rem(0 8px);
            }
        }
        .blank {
            height: rem(376px);
            >div:first-child{
                @include display-flex(flex);
                @include justify-content(center);
                padding-top: rem(260px);
                img {
                    @include wh(230px, 60px);
                }
            }
            >div:last-child{
                margin-top: rem(30px);
                font-size: rem(26px);
                text-align: center;
            }
        }
    }
}
</style>
