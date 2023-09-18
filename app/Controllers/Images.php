<?php

namespace App\Controllers;

use CodeIgniter\Model;

class Images extends BaseController
{
    public function boardTable()
    {
        $get = $this->request->getVar();
        $q1 = [];
        if (isset($get['id'])) {
            $q1 = "SELECT  *  FROM journal_detail_images 
            WHERE journalDetailId = '" . $get['id'] . "' and fn =  '" . $get['fn'] . "' and presence = 1 
            ORDER BY sorting DESC, input_date DESC";
            $q1 = $this->db->query($q1)->getResultArray();
        }
        $data = [
            "error" => false,
            "items" => $q1,
        ];

        return $this->response->setJSON($data);
    }


    function onImagesSaveUrl()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) { 
            $this->db->table("journal_detail_images")->insert([
                "journalDetailId" => $post['id'],
                "fn" => $post['fn'],
                "source" => "external",
                "presence" => 1, 
                "path" => $post['url'], 
                "caption" => $post['caption'],
                "input_date" => date("Y-m-d H:i:s"),
                "input_by" => model("Core")->accountId(),
            ]);


            $data = [
                "error" => false,
            ];
        }
        return $this->response->setJSON($data);
    }

    function onImagesRemove()  {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) { 
            $this->db->table("journal_detail_images")->update([
                "presence" => 0, 
                "update_date" => date("Y-m-d H:i:s"),
                "update_by" => model("Core")->accountId(),
            ]," id = '".$post['item']['id']."'"); 
 
            $data = [
                "error" => false,
                "post" => $post,
            ];
        }
        return $this->response->setJSON($data);
    }
}