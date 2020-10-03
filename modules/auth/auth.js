var config = require("../CONFIG")
class auth_check {
    constructor (req,type){
        //0 for business 1 for user
        this.req=req;

        this.type=type

    }
    async getCookie(){
        if (this.req.signedCookies===undefined){
            return null;
        }else {
            var type = (0) ? config.gvs.businessAuthTokenName:config.gvs.userAuthTokenName;
            var token=this.req.signedCookies[type]
            return token
        }
    }
    get auth(){
        return this.getCookie()
    }
}

module.exports = {
    auth_check:auth_check
}
