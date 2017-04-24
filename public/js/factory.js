
myApp.factory('dataFactory', function($http, myConfig) {
  /** https://docs.angularjs.org/guide/providers **/
  var urlBase = myConfig.url + '/api/v1/products';
  var _prodFactory = {};

  _prodFactory.getProducts = function() {
    return $http.get(urlBase);
  }; 

  return _prodFactory;
});

