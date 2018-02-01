const isDev = require('electron-is-dev');
const electron = require('electron');
const prepareNext = require('electron-next');
const { resolve } = require('app-root-path');

// Module to control application life.
const app = electron.app;

// auto update modules
const autoUpdater = electron.autoUpdater;
const dialog = electron.dialog;

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webSecurity: false,
    },
    titleBarStyle: 'hidden',
  });

  let bounds = mainWindow.getBounds();

  mainWindow.center();

  // and load the index.html of the app.
  const devPath = 'http://localhost:8000/mainMenu';
  const prodPath = url.format({
    pathname: resolve('renderer/out/mainMenu/index.html'),
    protocol: 'file:',
    slashes: true,
  });

  const entry = isDev ? devPath : prodPath;

  mainWindow.loadURL(entry);

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail:
      'A new version has been downloaded. Restart the application to apply the updates.',
  };

  dialog.showMessageBox(dialogOpts, response => {
    if (response === 0) autoUpdater.quitAndInstall();
  });
});

autoUpdater.on('error', message => {
  console.error('There was a problem updating the application');
  console.error(message);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  await prepareNext('./renderer');
  createWindow();
  listenForUpdates();
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// check for updates on start
function listenForUpdates() {
  if (!isDev) {
    const server = 'https://desktop-update.splish.io';
    const feed = `${server}/update/${process.platform}/${app.getVersion()}`;
    autoUpdater.setFeedURL(feed);
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 60000);
  }
}
