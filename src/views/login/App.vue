<template>
    <login ref="login" :is-login="options.data.is_login" :ajax-url="options.href" :agreement="agreement" @suc='suc' @close="close" :hide='hideClose' @reg="toReg" @pwd="findPwd"></login>
</template>

<script>
import login from 'common/plugin/toLogin/Content.vue'
import query from 'lib/json/query'
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"

export default {
    props: ["options"],
    components: {
        login
    },
    data () {
        return {
            agreement: this.options.data.agreement,
            hideClose: 1,
            loginSuc:JSON.parse(localStorage.getItem("loginSuc"))
        }
    },
    mounted () {
        
    },
    methods: {
        close (){
            if(browser.WX){
                history.go(-1);
            }else{
                webBridge.close();
            } 
        },
        toReg(){
            if(browser.WX){
                location.href = this.options.href.urlRegister;
            }else{
                webBridge.openUrl(this.options.href.urlRegister, 'blank', 1);
            }
        },
        findPwd(){
            if(browser.WX){
                location.href = this.options.href.urlFindpassword;
            }else{
                webBridge.openUrl(this.options.href.urlFindpassword, 'blank',1);
            }
        },
        suc(){       
            let url =  this.loginSuc ? this.loginSuc.data : this.options.href.urlIndex;            
            if(browser.WX){
                url ? location.replace(url) : history.go(-1);
            }else{
                url ? webBridge.openUrl(url, 'self'): webBridge.close();
            }
        },
    }
}

</script>
