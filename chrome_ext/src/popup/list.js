import React from "react";
import {watch} from "../reDot"
import Datepicker from "../components/datepicker"


import { mdToDraftjs, draftjsToMd } from 'draftjs-md-converter';
import { focus,Editor ,EditorState,convertToRaw,createWithContent,convertFromRaw,ContentState} from 'draft-js';

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
    const {remindTime,resetTime}=this.props;
    let scale=0;
    if(nowTime>=remindTime){
      scale=1;
    }else if(remindTime&&resetTime){
      scale=(nowTime-resetTime)/(remindTime-resetTime);
    }
    this.setState({
      scale,
      createTime:nowTime
    });
  }
  componentDidMount(){
    setInterval(()=>{
      this._parseScale(new Date().getTime());
    },2000);
  }
  render(){
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

    return (
      <div className="clockBar" onClick={()=>{
        Datepicker.open((obj)=>{
          this.props.onChange(obj.getTime())
        });
      }}>
        <div className="remainText" >剩余: 1天，23小时，3分钟 </div>
        <div className="progressBox" ref={(progressBar)=>{
          this.progress=progressBar;
          }}>
          <div className="progress" style={{width:width+"%",background:bg}}>
          </div>
        </div>
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
    this.props.onChange(data);
  }

  clockChange=(value)=>{
    const data={...this.props.data};
    data.remindTime=value;
    data.resetTime=new Date().getTime();
    this.props.onChange(data);
  }

  render(){
    const {remindTime,resetTime}=this.props.data;
    return (
      <div className="sandBox">
        <div className="tag"></div>
        <div className="statusBar" >
          <ClockBar remindTime={remindTime} resetTime={resetTime} onChange={this.clockChange} />
        </div>
        <MyEditor 
          onChange={this.textChange} 
          value={this.props.data.text}
          />
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
    let CS=null;

    if(showAddBox){
      CS=<List onChange={onChange} data={{}}/>
    }

    const Map=TimeList.map(function(item,index){
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