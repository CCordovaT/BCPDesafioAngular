(function () {

    'use strict';

    angular.module('app').factory('authenticacionService', authenticacionService);

    authenticacionService.$inject = ['$http', 'localStorageService', 'globalService', '$state', '$q', 'appConst'];

    function authenticacionService($http, localStorageService, globalService, $state, $q, appConst) {

        var servicio = {};

        servicio.loguearse = loguearse;
        servicio.cerrarSesion = cerrarSesion;

        return servicio;

        function loguearse(datosLogin) {

            const promesa = $q.defer();

            const urlToken = `${globalService.rutaRaizApi}/ILC/token`;

            const bodyRequest = `grant_type=password&username=${datosLogin.codUsuario}&password=${datosLogin.password}&hashSoftware=${globalService.hashSistema}&direccionIPCliente=${globalService.direccionIP}&imei=`;

            $http.post(urlToken, bodyRequest, { headers: { 'Content-type': 'application/x-www-form-urlencoded' } })
                .then(
                    function (respuesta) {

                        $http.defaults.headers.common.Authorization = 'Bearer ' + respuesta.data.access_token;
                        $http.defaults.headers.common.direccionIP = globalService.direccionIP;

                        localStorageService.set('userToken', {
                            token: respuesta.data.access_token,
                            codUsuario: datosLogin.codUsuario,
                            direccionIP: globalService.direccionIP
                        });

                        promesa.resolve({

                            esCorrecto: true,
                            mensajeRespuesta: ''

                        });

                    },
                    function (error) {

                        limpiarVariablesLogin();

                        promesa.reject({

                            esCorrecto: false,
                            mensajeRespuesta: error.data === null || error.status === appConst.statusResponse.SERVICE_NOT_AVAILABLE ? 'Servicio no encontrado' : error.data.error_description

                        });

                    }
                );

            return promesa.promise;
        }

        function cerrarSesion() {

            limpiarVariablesLogin();
            $state.go('login');

        }

        function limpiarVariablesLogin() {

            $http.defaults.headers.common.Authorization = '';
            $http.defaults.headers.common.direccionIP = '';

            localStorageService.remove('userToken');

            globalService.codUsuario = '';
            globalService.usuarioLogueado = {};
            globalService.variablesSesion = {};

        }

    }

})();