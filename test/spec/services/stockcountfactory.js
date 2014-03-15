'use strict';

describe('Service stockCountFactory', function(){
  beforeEach(module('lmisChromeApp', 'lmisChromeAppMocks', 'stockCountMocks'));

  var stockCountFactory;
  var stockCount;
  var scope;
  var q;
  beforeEach(inject(function(_stockCountFactory_, $rootScope, stockData){
    stockCountFactory = _stockCountFactory_;
    scope = $rootScope.$new();
    stockCount = stockData;
  }));

  it('should expose a load method aliased as "get"', function(){
    expect(stockCountFactory).toBeDefined();
  });

  it('should contain the name of a function', function(){
    expect(stockCountFactory.get.allStockCount).toBeDefined();
  });

  it('should return Month object', function(){
    expect(stockCountFactory.monthList).toBeDefined();
  });

  it('should return 12 months', function(){
    var monthsCount = Object.keys(stockCountFactory.monthList).length;
    expect(monthsCount).toBeDefined(12);
  });

  it('should return the first month in the object', function(){
    expect(stockCountFactory.monthList['01']).toEqual('January');
  });

  it('should confirm validate object exist', function(){
    expect(stockCountFactory.validate).toBeDefined();
  });

  it('it should return true if variable is empty (""), undefined, not a number or is negative', function(){
    expect(stockCountFactory.validate.invalid(-20)).toBeTruthy();
  });
});