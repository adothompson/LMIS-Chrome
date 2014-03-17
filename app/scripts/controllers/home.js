'use strict';

angular.module('lmisChromeApp')
  .config(function($urlRouterProvider, $stateProvider) {
    // Initial state
    $urlRouterProvider.otherwise('/main-activity');
    $stateProvider.state('home', {
      url: '',
      abstract: true,
      templateUrl: 'views/home/index.html',
      resolve: {
        currentFacility: function(facilityFactory) {
          return facilityFactory.getCurrentFacility();
        },
        facilityLocation: function(currentFacility, locationsFactory) {
          return locationsFactory.get(currentFacility.location);
        }
      },
      controller: function($scope, currentFacility, facilityLocation) {
        $scope.facility = currentFacility.name + ' (' +
          facilityLocation.name + ')';
      }
    })
    .state('home.index', {
      abstract: true,
      views: {
        'nav': {
          templateUrl: 'views/home/nav.html',
          controller: function ($scope, $state) {
            $scope.$state = $state;
          }
        },
        'sidebar': {
          templateUrl: 'views/home/sidebar.html'
        }
      }
    })
    .state('home.index.controlPanel', {
      url: '/control-panel',
      templateUrl: 'views/home/control-panel.html',
      data: {
        label: 'Home'
      }
    })
    .state('home.index.mainActivity', {
      url: '/main-activity?orderNo&stockResult',
      templateUrl: 'views/home/main-activity.html',
      data: {
        label: 'Home'
      },
      controller: function ($stateParams, $translate, alertsFactory) {
        if ($stateParams.orderNo !== null) {
          $stateParams.orderNo = null;
          $translate('orderPlacedSuccess', {orderNo: $stateParams.orderNo})
            .then(function (msg) {
              alertsFactory.add({message: msg, type: 'success'});
            });
        }

        if($stateParams.stockResult !== null){
          alertsFactory.add({message: $stateParams.stockResult, type: 'success'});
          $stateParams.stockResult = null;
        }
      }
    })
    .state('home.index.mainActivity.orderType', {
      url: '/place-order',
      controller: function ($state, $modal) {
        var modal = $modal.open({
          templateUrl: 'views/home/partials/order-type.html',
        });
        modal.result.catch(function () {
          $state.go('home.index.mainActivity');
        });
      }
    })
    .state('home.index.dashboard', {
      url: '/dashboard?logIncomingMsg',
      templateUrl: 'views/home/dashboard.html',
      resolve: {
        inventories: function(currentFacility, inventoryFactory) {
          return inventoryFactory.getFacilityInventory(currentFacility.uuid);
        },
        settings: function(settingsService) {
          return settingsService.load();
        }
      },
      controller: function($scope, $stateParams, $translate, alertsFactory, inventories, inventoryRulesFactory, $window, settings) {
        var keys = {
          below: {
            label: 'Below buffer',
            color: 'red'
          },
          buffer: {
            label: 'Buffer',
            color: 'yellow'
          },
          safety: {
            label: 'Safety stock',
            color: 'black'
          },
          max: {
            label: 'Max',
            color: 'grey'
          }
        };

        if($stateParams.logIncomingMsg !== undefined && $stateParams.logIncomingMsg !== '') {
           alertsFactory.add({message: $stateParams.logIncomingMsg, type: 'success'});
           $stateParams.logIncomingMsg = null;
        }

        if(!('inventory' in settings && 'products' in settings.inventory)) {
          $scope.productsUnset = true;
        }

        // var values = [
        //   {
        //     label: 'BCG',
        //     below: -19,
        //     buffer: 405,
        //     safety: 0,
        //     _max: 1000
        //   },
        //   {
        //     label: 'TT',
        //     below: 0,
        //     buffer: 348,
        //     safety: 384,
        //     _max: 1500
        //   },
        //   {
        //     label: 'Penta',
        //     below: 0,
        //     buffer: 310,
        //     safety: 272,
        //     _max: 1200
        //   }
        // ];


        // FIXME Just here for end-of-sprint demo
        var nauseatingHack = function() {
          var values = [];
          var buffers = inventoryRulesFactory.bufferStock(inventories);
          var code = '';

          var unique = {};

          angular.forEach(buffers, function(inventory) {
            code = inventory.batch.product.code;
            if(!(code in unique)) {
              unique[code] = {
                label: code,
                below: 0,
                buffer: inventory.buffer,
                safety: 100,
                _max: settings.inventory.products[code].max
              };
            }
            else {
              unique[code].buffer = unique[code].buffer + inventory.buffer / 2;
            }
          });

          for(var key in unique) {
            values.push(unique[key]);
          }

          return values;
        };

        var values = [];
        if(!$scope.productsUnset) {
          values = nauseatingHack();
        }
        var chart = [];
        angular.forEach(Object.keys(keys), function (key) {
          var series = {};
          series.key = keys[key].label;
          series.color = keys[key].color;
          series.values = [];
          angular.forEach(values, function (value) {
            if (key === 'max') {
              value[key] = value._max - (value.buffer + value.safety);
            }
            series.values.push([value.label, value[key]]);
          });
          chart.push(series);
        });

        $scope.inventoryChart = chart;
        $scope.inventoryKeys = keys;
        $scope.inventoryValues = values;

        var lt = -1;
        angular.forEach(inventories, function(inventory) {
          try {
            lt = inventoryRulesFactory.leadTime(inventory);
            lt = $window.humanizeDuration(lt);
            inventory.leadTime = lt;
          } catch(e) {
            inventory.leadTime = e;
          }
        });
        $scope.inventories = inventories;
      }
    })
    .state('home.index.settings', {
      url: '/settings',
      abstract: true,
      templateUrl: 'views/home/settings.html',
      resolve: {
        settings: function(settingsService) {
          return settingsService.load();
        }
      },
      controller: function($scope, settings, settingsService, alertsFactory, $translate) {
        var fields = ['facility', 'inventory'];
        for(var i = fields.length - 1; i >= 0; i--) {
          if(!(fields[i] in settings)) {
            settings[fields[i]] = {};
          }
        }

        $scope.settings = settings;
        $scope.save = function(settings) {
          settingsService.save(settings)
            .then(function() {
              $translate('settingsSaved').then(function(settingsSaved) {
                alertsFactory.add({
                  message: settingsSaved,
                  type: 'success'
                });
              });
            })
            .catch(function() {
              $translate('settingsFailed').then(function(settingsFailed) {
                alertsFactory.add({
                  message: settingsFailed,
                  type: 'danger'
                });
              });
            });
        };
      }
    })
    .state('home.index.settings.facility', {
      url: '/facility',
      templateUrl: 'views/home/settings/facility.html',
      controller: function($scope, settings) {
        $scope.facility = settings.facility;
      }
    })
    .state('home.index.settings.inventory', {
      url: '/inventory',
      templateUrl: 'views/home/settings/inventory.html',
      resolve: {
        products: function(currentFacility, inventoryFactory) {
          return inventoryFactory.getUniqueProducts(currentFacility.uuid);
        }
      },
      controller: function($scope, settings, products) {
        var inventory = settings.inventory;

        // User hasn't made any settings
        if(!('products' in inventory)) {
          inventory.products = {};
        }

        // Check if a product has been added since the settings were saved
        for(var code in products) {
          if(!(code in inventory.products)) {
            inventory.products[code] = products[code];
          }
        }
        $scope.inventory = inventory;
      }
    });
  });
