<template>
<div class="activities">
    <ul v-if="hasActi">
        <li class="acti-item" v-for="(item, i) in list" :key="i">
            <card :imgSrc="item.picUrl" :title="item.activityTitle" :index="i" :data="item" :boundMobile.sync="options.data.bindMobile"
                  :apiActi="hrefs.urlActview" :hrefs="hrefs" @showBindMobile="onShowBindMobile" :is-login="options.data.is_login" :urlLogin="urlLogin"  ref="card"></card>
        </li>
    </ul>
    <bind-mobile
        :show.sync="isBindMobileShow"
        :subUrl="apiBind"
        :url="apiCode"
        @onBindSuccess="bindMobileSuccess"
    ></bind-mobile>
    <!--<placeholder v-else :msg="msgEmpty"></placeholder>-->
</div>
</template>

<script>
import Card from "./Card";
import placeholder from "common/components/error";
export default {
    props: {
        list: {
            type: Array,
            default() {
                return [];
            }
        },
//        hrefs: {
//            type: Object,
//            default() {
//                return {};
//            }
//        },
        options: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            hasActi: true,
            msgEmpty: "敬请期待",
            isBindMobileShow: false,
            apiCode: this.options.href.apiSendsmsmobile,
            apiBind: this.options.href.apiBindmobile,
            memoIndex: null,
            hrefs: this.options.href,
            isLogin: this.options.data.is_login,
            urlLogin: this.options.href.urlLogin,
        }
    },
    watch: {

    },
    components: {
        Card,
        placeholder
    },
    methods: {
        onShowBindMobile(index) {
            this.isBindMobileShow = true;
            this.memoIndex = index;
        },
        bindMobileSuccess() {
            const vm = this;
            vm.options.data.bindMobile = 1;
            vm.$refs.card[vm.memoIndex].openActi();
        },
        onShowLogin(index){
            this.showLogin = true;
            this.memoIndex = index;
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";
.activities {
    position: relative;
    min-height: 80%;
}
.m-error {
    position: absolute;
    left: 50%;
    top: 50%;
    @include transform(translate(-50%, -50%));
}
</style>
