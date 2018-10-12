<template>
  <div id="ratings" class="ratings" ref="ratingWrapper">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="text">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="text">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="text">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :ratings="ratings" :selectType="selectType" :onlyContent="onlyContent"
                    @ratingType-select="ratingTypeSelect" @content-toggle="contentToggle"></ratingselect>

      <ul class="ratings-list">
        <li v-show="needShow(rating.rateType,rating.text)" class="rating-item border-1px"
            v-for="(rating,index) in ratings" :key="index">
          <div class="avatar">
            <img :src="rating.avatar" width="28" height="28"/>
          </div>
          <div class="content">
            <span class="name">{{rating.username}}</span>
            <div class="eval">
              <star :size="24" :score="rating.score"></star>
              <span class="deltime" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
            </div>
            <p class="text">{{rating.text}}</p>
            <div class="recommend" v-show="rating.recommend && rating.recommend.length">
              <span class="icon-thumb_up"></span>
              <span class="item" v-for="(recommend,index) in rating.recommend"
                    :key="index">{{recommend}}</span>
            </div>
            <div class="time">{{rating.rateTime | formatDate}}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Bscroll from 'better-scroll';
  import star from '../../components/star/star';
  import split from '../../components/split/split';
  import ratingselect from '../../components/ratingselect/ratingselect';
  import {formatDate} from '../../common/js/date';

  const ALL = 2;
  const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true
        // ,
        // ratingAll() {
        //   (this.seller.foods).map((food) => {
        //     return food.ratings;
        //   });
        // }
      };
    },
    created() {
      this.$http.get('/api/ratings').then((response) => {
        response = response.body;
        if (response.errors === ERR_OK) {
          this.ratings = response.data;
          this.$nextTick(() => {
            this.scroll = new Bscroll(this.$refs.ratingWrapper, {
              click: true
            });
          });
        }
      });
    },
    methods: {
      ratingTypeSelect(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      contentToggle(e) {
        this.onlyContent = e;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return this.selectType === type;
        }
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:ss');
      }
    },
    components: {
      ratingselect,
      star,
      split
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .ratings
    position: absolute
    top: 174px
    bottom: 0
    right: 0
    width: 100%
    overflow: hidden
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        padding 6px 0
        width: 137px
        text-align: center
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        @media only screen and (max-width: 321px)
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          font-size: 24px
          line-height: 28px
          color: rgb(255, 153, 0)
        .title
          margin-bottom: 8px
          font-size: 12px
          line-height: 12px
          color: rgb(7, 17, 27)
        .rank
          font-size: 10px
          line-height: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 321px)
          padding-left: 6px
        .score-wrapper
          margin-bottom: 8px
          font-size: 0
          line-height: 18px
          .text
            display: inline-block
            vertical-align: top
            margin-right: 12px
            font-size: 12px
            color: rgb(7, 17, 27)
          .star
            display: inline-block
            margin-right: 12px
          .score
            display: inline-block
            vertical-align: top
            font-size: 12px
            color: rgb(225, 153, 0)
        .delivery-wrapper
          font-size: 0
          line-height: 18px
          .text
            margin-right: 12px
            font-size: 12px
            color: rgb(7, 17, 27)
          .time
            font-size: 12px
            color: rgb(147, 153, 159)
    .ratings-list
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          flex: 1
          position: relative
          .name
            margin-bottom: 4px
            font-size: 10px
            line-height: 12px
            color: rgb(7, 17, 27)
          .eval
            margin-bottom: 6px
            font-size: 0
            .star
              display: inline-block
              margin-right: 6px
              vertical-align: top
            .deltime
              display: inline-block
              vertical-align: top
              line-height: 12px
              font-size: 10px
              font-weight: 200
              color: rgb(147, 153, 159)
          .text
            margin-bottom: 8px
            font-size: 12px
            line-height: 18px
            color: rgb(7, 17, 27)
          .recommend
            line-height: 16px
            font-size: 0
            .icon-thumb_up, .item
              display: inline-block
              margin: 0 6px 4px 0
              font-size: 9px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .item
              padding: 0 6px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              color: rgb(147, 153, 159)
          .time
            position: absolute
            top: 0
            right: 0
            line-height: 12px
            font-size: 10px
            font-weight: 200
            color: rgb(147, 153, 159)
</style>
