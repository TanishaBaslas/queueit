const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Queue = require("../models/Queue");
const Venue = require("../models/Venue");



router.patch("/make-admin/:email", async (req,res)=>{

try{

const user = await User.findOneAndUpdate(
{
email:req.params.email
},
{
role:"admin"
},
{
new:true
}
);


if(!user){

return res.status(404).json({
message:"User not found"
});

}


res.json({

message:"User promoted to admin",

user

});


}
catch(err){

res.status(500).json({
error:err.message
});

}

});




router.post("/create-queue", async(req,res)=>{


try{


const {
name,
venueId,
averageServiceTime
}=req.body;



const venue = await Venue.findById(
venueId
);



if(!venue){

return res.status(404).json({
message:"Venue not found"
});

}




const queue = await Queue.create({

name,

venueId,

averageServiceTime:
averageServiceTime || 120,

isActive:true,

nowServing:0,

lastToken:0,

queue:[]

});




venue.queues.push(
queue._id
);

await venue.save();



res.json({

message:"Queue created successfully",

queue

});


}
catch(err){

res.status(500).json({
error:err.message
});

}


});



module.exports = router;