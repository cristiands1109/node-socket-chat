// SOCKET CHAT FRONT END
var socket = io();

var params = new URLSearchParams(window.location.search);

// condicional de si dentro de los parametros recibidos por url NO viene el nombre
// lanza un error y redirige al index
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}


// Si para el condicional significa que viene el nombre, entonces
// procedemos a crear una variable (Arreglo) para almacenar el dato

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};


socket.on('connect', function() {
    console.log('Conectado al servidor');
    // emitiendo quien es el usuario que ingresa al chat al socket del backend
    // emitiendo al socket (del backend) / entrarChat

    // socket para emitir infomracion del usuario al socket-Backend

    socket.emit('entrarChat', usuario, function(resp) {
        // console.log('Usuarios conectados', resp);

        renderizarUsuarios(resp);
    });

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crearMensaje', {
//     nombre: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    // console.log('Servidor:', mensaje);
    renderizarMensajes(mensaje, false);
    scrollBottom();

});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat

socket.on('listaPersona', function(personas) {
    renderizarUsuarios(personas);
    // console.log(personas);
});

// Mensajes privados
socket.on('mensajePrivado', function(mensaje) {

    console.log('Mensaje Privado:', mensaje);
});