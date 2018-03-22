<template>
    <section class="m-content" :class="{m_top: !image}">

        <ul class="m-index-tab" v-if="image">
            <li class="item selected">正在热映</li>
            <li class="item" v-href="href.urlNew" data-target="self">即将上映</li>
            <li class="item vh-center hide"><span>票房榜</span><i class="arrow-right"></i></li>
        </ul>
        <div class="top-grossing-movie" v-if="suc">

            <div class="movie-title vh-center"><span class="line"></span><span class="name">今日推荐影片</span><span class="line"></span></div>
            <div class="movie-info movie-item" v-for="(item, index) in films" :class="{m_top: index > 0}">
                <div class="filter-blur" v-href="href.urlFilm" :data-query="'film_code='+item.code">
                    <lazy-image :src="item.poster" init-src="/images/common/292x410.jpg"/>
                    <div class="overlay"></div>
                </div>
                <div class="notice-image" v-href="href.urlFilm" :data-query="'film_code='+item.code">
                    <lazy-image :src="item.poster" init-src="/images/common/292x410.jpg"/>
                </div>
                <div class="info" v-href="href.urlFilm" :data-query="'film_code='+item.code">
                    <div class="name"><span class="text">{{ item.name }}</span><span class="score" v-html="setScore(item.score)"></span></div>
                    <div class="type">{{ item.duration }}分钟、{{ item.type }}、{{ item.show_type_names }}</div>
                    <div class="desc">{{ item.highlight.replace(/^\s*\-/, "") ? item.highlight : item.intro  }}</div>
                    <div class="give-like vh-center hide" @click.stop="toggle($event, index)">
                        <i data-type="dislike" :class="likes['dislike_'+index] ? 'icon-dislike-selected' : 'icon-dislike'"></i>
                        <span class="line"></span>
                        <i data-type="like" :class="likes['like_'+index] ? 'icon-like-selected' : 'icon-like'"></i>
                    </div>
                </div>
                <ul class="photos vh-left">
                    <li class="photo" v-for="actor in item.creator.slice(0, 5)" v-if="actor.pic"><lazy-image scale="1" :src="actor.pic" init-src="/images/common/152x152.jpg"/></li>
                    <li class="more hide"><i class="icon-more"></i></li>
                </ul>
                <div class="activity vh-left" v-if="item.activity_no && item.activity_tag && item.activity_type" v-href="item.activity_url">
                    <span class="icon" :class="device">活动</span>
                    <span class="text">{{item.activity_tag}}</span>
                </div>
                <div class="video-signal vh-left" v-if="discoverys[item.code]" v-href="href.urlFind" :data-query="'id='+discoverys[item.code].id">
                    <span class="icon" :class="device">影讯</span>
                    <span class="text">{{discoverys[item.code].title}}</span>
                </div>
                <div class="btn-group vh-center">
                    <span class="btn vh-center" v-href="href.urlShow" :data-query="'film_code='+item.code">
                        <span class="name">购票</span>

                        <span class="sub" v-if="item.activity_price">特惠 {{item.activity_price}} 元</span>
                        <span class="sub" v-else>{{item.min_show_price}}元起</span>
                    </span>
                </div>
                <div class="movie-good vh-left" v-if="item.snack">
                    <div class="image">
                        <lazy-image scale="1" :src="item.snack.image" init-src="/images/common/meal-default.jpg"/>
                    </div>
                    <div class="msg">
                        <div class="name">{{ item.snack.name }}</div>
                        <div class="desc">{{ item.snack.type }}</div>
                        <div class="price"><span class="sub">¥</span><span>{{ item.snack.net_price }}</span></div>
                    </div>
                    <span class="btn" :class="device" v-href="href.urlSnack" data-target="self">去选购</span>
                </div>
            </div>
        </div >
        <div class="vh-center error-info" v-else>
            <error msg="获取影片失败" refresh="true"></error>
        </div>
        <version-update :show.sync="showUpdate" :appInfo="appInfo" :has-new="hasNew" />
    </section>
</template>
<script>
    import dialogManager from 'common/plugin/dialog'
    import viewport from 'lib/comp/viewport'
    import error from 'common/components/error.vue'
    import webBridge from "common/utils/webBridge"

    export default {
        props: {
            href: {
                type: Object,
                default () {
                    return {}
                }
            },
            image: Boolean,
            appInfo: Object,
            filmdata: Object
        },
        data () {
            return {
                suc: true,
                films: [],
                discoverys: {},
                device: viewport.getDeviceType() === 'iphone' ? 'iphone vh-center': 'android line-center',
                likes: {},
                showUpdate: false,
                hasNew: null,
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
                let vm = this;
                if(!!this.href.apiFilms) {
                    let item = this.href.apiFilms;
                    this.films = item.data.films;
                    this.discoverys = item.data.discoverys;
                    this.suc = this.films.length > 0;
                    this.likes = this.getLikes(this.films, 0);
                    setTimeout(vm.compareVer,1000);
                } else {
                    this.suc = false;
                }
                // this.$http.get(this.href.apiFilms).then(item => {
                //     this.films = item.data.films;
                //     this.discoverys = item.data.discoverys;
                //     this.suc = this.films.length > 0;
                //     this.likes = this.getLikes(this.films, 0);
                //     dialogManager.closeWait();
                //     setTimeout(vm.compareVer,1000);
                // }).catch(res => {
                //     this.suc = false;
                //     dialogManager.closeWait();
                //     console.log(res.msg);
                // })
            },
            getLikes (data, start) {
                let obj = {};
                if(start === 0){
                    obj = {like_top: false, dislike_top: false};
                }
                data.forEach((item, index) => {
                    obj["like_" + (index + start)] = false;
                    obj["dislike_" + (index + start)] = false;
                });
                return obj;
            },
            toggle (ev, index){
                const type = ev.target.dataset.type;
                if(type === "like"){
                    this.likes["like_" + index] = !this.likes["like_" + index];
                    this.likes["dislike_" + index] = false;
                }else if(type === "dislike"){
                    this.likes["dislike_" + index] = !this.likes["dislike_" + index];
                    this.likes["like_" + index] = false;
                }
            },
            setScore (str = "0.0") {
                const arr = str.toString().match(/^(\d+)\.?(\d*)$/);
                return arr ? `<span>${arr[1]}</span><span class="small">.${arr[2].length > 0 ? arr[2] : 0}</span>` : 0;
            },
            compareVer(){
                let vm = this;
                if(!this.appInfo) return;
                let version_code = +vm.appInfo.version_code;
                let versionName = vm.appInfo.version_name;
                webBridge.checkHaveNewApp(versionName, res=>{
                    if(res.code != 0) return;
                    let n = version_code - (+res.data.versionCode);
                    if(res.data.alreadyDownload == 0 && n > 0){
                        vm.hasNew = false;
                        vm.showUpdate = true;
                        if(n > 1) vm.appInfo.strong = 0;
                    }else if(res.data.alreadyDownload == 1){
                        vm.hasNew = true;
                        vm.showUpdate = true;
                    }
                })
            }
        }
    }
</script>
<style lang="scss">
    @import "../../common/style/mixin";
    @import "../../../font/scoreFont/index.css";

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

    %title{
        @include font-size(26px);
        padding: rem(34px 0 24px);
        .line{
            @include wh(40px, 1px);
        }
    }
    %item{
        padding-left: rem(20px);
        @include height(70px);
        margin-left: rem(20px);
        .icon{
            @include font-size(18px);
            @include iphone(50px, 30px);
            @rem(include) radius(4px);
        }
        .text{
            @include flex(1);
            @extend %ellipsis-basic;
            @include font-size(28px);
            padding-left: rem(10px);
        }
    }
    .m-content{
        padding-bottom: rem(140px);
        &.m_top{
            margin-top: rem(80px);
        }
    }
    .m-scroll-loading{
        padding-top: rem(40px);
    }
    .hot-title{
        @include height(80px);
        padding: rem(0 24px);
        @include font-size(28px);
        .name{
            padding-right: rem(10px);
        }
        .text{
            padding-right: rem(10px);
        }
        .arrow-right{
            @include arrow-right;
            margin-right: rem(-10px);
        }
    }
    .error-info{
        @include height(600px);
    }
    .top-grossing-movie{
        padding: rem(0 24px);
       .movie-title{
           @extend %title;
           .name{
               padding: rem(0 24px);
           }
       }
        .movie-info{
            @include radius(rem(10px));
            position: relative;
        }
        .movie-item{
            &.m_top{
                margin-top: rem(54px);
            }
            //margin-bottom: rem(54px);
        }
        .filter-blur{
            @include wh(100%, 250px);
            @include radius(rem(10px) rem(10px) 0 0);
            overflow: hidden;
            position: relative;
            img{
                width: 120%;
                margin: rem(-10% 0 0 -10%);
                @include filter-blur(10px);
            }
            .overlay{
                @include radius(rem(10px) rem(10px) 0 0);
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
            }
        }
        .notice-image{
            @include wh(186px, 254px);
            //@include radius(10px);
            @include radius(rem(10px));
            overflow: hidden;
            position: absolute;
            z-index: 1;
            top: rem(24px);
            left: rem(20px);
            img{
                width: 100%;
                height: 100%;
            }
        }
        .info{
            position: absolute;
            z-index: 1;
            left: rem(224px);
            top: 0;
            @include wh(478px, 250px);
            .name{
                padding: rem(38 24 0 0);
                @include font-size(36px);
                @include display-flex;
                @include align-items(flex-start);
                .text{
                    padding-right: rem(10px);
                    max-width: rem(430px);
                    @extend %ellipsis-basic;
                }
                .score{
                    font-family: 'scoreFont';
                    @include font-size(32px);
                    @include display-flex;
                    @include align-items(flex-start);
                    .small{
                        @include font-size(24px);
                        margin-top: rem(2px);
                    }
                }
            }
            .type{
                padding-top: rem(40px);
                width: 100%;
                @extend %ellipsis-basic;
                @include font-size(22px);
            }
            .desc{
                padding-top: rem(22px);
                width: 100%;
                // @extend %ellipsis-basic;
                @include line-clamp(2);
                @include font-size(23px);
                line-height: rem(40px);
            }
            .give-like{
                position: absolute;
                top: rem(31px);
                right: rem(20px);
                .line{
                    @include wh(0, 36px);
                    margin: rem(0 26px);
                }
            }
        }
        .photos{
            padding: rem(70px 0 0 3px);
            @include wh(100%, auto);
            .photo{
                @include wh(80px);
                @include radius(rem(80px));
                overflow: hidden;
                margin: rem(0 17px 40px);
                img{
                    width: 100%;
                   // height: 100%;
                }
            }
            .more{
                @include flex(1);
                text-align: right;
                padding-right: rem(40px);
            }
        }
        .activity,.video-signal{
            @extend %item;
        }
        .btn-group{
            padding: rem(32px 0);
            .btn{
                @include box-sizing;
                @include wh(238px, 72px);
                @include radius(rem(238px));
                .name{
                    @include font-size(36px);
                }
                .sub{
                    padding: rem(14px 0 0 10px);
                    @include font-size(22px);
                }
            }
        }
        .movie-good{
            padding: rem(20px);
            @include radius(0 0 rem(10px) rem(10px));
            overflow: hidden;
            .image{
                @include wh(120px);
                @include radius(rem(5px));
                overflow: hidden;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .msg{
                padding-left: rem(10px);
                @include flex(1);
            }
            .name{
                @include font-size(30px);
                padding-top: rem(6px);
            }
            .desc{
                padding-top: rem(10px);
                @include font-size(22px);
                @extend %ellipsis-basic;
            }
            .price{
                padding-top: rem(20px);
                @include font-size(32px);
                @include display-flex;
                .sub{
                    @include font-size(24px);
                    margin-top: rem(8px);
                }
            }
            .btn{
                @include iphone(138px, 62px);
                @include radius(rem(62px));
                @include font-size(28px);
            }
        }
    }
</style>
