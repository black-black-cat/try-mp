<template>
    <div class="m-card-policy">
        <div class="title"><div>{{this.title}}</div><div class="icon-dialog-close" @click="close"></div></div>
        <div v-html="this.description"></div>
    </div>
</template>
<script>
export default {
    props: ["options"],
    data() {
        return {
            cardInfor: JSON.parse(window.localStorage.getItem(window.localStorage.getItem("openMemberCard.policyId"))),
            description: null,
            title: null
        }
    },
    methods: {
        close: function() {
            this.$emit("close");
        }
    },
    mounted() {
        let vm = this;
        let textArr = vm.cardInfor.description.split("<br />");
        let middle = 0;
        for(let index in textArr) {
            if(textArr[index] == "票价政策") {
                middle = index;
            }
        }
        for(let index in textArr) {
            if( Number(index) <= Number(middle)) {
                textArr[index] = '<div class="item1">' + textArr[index] + '</div>';
            } else {
                textArr[index] = '<div class="item2">' + textArr[index] + '</div>';
            }
        }
        vm.description = textArr.join("");
        vm.title = vm.cardInfor.descTitle;
    }
}
</script>
<style lang="scss" scoped>
@import '../../common/style/_mixin.scss';
.m-card-policy {
    width: rem(750px);
    .title {
        @include display-flex(flex);
        @include justify-content(space-between);
        @include align-items(center);
        padding: rem(0 34px);
        font-size: rem(32px);
        line-height: rem(100px);
        >div:first-child {
            @include flex(1);
            text-align: center;
        }
    }
    >div:nth-child(2) {
        padding: rem(0 34px 50px 34px);
    }
}
</style>
<style lang="scss">
@import '../../common/style/_mixin.scss';
.m-card-policy {
    .item1 {
        position: relative;
        padding-left: rem(26px);
        font-size: rem(28px);
        line-height: rem(42px);
        &:before {
            content: '';
            position: absolute;
            left: 0;
            top: rem(15px);
            @include wh(12px);
            @include radius(100%);
        }
    }
    .item1:nth-child(1) {
        margin-top: rem(43px);
    }
    .item1:nth-child(n+2) {
        margin-top: rem(24px);
    }
    .item2 {
        font-size: rem(24px);
        line-height: rem(34px);
    }
    .item2:nth-child(1) {
        margin-top: rem(27px);
    }
    .item2:nth-child(n+2) {
        margin-top: rem(18px);
    }
}
</style>
