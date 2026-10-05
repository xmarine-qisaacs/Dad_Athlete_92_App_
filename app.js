
const START = new Date("2026-10-01T00:00:00");
const END = new Date("2026-12-31T00:00:00");
const STORAGE_KEY = "dadAthlete92State";

const workouts = {
  "PUSH A":[
    {name:"Barbell bench press",foundation:"3 × 6–8",build:"4 × 6–8",athlete:"3 × 5–8",rest:"120 sec"},
    {name:"Incline dumbbell press, about 30°",foundation:"3 × 8–10",build:"3 × 8–12",athlete:"3 × 8–10",rest:"90 sec"},
    {name:"Seated dumbbell shoulder press",foundation:"2 × 8–10",build:"3 × 8–10",athlete:"3 × 6–10",rest:"90 sec"},
    {name:"Assisted dips",foundation:"2 × 8–12",build:"2 × 8–12",athlete:"2 × 8–12",rest:"75 sec"},
    {name:"Dumbbell lateral raise",foundation:"2 × 12–15",build:"3 × 12–20",athlete:"3 × 12–20",rest:"45 sec"},
    {name:"Skull crushers",foundation:"2 × 10–12",build:"3 × 10–12",athlete:"2 × 10–15",rest:"60 sec"}
  ],
  "PULL A":[
    {name:"Romanian deadlift",foundation:"3 × 6–8",build:"4 × 6–8",athlete:"3 × 5–8",rest:"120 sec"},
    {name:"Assisted pull-up",foundation:"3 × 6–10",build:"3 × 6–10",athlete:"3 × 6–10",rest:"90 sec"},
    {name:"Chest-supported row",foundation:"3 × 8–10",build:"3 × 8–12",athlete:"3 × 8–10",rest:"90 sec"},
    {name:"Lat pulldown",foundation:"2 × 10–12",build:"3 × 8–12",athlete:"2 × 10–12",rest:"60 sec"},
    {name:"Incline bench EZ-bar or barbell curl",foundation:"2 × 10–12",build:"3 × 8–12",athlete:"2 × 10–12",rest:"60 sec"},
    {name:"Farmer carry",foundation:"3 × 30 m",build:"3 × 40 m",athlete:"4 × 30–40 m",rest:"60 sec"}
  ],
  "PUSH B":[
    {name:"Standing barbell overhead press",foundation:"3 × 6–8",build:"4 × 6–8",athlete:"3 × 5–8",rest:"120 sec"},
    {name:"Incline barbell bench press",foundation:"3 × 8–10",build:"3 × 6–10",athlete:"3 × 6–10",rest:"90 sec"},
    {name:"Flat dumbbell press",foundation:"3 × 8–12",build:"3 × 8–12",athlete:"3 × 8–10",rest:"90 sec"},
    {name:"Dumbbell fly",foundation:"2 × 12–15",build:"2 × 10–15",athlete:"2 × 10–15",rest:"60 sec"},
    {name:"Dumbbell lateral raise",foundation:"3 × 12–15",build:"3 × 12–20",athlete:"3 × 12–20",rest:"45 sec"},
    {name:"Skull crushers",foundation:"2 × 10–12",build:"3 × 10–12",athlete:"2 × 10–15",rest:"60 sec"}
  ],
  "PULL B":[
    {name:"Back squat",foundation:"3 × 6–8",build:"4 × 6–8",athlete:"3 × 5–8",rest:"120 sec"},
    {name:"Barbell row",foundation:"3 × 6–8",build:"4 × 6–8",athlete:"3 × 6–8",rest:"120 sec"},
    {name:"Bulgarian split squat",foundation:"2 × 8 each",build:"3 × 8–10 each",athlete:"2 × 8–10 each",rest:"75 sec"},
    {name:"Neutral-grip lat pulldown",foundation:"3 × 8–12",build:"3 × 8–12",athlete:"3 × 8–12",rest:"75 sec"},
    {name:"Incline bench EZ-bar or barbell curl",foundation:"2 × 10–12",build:"3 × 8–12",athlete:"2 × 10–12",rest:"60 sec"},
    {name:"Hanging leg raise",foundation:"3 × 8–12",build:"3 × 10–15",athlete:"3 × 10–15",rest:"60 sec"}
  ]
};

function phaseFor(d){
  if(d <= new Date("2026-10-25T23:59:59")) return "Foundation";
  if(d <= new Date("2026-11-29T23:59:59")) return "Build";
  return "Athlete";
}
function planFor(d){
  const day=d.getDay();
  if(day===1)return "PUSH A";
  if(day===2)return "PULL A";
  if(day===3)return "Recovery";
  if(day===4)return "PUSH B";
  if(day===5)return "PULL B";
  if(day===6)return phaseFor(d)==="Foundation"?"Zone 2":"Track / Football";
  return "Rest";
}
function subtitleFor(plan,phase){
  const map={
    "PUSH A":"Chest strength, upper chest, shoulders and triceps",
    "PULL A":"Posterior chain, back width, biceps and carries",
    "PUSH B":"Shoulders, complete chest and triceps",
    "PULL B":"Squat, back thickness, legs, biceps and abs",
    "Recovery":"20 to 30 min brisk walk plus 10 min mobility",
    "Zone 2":"20 to 25 min easy aerobic work at talk-test pace",
    "Track / Football":phase==="Build"?"4 × 60 m relaxed strides at 60 to 70%, or easy football":"6 × 60 m at 70 to 80%, or football",
    "Rest":"Full rest. Light walking only if desired."
  }; return map[plan];
}
function fmt(d){return d.toLocaleDateString("en-NZ",{weekday:"short",day:"numeric",month:"short"});}
function key(d){return d.toISOString().slice(0,10);}
function clampDate(d){if(d<START)return START;if(d>END)return END;return d;}
function programDates(){
  const out=[]; let d=new Date(START);
  while(d<=END){out.push(new Date(d));d.setDate(d.getDate()+1);}
  return out;
}
const days=programDates();

let state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"days":{},"progress":[]}');
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function getDayState(d){
  const k=key(d);
  if(!state.days[k]) state.days[k]={done:false,nutrition:false,creatine:false,sleep:false,notes:"",exercises:{}};
  return state.days[k];
}
function todayProgramDate(){return clampDate(new Date());}

let selectedDate=todayProgramDate();
let selectedWorkout="PUSH A";

function renderToday(){
  const d=selectedDate, phase=phaseFor(d), plan=planFor(d), ds=getDayState(d);
  document.getElementById("todayDate").textContent=fmt(d);
  document.getElementById("todayTitle").textContent=plan;
  document.getElementById("todaySubtitle").textContent=subtitleFor(plan,phase);
  document.getElementById("phaseBadge").textContent=phase;
  const dayNum=Math.floor((d-START)/86400000)+1;
  document.getElementById("dayCounter").textContent=`Day ${dayNum} of 92`;
  const pct=Math.round(days.filter(x=>getDayState(x).done).length/92*100);
  document.getElementById("progressPct").textContent=`${pct}% complete`;
  document.getElementById("progressBar").style.width=`${pct}%`;

  const btn=document.getElementById("completeDayBtn");
  btn.textContent=ds.done?"Day complete":"Mark day complete";
  btn.classList.toggle("done",ds.done);

  document.getElementById("nutritionCheck").checked=ds.nutrition;
  document.getElementById("creatineCheck").checked=ds.creatine;
  document.getElementById("sleepCheck").checked=ds.sleep;
  document.getElementById("dayNotes").value=ds.notes||"";

  renderWorkoutForToday(plan,phase,ds);
}
function renderWorkoutForToday(plan,phase,ds){
  const box=document.getElementById("workoutContainer");
  if(!workouts[plan]){
    box.innerHTML=`<div class="card"><h3>${plan}</h3><p class="muted">${subtitleFor(plan,phase)}</p></div>`;
    return;
  }
  const phaseKey=phase.toLowerCase();
  box.innerHTML=`<div class="card"><h3>${plan} workout</h3>`+
    workouts[plan].map((ex,i)=>{
      const es=ds.exercises[i]||{};
      return `<div class="exercise-card">
        <div class="exercise-head">
          <div>
            <div class="exercise-name">${i+1}. ${ex.name}</div>
            <div class="exercise-meta">${ex[phaseKey]} · Rest ${ex.rest}</div>
          </div>
        </div>
        <div class="log-grid">
          <input data-ex="${i}" data-field="load" type="number" step="0.5" placeholder="kg" value="${es.load??""}">
          <input data-ex="${i}" data-field="reps" type="text" placeholder="actual reps" value="${es.reps??""}">
          <input data-ex="${i}" data-field="rir" type="number" min="0" max="5" placeholder="RIR" value="${es.rir??""}">
        </div>
        <label class="exercise-done"><input data-ex="${i}" data-field="done" type="checkbox" ${es.done?"checked":""}> Exercise complete</label>
      </div>`;
    }).join("")+`</div>`;

  box.querySelectorAll("input[data-ex]").forEach(inp=>{
    inp.addEventListener("input",e=>{
      const i=e.target.dataset.ex, field=e.target.dataset.field;
      ds.exercises[i]=ds.exercises[i]||{};
      ds.exercises[i][field]=field==="done"?e.target.checked:e.target.value;
      save();
    });
    inp.addEventListener("change",e=>{
      if(e.target.dataset.field==="done"){
        const i=e.target.dataset.ex; ds.exercises[i]=ds.exercises[i]||{};
        ds.exercises[i].done=e.target.checked; save();
      }
    });
  });
}

function renderCalendar(){
  const filter=document.getElementById("planFilter").value;
  const items=days.filter(d=>filter==="all"||phaseFor(d)===filter);
  document.getElementById("calendarList").innerHTML=items.map(d=>{
    const ds=getDayState(d);
    return `<div class="day-row" data-date="${key(d)}">
      <div class="muted">${fmt(d)}</div>
      <div><strong>${planFor(d)}</strong><span class="muted">${phaseFor(d)}</span></div>
      <div class="status-dot ${ds.done?"done":""}"></div>
    </div>`;
  }).join("");
  document.querySelectorAll(".day-row").forEach(row=>row.addEventListener("click",()=>{
    selectedDate=new Date(row.dataset.date+"T00:00:00");
    showView("todayView"); renderToday();
  }));
}

function renderWorkoutReference(){
  document.getElementById("workoutTabs").innerHTML=Object.keys(workouts).map(w=>`<button class="${w===selectedWorkout?"active":""}" data-w="${w}">${w}</button>`).join("");
  const phs=["Foundation","Build","Athlete"];
  document.getElementById("workoutReference").innerHTML=
    `<div class="phase-grid">${phs.map(p=>`<div class="phase-chip">${p}</div>`).join("")}</div>`+
    workouts[selectedWorkout].map((ex,i)=>`<div class="exercise-card">
      <div class="exercise-name">${i+1}. ${ex.name}</div>
      <div class="exercise-meta">Foundation: ${ex.foundation}</div>
      <div class="exercise-meta">Build: ${ex.build}</div>
      <div class="exercise-meta">Athlete: ${ex.athlete}</div>
      <div class="exercise-meta">Rest: ${ex.rest}</div>
    </div>`).join("");
  document.querySelectorAll("#workoutTabs button").forEach(b=>b.addEventListener("click",()=>{
    selectedWorkout=b.dataset.w;renderWorkoutReference();
  }));
}

function renderProgress(){
  const log=document.getElementById("progressLog");
  if(!state.progress.length){log.innerHTML=`<p class="muted">No check-ins saved yet.</p>`;return;}
  log.innerHTML=state.progress.slice().reverse().map(x=>`<div class="log-entry">
    <strong>${x.date}</strong> · ${x.weight?x.weight+" kg":""} ${x.waist?"· "+x.waist+" in waist":""}
  </div>`).join("");
}
function showView(id){
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===id));
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===id));
  if(id==="planView")renderCalendar();
  if(id==="workoutsView")renderWorkoutReference();
  if(id==="progressView")renderProgress();
}

document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
document.getElementById("completeDayBtn").addEventListener("click",()=>{
  const ds=getDayState(selectedDate); ds.done=!ds.done;save();renderToday();
});
["nutritionCheck","creatineCheck","sleepCheck"].forEach(id=>{
  document.getElementById(id).addEventListener("change",e=>{
    const ds=getDayState(selectedDate);
    ds[id==="nutritionCheck"?"nutrition":id==="creatineCheck"?"creatine":"sleep"]=e.target.checked;
    save();
  });
});
document.getElementById("dayNotes").addEventListener("input",e=>{getDayState(selectedDate).notes=e.target.value;save();});
document.getElementById("planFilter").addEventListener("change",renderCalendar);
document.getElementById("saveProgressBtn").addEventListener("click",()=>{
  const weight=document.getElementById("weightInput").value;
  const waist=document.getElementById("waistInput").value;
  if(!weight && !waist)return;
  state.progress.push({date:new Date().toLocaleDateString("en-NZ"),weight,waist});
  document.getElementById("weightInput").value="";
  document.getElementById("waistInput").value="";
  save();renderProgress();
});

renderToday();
renderWorkoutReference();

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("service-worker.js").catch(()=>{}));
}


window.addEventListener("load",()=>{
  setTimeout(()=>{
    const splash=document.getElementById("launchScreen");
    if(splash) splash.classList.add("hide");
  },650);
});
