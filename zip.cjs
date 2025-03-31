const { zip } = require('zip-a-folder');
const path = require('path');
const fs = require('fs-extra'); // fs-extra para copiar y manipular directorios

async function createZip() {
  try {
    // Carpeta que contiene el build de Vite (ya compilado en "administracion")
    const sourceFolder = path.join(__dirname, 'administracion');
    // Carpeta temporal que usaremos para incluir la carpeta "administracion"
    const tempFolder = path.join(__dirname, 'tempZip');
    const folderName = 'administracion';
    // Dentro de tempFolder, crearemos la carpeta "administracion" con el contenido del build
    const folderInTemp = path.join(tempFolder, folderName);
    // Ruta del archivo ZIP de salida
    const outputZip = path.join(__dirname, 'administracion.zip');
    
    // Elimina la carpeta temporal si existe
    await fs.remove(tempFolder);
    // Crea la carpeta temporal
    await fs.mkdir(tempFolder);
    // Copia la carpeta "administracion" (build) dentro de la carpeta temporal
    await fs.copy(sourceFolder, folderInTemp);
    
    // Comprime la carpeta temporal completa
    await zip(tempFolder, outputZip);
    console.log('Archivo ZIP creado exitosamente en:', outputZip);
    
    // Elimina la carpeta temporal
    await fs.remove(tempFolder);
  } catch (error) {
    console.error('Error al crear el ZIP:', error);
    process.exit(1);
  }
}

createZip();
