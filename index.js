const { app, dialog, BrowserWindow} = require("electron");
const { autoUpdater } = require("electron-updater");
const DiscordRPC = require("discord-rpc")
const path = require("path");
// Flash deployment
let pluginName;
switch (process.platform) {
	case 'win32': pluginName = `assets/flash/pepflashplayer${['ia32', 'x32'].includes(process.arch) ? '32' : '64'}_32_0_0_303.dll`
		break
	case 'darwin': pluginName = 'assets/flash/PepperFlashPlayer.plugin'
		break
	case 'linux': pluginName = 'assets/flash/libpepflashplayer.so'
            app.commandLine.appendSwitch('no-sandbox');
		break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));
app.commandLine.appendSwitch('ppapi-flash-version', '32.0.0.303');
// Discord RPC
const clientId = '1065041861980475504'; DiscordRPC.register(clientId);
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
rpc.on('ready', () => {
	rpc.setActivity({
		details: `Shuffle Penguin`, 
		state: `Pinguineando`, 
		startTimestamp: new Date(), 
		largeImageKey: `large`, 
	});
});
// Updates
let updateAv = false;
autoUpdater.on('update-downloaded', () => {
    updateAv = true;
});

if (require("electron-squirrel-startup")) {
    app.quit();
    process.exit(0);
}
app.on('window-all-closed', function() {
    rpc.destroy();
    if (updateAv) autoUpdater.quitAndInstall();
    if (process.platform != 'darwin') app.quit();
});

let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
		height: 768,
        icon: "icon.png",
        useContentSize: true,
        autoHideMenuBar: true,
        webPreferences: {
            plugins: true,
            nodeIntegration: false,
            webSecurity: false
        }
    })
    mainWindow.webContents.session.clearHostResolverCache()
    mainWindow.loadURL("https://shufflepenguin.xyz")
    rpc.login({ clientId }).catch(console.error);
}

autoUpdater.on('update-available', (updateInfo) => {
	switch (process.platform) {
	case 'win32':
	    dialog.showMessageBox({
		  type: "info",
		  buttons: ["Ok"],
		  title: "Update Available",
		  message: "There is a new version available (v" + updateInfo.version + "). It will be installed when the app closes."
	    });
	    break
	case 'darwin':
	    dialog.showMessageBox({
		  type: "info",
		  buttons: ["Ok"],
		  title: "Update Available",
		  message: "There is a new version available (v" + updateInfo.version + "). Please go install it manually from the website."
	    });
	    break
	case 'linux':
	    dialog.showMessageBox({
		  type: "info",
		  buttons: ["Ok"],
		  title: "Update Available",
		  message: "There is a new version available (v" + updateInfo.version + "). Auto-update has not been tested on this OS, so if after relaunching app this appears again, please go install it manually."
	    });
	    break
	}
});

app.whenReady().then(() => {
    createWindow()
    autoUpdater.checkForUpdatesAndNotify();
})