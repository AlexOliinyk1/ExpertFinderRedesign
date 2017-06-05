(function () {

    angular.module("expert.communications")
        .controller("ComunicationsCtrl", ExpertComunicationsCtrl);

    ExpertComunicationsCtrl.$inject = ['$scope', '$rootScope', '$state'];

    function ExpertComunicationsCtrl($scope, $rootScope, $state) {
        var vm = this;

        vm.currentPage = $rootScope.currentState.name;

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            vm.currentPage = toState.name;
        });
    }

})();