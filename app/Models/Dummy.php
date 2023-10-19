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
 
    function faker($journalId,$balance = 1000)
    {
        $faker = \Faker\Factory::create();
       
        $max = 200;
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
                    'f6' =>  $balance * (  ((rand(1,3) % 2) == 0 ? rand(2, 3)  :  -1) / 100),
                    'f9' =>  model("Core")->select("id","journal_select", " field = 'f9' ".$where ),
                    'f3' => $date,
                    'f4' => rand(12, 24) . ":" . rand(0, 59), 
                    'f13' =>  model("Core")->select("id","journal_select", " field = 'f13' ".$where ),
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