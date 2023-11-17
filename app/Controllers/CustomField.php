<?php

namespace App\Controllers;

use CodeIgniter\Model;

class CustomField extends BaseController
{
    function index(){
        $id = $this->request->getVar()['id'];
        $q1 = "SELECT *  FROM journal_custom_field
        WHERE  journalId = '$id' AND presence = 1 
        ORDER BY sorting ASC, input_date ASC";
        $items = $this->db->query($q1)->getResultArray();
  
        $data = array(
            "error" => false,
            "items" => $items,   
            "get" => $this->request->getVar(),
        );
        return $this->response->setJSON($data);
    }

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
            $value = $post['newItem']['value'];
            if ($post['newItem']['itype'] == 'date') {
                $value = $value['year'] . '-' . $value['month'] . '-' . $value['day'];
            } else if ($post['newItem']['itype'] == 'time') {
                $value = self::validateAndConvertTime($value);
            }


            $this->db->table("journal_detail")->update([
                "f" . $post['newItem']['customField']['f'] => $value,
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

    function updateRow()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
           $value = $post['row']['f'.$post['fx']];

            // $row = $post['newItem']['value'];
            if ($post['column']['iType'] == 'date') {
                //$value = $value['year'] . '-' . $value['month'] . '-' . $value['day'];

            } 
            else if ($post['column']['iType'] == 'time') {
               // $value = self::validateAndConvertTime($value);
            }

          
            $this->db->table("journal_detail")->update([
                "f" . $post['fx'] => $value,
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['row']['id'] . "' ");


            if((int)$post['fx'] == 10 || (int)$post['fx'] == 11){
                $this->db->table("journal_detail")->update([
                    "f6"  => (int)$post['row']['f10'] * (int)$post['row']['f11'],
                    "update_by" => model("Core")->accountId(),
                    "update_date" => date("Y-m-d H:i:s"),
                ], "id = '" . $post['row']['id'] . "' ");
            } 
           

            $this->db->table("journal_detail")->update([
                "f" . $post['fx'] => $value,
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['row']['id'] . "' ");

            $newId = $post['row']['id'];
            $journalId = model("Core")->select("journalId", "journal_detail", "id = '$newId' ");

            $journalTable = model("Core")->journalTable($journalId, '', " AND  id = '$newId'  ");
            $tableViewOnly = model("TableViewOnly")->journalTable($journalId, '', " AND  id = '$newId'  ");

            for ($i = 0; $i < count($journalTable['detail']); $i++) {
                $journalTable['detail'][$i]['searchable'] = $tableViewOnly['detail'][$i];
            }
            $detail =  $journalTable['detail'];

            $data = [
                "error" => false,
                "post" => $post, 
                "value" => $post['row']['f'.$post['fx']],
                "row" =>   $detail[0],
                "f" => $post['fx'],
            ];
        }

        return $this->response->setJSON($data);
    }

    function validateAndConvertTime($timeString)
    {
        if (strpos($timeString, ':') !== false) {


            // Pecah string waktu menjadi jam dan menit
            list($hour, $minute) = explode(':', $timeString);

            // Validasi format jam dan menit
            if (is_numeric($hour) && is_numeric($minute)) {
                // Mengubah jam yang lebih dari 24 menjadi 24
                $hour = ($hour >= 0 && $hour < 24) ? $hour : 24;

                // Mengubah menit yang lebih dari 60 menjadi 00
                $minute = ($minute >= 0 && $minute < 60) ? $minute : 0;

                // Mengonversi jam dan menit ke dalam format dengan dua digit
                $formattedHour = str_pad($hour, 2, '0', STR_PAD_LEFT);
                $formattedMinute = str_pad($minute, 2, '0', STR_PAD_LEFT);

                // Menggabungkan jam dan menit dalam format yang sesuai
                $formattedTime = $formattedHour . ':' . $formattedMinute;
                return $formattedTime;
            } else {
                // Mengembalikan null jika format tidak valid
                return null;
            }

        }else return null;
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
            ], "id = '" . $post['id'] . "'");
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

        $journalTable = model("Core")->journalTable($journalId, '', " AND  id = '$newId'  ");
        $tableViewOnly = model("TableViewOnly")->journalTable($journalId, '', " AND  id = '$newId'  ");

        for ($i = 0; $i < count($journalTable['detail']); $i++) {
            $journalTable['detail'][$i]['searchable'] = $tableViewOnly['detail'][$i];
        }
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
            ], " id = " . $post['field']['id']);
            $data = [
                "post" => $post,
                "error" => false,
            ];
        }
        return $this->response->setJSON($data);
    }
}