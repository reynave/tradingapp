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
        
            $chartjsTypeId = model("Core")->select("chartjsTypeId","journal_chart_type","journalTableViewId = '$journalTableViewId'  AND  status = 1 ");
            $xaxis = model("Core")->select("value","journal_chart_xaxis","journalTableViewId = '$journalTableViewId'  AND  status = 1 ");
           
            $q1 = "SELECT * FROM journal_chart_yaxis
            WHERE  journalTableViewId = '$journalTableViewId' AND status = 1 AND presence = 1
            ORDER BY sorting ASC";
            $yaxis = $this->db->query($q1)->getResultArray();
  
            $data = array(
                "error" => false,
                "id" => $id,  
                "x" => $x,
                "y" => $y,
                "typeOfChart" => $typeOfChart,
                "iWhere" => $iWhere,
                "customField" => $journalTable['journal_custom_field'],
                "journal_chart_type" => [
                    "chartjsTypeId" =>  $chartjsTypeId,
                    "xaxis"         =>  $xaxis,
                    "yaxis"         =>  $yaxis,  
                ],
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

        if($post){

            foreach($post['journalChart']['yAxis'] as $row){
                $id = model("Core")->select("id","journal_chart_yaxis","presence = 1 and  journalTableViewId = '".$post['journalTableViewId']."' AND value =  '".$row['key']."' ");
               $array = [
                "journalTableViewId" => $post['journalTableViewId'],
                "value" => $row['key'],
                "status" => $row['check'] == true ? 1:0, 
                "presence" => 1
               ];

               if(!$id){
                $this->db->table("journal_chart_yaxis")->insert(
                    $array
                );
               }else{
                $this->db->table("journal_chart_yaxis")->update(
                    $array," id = $id "
                );
               } 
              // model("Core")->put($array,"journal_chart_yaxis"," journalTableViewId = '".$post['journalTableViewId']."' AND value =  '".$row['key']."' ");
            }
 
            $data = [
                "error" => true,
                "post" => $post,
                "journal_chart_type" =>  model("Core")->put([
                    "journalTableViewId" => $post['journalTableViewId'],
                    "chartjsTypeId" => $post['journalChart']['chartjsTypeId'],
                ],"journal_chart_type"," journalTableViewId = ".$post['journalTableViewId']),

                "journal_chart_xaxis" =>  model("Core")->put([
                    "journalTableViewId" => $post['journalTableViewId'],
                    "value" => $post['journalChart']['xAxis'],
                ],"journal_chart_xaxis"," journalTableViewId = ".$post['journalTableViewId']), 
             
            ]; 
        }


        return $this->response->setJSON($data);
    }

} 