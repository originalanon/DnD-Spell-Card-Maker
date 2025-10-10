const { contextBridge } = require('electron');
const fs = require('fs');
const path = require('path');

const TEMPLATE_DIR = __dirname; 

contextBridge.exposeInMainWorld('fsAPI', {
  getTemplate: async (filename) => {
    const safeName = path.basename(String(filename)); // defend against weird inputs
    const fullPath = path.join(TEMPLATE_DIR, safeName);
    return fs.promises.readFile(fullPath, 'utf8');
  },
  writeFile: async (filename, content) => {
    const safeName = String(filename).replace(/[\\/:*?"<>|]/g, '_');
    const cardsDir = path.join(__dirname, 'cards');
    await fs.promises.mkdir(cardsDir, { recursive: true });
    const fullPath = path.join(cardsDir, safeName);
    await fs.promises.writeFile(fullPath, content, 'utf8');
  }
});
