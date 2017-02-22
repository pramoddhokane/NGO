function OnSave(pContext) {
    var SaveMode, SaveEventVal;
    SaveEventVal = 16;
    if (pContext != null && pContext.getEventArgs() != null) {
        SaveMode = pContext.getEventArgs().getSaveMode();
        if (SaveMode == SaveEventVal) {     // 16 will pass on Lead Qualify button click
            setTimeout(function () {
                window.location.reload(true);
                window.top.parent.document.location.reload(true);
                var retrieveReq = new XMLHttpRequest();
                var pledgeTransaction = "";
                if (parent.Xrm.Page.getAttribute("statuscode").getValue() != null) {
                    var status = parent.Xrm.Page.getAttribute("statuscode").getValue();
                }
                if (parent.Xrm.Page.data.entity.getId("leadid") != null) {
                    var getId = parent.Xrm.Page.data.entity.getId("leadid").replace(/[{}]/g, "");
                    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/accounts?$select=_originatingleadid_value&$filter=_originatingleadid_value eq " + getId;
                    retrieveReq.open("GET", odataSelect, false);
                    retrieveReq.setRequestHeader("Accept", "application/json");
                    retrieveReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                    retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
                    retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations=\"*"');
                    retrieveReq.setRequestHeader("OData-Version", "4.0");
                    retrieveReq.onreadystatechange = function () {
                        if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
                            var accountDetail = JSON.parse(this.responseText).value[0];
                            window.parent.Xrm.Utility.openEntityForm("account", accountDetail.accountid);
                        }
                    };
                    retrieveReq.send();
                }
            }, 1500);
        }
    }
}