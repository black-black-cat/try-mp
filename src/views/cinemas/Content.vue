<template>
	<div class="m-content">
		<ul class="list" v-if="cinemas">
			<li v-for="(cinema, i) in cinemas" :key="i">
				<cinema-item :data="cinema" :options="options" :targetUrl="options.href.urlShow" ref="cinemaItem"></cinema-item>
			</li>
		</ul>
		<div class="error-wrapper vh-center" v-if="isShowError">
			<error :msg="errorMsg" :refresh="'yes'"></error>
		</div>
	</div>
</template>

<script>
	import {isLock, lock, unLock, bind} from "lib/comp/bus";
	import dialogManager from "common/plugin/dialog";
	import query from "lib/json/query";
	import urlUtil from "lib/util/URL";
	import error from "common/components/error";
	import CinemaItem from "./CinemaItem";
    import {array, object} from 'common/utils/defaultProps'

    export default {
        props: {
            options: object
        },
        data() {
            return {
                pageLocation: window.location,
                apiCinemas: "",
	            cinemas: null,
	            isShowError: false,
	            errorMsg: "空空如也",
                lat: 0,
                lng: 0,
                mapLoaded: false,
                mapLoadedPromise: null,
            }
        },
	    components: {
            CinemaItem,
            error
        },
        created() {
            this.setMapInit();
            this.addMap();
        },
	    mounted() {
//            bind("locatedCity", this.onLocatedCity);
		    this.getList();
	    },
	    methods: {
            setApiCinemas(cityCode) {
                const vm = this;
				let l = vm.pageLocation;
				let obj = query.parse(l.search.slice(1));
				obj.a = cityCode;

				vm.apiCinemas = query.url(`${l.origin}${l.pathname}`, obj)
            },
		    getListByCity() {
                const vm = this;
                vm.setApiCinemas(vm.cityCode);
                vm.getList();
		    },
            getList() {
                const vm = this;
                if (isLock()) {
                    return;
                }
                vm.lock();
                vm.$http.get(vm.apiCinemas)
	                .then((res) => {
                        let data = res.data || {};
                        vm.cinemas = data.cinemas || [];
                        vm.isShowError = !vm.cinemas.length;
                        vm.errorMsg = vm.isShowError ? "该城市暂未开通影院" : "";

                        vm.mapLoadedPromise
                            .then(() => {
                                try {
                                    vm.computeDistance(vm.lat, vm.lng);
                                } catch (err) {
                                    console.log(err)
                                }

                            })
                            .catch((err) => {
                                console.log(err)
                            })

                        vm.unlock();
	                })
	                .catch((errData) => {
                        dialogManager.toast(errData.msg);
                        vm.isShowError = !vm.cinemas || !vm.cinemas.length;
                        vm.unlock()
                        console.dir(errData)
	                })
            },
            lock() {
                dialogManager.wait();
                lock();
            },
            unlock() {
                dialogManager.closeWait();
                unLock();
            },
            onLocatedCity(data) {
                const vm = this;
                Object.assign(vm, data);
                vm.getListByCity();
            },
            computeDistance(lat, lng) {
                const vm = this;
//	            lat=23.099994; lng=113.324520; // test
                let distance;
                if (window.qq && lat && lng) {
                    let coord = new qq.maps.LatLng(lat, lng);
                    vm.cinemas.forEach((cinema, i) => {
                        let cinemaCoord
                        const geocoder = new qq.maps.Geocoder({
                            complete(res) {
                                cinemaCoord = res.detail.location;
                                distance = qq.maps.geometry.spherical.computeDistanceBetween(coord, cinemaCoord)
                                if (!distance) {
                                    return;
                                }
                                distance = distance >= 1000 ? (distance / 1000).toFixed(1) + " km" : distance + " m";
                                cinema._distance = distance;
                                vm.$refs.cinemaItem[i].data = Object.assign({}, cinema);
                            }
                        });

                        geocoder.getError((res) => {
                            console.log(res);
                        })
                        geocoder.getLocation(cinema.cinema_address);
                    })
                    vm.cinemas = [...vm.cinemas];
                }

            },

            setMapInit() {
                const vm = this;
                let resolveMapLoaded;
                vm.mapLoadedPromise = new Promise((resolve) => {
                    resolveMapLoaded = resolve
                });
                window.initA = function () {
                    vm.mapLoaded = true;
                    resolveMapLoaded()
                }

            },

            addMap(onload) {
                const vm = this;
                let mapUrl = "http://map.qq.com/api/js?v=2.exp&callback=initA&libraries=geometry";
                let script = document.createElement("script");
                script.charset = "utf-8";
                script.src = mapUrl;
                script.onload = () => {
                    onload && onload.apply(vm)
                };
                document.body.appendChild(script);
            },
	    },

    }
</script>

<style lang="scss" scoped>
	@import '../../common/style/mixin';
	.m-content {

		.list {
			padding: rem(84 0 0 24);
		}

		.error-wrapper {
			min-height: rem(500);
		}
	}

</style>