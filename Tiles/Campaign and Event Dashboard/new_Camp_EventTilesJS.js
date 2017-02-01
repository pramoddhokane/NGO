var data = {};
var retrieveReq = new XMLHttpRequest();
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var date = new Date();


function getCurrentYearAccounts()
{
	var retrieveReq = new XMLHttpRequest();
	retrieveReq.open("GET", window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/accounts?fetchXml=%3Cfetch%20version%3D%221.0%22%20output-format%3D%22xml-platform%22%20mapping%3D%22logical%22%20distinct%3D%22false%22%3E%3Centity%20name%3D%22account%22%3E%3Cattribute%20name%3D%22name%22%20%2F%3E%3Cattribute%20name%3D%22primarycontactid%22%20%2F%3E%3Cattribute%20name%3D%22new_branch%22%20%2F%3E%3Cattribute%20name%3D%22new_organizationid%22%20%2F%3E%3Cattribute%20name%3D%22new_constituenttype%22%20%2F%3E%3Cattribute%20name%3D%22new_registrationdate%22%20%2F%3E%3Cattribute%20name%3D%22new_serviceprovider%22%20%2F%3E%3Cattribute%20name%3D%22new_donor%22%20%2F%3E%3Cattribute%20name%3D%22new_volunteer%22%20%2F%3E%3Cattribute%20name%3D%22new_membership%22%20%2F%3E%3Cattribute%20name%3D%22new_beneficiary%22%20%2F%3E%3Cattribute%20name%3D%22accountid%22%20%2F%3E%3Corder%20attribute%3D%22name%22%20descending%3D%22false%22%20%2F%3E%3Cfilter%20type%3D%22and%22%3E%3Ccondition%20attribute%3D%22statecode%22%20operator%3D%22eq%22%20value%3D%220%22%20%2F%3E%3Ccondition%20attribute%3D%22new_registrationdate%22%20operator%3D%22this-fiscal-year%22%20%2F%3E%3Ccondition%20attribute%3D%22new_source%22%20operator%3D%22not-null%22%20%2F%3E%3C%2Ffilter%3E%3Clink-entity%20name%3D%22contact%22%20from%3D%22contactid%22%20to%3D%22primarycontactid%22%20visible%3D%22false%22%20link-type%3D%22outer%22%20alias%3D%22accountprimarycontactidcontactcontactid%22%3E%3Cattribute%20name%3D%22emailaddress1%22%20%2F%3E%3C%2Flink-entity%3E%3C%2Fentity%3E%3C%2Ffetch%3E", true);
	retrieveReq.setRequestHeader("Accept", "application/json");
	retrieveReq.setRequestHeader("Content-Type", "application/json");
	retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
	retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
	retrieveReq.setRequestHeader("OData-Version", "4.0");
	retrieveReq.onreadystatechange = function ()
	{
		if (retrieveReq.readyState == 4 && retrieveReq.status == 200)
		{
			console.log(JSON.parse(this.responseText).value);
			var donorCnt = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				if (o.new_donor === true) return o
			}).length;
			var beneficiaryCnt = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				if (o.new_beneficiary === true) return o
			}).length;
			var volunteerCnt = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				if (o.new_volunteer === true) return o
			}).length;
			document.getElementById("beneficiariesThisYear").innerHTML = beneficiaryCnt;
			document.getElementById("volunteersThisYear").innerHTML = volunteerCnt;
			document.getElementById("donorsThisYear").innerHTML = donorCnt;
		}
	};
	retrieveReq.send();
}

function getCurrentFiscalYear()
{
	getCurrentYearAccounts();
	getCurrentYearCampaignDonations();
	getCurrentYearEventDonations();
	getCurrentYearCampaignCost();
	getCurrentYearEventCost();
	
	var req = new XMLHttpRequest();
	req.open("GET", window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/organizations()?$select=fiscalcalendarstart", true);
	req.setRequestHeader("OData-MaxVersion", "4.0");
	req.setRequestHeader("OData-Version", "4.0");
	req.setRequestHeader("Accept", "application/json");
	req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
	req.onreadystatechange = function ()
	{
		if (this.readyState === 4)
		{
			req.onreadystatechange = null;
			if (this.status === 200)
			{
				var result = JSON.parse(this.responseText).value;
				fiscalcalendarstart = new Date(result[0]["fiscalcalendarstart"]);
				var fiscalcalendarend = new Date(new Date().setFullYear(fiscalcalendarstart.getFullYear() + 1, fiscalcalendarstart.getMonth(), fiscalcalendarstart.getDate()));
				console.log("lastday" + fiscalcalendarend);
				document.getElementById("forFinancialYearTile1").innerHTML = document.getElementById("forFinancialYearTile2").innerHTML = document.getElementById("forFinancialYearTile3").innerHTML = document.getElementById("forFinancialYearTile4").innerHTML = document.getElementById("forFinancialYearTile5").innerHTML = document.getElementById("forFinancialYearTile6").innerHTML = lastYear + '-' + currentYear;
				
			}
			else
			{
				Xrm.Utility.alertDialog(this.statusText);
			}
		}
	};
	req.send();
}

function getCurrentYearCampaignDonations()
{
	var retrieveReq = new XMLHttpRequest();
	retrieveReq.open("GET", window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donationtransactions?fetchXml=%3Cfetch%20version%3D%221.0%22%20output-format%3D%22xml-platform%22%20mapping%3D%22logical%22%20distinct%3D%22false%22%3E%3Centity%20name%3D%22new_donationtransaction%22%3E%3Cattribute%20name%3D%22new_donationtransactionid%22%20%2F%3E%3Cattribute%20name%3D%22new_name%22%20%2F%3E%3Cattribute%20name%3D%22createdon%22%20%2F%3E%3Cattribute%20name%3D%22new_amount%22%20%2F%3E%3Cattribute%20name%3D%22new_donationreceiveddate%22%20%2F%3E%3Cattribute%20name%3D%22statuscode%22%20%2F%3E%3Corder%20attribute%3D%22new_name%22%20descending%3D%22false%22%20%2F%3E%3Cfilter%20type%3D%22and%22%3E%3Ccondition%20attribute%3D%22new_donationreceiveddate%22%20operator%3D%22this-fiscal-year%22%20%2F%3E%3Ccondition%20attribute%3D%22new_donationtype%22%20operator%3D%22eq%22%20value%3D%22100000000%22%20%2F%3E%3Ccondition%20attribute%3D%22new_campaign%22%20operator%3D%22not-null%22%20%2F%3E%3Ccondition%20attribute%3D%22statecode%22%20operator%3D%22eq%22%20value%3D%220%22%20%2F%3E%3Ccondition%20attribute%3D%22statuscode%22%20operator%3D%22eq%22%20value%3D%22100000003%22%20%2F%3E%3C%2Ffilter%3E%3C%2Fentity%3E%3C%2Ffetch%3E", true);
	retrieveReq.setRequestHeader("Accept", "application/json");
	retrieveReq.setRequestHeader("Content-Type", "application/json");
	retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
	retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
	retrieveReq.setRequestHeader("OData-Version", "4.0");
	retrieveReq.onreadystatechange = function ()
	{
		if (retrieveReq.readyState == 4 && retrieveReq.status == 200)
		{
			console.log(JSON.parse(this.responseText).value);
			var sum = _.reduce(JSON.parse(this.responseText).value, function (sum, entry)
			{
				if (entry.new_amount > 0) return sum + parseFloat(entry.new_amount);
				else return sum;
			}, 0);
			if (sum < 1000)
			{
				document.getElementById("CampaignDonationThisYear").innerHTML = "₹" + (Math.round(parseFloat(sum) * 100) / 100).toLocaleString();
			}
			else if (sum >= 1000 && sum < 99999)
			{
				document.getElementById("CampaignDonationThisYear").innerHTML = "₹" + (Math.round(parseFloat(sum) / 1000 * 100) / 100).toLocaleString() + " " + "K";
			}
			else if (sum >= 100000 && sum < 9999999)
			{
				document.getElementById("CampaignDonationThisYear").innerHTML = "₹" + (Math.round(parseFloat(sum) / 100000 * 100) / 100).toLocaleString() + " " + "L";
			}
			else if (sum >= 10000000)
			{
				document.getElementById("CampaignDonationThisYear").innerHTML = "₹" + (Math.round(parseFloat(sum) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
			}
		}
	};
	retrieveReq.send();
}

function getCurrentYearEventDonations()
{
	var retrieveReq = new XMLHttpRequest();
	retrieveReq.open("GET", window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donationtransactions?fetchXml=%3Cfetch%20version%3D%221.0%22%20output-format%3D%22xml-platform%22%20mapping%3D%22logical%22%20distinct%3D%22false%22%3E%3Centity%20name%3D%22new_donationtransaction%22%3E%3Cattribute%20name%3D%22new_donationtransactionid%22%20%2F%3E%3Cattribute%20name%3D%22new_name%22%20%2F%3E%3Cattribute%20name%3D%22createdon%22%20%2F%3E%3Cattribute%20name%3D%22new_amount%22%20%2F%3E%3Cattribute%20name%3D%22new_donationreceiveddate%22%20%2F%3E%3Cattribute%20name%3D%22statuscode%22%20%2F%3E%3Corder%20attribute%3D%22new_name%22%20descending%3D%22false%22%20%2F%3E%3Cfilter%20type%3D%22and%22%3E%3Ccondition%20attribute%3D%22new_donationreceiveddate%22%20operator%3D%22this-fiscal-year%22%20%2F%3E%3Ccondition%20attribute%3D%22new_donationtype%22%20operator%3D%22eq%22%20value%3D%22100000000%22%20%2F%3E%3Ccondition%20attribute%3D%22new_donatetocampevent%22%20operator%3D%22not-null%22%20%2F%3E%3Ccondition%20attribute%3D%22statecode%22%20operator%3D%22eq%22%20value%3D%220%22%20%2F%3E%3Ccondition%20attribute%3D%22statuscode%22%20operator%3D%22eq%22%20value%3D%22100000003%22%20%2F%3E%3C%2Ffilter%3E%3C%2Fentity%3E%3C%2Ffetch%3E", true);
	retrieveReq.setRequestHeader("Accept", "application/json");
	retrieveReq.setRequestHeader("Content-Type", "application/json");
	retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
	retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
	retrieveReq.setRequestHeader("OData-Version", "4.0");
	retrieveReq.onreadystatechange = function ()
	{
		if (retrieveReq.readyState == 4 && retrieveReq.status == 200)
		{
			console.log(JSON.parse(this.responseText).value);
			var sum = _.reduce(JSON.parse(this.responseText).value, function (sum, entry)
			{
				if (entry.new_amount > 0) return sum + parseFloat(entry.new_amount);
				else return sum;
			}, 0);
			if (sum < 1000)
			{
				document.getElementById("EventDonationThisYear").innerHTML = "₹" + (Math.round(parseFloat(sum) * 100) / 100).toLocaleString();
			}
			else if (sum >= 1000 && sum < 99999)
			{
				document.getElementById("EventDonationThisYear").innerHTML = "₹" + (Math.round(parseFloat(sum) / 1000 * 100) / 100).toLocaleString() + " " + "K";
			}
			else if (sum >= 100000 && sum < 9999999)
			{
				document.getElementById("EventDonationThisYear").innerHTML = "₹" + (Math.round(parseFloat(sum) / 100000 * 100) / 100).toLocaleString() + " " + "L";
			}
			else if (sum >= 10000000)
			{
				document.getElementById("EventDonationThisYear").innerHTML = "₹" + (Math.round(parseFloat(sum) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
			}
		}
	};
	retrieveReq.send();
}

function getCurrentYearCampaignCost()
{
	//var length;
	//	var currentDate = new Date();
	//	var lastYear = firstDate.getFullYear();
	//	var currentYear = lastDate.getFullYear();
	var retrieveReq = new XMLHttpRequest();
	//var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/campaigns?$filter=statecode eq 0 and  Microsoft.Dynamics.CRM.Between(PropertyName='new_actstart',";
	//var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donationtransactions?$filter=statuscode eq 100000003 and Microsoft.Dynamics.CRM.Between(PropertyName='new_donationreceiveddate',";
	//odataSelect += 'PropertyValues=["' + firstDate.toISOString() + '","' + lastDate.toISOString() + '"])';
	retrieveReq.open("GET", window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/campaigns?fetchXml=%3Cfetch%20version%3D%221.0%22%20output-format%3D%22xml-platform%22%20mapping%3D%22logical%22%20distinct%3D%22false%22%3E%3Centity%20name%3D%22campaign%22%3E%3Cattribute%20name%3D%22name%22%20%2F%3E%3Cattribute%20name%3D%22istemplate%22%20%2F%3E%3Cattribute%20name%3D%22statuscode%22%20%2F%3E%3Cattribute%20name%3D%22campaignid%22%20%2F%3E%3Cattribute%20name%3D%22totalactualcost%22%20%2F%3E%3Corder%20attribute%3D%22name%22%20descending%3D%22true%22%20%2F%3E%3Cfilter%20type%3D%22and%22%3E%3Ccondition%20attribute%3D%22statecode%22%20operator%3D%22eq%22%20value%3D%220%22%20%2F%3E%3Ccondition%20attribute%3D%22new_actstart%22%20operator%3D%22this-fiscal-year%22%20%2F%3E%3C%2Ffilter%3E%3C%2Fentity%3E%3C%2Ffetch%3E", true);
	//retrieveReq.open("GET", odataSelect, true);
	retrieveReq.setRequestHeader("Accept", "application/json");
	retrieveReq.setRequestHeader("Content-Type", "application/json");
	retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
	retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
	retrieveReq.setRequestHeader("OData-Version", "4.0");
	retrieveReq.onreadystatechange = function ()
	{
		if (retrieveReq.readyState == 4 && retrieveReq.status == 200)
		{
			console.log(JSON.parse(this.responseText).value);
			var sum = _.reduce(JSON.parse(this.responseText).value, function (sum, entry)
			{
				if (entry.totalactualcost > 0) return sum + parseFloat(entry.totalactualcost);
				else return sum;
			}, 0);
			if (sum < 1000)
			{
				document.getElementById("campaignCostThisYear").innerHTML = "₹" + (Math.round(parseFloat(sum) * 100) / 100).toLocaleString();
			}
			else if (sum >= 1000 && sum < 99999)
			{
				document.getElementById("campaignCostThisYear").innerHTML = "₹" + (Math.round(parseFloat(sum) / 1000 * 100) / 100).toLocaleString() + " " + "K";
			}
			else if (sum >= 100000 && sum < 9999999)
			{
				document.getElementById("campaignCostThisYear").innerHTML = "₹" + (Math.round(parseFloat(sum) / 100000 * 100) / 100).toLocaleString() + " " + "L";
			}
			else if (sum >= 10000000)
			{
				document.getElementById("campaignCostThisYear").innerHTML = "₹" + (Math.round(parseFloat(sum) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
			}
		}
	};
	retrieveReq.send();
}

function getCurrentYearEventCost()
{
	
	var retrieveReq = new XMLHttpRequest();	
	retrieveReq.open("GET", window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_camps?fetchXml=%3Cfetch%20version%3D%221.0%22%20output-format%3D%22xml-platform%22%20mapping%3D%22logical%22%20distinct%3D%22false%22%3E%3Centity%20name%3D%22new_camp%22%3E%3Cattribute%20name%3D%22new_name%22%20%2F%3E%3Cattribute%20name%3D%22new_totalcost%22%20%2F%3E%3Cattribute%20name%3D%22new_actstart%22%20%2F%3E%3Cattribute%20name%3D%22new_campid%22%20%2F%3E%3Corder%20attribute%3D%22new_name%22%20descending%3D%22false%22%20%2F%3E%3Cfilter%20type%3D%22and%22%3E%3Ccondition%20attribute%3D%22statecode%22%20operator%3D%22eq%22%20value%3D%220%22%20%2F%3E%3Ccondition%20attribute%3D%22new_actstart%22%20operator%3D%22this-fiscal-year%22%20%2F%3E%3C%2Ffilter%3E%3C%2Fentity%3E%3C%2Ffetch%3E", true);
	retrieveReq.setRequestHeader("Accept", "application/json");
	retrieveReq.setRequestHeader("Content-Type", "application/json");
	retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
	retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
	retrieveReq.setRequestHeader("OData-Version", "4.0");
	retrieveReq.onreadystatechange = function ()
	{
		if (retrieveReq.readyState == 4 && retrieveReq.status == 200)
		{
			console.log(JSON.parse(this.responseText).value);
			var sum = _.reduce(JSON.parse(this.responseText).value, function (sum, entry)
			{
				if (entry.new_totalcost > 0) return sum + parseFloat(entry.new_totalcost);
				else return sum;
			}, 0);
			if (sum < 1000)
			{
				document.getElementById("eventCostThisYear").innerHTML = "₹" + (Math.round(parseFloat(sum) * 100) / 100).toLocaleString();
			}
			else if (sum >= 1000 && sum < 99999)
			{
				document.getElementById("eventCostThisYear").innerHTML = "₹" + (Math.round(parseFloat(sum) / 1000 * 100) / 100).toLocaleString() + " " + "K";
			}
			else if (sum >= 100000 && sum < 9999999)
			{
				document.getElementById("eventCostThisYear").innerHTML = "₹" + (Math.round(parseFloat(sum) / 100000 * 100) / 100).toLocaleString() + " " + "L";
			}
			else if (sum >= 10000000)
			{
				document.getElementById("eventCostThisYear").innerHTML = "₹" + (Math.round(parseFloat(sum) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
			}
		}
	};
	retrieveReq.send();
}

function getODataUTCDateFilter(date)
{
	var monthString;
	var rawMonth = (date.getUTCMonth() + 1).toString();
	if (rawMonth.length == 1)
	{
		monthString = "0" + rawMonth;
	}
	else
	{
		monthString = rawMonth;
	}
	var dateString;
	var rawDate = date.getDate().toString();
	if (rawDate.length == 1)
	{
		dateString = "0" + rawDate;
	}
	else
	{
		dateString = rawDate;
	}
	var DateFilter = '';
	DateFilter += date.getUTCFullYear() + "-";
	DateFilter += monthString + "-";
	DateFilter += dateString;
	return DateFilter;
}