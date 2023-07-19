<?php

namespace App\Controllers;

use CodeIgniter\Model;

class Tables extends BaseController
{
    public function index()
    {
        $data = array(
            "error" => false,
        );
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

            $c = "SELECT * FROM journal_custom_field WHERE journalId = '$id' ORDER BY sorting ASC ";
            $journal_custom_field = $this->db->query($c)->getResultArray();

            $customField = "";
            $customFieldNo = [];
            foreach ($journal_custom_field as $r) {
                $customField .= ", f" . $r['f'];
                array_push($customFieldNo, "f" . $r['f']);
            }
            $q = "SELECT id, journalId, positionId,  marketId, openDate, closeDate,  sl, rr,  tp,  resultId, note,
            time_to_sec(timediff(closeDate, openDate )) / 3600  AS 'tradingTime', false AS 'checkbox' $customField 
            FROM journal_detail 
            where journalId = '$id' and presence = 1";
            $detail = $this->db->query($q)->getResultArray();

            $select = [];
            foreach ($customFieldNo as $rec) {
                $option = "SELECT *
                FROM journal_select 
                where journalId = '$id' and field = '$rec' and presence = 1 order by sorting ASC, id DESC";

                $optionHistory = "SELECT *
                FROM journal_select 
                where journalId = '$id' and field = '$rec' and presence = 0 order by sorting ASC, id DESC";

                $temp = array(
                    "field" => $rec,
                    "option" => $this->db->query($option)->getResultArray(),
                    "optionHistory" => $this->db->query($optionHistory)->getResultArray(),
                );
                array_push($select, $temp);
            }

            $b = "SELECT * FROM color   ORDER BY id ASC ";
            $backgroundColorOption = $this->db->query($b)->getResultArray();


            $data = array(
                "error" => false,
                "id" => $id,
                "item" => $this->db->query("SELECT * from journal where id = '$id' ")->getResultArray()[0],
                "permission" => $this->db->query("SELECT * from permission")->getResultArray(),
                "detail" => $detail,
                "customFieldNo" => $customFieldNo,
                "select" => $select,
                "customField" => $journal_custom_field,
                "backgroundColorOption" => $backgroundColorOption,
                "q" => $q,
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
        $accountId = "230101.0001";
        // $accountId =  model("Core")->accountId();
        $id = model("Core")->select("journalId", "journal_access", "journalId = '" . $data['request']['id'] . "' and accountId = '$accountId'  and presence = 1");
        if ($data['request']['id'] && $id) {

            $c = "SELECT *, CONCAT('f',f) AS 'key' FROM journal_custom_field WHERE journalId = '$id' ORDER BY sorting ASC ";
            $journal_custom_field = $this->db->query($c)->getResultArray();

            $customField = "";
            $customFieldNo = [];
            foreach ($journal_custom_field as $r) {
                $customField .= ", f" . $r['f'];
                array_push($customFieldNo, "f" . $r['f']);
            }
            $q = "SELECT id, journalId, false AS 'checkbox' $customField 
            FROM journal_detail 
            where journalId = '$id' and presence = 1";
            $detail = $this->db->query($q)->getResultArray();

            $select = [];
            foreach ($customFieldNo as $rec) {
                $option = "SELECT *
                FROM journal_select 
                where journalId = '$id' and field = '$rec' and presence = 1 order by sorting ASC, id DESC";

                $optionHistory = "SELECT *
                FROM journal_select 
                where journalId = '$id' and field = '$rec' and presence = 0 order by sorting ASC, id DESC";

                $temp = array(
                    "field" => $rec,
                    "option" => $this->db->query($option)->getResultArray(),
                    "optionHistory" => $this->db->query($optionHistory)->getResultArray(),
                );
                array_push($select, $temp);
            }

            $b = "SELECT * FROM color   ORDER BY id ASC ";
            $backgroundColorOption = $this->db->query($b)->getResultArray();

            $evaluateFormula = function ($data, $formula) {
                extract($data);
                try {
                    return eval("return $formula;");
                } catch (Throwable $e) {
                    return false;
                }
            };

            $index = 0;
            foreach ($detail as $rec) {
                $data = [];
                foreach ($journal_custom_field as $field) {
                    if ($field['iType'] == 'formula') {
                        foreach (array_keys($rec) as $key) {
                            $data[$key] = (int) $rec[$key];
                        }
                        $detail[$index][$field['key']] = $evaluateFormula($data, $field['eval']);
                    }
                }
                $index++;
            }

            $data = array(
                "error" => false,
                "id" => $id,
                "backgroundColorOption" => $backgroundColorOption,
                "select" => $select,
                "customFieldNo" => $customFieldNo,
                "customField" => $journal_custom_field,
                "detail" => $detail,
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

            $c = "SELECT * FROM journal_custom_field WHERE journalId = '$id'  ORDER BY sorting ASC ";
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

                $optionHistory = "SELECT *
                FROM journal_select 
                where journalId = '$id' and field = '$rec' and presence = 0 order by sorting ASC, id DESC";

                $temp = array(
                    "field" => $rec,
                    "option" => $this->db->query($option)->getResultArray(),
                    "optionHistory" => $this->db->query($optionHistory)->getResultArray(),

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