const EXTENSIONES_PERMITIDAS = ['pdf', 'docx'];

const CONFIG_FORMULARIO = {
    nombreMinLargo: 3,
    passMinLargo: 8,
    passMaxLargo: 12
};

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");
    const inputNombre = document.getElementById("input_nombre");
    const inputRut = document.getElementById("input_rut");
    const inputFecha = document.getElementById("input_fecha");
    const inputCv = document.getElementById("input_cv");
    const inputEmail = document.getElementById("input_email");
    const selectGenero = document.getElementById("select_genero");
    const inputContrasena = document.getElementById("input_contrasena");
    const inputConfirmContrasena = document.getElementById("input_confirm_contrasena");

    inputRut.addEventListener("input", (e) => {
        let cursorPosition = e.target.selectionStart;
        let originalLength = e.target.value.length;
        
        let rutFormateado = formatearRut(e.target.value);
        e.target.value = rutFormateado;
        
        let newLength = rutFormateado.length;
        let diff = newLength - originalLength;
        e.target.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
        
        validarIndividualRut();
    });

    inputNombre.addEventListener("blur", validarIndividualNombre);
    inputNombre.addEventListener("input", validarIndividualNombre);
    
    inputRut.addEventListener("blur", validarIndividualRut);
    
    inputFecha.addEventListener("blur", validarIndividualFecha);
    inputFecha.addEventListener("input", validarIndividualFecha);
    
    inputCv.addEventListener("change", validarIndividualCv);
    
    inputEmail.addEventListener("blur", validarIndividualEmail);
    inputEmail.addEventListener("input", validarIndividualEmail);
    
    inputContrasena.addEventListener("blur", validarIndividualContrasena);
    inputContrasena.addEventListener("input", validarIndividualContrasena);
    
    inputConfirmContrasena.addEventListener("blur", validarIndividualConfirm);
    inputConfirmContrasena.addEventListener("input", validarIndividualConfirm);

    function validarIndividualNombre() {
        const valor = inputNombre.value.trim();
        if (valor === "") {
            marcarError(inputNombre, "error_nombre", "El nombre completo es requerido.");
            return false;
        } else if (valor.length < CONFIG_FORMULARIO.nombreMinLargo) {
            marcarError(inputNombre, "error_nombre", `Debe tener al menos ${CONFIG_FORMULARIO.nombreMinLargo} caracteres.`);
            return false;
        }
        marcarValido(inputNombre, "error_nombre");
        return true;
    }

    function validarIndividualRut() {
        const valor = inputRut.value.trim();
        if (valor === "") {
            marcarError(inputRut, "error_rut", "El RUT es requerido.");
            return false;
        }
        if (!validarRutChile(valor)) {
            marcarError(inputRut, "error_rut", "El RUT ingresado no es válido (ej: 12.345.678-9).");
            return false;
        }
        marcarValido(inputRut, "error_rut");
        return true;
    }

    function validarIndividualFecha() {
        const valor = inputFecha.value.trim();
        if (valor === "") {
            limpiarEstadoCampo(inputFecha, "error_fecha");
            return true;
        }
        if (!validarFechaNacimiento(valor)) {
            marcarError(inputFecha, "error_fecha", "Formato dd/MM/yyyy incorrecto o fecha inválida.");
            return false;
        }
        marcarValido(inputFecha, "error_fecha");
        return true;
    }

    function validarIndividualCv() {
        if (!validarCVArchivo(inputCv)) {
            marcarError(inputCv, "error_cv", "Tipo de archivo no permitido. Solo se acepta .pdf o .docx.");
            return false;
        }
        if (inputCv.files && inputCv.files.length > 0) {
            marcarValido(inputCv, "error_cv");
        } else {
            limpiarEstadoCampo(inputCv, "error_cv");
        }
        return true;
    }

    function validarIndividualEmail() {
        const valor = inputEmail.value.trim();
        if (valor === "") {
            marcarError(inputEmail, "error_email", "El email es requerido.");
            return false;
        }
        if (!validarEmailRegex(valor)) {
            marcarError(inputEmail, "error_email", "Formato de email inválido (ej: usuario@servidor.com).");
            return false;
        }
        marcarValido(inputEmail, "error_email");
        return true;
    }

    function validarIndividualContrasena() {
        const valor = inputContrasena.value;
        const res = comprobarContrasenaCompleja(valor);
        if (!res.valido) {
            marcarError(inputContrasena, "error_contrasena", res.mensaje);
            if (inputConfirmContrasena.value !== "") {
                validarIndividualConfirm();
            }
            return false;
        }
        marcarValido(inputContrasena, "error_contrasena");
        if (inputConfirmContrasena.value !== "") {
            validarIndividualConfirm();
        }
        return true;
    }

    function validarIndividualConfirm() {
        const valorConfirm = inputConfirmContrasena.value;
        const valorPass = inputContrasena.value;
        if (valorConfirm === "") {
            marcarError(inputConfirmContrasena, "error_confirm_contrasena", "Debe repetir la contraseña.");
            return false;
        }
        if (valorConfirm !== valorPass) {
            marcarError(inputConfirmContrasena, "error_confirm_contrasena", "Las contraseñas no coinciden.");
            return false;
        }
        marcarValido(inputConfirmContrasena, "error_confirm_contrasena");
        return true;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const esNombreValido = validarIndividualNombre();
        const esRutValido = validarIndividualRut();
        const esFechaValida = validarIndividualFecha();
        const esCvValido = validarIndividualCv();
        const esEmailValido = validarIndividualEmail();
        const esPassValida = validarIndividualContrasena();
        const esConfirmValida = validarIndividualConfirm();

        const erroresFormulario = [];
        if (!esNombreValido) erroresFormulario.push({ campo: "Nombre", error: "Requerido/Corto" });
        if (!esRutValido) erroresFormulario.push({ campo: "Rut", error: "Requerido/Inválido" });
        if (!esFechaValida) erroresFormulario.push({ campo: "Fecha de Nacimiento", error: "Formato Incorrecto" });
        if (!esCvValido) erroresFormulario.push({ campo: "Curriculum Vitae", error: "Extensión Inválida" });
        if (!esEmailValido) erroresFormulario.push({ campo: "Email", error: "Requerido/Inválido" });
        if (!esPassValida) erroresFormulario.push({ campo: "Contraseña", error: "Reglas de Complejidad" });
        if (!esConfirmValida) erroresFormulario.push({ campo: "Repetir Contraseña", error: "No coincide" });

        if (erroresFormulario.length > 0) {
            console.warn("Validación fallida. Errores detectados:", erroresFormulario);
            return;
        }

        const datosUsuario = {
            nombre: inputNombre.value.trim(),
            rut: inputRut.value.trim(),
            fechaNacimiento: inputFecha.value.trim() || "No especificada",
            curriculumName: (inputCv.files && inputCv.files.length > 0) ? inputCv.files[0].name : "No adjuntado",
            email: inputEmail.value.trim(),
            genero: selectGenero.value || "No especificado"
        };

        const modalBody = document.getElementById("modal_summary_body");
        modalBody.innerHTML = "";

        const camposMostrar = [
            { etiqueta: "Nombre Completo", valor: datosUsuario.nombre },
            { etiqueta: "RUT", valor: datosUsuario.rut },
            { etiqueta: "Fecha de Nacimiento", valor: datosUsuario.fechaNacimiento },
            { etiqueta: "Archivo Curriculum", valor: datosUsuario.curriculumName },
            { etiqueta: "Email", valor: datosUsuario.email },
            { etiqueta: "Género", valor: datosUsuario.genero }
        ];

        camposMostrar.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="fw-bold text-secondary">${item.etiqueta}</td>
                <td>${item.valor}</td>
            `;
            modalBody.appendChild(tr);
        });

        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    });
});

function validarRutChile(rutCompleto) {
    let valor = rutCompleto.replace(/\./g, '').replace(/-/g, '').trim().toUpperCase();
    if (valor.length < 2) return false;

    let cuerpo = valor.slice(0, -1);
    let dvIngresado = valor.slice(-1);

    if (!/^\d+$/.test(cuerpo)) return false;

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i], 10) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    let residuo = suma % 11;
    let dvEsperado = 11 - residuo;

    if (dvEsperado === 11) {
        dvEsperado = '0';
    } else if (dvEsperado === 10) {
        dvEsperado = 'K';
    } else {
        dvEsperado = dvEsperado.toString();
    }

    return dvIngresado === dvEsperado;
}

function formatearRut(rut) {
    let valor = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    if (valor.length === 0) return '';
    if (valor.length === 1) return valor;

    let cuerpo = valor.slice(0, -1);
    let dv = valor.slice(-1);

    let cuerpoFormateado = '';
    let count = 0;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        cuerpoFormateado = cuerpo[i] + cuerpoFormateado;
        count++;
        if (count === 3 && i > 0) {
            cuerpoFormateado = '.' + cuerpoFormateado;
            count = 0;
        }
    }
    return cuerpoFormateado + '-' + dv;
}

function validarEmailRegex(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Validar Fecha de Nacimiento (dd/MM/yyyy)
function validarFechaNacimiento(fechaStr) {
    const reg = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = fechaStr.match(reg);
    if (!match) return false;

    const dia = parseInt(match[1], 10);
    const mes = parseInt(match[2], 10);
    const anio = parseInt(match[3], 10);

    if (mes < 1 || mes > 12) return false;
    if (anio < 1900 || anio > new Date().getFullYear()) return false;

    const esBisiesto = (anio % 4 === 0 && (anio % 100 !== 0 || anio % 400 === 0));
    const diasPorMes = [31, esBisiesto ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (dia < 1 || dia > diasPorMes[mes - 1]) return false;

    const fechaIngresada = new Date(anio, mes - 1, dia);
    const hoy = new Date();
    
    hoy.setHours(0, 0, 0, 0);
    return fechaIngresada <= hoy;
}

function validarCVArchivo(inputCv) {
    if (!inputCv.files || inputCv.files.length === 0) return true;
    const file = inputCv.files[0];
    const extension = file.name.split('.').pop().toLowerCase();
    
    return EXTENSIONES_PERMITIDAS.includes(extension);
}

function comprobarContrasenaCompleja(pass) {
    if (pass === "") {
        return { valido: false, mensaje: "La contraseña es requerida." };
    }
    if (pass.length < CONFIG_FORMULARIO.passMinLargo || pass.length > CONFIG_FORMULARIO.passMaxLargo) {
        return { valido: false, mensaje: `Debe tener entre ${CONFIG_FORMULARIO.passMinLargo} y ${CONFIG_FORMULARIO.passMaxLargo} caracteres.` };
    }
    if (!/[A-Z]/.test(pass)) {
        return { valido: false, mensaje: "Debe contener al menos una letra mayúscula." };
    }
    if (!/[a-z]/.test(pass)) {
        return { valido: false, mensaje: "Debe contener al menos una letra minúscula." };
    }
    if (!/[0-9]/.test(pass)) {
        return { valido: false, mensaje: "Debe contener al menos un número." };
    }
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\|;'\/]/.test(pass)) {
        return { valido: false, mensaje: "Debe contener al menos un carácter especial (ej: !@#$*)." };
    }
    return { valido: true };
}

function marcarError(inputElement, errorDivId, mensaje) {
    inputElement.classList.add("is-invalid");
    inputElement.classList.remove("is-valid");
    const errDiv = document.getElementById(errorDivId);
    if (errDiv) {
        errDiv.textContent = mensaje;
    }
}

function marcarValido(inputElement, errorDivId) {
    inputElement.classList.remove("is-invalid");
    inputElement.classList.add("is-valid");
    const errDiv = document.getElementById(errorDivId);
    if (errDiv) {
        errDiv.textContent = "";
    }
}

function limpiarEstadoCampo(inputElement, errorDivId) {
    inputElement.classList.remove("is-invalid");
    inputElement.classList.remove("is-valid");
    const errDiv = document.getElementById(errorDivId);
    if (errDiv) {
        errDiv.textContent = "";
    }
}

function cancelarFormulario() {
    const form = document.getElementById("registrationForm");
    if (form) {
        form.reset();
        
        const campos = form.querySelectorAll(".form-control, .form-select");
        campos.forEach(campo => {
            campo.classList.remove("is-invalid");
            campo.classList.remove("is-valid");
        });

        const divsError = form.querySelectorAll(".invalid-feedback");
        divsError.forEach(div => {
            div.textContent = "";
        });
    }
}
