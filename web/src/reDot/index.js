import React,{Children} from "react";
import PropTypes from 'prop-types';


class AmazonData{
  constructor(obj){
    this._data=obj;
    this.updateHandler=[];
    this.listenList=[];
  }
  getData(key){
    return this._data[key]||this._data;
  }
  update(key,dataOrFunc){
    const keys=Object.keys(this._data);
    const Event={
      update:true,
      stopUpdate(){
        this.update=false;
      }
    }
    if(keys.indexOf(key)>-1){
      if(typeof(dataOrFunc)=="function"){
        const resultData=dataOrFunc(this._data[key],this._data);  
        if(resultData===undefined){
          console.warn("update 函数需要返回值. ")
        }else{
          this._data[key]=resultData;
        }
      }else{
        this._data[key]=dataOrFunc;
      }
      if(Event.update&&this.listenList&&this.listenList.indexOf(key)>-1){
        const promiseAry=this.updateHandler.map((item,index)=>{
          if(typeof(item)==="function"){
            return item(key,this._data[key])
          };
          return false;
        });
        return Promise.all(promiseAry);
      }
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
  _contextDataHandler=(key,data)=>{
    const watchList=this.watchList;
      let p=new Promise((resolve,rejuect)=>{ 
        if(watchList.indexOf(key)>-1){
          const state={}
          state[key]=data;
          if(this.isDidmount){
             this.setState(state,()=>{ 
               resolve({watchList:watchList,status:"updated",value:this.state[key]});
             });
          }
        }else{
            resolve({watchList:watchList,status:"ignore"});
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
  return (Component)=>getWatchComponent(Component,watchList,mapActionToProps);
}