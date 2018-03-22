<template>
    <div class="layout-1">
        <div class="film">{{details.film_name}}<span>{{details.show_language}}{{details.show_type_name}}</span></div>
        <div class="date">{{details.show_time}}</div>
        <div class="cinema">{{details.cinema_name}} {{details.hall_name}}</div>
        <div class="seat">
            <template v-for="item in details.seats">
                <div><span>{{item.seatrow}}</span>排<span>{{item.seatcol}}</span>座</div>
            </template>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["details"],
        data() {return {}}
    }
</script>
<style lang="scss" scoped>
@import "../../common/style/mixin";

.m-views-order {
    .layout-1 {
        padding: rem(60px 0 40px 24px);
        .film {
            @include font-size(36px);
            span {
                margin-left: rem(20px);
                @include font-size(24px);
            }
        }
        .date {
            margin-top: rem(48px);
            font-size: rem(28px);
        }
        .cinema {
            margin-top: rem(20px);
            font-size: rem(28px);
        }
        .seat {
            @include display-flex(flex);
            
            >div {
                @include display-flex(flex);
                @include align-items(baseline);
                &:after {
                    content: "，";
                } 
            }
            >div:last-child:after {
                content: '';
            }
            margin-top: rem(20px);
            font-size: rem(24px);
            span {
                font-size: rem(28px);
            }
        }
    }   
}
</style>