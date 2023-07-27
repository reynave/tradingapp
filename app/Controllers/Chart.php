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
        $journalTableViewId = $data['request']['journalTableViewId'];
        $id = model("Core")->select("journalId", "journal_access", "journalId = '" . $data['request']['id'] . "' and accountId = '$accountId'  and presence = 1");
        if ($data['request']['id'] && $id) {
 

            $journalTable = model("Core")->journalTable($id, $journalTableViewId); 
            $customField = $journalTable['journal_custom_field']; 
            $x = [];  $y = []; $iWhere = []; 
            foreach( $customField  as $row){

                $q1 = "SELECT id, value, '' as checkbox  FROM journal_select
                WHERE   presence = 1  and field = '".$row['key']."'
                ORDER BY sorting ASC"; 
                $option = $this->db->query($q1)->getResultArray();


                $temp = array(
                    "key" =>  $row['key'], 
                    "name" =>  $row['name'],  
                    "iType" => $row['iType'],
                    "check" => 0,
                    "option" => $option,
                );
 
                if($row['iType'] == 'number' || $row['iType'] == 'formula' ){
                    array_push($y, $temp );
                }
                else if($row['iType'] == 'select'){
                    array_push($iWhere, $temp );
                }
            }

            foreach( $customField  as $row){
                $temp = array(
                    "key" =>  $row['key'], 
                    "name" =>  $row['name'],  
                    "iType" => $row['iType'],
                );
                if($row['iType'] == 'text'  || $row['iType'] == 'formula'){
                    array_push($x, $temp );
                }
            }
            
            $q1 = "SELECT *  FROM chartjs_type
            WHERE   status = 1 
            ORDER BY sorting ASC";
            $typeOfChart = $this->db->query($q1)->getResultArray();
             
            $q1 = "SELECT * FROM journal_chart
            WHERE  journalTableViewId = '$journalTableViewId'  AND  status = 1 
            ORDER BY sorting ASC";
            $journal_chart = $this->db->query($q1)->getResultArray();
          

            $data = array(
                "error" => false,
                "id" => $id,  
                "x" => $x,
                "y" => $y,
                "typeOfChart" => $typeOfChart,
                "iWhere" => $iWhere,
                "customField" => $journalTable['journal_custom_field'],
                "journal_chart" => $journal_chart,
                "q1" => $q1,
            );


        }
        return $this->response->setJSON($data);
    }

    function updateChartJs(){
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];

        return $this->response->setJSON($data);
    }

} 