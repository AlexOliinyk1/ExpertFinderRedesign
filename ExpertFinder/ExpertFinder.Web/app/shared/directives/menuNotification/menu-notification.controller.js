(function () {
    "use strict";

    function MenuNotificationDirectiveCtrl($scope, $timeout) {
        var vm = this;

        vm.updates = [];
        //  common
        vm.loading = false;
        vm.isClosed = true;
        vm.togglePopup = openClose;
        vm.closeEvnt = closeEvt;

        function loadUpdates() {
            vm.loading = true;

            //TODO: make call to api here
            $timeout(function () {
                vm.loading = false;
            }, 500, true);
        }

        //  common
        function openClose(e) {
            vm.isClosed = !vm.isClosed;
        }

        function closeEvt() {
            vm.isClosed = true;
        }

        function reset(close) {
            if (close) {
                vm.updates = [];
            } else {
                loadUpdates();
            }
        }

        $scope.$watch('vm.isClosed', reset);
    }

    MenuNotificationDirectiveCtrl.$inject = ['$scope', '$timeout'];

    angular.module('expert.core')
        .controller('MenuNotificationDirectiveCtrl', MenuNotificationDirectiveCtrl);

})();
