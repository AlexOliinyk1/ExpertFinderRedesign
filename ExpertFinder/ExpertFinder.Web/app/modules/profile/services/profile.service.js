(function () {
    "use strict";

    function ProfileService($http) {
        var service = {};
        service.getProfile = getProfile;
        service.getSimilarProfiles = getSimilarProfiles;

        return service;

        function getProfile(id) {
            return $http.get(global.url.getProfile + id)
                .then(function (result) {
                    return result.data;
                })
                .catch(function (exc) {
                    console.log(exc);
                    return {};
                });
        }

        function getSimilarProfiles(id) {
            var url = global.url.getSimilarProfiles.replace(global.consts.userIdReplace, id);

            return $http.get(url)
                .then(function (result) {
                    return result.data.data;
                })
                .catch(function (exc) {
                    console.log(exc);
                    return {};
                });
        }
    }

    ProfileService.$inject = ['$http'];

    angular.module('expert.core')
        .factory('ProfileService', ProfileService);
})();