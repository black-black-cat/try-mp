<template>
    <div :class="selectCinemaClass">
        <div class="search-title vh-between" ref="searchTitle">
            <div class="search-input vh-left">
                <i class="icon-search"></i>
                <input @focus="focus" ref="input" v-model="inputText" placeholder="搜索" class="input" type="text" />
                <span @click="clearText" class="clear-text" v-show="clearShow">&nbsp;
                </span>
            </div>
            <i class="icon-dialog-close" v-if="closeShowStatus" @click="close"></i>
        </div>
        <div class="show-content" v-show="!searchStatus">
            <nav class="show-nav">
                <div class="indexer" ref="indexer" @click="posCity">
                    <span class="index-item" :data-key="item" v-for="(item, index) in indexer" :key="index"> {{ item }}</span>
                </div>
                <div class="select-city" :class="{visible: curCity.length > 0}">
                    <div class="name">当前城市</div>
                    <div class="city-btn vh-center selected" :class="{more: curCity.length > 5}">{{ curCity }}</div>
                </div>
                <div @click="selectCity" class="city-group scrolling" ref="cityGroup" :style="{maxHeight: maxHeight}" data-bind-scroll>
                    <template v-for="(item, key) in cityList">
                        <span class="name" :data-type="key">{{ key }}</span>
                        <ul>
                            <li class="item-btn vh-center" v-for="c in item" :data-key="c.code" :data-text="c.name" :class="{more: c.name.length > 5}">
                                {{ c.name }}
                            </li>
                        </ul>
                    </template>
                </div>
            </nav>
            <ul @click="selectCinema" :style="{maxHeight: searchMaxHeight}" class="show-items scrolling" data-bind-scroll>
                <li class="item" :data-key="item.code" v-for="(item, index) in showCinemaList" :key="index">
                    <div class="cinema-name"> {{ item.name }}

                    </div>
                    <div class="location"> {{ item.address }}

                    </div>
                </li>
            </ul>
        </div>
        <ul @click="selectCinema" :style="{maxHeight: searchMaxHeight}" class="search-items scrolling" v-show="searchStatus" data-bind-scroll>
            <li class="item" :data-key="item.code" v-for="(item, index) in showSearchCinemaList" :key="index">
                <div class="cinema-name" v-html="item.name"></div>
                <div class="location"> { { item.address } }

                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import viewport from "lib/comp/viewport";
    import getOffset from "lib/dom/getOffset";
    import clone from "lib/json/clone";
    import dialogManager from "common/plugin/dialog";
    import browser from "lib/util/browser";
    import webBridge from "common/utils/webBridge";
    const wx = window.wx;
    export default {
        props: {
            url: String,
            closeShow: {
                type: Boolean,
                default: true
            },
            iphoneX: {
                type: String,
                default: ""
            }
        },
        data() {
            const rem = viewport.rem();
            return {
                clearShow: false,
                closeShowStatus: this.closeShow,
                searchStatus: false,
                top: 0,
                inputText: "",
                apiCallback: "",
                isInit: false,
                position: {},
                rem: rem,
                curCity: "",
                curKey: null,
                cityList: [],
                cinemaList: {},
                searchCinemaList: [],
                mapList: {},
                indexer: [],
                defMaxHeight: window.innerHeight - 130 * rem / 75 + "px",
                curMaxHeight: window.innerHeight - 325 * rem / 75 + "px",
                searchMaxHeight: window.innerHeight - 130 * rem / 75 + "px"
            };
        },
        mounted() {
            this.$refs.indexer.addEventListener("touchmove", this.touchMove);
            this.initData();
            if (browser.WX) {
                this.setMapInit();
                wx &&
                    wx.ready(() => {
                        this.addMap();
                    });
            } else {
                this.getLocation();
            }
        },
        computed: {
            maxHeight() {
                return this.curCity && this.curCity.length > 0 ?
                    this.curMaxHeight :
                    this.defMaxHeight;
            },
            showCinemaList() {
                return this.cinemaList[this.curKey] || [];
            },
            showSearchCinemaList() {
                if (this.clearShow) {
                    const text = this.inputText.trim();
                    const result = clone(
                        this.searchCinemaList.filter(item =>
                            item.name.includes(text)
                        )
                    );
                    return result.map(item => {
                        item.name = item.name.replace(
                            new RegExp(text, "g"),
                            function (a) {
                                return "<em>" + a + "</em>";
                            }
                        );
                        return item;
                    });
                }
                return [];
            },
            selectCinemaClass() {
                return this.iphoneX + " m-select-cinema";
            }
        },
        watch: {
            inputText(val) {
                this.clearShow = val.trim().length > 0;
            }
        },
        methods: {
            weChatLocation() {
                const vm = this;
                wx.getLocation({
                    type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
                        //                        const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        //                        const longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        //                        const speed = res.speed; // 速度，以米/每秒计
                        //                        const accuracy = res.accuracy; // 位置精度
                        //                        console.log(latitude, longitude, speed, accuracy);
                        dialogManager.wait();
                        let onMapFail = function () {
                            dialogManager.closeWait();
                            dialogManager.alert("获取城市超时,请手动选择城市");
                        };
                        let tid = setTimeout(onMapFail, 15 * 1000);
                        let geocoder = new qq.maps.Geocoder({
                            complete: function (result) {
                                clearTimeout(tid); //                                console.log(result.detail)
                                let city = result.detail.addressComponents.city.replace(
                                    /市$/,
                                    ""
                                );
                                let popupEl = document.querySelector(
                                    ".m-select-cinema"
                                );
                                let el = document.querySelector(
                                    `[data-text='${city}']`
                                );
                                if (el) {
                                    vm.curCity = city;
                                    vm.curKey = el.dataset.key;
                                    dialogManager.toast("您所在的是" + city);
                                } else {
                                    popupEl &&
                                        dialogManager.toast(
                                            "您所在的城市未开通影院"
                                        );
                                }
                                dialogManager.closeWait();
                            },
                            error: function () {
                                clearTimeout(tid);
                                dialogManager.closeWait();
                                dialogManager.alert("获取城市失败,请手动选择城市");
                            }
                        });
                        let coord = new qq.maps.LatLng(res.latitude, res.longitude);
                        geocoder.getAddress(coord);
                    },
                    fail: function (res) {
                        console.log(res, "没获取到");
                        dialogManager.closeWait();
                    },
                    cancel: function (res) {
                        console.log(res, "没获取到");
                        dialogManager.closeWait();
                    }
                });
            },
            getLocation() {
                const vm = this;
                if (webBridge && webBridge.isReady()) {
                    dialogManager.wait();
                    webBridge.getCurrentRegion(function (res) {
                        dialogManager.closeWait();
                        if (res && res.code == 0) {
                            let city = res.data.areaName.replace(/市$/, "");
                            let popupEl = document.querySelector(
                                ".m-select-cinema"
                            );
                            vm.curCity = city;
                            vm.curKey = res.data.areaNo;
                            let el = document.querySelector(
                                `[data-text='${city}']`
                            );
                            if (el) {
                                vm.curCity = city;
                                vm.curKey = el.dataset.key;
                                dialogManager.toast("您所在的是" + city);
                            } else {
                                popupEl &&
                                    dialogManager.toast("您所在的城市未开通影院");
                            }
                            dialogManager.closeWait();
                        } else {
                            dialogManager.alert("获取城市失败,请手动选择城市");
                        }
                    });
                }
            },
            setMapInit() {
                const vm = this;
                window.init = function () {
                    vm.weChatLocation();
                };
            },
            addMap(onload) {
                const vm = this;
                let mapUrl = "http://map.qq.com/api/js?v=2.exp&callback=init";
                let script = document.createElement("script");
                script.charset = "utf-8";
                script.src = mapUrl;
                script.onload = () => {
                    onload && onload.apply(vm);
                };
                document.body.appendChild(script);
            },
            initShow() {
                this.top = getOffset(this.$refs.cityGroup).top;
                [...this.$refs.cityGroup.querySelectorAll(".name")].forEach(
                    node => {
                        this.position[node.dataset.type] =
                            getOffset(node).top - this.top;
                    }
                );
                this.isInit = true;
            },
            initData() {
                //                const key = "_cinema_list_data_";
                //                const storage = window.sessionStorage;
                const self = this;
                const set = function (res) {
                    self.indexer = res.indexer;
                    self.cityList = res.city;
                    self.cinemaList = res.cinema;
                    self.apiCallback = res.apiCallback;
                    for (let key in self.cinemaList) {
                        self.cinemaList[key].forEach(r => {
                            self.searchCinemaList.push({
                                code: r.code,
                                name: r.name,
                                address: r.address
                            });
                            self.mapList[r.code] = {
                                area_code: key,
                                cinema_code: r.code,
                                cinema_name: r.name,
                                cinema_address: r.address
                            };
                        });
                    } //                    (self.cityList["S"] || []).forEach(item => {
                    //                        if(self.curKey === null && item.name === self.curCity){
                    //                            self.curKey = item.code;
                    //                            return false;
                    //                        }
                    //                    });
                    self.isInit && setTimeout(self.initShow, 0);
                }; //                if(storage.getItem(key)){
                //                    set(JSON.parse(storage.getItem(key)));
                //                    return;
                //                }
                this.$http
                    .get(this.url)
                    .then(item => {
                        //                        storage.setItem(key, JSON.stringify(item.data));
                        set(item.data);
                    })
                    .catch(res => {
                        console.log(res.msg);
                    });
            },
            touchMove(ev) {
                ev.stopPropagation();
                const moveY = ev.touches[0].clientY - this.top;
                const index = Math.floor(moveY / (47 * this.rem / 75));
                const key = this.indexer[index];
                if (this.position[key] !== undefined) {
                    this.$refs.cityGroup.scrollTop = this.position[key];
                }
                ev.preventDefault();
            },
            posCity(ev) {
                const key = ev.target.dataset.key;
                if (this.position[key] !== undefined) {
                    this.$refs.cityGroup.scrollTop = this.position[key];
                }
            },
            focus() {
                this.$refs.searchTitle.classList.add("search");
                this.$refs.input.placeholder = "输入影院名称查询";
                this.searchStatus = true;
                this.closeShowStatus = true;
            },
            close() {
                if (this.searchStatus) {
                    this.$refs.input.blur();
                    this.searchStatus = false;
                    this.closeShowStatus = this.closeShow;
                    this.$refs.input.placeholder = "搜索";
                    this.inputText = "";
                    this.$refs.searchTitle.classList.remove("search");
                } else {
                    this.$emit("close");
                }
            },
            clearText() {
                this.inputText = "";
            },
            selectCity(ev) {
                if (ev.target.classList.contains("item-btn")) {
                    this.curCity = ev.target.dataset.text;
                    this.curKey = ev.target.dataset.key;
                }
            },
            selectCinema(ev) {
                let tar = ev.target;
                if (tar.nodeName.toLowerCase() === "div") {
                    tar = tar.parentNode;
                }
                if (tar.nodeName.toLowerCase() === "li") {
                    const key = tar.dataset.key;
                    const obj = this.mapList[key] || {};
                    this.searchStatus && this.close();
                    this.$emit("close", {
                        url: this.apiCallback,
                        data: obj
                    });
                }
            }
        }
    };

</script>

<style lang="scss">
    @import "../../../common/style/mixin";
    .m-select-cinema {
        @include display-flex;
        @include flex-direction;
        position: absolute;
        z-index: 10;
        width: 100%;
        height: 100%;
    }

    .search-title {
        @include wh(100%, 130px);
        @include box-sizing;
        @include transition(padding 0.3s ease);
        padding: rem(0 34px 0 44px);
        &.search {
            padding: rem(0 34px 0 34px);
            .search-input {
                @include width(618px);
                .input {
                    @include flex(1);
                    height: auto;
                    line-height: normal;
                }
            }
        }
    }

    .search-input {
        @include wh(188px, 70px);
        @include transition(width 0.3s ease);
        @include radius(rem(70px));
        @include box-sizing;
        .input {
            @include font-size(28px);
            @include width(100px);
            @include lh(65px);
            background: none;
            border: 0 none;
        }
    }

    .icon-search {
        margin: rem(0 10px 0 42px);
    }

    .clear-text {
        @include wh(34px);
        @include radius(rem(34px));
        @include minus;
        margin-right: rem(24px);
    }

    .show-content {
        @include flex(1);
        @include display-flex;
    }

    .show-nav {
        @include wh(250px, 100%);
        position: relative;
    }

    %item {
        .item {
            padding: rem(34px 0 40px);
        }
        .cinema-name {
            @include font-size(30px);
            @include max-width(450px);
            @extend %ellipsis-basic;
            em {
                font-weight: normal;
                vertical-align: baseline;
            }
        }
        .location {
            @include font-size(22px);
            @include max-width(450px);
            @extend %ellipsis-basic;
            padding-top: rem(18px);
        }
    }

    .show-items {
        @include flex(1);
        @include box-sizing;
        @extend %item;
        padding-left: rem(20px);
    }

    .search-items {
        @extend %item;
        padding-left: rem(34px);
        .cinema,
        .location {
            @include max-width(694px);
        }
    }

    .indexer {
        @include wh(44px, 100%);
        position: absolute;
        top: rem(108px);
        left: 0;
        z-index: 10;
    }

    .index-item {
        @include font-size(23px);
        @include wh(44px, 47px);
        @include lt(47px);
        display: block;
        text-indent: rem(8px);
    }

    %btn {
        @include wh(186px, 70px);
        @include radius(rem(70px));
        @include box-sizing;
        @include font-size(32px);
        &.more {
            @include font-size(24px);
            padding: rem(0 10px);
            text-align: center;
            word-break: break-all;
        }
    }

    .select-city {
        @include transition(all 0.5s);
        overflow: hidden;
        height: 0;
        padding-left: rem(44px);
        &.visible {
            @include height(156px);
            padding-bottom: rem(36px);
        }
        .name {
            @include font-size(28px);
            padding: rem(34px 0 24px);
        }
        .city-btn {
            @extend %btn;
        }
    }

    .city-group {
        padding-left: rem(44px);
        .name {
            @include font-size(32px);
            display: block;
            padding: rem(24px 0);
        }
        .item-btn {
            @extend %btn;
            margin-bottom: rem(20px);
        }
    }

</style>
