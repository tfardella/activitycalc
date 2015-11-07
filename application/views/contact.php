<div class="section">
	<h2>Contact</h2>
	<div class="content">
		<p>
			 Got something to say or want more information? Fill out the form below to send us a message to let us know what's on your mind.
		</p>

		<form action="<?php // echo base_url();?>contact" method="post" accept-charset="utf-8">
			<div id="formContainer">
				<div class="formItem">
					<label for="contact_name">Name</label>
					<?php echo form_error('contact_name'); ?>
					<input type="text" class="text" name="contact_name" value="<?php echo set_value('contact_name'); ?>" id="contact_name">							
				</div>
				<div class="formItem">
					<label for="contact_email">Email</label>
					<?php echo form_error('contact_email'); ?>
					<input type="text" class="text" name="contact_email" value="<?php echo set_value('contact_email'); ?>" id="contact_email">
				</div>
				<div class="formItem">
					<label for="contact_message">Message</label>
					<?php echo form_error('contact_message'); ?>
					<textarea type="textarea" class="text" name="contact_message" rows="6" id="contact_message"><?php echo set_value('contact_message'); ?></textarea>
				</div>
				<div class="formItem nospam">
					<label for="contact_other_email">other-email</label>
					<input type="text" class="text" name="contact_other_email" value="" id="contact_other_email">
				</div>
			</div>

			<div class="formItem">
				<button type="submit" class="button blue" value="Send">Send</button>
			</div>

		</form>
		
	</div><!-- end content -->
</div>