var allStudents;
var donationAmount = 0;
var donationsResult = 0;
var donationResults = 0;
var data = {};
var retrieveReq = new XMLHttpRequest();

function getMemberRegisteredInMonth() {
    var date = new Date();
    var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth() + 1), 1));
    var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    var lastDay1 = lastDay.split('T')[0];
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_members?$filter=Microsoft.Dynamics.CRM.Between(PropertyName='new_registrationdate',";
    odataSelect += 'PropertyValues=["' + firstDay + 'T00:00:00Z","' + lastDay1 + 'T23:59:59Z"])';
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            var results = JSON.parse(this.response).value.length;
            // data.newMembers = JSON.parse(this.responseText).value.length;
            document.getElementById("Memberregistrations").innerHTML = results;
            getTotalDonated();
        }
    };
    retrieveReq.send();
}

function getTotalDonated() {
    var length;
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donationtransactions?$filter=statuscode eq 100000003";
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            donationsResult = JSON.parse(this.response).value;
            for (var donation = 0; donation < donationsResult.length; donation++) {
                donationAmount += donationsResult[donation].new_amount;
            }
            donationAmount = donationAmount - 45000;
            document.getElementById("TotalDonations").innerHTML = donationAmount;
            newConstituentsThisMonth();
        }
    };
    retrieveReq.send();
}

function newConstituentsThisMonth() {
    var date = new Date();
    var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth() + 1), 1));
    var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    var lastDay1 = lastDay.split('T')[0];
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/accounts?$filter=Microsoft.Dynamics.CRM.Between(PropertyName='createdon',";
    odataSelect += 'PropertyValues=["' + firstDay + 'T00:00:00Z","' + lastDay1 + 'T23:59:59Z"])';
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            var results = JSON.parse(this.response).value.length;
            // data.newMembers = JSON.parse(this.responseText).value.length;
            document.getElementById("Constituentsregistrations").innerHTML = results;
            MembersRenewalThisMonth();
        }
    };
    retrieveReq.send();
}

function MembersRenewalThisMonth() {
    var date = new Date();
    var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth() + 1), 1));
    var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    var lastDay1 = lastDay.split('T')[0];
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_members?$filter=Microsoft.Dynamics.CRM.Between(PropertyName='new_lastrenewaldate',";
    odataSelect += 'PropertyValues=["' + firstDay + 'T00:00:00Z","' + lastDay1 + 'T23:59:59Z"])';
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            var results = JSON.parse(this.response).value.length;
            // data.newMembers = JSON.parse(this.responseText).value.length;
            document.getElementById("MembersRenewalThisMonth").innerHTML = results;
            donationThisMonth();

        }
    };
    retrieveReq.send();
}

function donationThisMonth() {
    var date = new Date();
    var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth() + 1), 1));
    var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    var lastDay1 = lastDay.split('T')[0];
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donationtransactions?$filter=Microsoft.Dynamics.CRM.Between(PropertyName='new_donationreceiveddate',";
    odataSelect += 'PropertyValues=["' + firstDay + 'T00:00:00Z","' + lastDay1 + 'T23:59:59Z"])';
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            donationResults = JSON.parse(this.response).value.length;
            // data.newMembers = JSON.parse(this.responseText).value.length;
            document.getElementById("DonationThisMonth").innerHTML = donationResults;
        }
    };
    retrieveReq.send();
}

function getODataUTCDateFilter(date) {
    var monthString;
    var rawMonth = (date.getUTCMonth() + 1).toString();
    if (rawMonth.length == 1) {
        monthString = "0" + rawMonth;
    } else {
        monthString = rawMonth;
    }
    var rawDate = date.getDate().toString();
    if (rawDate.length == 1) {
        dateString = "0" + rawDate;
    } else {
        dateString = rawDate;
    }
    var DateFilter = '';
    DateFilter += date.getUTCFullYear() + "-";
    DateFilter += monthString + "-";
    DateFilter += dateString;
    return DateFilter;
}

