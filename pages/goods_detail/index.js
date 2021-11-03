// pages/goods_detail/index.js
import regeneratorRuntime from '../../lib/runtime/runtime'
// 点击 加入购物车
// 1. 先绑定点击事件
// 2. 获取缓存中的购物车数据 数组格式
// 3. 先判断当前的商品是否已经存在于购物车
// 4. 已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组填充回缓存中
// 5. 不存在于购物车数组中 直接给购物车数组添加一个新元素即可 带上一个购买数量属性
// 6. 弹出用户提示
// 商品收藏
// 1 页面onshow时 加载缓存中商品收藏的数据
// 2 判断当前商品是不是被收藏的
//  1 是 改变页面图标
//  2 不是
// 3 点击商品收藏按钮
//  1 判断该商品是否存在于缓存数组中
//  2 已经存在 把该商品删除掉 
//  3 没有存在 把该商品添加到收藏数组中 存入到缓存中
import {
  request
} from "../../request/index";
import {showToast} from '../../utils/asyncWx';
Page({
  data: {
    goodsObj: {},
    isCollect:false
  },
  GoodsInfo: [],

  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    // 参数：商品id
    const {
      goods_id
    } = options;
    this.getGoodsDetail(goods_id);


  },
  // 获取该商品详情信息
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: "/goods/detail",
      data: {
        goods_id
      }
    })
    this.GoodsInfo = goodsObj;
    //  1 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || [];
    //  2 判断当前商品是否被收藏
    const goodsId = this.GoodsInfo.goods_id;
    
    collect = collect.filter(v => v);
    let isCollect = false;
    if(collect.findIndex(v => v.goods_id ===goodsId) !==-1){
      isCollect = true;
    }
    console.log("isCollect",isCollect);
    console.log("collect",collect);
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        //    iphone部分手机不识别webp图片格式
        //    最好找后台修改
        //    前台自己改也行 确保后台存在1.webp => 1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })

  },
  // 点击轮播图 放大预览
  handlePreviewImage(e) {
    const urls = this.data.goodsObj.pics.map((v) => v.pics_big);
    const {
      index
    } = e.currentTarget.dataset;
    wx.previewImage({
      urls: urls,
      current: urls[index]
    })
  },
  //  点击加入购物车
  handleCartAdd() {
    console.log("加入购物车")
    //1. 获取缓存中的购物车数组 cart
    let cart = wx.getStorageSync("cart") || [];
    // 2.判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index === -1) {
      // 不存在 第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      console.log(this.GoodsInfo);
      cart.push(this.GoodsInfo);
    } else {
      //  已经存在购物车数据 执行num++
      cart[index].num++;
      console.log("cart" + cart);
      console.log(cart[index].num);
      console.log(this.GoodsInfo);
    }
    // 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    // 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // 防止用户疯狂点击按钮 要1.5s后
      mask: true
    })
  },
  // 点击商品收藏图标
  handleCollect(){
    let isCollect = this.isCollect;
    // 1 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect')||[];
    collect = collect.filter(v => v);
    // 2 判断该商品是否被收藏过
    let index =collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    console.log(index);
    // 3 当index!=-1 表示已经收藏过
    if(index!==-1){
      // 能找到 已经收藏过了 在数组中删除该商品
      collect.splice(index,1);
      isCollect = false; 
      showToast({title:"取消成功",icon:"success",duration:1000});

    }else{
      // 没有收藏过
      collect.push(this.GoodsInfo);
      showToast({title:'收藏成功',icon:'success',duration:1000})
      isCollect = true;
    }
    // 4 把数组存入到缓存中
    wx.setStorageSync("collect",collect);
    this.setData({
      isCollect
    })
  }

})
