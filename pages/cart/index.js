// pages/cart/index.js
// 1.获取用户的收货地址
// 一、绑定点击事件
// 二、调用小程序内置api 获取用户的收获地址
// 2.页面加载完毕
// 一、获取本地存储中的地址数据
// 二、把数据设置给data中的一个变量
// 3.全选的实现 数据的展示
//   1.onShow: 获取缓存中的购物车数组
//   2.根据购物车中的商品数据进行计算 allchecked检查
//  4.总价格和总数量
//  一、都需要商品被选中才计算
//  二、遍历购物车数组判断商品是否被选中以计算价格
// 5.商品的选中
// 一、绑定change事件
// 二、获取到被修改的商品对象
// 三、商品对象的选中状态取反
// 四、重新计算全选 总价格 总数量
// 6.全选和反选
// 一、全选复选框绑定事件 change
// 二、获取data中的全选变量 allChecked
// 三、直接取反 allChecked!=allChecked;
// 四、遍历购物车数组 让里面商品选中状态跟随allChecked改变
// 五、把购物车数组和allChecked重新设置回data中 把购物车重新设置回缓存中
// 7.商品数量的编辑
// 一、+和-按钮绑定同一个点击事件 区分的关键 自定义属性
// 二、传递被点击的商品id goods_id
// 三、获取data中的购物车数组 来获取需要被修改的商品对象
// 四、当购物车的数量等于1同时用户点击 - 
// 弹窗提示 查询用户是否要删除
// 五、直接修改商品数量的数量num
// 六、重置购物车数组
// 8.点击结算
// 一、判断有没有收货地址信息
// 二、判断用户有没有选购商品
// 三、经过以上验证 跳转到支付页面
import {
  showToast
} from '../../utils/asyncWx'
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //   1.获取缓存中的收获地址信息
    const address = wx.getStorageSync('address');
    // 2.获取缓存中的购物车数据 短路运算
    const cart = wx.getStorageSync("cart") || [];
    this.setCart(cart);
    console.log("address" + address);
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    this.setData({
      address
    })


  },
  // 点击 收货地址
  handleChooseAddress() {
    wx.chooseAddress({
      success: (result) => {
        console.log("result" + result);
        wx.setStorageSync("address", result)
      }
    })
  },
  // 商品选中
  handleItemChange(e) {
    // 1.获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    console.log(goods_id);
    // 2.获取购物车数组
    let {
      cart
    } = this.data;
    // 3.找到被修改的商品数量
    let index = cart.findIndex(v => v.goods_id === goods_id)
    // 4.选中状态取反
    cart[index].checked = !cart[index].checked;
    // 5.把购物车数据重新设置回data和缓存中
    this.setCart(cart);
  },
  //   设置购物车状态同时重新计算底部工具栏的数据 全选
  setCart(cart) {
    // wx.setStorageSync("cart", cart);
    let totalPrice = 0;
    let totalNum = 0;
    let allChecked = true;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });

    wx.setStorageSync('cart', cart)
  },
  //   商品全选功能
  handleItemAllChange() {
    // 获取data中的数据 
    let {
      cart,
      allChecked
    } = this.data;
    //    修改值
    allChecked = !allChecked;
    //  循环修改cart数组里商品的选中状态
    cart.forEach(v => v.checked = allChecked)
    // 把修改后的值都填充回data中或者缓存中
    this.setCart(cart);
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
  // 点击结算
  async allPlay() {
    // 判断收货地址
    const {
      address,
      totalNum
    } = this.data;
    if (!address.userName) {
      await showToast({
        title: "您没有填写收货地址",
        icon: "error",
        duration: 1000
      });
      return;
    }
    // 判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({
        title: "您没有选购商品",
        icon: "error",
        duration: 1000
      });
      return;
    }
    wx.navigateTo({
      url:'/pages/pay/index'
    })
  }
})
