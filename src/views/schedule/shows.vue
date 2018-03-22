<template>
    <div class="shows">
        <div class="movieName" v-href="href.urlFilm" :data-query="'film_code='+option.code">
            <div class="name"><span>{{option.name}}</span><span class="score">{{option.score || 10}}分</span></div>
            <div class="type"><span>{{option.duration}}分钟</span>-<span>{{option.type}}</span></div>
            <div class="arrow-right"></div>
        </div>
        <swiper v-show="dateList.length > 0" class="time-list" :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
            <swiper-slide :class="{'slide-active': active[index]}" :data-time="item" v-for="(item, index) in dateList" :key="index">{{item}}</swiper-slide>
        </swiper>
        <template v-for="item in activityList">
            <div class="discount vh-left" v-if="item.activity_no && item.activity_tag"  v-href="item.activity_url">
                <div class="card" :class="device">活动</div>
                <div class="word vh-center">
                    <span content="name">{{item.activity_tag}}</span>
                    <span class="rmb hide">9.9</span>
                    <span class="hide">元观影</span>&nbsp;&nbsp;
                    <span class="hide">每人限购</span><span class="rmb hide">2</span><span class="hide">张</span>
                </div>
            </div>
        </template>
        <!-- <div class="discount vh-left" v-if="existActList[checkDateIndex]">
            <div class="card" :class="device">优惠</div>
            <div class="word vh-center">
                <span>《芳华》点映，微信支付首单减10元</span>
            </div>
        </div> -->
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
    </div>
</template>

<script>
    import {swiper,swiperSlide} from "common/plugin/swiper";
    import popup from 'lib/layer/popup';
    import slideBottom from './channelPrice.vue'
    import dialogManager from 'common/plugin/dialog'
    import viewport from 'lib/comp/viewport'
    import debounce from 'lib/util/debounce'
    import {object} from 'common/utils/defaultProps'
    import {bind, fire, bus} from "lib/comp/bus";
    import URL from '../../lib/util/URL';

    export default {
        props: {
            href: object,
            option: object,
            actConfig: object
        },
        data () {
            const vm = this;
            return {
                countNames: ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
                showList: {},
                dateList: [],
                activity: {},
                active: {},
                total: 0,
                deviceType: viewport.getDeviceType(),
                device: viewport.getDeviceType() === 'iphone' ? 'iphone vh-center': 'android line-center',
                bottomPopup: null,
                notNextTick: false,
                time: "",
                debounced: null,
                movieData: {"length":0},
                len: 1,
                existActList: [],
                checkDateIndex: 0,
                urlParams: URL.parse(window.location.href).queryJson,
                swiperOption: {
                    //centeredSlides: true,
                    slidesPerView: 3.7,
                    freeMode: true,
                    freeModeMomentum: true,
                    onTap(swiper) {
                        const index = swiper.clickedIndex;
                        vm.checkDateIndex = index;
                        vm.slideTo(index);
                        if(index >= 1 && index <= vm.total - 2){
                            vm.$refs.mySwiper.swiper.slideTo(index);
                        }
                        vm.time = swiper.slides[index].dataset.time;
                    }
                }
            }
        },
        mounted () {
            const self = this;
            self.debounced = debounce(self.getMovie, 300);
            self.bottomPopup = popup("<slide-bottom :option='option' :url-create-card='urlCreateCard' :url-card-list='urlCardList' @close='close'/>", {
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
                            urlCardList: self.href.urlCreateCardList
                        }
                    },
                    methods: {
                        close () {
                            self.bottomPopup.hide();
                        }
                    },
                    components: {
                        slideBottom
                    }
                }
            });
            self.bottomPopup.setPosition(0, "auto", "auto", 0);
        },
        components: {
            swiper, swiperSlide
        },
        watch: {
            option () {
                this.debounced();
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
                let flag = false;
                self.lastCode = code;
                Object.keys(self.movieData).forEach(name => {
                    if(name == code) {
                        flag = true;
                        //self.existActList = [];
                        // for(let index in self.movieData[name]["date"]) {
                        //     if(!!self.actConfig) {
                        //         if(self.actConfig.actTime.includes(self.movieData[name]["date"][index]) &&
                        //             self.actConfig.arrBizcode.includes(self.urlParams["b"]) &&
                        //             (self.actConfig["film_code"] == self.movieData[name]["film"]["code"])) {
                        //             self.existActList.push(true);
                        //         } else {
                        //             self.existActList.push(false);
                        //         }
                        //     }
                        // }
                        self.dateList = self.movieData[name].date;
                        self.time = self.dateList[0];
                        self.active = self.getActive(self.dateList);
                        self.total = self.dateList.length;
                        self.showList = self.movieData[name].shows;
                        self.activity = self.movieData[name].activity || {};
                    }
                })
                if(!!flag) return;
                self.$http.get(self.href.apiFilm, {
                    params: { film_code: code }
                }).then(res => {
                    if (code === self.lastCode) {
                        //self.existActList = [];
                        // for(let index in res["data"]["cinema_shows"]["date"]) {
                        //     if(!!self.actConfig) {
                        //         if(self.actConfig.actTime.includes(res["data"]["cinema_shows"]["date"][index]) &&
                        //             self.actConfig.arrBizcode.includes(self.urlParams["b"]) &&
                        //             (self.actConfig["film_code"] == res["data"]["cinema_shows"]["film"]["code"])) {
                        //             self.existActList.push(true);
                        //         } else {
                        //             self.existActList.push(false);
                        //         }
                        //     }
                        // }
                        self.movieData[code] = res["data"]["cinema_shows"];
                        self.movieData["length"] = self.len;
                        self.dateList = res.data.cinema_shows.date;
                        self.time = self.dateList[0];
                        self.active = self.getActive(self.dateList);
                        self.total = self.dateList.length;
                        self.showList = res.data.cinema_shows.shows;
                        self.activity = res.data.cinema_shows.activity || {};
                        self.len++;
                        // console.log(self.activity[self.time], "没有结果")
                    }
                }).catch(res => {
                    console.error(res);
                });
            },
            showDialog(parity) {
                this.bottomPopup.popup.option = parity;
                this.bottomPopup.show();
                fire("priceShow")
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../common/style/mixin";
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
    .shows{
        padding-bottom: rem(34px);
    }
    .time-list {
        @include font-size(30px);
        @include lh(84px);
        padding-left: rem(10px);
        text-align: center;
        .slide-active {
            position: relative;
            &:before{
                position: absolute;
                content: "";
                bottom: 0;
                left: 0;
                @include wh(100%, 3px);
            }
        }
    }
    .movieName {
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
</style>
