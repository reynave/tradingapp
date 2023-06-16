<?php

namespace App\Controllers;

use CodeIgniter\Model;

class Market extends BaseController
{
    public function index()
    { 
        $data = array(
            "error" => true,
            "selectMarket" => $this->db->query("SELECT * FROM market ORDER BY name ASC ")->getResultArray(),
        ); 

        return $this->response->setJSON($data);
    }
 
}
