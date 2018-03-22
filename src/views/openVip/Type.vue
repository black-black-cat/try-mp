<template>
    <div class="m-openvip-type">
        <div class="title">选择支付方式</div>
        <template v-for="item in this.paymethod">
            <div class="flex" @click="choose" :data-paytype="item.type"><div><i class="icon-wx"></i>{{item.name}}</div><div class="check"><i class="icon-hook"></i></div></div>
        </template>
    </div>
</template>
<script>
import closest from '../../lib/dom/closest';
import {bus, get} from 'lib/comp/bus';
export default {
    props: ["options"],
    data () {
        return {
            paymethod: this.options.data.payMethod,
            paytype: '',
            cardnum: ''
        }
    },
    mounted() {
        let checkList = document.querySelectorAll(".flex");
        if(checkList.length > 0) {
            checkList[0].children[1].classList.add("active");
            bus.$emit(get("paytype"), {paytype: checkList[0].dataset.paytype});
        }
    },
    methods: {
        choose: function(ev) {
            let self = this;
            let target = closest(ev.target, ".flex", self.node);
            let checkList = document.querySelectorAll(".flex");
            target.setAttribute("data-flag", true);
            self.paytype = '';
            self.cardnum = '';
            target.children[1].classList.toggle("active");
            for(let i = 0; i < checkList.length; i++) {
                if(!checkList[i].dataset.flag) {
                    checkList[i].children[1].classList.remove("active");
                }
            }
            if(target.children[1].classList.contains("active")) {
                self.paytype = target.dataset.paytype;
                self.cardnum = target.dataset.cardid ? target.dataset.cardid : '';
            }
            bus.$emit(get("paytype"), {paytype: self.paytype});
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../common/style/mixin";

.m-openvip-type {
    margin-top: rem(24px);
    .title {
        margin-left: 0;
        padding-left: rem(24px);
    }
    >div {
        @include display-flex(flex);
        @include align-items(center);
        @include justify-content(space-between);
        margin-left: rem(24px);
        padding-right: rem(24px);
        font-size: rem(30px);
        line-height: rem(100px);
        div {
            @include display-flex(flex);
            @include align-items(center);
        }
        i {
            margin-right: rem(14px);
        }
    }
    >div:last-child{
        border-bottom: none;
    }
    .check {
        @include wh(40px, 40px);
        @include radius(100%);
        text-align: center;
    }
    .icon-hook {
        position: relative;
        left: rem(8px);
    }
}
</style>