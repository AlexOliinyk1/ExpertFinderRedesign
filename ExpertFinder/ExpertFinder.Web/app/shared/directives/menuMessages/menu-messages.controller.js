(function () {
    "use strict";

    angular.module('expert.core')
        .controller('MenuMessagesDirectiveCtrl', MenuMessagesDirectiveCtrl);

    MenuMessagesDirectiveCtrl.$inject = ['$scope', '$document', '$timeout'];

    function MenuMessagesDirectiveCtrl($scope, $document, $timeout) {
        var vm = this;

        vm.messages = [];
        //  common
        vm.loading = false;
        vm.isClosed = true;
        vm.togglePopup = togglePopup;

        function loadMessages() {
            vm.loading = true;

            //TODO: make call to api here
            $timeout(function () {
                vm.loading = false;
            }, 500, true);
        }

        //  common
        function togglePopup(e) {
            //if (e) {
            //    e.stopPropagation();
            //}

            vm.isClosed = !vm.isClosed;
        }

        function closeEvt() {
            vm.isClosed = true;
            $scope.$apply();
        }

        function update(close) {
            if (close) {
                vm.messages = [];
            } else {
                loadMessages();
            }
        }

        $scope.$watch('vm.isClosed', update);
        $document.on('click', closeEvt);
    }

})();
