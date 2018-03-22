<template>
    <div class="m-count scrolling" @click="checkLogin">
        <card-message :options="options.data.arrAwardAd" :text="options.data.arrAwardAd ? options.data.arrAwardAd.title : ''" :isTop="true"></card-message>
        <cinema-location
        :name="cinema.cinema_name"
        :address="cinema.cinema_address"
        :can-select="canSelectCinema"
        @change="showSelectCinema"
        ></cinema-location>
        <select-cinema v-if="options.data.isSelectCinema != 1" :show.sync="isShowSelectCinema" :isShowCloseBtn="isShowCloseBtn" @select="selectCinema" :callback-url="options.data.callbackUrl" :url="options.href.apiCinemalist"/>
        <bind-card-form
            :options="options"
            :mobile="'' + options.data.mobile"
            :cinemaCode="options.data.cinema.cinema_code"
            :apiSubmit="options.href.apiBindcard"
            :apiMessage="options.href.apiSendsms"
            :urlTarget="options.href.urlMyindex"
            :hasPrizeChance="hasPrizeChance"
            :paramsForGetPrize="options.data.arrAwardAd"
        ></bind-card-form>
        <bind-mobile :show.sync="isBindMobileShow" @onBindSuccess="bindMobileSuccess" :url="hrefs.apiSendsmsmobile" :subUrl="hrefs.apiBindmobile"></bind-mobile>
    </div>
</template>

<script>
import bindCardForm from "common/components/bindMemberCardForm";
import cinemaLocation from "common/components/cinemaLocation";
import query from "lib/json/query";
import cardMessage from "common/components/cardMessage";
import browser from "lib/util/browser"

const urlParams  = query.parse(location.search.slice(1));

export default {
    props: {
        options: Object
    },
    data() {
        // this.options.data.bindMobile = 0
        let bool = this.options.data.isSelectCinema == 3 && !urlParams.ci;
        return {
            cinema: this.options.data.cinema,
            canSelectCinema: this.options.data.isSelectCinema != 1,
            isShowSelectCinema: bool,
            isShowCloseBtn: !bool,
            hasPrizeChance: options.data.arrAwardAd && options.data.arrAwardAd.id,
            hrefs: this.options.href,
            isBindMobileShow: false
        }
    },
    created() {
        this.options.data.isSelectCinema == 3
            && urlParams && urlParams.ci && localStorage.setItem("memberCard.cinema", urlParams.ci);
    },
    mounted() {
        this.checkLogin();
    },
    components: {
        bindCardForm,
        cinemaLocation,
        cardMessage
    },
    methods: {
        showSelectCinema() {
            this.isShowCloseBtn = true;
            this.isShowSelectCinema = true;
        },
        selectCinema(opt) {
            opt && (this.cinema = opt)
        },
        checkLogin() {
            if (this.options.data.bindMobile == 0 && browser.WX) {
                this.isBindMobileShow = true;
            }
        },
        bindMobileSuccess() {
            this.options.data.bindMobile = 1;
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";
.m-count {
    @include display-flex();
    @include flex-direction(column);
    height: 100vh;
}
</style>

<style lang="scss">
@import "../../common/style/mixin";
html,
body {
    height: 100%;
}
</style>

