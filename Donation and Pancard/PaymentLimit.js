var configRecordID = 0;
var donationAmount = 0;
var paymentMaxLimit = 0;
var PancardExist = 0;
var anonymousLimit = 0;
var anonymousDonation = 0;
var crmHeaders = {
    "Accept": "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "OData-MaxVersion": "4.0",
    "Prefer": 'odata.include-annotations="*"',
    "OData-Version": "4.0"
};

function retreiveCurrentRecord() {
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_organizationsetups(" + configRecordID + ")";
    $.ajax({
        url: odataSelect,
        headers: crmHeaders,
        type: 'GET',
        success: function (result) {
            paymentMaxLimit = result.new_paymentlimit;
            anonymousLimit = result.new_anonymouspaymentlimit;
            donationAmount = window.parent.Xrm.Page.getAttribute("new_amount").getValue();
            PancardExist = window.parent.Xrm.Page.getAttribute("new_pancardexist").getValue();
            anonymousDonation = window.parent.Xrm.Page.getAttribute("new_anonymousdonation").getValue();
            window.parent.Xrm.Page.getAttribute("new_paymentlimit").setValue(result.new_paymentlimit);
            if (anonymousDonation == true) {

                if (donationAmount > anonymousLimit) {
                    Xrm.Page.getControl("new_amount").setNotification("Anonymous Donation Limit is ₹ " + " " + anonymousLimit, 1)
                    //alert("Max Payment Limit is " + paymentMaxLimit)

                    window.parent.Xrm.Page.getAttribute("new_amount").setValue(null);
                }
                else {
                    window.parent.Xrm.Page.getControl("new_amount").clearNotification(1)
                }
            }

            else {
                if (donationAmount > paymentMaxLimit && ((PancardExist == false) || (PancardExist == null))) {
                    Xrm.Page.getControl("new_amount").setNotification("Max Limit is ₹ " + " " + paymentMaxLimit, 1)
                    //alert("Max Payment Limit is " + paymentMaxLimit)

                    window.parent.Xrm.Page.getAttribute("new_amount").setValue(null);
                }
                else {
                    window.parent.Xrm.Page.getControl("new_amount").clearNotification(1)
                }
                window.parent.Xrm.Page.getControl("new_amount").setFocus()
            }
        }
    });
}

function paymentLimit() {
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_organizationsetups";
    $.ajax({
        url: odataSelect,
        headers: crmHeaders,
        type: 'GET',
        success: function (result) {
            if (result.value[0]) {
                var config = result.value[0];
                configRecordID = config.new_organizationsetupid;
                isConfigPresent = true;
                retreiveCurrentRecord();
            }
        }
    });
}