using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceModel;
using System.Runtime.Serialization;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace AutoNumberGenerationPlugin
{
    public class AutoNumber : IPlugin
    {
        IPluginExecutionContext context;
        IOrganizationServiceFactory serviceFactory;
        IOrganizationService service;
        Entity entity, currentEntity;
        public void Execute(IServiceProvider serviceProvider)
        {
            context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            service = serviceFactory.CreateOrganizationService(context.UserId);
            string prefix = string.Empty;
            double initialCounter = 0;
            double createRecords = 0;
            if (context.InputParameters.Contains("Target") &&
                context.InputParameters["Target"] is Entity)
            {
                entity = (Entity)context.InputParameters["Target"];
                string getAutoNumberDetails = @"<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>
                                                  <entity name='new_recordcodecounter'>
                                                    <attribute name='new_name' />
                                                    <attribute name='new_recordcodecounterid' />
                                                    <attribute name='new_prefix' />
                                                    <attribute name='new_initialcounter' />
                                                    <attribute name='new_createdrecords' />
                                                    <order attribute='new_name' descending='false' />
                                                    <filter type='and'>
                                                      <condition attribute='new_name' operator='eq' value='" + entity.LogicalName + "' /></filter></entity></fetch>";
                EntityCollection cntDetails = service.RetrieveMultiple(new FetchExpression(getAutoNumberDetails));

                if (cntDetails.Entities.Count == 0)
                {
                    return;
                }
                else if (cntDetails.Entities.Count > 1)
                {
                    return;
                }
                else if (cntDetails.Entities.Count == 1)
                {
                    Entity recordCounter = cntDetails.Entities[0];
                    if (recordCounter.Contains("new_prefix"))
                    {
                        prefix = recordCounter.Attributes["new_prefix"].ToString();
                    }
                    if (recordCounter.Contains("new_createdrecords"))
                    {
                        createRecords = (double)recordCounter.Attributes["new_createdrecords"];
                    }
                }
            }
        }
    }
}
