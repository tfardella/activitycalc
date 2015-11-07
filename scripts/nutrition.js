$(function() {

	var AC_Nutrition = function() {
		this.currentNutritionFacts = {};
		this.currentNutritionDV = {};
		this.serving_size = "";
		this.currentItem = {};
		this.browseItemList = {};
		this.tab_panel = "tab_browse";

		// TODO: Use this.tab object to separate the info between tabs
		this.tab = {
			search: {
				nutFacts: {},
				nutPct: {},
				serving_size: {}				
			},
			browse: {
				nutFacts: {},
				nutPct: {},
				serving_size: {}				
			}
		};

		this.myFoodList = [];
		
		this.daily_req = {
			"FAT": {"dv":65, "units":"g"},
			"FASAT": { "dv":20, "units":"g"},
			"CHOLE":{"dv":300, "units":"mg"},
			"NA":{"dv":2400, "units":"mg"},
			"K":{"dv":3500, "units":"mg"},
			"CHOCDF":{"dv":300, "units":"g"},
			"FIBTG":{"dv":25, "units":"g"},
			"PROCNT":{"dv":50, "units":"g"},
			"VITA_IU":{"dv":5000, "units":"IU"},
			"VITC":{"dv":60, "units":"mg"},
			"CA":{"dv":1000, "units":"mg"},
			"FE":{"dv":18, "units":"mg"},
			"VITD":{"dv":400, "units":"IU"},
			"TOCPHA":{"dv":30, "units":"mg"},
			"VITK":{"dv":80, "units":"µg"},
			"THIA":{"dv":1.5, "units":"mg"},
			"RIBF":{"dv":1.7, "units":"mg"},
			"NIA":{"dv":20, "units":"mg"},
			"VITB6A":{"dv":2, "units":"mg"},
			"FOL":{"dv":400, "units":"µg"},
			"VITB12":{"dv":6, "units":"µg"},
			"Biotin":{"dv":300, "units":"µg"},
			"PANTAC":{"dv":10, "units":"mg"},
			"P":{"dv":1000, "units":"mg"},
			"Iodine":{"dv":150, "units":""},
			"MG":{"dv":400, "units":"mg"},
			"ZN":{"dv":15, "units":"mg"},
			"SE":{"dv":70, "units":"µg"},
			"CU":{"dv":2, "units":"mg"},
			"MN":{"dv":2, "units":"mg"},
			"Chromium":{"dv":120, "units":"µg"},
			"Molybdenum":{"dv":75, "units":"µcg"},
			"Chloride":{"dv":3400, "units":"mg"},

			"ENERC_KCAL":{"dv":null, "units":"kcal"},
			"FATRN":{"dv":null, "units":"g"},
			"SUGAR":{"dv":null, "units":"g"},
			"ALC":{"dv":null, "units":"g"},
			"CAFFN":{"dv":null, "units":"mg"}
		};
		
		// Factors used to calculate # of calories from proteins, carbolhydrates, and fats in a food item
		this.kcalFactor = { "protein":4, "carbohydrate":4, "fat":9 };

		// URLs
		// Base website URL
		this.base_url = location.protocol + "//" + location.hostname + location.pathname;

		// URLs for AJAX calls
		this.getItemInfoURL = this.base_url + "/getItemInfo";
		this.getDescriptionContainsURL = this.base_url + "/getDescriptionContains";
		this.getDescriptionStartsWithURL = this.base_url + "/getDescriptionStartsWith";
	};

	AC_Nutrition.prototype.showLoading = function() {
		$("#loading").addClass("show");
	};
	
	AC_Nutrition.prototype.hideLoading = function() {
		$("#loading").removeClass("show");
	};
	
	AC_Nutrition.prototype.getItemInfo = function( itemID ) {
		var self = this;

		// Check to see if this item is already loaded
		if( itemID === this.currentNutritionFacts.NDB_No ) return;
		
		this.showLoading();
		
		$.post(
			this.getItemInfoURL,
			{itemID:itemID},
			function( result ){
				self.currentNutritionFacts = $.parseJSON(result).item;
				self.currentNutritionFacts.nut = $.parseJSON(result).nut;
				self.currentNutritionFacts.weight = $.parseJSON(result).weight;
				
				if( self.currentNutritionFacts.weight.length === 0 ) {
					self.serving_size = 100;
				} else {
					self.serving_size = self.currentNutritionFacts.weight[0].Gm_Wgt;
				}
				
				self.setupServingSizeSelect();
				self.updateNutritionFacts();
			}
		).complete( function() { self.hideLoading(); } );
	};
	
	AC_Nutrition.prototype.getItems = function(str) {
		var self = this;
		
		this.showLoading();
		
		$.ajax( {
			url: this.getDescriptionStartsWithURL,
			dataType: "jsonp",
			data: {
				name_startsWith: str
			},
			success: function( result ){
				self.browseItemList = $.map( result.items, function( item ) {
					return {
						desc: item.Long_Desc,
						id: item.NDB_No
					};			
				});
				self.updateItemListTable();
			}
		} ).complete( function() { self.hideLoading(); } );
	};
	
	AC_Nutrition.prototype.updateItemListTable = function() {
		var i, row, link, handleRowClick, self = this;

		handleRowClick = function(e) {
			var itemNum;

			itemNum = $( $( e.target.parentNode.parentNode ).find( "td.id" )[0] ).text();
			self.getItemInfo(itemNum);
		};
		
		$("#nut_count").text( this.browseItemList.length );
		
		$("#browseItemListTable tbody tr").remove();
		for( i in this.browseItemList ) {
			row = $("<tr></tr>");
			$(row).append("<td class='id'>" + this.browseItemList[i].id + "</td>");
			$(row).append("<td title='" + this.browseItemList[i].desc.replace(/'/g, "&#39;") + "'><div>" + this.browseItemList[i].desc.replace(/'\s{2,}/g, "&#39;") + "</div></td>");
			$(row).css("cursor", "pointer");
			$(row).click( handleRowClick );
			$("#browseItemListTable tbody").append(row);
		}
	};
	
	AC_Nutrition.prototype.adjustValue = function(value, dec) {
		var adjVal;
		dec = dec ? dec : 0;
		
		// calculate the adjusted value for the given serving weight
		adjVal = this.serving_size / 100;
		return (value * adjVal).toFixed(dec);
	};
	
	AC_Nutrition.prototype.gramsToOunces = function(g) {
		return ( g * 0.03527 ).toFixed(1);
	};
	
	AC_Nutrition.prototype.updateNutritionFacts = function() {
		var i, tag, dr_keys, self=this;
		
		// Populate nutrient values

		// function to get keys from an object
		function keys(o) {
			var result, prop;
			
			if ( typeof o !== "object" ) throw TypeError();
			result = [];
			for( prop in o ) {
				if( o.hasOwnProperty( prop ) ) result.push( prop );
			}
			return result;
		}
		
		dr_keys = keys( this.daily_req );
		for ( i in dr_keys ) {
			if( this.currentNutritionFacts.nut[dr_keys[i]] ) {
				if( dr_keys[i] == "ENERC_KCAL" ) {
					$("#" + this.tab_panel + " ." + dr_keys[i] ).text( (this.adjustValue(this.currentNutritionFacts.nut[dr_keys[i]].Nutr_Val) || 0) );
				}else{
					$("#" + this.tab_panel + " ." + dr_keys[i] ).text( (this.adjustValue(this.currentNutritionFacts.nut[dr_keys[i]].Nutr_Val) || 0) + this.daily_req[dr_keys[i]].units );
				}
			}else{
				$("#" + this.tab_panel + " ." + dr_keys[i]).text( "0" + this.daily_req[dr_keys[i]].units ) ;
			}
		}
		// Calculate % values
		this.caluculateDVPercent();
		$("#" + this.tab_panel + " .nut_desc").text(this.currentNutritionFacts["Long_Desc"]);
		$("#" + this.tab_panel + " .cals_from_fat").text( Math.round( this.adjustValue( this.currentNutritionFacts.nut["FAT"].Nutr_Val ) * this.kcalFactor["fat"]) || 0 );
		$("#" + this.tab_panel + " .Lipid_Tot_PC").text( this.currentNutritionDV["FAT"] || 0 );
		$("#" + this.tab_panel + " .FA_Sat_PC").text( this.currentNutritionDV["FASAT"] || 0 );
		$("#" + this.tab_panel + " .Cholestrl_PC").text( this.currentNutritionDV["CHOLE"] || 0 );
		$("#" + this.tab_panel + " .Sodium_PC").text( this.currentNutritionDV["NA"] || 0 );
		$("#" + this.tab_panel + " .CHOCDF_PC").text( this.currentNutritionDV["CHOCDF"] || 0 );
		$("#" + this.tab_panel + " .Fiber_TD_PC").text( this.currentNutritionDV["FIBTG"] || 0 );
		$("#" + this.tab_panel + " .Protein_PC").text( this.currentNutritionDV["PROCNT"] || 0 );

		$("#" + this.tab_panel + " .VITA_IU").text(Math.round(this.currentNutritionDV["VITA_IU"] ) || 0);
		$("#" + this.tab_panel + " .VITB6A").text(Math.round(this.currentNutritionDV["VITB6A"] ) || 0);
		$("#" + this.tab_panel + " .VITB12").text(Math.round(this.currentNutritionDV["VITB12"] ) || 0);
		$("#" + this.tab_panel + " .VITC").text(Math.round(this.currentNutritionDV["VITC"]  ) || 0);
		$("#" + this.tab_panel + " .VITD").text(Math.round(this.currentNutritionDV["VITD"] ) || 0);
		$("#" + this.tab_panel + " .TOCPHA").text(Math.round(this.currentNutritionDV["TOCPHA"] ) || 0);
		$("#" + this.tab_panel + " .VITK1").text(Math.round(this.currentNutritionDV["VITK1"]) || 0);
		$("#" + this.tab_panel + " .RIBF").text(Math.round(this.currentNutritionDV["RIBF"]) || 0);
		$("#" + this.tab_panel + " .THIA").text(Math.round(this.currentNutritionDV["THIA"]) || 0);

		$("#" + this.tab_panel + " .CA").text( Math.round(this.currentNutritionDV["CA"]) || 0 );
		$("#" + this.tab_panel + " .FE").text( Math.round(this.currentNutritionDV["FE"]) || 0 );
		$("#" + this.tab_panel + " .MG").text( Math.round(this.currentNutritionDV["MG"]) || 0 );
		$("#" + this.tab_panel + " .MN").text( Math.round(this.currentNutritionDV["MN"]) || 0 );
		$("#" + this.tab_panel + " .NIA").text( Math.round(this.currentNutritionDV["NIA"]) || 0 );
		$("#" + this.tab_panel + " .P").text( Math.round(this.currentNutritionDV["P"]) || 0 );
		$("#" + this.tab_panel + " .K").text( Math.round(this.currentNutritionDV["K"] || 0) );
		$("#" + this.tab_panel + " .ZN").text( Math.round(this.currentNutritionDV["ZN"]) || 0 );
		$("#" + this.tab_panel + " .CU").text( Math.round(this.currentNutritionDV["CU"]) || 0 );
		$("#" + this.tab_panel + " .SE").text( Math.round(this.currentNutritionDV["SE"]) || 0 );
	};
	
	AC_Nutrition.prototype.setupServingSizeSelect = function() {
		var i, option, option1, option2;
		
		$(".serving_size_select option").remove();
		if(this.currentNutritionFacts.weight.length > 0) {
			for (i = 0; i < this.currentNutritionFacts.weight.length; i++ ) {
				option = $("<option value='" + 
					this.currentNutritionFacts.weight[i].Gm_Wgt + "'>" + 
					(this.currentNutritionFacts.weight[i].Amount * 1).toFixed(1) + " "  + 
					this.currentNutritionFacts.weight[i].Msre_Desc + " (" + 
					this.gramsToOunces(this.currentNutritionFacts.weight[i].Gm_Wgt) + "oz)</option>" );
				
				$("#" + this.tab_panel + " .serving_size_select").append(option);
			}
		} else {
			// Add option for default 100gm for those items that don't have a weight value
			$("#" + this.tab_panel + " .serving_size_select").append("<option value='100'>100 Grams</optoin>");
		}
	};
	
	AC_Nutrition.prototype.autocompleteRequest = function( request, response ) {
		$.ajax({
			url: this.getDescriptionContainsURL,
			dataType: "jsonp",
			data: {
				maxRows: 20,
				name_startsWith: request.term
			},
			success: function( data ) {
				response( $.map( data.items, function( item ) {
					return {
						label: item.Long_desc,
						value: item.Long_Desc,
						id: item.NDB_No
					};
				}));
			}
		});
	};
	
	AC_Nutrition.prototype.caluculateDVPercent = function() {
		var i, item, adjVal = this.serving_size / 100;
		
		this.currentNutritionDV = [];
		
		for( i in this.currentNutritionFacts.nut ) {
			item = this.currentNutritionFacts.nut[i];
			if( this.daily_req[item.Tagname] &&  this.daily_req[item.Tagname].dv !== null ) {
				if( item.Nutr_Val !== 0 ) {
					this.currentNutritionDV[item.Tagname] = Math.round( ( ( item.Nutr_Val * adjVal ) / this.daily_req[item.Tagname].dv) * 100 );
				}else{
					this.currentNutritionDV[item.Tagname] = 0;
				}
			}
		}
	};
	
	AC_Nutrition.prototype.addItemToMyFoodList = function() {
		if( this.currentNutritionFacts.NDB_No ) {
			this.myFoodList.push(this.currentNutritionFacts);
		}
	};
	
	AC_Nutrition.prototype.addBrowserItemToMyFoodList = function(e) {
		e.preventDefault();
		alert("Adding browser item to My Food List");
	};
	
	AC_Nutrition.prototype.updateMyFoodListDisplay = function() {
		
	};
	// End AC_Nutrition


/*  ******************* 
	**** Main code ****
*/
	var acn = new AC_Nutrition();
	
	function log( message ) {
		$( "<div/>" ).text( message ).prependTo( "#log" );
		$( "#log" ).attr( "scrollTop", 0 );
	}

	// Setup main page tabs
	$("#nut_tabs").tabs({
		select: function(event, ui){
			acn.tab_panel = ui.panel.id;
		}
	});

	// Setup autocomplete function
	$( "#nutrition_input" ).autocomplete({
		source: function( request, response ) { acn.autocompleteRequest( request, response); },
		select: function( event, ui ) {
			acn.getItemInfo( ui.item.id );
		}
	});
	
	// Handle the alpha tabs in the nutrition browser
	$("#alpha_tabs ul li a").click(function(e){
		e.preventDefault();
		
		// If the item is already select we don't need to do anything
		if( $( e.target ).hasClass( "selected" ) ) { return; }
		
		$("#alpha_tabs ul li a").removeClass( "selected" );
		$(e.target).addClass( "selected" );
		acn.getItems( e.target.href.substr( e.target.href.length - 1, 1 ) );
	});

	// *** Setup drop-down menus
	$(".serving_size_select").change(function(e){
		acn.serving_size = $( "#" + acn.tab_panel + " .serving_size_select" ).val();
		acn.updateNutritionFacts();
	});

	// Handle buttons
	$(".nut_add").click( function(e) {
		acn.addItemToMyFoodList();
	});

	$("#clear_foodlist").click( function(e) {
		alert("Clicked clear food list button");
	});
	$("#print_foodlist").click( function(e) {
		alert("Clicked print food list button");
	});
});
