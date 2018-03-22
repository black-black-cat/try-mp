<template>
    <div class="m-count m-views-seats">
        <seats-header :options="options" ref="header"></seats-header>

        <seats-content
            v-if="hasSeat"
            :options="options"
            :hrefs="hrefs"
            :selection="selection"
            :onceFlag="onceFlag"
            @changeSelected="select"
            @mySeatsInit="setMySeats"
            @updateOnceFlag="updateOnceFlag"
            ref="seatsContent">
        </seats-content>

        <div class="margin-bottom"></div>
        <seats-footer
            :options="options"
            :selection="selection"
            :selectionWithOther="selectionWithOther"
            :mySeats="mySeats"
            :hrefs="hrefs"
            :onceFlag="onceFlag"
            @changeSelected="cancelSeat"
            @recommend="recommend"
            @updateOnceFlag="updateOnceFlag"
            ref="footer"
        >
            <ad :data="ad" slot="ad"></ad>
        </seats-footer>
    </div>
</template>

<script>
import seatsHeader from "./header";
import seatsContent from "./seatsContent";
import seatsFooter from "./footer";
import ad from "./ad";
import dialogManager from "common/plugin/dialog";

export default {
    props: {
        options: {
            type: Object
        },
        hrefs: {
            type: Object
        },
        ads: {
            type: Object
        }
    },
    data() {
        return {
            seats: this.options.seats.seats,
            selection: [],
            selectionWithOther: [],
            mySeats: [],
            onceFlag: true
        }
    },
    computed: {
        sortedSeats() {
            const vm = this;
            return vm.mySeats.reduce((memo, item, i) => {
                return memo.concat(item.cols);
            }, []);
        },
        ad() {
            let arr = this.ads;
            return arr && arr.length ? arr[0] : "";
        },
        hasSeat() {
            const seats = this.options.seats
            return seats
                && seats.seats
                && seats.seats.length
        },
        // selectionWithOther() {
        //     return vm.sortedSeats.filter((item) => item.status == 0)
        // }
    },
    watch: {
        selection(val) {
            // this.setContentHeight();
        }
    },
    mounted() {
        this.alertNoSeat();
    },
    components: {
        seatsHeader,
        seatsContent,
        seatsFooter,
        ad
    },
    methods: {
        select() {
            const vm = this;
            let filtered = vm.sortedSeats.filter(function(item, i) {
                return item.selected;
            });
            if (filtered.length > 4) {
                return;
            }
            vm.selection = filtered;
            vm.selectionWithOther = vm.sortedSeats.filter(function(item, i) {
                return item.selected || item.status == 0;
            });
        },
        setMySeats(data) {
            if (data && data.length) {
                this.mySeats = data;
            }
        },
        cancelSeat(seatCell) {
            this.$refs.seatsContent.cancelSeat(seatCell);
        },
        alertNoSeat() {
            const vm = this;
            if (!vm.hasSeat) {
                dialogManager.alert("该场次暂时不可锁座").then(function() {
                    history.go(-1);
                });
            }
        },
        setContentHeight() {
            const vm = this;
            const headerEl = vm.$refs.header.$el;
            const footerEl = vm.$refs.footer.$el;
            const contentEl = vm.$refs.seatsContent.$el;

            let h = window.innerHeight - headerEl.offsetHeight - footerEl.offsetHeight;
            contentEl.style.height = h + "px";

        },
        recommend(data) {
            this.$refs.seatsContent.recommend(data)
        },
        updateOnceFlag(bool) {
            this.onceFlag = bool;
        }
    }

}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";
html,
body {
    height: 100%
}

body {
    @include display-flex();
    @include flex-direction(column);
}

.m-count,
.scrolling {
    height: 100%;
}

.m-count {
    @include display-flex();
    @include flex-direction(column);

    .ad-container {
        padding-top: 0;
    }
}

.header {
    position: fixed;
    z-index: 10;
    left: 0;
    top: 0;
    width: 100%;
}

.seats-content {
    margin-top: r(206);
}

.margin-bottom {
    margin-bottom: r(260);
}

.bottom-section {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    @include box-sizing(border-box);
}
</style>
<style lang="scss">
html,
body {
    height: 100%;
}
</style>

