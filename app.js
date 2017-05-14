(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', foundItemsDirective);


function foundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      found: '<',
      removeItem: '&'
    },
    controller: foundItemsDirectiveController,
    controllerAs: 'foundItems',
    bindToController: true
  };

  return ddo;
}


function foundItemsDirectiveController() {
  var foundItems = this;
  console.log(foundItems);

}


NarrowItDownController.$inject = ['MenuSearchService', '$scope'];
function NarrowItDownController(MenuSearchService, $scope){
  var narrowCtrl = this;

  narrowCtrl.narrowItems = function(searchTerm){
    var promise = MenuSearchService.getMatchedMenuItems($scope.searchTerm);
     promise.then(function(found){

       narrowCtrl.found = found;
     });
  };

  narrowCtrl.removeItem = function(index){
    MenuSearchService.removeItem(index);
  };

  narrowCtrl.listEmpty = function(){
    return MenuSearchService.listEmpty();
  };

}

MenuSearchService.$inject = ['$http']
function MenuSearchService($http){
  var service = this;

  var found;

  service.getMatchedMenuItems = function(searchTerm){

    return $http(
      {
        method: 'GET',
        url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
      }
    ).then(function (result) {
      // process result and only keep items that match
      var res = result.data.menu_items;

      found = [];
      if(searchTerm !== ""){
        for (var i = 0; i < res.length; i++) {
          if(res[i].description.indexOf(searchTerm)  !== -1){
            found.push(res[i]);
          }
        }
      }

      // return processed items
      return found;
    });
  };

  service.removeItem = function (itemIndex) {
    found.splice(itemIndex, 1);
  };

  service.listEmpty = function(){
    if(found){
      return found.length === 0;
    }
    return false;
  }
}

})();
