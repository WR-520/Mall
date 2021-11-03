// pages/user/user.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 用户信息
        userinfo: {},
        //收藏数量
        collectNumber: 0
    },
    onShow: function() {
        // 获取缓存中的用户信息
        const userinfo = wx.getStorageSync('userInfo');
        const collect = wx.getStorageSync('collect') || [];
        console.log("userCollect",collect);
        this.setData({
            userinfo,
            collectNumber: collect.length
        })
    }
})