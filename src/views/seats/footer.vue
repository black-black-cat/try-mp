<template>
    <div class="bottom-section">
        <transition
            name="fade"
            enter-class="fade-in-enter"
            enter-active-class="fade-in-active"
            leave-class="fade-out-enter"
            leave-active-class="fade-out-active"
            @before-enter="adBeforeEnter"
            @after-enter="adEnter"
            @after-leave="adLeave"
        >
            <slot name="ad" v-if="!selectionSize"></slot>
        </transition>
    <div class="footer">
        <div class="section-1 selected" v-if="isInsertedRowShow" ref="insertedRow">
            <div class="title">已选座位</div>
            <div class="content" @click="cancelSelected">
                <div class="item-wrapper" v-for="(item, i) in selection" :key="i">
                    <i class="circle i-left"></i>
                    <i class="circle i-right"></i>
                    <div class="item item-selected" :data-row-index="item.xcoord-1" :data-col-index="item.ycoord-1">
                        <span>{{item.row_no}}排{{item.col_no}}座</span>
                        <!-- <span>&#215;</span> -->
                    </div>
                </div>
            </div>
        </div>
        <div class="section-1" v-else-if="apiRecommend">
            <div class="title">推荐选座</div>
            <div class="content">
                <div class="item" v-for="(item, i) in Array(4)" @click="recommend">{{i+1}} 人</div>
            </div>
        </div>

        <div class="section-2">
            <div v-if="false">
                <div class="left active" v-if="selection.length">
                    <span>￥{{totalPrice}}</span>
                    <span>￥{{singlePrice}}{{'\u00d7'}}{{selectionSize}}</span>
                </div>
                <div class="left" v-else>一次最多选择4个座位</div>
            </div>
            <div class="right">
                <div :class="{'btn-submit': true, disabled: !selection.length}" @click="submit">
                    {{selection.length ? "确定" : "请先选座"}}
                </div>
            </div>
        </div>
        <bind-mobile :show.sync="isBindMobileShow" @onBindSuccess="bindMobileSuccess" :url="hrefs.apiSendsmsmobile" :subUrl="hrefs.apiBindmobile"></bind-mobile>
    </div>
    </div>
</template>

<script>
import closest from "lib/dom/closest";
import dialogManager from "common/plugin/dialog";
import { isLock, lock, unLock } from "lib/comp/bus";
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"

export default {
    props: {
        options: null,
        selection: Array,
        mySeats: Array,
        selectionWithOther: Array,
        hrefs: null,
        onceFlag: {
            type: Boolean
        }
    },
    data() {
        return {
            apiLockSeat: this.hrefs.apiLockseats,
            showNo: this.options.show_no || this.options.show.show_no,
            mobile: this.options.mobile,
            isBindMobile: +this.options.bindMobile,
            isBindMobileShow: false,
            urlOrderConfirm: this.hrefs.urlOrderConfirm,
            orderType: "ticket",
            apiRecommend: this.hrefs.urlRecommend,
            activityNum: this.options.show.activity_no,
            activityType: this.options.show.activity_type,
            rowInserted: false,
            isAdLeave: false,
            isInsertedRowShow: false,
        }
    },
    computed: {
        totalPrice() {
            const vm = this;
            return vm.selection.reduce(function(memo, item) {
                return memo + item.price
            }, 0).toFixed(1);
        },
        seatCodes() {
            const vm = this;
            return vm.selection.reduce(function(memo, item) {
                return memo + `${item.code},`
            }, "").slice(0, -1);
        },
        selectionSize() {
            return this.selection.length;
        },
        singlePrice() {
            return (this.totalPrice / this.selectionSize).toFixed(1);
        },
    },
    watch: {
        isInsertedRowShow() {
            const vm = this;
            vm.$nextTick(() => {
                vm.$emit("rowInserted");
            })
        },
        selection() {
            const vm = this;
            vm.isInsertedRowShow = vm.selection.length > 0;
        }
    },
    methods: {
        cancelSelected(ev) {
            const vm = this;
            const el = closest(ev.target, ".item-selected");
            const { rowIndex, colIndex } = el.dataset;
            const seat = vm.mySeats[rowIndex].cols[colIndex];
            vm.$emit("changeSelected", seat);
        },
        check() {
            const vm = this;
            let obj = {};
            vm.selectionWithOther.forEach((item) => {
                if ( obj[item.xcoord] ) {
                    obj[item.xcoord].push(item)
                } else {
                    obj[item.xcoord] = [item]
                }
            });

            console.log(obj);
            for (let key in obj) {
                let some;
                if (obj.hasOwnProperty(key)) {
                    some = obj[key].some((item) => item.selected)
                    if (some) {
                        let isPass = vm.checkSameRow(obj[key]);

                        if (!isPass) {
                            dialogManager.toast("请连续选择座位，不要留下单个的空闲座位")
                            return false;
                        }
                    }
                }
            }

            return true;
        },
        /**
         * @return {Boolean}
         * true -- pass
         * false -- fail
         */
        checkSameRow(arr) {
            const vm = this;
            let rowIndex = arr[0].xcoord - 1;
            let cols = vm.mySeats[rowIndex].cols;
            let markedArr = cols.map((item) => {
                if (item.col_no == -1) { // 走廊
                    return "x"
                }
                else if (item.selected) { // 自己已选
                    return "1"
                }
                else if (item.status == 0) { // 别人已选
                    return "2"
                }
                else if (item.status == 1) { // 可选空位
                    return "0"
                }
                else { // 可选
                    return "0"
                }
            });

            let markedStr = markedArr.join("");
            console.log(markedStr)
            if (/^[^0]*0[^0]*$/.test(markedStr)) { // 一行只剩一个空位
                return true
            }
            // /[^0x]+0[^0x]+/
            if (/[1]+0[^0x]+/.test(markedStr) || /[^0x]+0[1]+/.test(markedStr)) {
                return false
            } else {
                return true
            }
        },
        submit() {
            const vm = this;
            let logger = localStorage.getItem("iphone.reload");
            if (logger) {
                unLock();
                localStorage.removeItem("iphone.reload");
            }
            // 确定锁座前检查绑定手机
            // if (!vm.isBindMobile) {
            //     vm.openBindMobile();
            //     return;
            // }
            if (!vm.selection.length) return;
            if (!vm.check()) {
                return;
            }
            if (isLock()) {
                return;
            }
            vm.lock();
            vm.$http.get(vm.apiLockSeat, {
                params: {
                    show_no: vm.showNo,
                    mobile: vm.mobile,
                    seat_codes: vm.seatCodes,
                    activity_no: vm.activityNum,
                    activity_type: vm.activityType
                }
            }).then(function(res) {
                const data = res.data || {};
                let sign = vm.urlOrderConfirm.indexOf("?") > -1 ? "&" : "?"
                let url = `${vm.urlOrderConfirm}${sign}order_code=${data.order_code}&itemname=${vm.orderType}`;

                if(browser.WX){
                    location.assign(url);
                }else{
                    webBridge.openUrl(url);
                }
                // vm.unlock();
                // 退回选座页时，iphone微信是不重新加载页面的，因此针对iphone做了处理。
                /iphone/i.test(navigator.userAgent) && localStorage.setItem("iphone.reload", "1");
                dialogManager.closeWait();
            }).catch(function(errData) {
                dialogManager.toast(errData.msg);
                vm.unlock();
            });
        },
        lock() {
            lock();
            dialogManager.wait();
        },
        unlock() {
            unLock();
            dialogManager.closeWait();
        },
        openBindMobile() {
            this.isBindMobileShow = true;
        },
        bindMobileSuccess() {
            this.isBindMobile = true;
        },
        adBeforeEnter() {
            this.isAdLeave = false;
            this.toggleInsertedRow();
        },
        adEnter() {
            const vm = this;
            vm.$emit("adToggle");
            vm.$nextTick(() => {
                vm.$emit("rowInserted");
            })
        },
        adLeave() {
            const vm = this;
            vm.$emit("adToggle");
            vm.isAdLeave = true;
            vm.toggleInsertedRow();
        },
        toggleInsertedRow() {
            if (this.isAdLeave && this.selection.length) {
                this.isInsertedRowShow = true;
                return true
            } else {
                this.isInsertedRowShow = false;
                return false
            }
        },
        recommend(ev) {
            let vm = this;
            let logger = localStorage.getItem("iphone.reload");
            if (logger) {
                unLock();
                localStorage.removeItem("iphone.reload");
            }

            let num = ev.target.innerHTML.replace(/\D/g, "");
            if (vm.options.numActive == "" && vm.options.show.activity_num_user) {
                vm.options.numActive = vm.options.show.activity_num_user
            }
            if (vm.options.numActive != '' && (Number(num) > vm.options.numActive) && vm.onceFlag) {
                dialogManager.confirm("超出活动购票数，将以正常价计算哦",{
                    'okText': '确定',
                    'cancelText': '取消'
                }).then(()=> {
                    vm.updateOnceFlag();
                    getData();
                }).catch((res)=> {
                    console.log(res);
                })
                return;
            }
            function getData() {
                if(isLock()) return;
                vm.lock();
                vm.$http.get(vm.apiRecommend, {
                    params: {
                        show_no: vm.showNo,
                        count: Number(num)
                    }
                }).then((res) => {
                    if (!!!res["data"] || res["data"].length == 0) {
                        dialogManager.toast("请自行选择");
                    }
                    if (res["data"].length > 0) {
                        vm.$emit("recommend", res["data"]);
                    }
                    vm.unlock();
                }).catch((res) => {
                    vm.unlock();
                    dialogManager.toast(res["msg"]);
                    console.error(res);
                })
            }
            getData();
        },
        updateOnceFlag() {
            this.$emit("updateOnceFlag", false)
        }
    },

}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";

.fade-in-active, .fade-out-active,
.show-in-active, .show-out-active {
    @include transition(all 0.5s ease);
}

.fade-in-enter, .fade-out-active {
    @include translate(100%, 0);
}

.show-in-enter, .show-out-active {
    height: 0;
}

.show-in-active, .show-out-active {
    height: auto;
}

.footer {
    // min-height: r(260);
    padding: r(18) r(24);
    .section-1 {

        &.selected {
            .content {
                @include flex-wrap(wrap);
                @include justify-content(flex-start);

                .item {

                    @include display-flex();
                    @include justify-content(space-around);
                    @include align-items(center);
                    text-align: left;
                    // margin-bottom: r(10);
                    // overflow: hidden;
                    // &+.item {
                    //     margin-left: r(10);
                    // }
                    >span {
                        display: inline-block;
                        margin-left: r(10);
                        white-space: nowrap;
                    }
                    &:after {
                        content: "\00D7";
                        font-size: r(28);
                        margin-right: r(10);
                    }
                }
                .item-wrapper {
                    position: relative;
                    display: inline-block;
                    overflow: hidden;
                    margin-bottom: r(10); // overflow: hidden;
                    &+.item-wrapper {
                        margin-left: r(12);
                    }

                    .circle {
                        position: absolute;
                        top: 50%;

                        @include transform(translate(0, -50%));
                        width: r(15);
                        height: r(15);
                        @include radius(rem(15px));
                        border-width: 1px;
                        border-style: solid;

                        &.i-left {
                            left: r(-10);
                        }

                        &.i-right {
                            right: r(-10);
                        }
                    }
                }
            }
        }

        .title {
            margin-bottom: r(24);
        }
        .content {
            @include display-flex();
            @include justify-content(space-between);
            margin-bottom: r(24);

            .item {
                min-width: r(158);
                height: r(60);
                line-height: r(60);
                @include radius(rem(10px));
                font-size: r(28);
                text-align: center;
            }
        }
    }
    .section-2 {
        @include display-flex();
        @include justify-content(space-between);
        @include align-items(center);
        .left {
            font-size: r(28);

            &.active {
                >span:nth-child(1) {
                    font-size: r(38);
                }
            }
        }
        .right {
            width: 100%;
            .btn-submit {
                // width: r(338);
                width: 100%;
                height: r(90);
                line-height: r(90);
                text-align: center;
                font-size: r(38);
                @include radius(rem(50px));
            }
        }
    }
}
</style>
