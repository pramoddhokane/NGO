'use strict';

angular.module('fileUpload', [])
    .controller('upload', ['$scope', function ($scope) {
        var imageBase64 = window.parent.Xrm.Page.getAttribute("new_imagebasefile").getValue();
        if (imageBase64) {
            $scope.filepreview = imageBase64;
        }

        $scope.fileVerify = function (event) {
            var image = event.files[0];
            var fileExt = image.name.match(/\.(.+)$/)[1];
            if (angular.lowercase(fileExt) === 'jpg' || angular.lowercase(fileExt) === 'jpeg' || angular.lowercase(fileExt) === 'png') {
                if (image.size <= 1232896) {
                    var fr = new FileReader;
                    fr.onload = function () {
                        $scope.filepreview = this.result;
                        window.parent.Xrm.Page.getAttribute("new_imagebasefile").setValue(this.result);
                        $scope.$apply();
                    };
                    fr.readAsDataURL(image);
                }
                else {
                    alert('Image Size shoulb be less than 1 MB');
                    $scope.$apply();
                }
            }
            else {
                alert('Invalid Image File');
                $scope.$apply();
            }
        };
    }]);