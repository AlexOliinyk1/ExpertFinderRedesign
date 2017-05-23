
angular.module("app").directive('showTab', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.click(function (e) {
                e.preventDefault();
                jQuery(element).tab('show');
            });
        }
    };
});