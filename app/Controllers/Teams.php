<?php

namespace App\Controllers; 
use CodeIgniter\Model; 
class Teams extends BaseController
{
    
    function index(){
        $accountId = model("Core")->accountId();
 
        $qTeams = "SELECT a.id, a.email, a.name, a.picture
        FROM account_team AS t
        JOIN account AS a ON a.id = t.invitedId 
        WHERE t.accountId = '$accountId' ";
        $teams = $this->db->query($qTeams)->getResultArray();
  
        $data = array(
            "error" => false, 
            "teams" => $teams
        );
        return $this->response->setJSON($data); 
    }
}