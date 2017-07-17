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

export const ObjectCompare = (x, y,cb) =>{
  let p
  if (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y)) {
    return true
  }
  if (x === y) {
    return true
  }
  if (typeof x === 'function' && typeof y === 'function') {
    if ((x instanceof RegExp && y instanceof RegExp) ||
    (x instanceof String || y instanceof String) ||
    (x instanceof Number || y instanceof Number)) {
      return x.toString() === y.toString()
    } else {
      return false
    }
  }
  if (x instanceof Date && y instanceof Date) {
    return x.getTime() === y.getTime()
  }
  if (!(x instanceof Object && y instanceof Object)) {
    return false
  }
  if (x.prototype !== y.prototype) {
    return false
  }
  if (x.constructor !== y.constructor) {
    return false
  }
  for (p in y) {
    if (!x.hasOwnProperty(p)) {
      cb(p);
      return false
    }
  }
  for (p in x) {
    if (!y.hasOwnProperty(p)) {
      cb(p);
      return false
    }
    if (typeof y[p] !== typeof x[p]) {
      cb(p);
      return false
    }
    if (!ObjectCompare(x[p], y[p],cb)) {
      cb(p);
      return false
    }
  }
  return true
}