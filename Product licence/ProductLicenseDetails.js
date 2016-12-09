"use strict";
angular.module('plApp', [])
    .controller('ngoProductLicesnseController', ['ngoPLService', 'commonPLService', '$filter', function (ngoPLService, commonPLService, $filter) {
        var vm = this;
        var secretKey = 'espl@123';
        var licenseDetails = {};
        var gracePeriod = 25;
        var licenses = 32;
        vm.isRegistered = false;
        vm.productKey = null;
        vm.buttonCaption = 'Save';

        ngoPLService.getLicenseDetails().then(function (res) {
            licenseDetails = res.data.value;
            if (licenseDetails.length != 0) {
                vm.buttonCaption = 'Update';
                var licensedKey = CryptoJS.AES.decrypt(licenseDetails[0].new_name, secretKey);
                vm.productDecKey = licensedKey.toString(CryptoJS.enc.Utf8);
                var licDetails = vm.productDecKey.split('|')
                if (licDetails.length == 5) {
                    vm.productKey = licDetails[0];
                    vm.startDate = licDetails[1];
                    vm.endDate = licDetails[2];
                    vm.gracePeriod = licDetails[3];
                    vm.licenses = licDetails[4];
                }
                vm.isRegistered = true;
            }
        });

        vm.saveLicenseDetails = function () {
            if (vm.productKey !== null && vm.productKey !== undefined) {
                //ProductKey/Start Date / End Date / Grace Period/ License
                vm.productEncKey = vm.productKey + '|' + $filter('date')(new Date(), 'dd/MM/yyyy') + '|' + $filter('date')(new Date(), 'dd/MM/yyyy') + '|' + gracePeriod + '|' + licenses;
                var encrypted = CryptoJS.AES.encrypt(vm.productEncKey, secretKey).toString();
                var productLicense = {
                    new_name: encrypted,
                    new_productkey: vm.productKey,
                    new_userlicenses: licenses,
                    new_startdate: new Date(),
                    new_enddate: new Date(),
                    new_graceperiod: gracePeriod
                };
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
