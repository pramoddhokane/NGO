function preFilterLookup() {
    var serviceProvider = Xrm.Page.getAttribute("new_serviceproviderid");
    if (serviceProvider != null) {
        var spDetails = parent.Xrm.Page.getAttribute("new_serviceproviderid").getValue();
        if (spDetails) {
            var VolunteerName = spDetails[0].keyValues.new_serviceprovidername_calculated.value;
            Xrm.Page.getAttribute("new_name").setValue(VolunteerName);
          //  getEventActivities(eventObj[0].id.replace(/[{}]/g, ""), spDetails[0].id.replace(/[{}]/g, ""));
        }
    }
}

function eventActivityPreSearch() {
    Xrm.Page.getControl("new_campactivityname").addPreSearch(function () {
        getEventActivity();
    });
}

function getEventActivity() {
    var event = Xrm.Page.getAttribute("new_event");
    if (event) {
        var eventDetails = parent.Xrm.Page.getAttribute("new_event").getValue();
        if (eventDetails) {
            fetchXml = "<filter type='and'><condition attribute='new_usedforcamp' operator='eq' value='" + eventDetails[0].id+ "' /></filter>";
            Xrm.Page.getControl("new_campactivityname").addCustomFilter(fetchXml);
        }
    }

}


