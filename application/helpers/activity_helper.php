<?php
/*
	References:
	
	http://www.livestrong.com/article/79013-formula-using-goal-weight-calories/

	From: http://www.freedieting.com/calorie_needs.html:
	"The Freedieting Calculator

	After calculating the BMR, exercise is factored in. Depending on the exercise level chosen, 
	the BMR will be multiplied by anything from 1.2 to 1.9.

	This provides us with maintenance calories. To get the fat loss figure - 20% is subtracted. 
	The extreme fat loss figure has 40% subtracted BUT - there is a "rock bottom" figure that 
	equates to 8 calories per pound of body weight - the extreme fat loss will never be less 
	than this amount.""

	<select name="activity" size="1" class="small" id="activity">
		<option value="1.0">Basal Metabolic Rate</option>
		<option value="1.2" class="hilite">Little/no exercise (desk job)</option>
		<option selected="true" value="1.375">3 times/week</option>
		<option value="1.4625" class="hilite">5 times/week</option>
		<option value="1.550">5 times/week (intense)</option>
		<option value="1.6375" class="hilite">Every day</option>
		<option value="1.725">Every day(intense) or twice daily</option>
		<option value="1.9" class="hilite">Daily exercise + physical job</option>
	</select>

	<select name="activity" id="activity">
		<option value="1.2">Sedentary (Little Exercise)</option>
		<option value="1.375">Light Exercise (Exercise 1-3x/wk)</option>
		<option value="1.55">Moderate Exercise (Exercise 3-5x/wk)</option>
		<option value="1.725">Hard Exercise (Exercise 6-7x/wk)</option>
		<option value="1.9">Very Hard Exercise (Exercise 2x/day)</option>
	</select>

	Maintenance: Base
	Weight Loss: Base - 20%
	Weight Gain: Base + 20%
 */

// Weight in kilograms = <# lbs> / 2.2
if ( ! function_exists('lb2kilo'))
{
	function lb2kilo($lbs) {
		return $lbs / 2.2;
	}
}

// kilograms -> lbs  = <# kg> * 2.2
if ( ! function_exists('kilo2lb'))
{
	function kilo2lb($kg) {
		return $kg * 2.2;
	}
}

// Height in centimeters = <# inches> x 2.54
if ( ! function_exists('inches2cm'))
{
	function inches2cm($inches) {
		return $inches * 2.54;
	}
}

/*
 * Resting Metabolic Rate RMR
 * --------------------------
	Mifflin - St Jeor Formula
 	Males: RMR = 10 x <weight in kilograms> + 6.25 x <height in centimeters> - 5 x <age in years> + 5
 	Females: RMR = 10 x <weight in kilograms> + 6.25 x <height in centimeters> - 5 x <age in years> - 161
 */
if ( ! function_exists('rmr'))
{
	function rmr($weightk, $heightcm, $age, $gender) {

		$rmr = 10 * $weightk + 6.25 * $heightcm - 5 * $age;
		$gender = strtolower($gender);
		if( $gender == 'male') {
			$rmr = $rmr + 5;
		}else if($gender == 'female') {
			$rmr = $rmr - 161;
		}else{
			$rmr = 0;
		}
		return round($rmr);
	}
}

// Calories Burned = ((RMR / 24) * MET) * hours
if ( ! function_exists('calories'))
{
	function calories($rmr, $met, $duration = 1) {
		return round( (($rmr / 24) * $met) * ($duration / 60));
	}
}

/* BMI = ( kg/m² )
 * Below 18.5	Underweight
 * 18.5 -24.9	Normal
 * 25 - 29.9	Overweight
 * 30 & Above	Obese
*/
if ( ! function_exists('bmi'))
{
	function bmi($weightk, $heightcm) {
		$heightm = $heightcm / 100;
		return round($weightk / ($heightm * $heightm), 1);
	}
}


// weight = bmi * (heightm * heightm)
if ( ! function_exists('weight4bmi'))
{	
	function weight4bmi($heightcm) {
		$heightm = $heightcm / 100;
		$bmi_weight['under'] = round( kilo2lb( round(18.5 * ($heightm * $heightm), 1) ), 0);
		$bmi_weight['over'] = round( kilo2lb( round(25 * ($heightm * $heightm), 1) ), 0);
		$bmi_weight['obese'] = round( kilo2lb( round(30 * ($heightm * $heightm), 1) ), 0);
		return $bmi_weight;
	}
}

if ( ! function_exists('bmi_status'))
{
	function bmi_status($bmi) {
		$bmi_status = "";
		
		If( $bmi < 18.5 ) {
			$bmi_status = "Underweight";
		}else if( $bmi >= 18.5 && $bmi < 25 ) {
			$bmi_status = "Normal";
		}else if( $bmi >= 25 && $bmi < 30 ) {
			$bmi_status = "Overweight";
		}else if( $bmi >= 30 ) {
			$bmi_status = "Obese";
		}
		return $bmi_status;
	}
}

/*
	Body Fat Formula For Women
	Factor 1	(Total body weight x 0.732) + 8.987
	Factor 2	Wrist measurement (at fullest point) / 3.140
	Factor 3	Waist measurement (at naval) x 0.157
	Factor 4	Hip measurement (at fullest point) x 0.249
	Factor 5	Forearm measurement (at fullest point) x 0.434
	Lean Body Mass	Factor 1 + Factor 2 - Factor 3 - Factor 4 + Factor 5
	Body Fat Weight	Total bodyweight - Lean Body Mass
	Body Fat Percentage	(Body Fat Weight x 100) / total bodyweight

	Body Fat Formula For Men
	Factor 1	(Total body weight x 1.082) + 94.42
	Factor 2	Waist measurement x 4.15
	Lean Body Mass	Factor 1 - Factor 2
	Body Fat Weight	Total bodyweight - Lean Body Mass
	Body Fat Percentage	(Body Fat Weight x 100) / total bodyweight

	or 

	Lean Body Weight (men) = (1.10 x Weight(kg)) - 128 x ( Weight2/(100 x Height(m))2)
	Lean Body Weight (women) = (1.07 x Weight(kg)) - 148 x ( Weight2/(100 x Height(m))2)
 */
if ( ! function_exists('lbm'))
{
	function lbm($weightk, $heightm, $gender) {
		if($gender == 'male') {
			return (1.10 * $weightk) - 128 * ( pow($weightk,2) / pow((100 * $heightm),2));
		}else if ($gender == 'female') {
			return (1.07 * $weightk) - 148 * ( pow($weightk,2) / pow((100 * $heightm),2));
		}
	}
}
