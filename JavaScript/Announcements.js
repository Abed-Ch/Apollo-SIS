import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { CAlert } from "./CAlert.js";
import { getStorage, ref, getDownloadURL ,uploadBytes,deleteObject} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";
import {onAuthStateChanged , signOut , getAuth } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getFirestore, collection, onSnapshot,getDocs,
    addDoc, deleteDoc, doc,setDoc,getDoc,query, where,orderBy, serverTimestamp,Timestamp,updateDoc , arrayUnion,deleteField} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
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
var New_Announce_Btn = document.getElementById('Add-New-Announcement');
onAuthStateChanged(auth , user => {
    if(user){
        
        let temp = user.email.split("@");
        sessionStorage.setItem('ID',temp[0]);
        if(temp[0].slice(0,2) == "11"){
            document.getElementsByClassName('New-Announcement-Btn')[0].style.display ='none';
            sessionStorage.setItem("Student",true);
        }
        Filter_Announcements();
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
let My_Reply = document.getElementById('My-New-Reply');
let Post_My_Reply = document.getElementById('Post-Reply');
let Del_My_Reply = document.getElementById('Delete-Reply');
My_Reply.addEventListener('focus',()=>{
    My_Reply.style.padding = "0 2.5rem";
    Post_My_Reply.style.display = "block";
    Del_My_Reply.style.display = "block";
});

Post_My_Reply.addEventListener('click',()=>{
    Post_Reply();
    My_Reply.style.padding = "0 0.5rem";
    Post_My_Reply.style.display = "none";
    Del_My_Reply.style.display = "none";
    My_Reply.value = "";
});

async function Post_Reply(){
    let Student = sessionStorage.getItem("Student");
    let Ann_ID = sessionStorage.getItem("Ann_ID");
    let My_ID = sessionStorage.getItem("ID");
    var colRef ;
    if(Student){
        colRef = collection(db,"Student");
    }else{
        colRef = collection(db,"Teacher");
    }
    const q = query(colRef,where("ID","==",parseInt(My_ID)));
    let Now = (new Date()).toLocaleString();
    let msg = My_Reply.value ;
    const querySnapshot = await getDocs(q);
    let docu = querySnapshot.docs[0].data();
    sessionStorage.setItem("docID",querySnapshot.docs[0].id)
    let Name = docu["First-Name"]+" "+docu["Last-Name"];
    let data = Name+"##SPLIT##"+My_ID+"##SPLIT##"+Now+"##SPLIT##"+msg;
    let len = Replies_Count.innerHTML.split(" ")[0];
    const docRef = doc(db,"Announcements",Ann_ID)
    if(len == "0"){
        await updateDoc(docRef,{
            Replies:[data]
        });
    }else{
       await updateDoc(docRef,{
            Replies:arrayUnion(data)
        });
    }
};
Del_My_Reply.addEventListener('click',()=>{
    My_Reply.style.padding = "0 0.5rem";
    Post_My_Reply.style.display = "none";
    Del_My_Reply.style.display = "none";
    My_Reply.value = "";
});
var main = document.getElementsByTagName('main')[0];
var New_Announce_Cont = document.getElementById('New-Announcement-Cont');
var New_Announce_Rec_Select = document.getElementById('New-Announcement-Recievers');
var Sorting_Select = document.getElementById('Sorting-Select');
New_Announce_Btn.addEventListener('click',()=>{
    let St = sessionStorage.getItem('Student');
    if(St){
        CAlert("Warning","Students Aren't Allowed To Post Announcements",2500);
        return;
    }
    main.style.opacity = "0.5";
    New_Announce_Cont.style.display = "grid";
    New_Announce_Cont.style.animationName = "Slide_Up";
    Get_Announcement_Reciepients();
});
async function Filter_Announcements(){
    let id = sessionStorage.getItem('ID');
    let Student = sessionStorage.getItem("Student");
    if(Student){
        const colRef2 = collection(db,"Student");
        const q2 = query(colRef2,where("ID","==",parseInt(id)));
        const querySnapshot = await getDocs(q2);
        let docu = querySnapshot.docs[0].data();
        sessionStorage.setItem("docID",querySnapshot.docs[0].id)
        let Grade = docu["Grade"];
        const ColRef = collection(db,"Courses");
        const q = query(ColRef,where("Participants","==",Grade));
        onSnapshot(q, (snapshot) => {
            Sorting_Select.innerHTML = "";
            let Courses = [];
            snapshot.docs.forEach(doc => {
              Courses.push({ ...doc.data(), id: doc.id })
            });
            let op0 = document.createElement('option');
            op0.innerHTML = "All";
            Sorting_Select.appendChild(op0);
            op0.value = "0";
            Sorting_Select.value = "0";
            for(let i = 0 ; i < Courses.length ; i++){
                let Grade = Courses[i]["Course-Name"];
                let option = document.createElement('option');
                option.value = Courses[i]["Teacher-ID"];
                option.innerHTML = "Announcements from "+Grade;
                Sorting_Select.appendChild(option);
            }
        });
    }else{
        const ColRef = collection(db,"Courses");
        const q = query(ColRef,where("Teacher-ID","==",id));
        onSnapshot(q, (snapshot) => {
            Sorting_Select.innerHTML = "";
            let Courses = [];
            snapshot.docs.forEach(doc => {
              Courses.push({ ...doc.data(), id: doc.id })
            });
            let op0 = document.createElement('option');
            op0.innerHTML = "All";
            Sorting_Select.appendChild(op0);
            op0.value = "0";
            Sorting_Select.value = "0";
            for(let i = 0 ; i < Courses.length ; i++){
                let Grade = Courses[i]["Participants"];
                let temp = Grade.split("-");
                let option = document.createElement('option');
                option.value = Grade;
                option.innerHTML = "Grade "+temp[0]+" Section "+temp[1];
                Sorting_Select.appendChild(option);
            }
        });
    }
    Get_All_Announcements("0")
}
Sorting_Select.addEventListener('change',()=>{
    Get_All_Announcements(Sorting_Select.value)    
});
async function Get_Announcement_Reciepients(){
    let Student = sessionStorage.getItem("Student");
    if(Student){return;}
    New_Body.value = "";
    New_Title.value = "";
    let id = sessionStorage.getItem('ID');
    const ColRef = collection(db,"Courses");
    const q = query(ColRef,where("Teacher-ID","==",id));
    onSnapshot(q, (snapshot) => {
        New_Announce_Rec_Select.innerHTML = "";
        let Courses = [];
        snapshot.docs.forEach(doc => {
          Courses.push({ ...doc.data(), id: doc.id })
        });
        let op0 = document.createElement('option');
        op0.value = "0";
        op0.innerHTML = "Select A Recieving Class";
        New_Announce_Rec_Select.appendChild(op0)
        for(let i = 0 ; i < Courses.length ; i++){
            let Grade = Courses[i]["Participants"];
            let temp = Grade.split("-");
            let option = document.createElement('option');
            option.value = Grade;
            option.innerHTML = "Grade "+temp[0]+" Section "+temp[1];
            New_Announce_Rec_Select.appendChild(option);
        }
    })
};
var New_Announce_Btn = document.getElementsByClassName('New-Announce-Btns');
New_Announce_Btn[0].addEventListener('click',()=>{
    let Student = sessionStorage.getItem('Student');
    if(Student){return;}
    Post_Announcement();
});
New_Announce_Btn[1].addEventListener('click',()=>{
    New_Title.value = "";
    New_Body.value = "";
    main.style.opacity = "1";
    New_Announce_Cont.style.display = "none";
    New_Announce_Cont.style.animationName = "Slide_Out";
})
document.getElementById('profile').addEventListener('click' , ()=>{
    window.open("Profile.html","Profile",'width=750 , height=500')
})
var New_Title = document.getElementById('New-Msg-Title');
var New_Body = document.getElementById('New-Msg-Body');
async function Post_Announcement(){
    let Student = sessionStorage.getItem('Student');
    if(Student){return;}
    Annouc_Cont.innerHTML = "";
    var date = new Date();
    let Post_Date = date.toDateString()+" at "+date.toLocaleTimeString();
    let Title = New_Title.value ;
    let Body = New_Body.value ;
    let ID = sessionStorage.getItem('ID');
    let recievers = New_Announce_Rec_Select.value ;
    await addDoc(collection(db,"Announcements"),{
        Title: Title,
        Message:Body,
        'Teacher-ID':ID,
        Date:Post_Date,
        Class:recievers,
        Replies:[]
    });
    Send_Notification(recievers);
    New_Title.value = "";
    New_Body.value = "";
    main.style.opacity = "1";
    New_Announce_Cont.style.display = "none";
    New_Announce_Cont.style.animationName = "Slide_Out";
};
async function Send_Notification(grade){
    let DocIDS = [];
    let NotifLength = [];
            const collRef3 = collection(db,"Student")
            const q = query(collRef3,where("Grade","==",grade));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let name = doc.id;
                DocIDS.push(name);
                let not = doc.data()["Notifications"].length ;
                NotifLength.push(not);
        })
        var now = new Date();
        var time = now.toDateString()+" at "+now.toLocaleTimeString();
        var msg = "New Announcement ##SPLIT##"+time+"##SPLIT##"+"Your Teacher Has Posted A New Announcement.";
        for(let k = 0 ; k< DocIDS.length ; k++){
            const docRef3 = doc(db,"Student",DocIDS[k]);
            if(NotifLength[k] == 0){
                await updateDoc(docRef3,{
                    Notifications:[msg]
                })
        }else{
            await updateDoc(docRef3,{
                Notifications:arrayUnion(msg)
            })
        }
}}
var Annouc_Cont = document.getElementsByClassName('Announcements')[0];
async function Get_All_Announcements(value){
    let Student = sessionStorage.getItem("Student");
    if(Student){
        let docID = sessionStorage.getItem("docID");
        let docRef2 = doc(db,"Student",docID);
        let docs = await getDoc(docRef2);
        let Grade = docs.data()["Grade"];
        const colRef = collection(db,"Announcements");
        let id = sessionStorage.getItem('ID');
        if(value == "0"){
    const q = query(colRef,where("Class","==",Grade));
    onSnapshot(q,(snapshot)=>{
        Annouc_Cont.innerHTML = "";
        let Announcements = [];
        snapshot.docs.forEach(doc=>{
            Announcements.push({...doc.data(), id: doc.id });
        });
        let sortSec = document.getElementsByClassName('Sorting-Section')[0];
        sortSec.getElementsByTagName('span')[0].innerHTML = Announcements.length + " Announcements Were Found";
        for(let i = 0; i<Announcements.length ; i++){
            Build_Announcement(Announcements[i]);
        }
    });
        }else{
        const q = query(colRef,where("Class","==",Grade),where("Teacher-ID","==",value));
        onSnapshot(q,(snapshot)=>{
        Annouc_Cont.innerHTML = "";
        let Announcements = [];
        snapshot.docs.forEach(doc=>{
            Announcements.push({...doc.data(), id: doc.id });
        });
        let sortSec = document.getElementsByClassName('Sorting-Section')[0];
        sortSec.getElementsByTagName('span')[0].innerHTML = Announcements.length + " Announcements Were Found";
        for(let i = 0; i<Announcements.length ; i++){
            Build_Announcement(Announcements[i]);
        }
    });
}
}else{
        const colRef = collection(db,"Announcements");
        let id = sessionStorage.getItem('ID');
        if(value == "0"){
            const q = query(colRef,where("Teacher-ID","==",id));
            onSnapshot(q,(snapshot)=>{
                Annouc_Cont.innerHTML = "";
                let Announcements = [];
                snapshot.docs.forEach(doc=>{
                    Announcements.push({...doc.data(), id: doc.id });
                });
                let sortSec = document.getElementsByClassName('Sorting-Section')[0];
                sortSec.getElementsByTagName('span')[0].innerHTML = Announcements.length + " Announcements Were Found";
                for(let i = 0; i<Announcements.length ; i++){
                    Build_Announcement(Announcements[i]);
                }
            });
        }else{
            const q = query(colRef,where("Teacher-ID","==",id),where("Class","==",value));
            onSnapshot(q,(snapshot)=>{
                Annouc_Cont.innerHTML = "";
                let Announcements = [];
                snapshot.docs.forEach(doc=>{
                    Announcements.push({...doc.data(), id: doc.id });
                });
                let sortSec = document.getElementsByClassName('Sorting-Section')[0];
                sortSec.getElementsByTagName('span')[0].innerHTML = Announcements.length + " Announcements Were Found";
                for(let i = 0; i<Announcements.length ; i++){
                    Build_Announcement(Announcements[i]);
                }
            });
        }
    }

};
document.getElementById('Close-Read').addEventListener('click',()=>{
    Read_Page.style.animationName = "Slide_Out";
    Annouc_Cont.style.display = "initial";
    Read_Page.style.display = "none";
    Empty_View()
})
async function Build_Announcement(Ann){
    let announce = document.createElement('div');
    announce.className = "Announcement";
    let check = document.createElement('div');
    check.className = "Check-Box";
    let checkinner = document.createElement('input');;
    checkinner.type = "checkbox";
    checkinner.style.pointerEvents = 'none';
    checkinner.id ="Select-Announcement";
    checkinner.className = Ann["id"];
    check.appendChild(checkinner);
    announce.appendChild(check);
    let details = document.createElement('div');
    details.className = "Details";
    let d1 =document.createElement('p');
    d1.innerHTML = Ann['Title'];
    d1.id = Ann["id"];
    d1.addEventListener('click',(e)=>{
        let p1 = e.target.parentNode ;
        let p2 = p1.parentNode ;
        let check = p2.getElementsByClassName('Check-Box')[0].getElementsByTagName('input')[0];
        check.checked = true ;
        View_Announcement(e.target.id);
    })
    let d2 =document.createElement('p');
    let Tid =parseInt(Ann['Teacher-ID']);
    const colRef = collection(db,"Teacher");
    const q = query(colRef,where("ID","==",Tid));
    const querySnapshot = await getDocs(q);
    let temp = querySnapshot.docs[0].data();
    let Name = temp["First-Name"]+" "+temp["Last-Name"];
    d2.innerHTML = "From "+Name ;
    let d3 =document.createElement('p');
    d3.innerHTML = Ann["Message"].slice(0 , 98)+"...";
    details.appendChild(d1);
    details.appendChild(d2);
    details.appendChild(d3);
    announce.appendChild(details);
    let DO = document.createElement('div');
    DO.className = "Date-Options";
    let AD = document.createElement('div');
    AD.className = "Announcement-Date";
    AD.innerHTML = Ann["Date"];
    DO.appendChild(AD);
    announce.appendChild(DO);
    Annouc_Cont.appendChild(announce);
}
let RA_Header = document.getElementsByClassName('RA-Header')[0];
let RA_Title = document.getElementById('RA-Title');
let RA_Body = document.getElementById('RA-MSG');
let RA_Booty = document.getElementsByClassName('RA-Booty')[0];
let Replies = document.getElementsByClassName('Replies-Header')[0];
let Replies_Count = Replies.getElementsByTagName('span')[1];
let Replies_Cont = document.getElementsByClassName('All-Replies')[0];
function Empty_View(){
    RA_Header.innerHTML = "";
    RA_Title.value = "";
    RA_Body.value = "";
    RA_Booty.innerHTML = "";
    Replies_Count.innerHTML = "";
    Replies_Cont.innerHTML = "";
};
async function View_Announcement(id){
    const docRef = doc(db,"Announcements",id);
    sessionStorage.setItem("Ann_ID",id);
    onSnapshot(docRef,async (snapshot)=>{
        let Tid = snapshot.data()["Teacher-ID"]
        const colRef = collection(db,"Teacher");
        const q = query(colRef,where("ID","==",parseInt(Tid)));
        const querySnapshot = await getDocs(q);
        let temp = querySnapshot.docs[0].data();
        let Name = temp["First-Name"]+" "+temp["Last-Name"];
        let span1 = document.createElement('span');
        let span2 = document.createElement('span');
        span1.innerHTML = "From: "+Name ;
        let temp2 = snapshot.data()["Class"].split("-");
        span2.innerHTML = "To: Grade "+temp2[0]+" Section "+temp2[1]+" Students";
        Empty_View();
        RA_Header.appendChild(span1);
        RA_Header.appendChild(span2);
        RA_Title.value = snapshot.data()["Title"];
        RA_Body.value = snapshot.data()["Message"];
        let booty = document.createElement('p');
        booty.innerHTML = "This Announcement Was Posted On "+snapshot.data()["Date"];
        RA_Booty.appendChild(booty);
        let replies = snapshot.data()["Replies"];
        Replies_Count.innerHTML = replies.length + " Replies";
        for(let i = 0 ;  i<replies.length ; i++){
            Build_Reply(replies[i]);
        }
    });
    Annouc_Cont.style.display = "none";
    Read_Page.style.display = "grid";
    Read_Page.style.animationName = "Slide_Up";
};
let Read_Page = document.getElementById('Read-Announcement');

function Build_Reply(Reply){
    let temp = Reply.split("##SPLIT##");
    let reply = document.createElement('div');
    reply.className = "Reply";
    let replyHead = document.createElement('div');
    replyHead.className = "Reply-Info";
    let span1 = document.createElement('span');
    let span2 = document.createElement('span');
    span1.innerHTML = temp[0];
    span2.innerHTML = temp[2];
    let My_ID = sessionStorage.getItem('ID');
    replyHead.appendChild(span1);
    replyHead.appendChild(span2);
    let replyMSG = document.createElement('div');
    replyMSG.innerHTML = temp[3];
    if(My_ID == temp[1]){reply.classList.add("My-Reply")}    
    replyMSG.className = "Reply-MSG";
    reply.appendChild(replyHead);
    reply.appendChild(replyMSG);
    Replies_Cont.appendChild(reply);
};