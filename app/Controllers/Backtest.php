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
                "detail" => $this->db->query("SELECT * from backtest_detail where backtestId = '$id' and presence = 1 ")->getResultArray(),
            );
        }

        return $this->response->setJSON($data);
    }

    function onSubmit() {
        $data = array(
            "error" => true,
            "request" =>  $this->request->getVar(),
        );
        return $this->response->setJSON($data);
    }
}
