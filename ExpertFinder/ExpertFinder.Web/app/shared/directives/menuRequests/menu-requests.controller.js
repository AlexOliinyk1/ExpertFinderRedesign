(function () {
    "use strict";

    function MenuRequestsDirectiveCtrl($scope, requestService) {
        var vm = this;

        vm.requests = [];
        //  common
        vm.loading = false;
        vm.isClosed = true;
        vm.togglePopup = togglePopup;
        vm.closeEvnt = closeEvt;

        function initialize() {
            vm.loading = true;
            requestService.getRequests(global.consts.testUser)
                .then(function (result) {
                    vm.requests = result;
                    vm.loading = false;
                });
        }

        function reset(close) {
            if (close) {
                vm.requests = [];
            } else {
                initialize();
            }
        }

        //  common
        function togglePopup(e) {
            vm.isClosed = !vm.isClosed;
        }
        
        function closeEvt(e) {
            vm.isClosed = true;
        }

        $scope.$watch('vm.isClosed', reset);
    }

    MenuRequestsDirectiveCtrl.$inject = ['$scope', 'RequestService'];

    angular.module('expert.core')
       .controller('MenuRequestsDirectiveCtrl', MenuRequestsDirectiveCtrl);

})();
