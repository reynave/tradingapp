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


    public function faker()
    {
        $faker = \Faker\Factory::create();
       
        $winrate = [-1,-1,-1,2.4,3];

        for ($i = 0; $i < 200; $i++) {
            $this->db->table("journal_detail")->insert([
                'journalId' => 'J23000065',
                'f1' => '2023-' . $faker->date('m-d'),
                 'f2' => $faker->date('H:i'),
                // 'f3' => rand(101, 104),
                // 'f4' => rand(106, 109),
                // 'f5' => rand(30, 50),
                 'f6' => $winrate[rand(0, 4)],
                 'f9' => '2023-' . $faker->date('m-d'),
                 'f10' => $faker->date('H:i'),
            ]);
        }
        $data = array(
            "error" => false,
        );
        return $this->response->setJSON($data);
    }

}