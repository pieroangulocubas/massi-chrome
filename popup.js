/*function generarTelefonoAleatorio() {
  return '6' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
}
const phoneField=document.getElementById('phone')
phoneField.value=generarTelefonoAleatorio()
*/


function generarOpcionesDeHora() {
  const select = document.getElementById('time');
  let startTime = new Date();
  startTime.setHours(8, 30, 0, 0); // Establece la hora inicial a las 08:30
  const endTime = new Date();
  endTime.setHours(13, 30, 0, 0); // Establece la hora final a las 13:30
  const interval = 12 * 60 * 1000; // Intervalo de 12 minutos en milisegundos

  while (startTime <= endTime) {
      const timeString = startTime.toTimeString().substring(0, 5);
      const option = document.createElement('option');
      option.value = timeString;
      option.textContent = timeString;
      select.appendChild(option);
      startTime = new Date(startTime.getTime() + interval); // Incrementa el tiempo en 12 minutos
  }
}



function manejarGuardar(){
  document.getElementById('save').addEventListener('click', () => {
    const OPTION = parseInt(document.getElementById('option').value);
    const DATE = document.getElementById('date').value;
    const TIME = document.getElementById('time').value;
    const FirstName = document.getElementById('firstname').value;
    const LastName = document.getElementById('lastname').value;
    const CustRef = document.getElementById('custref').value;
    const Email = document.getElementById('email').value;
    const Phone = document.getElementById('phone').value ;
    
    chrome.storage.sync.set({
      OPTION, DATE, TIME, FirstName, LastName, CustRef, Email, Phone
    });
    window.close()
  });
  
}


function cargarDatos() {
  chrome.storage.sync.get([
    'OPTION', 'DATE', 'TIME',
    'FirstName', 'LastName', 'CustRef', 'Email', 'Phone'
  ], (items) => {
    option.value=items.OPTION
    time.value=items.TIME
    date.value=items.DATE
    firstname.value=items.FirstName
    lastname.value=items.LastName
    custref.value=items.CustRef
    email.value=items.Email || "mexiyovi1104@gmail.com"
    phone.value=items.Phone || "665852926"
  })
}

/*function obtenerFechaPorDefecto(){
    // Obtener la fecha actual
    const hoy = new Date();
    // Agregar 7 días a la fecha actual para obtener el mismo día de la próxima semana
    const proximaSemana = new Date(hoy);
    proximaSemana.setDate(hoy.getDate() + 7);
    // Formatear la fecha en formato ISO (YYYY-MM-DD) para el input date
    const año = proximaSemana.getFullYear();
    const mes = String(proximaSemana.getMonth() + 1).padStart(2, '0');
    const dia = String(proximaSemana.getDate()).padStart(2, '0');
    const fechaISO = `${año}-${mes}-${dia}`;
    // Asignar el valor calculado al input date
    document.getElementById("date").value = fechaISO;
}

function generarDatosPorDefecto(){
  obtenerFechaPorDefecto()
}*/

// Inicializa el popup
function inicializarPopup() {
  //generarDatosPorDefecto()
  generarOpcionesDeHora();
  manejarGuardar();
  cargarDatos(); // Carga los datos almacenados
}

window.onload = inicializarPopup;