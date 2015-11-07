<?php

class Form extends CI_Controller {

	// Edit these values for your application
	$fromEmail = "jdoe@myapp.com";
	$fromName = "John Doe";
	$toEmail = "jdoe@example.com";

	function __construct() {
		parent::__construct();
		$this->load->helper('form');
		$this->load->library('form_validation');
	}

	function index() {
		$this->contact();
	}
	
	function contact()
	{
		$contact_rules = array(
               array(
                     'field'   => 'contact_name', 
                     'label'   => 'Name', 
                     'rules'   => 'trim|required|min_length[4]|max_length[24]|xss_clean'
                  ),
               array(
                     'field'   => 'contact_email', 
                     'label'   => 'Email', 
                     'rules'   => 'trim|required|valid_email'
                  ),
               array(
                     'field'   => 'contact_message', 
                     'label'   => 'Message', 
                     'rules'   => 'required|min_length[2]'
                  ),   
               array(
                     'field'   => 'contact_other_email', 
                     'label'   => 'Spam', 
                     'rules'   => 'max_length[0]'
                  )
            );
		
		$this->form_validation->set_rules($contact_rules);
		
		if ($this->form_validation->run() == FALSE ) {
			if ( set_value("contact_other_email") !== "" ) {
				log_message('info', ' - Contact Spam: ' . set_value("contact_other_email") );
			}
			$data['page'] = 'contact';
			$data['page_title'] = 'Contact';
			$data['right_sidebar'] = 'right_sidebar';
			$data['load_scripts'] = array();
//			$this->session->set_flashdata("message", "Sorry, there was a problem sending your message.");
			$this->load->view('includes/template-right-sidebar', $data);
		} else {
			$this->sendContactEmail();
			
			$data['page'] = 'thankyou';
			$data['page_title'] = 'Thank You';
			$data['right_sidebar'] = 'right_sidebar';
			$data['load_scripts'] = array();

//			$this->session->set_flashdata("message", "Thanks! You're message has been sent.");
			$this->load->view('includes/template-right-sidebar', $data);

		}
	}

	function sendContactEmail() {
		$this->load->library('email');

		$this->email->from($fromEmail, $fromName);
		$this->email->to($toEmail);

		$this->email->subject('ActivityCalc Contact Info');
		$message = "Name: ".set_value("contact_name") . "\n" .
					"Email: ".set_value("contact_email") . "\n\n" .
					"Message: \n".set_value("contact_message");
					
		$this->email->message($message);
		$this->email->send();		
	}
}
