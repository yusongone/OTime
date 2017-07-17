import React from "react";
import {watch} from "../reDot"

class _TopBar extends React.Component{
  add=()=>{
    this.props.setData("showAddBox",true);
  }
  render(){
    return (
      <div className="topBar">
        <div className="topToolsBar">
          <div className="topLeft">
            <div className="syncTime">
              登录后可同步到云端
            </div>
          </div>
          <div className="topRight">
            <div className="set">
              设置
            </div>
            <div className="login">
              登录
            </div>
          </div>
        </div>
        <div className="btn primary" onClick={this.props.onAdd}> 
          <i className="fa fa-plus" aria-hidden="true"></i> 新建 
        </div>
        <div className="doneListLink"></div>
      </div>
    )
  }
}

export default watch([])(_TopBar);