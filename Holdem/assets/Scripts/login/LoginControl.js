var LoginManagement = require("./LoginManagement");
cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad:function () {
        LoginManagement.init();
        this.bg = cc.find("bg",this.node);
        this.opacity = 255;

        this.phone = cc.find("bg/inputBg/userName",this.node).getComponent(cc.EditBox);
        this.password = cc.find("bg/inputBg/passWord",this.node).getComponent(cc.EditBox);

        cc.find("bg/loginbtn",this.node).on(cc.Node.EventType.TOUCH_END,this.loginClick,this);
        cc.find("bg/bottom/resetPswBtn",this.node).on(cc.Node.EventType.TOUCH_END,this.resetPswClisk,this);
        cc.find("bg/bottom/signBtn",this.node).on(cc.Node.EventType.TOUCH_END,this.signInClick,this);

        if(cc.sys.localStorage.getItem("phone")){
            this.phone.string = cc.sys.localStorage.getItem("phone");
            this.password.string = cc.sys.localStorage.getItem("password");
        }


        cc.debug.setDisplayStats(false);
        var platform;
        var self = this

        if (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_ANDROID){

            var showerror = function(){
                UtilityClass.loadPrefab(self.bg,"Prefabs/commonPrefabs/net_error");
            }
            this.scheduleOnce(showerror, 5);

            LoginManagement.siteConfig(GlobalVariable.http_url+"/api/api/siteconfig",function (ret) {
                self.unschedule(showerror)
                if (ret.code == 200){
                    SiteConfig.information = ret.data

                    //热更  还没写到 暂时留个方法
                    // self.firstAutoLogin();

                }
            });
        }


        this.preload();
    },

    update(dt) {
        if (this.contral == true) {
            this.opacity -= 2;
            cc.find('bg/alert',this.node).opacity = this.opacity;
            if (this.opacity < 10) {
                cc.find('bg/alert',this.node).active = false;
                this.opacity = 255;
                this.contral = false;
            }
        }
    },

    showAlert(string){
        this.contral = true;
        cc.find('bg/alert',this.node).active = true;
        cc.find('bg/alert/Label',this.node).getComponent(cc.Label).string = string;
    },

    //登录
    loginClick:function(){
        var phone = this.phone.string;
        var psw = this.password.string;
        var self = this;

        this.opacity = 255;

        cc.find('bg/loding',this.node).active = true;
        cc.find('bg/loding/sprite',this.node).getComponent(cc.Animation).play('waitingLogin');

        var onlogin = function (ret) {
            var load = cc.find('bg/loding',self.node);
            load.active = false;
            if (ret.code == 4000) {
                load.getChildByName("sprite").getComponent(cc.Animation).stop('waitingLogin');

                self.showAlert(ret.msg);
                cc.sys.localStorage.setItem("", '');
                self.password.string ='';

                return;
            }else if (ret.code == 200){
                //保存账号和密码，目前不做其他操作password
                cc.sys.localStorage.setItem("phone", self.phone.string);
                cc.sys.localStorage.setItem("password", self.password.string);

                GlobalUserInfo.loginSucces = true;
                GlobalUserInfo.information = ret.data;

                cc.director.loadScene('hall_scene');
            }
        }
        LoginManagement.userLogin(phone,psw,onlogin);
    },

    //重置密码
    resetPswClisk:function(){
        UtilityClass.loadPrefab(this.bg,"Prefabs/loginPrefabs/resetPsw");
    },

    //注册
    signInClick:function(){
        UtilityClass.loadPrefab(this.bg,"Prefabs/loginPrefabs/register");
    },

    //预加载大厅资源
    preload:function() {
        cc.director.preloadScene("hall_scene", function () {
            cc.log("Next scene preloaded");
        });
    },



});