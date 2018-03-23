<template>
  <div class="counter-warp">
    <p>Vuex counter：{{ count }}</p>
    <p>
      <button @click="increment">+</button>
      <button @click="decrement">-</button>
    </p>

    <div class="home" @click="back">去往首页</div>
  </div>
</template>

<script>
// Use Vuex
import store from './store'

export default {
  computed: {
    count () {
      return store.state.count
    }
  },
  methods: {
    increment () {
      store.commit('increment')
    },
    decrement () {
      store.commit('decrement')
    },
    back () {
      wx.navigateBack()
    }
  },
  created () {

  },

  onLoad ()　{
    console.log(this.$root.$mp)
  },

  onShow () {
    this.$http.get('https://easy-mock.com/mock/5a4c3fee6b0cfc253a3f7e9d/example/count')
      .then((res) => {
        console.log(res)
      })
  }
}

</script>
<style>
.counter-warp {
  text-align: center;
  margin-top: 100px;
}
.home {
  display: inline-block;
  margin: 100px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}

</style>
