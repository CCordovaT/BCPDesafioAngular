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

            DNI: '1',
            CARNET_EXTRANJERIA: '3',
            PASAPORTE_TEMPORAL: '10',
            CEDULA_IDENTIDAD: '11',
            CARNET_REFUGIADO: '12'

        };

        servicio.producto = {

            JOYA_CLASICO: 1,
            VEHICULAR_CLASICO: 2,
            JOYA_CUOTA: 3,
            ELECTRODOMESTICO: 6,
            VEHICULAR_CUOTA: 4,
            CONSUMO_JOYA_CLASICO: 14,
            CONSUMO_ELECTRO_CLASICO: 16,
            CUSTODIA_JOYAS_CLASICO: 17,
            CUSTODIA_ELECTRO_CLASICO: 18

        }

        servicio.codCatalogo = {

            TIPO_DOCUMENTO: 1400,
            PROGRAMAS_CAMPANIA: 11040,
            CANALES_CAPTACION: 11029,
            PRODUCTOS_INTERES: 10008

        }

        servicio.estadoValidacionDocumento = {

            PENDIENTE: 1,
            RECHAZADO: 2,
            VALIDO: 3

        }

        servicio.tipoTelefono = {

            FIJO: 1,
            CELULAR: 2

        }

        servicio.programaMarketing = {

            PUERTA_A_PUERTA: '1',
            SOCIAL_SELLING: '2'

        }

        return servicio;

    }

})();