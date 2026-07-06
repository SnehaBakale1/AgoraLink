const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const Message = require("../models/chatModel");

const {
  protect
} = require("../middlewares/authMiddleware");


const messageRouter = express.Router();



// create uploads folder

const uploadDir = "uploads";


if(!fs.existsSync(uploadDir)){

  fs.mkdirSync(uploadDir);

}





// MULTER STORAGE

const storage =
multer.diskStorage({


destination:(req,file,cb)=>{

cb(
null,
"uploads/"
);

},



filename:(req,file,cb)=>{


const uniqueName =
Date.now()
+
"-"
+
file.originalname;


cb(
null,
uniqueName
);


}


});



const upload =
multer({

storage:storage

});









// =======================
// SEND MESSAGE + FILE
// =======================


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




let filePath = "";


if(req.file){


filePath =
`uploads/${req.file.filename}`;


}







const message =
await Message.create({


sender:req.user._id,


content:
content || "",


file:
filePath,


group:
groupId,


workspace:
workspaceId


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




res.status(201)
.json(
populatedMessage
);





}

catch(error){


res.status(400)
.json({

message:
error.message

});


}



}

);









// =======================
// GET GROUP MESSAGES
// =======================


messageRouter.get(
"/:groupId",
protect,
async(req,res)=>{


try{


const workspaceId =
req.query.workspaceId;





const messages =
await Message.find({

group:
req.params.groupId,


workspace:
workspaceId


})


.populate(
"sender",
"username email"
)


// OLD -> newest order
.sort({

createdAt:1

});







res.json(
messages
);



}

catch(error){



res.status(400)
.json({

message:
error.message

});


}



}

);





module.exports =
messageRouter;