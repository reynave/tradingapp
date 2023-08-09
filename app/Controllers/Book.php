<?php

namespace App\Controllers; 
use CodeIgniter\Model; 
class Book extends BaseController
{
    function index()
    { 
        $accountId = model("Core")->accountId();
        $q1 = "SELECT id, name, sorting  FROM book
        WHERE  accountId = '$accountId' AND presence = 1 
        ORDER BY sorting ASC, input_date ASC";
        $items = $this->db->query($q1)->getResultArray();
  
        $data = array(
            "error" => false,
            "items" => $items,   
        );
        return $this->response->setJSON($data);
    }

    function insert()  {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $id = model("Core")->number("book");
            $this->db->table("book")->insert([  
                "id" => $id,
                "name" => $post['newBook']['name'],
                "accountId" => model("Core")->accountId(),
                "ilock" => 0,
                "sorting" => (int)model("Core")->select("sorting","book","accountId = '".model("Core")->accountId()."' order by sorting DESC") + 1,
                "presence" => 1, 
                "input_by" => model("Core")->accountId(),
                "input_date" => date("Y-m-d H:i:s"),
            ]); 
             
            $data = [
                "error" => false,
                "post" => $post, 
                "id" => $id , 
            ];
        }
       
        return $this->response->setJSON($data);
    }
}