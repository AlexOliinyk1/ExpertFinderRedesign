(function () {
    "use strict";

    angular.module('expert.search')
        .config(ExpertSearchConfig);

    ExpertSearchConfig.$inject = ['$stateProvider'];

    function ExpertSearchConfig($stateProvider) {

        $stateProvider
            .state({
                name: 'search',
                url: '/search',
                templateUrl: 'app/modules/search/views/search.html'
            });
    }
})();