'use strict';

angular.module('lmisChromeApp')
/**
 * configure routes for batch module
 */
    .config(function ($stateProvider) {
      $stateProvider.state('storageUnitsView', {
        url: '/storage-units-view',
        templateUrl: '/views/storage-units/index.html',
        controller: 'StorageUnitListCtrl',
        data: {
          label: 'Storage Unit'
        },
        resolve: {
          storageUnits: function (storageUnitFactory) {
            return storageUnitFactory.getAll();
          }
        }
      });
    })
/**
 * StorageUnitListCtrl - is the controller responsible for showing storage units
 *
 */
    .controller('StorageUnitListCtrl', function ($scope, storageUnits, storageUnitFactory, storageService, $filter, ngTableParams) {

      // Table defaults
      var params = {
        page: 1,
        count: 10,
        sorting: {
          code: 'asc' // initial sorting
        }
      };

      // Pagination
      var resolver = {
        total: storageUnits.length,
        getData: function ($defer, params) {
          var orderedData = params.sorting() ? $filter('orderBy')(storageUnits, params.orderBy()) : storageUnits;
          $defer.resolve(orderedData.slice(
              (params.page() - 1) * params.count(),
              params.page() * params.count()
          ));
        }
      };

      $scope.storageUnits = new ngTableParams(params, resolver);
      $scope.STORAGE_STATUS = storageUnitFactory.STATUS;

      $scope.getCapacityDetails = function (capacity, uom) {
        return  $filter('number')(capacity, 2) +' '+ uom.symbol;
      };

    })


/**
 *  This controller is used to save CCE record to local storage or remote DB via REST API.
 */
    .controller('AddCCECtrl', function ($scope, storageService) {

      //default storage-units to hold form data
      $scope.storageUnit = {};

      storageService.get(storageService.UOM).then(function (uomList) {
        $scope.uomList = uomList;
      });

      storageService.get(storageService.FACILITY).then(function (facilities) {
        $scope.facilities = facilities;
      });

      storageService.get(storageService.CCU).then(function (cceList) {
        $scope.cceList = cceList;
      });

    })

/**
 *  This controller will pull logged in user facility CCE problem logs
 */
    .controller('CceProblemLogMainCtrl', function ($scope, storageService, $filter, ngTableParams) {

      storageService.all(storageService.CCU_PROBLEM).then(function (data) {
        // Table defaults
        var params = {
          page: 1,
          count: 10
        };

        // Pagination
        var resolver = {
          total: data.length,
          getData: function ($defer, params) {
            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
            $defer.resolve(orderedData.slice(
                (params.page() - 1) * params.count(),
                params.page() * params.count()
            ));
          }
        };

        $scope.cceProblems = new ngTableParams(params, resolver);
      });

      storageService.get(storageService.CCU).then(function (data) {
        $scope.cceList = data;
      });

      storageService.loadTableObject(storageService.FACILITY).then(function (data) {
        $scope.facilities = data;
      });

      storageService.get(storageService.CURRENCY).then(function (data) {
        $scope.currency = data;
      });

      storageService.loadTableObject(storageService.USER).then(function (data) {
        $scope.users = data;
      });

      $scope.getUser = function (userObj) {
        if (userObj) {
          return userObj.username;
        }
        return '';
      };

    })

/**
 * AddProblemLogCtrl is used for adding problems logs to a selected Cold Chain Equipment.
 */
    .controller('AddProblemLogCtrl', function ($scope, storageService) {

      //default problem log used to hold problem log form data
      $scope.problemLog = {};

      //this function will be used to save Add CCE problem log form content to local storage
      $scope.save = function () {
        console.log($scope.problemLog);
      };

      storageService.get(storageService.CCU).then(function (cceList) {
        $scope.cceList = cceList;
      });

      storageService.get(storageService.CURRENCY).then(function (currency) {
        $scope.currencies = currency;
      });
    })


/**
 * This is the controller for the main temperature log view
 */
    .controller('CceTemperatureLogMainCtrl', function ($scope, storageService, $filter, ngTableParams) {

      storageService.all(storageService.CCU_TEMPERATURE_LOG).then(function (data) {

        // Table defaults
        var params = {
          page: 1,
          count: 10
        };

        // Pagination and sorting
        var resolver = {
          total: data.length,
          getData: function ($defer, params) {
            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
            $defer.resolve(orderedData.slice(
                (params.page() - 1) * params.count(),
                params.page() * params.count()
            ));
          }
        };

        $scope.temperatureLogs = new ngTableParams(params, resolver);

        $scope.getUser = function (userObj) {
          if (userObj) {
            return userObj.username;
          }
          return '';
        };

        storageService.get(storageService.CCU).then(function (data) {
          $scope.cceList = data;
        });

        storageService.get(storageService.UOM).then(function (data) {
          $scope.uomList = data;
        });

      });
    })

/**
 * This Controller is used by AddTemperatureLog Form.
 */
    .controller('AddTemperatureLogCtrl', function ($scope, storageService) {

      //default temperatureLog object used to hold temp log form data
      $scope.temperatureLog = {};

      storageService.get(storageService.CCU).then(function (cceList) {
        $scope.cceList = cceList;
      });

      storageService.get(storageService.UOM).then(function (data) {
        $scope.uomList = data;
      });

      $scope.save = function () {
        console.log($scope.temperatureLog);
      };
    })
    .controller('CceTemperatureChartCtrl', function ($scope, storageService) {
      storageService.get(storageService.CCU).then(function (cceList) {
        $scope.cceList = cceList;
      });
    });
