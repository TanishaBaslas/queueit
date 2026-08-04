const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");
const { verifyToken } = require("../middleware/auth");


router.get("/", verifyToken, async(req,res)=>{
  try{

    const notifications = await Notification.find({
      userId:req.user.id
    })
    .sort({
      createdAt:-1
    });


    res.json(notifications);


  }catch(err){

    res.status(500).json({
      error:err.message
    });

  }
});

router.get("/unread-count", verifyToken, async(req,res)=>{
  try{

    const count = await Notification.countDocuments({
      userId:req.user.id,
      read:false
    });


    res.json({
      unreadCount:count
    });


  }catch(err){

    res.status(500).json({
      error:err.message
    });

  }
});


router.patch("/:id/read", verifyToken, async(req,res)=>{
  try{

    const notification = await Notification.findOneAndUpdate(
      {
        _id:req.params.id,
        userId:req.user.id
      },
      {
        read:true
      },
      {
        new:true
      }
    );


    if(!notification){
      return res.status(404).json({
        message:"Notification not found"
      });
    }


    res.json({
      message:"Notification marked as read",
      notification
    });


  }catch(err){

    res.status(500).json({
      error:err.message
    });

  }
});


module.exports = router;