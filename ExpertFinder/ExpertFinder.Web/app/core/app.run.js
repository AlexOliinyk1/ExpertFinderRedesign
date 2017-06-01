(function () {
    'use strict';

    angular.module("expert")
        .run(AppRun);

    AppRun.$inject = ['$rootScope', '$state', '$location'];

    function AppRun($rootScope, $state, $location) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
            if (toState.redirectTo) {
                event.preventDefault();
                $state.go(toState.redirectTo);
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            $rootScope.previousState = fromState;
            $rootScope.nextState = toState;
        });
    }
})();