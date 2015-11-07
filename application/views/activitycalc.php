<div class="span-17 last">
	<p>
		<strong>Find your ideal weight!</strong> ActivityCalc.com provides an easy way to determine how many calories are burned 
		for all your daily activities. It will also calculate your Resting Metabolic Rate (RMR) and Body Mass 
		Index (BMI).  Create a list of all the activities you do in a day and see the total calories burned. 
		Just enter the your weight, height, and age information below. The results will update automatically 
		as you make changes making it easy to see how different values will affect your results. Play with the 
		numbers, especially the weight, to see how changes can affect the number of calories burned.
	</p>

	<div class="content ads">
		<?php if(ENVIRONMENT != 'development') { $this->load->view('includes/google-adsense-link-horiz-468x15'); } ?>
	</div>
</div>

<div class="span-18 last">
	<h3>Step 1: Enter Your Information</h3>
</div>
<div id="left-side" class="span-9">
	<form id="rmr-form" name="rmr_form" action="http://ci.test/site/rmr_submit" method="POST" accept-charset="utf-8">
		<div class="section">
			<div class="content">			
				<div class="input_block">
					<label>Gender: </label>
					<div id="gender">
						<input type="radio" id="gender-female" name="gender" value="female" /><label for="gender-female">Female</label>
						<input type="radio" id="gender-male" name="gender" value="male" /><label for="gender-male">Male</label>
					</div>
				</div>

				<div id="sliders">
					<div class="input_block">
						<label for="weight">Weight (lbs): </label>
						<span id="weight_display" class="display_field"></span>
						<input type="hidden" class="slider-value" id="weight" />
						<div id="weight_slider" class="slider"></div>
					</div>

					<div class="input_block" class="section">
						<label for="height">Height: </label>
						<input type="hidden" class="slider_value" id="height" />
						<span id="height_display" class="display_field"></span>
						<div id="height_slider" class="slider"></div>
					</div>

					<div class="input_block">
						<label for="age">Age: </label>
						<input type="hidden" class="slider_value" id="age" />
						<span id="age_display" class="display_field"></span>
						<div id="age_slider" class="slider"></div>			
					</div>								
				</div>
				<div>
					<label for="activity_level">Activity Level:</label>
					<select name="activity_level" id="activity_level" size="1">
						<option value="1.2">Sedentary (Little or no exercise)</option>
						<option value="1.375">Light Exercise (Exercise 1-3x per week)</option>
						<option value="1.55">Moderate Exercise (Exercise 3-5x per week)</option>
						<option value="1.725">Hard Exercise (Exercise 6-7x per week)</option>
						<option value="1.9">Very Hard Exercise (Exercise 2x a day)</option>
					</select>
					
				</div>
			<div id="bmi_bar">
				<img src="/images/bmi-bar-338.png" width="338" height="81" />
				<div id="uwt">xxx</div>
				<div id="norm">xxx</div>
				<div id="owt">xxx</div>
			</div>
			</div>
		</div>
	</form>	
		
</div>
<div id="right-side" class="span-8 last">
	<div class="section result">
		<h3>Your Resting Metabolic Rate</h3>
		<h2 id="rmr-result-day"><span>???</span> Calories/Day</h2>
		<h2 id="rmr-result-hour"><span>???</span> Calories/Hour</h2>
		<a id="rmr-info" class="info-click" href="">What does this mean?</a>
		<hr />

		<h3>Your Body Mass Index</h3>
		<h2 id="bmi-result"><span>???</span> BMI</h2>
		<h2 id="bmi-status-result"><span>???</span></h2>
		<a id="bmi-info" class="info-click" href="">What does this mean?</a>
		<hr />
		
		<h3>Estimated Calorie Requirements</h3>
		<table border="0" cellspacing="5" cellpadding="5">
			<tbody>
				<tr><td>Maintenance</td><td><span id="cal_maintenance">????</span> Calories/Day<td></tr>
				<tr><td>Weight Loss</td><td><span id="cal_weight_loss">????</span> Calories/Day<td></tr>
				<tr><td>Weight Gain</td><td><span id="cal_weight_gain">????</span> Calories/Day<td></tr>
			</tbody>
		</table>
		<a id="cal_req_info" class="info-click" href="">What does this mean?</a>
	</div>
</div>

<div class="content ads span-17 last">
	<?php if(ENVIRONMENT != 'development') { $this->load->view('includes/google-adsense-link-horiz-468x15'); } ?>
</div>

<div class="span-17 last">
	<h3>Step 2: Select Activities</h3>
</div>
<div id="left-side" class="span-9">
	<div id="activity" class="section">
		<div class="content">			
			<button id="add_activity" type="button" class="button green">Add Activity >></button>
			<label for="met_category">Category</label>
			<br />
			<select name="met_category" id="met_category" size="1">
				<option value="0">Select Activity Category...</option>				
			</select>
			<br />
			<label for="met_activity">Activity</label>
			<select name="met_activity" id="met_activity" size="1" style="width:340px;" disabled >
				<option value="00000">Select an Activity...</option>
			</select>

			<div class="input_block">
				<label>Duration: </label>
				<input type="hidden" class="slider-value" id="duration" />
				<span id="duration_display" class="display_field"></span>
				<div id="duration_slider" class="slider"></div>			
			</div>								
		</div>
	</div>
	
	<div class="section">
		<div class="content" id="action_buttons">
			<hr />
			<button id="print" type="button" class="button blue">Print Report</button>
			<button id="clear_activities" type="button" class="button blue">Clear Activities List</button>
		</div>
		<br style="clear:both;"/>
	</div>
</div>

<div id="right-side" class="span-8 last">	
	<div class="section result">
		<h3>Calories Burned</h3>
		<h2 id="met_result"><span>???</span> METs</h2>
		<h2 id="calories_result"><span>???</span> Calories</h2>
		<a id="met_info" class="info-click" href="">What does this mean?</a>
		<table id="activity_list" border="0" cellspacing="3" cellpadding="3">
			<thead>
				<tr><th class="id">1</th><th class="desc">Activity</th><th class="cals">Calories</th><th class="del"></th></tr>
			</thead>
			<tfoot><tr><td class="id"></td><td>Total</td><td id="total_calories"></td><td></td></tr></tfoot>
			<tbody>
			</tbody>
		</table>
	</div>
</div>


<!-- Dialog boxes -->
<div id="dialog-rmr" title="What is Resting Metabloic Rate (RMR)?">
	<p>
		Resting metabolic rate, or RMR, (sometimes called Basal Metabolic Rate or BMR) represents the calories that we use when at rest and simply breathing. This energy is used for cell growth and repair, and other bodily functions.
		RMR accounts for 65 to 75 percent of daily energy expenditure and represents the minimum energy needed to maintain all physiological cell functions in the resting state.
	</p>
</div>

<div id="dialog_cal_req" title="What is Estimated Calorie Requirements?">
	<p>
		The Estimated Calorie Requirements are just that, a rough estimate based on the Activity Level selection you chose. Each
		level from lowest to highest multiplies the Resting Metabolic Rate calories calculated by a number from 1.2 to 1.9 to arrive
		at the estimate. It should provide a good approximation of what your daily caloric intake should be.
	</p>
	<p>
		For the weight loss estimate we subtract 20% from the maintenance calorie requirements. For weight gain we add 20%. This should
		give reasonable numbers for accomplishing moderate weight loss or gain.
	</p>
</div>

<div id="dialog-bmi" title="What is Body Mass Index (BMI)?">
	<p>
		An estimate of an individual’s relative body fat calculated from his or her height and weight. It is calculated using the formula BMI=weight (kg)/height (m)2. Research studies in large groups of people have shown that the BMI can be classified into ranges associated with health risk. There are four categories of BMI ranges. These are: 
	</p>
	<table class="description">
		<tr><td>Below 18.5</td><td>Underweight</td></tr>
		<tr><td>18.5 -24.9</td><td>Normal</td></tr>
		<tr><td>25 - 29.9</td><td>Overweight</td></tr>
		<tr><td>30 &amp; Above</td><td>Obese</td></tr>
	</table>
</div>

<div id="dialog-met" title="What is a MET?">
	<p>
		This stands for "one metabolic unit" at rest. Thus if an exercise is five times as energy burning 
		as what you do at rest, it would be five METs. Normally you burn one kilocalorie per kilogram of 
		body weight per hour. A kilocalorie is what we normally call a calorie in terms of eating. 
	</p>
	<p>	
		Calories burned is calculated by multiplying your resting calories per hour (RMR) times the Met 
		value for the chosen activity.
	</p>
</div>

<div id="dialog_clear_activities" title="Clear Activities List">
	<br />
	<p>
		Are you sure you want to clear the activities list?
	</p>
</div>
