"use strict";
angular.module('app', ['dataGrid', 'pagination', 'ngMaterial'])
    .controller('EventController', ['$scope', 'ngoEventService', 'CommonService', function ($scope, ngoEventService, CommonService) {
        var eventActivityDetails = {};
        var querystring;
        var nonEmptyVoluteers = [];
        var approvedVol;
        var causeVol;
        var skillVol;
        $scope.globalData = {}
        $scope.gridOptions = {
            data: [],
            urlSync: false
        };
        ngoEventService.getEventActivityDetails().then(function (response) {
            $scope.globalData.causes = {};
            eventActivityDetails = response.data;
            $scope.globalData.event = eventActivityDetails;
            ngoEventService.getSkillSets().then(function (skillsetResponse) {
                $scope.globalData.skills = skillsetResponse.data.value;
                ngoEventService.getEventCause(eventActivityDetails._new_usedforcamp_value).then(function (causeDetails) {
                    $scope.globalData.causes.cause = causeDetails.data;
                    $scope.getVolunteerBySkills();
                });
            });
        });
        $scope.getVolunteerBySkills = function () {
            var skillAttribute = 'new_skillsetid';
            if ($scope.globalData.skills.length === 1) {
                querystring = skillAttribute + ' eq ' + $scope.globalData.skills[0].new_skillsetid;
            }
            else {
                for (var skill = 0; skill < $scope.globalData.skills.length; skill++) {
                    if (skill === 0) {
                        querystring = skillAttribute + ' eq ' + $scope.globalData.skills[skill].new_skillsetid;
                    }
                    else if (skill < $scope.globalData.skills.length) {
                        querystring += ' or ' + skillAttribute + ' eq ' + $scope.globalData.skills[skill].new_skillsetid;
                    }
                }
            }
            if ($scope.globalData.skills.length !== 0) {
                ngoEventService.getvolunteerBySkills(querystring).then(function (skilledVolunteer) {
                    var volunteers = skilledVolunteer.data.value;
                    $scope.globalData.skills.volunteers = [];
                    for (var volunteer = 0; volunteer < volunteers.length; volunteer++) {
                        $scope.globalData.skills.volunteers.push(volunteers[volunteer].new_volunteerid);
                    }
                    $scope.getvolunteersByCause();
                });
            }
            else {
                $scope.getvolunteersByCause();
            }
        }
        $scope.getvolunteersByCause = function () {
            var causeDetails = $scope.globalData.causes.cause;
            ngoEventService.getvolunteerByCause(causeDetails._new_cause_value).then(function (causedVolunteer) {
                var c_volunteers = causedVolunteer.data.value;
                $scope.globalData.causes.volunteers = [];
                for (var volunteer = 0; volunteer < c_volunteers.length; volunteer++) {
                    $scope.globalData.causes.volunteers.push(c_volunteers[volunteer].new_volunteerid);
                }
                $scope.getAllVolunteers();
            });
        }

        $scope.getAllVolunteers = function () {
            var queryValues = '';
            nonEmptyVoluteers = [];
            ngoEventService.getNonEmpty().then(function (nonEmptyVolunteer) {
                for (var vol = 0; vol < nonEmptyVolunteer.data.value.length; vol++) {
                    queryValues += '<value>{' + nonEmptyVolunteer.data.value[vol].new_volunteerid + '}</value>';
                }

                if (queryValues !== '') {
                    var queryString = CommonService.createQueryString(queryValues);
                    ngoEventService.getEmptyVolunteers(queryString).then(function (emptyVolunteers) {
                        var emptySkilledVolunteer = emptyVolunteers.data.value;
                        $scope.globalData.emptySkilledVolunteer = [];
                        for (var volunteer = 0; volunteer < emptySkilledVolunteer.length; volunteer++) {
                            $scope.globalData.emptySkilledVolunteer.push(emptySkilledVolunteer[volunteer].new_volunteerid);
                        }
                        $scope.getAllEmptyCauseVolunteers();
                    });
                }
            });
        }

        $scope.getAllEmptyCauseVolunteers = function () {
            var queryValues = '';
            nonEmptyVoluteers = [];
            ngoEventService.getNonEmptyCauseVolunteer().then(function (nonEmptyVolunteer) {
                for (var vol = 0; vol < nonEmptyVolunteer.data.value.length; vol++) {
                    queryValues += '<value>{' + nonEmptyVolunteer.data.value[vol].new_volunteerid + '}</value>';
                }

                if (queryValues !== '') {
                    var queryString = CommonService.createQueryString(queryValues);
                    ngoEventService.getEmptyVolunteers(queryString).then(function (emptyCauseVolunteers) {
                        var emptyCauseVolunteer = emptyCauseVolunteers.data.value;
                        $scope.globalData.emptyCauseVolunteers = [];
                        for (var volunteer = 0; volunteer < emptyCauseVolunteer.length; volunteer++) {
                            $scope.globalData.emptyCauseVolunteers.push(emptyCauseVolunteer[volunteer].new_volunteerid);
                        }
                        $scope.filteredVolunteers($scope.globalData);
                    });
                }
            });
        }
        $scope.filteredVolunteers = function (globalData) {
            var non_EmptyFil_Vol = [];
            non_EmptyFil_Vol = _.intersection(globalData.causes.volunteers, globalData.skills.volunteers);
            $scope.globalData.filteredVolunteer = _.union(non_EmptyFil_Vol, _.intersection(globalData.emptySkilledVolunteer, globalData.emptyCauseVolunteers));
            $scope.filteredVolunteersList();
        }

        $scope.filteredVolunteersList = function () {
            var queryValues = '';
            for (var vol = 0; vol < $scope.globalData.filteredVolunteer.length; vol++) {
                queryValues += '<value>{' + $scope.globalData.filteredVolunteer[vol] + '}</value>';
            }
            if (queryValues != '') {
                var queryString = CommonService.createQueryString(queryValues);
                ngoEventService.getEmptyVolunteers(queryString).then(function (filteredVolunteersDetails) {
                    $scope.globalData.volunteerDetails = filteredVolunteersDetails.data.value;
                    $scope.gridOptions.data = $scope.globalData.volunteerDetails;
                    console.log($scope.gridOptions);
                });
            }
        }
        $scope.displaySkillVoluteers = function (event) {
            console.log(event)
        }
        $scope.displayCauseVolunteers = function (event) {
            console.log(event)
        }
        $scope.displayAllVolunteers = function (event) {
            console.log(event)
        }
    }])
    .factory('ngoEventService', function ($http, CommonService) {
        return {
            getSkillSets: function () {
                return $http({
                    method: 'GET',
                    url: CommonService.serverURL + '/api/data/v8.0/new_new_eventactivity_new_skillsetset?$filter=new_eventactivityid eq ' + CommonService.recordId
                });
            },
            getEventActivityDetails: function () {
                return $http({
                    method: 'GET',
                    url: CommonService.serverURL + '/api/data/v8.0/new_eventactivities(' + CommonService.recordId + ')'
                });
            },
            getvolunteerBySkills: function (querystring) {
                return $http({
                    method: 'GET',
                    url: CommonService.serverURL + '/api/data/v8.0/new_new_skillset_new_volunteerset?$filter=' + querystring
                });
            },
            getvolunteerByCause: function (cause) {
                return $http({
                    method: 'GET',
                    url: CommonService.serverURL + '/api/data/v8.0/new_new_areaofinterest_new_volunteerset?$filter=new_areaofinterestid eq ' + cause
                });
            },
            getEventCause: function (cause) {
                return $http({
                    method: 'GET',
                    url: CommonService.serverURL + '/api/data/v8.0/new_camps(' + cause + ')?$select=_new_cause_value'
                });
            },
            getNonEmpty: function () {
                return $http({
                    method: 'GET',
                    url: CommonService.serverURL + '/api/data/v8.0/new_new_skillset_new_volunteerset'
                });
            },
            getEmptyVolunteers: function (queryString) {
                return $http({
                    method: 'GET',
                    url: CommonService.serverURL + '/api/data/v8.0/new_volunteers?' + queryString
                });
            },
            getNonEmptyCauseVolunteer: function () {
                return $http({
                    method: 'GET',
                    url: CommonService.serverURL + '/api/data/v8.0/new_new_areaofinterest_new_volunteerset'
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
    }).service('CommonService', function () {
        this.recordId = (window.parent.Xrm.Page.data.entity.getId()).replace('{', '').replace('}', '');

        this.serverURL = window.parent.Xrm.Page.context.getClientUrl();

        this.createQueryString = function (queryValues) {
            return 'fetchXml=<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
                ' <entity name="new_volunteer">  ' +
                '<order attribute="new_name" descending="false" />' +
                '<filter type="and">' +
                '<condition attribute="new_volunteerid" operator="in">' + queryValues +
                '</condition>' +
                '<condition attribute="statuscode" operator="eq" value="100000000" />' +
                '</filter>' +
                '</entity>' +
                '</fetch>';
        }
    });
