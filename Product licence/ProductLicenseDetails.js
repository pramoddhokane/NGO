"use strict";
angular.module('plApp', [])
    .controller('ngoProductLicesnseController', ['ngoPLService', 'commonPLService', '$filter', function (ngoPLService, commonPLService, $filter) {
        var vm = this;
        var secretKey = 'espl@123';
        var licenseDetails = {};
        var gracePeriod = 25;
        var licenses = 32;
        var productLicense;
        vm.isRegistered = false;
        vm.productKey = null;
        vm.show_Err = false;
        vm.buttonCaption = 'Save';

        ngoPLService.getLicenseDetails().then(function (res) {
            licenseDetails = res.data.value;
            if (licenseDetails.length != 0) {
                vm.buttonCaption = 'Update';
                var licensedKey = CryptoJS.AES.decrypt(licenseDetails[0].new_name, secretKey);
                vm.productDecKey = licensedKey.toString(CryptoJS.enc.Utf8);
                var licDetails = vm.productDecKey.split('|')
                if (licDetails.length == 5) {
                    vm.productKey = licenseDetails[0].new_name;
                    vm.startDate = new Date(licDetails[1]);
                    vm.endDate = new Date(licDetails[2]);
                    vm.gracePeriod = licDetails[3];
                    vm.licenses = licDetails[4];
                }
                vm.isRegistered = true;
            }
        });

        vm.saveLicenseDetails = function () {
            if (vm.productKey !== null && vm.productKey !== undefined) {
                //ProductKey/Start Date / End Date / Grace Period/ License
                //Date Format (yy,mm,dd)
                //   vm.productEncKey = vm.productKey + '|' + $filter('date')(new Date(), 'dd/MM/yyyy') + '|' + $filter('date')(new Date(), 'dd/MM/yyyy') + '|' + gracePeriod + '|' + licenses;
                // var encrypted = CryptoJS.AES.encrypt(vm.productEncKey, secretKey).toString();
                var licensedKey = CryptoJS.AES.decrypt(vm.productKey, secretKey);
                vm.productDecKey = licensedKey.toString(CryptoJS.enc.Utf8);
                if (vm.productDecKey !== '') {
                    var licDetails = vm.productDecKey.split('|')
                    productLicense = {
                        new_name: vm.productKey,
                        new_productkey: licDetails[0],
                        new_userlicenses: licDetails[4],
                        new_startdate: new Date(licDetails[1]),
                        new_enddate: new Date(licDetails[2]),
                        new_graceperiod: licDetails[3]
                    };
                    if (vm.isRegistered) {
                        ngoPLService.updateLicenseDetails(licenseDetails[0].new_productlicenseid, productLicense).then(function (res) {
                            vm.licenses = productLicense.new_userlicenses;
                            vm.startDate = productLicense.new_startdate;
                            vm.endDate = productLicense.new_enddate;
                            vm.show_Err = false;
                        })
                    }
                    else {
                        ngoPLService.createLicenseDetails(productLicense).then(function (res) {
                            vm.show_Err = false;
                            console.log('Record Created');
                        })
                    }
                }
                else {
                    vm.show_Err = true;
                }
            }
        }
        vm.removeMessage = function () {
            vm.show_Err = false;
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