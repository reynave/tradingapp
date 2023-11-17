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
    function journal()
    {
        $accountId = model("Core")->accountId();
        $a = "SELECT * FROM invited 
        WHERE presence = 1 and approved = 0 and accountId = '$accountId'
        ORDER BY input_date ASC";
        $a = $this->db->query($a)->getResultArray();
        $data = [
            "error" => false,
            "items" => $a
        ];
        return $this->response->setJSON($data);
    }

    function waitingApproved()
    {
        $accountId = model("Core")->accountId();
        $email = model("Core")->select("email","account","id = '$accountId' and presence = 1 ");
        $a = "SELECT i.* , a.name, j.name AS 'journal'
        FROM invited AS i
        LEFT JOIN account AS a ON a.id = i.accountId
        LEFT JOIN journal AS j ON j.id = i.journal_id
        WHERE i.email = '$email'
        AND i.presence = 1 AND i.approved = 0
        ORDER BY i.input_date ASC";
        $a = $this->db->query($a)->getResultArray();
        $data = [
            "error" => false,
            "items" => $a,  
        ];
        return $this->response->setJSON($data);
    }

    function fnRejectInvited(){
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $id = $post['item']['id'];
            $this->db->transStart();
            $this->db->table("invited")->update([ 
                "approved" => $post['approved'],
                "presence" => 1,
                "update_date" => date("Y-m-d H:i:s"),
            ]," id = $id ");

            if($post['approved'] == 1){
                $this->db->table("journal_access")->insert([ 
                    "bookId" => 0,
                    "accountId"  => model("Core")->select("id","account","email = '".$post['item']['email']."' "),
                    "journalId" => $post['item']['journal_id'],
                    "owner" => 0,
                    "editable" => 1, 
                    "changeable" => 0,
                    "admin" => 0, 
                    "presence" => 1,
                    "input_date" => date("Y-m-d H:i:s"),
                    "input_by" => model("Core")->accountId(),
                    
                    "update_date" => date("Y-m-d H:i:s"),
                    "update_by" => model("Core")->accountId(),
                    
                ]," id = $id ");
            }
            $this->db->transComplete();
            $data = [
                "error" => false,
                "post" => $post, 
                "transStatus" => $this->db->transStatus(),
            ];

            return $this->response->setJSON($data);
        }
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
