let count=0;
export const Get=(obj)=>{
  let _csrf=document.getElementsByName("csrf")[0].getAttribute("value");
  var myHeaders = new Headers();
  myHeaders.append("x-csrf-token",_csrf);
  return fetch("/api/login",{
    method:"POST",
    credentials: 'include',
    headers:myHeaders,
    body:{_csrf:_csrf}
  }).then(function(){

  }).then(function(){

  });

};