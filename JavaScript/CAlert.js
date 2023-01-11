let AContainer = document.getElementById('CAlert-Container');
export function CAlert(type,msg,time = 4000,width=20){
    AContainer.style.width = width+"rem";
    let Alert_Icon = document.getElementById('Alert-Icon');
    let Alert_Text = document.getElementById('Alert-Text');
    Alert_Text.innerHTML = msg ;
    switch(type){
        case "Warning" :
            AContainer.style.backgroundColor = "#FE9705";
            Alert_Icon.innerHTML = "priority_high";
            break;
        case "Error" :
            AContainer.style.backgroundColor = "#D11313";
            Alert_Icon.innerHTML = "error";
            break;
        case "Info":
            AContainer.style.backgroundColor = "#fafe05";
            Alert_Icon.innerHTML = "help_outline";
            break ;
        case "Notif":
            AContainer.style.backgroundColor = "rgb(33, 183, 189)";
            Alert_Icon.innerHTML = "notifications";
            break ;
        default:
            AContainer.style.backgroundColor = "#3AC430";
            Alert_Icon.innerHTML = "done";
            break ;
    };
    AContainer.classList.add("show");
    AContainer.classList.remove("hide");
    AContainer.classList.add("showAlert");
    setTimeout(()=>{
    AContainer.classList.remove("show");
    AContainer.classList.add("hide");
    AContainer.classList.remove("showAlert");
    },time);
};