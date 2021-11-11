/*const mongoose=require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    //_id:ObjectId
    username:{type:String,required:true},
    fullname:{type:String,required:true},
    entryDate:{type:Date,default:Date.now}
});

const tweetSchema = new Schema({
    tweet: {type:String,required:true},
    user:{type:Schema.Types.ObjectId, ref:'users'}//SELECT FROM a INNER JOIN b ON a.id =b.id
})



const Users = mongoose.model('users', userSchema) //previously it was mongoose.model('users', userSchema,'users') 

const Tweets= mongoose.model('tweets',tweetSchema) //previously it was mongoose.model('tweets',tweetSchema,'tweets')

const mySchemas ={ 'Users':Users,'Tweets':Tweets}

module.exports=mySchemas;*/
