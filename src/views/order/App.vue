<template>
    <div class="m-views-order">
            <app-time :time="this.time"></app-time>
            <app-ticket :details="options.orderDetails"></app-ticket>
            <app-content :options="options"></app-content>
    </div>
</template>

<script>
import appTime from './Time';
import appTicket from './Ticket';
import appContent from './Content';

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
       appTime,
       appTicket,
       appContent
    },
    mounted() {
        window.addEventListener('pageshow', e => {
            if (e.persisted) {
                location.reload();
            }
        });
    }
}
</script>
<style lang="scss">
html, body {
    height: 100%;
}
.m-views-order {
    width: 100%;
}
</style>
