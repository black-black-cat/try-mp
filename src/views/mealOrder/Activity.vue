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
        <div class="layout-2">确定</div>
    </div>
</template>
<script>
   export default {
        props: ["options"],
        data() {
            return {
                active: [
                    {"name": "建国大业", "msg": "1111"},
                    {"name": "建国大业", "msg": "1111"}
                ]
            }
        },
        methods: {
            choose () {
                console.log(this);
            }
        }
   } 
</script>
<style lang="scss" scoped>
    @import "../../common/style/mixin";
    @import "../../common/style/skin_1/variable";
    .m-order-activity {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: rem(774px);
        color: $c6;
        background: $c1;
        z-index: 100;
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
            border-bottom: 1px solid $c2;
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
                border: 1px solid $c3;
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
