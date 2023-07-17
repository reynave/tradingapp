<?php

namespace App\Controllers;

use CodeIgniter\Model;

class CustomField extends BaseController
{
    function sortable()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $i = 0;
            foreach ($post as $row) {
                $i++;
                $this->db->table("journal_custom_field")->update([
                    "sorting" => $i,
                    "update_by" => model("Core")->accountId(),
                    "update_date" => date("Y-m-d H:i:s"),
                ], "id = '" . $row . "' ");
            }
            $data = [
                "error" => false,
                "post" => $post,
            ];
        }

        return $this->response->setJSON($data);
    }
    function fieldResizable()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->table("journal_custom_field")->update([
                "width" => $post['ui']['width'],
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['itemId'] . "' ");

            $data = [
                "error" => false,
                "post" => $post,
            ];
        }

        return $this->response->setJSON($data);
    }

    function updateData()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {

            $this->db->table("journal_detail")->update([
                "f" . $post['newItem']['customField']['f'] => $post['newItem']['value'],
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['newItem']['id'] . "' ");


            $data = [
                "error" => false,
                "post" => $post,
            ];
        }

        return $this->response->setJSON($data);
    }

    function insertSelect()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $sorting = model("Core")->select("count(id)", "journal_select", "journalId = '" . $post['journalId'] . "' and field = '" . $post['field'] . "' ") + 1;
            $this->db->table("journal_select")->insert([
                "color" => $post['color'],
                'value' => $post['value'],
                "journalId" => $post['journalId'],
                "field" => $post['field'],
                "sorting" => $sorting,
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
                "input_by" => model("Core")->accountId(),
                "input_date" => date("Y-m-d H:i:s"),
            ]);
            $option = "SELECT *
            FROM journal_select 
            where journalId = '" . $post['journalId'] . "' and field = '" . $post['field'] . "' and presence = 1 order by sorting ASC, id DESC";

            $data = [
                "error" => false,
                "post" => $post,
                "option" => $this->db->query($option)->getResultArray()
            ];
        }

        return $this->response->setJSON($data);
    }
    function updateSelect()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {

            $this->db->table("journal_select")->update([
                "color" => $post['color'],
                'value' => $post['value'],
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['id'] . "' ");

            $data = [
                "error" => false,
                "post" => $post,
            ];
        }

        return $this->response->setJSON($data);
    }
    function deleteSelect()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->table("journal_select")->update([
                'presence' => 0,
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['id'] . "' ");

            $data = [
                "error" => false,
                "post" => $post,
            ];
        }
        return $this->response->setJSON($data);
    }
    function updateSortableSelect()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $i = 0;
            foreach ($post['order'] as $row) {
                $this->db->table("journal_select")->update([
                    "sorting" => $i++,
                    "update_by" => model("Core")->accountId(),
                    "update_date" => date("Y-m-d H:i:s"),
                ], "id = '" . $row . "' ");
            }
            $data = array(
                "error" => false,
            );
        }

        return $this->response->setJSON($data);
    }

    function updateUrl()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $i = 1;

            $this->db->table("journal_detail")->update([
                'f' . $post['customField']['f'] => $post['value'],
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['id'] . "' ");

            $data = array(
                "error" => false,
                "post" => $post,
            );
        }

        return $this->response->setJSON($data);
    }

    function onUpdateCustomField()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->table("journal_custom_field")->update([
                "name" => $post['name'],
                "suffix" => $post['suffix'],

                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['id'] . "' ");

            $data = [
                "error" => false,
                "post" => $post,
            ];
        }

        return $this->response->setJSON($data);
    }

    function addCustomField()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $total = model("Core")->select("count(id)", "journal_custom_field", "journalId= '" . $post['id'] . "' ");
            $n = 1;
            $max = 0;
            do {
                if ($this->db->fieldExists("f$n", 'journal_detail')) {
                    $max++;
                } else {
                    break;
                }
                $n++;
            } while (true);


            if ($total < $max) {


                $i = 1;
                for ($n = 1; $n <= $max; $n++) {
                    if (!model("Core")->select("id", "journal_custom_field", "journalId = '" . $post['id'] . "' AND f = " . $n)) {
                        $i = $n;
                        break;
                    }

                }

                if ($this->db->fieldExists("f$i", 'journal_detail')) {

                    $this->db->table("journal_custom_field")->insert([
                        "f" => $i,
                        "width" => 150,
                        "name" => $post['item']['name'],
                        "iType" => $post['item']['iType'],
                        "sorting" => model("Core")->select("count(id)", "journal_custom_field", "journalId = '" . $post['id'] . "' ") + 1,
                        "journalId" => $post['id'],
                        "input_by" => model("Core")->accountId(),
                        "input_date" => date("Y-m-d H:i:s"),
                    ]);
                    $data = array(
                        "error" => false,
                        "post" => $post,
                    );
                }
            } else {
                $data = array(
                    "error" => true,
                    "post" => $post,
                    "note" => " $max",
                );
            }

        }
        return $this->response->setJSON($data);
    }

    function removeCustomeFlied()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) { 
            $this->db->table("journal_custom_field")->delete([
                "id" => $post['id'],
            ]);
            $data = array(
                "error" => false,
                "post" => $post,
            );
        }
        return $this->response->setJSON($data);
    }
}