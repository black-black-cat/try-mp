<template>
    <div class="m-prize">
        <div class="prize-msg">{{`绑卡礼包已发放到您的个人账号，请注意查收。`}}</div>
        <div class="prize-list" v-if="prizeList">
            <div class="title">礼包内含：</div>
            <div class="prize-item" v-for="(item, i) in prizeList" :key="i">{{item.title}} &times; {{item.num}}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        option: Object
    },
    data() {
        return {
            prizeList: this.option.prizeList,
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../style/mixin";
.m-prize {
    padding: rem(24);
}

.prize-msg {
    padding: rem(24);
    font-size: rem(28);
}
.prize-list {
    font-size: rem(28);
    text-align: center;

    .title {
        padding-bottom: rem(12px);
    }

    .prize-item {
        line-height: 1.5;
    }
}
</style>
