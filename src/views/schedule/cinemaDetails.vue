<template>
    <div class="m-movie-detail">
        <div class="title vh-center">
            影院详情<i class="icon-dialog-close" @click="close"></i>
        </div>
        <div class="address vh-between">
            <div>
                <div class="name">{{cinema.cinema_name}}</div>
                <div class="time vh-left">
                    <i class="icon-clock"></i>
                    <span class="word">营业时间：</span>
                    <span class="word">上午10:00-凌晨02:00 </span>
                </div>
                <div class="location vh-left">
                    <i class="icon-place"></i>
                    <span class="word">地址：{{cinema.cinema_address}}</span>
                </div>
            </div>
            <a :href="'tel://'+cinema.tel" class="icon-phone"></a>
        </div>
        <div class="service" v-show="cinema.feature_service.length > 0">
            <div class="list-title">特色服务</div>
            <ul class="list">
                <li class="item" v-for="(item, i) in cinema.feature_service">
                    <span class="service-name"><span class="name vh-center">{{item.keyText}}</span></span>
                    <span class="service-explain" v-html="item.explain"></span>
                </li>
                <li class="item">
                    <span class="service-name"><span class="name vh-center">乘车信息</span></span>
                    <span class="service-explain" v-html="cinema.bus_line"></span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        cinema: {
            type: Object,
            default () {
                return {};
            }
        }
    },
    methods: {
        close () {
            this.$emit("close");
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "../../common/style/mixin.scss";
    .m-movie-detail{
        width: rem(750px);
        max-height: rem(1000px);
        min-height: rem(500px);
        overflow: auto;
        .title {
            height: rem(100px);
            @include font-size(32px);
            position: relative;
            .icon-dialog-close {
                position: absolute;
                right: rem(34px);
            }
        }
        .address {
            margin: rem(0 34px);
            padding: rem(40px 0);
            .name {
                @include font-size(34px);
            }
            .time {
                padding-top: rem(24px);
                @include font-size(22px);
            }
            .icon-clock,.icon-place{
                margin-right: rem(10px);
            }
            .location {
                @include max-width(600px);
                padding-top: rem(24px);
                @include font-size(22px);
                .word {
                    @extend %ellipsis-basic;
                }
            }
            .icon-phone{
                margin-right: rem(22px);
            }
        }
        .service {
            padding: rem(34px 34px 50px);
            .list-title {
                @include font-size(28px);
            }
            .item {
                @include display-flex;
                @include align-items(center);
                margin-top: rem(34px);
                .service-name {
                    width: rem(128px);
                    .name {
                        display: inline-block;
                        @include font-size(20px);
                        @include height(26px);
                        @include radius(rem(26px));
                        padding: rem(0 6px);
                        @include box-sizing;
                    }
                }
                .service-explain {
                    @include flex(1);
                    @include font-size(26px);
                    @include lt(36px);
                }

                &:last-of-type {
                    @include align-items(flex-start);
                }
            }
        }
    }
</style>
