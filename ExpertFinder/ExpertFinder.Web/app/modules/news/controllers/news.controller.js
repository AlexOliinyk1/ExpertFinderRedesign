﻿(function () {
    "use strict";

    angular.module('expert.news')
        .controller('NewsCtrl', NewsController);

    NewsController.$inject = ['NewsService'];

    function NewsController(newsService) {
        var vm = this;

        vm.news = [];
        vm.loadNews = getNews;
        vm.pager = {
            perPage: 20,
            offset: 0
        };

        function getNews() {
            newsService.getNews(vm.pager)
                .then(function (news) {
                    vm.news = news;
                    vm.pager.offset += news.length;
                });
        }
    }
})();