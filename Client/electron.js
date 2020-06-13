try{
    //electron
    const { app, BrowserWindow } = require('electron')

    function createWindow () {
        // Create the browser window.
        const win = new BrowserWindow({
            width: 1900,
            height: 1000,
            frame:true,
            webPreferences: {
            nodeIntegration: true
            }
        })

        // and load the index.html of the app.
        
        win.loadFile('index.html');

        
        
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
    
    app.on('dom-ready;', () =>{
    	// Open the DevTools.
        document.getElementById("padding-electron").style="height:30px";
    	var custome_titlebar_error = false;
    	try{
	//electron topbar
		const customTitlebar = require('custom-electron-titlebar');
	
		new customTitlebar.Titlebar({
	   	 backgroundColor: customTitlebar.Color.fromHex('#444'),
	 	   top:-5
		});
 	  }catch(err){
		custome_titlebar_error=true;
   	
   	 }
   	 contactlist = document.getElementById("contact_list");
    	 main();
    })

    // In this file you can include the rest of your app's specific main process
    // code. You can also put them in separate files and require them here.

}catch(err){
    isBrowswer=true;

}

function browser_probe(){
	return true;
}


