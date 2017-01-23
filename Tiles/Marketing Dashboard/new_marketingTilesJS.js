var data = {};
var allCampDonations = new Array(5);
var campdonation = {};
var retrieveReq = new XMLHttpRequest();

function getCampaigns() {
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/campaigns?$top=6&$filter=statuscode eq 3";
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            calculateCampaigns(JSON.parse(this.responseText).value);
        }
    };
    retrieveReq.send();
}

function calculateCampaigns(res) {
    for (var camp = 0; camp < res.length; camp++) {
        if (res[camp].new_fundraised) {
            campdonation.fundRaised = res[camp].new_fundraised;
            campdonation.name = res[camp].name;
            campdonation.id = res[camp].campaignid
            allCampDonations[camp] = campdonation.id;
        }
        else {
            campdonation.fundRaised = 0;
            campdonation.name = res[camp].name;
            campdonation.id = res[camp].campaignid
            allCampDonations[camp] = campdonation.id;
        }

        campdonation.record = camp + 1;
        document.getElementById("campaign" + campdonation.record).innerHTML = campdonation.name;

        if (campdonation.fundRaised < 1000) {
            document.getElementById("donation" + campdonation.record).innerHTML = "₹" + (Math.round(parseFloat(campdonation.fundRaised) * 100) / 100).toLocaleString() ;
        }

        if (campdonation.fundRaised > 1000 && campdonation.fundRaised < 99999) {
            document.getElementById("donation" + campdonation.record).innerHTML = "₹" + (Math.round(parseFloat(campdonation.fundRaised) / 1000 * 100) / 100).toLocaleString() + " " + "K";
            // document.getElementById("TotalDonationsThisYear").innerHTML =   donationAmount;
        }
        if (campdonation.fundRaised >= 100000 && campdonation.fundRaised < 9999999) {
            document.getElementById("donation" + campdonation.record).innerHTML = "₹" + (Math.round(parseFloat(campdonation.fundRaised) / 100000 * 100) / 100).toLocaleString() + " " + "L";
            // document.getElementById("TotalDonationsThisYear").innerHTML =   donationAmount;
        }
        if (campdonation.fundRaised >= 10000000) {
            document.getElementById("donation" + campdonation.record).innerHTML = "₹" + (Math.round(parseFloat(campdonation.fundRaised) / 10000000 * 100) / 100).toLocaleString() + " " + "Cr";
            // document.getElementById("TotalDonationsThisYear").innerHTML =   donationAmount;
        }

    }
    getConstituent(1, allCampDonations[0]);
    getConstituent(2, allCampDonations[1]);
    getConstituent(3, allCampDonations[2]);
    getConstituent(4, allCampDonations[3]);
    getConstituent(5, allCampDonations[4]);
    getConstituent(6, allCampDonations[5]);
}
function getConstituent(record, id) {
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/accounts?$filter=_new_source_value eq " + id;
    retrieveReq.open("GET", odataSelect, false);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            campdonation.constituent = JSON.parse(this.responseText).value.length;
            //  allCampDonations.push(campdonation);
            //  console.log(allCampDonations);
            //     document.getElementById("campaign" + campdonation.record).innerHTML = campdonation.name;

            document.getElementById("constituent" + record).innerHTML = campdonation.constituent;

            //     document.getElementById("donation" + campdonation.record).innerHTML = (campdonation.fundRaised / 1000).toLocaleString() + "K";

        }
    };
    retrieveReq.send();
}