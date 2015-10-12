/**
 * DashboardController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {
    
    dashboard: function(req, res) {
    	
    	LocusSites.query('SELECT sum("locusSites".size) FROM public."locusSites" WHERE "locusSites"."startupDate" > CURRENT_DATE - INTERVAL \'1 months\'', function(err, results) {
			  if (err) return res.serverError(err);
			  console.log(results.rows[0].sum);
			});
	    	
	        res.view('pages/dashboard');
	 },
	
    loadFleetGraphTotalSites: function(req, res) {
    	if(req.param('period')){
    	
	    	var period = req.param('period');
			LocusSites.query('SELECT sum("locusSites".size) FROM public."locusSites" WHERE "locusSites"."startupDate" > CURRENT_DATE - INTERVAL \''+period+'\'', function(err, results) {
				if (err) return res.serverError(err);
				
				var totalSize = JSON.parse(results.rows);
				console.log(totalSize);
			});
		
    	}
		
		res.view('pages/dashboard');
	}

};

module.exports.blueprints = {
    actions: true,
    rest: true,
    shortcuts: true
};

