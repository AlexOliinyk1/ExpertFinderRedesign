(function () {
    "use strict";

    function RequestsController(requestService) {
        var vm = this;

        vm.loading = true;
        vm.requests = [];

        function initialize() {
            requestService.getRequests(global.consts.testUser)
                .then(function (result) {
                    vm.requests = result;
                    vm.loading = false;
                });
        }

        initialize();
    }

    RequestsController.$inject = ['RequestService'];

    angular.module("expert.communications")
        .controller('RequestsCtrl', RequestsController);

})();
