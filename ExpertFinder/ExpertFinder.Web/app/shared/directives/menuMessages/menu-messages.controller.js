(function () {
    "use strict";

    function MenuMessagesDirectiveCtrl($scope, $timeout) {
        var vm = this;

        vm.messages = [];
        //  common
        vm.loading = false;
        vm.isClosed = true;
        vm.togglePopup = togglePopup;
        vm.closeEvnt = closeEvt;

        function loadMessages() {
            vm.loading = true;

            //TODO: make call to api here
            $timeout(function () {
                vm.loading = false;
            }, 500, true);
        }

        //  common
        function togglePopup(e) {
            vm.isClosed = !vm.isClosed;
        }

        function closeEvt() {
            vm.isClosed = true;
        }

        function update(close) {
            if (close) {
                vm.messages = [];
            } else {
                loadMessages();
            }
        }

        $scope.$watch('vm.isClosed', update);
    }

    MenuMessagesDirectiveCtrl.$inject = ['$scope', '$timeout'];

    angular.module('expert.core')
        .controller('MenuMessagesDirectiveCtrl', MenuMessagesDirectiveCtrl);
})();
