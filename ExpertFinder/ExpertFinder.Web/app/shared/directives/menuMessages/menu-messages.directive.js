(function () {
    "use strict";

    angular.module("expert.core")
        .directive('menuMessages', function () {
            return {
                restrict: 'E',
                scope: true,
                controller: 'MenuMessagesDirectiveCtrl',
                controllerAs: 'vm',
                templateUrl: 'app/shared/directives/menuMessages/menu-messages.template.html',
            };
        });
})();