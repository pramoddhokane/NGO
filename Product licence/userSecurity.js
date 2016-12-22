'use strict';
var req = new XMLHttpRequest();
var totalAssignedUsers;
var userDetails;

function getUserLicenses() {
    req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_productlicenses", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
    req.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (JSON.parse(this.response).value !== 0) {
                userDetails = JSON.parse(this.response).value[0];
                totalAssignedUsers = userDetails.new_assignedusers;
                upadteAssignedLicenses();
            }
        }
    };
    req.send();
}

function upadteAssignedLicenses() {
    var isAssigned = window.parent.Xrm.Page.getAttribute('new_isngoassigned').getValue()
    var assignUser = {};
    if (isAssigned) {
        if (totalAssignedUsers < userDetails.new_userlicenses) {
            assignUser.new_assignedusers = totalAssignedUsers + 1;
        }
        if (totalAssignedUsers >= userDetails.new_userlicenses) {
            window.parent.Xrm.Page.getAttribute('new_isngoassigned').setValue(false)
        }
    }
    else {
        if (!Xrm.Page.getControl('new_isngoassigned').getDisabled()) {
            assignUser.new_assignedusers = totalAssignedUsers - 1;
        }
    }
    if (assignUser) {
        req.open("PATCH", Xrm.Page.context.getClientUrl() + '/api/data/v8.0/new_productlicenses(' + userDetails.new_productlicenseid + ')', true);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
        req.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 204) {
                console.log('Record Updated');
            }
        };
        req.send(JSON.stringify(assignUser));
    }
}

function isUserAssignable() {
    var isAssigned = window.parent.Xrm.Page.getAttribute('new_isngoassigned').getValue();

    window.parent.Xrm.Page.getControl('new_isngoassigned').setDisabled(false);
    req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_productlicenses", true);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
    req.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (JSON.parse(this.response).value !== 0) {
                var userDetail = JSON.parse(this.response).value[0];
                if (userDetail.new_assignedusers >= userDetail.new_userlicenses) {
                    if (!isAssigned) {
                        window.parent.Xrm.Page.getAttribute('new_isngoassigned').setValue(false)
                        window.parent.Xrm.Page.getControl('new_isngoassigned').setDisabled(true);
                    }
                }
                else {
                    window.parent.Xrm.Page.getControl('new_isngoassigned').setDisabled(false);
                }
            }
        }
    };
    req.send();
}