function g(e,n="YYYY-MM-DD HH:mm:ss"){const o=typeof e=="string"?new Date(e):e,t=o.getFullYear(),f=o.getMonth()+1,c=o.getDate(),r=o.getHours(),i=o.getMinutes(),a=o.getSeconds(),s={"M+":f,"D+":c,"H+":r,"h+":r%12||12,"m+":i,"s+":a,"q+":Math.floor((f+2)/3),S:o.getMilliseconds()};let u=n;/(Y+)/.test(n)&&(u=n.replace(RegExp.$1,(t+"").substr(4-RegExp.$1.length)));for(const l in s)new RegExp("("+l+")").test(u)&&(u=u.replace(RegExp.$1,RegExp.$1.length===1?s[l]+"":("00"+s[l]).substr((""+s[l]).length)));return u}function h(e){const n=typeof e=="string"?new Date(e).getTime():e,t=Date.now()-n,f=60*1e3,c=f*60,r=c*24,i=r*7,a=r*30,s=r*365;return t<f?"刚刚":t<c?Math.floor(t/f)+"分钟前":t<r?Math.floor(t/c)+"小时前":t<i?Math.floor(t/r)+"天前":t<a?Math.floor(t/i)+"周前":t<s?Math.floor(t/a)+"个月前":Math.floor(t/s)+"年前"}function M(e,n=50){return e?e.length>n?e.substring(0,n)+"...":e:""}function d(e){return e>=1e3?(e/1e3).toFixed(2)+"s":Math.round(e)+"ms"}export{d as a,h as b,g as f,M as t};
