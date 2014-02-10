'use strict';

angular.module('lmisChromeApp')

.controller('cceCtrl', function ($scope, storageService, $filter, ngTableParams) {

  //constants used to track CCE status
  $scope.CCE_WORKING = 0;
  $scope.NOT_WORKING = 1;
  $scope.CCE_IN_REPAIR = 2;

  storageService.get(storageService.STORAGE_LOCATION).then(function (data) {
    // Table defaults
    var params = {
      page: 1,
      count: 10,
      sorting: {
        code: 'asc'     // initial sorting
      }
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
    }

    $scope.cceList = new ngTableParams(params, resolver);
  });

 storageService.loadTableObject(storageService.FACILITY).then(function (facilities) {
    $scope.facilities = facilities;
  });

 storageService.loadTableObject(storageService.STORAGE_LOCATION_TYPE).then(function (cceTypes) {
    $scope.cceTypes = cceTypes;
  });

 storageService.loadTableObject(storageService.UOM).then(function (uomList) {
    $scope.uomList = uomList;
  });

 storageService.loadTableObject(storageService.STORAGE_LOCATION).then(function (cceList) {
    $scope.parentCCEList = cceList;
  });

})


/**
 *  This controller is used to save CCE record to local storage or remote DB via REST API.
 */
.controller('addCCECtrl', function ($scope, storageService) {

  //default cce to hold form data
  $scope.cce = {}

  storageService.get(storageService.UOM).then(function (uomList) {
    $scope.uomList = uomList;
  });

  storageService.get(storageService.FACILITY).then(function (facilities) {
    $scope.facilities = facilities;
  });

  storageService.get(storageService.STORAGE_LOCATION).then(function (cceList) {
    $scope.cceList = cceList;
  });


})

/**
 *  This controller will pull logged in user facility CCE problem logs
 */
.controller('cceProblemLogMainCtrl', function ($scope, storageService, $filter, ngTableParams) {

  storageService.get(storageService.STORAGE_LOCATION_PROBLEM).then(function (data) {
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
    }

    $scope.cceProblems = new ngTableParams(params, resolver);

  });

 storageService.loadTableObject(storageService.STORAGE_LOCATION).then(function (data) {
    $scope.cceList = data;
  });

 storageService.loadTableObject(storageService.FACILITY).then(function (data) {
    $scope.facilities = data;
  });

 storageService.loadTableObject(storageService.CURRENCY).then(function (data) {
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

  storageService.get(storageService.STORAGE_LOCATION).then(function (cceList) {
    $scope.cceList = cceList;
  });

  storageService.get(storageService.CURRENCY).then(function (currency) {
    $scope.currencies = currency;
  });
})


/**
 * This is the controller for the main temperature log view
 */
.controller('cceTemperatureLogMainCtrl', function ($scope, storageService, $filter, ngTableParams) {

  storageService.get(storageService.STORAGE_LOCATION_TEMPERATURE).then(function (data) {

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
    }

    $scope.temperatureLogs = new ngTableParams(params, resolver);

    $scope.getUser = function (userObj) {
      if (userObj) {
        return userObj.username;
      }
      return '';
    };

   storageService.loadTableObject(storageService.STORAGE_LOCATION).then(function (data) {
      $scope.cceList = data;
    });

   storageService.loadTableObject(storageService.UOM).then(function (uomList) {
      $scope.uomList = uomList;
    });

  });
})

/**
 * This Controller is used by AddTemperatureLog Form.
 */
.controller('AddTemperatureLogCtrl', function ($scope, storageService) {

  //default temperatureLog object used to hold temp log form data
  $scope.temperatureLog = {}

  storageService.get(storageService.STORAGE_LOCATION).then(function (cceList) {
    $scope.cceList = cceList;
  });

  storageService.get(storageService.UOM).then(function (data) {
    $scope.uomList = data;
  });

  $scope.save = function () {
    console.log($scope.temperatureLog)
  }
})


.controller('cceTemperatureChartCtrl', function ($scope, storageService) {
  storageService.get(storageService.STORAGE_LOCATION).then(function (cceList) {
    $scope.cceList = cceList;
  });

});
