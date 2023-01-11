import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { CAlert } from "./CAlert.js";
import {onAuthStateChanged , signOut , getAuth } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,getDocs,
    orderBy, serverTimestamp,
    updateDoc , arrayUnion ,arrayRemove,getDoc} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";;
  
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
const colRef = collection(db, 'Library');
const q = query(colRef, orderBy('Title','asc'));
document.getElementById('profile').addEventListener("click",()=>{
    onAuthStateChanged(auth,(user)=>{
        if(user){
            window.open("Profile.html","Profile",'width=750 , height=500');
        }
        else{
            CAlert("Warning","You Are Not Logged In");
        }
    })
});
onAuthStateChanged(auth,async (user)=>{
    if(user){
       let id = user.email.split("@")[0];
       sessionStorage.setItem("ID",id);
       var colRef ;
        if(id.slice(0,2)=="11"){
            colRef = collection(db,"Student");
            sessionStorage.setItem("Student",true)
        }else{
            colRef = collection(db,"Teacher");
        };
        const q = query(colRef,where("ID","==",parseInt(id)));
        const querySnapshot = await getDocs(q);
        let DocId = querySnapshot.docs[0].id;
        sessionStorage.setItem("DocID",DocId);
    }
    else{
        CAlert("Warning","You Are Not Logged In");
    }
})

window.onload = RecommendedBook();
function RecommendedBook(){
onSnapshot(q, (snapshot) => {
    CustomContainer.innerHTML="";
    let books = []
    snapshot.docs.forEach(doc => {
      books.push({ ...doc.data(), id: doc.id })
    });

    let ShuffledBooks = shuffleArray(books);
    for(let i =0 ; i < 6 ; i++){
        CustomBook(ShuffledBooks[i]);
    }
    let RecommendedBtn = document.getElementById('Recommended-Books');
    RecommendedBtn.classList.add('Active-Btn');
});};
var CustomContainer = document.getElementById("Category-Recommend");
function CustomBook(books){
    let Cbook = document.createElement('div');
    Cbook.className = 'Category-Book' ;
    let CoverCont = document.createElement('div');
    let Cover  = document.createElement('img');
    CoverCont.className = 'Cover';
    Cover.src = books["Cover-Picture"];
    CoverCont.appendChild(Cover);
    Cbook.appendChild(CoverCont);
    let Details = document.createElement('div');
    Details.className = 'Details';
    let Genre = document.createElement('div');
    let Author = document.createElement('div');
    let Title = document.createElement('div');
    Title.innerHTML = books["Title"];
    Author.innerHTML = books["Author"];
    Genre.innerHTML = books["Genre"];
    Genre.style.backgroundColor = GenreColor(books["Genre"]);
    Title.className = 'Title' ;
    Title.style.color = GenreColor(books["Genre"]);
    Genre.className = 'Genre' ;
    Author.className = 'Author';
    Details.appendChild(Genre);
    Details.appendChild(Title);
    Details.appendChild(Author);
    Cbook.id = books["id"];
    Cbook.appendChild(Details);
    Cbook.addEventListener("click" , ()=>{
       Book_Details(Cbook); 
    }) ;
    CustomContainer.appendChild(Cbook);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array ;
}

function GenreColor(genre){
    switch(genre){
        case "Romance" :
            return  "#FFAFCC";
        case "Education":
            return "#BDE0FE";
        case "Adventure" :
            return "#2A9D8F";
        case "Action":
            return "#c2494d";
        case "Thriller":
            return "#f8961e";
        case "Fiction" :
            return "#c77dff";
        default:
            return "#fff";
    }
} ;
var Home_Btn = document.getElementById("Home-Btn");
Home_Btn.addEventListener('click', ()=>{
    onAuthStateChanged(auth , user =>{
        if(user){
            window.location.href = 'Tmain.html';
        }else{
            window.location.href = 'index.html';
        };
})});
var Cat_Sugg = document.getElementsByClassName('Category-Suggest-Items');
for( let i = 0 ; i < Cat_Sugg.length ; i++){
    let genre = Cat_Sugg[i].value;
    Cat_Sugg[i].addEventListener("click" , ()=>{
        WhatGenre(genre);
    });
};
const colRef2 = collection(db, 'Library');
function WhatGenre(genre){
    if(genre == "All"){
        const q2 = query(colRef2 , orderBy('Title','asc'));
        Fill_All_Table(q2);
    }else{
        const q2 = query(colRef2,where("Genre","==",genre), orderBy('Title','asc'));
        Fill_All_Table(q2);
    }
}
window.onload = WhatGenre('All');
function AllBooks(books) {
    let id = books["id"];
    let Title = books["Title"];
    let Cover = books["Cover-Picture"];
    let Author = books["Author"];
    let Genre = books["Genre"];
    let Release = books["Release-Date"];
    let Pages = books["Pages"];
let row = `
    <tr id=${id} class="Get-My-ID">
        <td><img src=${Cover} class="Book-Cover"></td>
        <td>${Title}</td>
        <td>${Author}</td>
        <td>${Genre}</td>
        <td>${Release}</td>
        <td>${Pages}</td>
    </tr>
    `;
 Tbody.innerHTML += row;
};
function Fill_All_Table(q2){
onSnapshot(q2, (snapshot) => {
    Tbody.innerHTML = "";
    let books = []
    snapshot.docs.forEach(doc => {
      books.push({ ...doc.data(), id: doc.id })
    })
    for( let i = 0 ; i<books.length ; i++){
        AllBooks(books[i]);
    }
    var Table_rows = document.getElementsByClassName('Get-My-ID');
    for( let i = 0 ; i<Table_rows.length ; i++){
        Table_rows[i].addEventListener("click",()=>{
            Book_Details(Table_rows[i]);
        });
    };
});};
const Tbody = document.getElementById('Tbody');
var main = document.getElementById("main");
var Book_Details_tab = document.getElementById("Book-Description-Tab");
var close = document.getElementById('Back-Btn');
close.addEventListener('click', Close);
    function OpenProfile(){
        main.style.opacity = "0.3";
        Book_Details_tab.style.transform = "scale(1)";
        Book_Details_tab.style.opacity = "1";
        main.style.pointerEvents = "none" ;
    }
    function Close(){
        main.style.opacity = "1";
        Book_Details_tab.style.transform = "scale(0)";
        main.style.pointerEvents = "all" ;
        Empty_Details();
};
var Book_Details_Cover = document.getElementById('Book-Desciption-Cover');
var Details_Title =  document.getElementById('Details-Title');
var Details_Author =  document.getElementById('Details-Author');
var Details_Genre =  document.getElementById('Details-Genre');
var Details_Language =  document.getElementById('Details-Language');
var Details_Release =  document.getElementById('Details-Release');
var Details_Pages =  document.getElementById('Details-Pages');
var Details_URL =  document.getElementById('Details-URL');
var Details_Description =  document.getElementById('Details-Description');
var Add_Wishlist_btn = document.getElementById('Add-Wishlist');
function Book_Details(e){
    CloseWishListFunc();
    const docRef = doc(db, 'Library', e.id)
    onSnapshot(docRef, (doc) => {
    Empty_Details();
    Fill_Details(doc.data());
    Add_Wishlist_btn.addEventListener("click" , ()=>{
        Add_TO_WishList(doc.id);
    });
    OpenProfile();
})
};

function Add_TO_WishList(id){
    onAuthStateChanged(auth , user =>{
        if(user){
            Add_TO_WishList2(id);
        }else{
            CAlert("Warning","Please sign in to add book to your wishlist");
            setTimeout(()=>{
                window.location.href= "index.html";
            },2500) 
        };
})};
function Add_TO_WishList2(Bid){
    let id = sessionStorage.getItem("ID");
    let Student = sessionStorage.getItem("Student");
    let DocID = sessionStorage.getItem("DocID");
    var q ;
    if(Student){
        q = doc(db,"Student",DocID)
    }else{
        q = doc(db,"Teacher",DocID)
    }
    getDoc(q)
    .then(snapshot => {
    let WishList = snapshot.data()["WishList"];
    if(WishList.length == 0){
        updateDoc(q, {
        WishList : [Bid]
    })}
    for(let i = 0 ; i<WishList.length ; i++){
        if(WishList[i] == Bid){
            CAlert("Warning","This book is already in your wishlist");
        }else{        
        updateDoc(q,{
            WishList : arrayUnion(Bid)
        })
        CAlert("success","Book Added To WishList") 
}}
})};


export function Delete_from_WishList(id){
    onAuthStateChanged(auth , user =>{
        if(user){
            Delete_from_WishList2(id);
        }else{
            CAlert("Warning","Please sign in to add book to your wishlist");
            setTimeout(()=>{
                window.location.href= "index.html";},2500)};})
};

function Delete_from_WishList2(Bid){
    let id = sessionStorage.getItem("ID");
    let Student = sessionStorage.getItem("Student");
    let DocID = sessionStorage.getItem("DocID");
    var docRef ;
    if(Student){
        docRef = doc(db,"Student",DocID)
    }else{
        docRef = doc(db,"Teacher",DocID)
    }
    onSnapshot(docRef, (doc) => {
    let WishList = doc.data()["WishList"];
    for(let i = 0 ; i<WishList.length ; i++){
        if(WishList[i] == Bid){
        updateDoc(docRef, {
        WishList : arrayRemove(Bid)}); 
        }else{}}
});
let temp = document.getElementsByClassName('Delete-From-WishListBtn');
for(let i = 0 ; i< temp.length ; i++){
    temp[i].addEventListener("click" ,()=>{
         Delete_from_WishList(temp[i].id);
    });
 }
};
function Empty_Details(){
    Book_Details_Cover.src = "";
    Details_Title.innerHTML = "";
    Details_Author.innerHTML = "";
    Details_Description.innerHTML = "";
    Details_Genre.innerHTML = "";
    Details_Pages.innerHTML = "";
    Details_Language.innerHTML = "";
    Details_URL.innerHTML = "";
    Details_Release.innerHTML = "";
}
function Fill_Details(doc){
    Book_Details_Cover.src = doc["Cover-Picture"];
    Details_Title.innerHTML = doc["Title"];
    Details_Author.innerHTML = doc["Author"];
    Details_Description.innerHTML = doc["Description"];
    Details_Genre.innerHTML = doc["Genre"];
    Details_Pages.innerHTML = doc["Pages"];
    Details_Language.innerHTML = doc["Language"];
    Details_URL.innerHTML = doc["URL"];
    Details_Release.innerHTML = doc["Release-Date"];
}
var Search_Icon = document.getElementById('Search-Icon');
var Confirm_Search = document.getElementById('Confirm-Search');
var Search_Tab = document.getElementById('Search-Tab');
var Search_Table_Body = document.getElementById('Search-Table-Body');
var Cancel_Search = document.getElementById('Cancel-Search');
function OpenSearch(){
    CloseWishListFunc();
    main.style.opacity = "0.3";
    Search_Tab.style.transform = "scale(1)";
    Search_Tab.style.opacity = "1";
    main.style.pointerEvents = "none" ;
    Search_Table_Body.innerHTML = "";
   document.getElementById('Search-Bar').value ="";
}
let S_Bar = document.getElementById('Search-Bar');

function CloseSearch(){
    main.style.opacity = "1";
    Search_Tab.style.transform = "scale(0)";
    main.style.pointerEvents = "all" ;
    Search_Table_Body.innerHTML = "";
   document.getElementById('Search-Bar').value ="";
};
Search_Icon.addEventListener('click', OpenSearch);
Cancel_Search.addEventListener('click', CloseSearch );
Confirm_Search.addEventListener('click' , ()=>{
    Search_Table_Body.innerHTML = "";
    let Search_Term = document.getElementById('Search-Bar').value;
    Search_For(Search_Term);
    document.getElementById('Search-Bar').value = "";
});
S_Bar.addEventListener('keyup',(e)=>{
    if(e.keyCode == 13){
    Search_Table_Body.innerHTML = "";
    let Search_Term = document.getElementById('Search-Bar').value;
    Search_For(Search_Term);
    document.getElementById('Search-Bar').value = "";
    }
})
function Search_For(Search_Term){
    const colRef = collection(db, 'Library');
    const q1 = query(colRef,where("Title",">=",Search_Term), where("Title","<=",Search_Term + '\uf8ff'), orderBy('Title','asc'));
    onSnapshot(q1, (doc) => {
        let books = []
        doc.docs.forEach(doc => {
        books.push({ ...doc.data(), id: doc.id })
    })
    for(let i = 0 ; i<books.length ; i++){
        Fill_Search_Table(books[i],"T");
    }
    });
    const q2 = query(colRef,where("Author",">=",Search_Term), where("Author","<=",Search_Term + '\uf8ff'), orderBy('Author','asc'));
    onSnapshot(q2, (doc) => {
        let books = []
        doc.docs.forEach(doc => {
        books.push({ ...doc.data(), id: doc.id })
    })
    for(let i = 0 ; i<books.length ; i++){
        Fill_Search_Table(books[i],"A");
    }
    });
    const q3 = query(colRef,where("Genre",">=",Search_Term), where("Genre","<=",Search_Term + '\uf8ff'), orderBy('Genre','asc'));
    onSnapshot(q3, (doc) => {
        let books = []
        doc.docs.forEach(doc => {
        books.push({ ...doc.data(), id: doc.id })
    })
    for(let i = 0 ; i<books.length ; i++){
        Fill_Search_Table(books[i],"G");
    }
    });
};

function Fill_Search_Table(book , which){
    let Title = book["Title"];
    let Author = book["Author"];
    let Genre = book["Genre"];
    let id = book.id;
    let row = "";
    switch(which){
        case "T":
            row =`
            <tr id="${id}" class="Search-Book-ID">
                <td style="background-color: rgba(168, 165, 165, 0.801);">${Title}</td>
                <td>${Author}</td>
                <td>${Genre}</td>
             </tr>
            `;
        break ;
        case "A":
            row =`
            <tr id="${id}" class="Search-Book-ID">
                <td >${Title}</td>
                <td style="background-color: rgba(168, 165, 165, 0.801);">${Author}</td>
                <td>${Genre}</td>
            </tr>
            `;
        break ;
        case "G":
            row =`
            <tr id="${id}" class="Search-Book-ID">
                <td>${Title}</td>
                <td>${Author}</td>
                <td style="background-color: rgba(168, 165, 165, 0.801);">${Genre}</td>
            </tr>
            `;
        break ;
    }
  
    Search_Table_Body.innerHTML+= row ;
    for( let i = 0 ; i<Search_Book_Info.length ; i++){
        Search_Book_Info[i].addEventListener('click' , ()=>{
            temp(Search_Book_Info[i]);
        });
    };
};

let Clear_Search = document.getElementById('Clear-Search');
Clear_Search.addEventListener('click', ()=>{
    Search_Table_Body.innerHTML = "";
    document.getElementById('Search-Bar').value = "";
});
var Search_Book_Info = document.getElementsByClassName('Search-Book-ID');
for( let i = 0 ; i<Search_Book_Info.length ; i++){
    Search_Book_Info[i].addEventListener('click' , ()=>{
        temp(Search_Book_Info[i]);
    });
};
function temp(e){
    Search_Table_Body.innerHTML = "";
    document.getElementById('Search-Bar').value = "";
    CloseSearch() ;
    Book_Details(e);
};
var WishListIcon = document.getElementById('Wish-List-Icon');
var NavBar = document.getElementById('Nav-Bar');
var WishListTab = document.getElementById('Wish-List-Tab');
WishListIcon.addEventListener('click',()=>{
    OpenWishList();
});
var CloseWishList = document.getElementById('Close-Wish-List');
CloseWishList.addEventListener('click',()=>{
   CloseWishListFunc();
})
function CloseWishListFunc(){
    main.style.marginRight = '0';
    NavBar.style.marginRight = '0';
    WishListTab.style.width = '0';
    WishListTab.style.display= 'none';
    WishListBody.innerHTML = "" ;
}

function OpenWishList(){
        WishListBody.innerHTML ="";
        CloseSearch();
        Close();
        onAuthStateChanged(auth , user =>{
        if(user){
        let id = sessionStorage.getItem("ID");
        let Student = sessionStorage.getItem("Student");
        let DocID = sessionStorage.getItem("DocID");
            var q ;
            if(Student){
                q = doc(db,"Student",DocID)
            }else{
                q = doc(db,"Teacher",DocID)
            }
        onSnapshot(q, (doc) => {
        WishListBody.innerHTML = "";
        let WishList = doc.data()["WishList"];
        if(WishList == ""){
            CAlert("Error","Your WishList is empty")
        }else{
            for(let i = 0 ; i<WishList.length ; i++){
            Fill_Wish_List_Table(WishList[i]);
        }
        
        main.style.marginRight = '21rem';
        NavBar.style.marginRight = '25rem';
        WishListTab.style.width = '20rem';
        WishListTab.style.display= 'grid';
        }})
       
    }
        else{
            CAlert("Warning","Please sign in to add book to your wishlist");
            setTimeout(()=>{
                window.location.href= "index.html";
            },2500) 
        };
})};
var WishListBody = document.getElementById('WishList-Body');
function Fill_Wish_List_Table(bookID){
    const docRef = doc(db,'Library', bookID);
    let id = bookID ;
    onSnapshot(docRef, (doc)=>{
        let title = doc.data()["Title"];
        let row = `
        <tr style="height :4rem;"><td>${title}</td><td class="Delete-From-WishListBtn" id="${id}" >delete</td></tr>
        `;
        WishListBody.innerHTML += row ;
    });
    let temp = document.getElementsByClassName('Delete-From-WishListBtn');
        for(let i = 0 ; i< temp.length ; i++){
            temp[i].addEventListener("click" ,()=>{
                 Delete_from_WishList(temp[i].id);
            });
     }
};

WishListIcon.addEventListener("click",()=>{
    setTimeout(() => {
        let temp = document.getElementsByClassName('Delete-From-WishListBtn');
        for(let i = 0 ; i< temp.length ; i++){
           temp[i].addEventListener("click" ,()=>{
                Delete_from_WishList(temp[i].id);
           });
        }
    }, 2000);
})

