const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./vendor-C47yNhyI.js","../css/vendor-4ESN5fw-.css"])))=>i.map(i=>d[i]);
import{q as sourceMapExports,r as errorStackParserExports}from"./vendor-C47yNhyI.js";import{a as ElMessage,d as edit_default,r as refresh_default,p as pointer_default,g as document_default,o as operation_default,l as link_default,m as mouse_default,h as calendar_default}from"./element-plus-ppjtjl3f.js";import{d as defineComponent,c as computed,l as ref,a2 as reactive,L as watch,h as createBlock,w as withCtx,r as resolveComponent,o as openBlock,V as withDirectives,aF as resolveDirective,b as createElementBlock,f as createVNode,e as createBaseVNode,k as createTextVNode,t as toDisplayString,F as Fragment,g as renderList,i as createCommentVNode,n as normalizeClass,Z as onUnmounted}from"./vue-vendor-DZbjFZat.js";import{_ as _export_sfc}from"./components-BPZC1Siq.js";import{_ as __vitePreload}from"./index-NbCe1alw.js";import"./lodash-S0Y0Up6J.js";import"./store-vendor-BzeCd7_m.js";import"./utils-PfC8a2su.js";const _hoisted_1$3={key:0,class:"error-detail-content"},_hoisted_2$3={class:"stack-section"},_hoisted_3$2={key:0,class:"parsed-stack"},_hoisted_4$2={class:"frame-content"},_hoisted_5$2={class:"frame-header"},_hoisted_6$1={class:"frame-number"},_hoisted_7$1={class:"frame-function"},_hoisted_8$1={class:"frame-location"},_hoisted_9={class:"file-link"},_hoisted_10={class:"line-column"},_hoisted_11={class:"frame-actions"},_hoisted_12={key:0,class:"source-code-container"},_hoisted_13={key:0,class:"source-code"},_hoisted_14={class:"line-number"},_hoisted_15={class:"line-content"},_hoisted_16={key:1,class:"parse-error"},_hoisted_17={key:2,class:"source-code-loading"},_hoisted_18={key:1,class:"original-stack"},_hoisted_19={key:2,class:"original-stack"},_hoisted_20={key:1,class:"error-empty"},_sfc_main$3=defineComponent({name:"ErrorDetailDialog",__name:"ErrorDetailDialog",props:{visible:{type:Boolean,default:!1},error:{type:Object,default:()=>({})}},emits:["update:visible"],setup(s,{emit:t}){const o=s,V=t,d=computed({get:()=>o.visible,set:a=>V("update:visible",a)}),_=ref(!1),m=reactive({}),l=ref([]),v=computed(()=>l.value&&l.value.length>0),h=computed(()=>o.error.stack);watch(()=>o.error,a=>{if(a)if(a.parsedStack&&a.parsedStack.length>0)l.value=a.parsedStack.map(e=>({...e,hasSourceMap:!1,parseError:!1}));else try{const e=new Error(a.message);e.stack=a.stack;const r=errorStackParserExports.parse(e);l.value=r.map(n=>({file:n.fileName||"",line:n.lineNumber||0,column:n.columnNumber||0,func:n.functionName||"(匿名函数)",hasSourceMap:!1,parseError:!1}))}catch(e){console.error("解析错误堆栈失败:",e),l.value=[]}},{immediate:!0});const c=async(a,e)=>{if(!a||!a.raw){ElMessage.warning("请选择有效的SourceMap文件");return}try{m[e]=!0,console.log(`处理第${e+1}行堆栈的SourceMap上传`);const r=l.value[e];if(!r)throw new Error("找不到对应的堆栈帧");const n={...r,hasSourceMap:!1,parseError:!1,sourceCode:void 0,originalFile:void 0,originalLine:void 0,originalColumn:void 0,sourceCodeStartLine:void 0},y=await g(a.raw),k=new sourceMapExports.SourceMapConsumer(JSON.parse(y));console.log("解析位置:",r.line,r.column);const u=k.originalPositionFor({line:r.line,column:r.column});if(console.log("原始位置:",u),u.source){const f={...n,hasSourceMap:!0,parseError:!1,originalFile:u.source,originalLine:u.line||0,originalColumn:u.column||0,func:u.name||r.func};try{const p=k.sourceContentFor(u.source);if(p){const N=p.split(`
`),i=Math.max(0,(u.line||1)-5),w=Math.min(N.length,(u.line||1)+5),b=N.slice(i,w).join(`
`);f.sourceCode=b,f.sourceCodeStartLine=i+1}else f.parseError=!0}catch(p){console.error("获取源代码失败:",p),f.parseError=!0}l.value[e]=f,f.parseError?ElMessage.warning(`第${e+1}行堆栈的源代码获取失败`):ElMessage.success(`第${e+1}行堆栈的SourceMap解析成功`)}else l.value[e]={...n,hasSourceMap:!0,parseError:!0},ElMessage.warning(`无法解析第${e+1}行堆栈，请检查SourceMap是否匹配`)}catch(r){console.error("解析SourceMap失败:",r),l.value[e]&&(l.value[e]={...l.value[e],hasSourceMap:!0,parseError:!0}),ElMessage.error("解析SourceMap失败")}finally{m[e]=!1}},g=a=>new Promise((e,r)=>{const n=new FileReader;n.onload=()=>e(n.result),n.onerror=r,n.readAsText(a)}),B=a=>{if(!a)return"(未知文件)";const e=a.split("/");return e[e.length-1]},C=()=>{d.value=!1};return(a,e)=>{const r=resolveComponent("el-descriptions-item"),n=resolveComponent("el-descriptions"),y=resolveComponent("el-button"),k=resolveComponent("el-upload"),u=resolveComponent("el-skeleton"),f=resolveComponent("el-empty"),p=resolveComponent("el-dialog"),N=resolveDirective("loading");return openBlock(),createBlock(p,{title:"错误详情",modelValue:d.value,"onUpdate:modelValue":e[0]||(e[0]=i=>d.value=i),width:"80%","destroy-on-close":"",onClose:C,class:"error-detail-dialog"},{default:withCtx(()=>[withDirectives((openBlock(),createElementBlock("div",null,[s.error?(openBlock(),createElementBlock("div",_hoisted_1$3,[createVNode(n,{title:"错误信息",column:1,border:""},{default:withCtx(()=>[createVNode(r,{label:"错误类型"},{default:withCtx(()=>[createTextVNode(toDisplayString(s.error.type),1)]),_:1}),createVNode(r,{label:"错误消息"},{default:withCtx(()=>[createTextVNode(toDisplayString(s.error.message),1)]),_:1}),createVNode(r,{label:"发生时间"},{default:withCtx(()=>[createTextVNode(toDisplayString(s.error.timestamp),1)]),_:1})]),_:1}),createBaseVNode("div",_hoisted_2$3,[e[7]||(e[7]=createBaseVNode("div",{class:"section-header"},[createBaseVNode("h3",null,"错误堆栈")],-1)),v.value?(openBlock(),createElementBlock("div",_hoisted_3$2,[(openBlock(!0),createElementBlock(Fragment,null,renderList(l.value,(i,w)=>(openBlock(),createElementBlock("div",{key:w,class:"stack-frame"},[createBaseVNode("div",_hoisted_4$2,[createBaseVNode("div",_hoisted_5$2,[createBaseVNode("div",_hoisted_6$1,toDisplayString(w+1),1),createBaseVNode("div",_hoisted_7$1,toDisplayString(i.func||"(匿名函数)"),1)]),createBaseVNode("div",_hoisted_8$1,[createBaseVNode("span",_hoisted_9,toDisplayString(B(i.file)),1),createBaseVNode("span",_hoisted_10,":"+toDisplayString(i.line)+":"+toDisplayString(i.column),1),createBaseVNode("div",_hoisted_11,[createVNode(k,{class:"sourcemap-uploader",action:"#","auto-upload":!1,limit:1,accept:".map,.json","show-file-list":!1,"on-change":b=>c(b,w)},{default:withCtx(()=>[createVNode(y,{size:"small",type:"primary",loading:m[w],disabled:i.hasSourceMap&&!i.parseError},{default:withCtx(()=>[createTextVNode(toDisplayString(i.hasSourceMap&&!i.parseError?"已解析":i.parseError?"重新上传":"上传SourceMap"),1)]),_:2},1032,["loading","disabled"])]),_:2},1032,["on-change"])])])]),i.hasSourceMap?(openBlock(),createElementBlock("div",_hoisted_12,[i.sourceCode&&!i.parseError?(openBlock(),createElementBlock("pre",_hoisted_13,[e[3]||(e[3]=createTextVNode("									")),(openBlock(!0),createElementBlock(Fragment,null,renderList(i.sourceCode.split(`
`),(b,x)=>(openBlock(),createElementBlock("code",{key:x,class:normalizeClass([{"error-line":i.originalLine===(i.sourceCodeStartLine||0)+x},"code-line"])},[e[1]||(e[1]=createTextVNode(`
`)),createBaseVNode("span",_hoisted_14,toDisplayString((i.sourceCodeStartLine||0)+x)+":",1),createBaseVNode("span",_hoisted_15,toDisplayString(b),1),e[2]||(e[2]=createTextVNode(`
									`))],2))),128)),e[4]||(e[4]=createTextVNode(`
								`))])):i.parseError?(openBlock(),createElementBlock("div",_hoisted_16,e[5]||(e[5]=[createBaseVNode("span",null,"解析失败：无法解析该堆栈位置的源代码，请检查SourceMap是否匹配，再重新上传",-1)]))):(openBlock(),createElementBlock("div",_hoisted_17,[createVNode(u,{rows:3})]))])):createCommentVNode("",!0)]))),128))])):h.value?(openBlock(),createElementBlock("div",_hoisted_18,[createBaseVNode("pre",null,toDisplayString(s.error.stack),1)])):(openBlock(),createElementBlock("div",_hoisted_19,e[6]||(e[6]=[createBaseVNode("span",null,"无堆栈信息",-1)])))])])):(openBlock(),createElementBlock("div",_hoisted_20,[createVNode(f,{description:"无错误详情数据"})]))])),[[N,_.value]])]),_:1},8,["modelValue"])}}}),ErrorDetailDialog=_export_sfc(_sfc_main$3,[["__scopeId","data-v-08c6cb3e"]]),_hoisted_1$2={key:0,class:"record-info"},_hoisted_2$2={class:"player-container-wrapper"},_sfc_main$2=defineComponent({__name:"RrwebPlayerDialog",props:{visible:{type:Boolean,default:!1},error:{type:Object,default:()=>({})}},emits:["update:visible"],setup(s,{emit:t}){const o=s,V=t,d=computed({get:()=>o.visible,set:e=>V("update:visible",e)}),_=ref(null),m=ref(null),l=ref(!1),v=computed(()=>o.error?{startTime:o.error.startTime,endTime:o.error.endTime,duration:o.error.duration,eventsCount:o.error.eventsCount}:null),h=e=>e?new Date(e).toLocaleString():"未知",c=e=>{if(!e)return"未知";const r=Math.floor(e/1e3);if(r<60)return`${r}秒`;const n=Math.floor(r/60),y=r%60;return`${n}分${y}秒`},g=computed(()=>{var e;return console.log("检查录屏数据:",o.error),((e=o.error)==null?void 0:e.events)&&o.error.events.length>0});watch(()=>d.value,async e=>{if(e&&g.value){l.value=!0;try{await new Promise(r=>setTimeout(r,100)),await B()}catch(r){console.error("初始化播放器失败:",r),ElMessage.error("初始化播放器失败")}finally{l.value=!1}}});const B=async()=>{if(!(!g.value||!_.value||!o.error))try{const e=await __vitePreload(()=>import("./vendor-C47yNhyI.js").then(n=>n.t),__vite__mapDeps([0,1]),import.meta.url);await __vitePreload(()=>import("./vendor-C47yNhyI.js").then(n=>n.u),__vite__mapDeps([0,1]),import.meta.url);const r=e.default;console.log("创建播放器，使用的录制数据:",o.error.events),a(),m.value=new r({target:_.value,props:{events:o.error.events,showController:!0,autoPlay:!1,width:_.value.clientWidth,height:Math.min(window.innerHeight*.6,600)}}),console.log("rrweb播放器初始化成功")}catch(e){throw console.error("初始化rrweb播放器失败:",e),e}},C=()=>{d.value=!1,a()},a=()=>{var e,r;m.value&&((r=(e=m.value).destroy)==null||r.call(e),m.value=null)};return onUnmounted(()=>{a()}),(e,r)=>{const n=resolveComponent("el-empty"),y=resolveComponent("el-dialog"),k=resolveDirective("loading");return openBlock(),createBlock(y,{title:"错误录屏回放",modelValue:d.value,"onUpdate:modelValue":r[0]||(r[0]=u=>d.value=u),width:"80%","destroy-on-close":"",onClose:C,class:"rrweb-player-dialog"},{default:withCtx(()=>[withDirectives((openBlock(),createElementBlock("div",null,[g.value?(openBlock(),createElementBlock(Fragment,{key:0},[v.value?(openBlock(),createElementBlock("div",_hoisted_1$2,[r[1]||(r[1]=createBaseVNode("p",null,[createBaseVNode("strong",null,"录制信息：")],-1)),createBaseVNode("p",null,"开始时间："+toDisplayString(h(v.value.startTime)),1),createBaseVNode("p",null,"结束时间："+toDisplayString(h(v.value.endTime)),1),createBaseVNode("p",null,"持续时间："+toDisplayString(c(v.value.duration)),1),createBaseVNode("p",null,"事件数量："+toDisplayString(v.value.eventsCount),1)])):createCommentVNode("",!0),createBaseVNode("div",_hoisted_2$2,[createBaseVNode("div",{ref_key:"playerContainer",ref:_,class:"player-container"},null,512)])],64)):l.value?createCommentVNode("",!0):(openBlock(),createBlock(n,{key:1,description:"暂无会话录屏数据"},{description:withCtx(()=>r[2]||(r[2]=[createBaseVNode("p",null,"该错误事件未包含会话录屏数据",-1),createBaseVNode("p",{class:"empty-tip"},"提示: 确保SDK配置中启用了rrweb插件，并设置了适当的录制模式",-1)])),_:1}))])),[[k,l.value]])]),_:1},8,["modelValue"])}}}),RrwebPlayerDialog=_export_sfc(_sfc_main$2,[["__scopeId","data-v-9fa922e3"]]),_hoisted_1$1={class:"behavior-header"},_hoisted_2$1={class:"stack-info"},_hoisted_3$1={class:"behavior-item"},_hoisted_4$1={class:"behavior-type"},_hoisted_5$1={class:"behavior-detail"},_sfc_main$1=defineComponent({__name:"BehaviorStackDialog",props:{visible:{type:Boolean,default:!1},error:{type:Object,default:()=>({})}},emits:["update:visible"],setup(s,{emit:t}){const o=s,V=t,d=computed({get:()=>o.visible,set:a=>V("update:visible",a)}),_=ref(!1),m=computed(()=>!o.error||Object.keys(o.error).length===0?"未传入行为栈数据":o.error.type!=="behavior"||o.error.subType!=="stack"?"数据格式不匹配，需要behavior.stack类型的行为栈数据":!o.error.actions||!Array.isArray(o.error.actions)||o.error.actions.length===0?"行为栈中不包含任何行为记录":"暂无用户行为记录"),l=computed(()=>(console.log("接收到的数据:",o.error),o.error&&o.error.type==="behavior"&&o.error.subType==="stack"&&o.error.actions&&Array.isArray(o.error.actions)&&o.error.actions.length>0)),v=computed(()=>{if(!l.value)return[];const a=[...o.error.actions];return console.log("处理行为数据，数量:",a.length),a.sort((e,r)=>e.timestamp-r.timestamp)}),h=a=>({click:"primary",input:"success",pageChange:"warning",navigation:"warning",api:"danger",pageview:"info",scroll:"",resize:"",keypress:"success",error:"danger"})[a]||"",c=a=>({click:mouse_default,input:edit_default,pageChange:link_default,navigation:link_default,api:operation_default,pageview:document_default,scroll:pointer_default,resize:refresh_default,keypress:edit_default,error:"CircleClose"})[a]||calendar_default,g=a=>a?new Date(a).toLocaleString():"",B=a=>{console.log("获取行为详情:",a);const e=a.data||a;switch(a.type==="behavior"?a.subType:a.type){case"click":return`点击了 ${e.target||"元素"} ${e.content?`"${e.content}"`:""} ${e.position?`位置(${e.position.x}, ${e.position.y})`:""}`;case"input":return`在 ${e.target||"输入框"} 中输入内容 ${e.content?`"${e.content}"`:""}`;case"pageChange":case"navigation":return`从 ${e.from||e.fromPath||"未知页面"} 导航到 ${e.to||e.toPath||"未知页面"} ${e.changeType?`(${e.changeType})`:""}`;case"api":return`${e.method||"GET"} 请求 ${e.url||"未知接口"} ${e.status?`状态码: ${e.status}`:""}`;case"pageview":return`访问页面 ${e.pageUrl||"未知页面"}`;case"scroll":return`滚动到位置 ${e.position?`(${e.position.x}, ${e.position.y})`:"未知位置"}`;case"keypress":return`按键 ${e.key||"未知按键"}`;case"error":return`发生错误: ${e.message||"未知错误"} ${e.stack?"（详细堆栈信息已记录）":""}`;default:return JSON.stringify(e)}},C=()=>{d.value=!1};return(a,e)=>{const r=resolveComponent("el-tag"),n=resolveComponent("el-timeline-item"),y=resolveComponent("el-timeline"),k=resolveComponent("el-empty"),u=resolveComponent("el-dialog"),f=resolveDirective("loading");return openBlock(),createBlock(u,{title:"用户行为记录",modelValue:d.value,"onUpdate:modelValue":e[0]||(e[0]=p=>d.value=p),width:"80%","destroy-on-close":"",onClose:C,class:"behavior-stack-dialog"},{default:withCtx(()=>[withDirectives((openBlock(),createElementBlock("div",null,[l.value?(openBlock(),createElementBlock(Fragment,{key:0},[createBaseVNode("div",_hoisted_1$1,[createBaseVNode("div",_hoisted_2$1,[createBaseVNode("p",null,"行为栈ID: "+toDisplayString(o.error.stackId),1),createBaseVNode("p",null,"关联错误ID: "+toDisplayString(o.error.errorId),1),createBaseVNode("p",null,"行为数量: "+toDisplayString(o.error.count),1)])]),createVNode(y,null,{default:withCtx(()=>[(openBlock(!0),createElementBlock(Fragment,null,renderList(v.value,(p,N)=>(openBlock(),createBlock(n,{key:N,type:h(p.subType),icon:c(p.subType),timestamp:g(p.timestamp),size:"large"},{default:withCtx(()=>[createBaseVNode("div",_hoisted_3$1,[createBaseVNode("div",_hoisted_4$1,[createVNode(r,{size:"small",type:h(p.subType)},{default:withCtx(()=>[createTextVNode(toDisplayString(p.subType),1)]),_:2},1032,["type"])]),createBaseVNode("div",_hoisted_5$1,toDisplayString(B(p)),1)])]),_:2},1032,["type","icon","timestamp"]))),128))]),_:1})],64)):_.value?createCommentVNode("",!0):(openBlock(),createBlock(k,{key:1,description:"暂无用户行为记录"},{description:withCtx(()=>[createBaseVNode("p",null,toDisplayString(m.value),1),e[1]||(e[1]=createBaseVNode("p",{class:"empty-tip"},"提示: 确保传入正确格式的用户行为栈数据",-1))]),_:1}))])),[[f,_.value]])]),_:1},8,["modelValue"])}}}),BehaviorStackDialog=_export_sfc(_sfc_main$1,[["__scopeId","data-v-4f865d5c"]]),_hoisted_1={class:"demo-container"},_hoisted_2={class:"error-trigger-section"},_hoisted_3={class:"error-buttons"},_hoisted_4={class:"behavior-test-section"},_hoisted_5={class:"behavior-buttons"},_hoisted_6={class:"form-group"},_hoisted_7={class:"history-buttons"},_hoisted_8={class:"error-list-section"},_sfc_main=defineComponent({__name:"index",setup(__props){const errorList=ref([]),currentError=ref(null),errorDetailVisible=ref(!1),rrwebPlayerVisible=ref(!1),behaviorStackVisible=ref(!1),formData=reactive({input:"",password:"",textArea:""}),triggerTypeError=()=>{null.nonExistentMethod()},triggerReferenceError=()=>{console.log(undefinedVariable)},triggerSyntaxError=()=>{eval("if(true) {")},triggerPromiseError=()=>{Promise.reject(new Error("这是一个Promise错误"))},triggerResourceError=()=>{const s=new Image;s.src="/non-existent-image.jpg",document.body.appendChild(s)},triggerHttpError=()=>{fetch("https://example.com/non-existent-api").then(s=>(console.log("HTTP 响应状态:",s.status),s.json())).catch(s=>{console.error("捕获到 fetch 错误:",s)})},triggerCustomError=()=>{try{throw new Error("这是一个自定义错误")}catch(s){window.monitor&&typeof window.monitor.reportError=="function"?window.monitor.reportError(s,{component:"ErrorExample",action:"triggerCustomError"}):console.error("monitor未初始化或reportError方法不可用")}},getErrorList=()=>{if(window.monitor&&typeof window.monitor.getQueue=="function"){const s=window.monitor.getQueue();console.log("errors==>",s),errorList.value=s.filter(t=>t.type==="error"||t.type==="behavior"&&(t.subType==="stack"||t.subType==="rrweb"))}else console.error("monitor未初始化或getQueue方法不可用"),ElMessage.error("monitor未初始化或getQueue方法不可用")},usePushState=()=>{history.pushState({},"Push State Page","#/push-state-page"),console.log("已使用 pushState 跳转到 #/push-state-page")},useReplaceState=()=>{history.replaceState({},"Replace State Page","#/replace-state-page"),console.log("已使用 replaceState 跳转到 #/replace-state-page")},goBack=()=>{history.back(),console.log("已触发后退操作")},showErrorDetail=s=>{currentError.value=s,errorDetailVisible.value=!0},showRrwebPlayer=s=>{currentError.value=s,rrwebPlayerVisible.value=!0},showBehaviorStack=s=>{currentError.value=s,behaviorStackVisible.value=!0};return(s,t)=>{const o=resolveComponent("el-button"),V=resolveComponent("el-input"),d=resolveComponent("el-form-item"),_=resolveComponent("el-form"),m=resolveComponent("el-card"),l=resolveComponent("el-table-column"),v=resolveComponent("el-table"),h=resolveComponent("el-empty");return openBlock(),createElementBlock("div",_hoisted_1,[createVNode(m,{class:"demo-card"},{header:withCtx(()=>t[6]||(t[6]=[createBaseVNode("div",{class:"card-header"},[createBaseVNode("h2",null,"错误采集和还原定位演示"),createBaseVNode("p",{class:"description"}," 本页面用于演示前端监控SDK的错误采集和还原定位功能，包括sourcemap定位源码、播放录屏和记录用户行为记录。 ")],-1)])),default:withCtx(()=>[createBaseVNode("div",_hoisted_2,[t[14]||(t[14]=createBaseVNode("h3",null,"触发错误",-1)),t[15]||(t[15]=createBaseVNode("p",null,'1. 先点击下方按钮触发不同类型的错误，控制台可以看到"捕获数据已入队"，表示数据已被捕获。',-1)),t[16]||(t[16]=createBaseVNode("p",null,'2. 点击"获取错误列表"按钮，可以看到错误列表，点击错误列表中的错误详情按钮，可以查看错误详情。',-1)),t[17]||(t[17]=createBaseVNode("p",null,"3. 点击错误列表中的播放录屏按钮，可以播放录屏，查看错误发生时的操作行为。",-1)),t[18]||(t[18]=createBaseVNode("p",null,"4. 点击错误列表中的行为记录按钮，可以查看行为记录，包括用户行为记录、页面加载记录、资源加载记录等。",-1)),createBaseVNode("div",_hoisted_3,[createVNode(o,{type:"danger",onClick:triggerTypeError},{default:withCtx(()=>t[7]||(t[7]=[createTextVNode("触发类型错误")])),_:1}),createVNode(o,{type:"danger",onClick:triggerReferenceError},{default:withCtx(()=>t[8]||(t[8]=[createTextVNode("触发引用错误")])),_:1}),createVNode(o,{type:"danger",onClick:triggerSyntaxError},{default:withCtx(()=>t[9]||(t[9]=[createTextVNode("触发语法错误")])),_:1}),createVNode(o,{type:"danger",onClick:triggerPromiseError},{default:withCtx(()=>t[10]||(t[10]=[createTextVNode("触发Promise错误")])),_:1}),createVNode(o,{type:"danger",onClick:triggerResourceError},{default:withCtx(()=>t[11]||(t[11]=[createTextVNode("触发资源加载错误")])),_:1}),createVNode(o,{type:"danger",onClick:triggerHttpError},{default:withCtx(()=>t[12]||(t[12]=[createTextVNode("触发HTTP错误")])),_:1}),createVNode(o,{type:"danger",onClick:triggerCustomError},{default:withCtx(()=>t[13]||(t[13]=[createTextVNode("触发自定义错误")])),_:1})])]),createBaseVNode("div",_hoisted_4,[t[30]||(t[30]=createBaseVNode("h3",null,"用户行为监控测试",-1)),t[31]||(t[31]=createBaseVNode("p",null,"通过以下交互测试用户行为监控功能，所有行为将被记录并可以在发生错误时回放：",-1)),createVNode(m,{class:"behavior-card"},{header:withCtx(()=>t[19]||(t[19]=[createBaseVNode("div",{class:"card-header"},[createBaseVNode("h4",null,"点击行为测试")],-1)])),default:withCtx(()=>[t[24]||(t[24]=createBaseVNode("p",null,"点击下面的按钮，测试点击行为收集功能：",-1)),createBaseVNode("div",_hoisted_5,[createVNode(o,{id:"normal-button"},{default:withCtx(()=>t[20]||(t[20]=[createTextVNode("普通按钮")])),_:1}),createVNode(o,{id:"data-button","data-test":"test-data"},{default:withCtx(()=>t[21]||(t[21]=[createTextVNode("带数据属性的按钮")])),_:1}),createVNode(o,{class:"monitor-ignore",type:"danger"},{default:withCtx(()=>t[22]||(t[22]=[createTextVNode("被忽略的按钮")])),_:1}),createVNode(o,{"data-monitor-ignore":"",type:"danger"},{default:withCtx(()=>t[23]||(t[23]=[createTextVNode("被忽略的按钮 (属性)")])),_:1})]),createBaseVNode("div",_hoisted_6,[createVNode(_,{model:formData,"label-width":"120px"},{default:withCtx(()=>[createVNode(d,{label:"测试输入框："},{default:withCtx(()=>[createVNode(V,{modelValue:formData.input,"onUpdate:modelValue":t[0]||(t[0]=c=>formData.input=c),placeholder:"在此输入文本"},null,8,["modelValue"])]),_:1}),createVNode(d,{label:"密码输入框："},{default:withCtx(()=>[createVNode(V,{modelValue:formData.password,"onUpdate:modelValue":t[1]||(t[1]=c=>formData.password=c),type:"password",placeholder:"在此输入密码","show-password":""},null,8,["modelValue"])]),_:1}),createVNode(d,{label:"测试文本区域："},{default:withCtx(()=>[createVNode(V,{modelValue:formData.textarea,"onUpdate:modelValue":t[2]||(t[2]=c=>formData.textarea=c),type:"textarea",placeholder:"在此输入多行文本",rows:3},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])])]),_:1}),createVNode(m,{class:"behavior-card"},{header:withCtx(()=>t[25]||(t[25]=[createBaseVNode("div",{class:"card-header"},[createBaseVNode("h4",null,"页面跳转测试")],-1)])),default:withCtx(()=>[t[29]||(t[29]=createBaseVNode("p",null,"点击下面的链接，测试页面跳转收集功能：",-1)),createBaseVNode("div",_hoisted_7,[createVNode(o,{id:"push-state",onClick:usePushState},{default:withCtx(()=>t[26]||(t[26]=[createTextVNode("使用 pushState")])),_:1}),createVNode(o,{id:"replace-state",onClick:useReplaceState},{default:withCtx(()=>t[27]||(t[27]=[createTextVNode("使用 replaceState")])),_:1}),createVNode(o,{id:"go-back",onClick:goBack},{default:withCtx(()=>t[28]||(t[28]=[createTextVNode("后退")])),_:1})])]),_:1})]),createBaseVNode("div",_hoisted_8,[createBaseVNode("h3",null,[t[33]||(t[33]=createTextVNode(" 采集数据列表 ")),createVNode(o,{type:"primary",onClick:getErrorList},{default:withCtx(()=>t[32]||(t[32]=[createTextVNode("获取错误列表")])),_:1})]),errorList.value.length?(openBlock(),createBlock(v,{key:0,data:errorList.value,style:{width:"100%"},border:""},{default:withCtx(()=>[createVNode(l,{prop:"timestamp",label:"时间",width:"180"}),createVNode(l,{prop:"subType",label:"错误类型",width:"150"}),createVNode(l,{prop:"message",label:"错误信息"}),createVNode(l,{label:"操作",width:"300"},{default:withCtx(c=>[createVNode(o,{type:"primary",size:"small",onClick:g=>showErrorDetail(c.row)},{default:withCtx(()=>t[34]||(t[34]=[createTextVNode("错误详情")])),_:2},1032,["onClick"]),createVNode(o,{type:"primary",size:"small",onClick:g=>showRrwebPlayer(c.row)},{default:withCtx(()=>t[35]||(t[35]=[createTextVNode("播放录屏")])),_:2},1032,["onClick"]),createVNode(o,{type:"primary",size:"small",onClick:g=>showBehaviorStack(c.row)},{default:withCtx(()=>t[36]||(t[36]=[createTextVNode("行为记录")])),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"])):(openBlock(),createBlock(h,{key:1,description:"暂无错误，请点击上方按钮触发错误"}))])]),_:1}),createVNode(ErrorDetailDialog,{visible:errorDetailVisible.value,"onUpdate:visible":t[3]||(t[3]=c=>errorDetailVisible.value=c),error:currentError.value},null,8,["visible","error"]),createVNode(RrwebPlayerDialog,{visible:rrwebPlayerVisible.value,"onUpdate:visible":t[4]||(t[4]=c=>rrwebPlayerVisible.value=c),error:currentError.value},null,8,["visible","error"]),createVNode(BehaviorStackDialog,{visible:behaviorStackVisible.value,"onUpdate:visible":t[5]||(t[5]=c=>behaviorStackVisible.value=c),error:currentError.value},null,8,["visible","error"])])}}}),index=_export_sfc(_sfc_main,[["__scopeId","data-v-88182b62"]]);export{index as default};
//# sourceMappingURL=index-hanVJnFL.js.map
