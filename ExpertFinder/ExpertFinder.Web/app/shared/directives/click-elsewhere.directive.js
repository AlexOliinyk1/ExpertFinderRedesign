(function () {

    angular.module('expert.core')
        .directive('clickElsewhere', ['$document', "$parse",
            function ($document, $parse) {

                function link(scope, element, attr, controller) {
                    var anyOtherClickFunction = $parse(attr['clickElsewhere']);
                    var documentClickHandler = function (event) {
                        var eventOutsideTarget = (element[0] !== event.target) && (0 === element.find(event.target).length);
                        if (eventOutsideTarget) {
                            scope.$apply(function () {
                                anyOtherClickFunction(scope, {});
                            });
                        }
                    };

                    $document.on("click", documentClickHandler);

                    scope.$on("$destroy", function () {
                        $document.off("click", documentClickHandler);
                    });
                }

                return {
                    restrict: 'A',
                    link: link
                };
            }
        ]);

})();
