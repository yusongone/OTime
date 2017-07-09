const Router = require('koa-router');
const authedRouter = new Router();
const getDB=require("../database").getDB;
const sessionFilter = require("./session_filter");

authedRouter.use(sessionFilter(),async (ctx,next)=>{
  if(ctx.status==301){
    ctx.redirect("/auth/login");
  }else{
    await next();
  }
});

authedRouter.get("/note/:noteId",async(ctx,next)=>{
  await ctx.render("login");
});

module.exports=authedRouter;
