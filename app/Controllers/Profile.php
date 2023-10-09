<?php

namespace App\Controllers;

use CodeIgniter\Model;

class Profile extends BaseController
{
    public function user($id)
    {
        $accountId = model("Core")->accountId();
        $data = [
            "error" => false,
            "profile" => [],
            "lock" => true,
        ];
        if (model("Core")->select("id", "account", "id = '$id' ")) {
            $q1 = "SELECT  a.username, a.name, a.email, a.description, 
        a.picture, a.party, a.update_date, a.input_date, p.name AS 'plans'
        FROM account  as a
        left join plans as p on p.id =  a.plansId
        WHERE  a.id = '$id' ";
            $profile = $this->db->query($q1)->getResultArray()[0];
            $profile['picture'] = model("Core")->isUrlValid($profile['picture']) ? $profile['picture'] : base_url().'uploads/picture/'.$profile['picture'];

            $accountId = model("Core")->accountId();
        $q = "SELECT j.id, a.owner, j.name, b.name AS 'book', c.username AS 'journalOwner' , c.id
        FROM journal_access AS a
        LEFT JOIN journal AS j ON j.id = a.journalId
        LEFT JOIN book AS b ON b.id = a.bookId
        LEFT JOIN account AS c ON c.id = j.accountId
        WHERE a.presence = 1 AND a.accountId = '". $id ."' ";
        $journals = $this->db->query($q)->getResultArray();

            $data = [
                "error" => false,
                "profile" => $profile,
                "journals" => $journals,
                "lock" => $accountId == $id ? false : true,
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
            $id = $post['id'];
            if( model("Core")->select("id", "account", "id = '$id' ") == model("Core")->accountId() ){

                $this->db->table("account")->update([
                    "username" => $post['profile']['username'],
                    "party" => $post['profile']['party'],
                    "name" => $post['profile']['name'],
                    "description" => $post['profile']['description'],
                    "update_date" => date("Y-m-d H:i:s")

                ],"id = '$id' and presence = 1");

                $data = [
                    "error" => false,
                    "post" => $post,
                ];

               
            }

            
        }
        return $this->response->setJSON($data);
    }


    function abc() {
          $get = $this->request->getVar();
        // $accountId = model("Core")->accountId();
        // $q = "SELECT j.id, a.owner, j.name, b.name AS 'book', c.username AS 'journalOwner' , c.id
        // FROM journal_access AS a
        // LEFT JOIN journal AS j ON j.id = a.journalId
        // LEFT JOIN book AS b ON b.id = a.bookId
        // LEFT JOIN account AS c ON c.id = j.accountId
        // WHERE a.presence = 1 AND a.accountId = '". $get['accountId'] ."' AND c.id = '$accountId'
        // GROUP BY j.id ";
        // $journal = $this->db->query($q)->getResultArray();
        $data = [
            "error" => false,
        //    "journal" => $journal, 
            "get" =>  $get,
        ];
        return $this->response->setJSON($data);
    }
}