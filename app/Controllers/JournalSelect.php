<?php

namespace App\Controllers; 
use CodeIgniter\Model; 
class JournalSelect extends BaseController
{
    
    function index(){
        $accountId = model("Core")->accountId();
        $get = $this->request->getVar();
        $color = "SELECT * FROM color ";
        $color = $this->db->query($color)->getResultArray();

        $journal_select = "SELECT * FROM journal_select WHERE 
        field = '".$get['field']."' and journalId = '".$get['journalId']."' 
        and presence = 1 
        ORDER BY sorting ASC";
        $journal_select = $this->db->query($journal_select)->getResultArray();
  
        $data = array(
            "error" => false, 
            "color" => $color, 
            "journal_select" => $journal_select,
        );
        return $this->response->setJSON($data); 
    }
}