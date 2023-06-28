<?php

namespace App\Controllers;

use CodeIgniter\Model;

class Backtest extends BaseController
{
    public function index()
    {
        
        $accountId = model("Core")->accountId(); 
        $q1 = "SELECT  p.name AS 'permission', p.fontIcon, a.name AS 'ownBy',j.*, ja.owner
        FROM journal_access AS ja
        JOIN journal AS j ON j.id = ja.journalId
        JOIN permission AS p ON p.id = j.permissionId
        JOIN account AS a ON a.id = j.accountId
        WHERE ja.accountId = '$accountId'
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

    function detail()
    {
        $data = array(
            "error" => true,
            "request" => $this->request->getVar(),
        );

        $id = model("Core")->select("id", "journal", "id='" . $data['request']['id'] . "' and presence = 1");
        if ($data['request']['id'] && $id) {

            $c = "SELECT id,f, name, iType FROM journal_custom_field WHERE journalId = '$id' ORDER BY sorting ASC ";
            $journal_custom_field = $this->db->query($c)->getResultArray();

            $customField = "";
            foreach ($journal_custom_field as $r) {
                $customField .= ", f" . $r['f'];
            }
            $q = "SELECT id, journalId, positionId,  marketId, openDate, closeDate,  sl, rr,  tp,  resultId, note,
            time_to_sec(timediff(closeDate, openDate )) / 3600  AS 'tradingTime', false AS 'checkbox' $customField 
            FROM journal_detail 
            where journalId = '$id' and presence = 1";

            $detail = $this->db->query($q)->getResultArray();

            $data = array(
                "error" => false,
                "id" => $id,
                "item" => $this->db->query("SELECT * from journal where id = '$id' ")->getResultArray()[0],
                "detail" => $detail,
                "customField" => $journal_custom_field,
                "q" => $q,
            );
        }
        return $this->response->setJSON($data);
    }
 

    function table()
    {
        $fields = $this->db->getFieldNames('journal_detail');
        $arr = array();
        $i = 4;
        for ($n = 1; $n <= $i; $n++) {
            $arr[] = $n;
        }
        print_r($arr);
        foreach ($fields as $field) {
            echo $field . "<br>";
        }

        if ($this->db->fieldExists('f445', 'journal_detail')) {
            echo "esis";
        }
        $n = 1;
        $max = 0;
        do {

            if ($this->db->fieldExists("f$n", 'journal_detail')) {
                $max++;
            } else {
                break;
            }
            $n++;
        } while (true);

        echo $max;
    }
    function addCustomField()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $total = model("Core")->select("count(id)", "journal_custom_field", "journalId= '" . $post['id']."' ");
            $n = 1;
            $max = 0;
            do {
                if ($this->db->fieldExists("f$n", 'journal_detail')) {
                    $max++;
                } else {
                    break;
                }
                $n++;
            } while (true);


            if ($total < $max) {


                $i = 1;
                for ($n = 1; $n <= $max; $n++) {
                    if (!model("Core")->select("id", "journal_custom_field", "journalId = '" . $post['id'] . "' AND f = " . $n)) {
                        $i = $n;
                        break;
                    }

                }

                if ($this->db->fieldExists("f$i", 'journal_detail')) {

                    $this->db->table("journal_custom_field")->insert([
                        "f" => $i,
                        "name" => "custom Field $i",
                        "iType" => "text",
                        "sorting" => $i * 10,
                        "journalId" => $post['id'],
                        "input_by" => model("Core")->accountId(),
                        "input_date" => date("Y-m-d H:i:s"),
                    ]);
                    $data = array(
                        "error" => false,
                        "post" => $post,
                    );
                }
            } else {
                $data = array(
                    "error" => true,
                    "post" => $post,
                    "note" => "Max $max",
                );
            }

        }
        return $this->response->setJSON($data);
    }
    function removeCustomeFlied()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            if (model("Core")->select("accountId", "journal", "id= '" . $post['id'] . "' ") == model("Core")->accountId()) {
                $f = model("Core")->select("f", "journal_custom_field", "id = " . $post['bcfId']);
                $this->db->table("journal_detail")->update([
                    "f" . $f => "",
                ], " journalId = '" . $post['id'] . "' ");

                $this->db->table("journal_custom_field")->delete([
                    "id" => $post['bcfId'],
                ]);
                $data = array(
                    "error" => false,
                    "post" => $post,
                );

            }
        }
        return $this->response->setJSON($data);
    }
 
    function detailImages()
    {
        $data = array(
            "error" => true,
            "request" => $this->request->getVar(),
        );

        $data = array(
            "detailImages" => $this->db->query("SELECT * FROM 
            journal_detail_images WHERE journalDetailId = '" . $data['request']['id'] . "' AND presence = 1 ORDER BY sorting ASC
            ")->getResultArray(),
        );

        return $this->response->setJSON($data);
    }

    function removeImages()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {

            $this->db->table("journal_detail_images")->update([
                "presence" => 0,
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['id'] . "' ");


            $data = array(
                "error" => false,
                "detailImages" => $this->db->query("SELECT * FROM 
                    journal_detail_images WHERE journalDetailId = '" . $post['journalDetailId'] . "' AND presence = 1 ORDER BY sorting ASC
                ")->getResultArray(),
            );
        }
        return $this->response->setJSON($data);
    }

    function onSubmit()
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
                "name" => $post['item']['name'],
                "permissionId" => $post['item']['permissionId'],
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['id'] . "' ");

            foreach ($post['detail'] as $row) {
                $this->db->table("journal_detail")->update([
                    "marketId" => $row['marketId'],
                    "sl" => $row['sl'],
                    "rr" => $row['rr'],
                    "tp" => $row['tp'],
                    "closeDate" => $row['closeDate']['year'] . "-" . $row['closeDate']['month'] . "-" . $row['closeDate']['day'] . " " . $row['closeTime'] . ":00",

                    "openDate" => $row['openDate']['year'] . "-" . $row['openDate']['month'] . "-" . $row['openDate']['day'] . " " . $row['openTime'] . ":00",
                    "note" => "",
                    "resultId" => $row['resultId'],
                    "positionId" => $row['positionId'],

                    "update_date" => date("Y-m-d H:i:s"),
                ], "id = '" . $row['id'] . "' ");

                // Update custom Field
                for ($i = 1; $i <= 4; $i++) {
                    if (isset($row['f' . $i])) {
                        $this->db->table("journal_detail")->update([
                            "f" . $i => $row['f' . $i],
                        ], "id = '" . $row['id'] . "' ");
                    }
                }

            }
        }

        return $this->response->setJSON($data);
    }

    function fnAddItems()
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
            $this->db->table("journal_detail")->insert([
                "journalId" => $post['id'],
                "presence" => 1,
                "input_date" => date("Y-m-d H:i:s"),
                "update_date" => date("Y-m-d H:i:s"),
            ]);
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
            foreach ($post['detail'] as $row) {
                if ($row['checkbox'] == true) {
                    $this->db->table("journal_detail")->update([
                        "presence" => 0,
                        "update_date" => date("Y-m-d H:i:s"),
                    ], "id = '" . $row['id'] . "' ");
                }
            }
        }

        return $this->response->setJSON($data);
    }
}