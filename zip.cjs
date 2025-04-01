const { zip } = require('zip-a-folder');
const path = require('path');

async function createZip() {
  try {
    const sourceFolder = path.join(__dirname, 'administracion');  // Carpeta de salida de Vite
    const outputZip = path.join(__dirname, 'administracion.zip');   // Nombre del ZIP resultante
    await zip(sourceFolder, outputZip);
    console.log('Archivo ZIP creado exitosamente en:', outputZip);
  } catch (error) {
    console.error('Error al crear el ZIP:', error);
    process.exit(1);
  }
}

createZip();