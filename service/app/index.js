const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();


app.listen(3000);

router.get("/abc",async (ctx,next)=>{
  console.log(ctx);
  ctx.body="abcd";
});

app.use(router.routes());
