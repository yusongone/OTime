
module.exports=()=>{
  return async function(ctx,next){
    if(ctx.session.user){
      ctx.status = 301;
    }else{
      ctx.status = 200;
    }
    await next();
  }
}