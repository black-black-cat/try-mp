<template>
	<div class="m-count">
		<app-content v-if="list.length" :list="list" :isMore="isMore" @loadMore="getList"></app-content>
	</div>
</template>

<script>
    import AppContent from "./Content";
    import query from "lib/json/query";
    import URL from "lib/util/URL";
    import {object} from "common/utils/defaultProps";
    import {lock, unLock, isLock} from "lib/comp/bus";
    import dialogManager from "common/plugin/dialog";

    export default {
        props: {
			options: object
        },
        data() {
            return {
				hrefs: this.options.href,
	            pageNum: 1,
	            rowsPerPage: 5,
	            filmCode: "",
	            list: [],
	            isMore: false
            }
        },
	    computed: {
            urlBase() {
                return this.hrefs.urlDiscovery;
            }
	    },
        components: {
            AppContent
        },
	    created() {
            const vm = this;
            vm.filmCode = vm.getFilmCode();
            vm.getList();
	    },
	    methods: {
            getList() {
                const vm = this;
                if (isLock()) {
                    return;
                }
                vm.lock();
                vm.$http.post(vm.hrefs.apiDiscovery, {
					film_code: vm.filmCode,
                    page: vm.pageNum,
	                rows: vm.rowsPerPage
                }).then(res => {
//                    console.dir(res)
	                let data = res.data || [];
                    vm.isMore = data.length == vm.rowsPerPage;
                    data.forEach((item) => {
                        item._url = vm.setTargetUrl(item.id);
                    });
	                vm.list = [...vm.list, ...data];
                    vm.pageNum ++;
                    vm.unlock();
                }).catch(errData => {
                    vm.unlock();
                })
            },
		    getFilmCode() {
                let queryStr = location.search.slice(1);
                let obj = query.parse(queryStr);
                return obj.film_code || "";
		    },
		    setTargetUrl(id) {
                const vm = this;
                let url = `${vm.urlBase}&id=${id}`;
                return url;
		    },
            lock() {
                lock();
                dialogManager.wait();
            },
            unlock() {
                unLock();
                dialogManager.closeWait();
            }
	    }
    }
</script>

<style lang="scss" scoped>

</style>

