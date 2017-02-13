function openWindow() {
 params  = 'width='+screen.width;
 params += ', height='+screen.height;
 params += ', top=0, left=0'
 params += ', fullscreen=yes';

var recordID = window.parent.Xrm.Page.data.entity.getId();
var clientURL = window.parent.Xrm.Page.context.getClientUrl();
var customParameters = encodeURIComponent("EntityID="+recordID+"&URL="+clientURL);
Xrm.Utility.openWebResource("new_espl_ImageGallary",customParameters,screen.width, screen.height);

}