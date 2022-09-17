(function () {

    'use strict';

    angular.module('app').factory('globalService', globalService);

    function globalService() {

        const ID_MENU_PRINCIPAL = 'mnuPrincipal';
        const NOMBRE_CLASE_CAPA_OSCURA = 'overlay';

        const servicio = {};

        servicio.usuarioLogueado = {};
        servicio.variablesSesion = {};
        servicio.codUsuario = '';
        servicio.rutaRaizApi = '';
        servicio.direccionIP = '';
        servicio.hashSistema = '';
        servicio.codSistema = 9;

        servicio.mostrarMenu = mostrarMenu;
        servicio.ocultarMenu = ocultarMenu;

        return servicio;

        function ocultarMenu() {

            angular.element(`#${ID_MENU_PRINCIPAL}`).removeClass('show');
            angular.element(`.${NOMBRE_CLASE_CAPA_OSCURA}`).removeClass('active');

        }

        function mostrarMenu() {

            angular.element(`#${ID_MENU_PRINCIPAL}`).addClass('show');
            angular.element(`.${NOMBRE_CLASE_CAPA_OSCURA}`).addClass('active');

        }
    }

})();