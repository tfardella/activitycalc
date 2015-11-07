<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class ActivityCalc extends CI_Controller {

	public function index() {
		$data['page'] = 'activitycalc';
		$data['page_title'] = 'Activity Calculator - Calculate calories burned and BMI';
		$data['right_sidebar'] = 'right_sidebar';
		$data['load_scripts'] = array('activitycalc.js');
		$this->load->view('includes/template-right-sidebar', $data);
	}

/*
 * AJAX entry points for ActivityCalc
 */

	/* Read user info from session cookie
		Input: userInfo object (either passed as parameter or in POST)
		Output: none
	 */
	public function getUserInfo() {
		
	 	echo $this->session->userdata("userInfo");
	}

	// Save user into to a session cookie
	public function saveUserInfo($userInfo=null) {
		if( $userInfo )	{
			$this->session->set_userdata("userInfo", $userInfo);
		}else{
			$this->session->set_userdata("userInfo", $_POST['userInfo']);
		}
	}
	
	/*
		Input: userInfo object via POST
		Output: rmr, bmi, bmi status, bmi weight
	 */
	public function getRMR() {
		if (isset ( $_POST['userInfo'] ) ) {
			$userInfo = json_decode( $_POST['userInfo'] );
			$weightkg = lb2kilo( $userInfo->weight );
			$heightcm = inches2cm( $userInfo->height );
			$rmr = rmr( $weightkg, $heightcm, $userInfo->age, $userInfo->gender );
			$bmi = bmi( $weightkg, $heightcm );
			$bmi_status = bmi_status( $bmi );
			$bmi_weight = weight4bmi( $heightcm );

			// Save user info to session cookie
			$this->saveUserInfo( json_encode( $userInfo ) );
			echo json_encode(array( "rmr"=>$rmr, "bmi"=>$bmi, "bmi_status"=>$bmi_status, "bmi_weight"=>$bmi_weight ) );
		}else{
			echo "error";
		}
	}

	/*
		Input: none
		Output: list of activity categories
	 */
	public function getActivityCategoryList() {		
		$this->load->model('activity_model');
		$categoryList = $this->activity_model->getCategoryList();
		echo json_encode($categoryList); 		
	}

	/*
		Input: category ID via POST
		Output: list of activities for given category
	 */
	public function getActivityList() {
		$this->load->model('activity_model');
		$id = $_POST["id"];
		$data = array("activityCategoryID" => $id );

		$activityList = $this->activity_model->getActivityList($id);
		echo json_encode($activityList);
	}
	
	/*
		Input: activity code, rmr, and duration via POST
		Output: activity details and calculated calories
	 */
	public function getActivityCalories() {
		$this->load->model('activity_model');
		$code = $_POST["code"];
		$rmr = $_POST["rmr"];
		$duration = $_POST["duration"];
		
		$activity = $this->activity_model->getActivityDetails($code);
		$result["activity"] = $activity[0];
		$calories = calories($rmr, $activity[0]->mets, $duration );
		$result["calories"] = $calories;
		echo json_encode($result);
	}
	
	/*
		Input: list of activities and resting metabolic rate via POST
		Output: list of activities with calories calculated
	 */
	public function getActivityListCalories() {
		$actList = json_decode($_POST["activityList"]);
		$rmr = $_POST["rmr"];

		if( count($actList) > 0 ) {
			foreach( $actList as &$act ) {
				$act->calories = calories($rmr, $act->activity->mets, $act->duration);
			}
		}
		
		echo json_encode($actList);
	}
}
