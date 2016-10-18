var allStudents;
var donationAmount = 0;
var donationCount = 0;
var plannedDonation = 0;
var PaidDonation = 0;
var data = {};
var retrieveReq = new XMLHttpRequest();

function getMemberRegisteredInMonth() {
    var date = new Date();
    var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth()+1), 1));
    var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    var lastDay1 = lastDay.split('T')[0];
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_members?$filter=Microsoft.Dynamics.CRM.Between(PropertyName='new_registrationdate'),";
    odataSelect += 'PropertyValues=["' + firstDay + '","' + lastDay1 + 'T23:59:59Z"])';
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            data.newRegistrations = JSON.parse(this.responseText).value.length;
          document.getElementById("registrations").innerHTML = data.newRegistrations;
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

 