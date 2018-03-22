<template>
    <div class="m-login-wx">
        <div class="ways">
            <div></div>
            <div>其他登录方式</div>
            <div></div>
        </div>
        <div class="vh-center">
            <div class="icon-wechat"></div>
        </div>
    </div>
</template>
<script>
    
</script>
<style lang="scss" scoped>
@import "../../../common/style/mixin";

.m-login-wx {
    .ways{
        @include display-flex(flex);
        @include justify-content(center);
        @include align-items(center);
        >div:nth-child(1), >div:nth-child(3) {
            width: rem(100px);
            height: 1px;
        }
        >div:nth-child(1) {
            margin-right: rem(24px);
        }
        >div:nth-child(3) {
            margin-left: rem(24px);
        }
        font-size: rem(22px);
    }
    .vh-center {
        margin-top: rem(40px);
    }
}

</style>

