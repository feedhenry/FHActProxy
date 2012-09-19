/**
 * A proxy for Sencha Touch data stores which retrieves data from FeedHenry's $fh.act() calls.
 *
 * @author Cian Clarke <cian.clarke@feedhenry.com>
 */

Ext.define('Ext.ux.FHActProxy', {
    extend: 'Ext.data.proxy.Server',
    alias: 'proxy.fhactproxy',

    config: {

        // The name of the act method to call.
        act: null,

        // The requests body which will be sent to the act call (must be an object).
        req: null,

        // We don't want to include some of the default parameters along with our request.
        pageParam: false,
        startParam: false,
        limitParam: false,
        groupParam: false,
        sortParam: false,
        filterParam: false,
        directionParam: false,
        enablePagingParams: false,

        // The default timeout of 30 seconds is far too long for a good mobile user experience.
        timeout: 15000
    },

    /**
     * Performs the $fh.act() request.
     *
     * @param {Ext.data.Operation} operation The Ext.data.Operation object.
     * @param {Function} callback The callback function to call when the Operation has completed.
     * @param {Object} scope The scope in which to execute the callback.
     */
    doRequest: function doRequest(operation, callback, scope) {
        var that = this,
            actId = this.getAct(),
            req = this.getReq(),
            localItem;

        // By convention if we get a string as the request, it's implied that we should check
        // localStorage for a matching request object.
        if (typeof req === 'string') {
            localItem = localStorage.getItem(req);

            // localStorage will return null if the key doesn't exist, so we must normalise it.
            if (!localItem) localItem = '';
            localItem = JSON.parse(localItem);
        }

        doAct(actId, req);

        function doAct(actId, req) {
            $fh.act({
                    'act': actId,
                    'req': req
                },
                function(res) {

                    // Check for a 'data' or 'records' property if what we got back isn't an array.
                    if (!Array.isArray(res)){
                        res = res.data || res.records;
                    }
                    that.processResponse(true, operation, null, res, callback, scope);
                },
                function(err){
                    that.processResponse(false, operation, null, err, callback, scope);
            });
        }
    }
});
