# Evaluaciones - Unidad 2

Proyecto correspondiente a la Evaluacion de la Unidad 2 de la asignatura Front-End. Contiene una aplicacion cliente interactiva con validacion avanzada de formulario.

## Estructura del Proyecto

* backend/ - Servidor Express y conexion a MongoDB
* frontend/ - Interfaz de usuario y recursos publicos
  * curriculum_vitae.html - Curriculum Vitae de Rodrigo Peña S.
  * formulario.html - Formulario de registro con validaciones y tema oscuro
  * js/procesar_form.js - Logica de validacion en JavaScript sin comentarios
  * css/ - Hojas de estilo y temas de Bootstrap
  * assets/ - Iconos e imagenes locales

## Validaciones del Formulario

El archivo procesar_form.js implementa las siguientes validaciones en JavaScript:

* Nombre Completo: Requerido, largo minimo de 3 caracteres.
* RUT: Requerido, verificacion de digito verificador con algoritmo Modulo 11 y formateo automatico.
* Fecha de Nacimiento: Opcional, formato dd/MM/yyyy.
* Curriculum Vitae: Opcional, extensiones permitidas .pdf y .docx.
* Email: Requerido, validacion de formato.
* Contraseña: Requerida, longitud de 8 a 12 caracteres, al menos una mayuscula, una minuscula, un numero y un caracter especial. Debe coincidir con el campo de repeticion.

## Instalacion y Ejecucion

1. Iniciar MongoDB localmente en el puerto 27017.
2. Desde el directorio backend, instalar las dependencias:
   ```bash
   cd backend
   npm install
   ```
3. Iniciar el servidor:
   ```bash
   node servidor.js
   ```
4. Abrir el archivo frontend/formulario.html en el navegador.
