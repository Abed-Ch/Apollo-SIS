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
var New_Task_Page = document.getElementById('New-Task-Container');
New_Task_Page.style.display = "none";
var Activity_Title =  document.getElementById('Task-Title');
var Activity_Course = document.getElementById('Course-Name');
var Activity_Description = document.getElementById('Task-Descreption');
var Activity_Class_Participants = document.getElementById('Participants-Class');
var Activity_Start = document.getElementById('Activity-Start');
var Activity_End = document.getElementById('Activity-Due');
var Activity_Score = document.getElementById('Task-Weight');
var Activity_Attachments = document.getElementById('Attach-File');
var NParticipants = document.getElementById('NumberParticipants');
var SeeParticipants = document.getElementById('See-Participants');
var See_Outer = document.getElementById('See-Outer');
var Reset_Btn = document.getElementById('Reset-Task');
var main = document.getElementById('main');
Reset_Btn.style.display="none";
var Submissions_Type = document.getElementById('Submission-Type');
var Edit_Btn = document.getElementById('Edit-Task');
Edit_Btn.style.display="none";
var Assign_Btn = document.getElementById('Submit-Task');
Assign_Btn.style.display="none";
var Delete_Btn = document.getElementById('Delete-Task');
Delete_Btn.style.display="none";
function Empty_Task_Page(){
    Confirm_Delete.style.pointerEvents ="none";
    Confirm_Delete.style.display = "none";
    See_Outer.style.display = "none";
    Activity_Title.value = "";
    Activity_Course.value = "" ;
    Activity_Description.value = "";
    Activity_Class_Participants.innerHTML = "";
    let Select_class = document.createElement('option');
    Select_class.value = "0" ;
    Select_class.innerHTML = "Select Class";
    Activity_Class_Participants.appendChild(Select_class);
    Activity_Class_Participants.value = "null";
    Activity_Start.value = "";
    Activity_End.value = "";
    Activity_Score.value = "";
    Activity_Attachments.value = "";
    NParticipants.innerHTML = "";
    SeeParticipants.style.display = "none";
    Submissions_Type.value = "0" ;
}
onAuthStateChanged(auth, user => {
    if(user){
        let temp = user.email.split("@");
        sessionStorage.clear();
        sessionStorage.setItem("ID" , temp[0]);
        if(temp[0].slice(0,2) == "11"){
            window.location.href = "Tmain.html"
        }
    }else{
        CAlert("Error","You are not logged in , redirecting to main page");
        localStorage.clear();
        sessionStorage.clear();
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    }
});
function Existing_Activities_Func(){
let ID = parseInt(sessionStorage.getItem('ID'));
const colRef = collection(db, "Tasks");
const  q = query(colRef, where("Teacher-ID" , "==" , ID ));
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

function Build_EA(task){
    let Title = task["Title"];
    let Class = task["Participants-Class"];
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
    })  
    let EA_Submissions_Cont = document.createElement('div');
    EA_Submissions_Cont.id = "EA-Submissions-Cont";
    let EA_Submissions = document.createElement('div')
    EA_Submissions.id = "EA-Submissions";
    const colref = collection(db, "Tasks", task["id"] , "Results");
    onSnapshot(colref, (snapshot) => {
        let Results = [];
        snapshot.docs.forEach(doc => {
            Results.push({ ...doc.data(), id: doc.id })
    });
    EA_Submissions.innerHTML = "";
    var Submitted = 0; 
    for(let i = 0 ; i<Results.length ; i++){
        if(Results[i]["Status"] == "Done"){
            Submitted ++;}
        }
    let EndTemp = task["Due"];
    let Now = Timestamp.fromDate(new Date());
    if(Submitted < Results.length){
        EA_Submissions.className = "Pending";
    }else{
        EA_Submissions.className = "All-Submitted"
    }
    EA_Submissions.innerHTML = "Submissions: "+Submitted+" / "+Results.length ;
    if(Submitted < Results.length && Now>EndTemp ){
        EA_Submissions.innerHTML = (Results.length - Submitted)+"/"+Results.length+" Missing";
        EA_Submissions.className = "Missing";
    }
    EA_Submissions_Cont.appendChild(EA_Submissions);
    Existing_Activity.appendChild(EA_Submissions_Cont);
    Existing_Activities_Container.appendChild(Existing_Activity);
})};
function Open_New_Task_Page(){
    Empty_Task_Page();
    New_Task_Page.style.display = "initial";
    sessionStorage.removeItem("Task_ID")
}
var attach_outer = document.getElementById('Attach_Outer');
var buttons = document.getElementsByClassName('Task-Buttons');
var Student_Attach = document.getElementById('Student-Attach-Download');
function Fill_View_Page(id){
    Open_New_Task_Page();
    Clear_View_Part_Tab();
    Clear_Student_View();
    Make_UnEditable();
    Activity_Attachments.style.pointerEvents = "none";
    sessionStorage.removeItem("Task_ID")
    document.getElementById('View-Table').style.pointerEvents = "none";
    Edit_Btn.style.display = 'block';
    Edit_Btn.style.pointerEvents = 'all';
    Delete_Btn.style.display ="initial";
    Delete_Btn.style.pointerEvents = "all";
    Reset_Btn.style.display = "none";
    Assign_Btn.style.display = "none";
    See_Outer.style.pointerEvents = "all";
    const docRef = doc(db, 'Tasks', id);
    onSnapshot(docRef, (doc) => {
    let Title = doc.data()["Title"];
    let Course = doc.data()["Course-Name"];
    let Desciption = doc.data()["Description"];
    let Participants = doc.data()["Participants-Class"];
    let StartTemp = doc.data()["Start"];
    let Now = Timestamp.fromDate(new Date());
    let EndTemp = doc.data()["Due"];
    if(Now>EndTemp){
        Edit_Btn.style.display = "none";
    }
    let Weight = doc.data()["Weight"];
    if(doc.data()["Submissions"] == "Online"){
        Submissions_Type.value = "Online";
        sessionStorage.setItem('Online',true);
    }else{Submissions_Type.value = "In-Class",sessionStorage.removeItem("Online")}
    const collRef = collection(db,'Tasks',id,'Results');
    onSnapshot(collRef , (snapshot)=>{
    let Results = []
    snapshot.docs.forEach(doc => {
    Results.push({ ...doc.data(), id: doc.id })
    });
    // let starsRef = ref(storage,doc.data()["Attachments"]);
    // getDownloadURL(starsRef)
    // .then((url) => {
    //     Activity_Course.addEventListener("click",()=>{
    //         window.open(url)
    //     })
    
    // })
    // .catch((error) => {
    // console.log(error);
    // });
    NParticipants.innerHTML = "";
    NParticipants.innerHTML = Results.length + "  Participants";
    fill_View_Par_Tab(Results);
    })
    SeeParticipants.style.display = "initial";
    Activity_Score.value = Weight ;
    let temp = new Date(StartTemp.seconds*1000);
    let temp2 = new Date(EndTemp.seconds*1000);
    Activity_Title.value = Title ;
    Activity_Course.value = Course ;
    Activity_Description.value = Desciption ;
    let te = document.createElement('option');
    te.value = Participants;
    te.innerHTML = "Grade "+ Participants ;
    Activity_Class_Participants.appendChild(te);
    Activity_Class_Participants.value =  Participants ;
    temp.setMinutes(temp.getMinutes() - temp.getTimezoneOffset());
    Activity_Start.value =temp.toISOString().slice(0,16);
    temp2.setMinutes(temp2.getMinutes() - temp2.getTimezoneOffset());
    Activity_End.value =temp2.toISOString().slice(0,16);
    sessionStorage.setItem("Task_ID",id);
    See_Outer.style.display = "block"
});
};
See_Outer.addEventListener("click",()=>{
    View_Tab.style.display = "block";
    main.style.opacity = "0.5";
    main.style.pointerEvents = "none";
})
document.getElementById('New-Activity').addEventListener('click',()=>{
    Open_Add_New_Activity();
});
function Open_Add_New_Activity(){
    Empty_Task_Page();
    sessionStorage.removeItem("Task_ID");
    Make_Editable("New");
    Open_New_Task_Page();
    Activity_Attachments.style.pointerEvents = "all";
    document.getElementById('View-Table').style.pointerEvents = "all";
    Edit_Btn.style.display = 'none';
    Reset_Btn.style.display = 'initial';
    Assign_Btn.style.display = 'initial';
    Delete_Btn.style.display = 'none';
    Get_Participants_Class();
    Clear_Student_View();
    Clear_View_Part_Tab();
    See_Outer.style.display = "none";
}
var View_Tab = document.getElementsByClassName('View-Participants-Tab')[0];
var View_Par_Inner = document.getElementById('View-Participant-Inner');
function Clear_View_Part_Tab(){
    View_Par_Inner.innerHTML = "";
}
var Comment_Cont = document.getElementById('Comments-Container');

var Student_View_Grade =document.getElementById('Student-Grade-Entry');
var Student_View = document.getElementById('Edit-View-Participant');
function Clear_Student_View(){
    let Detail = Student_View.getElementsByClassName('Student-Details');
    Detail[0].innerHTML = "";
    let Status =  Student_View.getElementsByClassName('Student-Status');
    Status[0].innerHTML = "";
    Student_View_Grade.value = "";
    Comment_Cont.innerHTML = "";
    sessionStorage.removeItem('StudentName');
    New_Comment_Input.value = "";
    New_Comment_Input.className = "";
}
Reset_Btn.addEventListener("click",()=>{
    Empty_Task_Page();
})
function fill_View_Par_Tab(results){
    const collRef = collection(db,'Student');
    onSnapshot(collRef , (snapshot)=>{
    Clear_View_Part_Tab();
    let Students = []
    snapshot.docs.forEach(doc => {
    Students.push({ ...doc.data(), id: doc.id })
    });
    for(let i = 0 ; i< results.length ; i++){
        let participant = document.createElement('div');
        participant.className = "Participant";
        let participant_Name = document.createElement('div');
        participant_Name.className = "Participant-Name";
        let participant_Edit = document.createElement('div');
        participant_Edit.className = "Edit-Participants";
        for(let j = 0 ; j<Students.length ; j++){
            if(Students[j]["ID"] == results[i]["id"]){
                participant_Name.innerHTML = Students[j]["First-Name"]+" "+Students[j]["Last-Name"];
                participant_Edit.id = Students[j]["ID"];
                participant_Edit.addEventListener("click",(e)=>{
                    View_Participating_Student(e.target.id)
                });
            };
            participant.appendChild(participant_Name);
            participant.appendChild(participant_Edit);
            View_Par_Inner.appendChild(participant);
        }
    }
})};

var New_Comment_Input = document.getElementById('New-Comment');
function View_Participating_Student(id){
Clear_Student_View();
Student_Attach.style.display = "none";
sessionStorage.removeItem("Missing");
View_Par_Inner.style.display = "none";
Student_View.style.display = "grid";
New_Comment_Input.classList.add(id);
const colRef = collection(db,'Student');
var id2 = parseInt(id);
const q = query(colRef,where("ID","==",id2))
onSnapshot(q,(snapshot)=>{
    var Students=[];
    snapshot.docs.forEach(doc => {
        Students.push({ ...doc.data(), id: doc.id })
    });
    var doc = Students[0];
    let Detail = Student_View.getElementsByClassName('Student-Details');
    Detail[0].innerHTML = "";
    let id_tag = document.createElement('p');
    id_tag.innerHTML = "ID: "+id; 
    let name = document.createElement('p');
    let fname = doc["First-Name"]+" "+doc["Last-Name"];
    sessionStorage.setItem('StudentName',fname);
    name.innerHTML = "Name: "+fname;
    Detail[0].appendChild(id_tag);
    Detail[0].appendChild(name);
});
let Tid = sessionStorage.getItem("Task_ID");
let Now = Timestamp.fromDate(new Date());
    const docRef3 = doc(db,"Tasks",Tid);
    onSnapshot(docRef3 , (doc)=>{
        let Due = doc.data()["Due"];
        if(Due < Now){
            sessionStorage.setItem("Missing",1)
        }        
    })
    const docRef2 = doc(db,"Tasks",Tid,"Results",id);
    onSnapshot(docRef2 ,(doc)=>{
        let Status =  Student_View.getElementsByClassName('Student-Status');
        Status[0].innerHTML = "";
        let stat = document.createElement('p');
        let Missing = sessionStorage.getItem("Missing");
        
        if(Missing && doc.data()["Status"] == "Pending"){
            stat.innerHTML = "Status: Missing";
            stat.style.color = "red";
            Status[0].appendChild(stat);
            Student_View_Grade.style.pointerEvents = "none" ;
        }else if(doc.data()["Status"] == "Pending"){
            stat.innerHTML = "Status: "+doc.data()["Status"];
            Status[0].appendChild(stat);
            Student_View_Grade.style.pointerEvents = "none" ;
        }else{
            CAlert("Info","To Change The Students Grade , Simply Click On The Field And Enter The New Grade And Click Enter On Your KeyBoard",5000,30);
            stat.innerHTML = "Status: "+doc.data()["Status"];
            Status[0].appendChild(stat);
            Student_View_Grade.style.pointerEvents = "all" ;
            Student_View_Grade.className = id;
        }
        let att = sessionStorage.getItem("Online")
        if(doc.data()["Status"] == "Done" && att){
            Student_Attach.addEventListener('click',()=>{
                let starsRef = ref(storage,doc.data()["Attachments"]);
                getDownloadURL(starsRef).then((url) => {
                    window.open(url);
                }).catch((error) => {
                    console.log(error);
                });
            })
            Student_Attach.style.display = "initial"
        }
        Student_View_Grade.value = "";
        Student_View_Grade.value = doc.data()["Score"];
        Comment_Cont.innerHTML = "";
        if(doc.data()["Comments"].length == "0"){
            Comment_Cont.innerHTML = "No Direct Messages"
        }else{
            let ComArr = doc.data()["Comments"];
            for(let i = 0 ; i<ComArr.length ; i++){
                let Array = ComArr[i].split("##SPLIT##");
                let Comment = document.createElement('div');
                Comment.className = "Comment";
                let Commenter = document.createElement('div');
                Commenter.className = "Commenter";
                let Sender = document.createElement('span');
                let MyID = sessionStorage.getItem("ID");
                if(Array[0]== MyID){
                    Sender.innerHTML = "You";
                    Comment.classList.add("My-Comment")
                }else{
                    Sender.innerHTML = sessionStorage.getItem('StudentName');
                }
                Commenter.appendChild(Sender)
                let Time = document.createElement('span');
                let temp = parseFloat(Array[1])
                var date = new Date(temp*1000);
                date.toLocaleString();
                Time.innerHTML = date.toLocaleDateString() + " "+date.toLocaleTimeString();
                Commenter.appendChild(Time);
                Comment.appendChild(Commenter);
                let Comment_Text = document.createElement('div');
                Comment_Text.className = "Comment-Text";
                Comment_Text.innerHTML = Array[2];
                Comment.appendChild(Comment_Text);
                Comment_Cont.appendChild(Comment);
            }
        }
    });
    sessionStorage.removeItem("Missing");
}

Student_View_Grade.addEventListener("keyup",async (e)=>{
    if (e.keyCode == 13) {
        if(e.target.value > "100"){
            CAlert("Warning", "Please Enter A Grade Les Than Or Equal To 100");
            e.currentTarget.blur();
            e.currentTarget.value = 0;
            return;
        }else{
        let id = e.target.className ;
        let Score = parseInt(e.target.value);
        let Tid = sessionStorage.getItem("Task_ID");
        const docRef = doc(db,"Tasks",Tid,"Results",id);
        updateDoc(docRef,{
            Score:Score
        });
        e.currentTarget.blur();
    }}
})
New_Comment_Input.addEventListener("keyup",async (e)=>{
    if(e.keyCode == 13) {
        let id = e.target.className;
        let Tid = sessionStorage.getItem("Task_ID");
        const docRef = doc(db,"Tasks",Tid,"Results",id);
        var length = [] ;
        await getDoc(docRef,(doc)=>{
            length .push(doc.data()["Comments"].length) ;
        })
        let MyId = sessionStorage.getItem('ID');
        var time = Timestamp.fromDate(new Date());
        var message = MyId+"##SPLIT##"+time.seconds+"."+time.nanoseconds+"##SPLIT##"+e.target.value ;
        if(length[0]=="0"){
            await updateDoc(docRef,{
                Comments:[message]
            })
        }else{
            await updateDoc(docRef,{
                Comments: arrayUnion(message)
            })
        }
        e.target.value ="";
        e.target.blur();
    }
})
function Get_Participants_Class(){
const colRef = collection(db, "Courses");
var ID = sessionStorage.getItem("ID");
const  q = query(colRef, where("Teacher-ID" , "==" , ID ));
onSnapshot(q, (snapshot) => {
let courses = []
snapshot.docs.forEach(doc => {
  courses.push({ ...doc.data(), id: doc.id })
  
});
    for( let i = 0 ; i<courses.length ; i++){
        Fill_Participats_Drop(courses[i]);
    }
})};

function Fill_Participats_Drop(courses){
    let option = document.createElement('option');
    let Participants_Class = courses["Participants"];
    option.value = Participants_Class ;
    option.innerHTML = Participants_Class ;
    option.addEventListener("click",(e)=>{
        New_Task_Participants_View(e.target.value);
    })
    Activity_Class_Participants.appendChild(option);
}
document.getElementById('In-Class').addEventListener('click' ,()=>{
    CAlert("Warning","Please Note That In-Class Submissions Will Disable The Ability To Attach Files For Students",4000,25);
});
async function New_Task_Participants_View(value){
    View_Par_Inner.innerHTML = "";
    See_Outer.style.display = "none";
    NParticipants.innerHTML = "";
    SeeParticipants.style.display = "none";
    const colRef = collection(db,"Student")
    const q = query(colRef , where("Grade","==",value));
    const querySnapshot = await getDocs(q);
    const Names = [];
    querySnapshot.forEach((doc) => {
    let name = doc.data()["First-Name"]+" "+doc.data()["Last-Name"];
    Names.push(name);
});
for(let i = 0 ; i<Names.length ; i++){
    let participant = document.createElement('div');
    participant.className = "Participant";
    let participant_Name = document.createElement('div');
    participant_Name.className = "Participant-Name";
    participant_Name.innerHTML = Names[i];
    participant.appendChild(participant_Name);
    View_Par_Inner.appendChild(participant);
}
NParticipants.innerHTML = Names.length + " Participant"
See_Outer.style.display = "block" ;
SeeParticipants.style.display = "block";
}




var Existing_Activities_Container = document.getElementById('Existing-Activities-Container');
window.onload = Existing_Activities_Func() ;
window.onload = ActiveLink();
function ActiveLink(){
let link = document.getElementById('Activities-Page');
  link.classList.add('Active');
};
document.getElementById('Close-Tab-Btn').addEventListener("click",()=>{
    let display = View_Par_Inner.style.display ;
    let clasName = Activity_Description.classList[0];
    if(display == "none"){
        Student_View.style.display = "none";
        Clear_Student_View();
        View_Par_Inner.style.display = "block";
    }else{
        View_Par_Inner.style.display = "block";
        View_Tab.style.display= "none";
        main.style.opacity = "1";
        main.style.pointerEvents = "all";
        if(clasName != "Editable-Field"){
            Clear_Student_View();
        }
    }
});
Edit_Btn.addEventListener("click",()=>{
    New_Task_Page.style.pointerEvents = "all";
    document.getElementById('View-Table').style.pointerEvents = "all";
    CAlert("Info","Please Note That Task Course And Participating Class Are UnEditable !",5000,20)
    Edit_Btn.style.display = "none";
    Delete_Btn.style.display = "none";
    Assign_Btn.style.display = "initial";
    Reset_Btn.style.display = "initial";
    Make_Editable();
    sessionStorage.setItem('EditOrNot',1)
    Confirm_Delete.style.display ="none";
});
Reset_Btn.addEventListener("click",()=>{
    let cond = Activity_Course.classList[0] ;
    Confirm_Delete.style.display ="none";
    sessionStorage.removeItem('EditOrNot')
    if(cond == "Uneditable-Field"){
     let id = sessionStorage.getItem("Task_ID");
     Fill_View_Page(id);
    }else{
        Empty_Task_Page();
    sessionStorage.removeItem("Task_ID");
    Open_New_Task_Page();
    document.getElementById('View-Table').style.pointerEvents = "all";
    Edit_Btn.style.display = 'none';
    Reset_Btn.style.display = 'initial';
    Assign_Btn.style.display = 'initial';
    Delete_Btn.style.display = 'none';
    Get_Participants_Class();
    Make_Editable("New");
    Clear_Student_View();
    Clear_View_Part_Tab();
    }
});
function Make_Editable(cond){
    Activity_Title.classList.remove('Uneditable-Field');
    Activity_Title.classList.add('Editable-Field');
    Activity_Description.classList.remove('Uneditable-Field');
    Activity_Description.classList.add('Editable-Field');
    Submissions_Type.classList.remove('Uneditable-Field');
    Submissions_Type.classList.add('Editable-Field');
    Activity_Attachments.classList.remove('Uneditable-Field');
    Activity_Attachments.classList.add('Editable-Field');
    Activity_Start.classList.remove('Uneditable-Field');
    Activity_Start.classList.add('Editable-Field');
    Activity_End.classList.remove('Uneditable-Field');
    Activity_End.classList.add('Editable-Field');
    Activity_Score.classList.remove('Uneditable-Field');
    Activity_Score.classList.add('Editable-Field');
    if(cond == "New"){
        Activity_Course.classList.remove('Uneditable-Field');
        Activity_Course.classList.add('Editable-Field');
        Activity_Class_Participants.classList.remove('Uneditable-Field');
        Activity_Class_Participants.classList.add('Editable-Field');
    }
};
function Make_UnEditable(){
    sessionStorage.removeItem("EditOrNot");
    Activity_Title.classList.add('Uneditable-Field');
    Activity_Title.classList.remove('Editable-Field');
    Activity_Description.classList.add('Uneditable-Field');
    Activity_Description.classList.remove('Editable-Field');
    Submissions_Type.classList.add('Uneditable-Field');
    Submissions_Type.classList.remove('Editable-Field');
    Activity_Attachments.classList.add('Uneditable-Field');
    Activity_Attachments.classList.remove('Editable-Field');
    Activity_Start.classList.add('Uneditable-Field');
    Activity_Start.classList.remove('Editable-Field');
    Activity_End.classList.add('Uneditable-Field');
    Activity_End.classList.remove('Editable-Field');
    Activity_Score.classList.add('Uneditable-Field');
    Activity_Score.classList.remove('Editable-Field');
    Activity_Course.classList.add('Uneditable-Field');
    Activity_Course.classList.remove('Editable-Field');
    Activity_Class_Participants.classList.add('Uneditable-Field');
    Activity_Class_Participants.classList.remove('Editable-Field');
};
var Confirm_Delete = document.getElementById('Conf-Delete-Task');
Assign_Btn.addEventListener("click",()=>{
    Confirm_Delete.style.display ="none";
    let which = sessionStorage.getItem("EditOrNot");
    if(which){
        let id = sessionStorage.getItem('Task_ID');
        Update_Task(id);
        Make_UnEditable();
    }else{
        Create_New_Task();
    }
});
async function Update_Task(id){
    const docRef = doc(db,"Tasks",id);
    let Title = Activity_Title.value ;
    let Desciption = Activity_Description.value ;
    let Submission = Submissions_Type.value ;
    let Start = Activity_Start.value ;
    let End = Activity_End.value ;
    let actualStar = Timestamp.fromDate(new Date(Start));
    let actualEnd = Timestamp.fromDate(new Date(End));
    let weight= Activity_Score.value ;
    if(Submission == "0" ||Title ==""||Desciption ==""||isNaN(actualEnd)||isNaN(actualStar)||weight == ""){
        CAlert("Warning","Please Fill In The Empty Fields");
    }else{
        const docSnap = await getDoc(docRef);
        let OldSubmission = docSnap.data()["Submissions"];
        const colRef = collection(db,"Tasks",id,"Results");
        const querySnapshot = await getDocs(colRef);
        const IDS = [];
        querySnapshot.forEach((doc) => {
            let name = doc.id;
            IDS.push(name);
        });
        if(OldSubmission == Submission){
            await updateDoc(docRef,{
                Title:Title,
                Description:Desciption,
                Due:actualEnd,
                Start:actualStar,
                Weight:weight
            });
        }else if(OldSubmission != Submission && Submission == "In-Class"){
            await updateDoc(docRef,{
                Title:Title,
                Description:Desciption,
                Due:actualEnd,
                Start:actualStar,
                Weight:weight,
                Submissions:Submission
            });
            for( let i = 0 ; i<IDS.length ; i++){
                const docRef2 = doc(db,"Tasks",id,"Results",IDS[i]);
                await updateDoc(docRef2, {
                    Attachments:deleteField()
                });
            }
        }else if(OldSubmission != Submission && Submission == "Online"){
            await updateDoc(docRef,{
                Title:Title,
                Description:Desciption,
                Due:actualEnd,
                Start:actualStar,
                Weight:weight,
                Submissions:Submission
            });
            for( let i = 0 ; i<IDS.length ; i++){
                const docRef2 = doc(db,"Tasks",id,"Results",IDS[i]);
                await updateDoc(docRef2, {
                    Attachments:""
                });
            }
        }
        let DocIDS = [];
        let NotifLength = [];
        for(let j = 0 ; j< IDS.length ; j++){
            const collRef3 = collection(db,"Student")
            const q = query(collRef3,where("ID","==",parseInt(IDS[j])));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                let name = doc.id;
                DocIDS.push(name);
                let not = doc.data()["Notifications"].length ;
                NotifLength.push(not);
            });
        }
        var now = new Date();
        var time = now.toDateString()+" at "+now.toLocaleTimeString();
        var msg = "Updated Task ##SPLIT##"+time+"##SPLIT##"+"Your Teacher Has Modified An Ongoing Task , Make Sure To See The Changes .";
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
    }
    Fill_View_Page(id);
}
}
Delete_Btn.addEventListener('click',()=>{
    CAlert("Warning","Are You Sure You Want To Delete This Task , This Action Cant Be Undone",5000,25);
    Confirm_Delete.style.display = "initial";
    Delete_Btn.style.display = "none";
    Confirm_Delete.style.pointerEvents ="all";
    Make_UnEditable();
});
Confirm_Delete.addEventListener("click", async ()=>{
    Confirm_Delete.style.display ="none";
    let id = sessionStorage.getItem("Task_ID");
    sessionStorage.removeItem("Task_ID");
    const colRef = collection(db,"Tasks",id,"Results");
    const querySnapshot = await getDocs(colRef);
    const IDS = [];
    querySnapshot.forEach((doc) => {
    let name = doc.id;
    IDS.push(name);
    });
    for(let i = 0 ; i<IDS.length ; i++){
        await deleteDoc(doc(db, "Tasks", id,"Results",IDS[i]));
    };
    await deleteDoc(doc(db, "Tasks", id));
    const desertRef = ref(storage, 'tasks/'+id);
    deleteObject(desertRef).then(() => {
    }).catch((error) => {
        console.log(error);
    });
    Open_Add_New_Activity();
})
async function Create_New_Task(){
    let Title = Activity_Title.value ;
    let Course = Activity_Course.value ;
    let Description = Activity_Description.value;
    let Class = Activity_Class_Participants.value ;
    let Submission = Submissions_Type.value ;
    let temp = sessionStorage.getItem("ID");
    let id = parseInt(temp)
    let Start = Activity_Start.value ;
    let actualStar = Timestamp.fromDate(new Date(Start));
    let End = Activity_End.value ;
    let actualEnd = Timestamp.fromDate(new Date(End));
    let weight = Activity_Score.value ;
    let attachements = Activity_Attachments.files[0];
    const colRef = collection(db,"Student");
    const q = query(colRef , where("Grade","==",Class));
    const querySnapshot = await getDocs(q);
    const StudentId = [];
    querySnapshot.forEach((doc) => {
    let name = doc.data()["ID"];
    StudentId.push(name);
    Send_Notif(doc,Course,End);
    })
    if(Submission == "0" ||Course==""|| Class =="0"||Title ==""||Description ==""||isNaN(actualEnd)||isNaN(actualStar)||weight == ""){
        CAlert("Warning","Please Fill In The Empty Fields");
    }else{
        const docRef = await addDoc(collection(db, "Tasks"), {
        Title: Title,
        Description:Description,
        Start: actualStar,
        Due: actualEnd,
        Submissions:Submission,
        Weight:weight,
        'Teacher-ID':id,
        'Participants-Class':Class ,
        'Course-Name':Course
    });
    var Docid = docRef.id ;
    for(let j = 0 ; j< StudentId.length ; j++){
        let Vid = StudentId[j].toString();
        if(Submission == "Online"){
        await setDoc(doc(db, "Tasks",Docid,"Results",Vid), {
            Status: "Pending",
            Score: 0,
            Attachments:"",
            Comments:[]
        })}else{
        await setDoc(doc(db, "Tasks",Docid,"Results",Vid), {
            Status: "Pending",
            Score: 0,
            Comments:[]
        })}
    }
        if(attachements == null ){
            CAlert("Warning","No Attachements Were Found , This Activity Will Be With No Attachements!");
        }else{
            let path = 'tasks/'+Docid+'/'+'Teacher/'+attachements.name
            const storageRef = ref(storage, path );
            uploadBytes(storageRef, attachements).then((snapshot) => {});
            const docRef = doc(db , "Tasks",Docid)
            await updateDoc(docRef,{
                Attachments:path
            });
        }
        Empty_Task_Page();
        Make_UnEditable();
    }
};
async function Send_Notif(document,course,end){
let length = document.data()["Notifications"].length;
let id = document.id;
var now = new Date();
var time = now.toDateString()+" at "+now.toLocaleTimeString();
let Notif = "New Task ##SPLIT##"+time+"##SPLIT##You have a new task for course "+course+" that is Due on :"+end ;
const docRef = doc(db,"Student",id);
if(length == "0"){
    await updateDoc(docRef,{
        Notifications:[Notif]
    })
}else{
    await updateDoc(docRef,{
        Notifications:arrayUnion(Notif)
    })
}
}