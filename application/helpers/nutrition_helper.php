<?php

function calculateDVPercent($item) {
	// This is a list of the nutrtional minimum daily requirements
	// We use this to calculate the % values for the Nutrtion Facts table
	$daily_req = array(
		"Lipid_Tot"=>65,
		"FA_Sat"=>20,
		"Cholestrl"=>300,
		"Sodium"=>2400,
		"Potassium"=>3500,
		"Carbohydrt"=>300,
		"Fiber_TD"=>25,
		"Protein"=>50,
		"Vit_A_IU"=>5000,
		"Vit_C"=>60,
		"Calcium"=>1000,
		"Iron"=>18,
		"ViVit_D_IU"=>400,
		"Vit_E"=>30,
		"Vit_K"=>80,
		"Thiamin"=>1.5,
		"Riboflavin"=>1.7,
		"Niacin"=>20,
		"Vit_B6"=>2,
		"Folate_Tot"=>400,
		"Vit_B12"=>6,
		"Biotin"=>300,
		"Panto_Acid"=>10,
		"Phosphorus"=>1000,
		"Iodine"=>150,
		"Magnesium"=>400,
		"Zinc"=>15,
		"Selenium"=>70,
		"Copper"=>2,
		"Manganese"=>2,
		"Chromium"=>120,
		"Molybdenum"=>75,
		"Chloride"=>3400
	);
	
	// If an item has a weight value of 0 set it to 100g
	$item->GmWt_1 = round( $item->GmWt_1 ) != 0 ? $item->GmWt_1 : 100;
	$item->GmWt_2 = round( $item->GmWt_2 ) != 0 ? $item->GmWt_2 : 100;
	
	$adjVal = $item->GmWt_1 / 100; // Adjust the value for the item weight
	$dv = array();
	
	foreach($item as $key=>$value) {
		if( array_key_exists($key, $daily_req) ) {
			if( $value == 0 ) {
				$dv[$key] = 0;
			}else{
				$dv[$key] = round( ( ( $value * $adjVal ) / $daily_req[$key]) * 100 );
			}
		}
	}
	return $dv;
}

