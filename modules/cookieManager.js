
function set(res, cookieName, jsonObj, maxAge,callback){
    res.cookie(cookieName,jsonObj,{
        maxAge:maxAge,httpOnly:true,
        signed:true
    })
    return callback();

}

function get() {

}

module.exports={
    set:set,
    get:get
}