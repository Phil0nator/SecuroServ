
function handleMessages(msgs){
    console.log(msgs);
    messages = msgs.split(",");
    var prkey = getPrivateKey();
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
                    if(contacts[j].key == signature&&contacts[j].messages[contacts[j].messages.length] != content){
                        contacts[j].messages.push(contacts[j].name+" : "+content);
                        
                        if(contacts[j] == currentContact){
                            updateMessagesDisplay();
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

function deserializeRSAKey(key) {
    let json = JSON.parse(key);
    let rsa = new RSAKey();
    rsa.setPrivateEx(json.n, json.e, json.d, json.p, json.q, json.dmp1, json.dmq1, json.coeff);
    return rsa;
}

function contain(val, min, max){
    if(val < min){
        return min;
    }
    if(val>max){
        return max;
    }
    return val;
}

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

function generateNewKeys(){
    var passPhrase = createRandomString(); 
    var bits = 2048; 
    var RSAkey = cryptico.generateRSAKey(passPhrase, bits);
    prkey = RSAkey;
    var publicKey = cryptico.publicKeyString(RSAkey);
    pukey = publicKey;
    var privBlob = new Blob([serializeRSAKey(RSAkey)],{ type: "text/plain;charset=utf-8" });
    saveAs(privBlob, "MyPrivateKey.txt");
    setCookie("prk", serializeRSAKey(RSAkey));
    setCookie("puk", cryptico.publicKeyString(RSAkey));
}

function reGenerateKeys(priv){

    var out= cryptico.publicKeyString(priv);
    setCookie("prk", cryptico.privateKeyString(priv));
    setCookie("puk", cryptico.publicKeyString(out));
    return out;
}

function getPrivateKey(){
    return deserializeRSAKey(getCookie("prk"));
}
function getPublicKey(){
    return getCookie("puk");
}

function sendPlainText(text){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    
    xhttp.open("POST", "http://68.123.14.86:"+port+"?rtype=postpost", true);
    
    xhttp.send(text);
    
    return xhttp;
}