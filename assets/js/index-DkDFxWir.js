import{u as Y,T as re,_ as O}from"./components-1ei5ehER.js";import{u as se,c as X,b as ne}from"./index-CqtnxJ52.js";import{d as j,a2 as ie,L as V,b as I,f as e,r as c,w as o,o as b,F as K,g as Q,k as M,l as g,c as N,h as L,V as J,aF as q,e as a,m as Z,t as E,n as ce,p as ee,a1 as ue,i as G}from"./vue-vendor-DZbjFZat.js";import{f as de,b as pe}from"./utils-PfC8a2su.js";import{b as ve,a as U}from"./element-plus-CvvDIR_L.js";import{Q as _e}from"./vendor-fcsvvV72.js";import"./store-vendor-BzeCd7_m.js";import"./utils-vendor-t--hEgTQ.js";import"./lodash-S0Y0Up6J.js";const me={class:"error-filter"},fe=j({__name:"ErrorFilter",props:{errorType:{default:""},sortBy:{default:"lastSeen_desc"}},emits:["update:errorType","update:sortBy","refresh"],setup(x,{emit:S}){const r=[{value:"",label:"全部类型"},{value:"TypeError",label:"TypeError"},{value:"ReferenceError",label:"ReferenceError"},{value:"SyntaxError",label:"SyntaxError"},{value:"RangeError",label:"RangeError"},{value:"URIError",label:"URIError"},{value:"EvalError",label:"EvalError"},{value:"InternalError",label:"InternalError"}],k=[{value:"lastSeen_desc",label:"最近发生"},{value:"count_desc",label:"发生次数 (多到少)"},{value:"count_asc",label:"发生次数 (少到多)"},{value:"userCount_desc",label:"影响用户数 (多到少)"},{value:"userCount_asc",label:"影响用户数 (少到多)"},{value:"firstSeen_desc",label:"首次发生 (新到旧)"},{value:"firstSeen_asc",label:"首次发生 (旧到新)"}],s=x,d=S,h=Y(),u=ie({errorType:s.errorType,sortBy:s.sortBy});V(()=>s.errorType,t=>{u.errorType=t}),V(()=>s.sortBy,t=>{u.sortBy=t});const f=t=>{d("update:errorType",t),d("refresh")},T=t=>{d("update:sortBy",t),d("refresh")},C=t=>{h.setTimeRange(t),console.log("时间范围变化:",t)},D=()=>{console.log("手动刷新数据"),d("refresh")};return(t,p)=>{const l=c("el-form-item"),w=c("el-col"),z=c("el-option"),i=c("el-select"),_=c("Refresh"),P=c("el-icon"),n=c("el-button"),m=c("el-row"),R=c("el-form"),$=c("el-card");return b(),I("div",me,[e($,{shadow:"never",class:"filter-card"},{default:o(()=>[e(R,{model:u,"label-position":"left",class:"filter-form"},{default:o(()=>[e(m,{gutter:20},{default:o(()=>[e(w,{xs:24,sm:24,md:12,lg:12,xl:12},{default:o(()=>[e(l,{label:"时间范围"},{default:o(()=>[e(re,{onChange:C})]),_:1})]),_:1}),e(w,{xs:24,sm:12,md:6,lg:4,xl:4},{default:o(()=>[e(l,{label:"错误类型"},{default:o(()=>[e(i,{modelValue:u.errorType,"onUpdate:modelValue":p[0]||(p[0]=v=>u.errorType=v),placeholder:"错误类型",clearable:"",onChange:f,class:"full-width"},{default:o(()=>[(b(),I(K,null,Q(r,v=>e(z,{key:v.value,label:v.label,value:v.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1})]),_:1}),e(w,{xs:24,sm:12,md:6,lg:4,xl:4},{default:o(()=>[e(l,{label:"排序方式"},{default:o(()=>[e(i,{modelValue:u.sortBy,"onUpdate:modelValue":p[1]||(p[1]=v=>u.sortBy=v),placeholder:"排序方式",onChange:T,class:"full-width"},{default:o(()=>[(b(),I(K,null,Q(k,v=>e(z,{key:v.value,label:v.label,value:v.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1})]),_:1}),e(w,{xs:24,sm:24,md:24,lg:4,xl:4,class:"action-col"},{default:o(()=>[e(l,{label:"",class:"button-form-item"},{default:o(()=>[e(n,{type:"primary",onClick:D,class:"refresh-button"},{default:o(()=>[e(P,null,{default:o(()=>[e(_)]),_:1}),p[2]||(p[2]=M(" 刷新 "))]),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["model"])]),_:1})])}}}),ge=O(fe,[["__scopeId","data-v-26ba08e7"]]),ye={key:0,class:"upload-section"},be={class:"upload-tip"},he={class:"upload-area"},Se={class:"stack-section"},we={class:"original-stack"},ke={key:1,class:"parsed-stack-section"},Ee={class:"parsed-stack"},Ce={class:"frame-number"},Ie={class:"frame-content"},Te={class:"frame-function"},De={class:"frame-location"},$e={class:"line-column"},Be={class:"source-code-preview"},xe={class:"line-number"},ze={class:"code-content"},Ue=j({__name:"SourceCodeDialog",props:{visible:{type:Boolean},errorId:{}},emits:["update:visible"],setup(x,{emit:S}){const r=x,k=S,s=g(null),d=g(!1),h=g(!1),u=g(!1),f=g(null),T=N(()=>{var i;return((i=s.value)==null?void 0:i.payload.parsedStack)&&s.value.payload.parsedStack.length>0}),C=N(()=>{var i;return((i=s.value)==null?void 0:i.payload.stack)||"无堆栈信息"}),D=()=>{k("update:visible",!1)},t=async()=>{if(r.errorId)try{d.value=!0,console.log("获取错误详情数据，错误ID:",r.errorId);const i=await X(r.errorId);s.value=i,console.log("错误详情数据:",i)}catch(i){console.error("获取错误详情数据失败:",i),U.error("获取错误详情数据失败")}finally{d.value=!1}},p=i=>{const _=i.split("/");return _[_.length-1]},l=i=>{if(!s.value||i.startsWith("http"))return i;try{const _=new URL(s.value.payload.meta.url);return new URL(i,_.origin).href}catch{return i}},w=(i,_)=>{f.value=i},z=async()=>{if(!f.value||!f.value.raw){U.warning("请先选择SourceMap文件");return}if(!s.value){U.warning("错误详情数据不存在");return}try{h.value=!0,await se(s.value.appId,f.value.raw,"1.0.0"),U.success("SourceMap上传成功"),u.value=!0,await t()}catch(i){console.error("上传SourceMap失败:",i),U.error("上传SourceMap失败")}finally{h.value=!1}};return V(()=>r.visible,i=>{i&&r.errorId&&t()}),(i,_)=>{const P=c("el-alert"),n=c("el-button"),m=c("el-link"),R=c("el-dialog"),$=q("loading");return b(),L(R,{title:"错误源码详情",modelValue:r.visible,"onUpdate:modelValue":_[0]||(_[0]=v=>r.visible=v),width:"80%","destroy-on-close":"",onClose:D,class:"source-code-dialog"},{default:o(()=>{var v;return[J((b(),I("div",null,[T.value?(b(),I("div",ke,[_[5]||(_[5]=a("h3",null,"解析后的错误堆栈",-1)),a("div",Ee,[(b(!0),I(K,null,Q((v=s.value)==null?void 0:v.payload.parsedStack,(B,H)=>(b(),I("div",{key:H,class:"stack-frame"},[a("div",Ce,E(H+1),1),a("div",Ie,[a("div",Te,E(B.func||"(匿名函数)"),1),a("div",De,[e(m,{href:l(B.file),target:"_blank",underline:!1,class:"file-link"},{default:o(()=>[M(E(p(B.file)),1)]),_:2},1032,["href"]),a("span",$e,":"+E(B.line)+":"+E(B.column),1)]),a("div",Be,[(b(),I(K,null,Q(10,(W,F)=>a("div",{class:ce(["code-line",{"error-line":F===5}]),key:F},[a("span",xe,E(B.line-5+F),1),a("code",ze,E(F===5?"// 这里是错误发生的行（实际内容需要从服务端获取）":"// 源码行 "+(B.line-5+F)),1)],2)),64))])])]))),128))])])):(b(),I("div",ye,[a("div",be,[e(P,{title:"需要上传SourceMap文件以查看源码",type:"info",description:"上传对应版本的SourceMap文件，系统将自动解析错误堆栈并显示源码","show-icon":"",closable:!1})]),a("div",he,[e(Z(ve),{class:"sourcemap-uploader",action:"#","auto-upload":!1,limit:1,accept:".map,.json","on-change":w},{tip:o(()=>_[2]||(_[2]=[a("div",{class:"el-upload__tip"},"请上传.map格式的SourceMap文件",-1)])),default:o(()=>[e(n,{type:"primary",loading:h.value},{default:o(()=>_[1]||(_[1]=[M("选择SourceMap文件")])),_:1},8,["loading"])]),_:1}),e(n,{type:"success",disabled:!f.value,loading:h.value,onClick:z},{default:o(()=>_[3]||(_[3]=[M(" 上传并解析 ")])),_:1},8,["disabled","loading"])]),a("div",Se,[_[4]||(_[4]=a("h3",null,"原始错误堆栈",-1)),a("pre",we,E(C.value),1)])]))])),[[$,d.value]])]}),_:1},8,["modelValue"])}}}),Ve=O(Ue,[["__scopeId","data-v-9ca6ce33"]]),Me={key:0,class:"player-container-wrapper"},Re={class:"dialog-footer"},Pe=j({__name:"RrwebPlayerDialog",props:{visible:{type:Boolean},errorId:{}},emits:["update:visible"],setup(x,{emit:S}){const r=x,k=S,s=g(null),d=g(!1),h=g(null),u=g(null),f=N(()=>{var t;return((t=s.value)==null?void 0:t.payload.rrwebData)&&s.value.payload.rrwebData.length>0}),T=()=>{k("update:visible",!1)},C=async()=>{if(r.errorId)try{d.value=!0,console.log("获取错误详情数据，错误ID:",r.errorId);const t=await X(r.errorId);s.value=t,console.log("错误详情数据:",t),t.payload.rrwebData&&t.payload.rrwebData.length>0&&setTimeout(()=>{D()},100)}catch(t){console.error("获取错误详情数据失败:",t),U.error("获取错误详情数据失败")}finally{d.value=!1}},D=async()=>{var t;if(!(!f.value||!h.value||!s.value))try{u.value&&(u.value.$destroy(),u.value=null),u.value=new _e({target:h.value,props:{events:((t=s.value.payload)==null?void 0:t.rrwebData)||[],showController:!0,autoPlay:!1,width:h.value.clientWidth,height:Math.min(window.innerHeight*.6,600)}}),console.log("rrweb播放器初始化成功")}catch(p){console.error("初始化rrweb播放器失败:",p),U.error("初始化rrweb播放器失败")}};return V(()=>r.visible,t=>{console.log("⭐==>",111),t&&r.errorId?C():!t&&u.value&&(u.value.$destroy(),u.value=null)}),ee(()=>{}),ue(()=>{u.value&&(u.value.$destroy(),u.value=null)}),(t,p)=>{const l=c("el-empty"),w=c("el-button"),z=c("el-dialog"),i=q("loading");return b(),L(z,{title:"会话录屏回放",modelValue:r.visible,"onUpdate:modelValue":p[0]||(p[0]=_=>r.visible=_),width:"80%","destroy-on-close":"",onClose:T,class:"rrweb-player-dialog"},{footer:o(()=>[a("span",Re,[e(w,{onClick:T},{default:o(()=>p[2]||(p[2]=[M("关闭")])),_:1})])]),default:o(()=>[J((b(),I("div",null,[f.value?(b(),I("div",Me,[a("div",{ref_key:"playerContainer",ref:h,class:"player-container"},null,512)])):d.value?G("",!0):(b(),L(l,{key:1,description:"暂无会话录屏数据"},{description:o(()=>p[1]||(p[1]=[a("p",null,"该错误事件未包含会话录屏数据",-1),a("p",{class:"empty-tip"},"提示: 确保SDK配置中启用了rrweb插件，并设置了适当的录制模式",-1)])),_:1}))])),[[i,d.value]])]),_:1},8,["modelValue"])}}}),Fe=O(Pe,[["__scopeId","data-v-6407ee0b"]]),Le={class:"behavior-info"},Ne={class:"behavior-count"},He={class:"behavior-item"},Ke={class:"behavior-type"},Oe={class:"behavior-detail"},je={key:0,class:"behavior-extra-info"},Ae={class:"position-info"},Qe={class:"dialog-footer"},We=j({__name:"BehaviorStackDialog",props:{visible:{type:Boolean},errorId:{}},emits:["update:visible"],setup(x,{emit:S}){const r=x,k=S,s=g(null),d=g(!1),h=N(()=>{var l;return((l=s.value)==null?void 0:l.payload.behaviorStack)&&s.value.payload.behaviorStack.length>0}),u=N(()=>!h.value||!s.value?[]:[...s.value.payload.behaviorStack].sort((l,w)=>w.timestamp-l.timestamp)),f=()=>{k("update:visible",!1)},T=async()=>{if(r.errorId)try{d.value=!0,console.log("获取错误详情数据，错误ID:",r.errorId);const l=await X(r.errorId);s.value=l,console.log("错误详情数据:",l)}catch(l){console.error("获取错误详情数据失败:",l),U.error("获取错误详情数据失败")}finally{d.value=!1}},C=l=>({click:"Pointer",input:"Edit",navigation:"Connection",api:"Link",pageview:"Document",scroll:"Sort",resize:"FullScreen",keypress:"Keyboard"})[l]||"InfoFilled",D=l=>({click:"primary",input:"success",navigation:"warning",api:"danger",pageview:"info",scroll:"",resize:"",keypress:"success"})[l]||"",t=l=>de(new Date(l),"HH:mm:ss.SSS"),p=l=>{switch(l.type){case"click":return`点击了 <${l.element}> 元素 "${l.text||"未知内容"}"`;case"input":return"在输入框中输入了内容";case"navigation":return`从 ${l.from} 导航到 ${l.to}`;case"api":return`${l.method} 请求 ${l.url}，状态码: ${l.status}`;case"pageview":return`访问页面 ${l.url}，标题: ${l.title}`;case"scroll":return`滚动到位置 (${l.position.x}, ${l.position.y})`;case"resize":return"调整窗口大小";case"keypress":return"按下键盘";default:return`${l.type} 行为`}};return V(()=>r.visible,l=>{l&&r.errorId&&T()}),(l,w)=>{const z=c("el-alert"),i=c("el-tag"),_=c("el-timeline-item"),P=c("el-timeline"),n=c("el-empty"),m=c("el-button"),R=c("el-dialog"),$=q("loading");return b(),L(R,{title:"用户行为栈",modelValue:r.visible,"onUpdate:modelValue":w[0]||(w[0]=v=>r.visible=v),width:"80%","destroy-on-close":"",onClose:f,class:"behavior-stack-dialog"},{footer:o(()=>[a("span",Qe,[e(m,{onClick:f},{default:o(()=>w[2]||(w[2]=[M("关闭")])),_:1})])]),default:o(()=>[J((b(),I("div",null,[h.value?(b(),I(K,{key:0},[a("div",Le,[e(z,{title:"用户行为栈记录了错误发生前的用户操作序列",type:"info",description:"通过分析用户行为，可以更好地理解错误发生的上下文和复现路径","show-icon":"",closable:!1,class:"behavior-info-alert"}),a("div",Ne,[e(i,{type:"info",size:"large"},{default:o(()=>[M("共 "+E(u.value.length)+" 个行为记录",1)]),_:1})])]),e(P,{class:"behavior-timeline"},{default:o(()=>[(b(!0),I(K,null,Q(u.value,(v,B)=>(b(),L(_,{key:B,type:D(v.type),icon:C(v.type),timestamp:t(v.timestamp),size:"large"},{default:o(()=>[a("div",He,[a("div",Ke,[e(i,{size:"small",type:D(v.type)},{default:o(()=>[M(E(v.type),1)]),_:2},1032,["type"])]),a("div",Oe,E(p(v)),1),v.type==="click"&&v.position?(b(),I("div",je,[a("div",Ae," 点击位置: ("+E(v.position.x)+", "+E(v.position.y)+") ",1)])):G("",!0)])]),_:2},1032,["type","icon","timestamp"]))),128))]),_:1})],64)):d.value?G("",!0):(b(),L(n,{key:1,description:"暂无用户行为记录"},{description:o(()=>w[1]||(w[1]=[a("p",null,"该错误事件未包含用户行为栈数据",-1),a("p",{class:"empty-tip"},"提示: 确保SDK配置中启用了behaviorStack插件，并设置了适当的记录模式",-1)])),_:1}))])),[[$,d.value]])]),_:1},8,["modelValue"])}}}),Je=O(We,[["__scopeId","data-v-70d5d2cd"]]),qe={class:"error-table-container"},Ge={class:"error-message ellipsis"},Xe={class:"error-count"},Ye={class:"operation-buttons"},Ze={class:"pagination-container"},et=j({__name:"ErrorTable",props:{data:{},total:{},loading:{type:Boolean,default:!1},page:{default:1},pageSize:{default:20},sortBy:{default:"lastSeen_desc"}},emits:["update:page","update:pageSize","update:sortBy","refresh"],setup(x,{emit:S}){const r=x,k=S,s=g(r.page),d=g(r.pageSize),h=g(r.sortBy),u=g(!1),f=g(!1),T=g(!1),C=g("");V(()=>r.page,n=>{s.value=n}),V(()=>r.pageSize,n=>{d.value=n}),V(()=>r.sortBy,n=>{h.value=n});const D=n=>{s.value=n,k("update:page",n),k("refresh")},t=n=>{d.value=n,s.value=1,k("update:pageSize",n),k("update:page",1),k("refresh")},p=({prop:n,order:m})=>{if(!n||!m)return;const $=`${n}_${m==="descending"?"desc":"asc"}`;h.value=$,k("update:sortBy",$),k("refresh")},l=(n,m)=>{m.stopPropagation(),C.value=n.sampleEventId,u.value=!0,console.log("查看源码:",n.sampleEventId)},w=(n,m)=>{m.stopPropagation(),C.value=n.sampleEventId,f.value=!0,console.log("播放录屏:",n.sampleEventId)},z=(n,m)=>{m.stopPropagation(),C.value=n.sampleEventId,T.value=!0,console.log("查看用户行为:",n.sampleEventId)},i=n=>({TypeError:"danger",ReferenceError:"warning",SyntaxError:"info",RangeError:"warning",URIError:"info",EvalError:"danger",InternalError:"danger"})[n]||"info",_=N(()=>!r.loading&&(!r.data||r.data.length===0)),P=N(()=>_.value?"暂无错误数据":"");return(n,m)=>{const R=c("el-tag"),$=c("el-table-column"),v=c("Document"),B=c("el-icon"),H=c("el-button"),W=c("el-tooltip"),F=c("VideoPlay"),te=c("List"),oe=c("el-table"),le=c("el-pagination"),ae=q("loading");return b(),I("div",qe,[J((b(),L(oe,{data:n.data,style:{width:"100%"},onSortChange:p,"row-key":"fingerprint",border:"",stripe:"","empty-text":P.value,"highlight-current-row":""},{default:o(()=>[e($,{prop:"type",label:"错误类型",width:"120"},{default:o(({row:y})=>[e(R,{type:i(y.type),size:"small"},{default:o(()=>[M(E(y.type),1)]),_:2},1032,["type"])]),_:1}),e($,{prop:"message",label:"错误信息","min-width":"300","show-overflow-tooltip":""},{default:o(({row:y})=>[a("div",Ge,E(y.message),1)]),_:1}),e($,{prop:"count",label:"发生次数",align:"center",width:"100",sortable:"custom"},{default:o(({row:y})=>[a("span",Xe,E(y.count),1)]),_:1}),e($,{prop:"userCount",label:"影响用户数",align:"center",width:"100",sortable:"custom"},{default:o(({row:y})=>[a("span",null,E(y.userCount),1)]),_:1}),e($,{prop:"lastSeen",label:"最后发生",align:"center",width:"150",sortable:"custom"},{default:o(({row:y})=>[a("span",null,E(Z(pe)(y.lastSeen)),1)]),_:1}),e($,{label:"操作",width:"200",align:"center",fixed:"right"},{default:o(({row:y})=>[a("div",Ye,[e(W,{content:"查看源码",placement:"top"},{default:o(()=>[e(H,{type:"primary",size:"small",circle:"",onClick:A=>l(y,A)},{default:o(()=>[e(B,null,{default:o(()=>[e(v)]),_:1})]),_:2},1032,["onClick"])]),_:2},1024),e(W,{content:"播放录屏",placement:"top"},{default:o(()=>[e(H,{type:"success",size:"small",circle:"",onClick:A=>w(y,A)},{default:o(()=>[e(B,null,{default:o(()=>[e(F)]),_:1})]),_:2},1032,["onClick"])]),_:2},1024),e(W,{content:"查看用户行为",placement:"top"},{default:o(()=>[e(H,{type:"warning",size:"small",circle:"",onClick:A=>z(y,A)},{default:o(()=>[e(B,null,{default:o(()=>[e(te)]),_:1})]),_:2},1032,["onClick"])]),_:2},1024)])]),_:1})]),_:1},8,["data","empty-text"])),[[ae,n.loading]]),a("div",Ze,[e(le,{"current-page":s.value,"onUpdate:currentPage":m[0]||(m[0]=y=>s.value=y),"page-size":d.value,"onUpdate:pageSize":m[1]||(m[1]=y=>d.value=y),"page-sizes":[10,20,50,100],layout:"total, sizes, prev, pager, next, jumper",total:n.total,onSizeChange:t,onCurrentChange:D},null,8,["current-page","page-size","total"])]),e(Ve,{visible:u.value,"onUpdate:visible":m[2]||(m[2]=y=>u.value=y),"error-id":C.value},null,8,["visible","error-id"]),e(Fe,{visible:f.value,"onUpdate:visible":m[3]||(m[3]=y=>f.value=y),"error-id":C.value},null,8,["visible","error-id"]),e(Je,{visible:T.value,"onUpdate:visible":m[4]||(m[4]=y=>T.value=y),"error-id":C.value},null,8,["visible","error-id"])])}}}),tt=O(et,[["__scopeId","data-v-8af2c153"]]),ot={class:"error-container"},lt=j({__name:"index",setup(x){const S=Y(),r=g([]),k=g(0),s=g(!1),d=g(1),h=g(20),u=g(""),f=g("lastSeen_desc"),T=async()=>{try{s.value=!0,console.log("获取错误列表数据，参数:",{appId:S.appId,startTime:S.startTime,endTime:S.endTime,page:d.value,limit:h.value,sortBy:f.value,errorType:u.value});const D={appId:S.appId,startTime:S.startTime,endTime:S.endTime,page:d.value,limit:h.value,sortBy:f.value};u.value&&(D.errorType=u.value);const t=await ne(S.appId,S.startTime,S.endTime,d.value,h.value,f.value);r.value=t.items,k.value=t.total,console.log("错误列表数据:",t)}catch(D){console.error("获取错误列表数据失败:",D),U.error("获取错误列表数据失败")}finally{s.value=!1}};V(()=>[S.appId,S.startTime,S.endTime],()=>{d.value=1,T()});const C=()=>{T()};return ee(()=>{console.log("Error页面已挂载"),T()}),(D,t)=>(b(),I("div",ot,[t[5]||(t[5]=a("div",{class:"error-header"},[a("h2",{class:"page-title"},"错误监控"),a("p",{class:"page-description"},"查看和分析应用中的JavaScript错误")],-1)),e(ge,{"error-type":u.value,"onUpdate:errorType":t[0]||(t[0]=p=>u.value=p),"sort-by":f.value,"onUpdate:sortBy":t[1]||(t[1]=p=>f.value=p),onRefresh:C},null,8,["error-type","sort-by"]),e(tt,{data:r.value,total:k.value,loading:s.value,page:d.value,"page-size":h.value,"sort-by":f.value,"onUpdate:page":t[2]||(t[2]=p=>d.value=p),"onUpdate:pageSize":t[3]||(t[3]=p=>h.value=p),"onUpdate:sortBy":t[4]||(t[4]=p=>f.value=p),onRefresh:C},null,8,["data","total","loading","page","page-size","sort-by"])]))}}),vt=O(lt,[["__scopeId","data-v-40b191c9"]]);export{vt as default};
