let preguntas = [];
let preguntasRandom = [];
let contadorPreguntas = -1;
const parteHtmlOpcion = '<div class="flex items-center justify-left p-4 pl-1 w-full" id="contenedorOpcionVALOR$INPUT"><input id="radio$ID$INPUT" type="radio" value="VALOR$INPUT" name="opciones" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"><label for="radio$ID$INPUT" class="ml-2 text-sm font-medium text-gray-900">OPCION</label></div>';
let cronometro;
let cronometroActivo = false;
let minutos = 0;
let segundos = 0;

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(files[0]);
}

var ExcelToJSON = function () {
    this.parseExcel = function (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            workbook.SheetNames.forEach(function (sheetName) {
                // Here is your object
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                preguntas = XL_row_object.map((element, index) => ({
                    id: index,
                    pregunta: element['Question'],
                    respuesta: element['Answer'],
                    respuestaId: element['Answer key'],
                    opciones: [
                        { id: 'A', opcion: element['Option A'] },
                        { id: 'B', opcion: element['Option B'] },
                        { id: 'C', opcion: element['Option C'] },
                        { id: 'D', opcion: element['Option D'] },
                        { id: 'E', opcion: element['Option E'] }
                    ],
                    correcto: null
                }));
                console.log(preguntas);
                if (preguntas.length > 0) {
                    document.getElementById('seccionArchivo').classList.add('hidden');
                    document.getElementById('seccionObtenerPreguntas').classList.remove('hidden');
                    document.getElementById('seccionObtenerPreguntas').classList.add('flex');
                }

            })
        };
        reader.onerror = function (ex) {
            console.log(ex);
        };
        reader.readAsBinaryString(file);
    };
};

function obtenerPreguntas() {
    preguntasRandom = [];
    const cantidadPreguntas = +document.getElementById('cantidadPreguntas').value;
    for (let i = 0; i < cantidadPreguntas; i++) {
        do {
            let valido = true;
            const idRandom = Math.floor(Math.random() * ((preguntas.length - 1) + 1));
            const itemElegido = preguntas.find((_, index) => index === idRandom);
            if (preguntasRandom.includes(element => element.id === itemElegido.id)) {
                valido = false;
            } else {
                preguntasRandom.push(itemElegido);
            }
        } while (valido = false);
    }
    avanzarPregunta();
    document.getElementById('validar').classList.remove('hidden');
    document.getElementById('seccionObtenerPreguntas').classList.remove('flex');
    document.getElementById('seccionObtenerPreguntas').classList.add('hidden');
    document.getElementById('seccionPreguntas').classList.remove('hidden');
    document.getElementById('seccionPreguntas').classList.add('flex');

}
function avanzarPregunta() {
    contadorPreguntas++;
    if (+document.getElementById('cantidadPreguntas').value === contadorPreguntas) {
        clearInterval(cronometro);
        segundos = 0;
        minutos = 0;
        document.getElementById('opciones').innerHTML = `
        Cantidad de preguntas correctas: ${preguntasRandom.filter(item => item.correcto === true).length} <br> 
        Cantidad de preugntas erroneas: ${preguntasRandom.filter(item => item.correcto === false).length}
        `;
        cronometroActivo = false;
        document.getElementById('pregunta').innerHTML = '';
        document.getElementById('validar').classList.add('hidden');
        document.getElementById('seccionObtenerPreguntas').classList.remove('hidden');
        document.getElementById('seccionObtenerPreguntas').classList.add('flex');
        contadorPreguntas = -1;
        return;
    }
    document.getElementById('validar').classList.add('block');
    document.getElementById('pregunta').innerHTML = preguntasRandom[contadorPreguntas].pregunta;
    document.getElementById('opciones').innerHTML = preguntasRandom[contadorPreguntas].opciones.map((item) => {
        let texto = parteHtmlOpcion;
        texto = texto.replaceAll('$ID$INPUT', item.id);
        texto = texto.replaceAll('VALOR$INPUT', item.id);
        texto = texto.replaceAll('OPCION', item.opcion);
        return texto;
    }).join('');
    let radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => radio.checked = false);
    document.getElementById('totalPreguntas').innerHTML = contadorPreguntas + 1;
    if (!cronometroActivo) {
        cronometro = setInterval(contarTiempo, 1000);
        cronometroActivo = true;
    }
}

{/* <div class="flex items-center mb-4">
        <input id="radio-${item.id}" type="radio" value="${item.id}" name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500">
        <label for="radio-${item.id}" class="ml-2 text-sm font-medium text-gray-900">${item.opcion}</label>
    </div> */}
function validarRespuesta() {
    const valorElegido = valorRadio();
    if (preguntasRandom[contadorPreguntas].correcto === false) {
        document.getElementById('contenedorOpcion' + valorElegido).classList.remove('bg-red-300');
        document.getElementById('contenedorOpcion' + preguntasRandom[contadorPreguntas].respuestaId).classList.remove('bg-green-300');
        avanzarPregunta();
        document.getElementById('validar').textContent = 'Validar';
        return;
    }
    if (valorElegido === '') {
        document.getElementById('mensajeError').classList.remove('hidden');
        document.getElementById('mensajeError').classList.add('block');
        return;
    }
    document.getElementById('mensajeError').classList.add('hidden');
    if (valorElegido.includes(preguntasRandom[contadorPreguntas].respuestaId)) {
        document.getElementById('validar').classList.add('hidden');
        preguntasRandom[contadorPreguntas].correcto = true;
        document.getElementById('mensajeSatisfactorio').classList.remove('hidden');
        document.getElementById('mensajeSatisfactorio').classList.add('block');
        setTimeout(() => {
            document.getElementById('mensajeSatisfactorio').classList.add('hidden');
            document.getElementById('validar').classList.remove('hidden');
            avanzarPregunta();
        }, 3000);
    } else {
        document.getElementById('contenedorOpcion' + valorElegido).classList.add('bg-red-300');
        document.getElementById('contenedorOpcion' + preguntasRandom[contadorPreguntas].respuestaId).classList.add('bg-green-300');
        document.getElementById('validar').textContent = 'Avanzar';
        preguntasRandom[contadorPreguntas].correcto = false;
    }
}
function valorRadio() {
    let valorRadio = '';
    let radioButtons = document.querySelectorAll('input[name="opciones"]');
    for (let radio of radioButtons) {
        if (radio.checked) {
            valorRadio = radio.value;
            break;
        }
    }
    return valorRadio;
}


function contarTiempo() {
    segundos++;
    if (segundos === 60) {
        minutos++;
        segundos = 0;
    }
    const minutosTexto = minutos < 10 ? `0${minutos}` : minutos;
    const segundosTexto = segundos < 10 ? `0${segundos}` : segundos;
    document.getElementById('cronometro').innerHTML = minutosTexto + ' : ' + segundosTexto;
}

document.getElementById('archivo').addEventListener('change', handleFileSelect, false);
document.getElementById('obtenerPreguntas').addEventListener('click', obtenerPreguntas, false);
document.getElementById('validar').addEventListener('click', validarRespuesta, false);