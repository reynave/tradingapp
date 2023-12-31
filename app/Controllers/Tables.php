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

            $accountId = model("Core")->accountId();
            $q1 = "SELECT  ja.id as journal_accessID, ja.bookId, p.name AS 'permission', p.fontIcon, 
            a.name AS 'ownBy',j.*, ja.owner,  '' AS checkbox , ja.presence, ja.admin, a.picture
            FROM journal_access AS ja
            LEFT JOIN journal AS j ON j.id = ja.journalId
            LEFT JOIN permission AS p ON p.id = j.permissionId
            JOIN account AS a ON a.id = j.accountId
            WHERE ja.accountId = '$accountId' and (ja.presence = 1 OR ja.presence = 4) and j.id = '$id'
            ORDER BY ja.sorting ASC, ja.input_date ASC";

            $items = $this->db->query($q1)->getResultArray();
            $items[0]['picture'] = base_url() . 'uploads/picture/' . $items[0]['picture'];
            $items[0]['url_title'] = url_title($items[0]['name']);

            $data = array(
                "error" => false,
                "id" => $id,
                "item" => $items[0],
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
        $accountId = model("Core")->accountId();
        $id = model("Core")->select("journalId", "journal_access", "journalId = '" . $data['request']['id'] . "' and accountId = '" . $accountId . "'  and presence = 1");
        if ($data['request']['id'] && $id) {

            $c = "SELECT *, '' as showEvalDev  FROM journal_custom_field 
            WHERE journalId = '$id' and presence = 1
            ORDER BY sorting ASC ";
            $journal_custom_field = $this->db->query($c)->getResultArray();


            $d = "SELECT * 
            FROM journal_access
            WHERE accountId = '$accountId' and journalId = '" . $data['request']['id'] . "' AND presence = 1";
            $journal_access = $this->db->query($d)->getResultArray()[0];
            $templateCode = model("Core")->select("templateCode", "journal", "id='$id'");
            $data = array(
                "journal_access" => $journal_access,
                "error" => false,
                "id" => $id,
                "customField" => $journal_custom_field,
                "template" => model("Core")->select("name", "template", "code='$templateCode'"),
                "templateCode" => $templateCode,
                "startBalance" => (int) model("Core")->select("startBalance", "journal", "id='$id'"),
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
                $option = "SELECT *, 0 as 'total'
                FROM journal_select 
                where journalId = '$id' and field = '$rec' and presence = 1 order by sorting ASC, id DESC";

                $optionDelete = "SELECT *, 0 as 'total'
                FROM journal_select 
                where journalId = '$id' and field = '$rec' and presence = 0 order by sorting ASC, id DESC";

                $temp = array(
                    "field" => $rec,
                    "option" => $this->db->query($option)->getResultArray(),
                    "optionDelete" => $this->db->query($optionDelete)->getResultArray(),
                );
                array_push($select, $temp);
            }

            $b = "SELECT * FROM color  ORDER BY id ASC ";
            $backgroundColorOption = $this->db->query($b)->getResultArray();

            $journalTable = model("Core")->journalTable($id, $journalTableViewId);
            $tableViewOnly = model("TableViewOnly")->journalTable($id, $journalTableViewId, "");

            for ($i = 0; $i < count($journalTable['detail']); $i++) {
                $journalTable['detail'][$i]['searchable'] = $tableViewOnly['detail'][$i];
            }

            // $journal_select = model("Core")->journal_select($id);


            $users = "SELECT ja.id, ja.owner, ja.editable, a.name as 'value', a.id AS 'accountId',
             concat('" . base_url() . "uploads/picture/',a.picture) as 'picture',  
            ja.presence AS 'presence' 
            FROM journal_access AS ja
            LEFT join account AS a ON a.id = ja.accountId
            WHERE ja.journalId = '$id' AND ja.presence = 1
            ORDER BY a.name asc;";
            $users = $this->db->query($users)->getResultArray();

            $usersHistory = "SELECT ja.id, ja.owner, ja.editable, a.name as 'value', a.id AS 'accountId',
            concat('" . base_url() . "uploads/picture/',a.picture) as 'picture',  
           ja.presence AS 'presence' 
           FROM journal_access AS ja
           LEFT join account AS a ON a.id = ja.accountId
           WHERE ja.journalId = '$id'  
           ORDER BY a.name asc;";
            $usersHistory = $this->db->query($usersHistory)->getResultArray();



            $data = array(
                "error" => false,
                "id" => $id,
                "backgroundColorOption" => $backgroundColorOption,
                "select" => $select,
                "customField" => $journalTable['journal_custom_field'],
                "detail" => $journalTable['detail'],
                "users" => $users,
                "usersHistory" => $usersHistory,
                "archives" => $journalTable['archives'],
                "filterSelect" => $journalTable['filterSelect'],
                "filterDetail" => $journalTable['filterDetail'],
                "q" => $journalTable['q'],

                //"customFieldKey" => $journalTable['customFieldKey'],
                //   "customFieldNo" => $journal_select['customFieldNo'],
                //   "select2" => $journal_select['select'],
                //   "customField2" => $journal_select['customField'],



            );

            $data23 = array(
                "TableViewOnly" => model("TableViewOnly")->journalTable($id, $journalTableViewId, ""),
            );
        }
        return $this->response->setJSON($data);
    }


    function users()
    {
        $data = array(
            "error" => true,
            "request" => $this->request->getVar(),
        );

        $accountId = model("Core")->accountId();

        $id = model("Core")->select("journalId", "journal_access", "journalId = '" . $data['request']['id'] . "' and accountId = '$accountId'  and presence = 1");
        if ($data['request']['id'] && $id) {

            $users = "SELECT ja.id, ja.owner, ja.editable, a.name as 'value', a.id AS 'accountId',
             concat('" . base_url() . "uploads/picture/',a.picture) as 'picture',  
            ja.presence AS 'presence' 
            FROM journal_access AS ja
            LEFT join account AS a ON a.id = ja.accountId
            WHERE ja.journalId = '$id' AND ja.presence = 1
            ORDER BY a.name asc;";
            $users = $this->db->query($users)->getResultArray();

            $usersHistory = "SELECT ja.id, ja.owner, ja.editable, a.name as 'value', a.id AS 'accountId',
            concat('" . base_url() . "uploads/picture/',a.picture) as 'picture',  
           ja.presence AS 'presence' 
           FROM journal_access AS ja
           LEFT join account AS a ON a.id = ja.accountId
           WHERE ja.journalId = '$id'  
           ORDER BY a.name asc;";
            $usersHistory = $this->db->query($usersHistory)->getResultArray();

            $data = array(
                "error" => false,
                "users" => $users,
                "usersHistory" => $usersHistory,


            );
        }
        return $this->response->setJSON($data);
    }


    function requestToken()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $journalId = $post['journalId'];
            $journalTableViewId = $post['journalTableViewId'];
            $token = uniqid();
            $this->db->table("journal_token")->insert([
                "token" => $token,
                "journalId" => $journalId,
                "journalTableViewId" => $journalTableViewId,
                "presence" => 1,
                "input_date" => date("Y-m-d H:i:s"),
                "accountId" => model("Core")->accountId(),
            ]);

            $data = array(
                "error" => false,
                "token" => $token,
            );
        }
        return $this->response->setJSON($data);
    }
    function exportCSV()
    {

        $post = $this->request->getVar();
        $token = $post['t'];
        $data = [
            "error" => true,
            "post" => $post,
        ];


        if ((int) model("Core")->select("presence", "journal_token", "token = '$token' ") === 1) {

            $journalId = model("Core")->select("journalId", "journal_token", "token = '$token'");
            $journalTableViewId = model("Core")->select("journalTableViewId", "journal_token", "token = '$token'");


            $viewName = model("Core")->select("name", "journal_table_view", "journalId = '$journalId' AND  id= '$journalTableViewId' AND presence = 1 ");
            $view = model("Core")->select("name", "journal", "id = '$journalId' AND presence = 1 ");

            $journalTable = model("Shared")->journalTable($journalId, $journalTableViewId, "");
            $header = $journalTable['header'];

            $data = array(array_merge([$header], $journalTable['detail']))[0];

            $csvFileName = $view . '-' . $viewName . '.csv';

            $this->db->table("journal_token")->update([
                "presence" => 0,
                "update_date" => date("Y-m-d H:i:s"),
                "accountId" => model("Core")->accountId(),
            ], " token = '$token' ");

            // Header untuk menentukan jenis konten
            $this->response->setHeader('Content-Type', 'text/csv');
            $this->response->setHeader('Content-Disposition', 'attachment; filename="' . $csvFileName . '"');

            // Membuka output ke file CSV
            $output = fopen('php://output', 'w');

            // Menulis data ke file CSV
            foreach ($data as $row) {
                fputcsv($output, $row);
            }

            // Tutup file CSV
            fclose($output);

            // Kembalikan respons
            return $this->response->setBody('');
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
            $plansId = model("Core")->select("plansId","account","id = '".model("Core")->accountId()."' ");
            $maxRow = model("Core")->select("maxRow","plans"," id = '$plansId' ");
        //$maxRow = 200;
            if (model("Core")->select("count(id)", "journal_detail", "journalId = '$id' and presence = 1 ") < $maxRow) {
 
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
                    "note" => "",
                    "post" => $post,
                    "detail" => $detail,
                );
            } else {
                $data = array(
                    "error" => true,
                    "note" => "The number of rows in his account is only 100 per journal.",
                    "post" => $post,
                    "detail" => [],
                );
            }
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
                    "update_by" => model("Core")->accountId(),
                    "update_date" => date("Y-m-d H:i:s"),
                ], " id = '" . $row['id'] . "' ");

                $this->db->table("journal_detail_images")->update([
                    'presence' => 0,
                    "update_by" => model("Core")->accountId(),
                    "update_date" => date("Y-m-d H:i:s"),
                ], " journalDetailId = '" . $row['id'] . "' ");

                
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
                    "journalId" => $post['id'],
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


    function updateFilter()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            foreach ($post['filterItem'] as $row) {

                $id = model("Core")->select("id", "journal_table_view_filter", "presence = 1 and journalTableViewId = '" . $post['journalTableViewId'] . "' 
                and journalCustomFieldId = '" . $row['journalCustomFieldId'] . "' and field = '" . $row['field'] . "' ");

                if ($id) {
                    $this->db->table("journal_table_view_filter")->update([
                        "selectId" => $row['selectId'],
                        "update_date" => date("Y-m-d H:i:s"),
                        "update_by" => model("Core")->accountId(),
                    ], " id = $id ");
                } else {
                    $this->db->table("journal_table_view_filter")->insert([
                        "journalId" => $post['journalId'],
                        "journalTableViewId" => $post['journalTableViewId'],
                        "journalCustomFieldId" => $row['journalCustomFieldId'],
                        "field" => $row['field'],
                        "selectId" => isset($row['selectId']) ? $row['selectId'] : "",
                        "presence" => 1,
                        "input_date" => date("Y-m-d H:i:s"),
                        "input_by" => model("Core")->accountId(),
                    ]);
                }
            }


            $data = [
                "error" => false,
                "post" => $post,
            ];
            return $this->response->setJSON($data);
        }
    }
}
