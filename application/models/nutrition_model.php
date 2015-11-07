<?php
class Nutrition_model extends CI_Model {

    function __construct() {
        parent::__construct();
    }

	function getFoodGroupList() {
		return $this->db->get("fd_group");
	}
	
	function getDescContains($str, $max=15) {
		$matches = explode(" ", $str);
		$this->db->select('Long_Desc, NDB_No');
		foreach($matches as $match) {
			$this->db->like('Long_Desc', $match);			
		}
		$this->db->order_by("Long_Desc", "asc");
        $query = $this->db->get('food_des', $max);
        return $query->result();
	}
	
	function getDescStartsWith($str, $max=12) {
		$this->db->select('Long_Desc, NDB_No');
		$this->db->like('Long_Desc', $str, 'after');
		$this->db->order_by("Long_Desc", "asc");
        $query = $this->db->get('food_des', $max);
        return $query->result();
    }

	function getItemInfo($itemID) {
//		$this->db->select('food_des.NDB_No, food_des.Long_Desc, food_des.Shrt_Desc, food_des.ManufacName, food_des.FdGrp_Cd, fd_group.FdGrp_Desc');
		$this->db->select('food_des.NDB_No, food_des.Long_Desc');
		$this->db->from('food_des');
//		$this->db->join('fd_group', 'food_des.FdGrp_Cd = fd_group.FdGrp_Cd');
		$where = "food_des.NDB_No = " . $itemID;
		$this->db->where( $where );
		$query = $this->db->get();
		return $query->result();
		
	}
	
	function getItemNutrients($itemID) {
		$this->db->select('nut_data.Nutr_No, nut_data.Nutr_Val, nutr_def.NutrDesc, nutr_def.Tagname, nutr_def.Units');
		$this->db->from('nut_data');
		$this->db->join('nutr_def', 'nut_data.Nutr_No = nutr_def.Nutr_No');
		$this->db->where( "nut_data.NDB_No = " . $itemID );
		$query = $this->db->get();
		return $query->result();		
	}
	
	function getItemWeights($ItemID) {
		$this->db->where('NDB_No', $ItemID); 
		$query = $this->db->get('weight');
		return $query->result();
	}
}
