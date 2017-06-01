(function () {

    angular.module('expert.news')
        .factory('NewsService', NewsService);

    NewsService.$inject = ['$http'];

    function NewsService($http) {
        var newsService = this;

        newsService.getNews = getNews;

        return newsService;
        
        function getNews(skip, take) {
            //TODO: implement paging
            return $http.get(global.url.getNews, { responseType: 'json' })
                .then(function (response) {
                    var result = response.data
                    return result.data;
                })
                .catch(function (exc) {
                    console.log(exc);
                    return [];
                });
        }
    }

})();