<meta http-equiv="Content-Type" content="text/html; charset=utf-8"> 
<title><?php echo($page_title)?> - ActivityCalc.com</title>

<meta name="description" content="Find calories burned for over 300 activities. Find nutrition information on thousands of food items. Calculate your BMI and RMR.">
<meta name="keywords" content="Calories burned, body mass index BMI Nutrition Browser health fitness">
<meta name="google-site-verification" content="fTgtpV--HIapjXp-r22_vbjj5LU74mHdGr0_38RwVGA" />

<link rel="icon" type="image/png" href="<?php echo base_url();?>images/favicon2.png">

<!-- Blueprint CSS stylesheets -->
<link href="<?php echo base_url();?>css/blueprint/screen.css" type="text/css" rel="stylesheet" media="screen, projection">
<link href="<?php echo base_url();?>css/blueprint/print.css" type="text/css" rel="stylesheet" media="print"> 
<!--[if lt IE 8]>
	<link rel="stylesheet" href="<?php echo base_url();?>css/blueprint/ie.css" type="text/css" media="screen, projection">
<![endif]-->

<!-- jQueryUI theme stylesheet-->
<link href="<?php echo base_url();?>css/activitycalc2/jquery-ui-1.8.14.custom.css" type="text/css" rel="Stylesheet" />	

<link href="<?php echo base_url();?>css/style.css" type="text/css" rel="stylesheet" media="screen" />
<!--[if IE]>
	<link rel="stylesheet" href="<?php echo base_url();?>css/iefixes.css" type="text/css" media="screen">
<![endif]-->

<!-- jQuery and jQueryUI scripts-->
<script src="<?php echo base_url();?>scripts/jquery-1.6.1.min.js" type="text/javascript"></script>
<script src="<?php echo base_url();?>scripts/jquery-ui-1.8.14.custom.min.js" type="text/javascript"></script>
<!--[if IE]>
	<script src="<?php echo base_url();?>scripts/json2.min.js" type="text/javascript"></script>
<![endif]-->

<!-- 3rd party scripts - Don't load if ENVIRONMENT == development -->
<?php if(ENVIRONMENT != 'development') { ?>
	<script type="text/javascript" src="http://apis.google.com/js/plusone.js"></script>
<?php } ?>

<!-- Load scripts for specific pages -->
<?php if( count($load_scripts) > 0 ) {
		foreach( $load_scripts as $script_name ) {
	?>
	<script src="<?php echo base_url();?>scripts/<?php echo $script_name ?>" type="text/javascript"></script>
<?php }
	} ?>
	
<?php $this->load->view('includes/google-analytics'); ?>

