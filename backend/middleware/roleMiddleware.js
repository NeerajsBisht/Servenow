// roleMiddleware
export const authorizeRoles = (...allowedRoles)=>{
    return (req, res, next)=>{
        if(!req.user){
            return res.status(401).json({
                message:"not authenticated"
            });
        }
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                message:"access denied, insuffecient permissions"
            });
        }
        next();
    };
};