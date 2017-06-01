var global;
(function (global) {
    var appConsts = (function () {
        function appConsts() { }
        appConsts.appName = 'expert';

        return appConsts;
    }());

    var appUrls = (function () {
        var baseUrl = 'https://expertfinder-dev.smartransfer.de/API/';

        function appUrls () { }
        appUrls.getNews = baseUrl + 'news';

        return appUrls;
    }());

    global.consts = appConsts;
    global.url = appUrls;

})(global || (global = {}));