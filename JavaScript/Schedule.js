import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { CAlert } from "./CAlert.js";
import { getStorage, ref, getDownloadURL ,uploadBytes,deleteObject} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";
import {onAuthStateChanged , signOut , getAuth } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getFirestore, collection, onSnapshot,getDocs,
    addDoc, deleteDoc, doc,setDoc,getDoc,
    query, where,
    orderBy, serverTimestamp,Timestamp,
    updateDoc , arrayUnion,deleteField} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";;
  
    var firebaseConfig = {
      apiKey: "AIzaSyAmRivIPwMwtP_dCmh4F_sgR091yoF2w9c",
      authDomain: "school-management-system-28563.firebaseapp.com",
      projectId: "school-management-system-28563",
      storageBucket: "school-management-system-28563.appspot.com",
      messagingSenderId: "870304606824",
      appId: "1:870304606824:web:3933d62e242a3b2ebe69dd",
      measurementId: "G-3EY2348R8T"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app) ;
const storage = getStorage(app);
const nextYear = new Date().getFullYear() + 1;
const myCalender = new CalendarPicker('#myCalendarWrapper', {
   // If max < min or min > max then the only available day will be today.
   min: new Date(),
   max: new Date(nextYear, 10) // NOTE: new Date(nextYear, 10) is "Sun Nov 01 nextYear"
});
onAuthStateChanged(auth, user => {
    if(user){
        let temp = user.email.split("@");
        sessionStorage.clear();
        sessionStorage.setItem("ID" , temp[0]);
        if(temp[0].slice(0,2)=="11"){
            sessionStorage.setItem("Student",true);
            sessionStorage.setItem("Student",true)
        }
        Start_UP();
    }else{
        CAlert("Error","You are not logged in , redirecting to main page");
        localStorage.clear();
        sessionStorage.clear();
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    }
});
myCalender.onValueChange((currentValue) => {
    let date = (new Date()).toLocaleDateString();
    let Sdate = currentValue.toLocaleDateString();
    let weekDay = currentValue.toDateString().split(" ")[0];
    Selected_Date.innerHTML = currentValue.toDateString();
    if(weekDay == "Sat" || weekDay == "Sun"){
        isWeekEnd()
    }else{
        if(date == Sdate){
            Todays_Classes("Today",weekDay);
        }else{
            Todays_Classes("Not",weekDay);
        }
    }
});
function isWeekEnd(){
    Classes_Cont.innerHTML = "The Day You Selected Is A WeekEnd , You Don't Have Work On WeekEnd";
    Classes_Cont.style.marginTop = "2rem";
    Classes_Cont.style.fontSize = "2rem";
}
var Schedule_Person = document.getElementById('Schedule-Person');
var Selected_Date = document.getElementById('Selected-Date');
async function Start_UP(){
    let My_ID = sessionStorage.getItem("ID");
    let St = sessionStorage.getItem("Student");
    if(St){
        const colRef = collection(db,"Student");
        const q = query(colRef,where("ID","==",parseInt(My_ID)));
        const querySnapshot = await getDocs(q);
        const MyDoc = querySnapshot.docs[0].data();
        let MyName = MyDoc["First-Name"]+" "+MyDoc["Last-Name"];
        let grade = MyDoc["Grade"];
        let tempgrade = grade.split("-")
        Schedule_Person.innerHTML = "Schedule For " +MyName+" ,</br> Grade "+tempgrade[0]+" Section "+tempgrade[1]+" Student" ;
        sessionStorage.setItem("Grade",grade)
        const colRef2 = collection(db,"Courses");
        const q2 = query(colRef2,where("Participants","==",grade));
        const querySnapshot2 = await getDocs(q2);
        let Courses = [] ;
        querySnapshot2.docs.forEach(doc =>{
            Courses.push({...doc.data(),DocID:doc.id});
        });
        let date = (new Date()).toDateString().split(" ")[0];
        Todays_Classes("Today",date);
    }else{
    const colRef = collection(db,"Teacher");
    const q = query(colRef,where("ID","==",parseInt(My_ID)));
    const querySnapshot = await getDocs(q);
    const MyDoc = querySnapshot.docs[0].data();
    let MyName = MyDoc["First-Name"]+" "+MyDoc["Last-Name"];
    Schedule_Person.innerHTML = "Schedule For " +MyName ;
    const colRef2 = collection(db,"Courses");
    const q2 = query(colRef2,where("Teacher-ID","==",My_ID));
    const querySnapshot2 = await getDocs(q2);
    let Courses = [] ;
    querySnapshot2.docs.forEach(doc =>{
        Courses.push({...doc.data(),DocID:doc.id});
    });
    let subject = Courses[0]["Course-Name"];
    Schedule_Person.innerHTML += " , "+subject + " Teacher";
    let date = (new Date()).toDateString().split(" ")[0];
    Todays_Classes("Today",date);
    }
};
var Classes_Cont = document.getElementById('Classes-Cont');
async function Todays_Classes(Cond,day){
    Classes_Cont.style.marginTop = "0";
    let St = sessionStorage.getItem("Student");
    if(St){
        let grade = sessionStorage.getItem("Grade")
        const colRef2 = collection(db,"Courses");
        const q2 = query(colRef2,where("Participants","==",grade));
        const querySnapshot2 = await getDocs(q2);
        let Courses = [] ;
        querySnapshot2.docs.forEach(doc =>{
            Courses.push({...doc.data(),DocID:doc.id});
        });
        
        let AccDay = GetFullDay(day);
        let TodaysClasses = [];
        for(let k = 0;k<Courses.length;k++){
            let Course = Courses[k]["Course-Name"];
            let temp = Courses[k]["Timeline"];
            for(let i = 0 ; i<temp.length ; i++){
                let day = temp[i].split("-");
                if(day[0] == AccDay){
                    let Obj = {
                        Course:Course,
                        Start:day[1],
                        End:day[2]
                    };
                    TodaysClasses.push(Obj);
                }
            }
        }
        TodaysClasses.sort(({ Start: a }, {Start: b }) => a > b ? 1 : a < b ? -1 : 0);
        if(Cond == "Today"){
            Build_Classes(TodaysClasses,"Today");
            let date = new Date() ;
            Selected_Date.innerHTML = date.toDateString();
        }else{
            Build_Classes(TodaysClasses,"Not");
        }
    }else{
    let My_ID = sessionStorage.getItem("ID");
    const colRef2 = collection(db,"Courses");
    const q2 = query(colRef2,where("Teacher-ID","==",My_ID));
    const querySnapshot2 = await getDocs(q2);
    let Courses = [] ;
    querySnapshot2.docs.forEach(doc =>{
        Courses.push({...doc.data(),DocID:doc.id});
    });
    
    let AccDay = GetFullDay(day);
    let TodaysClasses = [];
    for(let k = 0;k<Courses.length;k++){
        let Class = Courses[k]["Participants"];
        let temp = Courses[k]["Timeline"];
        for(let i = 0 ; i<temp.length ; i++){
            let day = temp[i].split("-");
            if(day[0] == AccDay){
                let Obj = {
                    Class:Class,
                    Start:day[1],
                    End:day[2]
                };
                TodaysClasses.push(Obj);
            }
        }
    }
    TodaysClasses.sort(({ Start: a }, {Start: b }) => a > b ? 1 : a < b ? -1 : 0);
    if(Cond == "Today"){
        Build_Classes(TodaysClasses,"Today");
        let date = new Date() ;
        Selected_Date.innerHTML = date.toDateString();
    }else{
        Build_Classes(TodaysClasses,"Not");
    }
}};

function Build_Classes(Classes,cond){
    Classes_Cont.innerHTML = "";
    let temp = (new Date).toLocaleTimeString().split(":");
    let time = temp[0]+":"+temp[1];
    let AfterNoon = (new Date).toLocaleTimeString().split(":");
    for(let i = 0 ; i<Classes.length ; i++){
        let Cs = document.createElement('div');
        Cs.className = "Class";
        let sp1 = document.createElement('span');
        sp1.className = "material-icons-round";
        let AorP = AfterNoon[2].split(" ");
        if(AfterNoon[0] > 7 && (AfterNoon[0] < 11 && AfterNoon[1]< 59 ) && AorP == "PM"){
            sp1.innerHTML = "check_circle";
            Cs.appendChild(sp1);
        }else if(AfterNoon[0] >= 0 && AfterNoon[0] <= 7 && AorP == "AM"){
            sp1.innerHTML = "pending";
            sp1.style.color = "orange"
            Cs.appendChild(sp1);
        }else if(cond == "Today" && Classes[i]["Start"] < time){
                sp1.innerHTML = "check_circle";
                Cs.appendChild(sp1);
        }else{
            sp1.innerHTML = "pending";
            sp1.style.color = "orange"
            Cs.appendChild(sp1);
        }
       
        let sp2 = document.createElement('span');
        sp2.innerHTML = Classes[i]["Start"]+" > "+Classes[i]["End"];
        Cs.appendChild(sp2);
        let St = sessionStorage.getItem("Student");
        let sp3 = document.createElement('span');
        if(St){
            sp3.innerHTML = Classes[i]["Course"]
        }else{
            let Cltemp = Classes[i]["Class"].split("-");
            sp3.innerHTML = "Grade "+Cltemp[0]+" Section "+Cltemp[1];
        }
        Cs.appendChild(sp3);
        Classes_Cont.appendChild(Cs);
    }
}
function GetFullDay(day){
    switch(day){
        case "Mon":
            return "Monday";
        case "Tue":
            return "Tuesday";
        case "Wed":
            return "Wednesday";
        case "Thu":
            return "Thursday";
        case "Fri":
            return "Friday";
        case "Sat":
            return "Saturday";
        case "Sun":
            return "Sunday";
        default:
            break;
    }
}