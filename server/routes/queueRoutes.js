const express = require("express");
const router = express.Router();

const Queue = require("../models/Queue");
const { verifyToken } = require("../middleware/auth");


router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, venueId } = req.body;

    const queue = new Queue({
      name,
      venueId
    });

    await queue.save();

    res.status(201).json({
      message: "Queue created successfully",
      queue
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});



router.get("/", async (req, res) => {
  try {

    const queues = await Queue.find({
      isActive: true
    }).populate("venueId");


    res.json(queues);

  } catch(error) {

    res.status(500).json({
      message:error.message
    });

  }
});


router.get("/:id", async(req,res)=>{
  try{

    const queue = await Queue.findById(req.params.id)
      .populate("venueId")
      .populate("queue.userId");


    if(!queue){
      return res.status(404).json({
        message:"Queue not found"
      });
    }


    res.json(queue);


  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }
});


router.post("/:id/join", verifyToken, async(req,res)=>{
  try{

    const queue = await Queue.findById(req.params.id);


    if(!queue){
      return res.status(404).json({
        message:"Queue not found"
      });
    }


    const alreadyJoined = queue.queue.find(
      user => user.userId.toString() === req.user.id &&
      user.status === "waiting"
    );


    if(alreadyJoined){
      return res.status(400).json({
        message:"Already joined this queue",
        tokenNumber: alreadyJoined.tokenNumber
      });
    }


    const updatedQueue = await Queue.findByIdAndUpdate(
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



    const tokenNumber = updatedQueue.lastToken;



    updatedQueue.queue.push({
      userId:req.user.id,
      tokenNumber,
      status:"waiting"
    });



    await updatedQueue.save();



    res.json({
      message:"Joined queue successfully",
      tokenNumber
    });



  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }
});



router.get("/:id/status", verifyToken, async (req,res)=>{
  try{


    const queue = await Queue.findById(req.params.id);


    if(!queue){
      return res.status(404).json({
        message:"Queue not found"
      });
    }



    const userEntry = queue.queue.find(
      user => user.userId.toString() === req.user.id
    );



    if(!userEntry){

      return res.status(404).json({
        message:"You are not in this queue"
      });

    }




    const peopleAhead = queue.queue.filter(
      user =>
        user.tokenNumber < userEntry.tokenNumber &&
        user.status === "waiting"
    ).length;




    const estimatedWaitTime =
      peopleAhead * queue.averageServiceTime;




    res.json({

      queueName:queue.name,

      nowServing:queue.nowServing,

      yourToken:userEntry.tokenNumber,

      peopleAhead,

      estimatedWaitTime,

      status:
        userEntry.tokenNumber === queue.nowServing
        ? "YOUR_TURN"
        : "waiting"

    });



  }catch(error){

    console.log(error);

    res.status(500).json({
      message:error.message
    });

  }
});



router.delete("/:id/leave", verifyToken, async(req,res)=>{
  try{

    const queue = await Queue.findById(req.params.id);


    if(!queue){
      return res.status(404).json({
        message:"Queue not found"
      });
    }



    queue.queue = queue.queue.filter(
      user => user.userId.toString() !== req.user.id
    );



    await queue.save();



    res.json({
      message:"Left queue successfully"
    });



  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }
});



router.put("/:id/next", verifyToken, async(req,res)=>{
  try{


    const queue = await Queue.findById(req.params.id);


    if(!queue){

      return res.status(404).json({
        message:"Queue not found"
      });

    }



    const nextPerson = queue.queue.find(
      person => person.status === "waiting"
    );



    if(!nextPerson){

      return res.json({
        message:"No waiting users"
      });

    }



    nextPerson.status="served";


    queue.nowServing = nextPerson.tokenNumber;



    await queue.save();



    res.json({

      message:"Serving token",

      tokenNumber:nextPerson.tokenNumber

    });



  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }
});



module.exports = router;