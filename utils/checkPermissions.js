const customError = require("../errors")

const checkPermissions = (requestUser,resourceUserId)=>{
    if(requestUser.role === "admin") return
    if(requestUser.userId === resourceUserId.toString()) return
    throw new customError.UnauthorizedError("You are not authorized to perform this action")
}

module.exports = checkPermissions