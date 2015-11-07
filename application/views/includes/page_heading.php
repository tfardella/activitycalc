<a href="<?php echo base_url();?>">
	<h1>ActivityCalc.com</h1>
	<h2>Information to Help Build a Better Body</h2>
</a>
<div id="ads-heading">
	<div id="social_buttons">
		<div id="gplus" style="float: right; margin-right: 6px;">
			<?php if(ENVIRONMENT != 'development') { $this->load->view('includes/google-plus-one'); } ?>			
		</div>
		<div style="float: right;">
			<?php if(ENVIRONMENT != 'development') { $this->load->view('includes/share-this'); } ?>			
		</div>
		<div id="heading_ad_block">
			<?php if(ENVIRONMENT != 'development') { $this->load->view('includes/google-adsense-horiz-banner'); } ?>
		</div>
	</div>
</div>
