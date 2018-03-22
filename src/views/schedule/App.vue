<template>
    <div class="scrolling">
        <location :data="option"
        ></location>
        <movieSwiper :movies="options.data.films" :filmCode="options.data.film_code" :href="options.href"  :actConfig="options.data.actConfig" cardConfig="cardConfig"></movieSwiper>
    </div>
</template>
<script>
import dialogManager from 'common/plugin/dialog';
import movieSwiper from "./movieSwiper";
import location from "./location";
import {bind, fire} from "lib/comp/bus";

export default {
    props: ["options"],
    data () {
        return {
            option: {
                cinema: this.options.data.cinema,
                firstAd: !!this.options.bannerImage ? this.options.bannerImage[0] : null,
                url: this.options.href.apiCinemalist,
                callbackUrl: this.options.data.callbackUrl,
                isSelectCinema: this.options.data.isSelectCinema,
            },
            cardConfig: this.options.data.cinemaCardConf
        }
    },
    components: {
        movieSwiper,
        dialogManager,
        location
    },
    mounted () {
        const vm = this;
        bind("changeCinema", this.changeCinema);
        bind("priceShow", vm.onPriceShow.bind(vm));
    },
    methods: {
        changeCinema (opt) {
            this.location.cinema = opt;
        },
        onPriceShow() {
            fire("sendCardConfig", this.cardConfig);
        }
    }
}
</script>
