import {ObjectCompare} from "./common";
let LocalData;
let noteListHandlerList=[];
let localStorage=window.localStorage;

if(!localStorage.Data){
  localStorage.Data='{"noteList":[]}';
}

LocalData=JSON.parse(localStorage.Data);

function _fireNoteListHandlerUpdate(node){
  for(let i in noteListHandlerList){
    let handler=noteListHandlerList[i];
    handler(node,LocalData.noteList);
  }
}

function _createNoteId(){
  const length=LocalData.noteList.length;
  const id=new Date().getTime()+"_"+length;
  return id;
}

function _saveLocalToStorage(node){
  localStorage.Data=JSON.stringify(LocalData);
  _fireNoteListHandlerUpdate(node);
}


export const getData=()=>{
  const localData=JSON.parse(localStorage.Data);
  return localData.noteList;
}

export const updateNode=(note,callback)=>{
  let findNodeIndex;
  const findNote=LocalData.noteList.find(function(item,index){
      if(item.id==note.id){
        findNodeIndex=index;
        return item;
      }
    });
  let updateKey=null;   
  const OC=ObjectCompare(note,findNote,function(_updateKey){
    updateKey=_updateKey;
  });
  if(OC){
    return;
  }else if(!OC&&updateKey=="text"){
    note.lastEditTime=new Date().getTime();
  }

  if(note.delete){
    LocalData.noteList.splice(findNodeIndex,1);
  }else if(note.doneTime){
    delete findNote.remindTime;
    delete findNote.updateRemindTime;
    findNote.doneTime=note.doneTime;
  }else{
    for(var i in note){
      if(i!="id"&&(note[i]!=undefined)){
        findNote[i]=note[i]
      }
    }
  }
  _saveLocalToStorage(findNote);
}


export const addNode=(node,callback)=>{
  if(!node.text){return;}
  node["id"]=_createNoteId();
  LocalData.noteList.unshift(node);
  _saveLocalToStorage(node);
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