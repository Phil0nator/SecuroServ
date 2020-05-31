class Contact{

    constructor(key, name){
        this.key = key;
        this.name=name;
    }

    save(){
        setCookie("]"+this.name,this.key,9999);
    }

}
let pukey;
let prkey;
function sendMessage(message, contact){




}

function getMessages(){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            handleMessages(this.responseText);
        }
    };
    
    xhttp.open("GET", "http://68.123.14.86:8888/msgs.txt", true);
    
    xhttp.send();
    
    return xhttp;

}



function sendMessage(message){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var out =  this.responseText;
            console.log(out);
        }
    };
    
    xhttp.open("POST", "http://68.123.14.86:8888", true);
    
    xhttp.send(cryptico.encrypt(message,getPublicKey()).cipher);
    
    return xhttp;
}
function main(){
    sendMessage("Hello World");    
    
}

 main();