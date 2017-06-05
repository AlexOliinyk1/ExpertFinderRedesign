(function () {
    "use strict";

    angular.module("expert.core")
        .directive('menuDropdown', function () {
            return {
                restrict: 'E',
                scope: true,
                controller: 'BaseMenuDropdownDirectiveCtrl',
                controllerAs: 'vm',
                templateUrl: 'app/shared/directives/menuDropdown/menu-dropdown.template.html',
            };
        });
})();