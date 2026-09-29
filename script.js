const state = {
  lang: localStorage.getItem("elanLang") || "ru",
  habits: JSON.parse(localStorage.getItem("elanHabits") || "null") || [
    {name:"Morning meditation", meta:"10 min · Morning", streak:12, done:true},
    {name:"Read 20 pages", meta:"20 pages · Evening", streak:8, done:true},
    {name:"Workout", meta:"45 min · Afternoon", streak:6, done:false},
    {name:"No sugar", meta:"Daily · All day", streak:4, done:false},
    {name:"Journal", meta:"5 min · Evening", streak:16, done:true},
    {name:"Walk outside", meta:"30 min · Afternoon", streak:9, done:false}
  ]
};

const translations = {
  ru:{
    dashboard:"Обзор",calendar:"Календарь",analytics:"Аналитика",today:"СЕГОДНЯ · 29 СЕНТЯБРЯ",
    good:"Добрый вечер,",dailyRitual:"ВАШ ЕЖЕДНЕВНЫЙ РИТУАЛ",progressTitle:"Последовательность",
    heroText:"Не стремитесь к идеальности. Стремитесь к ритму, который хочется повторять.",
    done:"выполнено",currentStreak:"ТЕКУЩАЯ СЕРИЯ",bestStreak:"ЛУЧШАЯ СЕРИЯ",completion:"ВЫПОЛНЕНИЕ",rituals:"РИТУАЛОВ",
    collection:"ВАША КОЛЛЕКЦИЯ",habits:"Привычки",add:"Добавить",focus:"ФОКУС НЕДЕЛИ",focusTitle:"Берегите свои утра.",
    focusText:"Первые 60 минут задают тон всему дню. Оставьте телефон в покое и начните с себя.",
    days:"ДНЕЙ",rhythm:"РИТМ",monthly:"Сентябрь 2026",insight:"АНАЛИТИКА",analyticsTitle:"Ваш прогресс"
  },
  en:{
    dashboard:"Overview",calendar:"Calendar",analytics:"Analytics",today:"TODAY · SEPTEMBER 29",
    good:"Good evening,",dailyRitual:"YOUR DAILY RITUAL",progressTitle:"Consistency",
    heroText:"Don't chase perfection. Build a rhythm you want to repeat.",
    done:"completed",currentStreak:"CURRENT STREAK",bestStreak:"BEST STREAK",completion:"COMPLETION",rituals:"RITUALS",
    collection:"YOUR COLLECTION",habits:"Habits",add:"Add habit",focus:"WEEKLY FOCUS",focusTitle:"Protect your mornings.",
    focusText:"The first 60 minutes set the tone for the entire day. Put your phone away and begin with yourself.",
    days:"DAYS",rhythm:"RHYTHM",monthly:"September 2026",insight:"INSIGHT",analyticsTitle:"Your progress"
  }
};

const habitNames = {
  ru:["Утренняя медитация","Читать 20 страниц","Тренировка","Без сахара","Дневник","Прогулка"],
  en:["Morning meditation","Read 20 pages","Workout","No sugar","Journal","Walk outside"]
};
const habitMeta = {
  ru:["10 мин · Утро","20 страниц · Вечер","45 мин · День","Ежедневно · Весь день","5 мин · Вечер","30 мин · День"],
  en:["10 min · Morning","20 pages · Evening","45 min · Afternoon","Daily · All day","5 min · Evening","30 min · Afternoon"]
};

function applyLanguage(){
  const t=translations[state.lang];
  document.documentElement.lang=state.lang;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key=el.dataset.i18n;if(t[key])el.textContent=t[key];
  });
  renderHabits(); renderCalendar(); renderBars();
}
function renderHabits(){
  const list=document.getElementById("habitList"); list.innerHTML="";
  state.habits.forEach((h,i)=>{
    const el=document.createElement("article"); el.className="habit "+(h.done?"done":"");
    el.innerHTML=`<button class="habit-check" aria-label="toggle"></button>
      <div><div class="habit-name">${h.name}</div><div class="habit-meta">${h.meta}</div></div>
      <div class="streak"><b>${h.streak}</b>${state.lang==="ru"?"дней":"days"}</div>`;
    el.querySelector(".habit-check").onclick=()=>{
      h.done=!h.done; if(h.done) h.streak++;
      localStorage.setItem("elanHabits",JSON.stringify(state.habits));
      renderHabits(); showToast(h.done?(state.lang==="ru"?"Ритуал выполнен ✦":"Ritual completed ✦"):(state.lang==="ru"?"Отмечено как невыполненное":"Marked incomplete"));
    };
    list.appendChild(el);
  });
}
function renderCalendar(){
  const cal=document.getElementById("calendar");cal.innerHTML="";
  const weeks=state.lang==="ru"?["ПН","ВТ","СР","ЧТ","ПТ","СБ","ВС"]:["MON","TUE","WED","THU","FRI","SAT","SUN"];
  weeks.forEach(x=>{const d=document.createElement("div");d.className="day week";d.textContent=x;cal.appendChild(d)});
  const first=new Date(2026,8,1).getDay(); const offset=(first+6)%7; const total=30;
  for(let i=0;i<offset;i++){const d=document.createElement("div");d.className="day";cal.appendChild(d)}
  for(let n=1;n<=total;n++){
    const d=document.createElement("div");d.className="day num active";d.textContent=n;
    if([1,2,3,4,7,8,9,10,11,14,15,17,18,21,22,23,24,25,28,29].includes(n))d.classList.add("done");
    if(n===29)d.classList.add("today");
    cal.appendChild(d);
  }
}
function renderBars(){
  const b=document.getElementById("bars"); b.innerHTML="";
  [52,71,63,88,78,92,68].forEach((v,i)=>{
    const w=document.createElement("div");w.className="bar-wrap";
    w.innerHTML=`<div class="bar" style="height:${v}%"></div><span class="bar-label">${["M","T","W","T","F","S","S"][i]}</span>`;
    b.appendChild(w);
  });
}
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),1800)}
document.getElementById("language").onclick=()=>{state.lang=state.lang==="ru"?"en":"ru";localStorage.setItem("elanLang",state.lang);applyLanguage()};
document.getElementById("addHabit").onclick=()=>{
  const name=prompt(state.lang==="ru"?"Название новой привычки:":"New habit name:");
  if(!name)return;
  const h={name,meta:state.lang==="ru"?"Новая привычка · Сегодня":"New habit · Today",streak:0,done:false};
  state.habits.push(h);localStorage.setItem("elanHabits",JSON.stringify(state.habits));renderHabits();
};
document.querySelectorAll(".nav-item").forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
  const view=btn.dataset.view;
  if(view==="calendar")document.querySelector(".calendar-section").scrollIntoView({behavior:"smooth"});
  else if(view==="analytics")document.querySelector(".analytics-section").scrollIntoView({behavior:"smooth"});
  else window.scrollTo({top:0,behavior:"smooth"});
});
document.addEventListener("mousemove",e=>{
  const g=document.querySelector(".cursor-glow");g.style.left=e.clientX+"px";g.style.top=e.clientY+"px";
});
applyLanguage();
