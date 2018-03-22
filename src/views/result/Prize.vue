<template>
    <transition
        name="expand"
        enter-class="expand-in-enter"
        enter-active-class="expand-in-active"
    >
        <div>
            <div v-if="prizeGot" class="m-prize">
                <!-- {{`${orderTypeMap[orderType]}礼包已发放到您的个人账号，请注意查收。`}} -->
                <div class="prize-msg">恭喜领到红包</div>
                <div class="prize-list" v-if="prizeList">
                    <!-- <div>礼包内含：</div> -->
                    <div class="prize-items">
                        <div class="prize-item" v-for="(item, i) in prizeList" :key="i">{{item.title}} * {{item.num}}</div>
                    </div>
                </div>
                <div class="prize-foot">·可在[我的]-[优惠券]中查看，记得使用哦~</div>
            </div>
        </div>
    </transition>
</template>

<script>
import {array, object} from 'common/utils/defaultProps'
import {isLock, unLock, lock} from "lib/comp/bus"
import myAxios from "common/utils/axiosCross"

export default {
    props: {
        options: object,
        orderType: [String, Number]
    },
    data: function () {
        return {
            queryParams: null,
            // 1:购买影票;2:购买卖品;3:开卡；4：充值
            orderTypeMap: {
                "1": "购买影票",
                "2": "购买卖品",
                "3": "开卡",
                "4": "充值"
            },
            prizeGot: false,
            prizeList: null
        }
    },
    mounted() {
        this.parseParams(this.options.params);
        this.getPrize();
    },
    methods: {
        getPrize() {
            const vm = this;
            vm.$http.get(vm.options.urlActview, {
                params: vm.queryParams
            }).then(res => {
                res.data && myAxios.get(res.data)
                    .then(res => {
                        vm.prizeGot = true;
                        vm.prizeList = res.data.prize;
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {})
        },
        parseParams(str) {
            let params
            try {
                params = JSON.parse(str)
            } catch (e) {
                params = {}
            }
            params.rt = params.r;
            params.starttime = this.options.starttime;
            params.endtime = this.options.endtime;
            this.queryParams = params;
            return params;
        }
    }
}
</script>


<style lang="scss" scope>
@import "../../common/style/mixin";

.expand-in-active {
    @include transition(all 0.5s ease);
}

.expand-in-enter {
    height: 0;
    @include opacity(20);
}

.m-prize {
    margin-left: auto;
    margin-right: auto;
    padding: rem(24);
    width: rem(487);
    height: rem(359);
    background-image: img-url("red_packet.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

.prize-msg {
    padding: rem(36 24 12);
    font-size: rem(30);
}
.prize-list {
    @include display-flex();
    @include justify-content(center);
    @include align-items();
    height: rem(100);
    overflow: auto;
    font-size: rem(28);

    .prize-items {
        max-height: rem(100);
        overflow: auto;
    }

    .prize-item {
        display: inline-block;
        padding: rem(0 12);
        line-height: 1.5;
        font-size: rem(26);
    }
}
.prize-foot {
    margin-top: rem(22);
    font-size: rem(20);
}
</style>
