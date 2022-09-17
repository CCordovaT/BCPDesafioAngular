(function () {

    "use strict";

    angular.module("app").factory("dataService", dataService);

    dataService.$inject = ["$http"];

    function dataService($http) {

        const servicio = {};

        servicio.getData = getData;
        servicio.postData = postData;
        servicio.putData = putData;
        servicio.deleteData = deleteData;

        return servicio;

        function getData(url, hashAutorizacion = '') {

            let config = {};

            if (hashAutorizacion !== '') config = obtenerHeaderRequestParaHashSistema(hashAutorizacion);

            return $http.get(url, config);

        }

        function postData(url, body, hashAutorizacion = '') {

            let config = {};

            if (hashAutorizacion !== '') config = obtenerHeaderRequestParaHashSistema(hashAutorizacion);

            return $http.post(url, body, config);

        }

        function putData(url, body) {

            return $http.put(url, body);

        }

        function deleteData(url) {

            return $http.delete(url);

        }

        function obtenerHeaderRequestParaHashSistema(hashAutorizacion) {

            return {
                headers: {
                    'hashSoftware': hashAutorizacion
                }
            };

        }

    }

})();