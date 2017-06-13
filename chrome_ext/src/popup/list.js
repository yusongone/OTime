import React from "react";
import {watch} from "../reDot"

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