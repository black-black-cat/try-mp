<template>
    <div class="m-show-time" :class="{'top-fix': fixedList}" ref="container">
        <template v-if="suc">
            <div class="date-tab vh-left" :class="{'top-fix': fix}">
                <swiper class="time-list" :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
                    <swiper-slide :class="{'slide-active': active[index]}" :data-time="item" v-for="(item, index) in dateList" :key="index">{{item}}</swiper-slide>
                </swiper>
                <div class="time-line" v-if="isMoreCinema"></div>
                <div class="time-filter vh-right" v-if="isMoreCinema">
                    <i class="icon-filtrate"></i>
                    <i class="icon-search"></i>
                </div>
            </div>
            <div class="wrapper">
                <template v-for="item in activityList">
                    <div class="discount vh-left" v-if="item.activity_no && item.activity_tag && item.activity_type" v-href="item.activity_url">
                        <div class="card" :class="device">优惠</div>
                        <div class="word vh-center">
                            <span content="name">{{item.activity_tag}}</span><span class="rmb hide">9.9</span><span class="hide">元观影</span>&nbsp;&nbsp;
                            <span class="hide">每人限购</span><span class="rmb hide">2</span><span class="hide">张</span>
                        </div>
                    </div>
                </template>

                <template v-if="isMoreCinema">
                    <ul class="movies-items">
                        <li class="movie-item" v-for="n in 9">
                            <div class="movie-name vh-between">
                                <span class="name">新南国影城(龙华九方店）</span>
                                <span class="price"><span class="vip">会员¥</span><span class="money">29.9</span><span>起</span></span>
                            </div>
                            <div class="movie-address vh-between">
                                <span class="address">龙华新区龙华主干道人民南路与腾龙路…</span>
                                <span class="km">1.4km</span>
                            </div>
                            <div class="movie-tabs vh-between">
                                <ul class="tab-list vh-left">
                                    <li class="tab">小吃</li>
                                    <li class="tab">杜比厅</li>
                                </ul>
                                <div class="btn vh-right" @click="toggle(n)">
                                    <span>排期</span><i class="arrow-down" :class="{top: scheduleShow[n]}"></i>
                                </div>
                            </div>
                            <swiper :class="{show: scheduleShow[n]}" class="schedule-items" :options="scheduleOption" :not-next-tick="notNextTick">
                                <swiper-slide class="gray"><span class="mark" data-text="停售">停售</span><div class="time">15:30</div><div class="type">英语3D</div><div class="price"><span class="sub">¥</span><span>29.9</span></div></swiper-slide>
                                <swiper-slide><div class="time">15:30</div><div class="type">英语3D</div><div class="price"><span class="sub">¥</span><span>29.9</span></div></swiper-slide>
                                <swiper-slide><div class="time">15:30</div><div class="type">英语3D</div><div class="price"><span class="sub">¥</span><span>29.9</span></div></swiper-slide>
                                <swiper-slide><div class="time">15:30</div><div class="type">英语3D</div><div class="price"><span class="sub">¥</span><span>29.9</span></div></swiper-slide>
                                <swiper-slide><div class="time">15:30</div><div class="type">英语3D</div><div class="price"><span class="sub">¥</span><span>29.9</span></div></swiper-slide>
                                <swiper-slide><div class="time">15:30</div><div class="type">英语3D</div><div class="price"><span class="sub">¥</span><span>29.9</span></div></swiper-slide>
                                <swiper-slide><div class="time">15:30</div><div class="type">英语3D</div><div class="price"><span class="sub">¥</span><span>29.9</span></div></swiper-slide>
                                <swiper-slide><div class="time">15:30</div><div class="type">英语3D</div><div class="price"><span class="sub">¥</span><span>29.9</span></div></swiper-slide>
                                <swiper-slide><div class="time">15:30</div><div class="type">英语3D</div><div class="price"><span class="sub">¥</span><span>29.9</span></div></swiper-slide>
                            </swiper>
                        </li>
                    </ul>
                </template>
                <template v-else>
                <div class="film-title day vh-center" v-show="dayList.length > 0">
                    <span class="line"></span><i class="icon-sun"></i><span>日场</span><span class="line"></span>
                </div>
                <ul class="film-items" v-show="dayList.length > 0">
                    <li class="item vh-left" v-href="href.urlSeat" :data-query="'show_no='+item.show_no" v-for="(item,index) in dayList" v-if="item.isday === 1" :key="index">
                        <div class="date">
                            <div class="hour">{{item.show_time}}</div>
                            <div class="end">{{item.end_time}}</div>
                        </div>
                        <div class="lang">
                            <div class="type">{{item.language}} {{item.show_type_name}}</div>
                            <div class="hall">{{item.hall_name}}</div>
                        </div>
                        <span class="compare hidden" v-if="item.num_parity < 2">&nbsp;</span>
                        <span class="compare vh-center" v-else @click.stop="showDialog(item.parity)">{{countNames[item.num_parity] || item.num_parity}}家比价</span>
                        <div class="vh-right">
                            <div class="price">
                                <div class="num vh-right">
                                    <span class="icon">&yen;</span><span class="rate">{{item.activity_price || item.sale_price}}</span>
                                </div>
                                <span class="vipCard" :class="deviceType" v-if="item.member_price != 0">
                            <span class="card">会员</span><span class="number">&yen;{{item.member_price}}起</span>
                        </span>
                            </div>
                            <i class="arrow-right"></i>
                        </div>
                    </li>
                </ul>
                <div class="film-title night vh-center" v-show="nightList.length > 0">
                    <span class="line"></span><i class="icon-night"></i><span>夜场</span><span class="line"></span>
                </div>
                <ul class="film-items" v-show="nightList.length > 0">
                    <li class="item vh-left" v-href="href.urlSeat" :data-query="'show_no='+item.show_no" v-for="(item,index) in nightList" v-if="item.isday === 0" :key="index">
                        <div class="date">
                            <div class="hour">{{item.show_time}}</div>
                            <div class="end">{{item.end_time}}</div>
                        </div>
                        <div class="lang">
                            <div class="type">{{item.language}} {{item.show_type_name}}</div>
                            <div class="hall">{{item.hall_name}}</div>
                        </div>
                        <span class="compare hidden" v-if="item.num_parity < 2">&nbsp;</span>
                        <span class="compare vh-center" v-else @click.stop="showDialog(item.parity)">{{countNames[item.num_parity] || item.num_parity}}家比价</span>
                        <div class="vh-right">
                            <div class="price">
                                <div class="num vh-right">
                                    <span class="icon">&yen;</span><span class="rate">{{item.activity_price || item.sale_price}}</span>
                                </div>
                                <span class="vipCard" :class="deviceType" v-if="item.member_price != 0">
                            <span class="card">会员</span><span class="number">&yen;{{item.member_price}}起</span>
                        </span>
                            </div>
                            <i class="arrow-right"></i>
                        </div>
                    </li>
                </ul>
            </template>
            </div>
        </template>
        <template v-else>
            <div class="vh-center error-info">
                <error msg="获取影片失败" refresh="true"></error>
            </div>
        </template>
    </div>
</template>

<script>
    import {swiper,swiperSlide} from "common/plugin/swiper";
    import popup from 'lib/layer/popup';
    import price from './ChannelPrice.vue'
    import dialogManager from 'common/plugin/dialog'
    import viewport from 'lib/comp/viewport'
    import debounce from 'lib/util/debounce'
    import {object} from 'common/utils/defaultProps'
    import {bind, fire} from 'lib/comp/bus'
    import getOffset from 'lib/dom/getOffset'
    import error from 'common/components/error.vue'

    export default {
        props: {
            href: object,
            option: object
        },
        data () {
            const vm = this;
            return {
                suc: true,
                isMoreCinema: false,
                countNames: ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
                showList: {},
                dateList: [],
                activity: {},
                cacheShows: {},
                active: {},
                scheduleShow: {},
                total: 0,
                height: 690 * viewport.rem() / 75,
                fix: false,
                deviceType: viewport.getDeviceType(),
                device: viewport.getDeviceType() === 'iphone' ? 'iphone vh-center': 'android line-center',
                bottomPopup: null,
                notNextTick: false,
                time: "",
                debounced: debounce(this.getMovie, 300),
                swiperOption: {
//                    centeredSlides: true,
                    slidesPerView: "auto",
                    freeMode: true,
                    freeModeMomentum: true,
                    onTap(swiper) {
                        const index = swiper.clickedIndex;
                        vm.slideTo(index);
                        if(index >= 1 && index <= vm.total - 2){
                            vm.$refs.mySwiper.swiper.slideTo(index);
                        }
                        vm.time = swiper.slides[index].dataset.time;
                    }
                },
                scheduleOption: {
                    slidesPerView: "auto",
                    freeMode: true,
                    freeModeMomentum: true
                }
            }
        },
        mounted () {
            const self = this;
            self.bottomPopup = popup("<price :option='option' :url-create-card='urlCreateCard' :url-card-list='urlCardList' @close='close'/>", {
                option: {
                    autoHide: true,
                    animate: {
                        name: "slide-bottom"
                    }
                },
                popup: {
                    data () {
                        return {
                            option: [],
                            index:"",
                            lastCode: null,
                            urlCreateCard: self.href.urlCreateCard,
                            urlCardList: self.href.urlMcard
                        }
                    },
                    methods: {
                        close () {
                            self.bottomPopup.hide();
                        }
                    },
                    components: {
                        price
                    }
                }
            });
            self.bottomPopup.setFullScreen(true, false);
            self.bottomPopup.setPosition(0, "auto", "auto", 0);
//            self.height = getOffset(this.$el).top - this.height;
            let n = {};
            for(let i = 0;i < 10; i++){
                n[i] = false;
            }
            self.scheduleShow = n;
            bind("scroll.fix", this.scroll);
            bind("fixedDateTab", () => {});
        },
        components: {
            swiper, swiperSlide, error
        },
        watch: {
            option () {
                this.debounced();
            },
            fix (val) {
                this.fixedList = val;
                if (val) {
                    this.$refs.container.style.height = ( window.innerHeight - (198 + 65 + 84 + 20) * viewport.rem() / 75 ) + "px"
                } else {
                    this.$refs.container.style.removeProperty("height");
                }
            }
        },
        computed: {
            dayList () {
                return (this.showList[this.time] || []).filter(item => item.isday === 1);
            },
            nightList () {
                return (this.showList[this.time] || []).filter(item => item.isday === 0);
            },
            activityList () {
                return this.activity[this.time] || [];
            }
        },
        methods: {
            scroll (obj) {
                // const container = this.$refs.container;
                // let rect = container.getBoundingClientRect();
                this.fix = obj.top > this.height + obj.height;
            },
            fixedDateTab(bool) {
                this.fix = bool
            },
            toggle (index) {
                this.scheduleShow[index] = !this.scheduleShow[index];
            },
            slideTo (index){
                for(let key in this.active){
                    if(this.active[key]){
                        this.active[key] = false;
                        break;
                    }
                }
                this.active[index] = true;
            },
            getActive (list) {
                const obj = {};
                list.forEach((item, index) => {
                    obj[index] = false;
                });
                obj[0] = true;
                return obj;
            },
            getMovie () {
                const self = this;
                const code = self.option.code;
                let cacheShow = self.cacheShows[code];
                if (cacheShow) {
                    setData(cacheShow);
                    return;
                }
                self.lastCode = code;
                // dialogManager.wait();
                self.$http.get(self.href.urlCinemafilm, {
                    params: {film_code: code}
                }).then(function (res) {
                    if(code === self.lastCode){
                        setData(res);
                        self.cacheShows[code] = res;
                        // dialogManager.closeWait();
                    }
                }).catch(function (res) {
                    self.suc = false;
                    // dialogManager.closeWait();
                });

                function setData(res) {
                    self.dateList = res.data.cinema_shows.date;
                    self.suc = self.dateList.length > 0;
                    self.time = self.dateList[0];
                    self.active = self.getActive(self.dateList);
                    self.total = self.dateList.length;
                    self.showList = res.data.cinema_shows.shows;
                    self.activity = res.data.cinema_shows.activity || {};
                }
            },
            showDialog(parity) {
                this.bottomPopup.popup.option = parity;
                this.bottomPopup.show();
                fire("showPrice")
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../common/style/mixin";
    @import "../../../font/timeFont/index.css";

    //iphone和android
    @mixin iphone($w, $h) {
        &.line-center {
            @include width($w);
            @include lt($h - 2px);
            text-align: center;
        }
        &.vh-center {
            @include wh($w, $h);
            @include box-sizing;
        }
    }
    .error-info{
        @include height(500px);
    }
    .m-show-time{
        position: relative;
        width: 100%;
        //height: rem(640);
        /*min-height: rem(1000);*/
        padding-top: rem(84px);

        &.top-fix{
            position: fixed;
            top: rem(198px);
            left: 0;
            z-index: 10;

            overflow-y: auto;
        }

        >.wrapper {
            min-height: rem(1000);
            padding-bottom: rem(84px);
        }
    }

    .date-tab{
        position: absolute;
        top: 0;
        left: 0;
        @include wh(100%, 84px);
        &.top-fix{
            position: fixed;
            top: rem(198px);
            left: 0;
            z-index: 10;
        }
    }

    .time-list {
        @include font-size(30px);
        @include lh(84px);
        text-align: center;
        @include flex(1);
        .swiper-slide{
            @include width(200px);
            margin: rem(0 13px);
        }
        .slide-active {
            position: relative;
            &:before{
                position: absolute;
                content: "";
                bottom: 0;
                left: 50%;
                margin-left: rem(-34px);
                @include wh(68px, 3px);
            }
        }
    }

    .time-line{
        @include wh(1px, 84px);
    }

    .time-filter{
        @include width(150px);
        @include box-sizing;
        padding-right: rem(24px);
        .icon-search{
            margin-left: rem(34px);
        }
    }

    .film-name {
        position: relative;
        margin-top: rem(30px);
        height: rem(124px);
        text-align: center;
        .name {
            padding-top: rem(24px);
            @include font-size(32px);
            @include display-flex;
            @include align-items(flex-start);
            @include justify-content(center);
            .score{
                @include font-size(26px);
                padding-left: rem(10px);
            }
        }
        .type {
            @include font-size(24px);
            padding: rem(16px 0 34px);
            @extend %ellipsis-basic;
        }

        .arrow-right {

            right: r(24);
            top: 50%;
            @include arrow-right;
            position: absolute;
            margin-right: rem(-10px);
            margin-left: rem(15px);

        }
    }
    .discount {
        height: rem(82px);
        margin: rem(0 25px);
        .card {
            @include radius(rem(4px));
            @include font-size(20px);
            margin-right: rem(10px);
            @include iphone(50px, 30px);
        }
        .name{
            @extend %ellipsis-basic;
        }
        .word {
            @include font-size(28px);
            .rmb {
                padding: rem(0 5px);
            }
        }
    }
    .film-title {
        padding-top: rem(34px);
        height: rem(64px);
        @include box-sizing;
        @include font-size(24px);
    }
    .icon-sun,.icon-night {
        margin-right: rem(12px);
    }
    .day {
        .line {
            @include wh(100px,1px);
            margin: rem(0 22px);
        }
    }
    .night {
        .line {
            @include wh(100px,1px);
            margin: rem(0 22px);
        }
    }
    .film-items {
        padding: rem(0 24px);
        .item {
            height: rem(138px);
            position: relative;
        }
        .date{
            @include width(154px);
            .hour {
                @include font-size(40px);
                @extend %ellipsis-basic;
            }
            .end {
                @include font-size(22px);
                padding-top: rem(22px);
                @extend %ellipsis-basic;
            }
        }
        .lang{
            @include width(220px);
            .type {
                @include font-size(24px);
                @extend %ellipsis-basic;
                margin-top: rem(16px);
            }
            .hall {
                @include font-size(22px);
                padding-top: rem(22px);
                @extend %ellipsis-basic;
                @extend %ellipsis-basic;
            }
        }
        .arrow-right {
            @include arrow-right;
            margin-right: rem(-10px);
            margin-left: rem(15px);
        }

        .compare {
            @include wh(128px ,52px);
            @include box-sizing;
            @include font-size(24px);
            @include radius(rem(52px));
            &.hidden{
                visibility: hidden;
            }
        }
        .vh-right{
            @include flex(1);
        }
        .price {
            .num {
                padding-bottom: rem(13px);
                .icon {
                    margin-top: rem(6px);
                    @include font-size(30px);
                }
                .rate {
                    @include font-size(42px);
                    padding: rem(0 4px 0 0);
                }
                .text{
                    @include font-size(24px);
                    margin-top: rem(9px);
                }
            }
            .vipCard{
                @include font-size(20px);
                .card,.number{
                    display: inline-block;
                    @include lt(24px);
                    text-align: center;
                }
                .card{
                    @include radius(rem(26px) 0 0 rem(26px));
                    padding: rem(0 4px 0 8px);
                }
                .number{
                    @include radius(0 rem(26px) rem(26px) 0);
                    padding-right: rem(8px);
                    padding-left: rem(4px);
                }
                &.iphone{
                    .card,.number{
                        @include lt(26px);
                    }
                }
            }
        }
    }

    .movie-item{
        padding-bottom: rem(40px);
    }

    .movie-name{
        padding: rem(40px 24px 0);
        .name{
            @include font-size(34px);
            @include flex(1);
            @extend %ellipsis-basic;
        }
        .price{
            @include display-flex;
            @include align-items(flex-end);
            @include font-size(24px);
        }
        .money{
            @include font-size(34px);
            padding-right: rem(10px);
        }
    }
    .movie-address{
        padding: rem(34px 24px 0);
        @include font-size(28px);
        .address{
            @include flex(1);
            @extend %ellipsis-basic;
        }
    }
    .movie-tabs{
        padding: rem(26px 24px 0);
        .tab-list{

        }
        .tab{
            display: inline-block;
            @include radius(rem(24px));
            @include font-size(20px);
            @include lh(24px);
            padding: rem(0 8px);
            margin-right: rem(12px);
        }
        .btn{
            @include font-size(24px);
        }
        .arrow-down{
            @include arrow-down;
            margin-left: rem(8px);
            @include transition(all 0.3s);
            &.top{
                @include rotate(180deg);
            }
        }
    }

    .schedule-items{
        height: 0;
        overflow: hidden;
        @include transition(all 0.3s);
        &.show{
            margin-top: rem(30px);
            @include height(156px);
        }
        .swiper-slide{
            @include wh(178px, 156px);
            @include box-sizing;
            @include radius(rem(10px));
            margin-left: rem(24px);
            text-align: center;
        }
        .gray{
            position: relative;
            overflow: hidden;
            .mark{
                left: rem(-39px);
                top: rem(-39px);
                position: absolute;
                @include wh(78px);
                @include box-sizing;
                padding-top: rem(56px);
                @include font-size(18px);
                @include rotate(-45deg);
            }
        }
        .time{
            font-family: "timeFont" !important;
            font-weight: bold;
            @include font-size(48px);
            @include lt(48px);
            padding-top: rem(18px);
        }
        .type{
            padding-top: rem(8px);
            @include font-size(20px);
        }
        .price{
            padding-top: rem(12px);
            @include font-size(28px);
            @include display-flex;
            @include justify-content(center);
            @include align-items(flex-end);
            .sub{
                @include font-size(22px);
            }
        }

    }

</style>