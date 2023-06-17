<?php

namespace App\Controllers;

use CodeIgniter\Model;

class Backtest extends BaseController
{
    public function index()
    {
        $data = array(
            "error" => false,
            "request" =>  $this->request->getVar(),
        );
        return $this->response->setJSON($data);
    }


    public function detail()
    {
        $data = array(
            "error" => true,
            "request" =>  $this->request->getVar(),
        );

        if ($data['request']['id'] && model("Core")->select("id", "backtest", "id='" . $data['request']['id'] . "' and presence = 1")) {
            $id = model("Core")->select("id", "backtest", "id='" . $data['request']['id'] . "' and presence = 1");
            $data = array(
                "error" => false,
                "id"    =>  $id,
                "item"  => $this->db->query("SELECT * from backtest where id = '$id' ")->getResultArray()[0],
                "detail" => $this->db->query("SELECT *, false as 'checkbox' from backtest_detail where backtestId = '$id' and presence = 1 ")->getResultArray(),
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
