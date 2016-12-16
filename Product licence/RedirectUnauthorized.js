'use strict';
var req = new XMLHttpRequest();
var result;
function redirectto() {
    req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_productlicenses", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
    req.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {           
            result = JSON.parse(this.response).value;
            if (result.length !== 0) {
                var licenseDetails = result["new_name"];
                //Xrm.Utility.alertDialog(licenseDetails[0].new_name);
                if (result[0].new_productkey !== "espl@ngoproductlicenses2016") {
                    window.open('https://ngoproduct.crm8.dynamics.com//WebResources/espl_invalidpage.html', '_self');
                }
                else {
                    verifyUserDetails();
                }
            }
            else {
                window.open('https://ngoproduct.crm8.dynamics.com//WebResources/espl_invalidpage.html', '_self');
            }
        }
    };
    req.send();
}

function verifyUserDetails() {
    var userId = window.parent.Xrm.Page.context.getUserId().replace('{', '').replace('}', '');
    req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.0/systemusers?$filter=systemuserid eq " + userId, true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
    req.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var userDetails = JSON.parse(this.response).value;
            if (userDetails.length !== 0) {
                if (!userDetails[0].new_isngoassigned) {
                    window.open('https://ngoproduct.crm8.dynamics.com//WebResources/espl_invalidpage.html', '_self');
                }
                else {
                    var startDate = new Date(result[0].new_startdate)
                    var endDate = new Date(result[0].new_enddate)
                    var gracePeriod = result[0].new_graceperiod;
                    endDate.setDate(endDate.getDate() + gracePeriod);
                    var currentDate = new Date();
                    if (!(currentDate >= startDate) || !(currentDate < endDate)) {
                        window.open('https://ngoproduct.crm8.dynamics.com//WebResources/espl_invalidpage.html', '_self');
                    }
                }
            }

        }
    };
    req.send();
}