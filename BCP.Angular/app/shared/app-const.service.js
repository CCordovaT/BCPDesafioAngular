(function () {

    'use strict';

    angular.module('app').factory('appConst', constants);

    function constants() {

        const servicio = {};

        servicio.htmlLoading = '<span class="fa fa-spinner fa-spin fa-2x"></span>';

        servicio.statusResponse = {

            OK: 200,
            CREATED: 201,
            UNAUTHORIZED: 401,
            BAD_REQUEST: 400,
            NO_CONTENT: 204,
            INTERNAL_ERROR: 500,
            SERVICE_NOT_AVAILABLE: 503,
            NOT_FOUND: 404

        };

        servicio.key = {

            ESC: 27

        }

        servicio.tipoDocumento = {

            DNI: 1,
            CARNET_EXTRANJERIA: 2

        };

        servicio.cargo = {

            GERENTE_AGENCIA: 1,
            ASESOR_COMERCIAL: 2

        }

        return servicio;

    }

})();