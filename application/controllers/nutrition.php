<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Nutrition extends CI_Controller {
	
	public function index() {
		$data['page'] = 'nutrition';
		$data['page_title'] = 'Nutrition Browser - Find nutrition info on thousands of food items';
		$data['right_sidebar'] = 'right_sidebar';
		$data['nutrition_facts'] = 'includes/nutrition_facts';
		$data['nutrition_facts_horiz'] = 'includes/nutrition_facts_horiz';
		$data['load_scripts'] = array("nutrition.js");
		$this->load->view('includes/template-right-sidebar', $data);
	}

/*
 * AJAX entry points for nutrition
 */
	function getDescriptionContains() {
		$this->load->model('nutrition_model');
		$desc = $_GET["name_startsWith"];
		$max = $_GET["maxRows"] ? $_GET["maxRows"] : 15;
		$callback = $_GET["callback"];
		$items = $this->nutrition_model->getDescContains($desc, $max);
		$result["items"] = $items;
		echo $callback . "(" . json_encode($result) . ");";		
	}
	
	function getDescriptionStartsWith() {
		$this->load->model('nutrition_model');
		$desc = $_GET["name_startsWith"];
		$callback = $_GET["callback"];
		$items = $this->nutrition_model->getDescStartsWith($desc, 2000);
		$result["items"] = $items;
		echo $callback . "(" . json_encode($result) . ");";		
	}
	
	function getItemInfo() {
		$this->load->helper('nutrition');
		$this->load->model('nutrition_model');
		$id = $_POST["itemID"];
		$item = $this->nutrition_model->getItemInfo($id);
		$tmp = $this->nutrition_model->getItemNutrients($id);
		foreach ( $tmp as $k => $v) {
			$nut[$v->Tagname] = $v;
		}
		
		$weight = $this->nutrition_model->getItemWeights($id);
		$result["item"] = $item[0];
		$result["nut"] = $nut;
		$result["weight"] = $weight;
		echo json_encode($result);
	}
}
