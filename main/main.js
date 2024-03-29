const isDev = require('electron-is-dev');
const electron = require('electron');
const prepareNext = require('electron-next');
const { resolve } = require('app-root-path');

// Module to control application life.
const app = electron.app;
const Menu = electron.Menu;

// auto update modules
const autoUpdater = require('electron-updater').autoUpdater;
const dialog = electron.dialog;

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Set up ffmpeg global path
global.ffmpegpath = require('ffmpeg-static').path.replace(
  'app.asar',
  'app.asar.unpacked',
);

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
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

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

autoUpdater.on('update-available', message => {
  console.log('An update is available!');
});

if (isDev) {
  autoUpdater.logger = require('electron-log');
  autoUpdater.logger.transports.file.level = 'info';
}

const setUpMenu = () => {
  if (isDev) {
    // don't set up menu on dev so we can use dev features
    return;
  }
  var template = [
    {
      label: 'Application',
      submenu: [
        {
          label: 'About Application',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:',
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  await prepareNext('./renderer');
  setUpMenu();
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
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 60000);
  }
}
