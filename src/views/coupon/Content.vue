<template>
    <div class="container">
        <ul v-if="list && list.length" @click="listClicked">
            <li class="item" v-for="(item, i) in listAble" :key="i">
                <coupon-ticket @showDetail="showDetail" :data="item" :index="i" :selected="item.selected" @ticketClicked="ticketClicked"></coupon-ticket>
            </li>
            <li class="divide" v-if="listDisable.length">
                <divide :msg="'无效券'"></divide>
            </li>
            <li class="item" v-for="(item, i) in listDisable" :key="i">
                <coupon-ticket @showDetail="showDetail" :data="item" :index="i" :selected="item.selected" @ticketClicked="ticketClicked"></coupon-ticket>
            </li>
        </ul>
        <error v-else :msg="'空空如也 ~ '"></error>
    </div>
</template>

<script>
import couponTicket from "common/components/couponTicket";
import error from "common/components/error";
import popup from "lib/layer/popup";
import CouponDetail from "./Detail";
import {object} from "common/utils/defaultProps";
import urlUtil from "lib/util/URL";
import closest from "lib/dom/closest";
import viewport from 'lib/comp/viewport';
import divide from "common/components/touchedBottom";
import dialogManager from "common/plugin/dialog";
import webBridge from "common/utils/webBridge";
import browser from "lib/util/browser";
function pushHistory() {
    var state = {title: "title", url: "#"};
    window.history.pushState(state, state.title, state.url);
}
pushHistory();
let flag = true;
window.addEventListener("popstate", function(ev) {
    if ((viewport.getDeviceType() != "iphone") && !!flag) {
        history.go(-2);
        sessionStorage.setItem('androidback', true);
    }
});
export default {
    props: {
        list: Array,
        listAble: Array,
        listDisable: Array,
        hrefs: object
    },
    data() {
        return {
            currentData: null,
            m_dialog: null,
            isSelectable: null
        }
    },
    computed: {
        computedData() {
            return this.currentData || {}
        },
        selectedItems() {
            return this.list.filter((item) => item.selected)
        }
    },
    components: {
        couponTicket,
        error,
        divide
    },

    created() {
        const vm = this;
        vm.setSelectable();
        if (!vm.isSelectable) {
            localStorage.removeItem("coupon.selectedItems");
        }
    },

    mounted() {
        const vm = this;
        vm.m_dialog = popup('<coupon-detail :data="data" @hide-detail="hide" />', {
            option: {
                autoHide: true,
                animate: {
                    name: "slide-bottom"
                }
            },
            popup: {
                data() {
                    return {
                        data: vm.computedData,
                    };
                },
                methods: {
                    hide() {
                        vm.m_dialog.hide();
                    },
                    show() {
                        vm.m_dialog.show();
                    }
                },
                components: {
                    CouponDetail
                }
            }
        });
        vm.m_dialog.setPosition(0, "auto", "auto", 0);
//        vm.m_dialog.show();
    },

    methods: {
        showDetail(params, needGet) {
            const vm = this;

            if (needGet) {
                vm.getDetail({
                    account: vm.getAccount(),
                    code: params.code
                });
            } else {
                vm.setCurrentData(params);
                vm.m_dialog.popup.data = params; // 改变弹层的内容
                vm.m_dialog.show();
            }
        },
        getDetail(params) {
            const vm = this;
            vm.$http.post(vm.hrefs.apiCouponview, params)
                .then((res) => {
                    vm.m_dialog.show();
                })
                .catch((errData) => {

                })
        },
        setCurrentData(newData) {
            this.currentData = newData;
        },
        getAccount() {
            return urlUtil.parse(location.href).queryJson.account || "";
        },

        ticketClicked(index, type, ticket) {
            const vm = this;
            if (!vm.isSelectable) return;
            if (type == "disabled") return;
            vm.list.forEach((item, i) => {
                if (i === index) {
                    item.selected = !item.selected;
                } else {
                    item.selected = false;
                }
            });
            vm.list = [...vm.list];
            vm.saveLocal();
        },

        saveLocal() {
            const vm = this;
            flag = false;
            let jsonStr = JSON.stringify(vm.selectedItems);
            localStorage.setItem(`coupon.selectedItems${urlUtil.parse(location.href).queryJson.ordercode}`, jsonStr);
            dialogManager.wait();
            if (!browser.WX) {
                webBridge.close(4);
                return;
            }
            if (viewport.getDeviceType() === "iphone") {
                setTimeout(function() {
                    history.go(-2);
                    dialogManager.closeWait();
                }, 500);
            } else {
                history.go(-3);
                sessionStorage.setItem('androidback', true);
            }
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

.item {
    @include display-flex;
    @include justify-content(center);
    @include align-items(center);
    margin: rem(50px auto);
}

    .m-error {
        position: fixed;
        top: 50%;
        left: 50%;
        @include translate(-50%, -50%);
    }
</style>
