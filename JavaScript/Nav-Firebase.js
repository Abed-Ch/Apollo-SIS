import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { CAlert } from "./CAlert.js";
import {onAuthStateChanged , signOut , getAuth } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getFirestore, collection, onSnapshot,getDocs,arrayRemove,
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
var navT = document.getElementById('navbar');
var navS = document.getElementById('navbar2');
var Open_Notifs = document.getElementById('Open-Notifs');

onAuthStateChanged(auth , user =>{
      if(user){
        document.getElementById('profile').addEventListener('click' , ()=>{
          window.open("Profile.html","Profile",'width=750 , height=500')
        })
        let id = user.email.split("@")[0];
        Notifications_Func(id);
        let location = window.location.href.split("/");
        if(location[location.length-1] != "Tmain.html"){
          CAlert("Info","To Navigate To The Main Page , Simply Click On Apollo SIS In The Navigation Bar",6000,25);
          if(id.slice(0,2)=="11"){
            navS.style.display = "flex";
            sessionStorage.setItem("Student",true);
          }else{
            navT.style.display = "flex";
          }

        }else{
          if(id.slice(0,2)=="11"){
            navS.style.display = "flex";
            sessionStorage.setItem("Student",true);   
            sessionStorage.setItem("Student",true)
          }else{
            navT.style.display = "flex";
          }
        } if(id.slice(0,2)!="11"){
        Open_Notifs.style.display= "none";}else{ sessionStorage.setItem("Student",true)}
 
      }else{
        CAlert("Error","You Are Not Logged In , Redirecting To Main Page");
        setTimeout(() => {
          sessionStorage.clear();
          localStorage.clear()
          window.location.href = "index.html";
        }, 3000);
      }
}
);
window.onload = ()=>{
  let navs = document.getElementsByName('nav')
  let navLinnks = document.getElementsByClassName('nav-item');

  for(let i = 0 ; i<navs.length; i++){
  navLinnks[navLinnks.length-1].addEventListener("click",()=>{
  window.open("Profile.html","Profile",'width=750 , height=500');
  });
  };


}
setTimeout(() => {
  document.getElementById('profile').addEventListener('click' , ()=>{
    window.open("Profile.html","Profile",'width=750 , height=500')
  })
}, 2000);
var Notifs = document.getElementById('Notifs')
async function Notifications_Func(id){
  let st = sessionStorage.getItem("Student");
  if(!st){return;}
  const colRef = collection(db,"Student")
  const q = query(colRef ,where("ID",'==',parseInt(id)));

  const querySnapshot = await getDocs(q);
  let Did = querySnapshot.docs[0].id;
  sessionStorage.setItem("DocumentID",Did)
  const docRef = doc(db,"Student",Did);
  onSnapshot(docRef,(doc)=>{
    let Notifications = doc.data()["Notifications"];
    let number = sessionStorage.getItem("NumNot")
    if(Notifications.length > number ){
      CAlert("Notif","You Have New Notifications")
    }
    sessionStorage.setItem("NumNot",Notifications.length)
    Notifs.innerHTML = "";
    for(let i = 0 ; i<Notifications.length ; i++){
      Build_Notification(Notifications[i],i);
    }
  })
};
var Notif_Bar = document.getElementById('Notification-Bar');
var main = document.getElementsByTagName('main')[0];
Open_Notifs.addEventListener('click',()=>{
  let st = sessionStorage.getItem("Student");
  if(!st){
    return;}
  if(sessionStorage.getItem("NumNot")=="0"){
    CAlert("Warning","You Have No Notifications");
    return;
  }
  Notif_Bar.style.display = "block";
  Notif_Bar.style.animationName = "Open_Notifications";
  main.style.opacity = "0.5";
  main.style.pointerEvents = "none";
})
function Build_Notification(notif,i){
  let st = sessionStorage.getItem("Student");
  if(!st){return;}
  let temp = notif.split("##SPLIT##");
  let Notification = document.createElement('div');
  Notification.className = "Notification";
  let Icon = document.createElement('div');
  Icon.className = "Icon";
  let Icon2 = document.createElement('span');
  Icon2.className = "material-icons-round";
  Icon2.innerHTML = "notifications";
  Icon.appendChild(Icon2);
  Notification.appendChild(Icon)
  let Main = document.createElement('div');
  Main.className = "Main-Notif";
  let p1 = document.createElement('div');
  p1.innerHTML = temp[0];
  let s1 = document.createElement('span');
  s1.className = "material-icons-round";
  s1.innerHTML = "close";
  s1.id = "Delete-Notif";
  s1.addEventListener('click',(e)=>{
    Delete_Notif("1",e.target.classList[1]);
  })
  sessionStorage.setItem("Notif"+i,notif)
  s1.classList.add(i)
  p1.className = "Title";
  p1.appendChild(s1)
  Main.appendChild(p1);
  let p2 = document.createElement('div');
  p2.className = "Details";
  p2.innerHTML = temp[2];
  Main.appendChild(p2);
  let p3 = document.createElement('div');
  p3.className = "Time";
  p3.innerHTML = temp[1];
  Main.appendChild(p3);
  Notification.appendChild(Main);
  Notifs.appendChild(Notification);
};
async function Delete_Notif(howmany , which){
  let st = sessionStorage.getItem("Student");
  if(!st){return;}
  let notif = sessionStorage.getItem("Notif"+which);
  let docId = sessionStorage.getItem("DocumentID");
  const docRef = doc(db,"Student",docId);
  if(howmany == "All"){
    await updateDoc(docRef,{
      Notifications:[]
    })
  }else{
    await updateDoc(docRef,{
      Notifications:arrayRemove(notif)
    })
  }
}
document.getElementById('Close-Notifs').addEventListener('click',()=>{
  let st = sessionStorage.getItem("Student");
  if(!st){return;}
  Notif_Bar.style.display = "none";  
  main.style.opacity = "1";
  main.style.pointerEvents = "all";
});
document.getElementById('Clear-All-Notifs').addEventListener('click',()=>{
  let st = sessionStorage.getItem("Student");
  if(!st){return;}
  Delete_Notif('All')
});