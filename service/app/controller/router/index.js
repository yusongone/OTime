const api=require("./api");
const publishPage=require("./publish_page");
const sessionPage=require("./session_page");

const routerAry=[
    publishPage.routes(),
    sessionPage.routes(),
    api.routes(),
    api.allowedMethods(),
    publishPage.allowedMethods(),
    sessionPage.allowedMethods()
]

exports.myRouter=(app)=>{
    app.use(publishPage.routes()),
    app.use(sessionPage.routes()),
    app.use(api.routes()),
    app.use(api.allowedMethods()),
    app.use(publishPage.allowedMethods()),
    app.use(sessionPage.allowedMethods())
    app.use(async (ctx,next)=>{
      ctx.status=404;
      await ctx.redirect("/404");
    });
}

/*
exports.myRouter=()=>{
  return async (ctx,next)=>{
    const f=routerAry.reduceRight((a,b)=>{
      return async ()=>{
        return b(ctx,a);
      }
    });
    await f(ctx,next);
  }
}
*/