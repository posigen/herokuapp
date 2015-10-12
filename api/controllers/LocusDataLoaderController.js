/**
 * LocusDataLoaderController
 *
 * @description :: Server-side logic for managing Locusdataloaders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var https = require('https');
var access_token = null;
module.exports = {
	
		run: function(request, response) {
			
			var options = {
			  hostname: 'api.locusenergy.com',
			  path: '/v3/partners/414397/components',
			  method: 'GET',
			  headers: {
			    'Accept': 'application/json',
			    'Authorization': 'Bearer c68bb623e7225b1920ce89bb49402a58'
			  }
			};
					
			var req = https.request(options, function(res) {
					  res.setEncoding('utf8');
					  var data = '';
					  var j = 0;
					  res.on('data', function (resp) {
						  data += resp;
						  console.log(j);
						  j++;
					  });
					  res.on('end', function() {
						 var respreplaced = data.replace(/'/g, "\\'");
						 var obj = JSON.parse(respreplaced);
						 console.log('Status code-'+obj.statusCode);
						 if(obj.statusCode == 200){
							 obj.components.forEach(function(component){
								 console.log(component.siteId);
								 console.log(component.nodeType);
								 console.log(component.name);
								
								
								LocusComponents.create(
									{
										siteId : parseInt(component.siteId),
										clientId : parseInt(component.clientId),
										parentId : parseInt(component.parentId),
										parentType : component.parentType,
										nodeId : component.nodeId,
										name : component.name,
										nodeType : component.nodeType,
										application : component.application,
										generationType : component.generationType,
										oem : component.oem,
										model : component.model,
										isConceptualNode : Boolean(component.isConceptualNode),
										partnerId : parseInt(414397),
										componentId : parseInt(component.id)
										
									}).exec(function(err, obj) {
										if(err){
											console.log(err);
										}
										else{
											console.log('Success-'+obj);
										}
								});
							 });
						 }
						 
					    console.log('No more data in response data loader.');
					  });
					});

					req.on('error', function(e) {
					  console.log('problem with request: ' + e.message);
					});

					// write data to request body
					//req.write(postData);
					req.end();
					
		},
		
		runSites: function(request, response) {
			
			var options = {
					hostname: 'api.locusenergy.com',
					path: '/v3/partners/414397/sites',
					method: 'GET',
					headers: {
						'Accept': 'application/json',
						'Authorization': 'Bearer 58dd08e75ad5df8335fda7fb39fe8b0f'
					}
			};
			
			var req = https.request(options, function(res) {
				res.setEncoding('utf8');
				var data = '';
				var j = 0;
				res.on('data', function (resp) {
					var respreplaced = resp.replace(/'/g, "\\'");
					data += respreplaced;
					console.log(j);
					j++;
				});
				res.on('end', function() { 
					
					var respreplaced = data.replace(/'/g, "\\'");
					var obj = JSON.parse(respreplaced);
					var j = 0;
					console.log('Status code-'+obj.statusCode);
					if(obj.statusCode == 200){
						obj.sites.forEach(function(site){
							console.log(site.id);
							console.log(site.name);
							
							LocusSites.create(
									{
										countryCode : site.countryCode,
										locale1 : site.locale1,
										localeCode1 : site.localeCode1,
										locale2 : site.locale2,
										locale3 : site.locale3,
										postalCode : site.postalCode,
										address1 : site.address1,
										latitude : parseFloat(site.latitude),
										longitude : parseFloat(site.longitude),
										clientId : parseInt(site.clientId),
										name : site.name,
										siteId : parseInt(site.id)
										
									}).exec(function(err, obj) {
										if(err){
											console.log(err);
										}
										else{
											console.log('Success-'+j+'-'+obj);
										}
									});
							j++;
						});
					}
					
					console.log('No more data in response data loader.');
				});
			});
			
			req.on('error', function(e) {
				console.log('problem with request: ' + e.message);
			});
			
			// write data to request body
			//req.write(postData);
			req.end(); 
			
		},
		
		updateModelSettingForSites: function(request, response) {
			
			var timeout = 0;
			LocusSites.find({size: null}).exec(function(err, sites) {
				sites.forEach(function(site){
					setTimeout(function() {
						console.log('Site id-'+site.id);
						loadModelSetting(site.siteId);
						//loadInstallerInfo(site.siteId);
			        }, timeout );
			        timeout += 1000;
					
				});
			}); 
			
		}
};

function loadModelSetting(siteId){
	
	LocusCredentials.findOne({ id: 1 }).exec(function(err, locus) {
	
		var options = {
				hostname: 'api.locusenergy.com',
				path: '/v3/sites/'+siteId+'/modelsettings',
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Authorization': 'Bearer '+locus.accesstoken
				}
		};
		
		var req = https.request(options, function(res) {
			res.setEncoding('utf8');
			var data = '';
			var j = 0;
			res.on('data', function (resp) {
				var respreplaced = resp.replace(/'/g, "\\'");
				data += respreplaced;
				console.log(j);
				j++;
			});
			res.on('end', function() { 
				
				var obj = JSON.parse(data);
				console.log('Status code-'+obj.statusCode);
				if(obj.statusCode == 200){
					console.log('Size---'+obj.size);
					
					LocusSites.update(
							{siteId : siteId},
							{
								mismatch : parseInt(obj.mismatch),
								diodesAndConnections : parseInt(obj.diodesAndConnections),
								dcWiring : parseInt(obj.dcWiring),
								soiling : parseInt(obj.soiling),
								sunTracking : parseInt(obj.sunTracking),
								nameplate : parseInt(obj.nameplate),
								acWiring : parseInt(obj.acWiring),
								transformer : parseInt(obj.transformer),
								tmy3Id : parseInt(obj.tmy3Id),
								partnerId : parseInt(414397)
								
							}).exec(function(err, record) {
								if(err){
									console.log(err);
								}
								else{
									console.log('Success-'+record.siteId);
								}
							});
				}
				
				console.log('No more data in response data loader.');
			});
		});
		
		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});
		
		// write data to request body
		//req.write(postData);
		req.end(); 
		
	});
}

function loadInstallerInfo(siteId){
	
	LocusCredentials.findOne({ id: 1 }).exec(function(err, locus) {
	
		var options = {
				hostname: 'api.locusenergy.com',
				path: '/v3/sites/'+siteId+'/installinfo',
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Authorization': 'Bearer '+locus.accesstoken
				}
		};
		
		var req = https.request(options, function(res) {
			res.setEncoding('utf8');
			var data = '';
			var j = 0;
			res.on('data', function (resp) {
				var respreplaced = resp.replace(/'/g, "\\'");
				data += respreplaced;
				console.log(j);
				j++;
			});
			res.on('end', function() { 
				
				var obj = JSON.parse(data);
				console.log('Status code-'+obj.statusCode);
				if(obj.statusCode == 200){
					console.log(obj.startupDate);
					
					LocusSites.update(
							{siteId : siteId},
							{
								installer : obj.installer != 'undefined' ? obj.installer : null,
								installDate : obj.installDate != 'undefined' ? obj.installDate : null,
								ptoDate : obj.ptoDate != 'undefined' ? obj.ptoDate : null,
								startupDate : obj.startupDate != 'undefined' ? obj.startupDate : null,
								uninstallDate : obj.uninstallDate != 'undefined' ? obj.uninstallDate : null
								
							}).exec(function(err, record) {
								if(err){
									console.log(err);
								}
								else{
									console.log('Success-');
								}
							});
				}
				
				console.log('No more data in response data loader.');
			});
		});
		
		req.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});
		
		// write data to request body
		//req.write(postData);
		req.end(); 
		
	});
}

