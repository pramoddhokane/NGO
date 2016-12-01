"use strict";
angular.module('spApp', ['dataGrid', 'pagination', 'ngMaterial'])
    .controller('spEventController', ['$scope', 'ngoSPEventService', 'CommonSPService', function ($scope, ngoSPEventService, CommonSPService) {
        var eventActivityDetails = {};
        var querystring;
        var nonEmptyVoluteers = [];

        $scope.allApprovedProviders;
        $scope.sameServices;
        $scope.sameGoods;
        $scope.allServices;
        $scope.allGoods;
        $scope.globalData = {};
        $scope.globalData.filteredData = [];
        $scope.gridOptions = {
            data: [],
            urlSync: false
        };

        ngoSPEventService.getEventActivityDetails().then(function (response) {
            $scope.sameServices = false;
            $scope.sameGoods = false;
            eventActivityDetails = response.data;
            $scope.globalData.event = eventActivityDetails;
            ngoSPEventService.getGoodsAndServiceDetails().then(function (goodsServiceResponse) {
                $scope.globalData.GoodsAndServices = goodsServiceResponse.data.value;
                ngoSPEventService.getGoodsAndServiceDetails().then(function (goodsServices) {
                    $scope.globalData.goodsServicesDetails = goodsServices.data.value;
                })
                $scope.getAllServiceProviders();
            });
        });
        $scope.getAllServiceProviders = function () {
            ngoSPEventService.getserviceProvidersDetails('').then(function (allserviceProviders) {
                $scope.globalData.allserviceProviders = allserviceProviders.data.value;
                $scope.allApprovedServiceProviders();
            });
        };

        $scope.allApprovedServiceProviders = function () {
            $scope.globalData.approvedServiceProviders = [];
            _.forEach($scope.globalData.allserviceProviders, function (sp) {
                if (sp.new_serviceproviderstatus == 100000002) {
                    $scope.globalData.approvedServiceProviders.push(sp);
                }
            })
            $scope.appendDataToTable($scope.globalData.allserviceProviders);
        }

        $scope.displayApproved = function (spStatus, isServices, isGoods) {
            if (spStatus) {
                if (isServices && isGoods === false) {
                    $scope.getSelectedSProviders($scope.allServices, true);
                }
                else if (isServices === false && isGoods) {
                    $scope.getSelectedSProviders($scope.allGoods, true);
                }
                else {
                    $scope.appendDataToTable($scope.globalData.approvedServiceProviders);
                }
            }
            else {
                if (isServices && isGoods === false) {
                    $scope.getSelectedSProviders($scope.allServices, false);
                }
                else if (isServices === false && isGoods) {
                    $scope.getSelectedSProviders($scope.allGoods, false);
                }
                else {
                    $scope.appendDataToTable($scope.globalData.allserviceProviders);
                }
            }
        };

        $scope.getSelectedSProviders = function (gsid, approved) {
            var fetch = '';
            $scope.allServices = gsid;
            if (gsid) {
                fetch = '$filter=_new_nameofservice_value eq ' + gsid;
            }
            ngoSPEventService.getserviceProviders(fetch).then(function (res) {
                var filteredArray = res.data.value;
                var queryValues = '';
                for (var vol = 0; vol < filteredArray.length; vol++) {
                    queryValues += '<value>{' + filteredArray[vol]._new_serviceprovider_value + '}</value>';
                }
                $scope.getServiceProvidersinfo(queryValues, approved);
            })
        };

        $scope.getSelectedGProviders = function (gsid, approved) {
            $scope.allServices = gsid;
            var queryString = '';
            if (gsid) {
                queryString = '$filter=_new_nameofgoodscommodity_value eq ' + gsid;
            }
            ngoSPEventService.getGoodsProviders(queryString).then(function (res) {
                var filteredArray = res.data.value;
                var queryValues = '';
                for (var vol = 0; vol < filteredArray.length; vol++) {
                    queryValues += '<value>{' + filteredArray[vol]._new_providername_value + '}</value>';
                }
                $scope.getServiceProvidersinfo(queryValues, approved)
            })
        };

        $scope.getServiceProvidersinfo = function (queryValues, approved) {
            if (queryValues !== '') {
                var queryString = CommonSPService.getserviceProviders(queryValues, 'in', '');
                if (approved) {
                    queryString = CommonSPService.getserviceProviders(queryValues, 'in', 100000002);
                }
                ngoSPEventService.getserviceProvidersDetails(queryString).then(function (SPDetails) {
                    $scope.globalData.filteredData = [];
                    $scope.globalData.filteredData = SPDetails.data.value;
                    $scope.appendDataToTable($scope.globalData.filteredData);
                });
            }
        }

        $scope.assignServiceProviders = function (event, serviceProvider) {
            if (event) {
                var spDetails = {
                    'new_providertype': serviceProvider.new_providertype,
                    'new_name': serviceProvider.new_serviceprovider1,
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

        $scope.appendDataToTable = function (filteredData) {
            var queryString = '$filter=_new_campactivityname_value eq ' + $scope.globalData.event.new_eventactivityid + ' and new_serviceproviderstatus eq 2';
            ngoSPEventService.getAssignserviceProviders(queryString).then(function (existingSp) {
                var spDetails = existingSp.data.value;
                $scope.globalData.existingSP = [];
                var sp_table = [];
                _.forEach(filteredData, function (selectedProvider) {
                    selectedProvider.toAdd = 1;
                    _.forEach(spDetails, function (spDetails) {
                        if (selectedProvider.new_serviceproviderid === spDetails._new_serviceproviderid_value) {
                            selectedProvider.toAdd = 0;
                            sp_table.push({
                                'new_name': selectedProvider.new_name,
                                'new_serviceprovider1': selectedProvider.new_serviceprovider1,
                                'status': true,
                                'new_city': selectedProvider.new_city,
                                'new_serviceproviderid': selectedProvider.new_serviceproviderid,
                                'new_providertype': selectedProvider.new_providertype
                            });
                        }
                    });
                });

                _.forEach(filteredData, function (selectedProvider) {
                    if (selectedProvider.toAdd == 1) {
                        sp_table.push({
                            'new_name': selectedProvider.new_name,
                            'new_serviceprovider1': selectedProvider.new_serviceprovider1,
                            'status': false,
                            'new_city': selectedProvider.new_city,
                            'new_serviceproviderid': selectedProvider.new_serviceproviderid,
                            'new_providertype': selectedProvider.new_providertype
                        });
                    }
                });
                //      console.log($scope.globalData)
                if (sp_table.length !== 0) {
                    $scope.gridOptions.data = sp_table;
                }
                else {
                    this._gridOptions.data = [];
                }
            });
        };

        $scope.hideGoods = function (event) {
            if (event) {
                this.sameGoods = false;
                this.allGoods = null;
            }
        };

        $scope.hideServices = function (event) {
            if (event) {
                this.sameServices = false;
                this.allServices = null;
            }
        };

    }]).factory('ngoSPEventService', function ($http, CommonSPService) {
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
            },
            getGoodsAndServiceDetails: function () {
                return $http({
                    method: 'GET',
                    url: CommonSPService.serverURL + '/api/data/v8.0/new_goods_serviceses'
                });
            },
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
            var conditionAttr = '';
            if (status !== '') {
                conditionAttr = '<condition attribute="new_serviceproviderstatus" operator="eq" value="' + status + '" />';
            }
            return 'fetchXml=<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
                '<entity name="new_serviceprovider">' +
                '<order attribute="new_name" descending="false" />' +
                '<filter type="and">' +
                '<condition attribute="new_serviceproviderid" operator="' + operator + '">' + queryValues +
                '</condition>' + conditionAttr +
                '</filter>' +
                '</entity>' +
                '</fetch>';
        };
        this.getGoodsServiceDetails = function (queryValues) {
            return 'fetchXml=<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
                '<entity name="new_goods_services">' +
                '<order attribute="new_name" descending="false" />' +
                '<filter type="and">' +
                '<condition attribute="new_goods_servicesid" operator="in">' + queryValues +
                '</condition>' +
                '</filter>' +
                '</entity>' +
                '</fetch>';
        };
    });
