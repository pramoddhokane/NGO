"use strict";
angular.module('myApp', ['dataGrid', 'pagination', 'ngMaterial'])
    .controller('myAppController', ['myAppFactory', 'common', function (myAppFactory, common) {
        var vm = this;
        vm.gridOptions = {
            data: [],
            urlSync: false
        };       
      
       myAppFactory.getEventActivityDetails().then(function (responseData) {
              console.log(responseData);
            //  $scope.gridOptions.data = responseData.data;
       });
    }])
    .factory('myAppFactory', function ($http, common) {
        return {
            getSkillSets: function () {
                return $http({
                    method: 'GET',
                    url: window.parent.Xrm.Page.context.getClientUrl() + '/api/data/v8.0/new_eventactivities'
                });
            },

            getEventActivityDetails: function () {
                return $http({
                    method: 'GET',
                    url: window.parent.Xrm.Page.context.getClientUrl() + '/api/data/v8.0/new_eventactivities(' + common.recordId + ')'
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
    }).service('common', function () {
        this.recordId = (window.parent.Xrm.Page.data.entity.getId()).replace('{','').replace('}','');

        this.serverURL = function () {
            return window.parent.Xrm.Page.context.getClientUrl();
        };
    });
