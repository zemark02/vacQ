const User = require("../models/User");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.create({
      name:name,
      email:email,
      password:password,
      role:role,
    });
    const token = user.getSignedJwtToken()
    res.status(200).json({ success: true , token:token });
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ success: false });
  }
};

exports.login = async (req,res,next)=>{
  const {email,password} = req.body;

  if(!email || !password){
    return res.status(400).json({success:true,msg:"Please provide an email and password"});
  }
  
  const user = await User.findOne({email:email}).select('+password');


  if(!user){
    return res.status(400).json({success:false,msg:"Invalid credentials"});
  }

  const isMatch = await user.matchPassword(password)

  if(!isMatch){
    return res.status(401).json({success:false,msg:"Invalid credentials"})
  }

  const token = user.getSignedJwtToken();

  res.status(200).json({success:true,token})

}
