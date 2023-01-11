import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {onAuthStateChanged , signOut , getAuth } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";
import { getFirestore, collection, onSnapshot,query, where,getDocs} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
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
const storage = getStorage(app);
const auth = getAuth();
const db = getFirestore(app) ;
var Blogs_container = document.getElementById('Blogs-Cont');
var linkBoxes = document.getElementsByClassName('Link-Box');
let Nav_Cont = document.getElementById('Nav-Cont');
window.onload = ()=>{
  const colRef = collection(db, "Blogs");
  onSnapshot(colRef, (snapshot) => {
  let Blogs = []
  snapshot.docs.forEach(doc => {
    Blogs.push({ ...doc.data(), id: doc.id })
  });
    Blogs_container.innerHTML = "";
    for(let i = 0 ; i<Blogs.length ; i++){
      if(Blogs[i]["ispopular"] == true){
        Material_Gworl(Blogs[i]);
      }
    }
})};
function Material_Gworl(blogs){
  let Blog_Picture = document.createElement('img');
  Blog_Picture.className = "Blog-Image";
  let Blog = document.createElement('div');
  Blog.className = "Blog";
  Blog.id = blogs["id"];
  let starsRef = ref(storage, blogs["image"]);
  getDownloadURL(starsRef)
  .then((url) => {
  Blog_Picture.src = url ;
  })
  .catch((error) => {
  console.log(error);
  });
  Blog.appendChild(Blog_Picture);
  let Title = document.createElement('p');
  Title.className = "Blog-Title";
  Title.innerHTML = blogs["title"];
  Blog.appendChild(Title);
  let Author = document.createElement('p');
  Author.className = "Writer";
  Author.innerHTML = blogs["publisher"];
  Blog.appendChild(Author);
  let Date = document.createElement('p');
  Date.className = "Publish-Date";
  Date.innerHTML ="By: "+ blogs["history"];
  Blog.appendChild(Date);
  Blog.addEventListener("click",()=>{
      See_Blog(Blog.id);
  })
  Blogs_container.appendChild(Blog);
}
var Classes_Cont = document.getElementById('Classes-Cont');
onAuthStateChanged(auth , (user)=>{
    if(user){
        let temp = user.email.split("@");
        let ID = temp[0];
        Name(ID);
        let temp2 = ID.slice(0,2);
        sessionStorage.setItem("ID",ID)
        if(temp2 == "11"){
          Studefiy();
          sessionStorage.setItem("Student",true);
          document.title = "Student Main"
        }
        Nav_Cont.style.display = "flex";
        let date = (new Date()).toDateString().split(" ")[0];
        if(date == "Sat"||date == "Sun"){
              let p = document.createElement('p');
              p.innerHTML = "You Have No Classes Today";
              p.style.fontSize = "2rem";
              p.style.marginBottom ="0.75rem" 
        }else{
          Todays_Classes("Today",date);

        }
    }
})
function Name(id){
    let Student = sessionStorage.getItem("Student");
    var colRef = null;
    if(Student){
        colRef = collection(db,"Student");
    }else{
        colRef = collection(db,"Teacher");
    }
    const q = query(colRef,where("ID","==",parseInt(id)))
    onSnapshot(q,(snapshot)=>{
        let doc = snapshot.docs[0];
        let name = doc.data()["First-Name"]+" "+doc.data()["Last-Name"];
        document.getElementById('User-Name').innerHTML = name;
        sessionStorage.setItem("Grade",doc.data()["Grade"])
    })
};

function Studefiy(){
    linkBoxes[1].getElementsByTagName('a')[0].href = "ActivitiesS.html";
    linkBoxes[2].innerHTML = "";
    linkBoxes[3].innerHTML = "";
    let a1 = document.createElement('a');
    a1.href = "Petitions.html";
    a1.className = "Nav-Link";
    let s1 = document.createElement('span');
    s1.className = "material-icons";
    s1.innerHTML = "history_edu";
    a1.appendChild(s1);
    let p1 = document.createElement('p');
    p1.className = "Nav-Title";
    p1.innerHTML = "Petitions";
    a1.appendChild(p1);
    let p2 = document.createElement('p');
    p2.className = "Discription";
    p2.innerHTML = "Click to see or submit a petition";
    a1.appendChild(p2);
    linkBoxes[2].appendChild(a1);
    linkBoxes[3].style.display = "none"; 
    linkBoxes[1].getElementsByClassName('Discription')[0].innerHTML= "Click To See and Submit Your Tasks";
    linkBoxes[4].getElementsByClassName('Discription')[0].innerHTML= "Click To View Your Announcements";
}
console
export async function Todays_Classes(Cond,day){
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
          Build_Classes(TodaysClasses,"Today");

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
      Build_Classes(TodaysClasses,"Today");
}}
function Build_Classes(Classes,cond){
  Classes_Cont.innerHTML = "";
  let p = document.createElement('p');
  p.innerHTML = "Todays Classes :"
  p.style.fontSize = "2rem";
  p.style.marginBottom ="0.75rem" 
  Classes_Cont.appendChild(p)
  let temp = (new Date).toLocaleTimeString().split(":");
  let AfterNoon = (new Date).toTimeString().split(":");
  let time = temp[0]+":"+temp[1];
  for(let i = 0 ; i<Classes.length ; i++){
      let Cs = document.createElement('div');
      Cs.className = "Class";
      let sp1 = document.createElement('span');
      sp1.className = "material-icons-round";

      console.log(AfterNoon[0])
      if(AfterNoon[0] > 15 && (AfterNoon[0] < 23 && AfterNoon[1]< 59 )){
        sp1.innerHTML = "check_circle";
        Cs.appendChild(sp1);
    }else if(AfterNoon[0] >= "08" && AfterNoon[0] <= "07"){
        sp1.innerHTML = "pending";
        sp1.style.color = "orange";
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