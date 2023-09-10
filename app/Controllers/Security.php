<?php

namespace App\Controllers;

use CodeIgniter\Model;

class Security extends BaseController
{
    public function index()
    {
        $accountId = model("Core")->accountId();
        $data = [
            "error" => false,
            "hasPassword" => model("Core")->select('password', "account", "id = '$accountId'") == "" ? false : true,
        ];
        return $this->response->setJSON($data);
    }

    function changePassword()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
            "note" => "Error Session",
        ];
        if ($post) {
            $accoundId = model("Core")->accountId();

            $data = [
                "error" => false,
                "post" => $post,
                "note" => "Wrong password",
            ];
            if (model("Core")->select("password", "account", "id = '$accoundId' and presence = 1 ") == '') {
                $this->db->table("account")->update([
                    "password" => $post['password'],
                    "update_date" => date("Y-m-d H:i:s"),
                ], " id = '$accoundId' and presence = 1 ");
                $data = [
                    "error" => false,
                    "post" => $post,
                    "note" => "Password Save",
                ];
            } else if( model("Core")->select("password", "account", "id = '$accoundId' and presence = 1 ") == $post['oldPassword'] ) {
                $this->db->table("account")->update([
                    "password" => $post['password'],
                    "update_date" => date("Y-m-d H:i:s"),
                ], " id = '$accoundId' and presence = 1");

                $data = [
                    "error" => false,
                    "post" => $post,
                    "note" => "Password Update",
                ];
            }
           
        }

        return $this->response->setJSON($data);
    }

}