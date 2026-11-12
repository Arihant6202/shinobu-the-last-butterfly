const $=id=>document.getElementById(id);
const sections=["menu","chapters","settings","character","skills","collection","game"];
function show(id){sections.forEach(s=>$(s).classList.toggle("hidden",s!==id));$("pauseLayer").classList.add("hidden");}
function refreshMetaPanelsSafe(){if($("collectionCoins")){$("collectionCoins").textContent=coins;$("collectionButterflies").textContent=butterflies}if($("profileHealth")&&typeof player!=="undefined")$("profileHealth").textContent=player.hp+" / 1200"}
function toast(t){$("toast").textContent=t;$("toast").classList.remove("hidden");setTimeout(()=>$("toast").classList.add("hidden"),1800)}
function updateHealthUI(){
 $("healthFill").style.width=(player.hp/1200*100)+"%";
 $("healthText").textContent=player.hp+" / 1200";
 refreshMetaPanelsSafe();
}
function damagePlayer(amount){
 if(player.invulnerable>0)return;
 player.hurtTimer=16;
 player.hp=Math.max(0,player.hp-amount);
 updateHealthUI();
 if(player.hp===0){
  toast("Shinobu is exhausted — returning to the path.");
  player.hp=1200;player.x=Math.max(100,player.x-220);updateHealthUI();
 }
}
function updateCombatHUD(){
 const boss=enemies.find(e=>e.boss);
 const bossVisible=boss&&boss.alive&&Math.abs(player.x-boss.x)<850;
 $("bossHud").classList.toggle("hidden",!bossVisible);
 if(boss){
   $("bossHealthFill").style.width=(Math.max(0,boss.hp)/boss.maxHp*100)+"%";
   $("bossHud").classList.toggle("phaseTwo",boss.phase===2);
   const name=$("bossNameText");if(name)name.textContent=`TSUKIKO · WISTERIA PHANTOM · PHASE ${boss.phase||1}`;
 }
 const defeated=enemies.filter(e=>!e.boss&&!e.alive).length;
 $("enemyObjective").textContent=`Defeat Shadow enemies: ${defeated} / 3`;
 $("dashStatus").textContent=player.dashCooldown>0?`${Math.ceil(player.dashCooldown/60)}s`:"READY";
 if($("magicStatus"))$("magicStatus").textContent=player.magicCooldown>0?`${Math.ceil(player.magicCooldown/60)}s`:"READY";
 if($("magicBtn"))$("magicBtn").classList.toggle("cooling",player.magicCooldown>0);
 $("dashHud").classList.toggle("cooling",player.dashCooldown>0);
}

const SAVE_KEY="shinobu_pale_gardener_save_v1";
function saveGame(showMessage=true){
 try{
  const data={version:3,player:{x:player.x,hp:player.hp},coins,butterflies,chapterComplete,rewardClaimed,
   enemies:enemies.map(e=>({hp:e.hp,alive:e.alive,x:e.x}))};
  localStorage.setItem(SAVE_KEY,JSON.stringify(data));
  $("saveStatus").textContent="Saved locally";
  if(showMessage)toast("Game saved on this device.");
  return true;
 }catch(err){$("saveStatus").textContent="Save unavailable";if(showMessage)toast("This browser blocked local saving.");return false}
}
function loadGame(){
 try{
  const raw=localStorage.getItem(SAVE_KEY);if(!raw)return false;
  const d=JSON.parse(raw);if(!d||!d.player)return false;
  player.x=Math.max(70,Math.min(WORLD_WIDTH-90,Number(d.player.x)||260));
  player.hp=Math.max(1,Math.min(1200,Number(d.player.hp)||1200));
  coins=Math.max(0,Number(d.coins)||0);butterflies=Math.max(0,Number(d.butterflies)||0);
  chapterComplete=!!d.chapterComplete;rewardClaimed=!!d.rewardClaimed;
  if(Array.isArray(d.enemies))d.enemies.forEach((e,i)=>{if(enemies[i]){enemies[i].hp=Math.max(0,Number(e.hp)||0);enemies[i].alive=!!e.alive;enemies[i].x=Math.max(600,Math.min(WORLD_WIDTH-100,Number(e.x)||enemies[i].x))}});
  cameraX=Math.max(0,Math.min(WORLD_WIDTH-1280,player.x-420));
   updateCombatHUD();
  $("coins").textContent=coins;$("butterflies").textContent=butterflies;refreshMetaPanelsSafe();
  $("healthFill").style.width=(player.hp/1200*100)+"%";$("healthText").textContent=player.hp+" / 1200";
  $("saveStatus").textContent="Save loaded";return true;
 }catch(err){return false}
}

$("newGame").onclick=()=>{player.x=260;player.hp=1200;player.dash=0;player.dashCooldown=0;player.magicCooldown=0;player.invulnerable=0;cameraX=0;coins=0;butterflies=0;chapterComplete=false;rewardClaimed=false;$("chapterCompleteLayer").classList.add("hidden");enemies.forEach((e,i)=>{e.alive=true;e.hp=e.maxHp;e.hit=0;e.x=[850,1450,2150,3190][i]});$("coins").textContent="0";$("butterflies").textContent="0";$("healthFill").style.width="100%";$("healthText").textContent="1200 / 1200";show("game");startDialogue();updateCombatHUD();saveGame(false)};
$("continueBtn").onclick=()=>{if(loadGame()){show("game");toast("Saved progress loaded.")}else{show("game");toast("No saved progress found. Start a New Game.")}};
$("chaptersBtn").onclick=()=>show("chapters");
$("settingsBtn").onclick=()=>show("settings");
$("characterBtn").onclick=()=>{refreshMetaPanels();show("character")};
$("skillsBtn").onclick=()=>show("skills");
$("collectionBtn").onclick=()=>{refreshMetaPanels();show("collection")};
function refreshMetaPanels(){
 $("profileHealth").textContent=player.hp+" / 1200";
 $("collectionButterflies").textContent=butterflies;
 $("collectionCoins").textContent=coins;
}
document.querySelectorAll("[data-back]").forEach(b=>b.onclick=()=>show("menu"));
document.querySelectorAll(".chapter.active").forEach(b=>b.onclick=()=>{show("game");startDialogue()});
$("pauseBtn").onclick=()=>{if(!$("game").classList.contains("hidden"))$("pauseLayer").classList.remove("hidden")};
$("resumeBtn").onclick=()=>$("pauseLayer").classList.add("hidden");
$("homeBtn").onclick=()=>{saveGame(false);show("menu")};
$("saveBtn").onclick=()=>saveGame(true);
let sound=true;$("soundBtn").onclick=()=>{$("soundBtn").textContent=sound?"OFF":"ON";sound=!sound};
let dialogueDone=false;
function startDialogue(){if(dialogueDone)return;$("dialogue").classList.remove("hidden");}
$("dialogueNext").onclick=()=>{$("dialogue").classList.add("hidden");dialogueDone=true;};
const canvas=$("world"),ctx=canvas.getContext("2d");
let player={x:260,y:515,vx:0,vy:0,ground:true,face:1,attack:0,magic:0,magicCooldown:0,jump:0,hp:1200,dash:0,dashCooldown:0,invulnerable:0,hurtTimer:0};
let comboCount=0,lastComboAt=0;
const WORLD_WIDTH=3840;
let cameraX=0;
let enemies=[
 {x:850,hp:260,maxHp:260,dir:-1,hit:0,alive:true,type:"scout",name:"Shadow Scout",damage:45,reward:25,attackCooldown:0,lunge:0},
 {x:1450,hp:420,maxHp:420,dir:-1,hit:0,alive:true,type:"brute",name:"Shadow Brute",damage:70,reward:40,attackCooldown:0,slam:0},
 {x:2150,hp:320,maxHp:320,dir:-1,hit:0,alive:true,type:"archer",name:"Shadow Archer",damage:55,reward:35},
 {x:3190,hp:1500,maxHp:1500,dir:-1,hit:0,alive:true,type:"guardian",name:"Tsukiko · Wisteria Phantom",damage:100,reward:200,boss:true,phase:1,telegraph:0,bossAttackCooldown:100}
];
let lastEnemyHit=0, chapterComplete=false, rewardClaimed=false;
let shadowBolts=[];let lastArcherShot=0;
let keys={},stickDir=0,coins=0,butterflies=0,paused=false;
const chapter1Bg=new Image();
let chapter1BgReady=false;
chapter1Bg.onload=()=>{chapter1BgReady=true};
chapter1Bg.onerror=()=>{chapter1BgReady=false};
chapter1Bg.src="assets/chapter1_wisteria_background.svg";

function drawWaterAnimationOverlay(t){
  ctx.save();
  // Three waterfall ribbons aligned with the distant cliff and lower cascade.
  const falls=[
    {x:350,y:190,w:76,h:180,s:1.0},
    {x:585,y:245,w:112,h:205,s:1.35},
    {x:835,y:305,w:68,h:145,s:.82}
  ];
  for(const f of falls){
    ctx.save();
    ctx.beginPath();ctx.rect(f.x,f.y,f.w,f.h);ctx.clip();
    // Soft translucent current, with several independently scrolling streams.
    const g=ctx.createLinearGradient(f.x,0,f.x+f.w,0);
    g.addColorStop(0,'rgba(150,205,255,0)');
    g.addColorStop(.25,'rgba(174,220,255,.13)');
    g.addColorStop(.52,'rgba(236,248,255,.25)');
    g.addColorStop(.78,'rgba(130,184,255,.12)');
    g.addColorStop(1,'rgba(150,205,255,0)');
    ctx.fillStyle=g;ctx.fillRect(f.x,f.y,f.w,f.h);
    for(let i=0;i<17;i++){
      const x=f.x+((i*29)%f.w)+Math.sin(t/470+i)*2.5;
      const y=f.y-35+((t*f.s*0.19+i*43)%(f.h+65));
      const len=15+(i%5)*9;
      ctx.strokeStyle=i%3===0?'rgba(239,249,255,.62)':'rgba(155,210,255,.36)';
      ctx.lineWidth=i%4===0?2.4:1.1;
      ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x-2,y+len*.35,x+3,y+len*.7,x+Math.sin(t/260+i)*2,y+len);ctx.stroke();
    }
    ctx.restore();
    // Foam and airborne droplets at the foot of each fall.
    for(let i=0;i<13;i++){
      const x=f.x+(i*17%f.w)+Math.sin(t/190+i)*5;
      const y=f.y+f.h-3+Math.sin(t/125+i*1.7)*3;
      ctx.fillStyle='rgba(225,242,255,'+(0.24+(i%4)*.1)+')';
      ctx.beginPath();ctx.ellipse(x,y,2.2+(i%3),3.2+(i%2)*2,0,0,Math.PI*2);ctx.fill();
    }
    for(let i=0;i<5;i++){
      const phase=(t/18+i*23)%74;
      const x=f.x+f.w/2+Math.sin(t/230+i*2)*f.w*.48;
      const y=f.y+f.h-7-phase*.65;
      ctx.fillStyle='rgba(210,235,255,'+(0.08+(1-phase/74)*.24)+')';
      ctx.beginPath();ctx.arc(x,y,1.2+(i%2),0,Math.PI*2);ctx.fill();
    }
  }
  // Moving reflective bands on the river surface.
  ctx.save();ctx.globalCompositeOperation='screen';
  for(let i=0;i<44;i++){
    const x=(i*37+t*(.018+(i%4)*.006))%1280;
    const y=510+(i*23)%105+Math.sin(t/330+i)*2;
    const w=12+(i%6)*7;
    ctx.strokeStyle=i%3===0?'rgba(220,194,255,.42)':'rgba(127,190,255,.25)';
    ctx.lineWidth=1+(i%2)*.6;
    ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+w*.5,y+Math.sin(t/210+i)*2,x+w,y);ctx.stroke();
  }
  ctx.restore();
  // Small concentric ripples expand and fade beneath the cascades.
  for(let i=0;i<7;i++){
    const phase=(t/95+i*17)%38;
    const x=390+i*118+Math.sin(t/800+i)*12;
    const y=548+(i%3)*18;
    ctx.strokeStyle='rgba(205,220,255,'+(.28*(1-phase/38))+')';
    ctx.lineWidth=1.2;
    ctx.beginPath();ctx.ellipse(x,y,5+phase*.9,1.5+phase*.13,0,0,Math.PI*2);ctx.stroke();
  }
  // Cool mist drifts sideways around the waterfall basin.
  ctx.globalAlpha=.12;
  for(let i=0;i<7;i++){
    const x=(i*190+t*.012)%1450-80,y=448+(i%3)*22;
    const rg=ctx.createRadialGradient(x,y,3,x,y,38);
    rg.addColorStop(0,'#d9eaff');rg.addColorStop(1,'rgba(217,234,255,0)');
    ctx.fillStyle=rg;ctx.beginPath();ctx.arc(x,y,38,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}

function drawBackground(){
 // Five-speed parallax: the camera transform is already applied to the world.
 // Counter-shift each visual plane by a different fraction of cameraX.
 const t=performance.now();
 if(chapter1BgReady){
   const sw=chapter1Bg.width, sh=chapter1Bg.height;
   const scale=Math.max(1280/sw,720/sh);
   const dw=sw*scale, dh=sh*scale;
   const overflow=dw-1280;
   ctx.save();
   // Distant illustrated world: slow movement (0.18 camera speed).
   ctx.translate(cameraX*0.82,0);
   ctx.globalAlpha=.96;
   ctx.drawImage(chapter1Bg,-overflow*.5,0,dw,720);
   ctx.restore();
 }else drawBackgroundFallback();
 // Animated water overlay also runs when the illustrated SVG background is loaded.
 // The moving highlights create visible flow without replacing the painted waterfall art.
 drawWaterAnimationOverlay(performance.now());
 // Mid-distance ridge and roof silhouettes: an independent depth plane between painted scenery and canopy.
 ctx.save();
 ctx.translate(-cameraX*.12,0);
 ctx.globalAlpha=.28;
 ctx.fillStyle="#111329";
 ctx.beginPath();ctx.moveTo(-80,390);
 for(let i=0;i<13;i++){const x=-80+i*125;ctx.lineTo(x+62,300+(i%4)*23);ctx.lineTo(x+125,390);}
 ctx.lineTo(1600,470);ctx.lineTo(-80,470);ctx.closePath();ctx.fill();
 // Tiny distant lanterns add depth without competing with the playable layer.
 for(let i=0;i<9;i++){
   const x=65+i*174,y=365+(i%3)*24;
   const glow=ctx.createRadialGradient(x,y,1,x,y,23);
   glow.addColorStop(0,"rgba(255,190,245,.34)");glow.addColorStop(1,"rgba(255,190,245,0)");
   ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,23,0,Math.PI*2);ctx.fill();
 }
 ctx.restore();
 // Separate parallax foreground canopy and drifting petals.
 ctx.save();
 ctx.translate(cameraX*.34,0);
 for(let i=0;i<22;i++){
   const x=(i*137)%1600-120, y=16+(i*29)%55;
   ctx.strokeStyle='#39234f';ctx.lineWidth=4;
   ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+18,y+30,x+8,y+92+(i%4)*18);ctx.stroke();
   for(let j=0;j<5;j++){
     ctx.fillStyle=['#8e5bb9','#b77bdc','#dca9f5'][((i+j)%3)];
     ctx.beginPath();ctx.ellipse(x+Math.sin(i+j)*7,y+42+j*9,5,9,.25,0,Math.PI*2);ctx.fill();
   }
 }
 ctx.restore();
 // Foreground flowers move faster than the camera for depth.
 ctx.save();ctx.translate(-cameraX*.18,0);
 for(let i=0;i<34;i++){
   const x=(i*83)%1600-120, y=622+(i%4)*17;
   ctx.fillStyle=i%2?'#9e6bc7':'#d49be9';
   ctx.beginPath();ctx.arc(x+Math.sin(t/650+i)*4,y,4+(i%3),0,Math.PI*2);ctx.fill();
 }
 ctx.restore();
 // Mid-air petals drift independently of the camera.
 for(let i=0;i<20;i++){
   const x=((i*113+t*.018*(i%2?1:-1)-cameraX*.62)%1440+1440)%1440-80;
   const y=285+(i*47)%250+Math.sin(t/700+i)*12;
   ctx.save();ctx.translate(x,y);ctx.rotate(t/900+i);ctx.fillStyle='#efcaffcc';
   ctx.beginPath();ctx.ellipse(0,0,4,8,.5,0,Math.PI*2);ctx.fill();ctx.restore();
 }
}
function drawBackgroundFallback(){
 // Layered moonlit wisteria garden with parallax-like depth
 const sky=ctx.createLinearGradient(0,0,0,720);
 sky.addColorStop(0,"#090f2b");sky.addColorStop(.42,"#24204f");sky.addColorStop(1,"#11172c");
 ctx.fillStyle=sky;ctx.fillRect(0,0,1280,720);
 // stars
 for(let i=0;i<90;i++){let x=(i*173)%1280,y=(i*67)%390;ctx.fillStyle=i%3?"#b9a8ff88":"#fff0ff";ctx.fillRect(x,y,2,2)}
 // moon glow
 let glow=ctx.createRadialGradient(1000,112,12,1000,112,180);glow.addColorStop(0,"#e6ddff55");glow.addColorStop(1,"#8d78ff00");
 ctx.fillStyle=glow;ctx.fillRect(800,0,400,320);
 ctx.fillStyle="#e5e0ff";ctx.beginPath();ctx.arc(1000,112,67,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#c4bde9";ctx.beginPath();ctx.arc(1025,90,13,0,Math.PI*2);ctx.arc(970,137,9,0,Math.PI*2);ctx.fill();
 // distant hills
 ctx.fillStyle="#141b3b";ctx.beginPath();ctx.moveTo(0,410);ctx.quadraticCurveTo(220,245,450,405);ctx.quadraticCurveTo(720,255,920,390);ctx.quadraticCurveTo(1110,290,1280,380);ctx.lineTo(1280,720);ctx.lineTo(0,720);ctx.fill();
 // distant mansion grounds and roof
 ctx.fillStyle="#10152c";ctx.fillRect(845,260,350,230);
 ctx.fillStyle="#30284d";ctx.beginPath();ctx.moveTo(800,280);ctx.lineTo(1015,150);ctx.lineTo(1235,280);ctx.lineTo(1200,294);ctx.lineTo(1015,190);ctx.lineTo(830,294);ctx.closePath();ctx.fill();
 ctx.fillStyle="#17162f";ctx.fillRect(875,275,290,185);
 ctx.fillStyle="#d9a8ff";ctx.globalAlpha=.18;ctx.fillRect(900,300,245,135);ctx.globalAlpha=1;
 for(let x=900;x<1150;x+=48){ctx.fillStyle="#f7bd85";ctx.shadowColor="#ffbd83";ctx.shadowBlur=18;ctx.fillRect(x,315,27,54);ctx.shadowBlur=0;ctx.fillStyle="#392747";ctx.fillRect(x+11,315,3,54)}
 ctx.fillStyle="#241b3c";ctx.beginPath();ctx.moveTo(860,315);ctx.lineTo(1018,220);ctx.lineTo(1185,315);ctx.lineTo(1160,325);ctx.lineTo(1018,245);ctx.lineTo(880,325);ctx.closePath();ctx.fill();
 // mansion stairs
 ctx.fillStyle="#4d4b70";for(let i=0;i<8;i++)ctx.fillRect(990-i*9,445+i*10,190+i*18,8);
 // tree trunks
 for(const x of [40,250,1215]){ctx.strokeStyle="#24172f";ctx.lineWidth=x===40?34:24;ctx.beginPath();ctx.moveTo(x,0);ctx.quadraticCurveTo(x+35,100,x-10,280);ctx.stroke();ctx.strokeStyle="#51305c";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x+4,65);ctx.lineTo(x+60,5);ctx.stroke()}
 // hanging wisteria flowers
 for(let i=0;i<48;i++){
   const x=(i*83)%1280, y=8+(i*29)%70, len=65+(i*37)%135;
   ctx.strokeStyle="#49305f";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(i*2)*13,y+len);ctx.stroke();
   for(let j=0;j<6;j++){ctx.fillStyle=["#9e6bc7","#c38be8","#e2b5ff","#8055b0"][((i+j)%4)];ctx.beginPath();ctx.ellipse(x+Math.sin(i+j)*9,y+len*.35+j*10,5,10,.25,0,Math.PI*2);ctx.fill()}
 }
 // bridge and stone wall
 ctx.fillStyle="#30304f";ctx.fillRect(0,500,1280,78);
 ctx.fillStyle="#565477";ctx.fillRect(0,523,1280,18);
 ctx.strokeStyle="#a04e89";ctx.lineWidth=13;ctx.beginPath();ctx.moveTo(580,510);ctx.quadraticCurveTo(760,390,945,510);ctx.stroke();
 ctx.strokeStyle="#e08db9";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(580,488);ctx.quadraticCurveTo(760,368,945,488);ctx.stroke();
 for(let x=600;x<940;x+=32){ctx.strokeStyle="#8c4e86";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,480-Math.sin((x-580)/360*Math.PI)*95);ctx.lineTo(x,512);ctx.stroke()}
 // water with moving highlights
 const water=ctx.createLinearGradient(0,545,0,720);water.addColorStop(0,"#354b78");water.addColorStop(1,"#101a38");ctx.fillStyle=water;ctx.fillRect(0,545,1280,175);
 for(let i=0;i<35;i++){let x=(i*97+(performance.now()*.025*(i%3+1)))%1280,y=570+(i*31)%125;ctx.strokeStyle=i%2?"#8bb7ed55":"#d9c8ff66";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+25+(i%4)*9,y);ctx.stroke()}
 // waterfall
 ctx.fillStyle="#83b8e8";ctx.globalAlpha=.7;ctx.fillRect(770,445,95,98);ctx.globalAlpha=1;
 for(let i=0;i<12;i++){let x=774+i*8;ctx.strokeStyle="#d2e7ff99";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,445);ctx.lineTo(x+Math.sin(performance.now()/300+i)*4,540);ctx.stroke()}
 // Multi-tier animated waterfalls: flowing ribbons, foam, drifting spray and river ripples.
 const waterTime=performance.now();
 const falls=[
   {x:286,y:342,w:46,h:174,phase:0},
   {x:690,y:286,w:82,h:258,phase:1.7},
   {x:865,y:360,w:54,h:184,phase:3.1},
   {x:1068,y:324,w:62,h:220,phase:4.4}
 ];
 for(const f of falls){
   ctx.save();
   // dark cliff lip and cool blue water body
   const wg=ctx.createLinearGradient(f.x,0,f.x+f.w,0);
   wg.addColorStop(0,"#243c69");wg.addColorStop(.35,"#b8dcff");wg.addColorStop(.58,"#668fc9");wg.addColorStop(1,"#263d70");
   ctx.globalAlpha=.78;ctx.fillStyle=wg;ctx.fillRect(f.x,f.y,f.w,f.h);
   // animated vertical current ribbons
   ctx.globalAlpha=.78;
   for(let k=0;k<9;k++){
     const xx=f.x+4+k*(f.w-8)/8;
     const drift=(waterTime*.16+k*17+f.phase*29)%(f.h+32);
     ctx.strokeStyle=k%2?"#e5f5ffbb":"#8ecbffff";
     ctx.lineWidth=k%3===0?3:1.5;
     ctx.beginPath();ctx.moveTo(xx,f.y-20+drift);ctx.bezierCurveTo(xx-5,f.y+drift+18,xx+5,f.y+drift+34,xx+Math.sin(waterTime/270+k+f.phase)*3,Math.min(f.y+f.h,f.y+drift+58));ctx.stroke();
   }
   // foamy falling edge and spray
   ctx.globalAlpha=.8;ctx.fillStyle="#d9efff";
   for(let k=0;k<12;k++){
     const sx=f.x+(k*13%f.w), sy=f.y+f.h-5+Math.sin(waterTime/150+k+f.phase)*4;
     ctx.beginPath();ctx.ellipse(sx,sy,3+(k%3),5,0,0,Math.PI*2);ctx.fill();
   }
   ctx.restore();
   // fine spray drifting sideways
   for(let k=0;k<10;k++){
     const phase=(waterTime/22+k*31+f.phase*50)%90;
     const sx=f.x+f.w/2+Math.sin(k*4+waterTime/330)*f.w*.65;
     const sy=f.y+f.h-8-phase*.55;
     ctx.fillStyle="rgba(204,229,255,"+(0.12+(1-phase/90)*.3)+")";
     ctx.beginPath();ctx.arc(sx,sy,1.2+(k%3)*.45,0,Math.PI*2);ctx.fill();
   }
 }
 // Surface ripples travel continuously across the pool.
 for(let i=0;i<34;i++){
   const x=(i*79-waterTime*.075*(1+i%3*.22)+1280)%1280;
   const y=565+(i*37)%145;
   const pulse=(waterTime/90+i*13)%26;
   ctx.strokeStyle="rgba(190,218,255,"+(0.16+(1-pulse/26)*.35)+")";
   ctx.lineWidth=1+(i%2);
   ctx.beginPath();ctx.ellipse(x,y,7+pulse*.7,1.5+pulse*.09,0,0,Math.PI*2);ctx.stroke();
 }
 // low drifting waterfall mist
 ctx.save();ctx.globalAlpha=.14;
 for(let i=0;i<9;i++){
   const x=(i*151+waterTime*.012)%1380-50,y=500+(i*19)%60;
   const mg=ctx.createRadialGradient(x,y,2,x,y,48);
   mg.addColorStop(0,"#d8e9ff");mg.addColorStop(1,"#d8e9ff00");
   ctx.fillStyle=mg;ctx.beginPath();ctx.arc(x,y,48,0,Math.PI*2);ctx.fill();
 }
 ctx.restore();
 // stone walkway foreground
 ctx.fillStyle="#24253f";ctx.fillRect(0,540,1280,180);
 ctx.fillStyle="#8e83a8";ctx.fillRect(0,536,1280,14);
 for(let x=0;x<1280;x+=78){ctx.fillStyle=x%2?"#5d587b":"#70698d";ctx.fillRect(x,550,73,26);ctx.strokeStyle="#a69abb";ctx.lineWidth=2;ctx.strokeRect(x,550,73,26)}
 // foreground blossoms and lanterns
 for(const x of [190,430,920,1110]){ctx.fillStyle="#28213f";ctx.fillRect(x,410,10,100);ctx.fillStyle="#e9b77e";ctx.shadowColor="#ffc98e";ctx.shadowBlur=22;ctx.fillRect(x-13,395,36,42);ctx.shadowBlur=0;ctx.strokeStyle="#8e6b9b";ctx.strokeRect(x-13,395,36,42)}
 // floating petals
 for(let i=0;i<18;i++){let x=(i*113+performance.now()*.018*(i%2?1:-1)+1280)%1280,y=350+(i*47)%180;ctx.save();ctx.translate(x,y);ctx.rotate(performance.now()/900+i);ctx.fillStyle="#e4b9ffbb";ctx.beginPath();ctx.ellipse(0,0,4,8,.5,0,Math.PI*2);ctx.fill();ctx.restore()}
}
function drawEnemy(){
 const now=performance.now();
 for(const e of enemies){
  if(!e.alive)continue;
  const boss=!!e.boss, brute=e.type==="brute", archer=e.type==="archer";
  const scale=boss?1.48:brute?1.18:archer?0.96:1;
  const bob=Math.sin(now/(boss?230:175)+(e.x*.01))* (boss?2.5:4);
  const stride=Math.sin(now/145+e.x*.02)*5;
  const hitFlash=e.hit>22;
  // Ground telegraphs: readable warning language before heavy attacks land.
  if(e.boss && e.telegraph>0){
   const charge=1+Math.sin(now/48)*.12;
   ctx.save();ctx.translate(e.x,535);ctx.globalAlpha=.32+.24*Math.sin(now/65);
   ctx.strokeStyle=e.phase===2?"#ff65d9":"#c98bff";ctx.lineWidth=3;
   ctx.beginPath();ctx.ellipse(0,0,78*charge,18*charge,0,0,Math.PI*2);ctx.stroke();
   ctx.setLineDash([8,7]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo((player.x-e.x)*.42,-5);ctx.stroke();ctx.setLineDash([]);
   for(let k=0;k<5;k++){const a=now/260+k*Math.PI*2/5;ctx.fillStyle=e.phase===2?"#ffb2ed":"#e3c4ff";ctx.beginPath();ctx.arc(Math.cos(a)*52,Math.sin(a)*11,3,0,Math.PI*2);ctx.fill();}
   ctx.restore();
  }
  if(e.slam>0){
   const p=1-e.slam/34;ctx.save();ctx.translate(e.x,535);ctx.globalAlpha=.55*(1-p*.45);ctx.strokeStyle="#ffb36e";ctx.lineWidth=4;
   ctx.beginPath();ctx.ellipse(0,0,30+p*150,8+p*24,0,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
  ctx.save();ctx.translate(e.x,515-bob);ctx.scale(e.dir*scale,scale);
  // ground shadow and animated footfalls
  ctx.fillStyle="#08061299";ctx.beginPath();ctx.ellipse(0,7,39,9,0,0,Math.PI*2);ctx.fill();
  if(e.slam>0){
    ctx.save();ctx.globalAlpha=.25+.25*Math.sin(now/55);ctx.strokeStyle="#e6a8ff";ctx.lineWidth=5;ctx.shadowColor="#b75cff";ctx.shadowBlur=18;
    ctx.beginPath();ctx.ellipse(0,5,42+(34-e.slam)*3,10,0,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
  if(e.lunge>0){
    ctx.save();ctx.globalAlpha=.5;ctx.strokeStyle="#d9a0ff";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-e.dir*38,-90);ctx.lineTo(-e.dir*68,-90);ctx.stroke();ctx.restore();
  }
  // legs and wrapped boots
  ctx.lineCap="round";ctx.strokeStyle=boss?"#21122f":"#151321";ctx.lineWidth=15;
  ctx.beginPath();ctx.moveTo(-10,-43);ctx.lineTo(-17+stride,-8);ctx.moveTo(11,-43);ctx.lineTo(20-stride,-8);ctx.stroke();
  ctx.strokeStyle="#76628c";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-19+stride,-12);ctx.lineTo(-31+stride,-4);ctx.moveTo(18-stride,-12);ctx.lineTo(31-stride,-4);ctx.stroke();
  // layered tunic / robe silhouette
  if(hitFlash){ctx.globalAlpha=.75;ctx.fillStyle="#f5d8ff";ctx.shadowColor="#e7aaff";ctx.shadowBlur=24;ctx.beginPath();ctx.ellipse(0,-94,42,82,0,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1;}
  const robe=hitFlash?"#f4d6ff":boss?"#452054":brute?"#35253f":archer?"#202a43":"#1b1729";
  ctx.fillStyle=robe;ctx.beginPath();ctx.moveTo(-18,-105);ctx.lineTo(18,-105);ctx.lineTo(30,-49);ctx.lineTo(19,-42);ctx.lineTo(0,-57);ctx.lineTo(-20,-42);ctx.lineTo(-31,-49);ctx.closePath();ctx.fill();
  ctx.fillStyle=boss?"#7c3b91":"#342943";ctx.beginPath();ctx.moveTo(-17,-98);ctx.lineTo(0,-80);ctx.lineTo(18,-98);ctx.lineTo(12,-55);ctx.lineTo(-12,-55);ctx.closePath();ctx.fill();
  // Enemy-specific armour silhouettes: scout wraps, archer mantle/quiver, brute plated pauldrons.
  if(brute){
    ctx.fillStyle="#55415f";ctx.strokeStyle="#b18ac5";ctx.lineWidth=2;
    for(const side of [-1,1]){
      ctx.beginPath();ctx.moveTo(side*14,-103);ctx.lineTo(side*35,-112);ctx.lineTo(side*46,-94);ctx.lineTo(side*31,-80);ctx.lineTo(side*15,-87);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle="#d2a6e8";ctx.beginPath();ctx.moveTo(side*34,-110);ctx.lineTo(side*43,-126);ctx.lineTo(side*42,-104);ctx.closePath();ctx.fill();
      ctx.fillStyle="#55415f";
    }
    ctx.fillStyle="#201628";ctx.fillRect(-19,-54,38,10);
    ctx.strokeStyle="#9c7cae";ctx.lineWidth=2;ctx.strokeRect(-19,-54,38,10);
  }else if(archer){
    ctx.fillStyle="#28334e";ctx.beginPath();ctx.moveTo(-22,-104);ctx.lineTo(-38,-91);ctx.lineTo(-27,-65);ctx.lineTo(-12,-78);ctx.closePath();ctx.fill();
    ctx.strokeStyle="#8da5ca";ctx.lineWidth=2;ctx.stroke();
    // visible quiver and arrow fletching
    ctx.save();ctx.translate(-27,-105);ctx.rotate(-.28);
    ctx.fillStyle="#171326";ctx.fillRect(-5,-18,11,42);
    for(let q=0;q<3;q++){ctx.strokeStyle="#d5c6e8";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-2+q*4,-20);ctx.lineTo(-5+q*4,-30);ctx.stroke();}
    ctx.restore();
  }else if(!boss){
    ctx.strokeStyle="#765d8c";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-18,-99);ctx.lineTo(-35,-83);ctx.lineTo(-28,-60);ctx.stroke();
    ctx.fillStyle="#a58ab9";ctx.fillRect(-24,-73,8,3);
  }
  // Tsukiko's layered phantom mantle and long flowing hair silhouette.
  if(boss){
    ctx.save();
    ctx.strokeStyle="#24102f";ctx.lineCap="round";ctx.lineWidth=12;
    for(let k=0;k<7;k++){
      const sway=Math.sin(now/310+k*.7)*7;
      ctx.beginPath();ctx.moveTo(-13+k*4,-133);
      ctx.bezierCurveTo(-42-k*3,-116+sway,-35-k*5,-55+sway, -58-k*3,-30+sway);
      ctx.stroke();
    }
    ctx.strokeStyle="#8f4aa8";ctx.lineWidth=2.2;
    for(let k=0;k<5;k++){
      const sway=Math.sin(now/310+k*.7)*7;
      ctx.beginPath();ctx.moveTo(-13+k*4,-133);
      ctx.bezierCurveTo(-42-k*3,-116+sway,-35-k*5,-55+sway,-58-k*3,-30+sway);ctx.stroke();
    }
    // broad ceremonial sleeves with luminous violet piping
    for(const side of [-1,1]){
      ctx.fillStyle="#29152f";ctx.strokeStyle="#a66bc0";ctx.lineWidth=2.5;
      ctx.beginPath();ctx.moveTo(side*17,-101);ctx.lineTo(side*42,-108);ctx.lineTo(side*57,-78);ctx.lineTo(side*37,-61);ctx.lineTo(side*18,-78);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle="#d5a0ed";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(side*40,-101);ctx.lineTo(side*52,-80);ctx.stroke();
    }
    ctx.restore();
  }
  // chest sash and belt
  ctx.fillStyle=boss?"#d79bea":"#78618f";ctx.fillRect(-23,-76,46,7);
  ctx.fillStyle="#171326";ctx.fillRect(-8,-77,16,9);
  // shoulders and animated arms
  ctx.strokeStyle=robe;ctx.lineWidth=13;ctx.beginPath();ctx.moveTo(-16,-96);ctx.lineTo(-32,-69+Math.sin(now/190+e.x)*3);ctx.moveTo(16,-96);ctx.lineTo(30,-72-Math.sin(now/190+e.x)*3);ctx.stroke();
  // hood/head, boss has a taller ornate crown silhouette
  ctx.fillStyle=boss?"#21152f":"#0d0b18";ctx.beginPath();ctx.ellipse(0,-119,boss?27:23,boss?31:26,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=boss?"#59306c":"#171326";ctx.beginPath();ctx.moveTo(-25,-122);ctx.quadraticCurveTo(-30,-160,0,boss?-164:-153);ctx.quadraticCurveTo(30,-160,25,-122);ctx.closePath();ctx.fill();
  if(boss){
   ctx.strokeStyle="#d49ae9";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-18,-145);ctx.lineTo(-28,-174);ctx.lineTo(-4,-157);ctx.lineTo(8,-181);ctx.lineTo(23,-151);ctx.stroke();
   ctx.fillStyle="#f4c6ff";ctx.beginPath();ctx.arc(0,-151,4,0,Math.PI*2);ctx.fill();
   // crown gem and ornamental side pins distinguish Tsukiko from regular enemies.
   ctx.fillStyle="#f6c9ff";ctx.shadowColor="#c45aff";ctx.shadowBlur=16;
   ctx.beginPath();ctx.moveTo(0,-177);ctx.lineTo(7,-166);ctx.lineTo(0,-157);ctx.lineTo(-7,-166);ctx.closePath();ctx.fill();ctx.shadowBlur=0;
   ctx.strokeStyle="#d5a0ed";ctx.lineWidth=2;
   for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(side*19,-145);ctx.lineTo(side*31,-153);ctx.lineTo(side*35,-139);ctx.stroke();}
  }else{
   ctx.fillStyle="#090812";ctx.beginPath();ctx.moveTo(-23,-125);ctx.lineTo(-34,-145);ctx.lineTo(-8,-137);ctx.lineTo(0,-153);ctx.lineTo(8,-137);ctx.lineTo(34,-145);ctx.lineTo(23,-125);ctx.closePath();ctx.fill();
  }
  // glowing eyes and mask detail
  ctx.fillStyle=boss?"#ff8cff":"#d8a3ff";ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=12;
  ctx.beginPath();ctx.ellipse(8,-119,5,2.5,.12,0,Math.PI*2);ctx.ellipse(-8,-119,5,2.5,-.12,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  ctx.strokeStyle=boss?"#c78adf":"#665078";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-12,-108);ctx.lineTo(0,-104);ctx.lineTo(12,-108);ctx.stroke();
  // Enemy-specific chest insignia and armour rivets.
  if(!boss){
    ctx.fillStyle=brute?"#e3b5f2":archer?"#9ab8e8":"#c7a3dc";
    ctx.beginPath();ctx.moveTo(0,-99);ctx.lineTo(7,-91);ctx.lineTo(0,-82);ctx.lineTo(-7,-91);ctx.closePath();ctx.fill();
    ctx.fillStyle="#e9d8f4";
    for(const side of [-1,1]){ctx.beginPath();ctx.arc(side*24,-96,2,0,Math.PI*2);ctx.fill();}
  }
  // weapons: scout/brute curved blade, archer bow, boss long ceremonial blade
  if(archer){
   ctx.strokeStyle="#c9b6e2";ctx.lineWidth=3;ctx.beginPath();ctx.arc(48,-91,25,-1.25,1.25);ctx.stroke();
   ctx.strokeStyle="#b7a5d1";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(40,-115);ctx.lineTo(40,-67);ctx.stroke();
  }else{
   ctx.strokeStyle=boss?"#e2c5ff":"#b7a6cb";ctx.lineWidth=boss?7:5;ctx.beginPath();ctx.moveTo(24,-71);ctx.lineTo(boss?72:55,-132);ctx.stroke();
   ctx.strokeStyle=boss?"#d36cff":"#8c6ca8";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(18,-76);ctx.lineTo(34,-63);ctx.stroke();
  }
  // Tsukiko's orbiting phantom butterflies and layered aura rings.
  if(boss){
    ctx.save();
    const phaseTwo=e.phase===2;
    // Phase two shifts Tsukiko's phantom aura toward a brighter magenta-violet.
    ctx.globalAlpha=phaseTwo?.9:.72;
    for(let k=0;k<(phaseTwo?10:6);k++){
      const a=now/520+k*Math.PI/3,rx=58+Math.sin(now/260+k)*5,ry=80;
      const bx=Math.cos(a)*rx,by=-105+Math.sin(a)*ry;
      ctx.save();ctx.translate(bx,by);ctx.rotate(a*.3);
      ctx.fillStyle=phaseTwo?(k%2?"#ff8be8":"#f7d4ff"):(k%2?"#d99aff":"#f3d6ff");
      const flap=2.5+Math.abs(Math.sin(now/(phaseTwo?48:75)+k))*3.5;
      ctx.beginPath();ctx.ellipse(-flap,-3,flap,5,-.35,0,Math.PI*2);ctx.ellipse(flap,-3,flap,5,.35,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
    ctx.strokeStyle=phaseTwo?"#ff8be8":"#d58aff";ctx.lineWidth=phaseTwo?3:2;ctx.globalAlpha=.25+.16*Math.sin(now/(phaseTwo?95:170));
    ctx.beginPath();ctx.ellipse(0,-94,(phaseTwo?70:58)+Math.sin(now/210)*5,phaseTwo?102:88,0,0,Math.PI*2);ctx.stroke();
    if(phaseTwo){
      ctx.globalAlpha=.32+.18*Math.sin(now/80);ctx.strokeStyle="#f5b4ff";ctx.lineWidth=2;
      for(let k=0;k<3;k++){ctx.beginPath();ctx.ellipse(0,-94,82+k*9,112+k*12,now/900+k*.4,0,Math.PI*2);ctx.stroke();}
    }
    ctx.restore();
  }
  // boss aura / enemy shadow wisps
  if(boss || e.telegraph>0){ctx.strokeStyle=boss?"#bd63e8":"#995bd1";ctx.lineWidth=3;ctx.globalAlpha=.65+.2*Math.sin(now/100);ctx.beginPath();ctx.ellipse(0,-94,boss?48:34,68,0,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
  ctx.restore();
  const bw=boss?150:84,bx=e.x-bw/2,by=boss?322:420;
  ctx.fillStyle="#201329";ctx.fillRect(bx-2,by-2,bw+4,12);
  ctx.fillStyle="#160d20";ctx.fillRect(bx,by,bw,8);
  ctx.fillStyle=boss?"#d16cff":brute?"#ff9c55":archer?"#7fb8ff":"#e85caa";
  ctx.fillRect(bx,by,bw*Math.max(0,e.hp/e.maxHp),8);
  ctx.fillStyle="#f5e8ff";ctx.fillRect(bx,by,Math.max(0,bw*(e.hp/e.maxHp)),2);
  if(boss){
    ctx.fillStyle="#ffe3ff";ctx.font="bold 17px Georgia";ctx.textAlign="center";ctx.shadowColor=e.phase===2?"#ff5bd8":"#b45bdf";ctx.shadowBlur=10;ctx.fillText(e.phase===2?"TSUKIKO · PHANTOM ASCENDANT":"TSUKIKO · WISTERIA PHANTOM",e.x,by-13);ctx.shadowBlur=0;
    if(e.telegraph>0){
      ctx.fillStyle=e.phase===2?"#ff9be8":"#d8a0ff";ctx.font="bold 11px Arial";ctx.fillText(e.phase===2?"SHADOW FAN":"WISTERIA BOLT",e.x,by-27);
    }
  }
 }
}
function drawShinobuVector(x,y){
 const moving=!!(keys.ArrowLeft||keys.ArrowRight||keys.a||keys.d||stickDir!==0);
 const running=!!keys.Shift;
 const t=performance.now()/150;
 const swing=moving?Math.sin(t)*(running?1.0:.65):Math.sin(performance.now()/520)*.10;
 const bob=moving?Math.abs(Math.sin(t))*(running?7:4):Math.sin(performance.now()/450)*2;
 ctx.save();ctx.translate(x,y-bob);ctx.scale(player.face,1);
 // soft ground shadow
 ctx.fillStyle="#09081688";ctx.beginPath();ctx.ellipse(0,8,42,10,0,0,Math.PI*2);ctx.fill();
 // animated legs
 ctx.strokeStyle="#171327";ctx.lineWidth=17;ctx.lineCap="round";ctx.beginPath();
 ctx.moveTo(-10,-48);ctx.lineTo(-18+swing*17,-8);
 ctx.moveTo(12,-48);ctx.lineTo(24-swing*17,-8);ctx.stroke();
 ctx.strokeStyle="#f0d9e7";ctx.lineWidth=9;ctx.beginPath();
 ctx.moveTo(-18+swing*17,-8);ctx.lineTo(-30+swing*17,0);
 ctx.moveTo(24-swing*17,-8);ctx.lineTo(38-swing*17,0);ctx.stroke();
 // uniform torso
 ctx.fillStyle="#29213f";ctx.beginPath();ctx.moveTo(-22,-112);ctx.lineTo(22,-112);ctx.lineTo(34,-48);ctx.lineTo(-30,-48);ctx.closePath();ctx.fill();
 // subtle idle breathing and cloth sway keep the silhouette alive.
 const breath=(!moving?Math.sin(performance.now()/620)*1.8:0);
 // haori flowing behind her while moving
 ctx.fillStyle="#eee5f6";ctx.beginPath();
 ctx.moveTo(-22,-110);ctx.lineTo(-48-swing*7,-96);ctx.lineTo(-57-swing*13,-38);
 ctx.lineTo(-24,-48);ctx.lineTo(0,-85);ctx.lineTo(30,-45);ctx.lineTo(53+swing*9,-35);
 ctx.lineTo(42+swing*5,-99);ctx.lineTo(22,-112);ctx.closePath();ctx.fill();
 ctx.strokeStyle="#9c7bb7";ctx.lineWidth=2;ctx.stroke();
 ctx.strokeStyle="#8c6cae";ctx.lineWidth=1.5;
 for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(-44+k*4-swing*5,-84+k*9);ctx.lineTo(-24+k*5,-58+k*5);ctx.stroke();ctx.beginPath();ctx.moveTo(44-k*4+swing*5,-84+k*9);ctx.lineTo(24-k*5,-58+k*5);ctx.stroke()}
 // butterfly-inspired haori markings and dotted dark hem, drawn as clean vector details.
 ctx.save();ctx.globalAlpha=.82;ctx.fillStyle="#b98bd6";
 for(const [bx,by] of [[-31,-82],[29,-86],[-38,-55],[37,-52]]){
   ctx.beginPath();ctx.ellipse(bx-3,by-2,3.2,5,-.45,0,Math.PI*2);ctx.ellipse(bx+3,by-2,3.2,5,.45,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle="#8f6aaa";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(bx,by-1);ctx.lineTo(bx,by+5);ctx.stroke();
 }
 ctx.strokeStyle="#33263f";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-53,-39);ctx.quadraticCurveTo(0,-27,53,-37);ctx.stroke();
 ctx.fillStyle="#f2dffb";
 for(let k=0;k<11;k++){const hx=-48+k*9.5;ctx.beginPath();ctx.arc(hx,-38+Math.sin(k/10*Math.PI)*2,1.7,0,Math.PI*2);ctx.fill();}
 ctx.restore();
 // arms animate with walk and attack
 ctx.strokeStyle="#f3d5d3";ctx.lineWidth=12;ctx.beginPath();
 ctx.moveTo(-23,-100);ctx.lineTo(-40-swing*10,-68);
 if(player.attack>0){ctx.moveTo(23,-100);ctx.lineTo(53,-92)}else{ctx.moveTo(23,-100);ctx.lineTo(37+swing*10,-70)}
 ctx.stroke();
 // neck and face
 ctx.fillStyle="#f4d7d4";ctx.fillRect(-8,-128,16,18);ctx.beginPath();ctx.ellipse(0,-145,23,29,0,0,Math.PI*2);ctx.fill();
 // refined anime face details: violet eyes, highlights and expression
 ctx.fillStyle="#fff8ff";ctx.beginPath();ctx.ellipse(9,-146,7,4.5,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#8e4fd0";ctx.beginPath();ctx.ellipse(11,-146,3.2,4.2,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#21142f";ctx.beginPath();ctx.arc(12,-146,1.7,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(12,-148,1.2,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle="#5b315e";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(3,-152);ctx.quadraticCurveTo(10,-157,17,-152);ctx.stroke();
 ctx.strokeStyle="#c77d9d";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(9,-132);ctx.quadraticCurveTo(14,-129,18,-133);ctx.stroke();
 // hair cap and moving side locks
 ctx.fillStyle="#171326";ctx.beginPath();ctx.arc(0,-157,27,Math.PI,Math.PI*2);ctx.lineTo(25,-132);ctx.lineTo(15,-139);ctx.lineTo(8,-126);ctx.lineTo(-3,-139);ctx.lineTo(-17,-130);ctx.lineTo(-25,-139);ctx.closePath();ctx.fill();
 ctx.strokeStyle="#171326";ctx.lineWidth=8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-17,-151);ctx.quadraticCurveTo(-35,-132,-25+Math.sin(t)*3,-112);ctx.moveTo(15,-151);ctx.quadraticCurveTo(32,-132,25+Math.sin(t+1)*3,-115);ctx.stroke();
 // purple hair highlights and butterfly-patterned haori details
 ctx.strokeStyle="#76508f";ctx.lineWidth=2;ctx.beginPath();
 ctx.moveTo(-17,-165);ctx.quadraticCurveTo(-3,-179,13,-164);
 ctx.moveTo(-19,-151);ctx.quadraticCurveTo(-10,-158,-2,-155);ctx.stroke();
 ctx.fillStyle="#d6b5ef";ctx.beginPath();ctx.ellipse(-36,-73,5,9,-.5,0,Math.PI*2);ctx.ellipse(-28,-78,4,7,.5,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#8e5bbd";ctx.beginPath();ctx.moveTo(-17,-171);ctx.lineTo(-30,-194);ctx.lineTo(-3,-181);ctx.lineTo(13,-196);ctx.lineTo(22,-174);ctx.closePath();ctx.fill();
 // butterfly hair ornament
 ctx.fillStyle="#d9b7ff";let flap=Math.abs(Math.sin(performance.now()/90))*7+5;
 ctx.beginPath();ctx.ellipse(-22,-177,flap,13,-.5,0,Math.PI*2);ctx.ellipse(-8,-177,flap,13,.5,0,Math.PI*2);ctx.fill();
 // sword
 ctx.strokeStyle="#d8c7ed";ctx.lineWidth=4;ctx.beginPath();
 if(player.attack>0){let phase=(18-player.attack)/18;ctx.moveTo(28,-85);ctx.lineTo(82+Math.sin(phase*Math.PI)*20,-145+Math.cos(phase*Math.PI)*12)}
 else{ctx.moveTo(34,-75);ctx.lineTo(65,-142)}
 ctx.stroke();ctx.strokeStyle="#c58dff";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(27,-84);ctx.lineTo(41,-78);ctx.stroke();
 // animated slash arc
 if(player.attack>0){
   let phase=(18-player.attack)/18;
   const combo=((comboCount-1)%3);
   ctx.strokeStyle=combo===2?"#fff0ff":(combo===1?"#d7b4ff":"#e9d5ff");
   ctx.lineWidth=combo===2?13:10;
   ctx.shadowColor=combo===2?"#f4aaff":"#bd79ff";ctx.shadowBlur=combo===2?30:22;
   ctx.beginPath();
   if(combo===0)ctx.arc(15,-100,88,-1.1+phase*.7,.45+phase*.7);
   else if(combo===1)ctx.arc(5,-95,98,-.15+phase*.8,1.75+phase*.8);
   else ctx.arc(0,-104,112,-1.55+phase*.65,.65+phase*.65);
   ctx.stroke();ctx.shadowBlur=0;
   // secondary butterfly-like spark trail on the finisher
   if(combo===2){for(let i=0;i<5;i++){let a=phase*2.8+i*.72;let sx=Math.cos(a)*75,sy=-105+Math.sin(a)*43;ctx.fillStyle="#e9c4ff";ctx.beginPath();ctx.ellipse(sx,sy,4,8,a,0,Math.PI*2);ctx.fill();}}
 }
 // butterfly skill: orbiting, flapping particles
 if(player.attack>0){ctx.save();ctx.scale(player.face||1,1);ctx.fillStyle="#f6e7ff";ctx.font="bold 13px Georgia";ctx.textAlign="center";ctx.shadowColor="#bd79ff";ctx.shadowBlur=10;ctx.fillText(comboCount>1?`COMBO ×${comboCount}`:"SLASH",0,-225);ctx.restore();}
 if(player.magic>0){for(let i=0;i<9;i++){let a=i*Math.PI*2/9+performance.now()/260;let bx=Math.cos(a)* (55+Math.sin(performance.now()/100+i)*8),by=-105+Math.sin(a)*48;let f=Math.abs(Math.sin(performance.now()/75+i))*5+3;ctx.fillStyle=i%2?"#d9aaff":"#fff0ff";ctx.beginPath();ctx.ellipse(bx-f,by-3,f,7,a,0,Math.PI*2);ctx.ellipse(bx+f,by-3,f,7,-a,0,Math.PI*2);ctx.fill()}}
 ctx.restore();
}

const shinobuSpriteFrames={idle:[],walk:[],run:[]};
(function loadShinobuSpriteFrames(){
  for(const action of ["idle","walk","run"]){
    const count=action==="run"?7:8;
    for(let i=1;i<=count;i++){
      const img=new Image();
      img.src=`assets/Character/shinobu/${action}/${action}_${String(i).padStart(2,"0")}.png`;
      img.onload=()=>{img.dataset.ready="1"};
      shinobuSpriteFrames[action].push(img);
    }
  }
})();
function drawShinobu(x,y){
  // Match the exact case-sensitive folder names uploaded to GitHub Pages.
  // PNG locomotion frames are displayed whenever they have loaded successfully.
  const moving=!!(keys.ArrowLeft||keys.ArrowRight||keys.a||keys.d||stickDir!==0);
  const running=!!keys.Shift;
  const action=moving?(running?"run":"walk"):"idle";
  const frames=shinobuSpriteFrames[action]||[];
  const fps=action==="idle"?5:(action==="walk"?9:13);
  const idx=Math.floor(performance.now()/1000*fps)%frames.length;
  const img=frames[idx];
  const fallback=frames.find(f=>f.complete&&f.naturalWidth>0);
  const chosen=img&&img.complete&&img.naturalWidth>0?img:fallback;
  if(chosen){
    ctx.save();
    ctx.translate(x,y);
    ctx.scale(player.face||1,1);
    if(player.hurtTimer>0&&Math.floor(performance.now()/55)%2===0)ctx.globalAlpha=.45;
    ctx.drawImage(chosen,-90,-220,180,220);
    ctx.restore();
  } else {
    drawShinobuVector(x,y);
  }
  // Retain the existing attack/skill effects until matching combat PNGs are verified.
  if(player.attack>0 || player.magic>0){
    ctx.save();ctx.translate(x,y);ctx.scale(player.face||1,1);
    if(player.attack>0){
      ctx.strokeStyle="#ead0ff";ctx.lineWidth=9;ctx.shadowColor="#c579ff";ctx.shadowBlur=24;
      ctx.beginPath();ctx.arc(0,-115,105,-1.3,0.7);ctx.stroke();
    }
    if(player.magic>0){
      for(let i=0;i<7;i++){
        const a=i*Math.PI*2/7+performance.now()/260;
        ctx.fillStyle=i%2?"#d9aaff":"#fff0ff";
        ctx.beginPath();ctx.ellipse(Math.cos(a)*76,-120+Math.sin(a)*65,7,12,a,0,Math.PI*2);ctx.fill();
      }
    }
    ctx.restore();
  }
}

function frame(){
 if(!$("game").classList.contains("hidden") && $("pauseLayer").classList.contains("hidden")){
   const speed=keys.Shift?6:4;
   if(player.dash>0){player.x+=player.face*13;player.dash--;player.invulnerable=Math.max(player.invulnerable,2)}
   else {
     if(keys.ArrowLeft||keys.a||stickDir<0){player.x-=speed;player.face=-1}
     if(keys.ArrowRight||keys.d||stickDir>0){player.x+=speed;player.face=1}
   }
   if(player.dashCooldown>0)player.dashCooldown--;
   if(player.magicCooldown>0)player.magicCooldown--;
   if(player.invulnerable>0)player.invulnerable--;
   if(player.hurtTimer>0)player.hurtTimer--;
   if(player.jump>0){player.y-=player.vy;player.vy-=.55;player.jump--;if(player.y>=515){player.y=515;player.vy=0;player.jump=0}}
   player.x=Math.max(70,Math.min(WORLD_WIDTH-90,player.x));
   player.attack=Math.max(0,player.attack-1);player.magic=Math.max(0,player.magic-1);
   // Shadow Archer ranged attacks: violet bolts travel toward Shinobu.
   for(let i=shadowBolts.length-1;i>=0;i--){
     const b=shadowBolts[i];b.x+=b.vx;b.y+=b.vy;b.life--;
     if(Math.abs(b.x-player.x)<28 && Math.abs(b.y-(player.y-95))<48){
       if(player.invulnerable===0)damagePlayer(b.damage||42);
       shadowBolts.splice(i,1);continue;
     }
     if(b.life<=0)shadowBolts.splice(i,1);
   }
   for(const e of enemies){
     if(!e.alive)continue;
     if(Math.abs(player.x-e.x)<(e.boss?430:310)){e.x+=Math.sign(player.x-e.x)* (e.boss?0.55:e.type==="brute"?0.45:0.8);e.dir=player.x<e.x?-1:1}
     else e.x+=e.dir*0.22;
     e.x=Math.max(600,Math.min(WORLD_WIDTH-100,e.x));
     if(e.attackCooldown>0)e.attackCooldown--;
     // Scout: short, readable lunge with a cooldown; dash can evade it.
     if(e.type==="scout" && e.lunge===0 && e.attackCooldown===0 && Math.abs(player.x-e.x)<285){
       e.lunge=18;e.attackCooldown=150;e.dir=player.x<e.x?-1:1;
     }
     if(e.lunge>0){
       e.x+=e.dir*5.2;e.lunge--;
       if(e.lunge===1 && Math.abs(player.x-e.x)<88 && player.invulnerable===0){
         damagePlayer(e.damage);lastEnemyHit=performance.now();
       }
     }
     // Brute: ground slam has a visible warning window and a wide impact radius.
     if(e.type==="brute" && e.slam===0 && e.attackCooldown===0 && Math.abs(player.x-e.x)<255){
       e.slam=34;e.attackCooldown=205;
     }
     if(e.slam>0){
       e.slam--;
       if(e.slam===1 && Math.abs(player.x-e.x)<178 && player.invulnerable===0){
         damagePlayer(e.damage);lastEnemyHit=performance.now();
       }
     }
     if(e.type==="archer" && Math.abs(player.x-e.x)<620 && Math.abs(player.x-e.x)>210 && performance.now()-lastArcherShot>2600){
       const dx=player.x-e.x,dy=(player.y-95)-420,mag=Math.max(1,Math.hypot(dx,dy));
       shadowBolts.push({x:e.x,y:420,vx:dx/mag*5.2,vy:dy/mag*5.2,life:150});
       lastArcherShot=performance.now();
       toast("Shadow Archer fires!");
     }
     if(e.boss){
       const nextPhase=e.hp<=e.maxHp*.5?2:1;
       if(e.phase!==nextPhase){e.phase=nextPhase;toast(nextPhase===2?"Tsukiko enters her second phase! Faster shadow volleys!":"");}
       if(e.bossAttackCooldown>0)e.bossAttackCooldown--;
       const range=e.phase===2?720:560;
       if(Math.abs(player.x-e.x)<range && e.telegraph===0 && e.bossAttackCooldown===0){
         e.telegraph=e.phase===2?34:46;
       }
       if(e.telegraph>0){
         e.telegraph--;
         if(e.telegraph===1){
           const dx=player.x-e.x,dy=(player.y-95)-420,mag=Math.max(1,Math.hypot(dx,dy));
           const base=Math.atan2(dy,dx),spread=e.phase===2?0.22:0.14;
           const count=e.phase===2?5:3;
           for(let n=0;n<count;n++){
             const angle=base+(n-(count-1)/2)*spread;
             const speed=e.phase===2?6.2:5.1;
             shadowBolts.push({x:e.x,y:420,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:170,damage:e.phase===2?48:38,bossBolt:true});
           }
           e.bossAttackCooldown=e.phase===2?105:155;
           toast(e.phase===2?"Tsukiko: Shadow fan!":"Tsukiko: Wisteria bolt!");
         }
       }
     }
     if(!e.boss && Math.abs(player.x-e.x)<(e.boss?85:58) && performance.now()-lastEnemyHit>1500 && player.invulnerable===0){
       damagePlayer(e.damage);lastEnemyHit=performance.now();
     }
     if(player.attack>0 && Math.abs(player.x-e.x)<(e.boss?165:125) && e.hit===0){
       e.hp-=e.boss?24:36;e.hit=30;
       if(e.hp<=0){e.alive=false;coins+=e.reward;$("coins").textContent=coins;toast(e.name+" defeated! +"+e.reward+" coins")}
     }
     if(e.hit>0)e.hit--;
   }
   if(player.x>WORLD_WIDTH-260 && enemies.every(e=>!e.alive) && !chapterComplete){chapterComplete=true;if(!rewardClaimed){coins+=150;butterflies+=3;rewardClaimed=true;$("coins").textContent=coins;$("butterflies").textContent=butterflies;}$("chapterCompleteLayer").classList.remove("hidden");saveGame(false)}
   cameraX=Math.max(0,Math.min(WORLD_WIDTH-1280,player.x-420));
   updateCombatHUD();
 }
 ctx.save();ctx.translate(-cameraX,0);
 for(let zone=0;zone<3;zone++){
   ctx.save();ctx.translate(zone*1280,0);drawBackground();
   if(zone===1){ctx.fillStyle="#182d45aa";ctx.fillRect(0,0,1280,720);ctx.fillStyle="#d6e6ff";ctx.font="bold 24px Georgia";ctx.fillText("ANCIENT GARDEN",90,115)}
   if(zone===2){ctx.fillStyle="#27143a33";ctx.fillRect(0,0,1280,720);ctx.save();ctx.translate(1000,0);ctx.shadowColor="#d58aff";ctx.shadowBlur=24;ctx.fillStyle="#4a183f";ctx.fillRect(-92,285,24,270);ctx.fillRect(68,285,24,270);ctx.fillRect(-125,270,250,22);ctx.fillRect(-145,250,290,17);ctx.fillStyle="#b65c9b";ctx.fillRect(-108,290,12,250);ctx.fillRect(78,290,12,250);ctx.fillStyle="#f1c5ff";ctx.globalAlpha=.8;ctx.fillRect(-126,246,252,5);ctx.globalAlpha=1;ctx.fillStyle="#f0caff";ctx.font="bold 18px Georgia";ctx.textAlign="center";ctx.fillText("WISTERIA GATE",0,225);ctx.restore()}
   ctx.restore();
 }
 drawEnemy();
 // Draw readable violet shadow bolts in world space.
 for(const b of shadowBolts){
   const pulse=1+Math.sin(performance.now()/55+b.x*.02)*.22;
   ctx.save();
   // Soft outer glow and tapered motion trail make projectile direction easier to read.
   ctx.globalAlpha=b.bossBolt?.82:.68;
   ctx.strokeStyle=b.bossBolt?"rgba(255,92,220,.22)":"rgba(169,76,255,.2)";
   ctx.lineWidth=b.bossBolt?15:10;ctx.lineCap="round";ctx.shadowColor=b.bossBolt?"#ff4fd8":"#a94cff";ctx.shadowBlur=22;
   ctx.beginPath();ctx.moveTo(b.x-b.vx*3.8,b.y-b.vy*3.8);ctx.lineTo(b.x,b.y);ctx.stroke();
   ctx.strokeStyle=b.bossBolt?"#ffb2f2":"#d9a0ff";ctx.lineWidth=(b.bossBolt?6:4)*pulse;
   ctx.beginPath();ctx.moveTo(b.x-14,b.y);ctx.lineTo(b.x+14,b.y);ctx.stroke();
   ctx.fillStyle="#f4e4ff";ctx.beginPath();ctx.arc(b.x,b.y,4.5*pulse,0,Math.PI*2);ctx.fill();
   if(b.bossBolt){
     for(let k=0;k<4;k++){
       const a=performance.now()/105+k*Math.PI/2;const px=b.x+Math.cos(a)*10,py=b.y+Math.sin(a)*8;
       ctx.save();ctx.translate(px,py);ctx.rotate(a);ctx.fillStyle="#ffd7fb";ctx.shadowColor="#ff70dc";ctx.shadowBlur=8;
       ctx.beginPath();ctx.moveTo(0,-3);ctx.lineTo(2,0);ctx.lineTo(0,3);ctx.lineTo(-2,0);ctx.closePath();ctx.fill();ctx.restore();
     }
     ctx.strokeStyle="#ffb8ee88";ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(b.x,b.y,11*pulse,0,Math.PI*2);ctx.stroke();
   }
   ctx.restore();
 }
 if(player.dash>0){
   ctx.save();ctx.globalAlpha=.18;ctx.fillStyle="#d6a1ff";
   for(let i=1;i<=3;i++){ctx.beginPath();ctx.ellipse(player.x-player.face*i*24,player.y-95,24,76,0,0,Math.PI*2);ctx.fill();}
   ctx.restore();
 }
 drawShinobu(player.x,player.y);
 ctx.restore();
 requestAnimationFrame(frame);
}
frame();
function actAttack(){
 if(player.attack>0)return;
 player.attack=18;
 const now=performance.now();comboCount=now-lastComboAt<900?comboCount+1:1;lastComboAt=now;
 toast(comboCount>1?`Sword combo ×${comboCount}!`:"Butterfly Dance!");
}
function actMagic(){
 if(player.magicCooldown>0)return;
 player.magic=45;player.magicCooldown=90;
 butterflies+=1;$("butterflies").textContent=butterflies;
 let hits=0;
 for(const e of enemies){
  if(e.alive&&Math.abs(player.x-e.x)<250){
   e.hp-=e.boss?55:95;hits++;
   if(e.hp<=0){e.alive=false;coins+=e.reward;$("coins").textContent=coins;toast(e.name+" defeated! +"+e.reward+" coins");saveGame(false);}
  }
 }
 toast(hits?"Butterfly Bloom hit!":"Butterfly Bloom!");updateCombatHUD();
}
function jump(){if(player.y>=515){player.jump=28;player.vy=9}}
function dash(){if(player.dashCooldown===0){player.dash=10;player.dashCooldown=75;player.invulnerable=12;toast("Butterfly Step!");updateCombatHUD()}}
$("attackBtn").onpointerdown=e=>{e.preventDefault();actAttack()};
$("magicBtn").onpointerdown=e=>{e.preventDefault();actMagic()};
$("jumpBtn").onpointerdown=e=>{e.preventDefault();jump()};
$("dashBtn").onpointerdown=e=>{e.preventDefault();dash()};
window.addEventListener("keydown",e=>{keys[e.key]=true;if(e.key===" "){jump()}if(e.key==="j")actAttack();if(e.key==="k")actMagic();if(e.key==="l")dash()});
window.addEventListener("keyup",e=>keys[e.key]=false);
const stick=$("stick");let startX=null;
stick.onpointerdown=e=>{startX=e.clientX;stick.setPointerCapture(e.pointerId)};
stick.onpointermove=e=>{if(startX!==null){let dx=e.clientX-startX;stickDir=dx>10?1:dx< -10?-1:0;stick.querySelector("span").style.transform=`translateX(${Math.max(-28,Math.min(28,dx/2))}px)`}};
stick.onpointerup=stick.onpointercancel=()=>{startX=null;stickDir=0;stick.querySelector("span").style.transform=""};

$("chapterContinue").onclick=()=>{$("chapterCompleteLayer").classList.add("hidden");show("menu");toast("Chapter 1 completed. Rewards saved.")};
$("chapterReplay").onclick=()=>{$("chapterCompleteLayer").classList.add("hidden");player.x=260;player.hp=1200;cameraX=0;chapterComplete=false;shadowBolts=[];enemies.forEach((e,i)=>{e.alive=true;e.hp=e.maxHp;e.hit=0;e.x=[850,1450,2150,3190][i];e.phase=1;e.telegraph=0;e.bossAttackCooldown=100});show("game");startDialogue();updateCombatHUD();saveGame(false)};
// v0.3: Fullscreen launch and keyboard escape handling
async function enterGameFullscreen(){
  try{
    const root=document.documentElement;
    if(!document.fullscreenElement && root.requestFullscreen) await root.requestFullscreen();
  }catch(e){}
  $("launchOverlay").classList.add("hidden");
  updateOrientationLayout();
}
function updateOrientationLayout(){
  const w=Math.max(window.innerWidth,document.documentElement.clientWidth||0);
  const h=Math.max(window.innerHeight,document.documentElement.clientHeight||0);
  const portrait=w<h;
  $("rotateNotice").classList.toggle("show",portrait);
  document.body.classList.toggle("portrait-mode",portrait);
}
window.addEventListener("resize",()=>{updateOrientationLayout();});
window.addEventListener("orientationchange",()=>{updateOrientationLayout();requestAnimationFrame(updateOrientationLayout);});
if(window.visualViewport){window.visualViewport.addEventListener("resize",updateOrientationLayout);}
updateOrientationLayout();
$("launchBtn").addEventListener("click",enterGameFullscreen);
$("fullscreenBtn").addEventListener("click",enterGameFullscreen);
document.addEventListener("keydown",e=>{
  if(e.key==="Escape" || e.key==="Backspace"){
    if(!$("pauseLayer").classList.contains("hidden")){$("pauseLayer").classList.add("hidden")}
    else if(!$("game").classList.contains("hidden")){$("pauseLayer").classList.remove("hidden")}
  }
});
document.addEventListener("contextmenu",e=>e.preventDefault());
document.addEventListener("touchmove",e=>e.preventDefault(),{passive:false});
window.addEventListener("resize",()=>{canvas.style.width="100%";canvas.style.height="100%"});

setInterval(()=>{if(!$("game").classList.contains("hidden") && $("pauseLayer").classList.contains("hidden"))saveGame(false)},12000);

updateCombatHUD();
