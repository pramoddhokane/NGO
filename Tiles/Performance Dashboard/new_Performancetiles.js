var allStudents;
var donationAmount = 0;
var donationsResult = 0;
var donationResults = 0;
var duedonationResults = 0;
var data = {};
var retrieveReq = new XMLHttpRequest();
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var date = new Date();

//Time 1 New Members 
function getMemberRegisteredInMonth() {

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
            document.getElementById("membermonth").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();
            getTotalDonations();
        }
    };
    retrieveReq.send();
}
//Time 2 New Members Renewed this month
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
            document.getElementById("membersrenewalmonth").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();
            donorsThisMonth();

        }
    };
    retrieveReq.send();
}

// Tile 3 New Constituents
function newConstituentsThisMonth() {
    var date = new Date();
    var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth() + 1), 1));
    var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    var lastDay1 = lastDay.split('T')[0];
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/accounts?$filter=Microsoft.Dynamics.CRM.Between(PropertyName='new_registrationdate',";
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
            document.getElementById("constituentmonth").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();
            MembersRenewalThisMonth();
        }
    };
    retrieveReq.send();
}
// tile 4 Total donations Till this year.
function getTotalDonations() {

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
            if (donationAmount < 1000) {
                document.getElementById("TotalDonations").innerHTML = "₹" + (Math.round(parseFloat(donationAmount) * 100) / 100).toLocaleString();
            }
            else if (donationAmount >= 1000 && donationAmount < 99999) {
                document.getElementById("TotalDonations").innerHTML = "₹" + (Math.round(parseFloat(donationAmount) / 1000 * 100) / 100).toLocaleString() + " " + "K";
            }
            else if (donationAmount >= 100000 && donationAmount < 9999999) {
                document.getElementById("TotalDonations").innerHTML = "₹" + (Math.round(parseFloat(donationAmount) / 100000 * 100) / 100).toLocaleString() + " " + "L";
            }
            else if (donationAmount >= 10000000) {
                document.getElementById("TotalDonations").innerHTML = "₹" + (Math.round(parseFloat(donationAmount) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
            }
            document.getElementById("donationmonth").innerHTML = "Total Donations Till" + "-" + date.getFullYear();
            newConstituentsThisMonth();
        }
    };
    retrieveReq.send();
}

// tile 5 Total Donars count for this month.
function donorsThisMonth() {
    var date = new Date();
    var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth() + 1), 1));
    var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    var lastDay1 = lastDay.split('T')[0];
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donationtransactions?$filter=statuscode eq 100000003 and Microsoft.Dynamics.CRM.Between(PropertyName='new_donationreceiveddate',";
    odataSelect += 'PropertyValues=["' + firstDay + 'T00:00:00Z","' + lastDay1 + 'T23:59:59Z"])';
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            donationsResult = JSON.parse(this.response).value;
            DonationCount = donationsResult.length;
            document.getElementById("donorsinthismonth").innerHTML = DonationCount;
            document.getElementById("donorsmonth").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();
            dueDonationThisMonth();
        }
    };
    retrieveReq.send();
}

//tile 6 Due donations Count for this month
function dueDonationThisMonth() {
    var date = new Date();
    var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth() + 1), 1));
    var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    var lastDay1 = lastDay.split('T')[0];
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donors?$filter=Microsoft.Dynamics.CRM.Between(PropertyName='new_duedate',";
    odataSelect += 'PropertyValues=["' + firstDay + 'T00:00:00Z","' + lastDay1 + 'T23:59:59Z"])';
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            duedonationResults = JSON.parse(this.response).value.length;
            // data.newMembers = JSON.parse(this.responseText).value.length; 
            document.getElementById("duedonationthismonth").innerHTML = duedonationResults;
            document.getElementById("duedonationmonth").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();
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
    var dateString;
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

