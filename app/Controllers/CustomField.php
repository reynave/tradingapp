<?php

namespace App\Controllers;

use CodeIgniter\Model;

class CustomField extends BaseController
{ 
    
    function updateData()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
           
            $this->db->table("journal_detail")->update([
                "f".$post['newItem']['customField']['f'] => $post['newItem']['value'],
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" .$post['newItem']['id'] . "' ");
            

            $data = [
                "error" => false,
                "post" => $post,
            ]; 
        }

        return $this->response->setJSON($data);
    }
 
}