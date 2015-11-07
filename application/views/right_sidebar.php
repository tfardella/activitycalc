<?php
//	date_default_timezone_set('America/Los_Angeles');
//	if ( fmod( date('w'), 2 ) == 0 ) {
	$i = 0;
	if($i) {
?>
	<div id="affiliates" class="section">
		<?php if(ENVIRONMENT != 'development') { $this->load->view('includes/affiliates'); } ?>
	</div>
<?php } else { ?>
	<!-- div id="ads-1" class="section">
		<?php // if(ENVIRONMENT != 'development') { $this->load->view('includes/google-adsense-square-250x250'); } ?>
	</div -->
<?php } ?>

<div id="ads-2" class="section">
	<div class="content ads">
		<?php if(ENVIRONMENT != 'development') { $this->load->view('includes/google-adsense-wide-skyscrapper-text'); } ?>
	</div>
</div>
