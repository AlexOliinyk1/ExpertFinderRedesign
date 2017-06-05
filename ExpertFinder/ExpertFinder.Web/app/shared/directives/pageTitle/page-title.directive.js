(function () {
    "use strict";

    function PageTitleDirective($rootScope, $timeout, $document) {

        function listener(event, toState) {
            var title = '';
            if (toState.pageTitle) title = toState.pageTitle;

            $timeout(function () {
                element.text(title);
            }, 0, true);
        };

        function link(scope, element) {
            $rootScope.$on('$stateChangeSuccess', listener);
        }

        return {
            restrict: 'A',
            template: '{{pageTitle}}',
            link: link
        };
    }

    PageTitleDirective.$inject = ['$rootScope', '$timeout', '$document'];

    angular.module('expert.core')
        .directive('pageTitle', PageTitleDirective);
})();
