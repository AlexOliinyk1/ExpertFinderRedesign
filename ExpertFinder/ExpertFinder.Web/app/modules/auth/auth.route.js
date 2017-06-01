(function () {
    "use strict";

    angular.module('expert.auth')
        .config(ExpertAuthConfig);

    ExpertAuthConfig.$inject = ['$stateProvider'];

    function ExpertAuthConfig($stateProvider) {
        $stateProvider
            .state({
                name: 'login',
                url: '/login',
                allowAnonymous: true
                //controller: 'NewsCtrl',
                //controllerAs: 'vm',
                //templateUrl: 'app/modules/news/views/news.html'
            });

        //$httpProvider.interceptors.push('AuthInterceptorService');
    }
})();