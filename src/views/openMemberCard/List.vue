<template>
    <div class="list">
        <div class="title">
            <div class="title-left">选择卡种</div>
            <div class="title-right" v-href="urlBindCard">
                <span>已有会员卡？立即绑卡</span>
                <i class="arrow-right"></i>
            </div>
        </div>
        <div class="content" v-if="cards.length">
            <ul>
                <li class="list-item" v-for="(item,i) in cards" :key="i">
                    <member-card :cardData="item"
                    :cinemaName="cinema.cinema_name"
                    :targetUrl="item.urlCreate"
                    :cardSkin="`member-card-${item.cardType}`"
                    :colorCode="item.color"
                    :isRecommend="i == 0"
                    :canOpen="canOpen"
                    @beforeOpenUrl="setLocal"
                    ></member-card>
                </li>
            </ul>
            <div class="title-right bottom-entry" v-href="urlBindCard">
                <span>已有会员卡？立即绑卡</span>
            </div>
        </div>
        <div class="error-wrapper" v-else>
            <error :msg="'空空如也 ~ '"></error>
            <p>此影院暂时不支持线上开卡</p>
        </div>

    </div>
</template>

<script>
import memberCard from "common/components/memberCard.vue";
import error from "common/components/error";

export default {
    props: {
        cards: {
            type: Array,
            default() {
                return [];
            }
        },
        cinema: {
            type: null
        },
        urlBindCard: {
            type: String,
            default: ""
        },
        canOpen: Boolean
    },
    data() {
        return {

        }
    },
    computed: {
        policyIdArr() {
            return this.cards.map(function (item) {
                return item.policyId
            });
        }
    },
    components: {
        memberCard,
        error
    },
    mounted() {
        this.removeLocal();
    },
    methods: {
        setLocal(res) {
            const vm = this;
            let json = JSON.stringify(Object.assign(res.data, {
                cinemaName: vm.cinema.cinema_name
            }) || {});
            localStorage.setItem("openMemberCard.policyId", res.data.policyId);
            localStorage.setItem(res.data.policyId, json);
        },
        removeLocal() {
            const vm = this;
            vm.policyIdArr.forEach(function (item) {
                localStorage.removeItem(item);
            });
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";

.arrow-right {
    @include arrow-right;
}

.error-wrapper {
    position: fixed;
    left: 50%;
    top: 50%;
    @include translate(-50%, -50%);
    text-align: center;

    >p {
        padding-top: rem(24);
    }
}

.list {
    min-height: 100%;
    .title {
        @include display-flex();
        @include justify-content(space-between);
        @include align-items(center);
        margin-left: r(24);
        padding-right: r(24);
        height: r(88);
        border-bottom-width: r(1);
        border-bottom-style: solid;
    }
    .title-left {
        font-size: r(30);
    }
    .title-right {
        font-size: r(26);

        &.bottom-entry {
            margin-bottom: r(30);
            text-align: center;
        }
    }

    .content {
        @include clearfix();
        .member-card {
            text-align: left;
        }
    }

    .list-item {
        margin-top: r(50);
        margin-bottom: r(50);
        text-align: center;
    }
}
</style>
