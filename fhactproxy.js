/**
 * A proxy for Sencha Touch data stores which retrieves data from FeedHenry's $fh.act() calls.
 *
 * @author Cian Clarke <cian.clarke@feedhenry.com>
 */

Ext.define('Ext.ux.FhActProxy', {
  extend: 'Ext.data.proxy.Server',
  alias: 'proxy.fhactproxy',

  config: {

    /**
     * @property {string} act
     * The name of the act method to call.
     */
    act: null,

    /**
     * @property {Object/string} req
     * The requests body which will be sent to the act call. If a string is given, it will be used
     * as the key to try to retrieve a corresponding request object from localStorage.
     */
    req: null
  },

  /**
   * Performs the $fh.act() request.
   *
   * @param {Ext.data.Operation} operation The Ext.data.Operation object.
   * @param {Function} callback The callback function to call when the Operation has completed.
   * @param {Object} scope The scope in which to execute the callback.
   */
  doRequest: function doRequest(operation, callback, scope) {
    var self = this,
        actId = this.getAct(),
        req = this.getReq();

    // By convention if we get a string as the request, it's implied that we should check
    // localStorage for a matching request object.
    if (typeof req === 'string') {
      req = localStorage.getItem(req);

      // localStorage will return null if the key doesn't exist, so we must normalise it.
      req = !req ? {} : JSON.parse(req);
    }

    doAct(actId, req);

    function doAct(actId, req) {
      $fh.act({
            'act': actId,
            'req': req
          },
          function (res) {

            // Check for a 'data' or 'records' property if what we got back isn't an array.
            if (toString.call(res) !== '[object Array]') {
              res = res.data || res.records;
            }
            self.processResponse(true, operation, null, res, callback, scope);
          },
          function (err) {
            self.processResponse(false, operation, null, err, callback, scope);
          });
    }
  }
});