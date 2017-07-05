import {getData} from "./tools/storage"
const ONE_MINUTE=30*1000;
chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255]});

/*
  var i=0;
  setInterval(function(){
    chrome.browserAction.setBadgeText({text: (i++)+" "});

  },3000);
*/

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
    this.watchList=data.filter((item)=>{
      if(item.remindTime>nowTimeStamp){
        return true;
      }
    })
    this.watchList.sort((a,b)=>{
      return parseInt(a.remindTime)>parseInt(b.remindTime);
    });
    console.log(data,this.watchList);
    this._checkMinTime();
  }
  _checkMinTime(){
    if(this.watchList.length<1){
      return;
    }
    const nowTimeStamp=new Date().getTime();
    const minRemindTime=this.watchList[0].remindTime;
    const surplusTime=minRemindTime-nowTimeStamp;
    console.log(surplusTime/1000/2,this.watchList);
    if(surplusTime<2000){//小于3秒，触发
      for(let i =0; i<this.watchList.length;i++){
        let temp=this.watchList[i];
        if(temp.remindTime-2000>nowTimeStamp){
          console.log("-------",temp,barkHandlers);
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

let TimerWatchDog=new WatchDog();
let alertCount=0;

const MSGManage = {
  "ADD_REMIND_TIME"(msg){
    if(!TimerWatchDog){
      TimerWatchDog=new WatchDog();
      TimerWatchDog.onDestroy(()=>{

      });
      TimerWatchDog.onBark(()=>{
        alertCount++;
        console.log("onbark");
        chrome.browserAction.setBadgeText({text: (alertCount)+" "});
      });
    }else{
      TimerWatchDog.reLoadList();
    }
  }
}

chrome.extension.onConnect.addListener(function(port) {
      console.log("Connected .....");
      port.onMessage.addListener(function(msg) {
        triggerMsg(msg) 
 //          port.postMessage("Hi Popup.js");
      });
})

function triggerMsg(msg){
  MSGManage[msg.TYPE]?MSGManage[msg.TYPE](msg):"";
}
