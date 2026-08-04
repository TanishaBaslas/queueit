const {getSocket}=require("../utils/socket");
const express = require("express");
const router = express.Router();

const Queue = require("../models/Queue");
const { verifyToken, isAdmin } = require("../middleware/auth");
const createNotification = require("../utils/createNotification");


router.patch(
"/queues/:id/serve",
verifyToken,
isAdmin,
async(req,res)=>{

try{


const queue = await Queue.findById(req.params.id);


if(!queue){

return res.status(404).json({
message:"Queue not found"
});

}




const nextUser = queue.queue
.filter(
user=>user.status==="waiting"
)
.sort(
(a,b)=>a.tokenNumber-b.tokenNumber
)[0];



if(!nextUser){

return res.json({
message:"No waiting users"
});

}



nextUser.status="served";



queue.nowServing = nextUser.tokenNumber;



await queue.save();
const io=getSocket();

if(io){

 io.to(queue._id.toString())
 .emit(
 "queueUpdated",
 {
   nowServing:queue.nowServing
 }
 );

}


if(nextUser.userId){

await createNotification(
nextUser.userId,
queue._id,
"YOUR_TURN",
`Your token #${nextUser.tokenNumber} is now being served`
);

}



res.json({

message:"Serving next person",

nowServing:queue.nowServing

});



}
catch(err){

res.status(500).json({
error:err.message
});

}

});



router.patch(
"/queues/:id/skip",
verifyToken,
isAdmin,
async(req,res)=>{


try{


const queue = await Queue.findById(req.params.id);



if(!queue){

return res.status(404).json({
message:"Queue not found"
});

}




const currentUser = queue.queue.find(
user =>
user.tokenNumber === queue.nowServing &&
user.status==="waiting"
);




if(currentUser){


currentUser.status="skipped";



if(currentUser.userId){

await createNotification(

currentUser.userId,

queue._id,

"SKIPPED",

`Your token #${currentUser.tokenNumber} was skipped`

);

}


}




const nextUser = queue.queue
.filter(
user=>user.status==="waiting"
)
.sort(
(a,b)=>a.tokenNumber-b.tokenNumber
)[0];




if(nextUser){

queue.nowServing = nextUser.tokenNumber;


if(nextUser.userId){

await createNotification(

nextUser.userId,

queue._id,

"YOUR_TURN",

`Your token #${nextUser.tokenNumber} is now your turn`

);

}


}
else{

queue.nowServing++;

}




await queue.save();
const io=getSocket();

if(io){

 io.to(queue._id.toString())
 .emit(
 "queueUpdated",
 {
   nowServing:queue.nowServing
 }
 );

}


res.json({

message:"Skipped successfully",

nowServing:queue.nowServing

});



}
catch(err){

res.status(500).json({
error:err.message
});

}


});




router.patch(
"/queues/:id/pause",
verifyToken,
isAdmin,
async(req,res)=>{


try{


const queue = await Queue.findById(req.params.id);



if(!queue){

return res.status(404).json({
message:"Queue not found"
});

}



queue.isActive = !queue.isActive;



await queue.save();
const io=getSocket();

if(io){

 io.to(queue._id.toString())
 .emit(
 "queueUpdated",
 {
   nowServing:queue.nowServing
 }
 );

}



for(const user of queue.queue){


if(
user.status==="waiting" &&
user.userId
){


await createNotification(

user.userId,

queue._id,

queue.isActive
?
"QUEUE_RESUMED"
:
"QUEUE_PAUSED",


queue.isActive
?
"Queue has been resumed"
:
"Queue has been paused"

);


}


}




res.json({

message:
queue.isActive
?
"Queue resumed"
:
"Queue paused",


isActive:queue.isActive

});


}
catch(err){

res.status(500).json({
error:err.message
});

}


});







// ===============================
// ADD WALK-IN USER
// ===============================

router.post(
"/queues/:id/walkin",
verifyToken,
isAdmin,
async(req,res)=>{


try{


const queue = await Queue.findByIdAndUpdate(

req.params.id,

{
$inc:{
lastToken:1
}
},

{
new:true
}

);




if(!queue){

return res.status(404).json({
message:"Queue not found"
});

}




const walkInUser={


tokenNumber:queue.lastToken,

status:"waiting",

userId:null


};




queue.queue.push(walkInUser);



await queue.save();
const io=getSocket();

if(io){

 io.to(queue._id.toString())
 .emit(
 "queueUpdated",
 {
   nowServing:queue.nowServing
 }
 );
}
res.json({
message:"Walk-in added successfully",
tokenNumber:walkInUser.tokenNumber
});
}
catch(err){
res.status(500).json({
error:err.message
});
}
});
module.exports = router;