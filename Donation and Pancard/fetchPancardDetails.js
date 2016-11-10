var configRecordID = 0;
var pancardExists = 0;
var pancardId = 0;
var pancardName = 0;
var pancardType = 0;
var crmHeaders = {
    "Accept": "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "OData-MaxVersion": "4.0",
    "Prefer": 'odata.include-annotations="*"',
    "OData-Version": "4.0"
};

function retreiveCurrentRecordPancard() {
    window.parent.Xrm.Page.getAttribute("new_amount").setValue(null);
    window.parent.Xrm.Page.getControl("new_subpledgeid").setFocus();
    configRecordID = configRecordID.replace(/[{}]/g, '');
    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/accounts(" + configRecordID + ")";
    retrieveReq.open("GET", odataSelect, true);
    retrieveReq.setRequestHeader("Accept", "application/json");
    retrieveReq.setRequestHeader("Content-Type", "application/json");
    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    retrieveReq.setRequestHeader("OData-Version", "4.0");
    retrieveReq.onreadystatechange = function () {
        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
            var response = JSON.parse(this.responseText);
            pancardId = response._new_pancard_value;
            //pancardType = response['_new_pancard_value@Microsoft.Dynamics.CRM.lookuplogicalname'];
            //pancardName = response['_new_pancard_value@OData.Community.Display.V1.FormattedValue'];
            pancardExists = response.new_pancardexist;

            /* window.parent.Xrm.Page.getAttribute("new_pancard").setValue([{
                 id: pancardId,
                 name = pancardName,
                 entityType = pancardType,
             }]);*/
            //window.parent.Xrm.Page.getAttribute("new_pancard").setValue(pancardId);
            if (pancardExists == null) {
                window.parent.Xrm.Page.getAttribute("new_pancardexist").setValue(false)
            }
            else {
                window.parent.Xrm.Page.getAttribute("new_pancardexist").setValue(pancardExists)
            }
        }
    };
    retrieveReq.send();
}
function Pancard() {

    var lookupObj = window.parent.Xrm.Page.getAttribute("new_donororganization");
    if (lookupObj != null) {
        var lookupObjValue = lookupObj.getValue();
        if (lookupObjValue != null) {
            configRecordID = lookupObjValue[0].id;
            retreiveCurrentRecordPancard();

        }
    }
}
