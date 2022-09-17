(function () {

    'use strict';

    angular.module('app').factory('usuarioService', usuarioService);

    usuarioService.$inject = ['globalService', 'dataService', 'variableNegocioService', '$q', 'utilService'];

    function usuarioService(globalService, dataService, variableNegocioService, $q, utilService) {

        const servicio = {};
        const RUTA_RECURSO = 'usuarios';

        let usuario = {};

        servicio.obtenerDatosUsuario = obtenerDatosUsuario;
        servicio.existeSesionIniciada = existeSesionIniciada;

        return servicio;

        function obtenerDatosUsuario(codUsuario) {

            return dataService.getData(`${globalService.rutaRaizApi}/${RUTA_RECURSO}/${codUsuario}`);

        }

        function existeSesionIniciada() {

            const promesa = $q.defer();

            if (globalService.codUsuario === '') {

                promesa.reject({

                    esCorrecto: false,
                    mensajeRespuesta: 'Se requiere iniciar sesión'

                });

            } else {

                obtenerDatosUsuario(globalService.codUsuario)
                    .then(function onSuccess(respuesta) {

                        usuario = respuesta.data.oData;

                        return variableNegocioService.obtenerListaVariablesNegocioParaMarketingDigital();

                    }).then(function onSuccess(respuesta) {

                        const listaVariablesSistema = respuesta.data.oData;

                        globalService.variablesSesion = {
                            fechaSistema: utilService.convertirTextoAFecha(listaVariablesSistema.find(v => v.nCodVar == 1).cValorVar)
                        };

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