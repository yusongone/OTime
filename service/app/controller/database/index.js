var MongoClient = require('mongodb').MongoClient;

const connectedDatabase={};

const otimeUrl='mongodb://localhost:27017/otime';


exports.getDB=()=>{
  return new Promise((resolve,reject)=>{
    if(connectedDatabase["otime"]){
      resolve(connectedDatabase["otime"]);
    }else{
      MongoClient.connect(otimeUrl,(err,db)=>{
        console.log(err);
        if(err){
          reject(err);
        }else{
          connectedDatabase["otime"]=db;
          resolve(connectedDatabase["otime"]);
        }
      });
    }
  });
}