'use strict';

angular.module('lmisChromeApp')
    .factory('bundleFactory', function ($q, storageService, productsFactory) {

      var BUNDLE_STATUS = ["Pending", "In Transit", "Done"];//TODO: move this to a table in local storage(JIDEOBI)


      function saveBundleReceipt(bundleReceipt){
        console.log(bundleReceipt);
      }

      /**
       * function used get JSON response for a bundle.
       *
       * @param bundleUUID
       * @returns {promise|*}
       */
      function get(bundleUUID) {
        var defered = $q.defer();
        var facilities = {};
        var users = {};
        var bundle = null;

        //TODO: consider refactoring these into their respective factory.
        storageService.get(storageService.FACILITY).then(function (data) {
          facilities = data;
        });

        storageService.get(storageService.USER).then(function (data) {
          users = data;
        });


        try {
          storageService.find(storageService.BUNDLE, bundleUUID).then(function (data) {
            //compose bundle response
            if (data !== undefined) {
              bundle = {
                "uuid": data.uuid,
                "receiving_facility": facilities[data.receiving_facility],
                "parent": facilities[data.parent],
                "order": "12345-90882", //TODO: replace with order object when complete
                "bundleLines": getBundleLines(bundleUUID)
              };
              defered.resolve(bundle);
            }
          });

        } catch (e) {
          defered.resolve(null);
        } finally {
          return defered.promise;
        }
      }

      /**
       * This functions returns a collection of bundle lines that belongs to the given bundleUUID
       * @param bundleUUID
       * @returns {Array}
       */
      function getBundleLines(bundleUUID) {


        var batches = {};
        var programs = {};
        var productTypes = {};
        var uomList = {};

        storageService.get(storageService.BATCH).then(function (data) {
          batches = data;
        });

        storageService.get(storageService.PROGRAM).then(function (data) {
          programs = data;
        });

        storageService.get(storageService.PRODUCT_TYPES).then(function (data) {
          productTypes = data;
        });

        storageService.get(storageService.UOM).then(function (data) {
          uomList = data;
        });

        var bundleLines = [];
        storageService.find(storageService.BUNDLE, bundleUUID).then(function (data) {
          if (data !== undefined) {

            for (var index in data.bundle_lines) {
              var bundleLineUUID = data.bundle_lines[index];
              storageService.find(storageService.BUNDLE_LINES, bundleLineUUID).then(function (data) {
                if (data !== undefined) {
                  var batch = batches[data.batch];
                  batch.product = productTypes[batch.product];
                  console.log(data);
                  var bundleLine = {
                    "uuid": data.uuid,
                    "program": programs[data.program],
                    "batch": batch,
                    "quantity": data.quantity,
                    "quantity_uom": uomList[data.quantity_uom],
                    "verify": 0,
                    "storage_unit": ""
                  };
                  bundleLines.push(bundleLine);
                }
              });
            }

          }
        });

        return bundleLines;
      }

      function getBundleReceiptLine(bundleUUID){
        var batches = {};
        var programs = {};
        var productTypes = {};
        var uomList = {};

        storageService.get(storageService.BATCH).then(function (data) {
          batches = data;
        });

        storageService.get(storageService.PROGRAM).then(function (data) {
          programs = data;
        });

        storageService.get(storageService.PRODUCT_TYPES).then(function (data) {
          productTypes = data;
        });

        storageService.get(storageService.UOM).then(function (data) {
          uomList = data;
        });

        var bundleLines = [];
        var bundleLine = {};
        storageService.find(storageService.BUNDLE, bundleUUID).then(function (data) {
          if (data !== undefined) {
            for (var index in data.bundle_lines) {
              var bundleLineUUID = data.bundle_lines[index];
              storageService.find(storageService.BUNDLE_LINES, bundleLineUUID).then(function (data) {
                if (data !== undefined) {
                  var batch = batches[data.batch];
                  batch.product = productTypes[batch.product];
                  console.log(data);
                  bundleLine = {
                    "bundle": data.uuid,
                    "program": programs[data.program].name,
                    "batch": batch,
                    "quantity": data.quantity,
                    "quantity_uom": uomList[data.quantity_uom],
                    "verify": 0
                  };
                  bundleLines.push(bundleLine);
                }
              });
            }
          }
        });

        return bundleLines;
      }

      function getBundleLineBatch(bundleLine) {
        return bundleLine.batch;
      }

      function getBundleLineProductType(bundleLine) {
        return bundleLine.batch.product;
      }

      function getQuantityUOM(bundleLine) {
        return bundleLine.quantity_uom;
      }

      return {
        getBundleLines: getBundleLines,
        getBundle: get,
        getBatch: getBundleLineBatch,
        getProductType: getBundleLineProductType,
        getQuantityUOM: getQuantityUOM,
        saveBundleReceipt: saveBundleReceipt,
        getBundleReceiptLines: getBundleReceiptLine
      }
    });