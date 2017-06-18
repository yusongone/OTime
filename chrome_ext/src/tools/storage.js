let LocalData;
let noteListHandlerList=[];
let localStorage=window.localStorage;

if(!localStorage.Data){
  localStorage.Data='{"noteList":[]}';
}

LocalData=JSON.parse(localStorage.Data);

function _fireNoteListHandlerUpdate(){
  for(let i in noteListHandlerList){
    let handler=noteListHandlerList[i];
    handler(LocalData.noteList);
  }
}


function _createNoteId(){
  const length=LocalData.noteList.length;
  const id=new Date().getTime()+"_"+length;
  return id;
}

function _saveLocalToStorage(){
  localStorage.Data=JSON.stringify(LocalData);
  _fireNoteListHandlerUpdate();
}


export const getData=()=>{
  return LocalData.noteList;
}

export const updateNode=(note,callback)=>{
  let findNodeIndex;
  const findNote=LocalData.noteList.find(function(item,index){
      if(item.id==note.id){
        findNodeIndex=index;
        return item;
      }
    });
  if(!note.text){
    LocalData.noteList.splice(findNodeIndex,1);
  }else{
    for(var i in findNote){
      if(i!="id"&&(note[i]!=undefined)){
        findNote[i]=note[i]
      }
    }
  }

  _saveLocalToStorage();
}


export const addNode=(node,callback)=>{
  if(!node.text){return;}
  node["id"]=_createNoteId();
  LocalData.noteList.unshift(node);
  _saveLocalToStorage();
}

export const onNoteListChange=(handler)=>{
  noteListHandlerList.push(handler);
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