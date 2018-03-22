<template>
    <section class="m-content" :class="{m_top: !image}">
        <ul class="m-upcoming-tab" v-if="image">
            <li class="item" v-href="href.urlHot" data-target="self">正在热映</li>
            <li class="item selected">即将上映</li>
            <li class="item vh-center hide"><span>票房榜</span><i class="arrow-right"></i></li>
        </ul>
        <template v-if="suc">
            <template v-for="(item, key) in films">
                <div class="upcoming-date">{{key}} {{item.week}}</div>
                <div v-for="(item1, index1) in item.data" class="movie-item">
                    <div class="movie-details vh-left">
                        <div class="image" v-href="href.urlFilm+'&film_code='+item1.code">
                            <lazy-image :src="item1.poster" init-src="/images/common/292x410.jpg"/>
                            <!-- <div class="play vh-center"><i class="icon-play-white"></i></div> -->
                        </div>
                        <div class="info" v-href="href.urlFilm+'&film_code='+item1.code">
                            <div class="title">{{item1.name}}</div>
                            <div class="film-logo" :class="deviceType">
                                <template v-if="item1.show_type_names.includes('3D') && item1.show_type_names.includes('MAX')">
                                    <span class="m1">3D</span><span class="m2">IMAX</span>
                                </template>
                                <template v-else-if="item1.show_type_names.includes('2D') && item1.show_type_names.includes('MAX')">
                                    <span class="m1">2D</span><span class="m2">IMAX</span>
                                </template>
                                <template v-else-if="item1.show_type_names.includes('3D')">
                                    <span class="m1 one">3D</span>
                                </template>
                                <template v-else>
                                    <span class="m1 one">2D</span>
                                </template>
                            </div>
                            <div class="desc">{{item1.highlight.replace(/^\s*\-/, "") ? item1.highlight : item1.intro}}</div>
                            <div class="name">{{item1.cast}}</div>
                        </div>
                        <div class="shop hide">
                            <div class="num vh-center"><span>{{parseFloat(item1.wantsee)}}</span><span class="sub">万想看</span></div>
                            <div class="btn hide" v-href="href.urlFilm" data-query="'film_code='+item1.code" :class="{watch: index1 % 2 == 0}">{{index1 % 2 == 0 ? '预售': '想看'}}</div>
                        </div>
                    </div>
                    <div class="movie-sale vh-left hide" v-if="index1 % 2 == 0">
                        <span class="icon" :class="device">特惠</span>
                        <span class="text">欢乐海岸店9.9元观影</span>
                    </div>
                    <div class="movie-watch vh-left hide" v-else>
                        <span class="icon" :class="device">看点</span>
                        <span class="text">美女与野兽：井柏然表白女神被拒</span>
                    </div>
                </div>
                <div class="upcoming-tips vh-between hide"><span class="text">战狼2的火爆票房，是否意味着小鲜肉时代的结束？</span><i class="arrow-right"></i></div>
            </template>
        </template>
        <div class="vh-center error-info" v-else>
            <error msg="获取影片失败" refresh="true"></error>
        </div>
    </section>
</template>
<script>
    import dialogManager from 'common/plugin/dialog'
    import viewport from 'lib/comp/viewport'
    import error from 'common/components/error.vue'

    export default {
        props: {
            href: {
                type: Object,
                default () {
                    return {}
                }
            },
            image: Boolean
        },
        data () {
            return {
                suc: true,
                films: {},
                device: viewport.getDeviceType() === 'iphone' ? 'iphone vh-center': 'android line-center',
                deviceType: viewport.getDeviceType()
            }
        },
        mounted () {
            this.initData();
        },
        components: {
            error
        },
        methods: {
            initData () {
                dialogManager.wait();
                this.$http.get(this.href.apiFilms)
                    .then(item => {
                        this.films = item.data || {};
                        let suc = false;
                        for(let k in this.films){
                            suc = true;
                            break;
                        }
                        this.suc = suc;
                        dialogManager.closeWait();
                    }).catch(res => {
                    this.suc = false;
                    dialogManager.closeWait();
                    console.log(res.msg);
                })
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

    %item{
        @include height(78px);
        .icon{
            @include font-size(18px);
            @include radius(rem(4px));
            @include iphone(50px, 30px);
        }
        .text{
            @include flex(1);
            @extend %ellipsis-basic;
            @include font-size(28px);
            padding-left: rem(10px);
        }
    }
    .m-content{
        padding-bottom: rem(130px);
        &.m_top{
            margin-top: rem(80px);
        }
    }
    .error-info{
        @include height(600px);
    }
    .upcoming-date{
        @include font-size(28px);
        padding: rem(24px);
    }
    .movie-item{
        padding: rem(24px 24px 0 24px);
        position: relative;
        &:before{
            content: "";
            position: absolute;
            width: rem(726px);
            height: 0;
            bottom: 0;
            left: rem(24px);
        }
    }
    .movie-details{
        .image{
            @include wh(142px, 200px);
            @include radius_rem(10px);
            overflow: hidden;
            position: relative;
            img{
                width: 100%;
                height: 100%;
            }
            .play{
                @include wh(52px);
                @include radius(rem(56px));
                // border-radius: r(52);
                margin: rem(4px);
                @include center;
                z-index: 1;
            }
        }
        .info{
            @include flex(1);
            padding-left: rem(16px);
            max-width: rem(544px);
            .title{
                padding-top: rem(10px);
                @include font-size(34px);
                @extend %ellipsis-basic;
            }
            .film-logo{
                margin-top: rem(14px);
                @include font-size(20px);
                .m1,.m2{
                    display: inline-block;
                    @include lt(24px);
                    text-align: center;
                }
                .m1{
                    @include width(40px);
                    @include radius(rem(26px) 0 0 rem(26px));
                    &.one{
                        @include radius(rem(26px));
                    }
                }
                .m2{
                    //@include width(60px);
                    padding: rem(0 4px);
                    @include radius(0 rem(26px) rem(26px) 0);
                }
                &.iphone{
                    .m1,.m2{
                        @include lt(26px);
                    }
                }
            }
            .desc{
                padding-top: rem(26px);
                @include font-size(26px);
                // @include ellipsis(70vw);
                line-height: rem(36px);
                @include line-clamp(2);
            }
            .name{
                padding: rem(26px 0 24px);
                @include font-size(22px);
                @include ellipsis(70vw);
            }
        }
        .shop{
            .num{
                @include font-size(28px);
                padding-bottom: rem(14px);
                .sub{
                    @include font-size(20px);
                    padding-left: rem(3px);
                    margin-top: rem(3px);
                }
            }
            .btn{
                @include radius(rem(58px));
                @include font-size(29px);
                @include iphone(128px, 58px);
            }
        }
    }
    .movie-sale,.movie-watch{
        @extend %item;
        margin-left: rem(152px);
        .text{
            @extend %ellipsis-basic;
        }
    }
    .upcoming-tips{
        margin: rem(24px auto 0);
        @include wh(702px, 72px);
        @include radius(rem(5px));
        @include box-sizing;
        padding: rem(0 18px 0 22px);
        .text{
            @include font-size(26px);
        }
        .arrow-right{
            @include arrow-right;
        }
    }
</style>