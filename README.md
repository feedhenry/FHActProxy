## Deprecation Notice
This repository has been deprecated and is not being maintained. It should not be used. If you have any questions, please get in touch with the collaborators.

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

*New:* You can also tell the proxy to send some data through with the proxy using the 'req' parameter. In our definition of the proxy (as above), as well as specifying the name of the act call to use, we could specify some JSON data to send through:

    {
      type: 'fhact',
      reader: 'json',
      act: 'getNames',
      req: { includePhotos: true, gender: 'male' }
    }

A clever use of this is to send authentication data through with every request. If we set the req paramater to a string, it'll automatically look up $fh.data local storage and retrieve with that key.
So, if we store a session object in $fh.data after log in like so:

    var s = { session: 'a62b81abff3', token: 'f9f0jsefj903' };
    $fh.data({
      act: 'save',
      key: 'sessionData',
      value: JSON.stringify(s)
    });

we can then tell our proxy to use this stored session data with all future request - since we pass a string, it'll automatically pull from $fh.data with the key that matches the value of 'request'.

we can then tell our proxy to use this stored session data with all future request - since we pass a string, it'll automatically pull from $fh.data with the key that matches the value of 'request'.

    {
      type: 'fhact',
      reader: 'json',
      act: 'getNames',
      req: 'sessionData' // this automatically retrieves from $fh.data our session object & sends it thru to the serverside
    }


