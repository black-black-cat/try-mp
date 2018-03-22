<template>
    <div class="m-card-message" v-if="showView" @click.stop="onClick($event)">
        <div class="text-top" v-if="isTop"><i class="icon-light"></i><span>{{text}}</span></div>
        <div class="text-styled" v-else-if="text">{{text}}</div>
        <div class="text" v-else-if="textInTopLeft">{{ textInTopLeft }}<i class="arrow-right"></i></div>
    </div>
</template>

<script>
import {array, object} from 'common/utils/defaultProps'
import query from "lib/json/query"
import dialogManager from "common/plugin/dialog"
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"
import storageMessager from "lib/util/storageMessager"
import {bus, get, fire} from "lib/comp/bus"

export default {
    props: {
        options: object,
        options_2: object,
        text: String,
        isTop: Boolean
    },
    data: function () {
        return {
            showView: true,
            textInTopLeft: ""
        }
    },
    mounted() {
        const vm = this;
        fire("cardMessage", this);
        if (!vm.options.id && !vm.options_2.id) {
            vm.showView = false
            return;
        }
        vm.createText();
    },
    methods: {
        createText() {
            const vm = this;
            const names = [];
            if (vm.options.id) {
                names.push("开卡");
            }
            if (vm.options_2.id) {
                names.push("首次绑卡");
            }
            vm.textInTopLeft = names.length ? names.join("/") + "即送礼包" : "";
        },
        onClick(ev) {
            const vm = this;
            let template = `<div>${vm.createSection(vm.options)}${vm.createSection(vm.options_2)}</div>`;

            template && dialogManager.open({
                template
            }, {
                // autoHide: true,
                buts: [{text: "确定", type: "ok", id: "ok"}],
            })
        },

        createSection(acti) {
            if (acti.id) {
                return `<div>
                    <div style="display: flex;padding: 0.5rem 0.32rem 0;">
                        <div style="-webkit-flex-shrink: 0;flex-shrink: 0;">活动时间：</div>
                        <div>${acti.starttime} 至 <span style="white-space: nowrap;">${acti.endtime}</span></div>
                    </div>
                    <div style="padding: 0.32rem 0.32rem 0.5rem;max-height: 5rem;overflow: auto;">活动规则：${acti.title}</div>
                </div>`;
            }
            return "";
        }
    }
}
</script>

<style lang="scss" scope>
    @import "../style/mixin";

    .text-styled {
        @include radius(rem(4px));
        line-height: 1.6;
        padding: rem(0 12px);
    }

    .text-top {
        @include display-flex(flex);
        @include align-items(center);
        @include justify-content(center);
        font-size: rem(26px);
        line-height: rem(68px);
        @include ellipsis(100%);

        &>span {
            @include ellipsis(80%);
            width: auto;
            max-width: 80%;
        }
    }

    .arrow-right {
        margin-left: rem(10px);
        @include arrow-right;
        margin-right: rem(-10px);
    }
</style>

