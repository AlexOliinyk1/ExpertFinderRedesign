(function () {
    "use strict";

    angular.module('expert.news')
        .controller('NewsCtrl', NewsController);

    NewsController.$inject = [];

    function NewsController() {
        var vm = this;
        vm.news = getNews();
        vm.text = "News";

        function getNews() {
            return [{
                id: 1,
                name: "Sean Ferguson",
                date: new Date(),
                event: "added new skills",
                eventDescription: "Updated profile",
                description: "Exorbitant CompetenceMiner with lots of experience"
            }, {
                id: 2,
                name: "Rose Goodman",
                date: new Date(),
                event: "added new skills",
                eventDescription: "Updated profile",
                description: "Exorbitant CompetenceMiner with lots of experience"
            }, {
                id: 3,
                name: "Calvin Meyers",
                date: new Date(),
                event: "has an updated skill profile",
                eventDescription: "Skills",
                description: "E-Mail Marketing und Preissuchmaschinen, die klassischen Wege TV, eTail Germany, Berlin, Tools im Performance Marketing, Internet Word Business, F..."
            }, {
                id: 4,
                name: "Albert Jackson",
                date: new Date(),
                event: "has an updated skill profile",
                eventDescription: "Skills",
                description: "Exorbitant CompetenceMiner with lots of experience"
            }];
        }
    }
})();