'use strict';
/* DEEP FIN — original shark survival arcade. Extended with MORE BOSSES & GIANT ENEMIES! */
const $=i=>document.getElementById(i),cv=$('c'),mctx=cv.getContext('2d');let ctx=mctx;
const R=(a,b)=>a+Math.random()*(b-a),C=(v,a,b)=>Math.max(a,Math.min(b,v)),P2=Math.PI*2,RI=(a,b)=>Math.floor(R(a,b+1));
let W=1,H=1,DPR=1,Z=1;
function resize(){DPR=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px'}
addEventListener('resize',resize);resize();

/* ================= DATA ================= */
const WW=2600,WH=7000,ZN=['Shallow Ocean','Coral Reef','Deep Ocean','Abyss'];
const zoneAt=y=>y>=5000?3:y>=3200?2:y>=1500?1:0;
const SZN=['XS','S','M','L','XL','XXL','!!'],szc=s=>s<10?0:s<18?1:s<30?2:s<45?3:s<65?4:s<95?5:6;
const SZL=['XS','S','M','L','XL','XXL','XXL+','APEX'];
const SH=[
{n:'BABY FIN',s:16,hp:60,sp:230,bs:18,bo:100,tn:7,col:'#4dd0e1',u:'Starter'},
{n:'REEF FIN',s:21,hp:85,sp:250,bs:25,bo:110,tn:6,col:'#4dabf7',u:'Reach Player Lv.3',c:['lv',3]},
{n:'HUNTER FIN',s:27,hp:120,sp:275,bs:33,bo:120,tn:5,col:'#9775fa',u:'Reach Player Lv.5',c:['lv',5]},
{n:'RAZOR FIN',s:33,hp:155,sp:290,bs:42,bo:130,tn:4.5,col:'#f06595',u:'Reach Player Lv.7',c:['lv',7]},
{n:'APEX FIN',s:39,hp:200,sp:310,bs:52,bo:145,tn:4,col:'#ff922b',u:'Reach Player Lv.10',c:['lv',10]},
{n:'ABYSS FIN',s:46,hp:260,sp:300,bs:63,bo:160,tn:3.5,col:'#7048e8',u:'Reach the Abyss',c:['zone',3]},
{n:'TITAN FIN',s:54,hp:350,sp:280,bs:78,bo:180,tn:3,col:'#20c997',u:'Defeat the Boss',c:['boss']},
{n:'OCEAN KING',s:62,hp:450,sp:320,bs:100,bo:200,tn:3,col:'#ffd43b',u:'Reach Player Lv.15',c:['lv',15]}];
const need=l=>60*l*(l-1),slv=xp=>{let l=1;while(l<10&&xp>=need(l+1))l++;return l},plv=xp=>{let l=1;while(xp>=50*(l+1)*l)l++;return l};
const TY={
tiny:{n:'Tiny Fish',size:7,sp:60,score:8,xp:2,col:'#9be7ff',b:'school'},
small:{n:'Small Fish',size:11,sp:70,score:14,xp:3,coin:1,col:'#74c0fc'},
yellow:{n:'Yellow Fish',size:15,sp:80,score:22,xp:4,coin:1,col:'#ffd23f'},
blue:{n:'Blue Fish',size:17,sp:85,score:28,xp:5,coin:1,col:'#4dabf7',b:'school'},
clown:{n:'Clown Fish',size:16,sp:75,score:30,xp:5,coin:2,col:'#ff922b',st:1},
fast:{n:'Fast Fish',size:15,sp:190,score:40,xp:6,coin:2,col:'#63e6be',b:'flee'},
large:{n:'Large Fish',size:30,hp:2,sp:85,score:70,xp:10,coin:3,col:'#69db7c'},
rare:{n:'Rare Fish',size:26,hp:2,sp:100,score:150,xp:25,coin:8,col:'#da77f2',rare:1},
golden:{n:'Golden Fish',size:20,sp:215,score:300,xp:60,coin:40,col:'#ffd43b',b:'flee',rare:1,gold:1},
squid:{n:'Squid',size:24,sp:70,score:60,xp:9,coin:3,col:'#ff8787',k:'squid'},
turtle:{n:'Turtle',size:38,hp:3,sp:50,score:130,xp:18,coin:6,col:'#8ce99a',k:'turtle'},
tuna:{n:'Tuna',size:42,hp:3,sp:120,score:160,xp:22,coin:7,col:'#5c7cfa'},
barracuda:{n:'Barracuda',size:34,hp:3,sp:150,dmg:14,score:130,xp:20,coin:6,col:'#adb5bd',b:'hunt'},
eel:{n:'Electric Eel',size:44,hp:3,sp:120,dmg:20,score:220,xp:30,coin:10,col:'#fcc419',k:'eel',b:'hunt'},
eshark:{n:'Enemy Shark',size:58,hp:5,sp:150,dmg:28,score:400,xp:50,coin:18,col:'#868e96',k:'shark',b:'hunt'},
giant:{n:'Giant Fish',size:68,hp:6,sp:80,dmg:32,score:600,xp:70,coin:25,col:'#e8590c',b:'hunt'},
angler:{n:'Angler',size:62,hp:5,sp:110,dmg:30,score:520,xp:60,coin:22,col:'#5f3dc4',k:'angler',b:'hunt'},
boss:{n:'Giant Shark',size:85,hp:18,sp:100,dmg:42,score:3000,xp:400,coin:300,col:'#c2255c',k:'shark',b:'hunt',boss:1},
jelly:{n:'Jellyfish',size:22,hp:99,sp:30,dmg:12,col:'#f783ac',k:'jelly',b:'drift',hz:1},
mine:{n:'Sea Mine',size:18,hp:99,sp:0,dmg:35,col:'#495057',k:'mine',b:'static',hz:1},
spike:{n:'Spike Rock',size:30,hp:99,sp:0,dmg:15,col:'#6c757d',k:'spike',b:'static',hz:1}};
for(const k in TY)TY[k]=Object.assign({hp:1,dmg:0,coin:0,score:0,xp:0,b:'wander',k:'fish'},TY[k]);

/* 🔥 เพิ่มอัตราส่วนการเกิดของปลาตัวใหญ่ ปลาล่าเหยื่อ และบอส ในทุกโซน */
const ZW=[
{tiny:4,small:4,yellow:3,blue:2,clown:2,fast:1,large:2,barracuda:1.5,eshark:1,rare:.3,golden:.15,turtle:.5,jelly:1,mine:.4},
{small:2,yellow:2,blue:2,clown:2,fast:2,large:5,barracuda:3,eshark:2.5,giant:2,rare:.5,golden:.2,squid:2,turtle:1.5,jelly:2,mine:1,spike:1},
{large:4,tuna:3,turtle:2,squid:1,rare:.6,golden:.2,barracuda:4,eel:3,eshark:4,giant:3.5,angler:2,jelly:2,mine:2,spike:1.5},
{large:2,tuna:2,rare:1,golden:.3,eel:3,eshark:5,giant:5,angler:4,jelly:1.5,mine:2,spike:2}];

/* 🔥 เพิ่มโควต้าความจุสูงสุดของพวกยักษ์ใหญ่และบอสในฉาก */
const CAP={boss:3,mine:7,spike:5,jelly:8,giant:6,angler:5,eshark:7,eel:5,golden:2,rare:3};
const PU={speed:{i:'⚡',c:'#ffe066',t:8,n:'SPEED BOOST'},heal:{i:'❤️',c:'#ff6b6b',t:0,n:'FULL HEALTH'},magnet:{i:'🧲',c:'#74c0fc',t:12,n:'COIN MAGNET'},
 rush:{i:'🔥',c:'#ff922b',t:0,n:'GOLD RUSH'},shield:{i:'🛡',c:'#4dabf7',t:20,n:'SHIELD'},slow:{i:'❄',c:'#a5d8ff',t:7,n:'SLOW MOTION'}};
const UP={health:{i:'❤️',n:'HEALTH',b:40,m:7},speed:{i:'⚡',n:'SPEED',b:50,m:7},bite:{i:'🦷',n:'BITE',b:120,m:4},boost:{i:'🚀',n:'BOOST',b:60,m:5},armor:{i:'🛡',n:'ARMOR',b:80,m:4},magnet:{i:'🧲',n:'COIN MAGNET',b:70,m:4}};
const upVal=(k,l)=>{const s=SH[Save.d.sel];return k==='health'?s.hp+l*10:k==='speed'?s.sp+l*15:k==='bite'?Math.round(s.bs*(1+l*.07)):k==='boost'?Math.round(s.bo*(1+l*.12)):k==='armor'?l*5+'%':['OFF','70','110','160','220'][l]};
const upCost=(k,l)=>Math.round(UP[k].b*Math.pow(1.5,l));
const SHOP=[{id:'shield',i:'🛡',n:'START SHIELD',p:90,d:'Begin each run with a shield'},{id:'magnet',i:'🧲',n:'START MAGNET',p:70,d:'30s coin magnet at start'},{id:'xp',i:'✨',n:'XP BOOST',p:120,d:'×1.5 XP for one run'},{id:'boost',i:'🚀',n:'START BOOST',p:60,d:'10s speed burst at start'}];
const TR=[{id:'c0',n:'Aqua Trail',col:'#7ee8ff',p:0},{id:'c1',n:'Gold Trail',col:'#ffd43b',p:300},{id:'c2',n:'Pink Trail',col:'#ff8cc6',p:300},{id:'c3',n:'Lime Trail',col:'#a9e34b',p:400},{id:'c4',n:'Violet Trail',col:'#b197fc',p:500}];
const MIS=[{t:'Eat 50 Fish',g:50,f:d=>d.st.fish,c:60,x:40},{t:'Collect 100 Coins',g:100,f:d=>d.st.coins,c:50,x:30},{t:'Survive 2 Minutes',g:120,f:d=>d.st.longest,c:60,x:40},
{t:'Reach Player Level 5',g:5,f:d=>plv(d.xp),c:100,x:0},{t:'Enter Deep Ocean',g:2,f:d=>d.st.zone,c:80,x:50},{t:'Eat 10 Large Fish',g:10,f:d=>d.st.large,c:80,x:60},
{t:'Activate Gold Rush',g:1,f:d=>d.st.rush,c:60,x:40},{t:'Travel 5000m',g:5000,f:d=>d.st.dist,c:120,x:80}];
const AC=[['FIRST BITE','Eat your first fish',d=>d.st.fish>=1,20],['FISH EATER','Eat 100 fish',d=>d.st.fish>=100,50],['BIG EATER','Eat 50 large fish',d=>d.st.large>=50,100],['COIN HUNTER','Collect 500 coins',d=>d.st.coins>=500,80],
['GOLD RUSH','Activate Gold Rush',d=>d.st.rush>=1,40],['SURVIVOR','Survive 3 minutes',d=>d.st.longest>=180,80],['DEEP DIVER','Enter Deep Ocean',d=>d.st.zone>=2,60],['ABYSS EXPLORER','Enter the Abyss',d=>d.st.zone>=3,120],
['TREASURE HUNTER','Open 10 chests',d=>d.st.chest>=10,100],['COMBO MASTER','Reach combo x20',d=>d.st.combo>=30,150],['SHARK COLLECTOR','Unlock 5 sharks',d=>d.un.filter(Boolean).length>=5,200],['APEX','Unlock Apex Fin',d=>d.un[4],150],
['BOSS HUNTER','Defeat a boss',d=>d.st.boss>=1,300],['OCEAN KING','Unlock Ocean King',d=>d.un[7],500],['DISTANCE RUNNER','Swim 10,000m',d=>d.st.dist>=10000,150],['RICH SHARK','Hold 5,000 coins',d=>d.coins>=5000,200],
['MASTER SHARK','Reach shark level 10',d=>Object.values(d.sx).some(x=>slv(x)>=10),200],['PERFECT RUN','Survive 60s without damage',d=>d.st.perfect>=1,100],['GOLDEN CATCH','Eat a Golden Fish',d=>d.st.gold>=1,80],['TRUE SURVIVOR','Survive 60s in the Abyss',d=>d.st.abyss>=60,250]];
const LM=[{n:'TREASURE COVE',x:650,y:900,chest:'gold'},{n:'CORAL CAVE',x:WW-700,y:2000,chest:'wood'},{n:'SHIPWRECK',x:800,y:3700,chest:'gold'},{n:'THE ABYSS',x:WW/2,y:5050},{n:'BOSS AREA',x:WW/2,y:6300,chest:'rare'}];
const DAILY=[50,75,100,150,200,300,'SPECIAL'];

/* ================= SAVE ================= */
function mg(a,b){for(const k in b){if(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k])&&a[k]&&typeof a[k]==='object')mg(a[k],b[k]);else a[k]=b[k]}return a}
const Save={k:'DEEP_FIN_SAVE',d:null,
 def(){return{coins:0,best:0,xp:0,sx:{},sel:0,un:[1,0,0,0,0,0,0,0],up:{health:0,speed:0,bite:0,boost:0,armor:0,magnet:0},ms:{},ach:{},
 st:{fish:0,large:0,coins:0,dist:0,combo:0,longest:0,games:0,score:0,chest:0,boss:0,rush:0,gold:0,zone:0,perfect:0,abyss:0},ma:{},inv:{shield:0,magnet:0,xp:0,boost:0},use:{shield:1,magnet:1,xp:1,boost:1},
 trails:['c0'],trail:'c0',daily:{last:'',streak:0},set:{snd:1,vib:1,rm:0}}},
 load(){let o={};try{o=JSON.parse(localStorage.getItem(this.k)||'{}')}catch(e){}this.d=mg(this.def(),o);while(this.d.un.length<8)this.d.un.push(0)},
 save(){try{localStorage.setItem(this.k,JSON.stringify(this.d))}catch(e){}},
 reset(){try{localStorage.removeItem(this.k)}catch(e){}this.d=this.def()}};
Save.load();
addEventListener('pagehide',()=>Save.save());

/* ================= AUDIO ================= */
let AX;function sfx(f,d=.08,t='square',v=.04,f2){if(!Save.d.set.snd)return;try{AX=AX||new(window.AudioContext||window.webkitAudioContext)();if(AX.state==='suspended')AX.resume();const o=AX.createOscillator(),g=AX.createGain(),n=AX.currentTime;o.type=t;o.frequency.setValueAtTime(f,n);if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+d);g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g);g.connect(AX.destination);o.start(n);o.stop(n+d)}catch(e){}}
const SFX={eat:()=>sfx(320+R(0,200),.09,'square',.04,520),coin:()=>sfx(880,.1,'triangle',.05,1320),boost:()=>sfx(180,.18,'sawtooth',.03,320),hurt:()=>sfx(150,.25,'sawtooth',.07,60),
 lvl:()=>{sfx(523,.2,'triangle',.06);setTimeout(()=>sfx(784,.3,'triangle',.06),130)},rush:()=>{sfx(392,.15,'triangle',.06);setTimeout(()=>sfx(587,.15,'triangle',.06),100);setTimeout(()=>sfx(784,.3,'triangle',.06),200)},
 die:()=>sfx(220,.8,'sawtooth',.07,50),btn:()=>sfx(440,.05,'triangle',.04),warn:()=>sfx(300,.3,'square',.05,200)};
const vib=n=>{if(Save.d.set.vib&&navigator.vibrate)try{navigator.vibrate(n)}catch(e){}};

/* ================= HELPERS ================= */
const mult=n=>n>=30?20:n>=18?10:n>=10?5:n>=6?3:n>=3?2:1;
function stats(){const d=Save.d,s=SH[d.sel],L=slv(d.sx[d.sel]||0),u=d.up,m=1+(L-1)*.06;
 return{L,hp:Math.round(s.hp*m)+u.health*10,sp:s.sp*(1+(L-1)*.025)+u.speed*15,bs:s.bs*(1+(L-1)*.03)*(1+u.bite*.07),bo:s.bo*(1+(L-1)*.04)*(1+u.boost*.12),bsp:1.55+u.boost*.04,arm:u.armor*.05,mag:[0,70,110,160,220][u.magnet],tn:s.tn,s:s.s*(1+(L-1)*.03)}}
const fmt=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
const wallW=y=>60+28*Math.sin(y/170)+18*Math.sin(y/63);
const G={st:'menu',t:0,cr:[],co:[],ch:[],pk:[],ar:[],gr:[],pool:[],tx:[],p:null,run:null,cam:{x:0,y:0},shake:0,flash:0,paused:false,spT:0,evT:10,pkT:8,coT:0,chT:18,bossAlive:false,bossCount:0,back:'menu',uq:[],unl:0,view:0,danger:false,fin:0};
const IN={on:false,pid:-1,fixed:false,ox:0,oy:0,x:0,y:0,k:{},bo:false};
const PA=Array.from({length:380},()=>({l:0}));let pi=0;
function part(x,y,n,c,sp,r,l,t){if(Save.d.set.rm)n=Math.ceil(n/2);for(let i=0;i<n;i++){const q=PA[pi=(pi+1)%380],a=R(0,P2),s=R(.3,1)*sp;q.x=x;q.y=y;q.vx=Math.cos(a)*s;q.vy=Math.sin(a)*s;q.l=q.m=l;q.r=R(r*.5,r);q.c=c;q.t=t||'p'}}
const txt=(x,y,s,c)=>{G.tx.push({x,y,s,c,l:1});if(G.tx.length>30)G.tx.shift()};
function banner(m){const b=$('banner');b.innerHTML=m.split('\n').join('<br>');b.classList.remove('show');void b.offsetWidth;b.classList.add('show')}
function toast(m){const b=$('toast');b.innerHTML=m;b.classList.remove('show');void b.offsetWidth;b.classList.add('show')}
let DEC=[],FAR=[],FG=[];
function genWorld(){DEC=[];for(let i=0;i<190;i++){const y=R(60,WH-60),z=zoneAt(y),r=Math.random();DEC.push({ty:z===0?(r<.55?'kelp':'rock'):z===1?(r<.5?'coral':r<.75?'kelp':'rock'):z===2?(r<.35?'coral':'rock'):(r<.5?'rock':'glow'),side:Math.random()<.5?-1:1,y,s:R(24,58),h:R(0,360),ph:R(0,6)})}
 FAR=[];for(const [par,n,al] of [[.25,1.3,.2],[.5,1,.1]]){const cnt=Math.round((WH*par+1400)/110*n);for(let i=0;i<cnt;i++)FAR.push({par,x:R(-100,WW),y:R(0,WH*par+1400),s:R(30,110)*(par<.3?1.6:1),al,ty:par<.3?0:1,sp:R(-30,30)||20})}
 FG=[];for(let i=0;i<16;i++)FG.push({x:R(0,1),y:R(0,1),r:R(4,14),s:R(15,50)})}

/* ================= CREATURES ================= */
function mk(k,x,y){const T=TY[k],c=G.pool.pop()||{};c.k=k;c.d=T;c.x=x;c.y=y;c.hp=T.hp;c.ang=R(0,P2);c.ta=c.ang;c.wt=0;c.t=R(0,9);c.cd=0;c.fl=0;c.st='patrol';c.stT=0;c.g=null;c.dead=false;c.rk=0;c.dir=Math.random()<.5?1:-1;c.sp=T.sp*R(.9,1.1);c.off=0;c.sumT=6;G.cr.push(c);return c}
function school(k,x,y,n){const g={a:R(0,P2),t:0,pan:0,cx:x,cy:y,sx:0,sy:0,n:0};G.gr.push(g);for(let i=0;i<n;i++){const c=mk(k,x+R(-50,50),y+R(-40,40));c.g=g;c.off=R(-1,1)*1.2;c.ang=g.a}}
function pick(z,dif){const t=ZW[z];let s=0;const w={};for(const k in t){w[k]=t[k]*(TY[k].b==='hunt'?dif:1);s+=w[k]}let r=Math.random()*s;for(const k in t){r-=w[k];if(r<=0)return k}return 'large'}
function fill(init){const p=G.p,cnt={},dif=1+Math.min(1.5,(G.run?G.run.time:0)/90);G.cr.forEach(c=>cnt[c.k]=(cnt[c.k]||0)+1);
 for(let i=0;i<(init?64:3);i++){if(G.cr.length>=(init?64:66))break;let x,y;
  if(init){x=R(150,WW-150);y=G.st==='play'?R(60,2600):R(100,900);if(Math.hypot(x-p.x,y-p.y)<250)continue}
  else{const a=R(0,P2),rr=Math.hypot(W,H)/Z/2+R(90,650);x=C(p.x+Math.cos(a)*rr,150,WW-150);y=C(p.y+Math.sin(a)*rr,30,WH-60)}
  const k=pick(zoneAt(y),dif);if(CAP[k]&&(cnt[k]||0)>=CAP[k])continue;cnt[k]=(cnt[k]||0)+1;
  if(TY[k].b==='school')school(k,x,y,RI(6,11));else mk(k,x,y)}}
function updCr(c,dt0,live){const p=G.p,T=c.d,dt=dt0*(p.fx.slow>0?.5:1),dx=p.x-c.x,dy=p.y-c.y,d=Math.hypot(dx,dy)||1,bsP=p.S.bs*(p.rush>0?1.5:1);
 c.t+=dt;c.cd-=dt;c.fl-=dt;const eat=!T.hz&&T.size<=bsP;
 if(T.b==='static'){c.y+=Math.sin(c.t*1.5)*3*dt;return}
 if(T.b==='drift'){c.x+=Math.sin(c.t*1.2+c.dir)*22*dt;c.y+=Math.sin(c.t*.8+c.dir)*16*dt;c.x=C(c.x,160,WW-160);return}
 let sp=c.sp,ta=c.ta;c.wt-=dt;
 if(c.g){const g=c.g;g.sx+=c.x;g.sy+=c.y;g.n++;const ex=g.cx-c.x,ey=g.cy-c.y,ed=Math.hypot(ex,ey),w=ed>45?Math.min(1,(ed-45)/80):0;
  ta=Math.atan2(Math.sin(g.a)+ey/(ed||1)*w,Math.cos(g.a)+ex/(ed||1)*w);
  if(eat&&d<210){if(g.pan<=0)g.a=Math.atan2(-dy,-dx);g.pan=1.5}
  if(g.pan>0){ta=g.a+c.off;sp*=1.7}}
 else if(T.b==='hunt'){const hunts=T.size>bsP*.75;
  if(T.boss){const ra=c.hp/T.hp,ph=ra>.75?1:ra>.5?2:ra>.25?3:4;sp*=[0,1,1.35,1.35,1.9][ph];c.ph=ph;if(ph>=3&&live){c.sumT-=dt;if(c.sumT<=0){c.sumT=7;mk('barracuda',c.x+R(-80,80),c.y+R(-80,80)).st='chase';mk('barracuda',c.x+R(-80,80),c.y+R(-80,80)).st='chase';txt(c.x,c.y-T.size,'REINFORCEMENTS','#ff8787')}}}
  c.stT-=dt;
  if(c.st==='patrol'){if(c.wt<=0){c.wt=R(1,3);ta=R(0,P2)}if(live&&hunts&&d<520){c.st='detect';c.stT=.45}else if(eat&&d<260&&live){ta=Math.atan2(-dy,-dx);sp*=1.2}}
  else if(c.st==='detect'){sp=0;if(c.stT<=0)c.st='chase'}
  else if(c.st==='chase'){ta=Math.atan2(dy,dx);if(!live||!hunts||d>720)c.st='patrol';else if(d<T.size*2.3){c.st='attack';c.stT=.5;c.ta=ta}}
  else if(c.st==='attack'){ta=c.ta;sp*=2.4;if(c.stT<=0){c.st='retreat';c.stT=1.6}}
  else if(c.st==='retreat'){ta=Math.atan2(-dy,-dx);sp*=.8;if(c.stT<=0)c.st='patrol'}}
 else{if(c.wt<=0){c.wt=R(1,3);ta=(Math.random()<.5?0:Math.PI)+R(-.5,.5)}
  if((eat&&d<230)||(T.b==='flee'&&d<340)){ta=Math.atan2(-dy,-dx);sp*=1.4}}
 if(live&&p.fx.magnet>0&&eat&&!T.rare&&d<280){ta=Math.atan2(dy,dx);sp=150}
 c.ta=ta;let df=ta-c.ang;df=Math.atan2(Math.sin(df),Math.cos(df));c.ang+=df*Math.min(1,(c.st==='attack'?12:4)*dt);
 c.x+=Math.cos(c.ang)*sp*dt;c.y+=Math.sin(c.ang)*sp*dt;
 const lo=wallW(c.y)+30,hi=WW-wallW(c.y)-30;if(c.x<lo||c.x>hi){c.x=C(c.x,lo,hi);c.ang=Math.PI-c.ang;c.ta=c.ang}
 if(c.y<20||c.y>WH-40){c.y=C(c.y,20,WH-40);c.ang=-c.ang;c.ta=c.ang}}

/* ================= PLAYER ================= */
function newPlayer(){const S=stats();return{x:WW/2,y:260,vx:0,vy:0,ang:0,spd:0,ph:0,S,hp:S.hp,en:S.bo,lock:0,rest:0,inv:0,hit:0,mouth:0,sq:0,fx:{speed:0,magnet:0,shield:0,slow:0,xp:0},rush:0,boosting:false,dead:0,sz:S.s}}
function dirVec(){let x,y,m=1;if(IN.on){m=IN.fixed?55:60;x=(IN.x-IN.ox)/m;y=(IN.y-IN.oy)/m}else{const k=IN.k;x=(k.ArrowRight||k.KeyD?1:0)-(k.ArrowLeft||k.KeyA?1:0);y=(k.ArrowDown||k.KeyS?1:0)-(k.ArrowUp||k.KeyW?1:0)}
 const q=Math.hypot(x,y);return q>1?[x/q,y/q]:q<.12?[0,0]:[x,y]}
function movePlayer(dt,dir,live){const p=G.p,S=p.S,mag=Math.hypot(dir[0],dir[1]);
 const want=live&&(IN.bo||IN.k.Space||IN.k.ShiftLeft)&&p.en>0&&p.lock<=0;p.boosting=!!want;
 if(mag>.12){let d=Math.atan2(dir[1],dir[0])-p.ang;d=Math.atan2(Math.sin(d),Math.cos(d));p.ang+=C(d,-S.tn*dt,S.tn*dt)}
 const top=S.sp*(p.rush>0?1.2:1)*(p.fx.speed>0?1.3:1)*(p.boosting?S.bsp:1),tgt=mag>.12?top*Math.min(1,mag):p.boosting?top*.8:0,a=tgt>p.spd?(p.boosting?1000:520):300;
 p.spd+=C(tgt-p.spd,-a*dt,a*dt);const k=Math.min(1,6*dt);p.vx+=(Math.cos(p.ang)*p.spd-p.vx)*k;p.vy+=(Math.sin(p.ang)*p.spd-p.vy)*k;
 p.x=C(p.x+p.vx*dt,wallW(p.y)+40,WW-wallW(p.y)-40);p.y=C(p.y+p.vy*dt,30,WH-50);
 p.ph+=dt*(5+Math.hypot(p.vx,p.vy)/28);p.sz+=(S.s-p.sz)*Math.min(1,5*dt);p.mouth=Math.max(0,p.mouth-dt);p.sq*=Math.pow(.02,dt);p.inv-=dt;p.hit-=dt;p.lock-=dt;
 for(const k in p.fx)p.fx[k]=Math.max(0,p.fx[k]-dt);p.rush=Math.max(0,p.rush-dt);
 if(live){if(p.boosting){p.en-=34*dt;p.rest=.7;G.shake=Math.max(G.shake,.8);part(p.x-Math.cos(p.ang)*p.sz*1.2,p.y-Math.sin(p.ang)*p.sz*1.2,1,'#fff',30,3,.6,'b');if(Math.random()<.2)SFX.boost();if(p.en<=0){p.en=0;p.lock=1}}
  else{p.rest-=dt;if(p.rest<=0)p.en=Math.min(S.bo,p.en+15*(S.bo/100)*dt)}
  if(p.spd>S.sp*.6&&Math.random()<.5){const tr=TR.find(t=>t.id===Save.d.trail)||TR[0];part(p.x-Math.cos(p.ang)*p.sz*1.3,p.y-Math.sin(p.ang)*p.sz*1.3,1,p.rush>0?'#ffd43b':tr.col,15,p.boosting?5:3,.5,'t')}}}
function hurt(dm){const p=G.p,r=G.run;if(p.inv>0||G.st!=='play')return;
 if(p.fx.shield>0){p.fx.shield=0;p.inv=.8;part(p.x,p.y,16,'#74c0fc',240,4,.6);txt(p.x,p.y-p.sz,'SHIELD BROKEN','#74c0fc');SFX.hurt();return}
 dm=Math.max(1,Math.round(dm*(1-p.S.arm)));p.hp-=dm;p.inv=1;p.hit=.3;r.nodmg=false;G.shake=Math.max(G.shake,9);G.flash=.35;txt(p.x,p.y-p.sz,'-'+dm,'#ff5a5a');part(p.x,p.y,10,'#ff5a5a',160,4,.5);SFX.hurt();vib(60);if(p.hp<=0)die()}
function addXP(x){const d=Save.d,p=G.p,b=slv(d.sx[d.sel]||0),pb=plv(d.xp);d.xp+=x;d.sx[d.sel]=(d.sx[d.sel]||0)+x;if(G.run)G.run.xp+=x;const a=slv(d.sx[d.sel]);
 if(a>b){const o=p.S.hp;p.S=stats();p.hp=Math.min(p.S.hp,p.hp+(p.S.hp-o)+p.S.hp*.3);p.en=p.S.bo;G.shake=10;G.flash=.25;part(p.x,p.y,26,SH[d.sel].col,280,5,.9);p.sq=.5;banner('LEVEL UP!\n'+SH[d.sel].n+' Lv.'+a);SFX.lvl();Save.save()}
 if(plv(d.xp)>pb){toast('PLAYER LEVEL '+plv(d.xp));checkUnlocks();Save.save()}}
function checkUnlocks(){const d=Save.d;SH.forEach((s,i)=>{if(!i||d.un[i]||!s.c)return;const c=s.c,ok=c[0]==='lv'?plv(d.xp)>=c[1]:c[0]==='zone'?d.st.zone>=c[1]:d.st.boss>=1;if(ok){d.un[i]=1;G.uq.push(i);Save.save()}})}
function checkProg(){const d=Save.d;MIS.forEach((m,i)=>{if(!d.ms[i]&&m.f(d)>=m.g){d.ms[i]=1;d.coins+=m.c;d.xp+=m.x;d.sx[d.sel]=(d.sx[d.sel]||0)+m.x;toast('🎯 MISSION COMPLETE<br>'+m.t+' +'+m.c+'🪙');SFX.lvl();Save.save()}});
 AC.forEach((a,i)=>{if(!d.ach[i]&&a[2](d)){d.ach[i]=1;d.coins+=a[3];toast('🏆 ACHIEVEMENT UNLOCKED!<br>'+a[0]+' +'+a[3]+'🪙');SFX.lvl();Save.save()}})}
function startRush(){const p=G.p,r=G.run;p.rush=10;r.meter=0;r.rushN++;Save.d.st.rush++;banner('GOLD RUSH!');SFX.rush();G.flash=.3;G.shake=6}
function eat(c){const p=G.p,T=c.d,r=G.run,d=Save.d,ratio=T.size/(p.S.bs*(p.rush>0?1.5:1));c.dead=true;
 r.combo++;r.ct=2.2;const mu=mult(r.combo);if(mu>r.mult&&mu>=5)banner('FEEDING FRENZY!\nCOMBO x'+mu);r.mult=mu;if(r.combo>r.maxC)r.maxC=r.combo;if(r.combo>d.st.combo)d.st.combo=r.combo;
 const rm=p.rush>0?2:1,ma=Math.floor(Math.sqrt(((d.ma[d.sel]||{}).food||0)/15)),sc=Math.round(T.score*mu*rm),co=Math.round(T.coin*rm*(1+ma/100)),xp=Math.round(T.xp*(p.fx.xp>0?1.5:1));
 r.score+=sc;r.coins+=co;d.st.coins+=co;p.en=Math.min(p.S.bo,p.en+5+T.size*.3);p.hp=Math.min(p.S.hp,p.hp+.4+T.size*.06);
 if(T.k==='fish'||T.k==='squid'){r.fish++;d.st.fish++}if(T.size>=30){r.large++;d.st.large++}if(T.size>r.bigS){r.bigS=T.size;r.bigN=T.n}
 if(!p.rush)r.meter=Math.min(100,r.meter+T.score*.07+4);if(r.meter>=100&&!p.rush)startRush();
 part(c.x,c.y,T.size>=30?16:9,T.col,180,4,.5);part(c.x,c.y,3,'#fff',90,3,.7,'b');txt(c.x,c.y-T.size,'+'+sc,'#fff');if(xp)txt(c.x+14,c.y-T.size-16,'+'+xp+'xp','#8ce99a');if(co)txt(c.x-14,c.y-T.size-32,'+'+co+'🪙','#ffd43b');
 if(T.rare)txt(c.x,c.y-T.size-48,'RARE!','#da77f2');else if(T.size>=30)txt(c.x,c.y-T.size-48,'BIG EAT!','#ff922b');
 for(let i=0;i<Math.min(co,6);i++)part(c.x,c.y,1,'#ffd43b',130,5,2.2,'coin');
 G.shake=Math.max(G.shake,T.size>=30?7:1.5);SFX.eat();
 if(T.gold){d.st.gold++;r.meter=100;startRush()}
 if(T.boss){G.bossCount=Math.max(0,G.bossCount-1);if(G.bossCount<=0)G.bossAlive=false;d.st.boss++;banner('BOSS DEFEATED!');part(c.x,c.y,50,'#ffd43b',400,6,1.2);for(let i=0;i<8;i++)G.co.push({x:c.x+R(-90,90),y:c.y+R(-90,90),v:10,t:0});checkUnlocks()}
 addXP(xp);if(G.st==='play')checkProg()}
function collide(){const p=G.p,s=p.sz,hx=p.x+Math.cos(p.ang)*s*.6,hy=p.y+Math.sin(p.ang)*s*.6,hr=s*.8,bs=p.S.bs*(p.rush>0?1.5:1),pow=1.6+Save.d.up.bite*.4+(p.S.L-1)*.15;
 for(const c of G.cr){if(c.dead)continue;const T=c.d,dx=c.x-hx,dy=c.y-hy,rr=hr+T.size*.8;if(dx*dx+dy*dy>rr*rr)continue;const ra=T.size/bs;
  if(!T.hz&&ra<=1){if(c.cd>0)continue;c.cd=.25;c.fl=.12;c.hp-=ra<=.5?99:pow;p.mouth=.25;p.sq=.3;p.vx+=Math.cos(p.ang)*60;p.vy+=Math.sin(p.ang)*60;
   if(c.hp<=0)eat(c);else{part(c.x,c.y,4,'#fff',100,3,.3);G.shake=Math.max(G.shake,3);SFX.eat();if(T.dmg){if(!c.rk){c.rk=1;txt(c.x,c.y-T.size,'⚠ RISKY','#ffd43b')}hurt(T.dmg*.35)}}}
  else if(T.k==='mine'){c.dead=true;part(c.x,c.y,20,'#ffa94d',300,6,.6);G.shake=14;hurt(T.dmg)}
  else if(T.dmg){hurt(T.dmg*(c.st==='attack'?1.3:1)*(c.ph===4?1.4:1));const a=Math.atan2(p.y-c.y,p.x-c.x);p.vx+=Math.cos(a)*280;p.vy+=Math.sin(a)*280}
  else if(!c.rk||c.cd<=0){c.cd=.8;c.rk=1;txt(c.x,c.y-T.size,'❌ TOO BIG','#ff8787')}}}
function pickups(dt){const p=G.p,r=G.run,d=Save.d,S=p.S,mr=Math.max(S.mag,p.fx.magnet>0?250:0)*(p.rush>0?1.4:1);
 for(const o of G.co){o.t+=dt;const dx=p.x-o.x,dy=p.y-o.y,dd=Math.hypot(dx,dy)||1;if(dd<mr){const v=420*(1-dd/mr*.5);o.x+=dx/dd*v*dt;o.y+=dy/dd*v*dt}
  if(dd<p.sz+16){o.dead=true;const v=Math.round(o.v*(p.rush>0?2:1));r.coins+=v;d.st.coins+=v;r.score+=v*5;txt(o.x,o.y-10,'+'+v,'#ffd43b');part(o.x,o.y,4,'#ffd43b',90,3,.4);SFX.coin()}
  else if(o.t>40||Math.abs(o.y-p.y)>1400)o.dead=true}
 G.co=G.co.filter(o=>!o.dead);
 for(const o of G.pk){o.t+=dt;const dd=Math.hypot(p.x-o.x,p.y-o.y);if(dd<p.sz+26){o.dead=true;const U=PU[o.k];banner(U.n+'!');part(o.x,o.y,14,U.c,200,4,.5);SFX.rush();
  if(o.k==='heal')p.hp=p.S.hp;else if(o.k==='rush')startRush();else p.fx[o.k]=U.t}else if(o.t>30)o.dead=true}
 G.pk=G.pk.filter(o=>!o.dead);
 for(const h of G.ch){if(h.o)continue;if(Math.hypot(p.x-h.x,p.y-h.y)<p.sz+34){h.o=1;d.st.chest++;const t=h.t,c=t==='rare'?RI(200,320):t==='gold'?RI(80,160):RI(25,50),e=RI(0,3);
  r.coins+=c;d.st.coins+=c;banner((t==='rare'?'RARE':t==='gold'?'GOLD':'')+' CHEST!\n+'+c+'🪙');for(let i=0;i<10;i++)G.co.push({x:h.x+R(-50,50),y:h.y+R(-40,10),v:RI(1,5),t:0});part(h.x,h.y,24,'#ffd43b',260,5,.8);SFX.rush();G.shake=6;
  if(e===0)addXP(t==='rare'?80:t==='gold'?30:10);else if(e===1)p.en=p.S.bo;else if(e===2)r.score+=200;else if(t!=='wood')G.pk.push({k:Object.keys(PU)[RI(0,5)],x:h.x,y:h.y-70,t:0})}}}
function evPos(){const p=G.p,a=R(0,P2),rr=Math.hypot(W,H)/Z/2+140;return[C(p.x+Math.cos(a)*rr,200,WW-200),C(p.y+Math.sin(a)*rr,60,WH-80)]}
function area(n,x,y,k,cnt){G.ar.push({n,x,y,r:290,t:45,in:0});const l=[];for(let i=0;i<cnt;i++){const a=R(0,P2),rr=R(30,250);l.push(mk(k,x+Math.cos(a)*rr,y+Math.sin(a)*rr))}return l}

/* 🔥 ปรับฟังก์ชันสร้างบอส ให้สร้างได้มากกว่า 1 ตัว */
function spawnBoss(){if(G.bossCount>=3)return;const p=G.p,c=mk('boss',C(p.x+R(-300,300),300,WW-300),C(p.y+R(-400,400),300,WH-250));G.bossAlive=true;G.bossCount++;G.boss=c;banner('⚠ BOSS WARNING ⚠\nGIANT SHARK SIGHTED');SFX.warn()}

/* 🔥 เพิ่มความถี่ของอีเวนต์กิจกรรม และเพิ่มโอกาสสปอว์นกลุ่มยักษ์ให้ออกมาเรื่อยๆ */
function runEvent(){const p=G.p,z=zoneAt(p.y),[x,y]=evPos(),o=['school','coin','golden','rush','treasure','pred','giant_group','boss'];if(z>=1)o.push('pred','jelly','mines','boss');
 switch(o[RI(0,o.length-1)]){case 'school':banner('FISH SCHOOL!');school(z>=2?'blue':'tiny',x,y,16);break;
 case 'coin':banner('COIN STORM!');for(let i=0;i<34;i++)G.co.push({x:C(x+R(-280,280),160,WW-160),y:C(y+R(-280,280),40,WH-60),v:RI(1,3),t:0});break;
 case 'golden':banner('GOLDEN FISH!');mk('golden',x,y);break;case 'rush':banner('GOLD RUSH EVENT!');startRush();break;
 case 'treasure':banner('TREASURE AREA!');G.ch.push({x,y,t:z>=3?'rare':'gold',o:0},{x:x+90,y:y+40,t:'wood',o:0});for(let i=0;i<10;i++)G.co.push({x:x+R(-150,150),y:y+R(-120,120),v:RI(1,5),t:0});break;
 case 'pred':banner('PREDATOR ATTACK!');area('PREDATOR TERRITORY',x,y,z>=2?'eshark':'barracuda',z>=2?3:4).forEach(c=>{c.st='chase'});break;
 case 'giant_group':banner('⚠ GIANT FISH PATROL!');area('GIANT TERRITORY',x,y,'giant',3).forEach(c=>{c.st='chase'});break;
 case 'jelly':banner('JELLYFISH SWARM!');area('JELLYFISH ZONE',x,y,'jelly',9);break;case 'mines':banner('MINE FIELD!');area('MINE FIELD',x,y,'mine',7);break;case 'boss':spawnBoss()}}

/* ================= RUN CONTROL ================= */
function show(id){document.querySelectorAll('.scr:not(.modal)').forEach(s=>s.classList.add('hide'));if(id)$(id).classList.remove('hide');document.querySelectorAll('.coins').forEach(e=>e.textContent=Save.d.coins);$('bestM').textContent=Save.d.best}
function startRun(){const d=Save.d;G.st='play';G.paused=false;G.fin=0;G.p=newPlayer();const p=G.p;G.cr.forEach(c=>G.pool.push(c));G.cr=[];G.gr=[];G.co=[];G.ch=[];G.pk=[];G.ar=[];G.tx=[];PA.forEach(q=>q.l=0);G.bossAlive=false;G.bossCount=0;G.evT=8;G.pkT=7;G.spT=0;G.coT=0;G.chT=18;G.shake=0;G.flash=0;
 G.run={score:0,coins:0,xp:0,time:0,ts:0,dist:0,dacc:0,fish:0,large:0,bigS:0,bigN:'-',combo:0,ct:0,mult:1,maxC:0,meter:0,zone:0,lm:{},rushN:0,nodmg:true};
 for(const k of ['shield','magnet','xp','boost'])if(d.inv[k]>0&&d.use[k]){d.inv[k]--;if(k==='shield')p.fx.shield=25;if(k==='magnet')p.fx.magnet=30;if(k==='xp')p.fx.xp=9999;if(k==='boost')p.fx.speed=10}
 LM.forEach(l=>{if(l.chest)G.ch.push({x:l.x,y:l.y+70,t:l.chest,o:0})});G.cam.x=p.x-W/Z/2;G.cam.y=0;fill(true);show(null);$('hud').classList.remove('hide');$('boost').classList.remove('hide');banner('SWIM!\nEAT • GROW • DIVE');d.st.games++;Save.save()}
function die(){if(G.st!=='play')return;G.st='dying';const p=G.p;p.dead=.01;p.hp=0;SFX.die();vib([120,60,200]);G.shake=14;part(p.x,p.y,30,'#ff5a5a',280,5,.9);banner('DEAD SHARK');IN.on=false;IN.bo=false}
function finish(){const r=G.run,d=Save.d,p=G.p;if(!r||G.st==='over')return;G.st='over';
 const bon=Math.floor(r.time/6)+Math.floor(r.dist/250),tot=r.coins+bon,pre=d.sx[d.sel]||0,L0=slv(pre);d.coins+=tot;const nb=r.score>d.best;if(nb)d.best=r.score;d.st.score+=r.score;if(r.nodmg&&r.time>=60)d.st.perfect++;
 const m=d.ma[d.sel]||(d.ma[d.sel]={food:0,dist:0,best:0,combo:0});m.food+=r.fish;m.dist+=r.dist;m.best=Math.max(m.best,r.score);m.combo=Math.max(m.combo,r.maxC);
 checkUnlocks();checkProg();Save.save();$('hud').classList.add('hide');$('boost').classList.add('hide');$('banner').classList.remove('show');
 const L=slv(d.sx[d.sel]||0),lo=need(L),hi=L>=10?lo+1:need(L+1),pct=L>=10?100:C(((d.sx[d.sel]||0)-lo)/(hi-lo)*100,0,100);
 $('oSc').textContent=r.score.toLocaleString();$('oBest').textContent=d.best.toLocaleString();$('oNew').textContent=nb?'NEW!':'';$('oBon').textContent='⏱ '+fmt(r.time)+' → +'+bon+'🪙';$('oTot').textContent='🪙 '+tot;
 $('oTime').textContent=fmt(r.time);$('oFish').textContent=r.fish;$('oDist').textContent=Math.floor(r.dist)+' m';$('oBig').textContent=r.bigN+' ('+SZN[szc(r.bigS)]+')';$('oCombo').textContent='x'+mult(r.maxC)+' ('+r.maxC+')';$('oXp').textContent='+'+r.xp;
 $('oLv').textContent=SH[d.sel].n+'  Lv.'+L+' / 10'+(L>L0?'  ⬆ LEVEL UP!':'');$('oBar').style.width=(L>L0?0:Math.max(0,pct-r.xp/(hi-lo)*100))+'%';show('over');setTimeout(()=>{$('oBar').style.width=pct+'%'},60);
 if(G.uq.length)setTimeout(showUnlock,700)}
function toMenu(){G.st='menu';G.paused=false;G.p=newPlayer();G.p.y=420;G.cr.forEach(c=>G.pool.push(c));G.cr=[];G.gr=[];G.co=[];G.ch=[];G.pk=[];G.ar=[];G.run=null;G.bossAlive=false;G.bossCount=0;fill(true);$('hud').classList.add('hide');$('boost').classList.add('hide');$('banner').classList.remove('show');Save.save();show('menu');dailyCheck()}

/* ================= LOOP ================= */
function step(dt){if(G.paused)return;G.t+=dt;const live=G.st==='play',p=G.p,r=G.run;
 if(G.st==='dying'){p.dead+=dt;p.y=Math.min(WH-50,p.y+35*dt);p.ang+=dt*1.6;p.vx*=.95;p.vy*=.95;p.sz+=(p.S.s-p.sz)*.1;if(p.dead>1.9&&!G.fin){G.fin=1;finish()}}
 else movePlayer(dt,live?dirVec():[Math.cos(G.t*.35),Math.sin(G.t*.5)*.4],live);
 for(const g of G.gr){g.cx=g.n?g.sx/g.n:g.cx;g.cy=g.n?g.sy/g.n:g.cy;g.sx=g.sy=0;g.n=0;g.t-=dt;g.pan-=dt;if(g.t<=0){g.t=R(2,4);if(g.pan<=0)g.a+=R(-1.2,1.2)}}
 for(const c of G.cr)updCr(c,dt,live);
 if(live){collide();pickups(dt);r.time+=dt;const sp=Math.hypot(p.vx,p.vy),dm=sp*dt/10;r.dist+=dm;Save.d.st.dist+=dm;r.dacc+=dm;while(r.dacc>=10){r.dacc-=10;r.score+=5}
  if(r.ct>0)r.ct-=dt;else if(r.combo>0){r.combo=Math.max(0,r.combo-3*dt);if(r.combo<1){r.combo=0;r.mult=1}else r.mult=mult(Math.floor(r.combo))}
  if(Math.floor(r.time)!==r.ts){r.ts=Math.floor(r.time);if(r.ts>Save.d.st.longest)Save.d.st.longest=r.ts;if(zoneAt(p.y)===3)Save.d.st.abyss++;checkProg()}
  const z=zoneAt(p.y);if(z>r.zone){r.zone=z;banner('ENTERING\n'+ZN[z].toUpperCase());if(z>Save.d.st.zone){Save.d.st.zone=z;checkUnlocks();checkProg()}}
  for(const l of LM){if(!r.lm[l.n]&&Math.hypot(p.x-l.x,p.y-l.y)<380){r.lm[l.n]=1;toast('📍 '+l.n+' DISCOVERED');if(l.n==='BOSS AREA')spawnBoss()}}
  G.danger=false;for(const a of G.ar){a.t-=dt;const dd=Math.hypot(p.x-a.x,p.y-a.y);if(dd<a.r){G.danger=true;if(!a.in){a.in=1;banner('⚠ DANGER\n'+a.n);SFX.warn()}}else if(dd>a.r+80)a.in=0}G.ar=G.ar.filter(a=>a.t>0);
  G.evT-=dt;if(G.evT<=0){G.evT=R(10,18)/(1+Math.min(.6,r.time/200));runEvent()}
  G.pkT-=dt;if(G.pkT<=0){G.pkT=R(9,14);if(G.pk.length<3){const[x,y]=evPos();G.pk.push({k:Object.keys(PU)[RI(0,5)],x,y,t:0})}}
  G.chT-=dt;if(G.chT<=0){G.chT=R(18,30);const z2=zoneAt(p.y),[x,y]=evPos();G.ch.push({x,y,t:z2>=3?(Math.random()<.4?'rare':'gold'):z2>=2&&Math.random()<.4?'gold':'wood',o:0});if(Math.random()<.3)area('TRAPPED TREASURE',x,y,'mine',4)}
  G.coT-=dt;if(G.coT<=0){G.coT=.7;if(G.co.length<45){const a=R(0,P2),rr=Math.hypot(W,H)/Z/2+R(60,500);G.co.push({x:C(p.x+Math.cos(a)*rr,170,WW-170),y:C(p.y+Math.sin(a)*rr,40,WH-60),v:[1,1,1,2,2,5,10][RI(0,6)],t:0})}}
  if(Math.floor(G.t*10)%2===0){G.ch=G.ch.filter(h=>!h.o&&Math.abs(h.y-p.y)<2500||(h.o&&Math.abs(h.y-p.y)<900))}}
 G.spT-=dt;if(G.spT<=0){G.spT=.12;fill(false)}
 let n=0;for(const c of G.cr){if(!c.dead&&(c.d.boss||(Math.abs(c.y-p.y)<1500&&Math.hypot(c.x-p.x,c.y-p.y)<2300)))G.cr[n++]=c;else{if(c.d.boss&&c.dead)G.boss=null;G.pool.push(c)}}G.cr.length=n;G.gr=G.gr.filter(g=>g.n>0||g.t>0);
 for(const q of PA){if(q.l<=0)continue;q.l-=dt;if(q.t==='coin'){const age=q.m-q.l;if(age>.35){const dx=p.x-q.x,dy=p.y-q.y,dd=Math.hypot(dx,dy)||1;q.vx=dx/dd*560;q.vy=dy/dd*560;if(dd<p.sz)q.l=0}else{q.vx*=.92;q.vy*=.92}}
  else if(q.t==='b'){q.vy-=30*dt}else{q.vx*=.95;q.vy*=.95}q.x+=q.vx*dt;q.y+=q.vy*dt}
 for(const t of G.tx){t.y-=45*dt;t.l-=dt*1.1}G.tx=G.tx.filter(t=>t.l>0);G.flash=Math.max(0,G.flash-dt);G.shake*=Math.pow(.003,dt);
 if(Math.random()<dt*10){const cx=G.cam.x,cy=G.cam.y,deep=cy>3000;const q=PA[pi=(pi+1)%380];q.x=cx+R(0,W/Z);q.y=cy+R(0,H/Z);q.vx=0;q.vy=deep?-5:-26;q.l=q.m=R(3,6);q.r=deep?1.6:R(2,5);q.c=deep&&cy>4800?(Math.random()<.5?'#5ff':'#b8f'):'#fff';q.t=deep&&cy>4800?'g':'b'}
 const tz=Math.min(W,H)/(260+p.sz*5.5)*(p.boosting?.94:1)*(G.bossAlive&&G.boss&&Math.hypot(G.boss.x-p.x,G.boss.y-p.y)<700?.9:1);Z+=(tz-Z)*Math.min(1,3*dt);
 const vw=W/Z,vh=H/Z;let tx=p.x+p.vx*(p.boosting?.4:.25)-vw/2,ty=p.y+p.vy*(p.boosting?.4:.25)-vh/2;tx=C(tx,0,Math.max(0,WW-vw));ty=C(ty,-120,WH-vh+20);const a=Math.min(1,6*dt);G.cam.x+=(tx-G.cam.x)*a;G.cam.y+=(ty-G.cam.y)*a;
 if(live)hud()}
let last=0;function loop(ts){const dt=Math.min(.05,(ts-last)/1000||0);last=ts;try{step(dt);render();previews()}catch(e){console.error(e)}requestAnimationFrame(loop)}

/* ================= DRAWING ================= */
function sh(s,col,ph,mouth,wht,rage){const w=Math.sin(ph)*s*.25;ctx.fillStyle=wht?'#fff':col;
 ctx.beginPath();ctx.moveTo(-s*.8,0);ctx.lineTo(-s*1.5,-s*.55+w);ctx.lineTo(-s*1.25,w*.6);ctx.lineTo(-s*1.5,s*.5+w);ctx.closePath();ctx.fill();
 ctx.beginPath();ctx.moveTo(-s*.1,-s*.5);ctx.lineTo(-s*.55,-s*1.05);ctx.lineTo(-s*.65,-s*.4);ctx.fill();
 ctx.beginPath();ctx.moveTo(s*1.3,0);ctx.quadraticCurveTo(s*.3,-s*.85,-s*.9,-s*.15+w*.2);ctx.lineTo(-s*.9,s*.15+w*.2);ctx.quadraticCurveTo(s*.3,s*.75,s*1.3,s*.05);ctx.fill();
 ctx.fillStyle=wht?'#fff':'#fff4e0';ctx.beginPath();ctx.moveTo(s*1.25,s*.08);ctx.quadraticCurveTo(s*.2,s*.7,-s*.8,s*.12);ctx.quadraticCurveTo(s*.2,s*.32,s*1.25,s*.08);ctx.fill();
 ctx.fillStyle=wht?'#fff':col;ctx.beginPath();ctx.moveTo(s*.3,s*.3);ctx.lineTo(-s*.2+w*.3,s*.85);ctx.lineTo(-s*.3,s*.3);ctx.fill();
 if(mouth>0){const m=Math.min(1,mouth/.25);ctx.fillStyle='#6b0f24';ctx.beginPath();ctx.moveTo(s*1.28,s*.06);ctx.lineTo(s*.5,s*.1+s*.7*m);ctx.lineTo(s*.45,s*.08);ctx.fill();ctx.fillStyle='#fff';for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(s*(1.1-i*.2),s*.07);ctx.lineTo(s*(1.02-i*.2),s*.07+s*.16*m);ctx.lineTo(s*(.94-i*.2),s*.07);ctx.fill()}}
 ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s*.75,-s*.18,s*.14,0,P2);ctx.fill();ctx.fillStyle=rage?'#e03131':'#111';ctx.beginPath();ctx.arc(s*.79,-s*.18,s*.07,0,P2);ctx.fill()}
function drawPlayer(){const p=G.p,d=Save.d;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.ang);const flip=Math.cos(p.ang)<0;if(flip)ctx.scale(1,-1);ctx.scale(1+p.sq*.25,1-p.sq*.2);
 if(p.inv>0&&Math.floor(G.t*20)%2)ctx.globalAlpha=.45;if(p.rush>0){ctx.shadowColor='#ffd43b';ctx.shadowBlur=26}
 sh(p.sz,p.dead?'#8a96a3':p.rush>0?'#ffd43b':SH[d.sel].col,p.ph,p.mouth,p.hit>0);ctx.restore();
 if(p.fx.shield>0){ctx.strokeStyle='rgba(116,192,252,.85)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,p.sz*1.6,0,P2);ctx.stroke()}}
function drawCr(c){const T=c.d,s=T.size,k=T.k,w=Math.sin(c.t*8)*s*.15,col=c.fl>0?'#fff':T.col;ctx.save();ctx.translate(c.x,c.y);ctx.fillStyle=col;ctx.strokeStyle=col;
 if(k==='mine'){ctx.beginPath();ctx.arc(0,0,s*.7,0,P2);ctx.fill();ctx.lineWidth=4;for(let i=0;i<8;i++){const a=i*P2/8;ctx.beginPath();ctx.moveTo(Math.cos(a)*s*.6,Math.sin(a)*s*.6);ctx.lineTo(Math.cos(a)*s,Math.sin(a)*s);ctx.stroke()}const nr=Math.hypot(G.p.x-c.x,G.p.y-c.y)<170;ctx.fillStyle=Math.floor(c.t*(nr?9:3))%2?'#ff3b3b':'#661111';ctx.beginPath();ctx.arc(0,0,s*.22,0,P2);ctx.fill()}
 else if(k==='spike'){ctx.beginPath();ctx.arc(0,0,s*.7,0,P2);ctx.fill();ctx.fillStyle='#adb5bd';for(let i=0;i<9;i++){const a=i*P2/9;ctx.beginPath();ctx.moveTo(Math.cos(a-.15)*s*.6,Math.sin(a-.15)*s*.6);ctx.lineTo(Math.cos(a)*s*1.05,Math.sin(a)*s*1.05);ctx.lineTo(Math.cos(a+.15)*s*.6,Math.sin(a+.15)*s*.6);ctx.fill()}}
 else if(k==='jelly'){const pl=Math.sin(c.t*3)*.12;ctx.globalAlpha=.85;ctx.beginPath();ctx.ellipse(0,0,s*(1+pl),s*(.8-pl),0,Math.PI,0);ctx.fill();ctx.lineWidth=3;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*s*.35,0);ctx.quadraticCurveTo(i*s*.35+Math.sin(c.t*4+i)*s*.3,s*.8,i*s*.35,s*1.5);ctx.stroke()}
  if(Math.hypot(G.p.x-c.x,G.p.y-c.y)<140&&Math.random()<.5){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);for(let i=1;i<5;i++)ctx.lineTo(R(-s,s),i*s*.4);ctx.stroke()}}
 else{ctx.rotate(c.ang);if(Math.cos(c.ang)<0)ctx.scale(1,-1);
  if(k==='shark')sh(s*.9,c.fl>0?'#fff':(T.boss&&c.ph===4?'#e03131':T.col),c.t*9,0,0,T.boss);
  else if(k==='eel'){ctx.lineWidth=s*.28;ctx.lineCap='round';ctx.beginPath();for(let i=0;i<9;i++){const x=-i*s*.3+s*.8,y=Math.sin(c.t*6-i*.8)*s*.2;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s*.85,-s*.08,s*.1,0,P2);ctx.fill();if(Math.random()<.2){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-s*.4,0);ctx.lineTo(-s*.4+R(-9,9),R(-s*.6,s*.6));ctx.stroke()}}
  else if(k==='turtle'){ctx.beginPath();ctx.ellipse(0,0,s,s*.7,0,0,P2);ctx.fill();ctx.fillStyle='#2f9e44';ctx.beginPath();ctx.ellipse(-s*.1,0,s*.7,s*.5,0,0,P2);ctx.fill();ctx.fillStyle=col;ctx.beginPath();ctx.arc(s*1.05,0,s*.28,0,P2);ctx.fill();ctx.beginPath();ctx.ellipse(s*.3,s*.6,s*.4,s*.15,w*.05,0,P2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(s*1.15,-s*.08,s*.06,0,P2);ctx.fill()}
  else if(k==='squid'){ctx.beginPath();ctx.ellipse(-s*.1,0,s*.9,s*.45,0,0,P2);ctx.fill();ctx.lineWidth=s*.12;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(s*.6,i*s*.2);ctx.quadraticCurveTo(s*1.1,i*s*.3+w,s*1.5,i*s*.4+w*2);ctx.stroke()}ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s*.4,-s*.12,s*.14,0,P2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(s*.43,-s*.12,s*.07,0,P2);ctx.fill()}
  else{if(T.gold||T.rare){ctx.shadowColor=T.col;ctx.shadowBlur=18}ctx.beginPath();ctx.ellipse(0,0,s,s*(k==='angler'?.8:.55),0,0,P2);ctx.fill();ctx.beginPath();ctx.moveTo(-s*.8,0);ctx.lineTo(-s*1.5,-s*.5+w);ctx.lineTo(-s*1.5,s*.5+w);ctx.fill();ctx.shadowBlur=0;
   if(T.st){ctx.fillStyle='#fff';ctx.fillRect(-s*.1,-s*.5,s*.16,s);ctx.fillRect(s*.45,-s*.4,s*.14,s*.8)}else if(T.score<=40&&!T.dmg){ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(-s*.1,-s*.5,s*.18,s)}
   if(k==='angler'){ctx.strokeStyle='#ffe066';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(s*.4,-s*.7);ctx.quadraticCurveTo(s*1.2,-s*1.4,s*1.4,-s*.9);ctx.stroke();ctx.fillStyle='#fff3a0';ctx.shadowColor='#ffe066';ctx.shadowBlur=20;ctx.beginPath();ctx.arc(s*1.4,-s*.9,s*.12,0,P2);ctx.fill();ctx.shadowBlur=0}
   if(T.dmg){ctx.fillStyle='#fff';for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(s*(.9-i*.17),s*.15);ctx.lineTo(s*(.82-i*.17),s*.4);ctx.lineTo(s*(.74-i*.17),s*.15);ctx.fill()}}
   ctx.fillStyle=T.dmg?'#ff6b6b':'#fff';ctx.beginPath();ctx.arc(s*.55,-s*.15,s*.17,0,P2);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(s*.6,-s*.15,s*.08,0,P2);ctx.fill()}}
 ctx.restore();
 const p=G.p,dd=Math.hypot(p.x-c.x,p.y-c.y);
 if(!T.hz&&dd<300){const ra=T.size/(p.S.bs*(p.rush>0?1.5:1));ctx.fillStyle=ra<=.8?'#51cf66':ra<=1?'#ffd43b':'#ff6b6b';ctx.beginPath();ctx.arc(c.x,c.y-T.size-8,4,0,P2);ctx.fill()}
 if(c.st==='detect'){ctx.fillStyle='#ff6b6b';ctx.font='900 22px sans-serif';ctx.textAlign='center';ctx.fillText('!',c.x,c.y-T.size-12)}}
function drawDecor(top,bot){for(const d of DEC){if(d.y<top-120||d.y>bot+120)continue;const x=d.side<0?wallW(d.y)-6:WW-wallW(d.y)+6,z=zoneAt(d.y),dim=z>=3?'30%':z>=2?'42%':'55%';ctx.save();ctx.translate(x,d.y);
 if(d.ty==='kelp'){ctx.strokeStyle='hsl(130,50%,'+(z?30:40)+'%)';ctx.lineWidth=6;ctx.lineCap='round';for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(0,i*6);ctx.quadraticCurveTo(-d.side*d.s*.6+Math.sin(G.t*1.5+d.ph+i)*d.s*.3,-d.s*1.2,-d.side*d.s*.5+Math.sin(G.t*1.5+d.ph+i)*d.s*.5,-d.s*2.4);ctx.stroke()}}
 else if(d.ty==='coral'||d.ty==='glow'){const gl=d.ty==='glow';ctx.strokeStyle=gl?'#4dd9e8':'hsl('+d.h+',70%,'+dim+')';ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=7;ctx.lineCap='round';if(gl){ctx.shadowColor='#4dd9e8';ctx.shadowBlur=14}for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-d.side*d.s*.5+i*d.s*.25,-d.s*(1-Math.abs(i)*.2));ctx.stroke();ctx.beginPath();ctx.arc(-d.side*d.s*.5+i*d.s*.25,-d.s*(1-Math.abs(i)*.2),5,0,P2);ctx.fill()}}
 else{ctx.fillStyle='hsl(210,15%,'+(z>=2?16:26)+'%)';ctx.beginPath();ctx.ellipse(-d.side*d.s*.3,0,d.s*.8,d.s*.55,0,0,P2);ctx.fill()}ctx.restore()}}
function drawLM(top,bot){for(const l of LM){if(l.y<top-400||l.y>bot+400)continue;ctx.save();ctx.translate(l.x,l.y);
 if(l.n==='SHIPWRECK'){ctx.rotate(-.25);ctx.fillStyle='#3b2a1a';ctx.beginPath();ctx.moveTo(-200,0);ctx.lineTo(200,0);ctx.lineTo(150,70);ctx.lineTo(-150,70);ctx.fill();ctx.fillRect(-10,-130,12,130);ctx.fillRect(-90,-80,8,80);ctx.fillStyle='#2a1d12';ctx.fillRect(-60,-20,40,20)}
 else if(l.n==='CORAL CAVE'){ctx.fillStyle='rgba(0,10,25,.7)';ctx.beginPath();ctx.ellipse(0,0,170,110,0,Math.PI,0);ctx.fill();ctx.fillRect(-170,0,340,30)}
 else if(l.n==='TREASURE COVE'){ctx.fillStyle='rgba(255,214,60,.1)';ctx.beginPath();ctx.arc(0,0,200+Math.sin(G.t*2)*10,0,P2);ctx.fill()}
 else if(l.n==='BOSS AREA'){ctx.strokeStyle='rgba(255,60,60,'+(.3+Math.sin(G.t*3)*.15)+')';ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,0,320,0,P2);ctx.stroke()}
 ctx.restore()}}
function render(){ctx.setTransform(DPR,0,0,DPR,0,0);const cam=G.cam,p=G.p,rm=Save.d.set.rm;
 const g=ctx.createLinearGradient(0,-cam.y*Z,0,(WH-cam.y)*Z);[[0,'#6fdcff'],[.22,'#1c9ad6'],[.47,'#0b5fa8'],[.71,'#08285c'],[1,'#02040f']].forEach(s=>g.addColorStop(s[0],s[1]));ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 const ra=C(1-cam.y/1800,0,1)*.16;if(ra>0){ctx.fillStyle='rgba(255,255,255,'+ra+')';for(let i=0;i<5;i++){const x=(i*.24+.05)*W+Math.sin(G.t*.3+i)*30;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+50,0);ctx.lineTo(x+200,H);ctx.lineTo(x+60,H);ctx.fill()}
  ctx.fillStyle='rgba(255,255,255,'+ra*.5+')';for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse(((i*.2+G.t*.01*(i+1))%1.2-.1)*W,H*(.2+i*.12)+Math.sin(G.t+i)*8,60,10,0,0,P2);ctx.fill()}}
 for(const f of FAR){const sx=((f.x+(f.ty?G.t*f.sp:0))-cam.x*f.par)*Z,sy=(f.y-cam.y*f.par)*Z,r=f.s*Z;if(sx<-r*2||sx>W+r*2||sy<-r||sy>H+r)continue;ctx.fillStyle=f.ty?'rgba(255,255,255,'+f.al+')':'rgba(0,15,40,'+f.al*1.6+')';
  if(f.ty){ctx.beginPath();ctx.ellipse(sx,sy,r*.4,r*.14,0,0,P2);ctx.fill()}else{ctx.beginPath();ctx.moveTo(sx-r*.5,sy+r);ctx.lineTo(sx,sy-r);ctx.lineTo(sx+r*.5,sy+r);ctx.fill()}}
 const sx=!rm&&G.shake?R(-1,1)*G.shake:0,sy=!rm&&G.shake?R(-1,1)*G.shake:0;
 ctx.save();ctx.translate(-cam.x*Z+sx,-cam.y*Z+sy);ctx.scale(Z,Z);const top=cam.y,bot=cam.y+H/Z;
 if(top<0){ctx.fillStyle='#d4f3ff';ctx.fillRect(0,-400,WW,400);ctx.fillStyle='#8be3ff';ctx.beginPath();ctx.moveTo(0,0);for(let x=0;x<=WW;x+=40)ctx.lineTo(x,Math.sin(x/60+G.t*2)*5);ctx.lineTo(WW,30);ctx.lineTo(0,30);ctx.fill()}
 drawLM(top,bot);const wc=bot>5000?'#05060f':bot>3200?'#0a1a30':'#0e3a5c';ctx.fillStyle=wc;
 ctx.beginPath();ctx.moveTo(0,top-20);for(let y=Math.floor(top/40)*40-40;y<=bot+40;y+=40)ctx.lineTo(wallW(y),y);ctx.lineTo(0,bot+40);ctx.fill();
 ctx.beginPath();ctx.moveTo(WW,top-20);for(let y=Math.floor(top/40)*40-40;y<=bot+40;y+=40)ctx.lineTo(WW-wallW(y),y);ctx.lineTo(WW,bot+40);ctx.fill();
 if(bot>WH-200){ctx.fillStyle='#07101c';ctx.fillRect(0,WH-30,WW,200)}drawDecor(top,bot);
 for(const h of G.ch){if(h.y<top-60||h.y>bot+60)continue;ctx.save();ctx.translate(h.x,h.y);ctx.fillStyle=h.o?'#5c4a2a':h.t==='rare'?'#845ef7':h.t==='gold'?'#fcc419':'#a8682a';ctx.fillRect(-26,-14,52,28);ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(-26,-2,52,4);if(!h.o){ctx.fillStyle='#fff';ctx.fillRect(-4,-4,8,10);ctx.strokeStyle='rgba(255,230,120,'+(.4+Math.sin(G.t*4)*.3)+')';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,38,0,P2);ctx.stroke()}ctx.restore()}
 for(const o of G.co){if(o.y<top-30||o.y>bot+30)continue;const sw=Math.abs(Math.cos(G.t*4+o.x));ctx.fillStyle=o.v>=10?'#ff922b':o.v>=5?'#ffd43b':o.v>=2?'#fff3a0':'#f5d76e';ctx.beginPath();ctx.ellipse(o.x,o.y,10*sw+2,10,0,0,P2);ctx.fill();ctx.strokeStyle='#b8860b';ctx.lineWidth=2;ctx.stroke()}
 for(const o of G.pk){const U=PU[o.k],r=20+Math.sin(G.t*5)*2;ctx.fillStyle=U.c;ctx.globalAlpha=.3;ctx.beginPath();ctx.arc(o.x,o.y,r*1.7,0,P2);ctx.fill();ctx.globalAlpha=1;ctx.beginPath();ctx.arc(o.x,o.y,r,0,P2);ctx.fill();ctx.fillStyle='#222';ctx.font='bold 20px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(U.i,o.x,o.y+1)}
 for(const c of G.cr)if(c.x>cam.x-250&&c.x<cam.x+W/Z+250&&c.y>top-250&&c.y<bot+250)drawCr(c);
 drawPlayer();
 for(const q of PA){if(q.l<=0)continue;const a=C(q.l/q.m,0,1);if(q.t==='b'){ctx.strokeStyle='rgba(255,255,255,'+a*.5+')';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,P2);ctx.stroke()}else{ctx.globalAlpha=a*(q.t==='t'?.6:1);ctx.fillStyle=q.c;ctx.beginPath();ctx.arc(q.x,q.y,q.r*(q.t==='coin'||q.t==='g'?1:a+.3),0,P2);ctx.fill();ctx.globalAlpha=1}}
 ctx.restore();
 const dp=C((cam.y-1500)/3500,0,.72),px=(p.x-cam.x)*Z,py=(p.y-cam.y)*Z;if(dp>0){const rg=ctx.createRadialGradient(px,py,40,px,py,Math.max(W,H)*(cam.y>4800?.55:.8));rg.addColorStop(0,'rgba(0,0,10,0)');rg.addColorStop(1,'rgba(0,0,10,'+(dp+(cam.y>4800?.15:0))+')');ctx.fillStyle=rg;ctx.fillRect(0,0,W,H)}
 if(p.rush>0){ctx.fillStyle='rgba(255,200,40,'+(.1+Math.sin(G.t*8)*.03)+')';ctx.fillRect(0,0,W,H)}
 if(G.danger&&!rm){const rg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.7);rg.addColorStop(0,'rgba(255,0,0,0)');rg.addColorStop(1,'rgba(255,0,0,'+(.25+Math.sin(G.t*6)*.1)+')');ctx.fillStyle=rg;ctx.fillRect(0,0,W,H)}
 if(G.flash>0&&!rm){ctx.fillStyle='rgba(255,255,255,'+G.flash*.5+')';ctx.fillRect(0,0,W,H)}
 if(G.st==='dying'){ctx.fillStyle='rgba(0,0,15,'+Math.min(.6,p.dead*.4)+')';ctx.fillRect(0,0,W,H)}
 if(p.boosting&&!rm){ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=2;const a=p.ang+Math.PI;for(let i=0;i<8;i++){const o=R(-1,1)*Math.min(W,H)*.45,bx=W/2+Math.cos(a+1.57)*o,by=H/2+Math.sin(a+1.57)*o,L=R(60,140);ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+Math.cos(a)*L,by+Math.sin(a)*L);ctx.stroke()}}
 for(const f of FG){f.y-=f.s*.003;if(f.y<-.05)f.y=1.05;ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(f.x*W+Math.sin(G.t+f.r)*6,f.y*H,f.r,0,P2);ctx.stroke()}
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 19px sans-serif';ctx.lineWidth=4;ctx.strokeStyle='rgba(0,0,0,.6)';
 for(const t of G.tx){const x=(t.x-cam.x)*Z,y=(t.y-cam.y)*Z;ctx.globalAlpha=C(t.l*1.5,0,1);ctx.strokeText(t.s,x,y);ctx.fillStyle=t.c;ctx.fillText(t.s,x,y)}ctx.globalAlpha=1;
 if(G.st==='play'){const b=jb();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,P2);ctx.stroke();ctx.fillStyle='rgba(255,255,255,.08)';ctx.fill();
  let kx=b.x,ky=b.y,ox=b.x,oy=b.y;if(IN.on){ox=IN.ox;oy=IN.oy;const dx=IN.x-IN.ox,dy=IN.y-IN.oy,dd=Math.hypot(dx,dy),k=dd>b.r?b.r/dd:1;kx=ox+dx*k;ky=oy+dy*k;if(!IN.fixed){ctx.strokeStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.arc(ox,oy,b.r,0,P2);ctx.stroke()}}
  ctx.fillStyle='rgba(255,255,255,.5)';ctx.beginPath();ctx.arc(kx,ky,24,0,P2);ctx.fill();
  const mh=Math.min(170,H*.3),mx=W-18-(parseFloat(getComputedStyle(document.body).paddingRight)||0),my=H*.3;ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(mx-6,my,12,mh);[0,1500,3200,5000].forEach((y,i)=>{ctx.fillStyle=['#4fc3f7','#1e88e5','#1a4a8c','#1b1040'][i];ctx.fillRect(mx-4,my+y/WH*mh,8,((i<3?[1500,3200,5000][i]:WH)-y)/WH*mh)});
  for(const l of LM){ctx.fillStyle='#fff';ctx.fillRect(mx-8,my+l.y/WH*mh,3,2)}for(const h of G.ch)if(!h.o){ctx.fillStyle='#ffd43b';ctx.fillRect(mx-2,my+h.y/WH*mh,4,3)}if(G.bossAlive&&G.boss){ctx.fillStyle='#ff3b3b';ctx.fillRect(mx-4,my+G.boss.y/WH*mh-2,8,5)}
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(mx,my+p.y/WH*mh,4,0,P2);ctx.fill()}}

/* ================= HUD ================= */
const HC={};const tx_=(id,v)=>{if(HC[id]!==v){HC[id]=v;$(id).textContent=v}},wd=(id,v)=>{v=Math.round(C(v,0,100));if(HC['w'+id]!==v){HC['w'+id]=v;$(id).style.width=v+'%'}};
function hud(){const p=G.p,r=G.run,S=p.S,d=Save.d,xp=d.sx[d.sel]||0,L=slv(xp);
 tx_('shn',SH[d.sel].n);tx_('shl','Lv.'+L+' / 10');wd('xpF',L>=10?100:(xp-need(L))/(need(L+1)-need(L))*100);wd('hpF',p.hp/S.hp*100);tx_('hpT','❤️️ '+Math.ceil(p.hp)+' / '+S.hp);
 tx_('cn',r.coins);tx_('sc',r.score.toLocaleString());tx_('tm',fmt(r.time));tx_('ds',Math.floor(r.dist));
 const m=MIS.findIndex((m,i)=>!d.ms[i]);tx_('mission',m<0?'':MIS[m].t+'  '+Math.min(MIS[m].g,Math.floor(MIS[m].f(d)))+' / '+MIS[m].g);
 tx_('combo',r.combo>=3?'COMBO x'+mult(Math.floor(r.combo)):'');
 if(p.rush>0){wd('grF',p.rush*10);tx_('grT','🔥 GOLD RUSH '+p.rush.toFixed(1)+'s')}else{wd('grF',r.meter);tx_('grT','GOLD RUSH')}$('hud').classList.toggle('rush',p.rush>0);
 wd('enF',p.en/S.bo*100);let f='';for(const k in p.fx)if(p.fx[k]>0&&p.fx[k]<999)f+=(k==='shield'?'🛡':k==='speed'?'⚡':k==='magnet'?'🧲':k==='slow'?'❄':'')+Math.ceil(p.fx[k])+' ';tx_('fx',f);
 const bb=$('bossbar');if(G.bossAlive&&G.boss){bb.classList.remove('hide');wd('bossF',G.boss.hp/G.boss.d.hp*100)}else bb.classList.add('hide')}

/* ================= SCREENS ================= */
function drawPrev(cvs,i,locked){const c=cvs.getContext('2d'),s=SH[i];ctx=c;c.setTransform(1,0,0,1,0,0);const g=c.createLinearGradient(0,0,0,cvs.height);g.addColorStop(0,'#2ab7e8');g.addColorStop(1,'#0b4c8c');c.fillStyle=g;c.fillRect(0,0,cvs.width,cvs.height);
 c.save();c.translate(cvs.width/2+Math.sin(G.t)*8,cvs.height/2+Math.sin(G.t*1.3)*6);c.scale(1.3,1.3);c.translate(-s.s*.1,0);sh(s.s*1.6*(1+i*0.02),s.col,G.t*6,0,0);
 if(locked){c.globalCompositeOperation='source-atop';c.fillStyle='rgba(0,0,20,.8)';c.fillRect(-200,-150,400,300)}c.restore();ctx=mctx}
function previews(){if(!$('shark').classList.contains('hide'))drawPrev($('pv'),G.view,!Save.d.un[G.view]);if(!$('unlock').classList.contains('hide'))drawPrev($('uc'),G.unl,false)}
const bar=(n,v,mx)=>'<div class="sb"><u>'+n+'</u><div class="pb"><i style="width:'+C(v/mx*100,4,100)+'%"></i></div></div>';
function renderShark(){const d=Save.d,i=G.view,s=SH[i],un=d.un[i],xp=d.sx[i]||0,L=slv(xp),m=d.ma[i]||{food:0,dist:0,best:0,combo:0},ml=Math.floor(Math.sqrt(m.food/15));
 $('shInfo').innerHTML='<b>'+(un?'':'🔒 ')+s.n+'</b>Size '+SZL[i]+' • Lv.'+L+'/10  XP '+(xp-need(L))+' / '+(L>=10?'MAX':need(L+1)-need(L))+bar('HP',s.hp,450)+bar('SPEED',s.sp,330)+bar('BITE',s.bs,100)+bar('BOOST',s.bo,200)+'<small>Bite '+SZL[i]+' • Mastery Lv.'+ml+' (+'+ml+'% coins) • Food '+m.food+' • Dist '+Math.floor(m.dist)+'m • Best '+m.best+' • Combo '+m.combo+'</small>';
 $('shBtn').innerHTML=un?'<button class="big" '+(d.sel===i?'disabled':'')+' data-sel="'+i+'">'+(d.sel===i?'✔ SELECTED':'SELECT')+'</button>':'<div class="cn">🔒 LOCKED — '+s.u+'</div>';
 $('chips').innerHTML=SH.map((x,j)=>'<button class="'+(j===i?'on':'')+'" data-v="'+j+'">'+(d.un[j]?j+1:'🔒')+'</button>').join('')}
function renderUpg(){const d=Save.d;$('upList').innerHTML=Object.keys(UP).map(k=>{const u=UP[k],l=d.up[k],mx=l>=u.m,c=upCost(k,l);return '<div class="row2"><span>'+u.i+' '+u.n+' <em>Lv.'+(l+1)+'</em><small>'+upVal(k,l)+(mx?' (MAX)':' → '+upVal(k,l+1))+'</small></span><button data-up="'+k+'" '+(mx||d.coins<c?'disabled':'')+'>'+(mx?'MAX':d.coins<c?'NOT ENOUGH<br>🪙 '+c:'UPGRADE<br>🪙 '+c)+'</button></div>'}).join('');document.querySelectorAll('.coins').forEach(e=>e.textContent=d.coins)}
function renderShop(){const d=Save.d;$('shopList').innerHTML='<div class="cn">POWER UP (auto-used at run start)</div>'+SHOP.map(s=>'<div class="row2"><span>'+s.i+' '+s.n+' <em>x'+d.inv[s.id]+'</em><small>'+s.d+'</small></span><span><button data-buy="'+s.id+'" '+(d.coins<s.p?'disabled':'')+'>🪙 '+s.p+'</button> <button data-tg="use:'+s.id+'" style="min-width:56px">'+(d.use[s.id]?'ON':'OFF')+'</button></span></div>').join('')+'<div class="cn">COSMETIC — TRAIL</div>'+TR.map(t=>{const own=d.trails.includes(t.id);return '<div class="row2"><span><span style="color:'+t.col+'">●</span> '+t.n+'</span><button data-tr="'+t.id+'" '+(!own&&d.coins<t.p?'disabled':'')+'>'+(d.trail===t.id?'✔ EQUIPPED':own?'EQUIP':'🪙 '+t.p)+'</button></div>'}).join('');document.querySelectorAll('.coins').forEach(e=>e.textContent=d.coins)}
function renderMis(){const d=Save.d;$('misList').innerHTML=MIS.map((m,i)=>{const v=Math.min(m.g,Math.floor(m.f(d)));return '<div class="row2"><span>'+(d.ms[i]?'✔ ':'')+m.t+'<small>Reward 🪙'+m.c+(m.x?' + '+m.x+' XP':'')+' • '+v+' / '+m.g+'</small><div class="pb"><i style="width:'+v/m.g*100+'%"></i></div></span></div>'}).join('')}
function renderAch(){const d=Save.d;$('achList').innerHTML=AC.map((a,i)=>'<div class="row2 '+(d.ach[i]?'on':'lock')+'"><span>'+(d.ach[i]?'✓ '+a[0]:'🔒 ???')+'<small>'+a[1]+'</small></span><em>🪙'+a[3]+'</em></div>').join('')}
function renderProf(){const d=Save.d,s=d.st,row=(a,b)=>'<div class="row2"><span>'+a+'</span><em>'+b+'</em></div>';$('profList').innerHTML=row('PLAYER LEVEL',plv(d.xp))+row('TOTAL SCORE',s.score.toLocaleString())+row('BEST SCORE',d.best.toLocaleString())+row('COINS',d.coins)+row('TOTAL FISH EATEN',s.fish.toLocaleString())+row('TOTAL DISTANCE',(s.dist/100).toFixed(1)+' km')+row('LONGEST SURVIVAL',fmt(s.longest))+row('BEST COMBO','x'+mult(s.combo)+' ('+s.combo+')')+row('SHARKS UNLOCKED',d.un.filter(Boolean).length+' / 8')+row('ACHIEVEMENTS',Object.keys(d.ach).length+' / 20')+row('TREASURES',s.chest)+row('BOSSES DEFEATED',s.boss)+row('GAMES PLAYED',s.games)}
function renderSet(){const d=Save.d.set,r=(k,n)=>'<div class="row2"><span>'+n+'</span><button data-tg="set:'+k+'" style="min-width:80px">'+(d[k]?'ON':'OFF')+'</button></div>';$('setList').innerHTML=r('snd','🔊 Sound')+r('vib','📳 Vibration')+r('rm','🌀 Reduced Motion')+'<button class="red" data-go="confirm">RESET ALL DATA</button>'}
function showUnlock(){if(!G.uq.length)return;G.unl=G.uq[0];$('uName').textContent=SH[G.unl].n;$('unlock').classList.remove('hide');SFX.rush();part(0,0,0,'#fff',0,0,0)}
function today(){return new Date().toLocaleDateString('en-CA')}
function dailyCheck(){const d=Save.d.daily,t=today();if(d.last===t)return;const y=new Date(Date.now()-864e5).toLocaleDateString('en-CA'),day=d.last===y?(d.streak%7)+1:1;G.day=day;
 $('dayGrid').innerHTML=DAILY.map((v,i)=>'<div class="'+(i+1===day?'cur':i+1<day?'done':'')+'">DAY '+(i+1)+'<br>'+(typeof v==='number'?'🪙'+v:'🎁')+'</div>').join('');$('daily').classList.remove('hide')}
function claim(){const d=Save.d,v=DAILY[G.day-1];if(typeof v==='number')d.coins+=v;else{d.coins+=500;d.inv.shield++;d.inv.magnet++}d.daily.last=today();d.daily.streak=G.day;Save.save();$('daily').classList.add('hide');toast('🎁 Daily reward collected!');show('menu')}
function go(x){SFX.btn();
 switch(x){case 'play':$('pm').classList.add('hide');startRun();break;case 'menu':toMenu();break;case 'back':go(G.back);return;
 case 'pause':if(G.st==='play'){G.paused=true;show('pm')}break;case 'resume':G.paused=false;show(null);break;case 'quit':G.paused=false;finish();break;
 case 'shark':G.view=Save.d.sel;renderShark();show('shark');break;case 'upg':renderUpg();show('upg');break;case 'shop':renderShop();show('shop');break;case 'mis':renderMis();show('mis');break;
 case 'ach':renderAch();show('ach');break;case 'prof':renderProf();show('prof');break;case 'set':G.back=G.st==='play'?'pm':'menu';renderSet();show('set');break;case 'pm':show('pm');break;
 case 'confirm':$('confirm').classList.remove('hide');break;case 'cancel':$('confirm').classList.add('hide');break;
 case 'doReset':Save.reset();G.uq=[];$('confirm').classList.add('hide');G.st='menu';toMenu();toast('Data reset');break;
 case 'useNow':{const d=Save.d;d.sel=G.unl;Save.save();G.uq.shift();$('unlock').classList.add('hide');G.p=newPlayer();if(G.uq.length)showUnlock();break}
 case 'uclose':G.uq.shift();$('unlock').classList.add('hide');if(G.uq.length)showUnlock();break;case 'claim':claim();break}}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;const d=Save.d,D=b.dataset;
 if(D.go)go(D.go);
 else if(D.sh){G.view=(G.view+ +D.sh+8)%8;renderShark();SFX.btn()}else if(D.v){G.view=+D.v;renderShark();SFX.btn()}
 else if(D.sel){d.sel=+D.sel;Save.save();G.p=newPlayer();G.p.y=420;renderShark();SFX.lvl()}
 else if(D.up){const k=D.up,l=d.up[k],c=upCost(k,l);if(l<UP[k].m&&d.coins>=c){d.coins-=c;d.up[k]++;Save.save();SFX.lvl();renderUpg()}}
 else if(D.buy){const s=SHOP.find(x=>x.id===D.buy);if(d.coins>=s.p){d.coins-=s.p;d.inv[s.id]++;Save.save();SFX.coin();renderShop()}}
 else if(D.tr){const t=TR.find(x=>x.id===D.tr);if(!d.trails.includes(t.id)&&d.coins>=t.p){d.coins-=t.p;d.trails.push(t.id)}if(d.trails.includes(t.id))d.trail=t.id;Save.save();SFX.coin();renderShop()}
 else if(D.tg){const[a,k]=D.tg.split(':');d[a][k]=d[a][k]?0:1;Save.save();SFX.btn();if(a==='set')renderSet();else renderShop()}});

/* ================= INPUT ================= */
function jb(){return{x:Math.max(90,W*.1),y:H-Math.max(100,H*.18),r:55}}
cv.addEventListener('pointerdown',e=>{if(G.st!=='play'||G.paused||IN.on)return;e.preventDefault();const b=jb();IN.on=true;IN.pid=e.pointerId;IN.fixed=Math.hypot(e.clientX-b.x,e.clientY-b.y)<b.r*2;IN.ox=IN.fixed?b.x:e.clientX;IN.oy=IN.fixed?b.y:e.clientY;IN.x=e.clientX;IN.y=e.clientY;try{cv.setPointerCapture(e.pointerId)}catch(_){}});
cv.addEventListener('pointermove',e=>{if(!IN.on||e.pointerId!==IN.pid)return;IN.x=e.clientX;IN.y=e.clientY;if(!IN.fixed){const dx=IN.x-IN.ox,dy=IN.y-IN.oy,d=Math.hypot(dx,dy);if(d>90){IN.ox=IN.x-dx/d*90;IN.oy=IN.y-dy/d*90}}});
const pu=e=>{if(e.pointerId===IN.pid)IN.on=false};cv.addEventListener('pointerup',pu);cv.addEventListener('pointercancel',pu);
const bo=$('boost');bo.addEventListener('pointerdown',e=>{e.preventDefault();IN.bo=true});['pointerup','pointercancel','pointerleave'].forEach(t=>bo.addEventListener(t,()=>IN.bo=false));
addEventListener('keydown',e=>{IN.k[e.code]=true;if(e.code==='Space'||e.code.startsWith('Arrow'))e.preventDefault();if((e.code==='Escape'||e.code==='KeyP')&&G.st==='play')go(G.paused?'resume':'pause')});
addEventListener('keyup',e=>IN.k[e.code]=false);addEventListener('blur',()=>{IN.k={};IN.bo=false;IN.on=false});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&G.st==='play'&&!G.paused)go('pause')});
document.addEventListener('contextmenu',e=>e.preventDefault());document.addEventListener('touchmove',e=>{if(!e.target.closest('.scr'))e.preventDefault()},{passive:false});

/* ================= INIT ================= */
genWorld();G.p=newPlayer();G.p.y=420;Z=Math.min(W,H)/(260+G.p.sz*5.5);fill(true);show('menu');dailyCheck();checkProg();requestAnimationFrame(loop);
