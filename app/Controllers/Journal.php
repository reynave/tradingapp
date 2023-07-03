<?php

namespace App\Controllers;

use CodeIgniter\Model;

class Journal extends BaseController
{
    function index($id)
    {

        $accountId = model("Core")->accountId();
        $q1 = "SELECT  ja.bookId, p.name AS 'permission', p.fontIcon, a.name AS 'ownBy',j.*, ja.owner,  '' AS checkbox , ja.presence, ja.admin
        FROM journal_access AS ja
        JOIN journal AS j ON j.id = ja.journalId
        JOIN permission AS p ON p.id = j.permissionId
        JOIN account AS a ON a.id = j.accountId
        WHERE ja.accountId = '$accountId' and (ja.presence = 1 OR ja.presence = 4) and ja.bookId = '$id'
        ORDER BY ja.sorting ASC, ja.input_date ASC";
        $items = $this->db->query($q1)->getResultArray();

        $permission = "SELECT * FROM permission 
        ORDER BY id ASC";
        $permission = $this->db->query($permission)->getResultArray();

        $book = "SELECT * FROM book WHERE accountId  = '$accountId' and id = '$id'";
        $book = $this->db->query($book)->getResultArray();

        $data = array(
            "error" => false,
            "items" => $items,
            "book" => $book[0],
          //  "q" => $q1,
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
        WHERE ja.presence = 1 and ja.journalId = '" . $this->request->getVar()['journalId'] . "'
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
        if ($post &&  $post['name'] != "") {
            $this->db->transStart();
            $journalId = model("Core")->number("backtest");
            $this->db->table("journal")->insert([
                "id" => $journalId,
                "name" => $post['name'],
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
                "bookId" => $post['id'],
                "accountId" => model("Core")->accountId(),
                "journalId" => $journalId,
                "owner" => 1,
                "changeable" => 1,
                "editable" => 1,
                "admin" => 1,
                "presence" => 1,
                "sorting" => 99,
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


    function fnEditableChange() {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post &&  $post['book']['name'] != "") {
              
            $this->db->table("book")->update([ 
                "name" => $post['book']['name'], 
                "update_date" => date("Y-m-d H:i:s"),
                "update_by" => model("Core")->accountId(), 
            ]," id = '".$post['book']['id']."' AND accountId = '".model("Core")->accountId()."' ");
             
            $data = array(
                "error" => false, 
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
                    } else {
                        $this->db->table("journal_access")->update([
                            "presence" => 4,
                            "update_date" => date("Y-m-d H:i:s"),
                            "update_by" => model("Core")->accountId(),
                        ], "journalId = '" . $row['id'] . "' and accountId = '" . model("Core")->accountId() . "' ");
                    }
                }
            }
        }

        return $this->response->setJSON($data);
    }

    function onSubmitUser()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $accountId = model("Core")->select("id", "account", "email = '" . $post['addUser'] . "' and presence = 1 ");
            $avaiable = $accountId ? true : false;
            $duplicate = false;
            $journal_access = [];
            if ($avaiable == true) {

                $duplicate = model("Core")->select("id", "journal_access", "accountId = '" . $accountId . "' and journalId = '" . $post['item']['id'] . "' and presence = 1 ") ? true : false;

                if ($duplicate === false) {
                    $this->db->table("journal_access")->update([
                        "presence" => 0,
                        "input_date" => date("Y-m-d H:i:s"),
                        "input_by" => model("Core")->accountId(),
                        "update_date" => date("Y-m-d H:i:s"),
                        "update_by" => model("Core")->accountId(),
                    ], " accountId = '$accountId' AND journalId = '" . $post['item']['id'] . "' ");


                    $this->db->table("journal_access")->insert([
                        "accountId" => $accountId,
                        "journalId" => $post['item']['id'],
                        "owner" => 0,
                        "editable" => 1,
                        "changeable" => 0,
                        "presence" => 1,
                        "input_date" => date("Y-m-d H:i:s"),
                        "input_by" => model("Core")->accountId(),
                        "update_date" => date("Y-m-d H:i:s"),
                        "update_by" => model("Core")->accountId(),
                    ]);
                }
            } else {
                // $this->db->table("journal_access")->update([
                //     "presence" => 0,
                //     "update_date" => date("Y-m-d H:i:s"),
                //     "update_by" => model("Core")->accountId(),
                // ], "presence  = 4 AND accountId =  '".model("Core")->accountId()."' "); 
            }

            $q1 = "SELECT ja.*, a.name, a.email
            FROM journal_access AS ja
            JOIN account AS a ON a.id = ja.accountId
            WHERE ja.presence = 1 and ja.journalId = '" . $post['item']['id'] . "'
            ORDER BY  ja.owner DESC, ja.input_date  ASC ";
            $journal_access = $this->db->query($q1)->getResultArray();

            $data = [
                "error" => false,
                "avaiable" => $avaiable,
                "post" => $post,
                "duplicate" => $duplicate,
                "journal_access" => $journal_access,
            ];

        }

        return $this->response->setJSON($data);
    }

    function onRemoveAccess()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->table("journal_access")->update([
                "presence" => 4,
                "update_date" => date("Y-m-d H:i:s"),
                "update_by" => model("Core")->accountId(),
            ], "id = '" . $post['access']['id'] . "' and accountId = '" .$post['access']['accountId']  . "' ");

            $q1 = "SELECT ja.*, a.name, a.email
            FROM journal_access AS ja
            JOIN account AS a ON a.id = ja.accountId
            WHERE ja.presence = 1 and ja.journalId = '" . $post['item']['id'] . "'
            ORDER BY  ja.owner DESC, ja.input_date  ASC ";
            $journal_access = $this->db->query($q1)->getResultArray();

            $data = [
                "error" => false, 
                "post" =>$post,
                "journal_access" => $journal_access,
            ];

        }

        return $this->response->setJSON($data);
    }

    function fnClearTrashBin()
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
            $this->db->table("journal_access")->update([
                "presence" => 0,
                "update_date" => date("Y-m-d H:i:s"),
                "update_by" => model("Core")->accountId(),
            ], "presence  = 4 AND accountId =  '" . model("Core")->accountId() . "' ");

        }

        return $this->response->setJSON($data);
    }

    function sorting()
    {
        $post = $this->request->getVar();

        $i = 1;
        foreach ($post as $row) {
            $this->db->table("journal_access")->update([
                "sorting" => $i,
                "update_date" => date("Y-m-d H:i:s"),
                "update_by" => model("Core")->accountId(),
            ], " journalId = '$row' AND accountId =  '" . model("Core")->accountId() . "' ");
            $i++;
        }
        $data = [
            "error" => false,
        ];

        return $this->response->setJSON($data);
    }
}