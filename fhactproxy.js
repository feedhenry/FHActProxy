/**
 * @author Cian Clarke
 *
 */
Ext.define('Ext.ux.FHActProxy', {
  extend: 'Ext.data.proxy.Server',

  requires: ['Ext.util.MixedCollection', 'Ext.Ajax'],
  alias: 'proxy.fhactproxy',

  config: {
    /**
     * @property {Object} act
     * Name of the serverside function to call
     */
    act: undefined,

    /**
     * @property {Object} req
     * Request body to be sent with any act call
     */
    req: undefined
  },

  /**
   * Performs FeedHenry request.
   */
  doRequest: function(operation, callback, scope) {
    var writer  = this.getWriter(),
    me = this,
    actId = this.getAct(),
    req = this.getReq();

    if (typeof req === "string"){
      $fh.data({act: 'load', key: req}, function(res){
        req = (res && res.val) ? res.val  : '';
        req = JSON.parse(req);
        doAct(actId, req);
      })
    }else{
      doAct(actId, req);
    }

    function doAct(actId, req){
      $fh.act( {
        'act' : actId,
        'req':req
      },
      function(res){
        // Check for a .data or .records property if what we got back isn't an array
        if (!res.length){
          res = res.data || res.records;
        }
        me.processResponse(true, operation, null, res, callback, scope);
      },
      function(err){
        me.processResponse(false, operation, null, err, callback, scope);
      });
    }
  }
});