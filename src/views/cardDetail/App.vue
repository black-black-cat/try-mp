<template>
    <div class="m-views-inquire">
        <div class="header">
            <div>
                <div class="name">{{options.data.cardInfo.level}}-{{options.data.cardInfo.cinema_name}}</div>
                <div class="number">卡号：{{options.data.cardInfo.code}}</div>
            </div>
            <div>
                <div class="money">
                    <template v-if="this.index == 0">
                        ¥<span>{{this.money}}</span>
                    </template>
                    <template v-else>
                        <span>{{this.credit}}</span>
                    </template>
                </div>
                <div class="kind">
                    <template v-if="this.index == 0">
                        余额
                    </template>
                    <template v-else>
                        积分
                    </template>
                </div>
            </div>
        </div>
        <app-content :options="options"></app-content>
    </div>
</template>
<script>
import appContent from './Content';
import popup from 'lib/layer/popup';
import {bus, get} from 'lib/comp/bus';
export default {
    props: ["options"],
    data() {
        return {
            index: 0,
            credit: 0,
            money: 0
        }
    },
    components: {
       appContent 
    },
    created() {
        let vm = this;
        bus.$on(get("credit"), (data)=> {
            vm.credit = data;
        })
        bus.$on(get("index"), (data)=> {
            vm.index = data;
        })
        bus.$on(get("money"), (data)=> {
            vm.money = data;
        })
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
