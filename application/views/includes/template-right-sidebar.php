<!DOCTYPE html>
<html lang="en">
<head>
	<?php $this->load->view('includes/header'); ?>
</head>
<body>
	<div id="outer_container" class="container">
		<div id="heading" class="span-24 last">
			<?php $this->load->view('includes/page_heading'); ?>
		</div>

		<div id="main_nav" class="span-24 last">
			<?php $this->load->view('includes/main_navigation'); ?>
		</div>

		<div id="flash_message" class="span-24 last"></div>	

		<div id="main-body" class="span-24 last">
			<div id="left_content" class="span-17">
				<?php $this->load->view($page); ?>
			</div>

			<div id="right_sidebar" class="span-7 last">
				<?php $this->load->view($right_sidebar); ?>
			</div>			
		</div>
		
		<div id="footer" class="span-24 last">
			<div class="content">
				<?php $this->load->view('includes/footer'); ?>
			</div>
		</div>
	</div>

</body>
</html>
