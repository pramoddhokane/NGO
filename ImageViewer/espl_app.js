'use strict';
angular.module('APP', ['ngAnimate', 'ngTouch','naif.base64'])
.controller('MainCtrl', ['$scope','$http','$window', '$rootScope','CommonService', function ($scope,$http,$window, $rootScope,CommonService) {
// Set of Photos
$scope.photos = [];
// initial image index

$scope._Index = 0;
// if a current image is the same as requested image
$scope.isActive = function (index) {
     return $scope._Index === index;
};
// show prev image
$scope.showPrev = function () {
     $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
};
// show next image
$scope.showNext = function () {
     $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
};
// show a certain image
$scope.showPhoto = function (index) {
     $scope._Index = index;
};

//GET IMAGE PATH FORM SHAREPOINT DOCUMENT LOCATION

$scope.getImages = function(){
//var testst=CommonService.serverURL + '/api/data/v8.1/annotations?$filter=mimetype eq ' + "'image/jpeg'" +' and  _objectid_value eq ' + CommonService.recordId;
    return $http({
                    method: 'GET',
                    url: CommonService.serverURL + '/api/data/v8.1/annotations?$filter=_objectid_value eq ' + CommonService.recordId 
                }).then(function(response)
                {
                   $scope.photos = response.data.value;                 
                });
};


$scope.getImages();

$scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
    $scope.base64text = fileObj.base64;
    $scope.imageFileName = fileObj.filename;
  };
  
  
$scope.uploadImages = function(){
     
     
     var annnotationdata = ({
                'filename'  : $scope.imageFileName,
                'documentbody' : $scope.base64text,
                'objectid_new_beneficiary@odata.bind' : '/new_beneficiaries('+CommonService.recordId+')',
                'mimetype' : 'image/png',
                'notetext' : $scope.notetext
            });

     $http({
               method: 'POST',
               url: CommonService.serverURL + '/api/data/v8.1/annotations',
               data: annnotationdata
           }).then(
       function(response){
         // success callback
         $scope.getImages();
       }, 
       function(response){
         // failure callback
       }
    );
               
	
};
}]).factory('httpRequestInterceptor', function () {
        return {
            request: function (config) {
                config.headers['Accept'] = 'application/json';
                config.headers['Content-Type'] = 'application/json; charset=utf-8';
                config.headers['OData-MaxVersion'] = '4.0';
                config.headers['Prefer'] = 'odata.include-annotations="*"';
                config.headers['OData-Version'] = '4.0';
                return config;
            }
        };
}).config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpRequestInterceptor');
}).service('CommonService', function () {
        this.recordId = (window.parent.Xrm.Page.data.entity.getId()).replace('{', '').replace('}', '');
        this.serverURL = window.parent.Xrm.Page.context.getClientUrl();
});

