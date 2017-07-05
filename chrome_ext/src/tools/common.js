export const getCleanTime=(date)=>{
  return new Date(date.toLocaleString().split(" ")[0]).getTime();
}

export const getDayHoursMinute=(time)=>{
    const total_minutes=parseInt(time/(60*1000));
    const day=parseInt(total_minutes/(24*60));
    const hours=parseInt(total_minutes%(24*60)/60);
    const minutes=parseInt(total_minutes%(24*60)%60)+1;
    let a="";
    if(day>0){
      a+=day+" 天, "+hours+" 小时, "+minutes+" 分钟";
    }else if(hours>0){
      a+=hours+" 小时, "+minutes+"分钟";
    }else if(minutes>0){
      a+=minutes+" 分钟";
    }
    return {day,hours,minutes,"text":a}
}