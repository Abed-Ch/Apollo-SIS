import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { CAlert } from "./CAlert.js";
import {onAuthStateChanged , signOut , getAuth ,reauthenticateWithCredential , EmailAuthProvider , updatePassword} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getFirestore, onSnapshot, doc,collection,query,where,
    
    updateDoc} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";;
  
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
var Profile_Name = document.getElementById('Profile-Name');
var Account_Tab = document.getElementById('Account-Tab');
var Password_Tab = document.getElementById('Password-Tab');
var LogOut_Tab = document.getElementById('Logout-Tab');
var Account_Page = document.getElementById('Account-Page');
var ReAuth_Page = document.getElementById('ReAuth-Page');
var Password_Page = document.getElementById('Password-Page');
var LogOut_Page = document.getElementById('LogOut-Page');
var U_id = document.getElementById('User-ID');
var U_Email = document.getElementById('User-Email');
var U_FName = document.getElementById('First-Name');
var U_LName = document.getElementById('Last-Name');
var U_Birth = document.getElementById('Birth-Date');
var U_Pnumber = document.getElementById('Primary-Number');
var U_Add = document.getElementById('Address');
var U_Info = document.getElementsByClassName('User-Info');
var Cancel_Btn = document.getElementById('Cancel');
var Edit_Btn = document.getElementById('Edit');
var Confirm_Btn = document.getElementById('Confirm');
onAuthStateChanged(auth , (user =>{
    Account_Page.style.display= "none";
    Empty_Account_Page();
    ReAuth_Page.style.display = "none";
    Password_Page.style.display = "none";
    if(user){
    LogOut_Page.style.display = "none";
        sessionStorage.clear();
        let email = user.email ;
        let id = email.split("@")[0];
        let isSt = id.slice(0,2);
        if(isSt == "11"){
            sessionStorage.setItem("Student",true)
        }else{
           
        }
        sessionStorage.setItem("Email",email);
        sessionStorage.setItem("ID",id);
    }else{
        let Pr = sessionStorage.getItem("PassReset");
        if(Pr == "true" ){
        }else{
            CAlert("Error","You Are Not Logged IN , Redirecting To Home Screen");
        }
        sessionStorage.clear();
        localStorage.clear();
        setTimeout(()=>{
        Redirect() 
    }, 3000); 
    }
}));
window.onload = Start_UP();
Account_Tab.addEventListener("click",Start_UP())
function Start_UP(){
    Account_Tab.classList.add("Active");
    Password_Tab.classList.remove("Active");
    ReAuth_Page.style.display = "none";
    Password_Page.style.display = "none";
    LogOut_Page.style.display = "none";
    Profile_Info();
}
function Redirect(){
    window.close();
}
function Empty_Account_Page(){
    U_id.value = "";
    U_Email.value = "";
    U_FName.value = "";
    U_LName.value = "";
    U_Birth.value = "";
    U_Pnumber.value = "";
    U_Add.value = "";
}
function Profile_Info(){
    var ID = sessionStorage.getItem("ID");
    let Student = sessionStorage.getItem("Student");
    var colRef ;
    if(Student){
       colRef =  collection(db,'Student');
    }else{
        colRef =  collection(db,'Teacher');
    }
    const q = query(colRef,where("ID","==",parseInt(ID)));
    onSnapshot(q , (snapshot)=>{
    var document = snapshot.docs[0].data();
    var docID = snapshot.docs[0].id ;
    sessionStorage.setItem("DocID",docID);
    Empty_Account_Page();
    let Name = document["First-Name"]+" "+document["Last-Name"];
    Profile_Name.innerHTML = Name ;
    U_id.value = ID ;
    U_id.classList.add("UnEditable");
    if(document["Email"]){
        U_Email.value = document["Email"];
    }else{
        U_Email.value = document["email"];
    }
    U_Email.classList.add("UnEditable");
    U_FName.value = document["First-Name"] ;
    U_FName.classList.add("UnEditable");
    U_LName.value = document["Last-Name"];
    U_LName.classList.add("UnEditable");
    let BirthArr = document["Birth-Date"].split("-");
    let month = toMonthName(BirthArr[1]);
    let day = toNumberName(BirthArr[0]);
    U_Birth.classList.add("UnEditable");
    U_Birth.value = day + " of "+month + " , "+BirthArr[2];
    U_Pnumber.value = document["Primary-Number"];
    U_Pnumber.classList.add("UnEditable");
    U_Add.value = document["Address"];
    U_Add.classList.add("UnEditable");
    Cancel_Btn.style.display = "none";
    Confirm_Btn.style.display = "none";
    Edit_Btn.style.display = "initial";
    Account_Page.style.display = "grid";
})
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
function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('en-US', {
      month: 'long',
    });
}
Cancel_Btn.addEventListener("click",()=>{
    U_Birth.classList.remove("Editable");
    U_Add.classList.remove("Editable");
    U_Pnumber.classList.remove("Editable");
    U_Birth.classList.add("UnEditable");
    U_Add.classList.add("UnEditable");
    U_Pnumber.classList.add("UnEditable");
    Cancel_Btn.style.display = "none";
    Confirm_Btn.style.display = "none";
    Edit_Btn.style.display = "initial";
});
Confirm_Btn.addEventListener("click",()=>{
    Edit_Btn.style.display = "initial";
    Cancel_Btn.style.display = "none";
    Confirm_Btn.style.display = "none";
    U_Pnumber.classList.add("UnEditable");
    U_Add.classList.add("UnEditable");
    U_Birth.classList.add("UnEditable");
    U_Birth.classList.remove("Editable");
    U_Add.classList.remove("Editable");
    U_Pnumber.classList.remove("Editable");
    Implement_Changes();
});
Edit_Btn.addEventListener("click",()=>{
    U_Birth.classList.remove("UnEditable");
    U_Add.classList.remove("UnEditable");
    U_Pnumber.classList.remove("UnEditable");
    U_Birth.classList.add("Editable");
    U_Add.classList.add("Editable");
    U_Pnumber.classList.add("Editable");
    Cancel_Btn.style.display = "initial";
    Edit_Btn.style.display = "none";
    Confirm_Btn.style.display = "initial";
});
function Implement_Changes(){
    var ID = sessionStorage.getItem("DocID");
    var Person ;
    let student = sessionStorage.getItem("Student");
    if(student){
        Person  = doc(db,'Student',ID);
    }else{
        Person =  doc(db,'Teacher',ID);
    }
    let temp = U_Birth.value ;
    let NBirt = Get_New_Birth(temp);
    let Pnum = U_Pnumber.value ;
    let Add = U_Add.value ;
    updateDoc(Person , {
     "Birth-Date": NBirt ,
     "Primary-Number": Pnum ,
     "Address":Add 
    }).then(()=>{
        console.log("Done")
    })
}
function Get_New_Birth(birthday){
    let temp = birthday.split(" ");
    let month = MonthToNum(temp[2]);
    let year = temp[4];
    let FD = temp[0].charAt(0);
    let temp2 = temp[0].charAt(1);
    if(isNaN(temp2)){
        return FD+"-"+month+"-"+year ;
    }else{
        return FD+temp2+"-"+month+"-"+year ;
    }
}
function MonthToNum(month){
    var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    let monthNum = months.indexOf(month)+1 ;
    return monthNum;
}
Password_Tab.addEventListener("click",()=>{
    Account_Page.style.display = "none";
    ReAuth_Page.style.display = "grid";
});
var ReAuth_Pass = document.getElementById('ReAuth-Pass');
document.getElementById('ReAuth-Btn').addEventListener("click",()=>{
    let password = ReAuth_Pass.value ;
    let credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
    reauthenticateWithCredential(auth.currentUser, credential)
    .then(result => {
        ReAuth_Pass.value = "";
        ReAuth_Page.style.display = "none";
        Reset_Pass_Page();
    }).catch((error)=>{
        CAlert("Error","You have entered an incorrect password");
        ReAuth_Pass.value = "";
        console.log(error);
    })
});
var Conf_Reset_Btn = document.getElementById('Conf-Reset-Pass');
var Reset_Pass_Btn = document.getElementById('Reset-Pass');
var Cancel_Pass_Res = document.getElementById('Cancel-Pass');
var Pass_1Vis = document.getElementById('Pass-Old-Vis');
var Pass_2Vis = document.getElementById('Pass-Conf-Vis');
var Pass_1_entered = document.getElementById('Pass-Old');
var Pass_2_entered = document.getElementById('Pass-Conf');
function Reset_Pass_Page(){
    Conf_Reset_Btn.style.display = "none";
    Cancel_Pass_Res.style.display = "none";
    document.getElementsByClassName('Password-Confirm')[0].style.display = "none";
    document.getElementsByClassName('Password-Old')[0].style.display = "none";
    Pass_1Vis.style.display="none";
    Pass_2Vis.style.display="none";
    Account_Tab.classList.remove('Active');
    Password_Tab.classList.add('Active');
    Password_Page.style.display = "grid";
}
Reset_Pass_Btn.addEventListener("click",()=>{
    Conf_Reset_Btn.style.display = "initial";
    Cancel_Pass_Res.style.display = "initial";
    document.getElementsByClassName('Password-Confirm')[0].style.display = "initial";
    document.getElementsByClassName('Password-Old')[0].style.display = "initial";
    Pass_1Vis.style.display="initial";
    Pass_2Vis.style.display="initial";
    Reset_Pass_Btn.style.display = "none";
    
})
Pass_1Vis.addEventListener("click",()=>{
    let what = Pass_1Vis.innerHTML ;
    if(what == "visibility"){
        Pass_1Vis.innerHTML = "visibility_off";
        Pass_1_entered.type = "text";
    }else{
        Pass_1Vis.innerHTML = "visibility";
        Pass_1_entered.type = "password";
    }
})
Pass_2Vis.addEventListener("click",()=>{
    let what = Pass_2Vis.innerHTML ;
    if(what == "visibility"){
        Pass_2Vis.innerHTML = "visibility_off";
        Pass_2_entered.type = "text";
    }else{
        Pass_2Vis.innerHTML = "visibility";
        Pass_2_entered.type = "password";
    }
});
Conf_Reset_Btn.addEventListener('click',()=>{
    CAlert("Warning","Please Note That Resetting Your Password Will Log You Out !!");
    Conf_Reset_Btn.style.display = "none";
    document.getElementById('Conf-Conf-Reset-Pass').style.display = "initial";
});
document.getElementById('Conf-Conf-Reset-Pass').addEventListener("click", ()=>{
    let pass  = Pass_1_entered.value ; 
    let pass2  = Pass_2_entered.value ; 
    if(pass == pass2){
        onAuthStateChanged(auth , (user) =>{
            if(user){
                updatePassword(user, pass).then(() => {
                    passwordUpdated();
                    }).catch((error) => {
                    console.log(error)
                    });
            }
        })
    }
});
function passwordUpdated(){
    CAlert("success","Password Reset Completed , Logging Out");
    sessionStorage.setItem("PassReset","true")
    signOut(auth).then(function(){}).catch(
        function (error) {
        console.log(error);
    });
}
LogOut_Tab.addEventListener("click",()=>{
    Account_Page.style.display = "none";
     ReAuth_Page.style.display = "none";
    Password_Page.style.display = "none";
    Account_Tab.classList.remove('Active');
    Password_Tab.classList.remove('Active');
    LogOut_Page.style.display = "grid";

});
document.getElementById('Confirm-LogOut').addEventListener('click',()=>{
    signOut(auth).then(function(){}).catch(
        function (error) {
        console.log(error);
    });
});
document.getElementById('Cancel-LogOut').addEventListener('click',Start_UP());