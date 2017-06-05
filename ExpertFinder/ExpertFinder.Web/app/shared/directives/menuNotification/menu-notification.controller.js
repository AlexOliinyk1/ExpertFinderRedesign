(function () {
    "use strict";

    function MenuNotificationDirectiveCtrl($scope, $document, $timeout) {
        var vm = this;

        vm.updates = [];
        //  common
        vm.loading = false;
        vm.isClosed = true;
        vm.togglePopup = openClose;

        function loadUpdates() {
            vm.loading = true;

            //TODO: make call to api here
            $timeout(function () {
                vm.loading = false;
            }, 500, true);
        }

        //  common
        function openClose(e) {
            //if (e) { e.stopPropagation(); }

            vm.isClosed = !vm.isClosed;
        }

        function closeEvt() {
            vm.isClosed = true;
            $scope.$apply();
        }

        function reset(close) {
            if (close) {
                vm.updates = [];
            } else {
                loadUpdates();
            }
        }

        $scope.$watch('vm.isClosed', reset);
        $document.on('click', closeEvt);
    }

    MenuNotificationDirectiveCtrl.$inject = ['$scope', '$document', '$timeout'];

    angular.module('expert.core')
        .controller('MenuNotificationDirectiveCtrl', MenuNotificationDirectiveCtrl);

})();
