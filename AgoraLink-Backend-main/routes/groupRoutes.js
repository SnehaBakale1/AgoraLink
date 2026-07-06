const express = require("express");

const Group = require("../models/groupModel");

const { protect } = require("../middlewares/authMiddleware");

const groupRouter = express.Router();



// CREATE GROUP

groupRouter.post("/", protect, async (req, res) => {

  try {

    const { name, description, workspaceId } = req.body;


    const group = await Group.create({

      name,

      description,

      workspace: workspaceId,

      admin: req.user._id,

      members: [req.user._id]

    });


    const populatedGroup =
      await Group.findById(group._id)
        .populate("admin", "username email")
        .populate("members", "username email");


    res.status(201).json(populatedGroup);


  } catch (error) {

    res.status(400).json({

      message: error.message

    });

  }

});






// GET WORKSPACE GROUPS

groupRouter.get("/", protect, async (req, res) => {

  try {

    const { workspaceId } = req.query;


    const groups =
      await Group.find({

        workspace: workspaceId

      })
      .populate("admin", "username email")
      .populate("members", "username email");


    res.json(groups);


  } catch (error) {

    res.status(400).json({

      message: error.message

    });

  }

});








// JOIN GROUP

groupRouter.post("/:groupId/join", protect, async (req,res)=>{

try{

const group =
await Group.findById(req.params.groupId);



if(!group){

return res.status(404).json({

message:"Group not found"

});

}



const alreadyMember =
group.members.some(

member =>

member.toString()
===
req.user._id.toString()

);



if(alreadyMember){

return res.status(400).json({

message:"Already member"

});

}



group.members.push(req.user._id);


await group.save();



res.json({

message:"Joined group"

});


}

catch(error){

res.status(400).json({

message:error.message

});

}


});









// LEAVE GROUP

groupRouter.post("/:groupId/leave", protect, async(req,res)=>{

try{


const group =
await Group.findById(req.params.groupId);



if(!group){

return res.status(404).json({

message:"Group not found"

});

}



group.members =
group.members.filter(

member =>

member.toString()
!== req.user._id.toString()

);



await group.save();



res.json({

message:"Left group"

});


}

catch(error){

res.status(400).json({

message:error.message

});

}

});





module.exports = groupRouter;