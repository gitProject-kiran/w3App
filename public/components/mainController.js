function mainCtr($scope, $yelpData, $fourSquareData, $stateParams, $state, $mdDialog) {
    $scope.zoom  = $stateParams.zoom;
    $stateParams.zoom =  $stateParams.zoom == 2 ? 2 : $stateParams.zoom;
    $state.transitionTo('home', $stateParams);

    /*take all data in location array*/
    $scope.locationData = [];

    if (!_.isUndefined($yelpData) && $yelpData != 0 ) {

        $scope.yelpData = $scope.yelpData =  $yelpData.businesses;

        for (var i = 0; i < $scope.yelpData.length; i++) {

            $scope.locationData.push({

                'lat': $scope.yelpData[i].location.coordinate.latitude,

                'lon': $scope.yelpData[i].location.coordinate.longitude,

                'name': $scope.yelpData[i].name,

                'image_url': $scope.yelpData[i].image_url,

                'rating_img_url': $scope.yelpData[i].rating_img_url,

                'display_phone': $scope.yelpData[i].display_phone,

                'address': $scope.yelpData[i].location.address[0],

                'rating': $scope.yelpData[i].rating,

                'city': $scope.yelpData[i].location.city,

                'url': $scope.yelpData[i].url,

                'reviewCount': $scope.yelpData[i].review_count
            });
        }
    }

    $scope.fourSquareData = $fourSquareData;
    if ($scope.fourSquareData != -1 && !_.isUndefined($scope.fourSquareData)) {

        for (var j = 0; j < $scope.fourSquareData.length; j++) {

            var image_url;
            if ($scope.fourSquareData[j].photos.groups.length > 0) {
                image_url = $scope.fourSquareData[j].photos.groups[0].items[0].prefix + '100' +
                    $scope.fourSquareData[j].photos.groups[0].items[0].suffix;
            }

            $scope.locationData.push({

                'lat': $scope.fourSquareData[j].location.lat,

                'lon': $scope.fourSquareData[j].location.lng,

                'name': $scope.fourSquareData[j].name,

                'image_url': image_url ? image_url :
                'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ94U_e8B-nu42tMngTIX526a0' +
                'biDiD8WMufg4_V22apgBJRR3v',

                'rating_img_url': 'http://petfishshops.weebly.com/uploads/5/6/3/1/5631004/__8111485.png?1327562675',

                'display_phone': $scope.fourSquareData[j].contact.formattedPhone ?
                    $scope.fourSquareData[j].contact.formattedPhone : 'Not Available',

                'address': $scope.fourSquareData[j].location.address,

                'rating': $scope.fourSquareData[j].rating,

                'city': $scope.fourSquareData[j].location.city,

                'url': $scope.fourSquareData[j].url,

                'reviewCount': $scope.fourSquareData[j].ratingSignals
            });
        }
    }

    //get the unique data 
    var uniqueData = _.uniq($scope.locationData, 'name');

    //get only 25 data from list
    $scope.allInfo = _.take(uniqueData, 25);

    $scope.showCity = function (event, index) {
        $scope.address = $scope.locationData[index].address;

        $scope.name = $scope.locationData[index].name;

        $scope.rating = $scope.locationData[index].rating;

        $scope.map.showInfoWindow('myInfoWindow', this);

    };

    $scope.removeMarker = function () {
        $scope.map.hideInfoWindow('myInfoWindow', this);
    };

    $scope.submit = function () {

        /*validation of city data is empty or not*/
        if(_.isUndefined($scope.cityName) || _.isUndefined($scope.type)){
            return;
        }
        $stateParams.index++;

        $stateParams.zoom = 14;

        $stateParams.name = $scope.cityName;

        $stateParams.term = $scope.type;

        $state.transitionTo('home', $stateParams);
    };

    $scope.showInfo = function ($index) {
        $scope.moreInfo = $scope.locationData[$index];
    };

    /*Detail information of bussiness*/
    $scope.showCustom = function (index) {
        var lat = $scope.locationData[index].lat;
        var lon = $scope.locationData[index].lon;
        $mdDialog.show({
            clickOutsideToClose: true,
            scope: $scope,
            preserveScope: true,
            template: '<md-dialog>' +
            '<md-dialog-content><img width="100%" ng-src="https://maps.googleapis.com/maps/api/' +
            'staticmap?center=' + lat + ',' + lon + '&zoom=13&size=300x150&markers=color:blue' +
            '%7C' + lat + ',' + lon + '&key=AIzaSyB9XQwIPT_8TJjR1IFjMnNXCGxYkumQCiA"/>' +
            '<img class="img-icon" ng-src="' + $scope.locationData[index].image_url + '"/>' +
            '<h3 style="color:black;font-weight:bold;">' + $scope.locationData[index].name + '</h3>' +
            '<p>Address :' + $scope.locationData[index].address + ' </p>' +
            '<p>Phone No : ' + $scope.locationData[index].display_phone + ' </p>' +
            '<p> Rating : ' + $scope.locationData[index].rating + ' </p>' +
            '<p> Review count : ' + $scope.locationData[index].reviewCount + ' </p>' +
            '<a href=' + $scope.locationData[index].url + ' target="_blank">Bussiness url :' +
            $scope.locationData[index].name + ' </a>' +
            '</md-dialog-content>' +
            '</md-dialog>',
            controller: function DialogController($scope, $mdDialog) {
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };
            }
        });
    };

    /*for mobile phones*/
    $scope.showDefaultAndMobile = function (index) {
        $mdDialog.show({
            clickOutsideToClose: false,
            scope: $scope,
            preserveScope: true,
            template: '<md-dialog>' +
            '<md-dialog-content style="margin-top: 20px;color: steelblue;">' +
            '<label style="font-size:25px;margin-left:25px;">Who-What-Where</label>' +
            '<md-input-container flex="80" style="margin-left:25px;"><label>Search city here</label>' +
            '<input min="1" max="5" type="text" ng-model="cityName"/>' +
            '</md-input-container>' +
            '<md-input-container flex="80" style="margin-left:25px;"><label>Search term here</label>' +
            '<input min="1" max="5" type="text" ng-model="type"/>' +
            '</md-input-container>' +
            '<md-button style="margin-left:70px;" ng-click="submit()">' +
            '<label>Submit</label></md-button></md-dialog-content>' +
            '</md-dialog>',
            controller: function DialogController($scope, $mdDialog) {
                $scope.closeDialog = function () {
                    console.log('controller');
                    $mdDialog.show();
                }
            }
        });
    };

}
module.exports = mainCtr;