var LoginManagement = require("./LoginManagement");
cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad:function () {
        this.codeBtn = cc.find("bgdown/codeBtn",this.node)
        this.codeLabel = cc.find("bgdown/codeBtn/label",this.node);
        this.phone = cc.find("bgdown/phone",this.node);
        this.authCode = cc.find("bgdown/authCode",this.node);
        this.mimainput = cc.find("bgdown/mimainput",this.node);
        this.srcReput = cc.find("bgdown/srcReput",this.node);

        this.codeBtn.on(cc.Node.EventType.TOUCH_END,this.getCode,this);
        cc.find("btn_0",this.node).on(cc.Node.EventType.TOUCH_END,this.confirmClick,this);
    },

    getCode:function () {
        var self = this;

        this.codeBtn.getComponent(cc.Button).interactable = false;
        this.codeLabel.time = 60;

        var phone = this.phone.getComponent(cc.EditBox).string;

        //这里是正则表达式,判断手机号码是否符合规则
        var phoneReg=/^[1][3,4,5,7,8][0-9]{9}$/;

        if (phoneReg.test(phone)) {
            this.codeLabel.getComponent(cc.Label).string = this.codeLabel.time;
            var callback = function () {
                this.codeLabel.time -= 1;
                this.codeLabel.getComponent(cc.Label).string = this.codeLabel.time;

                if(this.codeLabel.time <= 0){
                    this.unschedule(callback);
                    this.codeBtn.getComponent(cc.Button).interactable = true;
                    this.codeLabel.time = 60;
                    this.codeLabel.getComponent(cc.Label).string = '获取验证码';
                }
            }
            this.schedule(callback,1);

            var func = function(ret){
                if(ret.code ==4000){
                    self.showAlert(ret.msg);
                    self.unschedule(callback)
                    self.codeBtn.interactable = true
                    self.codeLabel.time = 60
                    self.codeLabel.string = '获取验证码'
                }
            }

            LoginManagement.getCode(phone,func);

        } else {
            this.codeBtn.getComponent(cc.Button).interactable = true;
            var data = {text:"手机号码错误"};
            UtilityClass.loadAlertPrefab(this.node,data);
        }
    },

    confirmClick:function () {
        var self = this;
        var phone = this.phone.getComponent(cc.EditBox).string;
        var authCode = this.authCode.getComponent(cc.EditBox).string;
        var mimainput = this.mimainput.getComponent(cc.EditBox).string;
        var srcReput = this.srcReput.getComponent(cc.EditBox).string;

        if(6<mimainput.length<12){

        }

        if(mimainput == srcReput){
            var data = {
                "mobile":phone,
                "sms_code":authCode,
                "pwd":mimainput,
                "pwd_comfim":srcReput,
                "app_id":SiteConfig.app_id,
            }

            var func = function (ret){
                var data;
                if (ret.code  == 4000) {
                    data = {text:ret.msg};
                }else {
                    data = {text:ret.msg};
                }
                UtilityClass.loadAlertPrefab(self.node,data);
            }

            LoginManagement.sendResetPassword(data,func);
        }else{
            var data = {text:"密码输入不一致，请重新输入！"};
            UtilityClass.loadAlertPrefab(this.node,data);
        }
    },
});