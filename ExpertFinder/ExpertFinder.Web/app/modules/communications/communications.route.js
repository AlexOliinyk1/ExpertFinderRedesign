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
                controllerAs: 'vm',
                templateUrl: 'app/modules/communications/views/communications.html',
                url: '/communications',
                redirectTo: 'communications.updates'
            })
            .state({
                name: 'communications.messages',
                url: '/messages',
                controller: 'MessagesCtrl',
                controllerAs: 'vm',
                templateUrl: 'app/modules/communications/views/messages.html',
                pageTitle: 'Messages'
            })
            .state({
                name: 'communications.updates',
                url: '/updates',
                controller: 'UpdatesCtrl',
                controllerAs: 'vm',
                templateUrl: 'app/modules/communications/views/updates.html',
                pageTitle: 'My Notifications'
            })
            .state({
                name: 'communications.requests',
                url: '/requests',
                controller: 'RequestsCtrl',
                controllerAs: 'vm',
                templateUrl: 'app/modules/communications/views/requests.html',
                pageTitle: 'Requests'
            });
    }

})();