var io = require('socket.io').listen(3000);
console.log("entro a server node");
clicks = 0;
$dataReport = {};
$numeros = 0;
usuarios_logeadosT = 0;
usuarios_logeadosF = 0;
//Datos 
var board, led_azul, led_verde, led_rojo, button;
var leds = [], ledPins = [2, 3, 4, 5, 6, 7, 8, 9];

var bander_prendido_azul = false;
var bander_prendido_rojo = false;
var bander_prendido_verde = false;
var pin_azul, pin_verde, pin_rojo;
pin_verde = 10;
pin_rojo = 11;
pin_azul = 12;
var pres = false;
var presiona_num = 0;
var contador = 0;

var usuarios = [], //Array con los nombres de usuarios.
        jugadores = [], //Array con los nombres de los jugadores
        tablero = ['', '', '', '', '', '', '', '', ''], //Estado del tablero
        turno = false, //Indica el jugador al que le toca jugar
        jugadas = 0; //Contador de jugadas para saber cuando declarar empate.

//Devuelve la figura del jugador.
var figura = function(jugador) {
    var figuras = ['X', 'O'];
    return figuras[jugador - 1];
};

//Se comprueban todas las jugadas posibles
var comprobarTablero = function(tablero) {

    var r = false, t = tablero;

    if ((t[0] == t[1]) && (t[0] == t[2]) && (t[0] !== '')) { //Primera fila
        r = true;
    } else if ((t[3] == t[4]) && (t[3] == t[5]) && (t[3] !== '')) { //Segunda fila
        r = true;
    } else if ((t[6] == t[7]) && (t[6] == t[8]) && (t[6] !== '')) { //Tercera fila
        r = true;
    } else if ((t[0] == t[3]) && (t[0] == t[6]) && (t[0] !== '')) { //Primera columna
        r = true;
    } else if ((t[1] == t[4]) && (t[1] == t[7]) && (t[1] !== '')) { //Segunda columna
        r = true;
    } else if ((t[2] == t[5]) && (t[2] == t[8]) && (t[2] !== '')) { //tercera columna
        r = true;
    } else if ((t[0] == t[4]) && (t[0] == t[8]) && (t[0] !== '')) { //Primera diagonal
        r = true;
    } else if ((t[6] == t[4]) && (t[6] == t[2]) && (t[6] !== '')) { //Segunda diagonal
        r = true;
    }

    return r;

};

function cambiarDatos($cambio, $conectados, $mostrar) {
    if ($cambio) {
        $numeros = $conectados;
        $cambiar = $mostrar;
    }
    $columns = {
        title: {text: ""},
        credits: {
            enabled: false
        },
        chart: {
            marginTop: "35",
            height: "320",
            type: "column"
        },
        plotOptions: {
            column: {
                depth: 70
            }},
        tooltip: {
            pointFormat: "{series.name}: <b>{point.y:.2f}<\/b>"
        },
        xAxis: {
            categories: ["Conectados"]
        },
        yAxis: {
            title: {
                text: "Conectados"},
            allowDecimals: true
        },
        series:
                [
                    {
                        name: "Conectados",
                        data: [$numeros]
                    }
                ],
        cambiar: {
            mostrar: $cambiar
        }

    };
    return $columns;
}
function cambiarDatos2($cambio, $conectados, $mostrar) {
    if ($cambio) {
        $numeros = $conectados;
        $cambiar = $mostrar;
    }
    $columns = {
        title: {text: ""},
        credits: {
            enabled: false
        },
        chart: {
            marginTop: "35",
            height: "320",
            type: "column"
        },
        plotOptions: {
            column: {
                depth: 70
            }},
        tooltip: {
            pointFormat: "{series.name}: <b>{point.y:.2f}<\/b>"
        },
        xAxis: {
            categories: ["Datos Mal Ingresados"]
        },
        yAxis: {
            title: {
                text: "Datos Mal Ingresados Usuarios"},
            allowDecimals: true
        },
        series:
                [
                    {
                        name: "Datos Mal Ingresados",
                        data: [$numeros]
                    }
                ],
        cambiar: {
            mostrar: $cambiar
        }

    };
    return $columns;
}

////Placa Board Arduino
//board.on("ready", function() {
//    led_verde = new five.Led(pin_verde);
//    led_azul = new five.Led(pin_azul);
//    led_rojo = new five.Led(pin_rojo);
//    leds.push(led_verde);
//    leds.push(led_azul);
//    leds.push(led_rojo);
//    function allOn() {
//        for (var i = 0; i < leds.length; i++) {
//            console.log(leds[i]);
//            leds[i].on();
//        }
//    }
//
//    button = new five.Button({
//        board: board,
//        pin: 13,
//        holdtime: 1000,
//        isPullup: true,
//        invert: false // Default: "false".  Set to "true" if button is Active-Low
//    });
//    board.repl.inject({
//        button: button
//    });
//
//    button.on("press", function() {
//        pres = true;
//        if (!bander_prendido_azul) {
//            led_azul.on();
//            bander_prendido_azul = true;
//            console.log("Prender");
//        }
//        else {
//            led_azul.off();
//            console.log("Apagar");
//            bander_prendido_azul = false;
//        }
//        presiona_num++;
//        data = {cont_presiono: presiona_num, estado: bander_prendido_azul
//        };
////        board.emit('presiono', data);
//        io.sockets.emit('estado_boton', data);
////        io.sockets.emit("msg", "cleanData");
//    });
//    function allOff() {
//        for (var i = 0; i < leds.length; i++) {
//            leds[i].off();
//        }
//    }
//    function oneAfterAnother() {
//        var delay = 1;
//        board.counter = 0;
//        for (var i = 0; i < leds.length; i++) {
//            var led = leds[i];
//            board.wait(delay, function() {
//                console.log(this.counter + " on");
//                leds[this.counter].on();
//            });
//            board.wait(delay + 200, function() {
//                console.log(this.counter + " off");
//                leds[this.counter].off();
//                this.counter = (this.counter + 1) % leds.length;
//            });
//            delay += 500;
//        }
//    }
//    allOn();
//    // board.wait(1000,allOff);
////    oneAfterAnother();
////    board.loop(4500, oneAfterAnother);
//
//    //Instancias para poder realizar x por consola del servidor de REPL
//    this.repl.inject({
//        led_azul: led_azul,
//        led_verde: led_verde,
//        led_rojo: led_rojo,
//        button: button,
//        board: board
//    });
//
//});


//Al conectarse un usuario
io.sockets.on('connection', function(socket) {

    board.on("ready", function() {
        board.on('presiono', function(data) {
            console.log("presiono", data);
            io.sockets.emit('estado_boton', data);

        });
    });
    console.log("conectado");
    socket.emit("info", {msg: "El mundo es lo mejor"});
    var desconectarAmbosJugadores = function() {
        jugadores = [];
        tablero = ['', '', '', '', '', '', '', '', ''];
        turno = false;
        jugadas = 0;
        io.sockets.emit('desconectarAmbosJugadores', true);

        //Recorremos todos los sockets abiertos y eliminamos el tag de jugador
        for (var i in io.sockets.sockets) {

            if (io.sockets.sockets[i].jugador) {
                delete io.sockets.sockets[i].jugador;
            }
        }
    };

    //Enviamos al usuarios los datos que debe ver en pantalla al entrar, como estado del tablero y jugadores
    socket.emit('conexion', {'jugadores': jugadores, 'tablero': tablero});

    //Devolvemos el ping con los milisegundos al cliente para que pueda calcular la latencia.
    socket.on('ping', function(data, callback) {
        if (callback && typeof callback == 'function') {
            callback(data);
        }
    });

    //Al enviar el nombre de un nuevo usuario lo comprobamos.
    socket.on('comprobarUsuario', function(data, callback) {

//        data = sanitizer.escape(data);
        console.log(data);
        //Comprobamos que el nombre no esta en uso, o contiene caracteres raros.
        if (usuarios.indexOf(data) >= 0) {
            callback({ok: false, msg: 'Este nombre esta ocupado'});
        } else {

            //Enviamos su nick comprobado al usuario.
            callback({ok: true, nick: data});
            socket.nick = data;
            usuarios.push(data);
            console.log('Usuario conectado: ' + socket.nick);

            //Enviamos a todos los usuarios que se ha unido uno nuevo.
            io.sockets.emit('nuevoUsuario', {nick: data, listaUsuarios: usuarios});
        }

    });

    //Recibimos la petición de nuevo jugador y enviamos respuesta
    socket.on('nuevoJugador', function(data, callback) {

        if (jugadores.length < 2 && !socket.jugador) {
            jugadores.push(socket.nick);
            callback({ok: true, 'jugador': jugadores.length});
            socket.jugador = jugadores.length;
            io.sockets.emit('nuevoJugador', {nick: socket.nick, 'jugador': jugadores.length});

            //Si estan los dos jugadores empezamos la partida dandole el turno al primero.
            if (jugadores.length == 2) {
                turno = 1;
                io.sockets.emit('turno', {'turno': 1, 'tablero': tablero});
            }
        }

    });

    //Al recibir una jugada se comprueba que esa casilla del tablero está vacia y si se ha ganado o no.
    socket.on('marcarCelda', function(data) {
        if (socket.jugador == turno && tablero[data] === '') {
            tablero[data] = figura(turno);
            jugadas++;

            //Comprobamos si ha ganado con esta jugada
            if (comprobarTablero(tablero)) {
                io.sockets.emit('turno', {'turno': turno, 'tablero': tablero, 'ganador': jugadores[turno - 1]});
                desconectarAmbosJugadores();

            } else if (jugadas == 9) { //Empate
                io.sockets.emit('turno', {'turno': turno, 'tablero': tablero, 'empate': true, 'jugadores': jugadores});
                desconectarAmbosJugadores();

            } else { //Una jugada normal
                turno = (turno == 1) ? 2 : 1;
                io.sockets.emit('turno', {'turno': turno, 'tablero': tablero});
            }

        }
    });

    //Si llega un mensaje del chat de un usuario lo limpiamos y reenviamos a todos los demás.
    socket.on('msg', function(data) {
        console.log("msj", data);
//        data.msg = sanitizer.escape(data.msg);
        io.sockets.emit('msg', data);
    });


    //Cuando un usuario se desconecta se comprueba que estaba en el chat, y se informa y actualiza la lista del resto de usuarios.
    socket.on('disconnect', function() {

        if (socket.nick) {
            usuarios.splice(usuarios.indexOf(socket.nick), 1);
            io.sockets.emit('desconectarUsuario', {nick: socket.nick, listaUsuarios: usuarios});
            console.log('usuario desconectado: ' + socket.nick);

            //Si era un jugador en activo sacan ambos de la partida
            if (socket.jugador) {
                if (jugadores.length == 2) {

                    desconectarAmbosJugadores();

                } else { //Si estaba solo en la partida eliminamos su nombre de la partida

                    jugadores.splice(jugadores.indexOf(socket.nick), 1);
                    io.sockets.emit('desconectarJugador', {nick: socket.nick, jugador: socket.jugador});
                }
            }

        }

    });

});