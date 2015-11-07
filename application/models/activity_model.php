<?php
class Activity_model extends CI_Model {

    function __construct() {
        parent::__construct();
    }

	function getCategoryList() {
        $query = $this->db->get('category');
        return $query->result();
    }

	function getActivityList($category_id) {		
		if($category_id == '0') {
        	$query = $this->db->get('mets');
		}else{
			$this->db->order_by("description", "asc");
        	$query = $this->db->get_where('mets', array('category_id' => $category_id));
		}
        return $query->result();
    }

	function getActivityDetails($code) {
		$query = $this->db->get_where('mets', array('code' => $code));
		return $query->result();
	}
}
