require('angular');
require('angular-ui-router');
require('angular-animate');
require('angular-aria');
require('angular-material');
require('angular-material-icons');
_ = require('lodash');
require('./lib/ng-map.min.js');

var gulpApp = angular.module('gulpApp',['ui.router','ngMap','ngMaterial','ngMdIcons'])
    .service('loadData', require('./services/yelp-foursquare-service.js'));
    
gulpApp.config(function($stateProvider, $urlRouterProvider,$mdThemingProvider) {

 $mdThemingProvider.theme('default')
    .primaryPalette('pink')
    .accentPalette('orange');
    
    $urlRouterProvider.otherwise('/home');

    var mainCtr = require('./components/mainController');

    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            params:{
                name:'',
                term:'',
                index:'',
                zoom:2
            },
            resolve: {
              $fourSquareData: [ '$stateParams', 'loadData', function ($stateParams, loadData) {
                  $stateParams.term = $stateParams.term === '' ? 'food' : $stateParams.term;

                  /*first time call avoid*/
                  if($stateParams.name){
                      return  loadData.retrieveFourSquare($stateParams.name,$stateParams.term);
                  }
              }],
                $yelpData: [ '$stateParams', 'loadData', function ($stateParams, loadData) {
                     $stateParams.term = $stateParams.term === '' ? 'food' : $stateParams.term;

                    /*first time call avoid*/
                    if($stateParams.name){
                        return  loadData.retrieveYelp($stateParams.name,$stateParams.term);
                    }
                }]
            },
            template: require('./components/home.html'),
            controller:mainCtr
        });



});