<template>
  <div id="seller" class="seller" ref="sellerWrapper">
    <div class="seller-content">
      <div class="overview">
        <h1>{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="rating-count">({{seller.ratingCount}})</span>
          <span class="sell-count">月售({{seller.sellCount}})单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="notice-wapper">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul class="supports" v-show="seller.supports && seller.supports.length">
          <li class="supports-item border-1px" v-for="(support,index) in seller.supports" :key="index">
            <span class="icon" :class="classMap[support.type]"></span>
            <span class="text">{{support.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(pic,index) in seller.pics" :key="index">
              <img :src="pic" width="120" height="90"/>
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="border-1px">商家信息</h1>
        <div class="info-item border-1px" v-for="(info,index) in seller.infos" :key="index">
          {{info}}
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Bscroll from 'better-scroll';
  import {saveToLoad, loadFormLocal} from '../../common/js/store';
  import star from '../../components/star/star';
  import split from '../../components/split/split';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        favorite: (() => {
          return loadFormLocal(this.seller.id, 'favorite', false);
        })()
      };
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$nextTick(() => {
        this._initPicScroll();
        this._initScroll();
      });
    },
    watch: {
      'seller'() {
        this._initPicScroll();
        this._initScroll();
      }
    },
    methods: {
      toggleFavorite(event) {
        if (!event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        saveToLoad(this.seller.id, 'favorite', this.favorite);
      },
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new Bscroll(this.$refs.sellerWrapper, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      _initPicScroll() {
        if (this.seller.pics) {
          let picWidth = 120;
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.length - margin;
          this.$refs.picList.style.width = width + 'px';
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new Bscroll(this.$refs.picWrapper, {
                scrollX: true,
                eventPassthrough: 'vertical'
              });
            } else {
              this.picScroll.refresh();
            }
          });
        }
      }
    },
    components: {
      star,
      split
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .seller
    position: absolute
    top: 174px
    bottom: 0
    right: 0
    width: 100%
    overflow: hidden
    .overview
      padding: 18px
      h1
        margin-bottom: 8px
        font-size: 14px
        color: rgb(7, 17, 27)
        line-height: 14px
      .desc
        padding-bottom: 18px
        width: 100%
        font-size: 0
        border-1px(rgba(7, 17, 27, 0.1))
        .star
          display: inline-block
          vertical-align: top
          margin-right: 8px
        .rating-count, .sell-count
          display: inline-block
          vertical-align: top
          font-size: 10px
          color: rgb(77, 85, 93)
          line-height: 18px
        .rating-count
          margin-right: 12px
      .remark
        display: flex
        padding-top: 18px
        .block
          flex: 1
          text-align: center
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          &:last-child
            border-right: 0
          h2
            margin-bottom: 4px
            font-size: 10px
            line-height: 10px
            color: rgb(147, 153, 159)
          .content
            line-height: 24px
            font-weight: 200
            font-size: 10px
            color: rgb(7, 17, 27)
            .stress
              font-weight: 200
              font-size: 24px

      .favorite
        position: absolute
        right: 11px
        top: 18px
        width: 50px
        text-align: center
        font-size: 0
        .icon-favorite
          display: block
          margin-bottom: 4px
          line-height: 24px
          font-size: 24px
          color: #d4d6d9
          &.active
            color: rgb(240, 20, 20)
        .text
          line-height: 10px
          font-size: 10px
          color: rgb(77, 85, 93)
    .notice-wapper
      padding: 18px 18px 0 18px
      h1
        margin-bottom: 8px
        font-size: 14px
        color: rgb(7, 17, 27)
        line-height: 14px
      .content-wrapper
        padding: 0 12px 16px 12px
        border-1px(rgba(7, 17, 27, 0.1))
        .content
          font-size: 12px
          font-weight: 200
          line-height: 24px
          color: rgb(240, 20, 20)
      .supports
        .supports-item
          padding: 16px 12px
          border-1px(rgba(7, 17, 27, 0.1))
          &:last-child
            border-none()
          .icon
            display: inline-block
            vertical-align: top
            margin-right: 6px
            width: 16px
            height: 16px
            background-size: 16px 16px
            &.decrease
              bg-image('decrease_4')
            &.discount
              bg-image('discount_4')
            &.guarantee
              bg-image('guarantee_4')
            &.invoice
              bg-image('invoice_4')
            &.special
              bg-image('special_4')
          .text
            display: inline-block
            vertical-align: top
            font-size: 12px
            color: rgb(7, 17, 27)
            line-height: 16px
    .pics
      padding: 18px
      .title
        padding-bottom: 12px
        font-size: 14px
        color: rgb(7, 17, 27)
        line-height: 14px
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90
            &:last-child
              margin-right: 0
    .info
      padding: 18px 18px 0 18px
      h1
        display: block
        padding-bottom: 6px
        width: 100%
        font-size: 14px
        color: rgb(7, 17, 27)
        line-height: 14px
        border-1px(rgba(7, 17, 27, 0.1))
      .info-item
        padding: 16px 12px
        font-size: 12px
        line-height: 16px
        font-weight: 200
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
</style>
