const express = require("express");
const router = express.Router();

const Workspace = require("../models/workspaceModel");
const User = require("../models/userModel");

const { protect } = require("../middlewares/authMiddleware");



// =========================
// CREATE WORKSPACE
// =========================

router.post(
"/create",
protect,
async(req,res)=>{

try{

const { workspaceName } = req.body;


const workspace =
await Workspace.create({

workspaceName,

admin:req.user._id,

members:[
req.user._id
]

});


res.status(201).json({

success:true,

workspace

});


}

catch(error){

res.status(500).json({

message:error.message

});

}

}

);







// =========================
// GET USER WORKSPACES
// =========================

router.get(
"/",
protect,
async(req,res)=>{

try{


const workspaces =
await Workspace.find({

members:req.user._id

})
.populate(
"members",
"username email"
)
.populate(
"admin",
"username email"
);



res.json(workspaces);


}

catch(error){

res.status(500).json({

message:error.message

});

}


}

);









// =========================
// ADD MEMBER BY EMAIL
// =========================

router.put(
"/add-member/:id",
protect,
async(req,res)=>{


try{


const { email } = req.body;



const workspace =
await Workspace.findById(
req.params.id
);



if(!workspace){

return res.status(404).json({

message:"Workspace not found"

});

}



// ONLY ADMIN CAN ADD


if(
workspace.admin.toString()
!== req.user._id.toString()
){

return res.status(403).json({

message:"Only admin allowed"

});

}




// FIND USER


const user =
await User.findOne({

email:email

});



if(!user){

return res.status(404).json({

message:"User not found"

});

}



// CHECK ALREADY MEMBER


const alreadyMember =
workspace.members.some(

(member)=>

member.toString()
===
user._id.toString()

);



if(alreadyMember){

return res.status(400).json({

message:"Member already exists"

});

}





workspace.members.push(
user._id
);



await workspace.save();





const updatedWorkspace =
await Workspace.findById(
workspace._id
)
.populate(
"members",
"username email"
)
.populate(
"admin",
"username email"
);




res.json({

message:"Member added successfully",

workspace:updatedWorkspace

});




}

catch(error){


res.status(500).json({

message:error.message

});


}



}

);





module.exports = router;