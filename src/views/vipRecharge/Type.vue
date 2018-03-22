<template>
    <div class="m-viprecharge-type">
        <div class="title">选择支付方式</div>
        <template v-for="item in options.data.payMethod">
            <div class="flex" :data-type="item.type" @click="choose">
                <div>
                    <template v-if="item.type == 'WECHAT_JS'">
                        <i class="icon-wx"></i>{{item.name}}
                    </template>
                </div>
                <div class="check">
                    <i class="icon-hook"></i>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import closest from '../../lib/dom/closest';
import {bus, get} from 'lib/comp/bus';
export default {
    props: ["options"],
    data() {
        return {
            paytype: null
        }
    },
    mounted() {
        let checkList = document.querySelectorAll(".flex");
        if(checkList.length > 0) {
            checkList[0].children[1].classList.add("active");
            bus.$emit(get("paytype"), checkList[0].dataset.type);
        }
    },
    methods: {
        choose(ev) {
            let self = this;
            let target = closest(ev.target, ".flex", self.node);
            let checkList = document.querySelectorAll(".flex");
            target.setAttribute("data-flag", true);
            self.paytype = '';
            target.children[1].classList.toggle("active");
            for (let i = 0; i < checkList.length; i++) {
                if (!checkList[i].dataset.flag) {
                    checkList[i].children[1].classList.remove("active");
                }
            }
            if (target.children[1].classList.contains("active")) {
                self.paytype = target.dataset.type;
            }
            target.removeAttribute("data-flag");
            bus.$emit(get("paytype"), self.paytype);
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../common/style/mixin";
.m-viprecharge-type {
    margin-top: rem(24px);
    clear: both;
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
    .active {
        border: none;
    }
}
</style>