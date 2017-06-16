import React from "react";
import {watch} from "../reDot"

import { mdToDraftjs, draftjsToMd } from 'draftjs-md-converter';
import { Editor ,EditorState,convertToRaw,createWithContent,convertFromRaw,ContentState} from 'draft-js';

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
    /*
     const md=mdToDraftjs("# abc");
     let b=convertFromRaw(md);
      editorState:EditorState.createWithContent(b),
      */
    this.state={
      readOnly:true,
      mdText:"",
      editorState:EditorState.createEmpty()
    }
  }

  onChange=(editorState)=>{
    this.setState({
      editorState:editorState
    });
  }

  toEdit(){
    let b=ContentState.createFromText(this.state.mdText);
    this.setState({
      editorState:EditorState.createWithContent(b),
      readOnly:false
    });
  }
  toRead(){
    const contentState=this.state.editorState.getCurrentContent();
    const text=contentState.getPlainText();
    const md=mdToDraftjs(text);
    let b=convertFromRaw(md);
    this.setState({
      editorState:EditorState.createWithContent(b),
      mdText:text,
      readOnly:true
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
          readOnly={this.state.readOnly}
          editorState={this.state.editorState} 
          onChange={this.onChange} />
          <div className={className} onClick={this.changeEditorStatus}></div>
      </div>
    )
  }
}


class List extends React.Component{
  constructor(p,c){
    super(p,c);
  }
  render(){
    return (
      <div className="sandBox">
        <div className="statusBar" ></div>
        <MyEditor />
      </div>
    );
  }
}

class Lists extends React.Component{
  render(){
    const {showAddBox,TimeList}=this.props;
    let CS=null;
    if(showAddBox){
      CS=<List />
    }
    const Map=TimeList.map(function(item,index){
      return <List />

    });

     
    return (
      <div>
        {CS}
        {Map}
      </div>
    )
  }
}


export default watch(["TimeList","showAddBox"])(Lists);