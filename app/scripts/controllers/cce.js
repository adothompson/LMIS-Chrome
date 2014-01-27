'use strict';

var chromeApp = angular.module('lmisChromeApp');

chromeApp.controller('cceCtrl', function ($scope, storageService, utility) {
    storageService.get(storageService.STORAGE_LOCATION).then(function(cceList) {
      $scope.cceList = cceList;
    });

    utility.loadTableObject(storageService.FACILITY).then(function(facilities) {
      $scope.facilities = facilities;
    });

    utility.loadTableObject(storageService.UOM).then(function(uomList) {
      $scope.uomList = uomList;
    });
});


/**
 *  This controller is used to save CCE record to local storage or remote DB via REST API.
 *
 */
chromeApp.controller('addCCECtrl', function($scope, storageService){
    //default cce to hold form data
    $scope.cce = {}

    storageService.get(storageService.UOM).then(function(uomList) {
      $scope.uomList = uomList;
    });

    storageService.get(storageService.FACILITY).then(function(facilities) {
      $scope.facilities = facilities;
    });

    storageService.get(storageService.STORAGE_LOCATION).then(function(cceList) {
      $scope.cceList = cceList;
    });


});