import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
    if(!req.auth.userId){
        res.status(401).json({success: false, message: "Unauthorized : You are not logged in"});
        return;
    }
    next();
}

export const requireAdmin = async (req, res, next) => {
    try{
        const currentUser = await clerkClient.users.getUser(req.auth.userId);
            //   console.log(currentUser.primaryEmailAddress?.emailAddress)

        const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
        
        if(!isAdmin){
            return res.status(403).json({success: false, message: "Forbidden : You are not an admin"});
        }
        next();
    }
    catch(error) {
        next(error);
    }
}