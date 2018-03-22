<template>
    <div class="pay">
        <template v-if="options.order_status == 1">
            <div>需支付
                <span>¥</span>
                <span>{{options.pay_amount}}</span>
            </div>
            <div class="double">
                <div @click="cancelorder"  :data-api="options.apiCancel">取消订单</div>
                <div @click="goPay">去支付</div>
            </div>
        </template>
        <template v-if="options.order_status == 2">
            <div>需支付
                <span>¥</span>
                <span>{{options.pay_amount}}</span>
            </div>
            <!-- <div class="cancel">已取消</div> -->
        </template>
        <template v-if="options.order_status == 3">
            <template v-if="options.type == 'recharge'">
                <div>已支付
                    <span>¥</span>
                    <span>{{options.pay_amount}}</span>
                </div>
                <div class="cancel">处理中</div>
            </template>
            <template v-else>
                <div>已支付
                    <span>¥</span>
                    <span>{{options.pay_amount}}</span>
                </div>
                <div class="cancel">已过期</div>
            </template>
        </template>
        <template v-if="options.order_status == 4">
            <template v-if="options.type == 'recharge'">
                <div>已支付
                    <span>¥</span>
                    <span>{{options.pay_amount}}</span>
                </div>
                <div class="cancel" :data-tel="options.tel || clientTel" @click="service">联系客服</div>
            </template>
            <template v-else>
                <div>实付
                    <span>¥</span>
                    <span>{{options.pay_amount}}</span>
                </div>
                <div class="draw" v-if="!!options.ftypeAd.ftype">
                    <img src="/images/common/btn_award.png" alt=""  @click="goDraw">
                </div>
                <div class="signal" v-href="options.urlView">{{options.ticket_status == 2 ? "查看取票号" : "查看详情"}}</div>
            </template>
        </template>
        <template v-if="options.order_status == 5">
            <template v-if="options.type == 'recharge'">
                <div>实付
                    <span>¥</span>
                    <span>{{options.pay_amount}}</span>
                </div>
                <div class="draw" v-if="!!options.ftypeAd.ftype">
                    <img src="/images/common/btn_award.png" alt="" @click="goDraw">
                </div>
            </template>
            <template v-else>
                <div>已支付
                    <span>¥</span>
                    <span>{{options.pay_amount}}</span>
                </div>
                <div class="cancel" :data-tel="options.tel || clientTel" @click="service" >联系客服</div>
            </template>
        </template>
        <template v-if="options.order_status == 6">
            <div>已支付
                <span>¥</span>
                <span>{{options.pay_amount}}</span>
            </div>
            <div class="cancel">退款成功</div>
        </template>
        <template v-if="options.order_status == 7">
            <div>已支付
                <span>¥</span>
                <span>{{options.pay_amount}}</span>
            </div>
            <div class="cancel">退款失败</div>
        </template>
    </div>
</template>
<script>

import dialogManager from 'common/plugin/dialog';
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"
import {isLock, lock, unLock, bind, fire} from "lib/comp/bus"
import URL from "lib/util/URL"

export default {
    props: {
        options: null,
    },
    data() {
        return {
            clientTel: ""
        }
    },
    mounted() {
        fire("getClientTel", this)
    },
    methods: {
        cancelorder (ev) {
            const vm = this;
            dialogManager.confirm("是否确定取消订单？")
                .then(() => {
                    vm.$http.get(ev.target.dataset.api).then((res)=>{
                        dialogManager.toast(res['msg'])
                            .then(() => {
                                if(browser.WX){
                                    window.location.reload();
                                }else{
                                    webBridge.reload();
                                }
                            });
                    }).catch((res)=> {
                        console.error(res);
                    })
                });
        },
        service(ev) {
            if(!!ev.target.dataset.tel) {
                window.location.href = "tel://" + ev.target.dataset.tel;
            }
        },
        goPay(){
            let params = URL.parse(this.options.urlPay);
            if(browser.WX){
                location.assign(this.options.urlPay);
            }else if(params.queryJson.itemname == "recharge"){
                params.queryJson.bankId = "WECHAT_PLUGIN";
                this.wxAppPay(params.path, params.queryJson);
            }else{
                webBridge.openUrl(this.options.urlPay,"self");
            }
        },
        wxAppPay(url, params){
            let vm = this;
            if (isLock()) return;
            lock();
            dialogManager.wait();
            vm.$http.get(url, {
                params: params
            }).then((res) => {
                let data = JSON.parse(res.data.response);
                unLock();
                dialogManager.closeWait();
                webBridge.launchAppPay(data, rv=>{
                    if(rv.code != 0){
                        dialogManager.toast(rv.msg);
                        return;
                    }
                    webBridge.openUrl(vm.options.urlSuccess, "self");
                })

            }).catch((res) => {
                unLock();
                dialogManager.closeWait();
                dialogManager.toast(res["msg"]);
                console.error(res["msg"]);
            })
        },
        goDraw() {
            const vm = this;
            if(!vm.options.ftypeAd.params.urlActview || !vm.options.ftypeAd.params) {
                if(!!vm.options.ftypeAd.url) {
                    !!browser.WX ? location.assign(vm.options.ftypeAd.url) : webBridge.openUrl(vm.options.ftypeAd.url);
                    return;
                }
            }

            if(vm.options.ftypeAd.type != 'act_play') return;
            if(isLock()) return;
            lock();
            dialogManager.wait();
            this.$http.get(vm.options.ftypeAd.urlActview, {
                params: {
                    ftype: vm.options.ftypeAd.ftype,
                    starttime: '',
                    endtime: '',
                    rt: JSON.parse(vm.options.ftypeAd.params)["r"],
                    url: JSON.parse(vm.options.ftypeAd.params)["url"],
                    id: JSON.parse(vm.options.ftypeAd.params)["id"],
                    "is_login": JSON.parse(vm.options.ftypeAd.params)["is_login"],
                    "biz_code": JSON.parse(vm.options.ftypeAd.params)["biz_code"]
                }
            }).then(res => {
                unLock();
                dialogManager.closeWait();
                this.$emit("close");
                if(!!res) {
                    !!browser.WX ? location.assign(res["data"]) : webBridge.openUrl(res["data"]);
                }

            }).catch(res => {
                unLock();
                dialogManager.closeWait();
                dialogManager.toast(res["msg"]);
            })
        }
    },
    watch: {
        options(val){
            this.options = val;
        }
    }
}
</script>
