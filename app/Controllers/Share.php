<?php

namespace App\Controllers; 
use CodeIgniter\Model; 
class Share extends BaseController
{
    public function index($url)
    {
        $data = [
            "error" => false, 
            "url" => $url, 
        ];

        return $this->response->setJSON($data);
    } 

     
   
}