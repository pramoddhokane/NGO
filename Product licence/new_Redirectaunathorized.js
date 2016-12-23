function redirectto()
{


var req = new XMLHttpRequest();
req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_productlicenses()?$select=new_enddate,new_productkey,new_graceperiod,new_name,new_productlicenseid,new_startdate,new_userlicenses", true);
req.setRequestHeader("OData-MaxVersion", "4.0");
req.setRequestHeader("OData-Version", "4.0");
req.setRequestHeader("Accept", "application/json");
req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
req.onreadystatechange = function() {
    if (this.readyState === 4) {
    
      req.onreadystatechange = null;
        if (this.status === 200) {
            var result = JSON.parse(this.response).value;
            
                        
            var licenseDetails = result["new_name"];
            
            //Xrm.Utility.alertDialog(licenseDetails[0].new_name);
           
            
            if(result[0].new_productkey !== "espl@ngoproductlicenses2016")
            {
             window.open('https://ngoproduct.crm8.dynamics.com//WebResources/espl_invalidpage.html', '_self');
            }
        } else {
            Xrm.Utility.alertDialog(this.statusText);
        }
    }
};
req.send();

}
