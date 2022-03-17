const Appointment = require('../models/Appointment')
const Hospital = require('../models/Hospital')

//@desc Get all appointments
//@route GET /api/v1/appointments
//@access Private
exports.getAppointments = async (req,res,next)=>{
    let query;
    //General users can see only their appointments
    if(req.user.role !== 'admin'){

        query = Appointment.find({user:req.user.id}).populate({
            path:"hospital",
            select:"name province tel"
        })
    }else{//If you are an admin, you can see all!
        if(req.params.hospitalId){
            query=Appointment.find({hospital:req.params.hospitalId}).populate({
                path:'hospital',
                select: 'name province tel'
            });
        } else {
            query=Appointment.find().populate({
                path:'hospital',
                select: 'name province tel'
            });
        }
    }

    try{
        const appointments = await query;
        res.status(200).json({
            success:true,
            count: appointments.length,
            data:appointments
        })
    }catch(err){
        console.log(err.stack);
        return res.status(500).json({
            success:false,
            message:"Cannot find appointment"
        })
    }
}

//@desc Get single appointments
//@route GET /api/v1/appointments/:id
//@access Public
exports.getAppointment = async (req,res,next)=>{
    try{
        const appointment = await Appointment.findById(req.params.id).populate({
            path:"hospital",
            select:"name description tel"
        })

        if(!appointment){
            return res.status(404).json({success:false,message:`No appointment with the id of ${req.params.id}`})
        }

        res.status(200).json({success:true,data:appointment});
    }catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false,message:"Cannot find appointment"})
    }

    
}

//@desc Create single appointments
//@route GET /api/v1/hospitals/:hospitalId/appointments
//@access Private

exports.addAppointment = async (req,res,next)=>{
    try{
        req.body.hospital = req.params.hospitalId
        const hospital = await Hospital.findById(req.params.hospitalId)

        if(!hospital){
            return res.status(404).json({success:false,message:`No hospital with id  of ${req.params.hospitalId}`})
        }
        console.log(req.body);

        //add user Id to req.body
        //req.body.user = req.user.id
        // req.body.user = req.user.id

        const existedAppointments = await Appointment.find({user:req.user.id})
        if(existedAppointments.length >= 3 && req.user.role !== "admin"){
            return res.status(400).json({success:true,message:`The user with ID ${req.user.id} has been vacinated more than 3 dose`})

        }

        const appointment = await Appointment.create(req.body);
        return res.status(200).json({success:true,data:appointment})
    }catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false,message:"Cannot create appointment"})
    }
}


//@desc Update single appointments
//@route Patch /api/v1/appointments/:id
//@access Private
exports.updateAppointment =  async (req,res,next)=>{
    try{
        let appointment = await Appointment.findById(req.params.id)


        if(!appointment){
            return res.status(400).json({success:false,message:`No appt with id ${req.params.id}`})
        }

        if(appointment.user.toString() !== req.user.id && req.user.role != "admin"){

            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorize to update this appointment`})
        }

        appointment = await Appointment.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        res.status(200).json({success:true,data:appointment})


    }catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false ,message:"Cannot update Appointment"})
    }
}


//@desc Delete single appointments
//@route Delete /api/v1/appointments/:id
//@access Private
exports.deleteAppointment =  async (req,res,next)=>{
    try{
        let appointment = await Appointment.findById(req.params.id)

        if(!appointment){
            return res.status(404).json({success:false,message:`No appt with id ${req.params.id}`})
        }

        if(appointment.user.toString() !== req.user.id && req.user.role !== "admin"){
            return res.status(401).json({success:false,message:`User ${req.user.is} is not authorized to delete this appointment`})
        }

        await appointment.remove();
        res.status(200).json({success:true,data:{}})
    }catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false ,message:"Cannot delete Appointment"})  
    }
}
