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

            $x = [];  $y = []; $select = [];

            foreach( $customField  as $row){
                $temp = array(
                    "key" =>  $row['key'], 
                    "name" =>  $row['name'],  
                );

                if($row['iType'] == 'number'){
                    array_push($y, $temp );
                }
                else if($row['iType'] == 'select'){
                    array_push($select, $temp );
                }
                else{
                    array_push($x, $temp );
                }
            }

            $data = array(
                "error" => false,
                "id" => $id,  
                "x" => $x,
                "y" => $y,
                "select" => $select,
                "customField" => $journalTable['journal_custom_field'],
                "detail" => $journalTable['detail'],
            );


        }
        return $this->response->setJSON($data);
    }


} 