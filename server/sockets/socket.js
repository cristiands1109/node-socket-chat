// SOCKET CHAT BACK END
const { io } = require('../server');


// requerimiento para utilizar la clase usuario
const { Usuarios } = require('../classes/usuarios');

// requerimiento para utilizar la clase utilidades.js
const { crearMensaje } = require('../utilidades/utilidades');


// se inicializa una variable local
const usuarios = new Usuarios();

io.on('connection', (client) => {

    // escuchando quien es el usuario que ingresa al chat
    // escuchando entrar socket-chat / entrarChat

    client.on('entrarChat', (data, callback) => {



        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        client.join(data.sala);

        let personas = usuarios.agregarPersonas(client.id, data.nombre, data.sala);


        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));

        callback(usuarios.getPersonasPorSala(data.sala));
    });


    // escuchando envio de mensaje

    client.on('crearMensaje', (data) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

    });


    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandono el chat`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));

    });


    // mensajes privados

    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.id, data.mensaje));

    });



});