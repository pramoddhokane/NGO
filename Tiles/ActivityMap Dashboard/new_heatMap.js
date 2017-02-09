  var pinInfobox;    
             var bingKey = 'AksoGYC07H5DJ7jUjNsKu9NER96-jQb9peHRiIWLdmVKrkoXrBq3W5TuKQmFNuHk';
             //var map;
         var constituentDetails;
             var pushpin; 
             var heatmapLayer = null;
             var DonorLocations = new Array();
             var map = null;
             var donationReceived;
             var donorInfoboxLayer = new Microsoft.Maps.EntityCollection();
             var donorPinLayer = new Microsoft.Maps.EntityCollection();
             
             var constituentInfoboxLayer = new Microsoft.Maps.EntityCollection();
             var constituentPinLayer = new Microsoft.Maps.EntityCollection();
             
             
              function getMap(mapName) {
              
                 var mapOptions = {
                     credentials: bingKey,                   
                     zoom: 5, center: new Microsoft.Maps.Location(20.5937, 78.9629)
                 };
                  //   document.getElementById('map').innerHTML = "";
                 map = new Microsoft.Maps.Map(document.getElementById('map'), mapOptions);
                    // Create the info box for the pushpin
         pinInfobox = new Microsoft.Maps.Infobox(new Microsoft.Maps.Location(0, 0), { visible: false });
         
               if(mapName=="Donations"){
                   donorInfoboxLayer.clear();
                   donorInfoboxLayer.push(pinInfobox);   
                   getDonorDetails();
                }
                else if(mapName=="Constituents"){
                   constituentInfoboxLayer.clear();
                   constituentInfoboxLayer.push(pinInfobox);   
                   getConstituentDetails();
                }
         
         }
         
         function getDonorDetails() {
         
         var retrieveReq = new XMLHttpRequest(); 
         var odataSelect = window.parent.Xrm.Page.context.getClientUrl() +"/api/data/v8.0/accounts?$filter=new_donor eq true and new_totalpaiddonation gt 0 ";
             //    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_accounts";
                 retrieveReq.open("GET", odataSelect, true);
                 retrieveReq.setRequestHeader("Accept", "application/json");
                 retrieveReq.setRequestHeader("Content-Type", "application/json");
                 retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
                 retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
                 retrieveReq.setRequestHeader("OData-Version", "4.0");
                 retrieveReq.onreadystatechange = function () {
                     if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
                     constituentDetails = JSON.parse(this.responseText).value;
                     displayDonationPushpinsOnMap(constituentDetails);
                         
                     }    
                 };       
                 retrieveReq.send();
         }
         
         function displayDonationPushpinsOnMap(constituentDetails){
             DonorLocations = [];
             for(var constituent = 0;constituent<constituentDetails.length;constituent++)
             {                      
                 var constituentid =constituentDetails[constituent];
                 if(constituentid.new_longitude && constituentid.new_latitude )
                 {
                
                 donationReceived = constituentid.new_totalpaiddonation;
                 if(constituentid.new_latitude && constituentid.new_longitude && constituentid.new_latitude != 0 && constituentid.new_longitude != 0)
                  {    
                 // Create location:    
                 var location = new Microsoft.Maps.Location(constituentid.new_latitude, constituentid.new_longitude);          
                 //   Add a nominal multiplier value to the location, for revenue-based   heatmapping:
         
                 if   (donationReceived >= 0) {    
                  // var   locMultiplier = donationReceived / 100000; 
                  
                  
                  if(donationReceived<=1000000){
                   var   locMultiplier = donationReceived/ 100000; 
                  }                
                   else
                   {
                    var   locMultiplier = donationReceived/ 2000000;
                   }  
                   
                   location.multiplier =   locMultiplier;    
                 }
                 
                 DonorLocations.push(location);
                
                 }
         
                 
          }
         }
         
         
         // Construct heatmap layer, using heatmapping module:
           heatmapLayer = new HeatMapLayer(
                 map,
                 [],
                 { 
                 
                 
                  intensity: 0.7,
                 //  radius: 10,
                    radius: 10,
                   unit: 'pixels',
                  // radius: 2000,
                  // unit: 'meters',
                 colourgradient: {
                  0.00: 'rgba(0,255,0,80)',    // Green
                 0.50: 'rgba(255,255,0,120)', // Yellow
                 1.00: 'rgba(255,0,0,150)'    // Red                 
             },
                 });     
          heatmapLayer.SetPoints(DonorLocations); 
         
         }
         
         function getConstituentDetails() {
         
         var retrieveReq = new XMLHttpRequest(); 
         var odataSelect = window.parent.Xrm.Page.context.getClientUrl() +"/api/data/v8.0/accounts";
         //    var odataSelect = window.parent.Xrm.Page.context.getClientUrl() + "/api/data/v8.0/new_accounts";
             retrieveReq.open("GET", odataSelect, true);
             retrieveReq.setRequestHeader("Accept", "application/json");
             retrieveReq.setRequestHeader("Content-Type", "application/json");
             retrieveReq.setRequestHeader("OData-MaxVersion", "4.0");
             retrieveReq.setRequestHeader("Prefer", 'odata.include-annotations="*"');
             retrieveReq.setRequestHeader("OData-Version", "4.0");
             retrieveReq.onreadystatechange = function () {
                 if (retrieveReq.readyState == 4 && retrieveReq.status == 200) {
                 constituentDetails = JSON.parse(this.responseText).value;
                 displayConstituentPushpinsOnMap(constituentDetails);
                     
                 }    
             };       
             retrieveReq.send();
         }
         
         function displayConstituentPushpinsOnMap(constituentDetails){
             DonorLocations = [];
             for(var constituent = 0;constituent<constituentDetails.length;constituent++)
             {                      
                 var constituentid =constituentDetails[constituent];
                 if(constituentid.new_longitude && constituentid.new_latitude )
                 {
               
                 if(constituentid.new_latitude && constituentid.new_longitude && constituentid.new_latitude != 0 && constituentid.new_longitude != 0)
                  {    
                 var location = new Microsoft.Maps.Location(constituentid.new_latitude, constituentid.new_longitude);   
                 }
                 var clientURL= window.parent.Xrm.Page.context.getClientUrl();
                  var pin = new Microsoft.Maps.Pushpin(location, {text: 'C'}); 
                  pin.Title = constituentid.name ;
                  pin.Description ='Constituent Id: '+constituentid.new_organizationid+'<br><a  href="'+clientURL+'/main.aspx?id=%7B'+constituentid.accountid + '%7D&newWindow=true&pagetype=entityrecord&etn=account" target="_blank">Click Here</a>';
                  constituentPinLayer.push(pin);
                  Microsoft.Maps.Events.addHandler(pin, 'click', displayInfobox);
                 }
            }
         
          map.entities.push(constituentPinLayer);
          map.entities.push(constituentInfoboxLayer);   
             
         
         }   
         function displayInfobox(e) {
         pinInfobox.setOptions({title: e.target.Title, description: e.target.Description, visible:true, offset: new Microsoft.Maps.Point(0,25)});
         pinInfobox.setLocation(e.target.getLocation());
         }
         
         function hideInfobox(e) {
         pinInfobox.setOptions({ visible: false });
         }