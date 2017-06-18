import React from "react";
import {watch} from "../reDot"

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
    console.log(text.length);

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
    const className=this.state.readOnly?"editorStatus":"editorStatus readOnly";
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
          <div className={className} onClick={this.changeEditorStatus}></div>
      </div>
    )
  }
  componentDidMount(){
    if(!this.state.mdText){
      this.toEdit();
    }
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

  render(){
    return (
      <div className="sandBox">
        <div className="statusBar" ></div>
        <MyEditor 
          onChange={this.textChange} 
          value={this.props.data.text}
          />
      </div>
    );
  }
}

class Lists extends React.Component{
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