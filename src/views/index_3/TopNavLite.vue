<template>
    <div class="m-top-nav-lite">
        <template v-if="'city' == selectType">
            <div class="item right">
                <div class="tap-location vh-center" @click="showSelectCity">
                    <i class="icon-location-2"></i>
                </div>
            </div>
            <select-city :show.sync="isShowSelectCity" :url="options.href.apiCitylist" :initialCityCode="queryParams.a" :callbackUrl="'/index/index'"></select-city>
        </template>

        <template v-if="'cinema' == selectType">
            <div class="item right">
                <div class="tap-location vh-center" @click="showSelectCinema">
                    <i class="icon-cinema"></i>
                </div>
            </div>
            <select-cinema :iphone-x="iphoneX" :url="options.href.apiCinemalist" :callback-url="(options.data.callbackUrl || '').replace(/.*\/([^\/\?]+\/[^\/\?]+?)\?.*/, '$1')"
                :show.sync="isShowSelectCinema" />
        </template>
    </div>
</template>

<script>
    import {
        array,
        object
    } from "common/utils/defaultProps";
    import {
        bind
    } from "lib/comp/bus";
    import query from "lib/json/query";
    let queryParams = query.parse(location.search.slice(1));
    export default {
        props: {
            data: object,
            options: object
        },
        data() {
            const selectTypeMap = {
                "2": "cinema",
                "3": "city"
            };
            return {
                isShowSelectCity: false,
                queryParams,
                apiLocation: options.href.apiCitylist, //`/dyh5/web/city/list?b=${queryParams.b}`,
                cityName: "",
                cityCode: "",
                areaData: null,
                selectType: selectTypeMap[this.options.data.isSelectCity],
                iphoneX: "selectCinema",
                isShowSelectCinema: false
            };
        },
        mounted() {
            if ("cinema" == this.selectType) {
                return;
            }
            bind("locatedCity", this.onLocatedCity);
            bind("showSelectCity", this.showSelectCity);
        },
        methods: {
            showView(title) {
                this.$emit("showView", title);
            },
            showSelectCity() {
                this.isShowSelectCity = true;
            },
            onLocatedCity(data) {
                const vm = this;
                Object.assign(vm, data);
            },
            showSelectCinema() {
                this.isShowSelectCinema = true;
            }
        }
    };

</script>

<style lang="scss" scoped>
    @import "../../common/style/mixin";
    .arrow-down {
        @include arrow-down();
        vertical-align: middle;
    }

    .m-top-nav {
        @include wh(100%, 0);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2;
    }

    .tap-location {
        @include wh(62px);
        @include radius(rem(62px));
        position: fixed;
        top: rem(24px);
        right: rem(20px);
        z-index: 13;
    }

</style>
