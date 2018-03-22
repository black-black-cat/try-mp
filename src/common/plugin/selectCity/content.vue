<template>
	<div :class="selectCityClass">
		<div class="search-title vh-between" ref="searchTitle">
			<div class="search-input vh-left" @click="onSearchClicked" :class="{search: mode == 'search'}">
				<i class="icon-search"></i>
				<input @focus="focus" @blur="blur" ref="input" v-model="inputText" :placeholder=" mode == 'search' ? '请输入城市名称' : '搜索'" class="input" type="text"/>
				<span @click="clearText" class="clear-text" v-show="clearShow">&nbsp;</span>
			</div>
			<i class="icon-dialog-close" @click="onCloseClicked" v-if="btnCloseSwitch == 'on' || mode == 'search'"></i>
		</div>

		<div class="list" v-show="mode == 'select'" @click="selectCity">
			<div class="city-result" v-show="cityName">
				<div class="label">当前城市 <span class="reload-wrapper" @click="weChatLocation"><i class="icon-reload"></i></span></div>
				<div class="city-name" :data-city-code="cityCode" :data-city-name="cityName">{{cityName}}</div>
			</div>
			<div class="cities" ref="scrollContainer" data-bind-scroll>
				<ul class="alphabet">
					<li v-for="(item ,char) in cities" :data-char="char">
						<div class="char">{{char}}</div>
						<div class="char-cities">
							<div class="char-city" v-for="obj in item" :data-city-code="obj.code" :data-city-name="obj.name">{{obj.name}}</div>
						</div>
					</li>
				</ul>
			</div>
			<ul class="alphabet"  @touchmove.stop.prevent="onTouchmove" @touchstart="onTouchstart" @touchend="onTouchend" v-if="alphabet && alphabet.length">
				<li v-for="item in alphabet" :data-char="item.char" :class="{active: item.active}">{{item.char}}</li>
			</ul>
			<div class="overlay" :class="{hide: alphabetOverlay == 'off'}" @touchmove.stop.prevent></div>
		</div>

		<div class="list search-result" v-show="mode == 'search'">
			<div class="cities" data-bind-scroll @click="selectCity">
				<ul class="alphabet">
					<li v-for="(item ,char) in resultCities" :data-char="char">
						<div class="char" v-show="item.length">{{char}}</div>
						<div class="char-cities">
							<div class="char-city" v-for="obj in item" v-html="obj._name" :data-city-code="obj.code" :data-city-name="obj.name"></div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
    import dialogManager from 'common/plugin/dialog'
    import viewport from 'lib/comp/viewport'
    import getOffset from 'lib/dom/getOffset'
    import closest from 'lib/dom/closest'
	import {fire} from "lib/comp/bus"
   	import browser from "lib/util/browser"
	import webBridge from "common/utils/webBridge"
	const wx = window.wx;

	export default {
	    props: {
			url: String,
			mode: {
				type: String,
				default: "select"
			},
            initialCityCode: {
				type: String,
				default: ""
			},
            btnCloseSwitch: {
			    type: String,
	            default: 'on'
            },
            className:{
            	type: String,
            	default:''
            }
	    },
		data() {
	        return {
                alphabet: null,// "abcdefghijklmnopqrstuvwxyz".toUpperCase().split(""),
				alphabetOverlay: "off",
		        positions: {},
		        charDelta: viewport.rem() / 75 * 50,
		        evTouchstart: null,
		        cities: {},
				inputText: "",
		        cityCode: "",
				cityName: "",
		        areaData: null,
		        cinemas: {},
                apiCallback: "",
				initialMapPromise: null,
				initialMapResolve: null,
				canCitiesScroll: null,
				isTouching: false,
				isUseSina: false,
				parsedCities: null,
	        }
		},
		computed: {
			clearShow() {
				return this.inputText.trim().length;
			},
			resultCities() {
			    const vm = this;
			    let text = vm.inputText.trim();
			    let ret = {};
			    for (let key in vm.cities) {
			        let value = vm.cities[key].filter((obj) => {
			            return text && obj.name.includes(text);
			        });

				    ret[key] = value.map((obj) => {
				        return {
                            _name: obj.name.replace(text, `<span>${text}</span>`),
					        code: obj.code,
					        name: obj.name
                        }
				    })
			    }

			    return ret;
			},
			initialCityName() {
				const vm = this;
				if (vm.parsedCities && vm.parsedCities.length != null) {
					let city = this.parsedCities.find(city => city.code == vm.initialCityCode);
					return city ? city.name : "";
				}

				return "";
			},
			selectCityClass(){
				return this.className + " m-select-city"
			}
		},
		watch: {
			inputText() {

			}
		},
		mounted() {
			this.initialMapPromise = new Promise((resolve, reject) => {
				this.initialMapResolve = resolve;
				this.initialMapReject = reject;
			});
			this.getCities();
            if(browser.WX){
            	this.setMapInit();
	            wx && wx.ready(() => {
	                this.addMap()
				});
            }else{
				this.initialMapResolve();
				// this.getLocation();
			}
		},
		methods: {
			locateCity() {
				const vm = this;
				let stored = vm.getStoredCity("selectCity.locatedCity");
				if (stored && vm.getStoredCity().code == stored.code) {
					return;
				}
				vm.weChatLocation();
			},

            weChatLocation () {
				const vm = this;
				if(!browser.WX){
            		vm.getLocation();
            		return;
				}

				if (vm.isUseSina) {
					vm.getLocationSina();
					return;
				}

				const scrollContainer = vm.$refs.scrollContainer;
                wx && wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function (res) {
//                        const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
//                        const longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
//                        const speed = res.speed; // 速度，以米/每秒计
//                        const accuracy = res.accuracy; // 位置精度
//                        console.log(latitude, longitude, speed, accuracy);
						console.log('coords:', res)

						if (!qq.maps) {
							dialogManager.toast("地理位置控件加载失败");
							return;
						}
                        dialogManager.wait();
                        let onMapFail = function () {
                            dialogManager.closeWait();
                            dialogManager.alert("获取城市超时,请手动选择城市");
                        }
                        let tid = setTimeout(onMapFail, 15 * 1000);
                        let geocoder = new qq.maps.Geocoder({
                            complete: function (result) {
                                clearTimeout(tid);
                                let city = result.detail.addressComponents.city.replace(/市$/, "");
								// let el = scrollContainer.querySelector(`[data-city-name='${city}']`);
								let cityObj = vm.parsedCities.find((cityItem) => cityItem.name == city);

                                if (cityObj) {
									let cityCode = cityObj.code;
                                    if (cityCode != vm.initialCityCode) {

                                        dialogManager.confirm(`定位到当前城市是${city}，是否切换城市？`)
	                                        .then(() => {
                                                vm.cityName = city;
                                                vm.cityCode = cityCode;
												vm.location(vm.cityCode, vm.cityName, res.latitude, res.longitude);
												vm.storeCity(cityCode, city, "selectCity.locatedCity");
												vm.emitClose();
                                                dialogManager.toast("已定位到" + city, {
													overlay: false
												});
											})
											.catch(() => {
												if (!vm.cityName) {
													vm.cityName = city;
													vm.cityCode = cityCode;
													vm.location(vm.cityCode, vm.cityName, res.latitude, res.longitude);
												}
												vm.storeCity(vm.initialCityCode, vm.initialCityName, "selectCity.locatedCity");
											})
                                    } else {
										vm.cityName = city;
										vm.cityCode = cityCode;
										vm.location(vm.cityCode, vm.cityName, res.latitude, res.longitude);
										vm.storeCity(cityCode, city, "selectCity.locatedCity");
                                        dialogManager.toast("已定位到" + city, {
											overlay: false
										});
                                    }
                                } else {
                                    vm.noCinemaInCity();
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
                    fail: function(res){
						vm.isUseSina = true;
						vm.weChatLocation();
                        console.log(res, "没获取到:fail");
                        dialogManager.closeWait();
                    },
                    cancel: function(res){
                        console.log(res, "没获取到:cancel");
                        dialogManager.closeWait();
                    }
                });
            },
			getLocationSina() {
				const vm = this;
				// jsonp({
				// 	url: "http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js",
				// 	onSuccess(res) {
				// 		console.log(res)
				// 		console.log(window.remote_ip_info)
				// 	}
				// })
				vm.addMap("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js", () => {
					// console.log(window.remote_ip_info);
					let cityData = window.remote_ip_info;
					let city = cityData.city;
					if (!city) {
						dialogManager.alert("获取城市失败,请手动选择城市");
						return;
					}
					let cityObj = vm.parsedCities.find((cityItem) => cityItem.name == city);
					if (cityObj) {
						let cityCode = cityObj.code;
						if (cityCode != vm.initialCityCode) {
							dialogManager.confirm(`定位到当前城市是${city}，是否切换城市？`)
								.then(() => {
									vm.cityName = city;
									vm.cityCode = cityCode;
									vm.location(vm.cityCode, vm.cityName);
									vm.storeCity(cityCode, city, "selectCity.locatedCity");
									vm.emitClose();
									dialogManager.toast("已定位到" + city, {
										overlay: false
									});
								})
								.catch(() => {
									if (!vm.cityName) {
										vm.cityName = city;
										vm.cityCode = cityCode;
										vm.location(vm.cityCode, vm.cityName);
									}
									vm.storeCity(vm.initialCityCode, vm.initialCityName, "selectCity.locatedCity");
								})
						} else {
							vm.location(vm.cityCode, vm.cityName);
							vm.storeCity(cityCode, city, "selectCity.locatedCity");
							dialogManager.toast("已定位到" + city, {
								overlay: false
							});
						}
					} else {
						vm.noCinemaInCity();
					}
				}, true)
			},
            getLocation(){
                const vm = this;
                if(webBridge && webBridge.isReady()){
                    dialogManager.wait();
                    webBridge.getCurrentRegion(function(res){
                        dialogManager.closeWait();
                        if(res && res.code == 0){
                            let city = res.data.areaName.replace(/市$/, "")
							let cityObj = vm.parsedCities.find((cityItem) => cityItem.name == city);

                            if(cityObj){
								let cityCode = cityObj.code;
                            	if (res.data.areaNo != vm.initialCityCode) {
                                    dialogManager.confirm(`定位到当前城市是${city}，是否切换城市？`)
                                        .then(() => {
                                            vm.cityName = city;
                                            vm.cityCode = res.data.areaNo;
											vm.location(vm.cityCode, vm.cityName);
											vm.storeCity(vm.cityCode, vm.cityName, "selectCity.locatedCity");
                                            vm.emitClose();
                                            dialogManager.toast("已定位到" + city);
										})
										.catch(() => {
											if (!vm.cityName) {
												vm.cityName = city;
												vm.cityCode = res.data.areaNo;
												vm.location(vm.cityCode, vm.cityName);
											}
											vm.storeCity(vm.initialCityCode, vm.initialCityName, "selectCity.locatedCity");
										})
                                } else {
									vm.cityName = city;
									vm.cityCode = res.data.areaNo;
									vm.location(vm.cityCode, vm.cityName);
									vm.storeCity(cityCode, city, "selectCity.locatedCity");
                                    dialogManager.toast("已定位到" + city, {
										overlay: false
									});
                                }
                            }else{
                            	vm.noCinemaInCity();
                            }
                        }else{
                            dialogManager.alert("获取城市失败,请手动选择城市");
                        }
                    });
                }
			},
			noCinemaInCity() {
				let listEl = document.querySelector(".m-select-city");
				listEl && dialogManager.toast("您所在的城市未开通影院");
			},
            setMapInit() {
                const vm = this;
                window.init = function () {
					vm.initialMapResolve();
                }
            },
            addMap(url, onload, single) {
				const vm = this;
				let mapUrl = url || "http://map.qq.com/api/js?v=2.exp&callback=init";

				// if (single) {
				// 	script = document.querySelector("[data-single='1']") || document.createElement("script")
				// } else {
				// 	script = document.createElement("script");
				// }
				let script = document.createElement("script");

                script.charset = "utf-8";
				script.src = mapUrl;
				script.dataset.single = "1";
                script.onload = () => {
					single && script.remove();
                    onload && onload.apply(vm)
                };
                document.body.appendChild(script);
            },

			onCloseClicked() {
				if (this.mode == "search") {
					this.inputText = "";
					this.mode = "select";
					return;
				}
                this.btnCloseSwitch === 'on' && this.$emit("close");
			},

			close() {
                const vm = this;
				vm.emitClose();
				vm.location(vm.cityCode, vm.cityName)
			},

			emitClose() {
				const vm = this;
				const data = {
					areaData: vm.areaData,
					cityName: vm.cityName,
					cityCode: vm.cityCode,
					url: vm.apiCallback,
				};
				vm.$emit("close", data);
			},

			initView() {
				this.storePosition();
			},

			storePosition() {
                const vm = this;
                let container = vm.$refs.scrollContainer;
                let top = getOffset(container).top;
                let charElArr = [].slice.call(container.querySelectorAll(".cities li") || []);

                charElArr.forEach((el, i) => {
					let charTop = getOffset(el).top;
					let delta = charTop - top + 2;
					vm.positions[el.dataset.char] = {delta, index: i};
                })
			},

			scrollTo(ev) {
                const vm = this;
				if (!vm.canScroll()) return;
                let el = ev.target;
                let char = el.innerText;
                if (vm.positions[char]) {
                    vm.$refs.scrollContainer.scrollTop = vm.positions[char].delta;
					vm.isTouching = true;
					vm.activateChar(char);
                }
			},

			scrollToChar(char) {
                const vm = this;
                if (vm.positions[char]) {
                    vm.$refs.scrollContainer.scrollTop = vm.positions[char].delta;
                }
			},

			activateChar(char) {
				const vm = this;
				this.alphabet.forEach((item) => {
					item.active = item.char == char
				});
			},

			listenScroll() {
				const vm = this;
				const HIGHT_CONTROL_POSITION = 6;
				const HIGHT_EXTRA = 48;
				this.$refs.scrollContainer.addEventListener("scroll", function () {
					if (vm.isTouching || !vm.canScroll()) return;
					const el = this;
					// el.scrollTop >
					for (let key in vm.positions) {
						let item = vm.positions[key];
						if (item.delta > el.scrollTop + HIGHT_CONTROL_POSITION + HIGHT_EXTRA) {
							vm.activateChar( vm.alphabet[Math.max(0, item.index - 1)].char );
							return;
						}
					}
				});
			},

			canScroll() {
				const vm = this;
				// if (vm.canCitiesScroll != null) {
				// 	return vm.canCitiesScroll;
				// }
                let evTouchstart = vm.evTouchstart;
				const scrollContainer = vm.$refs.scrollContainer;
				vm.canCitiesScroll = scrollContainer.offsetHeight < scrollContainer.scrollHeight;
				return vm.canCitiesScroll
			},

			onTouchmove(ev) {
                const vm = this;
                let evTouchstart = vm.evTouchstart;
				const scrollContainer = vm.$refs.scrollContainer
                if (!evTouchstart || !evTouchstart.target.dataset.char) {
                    return;
                }
                let startChar = evTouchstart.target.innerText;
                let chars = Object.keys(vm.positions);
                let startIndex = chars.indexOf(startChar);
                let dy = ev.changedTouches[0].clientY - evTouchstart.changedTouches[0].clientY;
                let di = Math.floor(dy / vm.charDelta);
                let char = chars[startIndex + di];
                if (char in vm.positions) {
                    vm.scrollToChar(char)
					vm.isTouching = true;
					vm.activateChar(char)
                }
			},

			onTouchstart(ev) {
                let targetEl = ev.target;
                if (targetEl.dataset.char && this.canScroll()) {
					// this.isTouching = true;
					// this.activateChar(targetEl.innerText)
                    this.scrollToChar(targetEl.innerText);
                    this.evTouchstart = ev;
					this.alphabetOverlay = "on";
                }
			},

			onTouchend() {
				this.alphabetOverlay = "off";
				this.isTouching = false;
			},

			getCities() {
                const vm = this;
                vm.$http.get(vm.url)
	                .then((res) => {
						let data = res.data || {};
						vm.apiCallback = data.apiCallback;
						vm.cities = data.city;
						vm.parsedCities = vm.parseCities(vm.cities);
                        vm.alphabet = data.indexer.map((char, i) => {
							return {
								char,
								active: false
							}
						});
						vm.cinemas = data.cinema || {};
                        vm.$nextTick(() => {
							vm.storePosition();
							vm.listenScroll();
							vm.initLocation();
						});

                        fire("gotLocationData", data);
	                })
			},

			initLocation() {
                const vm = this;
                let storedCity// = vm.getStoredCity();
                let cityCode, cityName;

                if (storedCity && storedCity.code && storedCity.name) {
                    cityCode = storedCity.code;
                    cityName = storedCity.name;
                } else {
					let el = vm.$refs.scrollContainer.querySelector(`[data-city-code]`);

                    if (!el) {
                        dialogManager.toast("获取城市数据失败");
                        fire("noCityData");
                        return;
                    }

					cityCode = vm.initialCityCode;
					el = vm.$refs.scrollContainer.querySelector(`[data-city-code='${cityCode}']`);
                    cityName = el ? el.dataset.cityName : "";
                }
                vm.cityCode = cityCode;
                vm.cityName = cityName;
                vm.areaData = vm.cinemas[vm.cityCode];
				vm.location(vm.cityCode, vm.cityName);

				vm.initialMapPromise.then(() => {
					// vm.weChatLocation();
					vm.locateCity();
				}).catch(() => {

				})
				// vm.weChatLocation();
			},

			parseCities(obj, mapKey="code", mapValue="name") {
				let ret = []
				for (let key in obj) {
					let arr = obj[key];
					arr.forEach((city) => {
						ret[ret.length] = city
					})
				}
				return ret;
			},

			location(cityCode, cityName, lat, lng) {
				fire("locatedCity", {
					areaData: this.cinemas[cityCode],
					cityName: cityName,
					cityCode: cityCode,
					lat,
					lng
				});

				this.storeCity();
			},

			focus(ev) {
				this.mode = "search";
			},

			blur() {
				// this.mode = "select";
			},

            clearText() {
                this.inputText = "";
            },

			onSearchClicked() {
				this.$refs.input.focus();
			},

			selectCity(ev) {
				const vm = this;
				let el = closest(ev.target, "[data-city-code][data-city-name]");
				if (!el) return;
				vm.cityCode = el.dataset.cityCode;
				vm.cityName = el.dataset.cityName;
				vm.areaData = vm.cinemas[vm.cityCode];
				vm.close();
				vm.storeCity(vm.cityCode, vm.cityName, "selectCity.locatedCity");
			},

			storeCity(code, name, prop="selectCity.city") {
                const vm = this;
                const obj = {
                    code: code == null ? vm.cityCode : code,
					name: name == null ? vm.cityName : name
				};
                localStorage.setItem(prop, JSON.stringify(obj));
			},

			getStoredCity(prop="selectCity.city") {
                let str = localStorage.getItem(prop);
				return str ? JSON.parse(str) : str;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../../common/style/mixin';
	.m-select-city{
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 10;
		@include display-flex;
		@include flex-direction;
	}

	.search-title{
        @include flex-shrink(0);
		@include wh(100%, 130px);
		padding: rem(0 24px 0 24px);
		@include box-sizing;
		@include transition(padding 0.3s ease);
		&.search{
			padding: rem(0 34px 0 34px);
			.search-input{
				@include width(618px);
				.input{
					@include flex(1);
					height: auto;
					line-height: normal;
				}
			}
		}
	}

	.search-input{
		@include wh(188px, 70px);
		@include transition(width 0.3s ease);
		@include radius(rem(70px));
		@include box-sizing;
		.input{
			@include font-size(28px);
			border: 0 none;
			background: none;
			@include width(100px);
			@include lh(65px);
		}

		.clear-text{
			@include wh(34px);
			@include radius(rem(34px));
			@include minus;
			margin-right: rem(24px);
		}

		&.search {
			width: 100%;
			margin-right: rem(24);
			.input {
				width: 80%;
			}
		}
	}
	.icon-search{
		margin: rem(0 10px 0 42px);
	}

	.list {
		@include display-flex();
		@include flex-direction(column);
		@include flex(1);
		position: relative;
		height: 100%;
		overflow: auto;

		>.alphabet {
			position: fixed;
			right: 0;
			top: 50%;
			text-align: center;
			padding: rem(0 24);
			@include translate(0, -50%);

			li {
				width: rem(50);
				line-height: rem(50);
				// padding-top: rem(10);
				font-size: rem(26);

				&.active {
					@include radius(rem(40px));
				}
			}
		}

		.overlay {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			// background-color: rgba(#000, 0.3);
		}
	}

	.city-result {
		padding: rem(0 24 20);
		font-size: rem(32);

		.label {
			.reload-wrapper {
				display: inline-block;
				vertical-align: middle;
				padding: rem(12);
			}
		}

		.city-name {
			display: inline-block;
			padding: rem(16 36);
			@include radius(rem(100px));
			margin-top: rem(20);
		}
	}

	.cities {
		@include flex(1);
		height: 100%;
		overflow: auto;
		-webkit-overflow-scrolling: touch;

		.alphabet {
			.char {
				font-size: rem(36);
				padding: rem(30 24 16);
				text-indent: 1em;
			}

			.char-cities {
				padding: rem(0 80 0 24);
			}
			.char-city {
				padding: rem(26 0);
				font-size: rem(32);
				text-indent: 0.5em;
			}
		}
	}
</style>