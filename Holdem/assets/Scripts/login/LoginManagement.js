var LoginManagement = {

    init:function(){
        Http_js.init();
    },

    sendSignIn:function(data,callback){
        Http_js.send("/api/api/register", data, callback);
    },

    sendResetPassword:function(data,callback){
        Http_js.send("/api/api/forgetpassword", data, callback);
    },

    sendAuthCode:function(callback){//图片验证码
        Http_js.send("/api/api/captcha",null, callback);
    },

    userLogin:function (phone,psw,callback) {
        var data = {
            "mobile": phone,
            "pwd": psw,
            "device_id":UtilityClass.getDeviceId(),
            "app_id":SiteConfig.app_id,
        };
        Http_js.send("/api/api/login", data, callback);
    },

    siteConfig:function(path,callback){
        Http_js.sendGetRequest(path, callback);
    },

    getCode:function (type,phone,key,code,func) {
        var data = {
            "type": type,
            "mobile": phone,
            "app_id":SiteConfig.app_id,
            "captcha":code,
            "key":key,
        };
        Http_js.send("/api/api/smscode", data, func);
    },

};
module.exports = LoginManagement;