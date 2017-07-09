let count=0;
export const Post=(obj)=>{
  let _csrf=document.getElementsByName("csrf")[0].getAttribute("value");
  var myHeaders = new Headers();
  myHeaders.append("content-type",'application/x-javascript');
  myHeaders.append("x-csrf-token",_csrf);

  return fetch(obj.path,{
    method:"POST",
    credentials: 'include',
    headers:myHeaders,
    body:JSON.stringify(obj.data)
  }).then(function(){

  }).then(function(){

  });

};
export const Get=(obj)=>{
  return fetch(obj.path,{
    method:"GET",
    credentials: 'include',
    body:{}
  }).then(function(){

  }).then(function(){

  });

};