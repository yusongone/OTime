import React from "react"
import ReactDOM from "react-dom"

function getComponent(props){
  return (
        <div className="deleteDiv">
          <div className="title">确认删除？</div>
          <div className="btnBox">
            <div className="btn primary small" onClick={props.onOk}>确认</div>
            <div className="btn small"  onClick={props.onCancel}>取消</div>
            </div>
        </div>
  );
}
export default {
  appendTo(box){
    let handler;
    const div=document.createElement("div");
    div.className="deleteOverflow"
    box.appendChild(div);
    const Com=getComponent({
      onOk(){
        div.remove();
        handler({
          action:true
        });
      },
      onCancel(){
        div.remove();
        handler({
          action:false
        });
      }
    });
    ReactDOM.render(Com,div);

    return (_handler)=>{
      handler=_handler;
    }
  }
}