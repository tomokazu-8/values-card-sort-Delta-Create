import { useState, useRef, useCallback } from "react";

const VALUES = [
  { id:1,ja:"受容",en:"Acceptance",desc:"自分自身や他者を、あるがままに受け入れること"},
  { id:2,ja:"正確さ",en:"Accuracy",desc:"正確であること、細部まで注意を払うこと"},
  { id:3,ja:"達成",en:"Achievement",desc:"目標を成功裏に成し遂げること"},
  { id:4,ja:"冒険",en:"Adventure",desc:"新しい刺激的な経験を求めること"},
  { id:5,ja:"愛情",en:"Affection",desc:"愛情深い気持ちを示したり受け取ったりすること"},
  { id:6,ja:"野心",en:"Ambition",desc:"強く成功したい、権力を持ちたいと願うこと"},
  { id:7,ja:"自己主張",en:"Assertiveness",desc:"自分の考えや権利を自信をもって表明すること"},
  { id:8,ja:"自律",en:"Autonomy",desc:"自分で決定を下し、行動する自由"},
  { id:9,ja:"美",en:"Beauty",desc:"周囲の美しさを評価したり創造したりすること"},
  { id:10,ja:"思いやり",en:"Caring",desc:"他者の幸福に関心を持ち、サポートすること"},
  { id:11,ja:"挑戦",en:"Challenge",desc:"困難な課題に取り組む機会"},
  { id:12,ja:"変化",en:"Change",desc:"新しさ、多様性、既存のものからの移行を求めること"},
  { id:13,ja:"快適さ",en:"Comfort",desc:"身体的または精神的に楽な状態であること"},
  { id:14,ja:"献身",en:"Commitment",desc:"目的、人、あるいは行動に専念すること"},
  { id:15,ja:"共同体",en:"Community",desc:"所属する集団や地域社会と繋がり、貢献すること"},
  { id:16,ja:"共感",en:"Compassion",desc:"他者の苦痛を理解し、和らげたいと願うこと"},
  { id:17,ja:"能力",en:"Competence",desc:"特定の分野で効果的に行動できること"},
  { id:18,ja:"競争",en:"Competition",desc:"他者と対抗し、優位に立とうとすること"},
  { id:19,ja:"貢献",en:"Contribution",desc:"他者や大義のために何か役立つことをすること"},
  { id:20,ja:"協力",en:"Cooperation",desc:"他者と協力して共通の目標を達成すること"},
  { id:21,ja:"創造性",en:"Creativity",desc:"新しいアイデアや方法を生み出すこと"},
  { id:22,ja:"信頼性",en:"Dependability",desc:"頼りになり、一貫性があり、約束を守ること"},
  { id:23,ja:"尊厳",en:"Dignity",desc:"尊重され、自尊心を持つこと"},
  { id:24,ja:"義務",en:"Duty",desc:"期待されることや、必要とされることを行うこと"},
  { id:25,ja:"環境保全",en:"Ecology",desc:"自然環境と地球の健康を保護すること"},
  { id:26,ja:"平等",en:"Equality",desc:"全ての人々が同じ権利や機会を持つこと"},
  { id:27,ja:"興奮",en:"Excitement",desc:"刺激的で、活気に満ちた経験"},
  { id:28,ja:"公正さ",en:"Fairness",desc:"偏見なく、道徳的かつ正当に行動すること"},
  { id:29,ja:"信念",en:"Faith",desc:"宗教的、または精神的な信条を持つこと"},
  { id:30,ja:"家族",en:"Family",desc:"家族との関係や時間を大切にすること"},
  { id:31,ja:"柔軟性",en:"Flexibility",desc:"状況や環境の変化に容易に適応できること"},
  { id:32,ja:"許し",en:"Forgiveness",desc:"他者や自分自身の間違いを水に流すこと"},
  { id:33,ja:"自由",en:"Freedom",desc:"制限なく行動し、選択できること"},
  { id:34,ja:"友情",en:"Friendship",desc:"親しい友人との関係を築き、維持すること"},
  { id:35,ja:"楽しみ",en:"Fun",desc:"遊び心や喜びを感じる活動に従事すること"},
  { id:36,ja:"寛大さ",en:"Generosity",desc:"時間、資源、富などを惜しみなく与えること"},
  { id:37,ja:"成長",en:"Growth",desc:"精神的、個人的、スキル面での発展を追求すること"},
  { id:38,ja:"健康",en:"Health",desc:"身体的、精神的によい状態を維持すること"},
  { id:39,ja:"助けになること",en:"Helpfulness",desc:"他者のニーズをサポートし、援助を提供すること"},
  { id:40,ja:"正直さ",en:"Honesty",desc:"真実を話し、誠実に行動すること"},
  { id:41,ja:"希望",en:"Hope",desc:"良い未来を信じ、楽観的であること"},
  { id:42,ja:"謙虚さ",en:"Humility",desc:"傲慢でなく、自分の限界や他者の価値を認めること"},
  { id:43,ja:"ユーモア",en:"Humor",desc:"面白いものを見つけたり、笑いを楽しんだりすること"},
  { id:44,ja:"独立",en:"Independence",desc:"他者に頼らず、自分自身でいること"},
  { id:45,ja:"内面の平和",en:"Inner Peace",desc:"心が穏やかで、静寂であること"},
  { id:46,ja:"インスピレーション",en:"Inspiration",desc:"自分や他者をやる気にさせ、創造性を刺激すること"},
  { id:47,ja:"誠実",en:"Integrity",desc:"強い道徳的原則を持ち、それに従うこと"},
  { id:48,ja:"親密さ",en:"Intimacy",desc:"他者との深く、感情的に結びついた関係"},
  { id:49,ja:"正義",en:"Justice",desc:"道徳的権利に基づいて行動し、公平な扱いを支持すること"},
  { id:50,ja:"親切",en:"Kindness",desc:"温かく、思いやりのある態度で他者に接すること"},
  { id:51,ja:"知識",en:"Knowledge",desc:"学び、理解を深めること"},
  { id:52,ja:"指導力",en:"Leadership",desc:"他者を導き、影響を与え、方向付ける能力"},
  { id:53,ja:"愛",en:"Love",desc:"他者への深く、温かい感情的な愛着"},
  { id:54,ja:"忠誠心",en:"Loyalty",desc:"人、グループ、信念に対する献身的な支援"},
  { id:55,ja:"習熟",en:"Mastery",desc:"特定のスキルや知識において高度なレベルに達すること"},
  { id:56,ja:"意味",en:"Meaning",desc:"人生や活動に目的や重要性があると感じること"},
  { id:57,ja:"節度",en:"Moderation",desc:"極端な行動や感情を避け、バランスを保つこと"},
  { id:58,ja:"自然",en:"Nature",desc:"自然界との繋がりや、その美しさを大切にすること"},
  { id:59,ja:"秩序",en:"Order",desc:"整理され、予測可能で、規則に従っている状態"},
  { id:60,ja:"忍耐",en:"Patience",desc:"困難や遅延に冷静に対処できること"},
  { id:61,ja:"喜び",en:"Pleasure",desc:"感覚的な満足や楽しみを経験すること"},
  { id:62,ja:"権力",en:"Power",desc:"他者や状況をコントロールし、影響を与える能力"},
  { id:63,ja:"今にいること",en:"Presence",desc:"今この瞬間に意識を集中させること"},
  { id:64,ja:"プライバシー",en:"Privacy",desc:"自分自身の空間や情報をコントロールできること"},
  { id:65,ja:"思慮深さ",en:"Prudence",desc:"将来を考慮して慎重に行動すること"},
  { id:66,ja:"承認",en:"Recognition",desc:"自分の業績や価値が他者から認められること"},
  { id:67,ja:"責任",en:"Responsibility",desc:"自分の行動の結果に対して責任を負うこと"},
  { id:68,ja:"尊敬",en:"Respect",desc:"他者や自分自身を大切に思い、価値を認めること"},
  { id:69,ja:"安全",en:"Safety",desc:"危険や脅威から守られている状態"},
  { id:70,ja:"安定",en:"Security",desc:"経済的、感情的、物理的な安定性を保つこと"},
  { id:71,ja:"自制心",en:"Self-Control",desc:"自分の感情や衝動を管理し、統制できること"},
  { id:72,ja:"自己表現",en:"Self-Expression",desc:"感情、考え、個性を創造的に伝えること"},
  { id:73,ja:"官能",en:"Sensuality",desc:"五感を通じて喜びや満足を経験すること"},
  { id:74,ja:"奉仕",en:"Service",desc:"他者のニーズに応えるために行動すること"},
  { id:75,ja:"セクシュアリティ",en:"Sexuality",desc:"自分の性的なアイデンティティや関係性を尊重すること"},
  { id:76,ja:"簡素",en:"Simplicity",desc:"不必要なものを避け、生活を単純に保つこと"},
  { id:77,ja:"技能",en:"Skill",desc:"特定の作業や活動を行うための能力"},
  { id:78,ja:"孤独",en:"Solitude",desc:"邪魔されずに一人でいる時間"},
  { id:79,ja:"精神性",en:"Spirituality",desc:"人生におけるより深い、非物質的な目的を探求すること"},
  { id:80,ja:"安定性",en:"Stability",desc:"一貫性を保ち、変化に動じないこと"},
  { id:81,ja:"成功",en:"Success",desc:"目的を達成したり、社会的な地位を得たりすること"},
  { id:82,ja:"支援",en:"Support",desc:"他者に、助け・励まし・援助を提供すること"},
  { id:83,ja:"チームワーク",en:"Teamwork",desc:"協調して集団で働くこと"},
  { id:84,ja:"寛容",en:"Tolerance",desc:"自分と異なる意見や行動を受け入れること"},
  { id:85,ja:"伝統",en:"Tradition",desc:"文化や家族の習慣や信念を尊重し、維持すること"},
  { id:86,ja:"信頼",en:"Trust",desc:"他者や状況に対して確信を持つこと"},
  { id:87,ja:"真実",en:"Truth",desc:"正確で、誠実で、現実に基づいていること"},
  { id:88,ja:"理解",en:"Understanding",desc:"情報、人々、状況について深い洞察を持つこと"},
  { id:89,ja:"多様性",en:"Variety",desc:"変化に富んだ経験や選択肢を持つこと"},
  { id:90,ja:"富",en:"Wealth",desc:"経済的な豊かさ、または十分な資源を持つこと"},
  { id:91,ja:"知恵",en:"Wisdom",desc:"経験、知識、優れた判断力を使って行動すること"},
];

function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}

const CATS = {
  very:{label:"とても大切",icon:"◆",color:"#e08050"},
  somewhat:{label:"まあまあ大切",icon:"◇",color:"#c0a040"},
  not:{label:"あまり大切でない",icon:"○",color:"#6a9a80"},
};
const CAT_KEYS = ["very","somewhat","not"];

function genText(sorted, topTen){
  const d=new Date();const ds=`${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}`;
  let t="";
  t+="══════════════════════════════════\n  価値観カードソート 結果\n  "+ds+"\n══════════════════════════════════\n\n";
  if(topTen.length>0){
    t+=`★ 核心的価値観 トップ${topTen.length}（${topTen.length}個）\n──────────────────────────────────\n`;
    topTen.forEach((v,i)=>{t+=`  ${String(i+1).padStart(2," ")}. ${v.ja}（${v.en}）\n      ${v.desc}\n`;});
    const rest=sorted.very.filter(v=>!topTen.find(x=>x.id===v.id));
    if(rest.length){t+=`\n◆ とても大切（${rest.length}個）\n──────────────────────────────────\n  ${rest.map(v=>v.ja).join("、")}\n`;}
  } else {
    t+=`◆ とても大切（${sorted.very.length}個）\n──────────────────────────────────\n`;
    sorted.very.forEach((v,i)=>{t+=`  ${String(i+1).padStart(2," ")}. ${v.ja}（${v.en}）\n      ${v.desc}\n`;});
  }
  t+=`\n◇ まあまあ大切（${sorted.somewhat.length}個）\n──────────────────────────────────\n  ${sorted.somewhat.map(v=>v.ja).join("、")||"なし"}\n`;
  t+=`\n○ あまり大切でない（${sorted.not.length}個）\n──────────────────────────────────\n  ${sorted.not.map(v=>v.ja).join("、")||"なし"}\n`;
  t+="\n──────────────────────────────────\n出典: Miller, C'de Baca, Matthews &\nWilbourne (2001) Personal Values Card Sort\n";
  return t;
}

function dlImage(sorted, topTen){
  const d=new Date();const ds=`${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}`;
  const core = topTen.length>0 ? topTen : sorted.very;
  const veryRest = topTen.length>0 ? sorted.very.filter(v=>!topTen.find(x=>x.id===v.id)) : [];
  const W=1190;
  const cH=core.length*68+120;const vrH=veryRest.length?60+Math.ceil(veryRest.length/5)*32:0;
  const sH=60+Math.ceil(Math.max(sorted.somewhat.length,1)/5)*32;
  const nH=60+Math.ceil(Math.max(sorted.not.length,1)/5)*32;
  const H=Math.max(1200,320+cH+vrH+sH+nH+120);
  const c=document.createElement("canvas");c.width=W;c.height=H;
  const x=c.getContext("2d");
  const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,"#1a1a2e");g.addColorStop(0.4,"#16213e");g.addColorStop(1,"#0f3460");
  x.fillStyle=g;x.fillRect(0,0,W,H);
  x.globalAlpha=0.03;x.fillStyle="#a0c4ff";x.beginPath();x.arc(900,200,300,0,Math.PI*2);x.fill();
  x.beginPath();x.arc(200,H-300,250,0,Math.PI*2);x.fill();x.globalAlpha=1;
  let y=80;
  x.textAlign="center";x.fillStyle="#a0c4ff";x.font="300 52px sans-serif";x.fillText("価値観カードソート",W/2,y);y+=36;
  x.fillStyle="#506880";x.font="300 22px sans-serif";x.fillText("ACT Personal Values Card Sort",W/2,y);y+=28;
  x.fillStyle="#405060";x.font="300 20px sans-serif";x.fillText(ds,W/2,y);y+=50;
  x.strokeStyle="rgba(160,196,255,0.15)";x.lineWidth=1;x.beginPath();x.moveTo(80,y);x.lineTo(W-80,y);x.stroke();y+=40;
  x.textAlign="left";
  const hdr=topTen.length>0?`★ 核心的価値観 トップ${topTen.length}`:"◆ とても大切";
  x.fillStyle="#a0c4ff";x.font="bold 28px sans-serif";x.fillText(`${hdr}（${core.length}個）`,80,y);y+=16;
  core.forEach((v,i)=>{y+=42;x.fillStyle=`rgba(160,196,255,${Math.max(0.05,0.15-i*0.01)})`;x.beginPath();x.arc(110,y-8,18,0,Math.PI*2);x.fill();
    x.fillStyle="#a0c4ff";x.font="bold 18px sans-serif";x.textAlign="center";x.fillText(String(i+1),110,y-2);x.textAlign="left";
    x.fillStyle="#d0e0f0";x.font="bold 26px sans-serif";x.fillText(v.ja,145,y);const jw=x.measureText(v.ja).width;
    x.fillStyle="#4a6888";x.font="400 16px sans-serif";x.fillText(v.en,155+jw,y);y+=26;
    x.fillStyle="#7090a8";x.font="400 18px sans-serif";x.fillText(v.desc,145,y);});
  const wrap=(txt,sx,sy,mw,lh,col)=>{x.fillStyle=col;x.font="400 17px sans-serif";let ly=sy,ln="";
    for(const ch of txt){if(x.measureText(ln+ch).width>mw){x.fillText(ln,sx,ly);ly+=lh;ln=ch;}else ln+=ch;}
    if(ln){x.fillText(ln,sx,ly);ly+=lh;}return ly;};
  const sect=(lbl,items,col)=>{y+=50;x.strokeStyle="rgba(160,196,255,0.08)";x.beginPath();x.moveTo(80,y);x.lineTo(W-80,y);x.stroke();y+=32;
    x.fillStyle=col;x.font="bold 22px sans-serif";x.fillText(`${lbl}（${items.length}個）`,80,y);y+=30;
    y=wrap(items.map(v=>v.ja).join("、")||"なし",80,y,W-160,26,col+"aa");};
  if(veryRest.length) sect("◆ とても大切",veryRest,"#e08050");
  sect("◇ まあまあ大切",sorted.somewhat,"#c0a040");
  sect("○ あまり大切でない",sorted.not,"#6a9a80");
  x.textAlign="center";x.fillStyle="#304058";x.font="300 14px sans-serif";
  x.fillText("出典: Miller, C'de Baca, Matthews & Wilbourne (2001) Personal Values Card Sort",W/2,Math.max(y+60,H-40));
  const a=document.createElement("a");a.download=`価値観カードソート_${d.toISOString().slice(0,10)}.png`;a.href=c.toDataURL("image/png");
  document.body.appendChild(a);a.click();document.body.removeChild(a);
}

export default function App(){
  const [deck,setDeck]=useState(()=>shuffle(VALUES));
  const [sorted,setSorted]=useState({very:[],somewhat:[],not:[]});
  const [history,setHistory]=useState([]); // {card, cat}
  const [topTen,setTopTen]=useState([]);
  const [moveTarget,setMoveTarget]=useState(null); // {card, fromCat}
  const [copied,setCopied]=useState(false);
  const [showText,setShowText]=useState(false);
  const [showNarrow,setShowNarrow]=useState(false);
  const [expandedCat,setExpandedCat]=useState(null);

  const cur = deck[0]||null;
  const done = deck.length===0;
  const total = VALUES.length;
  const progress = total - deck.length;

  // Sort card
  const sortCard = useCallback((cat)=>{
    if(!cur) return;
    setHistory(p=>[...p,{card:cur,category:cat}]);
    setSorted(p=>({...p,[cat]:[...p[cat],cur]}));
    setDeck(p=>p.slice(1));
  },[cur]);

  // Undo
  const undo = useCallback(()=>{
    if(!history.length) return;
    const last=history[history.length-1];
    setHistory(p=>p.slice(0,-1));
    setSorted(p=>({...p,[last.category]:p[last.category].filter(c=>c.id!==last.card.id)}));
    setDeck(p=>[last.card,...p]);
  },[history]);

  // Move card between categories (only when done)
  const moveCard=(card,from,to)=>{
    if(from===to) return;
    // If moving from/to topTen
    if(from==="top"){
      setTopTen(p=>p.filter(c=>c.id!==card.id));
      if(to!=="very") setSorted(p=>({...p,[to]:[...p[to],card],very:p.very.filter(c=>c.id!==card.id)}));
    } else if(to==="top"){
      setTopTen(p=>[...p,card]);
      if(from!=="very"){
        setSorted(p=>({...p,[from]:p[from].filter(c=>c.id!==card.id),very:[...p.very,card]}));
      }
    } else {
      setSorted(p=>({...p,[from]:p[from].filter(c=>c.id!==card.id),[to]:[...p[to],card]}));
      // Also remove from topTen if it was there
      setTopTen(p=>p.filter(c=>c.id!==card.id));
    }
    setMoveTarget(null);
  };

  const toggleTopTen=(card)=>{
    setTopTen(p=>{
      if(p.find(c=>c.id===card.id)) return p.filter(c=>c.id!==card.id);
      if(p.length>=10) return p;
      return [...p,card];
    });
  };

  const restart=()=>{setDeck(shuffle(VALUES));setSorted({very:[],somewhat:[],not:[]});setHistory([]);setTopTen([]);setMoveTarget(null);setShowNarrow(false);setExpandedCat(null);};

  const handleCopy=()=>{
    const t=genText(sorted,topTen);
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(t).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);}).catch(()=>{fallbackCopy(t);});
    } else { fallbackCopy(t); }
  };
  const fallbackCopy=(text)=>{const ta=document.createElement("textarea");ta.value=text;ta.style.position="fixed";ta.style.left="-9999px";document.body.appendChild(ta);ta.select();try{document.execCommand("copy");setCopied(true);setTimeout(()=>setCopied(false),2000);}catch(e){}document.body.removeChild(ta);};

  const handleDownload=()=>{try{dlImage(sorted,topTen);}catch(e){console.error(e);}};

  // Derived
  const veryRest = sorted.very.filter(v=>!topTen.find(x=>x.id===v.id));
  const allTiers = [
    {key:"top",label:`★ トップ${topTen.length}`,items:topTen,color:"#a0c4ff",show:topTen.length>0},
    {key:"very",label:"◆ とても大切",items:topTen.length>0?veryRest:sorted.very,color:"#e08050",show:true},
    {key:"somewhat",label:"◇ まあまあ大切",items:sorted.somewhat,color:"#c0a040",show:true},
    {key:"not",label:"○ あまり大切でない",items:sorted.not,color:"#6a9a80",show:true},
  ];

  // Move targets for a card
  const getMoveTargets=(fromKey)=>{
    const all=["top","very","somewhat","not"];
    return all.filter(k=>k!==fromKey);
  };
  const tierLabel={top:"★ Top",very:"◆ 大切",somewhat:"◇ まあまあ",not:"○ あまり"};

  return(
    <div style={{fontFamily:"'Noto Sans JP','Hiragino Kaku Gothic ProN',sans-serif",minHeight:"100vh",background:"linear-gradient(160deg,#1a1a2e 0%,#16213e 40%,#0f3460 100%)",color:"#e0e0e0",padding:0,margin:0}}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet"/>

      {/* Header */}
      <div style={{textAlign:"center",padding:"14px 16px 6px"}}>
        <h1 style={{fontSize:"1.1rem",fontWeight:300,letterSpacing:"0.15em",margin:0,color:"#a0c4ff"}}>価値観カードソート</h1>
        <p style={{fontSize:"0.6rem",color:"#506880",margin:"2px 0 0"}}>ACT Personal Values Card Sort</p>
      </div>

      <div style={{padding:"0 12px",maxWidth:720,margin:"0 auto"}}>

        {/* Progress */}
        <div style={{margin:"6px 0 10px"}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.68rem",color:"#6a7a90",marginBottom:3}}>
            <span>{progress}/{total} 完了</span>
            {!done&&<span>残り {deck.length} 枚</span>}
            {done&&!showNarrow&&sorted.very.length>10&&<span style={{color:"#a0c4ff",cursor:"pointer"}} onClick={()=>setShowNarrow(true)}>トップ10を選ぶ →</span>}
            {done&&<span style={{color:"#6a9a80"}}>✓ 仕分け完了</span>}
          </div>
          <div style={{height:3,background:"#1e2d4a",borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(progress/total)*100}%`,background:done?"linear-gradient(90deg,#6a9a80,#8abca0)":"linear-gradient(90deg,#a0c4ff,#60a0dc)",borderRadius:2,transition:"width 0.35s"}}/>
          </div>
        </div>

        {/* Current card + undo */}
        {!done && (
          <div style={{marginBottom:12}}>
            {/* Undo */}
            <div style={{marginBottom:6}}>
              <button onClick={undo} disabled={!history.length}
                style={{padding:"5px 12px",borderRadius:6,background:history.length?"rgba(160,196,255,0.08)":"transparent",border:history.length?"1px solid rgba(160,196,255,0.2)":"1px solid transparent",color:history.length?"#a0c4ff":"#3a4a60",fontSize:"0.7rem",cursor:history.length?"pointer":"default"}}>
                ← 戻る
              </button>
            </div>

            {/* Card */}
            <div style={{background:"linear-gradient(135deg,#1e2d4a,#253b5c)",border:"1px solid #3a5070",borderRadius:12,padding:"20px 18px",textAlign:"center",boxShadow:"0 6px 24px rgba(0,0,0,0.3)",marginBottom:10}}>
              <div style={{fontSize:"1.4rem",fontWeight:500,color:"#e8f0ff",marginBottom:2}}>{cur.ja}</div>
              <div style={{fontSize:"0.68rem",color:"#5a7898",marginBottom:8}}>{cur.en}</div>
              <div style={{fontSize:"0.78rem",color:"#9ab0c8",lineHeight:1.5}}>{cur.desc}</div>
            </div>

            {/* Sort buttons */}
            <div style={{display:"flex",gap:6}}>
              {CAT_KEYS.map(k=>{const c=CATS[k];return(
                <button key={k} onClick={()=>sortCard(k)}
                  style={{flex:1,padding:"12px 4px",borderRadius:9,border:`1.5px solid ${c.color}40`,background:`${c.color}0a`,color:c.color,fontSize:"0.78rem",fontWeight:500,cursor:"pointer",transition:"all 0.15s"}}
                  onMouseEnter={e=>{e.target.style.background=`${c.color}20`;e.target.style.borderColor=c.color;}}
                  onMouseLeave={e=>{e.target.style.background=`${c.color}0a`;e.target.style.borderColor=`${c.color}40`;}}>
                  {c.icon} {c.label}
                </button>
              );})}
            </div>
          </div>
        )}

        {/* Narrowing panel */}
        {done && showNarrow && (
          <div style={{marginBottom:14,padding:"14px",borderRadius:10,background:"rgba(160,196,255,0.04)",border:"1px solid rgba(160,196,255,0.12)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:"0.8rem",color:"#9ab0c8"}}>
                「とても大切」から<strong style={{color:"#a0c4ff"}}>トップ10</strong>を選択
              </div>
              <div style={{fontSize:"0.72rem",color:topTen.length>=10?"#e08050":"#5a7898"}}>{topTen.length}/10</div>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {sorted.very.map(v=>{const sel=topTen.find(c=>c.id===v.id);return(
                <span key={v.id} onClick={()=>toggleTopTen(v)}
                  style={{padding:"5px 11px",borderRadius:7,border:sel?"2px solid #a0c4ff":"1px solid #2a3a5a",background:sel?"rgba(160,196,255,0.1)":"rgba(255,255,255,0.02)",
                    color:sel?"#a0c4ff":"#8a9ab0",fontSize:"0.72rem",cursor:topTen.length>=10&&!sel?"not-allowed":"pointer",opacity:topTen.length>=10&&!sel?0.35:1,transition:"all 0.15s"}}>
                  {v.ja}
                </span>
              );})}
            </div>
            <div style={{textAlign:"right",marginTop:8}}>
              <button onClick={()=>setShowNarrow(false)} style={{padding:"5px 14px",borderRadius:6,background:"rgba(160,196,255,0.08)",border:"1px solid rgba(160,196,255,0.2)",color:"#a0c4ff",fontSize:"0.7rem",cursor:"pointer"}}>
                閉じる
              </button>
            </div>
          </div>
        )}

        {/* Category sections - always visible */}
        <div style={{marginTop:4}}>
          {allTiers.filter(t=>t.show).map(tier=>{
            const isExpanded = expandedCat===tier.key;
            const canEdit = done;
            return(
              <div key={tier.key} style={{marginBottom:8,borderRadius:10,border:`1px solid ${tier.color}20`,background:tier.items.length?`${tier.color}06`:"rgba(255,255,255,0.01)",overflow:"hidden",transition:"all 0.2s"}}>
                {/* Section header */}
                <div onClick={()=>setExpandedCat(isExpanded?null:tier.key)}
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",cursor:"pointer",userSelect:"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:"0.75rem",color:tier.color,fontWeight:500}}>{tier.label}</span>
                    <span style={{fontSize:"0.65rem",color:`${tier.color}88`,background:`${tier.color}15`,padding:"1px 7px",borderRadius:10}}>{tier.items.length}</span>
                  </div>
                  <span style={{fontSize:"0.6rem",color:"#4a5a70",transform:isExpanded?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s"}}>▼</span>
                </div>

                {/* Collapsed: mini tag preview */}
                {!isExpanded && tier.items.length>0 && (
                  <div style={{padding:"0 14px 10px",display:"flex",flexWrap:"wrap",gap:3}}>
                    {tier.items.slice(0,20).map(v=>(
                      <span key={v.id} style={{padding:"2px 7px",borderRadius:4,background:`${tier.color}10`,color:`${tier.color}cc`,fontSize:"0.6rem"}}>{v.ja}</span>
                    ))}
                    {tier.items.length>20&&<span style={{fontSize:"0.6rem",color:"#4a5a70"}}>+{tier.items.length-20}</span>}
                  </div>
                )}

                {/* Expanded: full list with move */}
                {isExpanded && (
                  <div style={{padding:"0 14px 12px"}}>
                    {tier.items.length===0&&<div style={{fontSize:"0.68rem",color:"#3a4a60",padding:"4px 0"}}>カードがありません</div>}
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                      {tier.items.map(v=>{
                        const isSelected = moveTarget?.card.id===v.id && moveTarget?.fromCat===tier.key;
                        return(
                          <div key={v.id} style={{position:"relative"}}>
                            <span
                              onClick={()=>{if(!canEdit) return; setMoveTarget(isSelected?null:{card:v,fromCat:tier.key});}}
                              style={{display:"inline-block",padding:"4px 10px",borderRadius:6,
                                background:isSelected?`${tier.color}35`:`${tier.color}12`,
                                border:`1px solid ${isSelected?tier.color:tier.color+"25"}`,
                                color:tier.color,fontSize:"0.7rem",
                                cursor:canEdit?"pointer":"default",transition:"all 0.15s"}}>
                              {v.ja}
                              {canEdit&&<span style={{marginLeft:4,fontSize:"0.55rem",opacity:0.5}}>↕</span>}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    {/* Move menu */}
                    {canEdit && moveTarget && moveTarget.fromCat===tier.key && (
                      <div style={{marginTop:8,padding:"8px 10px",borderRadius:8,background:"rgba(10,18,38,0.9)",border:"1px solid rgba(160,196,255,0.15)"}}>
                        <div style={{fontSize:"0.68rem",color:"#8a9ab0",marginBottom:6}}>
                          「{moveTarget.card.ja}」→
                        </div>
                        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                          {getMoveTargets(tier.key).map(k=>(
                            <button key={k} onClick={()=>moveCard(moveTarget.card,tier.key,k)}
                              style={{padding:"4px 11px",borderRadius:6,background:`${CATS[k]?.color||"#a0c4ff"}18`,border:`1px solid ${CATS[k]?.color||"#a0c4ff"}40`,color:CATS[k]?.color||"#a0c4ff",fontSize:"0.68rem",cursor:"pointer"}}>
                              {tierLabel[k]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {!canEdit && tier.items.length>0 && (
                      <div style={{marginTop:6,fontSize:"0.6rem",color:"#3a4a60",fontStyle:"italic"}}>
                        全カードの仕分け後に編集できます
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Save section - show when done */}
        {done && (
          <div style={{marginTop:16,padding:"16px 14px",borderRadius:10,background:"rgba(160,196,255,0.04)",border:"1px solid rgba(160,196,255,0.1)"}}>
            <div style={{fontSize:"0.76rem",color:"#8a9ab0",marginBottom:12,textAlign:"center",fontWeight:500}}>結果を保存</div>
            <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={handleDownload}
                style={{display:"flex",alignItems:"center",gap:6,padding:"10px 20px",borderRadius:8,background:"linear-gradient(135deg,#a0c4ff,#6090cc)",color:"#0f1a2e",border:"none",fontSize:"0.8rem",fontWeight:500,cursor:"pointer"}}>
                📄 画像で保存
              </button>
              <button onClick={handleCopy}
                style={{display:"flex",alignItems:"center",gap:6,padding:"10px 20px",borderRadius:8,
                  background:copied?"rgba(106,154,128,0.3)":"rgba(160,196,255,0.1)",
                  color:copied?"#8abca0":"#a0c4ff",
                  border:`1px solid ${copied?"#6a9a80":"rgba(160,196,255,0.25)"}`,
                  fontSize:"0.8rem",fontWeight:500,cursor:"pointer",transition:"all 0.3s",minWidth:155}}>
                {copied?"✓ コピー完了":"📋 テキストコピー"}
              </button>
            </div>
            <div style={{textAlign:"center",marginTop:8}}>
              <button onClick={()=>setShowText(!showText)}
                style={{background:"none",border:"none",color:"#5a7090",fontSize:"0.68rem",cursor:"pointer",textDecoration:"underline",textUnderlineOffset:3}}>
                {showText?"閉じる":"テキストプレビュー"}
              </button>
            </div>
            {showText&&(
              <pre style={{marginTop:8,background:"rgba(10,15,30,0.6)",border:"1px solid rgba(160,196,255,0.1)",borderRadius:8,padding:"12px",fontSize:"0.6rem",color:"#8a9ab0",lineHeight:1.5,whiteSpace:"pre-wrap",wordBreak:"break-all",maxHeight:260,overflowY:"auto",fontFamily:"'Noto Sans JP',monospace",userSelect:"all"}}>
                {genText(sorted,topTen)}
              </pre>
            )}
          </div>
        )}

        {/* Bottom actions */}
        {done && (
          <div style={{textAlign:"center",marginTop:14,marginBottom:20}}>
            <button onClick={restart}
              style={{padding:"9px 24px",borderRadius:8,background:"transparent",border:"1px solid #2a3a5a",color:"#6a8098",fontSize:"0.78rem",cursor:"pointer"}}>
              最初からやり直す
            </button>
          </div>
        )}

        <div style={{textAlign:"center",padding:"12px 0 20px",fontSize:"0.55rem",color:"#2a3a50"}}>
          出典: Miller, C'de Baca, Matthews & Wilbourne (2001) Personal Values Card Sort
        </div>
      </div>
    </div>
  );
}
