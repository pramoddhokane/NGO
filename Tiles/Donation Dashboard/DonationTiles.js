var allStudents;
var donationAmount = 0;
var donationCount = 0;
var plannedDonation = 0;
var PaidDonation = 0;
var data = {};
var retrieveReq = new XMLHttpRequest();
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var date = new Date();  

function getTotalDonations() {
    var length;
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donationtransactions?$filter=statuscode eq 100000001 and Microsoft.Dynamics.CRM.Between(PropertyName='new_donationreceiveddate',";
    odataSelect += 'PropertyValues=["' + currentYear + '-01-01T00:00:00Z","' + currentYear + '-12-31T23:59:59Z"])';      
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
             if(donationAmount>=1000){
               document.getElementById("TotalDonationsThisYear").innerHTML ="₹" +(Math.round(parseFloat(donationAmount)/1000 * 100) / 100).toLocaleString() + "K";               
            }
            else
            {                
               document.getElementById("TotalDonationsThisYear").innerHTML = "₹" +(Math.round(donationAmount * 100) / 100).toLocaleString();               
            }
            //document.getElementById("TotalDonationsThisYear").innerHTML = "₹" + donationAmount;
            document.getElementById("DonationThisyear").innerHTML =date.getFullYear();   
        }
    };
    retrieveReq.send();
}
function getPaidDonationDetails() {
    var date = new Date();
    var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth()+1), 1));
    var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    var lastDay1 = lastDay.split('T')[0];
   var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donationtransactions?$filter=statuscode eq 100000001 and Microsoft.Dynamics.CRM.Between(PropertyName='new_donationreceiveddate',";
    odataSelect += 'PropertyValues=["' + firstDay + '","' + lastDay1 + 'T23:59:59Z"])';
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

function getPlannedDonationDetails() {
    var date = new Date();
    var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth()+1), 1));
    var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    var lastDay1 = lastDay.split('T')[0];
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donors?$filter=statuscode eq 1 and Microsoft.Dynamics.CRM.Between(PropertyName='new_duedate',";
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

function totalDonation(data) {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donors?$filter=Microsoft.Dynamics.CRM.Between(PropertyName='new_donationdate',";
    odataSelect += 'PropertyValues=["' + currentYear + '-01-01T00:00:00Z","' + currentYear + '-12-31T23:59:59Z"])';
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
                  //  donationAmount += Math.round(response[don].new_amount);
                    donationAmount += response[don].new_amount;
                }              
            }
            var Average = donationAmount / 12;           
            data.Average = Average;            
            totalDonors(data)
             document.getElementById("AverageDonationthisyear").innerHTML = date.getFullYear();          
        }
    };
    retrieveReq.send();
}

function totalDonors(data) {
    
    var date = new Date();
    var firstDay = getODataUTCDateFilter(new Date(date.getFullYear(), (date.getUTCMonth() + 1), 1));
    var lastDay = getODataUTCDateFilter(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    var lastDay1 = lastDay.split('T')[0];
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/accounts?$filter=new_donor eq true and Microsoft.Dynamics.CRM.Between(PropertyName='createdon',";
    odataSelect += 'PropertyValues=["' + firstDay + 'T00:00:00Z","' + lastDay1 + 'T23:59:59Z"])';  
   // var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/accounts?$filter=new_donor eq true";
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            data.totalDonors = JSON.parse(this.responseText).value.length;
            if(data.PaidDonation>=1000){
               document.getElementById("receiveddonation").innerHTML ="₹" +(Math.round(parseFloat(data.PaidDonation)/1000 * 100) / 100).toLocaleString() + "K";               
            }
            else
            {                
               document.getElementById("receiveddonation").innerHTML = "₹" +(Math.round(data.PaidDonation * 100) / 100).toLocaleString();               
            }
            if(data.plannedDonation>=1000)
            {               
               document.getElementById("expectedDonation").innerHTML ="₹" +(Math.round(parseFloat(data.plannedDonation)/1000 * 100) / 100).toLocaleString() + "K";              
            }
            else
            {
                 document.getElementById("expectedDonation").innerHTML ="₹" + (Math.round(data.plannedDonation * 100) / 100).toLocaleString(); 
            }   
            if(data.Average>=1000)
            {
                document.getElementById("averageDonation").innerHTML ="₹" +(Math.round(parseFloat(data.Average)/1000 * 100) / 100).toLocaleString()+ "K"; 
            }
            else
            {
                document.getElementById("averageDonation").innerHTML = "₹" +(Math.round(data.Average * 100) / 100).toLocaleString();
            }
            
            document.getElementById("donationCount").innerHTML = data.DonationCount;
            document.getElementById("donationCountthismonth").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();  
            document.getElementById("totalDonors").innerHTML = data.totalDonors;
            document.getElementById("totalDonorsthismonth").innerHTML = months[date.getMonth()] + '-' + date.getFullYear();  
            getTotalDonations();
            console.log(data);
        }
    };
    retrieveReq.send();
}


function calculateDonation(res) {
    for (var don = 0; don < res.length; don++) {
        if (res[don].statuscode == 100000001) {
            if (res[don].new_donationtype = 100000000) {
                 PaidDonation +=  Math.round(res[don].new_amount * 100) / 100;
            }
        }
    }
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
                plannedDonation +=  Math.round(res[don].new_amount * 100) / 100;
            }         
        }
    }
     data.plannedDonation=plannedDonation;
     totalDonation(data);
  
}