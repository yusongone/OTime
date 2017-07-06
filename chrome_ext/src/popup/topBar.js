import React from "react";
import {watch} from "../reDot"

class _TopBar extends React.Component{
  add=()=>{
    this.props.setData("showAddBox",true);
  }
  render(){
    return (
      <div className="topBar">
        <div className="btn addTimeBtn" onClick={this.props.onAdd}> 
          <i className="fa fa-plus" aria-hidden="true"></i> 新建 
        </div>
        <div className="tabBox">
          <div className="tabItem"><input type="checkBox" /> 全部</div>
          <div className="tabItem"><input type="checkBox"/>过期</div>
          <div className="tabItem"><input type="checkBox"/>等待</div>
          <div className="tabItem"><input type="checkBox"/>无提醒</div>
        </div>
        <div className="doneListLink"></div>
      </div>
    )
  }
}

export default watch([])(_TopBar);