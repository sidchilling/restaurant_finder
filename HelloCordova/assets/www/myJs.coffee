root = exports ? this

isDeviceReady = false
userLatitude = 0
userLongitude = 0
zomatoApiKey = '4fd3b95f093509652039094fd3b95f09'

root.onLoad = ->
	document.addEventListener 'deviceready', onDeviceReady, false

root.onDeviceReady = ->
	isDeviceReady = true

root.searchRestaurants = ->
	if isDeviceReady
		options =
			enableHighAccuracy : true
			timeout: 10000
		$('#search-btn').addClass 'disabled'
		$('#search-btn').html 'Loading...'
		navigator.geolocation.getCurrentPosition locationSuccess, locationError, options

root.locationError = (error) ->
	$('#search-btn').removeClass 'disabled'
	$('#search-btn').html 'Search Restaurants'
	res = "Error Code: #{error.code}. Error Message: #{error.message}"
	navigator.notification.alert res, null, 'Error', 'OK!'

root.locationSuccess = (position) ->
	userLatitude = position.coords.latitude
	userLongitude = position.coords.longitude
	getZomatoRestaurants()


root.getDirections = (destinationLatitude, destinationLongitude, restaurantId) ->
	$('#directions-btn').addClass 'disabled'
	$('#directions-btn').html 'Loading...'
	formedHtml = """
	<div style="width: 100%; height: 100%" id="directionsPanel">
		<span id="loadingDirectionsSpan">Loading Directions. Please Wait...</span>
	</div>
	<div style="float: left;">
		<button type="button" class="btn btn-primary" id="btn-#{restaurantId}" onclick="getDetails('#{restaurantId}');">Back</button>
	</div>
	"""
	$('#main_div').html formedHtml
	directionsService = new google.maps.DirectionsService()
	directionsDisplay = new google.maps.DirectionsRenderer()
	currentPosition = new google.maps.LatLng userLatitude, userLongitude
	myOptions =
		zoom : 7
		mapTypeId : google.maps.MapTypeId.ROADMAP
		center : currentPosition
	directionsDisplay.setPanel(document.getElementById "directionsPanel")
	request =
		origin : new google.maps.LatLng userLatitude, userLongitude
		destination : new google.maps.LatLng destinationLatitude, destinationLongitude
		travelMode : google.maps.TravelMode.DRIVING
	directionsService.route(request, (response, status)->
		if status == google.maps.DirectionsStatus.OK
			directionsDisplay.setDirections response
			$('#loadingDirectionsSpan').hide()
		else
			navigator.notification.alert "Could not get direction: #{response}", null, 'Error', 'OK!'
	)
	$('#directions-btn').removeClass 'disabled'
	$('#directions-btn').html 'Loading...'

root.getDetails = (restaurantId) ->
	successFunction = (response) ->
		if response
			name = response.name
			address = response.location.address
			locality = response.location.locality
			city = response.location.citya
			phone = response.phone
			cuisines = response.cuisines
			latitude = response.location.latitude
			longitude = response.location.longitude
			timings = response.timings
			hasBar = 'No'
			if response.hasBar == 1
				hasBar = 'Yes'
			hasDelivery = 'No'
			if response.hasDelivery
				hasDelivery = 'Yes'
			editorReview = response.editorReview
			foodRating = response.editorRating.food
			serviceRating = response.editorRating.service
			ambienceRating = response.editorRating.ambience
			overallRating = response.editorRating.overall
			formedHtml = """
				<div class="tabbable tabs-left">
					<ul class="nav nav-tabs">
						<li class="active"><a href="#address-tab" data-toggle="tab">Address</a></li>
						<li><a href="#details-tab" data-toggle="tab">Details</a></li>
						<li><a href="#reviews-tab" data-toggle="tab">Editor Review</a></li>
					</ul>
					<div class="tab-content">
						<div class="tab-pane active" id="address-tab">
							<div style="float: left;">
								<address>
									<strong>#{name}</strong>
									<br />#{address}
									<br />#{locality}
									<br /><br />Phone: #{phone}
								</address>
							</div>
							<div style="float: right;">
								<button type="button" class="btn btn-primary" id="directions-btn" onclick="getDirections(#{latitude}, '#{longitude}', '#{restaurantId}');">Directions</button>
							</div>
							<div style="clear: both;"></div>
						</div>
						<div class="tab-pane" id="details-tab">
							<table class="table table-condensed">
							<tbody>
								<tr>
									<td style="font-weight: bold;">Cuisines</td>
									<td>#{cuisines}</td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Timings</td>
									<td>#{timings}</td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Has Bar?</td>
									<td>#{hasBar}</td>
								</tr>
								<tr>
									<td style="font-weight: bold;">Has Delivery?</td>
									<td>#{hasDelivery}</td>
								</tr>
							</tbody>
							</table>
						</div>
						<div class="tab-pane" id="reviews-tab">
							<blockquote>
							#{editorReview}
							</blockquote>
							<table class="table table-condensed">
								<tbody>
									<tr>
										<td style="font-weight: bold;">Food</td>
										<td>#{foodRating}</td>
									</tr>
									<tr>
										<td style="font-weight: bold;">Service</td>
										<td>#{serviceRating}</td>
									</tr>
									<tr>
										<td style="font-weight: bold;">Ambience</td>
										<td>#{ambienceRating}</td>
									</tr>
									<tr>
										<td style="font-weight: bold;">Overall</td>
										<td>#{overallRating}</td>
									</tr>
								</tbody>
							</table>
						</div>
						</div>
					</div>
				</div>
				<div style="clear: both;"></div>
				<div style="float: left;">
					<button type="button" id="back-btn" class="btn btn-primary" onclick="getZomatoRestaurants();">Back</button>
				</div>
				<div style="clear: both";></div>
			"""
			$("button#btn-#{restaurantId}").removeClass 'disabled'
			$("button#btn-#{restaurantId}").html 'Details'
			$('#main_div').html formedHtml
		else
			navigator.notification.alert 'Could not get details', null, 'Error', 'Dismiss'
	errorFunction = (obj, txt) ->
		$("button#btn-#{restaurantId}").removeClass 'disabled'
		$("button#btn-#{restaurantId}").html 'Details'
		navigator.notification.alert txt, null, 'Error', 'OK!'
	beforeSendFunc = (xhr) ->
		xhr.setRequestHeader 'X-Zomato-API-Key', zomatoApiKey
	ajaxParams =
		url : "https://api.zomato.com/v1/restaurant.json/#{restaurantId}"
		async : true
		dataType : 'json'
		beforeSend : beforeSendFunc
		success : successFunction
		error : errorFunction
	$("button#btn-#{restaurantId}").addClass 'disabled'
	$("button#btn-#{restaurantId}").html 'Loading...'
	$.ajax ajaxParams

root.rowMouseOver = (id) ->
	$("button#btn-#{id}").show()

root.rowMouseOut = (id) ->
	$("button#btn-#{id}").hide()

root.getZomatoRestaurants = () ->
	dataParams =
		lat : userLatitude
		lon : userLongitude
		count : 20
	successFunction = (response) ->
		if response and response.results
			formedHtml = """
			<table class="table table-striped">
				<thead>
					<tr>
						<th>Select a restaurant</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
			"""
			for result in response.results
				formedHtml += """
					<tr onmouseover="rowMouseOver('#{result.result.id}')" onmouseout="rowMouseOut('#{result.result.id}')">
						<td>#{result.result.name}</td>
						<td><button type="button" style="display: none;" id="btn-#{result.result.id}" class="btn btn-primary" onclick="getDetails(#{result.result.id})">Details</button>
					</tr>
				"""
			formedHtml += """
				</tbody>
			</table>
			"""
			$('#back-btn').removeClass 'disabled'
			$('#back-btn').html 'Back'
			$('#search-btn').removeClass 'disabled'
			$('#search-btn').html 'Search Restaurants'
			$('#main_div').html formedHtml
		else
			navigator.notification.alert 'Error in finding restaurants', null, 'Error', 'Dismiss!'
	errorFunction = (obj, txt) ->
		$('#back-btn').removeClass 'disabled'
		$('#back-btn').html 'Back'
		$('#search-btn').removeClass 'disabled'
		$('#search-btn').html 'Search Restaurants'
		navigator.notification.alert 'Error in finding restaurants', null, 'Error', 'Dismiss!'
	beforeSendFunc = (xhr) ->
		xhr.setRequestHeader 'X-Zomato-API-Key', zomatoApiKey
	ajaxParams =
		url : 'https://api.zomato.com/v1/search.json/near'
		data : dataParams
		async : true
		dataType : 'json'
		type : 'GET'
		beforeSend : beforeSendFunc
		success : successFunction
		error : errorFunction
	$('#back-btn').addClass 'disabled'
	$('#back-btn').html 'Loading...'
	$('#search-btn').addClass 'disabled'
	$('#search-btn').html 'Loading...'
	$.ajax ajaxParams