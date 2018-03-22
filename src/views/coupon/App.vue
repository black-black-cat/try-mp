<template>
    <div class="m-count">
        <app-header :options="options" :displayType="displayType" :ticketCount="listAble.length" @showAble="showAble"></app-header>
        <app-content :list="list" :listAble="listAble" :listDisable="listDisable" :hrefs="options.href" v-if="completed"></app-content>
        <app-footer @showAll="showAll" v-if=" displayType == 'selectable' "></app-footer>
    </div>
</template>

<script>
    import AppContent from "./Content";
    import AppHeader from "./Header";
    import AppFooter from "./Footer";
    import urlUtil from "lib/util/URL";
    import openUrl from "common/utils/openUrl";
    import query from "lib/json/query";

    export default {
        props: {
            options: Object
        },
        data() {
            return {
                user: this.options.data.user,
                list: this.options.data.coupons || [],
                displayType: "able",
                completed: false,
                isSelectable: null
            }
        },
        computed: {
            listAble() {
                return this.list.filter((item) => item.status == 1 || item.status == 2)
            },
            listDisable() {
                return this.list.filter((item) => item.status == 3 || item.status == 4)
            },
            listCurrent() {
                const vm = this;
                return vm.displayType == "able" ? vm.listAble : vm.listDisable;
            }
        },
        components: {
            AppContent,
            AppHeader,
            AppFooter
        },
        created() {
            this.getSelfUrl();
            let isSelectable = this.setSelectable();
            if (isSelectable) {
                this.displayType = "selectable";
            }
            this.getList();
        },
        methods: {
            getList() {
                const vm = this;
                vm.$http.get(vm.options.href.apiCoupons, {
                    params: {
//                        account: vm.user.account,
//                        type: 1
                    }
                })
                    .then((res) => {
                        vm.list = res.data.data || [];
                        vm.completed = true
                    })
                    .catch((errData) => {
                        vm.completed = true
                    })
            },
            showAble() {
                this.displayType = "able";
            },
            showDisable() {
                this.displayType = "disable";
            },
            showAll() {
                let obj = this.selfUrl;
                obj.queryJson.type = 1;
                obj.query = query.stringify(obj.queryJson);
                openUrl( urlUtil.build(obj) );
            },
            getSelfUrl() {
                const parse = urlUtil.parse;
                this.selfUrl = parse(location.href);
            },
            setSelectable() {
                const parse = urlUtil.parse;
                let num = parse(location.href).queryJson.type;
                this.isSelectable = num == 2;
                return num == 2;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../common/style/mixin";
    .m-count {
        padding: rem(208px 0 88px);
    }
</style>
