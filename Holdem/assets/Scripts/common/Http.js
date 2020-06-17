/**
 * 短连接控制类
 */
window.Http_js = {
    extends: cc.Component,

    init:function () {
        GlobalVariable.svrIpOr3w = /*'www.' +*/ GlobalVariable.svrIpOrDomain;
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            GlobalVariable.isProductEnv = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isProductEnv", "()I");
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            GlobalVariable.isProductEnv = 1;
        }
        if (GlobalVariable.isProductEnv == 0) {
//            GlobalVariable.svrIpOrDomain = '127.0.0.1';  // 本机-测试服务器
            GlobalVariable.svrIpOrDomain = '47.107.146.183:9021';  // 局域网-测试服务器
            //GlobalVariable.svrIpOrDomain = '120.78.229.138'// 外网-阿里云测试服
            GlobalVariable.svrIpOr3w = GlobalVariable.svrIpOrDomain;
            GlobalVariable.downloadSvr = 'http://' + GlobalVariable.svrIpOr3w;//特殊域名或ip专供下载
        }
        GlobalVariable.webSocketUrlDzpk = 'ws://' + GlobalVariable.svrIpOrDomain + '/ws';//websocket协议
        GlobalVariable.webSocketUrlShort = 'ws://' + GlobalVariable.svrIpOrDomain + '/wsShort';//websockNext scene preloadedet协议
        GlobalVariable.http_url = 'http://' + GlobalVariable.svrIpOr3w;//http协议

        GlobalVariable.hot_url = GlobalVariable.downloadSvr + '/hotupdate';//特殊域名或ip专供下载
    },

    sendRequest: function (method , path, param, callback,timeoutCallBack) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 10000;
        var timeout = false;//是否超时
        // var timer;
        if(timeoutCallBack){
            var retTimeOutData = {cd:0,msg:"网络连接失败，请重试"};
            xhr.addEventListener('error', function(){console.log("资源加载错误");if(timeoutCallBack) timeoutCallBack(retTimeOutData)});
            //xhr.addEventListener('abort', function(){console.log("请求错误");if(timeoutCallBack) timeoutCallBack(retTimeOutData)});
            xhr.ontimeout = function(){console.log("请求超时");if(timeoutCallBack) timeoutCallBack(retTimeOutData)};
            /*timer = setTimeout(function(){
                timeout = true;
                xhr.abort();//请求中止
            },10000);*/
        }

        let body = 'reqPlatForm=js&deviceId=' + cc.vv.Global.getDeviceId();
        if (data) {
            for (var k in data) {
                if(data[k] || data[k]==0)body += "&" + k + "=" + data[k];//encodeURIComponent(data[k]);
            }
        }

        // if(usermgr.loginSucces==true){
        //     body+='&platFormUserid='+JSON.parse(usermgr.userLocal).id+'&token='+JSON.parse(usermgr.userLocal).token;
        // }


        if (extraUrl == null) {
            extraUrl = HTTP.url;
        }
        let requestURL = extraUrl + path;
        console.log("HTTP -->> ", requestURL, body);

        xhr.open(method, requestURL, true);

        if (method.toLowerCase() === 'post') {
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                console.log("HTTP <<-- ", xhr.responseText);
                //console.log(xhr.getAllResponseHeaders());
                let ret = null;
                try {
                    ret = JSON.parse(xhr.responseText);
                } catch (e) {
                    ret = null;
                    console.log("err:" + e);
                }
                if (ret){
                    if(ret.cd==-801 || ret.cd==-900 ||ret.cd==-904 || ret.cd==-911 || ret.cd==-912 || ret.cd==-914  || ret.cd==-998 || ret.cd==-999) {
                        cc.sys.localStorage.setItem("localSrc", '');
                        cc.director.loadScene('login_scene', function () {
                            cc.loader.loadRes("Prefab/toast", function (err, prefab) {

                                var toast = cc.instantiate(prefab);
                                toast.y = -400;
                                toast.getChildByName('Label').getComponent(cc.Label).string = '您的账号已在其他位置登录'
                                // cc.director.getScene().addChild(toast);
                                cc.find('Canvas').addChild(toast)
                                toast.runAction(cc.sequence(cc.moveBy(1.5, cc.v2(0, 400)).easing(cc.easeOut(1.5)), cc.delayTime(0.5), cc.callFunc(function () {
                                    toast.removeFromParent(true);
                                })));
                            });
                        });

                        return;
                    }
                }
                if (ret && handler) {
                    handler(ret);
                }
            }
            // else if (timeout && timer) clearTimeout(timer);//取消等待的超时
        };

        xhr.send(body);
    },

    sendGetRequest: function (path, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET",path);

        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            var XMLHttpReq = xhr;
            if (XMLHttpReq.readyState == 4) {
                if (XMLHttpReq.status == 200) {
                    var data = JSON.parse(XMLHttpReq.responseText);
                    if (callback != null) {
                        console.log('responseData==>' + XMLHttpReq.responseText);
                        callback(data);//回调函数
                    }
                }
            }
        };

        xhr.send();
    },

    send : function(path, data, handler, extraUrl, timeoutCallBack) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 10000;
        var timeout = false;//是否超时
        var method = 'POST';
        if(timeoutCallBack){
            var retTimeOutData = {cd:0,msg:"网络连接失败，请重试"};
            xhr.addEventListener('error', function(){console.log("资源加载错误");if(timeoutCallBack) timeoutCallBack(retTimeOutData)});
            xhr.ontimeout = function(){console.log("请求超时");if(timeoutCallBack) timeoutCallBack(retTimeOutData)};
        }

        let body = 'reqPlatForm=js&deviceId=' + UtilityClass.getDeviceId();
        if (data) {
            for (var k in data) {
                if(data[k] || data[k]==0)body += "&" + k + "=" + data[k];//encodeURIComponent(data[k]);
            }
        }

        if(GlobalUserInfo.loginSucces){
            body+='&platFormUserid='+GlobalUserInfo.id+'&token='+GlobalUserInfo.token;
        }


        if (extraUrl == null) {
            extraUrl = GlobalVariable.http_url;
        }
        let requestURL = extraUrl + path;
        console.log("HTTP -->> ", requestURL, body);

        xhr.open(method, requestURL, true);

        if (method.toLowerCase() === 'post') {
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                console.log("HTTP <<-- ", xhr.responseText);
                let ret = null;
                try {
                    ret = JSON.parse(xhr.responseText);
                } catch (e) {
                    ret = null;
                    console.log("err:" + e);
                }
                if (ret){
                    if(ret.cd==-801 || ret.cd==-900 ||ret.cd==-904 || ret.cd==-911 || ret.cd==-912 || ret.cd==-914  || ret.cd==-998 || ret.cd==-999) {
                        cc.sys.localStorage.setItem("localSrc", '');
                        cc.director.loadScene('login_scene', function () {
                            cc.loader.loadRes("Prefab/toast", function (err, prefab) {

                                var toast = cc.instantiate(prefab);
                                toast.y = -400;
                                toast.getChildByName('Label').getComponent(cc.Label).string = '您的账号已在其他位置登录'
                                cc.find('Canvas').addChild(toast)
                                toast.runAction(cc.sequence(cc.moveBy(1.5, cc.v2(0, 400)).easing(cc.easeOut(1.5)), cc.delayTime(0.5), cc.callFunc(function () {
                                    toast.removeFromParent(true);
                                })));
                            });
                        });

                        return;
                    }
                }
                if (ret && handler) {
                    handler(ret);
                }
            }
        };

        xhr.send(body);

        return xhr;
    },
};