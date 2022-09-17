(function () {

    'use strict';

    angular.module('app').factory('usuarioService', usuarioService);

    usuarioService.$inject = ['globalService', 'dataService', '$q', 'utilService'];

    function usuarioService(globalService, dataService, $q, utilService) {

        const servicio = {};
        const RUTA_RECURSO = 'api/usuarios';

        let usuario = {};

        servicio.obtenerDatosUsuario = obtenerDatosUsuario;
        servicio.existeSesionIniciada = existeSesionIniciada;

        return servicio;

        function obtenerDatosUsuario(codAccesoUsuario) {

            return dataService.getData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}?codAccesoUsuario=${codAccesoUsuario}`);

        }

        function existeSesionIniciada() {

            const promesa = $q.defer();

            if (globalService.codAccesoUsuario === '') {

                promesa.reject({

                    esCorrecto: false,
                    mensajeRespuesta: 'Se requiere iniciar sesión'

                });

            } else {

                obtenerDatosUsuario(globalService.codAccesoUsuario)
                    .then(function onSuccess(respuesta) {

                        usuario = respuesta.data.data;
                        globalService.usuarioLogueado = usuario;

                        promesa.resolve({

                            esCorrecto: true,
                            mensajeRespuesta: ''

                        });

                    }, function onError(error) {

                        let mensajeError = '';

                        switch (error.status) {

                            case 401:
                                mensajeError = 'Tiempo de sesión expirado, debe volver a loguearse';
                                break;

                            case 500:
                                mensajeError = error.data.oData ? `${error.data.nCodigoStatus} - ${error.data.oData}` : error.data.cMensajeError;
                                break;

                            case 404:
                                mensajeError = 'No se ha encontrado la ruta del servicio';
                                break;

                            default:
                                mensajeError = "Se ha producido un error";
                                break;
                        }

                        promesa.reject({

                            esCorrecto: false,
                            mensajeRespuesta: mensajeError

                        });
                    }
                    )
            }

            return promesa.promise;

        }

    };

})();