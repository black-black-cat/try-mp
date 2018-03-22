<template>
    <div class="m-count">
        <app-header :class="{fix: isFix}" :user="user"></app-header>
        <div class="scrolling" @scroll="scroll">
            <app-content :content="content"></app-content>
        </div>
        <app-nav-items v-if="options.bottomNavItems">
            <app-item icon="home" :href="options.bottomNavItems[0]" name="推荐"></app-item>
            <app-item icon="find" :href="options.bottomNavItems[1]" name="发现"></app-item>
            <app-item icon="store" :href="options.bottomNavItems[2]" name="商城"></app-item>
            <app-item icon="me" selected="true" name="我的"></app-item>
        </app-nav-items>
        <bind-mobile :show.sync="show" @onBindSuccess="suc" :url="options.href.apiSendsmsmobile" :subUrl="options.href.apiBindmobile"/>
    </div>
</template>

<script>
import appHeader from './Header.vue'
import appContent from './Content.vue'
import { bind, get, bus } from  'lib/comp/bus'
import viewport from 'lib/comp/viewport'
import browser from "lib/util/browser";
import webBridge from "common/utils/webBridge";

let morePop, cardPop;

function pushHistory() {
    var state = {title: "title", url: "#"};
    window.history.pushState(state, state.title, state.url);
}
function onBack (ev) {  //popstate监听返回按钮   
    if(morePop && morePop.isShow){
        morePop.hide();
        pushHistory();
        return;
    }
    if(cardPop && cardPop.isShow){
        cardPop.hide();
        pushHistory();
        return;
    }
    !!browser.WX ? window.history.go(-1) : webBridge.close();
}
webBridge.onBackPressed = function () {
    onBack();
    var isIPhone = navigator.appVersion.match(/iphone/gi);
    if (isIPhone) {
        return "turnBackSucceed";
    }
}
pushHistory();
window.addEventListener("popstate", onBack);

export default {
    props: ["options", "proxy"],
    data () {
        return {
            show: false,
            isFix: false,
            height: 304 * viewport.rem() / 75,
            user: {
                data: this.options.data.user,
                url: this.options.href.apiCinemalist,
                callbackUrl: this.options.data.callbackUrl,
                bindMobile: this.options.data.bindMobile,
                nav: this.options.navItems,
                cinema: {cinema_name: this.options.data.cinema.cinema_name},
                isSelectCinema: this.options.data.isSelectCinema,
                urlSettings: this.options.href.urlSettings
            },
            content: {
                ad: this.options.data.arrAd || [],
                arrPromo: (this.options.data.arrPromo && this.options.data.arrPromo.length > 0) ? this.options.data.arrPromo : null,
                cards: this.options.data.cards,
                href: this.options.href,
                bindMobile: this.options.data.bindMobile,
                cinemaCode: this.options.data.cinema_code,
                user: this.options.data.user,
                cinemaMode: this.options.data.isSelectCinema,
                cardConfig: this.options.data.cinemaCardConf || {}
            },
            isLogin: this.options.data.is_login,
        }
    },
    components: {
        appHeader,
        appContent
    },
    created() {
        bind("cardMessage", this.handleCardMessage);
        bind("back", (data) => {
            if(data.morePop) morePop = data.morePop;
            if(data.cardPop) cardPop = data.cardPop;
        });
    },
    mounted () {
        window.addEventListener("scroll", this.scroll);
        if(this.options.data.bindMobile === 0){
            this.open();
        }
        bind("mobile", this.open);
        bind("selectCinema", this.selectCinema);        
    },
    methods: {
        open () {
            this.show = true;
        },
        scroll () {
            this.isFix = window.scrollY > this.height;
        },
        suc () {
            this.user.bindMobile = 1;
            this.content.bindMobile = 1;
        },
        selectCinema (opt) {
            this.user.cinema = opt;
        },
        handleCardMessage(cardMessage) {
            cardMessage.options = this.options.data.arrCardOpen;
            cardMessage.options_2 = this.options.data.arrCardBind;
        }
    }
}

</script>

<style lang="scss">
    @import '../../common/style/mixin';
</style>
