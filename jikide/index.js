const electron = require('electron');
const clientId = '635970385397022722';
const DiscordRPC = require('discord-rpc');
DiscordRPC.register(clientId);
const rpc = new DiscordRPC.Client({transport: 'ipc'});
let win = null;

electron.app.on('ready', async () => {
  win = new electron.BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.loadFile('browser/index.html');

  win.on('closed', () => {
    electron.app.quit();
  });

  const menu = electron.Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {label: 'Open File',
          async click() {
            const file = await electron.dialog.showOpenDialog({properties: ['openFile']});
            if (file.filePaths[0]) { // j'en ai marre
              win.loadURL(`file://${__dirname}/browser/edit.html?path=${file.filePaths[0]}`);
            }
          }},
        {label: 'Open Folder'},
        {label: 'Save as',
          async click() {
            const hack = await electron.dialog.showSaveDialog(null);
            if (hack.filePath) {
              try {
                const hackig = await win.webContents.executeJavaScript('window.editor.getValue();');
                console.log(hack.filePath);
                console.log(hackig);
                try {
                  require('fs').writeFileSync(hack.filePath, hackig);
                  electron.dialog.showMessageBox({
                    buttons: ['Ok'],
                    message: 'Sucessfully saved.',
                  });
                  win.loadURL(`file://${__dirname}/browser/edit.html?path=${hack.filePath}`);
                } catch (e) {
                  electron.dialog.showMessageBox({
                    buttons: ['Ok'],
                    message: 'I was unable to save the file. Error: ' + e.message,
                  });
                }
              } catch (e) {
                electron.dialog.showMessageBox({
                  buttons: ['Ok'],
                  message: 'I was unable to save the file. Error: ' + e.message,
                });
              }
            }
          }},
        {label: 'Save',
          async click() {
            const toxic = await win.webContents.executeJavaScript('new URL(document.location).searchParams.get("path");');
            if (toxic) {
              try {
                const hackig = await win.webContents.executeJavaScript('window.editor.getValue();');
                try {
                  require('fs').writeFileSync(toxic, hackig);
                  electron.dialog.showMessageBox({
                    buttons: ['Ok'],
                    message: 'Sucessfully saved.',
                  });
                } catch (e) {
                  electron.dialog.showMessageBox({
                    buttons: ['Ok'],
                    message: 'I was unable to save the file. Error: ' + e.message,
                  });
                }
              } catch (e) {
                electron.dialog.showMessageBox({
                  buttons: ['Ok'],
                  message: 'I was unable to save the file. Error: ' + e.message,
                });
              }
            }
          }},
        {label: 'Exit',
          click() {
            electron.app.quit();
          }},
      ],
    },
    {
      label: 'Debug',
      submenu: [
        {label: 'Spawn Dev Tools',
          async click() {
            win.webContents.openDevTools();
          }},

        {label: 'Refresh',
          async click() {
            win.reload();
          }},
      ],
    },
  ]);
  electron.Menu.setApplicationMenu(menu);

  const startTimestamp = new Date();
  rpc.login({clientId}).catch(console.error).then((a) => {
    setInterval(async (a) => {
      try {
        const url = require('url');
        const parsed = url.parse(win.webContents.getURL(), true);
        let pager = win.webContents.getURL().split('/').pop().replace(/.html/g, '');
        let state = 'Idle';
        let details = `On page: ${pager}`;
        if (pager.toLowerCase() == 'index') {
          pager = 'Welcome';
          state = 'Watching';
        } else if (pager.toLowerCase().includes('edit')) {
          const dfodsjf = parsed.query['path'];
          if (dfodsjf) {
            details = `Editing ${dfodsjf.replace(/\\/g, '/').split('/').pop()}`;
          } else {
            details = `Editing a New File`;
          }
          let lines; let line = '0';
          try {
            try {
              lines = await win.webContents.executeJavaScript('if (window.editor) { window.editor.getValue() }');
            } catch (e) {
              lines = 0;
            }
            line = await win.webContents.executeJavaScript('if (window.editor) { window.editor.getPosition() }');
          } catch (e) {
            // const nigga = 'bonnie';
            console.log(e);
          }
          state = `Line ${line.lineNumber}/${lines.split('\n').length}`;
        } else {
          state = 'Editing';
        }
        rpc.setActivity({
          details: details || 'Idle',
          state: state || 'Idle',
          largeImageKey: 'ide',
          largeImageText: 'jik HACK',
          startTimestamp,
          instance: false,
        });
      } catch (e) {
      }
    }, 3000);
  });
});

electron.ipcMain.on('open-file', async (evt) => {
  const file = await electron.dialog.showOpenDialog({properties: ['openFile']});
  if (file.filePaths[0]) { // j'en ai marre
    win.loadURL(`file://${__dirname}/browser/edit.html?path=${file.filePaths[0]}`);
  }
});

electron.ipcMain.on('new-file', async () => {
  win.loadURL(`file://${__dirname}/browser/edit.html`);
});


electron.ipcMain.on('open-project', async (evt) => {
  const walk = (dir) => {
    let results = [];
    const list = require('fs').readdirSync(dir);
    list.forEach((file) => {
      file = dir + '/' + file;
      const stat = require('fs').statSync(file);
      if (stat && stat.isDirectory()) {
        /* Recurse into a subdirectory */
        results = results.concat(walk(file));
      } else {
        /* Is a file */
        results.push(file);
      }
    });
    return results;
  };

  const directory = await electron.dialog.showOpenDialog({properties: ['openDirectory']});
  const extraMan = {
    dir: directory.filePaths[0] || '',
    files: walk(directory.filePaths[0]) || '',
  };
  console.log(JSON.stringify(extraMan));
});
