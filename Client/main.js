let port = "8000"
let isBrowswer = false;
try{
    //electron
    const { app, BrowserWindow } = require('electron')

    function createWindow () {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        frame:false,
        webPreferences: {
        nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    win.loadFile('index.html')

    // Open the DevTools.
    win.webContents.openDevTools()
    }

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.whenReady().then(createWindow)

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
    })

    app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
    })

    // In this file you can include the rest of your app's specific main process
    // code. You can also put them in separate files and require them here.

}catch(err){
    isBrowswer=true;
    document.getElementById("topbanner-backingfb").style.height="0px";
}





























class Contact{

    constructor(key, name){
        this.key = key;
        this.name=name;
        this.messages=["This is the beggining of your conversation"];
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

    showEditMenu(){
        /*
        
        <div id="name+editMenu">
            <a uk-icon="icon: minus" class="uk-margin-medium-left uk-icon-button"uk-tooltip="title:Remove Contact;pos:bottom" onclick=""></a>
        
        */

        var menu = document.createElement("div");
        
        menu.setAttribute("id",this.name+"editmenu");
        menu.setAttribute("class", "uk-margin-medium-left uk-margin-small-bottom");
        var rmv = document.createElement("a");
        rmv.setAttribute("uk-icon", "icon: minus");
        rmv.setAttribute("class", "uk-icon-button");
        rmv.setAttribute("uk-tooltip","title:Remove "+this.name+";pos:bottom-left");
        rmv.contacta =this;
        rmv.onclick = function(){this.contacta.delete();};
        menu.appendChild(rmv);

        var option = document.createElement("a");
        option.setAttribute("uk-icon", "icon: settings");
        option.setAttribute("class", "uk-icon-button uk-margin-small-left");
        option.setAttribute("uk-tooltip","title:Configure "+this.name+";pos:bottom-left");
        option.contacta =this;

        menu.appendChild(option);

        this.div.appendChild(menu);
    }

    hideEditMenu(){
        this.div.removeChild(document.getElementById(this.name+"editmenu"));
    }

    delete(){
        deleteCookie("]"+this.name);
        document.getElementById("contact_list").removeChild(this.div);
    }

    removePending(){
        if(this.pending==0){return;}
        this.div.removeChild(document.getElementById(this.name+"pendingSymbol"));
        this.pending=0;
    }

}
let pukey;
let prkey;
let currentContact;
let contacts= new Array(0);

function getMessages(){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            handleMessages(this.responseText);
        }
    };
    
    xhttp.open("GET", "http://68.123.14.86:"+port+"?rtype=getposts", true);
    
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

function sendMessage(message,contact){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var out =  this.responseText;
            //console.log(out);
        }
    };
    
    xhttp.open("POST", "http://68.123.14.86:"+port+"?rtype=postpost", true);
    var outdata = cryptico.encrypt(message,contact.key,getPrivateKey()).cipher;
    xhttp.send(outdata);
    currentContact.messages.push("You:"+message);
    createMessageElement("You", message);
    return xhttp, outdata;
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
    setInterval(getMessages,5000);

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
    sp.setAttribute("uk-tooltip", "title:"+new Date(Date.now())+";pos:bottom-right");
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
    contacts.push(newcontact);
    createContactElement(name,contacts.length-1);
    
}

 //callbacks:
function messageBox_onEnter(){
    console.log(sendMessage(document.getElementById("message").value, currentContact));
    document.getElementById("message").value="";
    document.getElementById("messages_display").scrollBy(0,100);
    return true;
}

function contact_onpress(index){
    currentContact.div.setAttribute("class", "uk-background-secondary");
    currentContact = contacts[index];
    currentContact.removePending();
    currentContact.div.setAttribute("class", "uk-background-primary");
    updateMessagesDisplay();
    document.getElementById("current_contact_disp").innerHTML = "@"+currentContact.name;
}
function openContent(name){
    var elems = document.getElementById(name).querySelectorAll("*");
    for(var i = 0 ; i < elems.length;i++){
        elems[i].style.visibility="visible";
    }
    document.getElementById(name).style.visibility="visible";

    return elems;
}
function closeContent(name){
    var elems = document.getElementById(name).querySelectorAll("*");
    for(var i = 0 ; i < elems.length;i++){
        elems[i].style.visibility="hidden";
    }
    document.getElementById(name).style.visibility="hidden";
    return elems;

}
function openSideMenu(name){
    var menu = document.getElementById(name);
    var innermenu = document.getElementById(name+"_bg");
    innermenu.setAttribute("class", "");
    innermenu.offsetHeight;
    innermenu.setAttribute("class", "uk-background uk-background-primary contact_area uk-animation-slide-top-small");
    openContent(name);
}
function closeSideMenu(name){
    var menu = document.getElementById(name);
    var innermenu = document.getElementById(name+"_bg");
    innermenu.setAttribute("class", "");
    innermenu.offsetHeight;
    innermenu.setAttribute("class", "uk-background uk-background-primary contact_area uk-animation-slide-left-small uk-animation-reverse");
    setTimeout(function(){closeContent(name);},750);
    
}
function openNewContactMenu(){
    openSideMenu("new_contact_menu");
}
function closeNewContactMenu(){
    closeSideMenu("new_contact_menu");
}
function submit_new_contact(){
    var ncn = document.getElementById("new_contact_name").value;document.getElementById("new_contact_name").value="";
    var nck = document.getElementById("new_contact_key").value;document.getElementById("new_contact_key").value="";
    
    addNewContact(ncn, nck);
    closeNewContactMenu();
}
function openSettingsMenu(){
    openSideMenu("settings_menu");
}
function closeSettingsMenu(){
    closeSideMenu("settings_menu");
}

function openAccountInfo(){
    openSideMenu("account_info");
    document.getElementById("aim_pukey_disp").innerHTML = getPublicKey();
}
function closeAccountInfo(){
    closeSideMenu("account_info");
}


function editContacts(){
    for(var i = 0 ; i < contacts.length; i++){
        contacts[i].showEditMenu();
    }
}
function stopEditingContacts(){
    for(var i = 0 ; i < contacts.length; i++){
        contacts[i].hideEditMenu();
    }
}

let editToggle = false;

function toggleEdit(){
    editToggle=!editToggle;
    if(editToggle){
        editContacts();
    }else{
        stopEditingContacts();
    }
}