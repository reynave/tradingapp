<?php

namespace App\Controllers; 
use CodeIgniter\Model; 
class User extends BaseController
{
    public function index()
    {
        $data = [
            "error" => false, 
            "time" => time(),
            "server" => date("Y-m-d H:i:s"),
            "mysql" =>(int) model("Core")->select('unix_timestamp(NOW())',"book","1"), 
        ];

        return $this->response->setJSON($data);
    }
 
    function share($username,$journals) {
        echo 'masuk '.$username.' '.$journals;
    }
   
}