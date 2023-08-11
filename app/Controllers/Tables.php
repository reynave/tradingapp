<?php

namespace App\Controllers;

use CodeIgniter\Model;

class Tables extends BaseController
{
    function index()
    {
        $data = array(
            "error" => false,
        );
        return $this->response->setJSON($data);
    }

    function boardTitle()
    {
        $data = array(
            "error" => true,
            "request" => $this->request->getVar(),
        );

        $id = model("Core")->select("journalId", "journal_access", "journalId = '" . $data['request']['id'] . "' and accountId = '" . model("Core")->accountId() . "'  and presence = 1");
        if ($data['request']['id'] && $id) {

            $b = "SELECT * FROM color   ORDER BY id ASC ";
            $backgroundColorOption = $this->db->query($b)->getResultArray();

            $accountId =  model("Core")->accountId();
            $q1 = "SELECT  ja.id as journal_accessID, ja.bookId, p.name AS 'permission', p.fontIcon, 
            a.name AS 'ownBy',j.*, ja.owner,  '' AS checkbox , ja.presence, ja.admin, a.picture
            FROM journal_access AS ja
            LEFT JOIN journal AS j ON j.id = ja.journalId
            LEFT JOIN permission AS p ON p.id = j.permissionId
            JOIN account AS a ON a.id = j.accountId
            WHERE ja.accountId = '$accountId' and (ja.presence = 1 OR ja.presence = 4) and j.id = '$id'
            ORDER BY ja.sorting ASC, ja.input_date ASC";
    
            $items = $this->db->query($q1)->getResultArray();
  
            $data = array(
                "error" => false,
                "id" => $id,
                //"item" => $this->db->query("SELECT * from journal where id = '$id' ")->getResultArray()[0],
                 "item" =>  $items[0],
                
                "permission" => $this->db->query("SELECT * from permission")->getResultArray(),
                "backgroundColorOption" => $backgroundColorOption,
            );
        }
        return $this->response->setJSON($data);
    }

    function header()
    {
        $data = array(
            "error" => true,
            "request" => $this->request->getVar(),
        );

        $id = model("Core")->select("journalId", "journal_access", "journalId = '" . $data['request']['id'] . "' and accountId = '" . model("Core")->accountId() . "'  and presence = 1");
        if ($data['request']['id'] && $id) {

            $c = "SELECT *, '' as showEvalDev  FROM journal_custom_field 
            WHERE journalId = '$id' and presence = 1
            ORDER BY sorting ASC ";
            $journal_custom_field = $this->db->query($c)->getResultArray();
 
            $accountId = model("Core")->accountId();
            $d = "SELECT * 
            FROM journal_access
            WHERE accountId = '$accountId' and journalId = '".$data['request']['id']."' AND presence = 1";
            $journal_access = $this->db->query($d)->getResultArray()[0];

            $data = array(
                "journal_access" => $journal_access,
                "error" => false,
                "id" => $id,
                "customField" => $journal_custom_field,

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

        $accountId = model("Core")->accountId();
        $journalTableViewId = $data['request']['journalTableViewId'];
        $id = model("Core")->select("journalId", "journal_access", "journalId = '" . $data['request']['id'] . "' and accountId = '$accountId'  and presence = 1");
        if ($data['request']['id'] && $id) {

            $c = "SELECT *, CONCAT('f',f) AS 'key' FROM journal_custom_field 
            WHERE journalId = '$id' and presence = 1
            ORDER BY sorting ASC ";
            $journal_custom_field = $this->db->query($c)->getResultArray();

            $customField = "";
            $customFieldNo = [];
            foreach ($journal_custom_field as $r) {
                $customField .= ", f" . $r['f'];
                array_push($customFieldNo, "f" . $r['f']);
            }


            $select = [];
            foreach ($customFieldNo as $rec) {
                $option = "SELECT *
                FROM journal_select 
                where journalId = '$id' and field = '$rec' and presence = 1 order by sorting ASC, id DESC";

                $optionDelete = "SELECT *
                FROM journal_select 
                where journalId = '$id' and field = '$rec' and presence = 0 order by sorting ASC, id DESC";

                $fieldsUser = "ja.id, ja.owner, ja.editable, a.name as 'value', a.id AS 'accountId', a.picture,
                a.presence AS 'accountPresence' ";

                $users = "SELECT $fieldsUser
                FROM journal_access AS ja
                LEFT join account AS a ON a.id = ja.accountId
                WHERE ja.journalId = '$id' AND ja.presence = 1
                ORDER BY a.name asc;";

                $usersDelete = "SELECT $fieldsUser
                FROM journal_access AS ja
                LEFT join account AS a ON a.id = ja.accountId
                WHERE ja.journalId = '$id' AND ja.presence = 0
                ORDER BY a.name asc;";
                
                $temp = array(
                    "field" => $rec,
                    "option" => $this->db->query($option)->getResultArray(),
                    "optionDelete" => $this->db->query($optionDelete)->getResultArray(),

                    "users" => $this->db->query($users)->getResultArray(),
                    "usersDelete" => $this->db->query($usersDelete)->getResultArray(),

                );
                array_push($select, $temp);
            }

            $b = "SELECT * FROM color  ORDER BY id ASC ";
            $backgroundColorOption = $this->db->query($b)->getResultArray();

            $journalTable = model("Core")->journalTable($id, $journalTableViewId);

            $data = array(
                "error" => false,
                "id" => $id,
                "backgroundColorOption" => $backgroundColorOption,
                "select" => $select,

                "customFieldKey" => $journalTable['customFieldKey'],
                "customField" => $journalTable['journal_custom_field'],
                "detail" => $journalTable['detail'],
                "archives" => $journalTable['archives'],

            );


        }
        return $this->response->setJSON($data);
    }
    function httpDataFormula()
    {
        $data = array(
            "error" => true,
            "request" => $this->request->getVar(),
        );
        $accountId = model("Core")->accountId();
        $journalTableViewId = $data['request']['journalTableViewId'];
        $id = model("Core")->select("journalId", "journal_access", "journalId = '" . $data['request']['id'] . "' and accountId = '$accountId'  and presence = 1");
        if ($data['request']['id'] && $id) {
            $journalTable = model("Core")->journalTableFormula($id, $journalTableViewId);
            $data = array(
                "error" => false,
                "id" => $id,
                "detail" => $journalTable,
            );
        }
        return $this->response->setJSON($data);
    }

    function addTask()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $id = $post['journalId'];
            $this->db->table("journal_detail")->insert([
                "sorting" => model("Core")->select("count(id)", "journal_detail", "journalId = '$id' and presence = 1 "),
                'journalId' => $post['journalId'],
                'presence' => 1,
                "input_by" => model("Core")->accountId(),
                "input_date" => date("Y-m-d H:i:s"),
            ]);

            $newId = model("Core")->select("id", "journal_detail", "journalId = '$id' ORDER BY input_date desc");

            $c = "SELECT *, CONCAT('f',f) AS 'key' FROM journal_custom_field 
            WHERE journalId = '$id' and presence = 1
            ORDER BY sorting ASC ";
            $journal_custom_field = $this->db->query($c)->getResultArray();

            $customField = "";
            $customFieldNo = [];
            foreach ($journal_custom_field as $r) {
                $customField .= ", f" . $r['f'];
                array_push($customFieldNo, "f" . $r['f']);
            }

            $q = "SELECT id, ilock, journalId, false AS 'checkbox' $customField 
            FROM journal_detail 
            where journalId = '$id' and id = '$newId' and presence = 1 order by sorting DESC";
            $detail = $this->db->query($q)->getResultArray();

            $data = array(
                "error" => false,
                "post" => $post,
                "detail" => $detail,
            );
        }
        return $this->response->setJSON($data);
    }

    function deleteTask()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            foreach ($post['detail'] as $row) {
                $this->db->table("journal_detail")->update([
                    'presence' => 0,
                    "input_by" => model("Core")->accountId(),
                    "input_date" => date("Y-m-d H:i:s"),
                ], " id = '" . $row['id'] . "' ");
            }
            $data = array(
                "error" => false,
                "post" => $post,
            );
        }
        return $this->response->setJSON($data);
    }

    function duplicateTask()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $accountId = model("Core")->accountId();
            foreach ($post['detail'] as $row) {
                $id = $row['id'];
                $journalId = model("Core")->select("journalId", "journal_detail", "id='$id'");
                $this->db->table("journal_detail")->insert([
                    'presence' => 1,
                    'journalId' => $journalId,
                    "input_by" => $accountId,
                    "input_date" => date("Y-m-d H:i:s"),
                ]);

                $newId = model("Core")->select("id", "journal_detail", " journalId='$journalId' and input_by = '$accountId' order by input_date DESC");
                $query = $this->db->query("SELECT * FROM journal_detail WHERE id = '$id'");
                foreach ($query->getFieldNames() as $field) {
                    if ($field != 'id') {
                        $this->db->table("journal_detail")->update([
                            $field => model("Core")->select($field, "journal_detail", "id='$id'"),
                        ], " id = '$newId' ");
                    }
                }

            }

            $data = array(
                "error" => false,
                "post" => $post,
            );
        }
        return $this->response->setJSON($data);
    }
    function lock()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            foreach ($post['detail'] as $row) {
                $this->db->table("journal_detail")->update([
                    'ilock' => 1,
                    "input_by" => model("Core")->accountId(),
                    "input_date" => date("Y-m-d H:i:s"),
                ], " id = '" . $row['id'] . "' ");
            }
            $data = array(
                "error" => false,
                "post" => $post,
            );
        }
        return $this->response->setJSON($data);
    }
    function unlock()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            foreach ($post['detail'] as $row) {
                $this->db->table("journal_detail")->update([
                    'ilock' => 0,
                    "update_by" => model("Core")->accountId(),
                    "update_date" => date("Y-m-d H:i:s"),
                ], " id = '" . $row['id'] . "' ");
            }
            $data = array(
                "error" => false,
                "post" => $post,
            );
        }
        return $this->response->setJSON($data);
    }
    function archives()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            foreach ($post['detail'] as $row) {
                $this->db->table("journal_detail")->update([
                    'archives' => 1,
                    "input_by" => model("Core")->accountId(),
                    "input_date" => date("Y-m-d H:i:s"),
                ], " id = '" . $row['id'] . "' ");
            }
            $data = array(
                "error" => false,
                "post" => $post,
            );
        }
        return $this->response->setJSON($data);
    }
    function unarchives()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->table("journal_detail")->update([
                'archives' => 0,
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], " journalId = '" . $post['id'] . "' ");

            $data = array(
                "error" => false,
                "post" => $post,
            );
        }
        return $this->response->setJSON($data);
    }

    function fnHide()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $id = model("Core")->select("id", "journal_table_view_show", " journalTableViewId = '" . $post['journalTableViewId'] . "'  AND journalCustomFieldId = '" . $post['item']['id'] . "'  ");

            if ($id) {
                $this->db->table("journal_table_view_show")->update([
                    'hide' => (int) $post['hide'],
                ], " id = '$id' ");
            } else {
                $this->db->table("journal_table_view_show")->insert([
                    'hide' => (int) $post['hide'],
                    'journalTableViewId' => $post['journalTableViewId'],
                    'journalCustomFieldId' => $post['item']['id'],
                ]);
            }
            $data = array(
                "error" => false,
                "post" => $post,
            );
        }
        return $this->response->setJSON($data);
    }

    function sortableDetail()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $i = 0;
            foreach ($post['order'] as $row) {
                $this->db->table('journal_detail')->update([
                    "sorting" => $i++,
                ], "id = $row ");
            }
            $data = array(
                "error" => false,
                "post" => $post,
            );
        }
        return $this->response->setJSON($data);
    }

    function journal_select()
    {
        $data = array(
            "error" => true,
            "request" => $this->request->getVar(),
        );

        $id = model("Core")->select("journalId", "journal_access", "journalId = '" . $data['request']['id'] . "' and accountId = '" . model("Core")->accountId() . "'  and presence = 1");
        if ($data['request']['id'] && $id) {

            $c = "SELECT * FROM journal_custom_field
             WHERE journalId = '$id'  and presence = 1 
             ORDER BY sorting ASC ";
            $journal_custom_field = $this->db->query($c)->getResultArray();

            $customField = "";
            $customFieldNo = [];
            foreach ($journal_custom_field as $r) {
                $customField .= ", f" . $r['f'];
                array_push($customFieldNo, "f" . $r['f']);
            }

            $select = [];
            foreach ($customFieldNo as $rec) {
                $option = "SELECT *
                FROM journal_select 
                where journalId = '$id' and field = '$rec' and presence = 1 order by sorting ASC, id DESC";

                $optionDelete = "SELECT *
                FROM journal_select 
                where journalId = '$id' and field = '$rec' and presence = 0 order by sorting ASC, id DESC";

                $temp = array(
                    "field" => $rec,
                    "option" => $this->db->query($option)->getResultArray(),
                    "optionDelete" => $this->db->query($optionDelete)->getResultArray(),

                    "q" => $option,
                );
                array_push($select, $temp);
            }

            $data = array(
                "error" => false,
                "customFieldNo" => $customFieldNo,
                "select" => $select,
                "customField" => $journal_custom_field,
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
            echo "f445 tidak ada";
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

    function onSubmit()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            if ($post['item']['name'] != "") {
                $this->db->table("journal")->update([
                    'name' => $post['item']['name'],
                    "update_by" => model("Core")->accountId(),
                    "update_date" => date("Y-m-d H:i:s"),
                ], "id = '" . $post['id'] . "' ");
            }

            $this->db->table("journal")->update([
                'permissionId' => $post['item']['permissionId'],
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['id'] . "' ");

            $data = array(
                "error" => false,
                "post" => $post,
                "rollback" => array(
                    "name" => model("Core")->select("name", "journal", "id= '" . $post['id'] . "'  "),
                )

            );
        }

        return $this->response->setJSON($data);
    }

    function evaltest()
    {
        $data = [
            'f1' => 10,
            'f2' => 12
        ];

        $formula = model("Core")->select("eval", "journal_custom_field", "id=58");

        $evaluateFormula = function ($data, $formula) {
            extract($data);
            try {
                return eval("return $formula;");
            } catch (Throwable $e) {
                return false;
            }
        };


        // if ($result !== false) {
        //     echo $result; // Output: "111"
        // } else {
        //     echo 'Error evaluating formula';
        // }
        $obj = array(
            "data" => $evaluateFormula($data, $formula),
            "error" => false,
        );

        return $this->response->setJSON($obj);
    }
}