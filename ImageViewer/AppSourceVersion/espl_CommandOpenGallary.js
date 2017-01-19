function openWindow()
{		
	var recordID = window.parent.Xrm.Page.data.entity.getId();
	var clientURL = window.parent.Xrm.Page.context.getClientUrl();
	var entityName = window.parent.Xrm.Page.data.entity.getEntityName(); 	
	var entitysetName = window.parent.Xrm.Page.data.entity.getEntitySetName();
	
	var customParameters = encodeURIComponent("EntityID=" + recordID + "&URL=" + clientURL + "&EntityName=" + entityName + "&EntitySetName=" + entitysetName);
	Xrm.Utility.openWebResource("espl_ImageGallary.html", customParameters, screen.width, screen.height);
}

