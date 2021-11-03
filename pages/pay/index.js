/* 页面加载的时候
  1.从缓存中获取购物车数据 渲染到页面中
    这些数据 checked属性为true
  2.微信支付
    1 哪些人 哪些账号可以实现微信支付
      1 企业账号
      2 企业账号小程序后台中 必须给开发者添加上白名单
        1 一个appid可以同时绑定多个开发者
        2 这些开发者可以共用appid和它的开发权限
  3. 支付按钮
    1 先判断缓存中有没有token
    2 没有 跳转到授权页面 获取token
    3 有token 创建订单 创建订单编号
    4 创建订单 获取订单编号
    5 已经完成了微信支付
    6 手动删除缓存中 已经被选中的商品
    7 删除后的购物车数据 填充回缓存中
    8 再跳转页面
  */
import {
  request,requestPayment
} from '../../request/index'
import { showToast } from '../../utils/asyncWx';
Page({
  data: {
    address: {},
    // 购物车
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //   1.获取缓存中的收获地址信息
    const address = wx.getStorageSync('address');
    // 2.获取缓存中的购物车数据 短路运算
    let cart = wx.getStorageSync("cart") || [];
    //   过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;

    let totalNum = 0;
    let totalPrice = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })

    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });

  },



  //   商品数量的编辑功能
  numChange(e) {
    const {
      opration,
      id
    } = e.currentTarget.dataset;
    let {
      cart
    } = this.data;
    console.log(opration, id);
    //  找到要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否要删除
    if (cart[index].num === 1 && opration === -1) {
      wx.showModal({
        title: '提示',
        content: '您是否要删除购物车中该商品？',
        // 要使用箭头函数保证this
        success: (res) => {
          if (res.confirm) {
            cart.splice(index, 1);
            this.setCart(cart);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    //  进行修改数量
    else {
      cart[index].num += opration
    }

    // 设置回缓存和data中
    this.setCart(cart);
  },
  // 点击支付
  async allPlay() {
    try{
    //  1 判断缓存中有没有token
    const token = wx.getStorageSync('token');
    //     2 如果没有登录 就跳转到权限页面
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return;
    }
    // 3 创建订单
    // 3.1 准备 请求头参数
    // const header = {
    //   Authorization: token
    // };
    // 3.2 准备 请求体参数
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address.all;
    const cart = this.data.cart;
    let goods = [];
    cart.forEach(v => goods.push({
      goods_id: v.goods_id,
      goods_number: v.num,
      goods_price: v.goods_price
    }))
    const orderParams = {
      order_price,
      consignee_addr,
      goods
    }
    //  4 准备发送请求 创建订单
    const {
      order_number
    } = await request({
      url: "/my/orders/create",
      method: "post",
      data: orderParams,
    })
    // 5 发起预支付的接口
    const pay = await request({
      url: "/my/orders/req_unifiedorder",
      method: "post",

      data: {
        order_number
      }
    })
    // 6 发起微信支付

   await requestPayment(pay);
    // 7 查询后台 订单状态
    const res = await request({url:"/my/orders/chkOrder",method:"post",data:{order_number} })
    let newCart = wx.getStorageSync("cart");
    newCart = newCart.filter(v=>!v.checked);
    wx.setStorageSync('cart', newCart);
    // 8 支付成功 跳转到订单页面
    wx.navigateTo({
      url: '/pages/order/index',
    })
    await showToast({title:"支付成功",icon:"success",duration:1000})
  }
  catch(error){
   console.log(error);
   await showToast({title:"支付失败",icon:"error",duration:1000})
  }
  }
})

