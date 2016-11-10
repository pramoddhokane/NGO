var config, configRecordID, isConfigPresent;
var crmHeaders = {
    "Accept": "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "OData-MaxVersion": "4.0",
    "Prefer": 'odata.include-annotations="*"',
    "OData-Version": "4.0"
};

function reDirectBusinessUnit() {
    var organizationURL = window.parent.Xrm.Page.context.getClientUrl();
    window.open(organizationURL + "/main.aspx?etn=businessunit&pagetype=entitylist", "", "width=1000,height=600");
}

function reDirectUsers() {
    var organizationURL = window.parent.Xrm.Page.context.getClientUrl();
    window.open(organizationURL + "/main.aspx?etn=systemuser&pagetype=entitylist", "", "width=1000,height=600");
}

function reDirectCurrency() {
    var organizationURL = window.parent.Xrm.Page.context.getClientUrl();
    window.open(organizationURL + "/tools/personalsettings/dialogs/personalsettings.aspx?dType=1", "", "width=1000,height=600");
}

function reDirectTimeZone() {
    var organizationURL = window.parent.Xrm.Page.context.getClientUrl();
    window.open(organizationURL + "/tools/personalsettings/dialogs/personalsettings.aspx?dType=1", "", "width=1000,height=600");
}

function reDirectDocument() {
    var organizationURL = window.parent.Xrm.Page.context.getClientUrl();
    window.open(organizationURL + "/main.aspx?etn=new_documentconfiguration&pagetype=entitylist", "", "width=1000,height=600");
}

function reDirectMemberShipLevels() {
    var organizationURL = window.parent.Xrm.Page.context.getClientUrl();
    window.open(organizationURL + "/main.aspx?etn=new_subscriptionfees&pagetype=entitylist", "", "width=1000,height=600");
}

function reDirectToThemes() {
    var organizationURL = window.parent.Xrm.Page.context.getClientUrl();
    window.open(organizationURL + "/main.aspx?etn=theme&pagetype=entitylist", "", "width=1000,height=600");
}

function appendCurrentConfiguration(config) {
    $('#OrgType').prop('checked', config.new_organizationtype);
    $('#OrgName').val(config.new_name);
    $('#PanCard').val(config.new_pancardnumber);
    $('#Tan').val(config.new_tannumber);
    $('#PaymentLimit').val(config.new_paymentlimit);
    $('#AnonymousPaymentLimit').val(config.new_anonymouspaymentlimit);
    $("[name='switch-checkbox']").bootstrapSwitch();
}

function configuration() {
    var configSetup = (isConfigPresent) ? updateConfigurationRecord() : CreateConfigurationRecord();
}

function retreiveCurrentConfiguration() {
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
                appendCurrentConfiguration(config);
            }
        }
    });
}

function updateConfigurationRecord(config) {
    var orgType = $('#OrgType').prop('checked');
    var anonymouspaymentlimit=$('#AnonymousPaymentLimit').val();
    var panCard = $('#PanCard').val();
    var tanCard = $('#Tan').val();
    var orgName = $('#OrgName').val();
    var paymentLimit = $('#PaymentLimit').val();//ano
    if (orgName) {
        var upDateConfigRecord = {
            new_organizationtype: orgType,
            new_anonymouspaymentlimit:anonymouspaymentlimit,
            new_name: orgName,
            new_pancardnumber: panCard,
            new_tannumber: tanCard
        };
        if (paymentLimit) {
            upDateConfigRecord.new_paymentlimit = paymentLimit
        }
        var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_organizationsetups(" + configRecordID + ")";
        $.ajax({
            url: odataSelect,
            headers: crmHeaders,
            type: 'PATCH',
            data: window.JSON.stringify(upDateConfigRecord),
            success: function (result) { }
        });
    }
}
function CreateConfigurationRecord() {
    var orgType = $('#OrgType').prop('checked');
    var anonymouspaymentlimit=$('#AnonymousPaymentLimit').val();
    var panCard = $('#PanCard').val();
    var tanCard = $('#Tan').val();
    var orgName = $('#OrgName').val();
    var paymentLimit = $('#PaymentLimit').val();//ano
    if (orgName) {
        var newConfigRecord = {
            new_organizationtype: orgType,
            new_anonymouspaymentlimit:AnonymousPaymentLimit,
            new_name: orgName,
            new_pancardnumber: panCard,
            new_tannumber: tanCard
        };
        if (paymentLimit) {
            newConfigRecord.new_paymentlimit = paymentLimit
        }
        var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_organizationsetups";
        $.ajax({
            url: odataSelect,
            headers: crmHeaders,
            type: 'POST',
            data: window.JSON.stringify(newConfigRecord),
            success: function (result) { }
        });
    }

}