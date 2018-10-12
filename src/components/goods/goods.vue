<template>
  <div id="goods" class="goods">
    <div class="menu-wrapper" ref="meunWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="menu-item border-1px"
            :class="{'current':currentIndex===index}" @click="selectMenu(index)">
            <span class="text">
              <span v-show="item.type>0" :class="classMap" class="icon"></span>{{item.name}}
            </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="good-list goods-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="(food,foodIndex) in item.foods" :key="foodIndex"
                class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.icon"/>
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">¥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrl-wrapper">
                  <cartcontrol @cart-add="cartAdd" :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <food :food="selectedFood" ref="food" v-on:cart-add="cartAdd"></food>
    <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice"
              :min-price="seller.minPrice"></shopcart>
  </div>
</template>

<script type="text/ecmascript-6">
  import Bscroll from 'better-scroll';
  import cartcontrol from '../../components/cartcontrol/cartcontrol';
  import shopcart from '../../components/shopcart/shopcart';
  import food from '../../components/food/food';

  const ERR_OK = 0;
  export default {
    props: {
      seller: Object
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (height1 <= this.scrollY && height2 > this.scrollY)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$http.get('api/goods').then((response) => {
        response = response.body;
        if (response.errors === ERR_OK) {
          this.goods = response.data;
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      });
    },
    components: {
      cartcontrol,
      shopcart,
      food
    },
    methods: {
      cartAdd(target) {
        // 体验优化，异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      },
      selectMenu(index) {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('goods-list-hook');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      },
      _initScroll() {
        this.meunScroll = new Bscroll(this.$refs.meunWrapper, {
          click: true
        });
        this.foodsScroll = new Bscroll(this.$refs.foodsWrapper, {
          probeType: 3,
          click: true
        });
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('goods-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 48px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background-color: #f3f5f7
      .menu-item
        display: table
        padding: 0 12px
        height: 54px
        width: 56px
        line-height: 14px
        &.current
          position: relative
          margin-top: -1px
          z-index: 10
          font-weight: 700
          background-color: #fff
          .text
            border-none()
        .text
          display: table-cell
          width: 56px
          font-size: 12px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          .icon
            display: inline-block
            margin-right: 2px
            vertical-align: top
            width: 12px;
            height: 12px;
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_3')
            &.discount
              bg-image('discount_3')
            &.guarantee
              bg-image('guarantee_3')
            &.invoice
              bg-image('invoice_3')
            &.special
              bg-image('special_3')
    .foods-wrapper
      flex: 1
      .title
        height: 26px
        padding-left: 14px
        border-left: 2px solid #d9dde1
        background-color: #f3f5f7
        font-size: 12px
        line-height: 26px
        color: rgb(147, 153, 159)
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin-top: 2px
            font-size: 14px
            line-height: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            font-size: 10px
            line-height: 10px
            color: rgb(147, 153, 159)
          .desc
            margin: 8px 0
          .extra
            .count
              margin-right: 12px
          .price
            line-height: 24px
            font-weight: 700
            font-size: 0
            .now
              font-size: 14px
              color: rgb(240, 20, 20)
              margin-right: 8px
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrl-wrapper
            position: absolute
            right: 0
            bottom: 18px
</style>
