<template>
    <div class="list">
        <div class="item" v-for="item in options">
            <div class="title">
                <div>{{item.cinema_name}}</div>
                <div class="status">{{item.order_status_name}}</div>
            </div>
            <div class="info">
                <div>
                    <span>{{item.member_policy}}</span>
                </div>
                <div>
                    {{item.typeName}}金额：{{item.order_money}}</div>
                <div>
                    {{item.typeName}}手机号：{{item.mobile}}</div>
                <div>订单号：{{item.order_code}}</div>
                <template v-if="!!item.card_code">
                    <div>卡号：{{item.card_code}}</div>
                </template>
            </div>
            <app-common :options="item" ></app-common>
        </div>
        <div class="blank" v-if="this.blank">
            <div><img src="/images/common/error.png" alt=""></div>
            <div>空空如也~</div>
        </div>
        <div class="more" v-if="this.more">——哦呦~到底了——</div>
    </div>
</template>
<script>
import appCommon from './Common';

export default {
    props: {
        options: null,
        more: false,
        blank: false
    },
    data() {
        return {
        }
    },
    components: {
        appCommon
    }
}
</script>

