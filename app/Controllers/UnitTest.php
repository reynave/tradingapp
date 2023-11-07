<?php

namespace App\Controllers;

use CodeIgniter\Model;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class UnitTest extends BaseController
{
    public function index()
    {
        $data = array(
            "error" => false,
        );
        return $this->response->setJSON($data);
    }

    function dateFix(){
        $q1 = "SELECT f1, f3, id FROM journal_detail
        WHERE  presence = 1";
        $items = $this->db->query($q1)->getResultArray();
        $this->response->setHeader('Content-Type', 'application/json');
        foreach($items as $row){
            echo $row['id'].' '.date("Y-m-d", strtotime($row['f1'])).' | '.date("Y-m-d", strtotime($row['f3'])).' | ';
            
            $this->db->table("journal_detail")->update([   
                "f1" => date("Y-m-d", strtotime($row['f1'])), 
                "f3" => date("Y-m-d", strtotime($row['f3'])),  
            ]," id = ".$row['id'] ); 

            echo "\n";
        }

    }

    public function faker($journalId)
    {
        $faker = \Faker\Factory::create();
       
        $max = 2000;
        $where = " and journalId = '$journalId' ORDER BY RAND()";
        $total = model("Core")->select("count(id)", "journal_detail", "journalId =  '$journalId' and presence = 1 ");
        for ($i = 0; $i < 100; $i++) {
            $total++;
            
            if ($total <= $max) {  
                $date = '2023-' . $faker->date('m-d'); 
                
            }else{
                break;
            }
        }
        $data = array(
            "error" => false,
        );
        return $this->response->setJSON($data);
    }

}