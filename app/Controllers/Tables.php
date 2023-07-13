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
 
   
    function detail()
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
                "id" => $id,
                "item" => $this->db->query("SELECT * from journal where id = '$id' ")->getResultArray()[0],
                "detail" => $detail,
                "customFieldObj" =>  $customFieldObj,
                "select" =>  $select, 
                "customField" => $journal_custom_field,
                "backgroundColorOption" => $backgroundColorOption,
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

}