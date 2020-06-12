import socket,math
import threading
import sys
import atexit
import time


sockets = [] #all socket objects are appended here so that when application is closed  this array can be indexed and all socket objects can be confirmed to be closed
messages = []
messageCache = ""
HOST = '192.168.1.90'  # IP
PORT = 8000  # Arbitrary non-privileged port

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
startTime = time.time()


print('Socket created')
#print(math.sin(5))
# Bind socket to local host and port
try:
    s.bind((HOST, PORT))
except socket.error as msg:
    print('Bind failed. Error Code : ' + str(msg[0]) + ' Message ' + msg[1])
    sys.exit()

print('Socket bind complete')

# Start listening on socket
s.listen(128)

# now keep talking with the client


#often used headers
HTMLHeader = {}
HTMLHeader["Content-Type"] = "text/html"
HTMLHeader["Connection"] = "Closed"

CORSHTMLHeader = {}
CORSHTMLHeader["Content-Type"] = "text/html"
CORSHTMLHeader["Connection"] = "Closed"
CORSHTMLHeader["Access-Control-Allow-Origin"] = "*"
lock = threading.Lock()


def CreateHeader(headers): #go through the dict of headers and format them properly into a string
    out = ""
    for i in headers.keys():
        out += i + ": " + str(headers[i]) + "\r\n"
    return(out)



def HTTPResponse(socket, text, headers):  #sends text to socket with headers in headers
    headers["Content-Length"] = len(text) #content length is determined by the length of the body 
    responseHeader = CreateHeader(headers) #take headers from headers dict and format them into a string which can later be combined with text to create the outbound message
    response  = "HTTP/1.1 200 OK" + "\r\n" + responseHeader + "\r\n" + text
    byteResponse = response.encode("utf-8") #python3 sockets required things they send to by in the form of bytes
    print(byteResponse)
    socket.send(byteResponse)




def URLDataExtract(line): #extract data from urls/query strings
  #standard format for a urls/query string is a=5&b=6&c=7
  if line[0] == "?":
    line = line[1:]
  output = {}
  fline = line.split("&")
  for i in range(len(fline)):
    sample = fline[i].split("=")
    output[sample[0]] = sample[1]
  return(output)


def HandleHeaders(AllHeaders):
   output = {}
   #print(AllHeaders, "all")
   for i in AllHeaders:
        header = i.split(": ")
        name = 	header[0]
        attribute = header[1][0:-1]
        output[name] = attribute
   #print(output)
   return(output)







def HTTPRequestHandler(req): #request data extractor
    URLparams = None #will hold parameters in query string, things like the a=5&b=10 in www.foo.com/foo.txt?a=5&b=10
    bodyParams = None #body params, params that are sent by POST and encoded with x-www-form-urlencoded
    bodyRaw = ""
    #print(req)
    #req = req.decode("utf-8")
	
    freq = req.split("\n")

    fline = freq[0] #first line of request
    Formatedfline = freq[0].split(" ")
    #print(Formatedfline)
    protocol = Formatedfline[0] #GET or Post or PUT or some other http protocol
    file = Formatedfline[1] #file+query string example :www.foo.com/foo.txt?a=5&b=10
    #following lines are dedicated to pulling url parameters from request


    paramStart = file.find("?") #? indicates start of parameters in http

    if paramStart != -1:
        params = file[paramStart+1:] #add one so as not to include the ? in the parameters
        URLparams = URLDataExtract(params)
    try:
        bodyStart = freq.index("\r") #normally http bodies are identified by anything following a blank like with "\n\r" however since we split on "\n" 						 chars we are looking for  the first line with just "\r"
            
    except ValueError: #.index errors if nothing is found so it is put in a try except struct
       bodyStart = -1
       pass

    if bodyStart != -1:
        AllHeaders = freq[1:bodyStart]
        Headers = HandleHeaders(AllHeaders)
    if protocol == "POST": #POST needs some dedicated code for retrieving body data
       if bodyStart != -1:
                if Headers["Content-Type"] == "application/x-www-form-urlencoded":
                        body = freq[bodyStart+1] #retrieve that line with the parameters, add one becouse we do not care about the line with the "\r"
                        bodyParams = URLDataExtract(body) #extract parameters from the code		
#print(body)
                bodyRaw = "\n".join(freq[bodyStart+1:])
                
	


    	
    #print(URLparams)
    return(protocol,file,bodyParams,URLparams,bodyRaw,Headers)


def cleanup():  #any still live sockets would cause "address already in use" errors so they are confirmed to be closed on exit
	global sockets
	print("cleaning up sockets")
	for i in range(len(sockets)):
		sockets[i].close()
atexit.register(cleanup)

def HeaderExtract(headerString):
        headers = headerString.split("\n")
        #print(headers,"headers")
        headers = HandleHeaders(headers[1:-2])
        return(headers)


def ClientReceiver(socket): #http is a garbage protocol

        
        buffer1 = ""
        crlfbuffer = ""	
        escape = 0
        while escape < 10000:
                escape += 1
                req = (socket.recv(1))
		
                req2 = req.decode("utf-8")
                buffer1 += req2
                if len(buffer1) > 4:
                        if buffer1[-4:] == "\r\n\r\n":
                                #print("end")
                                break
        #print(buffer1)
        headers = HeaderExtract(buffer1)
        finalBuffer = buffer1
        #print(buffer1,"buffer1")
        buffer2 = ""
        if "Content-Length" in headers:
		#print("Content-Length")
                remaining = int(headers["Content-Length"])
                buffer2 = socket.recv(remaining).decode("utf-8")	
		

                finalBuffer = buffer1+buffer2 
        protocol,file,bodyParams,URLparams,bodyraw,headers = HTTPRequestHandler(finalBuffer)
        #print(protocol,"protocol")
        return(protocol,file,bodyParams,URLparams,buffer2,headers)
def ClientHandler(socket,addr): #actual place where code for website behavior is put
	global messages,messageCache
	
	
	
		
	

	
	protocol,file,bodyParams,URLparams,bodyraw,headers = ClientReceiver(socket)
	#print("\n",protocol,"protocol", protocol == "POST")
	if protocol == "POST":
            #print(URLparams,"parameters")
            if URLparams["rtype"] == "postpost":
                with lock:
                    messages.append(bodyraw)
                    messageCache = ",".join(messages)
                    #print(messages)

	if protocol == "GET":
            #pass
		#print(URLparams,"")
		if URLparams["rtype"] == "getposts":
			with lock:
				HTTPResponse(socket, messageCache , CORSHTMLHeader)
				#messages.append(bodyraw)
				#print(messages)
     
            

            
	print(bodyraw)
	
	
	message = """<html>
<body>
<h1>Hello, World!</h1>
</body>
</html>"""
	HTTPResponse(socket, message , CORSHTMLHeader)
	socket.close()
	sys.exit()


def MessageClearer():
    global startTime,messages,messageCache

    if time.time()-startTime > 10:
        messages = []
        messageCache = ""
        startTime = time.time()
        
        
    
    

    

while 1:
    # wait to accept a connection - blocking call

    c, addr = s.accept()
    sockets.append(c)
    print("new client")
    print(addr)
    #c.send(b"an error occurred")

    b_thread = threading.Thread(target=MessageClearer)
    b_thread.daemon = True
    b_thread.start()
    c_thread = threading.Thread(target=ClientHandler, args =(c, addr,))
    c_thread.daemon = True
    c_thread.start()

    # c.send("10.42.0.1")
    # print 'Connected with ' + addr[0] + ':' + str(addr[1])

    
