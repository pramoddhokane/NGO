"use strict";
angular.module('app', ['dataGrid', 'pagination', 'ngMaterial'])
    .controller('EventController', ['$scope', 'ngoEventService', 'CommonService', function ($scope, ngoEventService, CommonService) {
        var eventActivityDetails = {};
        var querystring;
        var nonEmptyVoluteers = [];

        $scope.allApproved = false;
        $scope.sameCauseVol = false;
        $scope.sameSkillVol = false;
        $scope.globalData = {}
        $scope.gridOptions = {
            data: [],
            urlSync: false
        };

        ngoEventService.getEventActivityDetails().then(function (response) {
            $scope.globalData.causes = {};
            eventActivityDetails = response.data;
            $scope.globalData.event = eventActivityDetails;
            ngoEventService.getSkillSets().then(function (skillsetResponse) {  // skill set of Event Activity
                $scope.globalData.skills = skillsetResponse.data.value;
                ngoEventService.getEventCause(eventActivityDetails._new_usedforcamp_value).then(function (causeDetails) { // cause of event activity
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
                ngoEventService.getvolunteerBySkills(querystring).then(function (skilledVolunteer) { //all volunteers has matching skills
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
        };
        $scope.getvolunteersByCause = function () {
            var causeDetails = $scope.globalData.causes.cause;
            ngoEventService.getvolunteerByCause(causeDetails._new_cause_value).then(function (causedVolunteer) { // all volunteers has matching cause
                var c_volunteers = causedVolunteer.data.value;
                $scope.globalData.causes.volunteers = [];
                for (var volunteer = 0; volunteer < c_volunteers.length; volunteer++) {
                    $scope.globalData.causes.volunteers.push(c_volunteers[volunteer].new_volunteerid);
                }
                $scope.getAllVolunteers();
            });
        };

        $scope.getAllVolunteers = function () {
            var queryValues = '';
            nonEmptyVoluteers = [];
            ngoEventService.getNonEmpty().then(function (nonEmptyVolunteer) {
                for (var vol = 0; vol < nonEmptyVolunteer.data.value.length; vol++) {
                    queryValues += '<value>{' + nonEmptyVolunteer.data.value[vol].new_volunteerid + '}</value>';
                }
                if (queryValues !== '') {
                    var queryString = CommonService.createQueryStringEmpty(queryValues, '');
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
        };

        $scope.getAllEmptyCauseVolunteers = function () {
            var queryValues = '';
            nonEmptyVoluteers = [];
            ngoEventService.getNonEmptyCauseVolunteer().then(function (nonEmptyVolunteer) {
                for (var vol = 0; vol < nonEmptyVolunteer.data.value.length; vol++) {
                    queryValues += '<value>{' + nonEmptyVolunteer.data.value[vol].new_volunteerid + '}</value>';
                }

                if (queryValues !== '') {
                    var queryString = CommonService.createQueryStringEmpty(queryValues, '');
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
        };

        $scope.filteredVolunteers = function (globalData) {
            var exactSkillCause = [];
            $scope.globalData.exactSkillCause = _.intersection(globalData.causes.volunteers, globalData.skills.volunteers);
            // $scope.globalData.filteredVolunteer = _.union(exactSkillCause, _.intersection(globalData.emptySkilledVolunteer, globalData.emptyCauseVolunteers));
            $scope.allCurrentVolunteers();
        };

        $scope.filteredVolunteersList = function (status) {
            var queryValues = '';
            for (var vol = 0; vol < $scope.globalData.exactSkillCause.length; vol++) {
                queryValues += '<value>{' + $scope.globalData.exactSkillCause[vol] + '}</value>';
            }
            if (queryValues != '') {
                var queryString = CommonService.createQueryStringNonEmpty(queryValues, status);
                ngoEventService.getEmptyVolunteers(queryString).then(function (filteredVolunteersDetails) {
                    $scope.globalData.volunteerDetails = filteredVolunteersDetails.data.value;
                    $scope.gridOptions.data = $scope.globalData.volunteerDetails;
                });
            }
        };

        $scope.allCurrentVolunteers = function () {
            var queryString = '$filter=statuscode eq 100000004';
            ngoEventService.getEmptyVolunteers(queryString).then(function (allVolunteers) {
                $scope.globalData.allCurrentVolunteers = allVolunteers.data.value;
                $scope.gridOptions.data = $scope.globalData.allCurrentVolunteers;
                console.log($scope.globalData);
            });
        };

        $scope.validateVolunteersDetails = function (approved, cause, skill) {
            if (approved === true && cause === true && skill === true) {
                $scope.filteredVolunteersList(100000000);
            }
            else if (approved === true && cause === true && skill === false) {
                var queryValues = '';
                for (var vol = 0; vol < $scope.globalData.causes.volunteers.length; vol++) {
                    queryValues += '<value>{' + $scope.globalData.causes.volunteers[vol] + '}</value>';
                }
                if (queryValues !== '') {
                    var queryString = CommonService.createQueryStringNonEmpty(queryValues, 100000000);
                    ngoEventService.getEmptyVolunteers(queryString).then(function (filteredVolunteersDetails) {
                        $scope.globalData.volunteerDetails = filteredVolunteersDetails.data.value;
                        $scope.gridOptions.data = $scope.globalData.volunteerDetails;
                    });
                }
            }
            else if (approved === true && cause === false && skill === true) {
                var queryValues = '';
                for (var vol = 0; vol < $scope.globalData.skills.volunteers.length; vol++) {
                    queryValues += '<value>{' + $scope.globalData.skills.volunteers[vol] + '}</value>';
                }
                if (queryValues !== '') {
                    var queryString = CommonService.createQueryStringNonEmpty(queryValues, 100000000);
                    ngoEventService.getEmptyVolunteers(queryString).then(function (filteredVolunteersDetails) {
                        $scope.globalData.volunteerDetails = filteredVolunteersDetails.data.value;
                        $scope.gridOptions.data = $scope.globalData.volunteerDetails;
                    });
                }
            }
            else if (approved === true && cause === false && skill === false) {
                var queryString = '$filter=statuscode eq 100000000';
                ngoEventService.getEmptyVolunteers(queryString).then(function (allVolunteers) {
                    $scope.globalData.allCurrentVolunteers = allVolunteers.data.value;
                    $scope.gridOptions.data = $scope.globalData.allCurrentVolunteers;
                });
            }
            else if (approved === false && cause === true && skill === false) {
                var queryValues = '';
                for (var vol = 0; vol < $scope.globalData.causes.volunteers.length; vol++) {
                    queryValues += '<value>{' + $scope.globalData.causes.volunteers[vol] + '}</value>';
                }
                if (queryValues !== '') {
                    var queryString = CommonService.createQueryStringNonEmpty(queryValues, 100000004);
                    ngoEventService.getEmptyVolunteers(queryString).then(function (filteredVolunteersDetails) {
                        $scope.globalData.volunteerDetails = filteredVolunteersDetails.data.value;
                        $scope.gridOptions.data = $scope.globalData.volunteerDetails;
                    });
                }
            }
            else if (approved === false && cause === false && skill === true) {
                var queryValues = '';
                for (var vol = 0; vol < $scope.globalData.skills.volunteers.length; vol++) {
                    queryValues += '<value>{' + $scope.globalData.skills.volunteers[vol] + '}</value>';
                }
                if (queryValues !== '') {
                    var queryString = CommonService.createQueryStringNonEmpty(queryValues, 100000004);
                    ngoEventService.getEmptyVolunteers(queryString).then(function (filteredVolunteersDetails) {
                        $scope.globalData.volunteerDetails = filteredVolunteersDetails.data.value;
                        $scope.gridOptions.data = $scope.globalData.volunteerDetails;
                    });
                }
            }
            else if (approved === false && cause === true && skill === true) {
                $scope.filteredVolunteersList(100000004);
            }
            else if (approved === false && cause === false && skill === false) {
                $scope.allCurrentVolunteers();
            }
        };
        $scope.assignVolunteer = function (event, volunteer) {
            if (event) {
                var selectedVolunteer = {
                    'new_volunteertypeorignal': volunteer.new_constituentvolunteertype,
                    'new_name': volunteer.new_nameofvolunteer,
                    'new_volunteerstatus': 2,
                    'new_city': volunteer.new_city,
                    'new_Volunteername@odata.bind': '/new_volunteers(' + volunteer.new_volunteerid + ')',
                    'new_campactivityname@odata.bind': '/new_eventactivities(' + $scope.globalData.event.new_eventactivityid + ')'
                }
                ngoEventService.assignVolunteertoEvent(selectedVolunteer).then(function (response) {
                    console.log(response);
                });
            }
            else {
                var queryString = '$filter=_new_volunteername_value eq ' + volunteer.new_volunteerid + ' and _new_campactivityname_value eq ' + $scope.globalData.event.new_eventactivityid;
                ngoEventService.getassignVolunteerDetails(queryString).then(function (volunteerRes) {
                    var volDetails = volunteerRes.data.value;
                    var recordId = volDetails[0].new_campactivitymemberid;
                    ngoEventService.deleteAssignedVolunteer(recordId).then(function(response){
                        console.log('Delete');
                    })
                });
            }
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
            },
            assignVolunteertoEvent: function (volunteer) {
                return $http({
                    method: 'POST',
                    url: CommonService.serverURL + '/api/data/v8.0/new_campactivitymembers',
                    data: volunteer
                });
            },
            getassignVolunteerDetails: function () {
                return $http({
                    method: 'GET',
                    url: CommonService.serverURL + '/api/data/v8.0/new_campactivitymembers'
                });
            },
            deleteAssignedVolunteer: function (recordID) {
                return $http({
                    method: 'DELETE',
                    url: CommonService.serverURL + '/api/data/v8.0/new_campactivitymembers(' + recordID + ')'
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

        this.createQueryStringNonEmpty = function (queryValues, statusCode) {
            var conditionAttribute = '';
            if (statusCode !== '') {
                conditionAttribute = '<condition attribute="statuscode" operator="eq" value="' + statusCode + '" />'
            }
            return 'fetchXml=<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
                ' <entity name="new_volunteer">  ' +
                '<order attribute="new_name" descending="false" />' +
                '<filter type="and">' +
                '<condition attribute="new_volunteerid" operator="in">' + queryValues +
                '</condition>' + conditionAttribute +
                '</filter>' +
                '</entity>' +
                '</fetch>';
        };
        this.createQueryStringEmpty = function (queryValues, statusCode) {
            var conditionAttribute = '';
            if (statusCode !== '') {
                conditionAttribute = '<condition attribute="statuscode" operator="eq" value="' + statusCode + '" />'
            }
            return 'fetchXml=<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
                ' <entity name="new_volunteer">  ' +
                '<order attribute="new_name" descending="false" />' +
                '<filter type="and">' +
                '<condition attribute="new_volunteerid" operator="not-in">' + queryValues +
                '</condition>' + conditionAttribute +
                '</filter>' +
                '</entity>' +
                '</fetch>';
        }
    });
