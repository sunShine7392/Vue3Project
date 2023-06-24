var Ie=Object.defineProperty,ke=Object.defineProperties;var be=Object.getOwnPropertyDescriptors;var de=Object.getOwnPropertySymbols;var Ce=Object.prototype.hasOwnProperty,ye=Object.prototype.propertyIsEnumerable;var pe=(l,i,s)=>i in l?Ie(l,i,{enumerable:!0,configurable:!0,writable:!0,value:s}):l[i]=s,z=(l,i)=>{for(var s in i||(i={}))Ce.call(i,s)&&pe(l,s,i[s]);if(de)for(var s of de(i))ye.call(i,s)&&pe(l,s,i[s]);return l},q=(l,i)=>ke(l,be(i));import{u as ne,g as Ee,C as Ve}from"./attr.51799805.js";import{x as we,d as ae,r as f,w as he,g as a,U as Le,o as c,i as F,b as t,a as e,y as A,P as W,V as Ue,Q as De,X as Be,R as ce,m as U,_ as me,G as K,S as ue,D as Ne,c as x,s as R,F as O,t as te,p as $e,l as xe,K as oe,n as Pe,h as J}from"./index.fbf6442c.js";import{s as T}from"./request.59cff57c.js";import{c as ze,b as qe}from"./tools.d2514f2a.js";import"./category.b3b09377.js";import"./index.becf6c0c.js";const Ke=({page:l,limit:i,category3Id:s})=>T.get(`/admin/product/${l}/${i}`,{params:{category3Id:s}}),Re=()=>T.get("/admin/product/baseSaleAttrList"),Oe=l=>T.post("/admin/product/saveSpuInfo",l),Te=l=>T.post("/admin/product/updateSpuInfo",l),_e=l=>T.get(`/admin/product/spuImageList/${l}`),ge=l=>T.get(`/admin/product/spuSaleAttrList/${l}`),re=we("spu",{state:()=>({spuItem:{id:void 0,spuName:"",tmId:void 0,description:"",spuImageList:[],spuSaleAttrList:[]}})}),je=U(" \u6DFB\u52A0SPU "),Me={name:"SpuList"},Xe=ae(q(z({},Me),{emits:["setIsShow"],setup(l,{emit:i}){const s=f(1),I=f(3),V=f(0),D=f([]),w=f(!1),N=ne(),m=async()=>{w.value=!0;const b=await Ke({page:s.value,limit:I.value,category3Id:N.category3Id});D.value=b.records,V.value=b.total,w.value=!1};he(()=>N.category3Id,b=>{if(!b){D.value=[],s.value=1,I.value=3,V.value=0;return}m()},{immediate:!0});const j=re(),P=()=>{j.$reset(),i("setIsShow",2)},h=b=>{j.spuItem=b,i("setIsShow",2)},g=b=>{j.spuItem=b,i("setIsShow",3)};return(b,B)=>{const _=a("el-button"),p=a("el-table-column"),d=a("el-table"),C=a("el-pagination"),L=a("el-card"),M=Le("loading");return c(),F(L,{shadow:"hover",class:"mt-20"},{default:t(()=>[e(_,{type:"primary",icon:A(W),disabled:!A(N).category3Id,onClick:P},{default:t(()=>[je]),_:1},8,["icon","disabled"]),Ue((c(),F(d,{data:D.value,border:"",class:"mt-20"},{default:t(()=>[e(p,{type:"index",label:"\u5E8F\u53F7",align:"center",width:"60"}),e(p,{label:"SPU\u540D\u79F0",prop:"spuName"}),e(p,{label:"SPU\u63CF\u8FF0",prop:"description"}),e(p,{label:"\u64CD\u4F5C"},{default:t(({row:y})=>[e(_,{type:"primary",icon:A(W),size:"small",title:"\u6DFB\u52A0SKU",onClick:X=>g(y)},null,8,["icon","onClick"]),e(_,{type:"warning",icon:A(De),size:"small",title:"\u4FEE\u6539SPU",onClick:X=>h(y)},null,8,["icon","onClick"]),e(_,{type:"info",icon:A(Be),size:"small",title:"\u67E5\u770BSKU\u5217\u8868"},null,8,["icon"]),e(_,{type:"danger",icon:A(ce),size:"small",title:"\u5220\u9664SPU"},null,8,["icon"])]),_:1})]),_:1},8,["data"])),[[M,w.value]]),e(C,{class:"mt-20","current-page":s.value,"onUpdate:current-page":B[0]||(B[0]=y=>s.value=y),"page-size":I.value,"onUpdate:page-size":B[1]||(B[1]=y=>I.value=y),total:V.value,"page-sizes":[3,6,9,12],layout:"prev, pager, next, jumper, ->, sizes, total",onCurrentChange:m,onSizeChange:m},null,8,["current-page","page-size","total"])]),_:1})}}}));const Ge=l=>($e("data-v-91d58d2c"),l=l(),xe(),l),Qe=Ge(()=>J("div",{class:"el-upload__tip"},"\u53EA\u80FD\u4E0A\u4F20jpg/png\u6587\u4EF6\uFF0C\u4E14\u4E0D\u8D85\u8FC7250kb",-1)),He=U(" \u6DFB\u52A0\u9500\u552E\u5C5E\u6027 "),Je=U("\u4FDD\u5B58"),We=U("\u53D6\u6D88"),Ye={name:"AddOrUpdateSpu"},Ze=ae(q(z({},Ye),{emits:["setIsShow"],setup(l,{emit:i}){const s=f([]),I=f([]);K(async()=>{s.value=await Re()}),K(async()=>{I.value=await ze()}),K(async()=>{const u=h.spuItem.id;if(!u)return;const o=await _e(u);g.spuImageList=o.map(k=>{const v=k;return{name:v.imgName,url:v.imgUrl,response:{data:v.imgUrl}}})}),K(async()=>{const u=h.spuItem.id;!u||(g.spuSaleAttrList=await ge(u))});const V="/app-prod",D=f(""),w=f(!1),N=u=>{D.value=u.url,w.value=!0},m=()=>{oe.error("\u6700\u591A\u53EA\u80FD\u4E0A\u4F2010\u5F20")},j=()=>{P.value.clearValidate(["spuImageList"])},P=f(),h=re(),g=ue({spuName:h.spuItem.spuName,tmId:h.spuItem.tmId,description:h.spuItem.description,spuImageList:[],spuSaleAttrList:[]}),B=ue({spuName:[{required:!0,message:"\u8BF7\u8F93\u5165SPU\u540D\u79F0",trigger:"blur"}],tmId:[{required:!0,message:"\u8BF7\u9009\u62E9SPU\u54C1\u724C",trigger:"change"}],description:[{required:!0,message:"\u8BF7\u8F93\u5165SPU\u63CF\u8FF0",trigger:"blur"}],spuImageList:[{required:!0,message:"\u8BF7\u4E0A\u4F20SPU\u56FE\u7247"}],spuSaleAttrList:[{required:!0,validator:(u,o,k)=>{if(!o.length){k(new Error("\u8BF7\u81F3\u5C11\u6DFB\u52A0\u4E00\u4E2A\u9500\u552E\u5C5E\u6027"));return}if(o.some(v=>!v.spuSaleAttrValueList.length)){k(new Error("\u6BCF\u4E2A\u9500\u552E\u5C5E\u6027\u81F3\u5C11\u6DFB\u52A0\u4E00\u4E2A\u5C5E\u6027\u503C"));return}k()}}]}),_=ne(),p=async()=>{try{await P.value.validate();const u=h.spuItem.id,{spuName:o,tmId:k,description:v,spuImageList:n,spuSaleAttrList:E}=g,S={category3Id:_.category3Id,spuName:o,tmId:k,description:v,spuImageList:n.map(se=>{const Z=se;return{imgName:Z.name,imgUrl:Z.response.data}}),spuSaleAttrList:E};u?await Te(q(z({},S),{id:u})):await Oe(S),oe({type:"success",message:`${u?"\u66F4\u65B0":"\u6DFB\u52A0"}SPU\u6210\u529F`}),Y()}catch(u){console.log(u)}},d=f(""),C=()=>{const[u,o]=d.value.split(":");g.spuSaleAttrList.push({baseSaleAttrId:+u,saleAttrName:o,spuSaleAttrValueList:[],isShowEdit:!1}),d.value=""},L=Ne(()=>s.value.filter(u=>!g.spuSaleAttrList.some(o=>o.baseSaleAttrId===u.id))),M=u=>{g.spuSaleAttrList.splice(u,1)},y=f(),X=async u=>{u.isShowEdit=!0,await Pe(),y.value.focus()},$=f(""),G=u=>{u.isShowEdit=!1,$.value&&(u.spuSaleAttrValueList.push({baseSaleAttrId:u.baseSaleAttrId,saleAttrValueName:$.value}),$.value="")},le=(u,o)=>{u.spuSaleAttrValueList.splice(o,1)},Y=()=>{i("setIsShow",1)};return(u,o)=>{const k=a("el-input"),v=a("el-form-item"),n=a("el-option"),E=a("el-select"),S=a("el-icon"),se=a("el-upload"),Z=a("el-image"),Se=a("el-dialog"),H=a("el-button"),ee=a("el-table-column"),fe=a("el-tag"),Fe=a("el-table"),ve=a("el-form"),Ae=a("el-card");return c(),F(Ae,{class:"mt-20",shadow:"hover"},{default:t(()=>[e(ve,{"label-width":"100px",ref_key:"spuFormRef",ref:P,model:g,rules:B},{default:t(()=>[e(v,{label:"SPU\u540D\u79F0",prop:"spuName"},{default:t(()=>[e(k,{placeholder:"\u8BF7\u8F93\u5165SPU\u540D\u79F0",modelValue:g.spuName,"onUpdate:modelValue":o[0]||(o[0]=r=>g.spuName=r)},null,8,["modelValue"])]),_:1}),e(v,{label:"\u54C1\u724C",prop:"tmId"},{default:t(()=>[e(E,{modelValue:g.tmId,"onUpdate:modelValue":o[1]||(o[1]=r=>g.tmId=r)},{default:t(()=>[(c(!0),x(O,null,R(I.value,r=>(c(),F(n,{key:r.id,label:r.tmName,value:r.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),e(v,{label:"SPU\u63CF\u8FF0",prop:"description"},{default:t(()=>[e(k,{placeholder:"\u8BF7\u8F93\u5165SPU\u63CF\u8FF0",type:"textarea",rows:3,modelValue:g.description,"onUpdate:modelValue":o[2]||(o[2]=r=>g.description=r)},null,8,["modelValue"])]),_:1}),e(v,{label:"SPU\u56FE\u7247",prop:"spuImageList"},{default:t(()=>[e(se,{accept:"image/*","file-list":g.spuImageList,"onUpdate:file-list":o[3]||(o[3]=r=>g.spuImageList=r),action:A(V)+"/admin/product/upload","list-type":"picture-card","on-preview":N,"before-upload":A(qe),limit:10,"on-exceed":m,"on-success":j},{tip:t(()=>[Qe]),default:t(()=>[e(S,null,{default:t(()=>[e(A(W))]),_:1})]),_:1},8,["file-list","action","before-upload"]),e(Se,{modelValue:w.value,"onUpdate:modelValue":o[4]||(o[4]=r=>w.value=r),width:"30%"},{default:t(()=>[e(Z,{src:D.value,class:"spu-img"},null,8,["src"])]),_:1},8,["modelValue"])]),_:1}),e(v,{label:"\u9500\u552E\u5C5E\u6027",prop:"spuSaleAttrList"},{default:t(()=>[e(E,{class:"mr-10",modelValue:d.value,"onUpdate:modelValue":o[5]||(o[5]=r=>d.value=r)},{default:t(()=>[(c(!0),x(O,null,R(A(L),r=>(c(),F(n,{key:r.id,label:r.name,value:`${r.id}:${r.name}`},null,8,["label","value"]))),128))]),_:1},8,["modelValue"]),e(H,{type:"primary",icon:A(W),disabled:!d.value,onClick:C},{default:t(()=>[He]),_:1},8,["icon","disabled"]),e(Fe,{data:g.spuSaleAttrList,border:"",class:"mt-20"},{default:t(()=>[e(ee,{align:"center",type:"index",label:"\u5E8F\u53F7",width:"60"}),e(ee,{label:"\u5C5E\u6027\u540D",prop:"saleAttrName",width:"200"}),e(ee,{label:"\u5C5E\u6027\u503C\u540D\u79F0\u5217\u8868"},{default:t(({row:r})=>[(c(!0),x(O,null,R(r.spuSaleAttrValueList,(Q,ie)=>(c(),F(fe,{key:ie,closable:"",type:"success",class:"mr-10",onClose:_t=>le(r,ie)},{default:t(()=>[U(te(Q.saleAttrValueName),1)]),_:2},1032,["onClose"]))),128)),r.isShowEdit?(c(),F(k,{key:0,size:"small",class:"spu-input",ref_key:"inputRef",ref:y,modelValue:$.value,"onUpdate:modelValue":o[6]||(o[6]=Q=>$.value=Q),onBlur:Q=>G(r)},null,8,["modelValue","onBlur"])):(c(),F(H,{key:1,icon:A(W),size:"small",onClick:Q=>X(r)},null,8,["icon","onClick"]))]),_:1}),e(ee,{label:"\u64CD\u4F5C",width:"100"},{default:t(({$index:r})=>[e(H,{type:"danger",icon:A(ce),size:"small",onClick:Q=>M(r)},null,8,["icon","onClick"])]),_:1})]),_:1},8,["data"])]),_:1}),e(v,null,{default:t(()=>[e(H,{type:"primary",onClick:p},{default:t(()=>[Je]),_:1}),e(H,{onClick:Y},{default:t(()=>[We]),_:1})]),_:1})]),_:1},8,["model","rules"])]),_:1})}}}));var et=me(Ze,[["__scopeId","data-v-91d58d2c"]]);const tt=l=>T.post("/admin/product/saveSkuInfo",l);const ut={class:"attr-wrap"},at={class:"attr-name"},lt={class:"attr-wrap"},st={class:"attr-name"},ot=U("\u9ED8\u8BA4"),nt=U(" \u8BBE\u7F6E\u9ED8\u8BA4\u56FE\u7247 "),rt=U("\u4FDD\u5B58"),it=U("\u53D6\u6D88"),dt={name:"AddSku"},pt=ae(q(z({},dt),{emits:["setIsShow"],setup(l,{emit:i}){const s=re(),I=ne(),V=f([]),D=f([]),w=f([]);K(async()=>{const _=s.spuItem.id;V.value=await _e(_)}),K(async()=>{const _=s.spuItem.id;D.value=await ge(_)}),K(async()=>{const{category1Id:_,category2Id:p,category3Id:d}=I;w.value=await Ee({category1Id:_,category2Id:p,category3Id:d})});const N=f(),m=ue({skuName:"",price:0,weight:0,skuDesc:"",skuAttrValueList:[],skuSaleAttrValueList:[],skuImageList:[],skuDefaultImg:""}),P=ue({skuName:[{required:!0,message:"\u8BF7\u8F93\u5165SKU\u540D\u79F0",trigger:"blur"}],price:[{required:!0,message:"\u8BF7\u8F93\u5165SKU\u4EF7\u683C",trigger:"blur"}],weight:[{required:!0,message:"\u8BF7\u8F93\u5165SKU\u91CD\u91CF",trigger:"blur"}],skuDesc:[{required:!0,message:"\u8BF7\u8F93\u5165SKU\u89C4\u683C\u63CF\u8FF0",trigger:"blur"}],skuAttrValueList:[{required:!0,message:"\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4E2ASKU\u5E73\u53F0\u5C5E\u6027"}],skuSaleAttrValueList:[{required:!0,message:"\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4E2ASKU\u9500\u552E\u5C5E\u6027"}],skuImageList:[{required:!0,validator:(_,p,d)=>{if(!p.length){d(new Error("\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u5F20\u56FE\u7247"));return}if(!p.some(C=>C.isDefault==="1")){d(new Error("\u8BF7\u9009\u4E2D\u9ED8\u8BA4\u56FE\u7247"));return}d()}}]}),h=_=>{m.skuImageList=_},g=_=>{V.value.forEach(p=>{p.isDefault="0"}),_.isDefault="1",m.skuDefaultImg=_.imgUrl},b=async()=>{await N.value.validate(),await tt(q(z({},m),{skuAttrValueList:m.skuAttrValueList.filter(Boolean).map(_=>{const[p,d,C,L]=_.split(":");return{attrId:+p,attrName:d,valueId:+C,valueName:L}}),skuSaleAttrValueList:m.skuSaleAttrValueList.filter(Boolean).map(_=>{const[p,d,C,L]=_.split(":");return{saleAttrId:+p,saleAttrName:d,saleAttrValueId:+C,saleAttrValueName:L}}),spuId:s.spuItem.id,category3Id:I.category3Id})),oe.success("\u6DFB\u52A0SKU\u6210\u529F"),B()},B=()=>{i("setIsShow",1)};return(_,p)=>{const d=a("el-form-item"),C=a("el-input"),L=a("el-input-number"),M=a("el-option"),y=a("el-select"),X=a("el-col"),$=a("el-row"),G=a("el-table-column"),le=a("el-image"),Y=a("el-tag"),u=a("el-button"),o=a("el-table"),k=a("el-form"),v=a("el-card");return c(),F(v,{shadow:"hover",class:"mt-20"},{default:t(()=>[e(k,{"label-width":"100px",ref_key:"skuFormRef",ref:N,model:m,rules:P},{default:t(()=>[e(d,{label:"SPU\u540D\u79F0"},{default:t(()=>[U(te(A(s).spuItem.spuName),1)]),_:1}),e(d,{label:"SKU\u540D\u79F0",prop:"skuName"},{default:t(()=>[e(C,{placeholder:"\u8BF7\u8F93\u5165SKU\u540D\u79F0",modelValue:m.skuName,"onUpdate:modelValue":p[0]||(p[0]=n=>m.skuName=n)},null,8,["modelValue"])]),_:1}),e(d,{label:"\u4EF7\u683C(\u5143)",prop:"price"},{default:t(()=>[e(L,{min:0,"controls-position":"right",class:"sku-input-number",modelValue:m.price,"onUpdate:modelValue":p[1]||(p[1]=n=>m.price=n)},null,8,["modelValue"])]),_:1}),e(d,{label:"\u91CD\u91CF(\u5343\u514B)",prop:"weight"},{default:t(()=>[e(L,{min:0,"controls-position":"right",class:"sku-input-number",modelValue:m.weight,"onUpdate:modelValue":p[2]||(p[2]=n=>m.weight=n)},null,8,["modelValue"])]),_:1}),e(d,{label:"\u89C4\u683C\u63CF\u8FF0",prop:"skuDesc"},{default:t(()=>[e(C,{placeholder:"\u8BF7\u8F93\u5165\u89C4\u683C\u63CF\u8FF0",type:"textarea",rows:3,modelValue:m.skuDesc,"onUpdate:modelValue":p[3]||(p[3]=n=>m.skuDesc=n)},null,8,["modelValue"])]),_:1}),e(d,{label:"\u5E73\u53F0\u5C5E\u6027",prop:"skuAttrValueList"},{default:t(()=>[e($,{class:"attr-row"},{default:t(()=>[(c(!0),x(O,null,R(w.value,(n,E)=>(c(),F(X,{xs:24,md:12,lg:8,xl:6,key:n.id},{default:t(()=>[J("div",ut,[J("div",at,te(n.attrName),1),e(y,{modelValue:m.skuAttrValueList[E],"onUpdate:modelValue":S=>m.skuAttrValueList[E]=S},{default:t(()=>[(c(!0),x(O,null,R(n.attrValueList,S=>(c(),F(M,{key:S.id,label:S.valueName,value:`${n.id}:${n.attrName}:${S.id}:${S.valueName}`},null,8,["label","value"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue"])])]),_:2},1024))),128))]),_:1})]),_:1}),e(d,{label:"\u9500\u552E\u5C5E\u6027",prop:"skuSaleAttrValueList"},{default:t(()=>[e($,{class:"attr-row"},{default:t(()=>[(c(!0),x(O,null,R(D.value,(n,E)=>(c(),F(X,{xs:24,md:12,lg:8,xl:6,key:n.id},{default:t(()=>[J("div",lt,[J("div",st,te(n.saleAttrName),1),e(y,{modelValue:m.skuSaleAttrValueList[E],"onUpdate:modelValue":S=>m.skuSaleAttrValueList[E]=S},{default:t(()=>[(c(!0),x(O,null,R(n.spuSaleAttrValueList,S=>(c(),F(M,{key:S.id,label:S.saleAttrValueName,value:`${n.id}:${n.saleAttrName}:${S.id}:${S.saleAttrValueName}:`},null,8,["label","value"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue"])])]),_:2},1024))),128))]),_:1})]),_:1}),e(d,{label:"\u56FE\u7247\u5217\u8868",prop:"skuImageList"},{default:t(()=>[e(o,{data:V.value,border:"",onSelectionChange:h},{default:t(()=>[e(G,{type:"selection",width:"60"}),e(G,{label:"\u56FE\u7247"},{default:t(({row:n})=>[e(le,{src:n.imgUrl,class:"sku-img"},null,8,["src"])]),_:1}),e(G,{label:"\u540D\u79F0",prop:"imgName"}),e(G,{label:"\u64CD\u4F5C"},{default:t(({row:n})=>[n.isDefault==="1"?(c(),F(Y,{key:0,type:"success"},{default:t(()=>[ot]),_:1})):(c(),F(u,{key:1,type:"primary",size:"small",onClick:E=>g(n)},{default:t(()=>[nt]),_:2},1032,["onClick"]))]),_:1})]),_:1},8,["data"])]),_:1}),e(d,null,{default:t(()=>[e(u,{type:"primary",onClick:b},{default:t(()=>[rt]),_:1}),e(u,{onClick:B},{default:t(()=>[it]),_:1})]),_:1})]),_:1},8,["model","rules"])]),_:1})}}}));var ct=me(pt,[["__scopeId","data-v-4742d984"]]);const mt={name:"XSpu"},kt=ae(q(z({},mt),{setup(l){const i=f(1),s=I=>{i.value=I};return(I,V)=>(c(),x("div",null,[e(Ve,{disabled:i.value!==1},null,8,["disabled"]),i.value===1?(c(),F(Xe,{key:0,onSetIsShow:s})):i.value===2?(c(),F(et,{key:1,onSetIsShow:s})):(c(),F(ct,{key:2,onSetIsShow:s}))]))}}));export{kt as default};
