'use strict';

angular.module('lmisChromeApp')
    .factory('inventoryFactory', function ($q, storageService, programsFactory, storageUnitFactory, batchFactory, facilityFactory, uomFactory) {

      function getByUUID(uuid) {
        var deferred = $q.defer();
        storageService.find(storageService.INVENTORY, uuid).then(function (data) {
          var inventoryLine = data;
          if (!angular.equals(data, undefined)) {
            //Attach nested attributes complete JSON object.
            batchFactory.getByBatchNo(inventoryLine.batch).then(function(data){
              inventoryLine.batch = data;
            });

            programsFactory.get(inventoryLine.program).then(function(data){
              inventoryLine.program = data;
            });

            uomFactory.get(inventoryLine.uom).then(function (data) {
              inventoryLine.uom = data;
            });

            facilityFactory.get(inventoryLine.receiving_facility).then(function (data) {
              inventoryLine.receiving_facility = data;
            });

            facilityFactory.get(inventoryLine.sending_facility).then(function (data) {
              inventoryLine.sending_facility = data;
            });

            storageUnitFactory.get(inventoryLine.storage_unit).then(function (data) {
              inventoryLine.storage_unit = data;
            });

          }
          deferred.resolve(data);
        });
        return deferred.promise;
      }

      return {
        get: getByUUID,

        /**
         *  This functions returns all the inventory of a given facility.
         *
         * @param facility - this can be a string(facilityUUID) or an object(facility object with uuid as its property).
         */
        getAll: function (facility) {
          var uuid = angular.isObject(facility) ? facility.uuid : facility;
          var deferred = $q.defer(), inventory = [];

          storageService.all(storageService.INVENTORY).then(function (inventoryLines) {
            angular.forEach(inventoryLines, function (line) {
              if (angular.equals(line.receiving_facility, uuid)) {
                inventory.push(getByUUID(line.uuid).then(function (inventoryLine) {
                  deferred.notify(line);
                  return inventoryLine;
                }));
              }
            });

            $q.all(inventory).then(function (results) {
              deferred.resolve(results);
            });

          });
          return deferred.promise;
        }

      };
    });
