(function () {
    "use strict";

    angular.module('expert.core')
        .controller('BaseMenuDropdownDirectiveCtrl', BaseMenuDropdownDirectiveCtrl);

    BaseMenuDropdownDirectiveCtrl.$inject = ['$scope', '$document'];

    function BaseMenuDropdownDirectiveCtrl($scope, $document) {
        var vm = this;

        vm.isClosed = true;
        vm.togglePopup = openClose;

        function openClose() {
            vm.isClosed = !vm.isClosed;
        }

        function closeEvt() {
            vm.isClosed = true;
            $scope.$apply();
        }

        $document.on('click', closeEvt);
    }

})();

