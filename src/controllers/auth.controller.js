import { User } from "../models/user.model.js";

export const authCallback = async (req, res) => {
//   res.send("User album router with GET method" );

try{
    const { id, firstName, lastName, imageUrl } = req.body;

    // check if the user already exists
    const user = await User.findOne({clerkId: id});

    if(!user) {
        //signup
        await User.create({
            clerkId : id,
            fullName: `${firstName || ""} ${lastName || ""}`,
            imageUrl: imageUrl,
        })
    }

    // res.status(200).json({
    //     clerkId: id,
    //     fullName: `${firstName} ${lastName}`,
    //     imageUrl: imageUrl,
    // })
       
    res.status(200).json({success : true, message: "User created successfully"});
}
catch(err){
    console.log(err);
    res.status(500).json({success : false, message: "Internal server error"});

}
}