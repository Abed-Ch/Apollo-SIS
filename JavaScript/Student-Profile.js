import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { CAlert } from "./CAlert.js";
import { getStorage, ref, getDownloadURL ,uploadBytes} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";
import {onAuthStateChanged , signOut , getAuth } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    updateDoc , arrayUnion} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";;
  
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
let main = document.getElementsByTagName('main')[0];

onAuthStateChanged(auth,(user)=>{
    if(user){
        let temp = user.email.split("@");
        if(temp[0].slice(0,2)=="11"){
            CAlert("Error","You Are Not A Teacher, Redirecting...");
            setTimeout(() => {
                window.location.href = "Tmain.html"
            }, 2000);
        }
        StartUp(temp[0]);
        sessionStorage.setItem("My_ID",temp[0])
    }else{
        CAlert("Warning","You Are Not Logged In , Redirecting",5000);
        sessionStorage.clear();
        localStorage.clear();
        setTimeout(() => {
            Redirect();
        }, 3000);
    };
});
function Redirect(){
    window.location.href = 'index.html';
}
function StartUp(id){
    const colRef = collection(db, "Courses");
    const  q = query(colRef, where("Teacher-ID" , "==" , id ));
    onSnapshot(q, (snapshot) => {
    let Tasks = []
    snapshot.docs.forEach(doc => {
    Tasks.push({ ...doc.data(), id: doc.id });
    });
    main.innerHTML = "" ;
    for(let x = 0 ; x<Tasks.length;x++){
        const colRef2 = collection(db, "Student");
        let grade = Tasks[x]["Participants"];
        const  q2 = query(colRef2, where("Grade" , "==" , grade));
        onSnapshot(q2, (snapshot) => {
            let Students = [];
            snapshot.docs.forEach(doc => {
                Students.push({ ...doc.data(), id: doc.id });
            });
            for(let i = 0 ; i<Students.length ; i++){
               let outer = document.createElement('div'); 
               outer.className = "Profile-Container";
               let Details = document.createElement('div');
               Details.className  = "Details-Container"; 
               let p1 = document.createElement('p');
               p1.innerHTML = Students[i]["First-Name"]+" "+Students[i]["Last-Name"];
               let te = p1.innerHTML ;
               if(te.length > 15){
                   p1.style.fontSize = "1.5rem";
               }
               let p2 = document.createElement('p');
               let temp = Students[i]["Grade"].split("-");
               p2.innerHTML = "Grade "+temp[0]+" Section "+temp[1];
               Details.appendChild(p1);
               Details.appendChild(p2);
               outer.appendChild(Details)
               let Buttons = document.createElement('div'); 
               Buttons.className = "Button-Container";
               let BTN = document.createElement('button');
               BTN.type = "button";
               BTN.className = "View-Student-Btn";
               BTN.innerHTML = "View Profile";
               BTN.id = Students[i]["ID"];
               BTN.addEventListener("click",(e)=>{
                    Open_Student_Profile(e.target.id);
               });
               Buttons.appendChild(BTN);
               outer.appendChild(Buttons);
               main.appendChild(outer)
            }
        })
    }
})};
var U_ID = document.getElementById('User-ID');
var U_FName = document.getElementById('First-Name');
var U_LName = document.getElementById('Last-Name');
var U_Email = document.getElementById('User-Email');
var U_Birth = document.getElementById('Birth-Date');
var U_Pnumber = document.getElementById('Primary-Number');
var U_Adress = document.getElementById('Address');
function Empty_Profile_Tab(){
    U_ID.value = "";
    U_FName.value = "";
    U_LName.value = "";
    U_Email.value = "";
    U_Birth.value = "";
    U_Pnumber.value = "";
    U_Adress.value = "";
}
var account_page = document.getElementById('Account-Page');
function Open_Student_Profile(id){
    body.style.overflow = "hidden";
    const colRef = collection(db, "Student");
    const  q = query(colRef, where("ID" , "==" , parseInt(id)));
    onSnapshot(q, (snapshot) => {
    let Student = []
    snapshot.docs.forEach(doc => {
    Student.push({ ...doc.data(), id: doc.id })
    Empty_Profile_Tab();
    U_ID.value = id;
    account_page.style.display = "grid";
    main.style.opacity = "0.5";
    main.style.pointerEvents = "none";
    U_Email.value = Student[0]["email"]
    U_FName.value = Student[0]["First-Name"];
    U_LName.value = Student[0]["Last-Name"];
    let arr= Student[0]["Birth-Date"].split("-");
    let month = toMonthName(arr[1]);
    let day = toNumberName(arr[0]);
    U_Birth.value =day + " of "+month + " , "+arr[2];
    U_Pnumber.value = Student[0]["Primary-Number"];
    // U_Adress.value = Student[0]["Address"];
});
})};
function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('en-US', {
      month: 'long',
    });
}
function toNumberName(dayNum){
    switch(dayNum){
        case "1":
        case "21":
        case "31":
            return dayNum+"st";
        case "2":
        case "22":
             return dayNum+"nd";
        case "3":
        case "23":
            return dayNum+"rd";
        default:
            return dayNum+"th";
    }
}
var body = document.getElementsByTagName('body')[0];

document.getElementById('Close-Account-Page').addEventListener('click',()=>{
    account_page.style.display = "none";
    body.style.overflowY = "scroll";
    Empty_Profile_Tab();
    main.style.opacity = "1";
    main.style.pointerEvents = "all";
})