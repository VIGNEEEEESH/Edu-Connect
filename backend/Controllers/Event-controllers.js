const HttpError=require("../Models/http-error")
const {validationResult}=require("express-validator")
const mongoose=require("mongoose")
const Event=require("../Models/Events")
const fs=require("fs")

const createEvent=async(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return next(new HttpError("Invalid inputs passed, please try again",422))
    }
    const{title,description,date,time}=req.body
    const createdEvents=new Event({
        title,
        description,
        date,
        time,
        image:req.file.path
    })
    try{
        await createdEvents.save()
    }catch(err){
        const error=new HttpError(
            "Something went wrong, creating event failed, please try again",500
        )
        return next(error)
    }
    res.status(201).json({events:createdEvents})

}
const getEvents=async(req,res,next)=>{
    let events
    try{
        events=await Event.find()
    }catch(err){
        const error=new HttpError(
            "Something went wrong, could not fetch events, please try again",500
        )
        return next(error)
    }
    if(!events || events.length==0){
        const error=new HttpError(
            "No events found",500
        )
        return next(error)
    }
    res.json({events:events})
}
const getEventById=async(req,res,next)=>{
  let event
  const id=req.params.id
  try{
      event=await Event.findOne({_id:id})
  }catch(err){
      const error=new HttpError(
          "Something went wrong, could not fetch event, please try again",500
      )
      return next(error)
  }
  if(!event || event.length==0){
      const error=new HttpError(
          "No event found",500
      )
      return next(error)
  }
  res.json({event:event})
}
const updateEvent = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError("Invalid inputs passed, please try again", 422));
    }
  
    const id = req.params.id;
    const { title,description, date, time, image } = req.body;
  
    let event;
    try {
      event = await Event.findOne({ _id: id });
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Something went wrong, could not fetch the event, please try again",
        500
      );
      return next(error);
    }
  
    if (!event) {
      const error = new HttpError("Cannot find the event to update", 404);
      return next(error);
    }
  
    event.title = title;
    event.description = description;
    event.date = date;
    event.time = time;
    event.image = req.file.path;
  
    try {
      await event.save();
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Something went wrong, could not update the event",
        500
      );
      return next(error);
    }
  
    res.json({ event: event });
  };


const deleteEvent=async(req,res,next)=>{
  const id=req.params.id
  let event
  try{
      event=await Event.findOne({_id:id})
  }catch(err){
      console.log(err)
      const error = new HttpError("Something went wrong, could not find the event , please try again", 500);
  return next(error)
  }
  
const imagePath=event.image
try{
  await event.deleteOne()
}catch(err){
  const error = new HttpError(
    "something went wrong, could not delete the event, please try again",
    500
  );
  return next(error);
}

  fs.unlink(imagePath,(err)=>{
    console.log(err)
  })
  res.status(200).json({message:"event successfully deleted"})
  
}
exports.createEvent=createEvent
exports.getEvents=getEvents
exports.getEventById=getEventById
exports.updateEvent=updateEvent
exports.deleteEvent=deleteEvent