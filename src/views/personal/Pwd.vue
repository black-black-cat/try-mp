<template>
<div class="m-pwd">
    <div class="title vh-center">请输入密码</div>
    <div class="input-group vh-center">
        <input type="password" v-model="text" :style="{top: top}" @focus="focus" @blur="blur" class="key-input"/>
        <!-- <span class="item vh-center" v-for="i in 6">
            <i class="full-fill" v-if="!!pwd[i-1]"></i> -->
            <!-- {{pwd[i-1]}} -->
        <!-- </span> -->
    </div>
</div>
</template>
<script>
    import dialogManager from 'common/plugin/dialog'
    import base64 from 'lib/str/base64'
    import browser from "lib/util/browser"
    import webBridge from "common/utils/webBridge"

    export default {
        props: ["option"],
        data () {
            return {
                text: "",
                top: "auto"
            }
        },
        mounted () {
            this.$message(this.message);
        },
        computed: {
            pwd () {
                const arr = ["", "", "", "", "", ""];
                if(this.text.length > 6){
                    this.text = this.text.substr(0, 6);
                }
                this.text.split("").forEach((v, index) => arr[index] = v);
                return arr;
            }
        },
        methods: {
            message (opt) {
                if(this.text.length === 0){
                    dialogManager.toast("请输入密码！");
                }else if(opt.type === "ok"){
                    dialogManager.wait();
                    this.$http.post(this.option.url, Object.assign({}, this.option.data, {password: base64.encode(this.text)}))
                        .then(res => {
                            dialogManager.closeWait();                            
                            if(this.option.location){
                                if(browser.WX){
                                    location.href = this.option.location;
                                }else{
                                    webBridge.openUrl(this.option.location);
                                }                                
                            }else{
                                dialogManager.alert("当前会员卡余额为 ¥" + res.data.balance);
                            }
                            this.$emit("close");
                        }).catch(res => {
                            dialogManager.alert(res.msg);
                    });
                }
            },
            focus () {
                //this.top = "-1000px";
            },
            blur () {
                //this.top = "auto";
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../common/style/mixin";
    .m-pwd{
        .title{
            text-align: center;
            padding-top: rem(55px);
            @include font-size(30px);
        }
        .input-group{
            padding: rem(40px 0 20px);
            position: relative;
        }
        .item{
            @include wh(82px);
            @include box-sizing;
            margin-right: -1px;
            @include font-size(30px);
        }
        .key-input{
            @include wh(81px * 6, 42px);
            padding: rem(20px 0);
            font-size: rem(60px);
            line-height: normal;
            letter-spacing: rem(10px);
            //@include left_center;
            //opacity: 0;
        }
        .full-fill {
            @include wh(22px);
            @include radius(100%);
        }
    }
</style>