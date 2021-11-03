Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    onLoad:function(){
       wx.getSetting({
           success(res){
               if(res.authSetting['scope.userInfo']){
                   wx.getUserInfo({
                       success:function(res){
                           console.log("res.userInfo" )
                           console.log(res.userInfo);
                       }
                   })
               }
           }
       })

    },
    //登陆
    handleGetUserInfo(e) {
        const { userInfo } = e.detail;
        wx.setStorageSync('userInfo', userInfo);
        wx.navigateBack({
            delta: 1
        });
    }
})