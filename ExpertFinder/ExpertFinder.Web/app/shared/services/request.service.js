(function () {
    "use strict";

    angular.module('expert.core')
        .factory('RequestService', RequestService);
    
    RequestService.$inject = ['$http'];

    function RequestService($http) {
        var service = {};

        service.getRequests = getRequests;

        return service;

        function getRequests(userId) {
            var url = global.url.getRequests.replace('{user_id}', userId);

            return $http.get(url)
                .then(function (result) {
                    return result.data.data;
                })
                .catch(function (exc) {
                    console.log(exc);
                    return [];
                });
        }
    }

})();