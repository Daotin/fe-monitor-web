import{M as s}from"./index-DEoX-3sF.js";const n=s("app",{state:()=>({appId:"default-app-id",timeRange:"7days",startTime:"",endTime:""}),getters:{getAppId:e=>e.appId,getTimeRange:e=>e.timeRange,getStartTime:e=>e.startTime,getEndTime:e=>e.endTime},actions:{setAppId(e){this.appId=e},setTimeRange(e){this.timeRange=e,this.updateTimeRange()},updateTimeRange(){const e=new Date,a=new Date(e);let t=new Date(e);switch(this.timeRange){case"today":t.setHours(0,0,0,0);break;case"yesterday":t.setDate(t.getDate()-1),t.setHours(0,0,0,0),a.setDate(a.getDate()-1),a.setHours(23,59,59,999);break;case"7days":t.setDate(t.getDate()-7);break;case"30days":t.setDate(t.getDate()-30);break;case"90days":t.setDate(t.getDate()-90);break;default:t.setDate(t.getDate()-7)}this.startTime=t.toISOString(),this.endTime=a.toISOString(),console.log("时间范围已更新:",{timeRange:this.timeRange,startTime:this.startTime,endTime:this.endTime})}}});export{n as u};
