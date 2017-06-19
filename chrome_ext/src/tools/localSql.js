
class Connect{

  static _wirteObjToLocalStorage=()=>{

  }

  __cache=null
  constructor(dbName){
    if(localStorage[dbName]!=undefined){
      try{
        const json=JSON.parse(localStorage[dbName]);
      }catch(e){
        console.warn("不能解析成SQL格式!");
      }
    }else{
        console.warn("没有找到对应的数据库!");
    }
  }
}


const SQL={

  _dbName:null,

  createDB(dbName){
    if(!localStorage[dbname]){

    }
  },

  open(dbName){
    const connect=new Connect(db);
    if(connect){

    }
  }
}


export default SQL;