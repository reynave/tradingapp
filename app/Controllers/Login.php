<?php

namespace App\Controllers;

use CodeIgniter\Model;
use Firebase\JWT\JWT; 

class Login extends BaseController
{
    public function index()
    {
        $key = $_ENV['SECRETKEY'];
        $payload = [
            'iss' => 'http://example.org',
            'aud' => 'http://example.com',
            'iat' => 1356999524,
            'nbf' => time(),
        ];
        $jwt = JWT::encode($payload, $key, 'HS256');

        $data = array(
            "error" => false,
            "request" =>  $this->request->getVar(),
            "token" => $jwt,
        );
        return $this->response->setJSON($data);
    }
}
