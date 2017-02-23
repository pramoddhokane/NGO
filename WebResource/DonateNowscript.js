function generateTransactionData()
{
	var FormType = Xrm.Page.ui.getFormType();
	if (FormType == 3 || FormType == 4)
	{
		var buttonID = "new_donor|NoRelationship|Form|new.new_donor.Button1.Button"; // id of ribbon button
		var btn = window.top.document.getElementById(buttonID);
		if (btn)
		{
			btn.disabled = true;
		}
	}
	else
	{
		var retrieveReq = new XMLHttpRequest();
		var pledgeTransaction = "";
		var getId = parent.Xrm.Page.getAttribute("new_donationpledge").getValue()[0].id.replace(/[{}]/g, "");
		//var getId = parent.Xrm.Page.data.entity.getId().replace(/[{}]/g, "");
		//var centername = parent.Xrm.Page.getAttribute("new_centername").getValue()[0].id.replace(/[{}]/g, "");
		// var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/opportunities?$filter=opportunityid eq " + getId;
		var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/opportunities?$select=_new_branch_value,_new_beneficiary_value,_new_donorname_value,_new_donororganization_value,new_donationtype,new_pledgedate&$filter=opportunityid eq " + getId;
		retrieveReq.open("GET", odataSelect, true);
		retrieveReq.setRequestHeader("Accept", "application/json");
		retrieveReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
		retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations=\"*"');
		retrieveReq.setRequestHeader("OData-Version", "4.0");
		retrieveReq.onreadystatechange = function ()
		{
			if (retrieveReq.readyState == 4 && retrieveReq.status == 200)
			{
				var pledgeTransactionParentDetails = JSON.parse(this.responseText).value[0];
				populateDonationDetails(pledgeTransactionParentDetails);
				// getFilteredChildren(totalChildren, getId);
			}
		};
		retrieveReq.send();
	}
}

function populateDonationDetails(pledgeTransactionParentDetails)
{
	var TransactionRecord = new Object();
	var Flag = false;
	var DonateForFlag = false;
	if (pledgeTransactionParentDetails._new_branch_value != null)
	{
		TransactionRecord["new_Branch@odata.bind"] = "/businessunits(" + pledgeTransactionParentDetails._new_branch_value + ")";
	}
	//if(pledgeTransactionParentDetails.new_donortype !=null)
	//{
	//TransactionRecord["new_donortype"] = pledgeTransactionParentDetails.new_donortype;
	if (pledgeTransactionParentDetails._new_donorname_value != null)
	{
		TransactionRecord["new_DonorName@odata.bind"] = "/contacts(" + pledgeTransactionParentDetails._new_donorname_value + ")";
	}
	if (pledgeTransactionParentDetails._new_donororganization_value != null)
	{
		TransactionRecord["new_DonorOrganization@odata.bind"] = "/accounts(" + pledgeTransactionParentDetails._new_donororganization_value + ")";
	}
	//}	
	//Donate For
	if (parent.Xrm.Page.getAttribute("new_anycause").getValue() != null)
	{
		if (parent.Xrm.Page.getAttribute("new_anycause").getValue())
		{
			DonateForFlag = true;
		}
		TransactionRecord["new_anycause"] = parent.Xrm.Page.getAttribute("new_anycause").getValue();
	}
	if (parent.Xrm.Page.getAttribute("new_cause").getValue() != null)
	{
		TransactionRecord["new_cause@odata.bind"] = "/new_areaofinterests(" + parent.Xrm.Page.getAttribute("new_cause").getValue()[0].id.replace(/[{}]/g, "") + ")";
		DonateForFlag = true;
	}
	if (parent.Xrm.Page.getAttribute("new_donatetocampevent").getValue() != null)
	{
		TransactionRecord["new_donatetocampevent@odata.bind"] = "/new_camps(" + parent.Xrm.Page.getAttribute("new_donatetocampevent").getValue()[0].id.replace(/[{}]/g, "") + ")";
		DonateForFlag = true;
	}
	if (parent.Xrm.Page.getAttribute("new_beneficiary").getValue() != null)
	{
		TransactionRecord["new_Beneficiary@odata.bind"] = "/new_beneficiaries(" + parent.Xrm.Page.getAttribute("new_beneficiary").getValue()[0].id.replace(/[{}]/g, "") + ")";
		DonateForFlag = true;
	}
	if (parent.Xrm.Page.getAttribute("new_campaign").getValue() != null)
	{
		TransactionRecord["new_Campaign@odata.bind"] = "/campaigns(" + parent.Xrm.Page.getAttribute("new_campaign").getValue()[0].id.replace(/[{}]/g, "") + ")";
		DonateForFlag = true;
	}
    /*****Program for Donate Now */
    if (parent.Xrm.Page.getAttribute("new_program").getValue() != null)
	{
		TransactionRecord["new_Program@odata.bind"] = "/new_programs(" + parent.Xrm.Page.getAttribute("new_program").getValue()[0].id.replace(/[{}]/g, "") + ")";
		DonateForFlag = true;
	}
	//Set Sub-pledgeID
	var subpledgeId = Xrm.Page.data.entity.getId().replace(/[{}]/g, "");
	if (subpledgeId != null)
	{
		TransactionRecord["new_SubPledgeID@odata.bind"] = "/new_donors(" + subpledgeId + ")";
	}
	//Set Donation Date
	if (parent.Xrm.Page.getAttribute("new_donationdate").getValue() != null)
	{
		var donationDate = parent.Xrm.Page.getAttribute("new_donationdate").getValue();
		var currentDate = new Date();
//		if (donationDate != null)
//		{
			if (currentDate < donationDate)
			{
				parent.Xrm.Page.getControl("new_donationdate").setNotification("Do not enter Future dates", "ERROR");
				Flag = true;
				//  window.parent.Xrm.Page.getAttribute("new_age").setValue('0');
			}
			else
			{
				TransactionRecord["new_donationreceiveddate"] = formatDate(donationDate);
			}
		//}
	}
	else
	{
		parent.Xrm.Page.getControl("new_donationdate").setNotification("Please enter the Donation Date", "ERROR", "19");
		Flag = true;
	}
	if (parent.Xrm.Page.getAttribute("new_duedate").getValue() != null)
	{
		TransactionRecord["new_donationdate"] = parent.Xrm.Page.getAttribute("new_duedate").getValue();
		//		var currentDateTime = parent.Xrm.Page.getAttribute("new_duedate").getValue();
		//		TransactionRecord["new_donationdate"] = formatDate(currentDateTime);
	}
	else
	{
		parent.Xrm.Page.getControl("new_duedate").setNotification("Please enter the Due Date", "ERROR", "6");
		Flag = true;
	}
	var DonationTypeValue = parent.Xrm.Page.getAttribute("new_donationtype").getValue();
	if (DonationTypeValue != null)
	{
		TransactionRecord["new_donationtype"] = DonationTypeValue;
		//Monetary
		if (DonationTypeValue == "100000000")
		{
			var PaymentMethod = parent.Xrm.Page.getAttribute("new_paymentmethod").getValue();
			if (PaymentMethod != null)
			{
				TransactionRecord["new_paymentmethods1"] = PaymentMethod;
				if (PaymentMethod == 100000001 || PaymentMethod == 100000002)
				{
					if (parent.Xrm.Page.getAttribute("new_transactionid").getValue() != null)
					{
						TransactionRecord["new_transactionid"] = parent.Xrm.Page.getAttribute("new_transactionid").getValue();
					}
					else
					{
						parent.Xrm.Page.getControl("new_transactionid").setNotification("Please enter the Transaction Id", "ERROR", "1");
						Flag = true;
						//parent.Xrm.Page.ui.setFormNotification('Information! Message','INFORMATION','3');
					}
					if (parent.Xrm.Page.getAttribute("new_trasnsactiondate").getValue() != null)
					{
						TransactionRecord["new_transactiondate"] = parent.Xrm.Page.getAttribute("new_trasnsactiondate").getValue();
					}
					else
					{
						parent.Xrm.Page.getControl("new_trasnsactiondate").setNotification("Please enter the Transaction Date", "ERROR", "2");
						Flag = true;
						//parent.Xrm.Page.ui.setFormNotification('Information! Message','INFORMATION','3');
					}
					//TransactionRecord["new_transactiondate"]=parent.Xrm.Page.getAttribute("new_trasnsactiondate").getValue();
				}
				else if (PaymentMethod == 100000003)
				{
					if (parent.Xrm.Page.getAttribute("new_chequeddno").getValue() != null)
					{
						TransactionRecord["new_chequeddno"] = parent.Xrm.Page.getAttribute("new_chequeddno").getValue();
					}
					else
					{
						parent.Xrm.Page.getControl("new_chequeddno").setNotification("Please enter the Cheque/DD No", "ERROR", "3");
						Flag = true;
						//parent.Xrm.Page.ui.setFormNotification('Information! Message','INFORMATION','3');
					}
					if (parent.Xrm.Page.getAttribute("new_chequedate").getValue() != null)
					{
						TransactionRecord["new_chequedate"] = parent.Xrm.Page.getAttribute("new_chequedate").getValue();
					}
					else
					{
						parent.Xrm.Page.getControl("new_chequedate").setNotification("Please enter the Cheque Date", "ERROR", "4");
						Flag = true;
						//parent.Xrm.Page.ui.setFormNotification('Information! Message','INFORMATION','3');
					}
				}
			}
			else
			{
				parent.Xrm.Page.getControl("new_paymentmethod").setNotification("Please Select Payment Method", "ERROR", "5");
				Flag = true;
			}
			// 
			if (parent.Xrm.Page.getAttribute("new_amount").getValue() != null)
			{
				TransactionRecord["new_amount"] = parent.Xrm.Page.getAttribute("new_amount").getValue();
			}
			else
			{
				parent.Xrm.Page.getControl("new_amount").setNotification("Please enter the Amount", "ERROR", "7");
				Flag = true;
			}
		}
		//In-kind
		else if (DonationTypeValue == "100000001")
		{
			if (parent.Xrm.Page.getAttribute("new_goods").getValue() != null)
			{
				TransactionRecord["new_goods"] = parent.Xrm.Page.getAttribute("new_goods").getValue();
			}
			else
			{
				parent.Xrm.Page.getControl("new_goods").setNotification("Please enter the Description", "ERROR", "9");
				Flag = true;
			}
			if (parent.Xrm.Page.getAttribute("new_quantity").getValue() != null)
			{
				TransactionRecord["new_quantity"] = parent.Xrm.Page.getAttribute("new_quantity").getValue();
			}
			else
			{
				parent.Xrm.Page.getControl("new_quantity").setNotification("Please enter the Quantity", "ERROR", "10");
				Flag = true;
			}
			if (parent.Xrm.Page.getAttribute("new_units1").getValue() != null)
			{
				TransactionRecord["new_units1"] = parent.Xrm.Page.getAttribute("new_units1").getValue();
			}
			else
			{
				parent.Xrm.Page.getControl("new_units1").setNotification("Please enter the Units1", "ERROR", "11");
				Flag = true;
			}
			if (parent.Xrm.Page.getAttribute("new_value").getValue() != null)
			{
				TransactionRecord["new_value"] = parent.Xrm.Page.getAttribute("new_value").getValue();
			}
			else
			{
				parent.Xrm.Page.getControl("new_value").setNotification("Please enter the Value", "ERROR", "15");
				Flag = true;
			}
			//	TransactionRecord["new_value"] = parent.Xrm.Page.getAttribute("new_value").getValue();
		}
		if (parent.Xrm.Page.getAttribute("transactioncurrencyid").getValue() != null)
		{
			TransactionRecord["transactioncurrencyid@odata.bind"] = "/transactioncurrencies(" + parent.Xrm.Page.getAttribute("transactioncurrencyid").getValue()[0].id.replace(/[{}]/g, "") + ")";
		}
		else
		{
			parent.Xrm.Page.getControl("transactioncurrencyid").setNotification("Please Select the Currency", "ERROR", "12");
			Flag = true;
		}
	}
	else
	{
		parent.Xrm.Page.getControl("new_donationtype").setNotification("Please Select the Donation Type", "ERROR", "8");
		Flag = true;
	}
	if (pledgeTransactionParentDetails.new_donatetocampevent != null)
	{
		TransactionRecord["new_donateToCampEvent@odata.bind"] = "/new_camps(" + parent.Xrm.Page.getAttribute("new_donatetocampevent").getValue()[0].id.replace(/[{}]/g, "") + ")";
		//	pledgeTransactionParentDetails.new_donatetocampevent.getValue()[0].id;
	}
	if (!Flag)
	{
		if (!DonateForFlag)
		{
			parent.Xrm.Page.getAttribute("new_anycause").setValue(true);
			TransactionRecord["new_anycause"] = true; //parent.Xrm.Page.getAttribute("new_anycause").getValue();						
		}
		//parent.Xrm.Page.getAttribute("new_donationdate").setValue(currentDateTime);
		createTransactionRecords(TransactionRecord);
	}
}

function createTransactionRecords(TransactionRecord)
{
	var retrieveReq = new XMLHttpRequest();
	if (TransactionRecord != null)
	{
		var odataSelect = parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_donationtransactions";
		retrieveReq.open("POST", odataSelect, false);
		retrieveReq.setRequestHeader("Accept", "application/json");
		retrieveReq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		retrieveReq.onreadystatechange = function ()
		{
			if (retrieveReq.readyState == 4 && retrieveReq.status == 204)
			{
				alert("Donation received for this pledge");
				Xrm.Page.data.entity.save();
				// Method Calling
				vId = Xrm.Page.data.entity.getId();
				vEntityName = Xrm.Page.data.entity.getEntityName();
				// changeRecordStatus(vId, vEntityName, 1, 100000001);
				BasicUpdateAccount();
			}
		};
		retrieveReq.send(window.JSON.stringify(TransactionRecord));
	}
	else
	{
		// retrieveAttendanceRecords(getId);
	}
}

function clearFormNotification(fieldname)
{
	Xrm.Page.getControl(fieldname).clearNotification()
}
// To update an entity using HTTP Request PATCH

function UpdateEntity(clientURL, entityId, entityType, entityTobeUpdated)
{
	var req = new XMLHttpRequest();
	//  var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_outingandpicnicattendees(" + guid + ")";
	req.open('PATCH', clientURL + "/api/data/v8.0/" + entityType + "(" + entityId + ")", true);
	req.setRequestHeader("Content-type", "application/json");
	req.setRequestHeader("OData-MaxVersion", "4.0");
	req.setRequestHeader("OData-Version", "4.0");
	req.onreadystatechange = function ()
	{
		if (this.readyState == 4 /* complete */ )
		{
			req.onreadystatechange = null;
			if (this.status == 204)
			{
				Xrm.Page.data.refresh();
				// console.log("Updated " + entityType +" with ID: " + entityId);
			}
			else
			{
				var error = JSON.parse(this.response).error;
				console.log(error.message);
			}
		}
	};
	req.send(JSON.stringify(entityTobeUpdated));
}

function BasicUpdateAccount()
{
	var clientURL = Xrm.Page.context.getClientUrl();
	// Get the GUID id of the record.
	//var accountId = "2D68BA41-CCD8-E511-80DB-C4346BC48EF4";
	var accountId = Xrm.Page.data.entity.getId().replace(/[{}]/g, "");
	// Specify the entity type
	var entityType = "new_donors";
	// Construct the account to be updated with an array of properties that
	// you wish to update the enity for.
	var PledgeTobeUpdated = {};
	PledgeTobeUpdated["statecode"] = 1;
	PledgeTobeUpdated["statuscode"] = 100000001;
	UpdateEntity(clientURL, accountId, entityType, PledgeTobeUpdated);
}

function formatDate(date)
{
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();
	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;
	return [year, month, day].join('-');
}
// Check if entered date is future date

function isFutureDate(fieldName)
{
	window.parent.Xrm.Page.getControl(fieldName).clearNotification();
	var currentDate = new Date();
	if (window.parent.Xrm.Page.getAttribute(fieldName) != null)
	{
		var donationDate = window.parent.Xrm.Page.getAttribute(fieldName).getValue();
		if (donationDate != null)
		{
			if (currentDate < donationDate)
			{
				window.parent.Xrm.Page.getControl(fieldName).setNotification("Do not enter Future dates", "ERROR");
				//  window.parent.Xrm.Page.getAttribute("new_age").setValue('0');
			}
		}
	}
}