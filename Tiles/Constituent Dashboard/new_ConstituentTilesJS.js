
var data = {};
var retrieveReq = new XMLHttpRequest();
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var date = new Date();
//Tile 1 Donation Received for this month.

function getCurrentMonthAccountDetails()
{
	var date = new Date();
	var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth() + 1), 1));
	var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
	var lastDay1 = lastDay.split('T')[0];
	var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/accounts?$filter=statecode eq 0 and  Microsoft.Dynamics.CRM.Between(PropertyName='new_registrationdate',";
	odataSelect += 'PropertyValues=["' + firstDay + 'T00:00:00Z","' + lastDay1 + 'T23:59:59Z"])';
	//    var odataSelect = window.parent.Xrm.Page.context.getClientUrl()+"/api/data/v8.0/accounts?fetchXml=<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>   <entity name='account'>     <attribute name='new_registrationdate' />     <attribute name='new_serviceprovider' />     <attribute name='new_donor' />     <attribute name='new_volunteer' />     <attribute name='new_membership' />     <attribute name='new_beneficiary' />     <filter type='and'>       <condition attribute='statecode' operator='eq' value='0' /><condition attribute='new_registrationdate' operator='this-month' /></filter></entity></fetch>";
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
			console.log(JSON.parse(this.responseText).value);
			var donorCnt = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				if (o.new_donor === true) return o
			}).length;
			var beneficiaryCnt = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				if (o.new_beneficiary === true) return o
			}).length;
			var memberCnt = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				if (o.new_membership === true) return o
			}).length;
			var volunteerCnt = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				if (o.new_volunteer === true) return o
			}).length;
			var serviceProviderCnt = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				if (o.new_serviceprovider === true) return o
			}).length;
			document.getElementById("currentMonthTile1").innerHTML = document.getElementById("currentMonthTile2").innerHTML = document.getElementById("currentMonthTile3").innerHTML = document.getElementById("currentMonthTile4").innerHTML = document.getElementById("currentMonthTile5").innerHTML = document.getElementById("currentMonthTile6").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();
			document.getElementById("beneficiaryThisMonth").innerHTML = beneficiaryCnt;
			document.getElementById("volunteersThisMonth").innerHTML = volunteerCnt;
			document.getElementById("donorsThisMonth").innerHTML = donorCnt;
			document.getElementById("serviceProvidersThisMonth").innerHTML = serviceProviderCnt;
			document.getElementById("membershipsThisMonth").innerHTML = memberCnt;
			
			getCurrentFiscalYear();
			
		}
	};
	retrieveReq.send();
}

function getCurrentMonthRenewalDetails()
{
	var date = new Date();
	var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth() + 1), 1));
	var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
	var lastDay1 = lastDay.split('T')[0];
	var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_members?$filter=statecode eq 0 and  Microsoft.Dynamics.CRM.Between(PropertyName='new_renewaldate',";
	odataSelect += 'PropertyValues=["' + firstDay + 'T00:00:00Z","' + lastDay1 + 'T23:59:59Z"])';
	//    var odataSelect = window.parent.Xrm.Page.context.getClientUrl()+"/api/data/v8.0/accounts?fetchXml=<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>   <entity name='account'>     <attribute name='new_registrationdate' />     <attribute name='new_serviceprovider' />     <attribute name='new_donor' />     <attribute name='new_volunteer' />     <attribute name='new_membership' />     <attribute name='new_beneficiary' />     <filter type='and'>       <condition attribute='statecode' operator='eq' value='0' /><condition attribute='new_registrationdate' operator='this-month' /></filter></entity></fetch>";
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
			console.log(JSON.parse(this.responseText).value);
			document.getElementById("membershipRenewalsThisMonth").innerHTML = JSON.parse(this.responseText).value.length;
			//getCurrentYearRenewalDetails();
		}
	};
	retrieveReq.send();
}

function getCurrentYearRenewalDetails(firstDate,lastDate)
{
	var currentDate = new Date();
	var lastYear = firstDate.getFullYear();
	var currentYear=lastDate.getFullYear();	
	
	var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_members?$filter=statecode eq 0 and  Microsoft.Dynamics.CRM.Between(PropertyName='new_renewaldate',";
	odataSelect += 'PropertyValues=["' + firstDate.toISOString() + '","' + lastDate.toISOString() + '"])';
	//    var odataSelect = window.parent.Xrm.Page.context.getClientUrl()+"/api/data/v8.0/accounts?fetchXml=<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>   <entity name='account'>     <attribute name='new_registrationdate' />     <attribute name='new_serviceprovider' />     <attribute name='new_donor' />     <attribute name='new_volunteer' />     <attribute name='new_membership' />     <attribute name='new_beneficiary' />     <filter type='and'>       <condition attribute='statecode' operator='eq' value='0' /><condition attribute='new_registrationdate' operator='this-month' /></filter></entity></fetch>";
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
			console.log(JSON.parse(this.responseText).value);
			document.getElementById("membershipRenewalsThisYear").innerHTML = JSON.parse(this.responseText).value.length;
				getCurrentMonthRenewalDetails();
		}
	};
	retrieveReq.send();
}


function getCurrentFiscalYear()
{
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
				
				var fiscalcalendarend = new Date(new Date().setFullYear(fiscalcalendarstart.getFullYear() + 1,fiscalcalendarstart.getMonth(),fiscalcalendarstart.getDate()));
				console.log("lastday"+fiscalcalendarend);
				
				getCurrentYearAccountDetails(fiscalcalendarstart,fiscalcalendarend);
			
			}
			else
			{
				Xrm.Utility.alertDialog(this.statusText);
			}
		}
	};
	req.send();
}

function getCurrentYearAccountDetails(firstDate,lastDate)
{
	//var length;
	var currentDate = new Date();
	var lastYear = firstDate.getFullYear();
	var currentYear=lastDate.getFullYear();
	var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/accounts?$filter=statecode eq 0 and  Microsoft.Dynamics.CRM.Between(PropertyName='new_registrationdate',";
	//var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donationtransactions?$filter=statuscode eq 100000003 and Microsoft.Dynamics.CRM.Between(PropertyName='new_donationreceiveddate',";
	odataSelect += 'PropertyValues=["' + firstDate.toISOString() + '","' + lastDate.toISOString() + '"])';
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
			console.log(JSON.parse(this.responseText).value);
			var donorCnt = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				if (o.new_donor === true) return o
			}).length;
			var beneficiaryCnt = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				if (o.new_beneficiary === true) return o
			}).length;
			var memberCnt = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				if (o.new_membership === true) return o
			}).length;
			var volunteerCnt = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				if (o.new_volunteer === true) return o
			}).length;
			var serviceProviderCnt = _.filter(JSON.parse(this.responseText).value, function (o)
			{
				if (o.new_serviceprovider === true) return o
			}).length;
			document.getElementById("forFinancialYearTile1").innerHTML = document.getElementById("currentMonthTile2").innerHTML = document.getElementById("currentMonthTile3").innerHTML = document.getElementById("currentMonthTile4").innerHTML = document.getElementById("currentMonthTile5").innerHTML = document.getElementById("currentMonthTile6").innerHTML = months[date.getMonth()] + ' ' + date.getFullYear();
			document.getElementById("beneficiaryThisYear").innerHTML = beneficiaryCnt;
			document.getElementById("volunteersThisYear").innerHTML = volunteerCnt;
			document.getElementById("donorsThisYear").innerHTML = donorCnt;
			document.getElementById("serviceProvidersThisYear").innerHTML = serviceProviderCnt;
			document.getElementById("membershipsThisYear").innerHTML = memberCnt;
			document.getElementById("forFinancialYearTile1").innerHTML = document.getElementById("forFinancialYearTile2").innerHTML = document.getElementById("forFinancialYearTile3").innerHTML = document.getElementById("forFinancialYearTile4").innerHTML = document.getElementById("forFinancialYearTile5").innerHTML = document.getElementById("forFinancialYearTile6").innerHTML = lastYear+'-'+currentYear;
			
			getCurrentYearRenewalDetails(firstDate,lastDate);
			
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


