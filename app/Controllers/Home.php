<?php

namespace App\Controllers; 
use CodeIgniter\Model; 
class Home extends BaseController
{
    public function index()
    {
        $data = [
            "error" => false, 
            "time" => time(),
            "server" => date("Y-m-d H:i:s"),
            "mysql" =>(int) model("Core")->select('unix_timestamp(NOW())',"book","1"), 
        ];

        return $this->response->setJSON($data);
    }

    public function tableViewReset($id,$viewId)
    {
  
        $q1 = "SELECT  *  FROM journal_custom_field 
        WHERE journalId = 'B1-000027'
        ORDER BY sorting ASC, input_date ASC";
        $items = $this->db->query($q1)->getResultArray();

        foreach($items as $row){
            $this->db->table("journal_table_view_show")->insert([
                "journalId" => $row['journalId'],
                "journalTableViewId" => $viewId,
                "customFieldId" => $row['id'],
                "hide" => 0,
            ]);
        }

        $data = [
            "error" => false, 
            "items" =>  $items, 
        ];

        return $this->response->setJSON($data);
    }
}