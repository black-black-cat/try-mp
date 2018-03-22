<template>
    <div class="m-views-inquire">
        <div class="header">
            <div>
                <div class="name">金卡-中影国际影城南山欢乐海岸店</div>
                <div class="number">卡号：20161778</div>
            </div>
            <div>
                <div class="money">¥<span>321</span></div>
                <div class="kind">余额</div>
            </div>
        </div>
        <app-content></app-content>
    </div>
    
</template>
<script>
import appContent from './Content';
export default {
    props: ["options"],
    data() {
        return {}
    },
    components: {
       appContent 
    }
}
</script> 
<style lang="scss" scoped>
@import '../../common/style/_mixin.scss';
.m-views-inquire {
    .header {
        @include display-flex(flex);
        @include justify-content(space-between);
        padding: rem(25px 24px);
        .name {
            font-size: rem(32px);
        }
        .number {
            margin-top: rem(26px);
            font-size: rem(26px);
        }
        >div:last-child{
            width: rem(150px);
            text-align: center;
        }
        .money {
            font-size: rem(28px);
            span {
                font-size: rem(42px);
            }
        }
        .kind {
            margin-top: rem(20px);
            font-size: rem(24px);
        }
    }
}
</style>
