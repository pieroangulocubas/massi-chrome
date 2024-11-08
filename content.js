chrome.storage.sync.get('enabled', ({ enabled }) => {
    if (enabled) {
      chrome.storage.sync.get([
        'OPTION', 'DATE', 'TIME', 'SELECT_DEFAULT_TIME',
        'FirstName', 'LastName', 'CustRef', 'Email', 'Phone'
      ], (items) => {

        const OPTION = items.OPTION || 1;
        const DATE = items.DATE || '2024-06-18';
        const TIME = items.TIME || '09:54';
        //const SELECT_DEFAULT_TIME = items.SELECT_DEFAULT_TIME !== undefined ? items.SELECT_DEFAULT_TIME : true;
        const PERSON = {
          FirstName: items.FirstName || '',
          LastName: items.LastName || '',
          CustRef: items.CustRef || '',
          Email: items.Email || '',
          ConfirmEmail: '',
          Phone: items.Phone,
          Notes: 'Madrid'
        };
  
        // Aquí insertas el código proporcionado, asegurándote de usar las variables `OPTION`, `DATE`, `TIME`, `SELECT_DEFAULT_TIME`, y `PERSON`.
        function selectCategoryByOption(option){
          const CATEGORIES={
          'Dnis, autorizaciones de viaje, certificados presenciales, poderes y otros.':[2,3,4,5,7,8,9,11],
          'Pasaportes y Salvoconductos':[1,6],
          'Registro civil: Inscripción de nacimientos, matrimonios, defunciones':[10,12]
          }
          for (const [category, options] of Object.entries(CATEGORIES)) {
             if(options.includes(option)) return category
          }
        }
        
        
        const MENU={
          1:"Pasaportes",
          2:"Emisión, Rectificación, Renovación o Duplicado de DNI",
          3:"Autorización de viaje de menor",
          4:"Certificado de no inscripción de menor",
          5:"Cartas poder - Poder fuera de registro (NO Sirve para venta de automóviles o bienes, representación en juicios) ",
          6:"Salvoconductos (Puede tramitarlo sin cita si acude al consulado tres días (hábiles) antes de la fecha del vuelo.)",
          7:"Declaración Jurada",
          8:"Legalización de firma",
          9:"Legalización (compulsa) de copias",
          10:"Registro nacimiento",
          11:"Certificado de supervivencia",
          12:"Registro de matrimonio"
        }
        

                
        const SERVICE=MENU[OPTION]
        const CATEGORY=selectCategoryByOption(OPTION)
        
        // **************************************
        // ******* ANTES DEL FORMULARIO *********
        // **************************************
        
        function limpiarReserva(){
         const btnReserva= document.querySelector("button[aria-label='Limpiar reserva']")
         setTimeout(()=>{
           btnReserva.click()
           setTimeout(()=>{
           document.querySelector('.modal-confirm-button').click()
           location.reload()
           },200)
         },60*1000*4.5)
        }
        
        function verificarRenderizadoDelFormulario() {
          return new Promise((resolve, reject) => {
            let button = document.querySelector("#main-container > div > div > button");
            let wrapper = document.querySelector('.booking-container');
        
            if (!button && wrapper) {
              resolve();
            } else if (button) {
              button.click();
              setTimeout(() => {
                wrapper = document.querySelector('.booking-container');
                if (wrapper && wrapper.children.length > 0) {
                  resolve();
                } else {
                  location.reload();
                }
              }, 450);
            } else {
              location.reload();
            }
          });
        }
        
        function mostrarTramitePorCategoria() {
          const button = Array.from(document.querySelectorAll('button')).find(boton => boton.textContent === CATEGORY);
          if(button) {
            button.click();
            return Promise.resolve();
          }
          return Promise.reject();
        }
        
        
        function seleccionarTramite() {
          const input = document.querySelector(`input[aria-label="${SERVICE}"]`);
          if (input) {
            input.click();
            return Promise.resolve();
          }
          return Promise.reject();
        }
        
        
        function seleccionarFecha() {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              const dateAvailables=document.querySelectorAll("button[name*='2024']:not([aria-label*='Unavailable'])")
              const dateTarget = document.getElementById(DATE);
              if(dateAvailables.length===1) resolve()
              else if(dateAvailables.length>1 && Array.from(dateAvailables).includes(dateTarget)){
                dateTarget.click();
                resolve();
              }
              else reject("No Hay Fechas Habilitadas");  
            }, 400);
          });
        }
        
        
        function seleccionarHora() {
          const clickToButton = (button, resolve, observer) => {
            button.click();
            if (observer) observer.disconnect();
            resolve();
          };
        
          const targetNode = document.querySelector('.timeslot-container');

          const targetTime = document.querySelector(`button[value="${TIME}"]`);
          const defaultTime = document.querySelector('#timeButton1');
          const timeSelected = targetTime || defaultTime;

          return new Promise((resolve, reject) => {
            if (timeSelected) clickToButton(timeSelected, resolve);
            else {
              const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                  if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    const updatedTimeSelected = document.querySelector(`button[value="${TIME}"]`) || document.querySelector('#timeButton1');
                    if (updatedTimeSelected) {
                      clickToButton(updatedTimeSelected, resolve, observer);
                      return;
                    }
                  }
                }
              });
        
              observer.observe(targetNode, { childList: true, subtree: true });
              setTimeout(() => {
                observer.disconnect();
                reject("No se pudo seleccionar ninguna hora.");
              }, 2000);
            }
          });
        }
        
        
        function presionarSi() {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              const button = document.querySelector(".v-card__actions button[aria-label='El tiempo de reserva está a punto de caducar, desea restablecerlo? Sí']");
              if (button) {
                button.click();
                resolve();
              } else {
                reject("El botón 'Sí' no se encontró o no está disponible.");
              }
            }, 600);
          });
        }
        
        
        // ****************************
        // ******* FORMULARIO *********
        // ****************************
        
        function llenarCampo(selector,payload){
          const inputElement = document.getElementById(selector)
          inputElement.value=payload
          const inputEvent = new Event('input', { bubbles: true });
          inputElement.dispatchEvent(inputEvent);
          return Promise.resolve()
        }
        
        function seleccionarInscripcion(){
          document.getElementById("customFields1").click()
          setTimeout(()=>{
            const noInscritoOption = document.querySelectorAll("div[role='option']")[1]
            noInscritoOption.click()
            return Promise.resolve('Se marcó que NO ESTA INSCRITO')
          },150)
        }
        
        function aceptarLosTerminos(){
          document.querySelector("input[role='checkbox']").click()
          return Promise.resolve('Se aceptaron los terminos')
        }
        
        function enviarFormulario(){
          setTimeout(()=>{
            const promises = Object.entries(PERSON).map(([id,value])=>llenarCampo(id,value))
            promises.push(seleccionarInscripcion(),aceptarLosTerminos())
            Promise.allSettled(promises).then( _ => {
              setTimeout(()=>document.getElementById("contactStepCreateAppointmentButton").click(),300)
              limpiarReserva()
            })
          },300)
        }
        
        document.body.addEventListener('submit',()=>{
          console.log("submit")
        })
        
        setTimeout(() => {
          verificarRenderizadoDelFormulario()
            .then(mostrarTramitePorCategoria)
            .then(seleccionarTramite)
            .then(seleccionarFecha)
            .then(seleccionarHora)
            .then(presionarSi)
            .then(enviarFormulario)
            .catch(e =>{
              console.log(e)
              setTimeout(()=>location.reload(),190)
            });
        }, 900);
        
    });
    }
  });