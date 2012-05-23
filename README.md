# Feedhenry Act Call Proxy

FHActProxy is a Sencha User Extension to allow developers to perform a Feedhenry action call to the cloud through a special type of proxy known as 'fhact'. 

## Installation
To use the FHActProxy, simply include the file in the head of your HTML: 

    <script type="text/javascript" src="js/FHActProxy.js"></script>

This script should be included immediately after sencha-touch.js. 

## Usage
Register a Sencha model for your store, referencing the 'fhact' proxy. The id is the name of the cloud action call that the proxy references. 

    Ext.define('listModel', {
      extend: "Ext.data.Model",
      config: {
        fields: ['name', 'phone'],
        proxy : {
            type: 'fhact',
            reader: 'json',
            act: 'getNames' // the name of an act call (a function in the cloud)
        }
      }
    });

Connect your store to this model:
  
    Ext.define('listStore',{
      extend:'Ext.data.Store',
      config: {
        model : 'listModel',
        autoLoad: true
      }
    });

Here's an example cloud action call loading some data to work with this store:

    function getNames(){
      var records = [
              {
                name : 'John',
                phone : '123'
              },
              {
                name : 'Mary',
                phone : '456'
              }
              ];
      return { data: records};
    }
