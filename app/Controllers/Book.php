<?php

namespace App\Controllers; 
use CodeIgniter\Model; 
class Book extends BaseController
{
    function index()
    { 
        $accountId = model("Core")->accountId();
        $q1 = "SELECT id, name, sorting  FROM book
        WHERE  accountId = '$accountId' AND presence = 1 
        ORDER BY sorting ASC, input_date ASC";
        $items = $this->db->query($q1)->getResultArray();
  
        $data = array(
            "error" => false,
            "items" => $items,   
        );
        return $this->response->setJSON($data);
    }
}