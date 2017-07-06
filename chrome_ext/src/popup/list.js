import React from "react";
import {watch} from "../reDot"
import Datepicker from "../components/datepicker"
import {getDayHoursMinute} from "../tools/common"


import { mdToDraftjs, draftjsToMd } from 'draftjs-md-converter';
import { focus,Editor ,EditorState,convertToRaw,createWithContent,convertFromRaw,ContentState} from 'draft-js';
import ColorPicker from "../components/colorPicker/index"

function findBigestVector(ary){
  let max=0;
  let preSum=0;
  ary.forEach(function(item,index){
    if(item<0||index==ary.length-1){
      max=Math.max(max,preSum);
    }
    preSum+=item;
    preSum<0&&(preSum=0);
  });
  return max;
}

class MyEditor extends React.Component{
  constructor(p,c){
    super(p,c);
    this.state={
      readOnly:true,
      mdText:"",
      textLength:0,
      editorState:EditorState.createEmpty()
    }
    if(p.value){
      const md=mdToDraftjs(p.value);
      let b=convertFromRaw(md);
      this.state.editorState=EditorState.createWithContent(b);
      this.state.mdText=p.value;
      this.state.textLength=p.value.length;
    }
  }

  onChange=(editorState)=>{
    const contentState=this.state.editorState.getCurrentContent();
    const text=contentState.getPlainText();
    this.setState({
      editorState:editorState,
      textLength:text.length
    });
  }

  toEdit=()=>{
    let b=ContentState.createFromText(this.state.mdText);
    this.setState({
      editorState:EditorState.createWithContent(b),
      readOnly:false
    },()=>{
      this.node.focus();
    });
  }
  toRead=()=>{
    const contentState=this.state.editorState.getCurrentContent();
    const text=contentState.getPlainText();
    const md=mdToDraftjs(text);
    let b=convertFromRaw(md);

    this.setState({
      editorState:EditorState.createWithContent(b),
      mdText:text,
      readOnly:true,
      textLength:text.length
    },()=>{
      this.props.onChange(text)
    });
  }
  
  changeEditorStatus=()=>{
    const RO=!this.state.readOnly
    if(RO){
      this.toRead();
    }else{
      this.toEdit();
    }
  }
  
  render(){
    const editorIcon=this.state.readOnly?
    <i className="fa fa-pencil-square-o icon" aria-hidden="true"></i>
    :<i className="fa fa-floppy-o icon" aria-hidden="true"></i>;

    return (
      <div className="summary" >
        <Editor 
          ref={(node)=>{
            this.node=node;
          }}
          readOnly={this.state.readOnly}
          editorState={this.state.editorState} 
          //onBlur={this.toRead}
          onChange={this.onChange} />
          <div className="textLength">{this.state.textLength}</div>
          <div className="editorStatus" onClick={this.changeEditorStatus}>{editorIcon}</div>
      </div>
    )
  }
  componentDidMount(){
    if(!this.state.mdText){
      this.toEdit();
    }
  }
}
class ClockBar extends React.Component{
  constructor(p,c){
    super(p,c);
    this.state={
      createTime:new Date().getTime(),
      scale:0
    }
  }
  componentWillReceiveProps(newProps){
    if(newProps.remindTime!=this.props.remindTime){
      const nowTime=new Date().getTime();
      this._parseScale(nowTime);
    }
  }
  _parseScale=(nowTime)=>{
    const {remindTime,updateRemindTime}=this.props;
    let scale=0;
    if(nowTime>=remindTime){
      scale=1;
    }else if(remindTime&&updateRemindTime){
      scale=(nowTime-updateRemindTime)/(remindTime-updateRemindTime);
    }
    this.setState({
      scale,
      createTime:nowTime
    });
  }
  setInterval=()=>{
    const {remindTime,updateRemindTime}=this.props;
    const nowTimestamp=new Date().getTime();
    if(remindTime&&remindTime>nowTimestamp){
      this._parseScale(nowTimestamp);
      this.interval=setInterval(()=>{
        this._parseScale(new Date().getTime());
      },5000);
    }
  }
  componentDidMount(){
    this.setInterval();
  }
  componentWillUnmount(){
    if(this.interval){
      clearInterval(this.interval);
    }
  }
  render(){
    const {remindTime,updateRemindTime}=this.props;
    const nowTimestamp=new Date().getTime();
    const scale=this.state.scale;
    const width=scale*100;
    let r=0,g=0;
    r=parseInt(scale*255*2);
    if(scale>=0.5){
      r=255;
      g=parseInt((1-scale)*255);
    }else{
      g=255;
    }
    const bg="rgb("+r+","+g+",0)"

    let timerInfo=<div className="remainText" >提醒</div>;
    let progressBoxClass="progressBox hide";
    if(remindTime&&remindTime>nowTimestamp){
      const DHM=getDayHoursMinute(remindTime-nowTimestamp);
      timerInfo=<div className="remainText warn" >剩余: {DHM.text} <div> 完成</div></div>;
      progressBoxClass="progressBox";
    }else if(remindTime&&remindTime<nowTimestamp){
      const overdueTime=getDayHoursMinute(nowTimestamp-remindTime);
      timerInfo=<div className="remainText alert" >已经过期: {overdueTime.text} <div> 完成</div></div>;
    }

    return (
      <div className="clockBar" onClick={()=>{
        Datepicker.open(remindTime?new Date(remindTime):null,(obj)=>{
          this.setInterval();
          this.props.onChange(obj.getTime())
        });
      }}>
        <div className={progressBoxClass} ref={(progressBar)=>{
          this.progress=progressBar;
          }}>
          <div className="progress" style={{width:width+"%",background:bg}}>
          </div>
        </div>
        {timerInfo}
      </div>
    )
  }
}

class List extends React.Component{
  constructor(p,c){
    super(p,c);
  }

  textChange=(value)=>{
    const data={...this.props.data};
    data.text=value;
    data.lastEditTime=new Date().getTime();
    this.onChange(data);
  }

  clockChange=(value)=>{
    const data={...this.props.data};
    data.remindTime=value;
    data.updateRemindTime=new Date().getTime();
    this.onChange(data);
  }
  onChange=(data)=>{
    this.props.onChange(data);
  }
  typeChange=(value)=>{
    const data={...this.props.data};
    data.noteType=value;
    this.onChange(data);
  }

  render(){
    const {remindTime,updateRemindTime,lastEditTime,noteType}=this.props.data;
    const date=new Date(lastEditTime);
    const updateTimer=date.toLocaleDateString()+" "+date.toLocaleTimeString(); 
    return (
      <div className="sandBox">
        <div className="statusBar" >
          <ClockBar remindTime={remindTime} updateRemindTime={updateRemindTime} onChange={this.clockChange} />
        </div>
        <MyEditor 
          onChange={this.textChange} 
          value={this.props.data.text}
          />
        <div className="updateTime">{updateTimer}</div>  
        <div className="tag">
          <ColorPicker onChange={this.typeChange} value={noteType}/>
        </div>
      </div>
    );
  }
}

class Lists extends React.Component{
  constructor(p,c){
    super(p,c);
  }
  render(){
    const {showAddBox,TimeList,onChange}=this.props;
    const nowTimestamp=new Date().getTime();
    let CS=null;

    if(showAddBox){
      CS=<List onChange={(obj)=>{
          const nowTimestamp=new Date().getTime();
          if(!obj.createTime){
            obj.createTime=nowTimestamp;
          }
          onChange(obj);
        }} data={{}}/>
    }

    let filterAry;
    const overdueAry=[],countDownAry=[],lastEditAry=[];
    TimeList.forEach((item)=>{
      if(item.remindTime&&item.remindTime>nowTimestamp){
        countDownAry.push(item);
      }else if(item.remindTime&&item.remindTime<nowTimestamp){
        overdueAry.push(item);
      }else{
        lastEditAry.push(item);
      }
    });
    overdueAry.sort((a,b)=>{
      const bool=parseInt(a.remindTime)>parseInt(b.remindTime);
      return bool;
    });
    countDownAry.sort((a,b)=>{
      const bool=parseInt(a.remindTime||0)>parseInt(b.remindTime||0);
      return bool;
    });
    lastEditAry.sort((a,b)=>{
      return parseInt(a.lastEditTime)<parseInt(b.lastEditTime);
    });
    filterAry=overdueAry.concat(countDownAry).concat(lastEditAry);

    const Map=filterAry.map(function(item,index){
      return <List key={item.id} onChange={onChange} data={item} />
    });

     
    return (
      <div className="noteList">
        {CS}
        {Map}
      </div>
    )
  }
}


export default watch(["TimeList","showAddBox"])(Lists);