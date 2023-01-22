const { app, session, BrowserWindow} = require("electron");
const DiscordRPC = require("discord-rpc")
const path = require("path");
if (process.platform != "darwin") require("update-electron-app")({ repo: "ShimixD/Shuffle-Penguin-App" });
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
app.commandLine.appendSwitch("disable-http-cache");
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

if (require("electron-squirrel-startup")) {
    app.quit();
    process.exit(0);
}
app.on('window-all-closed', function() {
    rpc.destroy();
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
            webSecurity: false,
			session: session.fromPartition("example", { cache: false })
        }
    })
    mainWindow.loadURL("https://shufflepenguin.xyz")
    rpc.login({ clientId }).catch(err => {console.log(err)});
}

app.whenReady().then(() => {
    createWindow()
})