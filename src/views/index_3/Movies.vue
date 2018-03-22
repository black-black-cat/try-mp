<template>
	<section class="m-content" :class="{m_top: !image}">
		<ul class="m-movies-nav" v-if="image">
			<li class="item selected">正在热映</li>
			<li class="item" v-href="options.href.urlNew" data-target="self">即将上映</li>
			<li class="item vh-center hide"><span>票房榜</span><i class="arrow-right"></i></li>
		</ul>
		<template v-if="suc">
			<div v-for="(item1, index1) in films" class="movie-item">
					<div class="movie-details vh-center">
						<div class="image" v-href="href.urlFilm" :data-query="'film_code='+item1.code">
							<lazy-image :src="item1.poster" init-src="/images/common/292x410.jpg"/>
							<!-- <div class="play vh-center"><i class="icon-play-white"></i></div> -->
						</div>
						<div class="info" v-href="href.urlFilm" :data-query="'film_code='+item1.code">
							<div class="title">
								<span class="text">{{item1.name}}</span>
								<span class="score" >{{item1.score}}分</span>
							</div>
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
						<div class="shop">
							<!--<div class="num vh-center"><span>{{parseFloat(item1.wantsee)}}</span><span class="sub">万想看</span></div>-->
							<div class="num vh-center" v-if="item1.activity_price">活动价{{item1.activity_price}}元</div>
							<template v-else>
								<div class="num vh-center" v-if="item1.min_price">{{item1.min_price}}元起</div>
							</template>
							<div class="btn btn-buy" v-if="options.data.isSelectCity == 3" v-href="href.urlCinemaList" :data-query="'film_code='+item1.code">
								购票
							</div>
							<div class="btn btn-buy" v-else v-href="href.urlShow" :data-query="'film_code='+item1.code">
								购票
							</div>
						</div>
					</div>
					<div class="movie-watch vh-left" v-if="item1.film_information && discoveries && discoveries[item1.code]" v-href="options.href.urlFind" :data-query="'id='+discoveries[item1.code].id">
						<span class="icon" :class="device">影讯</span>
						<span class="text">{{item1.film_information}}</span>
					</div>
					<!-- v-href="options.href.urlShow" :data-query="'film_code='+item1.code" -->
					<div class="movie-sale vh-left" v-if="item1.activity_type && item1.activity_name && item1.activity_no" >
						<span class="icon" :class="device">活动</span>
						<span class="text">{{item1.activity_name}}</span>
					</div>
				</div>

		</template>
		<div class="vh-center error-info" v-else>
			<error :msg="errorMsg || '获取影片失败'" refresh="true"></error>
		</div>
	</section>
</template>
<script>
    import dialogManager from 'common/plugin/dialog'
    import viewport from 'lib/comp/viewport'
    import error from 'common/components/error.vue'
    import {bind, fire} from 'lib/comp/bus'
    import query from 'lib/json/query'
    let queryParams = query.parse(location.search.slice(1));

    export default {
        props: {
            options: {
                type: Object,
                default () {
                    return {}
                }
            },
            image: Boolean
        },
        data () {
            return {
                href: this.options.href,
                suc: true,
				films: {},
				discoveries: null,
                device: viewport.getDeviceType() === 'iphone' ? 'iphone vh-center': 'android line-center',
                deviceType: viewport.getDeviceType(),
	            errorMsg: "",
                queryParams
            }
        },

        mounted () {
//			bind("locatedCity", this.onLocatedCity)
	        this.initData();
        },
        components: {
            error
        },
        methods: {
            initData () {
				if(!!this.href.apiFilms) {
					let res = this.href.apiFilms;
					let data = res.data || {};
				    this.films = data.films || [];
				    this.discoveries = data.discoverys;
                    if (this.films.length)　{
                        this.suc = true;
                    }
				} else {
					this.suc = false;
				}
                // dialogManager.wait();
                // this.$http.get(this.href.apiFilms).then(res => {
                //     let data = res.data || {};
				// 	this.films = data.films || [];
				// 	this.discoveries = data.discoverys;
                //     if (this.films.length)　{
                //         this.suc = true;
                //     }
                //     dialogManager.closeWait();
                // }).catch(res => {
	            //     this.suc = false;
	            //     this.errorMsg = res.msg;
	            //     dialogManager.closeWait();
	            //     console.log(res.msg);
                // })
            },

            onLocatedCity(data) {
                const vm = this;
//                vm.updateApi(data.cityCode);
                vm.initData();
            },

	        updateApi(cityCode) {
                const vm = this;
                let api = vm.href.apiFilms;
                let tuple = api.split("?");
                let obj = query.parse(tuple[1]);
                obj.a = cityCode;
                vm.href.apiFilms = query.url(tuple[0], obj);
	        },

            showSelectCity() {
                fire("showSelectCity");
            }
        },


    }
</script>

<style lang="scss" scoped>
	@import "../../common/style/mixin";

	.m-movies-nav {
		@include display-flex;
		@include justify-content(space-around);
		@include align-items(center);
		@include height(80px);
		padding: rem(0 20px);
		width: 100%;
		@include box-sizing;
		&.fixed-top{
			position: fixed;
			top: 0;
			left: 0;
			z-index: 12;
		}
		.item{
			@include font-size(28px);
			width: 100%;
			text-align: center;
			.arrow-right{
				@include arrow-right;
				margin: rem(3px -10px 0 10px);
			}
		}
		.selected{
			position: relative;
			&:before{
				content: "";
				position: absolute;
				@include wh(54px, 4px);
				bottom: rem(-24px);
				left: 50%;
				margin-left: rem(-27px);
			}
		}
	}
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
		/*&:before{
			content: "";
			position: absolute;
			width: rem(726px);
			height: 0;
			bottom: 0;
			left: rem(24px);
		}*/
	}
	.movie-details{
		.image{
            @include flex-shrink(0);
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
			max-width: 54vw;
			.title{
				position: relative;
				width: 70vw;
				padding-top: rem(10px);
				@include font-size(34px);
				.text {
					display: inline-block;
					@extend %ellipsis-basic;
					max-width: 54vw;
				}

				.score {
					/*position: absolute;*/
					display: inline-block;
					vertical-align: top;
					font-size: rem(24);
					@include translate(0, 20%);
				}
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
				padding-top: rem(24px);
				@include font-size(24px);
				// @include ellipsis(100%);
				@include line-clamp(2);
				line-height: rem(36px);
			}
			.name{
				padding: rem(26px 0 24px);
				@include font-size(22px);
				@include ellipsis(100%);
			}
		}
		.shop{
            @include flex-shrink(0);
			.num{
				@include font-size(22px);
				padding-bottom: rem(14px);
				.sub{
					@include font-size(20px);
					padding-left: rem(3px);
					margin-top: rem(3px);
				}
			}
			.btn{
				@include wh(128, 58);
				@include radius(rem(58px));
				@include font-size(29px);
				@include iphone(128px, 58px);
				text-align: center;
				line-height: rem(58);
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