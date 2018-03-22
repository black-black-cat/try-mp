<template>
    <div class="m-views-myorder" ref="myorder">
        <div class="tabs" ref="tab">
            <div @click="choose" data-count="0" class="active">影票</div>
            <div @click="choose" data-count="1">卖品</div>
            <div @click="choose" data-count="2">会员卡</div>
            <div class="line" ref="line">
                <div></div>
            </div>
        </div>
        <swiper :options="swiperOption" ref="swiper" :not-next-tick="notNextTick">
            <swiper-slide>
                <app-ticket :options='this.ticket' :nowtime="options.href.nowtime" :more="this.more_no1" :blank="this.blank1" @resetData="resetData"></app-ticket>
            </swiper-slide>
            <swiper-slide>
                <app-snack :options='this.snack' :nowtime="options.href.nowtime" :more="this.more_no2" :blank="this.blank2" @resetData="resetData"></app-snack>
            </swiper-slide>
            <swiper-slide>
                <app-recharge :options='this.recharge' :more="this.more_no3" :blank="this.blank3"></app-recharge>
            </swiper-slide>
        </swiper>
        <scroll-load :loading="loading" :node="node" @load="loadData(stater.dataset.count)" :delta="1" ref="scrollLoad"></scroll-load>
    </div>
</template>
<script>
    import dialog from 'common/plugin/dialog';
    import {
        swiper,
        swiperSlide
    } from 'common/plugin/swiper';
    import {
        isLock,
        lock,
        unLock,
        bind,
        fire
    } from 'lib/comp/bus';
    import appTicket from './Ticket';
    import appSnack from './Snack';
    import appRecharge from './Recharge';
    import URL from '../../lib/util/URL';
    import webBridge from "common/utils/webBridge"
    export default {
        props: {
            options: {
                type: Object
            },
            more: {
                type: Boolean
            }
        },
        data() {
            const vm = this;
            return {
                ticket: null,
                snack: null,
                recharge: null,
                loading: false,
                node: null,
                page_no1: 1,
                page_no2: 1,
                page_no3: 1,
                page_count1: null,
                page_count2: null,
                page_count3: null,
                more_no1: false,
                more_no2: false,
                more_no3: false,
                blank1: false,
                blank2: false,
                blank3: false,
                stater: null,
                swiperOption: {
                    autoHeight: true,
                    speed: 400,
                    onSlideChangeStart(ev) {
                        if (vm.stater == null) {
                            vm.$refs.tab.children[0].classList.remove("active");
                        } else {
                            vm.stater.classList.remove("active");
                        }
                        for (let i = 0; i < vm.$refs.tab.children.length; i++) {
                            if ((i == ev.activeIndex) && !vm.$refs.tab.children[i].classList.contains("active")) {
                                vm.$refs.tab.children[i].classList.add("active");
                                vm.stater = vm.$refs.tab.children[i];
                            } else {
                                vm.$refs.tab.children[i].classList.remove("active");
                            }
                        }
                        if (ev.activeIndex == 0) {
                            vm.$refs.line.style.left = "0%";
                        }
                        if (ev.activeIndex == 1) {
                            vm.$refs.line.style.left = "33.33%";
                        }
                        if (ev.activeIndex == 2) {
                            vm.$refs.line.style.left = "66.66%";
                        }
                        // if(vm.page_no1 == 1 || vm.page_no2 == 1 || vm.page_no3 == 1) {
                        //      vm.loadData();
                        // }
                        _load(ev.activeIndex);

                        vm.node = ev.slides[ev.activeIndex];

                        function _load(index) {
                            if (vm['page_no' + (index + 1)] == 1) {
                                vm.loadData();
                            }
                        }
                        sessionStorage.setItem("chooseIndex", ev.activeIndex);
                    },
                    onInit(swiper) {
                        let url = URL.parse(window.location.href).queryJson;
                        vm.node = swiper.slides[0];
                        if (sessionStorage.getItem(`historyLen${window.history.length-1}`)) {
                            var index = sessionStorage.getItem("chooseIndex");
                            switch (index) {
                                case "1":
                                    vm.$refs.line.style.left = "33.33%";
                                    vm.stater = vm.$refs.tab.children[1];
                                    swiper.slideTo(1);
                                    vm.node = swiper.slides[1];
                                    break;
                                case "2":
                                    vm.$refs.line.style.left = "66.66%";
                                    vm.stater = vm.$refs.tab.children[2];
                                    swiper.slideTo(2);
                                    vm.node = swiper.slides[2];
                                    break;
                                default:
                                    vm.loadData();
                            }
                            return;
                        }
                        if (!!url) {
                            if (url.itemname == "snack") {
                                vm.$refs.line.style.left = "33.33%";
                                vm.stater = vm.$refs.tab.children[1];
                                swiper.slideTo(1);
                                vm.node = swiper.slides[1];
                                return;
                            }
                            if (url.itemname == "recharge") {
                                vm.$refs.line.style.left = "66.66%";
                                vm.stater = vm.$refs.tab.children[2];
                                swiper.slideTo(2);
                                vm.node = swiper.slides[2];
                                return;
                            }
                        }
                        vm.loadData();
                    }
                }
            }
        },
        components: {
            appTicket,
            appSnack,
            appRecharge,
            swiper,
            swiperSlide,
        },
        methods: {
            choose(ev) {
                let vm = this;
                let count = ev.target.dataset.count;
                vm.$refs.swiper.swiper.slideTo(count);
                if (vm.stater == null) {
                    vm.$refs.tab.children[0].classList.remove("active");
                } else {
                    vm.stater.classList.remove("active");
                }
                if (!ev.target.classList.contains("active")) {
                    ev.target.classList.add("active");
                }
                if (ev.target.dataset.count == "0") {
                    vm.$refs.line.style.left = "0%";
                }
                if (ev.target.dataset.count == "1") {
                    vm.$refs.line.style.left = "33.33%";
                }
                if (ev.target.dataset.count == "2") {
                    vm.$refs.line.style.left = "66.66%";
                }
                vm.stater = ev.target;
            },
            loadData(count) {
                let vm = this;
                const m_scrollLoad = vm.$refs.scrollLoad;
                if (count == null) {
                    count = vm.stater.dataset.count;
                }
                if (count == 0) {
                    if (vm.page_no1 != 1) {
                        vm.loading = true;
                    }
                    if ((vm.page_count1 != null) && (vm.page_no1 > vm.page_count1)) {
                        vm.more_no1 = true;
                        vm.loading = false;
                        m_scrollLoad.result = false;
                        return;
                    }
                    if (isLock()) return;
                    vm.lock();
                    vm.$http.get(vm.options.href["apiTicketList"], {
                        params: {
                            page_no: vm.page_no1,
                            page_size: 10
                        }
                    }).then((res) => {
                        vm.page_count1 = res['data']['page_count'] ? res['data']['page_count'] : 0;
                        if (res['data']['page_count'] == 0 && vm.page_no1) {
                            vm.blank1 = true;
                        }
                        if (res["data"]["list"].length > 0) {
                            for (let item in res["data"]["list"]) {
                                res["data"]["list"][item]["type"] = 'ticket';
                            }
                            if (vm.page_no1 == 1) {
                                vm.ticket = res["data"]["list"];
                            } else {
                                vm.ticket = vm.ticket.concat(res["data"]["list"]);
                            }
                            if (res["data"]["list"].length <= 10 && res["data"]["page_count"] == 1) {
                                vm.more_no1 = true;
                            }
                        }
                        vm.loading = false;
                        vm.page_no1++;
                        vm.unLock();
                    }).catch((req) => {
                        vm.loading = false;
                        console.error(req);
                        vm.unLock();
                    });
                }
                if (count == 1) {
                    if (vm.page_no2 != 1) {
                        vm.loading = true;
                    }
                    if ((vm.page_count2 != null) && (vm.page_no2 > vm.page_count2)) {
                        vm.more_no2 = true;
                        vm.loading = false;
                        m_scrollLoad.result = false;
                        return;
                    }
                    if (isLock()) return;
                    vm.lock();
                    vm.$http.get(vm.options.href["apiSnacktList"], {
                        params: {
                            page_no: vm.page_no2,
                            page_size: 10
                        }
                    }).then((res) => {
                        vm.page_count2 = res['data']['page_count'] ? res['data']['page_count'] : 0;
                        if (res["data"]["page_count"] == 0 && vm.page_no2 == 1) {
                            vm.blank2 = true;
                        }
                        if (res["data"]["list"].length > 0) {
                            for (let item in res["data"]["list"]) {
                                res["data"]["list"][item]["type"] = 'snack';
                            }
                            if (vm.page_no2 == 1) {
                                vm.snack = res["data"]["list"];
                            } else {
                                vm.snack = vm.snack.concat(res["data"]["list"]);
                            }
                            if (res["data"]["list"].length <= 10 && res["data"]["page_count"] == 1) {
                                vm.more_no2 = true;
                            }
                        }
                        vm.loading = false;
                        vm.page_no2++;
                        vm.unLock();
                    }).catch((res) => {
                        vm.loading = false;
                        console.error(res);
                        vm.unLock();
                    });
                }
                if (count == 2) {
                    if (vm.page_no3 != 1) {
                        vm.loading = true;
                    }
                    if ((vm.page_count3 != null) && (vm.page_no3 > vm.page_count3)) {
                        vm.more_no3 = true;
                        vm.loading = false;
                        m_scrollLoad.result = false;
                        return;
                    }
                    if (isLock()) return;
                    vm.lock();
                    vm.$http.get(vm.options.href["apiRechargeList"], {
                        params: {
                            page_no: vm.page_no3,
                            page_size: 10
                        }
                    }).then((res) => {
                        vm.page_count3 = res['data']['page_count'] ? res['data']['page_count'] : 0;
                        if (res["data"]["page_count"] == 0 && vm.page_no3 == 1) {
                            vm.blank3 = true;
                        }
                        if (res["data"]["list"].length > 0) {
                            for (let item in res["data"]["list"]) {
                                res["data"]["list"][item]["type"] = 'recharge';
                            }
                            if (vm.page_no3 == 1) {
                                vm.recharge = res["data"]["list"];
                            } else {
                                vm.recharge = vm.recharge.concat(res["data"]["list"]);
                            }
                            if (res["data"]["list"].length <= 10 && res["data"]["page_count"] == 1) {
                                vm.more_no3 = true;
                            }
                        }
                        vm.loading = false;
                        vm.page_no3++;
                        vm.unLock();
                    }).catch((req) => {
                        vm.loading = false;
                        console.error(req);
                        vm.unLock();
                    });
                }
            },
            resetData(params) {
                const vm = this;
                let count = params.count;
                if (count == 0) {
                    vm.page_no1 = 1;
                    vm.ticket = [];
                } else if (count == 1) {
                    vm.page_no2 = 1;
                    vm.snack = [];
                } else if (count == 2) {
                    vm.page_no3 = 1;
                    vm.recharge = [];
                }
                vm.loadData(count);
            },
            lock() {
                lock();
                dialog.wait();
            },
            unLock() {
                unLock();
                dialog.closeWait();
            }
        },
        mounted() {
            let vm = this;
            vm.node = document.querySelector(".m-views-myorder");
            vm.$refs.line.style.left = "0%";
            vm.stater = vm.$refs.tab.children[0];
            sessionStorage.setItem(`historyLen${window.history.length}`, window.history.length);
            bind("getClientTel", commonRef => {
                commonRef.clientTel = vm.options.href.client_tel || "";
            });
        }
    }
</script>
<style lang="scss">
    @import "../../common/style/mixin";
    html,
    body {
        height: 100%;
        -webkit-overflow-scrolling: touch;
    }

    .m-views-myorder {
        height: 100%;
        overflow: auto;
        .m-scroll-loading {
            display: block !important;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100% !important;
            z-index: 100;
            padding: rem(16px 0);

            .text {
                padding: rem(16px 0);
            }
        }
        .tabs {
            @include display-flex(flex);
            position: absolute;
            top: 0;
            width: 100%;
            font-size: rem(32px);
            z-index: 100;
            >div {
                @include flex(1);
                padding: rem(24px 0);
                text-align: center;
                @include transition(all ease-in 400ms);
            }
            .line {
                @include display-flex(flex);
                @include justify-content(center);
                position: absolute;
                padding: 0;
                bottom: 0;
                width: 33.33%;
                height: rem(3px);
                z-index: 100;
                @include transition(all ease-in 400ms);
                div {
                    width: rem(100px);
                    height: rem(3px);
                }
            }
        }
        .swiper-container {
            @include box-sizing(border-box);
            padding-top: rem(80px);
        }
        .swiper-wrapper,
        .swiper-slide {
            width: rem(750px);
        }
        .swiper-slide {
            overflow: auto;
        }
        .swiper-container,
        .swiper-wrapper,
        .swiper-slide {
            height: 100%;
        }
        .list {
            padding: rem(34px 24px 0 24px);
            >.item {
                @include radius(rem(10px));
                &:nth-child(n+2) {
                    margin-top: rem(24px);
                }
            }
            .title {
                @include display-flex(flex);
                @include justify-content(space-between);
                font-size: rem(28px);
                padding: rem(26px 20px);
            }
            .info {
                padding: rem(0 20px);
                div:nth-child(1) {
                    margin-top: rem(44px);
                    font-size: rem(28px);
                    span {
                        margin-right: rem(10px);
                        font-size: rem(36px);
                    }
                }
                div:nth-child(n+2) {
                    margin-top: rem(22px);
                    font-size: rem(28px);
                }
                .sanck {
                    @include display-flex(flex);
                    margin-top: rem(34px);
                    font-size: rem(28px);
                    >div:nth-child(2):after {
                        content: '，';
                    }
                    >div:last-child {
                        content: '';
                    }
                }
            }
            .pay {
                @include display-flex(flex);
                @include justify-content(space-between);
                @include align-items(center);
                margin-top: rem(44px);
                padding: rem(0 20px);
                line-height: rem(96px);
                div:first-child {
                    font-size: rem(30px);
                    span {
                        &:last-child {
                            font-size: rem(42px);
                        }
                    }
                }
                .cancel,
                .signal,
                .double>div {
                    width: rem(158px);
                    height: rem(58px);
                    line-height: rem(58px);
                    font-size: rem(28px);
                    @include radius(rem(30px));
                    text-align: center;
                }
                .signal {
                    width: rem(216px);
                }
                .double {
                    @include display-flex(flex);
                    div:nth-child(2) {
                        margin-left: rem(20px);
                    }
                }
                .draw {
                    @include display-flex(flex);
                    @include align-items(center);
                    margin-left: rem(60px);
                    width: rem(160px);
                    img {
                        width: 100%;
                    }
                }
            }
        }
        .more {
            line-height: rem(80px);
            font-size: rem(28px);
            text-align: center;
        }
        .blank {
            height: rem(376px);
            >div:first-child {
                @include display-flex(flex);
                @include justify-content(center);
                padding-top: rem(260px);
                img {
                    @include wh(230px, 60px);
                }
            }
            >div:last-child {
                margin-top: rem(30px);
                font-size: rem(26px);
                text-align: center;
            }
        }
    }
</style>