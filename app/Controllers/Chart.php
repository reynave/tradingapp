<?php

namespace App\Controllers;

use CodeIgniter\Model;

class Chart extends BaseController
{

    function detail()
    {

        $data = array(
            "error" => true,
            "request" => $this->request->getVar(),
        );
        $accountId = model("Core")->accountId();
        $accountId = '230101.0001';
        $journalTableViewId = $data['request']['journalTableViewId'];
        $id = model("Core")->select("journalId", "journal_access", "journalId = '" . $data['request']['id'] . "' and accountId = '$accountId'  and presence = 1");
        if ($data['request']['id'] && $id) {


            $journalTable = model("Core")->journalTable($id, $journalTableViewId);
            $customField = $journalTable['journal_custom_field'];
            $x = [];
            $y = [];
            $iWhere = [];
            // yAxis
            foreach ($customField as $row) {

                $q1 = "SELECT a.id, a.value, IF(s.status = 1, TRUE, FALSE) as checkbox  , a.field
                FROM journal_select AS a 
                LEFT JOIN journal_chart_where_select AS s ON s.journalSelectId = a.id
                WHERE   a.presence = 1   and a.field = '" . $row['key'] . "'
                ORDER BY a.sorting ASC";
                $option = $this->db->query($q1)->getResultArray();

                $temp = array(
                    "key" => $row['key'],
                    "name" => $row['name'],
                    "iType" => $row['iType'],
                    "check" => model("Core")->select("status", "journal_chart_yaxis", "value= '" . $row['key'] . "' and journalTableViewId = $journalTableViewId "),
                    "fill" => (bool)model("Core")->select("fill", "journal_chart_yaxis", "value= '" . $row['key'] . "' and journalTableViewId = $journalTableViewId "),
                    
                    "option" => $option,
                     
                );

                if ($row['iType'] == 'number' || $row['iType'] == 'formula') {
                    array_push($y, $temp);
                } else if ($row['iType'] == 'select') {
                    array_push($iWhere, $temp);
                }
            }
            // xAxis
            foreach ($customField as $row) {
                $temp = array(
                    "key" => $row['key'],
                    "name" => $row['name'],
                    "iType" => $row['iType'],
                );
                if ($row['iType'] == 'text' || $row['iType'] == 'formula' || $row['iType'] == 'date' || $row['iType'] == 'time' || $row['iType'] == 'select') {
                    array_push($x, $temp);
                }
            }

            $q1 = "SELECT *  FROM chartjs_type
            WHERE status = 1 
            ORDER BY id ASC ";
            $typeOfChart = $this->db->query($q1)->getResultArray();

            $chartjsTypeId = model("Core")->select("chartjsTypeId", "journal_chart_type", "journalTableViewId = '$journalTableViewId'  AND  status = 1 ");
            $xaxis = model("Core")->select("value", "journal_chart_xaxis", "journalTableViewId = '$journalTableViewId'  AND  status = 1 ");
            $idWhere = model("Core")->select("value", "journal_chart_where", "journalTableViewId = '$journalTableViewId'  AND  status = 1 ");

            $q1 = "SELECT * FROM journal_chart_yaxis
            WHERE  journalTableViewId = '$journalTableViewId' AND presence = 1 ";
            $yaxis = $this->db->query($q1)->getResultArray();

            $journal_chart = [
                "chartjsTypeId" => $chartjsTypeId,
                "xaxis" => $xaxis,
                "yaxis" => $yaxis,
                "idWhere" => $idWhere ? $idWhere : "",
            ];

            $data = array(
                "error" => false,
                "id" => $id,
                "x" => $x,
                "y" => $y,
                "typeOfChart" => $typeOfChart,
                "iWhere" => $iWhere,
                "chartJsData" => model("Core")->chartJsData($journal_chart, $journalTable['detail'], $y),
                "detail" => $journalTable['detail'],
                "journal_chart" => $journal_chart,
                "request" => $this->request->getVar()
            );


        }
        return $this->response->setJSON($data);
    }

    function updateChartJs()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];

        if ($post) {
            // YAXIS
            $yAxisObj = [];
            foreach ($post['journalChart']['yAxis'] as $row) {
                $id = model("Core")->select("id", "journal_chart_yaxis", "presence = 1 and  journalTableViewId = '" . $post['journalTableViewId'] . "' AND value =  '" . $row['key'] . "' ");
                $array = [
                    "journalTableViewId" => $post['journalTableViewId'],
                    "value" => $row['key'],
                    "status" => $row['check'] == true ? 1 : 0,
                    "presence" => 1
                ];

                if (!$id) {
                    $this->db->table("journal_chart_yaxis")->insert(
                        $array
                    );
                } else {
                    $this->db->table("journal_chart_yaxis")->update(
                        $array,
                        " id = $id "
                    );
                }
                array_push($yAxisObj, $array);
            }

            $id_journal_chart_type = model("Core")->select("id", "journal_chart_type", "presence = 1 and  journalTableViewId = '" . $post['journalTableViewId'] . "'  and presence = 1 ");
            if (!$id_journal_chart_type) {
                $this->db->table("journal_chart_type")->insert([
                    "journalTableViewId" => $post['journalTableViewId'],
                    "presence" => 1,
                    "status" => 1,
                    "chartjsTypeId" => $post['journalChart']['chartjsTypeId'],
                    "update_date" => date("Y-m-d H:i:s"),
                    "update_by" => model("Core")->accountId(),
                    "input_date" => date("Y-m-d H:i:s"),
                    "input_by" => model("Core")->accountId(),
                ]);
                $id_journal_chart_type = model("Core")->select("id", "journal_chart_type", " input_by = '" . model("Core")->accountId() . "' AND  journalTableViewId = '" . $post['journalTableViewId'] . "'  AND presence = 1 order by input_date DESC");
            } else {
                $this->db->table("journal_chart_type")->update([
                    "journalTableViewId" => $post['journalTableViewId'],
                    "chartjsTypeId" => $post['journalChart']['chartjsTypeId'],
                    "update_date" => date("Y-m-d H:i:s"),
                    "update_by" => model("Core")->accountId(),
                ], " id =  $id_journal_chart_type ");
            }


            $id_journal_chart_xaxis = model("Core")->select("id", "journal_chart_xaxis", "presence = 1 and  journalTableViewId = '" . $post['journalTableViewId'] . "'  and presence = 1 ");
            if (!$id_journal_chart_xaxis) {
                $this->db->table("journal_chart_xaxis")->insert([
                    "journalTableViewId" => $post['journalTableViewId'],
                    "presence" => 1,
                    "status" => 1,
                    "value" => isset($post['journalChart']['xAxis']) ? $post['journalChart']['xAxis'] : "",
                    "update_date" => date("Y-m-d H:i:s"),
                    "update_by" => model("Core")->accountId(),
                    "input_date" => date("Y-m-d H:i:s"),
                    "input_by" => model("Core")->accountId(),
                ]);
                $id_journal_chart_xaxis = model("Core")->select("id", "journal_chart_xaxis", " input_by = '" . model("Core")->accountId() . "' AND  journalTableViewId = '" . $post['journalTableViewId'] . "'  AND presence = 1 order by input_date DESC");
            } else {
                $this->db->table("journal_chart_xaxis")->update([
                    "journalTableViewId" => $post['journalTableViewId'],
                    "value" => $post['journalChart']['xAxis'],
                    "update_date" => date("Y-m-d H:i:s"),
                    "update_by" => model("Core")->accountId(),
                ], " id =  $id_journal_chart_xaxis ");
            }

            //  iWhere
            $id_journal_chart_where = model("Core")->select("id", "journal_chart_where", "presence = 1 and  journalTableViewId = '" . $post['journalTableViewId'] . "'  and presence = 1 ");
            if (!$id_journal_chart_where) {
                $this->db->table("journal_chart_where")->insert([
                    "journalTableViewId" => $post['journalTableViewId'],
                    "presence" => 1,
                    "status" => 1,
                    "value" => isset($post['journalChart']['idWhere']) ? $post['journalChart']['idWhere'] : "",
                    "update_date" => date("Y-m-d H:i:s"),
                    "update_by" => model("Core")->accountId(),
                    "input_date" => date("Y-m-d H:i:s"),
                    "input_by" => model("Core")->accountId(),
                ]);
                $id_journal_chart_where = model("Core")->select("id", "journal_chart_where", " input_by = '" . model("Core")->accountId() . "' AND  journalTableViewId = '" . $post['journalTableViewId'] . "'  AND presence = 1 order by input_date DESC");
            } else {
                $this->db->table("journal_chart_where")->update([
                    "journalTableViewId" => $post['journalTableViewId'],
                    "value" => $post['journalChart']['idWhere'],
                    "update_date" => date("Y-m-d H:i:s"),
                    "update_by" => model("Core")->accountId(),
                ], " id =  $id_journal_chart_where ");
            }

            $this->db->table("journal_chart_where_select")->delete([
                "journalTableViewId" => $post['journalTableViewId'],
            ]);
            foreach ($post['journalChart']['whereOption'] as $row) {
                $this->db->table("journal_chart_where_select")->insert([
                    "journalTableViewId" => $post['journalTableViewId'],
                    "journalSelectId" => $row['id'],
                    "status" => $row['checkbox'] == true ? 1 : 0,
                ]);
            }

            $data = [
                "error" => true,
                "post" => $post,
                "journal_chart_type" => $id_journal_chart_type,
                "journal_chart_where" => $id_journal_chart_where,
                "xAxis" => $id_journal_chart_xaxis,
                "yAxis" => $yAxisObj,

            ];
        }


        return $this->response->setJSON($data);
    }

}