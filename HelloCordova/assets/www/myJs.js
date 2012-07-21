(function() {
  var isDeviceReady, root, userLatitude, userLongitude, zomatoApiKey;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  isDeviceReady = false;

  userLatitude = 0;

  userLongitude = 0;

  zomatoApiKey = '4fd3b95f093509652039094fd3b95f09';

  root.onLoad = function() {
    return document.addEventListener('deviceready', onDeviceReady, false);
  };

  root.onDeviceReady = function() {
    return isDeviceReady = true;
  };

  root.searchRestaurants = function() {
    var options;
    if (isDeviceReady) {
      options = {
        enableHighAccuracy: true,
        timeout: 10000
      };
      $('#search-btn').addClass('disabled');
      $('#search-btn').html('Loading...');
      return navigator.geolocation.getCurrentPosition(locationSuccess, locationError, options);
    }
  };

  root.locationError = function(error) {
    var res;
    $('#search-btn').removeClass('disabled');
    $('#search-btn').html('Search Restaurants');
    res = "Error Code: " + error.code + ". Error Message: " + error.message;
    return navigator.notification.alert(res, null, 'Error', 'OK!');
  };

  root.locationSuccess = function(position) {
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;
    return getZomatoRestaurants();
  };

  root.getDirections = function(destinationLatitude, destinationLongitude, restaurantId) {
    var currentPosition, directionsDisplay, directionsService, formedHtml, myOptions, request;
    $('#directions-btn').addClass('disabled');
    $('#directions-btn').html('Loading...');
    formedHtml = "<div style=\"width: 100%; height: 100%\" id=\"directionsPanel\">\n	<span id=\"loadingDirectionsSpan\">Loading Directions. Please Wait...</span>\n</div>\n<div style=\"float: left;\">\n	<button type=\"button\" class=\"btn btn-primary\" id=\"btn-" + restaurantId + "\" onclick=\"getDetails('" + restaurantId + "');\">Back</button>\n</div>";
    $('#main_div').html(formedHtml);
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    currentPosition = new google.maps.LatLng(userLatitude, userLongitude);
    myOptions = {
      zoom: 7,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: currentPosition
    };
    directionsDisplay.setPanel(document.getElementById("directionsPanel"));
    request = {
      origin: new google.maps.LatLng(userLatitude, userLongitude),
      destination: new google.maps.LatLng(destinationLatitude, destinationLongitude),
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        return $('#loadingDirectionsSpan').hide();
      } else {
        return navigator.notification.alert("Could not get direction: " + response, null, 'Error', 'OK!');
      }
    });
    $('#directions-btn').removeClass('disabled');
    return $('#directions-btn').html('Loading...');
  };

  root.getDetails = function(restaurantId) {
    var ajaxParams, beforeSendFunc, errorFunction, successFunction;
    successFunction = function(response) {
      var address, ambienceRating, city, cuisines, editorReview, foodRating, formedHtml, hasBar, hasDelivery, latitude, locality, longitude, name, overallRating, phone, serviceRating, timings;
      if (response) {
        name = response.name;
        address = response.location.address;
        locality = response.location.locality;
        city = response.location.citya;
        phone = response.phone;
        cuisines = response.cuisines;
        latitude = response.location.latitude;
        longitude = response.location.longitude;
        timings = response.timings;
        hasBar = 'No';
        if (response.hasBar === 1) hasBar = 'Yes';
        hasDelivery = 'No';
        if (response.hasDelivery) hasDelivery = 'Yes';
        editorReview = response.editorReview;
        foodRating = response.editorRating.food;
        serviceRating = response.editorRating.service;
        ambienceRating = response.editorRating.ambience;
        overallRating = response.editorRating.overall;
        formedHtml = "<div class=\"tabbable tabs-left\">\n	<ul class=\"nav nav-tabs\">\n		<li class=\"active\"><a href=\"#address-tab\" data-toggle=\"tab\">Address</a></li>\n		<li><a href=\"#details-tab\" data-toggle=\"tab\">Details</a></li>\n		<li><a href=\"#reviews-tab\" data-toggle=\"tab\">Editor Review</a></li>\n	</ul>\n	<div class=\"tab-content\">\n		<div class=\"tab-pane active\" id=\"address-tab\">\n			<div style=\"float: left;\">\n				<address>\n					<strong>" + name + "</strong>\n					<br />" + address + "\n					<br />" + locality + "\n					<br /><br />Phone: " + phone + "\n				</address>\n			</div>\n			<div style=\"float: right;\">\n				<button type=\"button\" class=\"btn btn-primary\" id=\"directions-btn\" onclick=\"getDirections(" + latitude + ", '" + longitude + "', '" + restaurantId + "');\">Directions</button>\n			</div>\n			<div style=\"clear: both;\"></div>\n		</div>\n		<div class=\"tab-pane\" id=\"details-tab\">\n			<table class=\"table table-condensed\">\n			<tbody>\n				<tr>\n					<td style=\"font-weight: bold;\">Cuisines</td>\n					<td>" + cuisines + "</td>\n				</tr>\n				<tr>\n					<td style=\"font-weight: bold;\">Timings</td>\n					<td>" + timings + "</td>\n				</tr>\n				<tr>\n					<td style=\"font-weight: bold;\">Has Bar?</td>\n					<td>" + hasBar + "</td>\n				</tr>\n				<tr>\n					<td style=\"font-weight: bold;\">Has Delivery?</td>\n					<td>" + hasDelivery + "</td>\n				</tr>\n			</tbody>\n			</table>\n		</div>\n		<div class=\"tab-pane\" id=\"reviews-tab\">\n			<blockquote>\n			" + editorReview + "\n			</blockquote>\n			<table class=\"table table-condensed\">\n				<tbody>\n					<tr>\n						<td style=\"font-weight: bold;\">Food</td>\n						<td>" + foodRating + "</td>\n					</tr>\n					<tr>\n						<td style=\"font-weight: bold;\">Service</td>\n						<td>" + serviceRating + "</td>\n					</tr>\n					<tr>\n						<td style=\"font-weight: bold;\">Ambience</td>\n						<td>" + ambienceRating + "</td>\n					</tr>\n					<tr>\n						<td style=\"font-weight: bold;\">Overall</td>\n						<td>" + overallRating + "</td>\n					</tr>\n				</tbody>\n			</table>\n		</div>\n		</div>\n	</div>\n</div>\n<div style=\"clear: both;\"></div>\n<div style=\"float: left;\">\n	<button type=\"button\" id=\"back-btn\" class=\"btn btn-primary\" onclick=\"getZomatoRestaurants();\">Back</button>\n</div>\n<div style=\"clear: both\";></div>";
        $("button#btn-" + restaurantId).removeClass('disabled');
        $("button#btn-" + restaurantId).html('Details');
        return $('#main_div').html(formedHtml);
      } else {
        return navigator.notification.alert('Could not get details', null, 'Error', 'Dismiss');
      }
    };
    errorFunction = function(obj, txt) {
      $("button#btn-" + restaurantId).removeClass('disabled');
      $("button#btn-" + restaurantId).html('Details');
      return navigator.notification.alert(txt, null, 'Error', 'OK!');
    };
    beforeSendFunc = function(xhr) {
      return xhr.setRequestHeader('X-Zomato-API-Key', zomatoApiKey);
    };
    ajaxParams = {
      url: "https://api.zomato.com/v1/restaurant.json/" + restaurantId,
      async: true,
      dataType: 'json',
      beforeSend: beforeSendFunc,
      success: successFunction,
      error: errorFunction
    };
    $("button#btn-" + restaurantId).addClass('disabled');
    $("button#btn-" + restaurantId).html('Loading...');
    return $.ajax(ajaxParams);
  };

  root.rowMouseOver = function(id) {
    return $("button#btn-" + id).show();
  };

  root.rowMouseOut = function(id) {
    return $("button#btn-" + id).hide();
  };

  root.getZomatoRestaurants = function() {
    var ajaxParams, beforeSendFunc, dataParams, errorFunction, successFunction;
    dataParams = {
      lat: userLatitude,
      lon: userLongitude,
      count: 20
    };
    successFunction = function(response) {
      var formedHtml, result, _i, _len, _ref;
      if (response && response.results) {
        formedHtml = "<table class=\"table table-striped\">\n	<thead>\n		<tr>\n			<th>Select a restaurant</th>\n			<th></th>\n		</tr>\n	</thead>\n	<tbody>";
        _ref = response.results;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          result = _ref[_i];
          formedHtml += "<tr onmouseover=\"rowMouseOver('" + result.result.id + "')\" onmouseout=\"rowMouseOut('" + result.result.id + "')\">\n	<td>" + result.result.name + "</td>\n	<td><button type=\"button\" style=\"display: none;\" id=\"btn-" + result.result.id + "\" class=\"btn btn-primary\" onclick=\"getDetails(" + result.result.id + ")\">Details</button>\n</tr>";
        }
        formedHtml += "	</tbody>\n</table>";
        $('#back-btn').removeClass('disabled');
        $('#back-btn').html('Back');
        $('#search-btn').removeClass('disabled');
        $('#search-btn').html('Search Restaurants');
        return $('#main_div').html(formedHtml);
      } else {
        return navigator.notification.alert('Error in finding restaurants', null, 'Error', 'Dismiss!');
      }
    };
    errorFunction = function(obj, txt) {
      $('#back-btn').removeClass('disabled');
      $('#back-btn').html('Back');
      $('#search-btn').removeClass('disabled');
      $('#search-btn').html('Search Restaurants');
      return navigator.notification.alert('Error in finding restaurants', null, 'Error', 'Dismiss!');
    };
    beforeSendFunc = function(xhr) {
      return xhr.setRequestHeader('X-Zomato-API-Key', zomatoApiKey);
    };
    ajaxParams = {
      url: 'https://api.zomato.com/v1/search.json/near',
      data: dataParams,
      async: true,
      dataType: 'json',
      type: 'GET',
      beforeSend: beforeSendFunc,
      success: successFunction,
      error: errorFunction
    };
    $('#back-btn').addClass('disabled');
    $('#back-btn').html('Loading...');
    $('#search-btn').addClass('disabled');
    $('#search-btn').html('Loading...');
    return $.ajax(ajaxParams);
  };

}).call(this);
