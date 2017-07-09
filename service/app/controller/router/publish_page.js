const Router = require('koa-router');
const sessionFilter = require("./session_filter");
const router = new Router();

router.use(sessionFilter(),async (ctx,next)=>{
  await next();
});

router.get("/auth/login",async (ctx,next)=>{
  await ctx.render("login",{csrf:ctx.csrf});
});

router.get("/auth/register",async (ctx,next)=>{
  await ctx.render("register",{csrf:ctx.csrf});
});

router.get("/404",async (ctx,next)=>{
  await ctx.render("404",{csrf:ctx.csrf});
})

router.use(async (ctx,next)=>{
  console.log("fefefef");
  await ctx.render("login",{csrf:ctx.csrf});
});

module.exports=router;