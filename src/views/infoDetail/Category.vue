<template>
    <div class="category">
        <cate-nav v-if="navItems && navItems.length"
        :items="navItems"
        :activeItem="activeNavItem"
        ref="nav"
        @onItemClicked="setActiveNav"
        ></cate-nav>
        <cate-content v-if="contentItems && contentItems.length"
        :data="contentItems"
        :activeItem="activeNavItem"
        :apiContentData="apiContentData"
        @slided="setActiveNav"
        ref="cateContent"
        ></cate-content>
    </div>
</template>

<script>
import CateNav from "./CateNav";
import CateContent from "./CateContent";
import dialogManager from "common/plugin/dialog";
import * as bus from "lib/comp/bus";

export default {
    props: {
        apiNavData: {
            type: String
        },
        apiContentData: {
            type: String
        },
        initialIndex: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            navItems: [],
            contentItems: [],

        }
    },
    computed: {
        activeNavItem() {
            return this.navItems.filter((item, i) => {
                return item.active;
            })[0] || null
        },

    },
    watch: {
        activeNavItem(newVal) {
            const vm = this;
            vm.getContentData();
        }
    },
    mounted() {
        this.getNavData();
    },
    components: {
        CateNav,
        CateContent
    },
    methods: {
        getNavData() {
            const vm = this;
            if (bus.isLock()) {
                return;
            }
            bus.lock();
            vm.$http.get(vm.apiNavData).then(function(res) {
                const data = res.data;
                let maped = data.map(function　(item, i) {
                    return Object.assign({}, item, {
                        nav: item.title,
                        active: i == vm.initialIndex,
                        index: i
                    });
                })
                vm.navItems = [...vm.navItems, ...maped];
                vm.navItems.forEach((item, i) => {
                    vm.contentItems[i] = {
                        id: item.id,
                        got: false,
                        arr: []
                    }
                });
                // vm.getContentData();
                vm.unlock();
            })
                .catch(function(err) {
                    console.log(err)
                    dialogManager.toast(err.msg);
                    vm.unlock();
                })
        },
        getContentData() {
            const vm = this;
            if (!vm.activeNavItem) return;
            let id = vm.activeNavItem.id;
            let index = vm.activeNavItem.index;
            if (vm.contentItems[index] && vm.contentItems[index].got) return;
            if (bus.isLock()) {
                return;
            }
            vm.lock();
            vm.$http.get(vm.apiContentData, {
                params: {
                    tag_id: id
                }
            }).then(function(res) {
                vm.contentItems[index].arr = res.data || [];
                vm.contentItems[index].got = true;
                let arr = vm.contentItems;
                vm.contentItems = arr.slice(0);
                // console.dir(vm.contentItems);
                vm.unlock();
            }).catch(function(err) {
                dialogManager.toast(err.msg);
                vm.unlock();
            })
        },
        lock() {
            bus.lock();
            dialogManager.wait();
        },
        unlock() {
            bus.unLock();
            dialogManager.closeWait();
        },
        setActiveNav(data) {
            const vm = this;
            let index = data.index || 0;
            vm.navItems.forEach((item, i) => {
                if (i === index) {
                    item.active = true;
                } else if(item.active) {
                    item.active = false;
                }
            });
            vm.contentSlideTo(index);
        },
        contentSlideTo(index) {
            this.$refs.cateContent.slideTo(index);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";
.category {
    margin-top: r(24);
}
</style>
