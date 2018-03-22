<template>
    <div class="list">
        <div class="tabs" ref="tab">
            <div data-index="0" class="active" @click="choose">消费</div>
            <div data-index="1" @click="choose">积分</div>
        </div>
        <swiper :options="mySwiper" ref="swiper">
            <swiper-slide>
                <template v-for="item in this.takenList">
                    <div class="item">
                        <div class="time">
                            <div>{{item.date}}</div>
                            <div>{{item.time}}</div>
                        </div>
                        <div class="add">
                            <div>{{item.money}}</div>
                            <div>{{item.matter}}</div>
                        </div>
                        <div class="balance">¥{{item.balance}}</div>
                    </div>
                </template>
                <div class="blank" v-show="flagone">
                    <div><img src="/images/common/error.png" alt=""></div>
                    <div>空空如也~</div>
                </div>
            </swiper-slide>
            <swiper-slide>
                <template v-for="item in this.creditList">
                    <div class="item">
                        <div class="time">
                            <div>{{item.date}}</div>
                            <div>{{item.time}}</div>
                        </div>
                        <div class="add">
                            <div>{{item.integral}}</div>
                            <div>{{item.matter}}</div>
                        </div>
                        <div class="balance">{{item.cointegral}}分</div>
                    </div>
                </template>
                <div class="blank" v-show="flagtwo">
                    <div><img src="/images/common/error.png" alt=""></div>
                    <div>空空如也~</div>
                </div>
            </swiper-slide>
        </swiper>
    </div>
</template>
<script>
import { swiper, swiperSlide } from 'common/plugin/swiper';
import { bus, isLock, lock, unLock, get } from 'lib/comp/bus';
import dialog from 'common/plugin/dialog';
import base64 from 'lib/str/base64';
export default {
    props: ["options"],
    data() {
        const vm = this;
        console.log(vm);
        return {
            flagone: false,
            flagtwo: false,
            takenList: null,
            creditList: null,
            credit: 0,
            money: 0,
            mySwiper: {
                speed: 400,
                autoHeight: true,
                onSlideChangeStart(ev) {
                    bus.$emit(get("index"), ev.activeIndex);
                    for (let item in vm.$refs.tab.children) {
                        if (vm.$refs.tab.children[item].nodeType == 1) {
                            if (vm.$refs.tab.children[item].dataset.index != ev.activeIndex) {
                                vm.$refs.tab.children[item].classList.remove("active");
                            } else {
                                vm.$refs.tab.children[item].classList.add("active");
                            }
                        }
                    }
                }
            }
        }
    },
    components: {
        swiper,
        swiperSlide
    },
    methods: {
        choose(ev) {
            let vm = this;
            let target = ev.target;
            target.classList.add("active");
            vm.$refs.swiper.swiper.slideTo(target.dataset.index);
            for (let item in vm.$refs.tab.children) {
                if (vm.$refs.tab.children[item].nodeType == 1) {
                    if (vm.$refs.tab.children[item].dataset.index != target.dataset.index) {
                        vm.$refs.tab.children[item].classList.remove("active");
                    }
                }
            }
        },
        lock() {
            lock();
            dialog.wait();
        },
        unLock() {
            unLock();
            dialog.closeWait();
        },
        password() {

        }
    },
    created() {
        // let vm = this;
        // bus.$on("password", (data) => {
        //     vm.password = data;
        //     if (!vm.password) {
        //         dialog.toast("请输入会员卡密码");
        //         return;
        //     }
        // })
    },
    mounted() {
        let vm = this;
        if (isLock()) return;
        vm.lock();
        vm.$http.get(vm.options.href.urlConsumerecord, {
            params: {
                cinema_code: vm.options.data.cardInfo.cinema_code,
                card_code: vm.options.data.cardInfo.code,
                password: base64.encode(vm.options.data.cardInfo.password)
            }
        }).then((res) => {
             if ((res["code"] == 0) && (res["data"].length == 0)) {
                vm.flagone = true;
                vm.unLock();
                return;
            }
            bus.$emit(get("money"), res["data"][0]["balance"]);
            for (let item in res["data"]) {
                var date = res["data"][item].dissipate.split(" ")[0].split("-");
                var time = res["data"][item].dissipate.split(" ")[1].split(":");
                date.splice(0, 1);
                time.splice(2, 3);
                res["data"][item]["date"] = date.join("-");
                res["data"][item]["time"] = time.join(":");
            }
            vm.takenList = res["data"];
            vm.unLock();
        }).catch((res) => {
            console.error(res["msg"]);
            dialog.toast(res["msg"]);
            vm.unLock();
        });
        vm.$http.get(vm.options.href.urlIntegralrecord, {
            params: {
                cinema_code: vm.options.data.cardInfo.cinema_code,
                card_code: vm.options.data.cardInfo.code,
                password: base64.encode(vm.options.data.cardInfo.password)
            }
        }).then((res) => {
            if ((res["code"] == 0) && (res["data"].length == 0)) {
                vm.flagtwo = true;
                vm.unLock();
                return;
            }
            bus.$emit(get("credit"), res["data"][0].cointegral);
            for (let item in res["data"]) {
                var date = res["data"][item].dissipate.split(" ")[0].split("-");
                var time = res["data"][item].dissipate.split(" ")[1].split(":");
                date.splice(0, 1);
                time.splice(2, 3);
                res["data"][item]["date"] = date.join("-");
                res["data"][item]["time"] = time.join(":");
            }
            vm.creditList = res["data"];
            vm.unLock();
        }).catch((res) => {
            vm.unLock();
            dialog.toast(res["msg"]);
            console.error(res["msg"]);
        })
    }
} 
</script>
<style lang="scss" scoped>
@import '../../common/style/_mixin.scss';
.m-views-inquire .list{
    margin-top: rem(24px);
    .tabs {
        @include display-flex(flex);
        @include justify-content(center);
        @include align-items(center);
        height: rem(80px);
        font-size: rem(32px);
        line-height: rem(80px);
        >div {
            position: relative;
            padding: rem(0 50px);
        }
        .active{
            &:after {
                display: inline-block;
                content: '';
                position: absolute;
                right: rem(55px);
                bottom: 0;
                width: rem(60px);
                height: rem(3px);
            }
        }
    }
    .item {
        margin-left: rem(24px);
        @include display-flex(flex);
        @include justify-content(space-between);
        @include align-items(center);
        height: rem(110px);
        .time {
            width: rem(246px);
            font-size: rem(24px);
            line-height: rem(38px);
        }
        .add {
            @include flex(1);
            font-size: rem(32px);
            div:nth-child(2) {
                margin-top: rem(10px);
            }
        }
        .balance {
            padding-right: rem(24px);
            font-size: rem(36px);
        }
    }
    .item:last-child {
        border-bottom: none;
    }
    .blank {
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
</style>
