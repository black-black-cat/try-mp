<template>
    <div>
        <register :show.sync='toRegister' :ajax-url='ajaxUrl' :data="registerData" :agreement="agreement" @findPwdSuc="findPwdSuc"/>
        <find-pwd :show.sync='toFindPwd' :ajax-url='ajaxUrl' :data="fwdData" :agreement="agreement" ></find-pwd>
    </div>
</template>
<script>
    import popup from 'lib/layer/popup'
    import login from './Content.vue'
    import {bind, bus, get} from 'lib/comp/bus'
    import dialogManager from 'common/plugin/dialog'
    import query from 'lib/json/query'
    import browser from "lib/util/browser"
    import webBridge from "common/utils/webBridge"
    import register from "common/plugin/register"
    import findPwd from "common/plugin/findPwd"
    import storageMessager from "lib/util/storageMessager"

    export default {
        props: {
            show: Boolean,
            ajaxUrl: null,
            agreement: Object
        },
        data () {
            return {
                m_login: null, 
                toRegister: false, 
                toFindPwd: false,
                registerData:null,
                fwdData: null           
            }
        },
        components:{
            register,
            findPwd
        },
        mounted () {
            const self = this;
            self.m_login = popup("<login @close='close' @suc='suc' :ajax-url='ajaxUrl' ref='toLogin' @reg='toReg' @pwd='findPwd' :agreement='agreement'/>", {
                option: {
                    animate: {
                        name: "slide-bottom"
                    },
                    absolute: true,
                    /*overlay:{
                        color:'#fff',
                        opacity:1
                    }*/
                },
                popup: {
                    data () {
                        return {
                            ajaxUrl: self.ajaxUrl,
                            agreement: self.agreement || {} 
                        }
                    },
                    components: {
                        login,                        
                    },
                    methods: {
                        close () {   
                            self.m_login.hide();           
                            self.$emit("cancel");                       
                        },
                        suc(){
                            self.m_login.hide(); 
                            storageMessager.send("isLogin", true);
                            // sessionStorage.setItem("isLogin", true);
                            self.$emit("loginSuc");                                                                                   
                        },
                        toReg(data){
                            self.registerData = data;
                            self.toRegister = true;                            
                        },
                        findPwd(data){
                            self.fwdData = data;
                            self.toFindPwd = true;
                        }
                    },
                    created(){
                        bus.$on(get("registerSuc"), data=>{
                            self.toRegister = false;
                        });
                    } 
                    
                }
            });
            self.m_login.setFullScreen(true, true);
            self.m_login.setPosition(0, 0, 0, 0);
            self.show && self.m_login.show();
            bus.$once(self.m_login.get("show"), self.m_login.popup.$refs.toLogin.init);
            bind(self.m_login.get("hide"), self.changeShow);
        },
        methods: {
            changeShow () {
                this.$emit('update:show', false);
                //父模块绑定 :show.sync=""
            },
            findPwdSuc(){
                self.toFindPwd = false;
            }  
        },
        watch: {
            show (bool) {
                if(bool) {
                    this.m_login.show();
                }else{
                    this.m_login.hide();
                }
            }
        },               
    }
</script>