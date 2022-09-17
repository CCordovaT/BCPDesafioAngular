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

        function getData(url) {

            return $http.get(url);

        }

        function postData(url, body) {

            return $http.post(url, body);

        }

        function putData(url, body) {

            return $http.put(url, body);

        }

        function deleteData(url) {

            return $http.delete(url);

        }

    }

})();