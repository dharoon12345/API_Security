const mongoose=require('mongoose');
const server=mongoose.connect(
  "mongodb+srv://dharoon:Dharoon1910@atlascluster.ngjnnsu.mongodb.net/", 
  {
    useNewUrlParser: true,    
    useUnifiedTopology: true
  }
).then(()=>{
	console.log("Connected Mongo DB!....")
}).catch((e)=>{
	console.log(e);
})

module.exports=server; 