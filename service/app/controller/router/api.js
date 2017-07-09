const Router = require('koa-router');
const sessionFilter= require("./session_filter");

const api =new Router({prefix: '/api'});

api.use(sessionFilter(),async (ctx,next)=>{
  ctx.requestType="api"
  if(ctx.status==301){
    ctx.body={status:"4432",msg:"login time out!"};
  }else{
    await next();
  }
});


api.post("/auth/login",async (ctx,next)=>{
  console.log("feffe");
  const db = await getDB();
  var collection = db.collection('users');
  const doc=await new Promise((resolve,reject)=>{

    collection.find({}).toArray(async function(err, docs) {
      console.log("Found the following records");
      console.log(docs);
      resolve(docs);
    });
  })
  ctx.body=doc;

});
api.post("/auth/register",async (ctx,next)=>{
  console.log(ctx.request.body.username);
});

module.exports=api;