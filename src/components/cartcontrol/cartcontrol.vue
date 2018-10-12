<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart(event) {
        // if (!event._constructed) {
        //   return;
        // }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        this.$emit('cart-add', event.target);
      },
      decreaseCart(event) {
        // if (!event._constructed) {
        //   return;
        // }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 3px
      transition: all .4s linear
      opacity: 1
      .inner
        display: inline-block
        font-size: 24px
        color: rgb(0, 160, 240)
        line-height: 24px
        transition: all .5s linear
        transform: rotate(0)
      &.move-leave-active
        opacity: 1
        transform: translate3d(0, 0, 0)
        .inner // 进入前和离开后inner的旋转角度
          transform: rotate(-180deg)
      &.move-enter, .move-leave-to /* .fade-leave-active below version 2.1.8 */
        opacity: 0;
        transform: translate3d(24px, 0, 0)
        .inner // 进入前和离开后inner的旋转角度
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      padding-top: 3px
      text-align: center
      width: 24px
      font-size: 10px
      line-height: 24px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 3px
      font-size: 24px
      color: rgb(0, 160, 240)
      line-height: 24px

</style>
