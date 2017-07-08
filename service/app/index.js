const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');
var views = require('koa-views');
const CSRF = require ("koa-csrf");

const app = new Koa();
app.keys = ['a'];
app.listen(3000);



const router = new Router();
const authedRouter = new Router();
const api =new Router({prefix: '/api'});


function sessionMid(){
  return async function(ctx,next){
    if(ctx.session.user){
      ctx.status = 301;
    }else{
      ctx.status = 200;
    }
    await next();
  }
}

api.use(sessionMid(),async (ctx,next)=>{
  if(ctx.status==301){
    ctx.body={status:"4432",msg:"login time out!"};
  }else{
    await next();
  }
});

authedRouter.use(sessionMid(),async (ctx,next)=>{
  if(ctx.status==301){
    ctx.redirect("/auth/login");
  }else{
    await next();
  }
});

api.post("/login",(ctx,next)=>{
  console.log("ff");
  ctx.body="fefefefefe";

});;

router.get("/auth/login",async (ctx,next)=>{
  await ctx.render("login",{csrf:ctx.csrf});
});

authedRouter.get("/note/:noteId",async(ctx,next)=>{
  console.log("ffee",ctx.params);
  await ctx.render("login");
});


app.use(views(__dirname + '/views', {
  map: {
    html: 'jade'
  },
  extension: 'jade' 
}));

app.use(session({
   key: 'otimeSessionId', /** (string) cookie key (default is koa:sess) */
  maxAge: 86400000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false,
},app));

app.use(new CSRF({
  invalidSessionSecretMessage: 'Invalid session secret',
  invalidSessionSecretStatusCode: 405,
  invalidTokenMessage: 'Invalid CSRF token!!!',
  invalidTokenStatusCode: 406,
  excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
  disableQuery: false
}));

app.use(async (ctx,next)=>{
  console.log(ctx);
  await next();
});

app.use(router.routes())
.use(router.allowedMethods())
.use(authedRouter.routes())
.use(authedRouter.allowedMethods())
.use(api.routes())
.use(api.allowedMethods());


