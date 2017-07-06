import React from "react"
import "./style.less"
const color={"A":"#DC0000","B":"#EB8A00","C":"#FFDB00","D":"#448500","null":"#ddd"};
const str={"A":"紧急重要","B":"重要不紧急","C":"紧急不重要","D":"不重要不紧急"};

class Animation{
  constructor(time){
    let preTime;
    let useTime=0;
    const t=new Date().getTime();
    this.time=time;
    this.frameHandler=[];
    this.startHandler=[];
    this.endHandler=[];
    this.isStop=false;
    const animation=()=>{
      requestAnimationFrame((a)=>{
        if(!preTime){
          preTime=a;
          this.startHandler.forEach((item)=>{
            item(frameTime);
          });
          return animation();
        }
        let frameTime=a-preTime;
        preTime=a;
        useTime+=frameTime;

        if(useTime<time&&!this.isStop){
          this.frameHandler.forEach((item)=>{
            item(frameTime);
          });
          animation();
        }else if(!this.isStop){
          this.endHandler.forEach((item)=>{
            item(frameTime);
          });
        }
      })
    }
    this._animation=animation;
    if(time>0){
      animation();
    }
  }
  start(fn){
    this.startHandler.push(fn);
    return this;
  }
  frame(fn){
    this.frameHandler.push(fn);
    return this;
  }
  end(fn){
    this.endHandler.push(fn);
    return this;
  }
  stop(){
    this.isStop=true;
  }
}

class Color{
  constructor(box,name){
    
    this.startPosition=[50,50];
    this.targetPosition=[0,0];
    this.position=[];
    this.an=null;

    this.body=document.createElement("div");
    this.body.className="picker "+name;
    this.body.title=str[name]||"";
    this.setColor(color[name]);

    this.body.addEventListener("click",()=>{
      this.clickHandler(name)
    });

    box.append(this.body);
    this.setPosition(50,50);
  }
  show(){
    this.body.style.display="block";
  }
  hide(){
    this.body.style.display="none";
  }
  onClick(handler){
    this.clickHandler=handler;
  }
  setPosition(x,y){
      this.body.style.left=x+"%";
      this.body.style.top=y+"%";
      this.position[0]=x;
      this.position[1]=y;
  }
  target(x,y){
    this.targetPosition=[x,y];
    return this;
  }
  setColor(color){
    console.log(color);
    this.body.style.background=color;
  }
  animation(Animation){
    console.log("-----");
    this.an?this.an.stop():"";
    const time=Animation.time;
    const xStep=(this.targetPosition[0]-this.position[0])/time;
    const yStep=(this.targetPosition[1]-this.position[1])/time;
    this.an=Animation;
    Animation.frame((frameTime)=>{
      const x=this.position[0]+(frameTime*xStep);
      const y=this.position[1]+(frameTime*yStep);
      this.setPosition(x,y);
    }).end(()=>{
      this.setPosition(this.targetPosition[0],this.targetPosition[1]);
    });
    return this;
  }
}


class Picker{
  constructor(box,onPick){
    this.box=box;
    this.A=new Color(this.box,"A");
    this.B=new Color(this.box,"B");
    this.C=new Color(this.box,"C");
    this.D=new Color(this.box,"D");
    this.A.onClick(onPick);
    this.B.onClick(onPick);
    this.C.onClick(onPick);
    this.D.onClick(onPick);
    this.center=new Color(this.box,"center")
    this.center.setPosition(75,25);
    this.A.setPosition(75,25);
    this.B.setPosition(75,25);
    this.C.setPosition(75,25);
    this.D.setPosition(75,25);
    this.center.body.addEventListener("mouseover",()=>{
      this.unfold();
    },false);
    this.fold();
  }
  setType(type){
    this.center.setColor(color[type]);
  }
  fold(){
    console.log("fold");
    const A=new Animation(200);
    A.end(()=>{
      this.A.hide();
      this.B.hide();
      this.C.hide();
      this.D.hide();
      this.center.show();
    });
    this.A.target(75,25).animation(A);
    this.B.target(75,25).animation(A);
    this.C.target(75,25).animation(A);
    this.D.target(75,25).animation(A);
    this.center.target(75,25).animation(A);
  }
  unfold(){
    console.log("unfold");
    const A=new Animation(100);
    A.start(()=>{
      this.A.show();
      this.B.show();
      this.C.show();
      this.D.show();
      this.center.hide();
    })
    this.A.target(25,25).animation(A);
    this.B.target(75,25).animation(A);
    this.C.target(25,75).animation(A);
    this.D.target(75,75).animation(A);
    this.center.target(50,50).animation(A);
  }

}

export default class _ extends React.Component{
  constructor(p,c){
    super(p,c);
    this.state={
      type:p.value||"null"
    }
  }
  componentDidMount(){
    this.picker=new Picker(this.body,(type)=>{
      this.setState({
        type
      },()=>{
        this.props.onChange?this.props.onChange(type):"";
        this.picker.fold();
        if(!this.props.value){
          this.picker.setType(this.state.type);
        }
      });
    });
    this.picker.setType(this.state.type);
  }
  componentWillReceiveProps(newProps){
    if(newProps.value!=undefined&&newProps.value!=this.props.value){
      this.setState({
        type:newProps.value
      },()=>{
        this.picker.setType(this.state.type);
      });
    }
  }
  trigger=()=>{
  }
  render(){
    return (
      <div className="colorPicker" 
        ref={(body)=>{
          this.body=body;
        }}
        onMouseLeave={()=>{this.picker.fold()}}
        >
      </div>
    )
  }
}