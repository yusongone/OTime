export const getCleanTime=(date)=>{
  return new Date(date.toLocaleString().split(" ")[0]).getTime();
}