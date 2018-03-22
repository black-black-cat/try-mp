<template>
    <div class="seats-content" ref="seatsContent">

        <div class="screen" ref="screen">银幕</div>

        <div class="iscroll-wrapper" ref="iscroll">
            <div class="iscroll-content" ref="iscrollContent">
                <div>
                    <div class="side-bar-wrapper" ref="sidebarWrapper">
                        <div class="side-bar" ref="sidebar">
                            <div class="column">
                            <div v-for="(row, i) in mySeats" :key="i" class="item">
                                {{i+1}}
                            </div>
                            </div>
                        </div>

                        <div class="seats-main" ref="seatsMain" @click="seatsMainClicked">
                            <div class="center-line" ref="centerLine"></div>
                            <div class="seats-main-super"></div>

                            <div class="seats-main-content">
                                <div class="seats-row" v-for="(row, i) in mySeats" :key="i">
                                    <div
                                        v-for="(cell, j) in row.cols"
                                        v-if="cell"
                                        :class="{'seats-cell': true, seat: cell.col_no != -1, way: cell.col_no == -1}"
                                        :key="j"
                                        :data-row-index="i"
                                        :data-col-index="j"
                                        :data-num="cell.row_no + '_' + cell.col_no"
                                        :style="{display: cell.type == 2 && cell.ycoord % 2 == 0 ? 'none' : 'inline-block'}"
                                        ref="seatCell"
                                    >
                                        <i v-if="cell.col_no != -1"
                                            :class="{'icon-seat-my': cell.selected && cell.type != 2
                                            ,'icon-seat-other': cell.status == 0 && cell.type != 2
                                            ,'icon-seat-empty': cell.status == 1 && cell.type != 2
                                            ,'icon-seat-couple-my': cell.selected && cell.type == 2
                                            ,'icon-seat-couple-empty': cell.status == 1 && cell.type == 2
                                            ,'icon-seat-couple-other': cell.status == 0 && cell.type == 2
                                            ,'icon': true}"
                                        ></i>
                                    </div>

                                    <div v-else class="seats-cell way">

                                    </div>
                                </div>
                                <div class="gold" ref="gold"></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <bind-mobile
            :show.sync="isBindMobileShow"
            :url="hrefs.apiSendsmsmobile"
            :subUrl="hrefs.apiBindmobile"
            @onBindSuccess="bindMobileSuccess"
        ></bind-mobile>
    </div>
</template>

<script>
import iScrollZoom from "common/plugin/iScroll/iscroll-zoom";
import closest from "lib/dom/closest";
import bindMobile from "common/plugin/bindMobile";
import dialogManager from "common/plugin/dialog";
import * as comp from "lib/comp/bus";
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"
import storageMessager from "lib/util/storageMessager"

export default {
    props: {
        options: {
            type: Object,
            default() {
                return {}
            }
        },
        selection: {
            type: Array,
            default() {
                return []
            }
        },
        hrefs: {
            type: Object,
            default() {
                return {}
            }
        },
        onceFlag: {
            type: Boolean
        }
    },
    data() {
        const vm = this;
        return {
            rowSize: vm.options.seats.max_row,
            colSize: vm.options.seats.max_col,
            seats: vm.options.seats.seats,
            isBindMobile: +this.options.bindMobile,
            isBindMobileShow: false,
            hasNoPay: +this.options.hasnopay,
            goldArea: vm.options.goldArea,
            oldSeat: null,
            tips: ['哇哦，坐这观影体验会很好哦！', '酷！没有比这更合适的座位了！', '太棒了！座位真不错！'],
            isLogin: vm.options.is_login,
        }
    },
    computed: {

    },
    watch: {
        selection: {
            deep: true,
            handler(newVal, oldVal) {
                const vm = this;
                oldVal.forEach(function(item) {
                    setIcon("remove", item);
                })
                newVal.forEach(function(item) {
                    setIcon("add", item);
                });

                function setIcon(method = "add", item) {
                    let cell = vm.$refs.seatsMain.querySelector(`[data-row-index='${item.xcoord - 1}'][data-col-index='${item.ycoord - 1}']`);
                    let icon = cell && cell.querySelector(".icon");
                    icon && icon.classList[method](item.type == 2
                        ? "icon-seat-couple-my"
                        : "icon-seat-my");
                }
            }
        }
    },
    components: {
        bindMobile
    },
    created() {
        this.mySeats = this.arrangeSeats();
        console.log(this.mySeats)
        this.$emit("mySeatsInit", this.mySeats);
    },
    mounted() {
        this.handleNoPay();
        this.initIScroll();
        this.setSideBar();
        this.setCenterLine();
        this.setScreen();
        this.watchCenterLine();
        this.initFix(this.zoomer);
        this.computeGoldArea();

    },
    updated() {
    },
    nextTick() {
    },
    methods: {
        handleNoPay() {
            const vm = this;
            if (vm.hasNoPay) {
                dialogManager.confirm("您有订单未支付", {
                    okText: "去支付",
                    cancelText: "取消订单",
                    ok: function() {
                        vm.goPay();
                    },
                    cancel: function() {
                        vm.cancelPay();
                    }
                }).catch(function() {

                });
            }
        },
        goPay() {
            if(browser.WX){
                location.assign(this.hrefs.urlPay);
            }else{
                webBridge.openUrl(this.hrefs.urlPay, "self");
            }
        },
        cancelPay() {
            const vm = this;
            if (comp.isLock()) {
                return;
            }
            vm.lock();
            vm.$http.get(vm.hrefs.apiCancel).then(function(res) {
                const data = res.data || {};
                dialogManager.toast(data.msg || "操作成功")
                // .then(function() {
                //     // location.replace(vm.hrefs.urlShow);
                //     history.go(-1);
                // });
                if(browser.WX){
                    location.reload();
                }else{
                    webBridge.reload();
                }
                vm.unlock();
            }).catch(function(err) {
                dialogManager.toast(err.msg || "系统异常");
                vm.unlock();
            });
        },
        lock() {
            comp.lock();
            dialogManager.wait();
        },
        unlock() {
            comp.unLock();
            dialogManager.closeWait();
        },
        arrangeSeats() {
            const vm = this;
            const seats = vm.seats;
            let _mySeats = [];
            for (let i = 0; i < vm.rowSize; i++) {
                _mySeats.push({
                    cols: []
                });
            }
            seats.forEach(function(item, i) {
                item.selected = false;
                item.desc = item.status == 0 ? "other" : "my";
                _mySeats[item.xcoord - 1].cols[item.ycoord - 1] = item;
            });
            _mySeats.forEach((obj) => {
                let row = obj.cols;
                vm.fillRow(row);
            });
            //console.log("my seats", _mySeats)
//            _mySeats = _mySeats.filter( (row) => (row && row.cols && row.cols.length) )
            return _mySeats;
        },
        fillRow(row) {
            let rowLen = row.length;
            for (let i = 0; i < rowLen; i++) {
                if (!row[i]) {
                    row[i] = {col_no: -1}
                }
            }
        },
        initIScroll() {
            const vm = this;
            vm.zoomer = new iScrollZoom(vm.$refs.iscroll, {
                zoom: true,
                scrollX: true,
                scrollY: true,
                wheelAction: 'zoom',
                mouseWheel: true, //发布时设为false
                fixedScrollbar: true,
                zoomMax: 1.8,
                zoomMin: 0.38,
                bounceTime: 300,
                indicators: [
                    {
                        el: vm.$refs.sidebarWrapper,
                        resize: false,
                        ignoreBoundaries: true,
                        listenY: false,
                        speedRatioY: 0,
                        speedRatioX: -1,
                        custom: true,
                        _left: vm.$refs.sidebar.getBoundingClientRect().left
                    }
                ]
            });
        },

        initFix(zoomer) {
            const vm = this;
            const wrapperEl = vm.$refs.iscroll;
            const contentEl = vm.$refs.iscrollContent;
            const seatsMainEl = vm.$refs.seatsMain;
            let delta = wrapperEl.clientWidth - contentEl.clientWidth
            if (delta > 0) {
                seatsMainEl.style.marginLeft = delta / 2 + "px";
                vm.setScreen();
            } else {
                zoomer.scrollBy(delta / 2, 0);
            }
        },

        setSideBar() {
            const vm = this;
            const content = vm.$refs.iscrollContent;
            const sideBar = vm.$refs.sidebar;
            sideBar.style.height = content.offsetHeight + "px";
        },

        setCenterLine() {
            const vm = this;
            const centerLine = vm.$refs.centerLine;
            const seatsMain = vm.$refs.seatsMain;
            centerLine.style.height = seatsMain.offsetHeight + "px";
            centerLine.style.left = (Math.floor(seatsMain.offsetWidth / 2) - 1) + "px";
        },

        setScreen() {
            const vm = this;
            const rect = vm.$refs.centerLine.getBoundingClientRect();
            if (!vm.screenTop) {
                vm.screenTop = vm.$refs.seatsContent.getBoundingClientRect().top;
            }
            vm.$refs.screen.style.left = rect.left + "px";
            vm.$refs.screen.style.top = vm.screenTop + "px";
        },

        watchCenterLine() {
            const vm = this;
            const mObserv = window.MutationObserver || window.WebKitMutationObserver;
            const observ = new mObserv(vm.setScreen);
            if (vm.$refs.iscrollContent) {
                observ.observe(vm.$refs.iscrollContent, {
                    attributes: true,
                    childList: false,
                    characterData: false
                });
            }

            function handler() {
                vm.$refs.screen.style.left = vm.$refs.centerLine.getBoundingClientRect().left + "px";
            }
        },

        seatsMainClicked(ev) {
            const vm = this;
            let el = null;
            el = closest(ev.target, ".seat");
            if (!el) return;
            let loginData = storageMessager.getItem("isLogin", 0.5);
            if(vm.isLogin == 0 && !browser.WX && !loginData){
                storageMessager.send("loginSuc","");
                webBridge.openUrl(vm.hrefs.urlLogin, null, 1);
                return;
            }else if (!vm.isBindMobile && !loginData) {
                vm.openBindMobile();
                return;
            }
            const icon = el.querySelector(".icon");
            // 判断是否他人的已选座位
            if (icon.classList.contains("icon-seat-other")) {
                return;
            }
            const { rowIndex, colIndex } = el.dataset;
            let seatCell = vm.mySeats[rowIndex].cols[colIndex];
            if (seatCell.selected) {
                vm.cancelSeat(seatCell);
            } else {
                vm.selectSeat(seatCell, icon, rowIndex, colIndex);
            }
            console.log(vm.mySeats)
        },

        selectSeat(seatCell, icon, rowIndex, colIndex) {
            const vm = this;
            if (vm.selection.length > 3
                && !icon.classList.contains("icon-seat-my")
                && !icon.classList.contains("icon-seat-couple-my")
                || vm.selection.length > 2
                && icon.classList.contains("icon-seat-couple-empty")
            ) {
                dialogManager.toast("一次最多选择4个座位");
                return;
            }
            vm.scrollOnClick();
            // 点击了未选中的座位，判断是否留下了单个空位
            let checkedResult = vm.canSelect(rowIndex, colIndex, seatCell);
            // if (checkedResult == 3) {
            //     dialogManager.toast("请连续选择座位，不要留下单个的空闲座位");
            //     return;
            // }
            if (checkedResult == 2) { // 情侣座
                vm.toggleCoupleSeat(true, seatCell);
            } else {
                seatCell.selected = !seatCell.selected;
            }
            if ( ( vm.options.numActive != '' && vm.selection.length + 1 > vm.options.numActive
                || vm.options.show.activity_num_user != ""
                && vm.selection.length + 1 > vm.options.show.activity_num_user )
                && vm.onceFlag) {

                dialogManager.confirm("超出活动购票数，将以正常价计算哦", {
                    'okText': '确定',
                    'cancelText': '取消'
                }).then(()=> {
                    vm.updateOnceFlag(false);
                }).catch((res) => {
                    seatCell.selected = !seatCell.selected;
                    vm.$emit("changeSelected");
                })

            }
            vm.$emit("changeSelected");
        },
        cancelSeat(seatCell) {
            const vm = this;
            let rowIndex = seatCell.xcoord - 1;
            let colIndex = seatCell.ycoord - 1;
            let sign = vm.canSelect(rowIndex, colIndex, seatCell);

            // if (sign == -2) {
            //     vm.mySeats[rowIndex].cols[colIndex - 1].selected = false;
            // } else if (sign == -3) {
            //     vm.mySeats[rowIndex].cols[colIndex + 1].selected = false;
            // }

            if (seatCell.love_code) {
                vm.toggleCoupleSeat(false, seatCell);
            } else {
                seatCell.selected = !seatCell.selected;
            }

            vm.$emit("changeSelected");
        },
        toggleCoupleSeat(bool, seatCell) {
            const vm = this;
            let cellLeft, cellRight
            let rowIndex = seatCell.xcoord - 1;
            let clickedCol = seatCell.ycoord - 1;
            vm.mySeats[rowIndex].cols[clickedCol].selected = bool;
            cellLeft = vm.mySeats[rowIndex].cols[clickedCol - 1];
            cellRight = vm.mySeats[rowIndex].cols[clickedCol + 1];

            if (cellLeft && cellLeft.love_code === seatCell.love_code) {
                cellLeft.selected = bool;
            } else if (cellRight && cellRight.love_code === seatCell.love_code) {
                cellRight.selected = bool;
            }
        },
        /**
         * @return
         * 0 不可选
         * 1 可选单个座位
         * 2 可选情侣座
         * 3 不可选，弹出提示
         * -1 取消本座位
         * -2 取消本座及其左
         * -3 取消本座及其右
         */
        canSelect(rowIndex, colIndex, seatCell) {
            let isCancel = seatCell.selected;
            const vm = this;
            const obj = vm.createChars(rowIndex, colIndex, seatCell);
            let markedBeforeSelect = obj.before;
            let marked = obj.after;

            let char = markedBeforeSelect.charAt(colIndex);

            /**
             * x 走廊
             * 0 可选单座
             * 1 自己已选
             * 2 别人已选
             * 3 可选情侣座
             */
            if (char == 0) {
                if (/^[^0]*00[^0]*$/.test(markedBeforeSelect)
                    // || /(^|x+)(0{0,3}|a)($|x+)/.test(marked)
                    // || /([^01]|x)(0|a)([^01]|x)/.test(marked)
                    || /(^|x+)(a0|0a)[^01]|[^01](a0|0a)($|x+)/.test(marked)
                ) {
                    return 1;
                }
                if (/[^0x]+0a|a0[^0x]+/.test(marked)) {
                    return 3;
                } else {
                    return 1
                }
            }
            if (char == 1) {
                let r1 = /1a([^01x]|11)/
                let r2 = /([^01x]|11)a1/
                if (r1.test(marked)) {
                    return -2
                } else if (r2.test(marked)) {
                    return -3
                }
                else if (/0*1a10*/.test(marked)) {
                    return -2
                }
                else {
                    return -1
                }
            }

            if (char == 3) {
                return 2
            }

            return 0;
        },
        createChars(rowIndex, colIndex, seatCell) {
            let isCancel = seatCell.selected;
            const vm = this;
            let rowData = vm.mySeats[rowIndex].cols; // 指定行的座位
            let markedArr = rowData.map(function(item, i) {
                if (item.col_no == -1) {
                    return "x"
                }
                else if (item.selected) { // 自己已选
                    return "1"
                }
                else if (item.status == 0) { // 别人已选
                    return "2"
                }
                else if (item.status == 1) {
                    if (item.type == 2) {
                        return "3"
                    } else {
                        return "0"
                    }
                }

                else { // 可选
                    return "0"
                }
                // return item.selected || item.status == 0 ? 1 : 0
            });
            let markedBeforeSelect = markedArr.join("");
            markedArr[colIndex] = "a";
            let marked = markedArr.join("");
            return {
                before: markedBeforeSelect,
                after: marked
            }
        },
        scrollOnClick() {
            const vm = this;
            const zoomer = vm.zoomer;
            let scale = 1.3;
            let x = zoomer.pointX;
            let y = zoomer.pointY;
            zoomer.zoom(scale, x, y)
        },
        openBindMobile() {
            this.isBindMobileShow = true;
        },
        closeBindMobile() {
            this.isBindMobileShow = false;
        },
        bindMobileSuccess() {
            if(browser.WX){
                location.reload();
            }else{
                webBridge.reload();
            }
            this.isBindMobile = true;
        },
        /**
        * @param {Array} data
        */
        recommend(data) {
            const vm = this;
            let loginData = storageMessager.getItem("isLogin", 0.5);
            if(vm.isLogin == 0 && !browser.WX && !loginData){
                storageMessager.send("loginSuc","");
                webBridge.openUrl(vm.hrefs.urlLogin, null, 1);
                return;
            }else if (!vm.isBindMobile && !loginData) {
                vm.openBindMobile();
                return;
            }
            function matchSeat(val) {
                for (let i in vm.$refs.seatCell) {
                    for (let j in val) {
                        if (vm.$refs.seatCell[i].dataset.rowIndex == (val[j]['r'] - 1) &&
                            vm.$refs.seatCell[i].dataset.colIndex == (val[j]['l'] - 1)) {
                            let icon = vm.$refs.seatCell[i].querySelector(".icon");
                            let { rowIndex, colIndex } = vm.$refs.seatCell[i].dataset;
                            let seatCell = vm.mySeats[rowIndex].cols[colIndex];
                            if (vm.$refs.seatCell[i].style.display == 'inline-block') {
                                vm.selectSeat(seatCell, icon, rowIndex, colIndex);
                            }
                        }
                    }
                }
            }
            matchSeat(data);
            vm.oldSeat = data;
            dialogManager.toast(vm.tips[parseInt(Math.random()*10%3)], {
                overlay: false
            });
        },
        updateOnceFlag(bool) {
            this.$emit("updateOnceFlag", bool);
        },
        computeGoldArea() {
            let vm = this;
            let x = 0;
            let y = 0;
            let datum = document.documentElement.style.fontSize.split("px")[0];
            let sample = document.querySelectorAll(".seats-cell.seat")[1];
            let sampleRow = closest(sample, ".seats-row");
            let cssParams = getComputedStyle(sample);
            let styles = getComputedStyle(sampleRow);
            let iconNode = sample.children[0];
            if (iconNode.classList.contains("icon-seat-couple-my") ||
                iconNode.classList.contains("icon-seat-couple-empty") ||
                iconNode.classList.contains("icon-seat-couple-other")) {
                    x = Number(cssParams.width.split("px")[0])/2;
//                    y = Number(cssParams.height.split("px")[0]);
            }
            if (iconNode.classList.contains("icon-seat-my") ||
                iconNode.classList.contains("icon-seat-empty") ||
                iconNode.classList.contains("icon-seat-other")) {
                    x = Number(cssParams.width.split("px")[0]);
//                    y = Number(cssParams.height.split("px")[0])
            }
            y = parseFloat(styles.height);

            vm.$refs.gold.style.width = (Number(vm.options.goldArea[1]['l']) - Number(vm.options.goldArea[0]['l']) + 1) * x + 'px';
            vm.$refs.gold.style.height = (Number(vm.options.goldArea[2]['r']) - Number(vm.options.goldArea[0]['r']) + 1) * y + 'px';
            vm.$refs.gold.style.top = (Number(vm.options.goldArea[0]['r']) - 1) * y - 0  + 'px';
            vm.$refs.gold.style.left =(Number(vm.options.goldArea[0]['l']) - 1) * x + 'px';
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";

$seat-margin-x: r(9);
$seat-margin-y: r(10);

.seats-content {
    position: relative;
    // @include flex(1);
    height: 100%;
    padding-top: r(60);
    overflow: hidden;
    overflow-y: auto;

    .screen {
        position: fixed;
        z-index: 1;
        top: 0;
        @include translate(-50%, 0);
        padding: r(6) r(45);
        @include radius(0 0 r(10) r(10));
        white-space: nowrap;
    }

    .iscroll-wrapper {
        // 高度由iScroll滚动元素撑开
        max-height: 100%;
    }

    .iscroll-content {
        display: inline-block;
        padding-left: r(24);
        padding-right: r(24);
    }

    .side-bar-wrapper {
        position: relative;
        white-space: nowrap;
    }

    .seats-main {
        position: relative;
        display: inline-block;

        .center-line {
            position: absolute;
            border-left-width: 1px;
            border-left-style: dashed;
            pointer-events: none;
        }

        .seats-main-content {
            position: relative;
            margin-top: r(24);
            margin-bottom: r(24);
        }
        .seats-row {
            @include display-flex();
            height: r(39+16);
            .seats-cell {
                display: inline-block;
                @include box-sizing(border-box)
                // min-height: r(39+10);
                height: 100%;
                min-width: r(42+10);
                padding: rem(8px 5px);

                &.way {
                    &>i {
                        visibility: hidden;
                    }
                }

                &>i {
                    @include wh(42px, 39px);
                    background-repeat: no-repeat;
                    background-size: 100% 100%;

                    &.icon-seat-other {
                        background-image: img-url('seat_chosed_big.png');
                    }
                    &.icon-seat-empty {
                        background-image: img-url('seat_empty_big.png');
                    }
                    &.icon-seat-couple-empty {
                        @include wh(94px, 39px);
                        background-image: img-url('seat_cpempty_big.png');
                    }
                    &.icon-seat-couple-other {
                        @include wh(94px, 39px);
                        background-image: img-url('seat_cpchosed_big.png');
                    }

                    &.icon-seat-my {
                        background-image: img-url('seat_chosing_big.png');
                    }

                    &.icon-seat-couple-my {
                        @include wh(94px, 39px);
                        background-image: img-url('seat_cpchosing_big.png');
                    }
                }
            }
        }
        .gold {
            position: absolute;
            z-index: -100;
            @include radius(rem(10px));
        }
    }

    .side-bar {
        box-sizing: border-box;
        position: relative;
        z-index: 1;
        display: inline-block !important;
        padding-top: r(24);
        padding-bottom: r(24);
        vertical-align: top;
        width: r(30);
        @include radius(rem(30px));
        white-space: normal;

        .column {
            @include display-flex();
            @include flex-direction(column);
            @include justify-content(space-between);
            @include align-items(center);
            height: 100%;
        }

        .item {
            // display: inline-block;
            // width: 100%;
            height: r(44);
            @include font-size(24px);
            line-height: r(44);
            // // padding-bottom: r(4);
            // font-size: 10px;
            // text-align: center;

            // &+.item {
            //     margin-top: $seat-margin-y;
            // }
        }
    }
}
</style>
