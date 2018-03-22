<template>
    <register ref="register" :ajax-url='ajaxUrl'  :agreement="agreement" :hide="hideClose" @close="close" @suc="suc"/>
</template>

<script>
import register from 'common/plugin/register/Content.vue'
import query from 'lib/json/query'
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"

export default {
    props: ["options"],
    components: {
        register
    },
    data () {
        return {
            ajaxUrl: this.options.href,
            agreement: this.options.data.agreement,
            hideClose: 1,
            loginSuc:JSON.parse(localStorage.getItem("loginSuc"))
        }
    },
    mounted () {
        
    },
    methods: {
        close(){
            if(browser.WX){
                history.go(-1);
            }else{
                webBridge.close();
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

