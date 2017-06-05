(function () {
    "use strict";

    angular.module("expert.core")
        .directive('menuNotification', function () {
            return {
                restrict: 'E',
                scope: true,
                controller: 'MenuNotificationDirectiveCtrl',
                controllerAs: 'vm',
                templateUrl: 'app/shared/directives/menuNotification/menu-notification.template.html',
            };
        });
})();