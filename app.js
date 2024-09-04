//------------------------------------------------------------------------------RELOJ-----------------------------------------------------------------

function actualizarReloj() {
    const ahora = new Date();
    let horas = ahora.getHours();
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');

    // Convertir el formato de 24 horas al de 12 horas
    horas = horas % 12;
    horas = horas ? horas : 12; // La hora "0" se convierte en "12"

    const horaActual = `${String(horas).padStart(2, '0')}:${minutos}:${segundos}`;
    document.getElementById('reloj').textContent = horaActual;
}

setInterval(actualizarReloj, 1000); // Actualiza cada segundo
actualizarReloj(); // Inicializa el reloj inmediatamente

//-------------------------------------------------------------------------CAMBIO DE DISPLAY---------------------------------------------------------------

function cambiarTexto() {
    const displayReloj = document.getElementById('reloj');
    const displayCrono = document.getElementById('cronometro');
    const elemento = document.getElementById('rotar');
   
    if (displayReloj.style.display === 'flex') {
        displayReloj.style.display = 'none';
        displayCrono.style.display = 'flex';
        elemento.style.transform = `rotate(${0}deg)`;
    } else {
        displayReloj.style.display = 'flex';
        displayCrono.style.display = 'none';
        elemento.style.transform = `rotate(${180}deg)`;
    }
}

//-----------------------------------------------------------------------ABRIR VENTANA EMERGENTE----------------------------------------------------------

function abrirVentanaEmergente() {

    const contenido = document.getElementById('display').innerHTML;
    const ventana = window.open('', 'popupWindow', 'width=600,height=400,left=100,top=100');

    ventana.document.write(`
        <html>
        <head>
            <title>CRÓNOMETRO+</title>
        </head>
        <body>
            ${contenido}
        </body>
        </html>
    `);
}

//------------------------------------------------------------------------LÓGICA DEL CRONÓMETRO-------------------------------------------------------------

let countdownScreen = document.getElementById('cronometro');
let countdown;
let remaining;
let initialTime;
let countingUp = 0;
let isPaused = false;
let isCountingUp = false;
let filaActiva = null;
let isRunning = false;
let filas = Array.from(document.getElementsByClassName('fila'));
let inputs = Array.from(document.getElementsByClassName('input'));
let valores = Array.from(document.getElementsByClassName('valor'));
let alerta = document.getElementById('alert');
let btnPlay = document.getElementById('btnPlay');
let btnPause = document.getElementById('btnPause');

function updateDisplay(minutes, seconds) {
    let dash = isCountingUp ? "-" : "";
    countdownScreen.textContent = `${dash}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function fijarTiempo(index) {
    if (isRunning) {
        mostrarAlerta("No puedes cambiar de fila cuando el tiempo está corriendo");
        return;
    }
    for (let i = 0; i < filas.length; i++) {
        filas[i].style.backgroundColor = "";
    }
    countdownScreen.style.color = "green";
    filas[index].style.backgroundColor = "rgb(15, 45, 70)";
    filaActiva = index;
    updateDisplay(inputs[index].value, 0);
}

function mostrarAlerta(mensaje) {
    const divAlert = document.getElementById("alert");
    divAlert.innerText = mensaje;
    divAlert.style.display = "flex";

    setTimeout(() => {
        divAlert.style.display = "none";
    }, 2500);
}

function iniciar() {
    if (filaActiva === null) return;

    btnPlay.style.display = "none";
    btnPause.style.display = "flex";
    isCountingUp = false;
    countingUp = 0;
    isRunning = true;
    
    if (isPaused) {
        isPaused = false;
        return;
    }

    clearInterval(countdown);

    let minutes = parseInt(inputs[filaActiva].value);
    let seconds = 0;

    if (minutes < 0) {
        alert("No es posible asignar tiempo negativo");
        return;
    }

    initialTime = minutes * 60;
    remaining = initialTime + seconds;

    countdown = setInterval(() => {
        if (!isPaused) {
            if (remaining > 0) {
                if (remaining <= 31) {
                    countdownScreen.style.color = "orange";
                }
                remaining--;
            } else {
                countdownScreen.style.color = "red";
                isCountingUp = true;
                countingUp++;
            }
            const minutes = Math.floor(Math.abs(remaining > 0 ? remaining : countingUp) / 60);
            const seconds = Math.abs(remaining > 0 ? remaining : countingUp) % 60;
            updateDisplay(minutes, seconds);
        }
    }, 1000);
}

function pausar() {
    isPaused = true;
    btnPlay.style.display = "flex";
    btnPause.style.display = "none";
}

function detener() {
    clearInterval(countdown);
    if (filaActiva === null) return;
    isRunning = false;

    isCountingUp = false;
    countingUp = 0;
    isPaused = false;
    updateDisplay(inputs[filaActiva].value, 0);
    btnPause.style.display = "none";
    btnPlay.style.display = "flex";
    countdownScreen.style.color = "green";

    let tiempoRealizado;

    if (remaining > 0) {
        tiempoRealizado = initialTime - remaining;
    } else {
        tiempoRealizado = initialTime + countingUp;
    }

    const minutes = Math.floor(tiempoRealizado / 60);
    const seconds = tiempoRealizado % 60;

    valores[filaActiva].value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    valores[filaActiva].disabled = false;

}