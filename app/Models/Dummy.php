<?php

namespace App\Models;

use CodeIgniter\Model;
use CodeIgniter\CodeIgniter;

class Dummy extends Model
{
    protected $id = null;
    protected $db = null;
    protected $request = null;

    function __construct()
    {
        $this->request = \Config\Services::request();
        $this->db = \Config\Database::connect();
    }


    function select($field = "", $table = "", $where = " 1 ")
    {
        $data = null;
        if ($field != "") {
            $query = $this->db->query("SELECT $field  FROM $table WHERE $where LIMIT 1");
            if ($query->getRowArray()) {
                $row = $query->getRowArray();
                $data = $row[$field];
            }
        } else {
            $data = null;
        }
        return $data;
    }
 
    function faker($journalId)
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
                    'f11' =>  rand(1,3) == 3 ?  rand(100, 400) : -100 ,
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
            "dummy_error" => false,
        );
        return $data;
    }


}