<template>
    <div class="m-qr-code">
        <div class="title vh-center">
            <span class="name">会员卡二维码</span>
            <i class="icon-dialog-close" @click="close"></i>
        </div>
        <div class="show-code">
            <div class="qr-code vh-center" ref="qrCode"></div>
            <p class="desc">请面向扫码机展示二维码</p>
        </div>
        <div class="card-info">
            <div class="logo">{{option.cardTypeName}}</div>
            <div class="film-name">{{option.city_name}}{{option.cinema_name}}</div>
            <div class="card-code">卡号：{{option.code}}</div>
        </div>
    </div>
</template>
<script>
    import dialogManager from 'common/plugin/dialog'
    import {array, object} from 'common/utils/defaultProps'
    import QrCode from 'lib/util/qrcode'
    import viewport from 'lib/comp/viewport'

    export default {
        props: {
            href: object,
            option: object
        },
        data () {
            return {
                m_qrCode: null
            }
        },
        watch: {
            option () {
                this.m_qrCode.clear();
                // this.m_qrCode.makeCode(this.option.cinema_code + "|" + this.option.code);
                this.m_qrCode.makeCode(this.option.code);//应曹老师要求：只根据会员卡卡号生成二维码
            }
        },
        mounted () {
            const sp = viewport.rem() / 37.5;
            this.m_qrCode = new QrCode(this.$refs.qrCode, {
                width: 128 * sp,
                height: 128 * sp,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QrCode.CorrectLevel.H
            });
        },
        methods: {
            close () {
                this.$emit("close");
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../common/style/mixin";
    .m-qr-code{
        width: rem(750px);
        .title{
            @include height(100px);
            position: relative;
            .name{
                @include flex(1);
                @include font-size(32px);
                text-align: center;
            }
            .icon-dialog-close{
                @include top_center;
                right: rem(34px);
            }
        }
    }

    .show-code{
        text-align: center;
        margin: rem(0 34px);
        padding: rem(60px 0);
        .desc{
            padding-top: rem(20px);
            @include font-size(22px);
        }
    }

    .card-info{
        text-align: center;
        padding: rem(20px 0 30px);
        .logo{
            @include font-size(30px);
        }
        .film-name{
            @include font-size(22px);
            padding-top: rem(12px);
        }
        .card-code{
            padding-top: rem(18px);
            @include font-size(24px);
        }
    }

</style>