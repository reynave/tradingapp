<?php

namespace App\Controllers;

use CodeIgniter\Model;

class Journal extends BaseController
{
    public function index()
    {

        $accountId = model("Core")->accountId();
        $q1 = "SELECT  p.name AS 'permission', p.fontIcon, a.name AS 'ownBy',j.*, ja.owner,  '' AS checkbox , ja.presence
        FROM journal_access AS ja
        JOIN journal AS j ON j.id = ja.journalId
        JOIN permission AS p ON p.id = j.permissionId
        JOIN account AS a ON a.id = j.accountId
        WHERE ja.accountId = '$accountId' and (ja.presence = 1 OR ja.presence = 4)
        ORDER BY ja.input_date  ASC";
        $items = $this->db->query($q1)->getResultArray();

        $permission = "SELECT * FROM permission 
        ORDER BY id ASC";
        $permission = $this->db->query($permission)->getResultArray();


        $data = array(
            "error" => false,
            "items" => $items,
            "permission" => $permission,
            "header" => model("Core")->header()
        );
        return $this->response->setJSON($data);
    }

    function access()
    { 
       // $accountId = model("Core")->accountId();
        $q1 = "SELECT ja.*, a.name, a.email
        FROM journal_access AS ja
        JOIN account AS a ON a.id = ja.accountId
        WHERE ja.presence = 1 and ja.journalId = '".$this->request->getVar()['journalId']."'
        ORDER BY  ja.owner DESC, ja.input_date  ASC ";
        $items = $this->db->query($q1)->getResultArray();

        $data = array(
            "error" => false,
            "q1" => $q1,
            "journal_access" => $items,
        );
        return $this->response->setJSON($data);
    }

    function onCreateNew()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->transStart();
            $journalId = model("Core")->number("backtest");
            $this->db->table("journal")->insert([
                "id" => $journalId,
                "name" => "New " . date("Y-m-d H:i"),
                "url" => uniqid(),
                "borderColor" => "#3AA6B9",
                "backgroundColor" => "#C1ECE4",
                "accountId" => model("Core")->accountId(),
                "presence" => 1,
                "version" => 1,
                "update_date" => date("Y-m-d H:i:s"),
                "update_by" => model("Core")->accountId(),
                "input_date" => date("Y-m-d H:i:s"),
                "input_by" => model("Core")->accountId(),
            ]);

            $this->db->table("journal_access")->insert([
                "accountId" => model("Core")->accountId(),
                "journalId" => $journalId,
                "owner" => 1,
                "changeable" => 1,
                "editable" => 1,
                "presence" => 1,
                "update_date" => date("Y-m-d H:i:s"),
                "update_by" => model("Core")->accountId(),
                "input_date" => date("Y-m-d H:i:s"),
                "input_by" => model("Core")->accountId(),
            ]);
            $this->db->transComplete();
            if ($this->db->transStatus() === false) {
                $this->db->transRollback();
            } else {
                $this->db->transCommit();
            }

            $data = array(
                "error" => false,
                "transStatus" => $this->db->transStatus(),
            );

        }
        return $this->response->setJSON($data);
    }

    function onUpdatePermission()
    {

        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {

            $data = [
                "error" => false,
                "post" => $post,
            ];
            $this->db->table("journal")->update([
                "permissionId" => $post['permission']['id'],
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['item']['id'] . "' ");
        }

        return $this->response->setJSON($data);
    }

    function fnDeleteAll()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $data = [
                "error" => false,
                "post" => $post,
            ];
            foreach ($post['items'] as $row) {
                if ($row['checkbox'] === true) {
                    if ($row['owner'] == 1) {
                        $this->db->table("journal")->update([
                            "presence" => 0,
                            "update_date" => date("Y-m-d H:i:s"),
                            "update_by" => model("Core")->accountId(),
                        ], "id = '" . $row['id'] . "' ");
                        
                        $this->db->table("journal_detail")->update([
                            "presence" => 0,
                            "update_date" => date("Y-m-d H:i:s"),
                            "update_by" => model("Core")->accountId(),
                        ], "journalId = '" . $row['id'] . "' ");
                        //journal_detail_images
                        //journal_custom_field
                        $this->db->table("journal_access")->update([
                            "presence" => 4,
                            "update_date" => date("Y-m-d H:i:s"),
                            "update_by" => model("Core")->accountId(),
                        ], "journalId = '" . $row['id'] . "' ");

                        
                    }
                }
            }
        }

        return $this->response->setJSON($data);
    }

    function fnRemovePresence(){
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $data = [
                "error" => false,
                "post" => $post,
            ];
            $this->db->table("journal_access")->update([
                "presence" => 0,
                "update_date" => date("Y-m-d H:i:s"),
                "update_by" => model("Core")->accountId(),
            ], "presence  = 4 AND accountId =  '".model("Core")->accountId()."' ");

            
        }

        return $this->response->setJSON($data);
    }
}