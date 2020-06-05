class Contact{

    constructor(key, name){
        this.key = key;
        this.name=name;
        this.messages=[];
        this.button = undefined;
        this.div = undefined;
        this.pending=0;
    }

    save(){
        setCookie("]"+this.name,this.key,999999999);
    }

    addPending(){
        this.pending++;
        var alreadyPending = document.getElementById(this.name+"pendingSymbol");
        if(alreadyPending != undefined){
            alreadyPending.innerHTML = parseInt( alreadyPending.innerHTML )+1;
        }else{
            alreadyPending = document.createElement("span");
            alreadyPending.setAttribute("class", "uk-badge uk-animation-slide-bottom-medium");
            alreadyPending.innerHTML = this.pending;
            alreadyPending.setAttribute("id", this.name+"pendingSymbol");
            this.div.appendChild(alreadyPending);
        }

    }

    removePending(){
        this.div.removeChild(document.getElementById(this.name+"pendingSymbol"));
        this.pending=0;
    }

}
let pukey;
let prkey;
let currentContact;
let contacts= new Array(0);
function sendMessage(message, contact){




}

function getMessages(){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            handleMessages(this.responseText);
        }
    };
    
    xhttp.open("GET", "http://68.123.14.86:8888?rtype=getposts", true);
    
    xhttp.send();
    
    return xhttp;

}

function updateMessagesDisplay(){
    document.getElementById("messages_list").innerHTML = "";
    for(var i = 0 ; i < currentContact.messages.length;i++){
        var p = currentContact.messages[i].split(":");
        createMessageElement(p[0],p[1]);
    }
}

function sendMessage(message){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var out =  this.responseText;
            console.log(out);
        }
    };
    
    xhttp.open("POST", "http://68.123.14.86:8888?rtype=postpost", true);
    
    xhttp.send(cryptico.encrypt(message,getPublicKey()).cipher);
    currentContact.messages.push("You:"+message);
    createMessageElement("You", message);
    return xhttp;
}
function main(){
    //load contacts
    var stringcontacts = document.cookie.split(";");
    for(var i = 0 ; i < stringcontacts.length; i++){
        if(stringcontacts[i].startsWith(" ]")){
            var cinfo = stringcontacts[i].split("=");
            contacts.push(new Contact(cinfo[1],cinfo[0].substring(2,cinfo[0].length)));
        }
    }
    console.log(contacts);
    currentContact=contacts[0];
    document.getElementById("current_contact_disp").innerHTML = "@"+currentContact.name;
    for(var i = 0 ; i < contacts.length;i++){
        createContactElement(contacts[i].name, i);
    }
    

}
var contactlist = document.getElementById("contact_list");
main();

function createContactElement(name, index){
    var diver = document.createElement("div");
    diver.setAttribute("class", "uk-background uk-background-secondary");
    var button = document.createElement("button");
    button.appendChild(document.createTextNode(name));
    button.setAttribute("id", name);
    button.setAttribute("class", "uk-button uk-button-secondary uk-button-large contact uk-text-truncate uk-animation-slide-right");
    button.cindex = index;
    button.addEventListener('click', function(){
        contact_onpress(this.cindex);
    });
    contacts[index].button = button;
    contacts[index].div = diver;
    diver.appendChild(button)
    contactlist.appendChild(diver);
    /*
    <button id=name class = "uk-button uk-button-secondary uk-button-large contact uk-text-truncate uk-animation-slide-right"></button>
    */
}

function createMessageElement(name, messagetext){
    var d = document.createElement("div");
    d.setAttribute("class","uk-card uk-card-secondary msg uk-card-small uk-animation-slide-left-small");
    var sp = document.createElement("span");
    sp.setAttribute("class", "uk-text-middle uk-text-truncate msg_text");
    sp.setAttribute("style", "padding-left:1%");
    var text = document.createTextNode(name+" : "+messagetext);
    sp.appendChild(text);
    d.appendChild(sp);
    document.getElementById("messages_list").appendChild(d);
    /*
    <div class="uk-card uk-card-secondary msg uk-card-small">
        <span class="uk-text-middle uk-text-truncate msg_text" style="padding-left:1%">This is a message</span>
    </div>
    */
}

function addNewContact(name, key){
    var newcontact = new Contact(key,name);
    newcontact.save();
    createContactElement(name,contacts.length);
    contacts.push(newcontact);
}

 //callbacks:
function messageBox_onEnter(){
    sendMessage(document.getElementById("message").value);
    document.getElementById("message").value="";
    document.getElementById("messages_display").scrollBy(0,100);
    return true;
}

function contact_onpress(index){
    currentContact = contacts[index];
    updateMessagesDisplay();
    document.getElementById("current_contact_disp").innerHTML = "@"+currentContact.name;
}