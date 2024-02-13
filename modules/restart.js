const colors = require('colors')

const log = function(texto) {
    console.log('['.magenta.dim + (new Date().getHours() + ':' + new Date().getMinutes()).white + ']'.magenta.dim + '['.magenta.dim + 'RESTARTER' + '] '.magenta.dim + texto.grey);
  };

function espera(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

const reinit = async function() {
    log('Reiniciando aplicacion.')
    const command = 'node server.js';

    const { spawn } = require('child_process');
    const child = spawn(command, { stdio: 'inherit', shell: true });

    child.on('exit', (code, signal) => {
    console.log(`La aplicación se reinició con código de salida ${code}`);
    });
}

reinit()