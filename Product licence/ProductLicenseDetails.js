"use strict";
angular.module('plApp', [])
    .controller('ngoProductLicesnseController', ['ngoPLService', 'commonPLService', function (ngoPLService, commonPLService) {
        var vm = this;
        vm.isRegistered = false;
        vm.productKey = null;
        vm.buttonCaption = 'Save';
        var licenseDetails = {};

        ngoPLService.getLicenseDetails().then(function (res) {
            licenseDetails = res.data.value;
            if (licenseDetails.length != 0) {
                vm.buttonCaption = 'Update';
                vm.productKey = licenseDetails[0].new_name
                vm.isRegistered = true;
            }
        });

        vm.saveLicenseDetails = function () {
            if (vm.productKey !== null) {
                var productLicense = {
                    new_name: vm.productKey,
                }
                if (vm.isRegistered) {
                    ngoPLService.updateLicenseDetails(licenseDetails[0].new_productlicenseid, productLicense).then(function (res) {
                        console.log('Record Updated');
                    })
                }
                else {
                    ngoPLService.createLicenseDetails(productLicense).then(function (res) {
                        console.log('Record Created');
                    })
                }
            }
        }

    }]).factory('ngoPLService', function ($http, commonPLService) {
        return {
            getLicenseDetails: function () {
                return $http({
                    method: 'GET',
                    url: commonPLService.serverURL + '/api/data/v8.0/new_productlicenses'
                });
            },
            createLicenseDetails: function (licenseKey) {
                return $http({
                    method: 'POST',
                    url: commonPLService.serverURL + '/api/data/v8.0/new_productlicenses',
                    data: licenseKey
                });
            },
            updateLicenseDetails: function (recordID, licenseKey) {
                return $http({
                    method: 'PATCH',
                    url: commonPLService.serverURL + '/api/data/v8.0/new_productlicenses(' + recordID + ')',
                    data: licenseKey
                });
            }
        };
    }).factory('httpRequestInterceptor', function () {
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
    }).service('commonPLService', function () {
        this.serverURL = window.parent.Xrm.Page.context.getClientUrl();
    });
