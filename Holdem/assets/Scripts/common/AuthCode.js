var LoginManagement = require("../login/LoginManagement");
cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad:function () {
        this.aSprite = cc.find("sprite",this.node);
        this.key = null;
        this.img = null;
        var self = this;

        var func = function (ret) {
            if (ret.code == 200) {
                self.key = ret.data.url.key;
                self.img = ret.data.url.img;
                let img = new Image();
                img.src = self.img;
                let texture = new cc.Texture2D();
                texture.initWithElement(img);
                texture.handleLoadedTexture();
                self.aSprite.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            }
        }
        LoginManagement.sendAuthCode(func);

        cc.find("returnBtn",this.node).on(cc.Node.EventType.TOUCH_END,this.getCode,this);
    },

    getCode:function () {
        var code = cc.find("authCode",this.node).getComponent(cc.EditBox).string;
        if(code != null && code != ""){
            this.node.parent._components[1].getPhoneCode(this.key,code);
        }
    },


});