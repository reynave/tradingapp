<?php

namespace App\Controllers;

use CodeIgniter\Model;

class CustomField extends BaseController
{

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
            ];
        }

        return $this->response->setJSON($data);
    }

    function addSelect()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $sorting = model("Core")->select("count(id)","journal_select","journalId = '".$post['journalId']."' and field = '".$post['field']."' ")+1;
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
            where journalId = '".$post['journalId']."' and field = '".$post['field']."' and presence = 1 order by sorting ASC, id DESC";
          
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

    function updateSortableSelect()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $i = 1;
            foreach ($post['order'] as $row) {  
                $this->db->table("journal_select")->update([
                    "sorting" => $i++, 
                    "update_by" => model("Core")->accountId(),
                    "update_date" => date("Y-m-d H:i:s"),
                ], "id = '" . $row . "' ");
            }
            $id = $post['journalId'];
            $c = "SELECT * FROM journal_custom_field WHERE journalId = '$id' ORDER BY sorting ASC ";
            $journal_custom_field = $this->db->query($c)->getResultArray();

            $customField = "";
            $customFieldObj = [];
            foreach ($journal_custom_field as $r) {
                $customField .= ", f" . $r['f'];
                array_push($customFieldObj,"f".$r['f']);
            }
            $q = "SELECT id, journalId, positionId,  marketId, openDate, closeDate,  sl, rr,  tp,  resultId, note,
            time_to_sec(timediff(closeDate, openDate )) / 3600  AS 'tradingTime', false AS 'checkbox' $customField 
            FROM journal_detail 
            where journalId = '$id' and presence = 1";
            $detail = $this->db->query($q)->getResultArray();

            $select = [];
            foreach($customFieldObj as $rec) {
                $option = "SELECT *
                FROM journal_select 
                where journalId = '$id' and field = '$rec' and presence = 1 order by sorting ASC, id DESC";
             
                $temp = array(
                    "field" => $rec,
                    "option" =>  $this->db->query($option)->getResultArray(),
                );
                array_push($select, $temp);
            } 

            $b = "SELECT * FROM color   ORDER BY id ASC ";
            $backgroundColorOption = $this->db->query($b)->getResultArray();


            $data = array(
                "error" => false,   
                "select" =>  $select, 
                "customField" => $journal_custom_field, 
            );
        }

        return $this->response->setJSON($data);
    }

}