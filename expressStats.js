var moment=require('moment');

class expressStats{


    stats(req,res,next){
        let requestCount=0;
        let requstResMap=new Map();
        let startTime
        let lastTime;
        let finishedReq=0;
        let totalTime=0;
        let max_responseTime=0;
        return (req,res,next)=>{
            requestCount++;
            
            let wrapper={
               "res":res,
               "startTime":moment() 
            };

            requestResMap.set(res,wrapper);

            res.on('finish',()=>{
                finishedReq++;
                let correspondingWrapperObj=requestResMap.get(res);
                let curr_time=moment();
                let responseTime=curr_time.diff(correspondingWrapperObj.startTime,'milliseconds');
                if(max_responseTime<=responseTime)max_responseTime=responseTime;
                console.log('current request Time',responseTime);
                console.log('current request Count',responseTime);
                console.log('max request Time',max_responseTime);
               

            });


        };



    }
    
}