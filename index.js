const electron = require("electron");
const uuid = require("uuid").v4;
const {app, BrowserWindow, Menu, ipcMain} = electron;

let todayWindow; 
let createWindow;
let listWindow;

let allAppointment = [];

//Start Awal Membuat Aplikasi
app.on("ready", () => {
    todayWindow = new BrowserWindow({
        webPreferences:{
            nodeIntegration: true
        },
        title: "Aplikasi Toko Mainan"
    });

    todayWindow.loadURL(`file://${__dirname}/today.html`);
    todayWindow.on("closed", () =>{
        app.quit();
        todayWindow = null;
    });

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
     Menu.setApplicationMenu(mainMenu);
  
});

//Pembuatan windows Create
const listWindowCreator = () => {
    listWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "LIhat Semua Permakluman"
    });

    listWindow.setMenu(null);
    listWindow.loadURL(`file://${__dirname}/list.html`);
    listWindow.on("closed", () => (listWindow = null))
};

//Pembuatan windows list
const createWindowCreator = () => {
    createWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Buat Permakluman"
    });

    createWindow.setMenu(null);
    createWindow.loadURL(`file://${__dirname}/create.html`);
    createWindow.on("closed", () => (createWindow = null));
};

ipcMain.on("appointment:create", (event, appointment) => {
    appointment["id"] = uuid();
    appointment["done"] = 0;
    allAppointment.push(appointment);
    
    createWindow.close();

    console.log(allAppointment);
});

ipcMain.on("appointment:request:list", event => {
    listWindow.webContents.send('appointment:response:list', allAppointment);
});

ipcMain.on("appointment:request:today", event => {
    console.log("here2");
});

ipcMain.on("appointment:done", (event, id) => {
    console.log("here");
});

//Pembuatan list Menu
const menuTemplate =[{
    label: "File",
    submenu: [{
        label: "Permakluman Baru",
        click(){
            createWindowCreator();
            }
        },{
        label: "Semua Permakluman",
        click(){
            listWindowCreator();
            } 
        },{
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Command + Q" : "Ctrl + Q",
        click(){
            app.quit();
        }    
        }
    ]
},
{
    label: "View",
    submenu: [{ role: "reload" }, { role: "toggledevtools"}]
}
]