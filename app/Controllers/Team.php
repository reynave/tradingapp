<?php

namespace App\Controllers; 
use CodeIgniter\Model; 
class Team extends BaseController
{
    public function index()
    {
        $accountId = model("Core")->accountId();
        $q1 = "SELECT a.id, a.name, a.username, a.email, t.status, t.input_date, a.picture
        FROM account_team AS t
        LEFT JOIN account AS a ON a.id = t.invitedId
        WHERE t.accountId = '$accountId'   AND t.presence = 1 ";
        $items = $this->db->query($q1)->getResultArray();
      
        $i = 0;
        foreach($items as $row){
            $items[$i]['picture'] = model("Core")->isUrlValid($items[$i]['picture']) ? $items[$i]['picture'] : base_url().'uploads/picture/'.$items[$i]['picture'];
            $i++;
        }

        $data = [
            "error" => false,   
            "account_team" => $items,
            "inviteLink" => model("Core")->select("inviteLink","account","id='".model("Core")->accountId()."'"),
        ];

        return $this->response->setJSON($data);
    }

    function widget(){
        $accountId = model("Core")->accountId();
 
        $qTeams = "SELECT a.id, a.email, a.name, a.picture
        FROM account_team AS t
        JOIN account AS a ON a.id = t.invitedId 
        WHERE t.accountId = '$accountId' ";
        $teams = $this->db->query($qTeams)->getResultArray();
  
        $i = 0;
        foreach($teams as $row){
            $teams[$i]['picture'] = model("Core")->isUrlValid($teams[$i]['picture']) ? $teams[$i]['picture'] : base_url().'uploads/picture/'.$teams[$i]['picture'];
            $i++;
        }

        $data = array(
            "error" => false, 
            "teams" => $teams,
            "inviteLink" => model("Core")->select("inviteLink","account","id='".model("Core")->accountId()."'"),
        );
        return $this->response->setJSON($data); 
    }
}