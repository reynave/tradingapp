<?php

namespace App\Controllers;

use CodeIgniter\Model;

class CustomField extends BaseController
{
    function sortable()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $i = 0;
            foreach ($post as $row) {
                $i++;
                $this->db->table("journal_custom_field")->update([
                    "sorting" => $i,
                    "update_by" => model("Core")->accountId(),
                    "update_date" => date("Y-m-d H:i:s"),
                ], "id = '" . $row . "' ");
            }
            $data = [
                "error" => false,
                "post" => $post,
            ];
        }

        return $this->response->setJSON($data);
    }
    function fieldResizable()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->table("journal_custom_field")->update([
                "width" => $post['ui']['width'],
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['itemId'] . "' ");

            $data = [
                "error" => false,
                "post" => $post,
            ];
        }

        return $this->response->setJSON($data);
    }

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
                "f" . $post['newItem']['customField']['f'] => $post['newItem']['value'],
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['newItem']['id'] . "' ");
  
            $data = [
                "error" => false,
                "post" => $post,
                "detail" => self::getRow($post),
            ];
        }

        return $this->response->setJSON($data);
    }

    function insertSelect()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $sorting = model("Core")->select("count(id)", "journal_select", "journalId = '" . $post['journalId'] . "' and field = '" . $post['field'] . "' ") + 1;
            $this->db->table("journal_select")->insert([
                "color" => $post['color'],
                'value' => $post['value'],
                "journalId" => $post['journalId'],
                "field" => $post['field'],
                "sorting" => $sorting,
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
                "input_by" => model("Core")->accountId(),
                "input_date" => date("Y-m-d H:i:s"),
            ]);
            $option = "SELECT *
            FROM journal_select 
            where journalId = '" . $post['journalId'] . "' and field = '" . $post['field'] . "' and presence = 1 order by sorting ASC, id DESC";

            $data = [
                "error" => false,
                "post" => $post,
                "option" => $this->db->query($option)->getResultArray()
            ];
        }

        return $this->response->setJSON($data);
    }
    function updateSelect()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {

            $this->db->table("journal_select")->update([
                "color" => $post['color'],
                'value' => $post['value'],
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['id'] . "' ");

            $data = [
                "error" => false,
                "post" => $post,
            ];
        }

        return $this->response->setJSON($data);
    }
    function deleteSelect()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->table("journal_select")->update([
                'presence' => 0,
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['id'] . "' ");

            $data = [
                "error" => false,
                "post" => $post,
            ];
        }
        return $this->response->setJSON($data);
    }
    function updateSortableSelect()
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
                $this->db->table("journal_select")->update([
                    "sorting" => $i++,
                    "update_by" => model("Core")->accountId(),
                    "update_date" => date("Y-m-d H:i:s"),
                ], "id = '" . $row . "' ");
            }
            $data = array(
                "error" => false,
            );
        }

        return $this->response->setJSON($data);
    }

    function updateUrl()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $i = 1;

            $this->db->table("journal_detail")->update([
                'f' . $post['customField']['f'] => $post['value'],
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['id'] . "' ");

            $data = array(
                "error" => false,
                "post" => $post,
                //    "detail" => self::getRow($post),
            );
        }

        return $this->response->setJSON($data);
    }

    function onUpdateCustomField()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->table("journal_custom_field")->update([
                "name" => $post['name'],
                "suffix" => $post['suffix'],

                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['id'] . "' ");

            $data = [
                "error" => false,
                "post" => $post,
            ];
        }

        return $this->response->setJSON($data);
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
            $total = model("Core")->select("count(id)", "journal_custom_field", "journalId= '" . $post['id'] . "' ");
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
                        "width" => 150,
                        "name" => $post['item']['name'],
                        "iType" => $post['item']['iType'],
                        "sorting" => model("Core")->select("sorting", "journal_custom_field", "journalId = '" . $post['id'] . "' order by sorting DESC ") + 1,
                        "journalId" => $post['id'],
                        "input_by" => model("Core")->accountId(),
                        "input_date" => date("Y-m-d H:i:s"),
                    ]);

                    $items = "SELECT *
                    FROM journal_custom_field 
                    where journalId = '" . $post['id'] . "' AND presence = 1 
                    ORDER BY sorting ASC, id DESC";

                    $data = array(
                        "error" => false,
                        "post" => $post,
                        "note" => "",
                        "items" => $this->db->query($items)->getResultArray(),
                    );
                }


            } else {
                $data = array(
                    "error" => true,
                    "post" => $post,
                    "note" => " $max",
                );
            }

        }
        return $this->response->setJSON($data);
    }

    function removeCustomeField()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->table("journal_custom_field")->update([
                "presence" => 0,
            ],"id = '".$post['id']."'" );
            $data = array(
                "error" => false,
                "post" => $post,
            );
        }
        return $this->response->setJSON($data);
    }

    function getRow($post)
    {
        $newId = $post['newItem']['id'];
        $journalId = model("Core")->select("journalId", "journal_detail", "id = '$newId' ");

        $journalTable = model("Core")->journalTable($journalId, ''," AND  id = '$newId'  ");
        // $c = "SELECT *, CONCAT('f',f) AS 'key' FROM journal_custom_field 
        // WHERE journalId = '$journalId' and presence = 1
        // ORDER BY sorting ASC ";
        // $journal_custom_field = $this->db->query($c)->getResultArray();

        // $customField = "";
        // $customFieldNo = [];
        // foreach ($journal_custom_field as $r) {
        //     $customField .= ", f" . $r['f'];
        //     array_push($customFieldNo, "f" . $r['f']);
        // }

        // $q = "SELECT id, journalId, false AS 'checkbox' $customField 
        // FROM journal_detail 
        // where   id = '$newId' and presence = 1 order by sorting DESC";
        // $detail = $this->db->query($q)->getResultArray();

        // if ($post['newItem']['itype'] == "number") {

        //     $evaluateFormula = function ($data, $formula) {
        //         extract($data);
        //         return eval("return $formula;");
        //     };
        //     $index = 0;
        //     foreach ($detail as $rec) {
        //         $data = [];
        //         foreach ($journal_custom_field as $field) {
        //             if ($field['iType'] == 'formula') {
        //                 foreach (array_keys($rec) as $key) {
        //                     $data[$key] = (int) $rec[$key];
        //                 }
        //                 $detail[$index][$field['key']] = $evaluateFormula($data, $field['eval']);
        //             }
        //         }
        //         $index++;
        //     }
        // }
        
        return $journalTable['detail'];
    }

    function evalDevCheck()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $data = [
                "post" => $post,
                "error" => false,
                "evalDev" => $post['field']['evalDev'],
                "resultData" => model("Core")->journalTableFormula($post['id'], $post['journalTableViewId'], $post['field']['evalDev'], 'f' . $post['field']['f']),
                
            ];
        }
        return $this->response->setJSON($data);
    }
    function updateEval()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->table("journal_custom_field")->update([
                "eval" => $post['field']['evalDev'],
                "evalDev" => $post['field']['evalDev'], 
            ]," id = ".$post['field']['id']);
            $data = [
                "post" => $post,
                "error" => false,
            ];
        }
        return $this->response->setJSON($data);
    }
}