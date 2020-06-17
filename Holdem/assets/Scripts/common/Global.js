window.GlobalVariable = {
    svrIpOrDomain: '47.107.146.183:9021',
    svrIpOr3w: '',
    downloadSvr: 'http://www.0760safa.cn',//特殊域名或ip专供下载
    isProductEnv: 0,//0是测试服务器，1是正式服务器
    webSocketUrlDzpk :'',//websocket协议
    webSocketUrlShort :'',//websockNext scene preloadedet协议
    http_url :'',//http协议

    hot_url :"",//特殊域名或ip专供下载
}

window.GlobalUserInfo = {
    information:{},
    userId:null,//用户ID
    loginSucces:false,//是否登录成功
    isFirstRun:1,//app是否是初次运行(目前主要用来判断刚打开时自动登录用，app杀掉再开还是算初次运行)
}

window.SiteConfig = {//站点配置信息
    information:{},
    app_id : 't3oyv15t',//应用唯一标识
    app_key : 'b3pgw2f97k',//应用秘钥
};

window.UtilityClass = {
    //动态加载图片
    loadSprite:function (node,addres) {
        cc.loader.loadRes(addres, cc.SpriteFrame, function (err, spr) {
            node.getComponent(cc.Sprite).spriteFrame = spr;
        });
    },

    //动态加载图集
    loadAtlas:function (node,addres,sprName) {
        cc.loader.loadRes(addres, cc.SpriteAtlas, function (err, atlas) {
            var spr = atlas.getSpriteFrame(sprName);
            node.getComponent(cc.Sprite).spriteFrame = spr;
        });
    },

    //加载远程图片
    loadTexture:function (node,url) {
        cc.loader.load(url, function (err, texture) {
            if(err){
                cc.log("err=====>>"+err+",url===>>"+url);
            }
            var spr = new cc.SpriteFrame(texture);
            node.getComponent(cc.Sprite).spriteFrame = spr;
        });
    },

    //动态加载预制件
    loadPrefab:function(node,addres,data){
        cc.loader.loadRes(addres, function(error, res ){
            var ceil = cc.instantiate( res );
            if(data != null && data != ""){
                ceil.data = data;
            }

            ceil.scale = 0;
            node.addChild( ceil );
            var action = cc.scaleTo(0.1,1);
            ceil.runAction(action);
        });
    },

    loadAlertPrefab:function(node,data){
        UtilityClass.loadPrefab(node,"Prefabs/commonPrefabs/commonAlert",data);
    },

    //获取设备ID
    getDeviceId:function () {
        if (this.deviceId == null || this.deviceId == ''){
            if (cc.sys.os == cc.sys.OS_IOS){
                // jsb.reflection.callStaticMethod("RootViewController", "login:ryToken:",ret.user.token,ret.user.rongToken);
                this.deviceId = jsb.reflection.callStaticMethod('RootViewController', 'getUUID')
            }
            else if (cc.sys.os == cc.sys.OS_ANDROID){
                this.deviceId = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getDeviceId", "()Ljava/lang/String;");
            } else {
                this.deviceId = cc.sys.localStorage.getItem("deviceId");
                if(!this.deviceId){
                    this.deviceId = 'star_poker'+new Date().getTime();
                    cc.sys.localStorage.setItem("deviceId",this.deviceId);
                }
            }
        }
        return this.deviceId;
    },

    //全局事件如果按钮名字为 "returnBtn" 或 ”closeBtn“则调用此方法
    closeClick:function (node) {
        node.parent.destroy();
        node.parent.removeFromParent();
    },
}

cc.Button.prototype._onTouchEnded = (event) => {
    if(event.currentTarget.name == "closeBtn" || event.currentTarget.name == "returnBtn"){
        UtilityClass.closeClick(event.currentTarget);
    }
}
