(function () {
    "use strict";

    function MenuDropdownDirectiveCtrl($scope) {
        var vm = this;

        vm.isClosed = true;
        vm.togglePopup = openClose;
        vm.closeEvnt = closeEvt;

        function openClose() {
            vm.isClosed = !vm.isClosed;
        }

        function closeEvt() {
            vm.isClosed = true;
        }
    }

    MenuDropdownDirectiveCtrl.$inject = ['$scope'];

    angular.module('expert.core')
        .controller('BaseMenuDropdownDirectiveCtrl', MenuDropdownDirectiveCtrl);

})();

