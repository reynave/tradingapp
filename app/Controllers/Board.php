<?php

namespace App\Controllers; 
use CodeIgniter\Model; 
class Board extends BaseController
{
    function view()
    { 
        $post = $this->request->getVar(); 
     
        $q1 = "SELECT *  FROM journal_table_view
        WHERE  journalId = '".$post['id']."' AND presence = 1 
        ORDER BY id ASC";
        $items = $this->db->query($q1)->getResultArray();
  
        $data = array(
            "error" => false,
            "items" => $items,   
        );
        return $this->response->setJSON($data);
    }
}