'use strict';

angular.module('fileUpload', [])
    .controller('upload', ['$scope', function ($scope) {
        var imageBase64 = window.parent.Xrm.Page.getAttribute("new_imagebasefile").getValue();
        if (imageBase64) {
            $scope.fileinput = imageBase64;
            $scope.filepreview = imageBase64;
        }
        $scope.$watch('file', function (newfile, oldfile) {
            if (angular.equals(newfile, oldfile)) {
                return;
            }
            if (newfile.size <= 5242880) {
                var reader = new FileReader();
                reader.readAsDataURL(newfile);
                reader.onload = function () {
                    window.parent.Xrm.Page.getAttribute("new_imagebasefile").setValue(reader.result);
                    //console.log(reader.result);
                };
            }
        });

    }])
    .directive('fileinput', [function () {
        return {
            scope: {
                fileinput: '=',
                filepreview: '='
            },
            link: function (scope, element, attributes) {
                element.bind('change', function (changeEvent) {
                    scope.fileinput = changeEvent.target.files[0];
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.filepreview = loadEvent.target.result;
                        });
                    }
                    reader.readAsDataURL(scope.fileinput);
                });
            }
        }
    }]);