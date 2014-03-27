'use strict';

angular.module('lmisChromeApp').config(function ($stateProvider) {
  $stateProvider.state('appConfig', {
    url: '/app-config',
    templateUrl: '/views/app-config/configuration.html',
    resolve: {
      facilities: function (facilityFactory) {
        return facilityFactory.getAll();
      },
      productProfiles: function(productProfileFactory){
        return productProfileFactory.getAll();
      }
    },
    controller: 'AppConfigCtrl',
    data: {
      label: 'App Configuration'
    }
  })
}).controller('AppConfigCtrl', function ($scope, facilities, productProfiles, appConfigService, alertsFactory, $log,
                                         $translate, $state) {
 $scope.stockCountIntervals = appConfigService.stockCountIntervals;
 $scope.facilities = facilities;
 $scope.productProfiles = productProfiles;
 $scope.productProfileCheckBoxes = [];//used to productProfile models for checkbox
 //used to hold config form data
 $scope.appConfig = {
   facility: '',
   stockCountInterval: '',
   contactPerson: {
     name: '',
     email: '',
     phoneNo: ''
   },
   selectedProductProfiles: []
 };

 function removeProductProfile(productProfile){
  $scope.appConfig.selectedProductProfiles = $scope.appConfig.selectedProductProfiles
    .filter(function (prodProf) {
      return prodProf.uuid !== productProfile.uuid;
  });
 }

 $scope.handleSelectionEvent = function(selection){
   var productProfile = JSON.parse(selection);
   if(productProfile.deSelected === undefined){
     $scope.appConfig.selectedProductProfiles.push(productProfile);
     return;
   }
   removeProductProfile(productProfile);
 };

 $scope.save = function(){
   $scope.appConfig.appFacility = JSON.parse($scope.appConfig.facility)
   appConfigService.setup($scope.appConfig)
    .then(function (result) {
      if(result !== undefined){
        $translate('appConfigSuccessMsg').then(function(msg){
           $state.go('home.index.mainActivity',{'appConfigResult': msg });
        });
        return;
      }
      $translate('appConfigFailedMsg').then(function(msg){
        alertsFactory.danger(msg);
      });
   }, function (reason) {
      $translate('appConfigFailedMsg').then(function(msg){
        alertsFactory.danger(msg);
      });
      $log.error(reason);
   });
 };
});