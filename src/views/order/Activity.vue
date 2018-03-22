<template>
    <div class="m-order-activity">
        <div class="title">活动优惠</div>
        <div class="layout-1" v-for="item in active">
            <div class="activity">
                <div>{{item.name}}</div>
                <div>{{item.msg}}</div>
            </div> 
            <div class="check" @click="choose"><i class="icon-hook"></i></div>
        </div>
        <div class="layout-2" @click="confrim">确定</div>
    </div>
</template>
<script>
export default {
    props: {options: null},
    data() {
        return {
            activity: null
        }
    },
    methods: {
        choose () {
            console.log(this);
        },
        confrim() {
            this.$emit("close");
        }
    },
    watch: {
        options(val) {
            //console.log(val);
        }
    }
} 
</script>
<style lang="scss" scoped>
    @import "../../common/style/mixin";
    @import "../../common/style/skin_1/variable";
    .m-order-activity {
        width: rem(750px);
        height: rem(774px);
        color: $c6;
        background: $c1;
        .title {
            font-size: rem(32px);
            line-height: rem(100px);
            text-align: center;
        }
        .layout-1 {
            @include display-flex(flex);
            @include justify-content(space-between);
            @include align-items(center);
            margin-left: rem(34px);
            padding-right: rem(34px);
            @include solid(2px, $c2, bottom, false);
            .activity {
                padding-bottom: rem(34px);
                
                >div:nth-child(1) {
                    margin-top: rem(44px);
                    font-size: rem(30px);
                }
                >div:nth-child(2) {
                    margin-top: rem(24px);
                    font-size: rem(28px);
                    color: $c4;
                }
            }
            .check {
                @include wh(54px, 54px);
                @include solid(2px, $c3, all, false);
                @include radius(100%);
                i {
                    margin-left: rem(12px);
                }
            }
            .active {
                border: none;
                background: $c7;
            }
        }
        .layout-2 {
            @include wh(683px, 90px);
            position: fixed;
            bottom: rem(20px);
            left: rem(32.5px);
            font-size: rem(38px);
            line-height: rem(90px);
            text-align: center;
            color: $c1;
            background: $c7;
            @include radius(rem(45px));
        }
    }
</style>
