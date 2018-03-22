<template>
    <div class="m-views-order">
        <app-time :time="this.time" :url="options.urlIndex"></app-time>
        <app-meal :options="options.orderDetails" :url="options.urlCoupon"></app-meal>
        <app-content :options="options"></app-content>
    </div>
</template>

<script>
import appMeal from './Meal';
import appContent from './Content';
import appTime from './Time';

export default {
    props: ["options"],
    data () {
        return {
            time: {
                create: this.options.orderDetails.create_date,
                expire: this.options.orderDetails.expire_date,
                now: this.options.nowtime
            }
        }
    },
    components: {
       appMeal,
       appContent,
       appTime
    }
}
</script>
<style lang="scss">
.m-views-order {
    width: 100%;
}
</style>
