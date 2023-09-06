<?php

namespace App\Controllers; 
use CodeIgniter\Model; 
class Invited extends BaseController
{
    public function index($url)
    {
        $data = [
            "error" => false, 
            "url" => $url, 
            "invitedBy" => model("Core")->select("username","account","inviteLink = '$url' and presence = 1 and status = 1")
        ]; 
        return $this->response->setJSON($data);
    } 

     
   
}