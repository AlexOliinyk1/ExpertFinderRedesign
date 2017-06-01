(function () {
    "use strict";

    angular.module('expert.news')
        .config(ExpertNewsConfig);

    ExpertNewsConfig.$inject = ['$stateProvider'];

    function ExpertNewsConfig($stateProvider) {
        $stateProvider
            .state({
                name: 'news',
                url: '/news',
                controller: 'NewsCtrl',
                controllerAs: 'vm',
                templateUrl: 'app/modules/news/views/news.html'
            });
    }
})();