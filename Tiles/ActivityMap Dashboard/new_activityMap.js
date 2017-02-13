'use strict';
angular.module('APP', ['ngAnimate'])
	.controller('MainCtrl', ['$scope', '$http', '$window', '$rootScope', 'CommonService', function ($scope, $http, $window, $rootScope, CommonService)
{
	$scope.pinInfobox = null;
	$scope.duration = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	$scope.bingKey = 'AksoGYC07H5DJ7jUjNsKu9NER96-jQb9peHRiIWLdmVKrkoXrBq3W5TuKQmFNuHk';
	//var map;
	$scope.constituentDetails = null;
	$scope.pushpin = null;
	$scope.heatmapLayer = null;
	$scope.DonorLocations = [];
	$scope.map = null;
	$scope.donationReceived = null;
	$scope.donorInfoboxLayer = new Microsoft.Maps.EntityCollection();
	$scope.donorPinLayer = new Microsoft.Maps.EntityCollection();
	$scope.constituentInfoboxLayer = new Microsoft.Maps.EntityCollection();
	$scope.constituentPinLayer = new Microsoft.Maps.EntityCollection();
	$scope.conditions = [
	{
		id: 1,
		label: 'Current Financial Year',
		},
	{
		id: 2,
		label: 'Current Month',
		}]; // ['Current Financial Year', 'Current Month'];
	$scope.heatMap = null;
	$scope.selectedCondition = null;
	$scope.getMap = function ()
	{
		$scope.mapOptions = {
			credentials: $scope.bingKey,
			zoom: 5,
			center: new Microsoft.Maps.Location(20.5937, 78.9629)
		};
		$scope.map = new Microsoft.Maps.Map(document.getElementById('map'), $scope.mapOptions);
		// Create the info box for the pushpin
		$scope.pinInfobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0),
		{
			visible: false
		});
		$scope.getConstituentDetails(0);
		$scope.constituentInfoboxLayer.clear();
		$scope.constituentInfoboxLayer.push($scope.pinInfobox);
	}
	$scope.displayDonationPushpinsOnMap = function (filter)
	{
		$scope.map.entities.remove($scope.constituentPinLayer);
		$scope.map.entities.remove($scope.constituentInfoboxLayer);
		//if ($scope.heatMap != null) $scope.heatMap.Remove();
		$scope.thisMonthRegisteredDonors = _.filter($scope.thisMonthRegisteredConstituents, function (o)
		{
			if (o.new_donor === true) return o
		});
		$scope.thisFYRegisteredDonors = _.filter($scope.constituentDetails, function (o)
		{
			if (o.new_donor === true) return o
		});
		if ($scope.DonorLocations.length === 0)
		{
//			filter = 1;
			//for current Month
			if (filter === 2)
			{
				for (var constituent = 0; constituent < $scope.thisMonthRegisteredDonors.length; constituent++)
				{
					var constituentid = $scope.thisMonthRegisteredDonors[constituent];
					if (constituentid.new_longitude && constituentid.new_latitude)
					{
						var donationReceived = constituentid.new_totalpaiddonation;
						if (constituentid.new_latitude && constituentid.new_longitude && constituentid.new_latitude != 0 && constituentid.new_longitude != 0)
						{
							// Create location:    
							var location = new Microsoft.Maps.Location(constituentid.new_latitude, constituentid.new_longitude);
							//   Add a nominal multiplier value to the location, for revenue-based   heatmapping:
							if (donationReceived >= 0)
							{
								// var   locMultiplier = donationReceived / 100000; 
								if (donationReceived <= 1000000)
								{
									var locMultiplier = donationReceived / 100000;
								}
								else
								{
									var locMultiplier = donationReceived / 2000000;
								}
								location.multiplier = locMultiplier;
							}
							$scope.DonorLocations.push(location);
						}
					}
				}
			}
			else
			{
				//for current year
				for (var constituent = 0; constituent < $scope.thisFYRegisteredDonors.length; constituent++)
				{
					var constituentid = $scope.thisFYRegisteredDonors[constituent];
					if (constituentid.new_longitude && constituentid.new_latitude)
					{
						donationReceived = constituentid.new_totalpaiddonation;
						if (constituentid.new_latitude && constituentid.new_longitude && constituentid.new_latitude != 0 && constituentid.new_longitude != 0)
						{
							// Create location:    
							var location = new Microsoft.Maps.Location(constituentid.new_latitude, constituentid.new_longitude);
							//   Add a nominal multiplier value to the location, for revenue-based   heatmapping:
							if (donationReceived >= 0)
							{
								// var   locMultiplier = donationReceived / 100000; 
								if (donationReceived <= 1000000)
								{
									var locMultiplier = donationReceived / 100000;
								}
								else
								{
									var locMultiplier = donationReceived / 2000000;
								}
								location.multiplier = locMultiplier;
							}
							$scope.DonorLocations.push(location);
						}
					}
				}
			}
		}
		if ($scope.heatMap != null)
		{
			$scope.map.entities.clear();
			//$scope.heatMap.Remove();
		}
		$scope.heatMap = new HeatMapLayer($scope.map, $scope.DonorLocations,
		{
			intensity: 0.7,
			//  radius: 10,
			radius: 10,
			unit: 'pixels',
			// radius: 2000,
			// unit: 'meters',
			colourgradient: {
				0.00: 'rgba(0,255,0,80)', // Green
				0.50: 'rgba(255,255,0,120)', // Yellow
				1.00: 'rgba(255,0,0,150)' // Red                 
			},
		});
		$scope.map.entities.push($scope.heatMap);
	}
	$scope.getConstituentDetails = function (filter)
	{
		var retrieveReq = new XMLHttpRequest();
		//	var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/accounts";
		retrieveReq.open("GET", window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/accounts?fetchXml=%3Cfetch%20version%3D%221.0%22%20output-format%3D%22xml-platform%22%20mapping%3D%22logical%22%20distinct%3D%22false%22%3E%3Centity%20name%3D%22account%22%3E%3Cattribute%20name%3D%22name%22%20%2F%3E%3Cattribute%20name%3D%22primarycontactid%22%20%2F%3E%3Cattribute%20name%3D%22new_branch%22%20%2F%3E%3Cattribute%20name%3D%22new_organizationid%22%20%2F%3E%3Cattribute%20name%3D%22new_constituenttype%22%20%2F%3E%3Cattribute%20name%3D%22new_registrationdate%22%20%2F%3E%3Cattribute%20name%3D%22new_serviceprovider%22%20%2F%3E%3Cattribute%20name%3D%22new_donor%22%20%2F%3E%3Cattribute%20name%3D%22new_volunteer%22%20%2F%3E%3Cattribute%20name%3D%22new_membership%22%20%2F%3E%3Cattribute%20name%3D%22new_beneficiary%22%20%2F%3E%3Cattribute%20name%3D%22accountid%22%20%2F%3E%3Cattribute%20name%3D%22new_totalpaiddonation%22%20%2F%3E%3Cattribute%20name%3D%22new_latitude%22%20%20%2F%3E%3Cattribute%20name%3D%22new_longitude%22%20%20%2F%3E%3Corder%20attribute%3D%22name%22%20descending%3D%22false%22%20%2F%3E%3Cfilter%20type%3D%22and%22%3E%3Ccondition%20attribute%3D%22statecode%22%20operator%3D%22eq%22%20value%3D%220%22%20%2F%3E%3Ccondition%20attribute%3D%22new_registrationdate%22%20operator%3D%22this-fiscal-year%22%20%2F%3E%3C%2Ffilter%3E%3C%2Fentity%3E%3C%2Ffetch%3E", true);
		//	retrieveReq.open("GET", odataSelect, true);
		retrieveReq.setRequestHeader("Accept", "application/json");
		retrieveReq.setRequestHeader("Content-Type", "application/json");
		retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
		retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
		retrieveReq.setRequestHeader("OData-Version", "4.0");
		retrieveReq.onreadystatechange = function ()
		{
			if (retrieveReq.readyState == 4 && retrieveReq.status == 200)
			{
				$scope.constituentDetails = JSON.parse(this.responseText).value;
				$scope.displayConstituentPushpinsOnMap(filter);
			}
		};
		retrieveReq.send();
	}
	$scope.displayConstituentPushpinsOnMap = function (filter)
	{
		if ($scope.heatMap != null) $scope.heatMap.Remove();
		var currentDate = new Date();
		var y = currentDate.getFullYear(),
			m = currentDate.getMonth();
		var firstDay = new Date(y, m, 1);
		var lastDay = new Date(y, m + 1, 0);
		$scope.thisMonthRegisteredConstituents = _.filter($scope.constituentDetails, function (o)
		{
			var registrationDate = new Date(o.new_registrationdate);
			if (registrationDate >= firstDay && registrationDate <= lastDay) return o
		});
//		filter = 0;
		console.log("thisMonthRegisteredConstituents" + $scope.thisMonthRegisteredConstituents);
		if (filter === 2)
		{
			for (var constituent = 0; constituent < $scope.thisMonthRegisteredConstituents.length; constituent++)
			{
				var constituentid = $scope.thisMonthRegisteredConstituents[constituent];
				if (constituentid.new_longitude && constituentid.new_latitude)
				{
					if (constituentid.new_latitude != null && constituentid.new_longitude != null && constituentid.new_latitude != 0 && constituentid.new_longitude != 0)
					{
						var location = new Microsoft.Maps.Location(constituentid.new_latitude, constituentid.new_longitude);
					}
					var clientURL = window.parent.Xrm.Page.context.getClientUrl();
					var pin = new Microsoft.Maps.Pushpin(location,
					{
						text: 'C'
					});
					pin.Title = constituentid.name;
					pin.Description = 'Constituent Id: ' + constituentid.new_organizationid + '<br><a  href="' + clientURL + '/main.aspx?id=%7B' + constituentid.accountid + '%7D&newWindow=true&pagetype=entityrecord&etn=account" target="_blank">Click Here</a>';
					$scope.constituentPinLayer.push(pin);
					Microsoft.Maps.Events.addHandler(pin, 'click', displayInfobox);
				}
			}
		}
		else
		{
			for (var constituent = 0; constituent < $scope.constituentDetails.length; constituent++)
			{
				var constituentid = $scope.constituentDetails[constituent];
				if (constituentid.new_longitude && constituentid.new_latitude)
				{
					if (constituentid.new_latitude && constituentid.new_longitude && constituentid.new_latitude != 0 && constituentid.new_longitude != 0)
					{
						var location = new Microsoft.Maps.Location(constituentid.new_latitude, constituentid.new_longitude);
					}
					var clientURL = window.parent.Xrm.Page.context.getClientUrl();
					var pin = new Microsoft.Maps.Pushpin(location,
					{
						text: 'C'
					});
					pin.Title = constituentid.name;
					pin.Description = 'Constituent Id: ' + constituentid.new_organizationid + '<br><a  href="' + clientURL + '/main.aspx?id=%7B' + constituentid.accountid + '%7D&newWindow=true&pagetype=entityrecord&etn=account" target="_blank">Click Here</a>';
					$scope.constituentPinLayer.push(pin);
					Microsoft.Maps.Events.addHandler(pin, 'click', displayInfobox);
				}
			}
		}
		$scope.map.entities.push($scope.constituentPinLayer);
		$scope.map.entities.push($scope.constituentInfoboxLayer);
	}
	$scope.GetValue = function (x)
	{
		var selectedCondition = $scope.selectedCondition;
		$window.alert("Selected Value: " + selectedCondition.id);
		
	}

	function displayInfobox(e)
	{
		$scope.pinInfobox.setOptions(
		{
			title: e.target.Title,
			description: e.target.Description,
			visible: true,
			offset: new Microsoft.Maps.Point(0, 25)
		});
		$scope.pinInfobox.setLocation(e.target.getLocation());
	}

	function hideInfobox(e)
	{
		$scope.pinInfobox.setOptions(
		{
			visible: false
		});
	}}]).factory('httpRequestInterceptor', function ()
{
	return {
		request: function (config)
		{
			config.headers['Accept'] = 'application/json';
			config.headers['Content-Type'] = 'application/json; charset=utf-8';
			config.headers['OData-MaxVersion'] = '4.0';
			config.headers['Prefer'] = 'odata.include-annotations="*"';
			config.headers['OData-Version'] = '4.0';
			return config;
		}
	};
}).config(function ($httpProvider)
{
	$httpProvider.interceptors.push('httpRequestInterceptor');
}).service('CommonService', function ()
{
	// this.recordId = (window.parent.Xrm.Page.data.entity.getId()).replace('{', '').replace('}', '');
});