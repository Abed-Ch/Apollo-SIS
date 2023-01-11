import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import * as db from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import { CAlert } from "./CAlert.js";

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
  const submit = document.getElementById("Submit");
  auth.signOut()
      .then(function () {
          console.log("Logged out Successfully");
      }).catch(function (error) {
          console.log(error);
  });
  submit.addEventListener('click', (e) => {
  e.preventDefault();
  let email = document.getElementById("ID-Input").value + "@apollosis.com";
  let password = document.getElementById("Password-Input").value ;
  let id = document.getElementById("ID-Input").value ;
  if ((id == "" ) || (password == "" )|| (isNaN(id) )){
    CAlert("Warning","Please Enter The Correct Id and Password");
    document.getElementById("ID-Input").value="";
    document.getElementById("Password-Input").value = "" ;
  }else{
    SIGNIN(email , password);
  }
}
);
function SIGNIN(email ,password) {
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
  
    const user = userCredential.user;
    
    CAlert("" , "You Have Succefully logged in")
    setTimeout(()=>{
      window.location.href = 'Tmain.html' 
    }, 2000)  ;
    // ...
  })
  
  .catch((error) => {
    CAlert("Error" , "You Have Entered An Incorrect ID OR Password, Please Try Again");
    document.getElementById("ID-Input").value="";
    document.getElementById("Password-Input").value = "" ;
});};
let View_P = document.getElementById('View-Password');
View_P.addEventListener('click',()=>{
  var x = document.getElementById("Password-Input");
  if (x.type === "password") {
    x.type = "text";
    View_P.innerHTML = "Hide Password";
    View_P.className = "Hidden"
  } else {
    x.type = "password";

    View_P.className = "Visible";
    View_P.innerHTML = "Show Password";
  }
})


