//Handle incoming messages, and display them to the user
function handleMessages(msgs){
    messages = msgs.split(",");
    const prkey = getPrivateKey();
    for(var i = 0 ; i < messages.length;i++){
        var attempt = cryptico.decrypt(messages[i], prkey);
        if( attempt["status"] == "failure" ){
            continue;
        }
        else{
            var content = attempt["plaintext"];
            if(attempt["signature"] == "verified"){
                var signature = attempt["publicKeyString"];
                for(var j = 0 ;j < contacts.length;j++){
                    if(contacts[j].key+"==" == signature&&contacts[j].messages[contacts[j].messages.length-1] !=contacts[j].name+" : "+  content){
                        contacts[j].messages.push(contacts[j].name+" : "+content);
                        
                        if(contacts[j] == currentContact){
                            updateMessagesDisplay(false);
                        }else{
                            contacts[j].addPending();
                        }
                    }
                }
            }else{
                continue;
            }
        }
    }
}

//Convert between key objects and strings
function serializeRSAKey(key) {
    return JSON.stringify({
      coeff: key.coeff.toString(16),
      d: key.d.toString(16),
      dmp1: key.dmp1.toString(16),
      dmq1: key.dmq1.toString(16),
      e: key.e.toString(16),
      n: key.n.toString(16),
      p: key.p.toString(16),
      q: key.q.toString(16)
    })
  }
//Convert between key objects and strings
function deserializeRSAKey(key) {
    let json = JSON.parse(key);
    let rsa = new RSAKey();
    rsa.setPrivateEx(json.n, json.e, json.d, json.p, json.q, json.dmp1, json.dmq1, json.coeff);
    return rsa;
}
//clamp
function contain(val, min, max){
    if(val < min){
        return min;
    }
    if(val>max){
        return max;
    }
    return val;
}
//randomize a passphrase for key generation (Extra randomness based on text the user has currently selected)
function createRandomString(){

    var out = "";
    for(var i = 0 ; i < Math.random()*100; i++){
        out+=String.fromCharCode(contain(Math.floor(Math.random()*100), 0, 256));
        if(Math.random()<0.5){
            out+=window.getSelection();
        }
    }
    return out;

}
//Use cryptico to generate RSA keypairs
function generateNewKeys(){
    const passPhrase = createRandomString(); 
    const bits = 2048; 
    const RSAkey = cryptico.generateRSAKey(passPhrase, bits);
    prkey = RSAkey;
    const publicKey = cryptico.publicKeyString(RSAkey);
    pukey = publicKey;
    window.localStorage.setItem("prk",serializeRSAKey(RSAkey));
    window.localStorage.setItem("puk",cryptico.publicKeyString(RSAkey));
    document.getElementById('aim_pukey_disp').innerHTML = getPublicKey();
}

function reGenerateKeys(priv){

    const out= cryptico.publicKeyString(priv);
    setCookie("prk", cryptico.privateKeyString(priv));
    setCookie("puk", cryptico.publicKeyString(out));
    return out;
}

function getPrivateKey(){
    return deserializeRSAKey(window.localStorage.getItem("prk"));
}
function getPublicKey(){
    return window.localStorage.getItem("puk");
}
//Testing function to send plaintext to the server
function sendPlainText(text){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);
        }
    };
    
    xhttp.open("POST", addr+":"+port+"?rtype=postpost", true);
    
    xhttp.send(text);
    
    return xhttp;
}
