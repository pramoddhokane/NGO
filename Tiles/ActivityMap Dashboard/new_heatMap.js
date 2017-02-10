  var pinInfobox;
  var bingKey = 'AksoGYC07H5DJ7jUjNsKu9NER96-jQb9peHRiIWLdmVKrkoXrBq3W5TuKQmFNuHk';
  //var map;
  var constituentDetails;
  var pushpin;
  var heatmapLayer = null;
  var DonorLocations = new Array();
  var map = null;
  var donationReceived;
  //  var donorInfoboxLayer = new Microsoft.Maps.EntityCollection();
  //  var donorPinLayer = new Microsoft.Maps.EntityCollection();
  var constituentInfoboxLayer = new Microsoft.Maps.EntityCollection();
  var pushpinLayer = new Microsoft.Maps.EntityCollection();
  var constituentPinLayer = new Microsoft.Maps.EntityCollection();
  var pushpinInfoboxLayer = new Microsoft.Maps.EntityCollection();
  //  var beneficiaryInfoboxLayer = new Microsoft.Maps.EntityCollection();
  var registeredDonors = null,
  	registeredBeneficiaries = null,
  	registeredVolunteers = null;

  function getMap(mapName)
  {
  	var mapOptions = {
  		credentials: bingKey,
  		zoom: 5,
  		center: new Microsoft.Maps.Location(20.5937, 78.9629)
  	};
  	//   document.getElementById('map').innerHTML = "";
  	map = new Microsoft.Maps.Map(document.getElementById('map'), mapOptions);
  	// Create the info box for the pushpin
  	pinInfobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0),
  	{
  		visible: false
  	});
  	pinInfobox1 = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0),
  	{
  		visible: false
  	});
  	
  	if (mapName == "Constituents")
  	{
  		constituentInfoboxLayer.clear();
  		constituentInfoboxLayer.push(pinInfobox1);
  		getConstituentDetails();
  		pushpinLayer.clear();
  		pushpinLayer.push(pinInfobox);
  		
  	}
  	
  }

  function getDonorDetails()
  {
  	map.entities.clear();
  	pushpinLayer.clear();
  	pushpinLayer.push(pinInfobox);
  	displayPushpinsOnMap(registeredDonors, "D");
  }

  function getVolunteersDetails()
  {
  	map.entities.clear();
  	pushpinLayer.clear();
  	pushpinLayer.push(pinInfobox);
  	displayPushpinsOnMap(registeredVolunteers, "V");
  }

  function getBeneficiaryDetails()
  {
  	map.entities.clear();
  	pushpinLayer.clear();
  	pushpinLayer.push(pinInfobox);
  	displayPushpinsOnMap(registeredBeneficiaries, "B");
  }

  function getMembershipDetails()
  {
  	map.entities.clear();
  	pushpinLayer.clear();
  	pushpinLayer.push(pinInfobox);
  	displayPushpinsOnMap(registeredMembers, "M");
  }
  

  function getConstituentDetails()
  {
  	var retrieveReq = new XMLHttpRequest();
  	var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/accounts";
  	//    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_accounts";
  	retrieveReq.open("GET", odataSelect, true);
  	retrieveReq.setRequestHeader("Accept", "application/json");
  	retrieveReq.setRequestHeader("Content-Type", "application/json");
  	retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
  	retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
  	retrieveReq.setRequestHeader("OData-Version", "4.0");
  	retrieveReq.onreadystatechange = function ()
  	{
  		if (retrieveReq.readyState == 4 && retrieveReq.status == 200)
  		{
  			constituentDetails = JSON.parse(this.responseText).value;
  			var constituentSorted = _.forEach(constituentDetails, function (constituent)
  			{
  				if (constituent.new_beneficiary === true)
  				{
  					return constituent.priority = 'B';
  				}
  				else if (constituent.new_donor === true)
  				{
  					return constituent.priority = 'D';
  				}
  				else if (constituent.new_volunteer === true)
  				{
  					return constituent.priority = 'V';
  				}
  				else if (constituent.new_membership === true)
  				{
  					return constituent.priority = 'M';
  				}
  				else
  				{
  					return constituent.priority = 'C';
  				}
  			});
  			displayConstituentPushpinsOnMap(constituentSorted);
  			registeredDonors = _.filter(constituentDetails, function (o)
  			{
  				if (o.new_donor === true && o.new_totalpaiddonation > 0) return o;
  			});
  			registeredBeneficiaries = _.filter(constituentDetails, function (o)
  			{
  				if (o.new_beneficiary === true) return o;
  			});
  			registeredVolunteers = _.filter(constituentDetails, function (o)
  			{
  				if (o.new_volunteer === true) return o;
  			});
  			registeredMembers = _.filter(constituentDetails, function (o)
  			{
  				if (o.new_membership === true) return o;
  			});
  		}
  	};
  	retrieveReq.send();
  }

  function displayPushpinsOnMap(collection, priority)
  {
  	//DonorLocations = [];
  	for (var constituent = 0; constituent < collection.length; constituent++)
  	{
  		var constituentid = collection[constituent];
  		if (constituentid.new_longitude && constituentid.new_latitude)
  		{
  			if (constituentid.new_latitude && constituentid.new_longitude && constituentid.new_latitude != 0 && constituentid.new_longitude != 0)
  			{
  				var location = new Microsoft.Maps.Location(constituentid.new_latitude, constituentid.new_longitude);
  			}
  			var clientURL = window.parent.Xrm.Page.context.getClientUrl();
  			var pin = new Microsoft.Maps.Pushpin(location,
  			{
  				text: priority
  			});
  			pin.Title = constituentid.name;
  			pin.Description = 'Constituent Id: ' + constituentid.new_organizationid + '<br><a  href="' + clientURL + '/main.aspx?id=%7B' + constituentid.accountid + '%7D&newWindow=true&pagetype=entityrecord&etn=account" target="_blank">Click Here</a>';
  			pushpinLayer.push(pin);
  			Microsoft.Maps.Events.addHandler(pin, 'click', displayInfobox);
  		}
  	}
  	map.entities.push(pushpinLayer);
  	//	map.entities.push(pushpinInfoboxLayer);
  }

  function displayConstituentPushpinsOnMap(constituentDetails)
  {
  	
  	for (var constituent = 0; constituent < constituentDetails.length; constituent++)
  	{
  		var constituentid = constituentDetails[constituent];
  		if (constituentid.new_longitude && constituentid.new_latitude)
  		{
  			if (constituentid.new_latitude && constituentid.new_longitude && constituentid.new_latitude != 0 && constituentid.new_longitude != 0)
  			{
  				var location = new Microsoft.Maps.Location(constituentid.new_latitude, constituentid.new_longitude);
  			}
  			//  			getPriority(constituentDetails);
  			var clientURL = window.parent.Xrm.Page.context.getClientUrl();
  			var pin = new Microsoft.Maps.Pushpin(location,
  			{
  				text: constituentid.priority
  			});
  			pin.Title = constituentid.name;
  			pin.Description = 'Constituent Id: ' + constituentid.new_organizationid + '<br><a  href="' + clientURL + '/main.aspx?id=%7B' + constituentid.accountid + '%7D&newWindow=true&pagetype=entityrecord&etn=account" target="_blank">Click Here</a>';
  			constituentPinLayer.push(pin);
  			Microsoft.Maps.Events.addHandler(pin, 'click', displayInfobox1);
  		}
  	}
  	map.entities.push(constituentPinLayer);
  	map.entities.push(constituentInfoboxLayer);
  }

  function displayInfobox(e)
  {
  	pinInfobox.setOptions(
  	{
  		title: e.target.Title,
  		description: e.target.Description,
  		visible: true,
  		offset: new Microsoft.Maps.Point(0, 25)
  	});
  	pinInfobox.setLocation(e.target.getLocation());
  	pinInfobox1.setOptions(
  	{
  		title: e.target.Title,
  		description: e.target.Description,
  		visible: true,
  		offset: new Microsoft.Maps.Point(0, 25)
  	});
  	pinInfobox1.setLocation(e.target.getLocation());
  }

  function displayInfobox1(e)
  {
  	pinInfobox1.setOptions(
  	{
  		title: e.target.Title,
  		description: e.target.Description,
  		visible: true,
  		offset: new Microsoft.Maps.Point(0, 25)
  	});
  	pinInfobox1.setLocation(e.target.getLocation());
  }

  function hideInfobox(e)
  {
  	pinInfobox.setOptions(
  	{
  		visible: false
  	});
  }