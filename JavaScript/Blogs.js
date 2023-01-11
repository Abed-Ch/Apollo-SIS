import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { CAlert } from "./CAlert.js";
import { onAuthStateChanged, getAuth } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getStorage, ref, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    updateDoc, arrayUnion, getDoc
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";;

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
const db = getFirestore(app);
const storage = getStorage(app);
const colRef = collection(db, "Blogs");
onAuthStateChanged(auth, user => {
    if (user) {
        sessionStorage.setItem("User", true)
    } else {

    }
})
onSnapshot(colRef, (snapshot) => {
    let PBlog = sessionStorage.getItem("PubBlog");
    if (PBlog) {
    } else {
        let Blogs = []
        snapshot.docs.forEach(doc => {
            Blogs.push({ ...doc.data(), id: doc.id })
        })
        All_Blog_Container.innerHTML = "";
        PBlog_Container.innerHTML = "";
        for (let i = 0; i < Blogs.length; i++) {
            Fill_All_Blogs(Blogs[i]);
        }
    }
});

window.onload = setTimeout(() => {
    var Blog = localStorage.getItem('Blog');
    if (Blog) {
        See_Blog(Blog);
    }

    localStorage.removeItem('Blog')
}, 2500)

var All_Blog_Container = document.getElementById('Main-Blogs-Container');
function Fill_All_Blogs(blog) {
    if (blog["Full-Body"].length == "0") {
        return;
    }
    if (blog["ispopular"] == true) {
        Popular_Blog(blog);
    }
    addevevnt()
    let Blog = document.createElement('div');
    Blog.className = "Blog-Post";
    let Blog_Picture_cont = document.createElement('div');
    Blog_Picture_cont.className = "Blog-Picture-Container";
    let Blog_Picture = document.createElement('img');
    let starsRef = ref(storage, blog["image"]);
    getDownloadURL(starsRef)
        .then((url) => {
            Blog_Picture.src = url;
        })
        .catch((error) => {
            console.log(error);
        });
    Blog_Picture_cont.appendChild(Blog_Picture);
    Blog.appendChild(Blog_Picture_cont);
    let Blog_Details = document.createElement('div');
    Blog_Details.className = "Blog-Details-Container";
    let Blog_Date = document.createElement('div');
    Blog_Date.className = "Blog-Date";
    Blog_Date.innerHTML = blog["history"];
    Blog_Details.appendChild(Blog_Date);
    let Blog_Title = document.createElement('div');
    Blog_Title.className = "Blog-Title";
    Blog_Title.innerHTML = blog["title"];
    Blog_Title.id = blog["id"];
    if (blog["title"].length > 60) { Blog_Title.style.fontSize = " 1.5rem " };
    Blog_Title.addEventListener('click', (event) => {
        See_Blog(event.srcElement.id);
    });
    Blog_Details.appendChild(Blog_Title);
    let Blog_Descreption = document.createElement('div');
    Blog_Descreption.className = "Blog-Descreption";
    let temp = blog["Full-Body"][0].split("*");
    Blog_Descreption.innerHTML = temp[1].slice(0, 240) + "....";
    Blog_Details.appendChild(Blog_Descreption);
    let Blog_Continue = document.createElement('div');
    Blog_Continue.className = "Continue-Reading-Blog";
    Blog_Continue.id = blog["id"];
    Blog_Continue.addEventListener('click', (event) => {
        See_Blog(event.srcElement.id);
    });
    Blog_Details.appendChild(Blog_Continue);
    Blog.appendChild(Blog_Details);
    All_Blog_Container.appendChild(Blog);
};
var PBlog_Container = document.getElementById('Popular-Blogs-Container');
function Popular_Blog(blog) {
    let PBlog = document.createElement('div');
    PBlog.className = "PBlog";
    let PBlog_Pic_Cont = document.createElement('div');
    PBlog_Pic_Cont.className = "PBlog-Picture";
    let img = document.createElement('img');
    let starsRef = ref(storage, blog["image"]);
    getDownloadURL(starsRef)
        .then((url) => {
            img.src = url;

        })
        .catch((error) => {
            console.log(error);
        });

    PBlog_Pic_Cont.appendChild(img);
    PBlog.appendChild(PBlog_Pic_Cont);
    let PBlog_Details = document.createElement('div');
    PBlog_Details.className = "PBlog-Details";
    let Blog_Date = document.createElement('div');
    Blog_Date.className = "PBlog-Date";
    Blog_Date.innerHTML = blog["history"];
    PBlog_Details.appendChild(Blog_Date);
    let Blog_Title = document.createElement('div');
    Blog_Title.className = "PBlog-Title";
    Blog_Title.innerHTML = blog["title"];
    if (blog["title"].length > 69) { Blog_Title.style.fontSize = "0.85rem" }
    PBlog_Details.appendChild(Blog_Title);
    let Blog_Rating = document.createElement('div');
    Blog_Rating.className = "PBlog-Rating";
    Blog_Rating.innerHTML = "Rating : " + Math.round(blog["rating"]) + " / 5";
    PBlog_Details.appendChild(Blog_Rating);
    PBlog.appendChild(PBlog_Details);
    PBlog.id = blog["id"];
    PBlog_Container.appendChild(PBlog);
};
function addevevnt() {
    let blogs = document.getElementsByClassName('PBlog');
    for (let i = 0; i < blogs.length; i++) {
        blogs[i].addEventListener("click", () => {
            let iid = My_id(blogs[i]);
            See_Blog(iid);
        })
    }
}
function My_id(blog) {
    return blog.id;
}
document.getElementById('Go-Home').addEventListener("click", () => {
    onAuthStateChanged(auth, user => {
        if (user) {
            CAlert("Warning", "Redirecting to Home Page");
            setTimeout(() => {
                window.location.href = "Tmain.html";
            }, 2500)
        } else {
            CAlert("Warning", "Redirecting to Landing Page");
            setTimeout(() => {
                window.location.href = "index.html"
            }, 2500)
        }
    })
});
function Open_See_blog() {
    let See = document.getElementById('Read-Blog');
    See.style.display = "block";
    All_Blog_Container.style.display = "none";
    All_Blog_Container.style.animationName = "Slide_Blog";
}
let See = document.getElementById('Read-Blog');
document.getElementById('Exit-See-Blog').addEventListener("click", () => {
    See.style.display = "none";
    All_Blog_Container.style.display = "block";
    Empty_See_Blog();
});
var SB_Title = document.getElementById('SBlog-Title');
var SB_Author = document.getElementById('SBlog-Author');
var SB_Date = document.getElementById('SBlog-Date');
var SB_MPic = document.getElementById('SBlog-MPic');
var SB_Blog_Body = document.getElementById('Blog-Body');
function See_Blog(id) {
    Empty_See_Blog();
    Open_See_blog();
    const q = doc(db, "Blogs", id);
    onSnapshot(q, ((doc) => {
        Fill_See_Blog(doc);
    }))

};
function Empty_See_Blog() {
    document.getElementsByClassName('Submit-Rating')[0].id = null;
    SB_Title.innerHTML = "";
    SB_Author.innerHTML = "";
    SB_Date.innerHTML = "";
    SB_MPic.src = "";
    SB_Blog_Body.innerHTML = "";
    Reset_Rating();
    document.getElementById('Blog-Rating').style.pointerEvents = "all";
};
function Reset_Rating() {
    Star_One.innerHTML = "star_border";
    Star_Two.innerHTML = "star_border";
    Star_Three.innerHTML = "star_border";
    Star_Four.innerHTML = "star_border";
    Star_Five.innerHTML = "star_border"
    Face.innerHTML = "";
    Star_One.value = 0;
    Star_Two.value = 0;
    Star_Three.value = 0;
    Star_Four.value = 0;
    Star_Five.value = 0;
}
function Fill_See_Blog(doc) {
    SB_Title.innerHTML = doc.data()["title"];
    SB_Author.innerHTML = doc.data()["publisher"];
    SB_Date.innerHTML = doc.data()["history"];
    document.getElementsByClassName('Submit-Rating')[0].id = doc.id;
    let BArray = doc.data()["Full-Body"];
    for (let i = 0; i < BArray.length; i++) {
        Create_See_Body(BArray[i]);
    }
    let starsRef = ref(storage, doc.data()["image"]);
    getDownloadURL(starsRef)
        .then((url) => {
            SB_MPic.src = url;
        })
        .catch((error) => {
            console.log(error);
        });
};
function Create_See_Body(Str) {
    let Code = Str.split("*");
    let div = document.createElement('div');
    switch (Code[0]) {
        case "P":
            div.className = "SBlog-Par";
            div.innerHTML = Code[1];
            SB_Blog_Body.appendChild(div);
            break;
        case "FP":
            div.className = "SBlog-FullPic";
            let FP = document.createElement('img');
            let starsRef = ref(storage, Code[1]);
            getDownloadURL(starsRef)
                .then((url) => {
                    FP.src = url;
                })
                .catch((error) => {
                    console.log(error);
                });
            div.appendChild(FP);
            SB_Blog_Body.appendChild(div);
            break;
        case "HP":
            div.className = "SBlog-HalfPic";
            let HP = document.createElement('img');
            let starsref = ref(storage, Code[1]);
            getDownloadURL(starsref)
                .then((url) => {
                    HP.src = url;
                })
                .catch((error) => {
                    console.log(error);
                });
            div.appendChild(HP);
            SB_Blog_Body.appendChild(div);
            break;
        case "UL":
            div.className = "SBlog-UL";
            let UL = document.createElement('ul');
            let LIS = Str.split("*");
            for (let i = 1; i < LIS.length; i++) {
                let LI = document.createElement('li');
                LI.innerHTML = LIS[i];
                UL.appendChild(LI);
            }
            div.appendChild(UL);
            SB_Blog_Body.appendChild(div);
            break;
        case "OL":
            div.className = "SBlog-NL";
            let OL = document.createElement('ol');
            let LiS = Str.split("*");
            for (let i = 1; i < LiS.length; i++) {
                let LI = document.createElement('li');
                LI.innerHTML = LiS[i];
                OL.appendChild(LI);
            }
            div.appendChild(OL);
            SB_Blog_Body.appendChild(div);
            break;
        case "HE":
            div.className = "SBlog-Header";
            div.innerHTML = Code[1];
            SB_Blog_Body.appendChild(div);
            break;
    }
}
var Star_One = document.getElementById('Star-One');
var Star_Two = document.getElementById('Star-Two');
var Star_Three = document.getElementById('Star-Three');
var Star_Four = document.getElementById('Star-Four');
var Star_Five = document.getElementById('Star-Five');
var Face = document.getElementById('Rating-Face');

Star_One.addEventListener("click", () => {
    Star_One.innerHTML = "star";
    Star_Two.innerHTML = "star_border";
    Star_Three.innerHTML = "star_border";
    Star_Four.innerHTML = "star_border";
    Star_Five.innerHTML = "star_border"
    Face.innerHTML = "sentiment_very_dissatisfied";
    Star_One.value = 1;
    Star_Two.value = 0;
    Star_Three.value = 0;
    Star_Four.value = 0;
    Star_Five.value = 0;
})
Star_Two.addEventListener("click", () => {
    Star_One.innerHTML = "star";
    Star_Two.innerHTML = "star";
    Star_Three.innerHTML = "star_border";
    Star_Four.innerHTML = "star_border";
    Star_Five.innerHTML = "star_border"
    Face.innerHTML = "sentiment_dissatisfied";
    Star_One.value = 0;
    Star_Two.value = 2;
    Star_Three.value = 0;
    Star_Four.value = 0;
    Star_Five.value = 0;
})
Star_Three.addEventListener("click", () => {
    Star_One.innerHTML = "star";
    Star_Two.innerHTML = "star";
    Star_Three.innerHTML = "star";
    Star_Four.innerHTML = "star_border";
    Star_Five.innerHTML = "star_border"
    Face.innerHTML = "sentiment_neutral";
    Star_One.value = 0;
    Star_Two.value = 0;
    Star_Three.value = 3;
    Star_Four.value = 0;
    Star_Five.value = 0;
})
Star_Four.addEventListener("click", () => {
    Star_One.innerHTML = "star";
    Star_Two.innerHTML = "star";
    Star_Three.innerHTML = "star";
    Star_Four.innerHTML = "star";
    Star_Five.innerHTML = "star_border"
    Face.innerHTML = "sentiment_satisfied";
    Star_One.value = 0;
    Star_Two.value = 0;
    Star_Three.value = 0;
    Star_Four.value = 4;
    Star_Five.value = 0;
})
Star_Five.addEventListener("click", () => {
    Star_One.innerHTML = "star";
    Star_Two.innerHTML = "star";
    Star_Three.innerHTML = "star";
    Star_Four.innerHTML = "star";
    Star_Five.innerHTML = "star"
    Face.innerHTML = "sentiment_very_satisfied";
    Star_One.value = 0;
    Star_Two.value = 0;
    Star_Three.value = 0;
    Star_Four.value = 0;
    Star_Five.value = 5;
})
document.getElementById('Reset').addEventListener("click", () => {
    Reset_Rating();
});
document.getElementsByClassName('Submit-Rating')[0].addEventListener("click", () => {
    let rating = null;
    if (Star_Five.value == 5) {
        rating = 5;
    } else if (Star_Four.value == 4) {
        rating = 4;
    } else if (Star_Three.value == 3) {
        rating = 3;
    } else if (Star_Two.value == 2) {
        rating = 2;
    } else if (Star_One.value == 1) {
        rating = 1;
    } else {
        rating = 0;
    }
    CAlert("done", "Thank you for your support");
    document.getElementById('Blog-Rating').style.pointerEvents = "none";
    let id = document.getElementsByClassName('Submit-Rating')[0].id;
    Face.innerHTML = "sentiment_very_satisfied";
    Rate(id, rating);
});
function Rate(id, rating) {
    const q = doc(db, "Blogs", id);
    getDoc(q)
        .then(snapshot => {
            let Raters = snapshot.data()["Raters"];
            let Old_Rating = snapshot.data()["rating"];
            let NRaters = Raters + 1;
            let NRating = (rating + Old_Rating) / NRaters;

            Write_Rating(id, NRaters, NRating);
        })
        .catch(err => {
            console.log(err.message)
        })
};
function Write_Rating(id, raters, rating) {
    const Blog = doc(db, "Blogs", id);

    updateDoc(Blog, {
        rating: rating,
        Raters: raters
    }).then(() => {
    });
}
var New_Blog_Cont = document.getElementById('New-Blog-Input-Cont');
var New_Blog_Controll = document.getElementById('New-Blog-Controll');
var New_Blog_Btn = document.getElementById('Add-New-Blog');
sessionStorage.clear();
let Body_Elements = 0;
sessionStorage.setItem("Number", Body_Elements);
New_Blog_Btn.addEventListener("click", () => {
    if (sessionStorage.getItem("User")) {
        CAlert("Warning", "Please Note That The Character ( * ) Is Forbidden And Cannot Be Written In Blogs !!", 7500, 25)
        All_Blog_Container.style.display = "none";
        PBlog_Container.style.display = "none";
        See.style.display = "none";
        New_Blog_Cont.style.display = 'grid';
        New_Blog_Controll.style.display = 'grid';
        All_Blog_Container.style.animationName = "Slide_blog";
        PBlog_Container.style.animationName = "Slide_blog";
        New_Blog_Btn.style.pointerEvents = "none";
        Empty_New_Blog();
    } else {
        CAlert("Warning", "Please Log In To Add A New Blog");
    }

});
let Review_Btn = document.getElementById('Review');
let Insert_Btn = document.getElementById('Insert');
function textAreaAdjust(element) {
    element.style.height = "1px";
    element.style.height = (25 + element.scrollHeight) + "px";
}
Review_Btn.addEventListener("click", () => {
    Review_Btn.classList.remove('Reviewing');
    Review_Btn.classList.add('NotReviewing');
    document.getElementsByClassName('Insert-Items')[0].style.display = "none";
    document.getElementsByClassName('Review-Items')[0].style.display = "grid";
});
Insert_Btn.addEventListener("click", () => {
    Review_Btn.classList.add('Reviewing');
    Review_Btn.classList.remove('NotReviewing');
    document.getElementsByClassName('Insert-Items')[0].style.display = "flex";
    document.getElementsByClassName('Review-Items')[0].style.display = "none";
});
var NB_cover = document.getElementById('New-Blog-Cover');
var NB_cover_Upload = document.getElementById('New-Blog-Cover-Upload');
document.getElementById('Delete-Cover-Pic').addEventListener("click", () => {
    NB_cover.src = "";
    NB_cover.style.display = "none";
    NB_cover_Upload.style.display = "block";
    NB_cover_Upload.value = "";
});
const New_Blog_Body = document.getElementById('New-Blog-Body');
document.getElementById('Add-Par').addEventListener("click", () => {
    Create_Body("Par")
});
document.getElementById('Add-Header').addEventListener("click", () => {
    Create_Body("Header")
});
document.getElementById('Add-FPic').addEventListener("click", () => {
    Create_Body("Full-Pic")
});
document.getElementById('Add-HPic').addEventListener("click", () => {
    Create_Body("Half-Pic")
});
document.getElementById('Add-UList').addEventListener("click", () => {
    Create_Body("UL")
});
document.getElementById('Add-NList').addEventListener("click", () => {
    Create_Body("NL")
});
var Review_Summary = document.getElementById('Review-Summary').getElementsByTagName('p');
function Create_Body(what) {
    let div = document.createElement('div');
    div.className = "New-Blog-Div-Parts";
    let number = parseInt(sessionStorage.getItem("Number"));
    number++;
    sessionStorage.setItem("Number", number);
    var Btn_Cont;
    switch (what) {
        case "Par":
            let Par = document.createElement('textarea');
            Par.className = "NB-Par";
            Par.addEventListener('keydown', (e) => {

                if (e.keyCode == 13) {
                    Par.value += "</br>";
                }
            });
            Par.addEventListener('keyup', (e) => {
                textAreaAdjust(e)
            })
            div.appendChild(Par);
            div.classList.add("Im-A-Paragraph");
            Change_Review("+", div);
            break;
        case "Header":
            let Header = document.createElement('input');
            Header.type = "text"
            Header.className = "NB-Header";
            div.appendChild(Header);
            div.classList.add("Im-A-Header");
            Change_Review("+", div);
            break;
        case "Full-Pic":
            let FInput = document.createElement('input');
            FInput.type = "file";
            FInput.style.height = "5rem";
            div.classList.add("Im-A-FullPic");
            FInput.accept = "image/*";
            FInput.className = "Image_Uploader";
            let Image = document.createElement('img');
            Image.className = "NB-FullPic";
            Image.style.display = "none";
            FInput.addEventListener("change", (e) => {
                UploadImage(e, "F");
            });
            div.appendChild(FInput);
            div.appendChild(Image);
            Change_Review("+", div);
            break;
        case "Half-Pic":
            let HInput = document.createElement('input');
            HInput.type = "file";
            HInput.style.height = "5rem";
            div.classList.add("Im-A-HalfPic");
            HInput.accept = "image/*";
            HInput.className = "Image_Uploader";
            let HImage = document.createElement('img');
            HImage.className = "NB-HalfPic";
            HImage.style.display = "none";
            HInput.addEventListener("change", (e) => {
                UploadImage(e, "H");
            });
            div.appendChild(HInput);
            div.appendChild(HImage);
            Change_Review("+", div);
            break;
        case "UL":
            let UList = Build_List_Container("UL");
            UList.classList.add("UL-List")
            div.appendChild(UList);
            div.classList.add("Im-A-UList");
            Btn_Cont = Build_List_Controll();
            div.appendChild(Btn_Cont);
            Change_Review("+", div)
            break;
        case "NL":
            let NList = Build_List_Container("NL");
            NList.classList.add("Num-List")
            div.appendChild(NList);
            div.classList.add("Im-A-NList");
            Btn_Cont = Build_List_Controll();
            div.appendChild(Btn_Cont);
            Change_Review("+", div)
        default:
            break;
    }
    New_Blog_Body.appendChild(div);
};
function Build_List_Controll() {
    let Button_Cont = document.createElement('div');
    Button_Cont.className = "List-Controll-Btns";
    let Btn1 = document.createElement('button');
    let Btn2 = document.createElement('button');
    let Btn3 = document.createElement('button');
    Btn1.className = "List-CTR";
    Btn2.className = "List-CTR";
    Btn3.className = "List-CTR";
    Btn1.id = "Add-List-Child";
    Btn2.id = "Delete-Last-Child";
    Btn3.id = "Finish-List";
    Btn1.addEventListener("click", (e) => {
        Add_List_Child(e);
    });
    Btn2.addEventListener("click", (e) => {
        Delete_Last_Child(e);
    });
    Btn3.addEventListener("click", (e) => {
        Finish_List(e);
    })
    Btn1.innerHTML = "Add List Item";
    Btn2.innerHTML = "Delete Last Item";
    Btn3.innerHTML = "Finish List";
    Button_Cont.appendChild(Btn1);
    Button_Cont.appendChild(Btn2);
    Button_Cont.appendChild(Btn3);
    return Button_Cont;
}
function Build_List_Container(type) {
    let Linput = document.createElement('input');
    Linput.className = "List-Input";
    Linput.type = "text";
    let li = document.createElement('li');
    li.appendChild(Linput);
    let List_Cont = document.createElement('div');
    List_Cont.className = "List";
    if (type == "UL") {
        let UL = document.createElement('ul');
        UL.appendChild(li);
        List_Cont.appendChild(UL)
        return List_Cont;
    } else {
        let NL = document.createElement('ol');
        NL.appendChild(li);
        List_Cont.appendChild(NL)
        return List_Cont;
    }
}
document.getElementById("Delete-Latest-Div").addEventListener("click", () => {
    Delete_Latest_Div();
});
function Delete_Latest_Div() {
    let number = parseInt(sessionStorage.getItem("Number"));
    number--;
    let bodies = document.getElementsByClassName('New-Blog-Div-Parts');
    Change_Review("-", bodies[number]);
    bodies[number].parentNode.removeChild(bodies[number]);
    sessionStorage.setItem("Number", number);
}
function Change_Review(Sign, div) {
    let Cname = div.classList[1];
    var OR;
    var Num;
    switch (Cname) {
        case "Im-A-Paragraph":
            OR = Review_Summary[1].innerHTML.split(" ");
            Num = parseInt(OR[0]);
            if (Sign == "+") { Num++ } else { Num-- }
            Review_Summary[1].innerHTML = Num + " Paragraphs";
            break;
        case "Im-A-Header":
            OR = Review_Summary[2].innerHTML.split(" ");
            Num = parseInt(OR[0]);
            if (Sign == "+") { Num++ } else { Num-- }
            Review_Summary[2].innerHTML = Num + " Headers";
            break;
        case "Im-A-FullPic":
            OR = Review_Summary[3].innerHTML.split(" ");
            Num = parseInt(OR[0]);
            if (Sign == "+") { Num++ } else { Num-- }
            Review_Summary[3].innerHTML = Num + " Large Pictures";
            break;
        case "Im-A-HalfPic":
            OR = Review_Summary[4].innerHTML.split(" ");
            Num = parseInt(OR[0]);
            if (Sign == "+") { Num++ } else { Num-- }
            Review_Summary[4].innerHTML = Num + " Medium Pictures";
            break;
        case "Im-A-UList":
            OR = Review_Summary[6].innerHTML.split(" ");
            Num = parseInt(OR[0]);
            if (Sign == "+") { Num++ } else { Num-- }
            Review_Summary[6].innerHTML = Num + " Unordered List";
            break;
        case "Im-A-NList":
            OR = Review_Summary[5].innerHTML.split(" ");
            Num = parseInt(OR[0]);
            if (Sign == "+") { Num++ } else { Num-- }
            Review_Summary[5].innerHTML = Num + " Numbered List";
            break;
        default:
            break;

    }
};

function UploadImage(event, type) {
    let parent = event.target.parentNode;
    if (type == "F") {
        let img = parent.getElementsByClassName('NB-FullPic')[0];
        img.src = URL.createObjectURL(event.target.files[0]);
        img.style.display = "block";
        event.target.style.display = "none";
    } else {
        let img = parent.getElementsByClassName('NB-HalfPic')[0];
        img.src = URL.createObjectURL(event.target.files[0]);
        img.style.display = "block";
        event.target.style.display = "none";
    }
};
function Add_List_Child(e) {
    let Father = e.target.parentNode;
    let List = Father.previousElementSibling;
    let LType = List.classList[1];
    let LI = document.createElement('li');
    let input = document.createElement('input');
    input.type = "text";
    input.className = "List-Input";
    LI.appendChild(input);
    if (LType == "UL-List") {
        let UL = List.getElementsByTagName('ul')
        UL[0].appendChild(LI);
    } else if (LType == "Num-List") {
        let NL = List.getElementsByTagName('ol');
        NL[0].appendChild(LI);
    }
};
function Delete_Last_Child(e) {
    let Father = e.target.parentNode;
    let List = Father.previousElementSibling;
    let LType = List.classList[1];
    if (LType == "UL-List") {
        let UL = List.getElementsByTagName('ul')
        UL[0].removeChild(UL[0].lastElementChild);
    } else if (LType == "Num-List") {
        let NL = List.getElementsByTagName('ol')
        NL[0].removeChild(NL[0].lastElementChild);
    }

};
function Finish_List(e) {
    let Father = e.target.parentNode;
    let List = Father.previousElementSibling;
    let ListInner = List.childNodes;
    let num = ListInner[0].childNodes.length;
    if (num == 0) { Delete_Latest_Div(); }
    Father.style.display = "none";
};
var NB_Title = document.getElementById('New-Blog-Title');
var NB_Author = document.getElementById('New-Blog-Author');
var NB_Date = document.getElementById('New-Blog-Date');

function Empty_New_Blog() {
    NB_Title.value = "";
    NB_Author.value = "";
    NB_Date.value = "";
    NB_cover.src = "";
    NB_cover.style.display = "none";
    NB_cover_Upload.style.display = "block";
    NB_cover_Upload.value = "";
    New_Blog_Body.innerHTML = "";
    for (let i = 1; i < Review_Summary.length; i++) {
        let num = Review_Summary[i].innerHTML.split(" ");
        Review_Summary[i].innerHTML = "0 " + num[1];
    }

};
var Pub_NB = document.getElementById('Publish-Blog');
var Can_NB = document.getElementById('Cancel-Blog');
var Conf_Pub_NB = document.getElementById('Conf-Publish-Blog');
var Conf_Cancel_NB = document.getElementById('Conf-Cancel-Blog');
Pub_NB.addEventListener("click", () => {
    CAlert("Warning", "Before Submitting Please Make Sure Your Blog Is Without Mistakes As Editting Later Is Prohibitted !", 7500, 25);
    Pub_NB.style.display = "none";
    Conf_Pub_NB.style.display = "block";
    Can_NB.style.display = "block";
    Conf_Cancel_NB.style.display = "none";

});
Can_NB.addEventListener("click", () => {
    CAlert("Warning", "Are You Sure You Would Like TO Cancel ? All Your Progress Will Be Lost", 7500);
    Can_NB.style.display = "none";
    Conf_Cancel_NB.style.display = "block";
    Conf_Pub_NB.style.display = "none";
    Pub_NB.style.display = "block";
});
Conf_Cancel_NB.addEventListener("click", () => {
    Pub_NB.style.display = "block";
    Conf_Pub_NB.style.display = "none";
    Can_NB.style.display = "block";
    Conf_Cancel_NB.style.display = "none";
    Empty_New_Blog();
    New_Blog_Cont.style.display = 'none';
    New_Blog_Controll.style.display = 'none';
    All_Blog_Container.style.display = "grid";
    PBlog_Container.style.display = "grid";
    New_Blog_Btn.style.pointerEvents = "all";
});
Conf_Pub_NB.addEventListener("click", () => {
    Publish_Blog();
});
function Convert_Date(date) {
    let arr = date.split("-");
    let month = toMonthName(arr[1]);
    let year = arr[0];
    let day = toNumberName(arr[2]);
    let fdate = month + " " + day + " , " + year;
    return fdate;
}
function toNumberName(dayNum) {
    switch (dayNum) {
        case "1":
        case "21":
        case "31":
            return dayNum + "st";
        case "2":
        case "22":
            return dayNum + "nd";
        case "3":
        case "23":
            return dayNum + "rd";
        default:
            return dayNum + "th";
    }
}
function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('en-US', {
        month: 'long',
    });
}
function Publish_Blog() {
    sessionStorage.setItem("PubBlog", true)
    let Title = NB_Title.value;
    let Author = NB_Author.value;
    let Date = Convert_Date(NB_Date.value);
    addDoc(collection(db, "Blogs"), {
        title: Title,
        publisher: Author,
        history: Date
    }).then((doc) => {
        Publish_Blog2(doc.id);
    });

};
function Publish_Blog2(id) {
    let Picture = NB_cover_Upload.files[0];
    const storageRef = ref(storage, 'Blogs/' + id + '/' + Picture.name);
    var docRef = doc(db, "Blogs", id);
    updateDoc(docRef, {
        image: 'Blogs/' + id + '/' + Picture.name
    })
    let Body_Parts = New_Blog_Body.getElementsByClassName('New-Blog-Div-Parts');
    var Full_Body = [];
    var String;
    for (let i = 0; i < Body_Parts.length; i++) {
        switch (Body_Parts[i].classList[1]) {
            case "Im-A-Paragraph":
                String = Extract_Par(Body_Parts[i]);
                Full_Body.push(String);
                break;
            case "Im-A-Header":
                String = Extract_Header(Body_Parts[i]);
                Full_Body.push(String);
                break;
            case "Im-A-FullPic":
                String = Extract_FullPic(Body_Parts[i], id);
                Full_Body.push(String);
                break;
            case "Im-A-HalfPic":
                String = Extract_HalfPic(Body_Parts[i], id);
                Full_Body.push(String);
                break;
            case "Im-A-UList":
                String = Extract_UList(Body_Parts[i]);
                Full_Body.push(String);
                break;
            case "Im-A-NList":
                String = Extract_NList(Body_Parts[i]);
                Full_Body.push(String);
                break;
            default:
                break;
        }
    }
    updateDoc(docRef, {
        'Full-Body': Full_Body,
        ispopular: false,
        Raters: 0,
        rating: 0
    });
    Wait_Blog_Construction();
    const upload = uploadBytes(storageRef, Picture).then((snapshot) => {
    });

};
function Wait_Blog_Construction() {
    let loadingscreen = document.getElementById('Loading-Screen');
    loadingscreen.style.display = "grid";
    let body = document.getElementsByTagName('main')[0];
    body.style.opacity = "0.5";
    body.style.pointerEvents = "none";
    loadingscreen.opacity = "1";
    setTimeout(() => {
        loadingscreen.style.display = "none";
        body.style.opacity = "1";
        body.style.pointerEvents = "all";
        window.location.reload()
    }, 20000);
}
function Extract_Par(div) {
    let text = div.getElementsByTagName('textarea')[0];
    if (text.value == null) { return null }
    let part = "P*" + text.value;
    return part;
};
function Extract_Header(div) {
    let text = div.getElementsByTagName('input')[0];
    let part = "HE*" + text.value;
    if (text.value == null) { return null }
    return part;
};
function Extract_FullPic(div, id) {
    let uploader = div.getElementsByClassName('Image_Uploader')[0];
    let file = uploader.files[0];
    const storageRef = ref(storage, 'Blogs/' + id + '/' + file.name);
    uploadBytes(storageRef, file).then((snapshot) => { });
    let Part = "FP*" + "Blogs/" + id + "/" + file.name;
    return Part;
    ;
};
function Extract_HalfPic(div, id) {
    let uploader = div.getElementsByClassName('Image_Uploader')[0];
    let file = uploader.files[0];
    const storageRef = ref(storage, 'Blogs/' + id + '/' + file.name);
    uploadBytes(storageRef, file).then((snapshot) => { })
    let Part = "HP*" + "Blogs/" + id + "/" + file.name;
    return Part;
    ;
};
function Extract_UList(div) {
    let child1 = div.getElementsByClassName('UL-List')[0];
    let list = child1.getElementsByTagName('ul')[0];
    let LIS = list.getElementsByTagName('li');
    var arr = [];
    var String = "UL*";
    for (let i = 0; i < LIS.length; i++) {
        let input = LIS[i].getElementsByClassName('List-Input')[0];
        if (input.value) {
            arr.push(input.value);
        }
    }
    String = "UL*" + arr.join("*")
    return String;
}
function Extract_NList(div) {
    let child1 = div.getElementsByClassName('Num-List')[0];
    let list = child1.getElementsByTagName('ol')[0];
    let LIS = list.getElementsByTagName('li');
    var arr = [];
    var String = "OL*";
    for (let i = 0; i < LIS.length; i++) {
        let input = LIS[i].getElementsByClassName('List-Input')[0];
        if (input.value) {
            arr.push(input.value);
        }
    }
    String = "OL*" + arr.join("*")
    return String;
}
