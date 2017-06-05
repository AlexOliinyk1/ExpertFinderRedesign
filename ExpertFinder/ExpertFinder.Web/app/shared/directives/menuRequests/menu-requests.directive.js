(function () {
    "use strict";

    angular.module("expert.core")
        .directive('menuRequests', function () {
            return {
                restrict: 'E',
                scope: true,
                controller: 'MenuRequestsDirectiveCtrl',
                controllerAs: 'vm',
                templateUrl: 'app/shared/directives/menuRequests/menu-requests.template.html',
            };
        });
})();