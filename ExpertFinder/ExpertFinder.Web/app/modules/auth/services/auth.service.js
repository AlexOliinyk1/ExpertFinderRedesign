(function () {

    angular.module('expert.auth')
        .factory('AuthService', ['$http', '$q', 'localStorageService', '$rootScope',
            function ($http, $q, localStorageService, $rootScope) {

                var authServiceFactory = {};

                var _authentication = {
                    isAuth: false,
                    userName: "",
                    userId: 0
                };

                var _login = function (loginData) {

                    var data = "grant_type=password&username=" + loginData.userName +
                        "&password=" + loginData.password +
                        "&api_key=" + ngWebSettings.clientId;

                    var deferred = $q.defer();

                    $http.post(ngWebSettings.api.authorize, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                        .then(function (response) {
                            localStorageService.set('authorizationData', { token: response.data.access_token, userName: response.data.userName, userId: response.data.userId });

                            _authentication.isAuth = true;
                            _authentication.userName = response.data.userName;
                            _authentication.userId = response.data.userId;

                            $rootScope.$broadcast('user.authorized', {});
                            deferred.resolve(response);
                        }, function (err, status) {
                            _logOut();
                            deferred.reject(err.data);
                        });

                    return deferred.promise;

                };

                var _logOut = function () {

                    localStorageService.remove('authorizationData');

                    _authentication.isAuth = false;
                    _authentication.userName = "";

                };

                var _fillAuthData = function () {

                    var authData = localStorageService.get('authorizationData');
                    if (authData) {
                        _authentication.isAuth = true;
                        _authentication.userName = authData.userName;
                        _authentication.userId = authData.userId;
                    }

                }

                var _setSpesialAuthData = function (token, userId) {

                    localStorageService.set('authorizationData', {
                        token: token,
                        userName: '',
                        userId: userId
                    });

                    var authData = localStorageService.get('authorizationData');
                    if (authData) {
                        _authentication.isAuth = true;
                        _authentication.userName = '';
                        _authentication.userId = userId;
                    }

                }

                authServiceFactory.login = _login;
                authServiceFactory.logOut = _logOut;
                authServiceFactory.fillAuthData = _fillAuthData;
                authServiceFactory.setSpesialAuthData = _setSpesialAuthData;
                authServiceFactory.authentication = _authentication;

                return authServiceFactory;
            }
        ]);

})();