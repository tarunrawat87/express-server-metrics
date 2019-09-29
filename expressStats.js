var moment=require('moment');
var EventEmitter=require('events');

class expressStats{
constructor(){
   this.emitter=new EventEmitter();
    
}

    stats(req,res,next){
        let requestCount=0;
        let requstResMap=new Map();
        let startTime
        let lastTime;
        let finishedReq=0;
        let totalTime=0;
        let max_responseTime=0;
        let highestReqPerSec=0;
        let statusCodeMap=new Map();
        let serverStartTime=moment();        
        return (req,res,next)=>{
            requestCount++;
            
            let wrapper={
               "res":res,
               "startTime":moment() 
            };

            requstResMap.set(res,wrapper);

            res.on('finish',()=>{
                finishedReq++;
                let correspondingWrapperObj=requstResMap.get(res);
                let curr_time=moment();
                let responseTime=curr_time.diff(correspondingWrapperObj.startTime,'milliseconds');
                let curr_reqts=requestCount-finishedReq;
                let time_diff=curr_time.diff(serverStartTime,"seconds");
                let reqperSec=finishedReq/time_diff;
                if(!isFinite(reqperSec))reqperSec=0; 
                if(isFinite(reqperSec)&&highestReqPerSec<reqperSec)highestReqPerSec=reqperSec;

                if(max_responseTime<=responseTime)max_responseTime=responseTime;
                console.log('current request Time',responseTime);
                console.log('current request Count',finishedReq);
                console.log('max request Time',max_responseTime);
                console.log('reqpersec ',reqperSec);
                console.log('highest req per sec',highestReqPerSec);
                console.log(statusCodeMap);
                if(statusCodeMap.has(res.statusCode)==true){
                    statusCodeMap.set(res.statusCode,statusCodeMap.get(res.statusCode)+1);
                }else{
                    statusCodeMap.set(res.statusCode,1);
                }
                console.log('**************************************');

            });

                next();
        };



    }
    
}

module.exports=new expressStats();