(function () {
    'use strict';

    angular.module('app').factory('utilService', utilService);

    utilService.$inject = ['globalService']

    function utilService(globalService) {

        const servicio = {};

        servicio.convertirMinutosAHoras = convertirMinutosAHoras;
        servicio.convertirHoraAFecha = convertirHoraAFecha;
        servicio.obtenerTotalMinutosEntreFechas = obtenerTotalMinutosEntreFechas;
        servicio.cerrarModal = cerrarModal;
        servicio.abrirModal = abrirModal;
        servicio.convertirFechaAHora = convertirFechaAHora;
        servicio.convertirFechaAFormatoISO = convertirFechaAFormatoISO;
        servicio.obtenerInicioDeMes = obtenerInicioDeMes;
        servicio.obtenerFinDeMes = obtenerFinDeMes;
        servicio.mostrarMensajeError = mostrarMensajeError;
        servicio.mostrarMensajeOk = mostrarMensajeOk;
        servicio.obtenerMensajeError = obtenerMensajeError;
        servicio.mostrarAlertaTemporal = mostrarAlertaTemporal;
        servicio.mostrarMensajeInfo = mostrarMensajeInfo;
        servicio.estaOculto = estaOculto;
        servicio.mostrarMensajeDeCarga = mostrarMensajeDeCarga;
        servicio.convertirTextoAFecha = convertirTextoAFecha;
        servicio.obtenerNombreMes = obtenerNombreMes;

        return servicio;

        function convertirMinutosAHoras(minutos) {

            if (minutos < 0) return '00:00';

            const _nHoras = Math.floor(minutos / 60);
            const _nMinutos = minutos - (60 * _nHoras);

            return `${_nHoras.toString().padStart(2, '0')}:${_nMinutos.toString().padStart(2, '0')}`;

        }

        function convertirHoraAFecha(hora) {

            const fechaActual = new Date();

            return new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate(), hora.substr(0, 2), hora.substr(3, 2), hora.substr(6, 2));

        }

        function obtenerTotalMinutosEntreFechas(fechaInicio, fechaFinal) {

            return Math.ceil((fechaFinal - fechaInicio) / 1000 / 60);

        }

        function cerrarModal(idModal) {

            return angular.element(`#${idModal}`).modal('hide');

        }

        function abrirModal(idModal) {

            return angular.element(`#${idModal}`).modal('show');

        }

        function convertirFechaAHora(fecha) {

            return `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}:00`;

        }

        function convertirFechaAFormatoISO(fecha) {

            return `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;

        }

        function obtenerInicioDeMes(fecha) {

            return new Date(fecha.getFullYear(), fecha.getMonth(), 1);

        }

        function obtenerFinDeMes(fecha) {

            return new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

        }

        function mostrarMensajeError(error) {

            const respuesta = error.data;
            const mensajeError = obtenerMensajeError(error);

            if (error.status >= 400 && error.status <= 499) {

                return Swal.fire({
                    icon: 'warning',
                    title: `Información no válida - ${respuesta.nCodigoStatus}`,
                    text: mensajeError
                });

            } else if (error.status >= 500 && error.status <= 599) {

                return Swal.fire({
                    icon: 'error',
                    title: `Un error a ocurrido - ${respuesta.nCodigoStatus}`,
                    text: mensajeError
                });

            } else if (error.status == -1) {

                return Swal.fire({
                    icon: 'error',
                    title: `-1 : Un error a ocurrido`,
                    text: 'El servicio no se encuentra disponible'
                });

            } else {

                return Swal.fire({
                    icon: 'error',
                    title: 'Un error a ocurrido',
                    text: mensajeError
                });

            }

        }

        function obtenerMensajeError(error) {

            try {

                const respuesta = error.data;

                if (error.status >= 400 && error.status <= 499) {

                    return respuesta.cMensajeError;

                } else if (error.status >= 500 && error.status <= 599) {

                    if (respuesta.cMensajeError) {

                        return respuesta.cMensajeError.includes('SQL') ? 'No se pudo acceder a la base de datos' : respuesta.cMensajeError;

                    } else {

                        return 'El servicio a devuelto un error con estado ' + error.status.toString();

                    }

                } else if (error.status == -1) {

                    return 'El servicio no se encuentra disponible';

                } else {

                    return 'Un error a ocurrido';

                }

            } catch (error) {

                return "Ha ocurrido un error no controlado";

            }

        }

        function mostrarMensajeInfo(mensaje) {

            return Swal.fire({
                icon: 'info',
                text: mensaje
            });

        }

        function mostrarMensajeOk(mensaje) {

            return Swal.fire({
                icon: 'success',
                text: mensaje
            });

        }

        function mostrarMensajeDeCarga(mensaje) {

            Swal.fire({
                title: mensaje,
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                },
            });

        }

        function mostrarAlertaTemporal(idPanelAlerta) {

            angular.element(`#${idPanelAlerta}`).show();

            setTimeout(function () {

                angular.element(`#${idPanelAlerta}`).fadeOut(1000);

            }, 3000);

        }

        function convertirTextoAFecha(fechaEnTexto) {

            const fechaFormateada = fechaEnTexto.replaceAll('/', '');

            return new Date(fechaFormateada.substring(4), fechaFormateada.substring(2, 4) - 1, fechaFormateada.substring(0, 2));

        }

        function estaOculto(elemento) {

            return window.getComputedStyle(elemento).display === 'none' || window.getComputedStyle(elemento).visibility === "hidden";

        }

        function obtenerNombreMes(nroMes) {

            const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];

            return meses[nroMes];

        }

    };

})();