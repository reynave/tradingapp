<?php

namespace App\Controllers;

use CodeIgniter\Model;

class Invited extends BaseController
{
    function index()
    {
        $data = [
            "error" => false,
        ];
        return $this->response->setJSON($data);
    }


    function fnInvited()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->table("invited")->insert([
                "accountId" => model("Core")->accountId(),
                "email" => $post['email'],
                "journal_id" => $post['journal_id'],
                "approved" => 0,
                "presence" => 1,
                "input_date" => date("Y-m-d H:i:s"),
            ]);

            $data = [
                "error" => false,
                "post" => $post,
                "accountId" => model("Core")->accountId(),
            ];
            return $this->response->setJSON($data);
        }
    }
}
