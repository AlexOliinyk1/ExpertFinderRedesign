(function () {
    'use strict';

    angular.module("app", [
        'ui.router',

        'app.comunication',
    ])

    angular.module("app")
        .config(AppConfig);

    AppConfig.$inject = ['$stateProvider'];

    function AppConfig($stateProvider) {
        $stateProvider.state({
            name: 'app',
            url: '/',
        });
    }
})();