<template>
<div class="m-count scrolling" :class="{'no-scroll': !cards.length}" @click="checkLogin">
    <cinema-location
        :name="cinema.cinema_name"
        :address="cinema.cinema_address"
        :can-select="canSelectCinema"
        @change="showSelectCinema"
    ></cinema-location>
    <select-cinema v-if="options.data.isSelectCinema != 1" :show.sync="isShowSelectCinema" :isShowCloseBtn="isShowCloseBtn" @select="selectCinema" :callback-url="options.data.callbackUrl" :url="options.href.apiCinemalist"/>
    <card-list
        :canOpen="canOpen"
        :cards="cards"
        :cinema="cinema"
        :urlBindCard="options.href.urlBind"
    ></card-list>
    <bind-mobile :show.sync="isBindMobileShow" @onBindSuccess="bindMobileSuccess" :url="hrefs.apiSendsmsmobile" :subUrl="hrefs.apiBindmobile"></bind-mobile>
</div>
</template>

<script>
import cinemaLocation from "common/components/cinemaLocation";
import cardList from "./List.vue";
import viewport from 'lib/comp/viewport';
import query from "lib/json/query";
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"
import storageMessager from "lib/util/storageMessager"
import {bind} from "lib/comp/bus"

const urlParams  = query.parse(location.search.slice(1));

function pushHistory() {
    var state = {title: "title", url: "#"};
    window.history.pushState(state, state.title, state.url);
}
if(browser.WX){
    if (viewport.getDeviceType() != "iphone") {
        pushHistory();
        window.addEventListener("popstate", function(ev) {
            history.go(-1);
            sessionStorage.setItem('androidback', true);
        });
    }

}else{
    let isOpenVip = storageMessager.getItem("openVip",0.5);
    if(isOpenVip){
        storageMessager.send("openVip", "");
        webBridge.onBackPressed = function () {
            webBridge.close(4);
            var isIPhone = navigator.appVersion.match(/iphone/gi);
            if (isIPhone) {
                return "turnBackSucceed";
            }
        }
    }
}
export default {
    props: {
        options: {
            type: Object,
            default: {}
        }
    },
    data() {
        let bool = this.options.data.isSelectCinema == 3 && !urlParams.ci
        return {
            cards: this.options.data.cards || [],
            cinema: this.options.data.cinema,
            canSelectCinema: this.options.data.isSelectCinema != 1,
            isShowSelectCinema: bool,
            isShowCloseBtn: !bool,
            hrefs: this.options.href,
            isBindMobileShow: false,
            canOpen: true
        }
    },

    created() {
        this.options.data.isSelectCinema == 3
            && urlParams && (urlParams.ci != localStorage.getItem("memberCard.cinema"))
            && localStorage.setItem("memberCard.cinema", urlParams.ci || "");
        bind("cardMessage", this.handleCardMessage);
    },
    mounted() {
        this.checkLogin();
    },
    components: {
        cardList,
        cinemaLocation
    },
    methods: {
        showSelectCinema() {
            this.isShowCloseBtn = true;
            this.isShowSelectCinema = true;
        },
        selectCinema(opt) {
            opt && (this.cinema = opt);
        },
        handleCardMessage(component) {
            component.options = this.options.data.arrAwardAd;
        },
        checkLogin() {
            if (this.options.data.bindMobile == 0 && browser.WX) {
                this.isBindMobileShow = true;
                this.canOpen = false;
            }
        },
        bindMobileSuccess() {
            this.options.data.bindMobile = 1;
            this.canOpen = true;
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";
.m-count {
    height: 100%;
}
    .scrolling.no-scroll {
        overflow: hidden;
    }
</style>

<style lang="scss">
@import "../../common/style/mixin";
html,body {
    height: 100%;
}
</style>

