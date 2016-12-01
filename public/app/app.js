// INITILIZE APP
// ============================================================
var app = angular.module("app", ['ui.router']);
// CONFIG
// ============================================================
angular.module("app").config(function($stateProvider, $urlRouterProvider) {

  // INITILIZE STATES
  // ============================================================
  $stateProvider

    // LOGIN STATE
    .state('login', {
      url: '/login',
      templateUrl: './app/routes/login/login.html',
      controller: 'loginCtrl'
    })

    // PROFILE STATE
    .state('profile', {
      url: '/profile',
      templateUrl: './app/routes/profile/profile.html',
      controller: 'profileCtrl',
      resolve: {
        user: function(authService, $state) {
          return authService.getCurrentUser()
            .then(function(response) {
              if (!response.data.email) {
                return $state.go('login');
              }
              return response.data
            }).catch(function(err) {
              $state.go('login');
            });
        }
      }
    });

  // ASSIGN OTHERWISE
  // ============================================================
  $urlRouterProvider.otherwise('/login');
});
