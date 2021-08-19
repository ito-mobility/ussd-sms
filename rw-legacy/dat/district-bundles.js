/**
 * Fetches the Bundles from the data table by the district id
 * @returns an array of bundles
 */
module.exports = function getBundles() {
    console.log('>>>>>>table' + service.vars.bundles_table);
    var table = project.initDataTableById(service.vars.bundles_table);
    // query['d' + state.vars.client_districtId] = 1;
    // if(state.vars.client_districtId) {
    //     cursor = table.queryRows({
    //         vars: query
    //     });
    // } else {
    //     cursor = table.queryRows({
    //         vars: {
    //             'bundle_name': {exists: 1}
    //         }
    //     });
    // }
    var cursor = table.queryRows({
        vars: {
            'bundle_name': {exists: 1}
        }
    });
    var districtsBundles = [];
    while(cursor.hasNext()) {
        var row = cursor.next();
        districtsBundles.push(row.vars);
    }
    var siteBundlesIds = getBundlesIdSBySite(state.vars.client_SiteId, state.vars.client_site);
    console.log('dist bds: =====> ' + JSON.stringify(districtsBundles));
    console.log('site ids bds: =====> ' + JSON.stringify(siteBundlesIds));
    var siteBundles = districtsBundles.filter(function(districtBundle) {
        var bundleId = districtBundle.bundleId;
        if(bundleId < 0) {
            bundleId = 'n' + (bundleId * -1); // replace a negative sign with "n" since telerivet columns can only have Alpha Num
        }
        return siteBundlesIds['bid_' + bundleId] == 1;
    });
    console.log('site bds: =====> ' + JSON.stringify(siteBundles));
    return siteBundles;
};


/**
 * Fetches the bundle ids in a specific site
 * @returns an object with the bundle ids
 */
function getBundlesIdSBySite(siteId, siteName) {
    var site_bundles = {};
    if(service.vars.bundles_site_configuration_table) {
        var table = project.initDataTableById(service.vars.bundles_site_configuration_table);
        var query = {
            'site_id': siteId,
            'site_name': siteName,
            'active': '1'
        };
        var cursor = table.queryRows({
            vars: query
        });
        if(cursor.hasNext()) {
            var row = cursor.next();
            site_bundles = (row.vars);
        }
        return site_bundles;
    }
    return site_bundles;
}
