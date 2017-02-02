var allStudents;
var differedDonationAmount = 0;
var canceledDonationsAmount=0;
var donationAmount = 0;
var donationCount = 0;
var UnpaidDonationAmount = 0;
var plannedDonation = 0;
var PaidDonation = 0;
var data = {};
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if(dd<10){
    dd='0'+dd;
} 
if(mm<10){
    mm='0'+mm;
} 
var today = dd+'/'+mm+'/'+yyyy;
data.GrandTotal = 0;
data.DifferedPercentage=0;
data.canceledPercentage=0;
var retrieveReq = new XMLHttpRequest();
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var date = new Date();

//Tile 1 Donation Received for this month.
function getPaidDonationDetails() {
    var date = new Date();
    var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth() + 1), 1));
    var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    var lastDay1 = lastDay.split('T')[0];
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donationtransactions?$filter=statuscode eq 100000003 and  Microsoft.Dynamics.CRM.Between(PropertyName='new_donationreceiveddate',";
    odataSelect += 'PropertyValues=["' + firstDay + 'T00:00:00Z","' + lastDay1 + 'T23:59:59Z"])';
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            calculateDonation(JSON.parse(this.responseText).value);
            document.getElementById("receiveddonationthismonth").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();
        }
    };
    retrieveReq.send();
}

//tile 2 Expected Donation for this month.
function getPlannedDonationDetails() {
    var date = new Date();
    var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth() + 1), 1));
    var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    var lastDay1 = lastDay.split('T')[0];
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donors?$filter=statuscode eq 1 and new_donationtype eq 100000000 and Microsoft.Dynamics.CRM.Between(PropertyName='new_duedate',";
    odataSelect += 'PropertyValues=["' + firstDay + '","' + lastDay1 + 'T23:59:59Z"])';
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            calculatePlannedDonation(JSON.parse(this.responseText).value);
            document.getElementById("ExpectedDonationthismonth").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();
        }
    };
    retrieveReq.send();
}

//Tile 4 differedDonation .
function differedDonations() {

    var date = new Date();
    var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth() + 1), 1));
    var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    var lastDay1 = lastDay.split('T')[0];
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donors?$filter=statuscode eq 2 and Microsoft.Dynamics.CRM.Between(PropertyName='new_duedate',";
    odataSelect += 'PropertyValues=["' + firstDay + 'T00:00:00Z","' + lastDay1 + 'T23:59:59Z"])';
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            var response = JSON.parse(this.responseText).value;
            for (var don = 0; don < response.length; don++) {
                if (response[don].new_donationtype = 100000000) {
                    differedDonationAmount += response[don].new_amount;
                }
            }
            var Differed = differedDonationAmount;
            data.Differed = Differed;
            data.GrandTotal += Differed;
            canceledDonations();
            document.getElementById("differedDonationsthisyear").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();
        }
    };
    retrieveReq.send();
}

//Tile 5 CanceledDonations.
function canceledDonations() {

    var date = new Date();
    var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth() + 1), 1));
    var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    var lastDay1 = lastDay.split('T')[0];
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donors?$filter=statuscode eq 100000002 and Microsoft.Dynamics.CRM.Between(PropertyName='new_duedate',";
    odataSelect += 'PropertyValues=["' + firstDay + 'T00:00:00Z","' + lastDay1 + 'T23:59:59Z"])';
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            var response = JSON.parse(this.responseText).value;
            for (var don = 0; don < response.length; don++) {
                if (response[don].new_donationtype = 100000000) {
                    canceledDonationsAmount += response[don].new_amount;
                }
            }
            var canceled = canceledDonationsAmount;
            data.canceled = canceled;
            data.GrandTotal += canceled;
            unpaidDonations();

            document.getElementById("canceledDonationsthisyear").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();
        }
    };
    retrieveReq.send();
}

// Tile 6 Total Donations for the current Year
function getTotalDonations() {
    var length;
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donationtransactions?$filter=statuscode eq 100000003 and Microsoft.Dynamics.CRM.Between(PropertyName='new_donationreceiveddate',";
    odataSelect += 'PropertyValues=["' + currentYear + '-01-01T00:00:00Z","' + currentYear + '-12-31T23:59:59Z"])';
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            donationsResult = JSON.parse(this.response).value;
            for (var donation = 0; donation < donationsResult.length; donation++) {
                donationAmount += donationsResult[donation].new_amount;
            }
            document.getElementById("DonationThisyear").innerHTML = date.getFullYear();
            if (donationAmount < 1000) {
                document.getElementById("TotalDonationsThisYear").innerHTML = "₹" + (Math.round(parseFloat(donationAmount) * 100) / 100).toLocaleString();
            }
            else if (donationAmount >= 1000 && donationAmount < 99999) {
                document.getElementById("TotalDonationsThisYear").innerHTML = "₹" + (Math.round(parseFloat(donationAmount) / 1000 * 100) / 100).toLocaleString() + " " + "K";
            }
            else if (donationAmount >= 100000 && donationAmount < 9999999) {
                document.getElementById("TotalDonationsThisYear").innerHTML = "₹" + (Math.round(parseFloat(donationAmount) / 100000 * 100) / 100).toLocaleString() + " " + "L";
            }
            else if (donationAmount >= 10000000) {
                document.getElementById("TotalDonationsThisYear").innerHTML = "₹" + (Math.round(parseFloat(donationAmount) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
            }
            getTotalnumberOfDonationsCurrentMonth();
        }
    };
    retrieveReq.send();
}

function unpaidDonations() {

    var date = new Date();
    var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth() + 1), 1));
    var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    var lastDay1 = lastDay.split('T')[0];
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donors?$filter=statuscode eq 1 and Microsoft.Dynamics.CRM.Between(PropertyName='new_duedate',";
    odataSelect += 'PropertyValues=["' + firstDay + 'T00:00:00Z","' + lastDay1 + 'T23:59:59Z"])';
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            var response = JSON.parse(this.responseText).value;
            for (var don = 0; don < response.length; don++) {
                if (response[don].new_donationtype = 100000000 && response[don]['new_duedate@OData.Community.Display.V1.FormattedValue']<=today) {
                    UnpaidDonationAmount += response[don].new_amount;
                }
            }
            var Unpaid = UnpaidDonationAmount;
            data.Unpaid = Unpaid;
            totalDonors(data)
             document.getElementById("UnpaidDonationsthisyear").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();
        }
    };
    retrieveReq.send();
}


// Tile  5 Total Donors for the current month
function totalDonors(data) {

    var date = new Date();
    var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth() + 1), 1));
    var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    var lastDay1 = lastDay.split('T')[0];
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/accounts?$filter=new_donor eq true and Microsoft.Dynamics.CRM.Between(PropertyName='new_registrationdate',";
    odataSelect += 'PropertyValues=["' + firstDay + 'T00:00:00Z","' + lastDay1 + 'T23:59:59Z"])';
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            data.totalDonors = JSON.parse(this.responseText).value.length;
            if (data.PaidDonation < 1000) {
                document.getElementById("receiveddonation").innerHTML = "₹" + (Math.round(parseFloat(data.PaidDonation) * 100) / 100).toLocaleString();
            }

            else if (data.PaidDonation >= 1000 && data.PaidDonation < 99999) {
                document.getElementById("receiveddonation").innerHTML = "₹" + (Math.round(parseFloat(data.PaidDonation) / 1000 * 100) / 100).toLocaleString() + " " + "K";
            }
            else if (data.PaidDonation >= 100000 && data.PaidDonation < 9999999) {
                document.getElementById("receiveddonation").innerHTML = "₹" + (Math.round(parseFloat(data.PaidDonation) / 100000 * 100) / 100).toLocaleString() + " " + "L";
            }
            else if (data.PaidDonation >= 10000000) {
                document.getElementById("receiveddonation").innerHTML = "₹" + (Math.round(parseFloat(data.PaidDonation) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
            }
            /******************************************************************************************** */
            if (data.plannedDonation < 1000) {
                document.getElementById("expectedDonation").innerHTML = "₹" + (Math.round(parseFloat(data.plannedDonation) * 100) / 100).toLocaleString();
            }
            else if (data.plannedDonation >= 1000 && data.plannedDonation < 99999) {
                document.getElementById("expectedDonation").innerHTML = "₹" + (Math.round(parseFloat(data.plannedDonation) / 1000 * 100) / 100).toLocaleString() + " " + "K";
            }
            else if (data.plannedDonation >= 100000 && data.plannedDonation < 9999999) {
                document.getElementById("expectedDonation").innerHTML = "₹" + (Math.round(parseFloat(data.plannedDonation) / 100000 * 100) / 100).toLocaleString() + " " + "L";
            }
            else if (data.plannedDonation >= 10000000) {
                document.getElementById("expectedDonation").innerHTML = "₹" + (Math.round(parseFloat(data.plannedDonation) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
            }

            /***************************************************************************************** */
            data.DifferedPercentage = (data.Differed * 100) / data.GrandTotal;
            document.getElementById("differedDonation").innerHTML = (Math.round(parseFloat(data.DifferedPercentage) * 100) / 100).toLocaleString() + "%";

            /***************************************************************************************** */
           data.canceledPercentage=(data.canceled * 100)/data.GrandTotal;
                document.getElementById("canceledDonations").innerHTML = (Math.round(parseFloat( data.canceledPercentage) * 100) / 100).toLocaleString()+"%";
          
            /************************************************************************************************ */
            if (data.Unpaid < 1000) {
                document.getElementById("UnpaidDonationAmount").innerHTML = "₹" + (Math.round(parseFloat(data.Unpaid) * 100) / 100).toLocaleString();
            }
            else if (data.Unpaid >= 1000 && data.Unpaid < 99999) {
                document.getElementById("UnpaidDonationAmount").innerHTML = "₹" + (Math.round(parseFloat(data.Unpaid) / 1000 * 100) / 100).toLocaleString() + " " + "K";
            }
            if (data.Unpaid >= 100000 && data.Unpaid < 9999999) {
                document.getElementById("UnpaidDonationAmount").innerHTML = "₹" + (Math.round(parseFloat(data.Unpaid) / 100000 * 100) / 100).toLocaleString() + " " + "L";
            }
            if (data.Unpaid >= 10000000) {
                document.getElementById("UnpaidDonationAmount").innerHTML = "₹" + (Math.round(parseFloat(data.Unpaid) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
            }
            /************************************************************************************************ */


            // document.getElementById("totalDonors").innerHTML = data.totalDonors;
            //  document.getElementById("totalDonorsthismonth").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();
            getTotalDonations();

            console.log(data);
        }
    };
    retrieveReq.send();
}


function calculateDonation(res) {
    for (var don = 0; don < res.length; don++) {
        if (res[don].statuscode == 100000003) {
            if (res[don].new_donationtype = 100000000) {
                PaidDonation += Math.round(res[don].new_amount * 100) / 100;
            }
        }
    }
    data.GrandTotal += PaidDonation;
    data.PaidDonation = PaidDonation;
    data.DonationCount = res.length;
    getPlannedDonationDetails(data);
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

function calculatePlannedDonation(res) {
    for (var don = 0; don < res.length; don++) {
        if (res[don].statuscode == 1) {
            if (res[don].new_donationtype = 100000000) {
                plannedDonation += Math.round(res[don].new_amount * 100) / 100;
            }
        }
    }
    data.plannedDonation = plannedDonation;
    data.GrandTotal += plannedDonation;
    differedDonations();

}

function getCurrentFiscalYear() {
    var req = new XMLHttpRequest();
    req.open("GET", window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/organizations()?$select=fiscalcalendarstart", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var result = JSON.parse(this.responseText).value;
                fiscalcalendarstart = new Date(result[0]["fiscalcalendarstart"]);

                var fiscalcalendarend = new Date(new Date().setFullYear(fiscalcalendarstart.getFullYear() + 1, fiscalcalendarstart.getMonth(), fiscalcalendarstart.getDate()));
                console.log("lastday" + fiscalcalendarend);

                getCurrentYearAccountDetails(fiscalcalendarstart, fiscalcalendarend);

            }
            else {
                Xrm.Utility.alertDialog(this.statusText);
            }
        }
    };
    req.send();
}

function getODataUTCDateFilter(date) {
    var monthString;
    var rawMonth = (date.getUTCMonth() + 1).toString();
    if (rawMonth.length == 1) {
        monthString = "0" + rawMonth;
    }
    else {
        monthString = rawMonth;
    }
    var dateString;
    var rawDate = date.getDate().toString();
    if (rawDate.length == 1) {
        dateString = "0" + rawDate;
    }
    else {
        dateString = rawDate;
    }
    var DateFilter = '';
    DateFilter += date.getUTCFullYear() + "-";
    DateFilter += monthString + "-";
    DateFilter += dateString;
    return DateFilter;
}