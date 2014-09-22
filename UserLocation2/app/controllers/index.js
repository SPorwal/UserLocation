var nsIndex = {};

nsIndex.mapModule = require('ti.map');

nsIndex.getLocation = function(callback) {

	if (Titanium.Platform.osname === "android") {
		console.log("Titanium.Platform.osname " + Titanium.Platform.osname);

		Titanium.Geolocation.manualMode = true;

		var gpsProvider = Titanium.Geolocation.Android.createLocationProvider({
			name : Titanium.Geolocation.PROVIDER_GPS,
			minUpdateTime : 60,
			minUpdateDistance : 100
		});
		Titanium.Geolocation.Android.addLocationProvider(gpsProvider);

		var gpsRule = Titanium.Geolocation.Android.createLocationRule({
			provider : Titanium.Geolocation.PROVIDER_GPS,
			// Updates should be accurate to 100m
			accuracy : 100,
			// Updates should be no older than 5m
			maxAge : 300000,
			// But  no more frequent than once per 10 seconds
			minAge : 10000
		});
		Titanium.Geolocation.Android.addLocationRule(gpsRule);

		Titanium.Geolocation.getCurrentPosition(function(e) {
			console.log("In Android: " + JSON.stringify(e));
		});

	} else {
		console.log("Titanium.Platform.osname " + Titanium.Platform.osname);
		Titanium.Geolocation.purpose = "To get the user's location";
		Titanium.Geolocation.distanceFilter = 10;
		Titanium.Geolocation.preferredProvider = Titanium.Geolocation.PROVIDER_GPS;
		var authCode = Titanium.Geolocation.locationServicesAuthorization;

		if (authCode === Titanium.Geolocation.AUTHORIZATION_ALWAYS) {
			console.log('AUTHORIZATION_ALWAYS');
		} else if (authCode === Titanium.Geolocation.AUTHORIZATION_WHEN_IN_USE) {
			console.log('AUTHORIZATION_WHEN_IN_USE');
		} else {
			console.log('NOT AUTHORIZED :(');
		}

		Titanium.Geolocation.addEventListener('authorization', function(e) {
			console.log("Authorization");

			Titanium.Geolocation.getCurrentPosition(function(e) {
				console.log("getCurrentPosition");
				if (e.error) {
					console.log("Error: " + e.error);
				} else {
					if (e.coords !== "undefined") {
						console.log("Success: " + e.coords.latitude + "  " + e.coords.longitude);
					} else {
						console.log(JSON.stringify(e));
					}
				}
			});
		});
	}
	Titanium.Geolocation.addEventListener('location', function(e) {
		console.log("Location: " + JSON.stringify(e));

		var mapView1 = nsIndex.mapModule.createView({
			mapType : nsIndex.mapModule.NORMAL_TYPE,
			userLocation : true,
			animate : true,
			top : 0
		});

		if (e.coords) {

			console.log(e.coords.longitude + "   " + e.coords.latitude);

			var mapAnnotation = nsIndex.mapModule.createAnnotation({
				latitude : e.coords.latitude,
				longitude : e.coords.longitude,
				pincolor : nsIndex.mapModule.ANNOTATION_RED
			});

			mapView1.region = {
				latitude : e.coords.latitude,
				longitude : e.coords.longitude,
				latitudeDelta : 0.1,
				longitudeDelta : 0.1
			};

			mapView1.setAnnotations([mapAnnotation]);
		}

		$.vwMain.remove($.label);
		$.vwMain.setLayout("vertical");
		$.vwMain.add(mapView1);
	});

};

$.index.open();
