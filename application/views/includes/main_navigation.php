<ul>
	<li id="activitycalc"><a href="<?php echo base_url();?>">Activity Calculator</a></li>
	<li id="nutrition"><a href="<?php echo base_url();?>nutrition">Nutrition Browser</a></li>
	<li id="about"><a href="<?php echo base_url();?>page/about">About</a></li>
	<li id="contact"><a href="<?php echo base_url();?>form/contact">Contact</a></li>
</ul>

<script>
	var page = "<?php echo $page ?>";
	$("#main_nav li").removeClass("selected");
	$("#main_nav li#" + page).addClass("selected");
</script>
