<?php

namespace App\Controllers;

use CodeIgniter\Model;

class Board extends BaseController
{
    function view()
    {
        $post = $this->request->getVar();

        $q1 = "SELECT *, name as tempName  FROM journal_table_view
        WHERE  journalId = '" . $post['id'] . "' AND presence = 1 
        ORDER BY id ASC";
        $items = $this->db->query($q1)->getResultArray();

        $accountId = model("Core")->accountId();
        $d = "SELECT * 
        FROM journal_access
        WHERE accountId = '$accountId' and journalId = '".$post['id']."' AND presence = 1";
        $journal_access = $this->db->query($d)->getResultArray()[0];

        $data = array(
            "error" => false,
            "items" => $items,
            "journal_access" => $journal_access,
        );
        return $this->response->setJSON($data);
    }

    function addView()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->table("journal_table_view")->insert([
                "journalId" => $post['id'],
                "board" => $post['board'],
                "name" => 'New '.$post['board'],
                "ilock" => 0,
                "share" => 1, 
                "input_by" => model("Core")->accountId(),
                "input_date" => date("Y-m-d H:i:s"),
            ]); 
            $q1 = "SELECT *  FROM journal_table_view
            WHERE  journalId = '" . $post['id'] . "' AND presence = 1 
            ORDER BY id ASC";
            $items = $this->db->query($q1)->getResultArray();

            $data = [
                "error" => false,
                "post" => $post,
                "items" =>  $items
            ];
        }
       
        return $this->response->setJSON($data);
    }
    function update()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->table("journal_table_view")->update([ 
                "name" => $post['item']['tempName'], 
                "share" => $post['item']['share'], 
                "input_by" => model("Core")->accountId(),
                "input_date" => date("Y-m-d H:i:s"),
            ],"id = ".$post['item']['id']); 
            
            $data = [
                "error" => false,
                "post" => $post, 
            ];
        }
       
        return $this->response->setJSON($data);
    }
    function delete()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->table("journal_table_view")->update([  
                "presence" => 0, 
                "input_by" => model("Core")->accountId(),
                "input_date" => date("Y-m-d H:i:s"),
            ],"id = ".$post['item']['id']); 
            //x.board, x.journalId, x.id
            $id =  model("Core")->select("id","journal_table_view","ilock = 1 and journalId = '".$post['item']['journalId']."' order by id ASC");
            $data = [
                "error" => false,
                "post" => $post, 
                "id" => $id ,
                "board" => model("Core")->select("board","journal_table_view","id = '$id' "),
                "journalId" => $post['item']['journalId'],
                
            ];
        }
       
        return $this->response->setJSON($data);
    }
}