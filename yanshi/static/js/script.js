function ajax(a,b,c){var e,d=new XMLHttpRequest;d.onreadystatechange=function(){4===d.readyState&&200===d.status&&c(d.responseText)},e=new FormData,e.append("file",b),d.open("post",a,!0),d.send(e)}function copyToClipboard(a){var c,d,e,b=document.getElementById(a.id).getAttribute("data-url");if(null==b)return alert("请稍等，正在上传中..."),!1;c=document.createElement("textarea"),c.style.position="fixed",c.style.top="0",c.style.left="0",c.style.width="2em",c.style.height="2em",c.style.padding="0",c.style.border="none",c.style.outline="none",c.style.boxShadow="none",c.style.background="transparent",c.value=b,document.body.appendChild(c),c.select();try{d=document.execCommand("copy"),e=d?"成功复制到剪贴板":"该浏览器不支持点击复制到剪贴板",alert(e)}catch(f){alert("该浏览器不支持点击复制到剪贴板")}document.body.removeChild(c)}var dragtl,itemMarkup,deleteItem,inputObj,droppable=document.querySelector(".droppable"),list=document.querySelector(".list"),ball=document.querySelector(".ball"),filledBall=document.querySelector(".filled-ball"),hand=document.querySelector(".hand"),reader=new FileReader,formatBytes=function(a){var c,d,e,f,b=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2;return 0===a?"0 Bytes":(c=1024,d=0>b?0:b,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c)),parseFloat((a/Math.pow(c,f)).toFixed(d))+e[f])},isDragging=0;document.addEventListener("dragover",function(a){a.preventDefault(),isDragging++,1===isDragging&&droppable.classList.add("is-dragging")}),document.addEventListener("drop",function(a){a.preventDefault(),isDragging=0,droppable.classList.remove("is-dragging")}),list.addEventListener("dragover",function(a){a.preventDefault()}),dragtl=gsap.timeline({paused:!0}),dragtl.to(ball,{duration:.4,translateX:"286px",autoAlpha:1,translateY:"-230px"},"drag").to(hand,{duration:.4,transformOrigin:"right",rotate:"66deg",translateY:"70px",translateX:"-20px"},"drag"),list.addEventListener("dragenter",function(a){a.preventDefault(),droppable.classList.add("is-over"),dragtl.play()}),list.addEventListener("dragleave",function(a){a.preventDefault(),droppable.classList.remove("is-over"),dragtl.reverse()}),list.addEventListener("drop",function(a){var b,c,d,e;a.preventDefault(),b=0,c=a.offsetX,d=a.offsetY,e=a.dataTransfer.files,reader.readAsDataURL(e[0]),reader.addEventListener("load",function(){b++,b>1||itemMarkup(e[0],reader.result,c,d)}),droppable.classList.remove("is-over")}),itemMarkup=function(a,b,c,d){var g,h,i,j,k,m,n,o,p,e=document.createElement("div"),f=Math.random().toString(36).substr(2,9);e.classList.add("item"),e.setAttribute("id",f),e.innerHTML='<div class="item-img"><img src="'+b+'"/></div><div class="item-details"><div class="item-name">'+a.name+'</div><div class="item-size">SIZE:'+formatBytes(a.size)+'</div></div><button class="item-delete"data-id="'+f+'"></button><button class="item-delete item-url"id="'+f+'iAjue"onclick="copyToClipboard(this)">复制</button>',list.append(e),g=e.querySelector(".item-delete"),g.addEventListener("click",function(a){a.stopPropagation(),deleteItem(a)}),h=e.querySelector(".item-img"),i=h.offsetLeft,j=h.offsetTop,k=document.createElement("div"),k.classList.add("loaded-image"),k.innerHTML='<img src="'+b+'"/><span><svg fill="#fff"xmlns="http://www.w3.org/2000/svg"viewBox="0 0 330 330"><path d="M165 7.5c-8.284 0-15 6.716-15 15v60c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15v-60c0-8.284-6.716-15-15-15z"/><path d="M165 262.5c-8.284 0-15 6.716-15 15v30c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15v-30c0-8.284-6.716-15-15-15z"/><path d="M315 157.5h-60c-8.284 0-15 6.716-15 15s6.716 15 15 15h60c8.284 0 15-6.716 15-15s-6.716-15-15-15z"/><path d="M90 172.5c0-8.284-6.716-15-15-15H15c-8.284 0-15 6.716-15 15s6.716 15 15 15h60c8.284 0 15-6.716 15-15z"/><path d="M281.673 55.827c-5.857-5.858-15.355-5.858-21.213 0l-42.427 42.427c-5.858 5.858-5.858 15.355 0 21.213 2.929 2.929 6.768 4.394 10.606 4.394 3.839 0 7.678-1.464 10.607-4.394l42.427-42.427c5.858-5.858 5.858-15.355 0-21.213z"/><path d="M90.753 225.533L48.328 267.96c-5.857 5.858-5.857 15.355 0 21.213 2.929 2.929 6.768 4.393 10.607 4.393 3.839 0 7.678-1.464 10.607-4.393l42.426-42.427c5.857-5.858 5.857-15.355 0-21.213-5.859-5.858-15.356-5.858-21.215 0z"/><path d="M69.541 55.827c-5.858-5.858-15.355-5.857-21.213 0-5.858 5.858-5.858 15.355 0 21.213l42.426 42.427c2.93 2.929 6.768 4.394 10.607 4.394 3.838 0 7.678-1.465 10.606-4.393 5.858-5.858 5.858-15.355 0-21.213L69.541 55.827z"/></svg></span>',list.append(k),m=gsap.timeline({onComplete:function(){k.remove(),h.style.opacity=1,list.scrollTo(0,list.scrollHeight)}}),n=e.querySelectorAll("*:not(.item-img)"),o=k.querySelector("img"),p=k.querySelector("span"),e.offsetLeft,e.offsetTop,ajax("update.php",a,function(a){if(a=JSON.parse(a),0==a.code){var b=e.querySelector(".item-url");b.setAttribute("data-url",a.msg),b.addEventListener("click",function(a){a.stopPropagation()},!1)}else alert(a.msg),e.querySelector(".item-delete").click()}),m.set(droppable,{pointerEvents:"none"}).fromTo(k,{autoAlpha:1,width:20,height:20,x:c-10,y:d-10,borderRadius:"50%"},{duration:.3,width:70,height:70,x:c-30,y:d-30}).to(p,{autoAlpha:1,duration:.4},"loading").to(k,{rotation:720,duration:1.2},"loading").to(p,{autoAlpha:0,duration:.4}).to(o,{autoAlpha:1,duration:.4},"-=.1").to(k,{x:i,y:j,duration:.8,autoAlpha:1,width:60,height:48,borderRadius:4},"-=.5").set(h,{autoAlpha:1}).fromTo(n,{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:.3,stagger:.06}).to(k,{autoAlpha:0,duration:.3},"-=.2").set(droppable,{pointerEvents:"all"})},deleteItem=function(a){var b=a.target.parentNode,c=b.querySelectorAll(":scope > *"),d=gsap.timeline({onComplete:function(){b.remove();var a=document.querySelector(".item");a||dragtl.reverse()}});d.to(c,{autoAlpha:0,y:-10,duration:.2,stagger:.1}).to(b,{height:0,paddingTop:0,paddingBottom:0,duration:.5},"-=.15")},inputObj=document.getElementById("_ef"),list.onclick=function(a){"list"==a.target.className&&inputObj.click()},inputObj.onchange=function(){var a,b;try{a=this.files[0],window.FileReader&&(b=new FileReader,b.readAsDataURL(a),b.onloadend=function(b){itemMarkup(a,b.target.result,50,50)})}catch(c){}};