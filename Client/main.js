//define server location
let port = "8000";
let addr = "http://70.142.145.111";
let isBrowswer = false; //electron compatibility


try{
	isBrowser=!browser_probe();
	
}catch(err){
	isBrowser=true;
}

//Class to contain contact info and DOM elements
class Contact{

    constructor(key, name){
        this.key = key;
        this.name=name;
        this.messages=["This is the beginning of your conversation"];
        this.button = undefined;
        this.div = undefined;
        this.pending=0;
        this.messageElements = []; //existing DOM elements associated with messages for this contact
    }
    

    save(){
        return {"name": this.name, "key":this.key};
    }
    //Pending messages badge
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
        option.setAttribute("uk-toggle","#edit_contact_menu");
        option.contacta =this;
        option.onclick=function(){openContactEdit(this.contacta);}
        menu.appendChild(option);

        this.div.appendChild(menu);
    }

    hideEditMenu(){
        document.getElementById("contact_"+this.name).removeChild(document.getElementById(this.name+"editmenu"));
    }

    delete(){
    	console.log(contacts);
        document.getElementById("contact_list").removeChild(this.div);
        contacts.splice(contacts.indexOf(this),1);
        saveContacts();
        loadContacts();
        console.log(contacts);
    }

    removePending(){
        if(this.pending==0){return;}
        this.div.removeChild(document.getElementById(this.name+"pendingSymbol"));
        this.pending=0;
    }

}
var pukey;
var prkey;
var currentContact;
var contacts= new Array(0);
/**
 * Request existing messages from server, pass to handleMessages
 * @see handleMessages(string)
 */
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

/**
 * Update DOM elements in the messages list based on the contact that the user has selected.
 * @param {boolean} full weather or not to fully re-render DOM elements
 */
function updateMessagesDisplay(full){

    if(full){
        document.getElementById("messages_list").innerHTML="";
        for(var i = 0;i < currentContact.messageElements.length;i++){
            document.getElementById("messages_list").appendChild(currentContact.messageElements[i]);
        }
    }

    for(var i = currentContact.messageElements.length; i < currentContact.messages.length;i++){
        var p = currentContact.messages[i].split(":");
        currentContact.messageElements.push(createMessageElement(p[0],p[1]));
    }
}
/**
 * Encrypt and send a message to the server
 * @param {string} message the message content
 * @param {Contact} contact the contact object to send to
 */
function sendMessage(message,contact){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var out =  this.responseText;
        }
    };
    
    xhttp.open("POST", addr+":"+port+"?rtype=postpost", true);
    var outdata = cryptico.encrypt(message,contact.key,getPrivateKey()).cipher;
    xhttp.send(outdata);
    currentContact.messages.push("You:"+message);
    createMessageElement("You", message);
    return xhttp, outdata;
}
/**
 * Update local storage with contacts
 */
function saveContacts(){
    var out = {};
    for(var i = 0 ; i < contacts.length;i++){
        out[""+i] = (JSON.stringify(contacts[i].save()));
    }
    window.localStorage.setItem("contacts", JSON.stringify(out));
    window.localStorage.setItem("contactlength", contacts.length);
}
/**
 * Update the array 'contacts' from local storage
 */
function loadContacts(){
    contacts=[];
    var dat = window.localStorage.getItem("contacts");
    var jsonified = JSON.parse(dat);
    var len = parseInt(window.localStorage.getItem("contactlength"));

    for(var i = 0 ; i < len;i++){
        var inf = JSON.parse(jsonified[""+i]);
        contacts.push(new Contact(inf["key"], inf.name));
	currentContact=contacts[i];	contacts[i].messageElements.push(createMessageElement("SecuroServ",contacts[i].messages[0]));
        document.getElementById("messages_list").innerHTML = "";
    }
    return jsonified;
}
/**
 * Setup necessary variables and pre-requisites for running.
 */
function main(){

    if(window.localStorage.getItem("contacts") == null){
        window.localStorage.setItem("contacts", "");
    }
    if(getPublicKey()==""||getPrivateKey()==""){
        generateNewKeys();
    }
    try{
    	loadContacts();
    	if(contacts.length<1){
    	addNewContact("Default Contact", "<insert key>");
    	}
    }catch(err){
    	addNewContact("Default Contact", "<insert key>");
    }
    
    
    
    currentContact=contacts[0];
    document.getElementById("current_contact_disp").innerHTML = "@"+currentContact.name;
    for(var i = 0 ; i < contacts.length;i++){
        createContactElement(contacts[i].name, i);
    }
    setInterval(getMessages,5000);

}
//electron compatibility
if(isBrowser){
	var contactlist = document.getElementById("contact_list");
	main();
}
/**
 * Create a DOM element for a contact
 * @param {string} name name of a contact
 * @param {int} index index in the array 'contacts'
 */
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
    diver.appendChild(button);
    diver.setAttribute("id","contact_"+name);
    contactlist.appendChild(diver);
    /*
    <button id=name class = "uk-button uk-button-secondary uk-button-large contact uk-text-truncate uk-animation-slide-right"></button>
    */
}
/**
 * Create a DOM element for a message
 * @param {string} name sender
 * @param {string} messagetext payload 
 */
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
/**
 * Create a new contact (Including DOM element)
 * @param {string} name 
 * @param {PublicKey} key public key 
 */
function addNewContact(name, key){
    var newcontact = new Contact(key,name);
    contacts.push(newcontact);
    createContactElement(name,contacts.length-1);
    saveContacts();
}

//callbacks:

/**
 * Callback for sending a message
 */
function messageBox_onEnter(){
    sendMessage(document.getElementById("message").value, currentContact);
    document.getElementById("message").value="";
    document.getElementById("scroller").scrollBy(0,100);
    return true;
}
/**
 * Callback for clicking a contact's button
 * @param {int} index index of contact in the array 'contacts'
 */
function contact_onpress(index){
    
    currentContact = contacts[index];
    currentContact.removePending();
    updateMessagesDisplay(true);
    document.getElementById("current_contact_disp").innerHTML = "@"+currentContact.name;
}
/**
 * Set group of DOM elements to visible
 * @param {string} name container id
 * @deprecated
 */
function openContent(name){
    var elems = document.getElementById(name).querySelectorAll("*");
    for(var i = 0 ; i < elems.length;i++){
        elems[i].style.visibility="visible";
    }
    document.getElementById(name).style.visibility="visible";

    return elems;
}
/**
 * Set group of DOM elements to hidden
 * @param {string} name container id
 * @deprecated
 */
function closeContent(name){
    var elems = document.getElementById(name).querySelectorAll("*");
    for(var i = 0 ; i < elems.length;i++){
        elems[i].style.visibility="hidden";
    }
    document.getElementById(name).style.visibility="hidden";
    return elems;

}
/**
 * Callback for submitting new contacts
 */
function submit_new_contact(){
    var ncn = document.getElementById("new_contact_name").value;document.getElementById("new_contact_name").value="";
    var nck = document.getElementById("new_contact_key").value;document.getElementById("new_contact_key").value="";
    
    addNewContact(ncn, nck);

}
/**
 * Setup edit contact menu with correct values
 * @param {Contact} contact 
 */
function openContactEdit(contact){
    var _name = document.getElementById("ec_name");
    var _key = document.getElementById("ec_key");
    var _sub = document.getElementById("ec_submit");
    _name.value = contact.name;
    _key.value=contact.key;
    _sub.contacta = contact;
}
/**
 * Apply changes to a contact
 * @param {Contact} contact 
 */
function submit_edit_contact(contact){
    var _name = document.getElementById("ec_name").value;
    var _key = document.getElementById("ec_key").value;
    contact.delete();
    addNewContact(_name,_key);
    stopEditingContacts();
}

/**
 * Show DOM elements associated with editing contacts
 */
function editContacts(){
    for(var i = 0 ; i < contacts.length; i++){
        contacts[i].showEditMenu();
    }
}
/**
 * Hide DOM elements associated with editing contacts
 */
function stopEditingContacts(){
    for(var i = 0 ; i < contacts.length; i++){
        contacts[i].hideEditMenu();
    }
}

//Toggle edit menu
let editToggle = false;

function toggleEdit(){
    try{
	    editToggle=!editToggle;
	    if(editToggle){
		editContacts();
	    }else{
		stopEditingContacts();
	    }
    }catch(err){
    	window.location.reload();
    }
}
