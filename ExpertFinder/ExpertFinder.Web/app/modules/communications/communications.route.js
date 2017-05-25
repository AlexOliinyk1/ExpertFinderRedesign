(function () {
    "use strict";

    angular.module("expert.communications")
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {
        $stateProvider
            .state({
                name: 'communications',
                controller: 'ComunicationsCtrl',
                templateUrl: 'app/modules/communications/views/communications.html',
                url: '/communications',
                redirectTo: 'communications.updates'
            })
            .state({
                name: 'communications.messages',
                url: '/messages',
                controller: 'MessagesCtrl',
                templateUrl: 'app/modules/communications/views/messages.html'
            })
            .state({
                name: 'communications.updates',
                url: '/updates',
                controller: 'MessagesCtrl',
                templateUrl: 'app/modules/communications/views/updates.html'
            })
            .state({
                name: 'communications.requests',
                url: '/requests',
                controller: 'MessagesCtrl',
                templateUrl: 'app/modules/communications/views/requests.html'
            });
    }

})();