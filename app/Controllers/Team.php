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
      
        $data = [
            "error" => false,   
            "account_team" => $items,
        ];

        return $this->response->setJSON($data);
    }
 
}