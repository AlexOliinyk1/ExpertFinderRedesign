(function () {
    "use strict";

    angular.module('expert.profile')
        .config(ExpertProfileConfig);

    ExpertProfileConfig.$inject = ['$stateProvider'];

    function ExpertProfileConfig($stateProvider) {
        $stateProvider
            .state({
                name: 'profile',
                url: '/profile',
                abstract: true,
                template: "<ui-view></ui-view>"
            })
            .state({
                name: 'profile.id',
                url: '/{profileId}',
                controller: 'ProfileCtrl',
                controllerAs: 'vm',
                templateUrl: 'app/modules/profile/views/profile.html',
                pageTitle: 'Profile'
            });
           //.state({
           //     name: 'myprofile',
           //     url: '/my-profile',
           //     controller: 'ProfileCtrl',
           //     controllerAs: 'vm',
           //     templateUrl: 'app/modules/profile/views/profile.html',
           //     pageTitle: 'My Profile'
           // });
    }
})();
