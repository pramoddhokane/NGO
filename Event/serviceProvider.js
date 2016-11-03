"use strict";
angular.module('spApp', ['dataGrid', 'pagination', 'ngMaterial'])
    .controller('spEventController', ['$scope', 'ngoSPEventService', 'CommonSPService', function ($scope, ngoSPEventService, CommonSPService) {
        var eventActivityDetails = {};
        var querystring;
        var nonEmptyVoluteers = [];

        $scope.allApprovedProviders = false;
        $scope.sameServices = false;
        $scope.sameGoods = false;
        $scope.globalData = {}
        $scope.gridOptions = {
            data: [],
            urlSync: false
        };

        ngoSPEventService.getEventActivityDetails().then(function (response) {
            eventActivityDetails = response.data;
            $scope.globalData.event = eventActivityDetails;
            ngoSPEventService.getGoodsandServices().then(function (goodsServiceResponse) {
                $scope.globalData.goodsServices = goodsServiceResponse.data.value;
                $scope.getGoodsProviders();
            });
        });

        $scope.getGoodsProviders = function () {
            var queryValues = '';
            for (var vol = 0; vol < $scope.globalData.goodsServices.length; vol++) {
                queryValues += '<value>{' + $scope.globalData.goodsServices[vol].new_goods_servicesid + '}</value>';
            }
            if (queryValues !== '') {
                var queryString = CommonSPService.allGoodsProviders(queryValues, 'in');
                ngoSPEventService.getGoodsProviders(queryString).then(function (goodsProvidersResponse) {
                    var goodsProviders = goodsProvidersResponse.data.value;
                    $scope.globalData.goodsProviders = [];
                    for (var volunteer = 0; volunteer < goodsProviders.length; volunteer++) {
                        $scope.globalData.goodsProviders.push(goodsProviders[volunteer]._new_providername_value);
                    }
                    $scope.getserviceProviders();
                });
            }
        }

        $scope.getserviceProviders = function () {
            var queryValues = '';
            for (var vol = 0; vol < $scope.globalData.goodsServices.length; vol++) {
                queryValues += '<value>{' + $scope.globalData.goodsServices[vol].new_goods_servicesid + '}</value>';
            }
            if (queryValues !== '') {
                var queryString = CommonSPService.allserviceProviders(queryValues, 'in');
                ngoSPEventService.getserviceProviders(queryString).then(function (serviceProvidersResponse) {
                    var serviceProviders = serviceProvidersResponse.data.value;
                    $scope.globalData.serviceProviders = [];
                    for (var volunteer = 0; volunteer < serviceProviders.length; volunteer++) {
                        $scope.globalData.serviceProviders.push(serviceProviders[volunteer]._new_serviceprovider_value);
                    }
                    $scope.getNonserviceProviders();
                });
            }
        }

        $scope.getNonserviceProviders = function () {
            var queryValues = '';
            for (var vol = 0; vol < $scope.globalData.serviceProviders.length; vol++) {
                queryValues += '<value>{' + $scope.globalData.serviceProviders[vol] + '}</value>';
            }
            if (queryValues !== '') {
                var queryString = CommonSPService.allserviceProviders(queryValues, 'not-in');
                ngoSPEventService.getserviceProviders(queryString).then(function (nonServiceProvidersResponse) {
                    var nonServiceProviders = nonServiceProvidersResponse.data.value;
                    $scope.globalData.nonServiceProviders = [];
                    for (var volunteer = 0; volunteer < nonServiceProviders.length; volunteer++) {
                        $scope.globalData.nonServiceProviders.push(nonServiceProviders[volunteer]._new_serviceprovider_value);
                    }
                    $scope.getNonGoodsProviders();
                });
            }
        }

        $scope.getNonGoodsProviders = function () {
            var queryValues = '';
            for (var vol = 0; vol < $scope.globalData.goodsProviders.length; vol++) {
                queryValues += '<value>{' + $scope.globalData.goodsProviders[vol] + '}</value>';
            }
            if (queryValues !== '') {
                var queryString = CommonSPService.allGoodsProviders(queryValues, 'not-in');
                ngoSPEventService.getGoodsProviders(queryString).then(function (nonGoodsProvidersResponse) {
                    var nonGoodsProviders = nonGoodsProvidersResponse.data.value;
                    $scope.globalData.nonGoodsProviders = [];
                    for (var volunteer = 0; volunteer < nonGoodsProviders.length; volunteer++) {
                        $scope.globalData.nonGoodsProviders.push(nonGoodsProviders[volunteer]._new_providername_value);
                    }
                    $scope.preSelectedSP();
                });
            }
        };

        $scope.getFilteredProviders = function (array1, array2, operator, status) {
            var filteredArray = _.union(array1, array2);
            var queryValues = '';
            for (var vol = 0; vol < filteredArray.length; vol++) {
                queryValues += '<value>{' + filteredArray[vol] + '}</value>';
            }
            if (queryValues !== '') {
                var queryString = CommonSPService.getserviceProviders(queryValues, operator, status);
                ngoSPEventService.getserviceProvidersDetails(queryString).then(function (nonMatchingResponse) {
                    $scope.gridOptions.data = nonMatchingResponse.data.value;
                    console.log($scope.globalData);
                });
            }
        };
        $scope.preSelectedSP = function () {
            $scope.getFilteredProviders($scope.globalData.nonGoodsProviders, $scope.globalData.nonServiceProviders, 'in', 100000000)
        }

        $scope.validateProvidersDetails = function (approved, service, goods) {
            if (approved === true && service === true && goods === true) {
                $scope.getFilteredProviders($scope.globalData.goodsProviders, $scope.globalData.serviceProviders, 'in', 100000002);
            }
            else if (approved === true && service === true && goods === false) {
                $scope.getFilteredProviders($scope.globalData.nonGoodsProviders, $scope.globalData.serviceProviders, 'in', 100000002);
            }
            else if (approved === true && service === false && goods === true) {
                $scope.getFilteredProviders($scope.globalData.nonServiceProviders, $scope.globalData.goodsProviders, 'in', 100000002);
            }
            else if (approved === true && service === false && goods === false) {
                var queryString = '$filter=new_serviceproviderstatus eq 100000002';
                ngoSPEventService.getserviceProvidersDetails(queryString).then(function (approvedProviders) {
                    $scope.gridOptions.data = approvedProviders.data.value;
                });
            }
            else if (approved === false && service === true && goods === false) {
                $scope.getFilteredProviders($scope.globalData.nonGoodsProviders, $scope.globalData.serviceProviders, 'in', 100000000);
            }
            else if (approved === false && service === false && goods === true) {
                $scope.getFilteredProviders($scope.globalData.nonServiceProviders, $scope.globalData.goodsProviders, 'in', 100000000);
            }
            else if (approved === false && service === true && goods === true) {
                $scope.getFilteredProviders($scope.globalData.goodsProviders, $scope.globalData.serviceProviders, 'in', 100000002);
            }
            else if (approved === false && service === false && goods === false) {
                $scope.preSelectedSP();
            }
        };
        $scope.assignServiceProviders = function (event, serviceProvider) {
            if (event) {
                var spDetails = {
                    'new_providertype': serviceProvider.new_providertype,
                    'new_name': serviceProvider['_new_associatedorganization_value@OData.Community.Display.V1.FormattedValue'],
                    'new_serviceproviderstatus': 2,
                    'new_CampActivityName@odata.bind': '/new_eventactivities(' + $scope.globalData.event.new_eventactivityid + ')',
                    'new_ServiceProviderid@odata.bind': '/new_serviceproviders(' + serviceProvider.new_serviceproviderid + ')'
                };
                ngoSPEventService.assignserviceProviderstoEvent(spDetails).then(function (response) {
                    console.log(response);
                });
            }
            else {
                var queryString = '$filter=_new_serviceproviderid_value eq ' + serviceProvider.new_serviceproviderid + ' and _new_campactivityname_value eq ' + $scope.globalData.event.new_eventactivityid;
                ngoSPEventService.getAssignserviceProviders(queryString).then(function (spResponse) {
                    var spDetails = spResponse.data.value;
                    var recordId = spDetails[0].new_goodsandservicememberid;
                    ngoSPEventService.deleteAssignedServiceProviders(recordId).then(function (response) {
                        console.log('Delete');
                    });
                });
            }
        };
    }])
    .factory('ngoSPEventService', function ($http, CommonSPService) {
        return {
            getEventActivityDetails: function () {
                return $http({
                    method: 'GET',
                    url: CommonSPService.serverURL + '/api/data/v8.0/new_eventactivities(' + CommonSPService.recordId + ')'
                });
            },
            getGoodsandServices: function () {
                return $http({
                    method: 'GET',
                    url: CommonSPService.serverURL + '/api/data/v8.0/new_new_eventactivity_new_goods_servicesset?$filter=new_eventactivityid eq ' + CommonSPService.recordId
                });
            },
            getGoodsProviders: function (queryString) {
                return $http({
                    method: 'GET',
                    url: CommonSPService.serverURL + '/api/data/v8.0/new_goodses?' + queryString
                });
            },
            getserviceProviders: function (queryString) {
                return $http({
                    method: 'GET',
                    url: CommonSPService.serverURL + '/api/data/v8.0/new_services?' + queryString
                });
            },
            getserviceProvidersDetails: function (queryString) {
                return $http({
                    method: 'GET',
                    url: CommonSPService.serverURL + '/api/data/v8.0/new_serviceproviders?' + queryString
                });
            },
            assignserviceProviderstoEvent: function (serviceProvider) {
                return $http({
                    method: 'POST',
                    url: CommonSPService.serverURL + '/api/data/v8.0/new_goodsandservicemembers',
                    data: serviceProvider
                });
            },
            getAssignserviceProviders: function (queryString) {
                return $http({
                    method: 'GET',
                    url: CommonSPService.serverURL + '/api/data/v8.0/new_goodsandservicemembers?' + queryString

                });
            },
            deleteAssignedServiceProviders: function (recordID) {
                return $http({
                    method: 'DELETE',
                    url: CommonSPService.serverURL + '/api/data/v8.0/new_goodsandservicemembers(' + recordID + ')'
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
    }).service('CommonSPService', function () {
        this.recordId = (window.parent.Xrm.Page.data.entity.getId()).replace('{', '').replace('}', '');

        this.serverURL = window.parent.Xrm.Page.context.getClientUrl();

        this.allGoodsProviders = function (queryValues, operator) {
            return 'fetchXml=<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
                '<entity name="new_goods">  ' +
                '<order attribute="new_units" descending="false" />' +
                '<filter type="and">' +
                '<condition attribute="new_nameofgoodscommodity" operator="' + operator + '">' + queryValues +
                '</condition>' +
                '</filter>' +
                '</entity>' +
                '</fetch>';
        };

        this.allserviceProviders = function (queryValues, operator) {
            return 'fetchXml=<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
                '<entity name="new_service">' +
                '<order attribute="new_name" descending="false" />' +
                '<filter type="and">' +
                '<condition attribute="new_nameofservice" operator="' + operator + '">' + queryValues +
                '</condition>' +
                '</filter>' +
                '</entity>' +
                '</fetch>';
        };

        this.getserviceProviders = function (queryValues, operator, status) {
            return 'fetchXml=<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
                '<entity name="new_serviceprovider">' +
                '<order attribute="new_name" descending="false" />' +
                '<filter type="and">' +
                '<condition attribute="new_serviceproviderid" operator="' + operator + '">' + queryValues +
                '</condition>' +
                '<condition attribute="new_serviceproviderstatus" operator="eq" value="' + status + '" />' +
                '</filter>' +
                '</entity>' +
                '</fetch>';
        };
    });
