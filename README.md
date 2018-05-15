## Deprecation Notice
This repository has been deprecated and is not being maintained. It should not be used. If you have any questions, please get in touch with the collaborators.

# Feedhenry Act Call Proxy

FhActProxy is a Sencha User Extension to allow developers to perform a Feedhenry action call to the
cloud through a special type of proxy known as 'fhactproxy'.

## Installation & Usage

### The Basics

The recommended method of including and using this proxy in your own Sencha app is to place the
file in the _sdk/src/ux_ directory of your project and then simply require and reference it within
your project as usual. Example:

    Ext.define('MyApp.model.ExampleModel', {
      extend: 'Ext.data.Model',

      // You need to require the proxy before you can use it.
      requires: ['Ext.ux.FhActProxy'],

      config: {
        fields: ['firstname', 'surname', 'etc'],

        proxy: {

          // Now you can reference the proxy using its alias.
          type: 'fhactproxy',

          // Specify the specific act method from your main.js file to call.
          act: 'getContactNames'
        }
      }
    });

Alternatively, if (for whatever reason) you're not making use of Sencha's Ext.Loader and various
build tools, you can also simply include a reference to the fhactproxy.js file in your HTML file,
after the reference to Sencha's js file. Example:

    ...
    <script src="sdk/sencha-touch-all.js"></script>
    <script src="js/fhactproxy.js"></script>
    ...

### Additional Usage

You can also tell the proxy to send some data through with the proxy using the 'req' parameter. As
well as specifying the name of the act call to use, we could specify some JSON data to send
through:


    ...
    {
      type: 'fhactproxy',
      act: 'getContactNames',
      req: { includePhotos: true, gender: 'male' }
    }
    ...

A clever use of this is to send authentication data through with every request. If we set the req
paramater to a string rather than an object, fhactproxy will automatically look for a
corresponding entry in localStorage and, if found, will JSON.parse() it and use that as the req
object... so, if we store a session object in localStorage after logging in like so:

    var sessionInfo = { sessionId: '8dj237fh2c', timestamp: new Date() }
    localStorage.setItem('sessionInfo', JSON.stringify(sessionInfo));

we can then tell our proxy to use this stored session data with all future requests - since we pass
a string, it will automatically pull the object from localStorage with the key that matches the
value of the `req` parameter. Example:

    ...
    {
      type: 'fhactproxy',
      act: 'getContactNames',

      // Tells fhactproxy to automatically pull the sessionInfo object from localStorage each time.
      req: 'sessionInfo'
    }
    ...


