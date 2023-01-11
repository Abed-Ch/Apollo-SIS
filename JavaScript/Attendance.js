import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { CAlert } from "./CAlert.js";
import {onAuthStateChanged , getAuth } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getFirestore, collection, onSnapshot,getDocs,doc,getDoc,query, where , updateDoc , arrayUnion} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
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
onAuthStateChanged(auth, user => {
    if(user){
        let temp = user.email.split("@");
		if(temp[0].slice(0,2)=="11"){
            CAlert("Error","You Are Not A Teacher, Redirecting...");
            setTimeout(() => {
                window.location.href = "Tmain.html"
            }, 2000);
        }
        sessionStorage.clear();
        sessionStorage.setItem("ID" , temp[0]);
		Fill_Classes_Select(temp[0]);
    }else{
        CAlert("Error","You are not logged in , redirecting to main page");
        localStorage.clear();
        sessionStorage.clear();
        setTimeout(() => {
            window.location.href = "index.html";
        }, 2000);
    }
});
var Ctrl_Btns = document.getElementsByClassName('Controll-Btns')[0];
var Students_Table = document.getElementsByClassName('Students')[0];
var objToday = new Date(),
	weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
	dayOfWeek = weekday[objToday.getDay()],
	domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
	dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
	months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
	curMonth = months[objToday.getMonth()],
	curYear = objToday.getFullYear();
var today = dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
document.getElementsByClassName('Date')[0].innerHTML = "Recording Attendance for "+today ;
var Classes_Select = document.getElementById('Class-Select-List');
async function Fill_Classes_Select(id){
	const colRef = collection(db,"Courses");
	const q = query(colRef,where("Teacher-ID","==",id));
	Students_Table.style.display = "none";
	onSnapshot(q, (snapshot) => {
	Classes_Select.innerHTML = "";
	let Participants = [];
	snapshot.docs.forEach(doc => {
	Participants.push(doc.data()["Participants"]);
	});
	let empty = document.createElement('option');
	empty.innerHTML = "Choose A Class";
	empty.value = "0";
	Classes_Select.appendChild(empty)
	for(let i = 0 ; i<Participants.length ; i++){
		let option = document.createElement('option');
		option.value = Participants[i];
		let temp = Participants[i].split("-");
		option.innerHTML = "Grade "+temp[0]+" Section "+temp[1];
		Classes_Select.appendChild(option);
	}
	Classes_Select.addEventListener('change',(e)=>{
		let value = e.target.value ;
		if(value != "0"){
			Fill_Students(value);
		}
	})
})};
var Class_Info = document.getElementsByClassName('Class-Information')[0];
var Student_Container = document.getElementById('Students-Container');
async function Fill_Students(Class_Name){
	const docRef = doc(db,"Attendance","Qqt9UGitKD6AhSn4uL1L");
	const docSnap = await getDoc(docRef)
	let Record = docSnap.data()["Attendance-Record"];
	let Today = (new Date).toLocaleDateString();
	for(let i = 0 ; i<Record.length ; i++){
		let temp = Record[i].split("##SPLIT##");
		if(temp[0] == Class_Name){
			let Dtemp = temp[1].split("-");
			let D2temp = Today.split("/");
			if(Dtemp[0]==D2temp[0] && Dtemp[1]==D2temp[1] && Dtemp[2]==D2temp[2]){
				CAlert("Warning","Attendance For The Selected Class Has Been Taken For Today , Please Choose Another Class .",4000,25);
				return;
			}
		}
	}
	Classes_Select.style.pointerEvents = "none";
	Ctrl_Btns.style.display = "flex";
	sessionStorage.setItem("Grade",Class_Name)
	Class_Info.innerHTML = "";
	Students_Table.style.display ="block";
	const colRef = collection(db,"Student");
	const q = query(colRef,where("Grade","==",Class_Name));
	Student_Container.innerHTML = "";
	let Students = [];
	const querySnapshot = await getDocs(q);
	querySnapshot.forEach((doc) => {
		Students.push({ ...doc.data(), id: doc.id });
	});
	let p = document.createElement('p');
	p.innerHTML = "Total Number of Students: "+Students.length ;
	Class_Info.appendChild(p);
	for(let i = 0 ; i<Students.length ; i++){
		let Student = document.createElement('div');
		Student.className = "Student";
		let id = document.createElement('span');
		id.innerHTML = Students[i]["ID"];
		Student.appendChild(id)
		let Name = document.createElement('span');
		Name.innerHTML = Students[i]["First-Name"]+" "+Students[i]["Last-Name"];
		Student.appendChild(Name);
		let email = document.createElement('span');
		email.innerHTML = Students[i]["email"];
		Student.appendChild(email)
		let State = document.createElement('span');
		let slider = document.createElement('input');
		slider.type = "range";
		slider.min = "1";
		slider.max = "2";
		slider.value = "1";
		slider.className = "slider";
		slider.classList.add('Present');
		slider.id = Students[i]["id"];
		slider.addEventListener('change',(e)=>{
		var temp = e.target.classList[1];
		if(temp == "Present"){
			e.target.classList.remove('Present');
			e.target.classList.add('Absent');
		}else{
			e.target.classList.add('Present');
			e.target.classList.remove('Absent');
		}
		});
		State.appendChild(slider);
		Student.appendChild(State);
		Student_Container.appendChild(Student);
	}
const colRef1 = collection(db,"Courses");
let TId = sessionStorage.getItem('ID')
const q1 = query(colRef1,where("Teacher-ID","==",TId),where("Participants","==",Class_Name));
const querySnapshot2 = await getDocs(q1);
let docs = querySnapshot2.docs[0];
let MTimeLine = docs.data()["Timeline"];
for(let k = 0 ; k< MTimeLine.length ; k++){
	let temp= MTimeLine[k].split('-');
	if(temp[0] ==weekday[objToday.getDay()]){
		let p = document.createElement('p');
		if(sessionStorage.getItem("2")){
			Class_Info.style.fontSize = "1rem"
		}
		p.innerHTML = "Class Time: from "+temp[1]+" to "+temp[2];
		Class_Info.appendChild(p);
		sessionStorage.setItem("2",true)
	}
};
};
document.getElementById('Cancel-Button').addEventListener('click',()=>{
	Student_Container.innerHTML = "";
	Classes_Select.value = "0";
	Classes_Select.style.pointerEvents = "all";
	Class_Info.innerHTML = "";
	Students_Table.style.display = "none";
	Ctrl_Btns.style.display = "none";
	sessionStorage.removeItem("Grade");
});
document.getElementById('Confirm-Button').addEventListener('click',()=>{
	Confirm_Attendance();
	Ctrl_Btns.style.display = "none";
});
async function Confirm_Attendance(){
	const docRef = doc(db,"Attendance","Qqt9UGitKD6AhSn4uL1L");
	const docSnap = await getDoc(docRef)
	let Record = docSnap.data()["Attendance-Record"];
	let Today = (new Date).toLocaleDateString();
	let Grade = sessionStorage.getItem("Grade")
	for(let i = 0 ; i<Record.length ; i++){
		let temp = Record[i].split("##SPLIT##");
		if(temp[0] == Grade){
			let NewToday = Today.replaceAll('/','-');
			Record[i] = Grade+"##SPLIT##"+NewToday;
		}
	}
	await updateDoc(docRef,{
		'Attendance-Record':Record
	})
	let Scales = document.getElementsByClassName('slider');
	for(let i = 0 ; i<Scales.length; i++){
		if(Scales[i].classList[1]== "Absent"){
			Send_Notif(Scales[i].id);
		};
	};
	Student_Container.innerHTML = "";
	Classes_Select.value = "0";
	Classes_Select.style.pointerEvents = "all";
	Class_Info.innerHTML = "";
	sessionStorage.removeItem("Grade")
	Students_Table.style.display = "none";
};

async function Send_Notif(id){
	var now = new Date();
	var time = now.toDateString()+" at "+now.toLocaleTimeString();
	const docRef = doc(db,"Student",id);
	const docSnap = await getDoc(docRef);
	var message = "Absence Notification ##SPLIT##"+time+"##SPLIT##Dear "+docSnap.data()["First-Name"]+", You Were Set As Absent On "+time ; 
	let len = docSnap.data()["Notifications"].length ;
		if(len == "0"){
			updateDoc(docRef,{
				Notifications:[message]
			})
		}else{
			updateDoc(docRef,{
				Notifications:arrayUnion(message)
			})
		}
	}
;