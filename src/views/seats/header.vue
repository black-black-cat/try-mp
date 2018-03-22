<template>
    <div class="header">
        <div class="row-1">
            <div class="left" v-if="false">
                <div class="left-col-1 col-arrow">
                    <i class="arrow-left"></i>
                </div>
                <div class="left-col-2 col-text">
                    <p>上一场</p>
                </div>
            </div>
            <div class="center">
                <div class="center-row-1">
                    {{showInfo.hall_name}}
                </div>
                <div class="center-row-2">
                    {{showInfo.show_time.replace(/\:\d+$/,"")}}
                    {{showInfo.language}}
                    {{showInfo.show_type_name}}
                </div>
            </div>
            <div class="right" v-if="false">
                <div class="right-col-1 col-text">
                    <p>下一场</p>
                </div>
                <div class="right-col-2 col-arrow">
                    <i class="arrow-right"></i>
                </div>
            </div>
        </div>
        <div class="row-2">
            <div class="item" v-for="(mark, i) in marks"
            v-if="i < marks.length - 1"
            :key="i">
                <i :class="`icon-seat-mark-${i+1}`"></i><span>{{mark}}</span></div>
        </div>
    </div>
</template>

<script>
import dialogManager from "common/plugin/dialog";
export default {
    props: {
        options: null
    },
    data() {
        return {
            showInfo: this.options.show,
            hasNoPay: +this.options.hasnopay,
            marks: [
                "未选",
                "已选",
                "已售",
                "情侣",
                "最佳观影区"
            ]
        }
    },
    components: {

    },
    mounted() {
        const vm = this;
        let time = vm.showInfo.show_time;
        let timelogger = vm.handleTime(time);
        document.title = vm.options.show.film_name || document.title;
        if (!vm.hasNoPay && !timelogger.isToday) {
            dialogManager.alert(timelogger.msg);
        }
    },
    methods: {
        handleTime(str) {
            str = str.replace(/-/g, "/");
            let showTime = new Date(str);
            let showYear = showTime.getFullYear();
            let showMonth = showTime.getMonth() + 1;
            let showDate = showTime.getDate();
            let showDay = showTime.getDay();

            let nowTime = new Date();
            let nowYear = nowTime.getFullYear();
            let nowMonth = nowTime.getMonth() + 1;
            let nowDate = nowTime.getDate();

            let week = ["日", "一", "二", "三", "四", "五", "六"];
            let displayTime = "";
            let isDisplayYear = showYear != nowYear;
            let isToday = showYear === nowYear
                && showMonth === nowMonth
                && showDate === nowDate;
            displayTime += isDisplayYear ? showYear + "年" : "";
            displayTime += showMonth + "月" + showDate + "日 星期" + week[showDay];

            let msg = "您好，你选择的是" + displayTime + "的场次，请看仔细哦";
            return {
                isToday,
                msg
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/_mixin.scss";

.arrow-right {
    @include arrow-right();
}
.arrow-left {
    @include arrow-right();
    @include transform(rotate(180deg));
}

.header {

    .row-1 {
        @include display-flex();
        @include justify-content(space-between);
        @include align-items(center);
        padding-left: r(24);
        padding-right: r(24);
        min-height: r(138);

        .left,
        .right {
            @include display-flex();
        }
        .left {}
        .center {
            @include flex(1);
            text-align: center;

            .center-row-1 {
                font-size: r(32);
                padding-bottom: r(16);
            }

            .center-row-2 {
                font-size: r(26);
            }

        }
        .right {}

        .col-text {
            margin-left: r(14);
            margin-right: r(14);
        }
    }
    .row-2 {
        @include display-flex();
        @include justify-content(space-between);
        @include align-items(center);
        min-height: r(68);
        padding-left: r(24);
        padding-right: r(24);

        .item {
            @include display-flex();
            @include justify-content(space-between);
            @include align-items(center);
            >i {
                margin-right: r(10);
            }
            >span {
                display: inline-block;
                font-size: r(24);
            }
        }
    }
}
</style>
