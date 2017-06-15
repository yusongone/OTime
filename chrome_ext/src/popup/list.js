import React from "react";
import {watch} from "../reDot"

import Editor from 'draft-js-plugins-editor';
import { EditorState,convertToRaw,createWithContent,convertFromRaw} from 'draft-js';
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';
//import "../css/prism.css"
//import "draft-js/dist/Draft.css"

const t={"entityMap":{},"blocks":[{"key":"4j5d1","text":"abc","type":"header-one","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"7o6n5","text":"console.log(\"abcd\");","type":"code-block","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{"language":"js"}},{"key":"53ebj","text":"adf","type":"unordered-list-item","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}

console.log(createMarkdownShortcutsPlugin());
class MyEditor extends React.Component{
  constructor(p,c){
    super(p,c);
    const contentState=convertFromRaw(t);
    this.state={
      editorState:EditorState.createWithContent(contentState)
    }
  }
  onChange=(editorState)=>{
    //console.log(convertFromRaw(editorState.getCurrentContent()));
    const contentState=editorState.getCurrentContent();
    const Raw=JSON.stringify(convertToRaw(contentState));
    console.log(Raw);
    this.setState({
      editorState:editorState
    });
  }
  render(){
    return (
      <Editor 
        plugins={[createMarkdownShortcutsPlugin(),function(a,b,c){console.log(a,b,c)}]}
        editorState={this.state.editorState} 
        onChange={this.onChange} />
    )
  }
}

class List extends React.Component{
  constructor(p,c){
    super(p,c);
    this.state={
      value:"afe"
    }

  }
  onChange=(val)=>{
    console.log(val);

  }
  onBlur=()=>{
    console.log("abc");
  }
  render(){
    return (
      <div className="sandBox">
        <div className="statusBar" ></div>
        <div className="summary" >
          <MyEditor />
        </div>
      </div>
    );
  }
}

class CreateSand extends List{
  constructor(p,c){
    super(p,c)
    this.type="createBox";
  }
}

class Lists extends React.Component{
  render(){
    const {showAddBox,TimeList}=this.props;
    let CS=null;
    if(showAddBox){
      CS=<CreateSand />
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