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
                $this->db->table("journal_detail")->insert([
                    'journalId' => $journalId,
                    'f1' => $date,
                    'f2' => rand(1, 11) . ":" . rand(0, 59),
                    'f8' => model("Core")->select("id","journal_select", " field = 'f8' ".$where ),
                    'f10' => "1.0" . rand(4000, 6000),
                    'f11' => "1.0" . rand(4000, 6000),
                    'f12' => "1.0" . rand(4000, 6000),
                    'f6' =>  (rand(1,3) % 2) == 1 ? rand(200, 300)  :  -100 ,
                    'f9' =>  model("Core")->select("id","journal_select", " field = 'f9' ".$where ),
                    'f3' => $date,
                    'f4' => rand(12, 24) . ":" . rand(0, 59), 
                ]);
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