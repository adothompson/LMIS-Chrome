'use strict';

var chromeApp = angular.module('lmisChromeApp');

chromeApp.controller('MainCtrl', function ($scope, storageService, $location ) {
        storageService.get('products').then(function(d){
           $scope.products = d;
        });
        //console.log($scope.products);
        /*$scope.$watch('online', function(newStatus) {})*/
});

/**
    ProductListCtrl controller handles display of products pulled from storage.
*/
chromeApp.controller('ProductListCtrl', function ($scope, storageService, utility) {

    storageService.get(storageService.PRODUCT).then(function(productList){
           $scope.products = productList;
    });

    utility.loadTableObject(storageService.PRODUCT_CATEGORY).then(function(data){
        $scope.product_categories = data;
    });

    utility.loadTableObject(storageService.UOM).then(function(data){
        $scope.uomList = data;
    });

});


/**
    AddProductCtrl - handles the addition of product to storage.
    it uses storage service to load product category and unit of measurement list used to populate product form
    respective drop downs.
*/
chromeApp.controller('AddProductCtrl', function($scope, storageService, $location){

    //create a blank object tha will be used to hold product form info
    $scope.product = {};

    storageService.get(storageService.PRODUCT_CATEGORY).then(function(product_categories){
           $scope.categories = product_categories;
    });

    storageService.get(storageService.UOM).then(function(uomList){
        $scope.uomList = uomList;
    });

    $scope.saveProduct = function(){
        //TODO: implement save of product here
        if(Object.keys($scope.product).length>0){
            storageService.insert(storageService.PRODUCT, $scope.product).then(function(bool){
                if(bool){
                    $scope.setMessage({message:"Data saved ", type:"success"});
                    $location.path('/main/products');
                }
                else{

                }
            });
        }
        else{
            $scope.setMessage({message:"can't save empty form", type:"danger"});
        }

    }


});


/**
    ProductItemListCtrl - This handles the display of Product-Items pulled from storage.
*/
chromeApp.controller('ProductItemListCtrl', function($scope, storageService, visualMarkerService){
     storageService.get(storageService.PRODUCT_ITEM).then(function(productItems){
           $scope.productItemList = productItems;
    });

    $scope.highlightExpiredProductItem = visualMarkerService.getExpiredCSS

    $scope.getAboutToExpireCSS = visualMarkerService.getAboutToExpireCSS

    console.log($scope.getAboutToExpireCSS(new Date('2013-03-01'), 6));


    $scope.highlightAboutToExpired = function(){
         //TODO: checking for expired date to utility service or a service cause it will be used at different places
        return "about-to-expire";
    }

});
/**
 Program
*/
chromeApp.controller('ProgramsCtrl', function($scope, storageService, $location){
     var url_arr = $location.path().replace(/\/$/,'').replace(/^\//,'').split('/');
     var bc = [];
     if(url_arr.indexOf('programs') != -1){
            bc =
            [
                {name:"Programs", "link":''},

            ];
      }
    $scope.addbreadcrumbs(bc);
     storageService.get(storageService.PROGRAM).then(function(programs){
           $scope.programList = programs;
    });


});

chromeApp.controller('programFormCtrl', function($scope, storageService, $location, utility){
     var url_arr = $location.path().replace(/\/$/,'').replace(/^\//,'').split('/');
     var bc = [];
     if(url_arr.indexOf('program_form') != -1){
            bc =
            [
                {name:"Programs", link:"#/main/programs"},
                {name:"Form", "link":''},

            ];
      }

    $scope.addbreadcrumbs(bc);
    $scope.program = {};
    $scope.uuid = ($location.search()).uuid;

    if($scope.uuid){
        utility.loadTableObject(storageService.PROGRAM).then(function(programs){
            $scope.program = programs[$scope.uuid];
        });

    }

    $scope.saveProgram = function(){
        if(Object.keys($scope.program).length>0){
            storageService.insert(storageService.PROGRAM, $scope.program).then(function(bool){
                var msg = ($scope.uuid)? {type:"success", message:"Program update was successful"}:{type:"success", message:"Program entry was successful"}
                $scope.setMessage(msg);
                $location.path("/main/programs");
            });
        }
        else{
            $scope.setMessage({type:"danger", message:"Can't save a blank form"})
        }
    }
    storageService.get(storageService.PROGRAM).then(function(programs){
           $scope.programList = programs;
    });
    $scope.removeProgram = function(uuid){
        console.log(uuid);
        utility.loadTableObject(storageService.PROGRAM).then(function(programs){
            $scope.program = programs[uuid];
            var index = $scope.program.array_index;
            $scope.programList.splice(index,1);
            storageService.add(storageService.PROGRAM, $scope.programList);
        });

    }
});


/**
 *  AddProductItemCtrl - This handles the addition of product items
 *
 *
 */
 chromeApp.controller('AddProductItemCtrl', function($scope, storageService){
    $scope.productItem = {};
    $scope.productItem.active = true;//default is true

    storageService.get(storageService.PRODUCT).then(function(productList){
           $scope.products = productList;
    });

    storageService.get(storageService.PRODUCT_PRESENTATION).then(function(presentationList){
           $scope.presentations = presentationList;
    });

    storageService.get(storageService.COMPANY).then(function(companyList){
           $scope.companies = companyList;
    });

    storageService.get(storageService.CURRENCY).then(function(currencyList){
           $scope.currencies = currencyList;
    });

    storageService.get(storageService.CURRENCY).then(function(currencyList){
           $scope.currencies = currencyList;
    });

    storageService.get(storageService.MODE_OF_ADMINISTRATION).then(function(modeOfAdministrationList){
           $scope.modes = modeOfAdministrationList;
    });

    storageService.get(storageService.PRODUCT_FORMULATION).then(function(formulationList){
            //TODO: update formulations fixture
           $scope.formulations = formulationList;
    });

    storageService.get(storageService.UOM).then(function(uomList){
        $scope.uomList = uomList;
    });

    /**
     *  This function , "save", when triggered saves the product item form data to local storage.
     */

     $scope.save = function(){
        console.log($scope.productItem)
     };

 });

