var data = {};
var retrieveReq = new XMLHttpRequest();
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var date = new Date();
// Get Current fiscal year details

function getCurrentFiscalYear()
{
	getCurrentYearAccounts();
	getCurrentYearCampaignEventDonations();
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
				document.getElementById("forFinancialYearTile1").innerHTML = document.getElementById("forFinancialYearTile2").innerHTML = document.getElementById("forFinancialYearTile3").innerHTML = document.getElementById("forFinancialYearTile4").innerHTML = document.getElementById("forFinancialYearTile5").innerHTML = document.getElementById("forFinancialYearTile6").innerHTML = fiscalcalendarstart.getFullYear() + '-' + fiscalcalendarend.getFullYear();;
			}
			else
			{
				Xrm.Utility.alertDialog(this.statusText);
			}
		}
	};
	req.send();
}
// Get Current fiscal year account details - Constituent Entity

function getCurrentYearAccounts()
{
	var currentDate = new Date();
	var y = currentDate.getFullYear(),
		m = currentDate.getMonth();
	var firstDay = new Date(y, m, 1);
	var lastDay = new Date(y, m + 1, 0);
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
			/////////////////////////Current Month Count///////////////////////////
			var currMonthBeneficiaries = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				var registrationDate = new Date(o.new_registrationdate);
				if (registrationDate >= firstDay && registrationDate <= lastDay && o.new_beneficiary === true) return o
			}).length;
			var currMonthDonors = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				var registrationDate = new Date(o.new_registrationdate);
				if (registrationDate >= firstDay && registrationDate <= lastDay && o.new_donor === true) return o
			}).length;
			var currMonthVolunteers = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				var registrationDate = new Date(o.new_registrationdate);
				if (registrationDate >= firstDay && registrationDate <= lastDay && o.new_volunteer === true) return o
			}).length;
			document.getElementById("beneficiaryThisMonth").innerHTML = "#" + currMonthBeneficiaries;
			document.getElementById("volunteersThisMonth").innerHTML = "#" + currMonthVolunteers;
			document.getElementById("donorsThisMonth").innerHTML = "#" + currMonthDonors;
			// Current Year Count
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
			document.getElementById("beneficiariesThisYear").innerHTML = "#" + beneficiaryCnt;
			document.getElementById("volunteersThisYear").innerHTML = "#" + volunteerCnt;
			document.getElementById("donorsThisYear").innerHTML = "#" + donorCnt;
			document.getElementById("currentMonthTile3").innerHTML = document.getElementById("currentMonthTile4").innerHTML = document.getElementById("currentMonthTile5").innerHTML = months[date.getMonth()] + ' ' + date.getFullYear();
			$('.dataset3-Loader').hide();
			$('.dataset3').show();
		}
	};
	retrieveReq.send();
}
// Get Current fiscal year Donations to Campaign & Events 

function getCurrentYearCampaignEventDonations()
{
	var retrieveReq = new XMLHttpRequest();
	retrieveReq.open("GET", window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donationtransactions?fetchXml=%3Cfetch%20version%3D%221.0%22%20output-format%3D%22xml-platform%22%20mapping%3D%22logical%22%20distinct%3D%22false%22%3E%3Centity%20name%3D%22new_donationtransaction%22%3E%3Cattribute%20name%3D%22new_donationtransactionid%22%20%2F%3E%3Cattribute%20name%3D%22new_name%22%20%2F%3E%3Cattribute%20name%3D%22createdon%22%20%2F%3E%3Cattribute%20name%3D%22new_amount%22%20%2F%3E%3Cattribute%20name%3D%22new_donationreceiveddate%22%20%2F%3E%3Cattribute%20name%3D%22new_campaign%22%20%2F%3E%3Cattribute%20name%3D%22new_donatetocampevent%22%20%2F%3E%3Corder%20attribute%3D%22new_name%22%20descending%3D%22false%22%20%2F%3E%3Cfilter%20type%3D%22and%22%3E%3Ccondition%20attribute%3D%22new_donationreceiveddate%22%20operator%3D%22this-fiscal-year%22%20%2F%3E%3Ccondition%20attribute%3D%22statecode%22%20operator%3D%22eq%22%20value%3D%220%22%20%2F%3E%3Ccondition%20attribute%3D%22statuscode%22%20operator%3D%22eq%22%20value%3D%22100000003%22%20%2F%3E%3Cfilter%20type%3D%22or%22%3E%3Ccondition%20attribute%3D%22new_campaign%22%20operator%3D%22not-null%22%20%2F%3E%3Ccondition%20attribute%3D%22new_donatetocampevent%22%20operator%3D%22not-null%22%20%2F%3E%3C%2Ffilter%3E%3Ccondition%20attribute%3D%22new_donationtype%22%20operator%3D%22eq%22%20value%3D%22100000000%22%20%2F%3E%3C%2Ffilter%3E%3C%2Fentity%3E%3C%2Ffetch%3E", true);
	retrieveReq.setRequestHeader("Accept", "application/json");
	retrieveReq.setRequestHeader("Content-Type", "application/json");
	retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
	retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
	retrieveReq.setRequestHeader("OData-Version", "4.0");
	retrieveReq.onreadystatechange = function ()
	{
		if (retrieveReq.readyState == 4 && retrieveReq.status == 200)
		{
			//Total Donations to campaign in current fiscal year
			var campaignDonations = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				if (o._new_campaign_value)
				{
					if (o._new_campaign_value != null) return o
				}
			});
			console.log("campaignDonations" + campaignDonations);
			var campaignCostTotal = _.reduce(campaignDonations, function (campaignCostTotal, entry)
			{
				if (entry.new_amount > 0) return campaignCostTotal + parseFloat(entry.new_amount);
				else return campaignCostTotal;
			}, 0);
			console.log("campaignCostTotal" + campaignCostTotal);
			if (campaignCostTotal < 1000)
			{
				document.getElementById("CampaignDonationThisYear").innerHTML = "₹" + (Math.round(parseFloat(campaignCostTotal) * 100) / 100).toLocaleString();
			}
			else if (campaignCostTotal >= 1000 && campaignCostTotal < 99999)
			{
				document.getElementById("CampaignDonationThisYear").innerHTML = "₹" + (Math.round(parseFloat(campaignCostTotal) / 1000 * 100) / 100).toLocaleString() + " " + "K";
			}
			else if (campaignCostTotal >= 100000 && campaignCostTotal < 9999999)
			{
				document.getElementById("CampaignDonationThisYear").innerHTML = "₹" + (Math.round(parseFloat(campaignCostTotal) / 100000 * 100) / 100).toLocaleString() + " " + "L";
			}
			else if (campaignCostTotal >= 10000000)
			{
				document.getElementById("CampaignDonationThisYear").innerHTML = "₹" + (Math.round(parseFloat(campaignCostTotal) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
			}
			//Total Donations to events in current fiscal year
			var eventDonations = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				if (o._new_donatetocampevent_value)
				{
					if (o._new_donatetocampevent_value != null) return o
				}
			});
			console.log("eventDonations" + eventDonations);
			var eventDonationTotal = _.reduce(eventDonations, function (eventDonationTotal, entry)
			{
				if (entry.new_amount > 0) return eventDonationTotal + parseFloat(entry.new_amount);
				else return eventDonationTotal;
			}, 0);
			console.log("eventDonationTotal" + eventDonationTotal);
			if (eventDonationTotal < 1000)
			{
				document.getElementById("EventDonationThisYear").innerHTML = "₹" + (Math.round(parseFloat(eventDonationTotal) * 100) / 100).toLocaleString();
			}
			else if (eventDonationTotal >= 1000 && eventDonationTotal < 99999)
			{
				document.getElementById("EventDonationThisYear").innerHTML = "₹" + (Math.round(parseFloat(eventDonationTotal) / 1000 * 100) / 100).toLocaleString() + " " + "K";
			}
			else if (eventDonationTotal >= 100000 && eventDonationTotal < 9999999)
			{
				document.getElementById("EventDonationThisYear").innerHTML = "₹" + (Math.round(parseFloat(eventDonationTotal) / 100000 * 100) / 100).toLocaleString() + " " + "L";
			}
			else if (eventDonationTotal >= 10000000)
			{
				document.getElementById("EventDonationThisYear").innerHTML = "₹" + (Math.round(parseFloat(eventDonationTotal) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
			}
			
			$('.dataset4-Loader').hide();
			$('.dataset4').show();
		}
	};
	retrieveReq.send();
}
// Get Current fiscal year Total Campaign Cost 

function getCurrentYearCampaignCost()
{
	var currentDate = new Date();
	var y = currentDate.getFullYear(),
		m = currentDate.getMonth();
	var firstDay = new Date(y, m, 1);
	var lastDay = new Date(y, m + 1, 0);
	var retrieveReq = new XMLHttpRequest();
	retrieveReq.open("GET", window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/campaigns?fetchXml=%3Cfetch%20version%3D%221.0%22%20output-format%3D%22xml-platform%22%20mapping%3D%22logical%22%20distinct%3D%22false%22%3E%3Centity%20name%3D%22campaign%22%3E%3Cattribute%20name%3D%22name%22%20%2F%3E%3Cattribute%20name%3D%22istemplate%22%20%2F%3E%3Cattribute%20name%3D%22statuscode%22%20%2F%3E%3Cattribute%20name%3D%22campaignid%22%20%2F%3E%3Cattribute%20name%3D%22totalactualcost%22%20%2F%3E%3Cattribute%20name%3D%22new_actstart%22%20%2F%3E%3Corder%20attribute%3D%22name%22%20descending%3D%22true%22%20%2F%3E%3Cfilter%20type%3D%22and%22%3E%3Ccondition%20attribute%3D%22statecode%22%20operator%3D%22eq%22%20value%3D%220%22%20%2F%3E%3Ccondition%20attribute%3D%22new_actstart%22%20operator%3D%22this-fiscal-year%22%20%2F%3E%3C%2Ffilter%3E%3C%2Fentity%3E%3C%2Ffetch%3E", true);
	retrieveReq.setRequestHeader("Accept", "application/json");
	retrieveReq.setRequestHeader("Content-Type", "application/json");
	retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
	retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
	retrieveReq.setRequestHeader("OData-Version", "4.0");
	retrieveReq.onreadystatechange = function ()
	{
		if (retrieveReq.readyState == 4 && retrieveReq.status == 200)
		{
			//Campaigns in current month
			var currMonthcampaigns = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				var actualStartDate = new Date(o.new_actstart);
				if (actualStartDate >= firstDay && actualStartDate <= lastDay) return o
			});
			console.log("currMonthcampaigns" + currMonthcampaigns);
			// Current Month total Campaign cost
			var sum1 = _.reduce(currMonthcampaigns, function (sum1, entry)
			{
				if (entry.totalactualcost > 0) return sum1 + parseFloat(entry.totalactualcost);
				else return sum1;
			}, 0);
			if (sum1 < 1000)
			{
				document.getElementById("campaignCostThisMonth").innerHTML = "₹" + (Math.round(parseFloat(sum1) * 100) / 100).toLocaleString();
			}
			else if (sum1 >= 1000 && sum1 < 99999)
			{
				document.getElementById("campaignCostThisMonth").innerHTML = "₹" + (Math.round(parseFloat(sum1) / 1000 * 100) / 100).toLocaleString() + " " + "K";
			}
			else if (sum1 >= 100000 && sum1 < 9999999)
			{
				document.getElementById("campaignCostThisMonth").innerHTML = "₹" + (Math.round(parseFloat(sum1) / 100000 * 100) / 100).toLocaleString() + " " + "L";
			}
			else if (sum1 >= 10000000)
			{
				document.getElementById("campaignCostThisMonth").innerHTML = "₹" + (Math.round(parseFloat(sum1) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
			}
			// Current Year Campaign cost
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
			document.getElementById("currentMonthTile1").innerHTML = months[date.getMonth()] + ' ' + date.getFullYear();
			$('.dataset1-Loader').hide();
			$('.dataset1').show();
		}
	};
	retrieveReq.send();
}
// Get Current fiscal year Total Event Cost

function getCurrentYearEventCost()
{
	var currentDate = new Date();
	var y = currentDate.getFullYear(),
		m = currentDate.getMonth();
	var firstDay = new Date(y, m, 1);
	var lastDay = new Date(y, m + 1, 0);
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
			//Events in current month
			var currMonthevents = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				var actualStartDate = new Date(o.new_actstart);
				if (actualStartDate >= firstDay && actualStartDate <= lastDay) return o
			});
			console.log("currMonthevents" + currMonthevents);
			// Current Month total Event cost
			var sum1 = _.reduce(currMonthevents, function (sum1, entry)
			{
				if (entry.new_totalcost > 0) return sum1 + parseFloat(entry.new_totalcost);
				else return sum1;
			}, 0);
			if (sum1 < 1000)
			{
				document.getElementById("eventCostThisMonth").innerHTML = "₹" + (Math.round(parseFloat(sum1) * 100) / 100).toLocaleString();
			}
			else if (sum1 >= 1000 && sum1 < 99999)
			{
				document.getElementById("eventCostThisMonth").innerHTML = "₹" + (Math.round(parseFloat(sum1) / 1000 * 100) / 100).toLocaleString() + " " + "K";
			}
			else if (sum1 >= 100000 && sum1 < 9999999)
			{
				document.getElementById("eventCostThisMonth").innerHTML = "₹" + (Math.round(parseFloat(sum1) / 100000 * 100) / 100).toLocaleString() + " " + "L";
			}
			else if (sum1 >= 10000000)
			{
				document.getElementById("eventCostThisMonth").innerHTML = "₹" + (Math.round(parseFloat(sum1) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
			}
			// Current Year Event cost
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
			document.getElementById("currentMonthTile2").innerHTML = months[date.getMonth()] + ' ' + date.getFullYear();
			$('.dataset2-Loader').hide();
			$('.dataset2').show();
		}
	};
	retrieveReq.send();
}
//Date formatter

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
$(document).ready(function ()
{
	$('.dataset1-Loader').show();
	$('.dataset1').hide();
	$('.dataset2-Loader').show();
	$('.dataset2').hide();
	$('.dataset3-Loader').show();
	$('.dataset3').hide();
	$('.dataset4-Loader').show();
	$('.dataset4').hide();
});