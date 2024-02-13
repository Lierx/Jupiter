const colors = require('colors')
const path = require('path');
const now = new Date();
const fs = require('fs');
const hours = now.getHours().toString().padStart(2, '0');
const minutes = now.getMinutes().toString().padStart(2, '0');
const fecha = now.getDate() + '-' + (now.getMonth() + 1) + '-' + now.getFullYear()
const errorsfile = path.join(__dirname, '..', 'errors.txt');
const errorStream = fs.createWriteStream(errorsfile, { flags: 'a' });

const log = function(texto) {
  console.log('['.magenta.dim + (new Date().getHours() + ':' + new Date().getMinutes()).white + ']'.magenta.dim + '['.magenta.dim + 'ERRORS HANDLER' + '] '.magenta.dim + texto.grey);
};

const critico = function(texto) {
  console.error('['.magenta.dim + (hours + ':' + minutes).white + ']'.magenta.dim + '['.magenta.dim + 'ERRORS HANDLER' + ']'.magenta.dim + '['.red.dim + 'CRITICO' + '] '.red.dim + '['.red.dim + 'X' + '] '.red.dim + texto.grey);

}

const logger = function(texto, error) {
  if (error === 'An invalid token was provided.') {
    critico('Se ha proporcionado un token de bot invalido, Imposible comenzar la herramienta')
    process.exit();
  } else if(error === 'Request to use token, but token was unavailable to the client.') {
    critico('Error critico en el arranque, porfavor vuelve a iniciar la herramienta manualmente.')
    process.exit();
  } else if(error === 'Your bot has been flagged by our anti-spam system for abusive behavior. Please reach out to our team by going to https://dis.gd/report and appeal this action taken on your bot.') {
    critico('Tu bot ha sido catalogado como spam, sus acciones son limitadas.')
  } else if(error === 'Unknown Channel') {
    return 
  } else if(error === 'Invalid Role') {
    return
  } else if(error === 'Missing Permissions') {
    return
  } else {
    console.error('['.magenta.dim + (hours + ':' + minutes).white + ']'.magenta.dim + '['.magenta.dim + 'ERRORS HANDLER' + '] '.magenta.dim + '['.red.dim + 'X' + '] '.red.dim + texto.grey + ', Mas informacion en ./errors.txt');
    errorStream.write(`============================ (${hours}:${minutes}) ${fecha}\n${error}\n`);
  }
  }
  


  
if (require.main === module) {
    log('Este archivo es un modulo directo de ./server.js y no deberias ejecutarlo manualmente.')
} else {
    module.exports = {
        error: logger
      };
    if(fs.readFileSync(errorsfile, 'utf-8').trim() === '') {
      errorStream.write('[ Archivo de Logueo de errores, te recomendamos no modificar ni eliminar nada de este archivo ]\n')
    } 


    
    
}
  