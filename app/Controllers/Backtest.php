<?php

namespace App\Controllers;

use CodeIgniter\Model;

class Backtest extends BaseController
{
    public function index()
    {
        $items = $this->db->query("SELECT * FROM 
             backtest WHERE presence = 1 and accountId = '" . model("Core")->accountId() . "'
             ORDER BY input_date ASC
        ")->getResultArray();
        $data = array(
            "error" => false,
            "items" => $items,
            "header" => model("Core")->header()
        );
        return $this->response->setJSON($data);
    }

    function onCreateNew()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {

            $this->db->table("backtest")->insert([
                "id" => time(),
                "name" => "New",
                "accountId" => model("Core")->accountId(),
                "presence" => 1,
                "update_date" => date("Y-m-d H:i:s"),
            ]);


            $data = array(
                "error" => false,
            );
        }
        return $this->response->setJSON($data);
    }

    public function detail()
    {
        $data = array(
            "error" => true,
            "request" => $this->request->getVar(),
        );

        $id = model("Core")->select("id", "backtest", "id='" . $data['request']['id'] . "' and presence = 1");
        if ($data['request']['id'] && $id) {

            $c = "SELECT f, name FROM backtest_custom_field WHERE backtestId = $id ORDER BY sorting ASC ";
            $backtest_custom_field = $this->db->query($c)->getResultArray();

            $customField = "";
            foreach ($backtest_custom_field as $r) {
                $customField .= ", f" . $r['f'];
            } 
            $q = "SELECT backtestId, positionId,  marketId, openDate, closeDate,  sl, rr,  tp,  resultId, note,
            time_to_sec(timediff(closeDate, openDate )) / 3600  AS 'tradingTime', false AS 'checkbox' $customField 
            FROM backtest_detail 
            where backtestId = '$id' and presence = 1";

            // $q = "SELECT *, 
            //    time_to_sec(timediff(closeDate, openDate )) / 3600  AS 'tradingTime', false AS 'checkbox' 
            //    FROM backtest_detail 
            //    where backtestId = '$id' and presence = 1";
            $detail = $this->db->query($q)->getResultArray();

            $data = array(
                "error" => false,
                "id" => $id,
                "item" => $this->db->query("SELECT * from backtest where id = '$id' ")->getResultArray()[0],
                "detail" => $detail,
                "customField" => $backtest_custom_field,
                "q" => $q,
            );
        }
        return $this->response->setJSON($data);
    }

    public function detailImages()
    {
        $data = array(
            "error" => true,
            "request" => $this->request->getVar(),
        );

        $data = array(
            "detailImages" => $this->db->query("SELECT * FROM 
            backtest_detail_images WHERE backtestDetailId = '" . $data['request']['id'] . "' AND presence = 1 ORDER BY sorting ASC
            ")->getResultArray(),
        );

        return $this->response->setJSON($data);
    }

    function removeImages()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {

            $this->db->table("backtest_detail_images")->update([
                "presence" => 0,
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['id'] . "' ");


            $data = array(
                "error" => false,
                "detailImages" => $this->db->query("SELECT * FROM 
                    backtest_detail_images WHERE backtestDetailId = '" . $post['backtestDetailId'] . "' AND presence = 1 ORDER BY sorting ASC
                ")->getResultArray(),
            );
        }
        return $this->response->setJSON($data);
    }

    function onSubmit()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $data = [
                "error" => false,
                "post" => $post,
            ];
            $this->db->table("backtest")->update([
                "name" => $post['item']['name'],
                "permissionId" => $post['item']['permissionId'],
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['id'] . "' ");

            foreach ($post['detail'] as $row) {
                $this->db->table("backtest_detail")->update([
                    "marketId" => $row['marketId'],
                    "sl" => $row['sl'],
                    "rr" => $row['rr'],
                    "tp" => $row['tp'],

                    "closeDate" => $row['closeDate']['year'] . "-" . $row['closeDate']['month'] . "-" . $row['closeDate']['day'] . " " . $row['closeTime'] . ":00",

                    "openDate" => $row['openDate']['year'] . "-" . $row['openDate']['month'] . "-" . $row['openDate']['day'] . " " . $row['openTime'] . ":00",
                    "note" => "",
                    "resultId" => $row['resultId'],
                    "positionId" => $row['positionId'],

                    "update_date" => date("Y-m-d H:i:s"),
                ], "id = '" . $row['id'] . "' ");
            }
        }

        return $this->response->setJSON($data);
    }

    function fnAddItems()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $data = [
                "error" => false,
                "post" => $post,
            ];
            $this->db->table("backtest_detail")->insert([
                "backtestId" => $post['id'],
                "presence" => 1,
                "input_date" => date("Y-m-d H:i:s"),
                "update_date" => date("Y-m-d H:i:s"),
            ]);
        }

        return $this->response->setJSON($data);
    }


    function fnDeleteAll()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $data = [
                "error" => false,
                "post" => $post,
            ];
            foreach ($post['detail'] as $row) {
                if ($row['checkbox'] == true) {
                    $this->db->table("backtest_detail")->update([
                        "presence" => 0,
                        "update_date" => date("Y-m-d H:i:s"),
                    ], "id = '" . $row['id'] . "' ");
                }
            }
        }

        return $this->response->setJSON($data);
    }
}