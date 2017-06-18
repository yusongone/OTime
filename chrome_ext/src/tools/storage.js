let LocalData;
let noteListHandlerList=[];

if(!localStorage.Data){
  localStorage.Data={noteList:[]}
}
LocalData=window.localStorage;

function _fireNoteListHandlerUpdate(){
  for(let i in noteListHandlerList){
    let handler=noteListHandlerList[i];
    handler(localData.nodeList);
  }
}

export const updateNode=(node,callback)=>{
  const index=LocalData.noteList.find(function(item,index){
      if(item.id==node.id){
        return index;
      }
    });
  LocalData.noteList[index]=node;
}

export const onNoteListChange=(handler)=>{
  noteListHandlerList.push(handler);
}

export const addNode=(node,callback)=>{
 LocalData.noteList.unshift(node);
}









export const FupdateNode=()=>{
  return fetch(request.path, {
        method: 'POST',
        //credentials: 'omit',
        credentials:'include',
        body:JSON.stringify(request.data),
        headers:{
            "X-CSRF-TOKEN":csrfToken,
            "content-type": 'application/json'
        }
    }).then(function(res) {
        return res.json();
    }).then(function (res){
    }).catch(function(err) {
        if(err){
            throw err;
        }
    });
}