let port = "8000";
//let addr = "http://68.123.14.86";
let addr = "http://70.142.145.111";
let isBrowswer = false;
try{
    //electron
    const { app, BrowserWindow } = require('electron')

    function createWindow () {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        frame:true,
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

}














if(!isBrowswer){
    document.getElementById("padding-electron").style="height:30px";
}














class Contact{

    constructor(key, name){
        this.key = key;
        this.name=name;
        this.messages=["SecuroServ: This is the beggining of your conversation"];
        this.button = undefined;
        this.div = undefined;
        this.pending=0;
        this.messageElements = [];
    }
    

    save(){
        return {"name": this.name, "key":this.key};
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
        option.onclick=function(){openContactEdit(this.contacta);}
        menu.appendChild(option);

        this.div.appendChild(menu);
    }

    hideEditMenu(){
        this.div.removeChild(document.getElementById(this.name+"editmenu"));
    }

    delete(){
        document.getElementById("contact_list").removeChild(this.div);
        contacts.splice(contacts.indexOf(this));
        saveContacts();
        loadContacts();
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
    try{
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                handleMessages(this.responseText);
            }
        };
        
        xhttp.open("GET", addr+":"+port+"?rtype=getposts", true);
        
        xhttp.send();
        
        return xhttp;
    }catch(err){
        
    }
}

function cssOverride(name,rules){
    var style = document.createElement('style');
    style.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(style);
    if(!(style.sheet||{}).insertRule) {
        (style.styleSheet || style.sheet).addRule(name, rules);
    }
    else{
        style.sheet.insertRule(name+"{"+rules+"}",0);
    }
}


function updateMessagesDisplay(full){
    if(full){
        document.getElementById("messages_list").innerHTML = "";
        
        for(var i = 0;i < currentContact.messageElements.length;i++){
            document.getElementById("messages_list").appendChild(currentContact.messageElements[i]);
        }
    }

    for(var i = currentContact.messageElements.length; i < currentContact.messages.length;i++){
        var p = currentContact.messages[i].split(":");
        currentContact.messageElements.push(createMessageElement(p[0],p[1]));
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
    
    xhttp.open("POST", addr+":"+port+"?rtype=postpost", true);
    var outdata = cryptico.encrypt(message,contact.key,getPrivateKey()).cipher;
    xhttp.send(outdata);
    currentContact.messages.push("You:"+message);
    createMessageElement("You", message);
    return xhttp, outdata;
}

function saveContacts(){
    var out = {};
    for(var i = 0 ; i < contacts.length;i++){
        out[""+i] = (JSON.stringify(contacts[i].save()));
    }
    window.localStorage.setItem("contacts", JSON.stringify(out));
    window.localStorage.setItem("contactlength", contacts.length);
}
function loadContacts(){
    contacts=[];
    var dat = window.localStorage.getItem("contacts");
    var jsonified = JSON.parse(dat);
    var len = parseInt(window.localStorage.getItem("contactlength"));

    for(var i = 0 ; i < len;i++){
        var inf = JSON.parse(jsonified[""+i]);
        contacts.push(new Contact(inf["key"], inf.name));
    }
    return jsonified;
}

function main(){
    //load contacts

    if(window.localStorage.getItem("contacts") == null){
        window.localStorage.setItem("contacts", "");
    }
    if(getPublicKey()==""||getPrivateKey()==""){
        generateNewKeys();
    }
    loadContacts();
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
    var diver = document.createElement("li");
    var button = document.createElement("div");
    button.appendChild(document.createTextNode(name));
    button.setAttribute("id", name);
    button.setAttribute("class", "uk-button uk-text-truncate uk-button-secondary uk-background-secondary uk-width-1-1 uk-box-shadow-small uk-box-shadow-hover-large");
    button.setAttribute("uk-margin","");
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
    var color;
    if(name == currentContact.name){
        color = "uk-text-success";
    }else if(name=="SecuroServ"){
        color="uk-text-warning uk-text-bold";
    }
    else{
        color="uk-text-primary";
    }
    console.log(color);

    var d = document.createElement("li");
    d.setAttribute("class","uk-card-secondary uk-card-large uk-animation-slide-left-small");
    d.style.height=50;
    var sp = document.createElement("p");
    sp.setAttribute("class", "uk-text uk-text-middle "+color);
    sp.setAttribute("style", "padding-left:1%");
    sp.setAttribute("uk-tooltip", "title:"+new Date(Date.now())+";pos:bottom-right");
    var text = document.createTextNode(name+" : "+messagetext);
    sp.appendChild(text);
    d.appendChild(sp);
    document.getElementById("messages_list").appendChild(d);
    return d;
    /*
    <div class="uk-card uk-card-secondary msg uk-card-small">
        <span class="uk-text-middle uk-text-truncate msg_text" style="padding-left:1%">This is a message</span>
    </div>
    */
}

function addNewContact(name, key){
    var newcontact = new Contact(key,name);
    contacts.push(newcontact);
    createContactElement(name,contacts.length-1);
    saveContacts();
}

 //callbacks:
function messageBox_onEnter(){
    console.log(sendMessage(document.getElementById("message").value, currentContact));
    document.getElementById("message").value="";
    document.getElementById("scroller").scrollBy(0,100);
    return true;
}

function contact_onpress(index){
    
    currentContact = contacts[index];
    currentContact.removePending();
    updateMessagesDisplay(true);
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

function submit_new_contact(){
    var ncn = document.getElementById("new_contact_name").value;document.getElementById("new_contact_name").value="";
    var nck = document.getElementById("new_contact_key").value;document.getElementById("new_contact_key").value="";
    
    addNewContact(ncn, nck);
    closeNewContactMenu();
}

function openContactEdit(contact){
    openSideMenu("edit_contact");
    var _name = document.getElementById("ec_name");
    var _key = document.getElementById("ec_key");
    var _sub = document.getElementById("ec_submit");
    _name.value = contact.name;
    _key.value=contact.key;
    _sub.contacta = contact;
}
function closeContactEdit(){
    closeSideMenu("edit_contact");
}

function submit_edit_contact(contact){
    var _name = document.getElementById("ec_name").value;
    var _key = document.getElementById("ec_key").value;
    contact.delete();
    addNewContact(_name,_key);
    closeContactEdit();
    stopEditingContacts();
}


function editContacts(){
    document.getElementById("edit_contact_overlay").style.visibility="visible";
    for(var i = 0 ; i < contacts.length; i++){
        contacts[i].showEditMenu();
    }
}
function stopEditingContacts(){
    document.getElementById("edit_contact_overlay").style.visibility="hidden";

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