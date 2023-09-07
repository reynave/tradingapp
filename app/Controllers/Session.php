<?php

namespace App\Controllers; 
use CodeIgniter\Model; 
class Session extends BaseController
{
    public function index()
    {
        $accountId = model("Core")->accountId();
        $q1 = "SELECT *
        FROM account_login  
        WHERE accountId = '$accountId'";
        $items = $this->db->query($q1)->getResultArray();
       
        $data = [
            "error" => false,   
            "items" => $items, 
        ];

        return $this->response->setJSON($data);
    }  
}