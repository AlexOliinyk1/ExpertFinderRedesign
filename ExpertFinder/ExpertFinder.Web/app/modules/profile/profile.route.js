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
                abstract: true
            })
            .state({
                name: 'profile.id',
                url: '/{profileId}',
                controller: 'ProfileCtrl',
                controllerAs: 'vm',
                templateUrl: 'app/modules/profile/views/profile.html'
            });
        
        //$stateProvider
        //    .state({
        //        name: 'myprofile',
        //        url: '/my-profile',
        //        controller: '',
        //        controllerAs: 'vm',
        //        templateUrl: 'app/modules//views/.html'
        //    });
    }
})();