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
                $f13 = model("Core")->select("id","journal_select", " field = 'f13' ".$where );
                $date = '2023-' . $faker->date('m-d'); 
                $this->db->table("journal_detail")->insert([
                    'journalId' => $journalId,
                    'f1' => $date,
                    'f2' => rand(1, 11) . ":" . rand(0, 59),
                    'f3' => model("Core")->select("id","journal_select", " field = 'f3' ".$where ),
                    'f4' => model("Core")->select("id","journal_select", " field = 'f4' ".$where ),
                    'f5' => "1.0" . rand(4000, 6000),
                    'f6' => "1.0" . rand(4000, 6000),
                    'f7' => "1.0" . rand(4000, 6000),
                    'f8' => $date,
                    'f9' => rand(12, 24) . ":" . rand(0, 59),
                    'f10' =>  model("Core")->select("id","journal_select", " field = 'f10' ".$where ),
                    'f11' =>  rand(-100, 300),
                    'f12' => '',
                    'f13' =>  '',
                    'f14' => "",
                    'f15' => "",
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