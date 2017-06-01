(function () {
    'use strict';

    angular.module("expert")
        .config(config);

    config.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider'];

    function config($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) {

        $stateProvider
            .state('root', {
                url: '/',
                redirectTo: 'news'
            });
        
        $urlRouterProvider.otherwise("/news");

        //$urlRouterProvider.rule(function ($injector, $location) {
        //    var path = $location.path(),
        //        normalized = path.toLowerCase();
        //    if (path != normalized) {
        //        $location.replace().path(normalized);
        //    }
        //});

        //$httpProvider.interceptors.push('AuthInterceptorService');
        //$locationProvider.html5Mode(true);
    }

})();