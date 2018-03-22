<template>
    <div class="m-count scrolling">
        <!--<cinema-location-->
        <!--:name="cinema.cinema_name"-->
        <!--:address="cinema.cinema_address"-->
        <!--:can-select="canSelectCinema"-->
        <!--@change="showSelectCinema"-->
        <!--&gt;</cinema-location>-->
        <!--<select-cinema :show.sync="isShowSelectCinema" @select="selectCinema"/>-->
        <bind-card-form :options="options"
        :operation="'unbind'"
        :mobile="'' + options.data.mobile"
        :cinemaCode="cinemaCode"
        :cardCode="card.code"
        :cardID="card.id"
        :password="card.password"
        :apiSubmit="options.href.apiUnBindcard"
        :apiMessage="options.href.apiSendsms"
        :urlTarget="options.href.urlMyindex"
        ></bind-card-form>
    </div>
</template>

<script>
import bindCardForm from "common/components/bindMemberCardForm";
import cinemaLocation from "common/components/cinemaLocation";
import {fire} from "lib/comp/bus";

export default {
    props: {
        options: Object
    },
    data() {
        console.log(this.options);
        return {
            cinema: this.options.data.cinema,
            card: this.options.data.cardInfo,
//            canSelectCinema: true,
//            isShowSelectCinema: false
        }
    },
    computed: {
        cinemaCode() {
            let cinema = this.cinema;
            return cinema ? cinema.cinema_code : this.options.data.cardInfo
        }
    },
    components: {
        bindCardForm
//        ,cinemaLocation
    },
    methods: {
//        showSelectCinema() {
//            this.isShowSelectCinema = true;
//        },
//        selectCinema(opt) {
//            opt && fire("changeCinema", opt);
//        }
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

