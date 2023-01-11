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
onAuthStateChanged(auth, user => {
    Empty_Page()
    if(user){
        let temp = user.email.split("@");
        sessionStorage.clear();
        sessionStorage.setItem("ID" , temp[0]);
        if(temp[0].slice(0,2) == "12"){
            window.location.href = "Tmain.html"
        }
        Get_Info(parseInt(temp[0]));
        sessionStorage.setItem("Student",true)
    }else{
        CAlert("Error","You are not logged in , redirecting to main page");
        localStorage.clear();
        sessionStorage.clear();
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    }
});
async function Get_Info(id){
    const colRef2 = collection(db,"Student");
    const q2 = query(colRef2,where("ID","==",parseInt(id)));
    const querySnapshot = await getDocs(q2);
    let docu = querySnapshot.docs[0].data();
    sessionStorage.setItem("docID",querySnapshot.docs[0].id)
    sessionStorage.setItem("My_Grade",docu["Grade"])
    Existing_Activities_Func()
    
}
var Existing_Activities_Container = document.getElementById('Existing-Activities-Container')
function Existing_Activities_Func(){
    let Grade = sessionStorage.getItem("My_Grade")
    const colRef = collection(db, "Tasks");
    const  q = query(colRef, where("Participants-Class" , "==" , Grade ));
    onSnapshot(q, (snapshot) => {
    Existing_Activities_Container.innerHTML = "";
    let Tasks = [];

    snapshot.docs.forEach(doc => {
        Tasks.push({ ...doc.data(), id: doc.id })
    });
    Existing_Activities_Container.innerHTML = "";
    for(let i = 0 ; i<Tasks.length ; i++){
        Build_EA(Tasks[i]);
    }
})};
async function Build_EA(task){
    let Title = task["Title"];
    sessionStorage.removeItem("DBL")
    let Class = task["Course-Name"];
    let temp1 = task["Due"].toDate().toDateString();
    let temp2 = task["Due"].toDate().toLocaleTimeString();
    let Due = temp1 +" at "+temp2 ;
    let Existing_Activity = document.createElement('div');
    Existing_Activity.className = "Existing-Activity";
    Existing_Activity.id = task["id"];
    let EA_Title = document.createElement('div');
    let EA_Class = document.createElement('div');
    let EA_Due = document.createElement('div');
    EA_Title.id = "EA-Title";
    EA_Title.innerHTML = Title ;
    Existing_Activity.appendChild(EA_Title);
    EA_Class.id = "EA-Class";
    EA_Class.innerHTML = Class ;
    Existing_Activity.appendChild(EA_Class);
    EA_Due.id = "EA-Due";
    EA_Due.innerHTML = Due ;
    Existing_Activity.appendChild(EA_Due);
    Existing_Activity.addEventListener('click',()=>{
        Fill_View_Page(task["id"]);
    });
    let ID = sessionStorage.getItem('ID');  
    let EA_Submissions_Cont = document.createElement('div');
    EA_Submissions_Cont.id = "EA-Submissions-Cont";
    let EA_Submissions = document.createElement('div')
    EA_Submissions.id = "EA-Submissions";
    const docRef = doc(db, "Tasks", task["id"] , "Results", ID);
    const docSnap = await getDoc(docRef);
    if(docSnap){
        let Now = Timestamp.fromDate(new Date());
        let stats = docSnap.data()["Status"]
        if(stats =="Pending" && task["Due"] < Now){
            EA_Submissions.className = "Missing";
            EA_Submissions.innerHTML = " Missing" ;
        }else if(stats == "Pending"){
            EA_Submissions.className = "Pending";
            EA_Submissions.innerHTML = " Pending" ;
        }else if(stats == 'Done'){
            EA_Submissions.className = "All-Submitted";
            EA_Submissions.innerHTML = " Submitted " ;
        }
        EA_Submissions_Cont.appendChild(EA_Submissions);
        Existing_Activity.appendChild(EA_Submissions_Cont);
        Existing_Activities_Container.appendChild(Existing_Activity);
    }
};
var Comment_Cont = document.getElementsByClassName('Comments-Container-Inner')[0];
var Send_MSG = document.getElementById('Send-MSG');
var Cancel_MSG = document.getElementById('Cancel-MSG');
var My_MSG = document.getElementById('New-direct-MSG');
My_MSG.addEventListener('focus',()=>{
    My_MSG.style.padding = "0 2.5rem";
    Send_MSG.style.display = "block";
    Cancel_MSG.style.display = "block";
});
Send_MSG.addEventListener('click',()=>{
    let classN = My_MSG.className ;
    Post_Comment(classN);
    My_MSG.style.padding = "0 0.5rem";
    Send_MSG.style.display = "none";
    Cancel_MSG.style.display = "none";
    My_MSG.value = "";
});
Cancel_MSG.addEventListener('click',()=>{
    My_MSG.style.padding = "0 0.5rem";
    Send_MSG.style.display = "none";
    Cancel_MSG.style.display = "none";
    My_MSG.value = "";
})
var Activity_Title =  document.getElementById('Task-Title');
var Activity_Course = document.getElementById('Course-Name');
var Activity_Description = document.getElementById('Task-Descreption');
var Activity_Sub = document.getElementById('Participants-Class');
var Activity_Start = document.getElementById('Activity-Start');
var Activity_End = document.getElementById('Activity-Due');
var Activity_Score = document.getElementById('Task-Weight');
var Activity_Grade = document.getElementById('Task-Grade');
var Task_Status = document.getElementById('Task-Status');
var Teacher_Attach = document.getElementById('Teacher-Attach');
var My_Attach = document.getElementById('My-Attach');
var Sub_Btn = document.getElementById('Submit-Btn');
var Exis_Cont = document.getElementById('New-Task-Container');
function Empty_Page(){
    Activity_Title.value = "";
    Activity_Course.value = "";
    Activity_Description.value = "";
    Activity_Sub.value = "";
    Activity_End.value = "";
    Activity_Grade.value = "";
    Activity_Score.value = "";
    Activity_Start.value = "";
    My_Attach.value = "";
    Task_Status.value = "";
    My_MSG.style.padding = "0 0.5rem";
    Send_MSG.style.display = "none";
    Cancel_MSG.style.display = "none";
    My_MSG.value = "";
}
Sub_Btn.addEventListener('click',()=>{
    let dbl = sessionStorage.getItem("DBL");
    let op = My_Attach.style.opacity;
    let attachements = My_Attach.files[0];
    if(dbl){
        Submit_Task();
    }else{
        if(!attachements && op == "1"){
            sessionStorage.setItem("DBL",1)
            CAlert("Warning","This Task Requires An Attachement , And You Have Attached None , Submitting Now Will Mark Your Task As UnFinished And Your Grades Will Be Effected",4000,35);
        }else{
            CAlert("Warning","Please Confirm Your Submission By Clicking Submit Again");
            sessionStorage.setItem("DBL",1)
        }}
        setTimeout(() => {
            sessionStorage.removeItem("DBL");
        }, 10000);
})
async function Post_Comment(Tid){
    let length = Comment_Cont.getElementsByClassName("Comment").length ;
    let id = sessionStorage.getItem("ID")
    const docRef = doc(db,"Tasks",Tid,"Results",id);
        var time = Timestamp.fromDate(new Date());
        var message = id+"##SPLIT##"+time.seconds+"."+time.nanoseconds+"##SPLIT##"+My_MSG.value ;
        if(length =="0"){
            await updateDoc(docRef,{
                Comments:[message]
            })
        }else{
            await updateDoc(docRef,{
                Comments: arrayUnion(message)
            })
        }
}
async function Submit_Task(){
    let tid = sessionStorage.getItem("Tid");
    sessionStorage.removeItem("DBL")
    let ID = sessionStorage.getItem("ID");
    let attachements = My_Attach.files[0];
    const docRef = doc(db,"Tasks",tid,"Results",ID);
    if(attachements){
        let path = 'tasks/'+tid+'/'+ID+'/'+attachements.name
        const storageRef = ref(storage, path );
        uploadBytes(storageRef, attachements).then((snapshot) => {});
        await updateDoc(docRef,{
            Status:"Done",
            Attachments:path
        });
    }else{
        await updateDoc(docRef,{
            Status:"Done"
        });
    }
    Existing_Activities_Func();
}
async function Fill_View_Page(id){
    sessionStorage.removeItem("DBL");
    sessionStorage.setItem("Tid",id);
    const docRef = doc(db,"Tasks",id);
    My_MSG.className = id;
    onSnapshot(docRef,async (docr)=>{
        Empty_Page();
        let data = docr.data();
        let reference = data["Attachments"];
        if(reference){
            let starsRef = ref(storage,reference);
            getDownloadURL(starsRef).then((url) => {
                Teacher_Attach.addEventListener('click',()=>{
                    window.open(url)
                })
                Teacher_Attach.innerHTML = "Click To Download";
            }).catch((error) => {
            console.log(error);
        });
        }else{
            Teacher_Attach.innerHTML = "No Attachements"
        }
        Activity_Title.value =data["Title"];
        Activity_Course.value = data["Course-Name"];
        Activity_Description.value = data["Description"];
        let temp = new Date(data["Start"].seconds*1000);
        temp.setMinutes(temp.getMinutes() - temp.getTimezoneOffset());
        Activity_Start.value =temp.toISOString().slice(0,16);
        temp = new Date(data["Due"].seconds*1000);
        temp.setMinutes(temp.getMinutes() - temp.getTimezoneOffset());
        Activity_End.value =temp.toISOString().slice(0,16);
        Activity_Score.value = data["Weight"];
        Activity_Sub.value = data["Submissions"];
        let My_ID = sessionStorage.getItem('ID');
        let Now = Timestamp.fromDate(new Date());
        const docRef2 = doc(db,"Tasks",id,"Results",My_ID);
        onSnapshot(docRef2 , (doc)=>{
            Comment_Cont.innerHTML = "";
            Activity_Grade.value = doc.data()["Score"];
            let stats = doc.data()["Status"]
            if(stats =="Pending" && data["Due"] < Now){
                Task_Status.value = "Missing";
                Sub_Btn.style.display = "none";
                My_Attach.style.opacity = "0";
                My_Attach.style.pointerEvents = "none"
            }else if(stats == "Done"){
                Task_Status.value = "Done";
                Sub_Btn.style.display = 'none';
                My_Attach.style.opacity = "0";
                My_Attach.style.pointerEvents = "none"
            }else if(stats == "Pending" && data["Submissions"] == "Online") {
                Task_Status.value = "Pending";
                Sub_Btn.style.display = 'block';
                My_Attach.style.opacity = "1";
                My_Attach.style.pointerEvents = "all"
                Activity_Grade.value = "";
            }else{
                Task_Status.value = "Pending";
                Sub_Btn.style.display = 'block';
                My_Attach.style.opacity = "0";
                My_Attach.style.pointerEvents = "none"
                Activity_Grade.value = "";
            }
            let Comments = doc.data()["Comments"];
            if(Comments.length == "0"){
                Comment_Cont.innerHTML = "No Direct Messages";
            }else{

            
            for(let i =0 ; i<Comments.length ; i++){
                Build_Comments(Comments[i]);
            }
    }})
    })
    Exis_Cont.style.display = "initial";
};
function Build_Comments(Comment){
    let MyID = sessionStorage.getItem("ID")
    let temp = Comment.split("##SPLIT##");
    let comm = document.createElement('div');
    let commH = document.createElement('div');
    let commM = document.createElement('div');
    comm.className = "Comment";
    commH.className = "Comment-Header";
    commM.className = "Comment-MSG";
    let s1 = document.createElement('span');
    let s2 = document.createElement('span');
    if(temp[0] == MyID){
        s1.innerHTML = "You";
        comm.classList.add("My-Comment")
    }else{
        s1.innerHTML = "Teacher";
    }
    let temp2 = parseFloat(temp[1])
    var date = new Date(temp2*1000);     
    date.toLocaleString();
    s2.innerHTML = date.toLocaleDateString() + " "+date.toLocaleTimeString();
    commH.appendChild(s1);
    commH.appendChild(s2);
    comm.appendChild(commH);
    commM.innerHTML = temp[2];
    comm.appendChild(commM);
    Comment_Cont.appendChild(comm)
}
