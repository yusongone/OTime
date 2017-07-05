import {getData} from "./tools/storage"
const ONE_MINUTE=30*1000;
chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255]});
chrome.browserAction.setBadgeText({text:""});
chrome.extension.onConnect.addListener(function(port) {
      console.log("Connected .....");
      port.onMessage.addListener(function(msg) {
        console.log(msg);
        triggerMsg(msg) 
 //          port.postMessage("Hi Popup.js");
      });
})

class WatchDog{
  constructor(){
    this.watchList=[];
    this.barkHandlers=[];
    this.timeoutInterval=null;
    this.reLoadList();
  }
  onDestroy(){

  }
  onBark(handler){
    this.barkHandlers.push(handler);
  }
  reLoadList(){
    const nowTimeStamp=new Date().getTime();
    const data=getData();
    alertNoteIds={};
    this.watchList=data.filter((item)=>{
      if(item.remindTime>nowTimeStamp){
        return true;
      }else if(item.remindTime<nowTimeStamp){
        alertNoteIds[item.id]=item;
      }
    })

    const length=Object.keys(alertNoteIds).length;
    const text=length?length+"":"";
    chrome.browserAction.setBadgeText({text:text});

    this.watchList.sort((a,b)=>{
      return parseInt(a.remindTime)>parseInt(b.remindTime);
    });
    this._checkMinTime();
  }
  _checkMinTime(){
    if(this.watchList.length<1){
      return;
    }
    const nowTimeStamp=new Date().getTime();
    const minRemindTime=this.watchList[0].remindTime;
    const surplusTime=minRemindTime-nowTimeStamp;
    console.log(surplusTime/2000,this.watchList);
    if(surplusTime<2000){//小于3秒，触发
      for(let i =0; i<this.watchList.length;i++){
        let temp=this.watchList[i];
        if(temp.remindTime-2000<nowTimeStamp){
          this.barkHandlers.forEach((item)=>{
            item(temp);
          });
          this.watchList.splice(i,1);
        }
      }
      this._checkMinTime();
    }else {
    this.timeoutInterval?clearTimeout(this.timeoutInterval):"";
    this.timeoutInterval=setTimeout(()=>{
        this._checkMinTime();
      },surplusTime/2);
    }
  }
}

let TimerWatchDog;
let alertNoteIds={};

function newWatchDog(){
  TimerWatchDog=new WatchDog();
  TimerWatchDog.onDestroy(()=>{

  });
  TimerWatchDog.onBark((note)=>{
    alertNoteIds[note.id]=note;
    chrome.browserAction.setBadgeText({text: (Object.keys(alertNoteIds).length)+" "});
  });
}
newWatchDog();

const MSGManage = {
  "ADD_REMIND_TIME"(msg){
    if(!TimerWatchDog){
      newWatchDog();
    }else{
      TimerWatchDog.reLoadList();
    }
  },
  "CLEAR_REMIND"(msg){
    TimerWatchDog.reLoadList();
  }
}


function triggerMsg(msg){
  MSGManage[msg.TYPE]?MSGManage[msg.TYPE](msg):"";
}
