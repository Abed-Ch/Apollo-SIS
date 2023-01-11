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
var Tbody = document.getElementById('TBODY');
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app) ;
const storage = getStorage(app);
var Pet_Cont = document.getElementsByClassName('All-Cont')[0];
var New_Pet = document.getElementById('Open-NewP');
var Page_Title = document.getElementsByClassName('Title')[0];
var NP_Cause = document.getElementById('NP-Cause');
var NP_Type = document.getElementById('NP-Type');
var NP_Start = document.getElementById('NP-Start');
var NP_End = document.getElementById('NP-End');
var NP_Attach = document.getElementById('NP-Attach');
var Pet_Details = document.getElementById('Petition-Details');
var Sub_Btn = document.getElementById('Submit-Petition');
var Reset_Btn = document.getElementById('Reset-Petition');
var NP_Stat = document.getElementById('NP-Status');
var NP_Res_Time = document.getElementById('NP-Response-Date');
var NP_Justify = document.getElementById('Petition-Justify');
var Petition_Page = document.getElementsByClassName('View-Petitions')[0];
onAuthStateChanged(auth, user => {
    if(user){
        let temp = user.email.split("@");
        sessionStorage.clear();
        sessionStorage.setItem("ID" , temp[0]);
        if(temp[0].slice(0,2) == "12"){
            GOHOME()     
        }
        Ex_Pet();
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
function GOHOME(){
    CAlert("Warning","You Are Not A Student, Redirecting To Teacher Main");
    setTimeout(() => {
        window.location.href = "Tmain.html";
    }, 4000); 
}
function Empty_Page(){
    NP_Cause.value = "";
    NP_Type.value = "0";
    NP_Start.value = "";
    NP_End.value = "";
    NP_Attach.value = "";
    Pet_Details.value = "";
    NP_Start.value = "";
    NP_Res_Time.value = "";
    NP_Justify.value = "";
    NP_Stat.value = "";
    Page_Title.innerHTML = "";
    Sub_Btn.style.display = "none";
    Reset_Btn.style.display = "none";
    Hide[0].style.display = "none";
    Hide[1].style.display = "none";
    Tbody.style.pointerEvents = "all";
}
async function Ex_Pet(){
    let My_ID = sessionStorage.getItem("ID");
    const colRef = collection(db,'Petitions');
    const q = query(colRef,where("student id","==",My_ID));
    onSnapshot(q,(snapshot)=>{
        let Petitions = [];
        snapshot.docs.forEach( doc =>{
            Petitions.push({...doc.data(),DocID:doc.id})
        });
        Pet_Cont.innerHTML = "";
        for(let i = 0 ; i < Petitions.length ; i++){
            let Pet = document.createElement('div');
            Pet.className = "Petition";
            let PetTy = document.createElement('div');
            PetTy.className = "Petition-Type";
            PetTy.innerHTML = Petitions[i]["type"];
            let PetTi = document.createElement('div');
            PetTi.className = "Petition-Time";
            let temp1 = Petitions[i]["from date"].split("/");
            let temp2 = Petitions[i]["to date"].split("/");
            PetTi.innerHTML =  temp1[2]+"/"+ temp1[1]+"/"+ temp1[0]+" -> "+temp2[2]+"/"+ temp2[1]+"/"+ temp2[0];
            let PetTC = document.createElement('div');
            PetTC.className = "Petition-Cause";
            PetTC.innerHTML = Petitions[i]["cause"];
            let PetTS = document.createElement('div');
            PetTS.className = "Petition-Status";
            let status = Petitions[i]["status"];
            if(status.toLowerCase()== "pending"){
                PetTS.innerHTML = "Pending";
                PetTS.classList.add('Pending');
            }else if(status.toLowerCase()== "accepted"){
                PetTS.innerHTML = "Accepted";
                PetTS.classList.add('Accepted');
            }else{
                PetTS.innerHTML = "Denied";
                PetTS.classList.add('Denied');
            }
            Pet.appendChild(PetTy);
            Pet.appendChild(PetTi);
            Pet.appendChild(PetTC);
            Pet.appendChild(PetTS);
            Pet.addEventListener('click',(e)=>{
                View_Pet(Petitions[i]["DocID"]);
            })
            Pet_Cont.appendChild(Pet);
        }
    })
};
async function View_Pet(id){
    const docRef = doc(db,"Petitions",id);
    onSnapshot(docRef,doc=>{
        Empty_Page();
        Tbody.style.pointerEvents = "none"
        Page_Title.innerHTML = "View Petition";
        let data = doc.data();
        NP_Cause.value = data["cause"];
        NP_Type.value = data["type"];
        NP_Start.value = data["from date"].replaceAll('/','-');
        NP_End.value = data["to date"].replaceAll('/','-');
        Pet_Details.value = data["petition details"];
        let status = data["status"];
        switch(status.toLowerCase()){
            case "pending":
                NP_Stat.value = "Pending";
                NP_Res_Time.style.display = "none";
                NP_Justify.style.display = "none";
                Hide[0].style.display = 'none';
                Hide[1].style.display = 'none';
                break;
            case "denied":
                NP_Stat.value = "Denied";
                NP_Stat.style.color= "red";
                Hide[0].style.display = 'table-row';
                Hide[1].style.display = 'table-row';
                NP_Res_Time.style.display = "block";
                NP_Justify.style.display = "block";
                NP_Res_Time.value = (data["Response-Date"]).replaceAll('/','-');
                NP_Justify.value = data["Justify"];     
                break ;
            case "accepted":
                NP_Res_Time.value = (data["Response-Date"].replaceAll('/','-'));
                NP_Justify.value = data["Justify"];
                NP_Stat.value = "Accepted";
                NP_Stat.style.color= "green";
                NP_Res_Time.style.display = "block";
                NP_Justify.style.display = "block";
                Hide[0].style.display = 'table-row';
                Hide[1].style.display = 'table-row';
                break;    
        };
        Petition_Page.style.display = "grid";
    })
};
var Hide = document.getElementsByClassName('hide-me');
New_Pet.addEventListener('click',()=>{
    Empty_Page();
    Hide[0].style.display = 'none';
    Hide[1].style.display = 'none';
    Page_Title.innerHTML = "New Petition";
    Sub_Btn.style.display = "initial";
    Reset_Btn.style.display = "initial";
    Petition_Page.style.display = "grid";
    Petition_Page.style.pointerEvents = "all";
})
Reset_Btn.addEventListener('click',()=>{
    Empty_Page();
    Page_Title.innerHTML = "New Petition";
    Sub_Btn.style.display = "initial";
    Reset_Btn.style.display = "initial";
});
Sub_Btn.addEventListener('click',()=>{
    let dbl = sessionStorage.getItem("DBL");
    if(NP_Start.value =="" || NP_Cause.value =="" || Pet_Details.value =="" ||NP_End.value ==""||NP_Type.value =="0"){
        CAlert("Warning","Please Fill The Required Fields");
        return;
    }
    let date1 = new Date (NP_Start.value);
    let date2 = new Date (NP_End.value);
    if(date1.getTime() > date2.getTime() ){
        CAlert("Warning","The End Date Can't Be Before The Start Date");
        return;
    }
    if(!dbl){
        CAlert("Warning","Please Click Submit Again To Submit Your Petition");
        sessionStorage.setItem("DBL",true);
    }else{
        sessionStorage.removeItem("DBL");
        Submit_Petition();
    }
    setTimeout(() => {
        sessionStorage.removeItem("DBL")
    }, 8000);
});
async function Submit_Petition(){
let ID = sessionStorage.getItem("ID");
let cause = NP_Cause.value ;
let type = NP_Type.value ;
let From = (NP_Start.value).replaceAll('-','/') ;
let to = (NP_End.value).replaceAll('-','/') ;
let attach = NP_Attach.files[0];
let details = Pet_Details.value;
const colRef = collection(db,"Petitions");
if(!attach){
    const newDoc = await addDoc(colRef,{
cause:cause,
'from date':From,
'petition details':details,
status:"pending",
'student id':ID,
'to date':to,
type:type,
Justify:"",
'Response-Date':""
});
}else{
    let path = "Petitions/"+ID+"/"+attach.name ;
    const newDoc = await addDoc(colRef,{
        attachments:path,
        cause:cause,
        'from date':From,
        'petition details':details,
        status:"pending",
        'student id':ID,
        'to date':to,
        type:type,
        Justify:"",
        'Response-Date':""
        });
        
        
        const storageRef = ref(storage, path );
        uploadBytes(storageRef, attach).then((snapshot) => {});
        const colRef2 = collection(db,"Student");
const q = query(colRef2,where("ID","==",parseInt(ID)));
const querySnapshot = await getDocs(q);
let Did = querySnapshot.docs[0].id;
let length = querySnapshot.docs[0].data()["Petitions"]
const docRef = doc(db,"Student",Did);
let len = length.length ;
if(len == "0"){
    await updateDoc(docRef,{
        Petitions:[newDoc.id]
    })
}else{
    await updateDoc(docRef,{
        Petitions:arrayUnion(newDoc.id)
    })
}
}
Empty_Page();
}