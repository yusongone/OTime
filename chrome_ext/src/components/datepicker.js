import React from "react"
import ReactDOM from "react-dom"

import {CountDown} from "../components/countDown/index"
import {TargetTime} from "../components/targetTime/index"

export default {
  open(date,saveHander){
    const div=document.createElement("div");
    div.className="datepickerBox"
    document.body.appendChild(div);

    const cd=(
      <TargetTime
        date={date}
        onSave={(item)=>{
          saveHander(item);
          div.remove();
        }}

        onCancel={()=>{
          div.remove();
        }}
       />
      
      /*
      <CountDown onChange={function(obj){
        console.log(obj);
      }} />
      */
    );
    ReactDOM.render(cd,div);
  }
};
