const express = require("express");

const multer = require("multer");

const Message = require("../models/chatModel");

const { protect } = require("../middlewares/authMiddleware");


const messageRouter = express.Router();




// MULTER STORAGE

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads/");

  },


  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() + "-" + file.originalname
    );

  }

});


const upload = multer({
  storage: storage
});







// SEND MESSAGE + FILE

messageRouter.post(
  "/",
  protect,
  upload.single("file"),
  async(req,res)=>{


try{


const {
content,
groupId,
workspaceId
}=req.body;



const message =
await Message.create({


sender:req.user._id,


content:content || "",


file:req.file
?
req.file.path
:
"",


group:groupId,


workspace:workspaceId


});






const populatedMessage =
await Message
.findById(message._id)

.populate(
"sender",
"username email"
)

.populate(
"workspace",
"workspaceName"
);




res.json(
populatedMessage
);



}

catch(error){


res.status(400).json({

message:error.message

});


}



}

);









// FETCH MESSAGES

messageRouter.get(
"/:groupId",
protect,
async(req,res)=>{


try{


const workspaceId =
req.query.workspaceId;




const messages =
await Message.find({

group:req.params.groupId,

workspace:workspaceId

})

.populate(
"sender",
"username email"
)

.sort({

createdAt:-1

});





res.json(messages);



}

catch(error){


res.status(400).json({

message:error.message

});


}


}

);






module.exports = messageRouter;