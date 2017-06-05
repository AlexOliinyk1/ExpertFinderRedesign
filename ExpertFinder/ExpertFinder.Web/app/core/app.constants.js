var global;
(function (global) {
    var appConsts = (function () {
        function appConsts() { }
        appConsts.appName = 'expert';
        appConsts.testUser = 12351;
        appConsts.userIdReplace = '{user_id}';

        return appConsts;
    }());

    var appUrls = (function () {
        var baseUrl = 'https://expertfinder-dev.smartransfer.de/API/';

        function appUrls () { }
        appUrls.getNews = baseUrl + 'news';
        appUrls.getRequests = baseUrl + 'profiles/{user_id}/requests';//?offset=0&limit=20'
        appUrls.getProfile = baseUrl + 'profiles/';//{user_id}
        appUrls.getSimilarProfiles = baseUrl + 'profiles/{user_id}/similars';

        return appUrls;
    }());

    global.consts = appConsts;
    global.url = appUrls;

})(global || (global = {}));