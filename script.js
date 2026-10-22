(function(){
'use strict';
var POS={0:'50% 40%',1:'50% 45%',2:'50% 35%',3:'50% 45%',4:'50% 50%',5:'45% 50%',6:'50% 40%',7:'40% 40%',8:'50% 55%',9:'50% 80%',10:'45% 40%',11:'45% 45%',12:'55% 82%',13:'55% 78%',14:'50% 40%',15:'50% 40%'};
function setImg(i,n){n=+n;i.onload=function(){fit(i);layoutStrips()};i.src='p'+(n<10?'0':'')+n+'.jpg';i.style.objectPosition=POS[n]||'50% 40%';i.alt='A memory of us';i.decoding='async';if(i.complete&&i.naturalWidth){fit(i);layoutStrips()}}

function fit(i){var f=i.closest('.pol');if(!f||!i.naturalWidth)return;var ar=i.naturalWidth/i.naturalHeight;i.style.aspectRatio=ar;f.style.setProperty('--k',Math.min(1.3,Math.max(.75,Math.sqrt(ar))))}
function layoutStrips(){
  var port=matchMedia('(orientation:portrait),(max-aspect-ratio:1/1)').matches;
  document.querySelectorAll('.strip').forEach(function(s){
    var im=[].slice.call(s.querySelectorAll('img'));
    if(!im.every(function(i){return i.naturalWidth}))return;
    var ar=im.map(function(i){return i.naturalWidth/i.naturalHeight}),n=im.length,W=innerWidth,H=innerHeight;
    if(port){var sum=ar.reduce(function(a,b){return a+b},0),h=Math.min(W*.27,(W*.94-12-6*(n-1))/sum);
      im.forEach(function(i,k){i.style.height=h+'px';i.style.width=h*ar[k]+'px'})}
    else{var sm=ar.reduce(function(a,b){return a+1/b},0),w=Math.min(H*.22,W*.17,(H*.9-12-6*(n-1))/sm);
      im.forEach(function(i,k){i.style.width=w+'px';i.style.height=w/ar[k]+'px'})}
  });
}
addEventListener('resize',layoutStrips);addEventListener('orientationchange',function(){setTimeout(layoutStrips,200)});
document.querySelectorAll('img[data-p]').forEach(function(i){setImg(i,i.dataset.p)});

var $=function(s){return document.querySelector(s)};
var screens=[].slice.call(document.querySelectorAll('.screen'));
var cur=-1,tok=0;

/* stars */
function stars(el,gold){
  var cols=gold?['#f6c63a','#f6c63a','#ffd95e']:['#e8412c','#f3a31c','#2aa6d8','#e55a9c','#8d8d96','#2f7de1','#4cb86b','#f0c419'];
  for(var k=0;k<(gold?7:26);k++){var s=document.createElement('i'),z=(gold?5:2.6)+Math.random()*(gold?3:3.2);
    s.style.cssText='left:'+(Math.random()*96)+'%;top:'+(Math.random()*94)+'%;width:'+z+'vmin;height:'+z+'vmin;background:'+cols[k%cols.length]+';animation-delay:'+(Math.random()*3)+'s;transform:rotate('+(Math.random()*60-30)+'deg)';el.appendChild(s)}
}
document.querySelectorAll('.stars').forEach(function(e){stars(e,e.classList.contains('gold'))});

/* typing (tap the text to finish instantly) */
function type(el,text,speed,done){
  var my=tok,i=0,over=false;el.textContent='';
  function fin(){if(over)return;over=true;el.textContent=text;el.onclick=null;done&&done()}
  el.onclick=function(){if(my===tok)fin()};
  (function tick(){
    if(my!==tok||over)return;
    if(i>=text.length){fin();return}
    var c=text.charAt(i++);
    if(c>='\ud800'&&c<='\udbff')c+=text.charAt(i++);
    el.textContent+=c;setTimeout(tick,speed)})();
}
var NOTE4="Happy Birthday to the one who makes my world brighter every single day.\nNo matter how many birthdays come and go, I'll always be grateful that you were born and that our paths crossed. You are my favorite person, my greatest comfort, and the reason behind so many of my happiest moments.\nI hope this year brings you every dream you're chasing, endless laughter, good health, and all the love your heart can hold. And through it all, I hope I get to stand beside you, celebrating every little victory together.\nI love you more than words can ever say. Happy Birthday, my forever favorite. ♥";
var NOTE6="If there's one thing I'll always be grateful for, it's finding you.\nYou've brought so much warmth, peace, and happiness into my life in ways I never thought possible. With you, even the simplest moments become memories I want to hold onto forever.\nThank you for loving me, believing in me, and standing by my side through everything. You make me want to be a better person every single day.\nNo matter where life takes us, my heart will always choose you. Today, tomorrow, and every day after that.\nI love you, endlessly. ♥";

function showNext(sc){var b=screens[sc].querySelector('.next');b&&b.classList.add('show')}
var enter={
 0:function(){var s=$('#sticker');s.classList.remove('peel')},
 2:function(){$('#env').classList.remove('open');type($('#t3'),'hey, i have a surprise for youhh muskuuu',55)},
 3:function(){type($('#t4'),NOTE4,16,function(){showNext(3)})},
 4:function(){
   var lis=[].slice.call(document.querySelectorAll('#paper li')),p=$('#paper'),b=screens[4].querySelector('.next');
   p.scrollTop=0;lis.forEach(function(l,i){l.classList.remove('in');setTimeout(function(){l.classList.add('in')},300+i*350)});
   var chk=function(){if(p.scrollTop+p.clientHeight>=p.scrollHeight-6)b.classList.add('show')};
   p.onscroll=chk;var my=tok;setTimeout(function(){if(my===tok)b.classList.add('show')},9000);
   var ims=[].slice.call(document.querySelectorAll('#s5 .pol img')),pool=[0,8,14,3,7],k=0;
   clearInterval(enter.t);enter.t=setInterval(function(){var im=ims[k%3];im.style.opacity=0;
     setTimeout(function(){setImg(im,pool[(k+3)%5]);im.style.opacity=1;k++},500)},3200)},
 5:function(){type($('#t6'),NOTE6,16,function(){showNext(5)})},
 7:function(){playVids();setTimeout(playVids,300)},
 6:function(){type($('#t7a'),'Happy birthday Muskuuu',60,function(){type($('#t7b'),'Manifesting a lifetime of memories',45,function(){showNext(6)})})}
};
function go(n){
  if(n===cur)return;tok++;clearInterval(enter.t);
  
  screens.forEach(function(s,i){s.classList.toggle('on',i===n);if(i===n)s.querySelectorAll('.hid').forEach(function(b){b.classList.remove('show')})});
  cur=n;vidWatch(n===7);if(n===0)stopMusic();else if(wantMusic&&au.paused)tryPlay();enter[n]&&enter[n]();
}
document.querySelectorAll('[data-go]').forEach(function(b){b.addEventListener('click',function(){
  var n=+b.dataset.go;
  if(cur===0){tryPlay();$('#sticker').classList.add('peel');setTimeout(function(){go(n)},650)}else go(n)})});
$('#sticker').addEventListener('click',function(){$('#s1 .next').click()});
$('#open').addEventListener('click',function(){$('#env').classList.add('open');setTimeout(function(){go(3)},1500)});
$('#restart').addEventListener('click',function(){go(0)});
/* videos: muted, looping, all play together */
function playVids(){document.querySelectorAll('video').forEach(function(v){v.muted=true;v.defaultMuted=true;v.loop=true;v.setAttribute('playsinline','');if(v.paused){var p=v.play();if(p&&p.catch)p.catch(function(){})}})}
/* keep trying while the videos screen is open (iPhone can refuse the first attempt) */
var vt=null;
function vidWatch(on){clearInterval(vt);if(on)vt=setInterval(playVids,800)}
document.querySelectorAll('video').forEach(function(v){['loadeddata','canplay','suspend','stalled'].forEach(function(e){v.addEventListener(e,function(){if(cur===7)playVids()})})});

/* ===== music: song 1 starts at 01:48 and loops back to 01:48 ===== */
var SONGS=window.__SONGS||[{src:'song1.mp3',start:108}];   /* to add a 2nd song later: {src:'song2.mp3',start:0} */
var au=$('#bgm'),si=0,wantMusic=true;
window.birthdayAudio=au;
function loadSong(i){si=i;au.src=SONGS[i].src;au.load()}
au.addEventListener('loadedmetadata',function(){try{au.currentTime=SONGS[si].start}catch(e){}});
au.addEventListener('playing',function(){if(au.currentTime<SONGS[si].start-1){try{au.currentTime=SONGS[si].start}catch(e){}}});
au.addEventListener('ended',function(){try{au.currentTime=SONGS[si].start}catch(e){}if(wantMusic)au.play().catch(function(){})});
function tryPlay(){if(!wantMusic)return;var p=au.play();if(p&&p.catch)p.catch(function(){})}
/* autoplay as soon as the browser allows it: on load, when audio is ready, and on the first touch/click */
function unlock(){if(cur>0&&wantMusic&&au.paused)tryPlay();if(cur===7)playVids()}
function stopMusic(){au.pause();try{au.currentTime=SONGS[si].start}catch(e){}}
['pointerdown','touchstart','touchend','click','keydown'].forEach(function(ev){addEventListener(ev,unlock,{capture:true,passive:true})});
au.addEventListener('canplay',unlock);
/* music stops when the page is closed / hidden */
addEventListener('pagehide',function(){au.pause()});
document.addEventListener('visibilitychange',function(){if(document.hidden)au.pause();else if(wantMusic&&cur>0)tryPlay()});
loadSong(0);
var h=+(location.hash.slice(1));go(h>0&&h<9?h:0);
})();
