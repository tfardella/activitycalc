$(function() {
	/*
	 * Define ActivityCalc class
	 */
	var ActivityCalc = function() {
		
		// Calculated values
		this.rmr = "";
		this.rmr_hour = "";
		this.bmi = "";
		this.bmi_status = "";
		this.cal_maintenance = "";
		this.cal_weight_loss = "";
		this.cal_weight_gain = "";
		this.total_calories = 0;		
		this.current_activity = {};
		this.sliders = {};
		this.buttons = {};
		
		// UserInfo object (with default values)
		this.userInfo = { 
				"gender":"female", 
				"weight":150, 
				"height":60, 
				"age":50, 
				"activityLevel":1.2,
				"activitiyCategoryID":0, 
				"activityID":"00000", 
				"activityDuration":60,
				"activityList":[] 
			};
		
		// Base website URL
		this.base_url = location.protocol + "//" + location.hostname + location.pathname;

		// URLs for AJAX calls
		this.rmrSubmitURL = this.base_url + "activitycalc/getRMR";
		this.getActivityCategoryListURL = this.base_url + "activitycalc/getActivityCategoryList";
		this.getActivityListURL = this.base_url + "activitycalc/getActivityList";
		this.getActivityCaloriesURL = this.base_url + "activitycalc/getActivityCalories";
		this.getActivityListCaloriesURL = this.base_url + "activitycalc/getActivityListCalories";
		this.getUserInfoURL = this.base_url + "activitycalc/getUserInfo";
		this.saveUserInfoURL = this.base_url + "activitycalc/saveUserInfo";
		
		this.getUserInfo();

		this.getCategoryList();

	};
	
	ActivityCalc.prototype.updateActivity = function() {
		var self = this;
				
		if(!this.current_activity_code) { 
			return; 
		}

		var url = this.getActivityCaloriesURL;

		$.post( url, {code: this.current_activity_code, rmr: this.rmr, duration: this.userInfo.activityDuration} ,
			function( result ) {
				self.current_activity = $.parseJSON(result);				
				$("#met_result span").text(self.current_activity.activity.mets);
				$("#calories_result span").text(self.current_activity.calories);
			}
		).error(function(data){ alert("Error: \n" + data.responseText); });					
	};

	ActivityCalc.prototype.getActivityDetails = function(code) {
		this.current_activity_code = code;
		this.updateActivity();
	};

	ActivityCalc.prototype.getActivityList = function(category_id) {
		var actList, i, self = this, url = this.getActivityListURL;

		$.post( url, {id: category_id} ,
			function( result ) {
				actList = $.parseJSON(result);
				// Clear the activity list
				$("#met_activity").find('option').remove();

				// Add a default option
				$("#met_activity").append("<option value='000000' title='Select an Activity...'>Select an Activity...</option>\n");

				// Add the real activities
				for(i = 0; i < actList.length; i++) {
					$("#met_activity").append("<option value=" + actList[i].code  + " title='" + actList[i].description + "'>" + actList[i].description + "</option>\n");
				}
				
				// Enable the activity select drop-down now that the list is populated
				$("select#met_activity").removeAttr("disabled");				
			}
		).error(function(data){ alert("Error: \n" + data.responseText); });			

		$("#met_activity").change(function(){
			self.current_activity_code = $("#met_activity").val();
			if(!self.current_activity_code || self.current_activity_code !== "00000" ) {
				self.updateActivity(self);
			}
		});
	};

	ActivityCalc.prototype.getCategoryList = function() {
		var i, catID, options = "", self = this, url = this.getActivityCategoryListURL;

		$.post( url, {} ,
			function( result ) {
				self.category_list = $.parseJSON(result);
				for(i = 0; i < self.category_list.length; i++) {
					$("#met_category").append("<option value=" + self.category_list[i].category_id  + ">" + self.category_list[i].category_name + "</option>\n");
				}
			}
		).error(function(data){ alert("Error: \n" + data.responseText); });

		$("#met_category").change(function(){
			var newCatID;
			
			// Disable the activity select drop-down while we re-populate the list
			$("select#met_activity").attr("disabled","true");
			
			newCatID = $( "#met_category" ).val();
			$("#met_result span").text("???");
			$("#calories_result span").text("???");
			self.current_activity_code = "00000";
			self.getActivityList( newCatID );
			self.userInfo.activityCategoryID = newCatID;
			catID = $( "#met_category" ).val();
			if(catID > 1) { 
				catID -= 1; 
			}
			self.current_category = self.category_list[ catID ].category_name;
		});
	};

	// Functions for activity calculation results
	ActivityCalc.prototype.inches2feet = function(height) {
		var feet = Math.floor(height/12);
		var inches = height % 12;
		return (feet + "' " + inches + "\"");
	};

	ActivityCalc.prototype.min2hours = function(minutes) {
		var hours, min;

		hours = Math.floor(minutes / 60);
		min = minutes % 60;
		if( min < 10 ) { 
			min = "0" + min;
		}
		return hours + ":" + min;
	};

	ActivityCalc.prototype.updateDisplay = function() {
		var cals_maint;

		this.updateButtons();
		
		$( "#rmr-result-day span" ).html( this.rmr );
		$( "#rmr-result-hour span" ).html( this.rmr_hour );
		$("#bmi-result span").html( this.bmi );
		$("#bmi-status-result span").html( this.bmi_status );
		
		$("#cal_maintenance").text( this.cal_maintenance );
		$("#cal_weight_loss").text( this.cal_weight_loss );
		$("#cal_weight_gain").text( this.cal_weight_gain );
		
		$("#uwt").text( this.bmi_weight.under);
		$("#norm").text( this.bmi_weight.over);
		$("#owt").text( this.bmi_weight.obese);		
	};

	ActivityCalc.prototype.updateSliders = function() {
		$( this.sliders.weight + "_slider").slider( "value", this.userInfo.weight );
		$( this.sliders.weight + "_display" ).text( $( "#weight_slider" ).slider( "value" ) );
		$( this.sliders.weight ).val( $( this.sliders.weight + "_slider" ).slider( "value" ) );
		
		$( this.sliders.height + "_slider").slider( "value", this.userInfo.height );
		$( this.sliders.height ).val( $( this.sliders.height + "_slider" ).slider( "value" ) );
		$( this.sliders.height + "_display" ).text( this.inches2feet($( this.sliders.height + "_slider" ).slider( "value" )) );
		
		$( this.sliders.age + "_slider").slider( "value", this.userInfo.age );
		$( this.sliders.age ).val( $( this.sliders.age + "_slider" ).slider( "value" ) );
		$( this.sliders.age + "_display" ).text( $( this.sliders.age + "_slider" ).slider( "value" ) );
	};

	//TODO: check to see if we need this method. I'm guessing we don't
	ActivityCalc.prototype.updateButtons = function() {
		function getCheckedRadio() {
			var radioButtons = document.getElementsByName("gender");
			for (var x = 0; x < radioButtons.length; x ++) {
				if (radioButtons[x].checked) {
					alert("You checked " + radioButtons[x].id);
				}
			}
		}

		$(this.buttons.gender + "-" + this.userInfo.gender).attr("checked", "checked");
		$(this.buttons.gender).buttonset("refresh");
	};
	
	ActivityCalc.prototype.updateRMR = function(){
		var self = this;
		
		var post_data = "userInfo=" + JSON.stringify(this.userInfo);

		var url = this.rmrSubmitURL;
		
		// Send the data using post and put the results in a div
		$.post( url, post_data ,
			function( result ) {
				self.rmr = $.parseJSON(result).rmr;
				self.rmr_hour =  Math.round( self.rmr / 24 );
				self.bmi = $.parseJSON(result).bmi;
				self.bmi_status = $.parseJSON(result).bmi_status;
				self.bmi_weight = $.parseJSON(result).bmi_weight;
				
				self.updateActivity();
				self.updateActivityLevel();
				self.updateActivityListCalories();
				self.updateDisplay();
			}
		).error(function(data){ alert("Error: \n" + data.responseText); });
		
	};
	
	ActivityCalc.prototype.getUserInfo = function() {
		var i, info, al_options, url = this.getUserInfoURL, self = this;
		
		$.post( url, {} ,
			function( result ) {
				info = $.parseJSON( result );
				if( info !== null ) {
					self.userInfo.gender = info.gender || self.userInfo.gender;
					self.userInfo.height = info.height || self.userInfo.height;
					self.userInfo.weight = info.weight || self.userInfo.weight;
					self.userInfo.age = info.age || self.userInfo.age;
					self.userInfo.activityLevel = info.activitylevel || self.userInfo.activityLevel;
					self.userInfo.activityCategoryID = info.categoryID || self.userInfo.activityCategoryID;
					self.userInfo.activityCode = info.activityCode || self.userInfo.activityCode;
					self.userInfo.activityDuration = info.activityDuration || self.userInfo.activityDuration;
					self.userInfo.activityList = info.activityList || self.userInfo.activityList;
					self.userInfo.activityLevel = info.activityLevel || self.userInfo.activityLevel;
				}
				
				// Set the activityLevel drop-down
				al_options = $("#activity_level option");
				for( i = 0; i <  al_options.length; i++ ) {
					if( self.userInfo.activityLevel == al_options[i].value ) {
						al_options[i].selected = true;
					}else{
						al_options[i].selected = false;
					}
				}
				
				self.updateRMR();
				self.updateSliders();
				self.updateActivityList();
			}
		).error(function(data){ alert("Error: \n" + data.responseText); });					
	};
	
	ActivityCalc.prototype.saveUserInfo = function() {
		var data, url = this.saveUserInfoURL, self = this;
		data = JSON.stringify( this.userInfo );
		$.post( url, { 'userInfo':data },
			function( result ) {				
			}
		).error(function(data){ alert("Error: \n" + data.responseText); });
	};

	ActivityCalc.prototype.printReport = function() {
		var d = new Date(), i, total_mets = 0, total_cals = 0;
		
		var acp = window.open("", "printDataWindow", "width=710,height=710,resizable=1,scrollbars,location=0");
		acp.document.open();
		acp.document.write("<!DOCTYPE html>\n<html>\n<head>\n<title>ActivityCalc.com</title>\n");
		acp.document.write("<style type='text/css'>\n");
		acp.document.write("body { font-family: Verdana, sans-serif; font-size: 12px; padding: 0px 24px 24px; color: #000000; border-top: 18px solid #89CEDE; width: 640px; }\n");
		acp.document.write("#heading { margin-bottom: 24px; }\n");
		acp.document.write("#heading h1 { color: #DC4E00; font-style: italic; margin: 0; padding: 0; }\n");
		acp.document.write("#heading h2 { color: #888888; font-size: .8em; margin: 0; padding: 0; }\n");
		acp.document.write("h3 { margin: 0 0 8px 0; padding: 0; border-bottom: 1px solid #eeeeee; }\n");
		acp.document.write("table { border-collapse: collapse; border-spacing: 0;}\n");
		acp.document.write("td { padding: 2px 8px; text-align: center; }\n");
		acp.document.write("td.left { text-align: left;}\n");
		acp.document.write("table.table_border td { border: 1px solid #eeeeee; }\n");
		acp.document.write("thead {background-color: #888888; color: #ffffff; }\n");
		acp.document.write("th { text-align: left; padding: 4px 8px; }\n");
		acp.document.write(".date { text-align: right; color: #aaaaaa; }\n");

		acp.document.write("#bmi_bar {position: relative; padding-top: 12px; font-weight: bold;}\n");
		acp.document.write("#bmi_bar #uwt {position: absolute; top: 20px; left: 84px;}\n");
		acp.document.write("#bmi_bar #norm {position: absolute; top: 20px; left: 179px;}\n");
		acp.document.write("#bmi_bar #owt {position: absolute; top: 20px; left: 278px;}\n");
		
		acp.document.write("</style>\n");		
		acp.document.write("</head>\n<body id='print_window'>\n");
		
		acp.document.write("<div id='heading'>\n");
		acp.document.write("<h1>ActivityCalc.com</h1>\n");
		acp.document.write("<h2>Information to Help Build a Better Body</h2>\n");
		acp.document.write("</div>\n");
		
		acp.document.write("<div class='date'>" + d.toLocaleDateString() + "</div>");
		acp.document.write("<h3>Your Information</h3>\n");
		acp.document.write("<table>\n<tbody>\n<tr>\n");
		acp.document.write("<th>Gender:</th><td>" + this.userInfo.gender + "</td>\n");
		acp.document.write("<th>Weight:</th><td>" + this.userInfo.weight + "lbs</td>\n");
		acp.document.write("<th>Height:</th><td>" + this.inches2feet(this.userInfo.height) + "</td>\n");
		acp.document.write("<th>Age:</th><td>" + this.userInfo.age + "</td>\n</tr>");
		acp.document.write("</tbody>\n</table>\n<br />\n");
		acp.document.write("<h3>Your Results</h3>\n");
		acp.document.write("<table>\n<tbody>\n");
		acp.document.write("<tr><th>Resting Metabolic Rate (RMR):</th><td>" + this.rmr + " Calories/Day</td><td>" +  Math.round( this.rmr / 24 ) + " Calories/Hour</td></tr>\n");
		acp.document.write("<tr><th>Body Mass Index (BMI):</th><td>" + this.bmi + "</td><td>" + this.bmi_status + "</td></tr>\n");
		acp.document.write("</tbody>\n</table>\n");

		acp.document.write("<div id='bmi_bar'>\n");
		acp.document.write("<img src='/images/bmi-bar.png' />\n");
		acp.document.write("<div id='uwt'>" + this.bmi_weight.under + "</div>\n");
		acp.document.write("<div id='norm'>" + this.bmi_weight.over + "</div>\n");
		acp.document.write("<div id='owt'>" + this.bmi_weight.obese + "</div>\n");
		acp.document.write("</div><br />\n");
		
		acp.document.write("<h3>Estimated Calorie Requirements</h3>\n");
		acp.document.write("<table border='0' cellspacing='5' cellpadding='5'>\n");
		acp.document.write("<tbody>\n");
		acp.document.write("<tr><th style='width: 150px;'>Maintenance</th><td><span id='cal_maintenance'>" + this.cal_maintenance + "</span> Calories/Day<td></tr>\n");
		acp.document.write("<tr><th style='width: 150px;'>For Weight Loss</th><td><span id='cal_weight_loss'>" + this.cal_weight_loss + "</span> Calories/Day<td></tr>\n");
		acp.document.write("<tr><th style='width: 150px;'>For Weight Gain</th><td><span id='cal_weight_gain'>" + this.cal_weight_gain + "</span> Calories/Day<td></tr>\n");
		acp.document.write("</tbody>\n");
		acp.document.write("</table><br /><br />\n");

		if( this.userInfo.activityList.length > 0 ) {
			acp.document.write("<h3>Your Activities</h3>\n");
			acp.document.write("<table class='table_border' width='100%'>\n");
			acp.document.write("<thead><th>Activity</th><th>Time</th><th>METs</th><th>Calories</th></thead>\n");
			acp.document.write("<tbody>\n");

			for( i in this.userInfo.activityList) {
				acp.document.write("<tr>");
				acp.document.write("<td class='left'>" + this.userInfo.activityList[i].activity.description + "</td>");
				acp.document.write("<td style='width: 60px;'>" + this.min2hours(this.userInfo.activityList[i].duration) + "</td>\n");
				acp.document.write("<td style='width: 60px;'>" + this.userInfo.activityList[i].activity.mets + "</td>\n");
				acp.document.write("<td style='width: 60px;'>" + this.userInfo.activityList[i].calories + "</td>\n");
				acp.document.write("</tr>");
				total_mets += parseFloat(this.userInfo.activityList[i].activity.mets, 10);
				total_cals += parseInt(this.userInfo.activityList[i].calories, 10);
			}

			acp.document.write("<tr style='border-top:2px solid #888888;'>");
			acp.document.write("<th>Total</th>");
			acp.document.write("<th style='width: 60px; text-align:center;'></th>\n");
			acp.document.write("<th style='width: 60px; text-align:center;'>" + total_mets.toFixed(2) + "</th>\n");
			acp.document.write("<th style='width: 60px; text-align:center;'>" + total_cals + "</th>\n");
			acp.document.write("</tr>");
			acp.document.write("</tbody>\n</table>\n");
			acp.document.write("</body>\n</html>\n");
		}

		acp.document.close();

		
		acp.print();		
	};

	ActivityCalc.prototype.addActivity = function() {
		var link, row, deltd, totalCals, self = this;

		if( this.current_activity.activity ) {
			this.current_activity.duration = this.userInfo.activityDuration;
			this.userInfo.activityList.push(this.current_activity);

			this.updateActivityList();
			this.saveUserInfo();		
		}
	};
	
	ActivityCalc.prototype.removeActivity = function(e) {
		var rowEl, index;

		e.preventDefault();

		// Find the tr element of the row, get the row index
		rowEl = e.target.parentNode.parentNode;
		index = rowEl.sectionRowIndex;

		// Remove activity from the activityList array
		this.userInfo.activityList.splice(index, 1);

		this.updateActivityList();		
		this.saveUserInfo();		
	};
	
	ActivityCalc.prototype.clearActivityList = function() {
		$("#activity_list tbody").empty();
		this.total_calories = 0;
		$("#total_calories").text( this.total_calories );
		this.userInfo.activityList = [];
		this.saveUserInfo();		
	};
	
	ActivityCalc.prototype.updateActivityList = function() {
		var i, link, deltd, row, self = this;
		
		// Clear the activity list
		$("#activity_list tbody").empty();
		this.total_calories = 0;

		// Re-populate the activity list
		var activityRemoveHandler = function(e){ self.removeActivity(e); };
		
		for ( i in this.userInfo.activityList ) {
			link = $( "<a href='' title='Remove Activity'>X</a>" ).click( activityRemoveHandler );
			deltd = $( "<td class='del'></td" ).append( link );
			row = $( "<tr></tr>" );
			$(row).append( "<td class='id'>" + (this.userInfo.activityList.length - 1) +"</td>" );
			$(row).append( "<td class='desc'><div>" + this.userInfo.activityList[i].activity.description + "</div></td>" );
			$(row).append( "<td class='cals'>" + this.userInfo.activityList[i].calories + "</td>" );
			$(row).append( deltd );
			$("#activity_list tbody").append(row);
		}	

		this.activityListTotalCalories();
		$("#total_calories").text( this.total_calories );
	};
	
	// Calculate the total calories of all the activities in the list
	ActivityCalc.prototype.activityListTotalCalories = function() {
		var i, total = 0;
		
		if(this.userInfo.activityList && this.userInfo.activityList.length > 0) {
			for (i in this.userInfo.activityList) {
				total += parseInt(this.userInfo.activityList[i].calories, 10);
			}			
		}
		
		this.total_calories = total;
		return total;
	};
	
	ActivityCalc.prototype.updateActivityListCalories = function() {
		var self = this;
		
		if (this.userInfo.activityList.length === 0) { return; }

		var post_data = "rmr=" + this.rmr + 
						"& activityList=" + JSON.stringify( this.userInfo.activityList );

		var url = this.getActivityListCaloriesURL;
				
		// Send the data using post and put the results in a div
		$.post( url, post_data ,
			function( result ) {
				self.userInfo.activityList = $.parseJSON(result);
				self.updateActivityList();
			}
		).error(function(data){ alert("Error: \n" + data.responseText); });
		
	};
	
	ActivityCalc.prototype.updateActivityLevel = function() {
		this.userInfo.activityLevel = parseFloat($( "#activity_level" ).val(), 10);
		this.cal_maintenance = Math.round( this.rmr * this.userInfo.activityLevel );
		this.cal_weight_loss = Math.round( this.cal_maintenance * 0.8 );
		this.cal_weight_gain = Math.round( this.cal_maintenance * 1.2 );
	};
	
	// ****** End ActvityCalc class ******
	
	/*
	 * Start main code
	 */
	var ac = new ActivityCalc();

	
	// **** Setup dialogs
	$( "#dialog-rmr" ).dialog({
		height: 300,
		width: 500,
		modal: true,
		autoOpen: false,
		buttons: { "OK": function() { $(this).dialog("close"); } }
	});

	$( "#rmr-info" ).click(function() {
		$( "#dialog-rmr" ).dialog( "open" );
		return false;
	});

	$( "#dialog_cal_req" ).dialog({
		height: 360,
		width: 500,
		modal: true,
		autoOpen: false,
		buttons: { "OK": function() { $(this).dialog("close"); } }
	});

	$( "#cal_req_info" ).click(function() {
		$( "#dialog_cal_req" ).dialog( "open" );
		return false;
	});

	$( "#dialog-bmi" ).dialog({
		height: 390,
		width: 500,
		modal: true,
		autoOpen: false,
		buttons: { "OK": function() { $(this).dialog("close"); } }
	});

	$( "#bmi-info" ).click(function() {
		$( "#dialog-bmi" ).dialog( "open" );
		return false;
	});

	$( "#dialog-met" ).dialog({
		height: 320,
		width: 500,
		modal: true,
		autoOpen: false,
		buttons: { "OK": function() { $(this).dialog("close"); } }
	});

	$( "#met_info" ).click(function() {
		$( "#dialog-met" ).dialog( "open" );
		return false;
	});
	
	$( "#dialog_clear_activities" ).dialog({
		height: 220,
		width: 500,
		modal: true,
		autoOpen: false,
		buttons: { 
			"Cancel": function() { $(this).dialog("close"); },
			"OK": function() { 
				$(this).dialog("close"); 
				ac.clearActivityList();
			}
		}
	});

	$( "#clear_activities" ).click(function() {
		$( "#dialog_clear_activities" ).dialog( "open" );
		return false;
	});
	
	// **** Setup events for buttons

	// Gender button
	ac.buttons.gender = "#gender";
	$( "#gender" ).buttonset();
	
	$("input[name='gender']").click( function(event){ 
		ac.userInfo.gender = $("input[@name='gender']:checked").val();
		ac.updateRMR();
	} );
	
	// Print button
	$("#print").click( function(event){ 
		ac.printReport();
	} );
	
	// Add Activity button
	$("#add_activity").click( function(event){ 
		ac.addActivity();
	} );
	
	// Remove Activity button
	$("#activity_list td.del a").click( function(event){ 
		ac.removeActivity(event);
	} );
	
	
	// *** Setup drop-down menus
	$("#activity_level").change(function(){
		ac.updateActivityLevel();
		ac.updateDisplay();
		ac.saveUserInfo();
	});
	
	
	// **** Setup slider widgets

	// Slider weight setup
	ac.sliders.weight = "#weight";
	$( "#weight_slider" ).slider({
		range: "min",
		min: 50,
		max: 350,
		value: ac.userInfo.weight,
		slide: function( event, ui ) {
			$( "#weight_display" ).text(ui.value);
			$( "#weight" ).val(ui.value);
			ac.userInfo.weight = ui.value;
		},
		stop: function(event) {
			event.preventDefault();
			ac.updateRMR();
		},
		create: function() {
			$( "#weight_display" ).text( $( "#weight_slider" ).slider( "value" ) );
			$( "#weight" ).val( $( "#weight_slider" ).slider( "value" ) );
		}
	});

	// Slider age setup
	ac.sliders.age = "#age";
	$( "#age_slider" ).slider({
		range: "min",
		min: 0,
		max: 100,
		value: ac.userInfo.age,
		slide: function( event, ui ) {
			$( "#age" ).val( ui.value );
			$( "#age_display" ).text( ui.value );
			ac.userInfo.age = ui.value;
		},
		stop: function(event) {
			event.preventDefault(); 			
			ac.updateRMR();
		},
		create: function() {
			$( "#age" ).val( $( "#age_slider" ).slider( "value" ) );
			$( "#age_display" ).text( $( "#age_slider" ).slider( "value" ) );
		}
	});

	// Slider height setup
	ac.sliders.height = "#height";
	$( "#height_slider" ).slider({
		range: "min",
		min: 36,
		max: 84,
		value: ac.userInfo.height,
		slide: function( event, ui ) {
			$( "#height" ).val(ui.value);
			$( "#height_display" ).text( ac.inches2feet(ui.value) );
			ac.userInfo.height = ui.value;
		},
		stop: function(event) {
			event.preventDefault(); 			
			ac.updateRMR();
		},
		create: function() {
			$( "#height" ).val( $( "#height_slider" ).slider( "value" ) );
			$( "#height_display" ).text( ac.inches2feet($( "#height_slider" ).slider( "value" )) );
		}
		
	});

	// Slider duration setup
	ac.sliders.duration = "#duration";
	$( "#duration_slider" ).slider({
		range: "min",
		min: 0,
		max: 240,
		value: ac.userInfo.activityDuration,
		slide: function( event, ui ) {
			$( "#duration" ).val( ui.value );
			$( "#duration_display" ).text( ac.min2hours(ui.value) );
			ac.userInfo.activityDuration = ui.value;
		},
		stop: function(event, ui) {
			if(ac.current_activity_code) {
				ac.updateActivity();
			}
		},
		create: function() {
			$( "#duration" ).val( $( "#duration_slider" ).slider( "value" ) );
			$( "#duration_display" ).text( ac.min2hours( $( "#duration_slider" ).slider( "value" ) ) );
		}
	});
	
});
