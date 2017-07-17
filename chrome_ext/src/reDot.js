import React,{Children} from "react";
import PropTypes from 'prop-types';

const globalWatchMap={};
export const getGlobalWatchMap=()=>{
  return globalWatchMap;
}
function globalWatchFilter(watchList,Component){
    watchList.forEach(function(item){
     const watchKey=item.split(" as ")[0];
     const name=Component.name;
      if(!globalWatchMap[watchKey]){
        globalWatchMap[watchKey]={};
      }

       if(globalWatchMap[watchKey][name]===undefined){
          globalWatchMap[watchKey][name]=1;
       }else{
          globalWatchMap[watchKey][name]++;
       }
    });
}

class AmazonData{
  constructor(obj){
    this._data=obj;
    this.updateHandler=[];
    this.listenList=[];
  }
  getData(key){
    return this._data[key];
  }
  update(keyOrObj,dataOrFunc){
    const keys=Object.keys(this._data);
    const Event={
      update:true,
      stopUpdate(){
        this.update=false;
      }
    }


    const tempData={};
    if(typeof(keyOrObj)=="object"){
      for(var key in keyOrObj ){
        if(this.listenList&&this.listenList.indexOf(key)>-1){
          this._data[key]=keyOrObj[key];
          tempData[key]=keyOrObj[key];
        }
      }
    }else if(typeof(keyOrObj)=="string"&&keys.indexOf(keyOrObj)>-1){
      if(typeof(dataOrFunc)=="function"){
        const resultData=dataOrFunc(this._data[key],this._data,Event);  
        if(resultData===undefined){
          console.warn("update 函数需要返回值. ")
        }else{
          this._data[keyOrObj]=resultData;
          tempData[keyOrObj]=resultData;
        }
      }else{
        this._data[keyOrObj]=dataOrFunc;
        tempData[keyOrObj]=dataOrFunc;
      }
    }
    if(Event.update&&Object.keys(tempData).length>0){
        const promiseAry=this.updateHandler.map((item,index)=>{
          if(typeof(item)==="function"){
            return item(tempData)
          };
          return false;
        });
        return Promise.all(promiseAry);
    }
    return {then(){}}
  }
  listen(listenList,handler){ 
    const self=this;
    if(listenList.length&&typeof(listenList.forEach)=="function"){
      listenList.forEach(function(item){
        if(self.listenList.indexOf(item)<0){
          self.listenList.push(item);
        }
      });
    }
    this.updateHandler.push(handler);
  }
}
export const createData=(obj)=>{
  return new AmazonData(obj);
}


export class ReDot extends React.Component{
  static childContextTypes = {
    data:PropTypes.object
  }

  constructor(props, context){
    super(props, context);
    this.data= props.data;
  }

  getChildContext(a,b){
    return {
      data:this.props.data
    }
  }

  render(){
    return  Children.only(this.props.children);
  }
}


const getWatchComponent=(Component,originWatchList,mapActionToProps)=>
  class WatchComponent extends React.Component{
    static contextTypes = {
      data:PropTypes.object
    }

  componentWillUnmount(){
    this.isDidmount=false;
  }
  componentDidMount(){
    this.isDidmount=true;
  }  
  constructor(props,context){
    super(props,context);
    this.state={};
    const keys=Object.keys(context.data._data);
    this.ASMap={};
    this.isDidmount=false;

    const OW=originWatchList||[];
    const watchList=OW.map((item)=>{
      const tempSplit=item.split(" as ");
      if(tempSplit[1]!=undefined){
        this.ASMap[tempSplit[0]]=tempSplit[1];
      }
      return tempSplit[0];
    });

    this.watchList=watchList;

    watchList.forEach((item)=>{
      if(keys.indexOf(item)>-1){
        this.state[item]=context.data._data[item];
      }else{
        console.warn("请先在 AmazonData 中注册 :"+item+".");
      }
    });


    const setData=(key,data)=>{
        return context.data.update(key,data);
    }

    if(typeof(mapActionToProps)=="function"){
      const actionsFunction=mapActionToProps(setData);
      for(var i in actionsFunction){
        this.state[i]=actionsFunction[i];
      }
    }else{
      this.state.setData=setData;
    }

    context.data.listen(watchList,this._contextDataHandler);
  }
  _contextDataHandler=(setedState)=>{
    const watchList=this.watchList;
      let p=new Promise((resolve,rejuect)=>{ 
        const state={}
        for(var key in setedState){
          if(watchList.indexOf(key)>-1){
            state[key]=setedState[key];
          }
        }
        if(Object.keys(state).length>0&&this.isDidmount){
          this.setState(state,()=>{ 
            resolve({componetName:Component.name,watchList:watchList,status:"updated",value:state});
          });
        }else{
            resolve({componetName:Component.name,watchList:watchList,status:"ignore"});
        }
      });
      return p;
  }
  render(){
    const mergeAsState={};
    for(let i in this.state){
      let key=this.ASMap[i];
      if(key){
        mergeAsState[key]=this.state[i];
      }else{
        mergeAsState[i]=this.state[i];
      }
    }
    const props={...this.props,...mergeAsState}
    return <Component {...props} />
  }
}

export const watch=(watchList,mapActionToProps)=>{
  return (Component)=>{
    globalWatchFilter(watchList,Component);
    return getWatchComponent(Component,watchList,mapActionToProps);
  }
}
