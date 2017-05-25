(function () {
    'use strict';

    angular.module("expert")
        .config(config);

    config.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider'];

    function config($stateProvider, $locationProvider, $urlRouterProvider) {

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

        //$locationProvider.html5Mode(true);
    }

    angular.module("expert")
        .run([
        '$rootScope',
        '$state',
        '$location',
        function ($rootScope, $state, $location) {

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
                //console.log('state change start');

                if (toState.redirectTo) {
                    event.preventDefault();
                    $state.go(toState.redirectTo);
                }
            });

            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
                //console.log('state changed');

                $rootScope.previousState = fromState;
                $rootScope.nextState = toState;
            });
        }
    ]);
})();