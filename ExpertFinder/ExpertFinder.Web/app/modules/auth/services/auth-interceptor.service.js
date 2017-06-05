(function () {
    "use strict";

    angular.module('expert.auth')
        .factory('AuthInterceptorService', AuthInterceptor);

    //AuthInterceptor.$inject = ['$http', '$state', 'localStorageService'];

    function AuthInterceptor($http, $state, localStorageService) {

        var authInterceptorServiceFactory = {};
        //authInterceptorServiceFactory.request = request;
        //authInterceptorServiceFactory.responseError = responseError;

        return authInterceptorServiceFactory;

        function request(config) {

            config.headers = config.headers || {};

            var authData = localStorageService.get('authorizationData');

            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.token;
            }

            return config;
        }

        function responseError(rejection) {
            if (rejection.status === 401) {
                var authData = localStorageService.get('authorizationData');

                if (authData != null) {
                    var authService = $injector.get('AuthService');
                    authService.logOut();
                }
                //$state.go('login');
            }
            return $q.reject(rejection);
        }
    }

})();