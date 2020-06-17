var HallManagement = {

    sendSlideshow:function (data,callback) {
        Http_js.send("/api/index/banner", data, callback);
    },

    sendSignIn:function(data,callback){
        Http_js.send("/api/api/register", data, callback);
    },

};
module.exports = HallManagement;