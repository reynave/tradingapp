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

    public function auth()
    {

        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
            "note" => ""
        ];
        if ($post && filter_var($post['email'], FILTER_VALIDATE_EMAIL)) {

            $email = $post['email'];
            $pass = $post['pass'];
            $id = model('Core')->select("id", "account", "email='$email' and password = '$pass' and presence = 1 and status = 1 ");
            if ($id) {

                $key = $_ENV['SECRETKEY'];
                $payload = [ 
                    "account" =>  $this->db->query("SELECT id, email, name FROM account WHERE id = '" . $id . "' ")->getResultArray()[0],
                    'iat' => time() . microtime(),
                    'nbf' => strtotime(date("Y-m-d H:i:s")),
                ];
                $jwt = JWT::encode($payload, $key, 'HS256');

                $this->db->table("account_login")->insert([
                    "accountId" => $id, 
                    "ip" => $this->request->getIPAddress(),
                    "getUserAgent" => $this->request->getUserAgent(),
                    "input_date" => date("Y-m-d H:i:s"),
                ]);

                $data = array(
                    "error" => false,
                    "token" => $jwt,
                    "post" => $post,
                    "payload" => $payload,
                );
            } else {
                $data = array(
                    "post" => $post,
                    "error" => true,
                    "post" => "Wrong password or email",
                );
            }
        }

        return $this->response->setJSON($data);
    }
}
