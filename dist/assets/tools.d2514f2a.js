import{s as r}from"./request.59cff57c.js";import{K as t}from"./index.fbf6442c.js";const d=(e,a)=>r.get(`/admin/product/baseTrademark/${e}/${a}`),m=()=>r.get("/admin/product/baseTrademark/getTrademarkList"),p=(e,a)=>r.post("/admin/product/baseTrademark/save",{tmName:e,logoUrl:a}),i=e=>r.put("/admin/product/baseTrademark/update",e),n=e=>r.delete(`/admin/product/baseTrademark/remove/${e}`),o=e=>{if(["image/jpeg","image/png"].includes(e.type)){if(e.size>250*1024)return t.error("\u56FE\u7247\u5927\u5C0F\u4E0D\u80FD\u8D85\u8FC7250kb!"),!1}else return t.error("\u56FE\u7247\u53EA\u80FD\u662Fjpg\u6216png\u683C\u5F0F!"),!1;return!0};export{p as a,o as b,m as c,n as d,d as g,i as u};
