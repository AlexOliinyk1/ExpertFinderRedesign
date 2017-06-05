(function () {
    "use strict";

    function MenuRequestsDirectiveCtrl($scope, $document, requestService) {
        var vm = this;

        vm.requests = [];
        //  common
        vm.loading = false;
        vm.isClosed = true;
        vm.togglePopup = togglePopup;

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
            //if (e) {
            //    e.stopPropagation();
            //}
            vm.isClosed = !vm.isClosed;
        }
        
        function closeEvt() {
            vm.isClosed = true;
            $scope.$apply();
        }

        $scope.$watch('vm.isClosed', reset);
        $document.on('click', closeEvt);
    }

    MenuRequestsDirectiveCtrl.$inject = ['$scope', '$document', 'RequestService'];

    angular.module('expert.core')
       .controller('MenuRequestsDirectiveCtrl', MenuRequestsDirectiveCtrl);

})();
