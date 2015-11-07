<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Page extends CI_Controller {

	public function index()
	{
		$data['page'] = 'activitycalc';
		$data['page_title'] = 'Activity Calculator - Calculate calories burned and BMI';
		$data['right_sidebar'] = 'right_sidebar';
		$data['load_scripts'][0] = 'activitycalc.js';
		$this->load->view('includes/template-right-sidebar', $data);
	}
	
	public function about()
	{
		$data['page'] = 'about';
		$data['page_title'] = 'About';
		$data['right_sidebar'] = 'right_sidebar';
		$data['load_scripts'] = array();
		$this->load->view('includes/template-right-sidebar', $data);
	}

	public function resources()
	{
		$data['page'] = 'resources';
		$data['page_title'] = 'Resources';
		$data['right_sidebar'] = 'right_sidebar';
		$data['load_scripts'] = array();
		$this->load->view('includes/template-right-sidebar', $data);
	}

	public function notfound() {
		$data['page'] = '404';
		$data['page_title'] = 'Page Not Found';
		$data['right_sidebar'] = 'right_sidebar';
		$data['load_scripts'] = array();
		$this->load->view('includes/template-right-sidebar', $data);
	}
}
