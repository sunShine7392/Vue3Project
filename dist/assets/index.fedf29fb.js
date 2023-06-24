var q=Object.defineProperty,G=Object.defineProperties;var H=Object.getOwnPropertyDescriptors;var x=Object.getOwnPropertySymbols;var J=Object.prototype.hasOwnProperty,W=Object.prototype.propertyIsEnumerable;var $=(n,e,o)=>e in n?q(n,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):n[e]=o,L=(n,e)=>{for(var o in e||(e={}))J.call(e,o)&&$(n,o,e[o]);if(x)for(var o of x(e))W.call(e,o)&&$(n,o,e[o]);return n},F=(n,e)=>G(n,H(e));import{u as O,d as Y,g as Z,a as tt,C as et}from"./attr.51799805.js";import{x as at,d as k,r as D,w as ot,g as s,o as _,i as b,b as l,a as t,y as v,P as z,c as B,s as lt,F as st,Q as ut,R,m as h,K as T,t as K,_ as nt,S as rt,D as ct,n as U}from"./index.fbf6442c.js";import"./category.b3b09377.js";import"./request.59cff57c.js";import"./index.becf6c0c.js";const M=at("attr",{state:()=>({attrItem:{attrName:"",attrValueList:[]}})}),it=h(" \u6DFB\u52A0\u5C5E\u6027 "),dt={name:"AttrList"},_t=k(F(L({},dt),{emits:["setIsShowAttrList"],setup(n,{emit:e}){const o=D([]),a=O(),r=async()=>{const{category1Id:c,category2Id:w,category3Id:y}=a;o.value=await Z({category1Id:c,category2Id:w,category3Id:y})};ot(()=>a.category3Id,()=>{const{category3Id:c}=a;if(!c){o.value=[];return}r()},{immediate:!0});const g=M(),E=()=>{e("setIsShowAttrList",!1),g.$reset()},I=c=>{e("setIsShowAttrList",!1),g.attrItem=c},V=async c=>{await Y(c),T.success("\u5220\u9664\u5C5E\u6027\u6210\u529F"),r()};return(c,w)=>{const y=s("el-button"),A=s("el-table-column"),u=s("el-tag"),m=s("el-popconfirm"),C=s("el-table"),p=s("el-card");return _(),b(p,{shadow:"hover",class:"mt-20"},{default:l(()=>[t(y,{type:"primary",icon:v(z),disabled:!v(a).category3Id,onClick:E},{default:l(()=>[it]),_:1},8,["icon","disabled"]),t(C,{data:o.value,border:"",class:"mt-20"},{default:l(()=>[t(A,{type:"index",align:"center",label:"\u5E8F\u53F7",width:"60"}),t(A,{prop:"attrName",label:"\u5C5E\u6027\u540D",width:"150"}),t(A,{label:"\u5C5E\u6027\u503C\u5217\u8868"},{default:l(({row:d})=>[(_(!0),B(st,null,lt(d.attrValueList,f=>(_(),b(u,{type:"success",key:f.id,class:"mr-10"},{default:l(()=>[h(K(f.valueName),1)]),_:2},1024))),128))]),_:1}),t(A,{label:"\u64CD\u4F5C",width:"150"},{default:l(({row:d})=>[t(y,{type:"warning",icon:v(ut),size:"small",onClick:f=>I(d)},null,8,["icon","onClick"]),t(m,{title:"\u60A8\u786E\u8BA4\u8981\u5220\u9664\u5417\uFF1F",onConfirm:f=>V(d.id)},{reference:l(()=>[t(y,{type:"danger",icon:v(R),size:"small",title:"\u5220\u9664\u5C5E\u6027"},null,8,["icon"])]),_:2},1032,["onConfirm"])]),_:1})]),_:1},8,["data"])]),_:1})}}}));const mt=h(" \u6DFB\u52A0\u5C5E\u6027\u503C "),pt=["onClick"],ft=h(" \u4FDD\u5B58 "),yt=h("\u53D6\u6D88"),At={name:"AddOrUpdateAttr"},vt=k(F(L({},At),{emits:["setIsShowAttrList"],setup(n,{emit:e}){const o=M(),a=rt({attrName:o.attrItem.attrName,attrValueList:o.attrItem.attrValueList}),r=D(),g=async()=>{a.attrValueList.push({isShowEdit:!0,valueName:""}),await U(),r.value.focus()},E=(u,m)=>{if(!u.valueName){a.attrValueList.splice(m,1);return}u.isShowEdit=!1},I=async u=>{u.isShowEdit=!0,await U(),r.value.focus()},V=u=>{a.attrValueList.splice(u,1)},c=ct(()=>!(a.attrName&&a.attrValueList.some(u=>u.valueName))),w=O(),y=async()=>{const{attrName:u,attrValueList:m}=a,{category3Id:C}=w,{id:p}=o.attrItem;await tt({attrName:u,attrValueList:m,categoryLevel:3,categoryId:C,id:p}),T.success(`${p?"\u66F4\u65B0":"\u6DFB\u52A0"}\u5C5E\u6027\u6210\u529F`),A()},A=()=>{e("setIsShowAttrList",!0)};return(u,m)=>{const C=s("el-input"),p=s("el-form-item"),d=s("el-button"),f=s("el-table-column"),P=s("el-popconfirm"),Q=s("el-table"),X=s("el-form"),j=s("el-card");return _(),b(j,{class:"mt-20",shadow:"hover"},{default:l(()=>[t(X,null,{default:l(()=>[t(p,{label:"\u5C5E\u6027\u540D"},{default:l(()=>[t(C,{placeholder:"\u8BF7\u8F93\u5165\u5C5E\u6027\u540D",class:"attr-input",modelValue:a.attrName,"onUpdate:modelValue":m[0]||(m[0]=i=>a.attrName=i)},null,8,["modelValue"])]),_:1}),t(p,null,{default:l(()=>[t(d,{type:"primary",icon:v(z),disabled:!a.attrName,onClick:g},{default:l(()=>[mt]),_:1},8,["icon","disabled"]),t(Q,{data:a.attrValueList,border:"",class:"mt-20"},{default:l(()=>[t(f,{type:"index",label:"\u5E8F\u53F7",align:"center",width:"60"}),t(f,{label:"\u5C5E\u6027\u503C\u540D\u79F0"},{default:l(({row:i,$index:N})=>[i.isShowEdit?(_(),b(C,{key:0,size:"small",ref_key:"inputRef",ref:r,onBlur:S=>E(i,N),modelValue:i.valueName,"onUpdate:modelValue":S=>i.valueName=S},null,8,["onBlur","modelValue","onUpdate:modelValue"])):(_(),B("div",{key:1,onClick:S=>I(i)},K(i.valueName),9,pt))]),_:1}),t(f,{label:"\u64CD\u4F5C"},{default:l(({row:i,$index:N})=>[t(P,{title:`\u60A8\u786E\u8BA4\u8981\u5220\u9664 ${i.valueName} \u5417?`,onConfirm:S=>V(N)},{reference:l(()=>[t(d,{type:"danger",icon:v(R),size:"small",title:"\u5220\u9664"},null,8,["icon"])]),_:2},1032,["title","onConfirm"])]),_:1})]),_:1},8,["data"])]),_:1})]),_:1}),t(p,null,{default:l(()=>[t(d,{type:"primary",disabled:v(c),onClick:y},{default:l(()=>[ft]),_:1},8,["disabled"]),t(d,{onClick:A},{default:l(()=>[yt]),_:1})]),_:1})]),_:1})}}}));var Ct=nt(vt,[["__scopeId","data-v-2804ccbe"]]);const bt={name:"XAttr"},Et=k(F(L({},bt),{setup(n){const e=D(!0);return(o,a)=>(_(),B("div",null,[t(et,{disabled:!e.value},null,8,["disabled"]),e.value?(_(),b(_t,{key:0,onSetIsShowAttrList:a[0]||(a[0]=r=>e.value=r)})):(_(),b(Ct,{key:1,onSetIsShowAttrList:a[1]||(a[1]=r=>e.value=r)}))]))}}));export{Et as default};