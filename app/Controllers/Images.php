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
            $id =  $post['id'];
            $this->db->table("journal_detail_images")->insert([
                "journalId" =>  $post['journalId'],
                "journalDetailId" =>  $id,
                "fn" => $post['fn'],
                "source" => "external",
                "presence" => 1, 
                "path" => $post['url'], 
                "caption" => $post['caption'],
                "input_date" => date("Y-m-d H:i:s"),
                "input_by" => model("Core")->accountId(),
            ]);

            $this->db->table("journal_detail")->update([
                "f".$post['fn'] => model("Core")->select("count(id)","journal_detail_images","presence = 1 and journalDetailId = '$id'"),
            ]," id =  ".$post['id']);


            $newId = $id;
            $journalId = model("Core")->select("journalId", "journal_detail", "id = '$newId' ");

            $journalTable = model("Core")->journalTable($journalId, '', " AND  id = '$newId'  ");
            $tableViewOnly = model("TableViewOnly")->journalTable($journalId, '', " AND  id = '$newId'  ");

            for ($i = 0; $i < count($journalTable['detail']); $i++) {
                $journalTable['detail'][$i]['searchable'] = $tableViewOnly['detail'][$i];
            }
            $detail =  $journalTable['detail'];

            $data = [
                "error" => false,
                "row" =>   $detail[0],
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
            $journalDetailId = model("Core")->select("journalDetailId","journal_detail_images","id = '".$post['item']['id']."'");
            $fn =  model("Core")->select("fn","journal_detail_images","id = '".$post['item']['id']."'");
            $this->db->table("journal_detail")->update([
                "f".$fn  => model("Core")->select("count(id)","journal_detail_images","presence = 1 and journalDetailId = '$journalDetailId' "),
            ]," id =  ".$journalDetailId  );


            $newId = $journalDetailId;
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
                "row" =>   $detail[0],
            ];
        }
        return $this->response->setJSON($data);
    }
}