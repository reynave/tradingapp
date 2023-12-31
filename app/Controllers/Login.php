<?php

namespace App\Controllers;

use CodeIgniter\Model;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

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
            "request" => $this->request->getVar(),
            "token" => $jwt,
            "exp" => strtotime("+ 360 day"),
        );
        return $this->response->setJSON($data);
    }

    function auth0()
    {

        $data = [
            "error" => true,
        ];
        if (isset($_POST['data'])) {
            $jwt = explode(".", $_POST['data']);

            $user = json_decode(base64_decode($jwt[1]), true);

            $key = $_ENV['SECRETKEY'];
            $user['exp'] = strtotime("+ 30 day");

            $id = false;

            $email = $user['email'];
            if ($user['iss'] == 'https://accounts.google.com') {
                $id = model('Core')->select("id", "account", "email='$email' and googleSub = '" . $user['sub'] . "' and presence = 1 and status = 1 ");
            }

            if ($id) {
                $savePicture  = "";
                $this->db->table("account_login")->insert([
                    "accountId" => $id,
                    "jti" => $user['jti'],
                    "expDate" => date("Y-m-d H:i:s", $user['exp']),
                    "iss" => $user['iss'],
                    "ip" => $this->request->getIPAddress(),
                    "getUserAgent" => $this->request->getUserAgent(),
                    "input_date" => date("Y-m-d H:i:s"),
                ]);
                
            } else {
                $id = date("ymd") . "." . model("Core")->number('account');
               
                $url = $user['picture'];
                $destinationFolder = './uploads/picture/'; // path folder tujuan 
                $fileName = basename($url).'.jpg';
                $destinationPath = $destinationFolder . $fileName; 
                if (copy($url, $destinationPath)) {
                    $savePicture =  'Gambar berhasil disalin.';
                } else {
                    $savePicture = 'Gagal menyalin gambar.';
                }
                $this->db->table("account")->insert([
                    "id" => $id,
                    "googleSub" => $user['sub'],
                    "email" => $user['email'],
                    "name" => $user['name'],
                    "imgPath" => $destinationFolder,
                    "picture" =>  $fileName, 
                    "input_date" => date("Y-m-d H:i:s"),
                ]);


                $this->db->table("account_login")->insert([
                    "accountId" => $id,
                    "jti" => $user['jti'],
                    "expDate" => date("Y-m-d H:i:s", $user['exp']),
                    "iss" => $user['iss'],
                    "ip" => $this->request->getIPAddress(),
                    "getUserAgent" => $this->request->getUserAgent(),
                    "input_date" => date("Y-m-d H:i:s"),
                ]);
            }
            $user['account'] = $this->db->query("SELECT id, email, name, picture, inviteLink, username
            FROM account WHERE id = '" . $id . "' ")->getResultArray()[0];

            $payload = $user;
            $jwt = JWT::encode($payload, $key, 'HS256');

            $accountTokenId = uniqid();
            $this->db->table("account_token")->insert([
                "id" => $accountTokenId,
                "accountId" => $id,
                "token" => $jwt,
            ]);

            $data = [
                "error" => false,
                "token" => $jwt,
                "user" => $user,
                "accountTokenId" => $accountTokenId,
                "savePicture" => $savePicture ,
            ];

        }
        return $this->response->setJSON($data);
    }

    function checkTokenAsLogin()
    {
        $getVar = $this->request->getVar();
        $data = [
            "error" => true,
            "getVar" => $getVar,
            "token" => "",
        ];
        if ($getVar['id'] && model("Core")->select("id", "account_token", " id = '" . $getVar['id'] . "' ")) {
            $data = [
                "error" => false,
                "getVar" => $getVar,
                "token" => model("Core")->select("token", "account_token", " id = '" . $getVar['id'] . "' "),
            ];
        }


        return $this->response->setJSON($data);
    }

    function clearOneShotToken()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "note" => ""
        ];
        if ($post) {
            $this->db->table("account_token")->delete([
                "id" => $post['id'],
            ]);
            $data = [
                "error" => false,
                "note" => ""
            ];
        }
        return $this->response->setJSON($data);
    }


    function signIn()
    {

        // $json = file_get_contents('php://input');
        // $post = json_decode($json, true);
        $data = array( 
            "error" => true,
            "post" => "Wrong password or email",
        );
        if ($this->request->isAJAX() && $this->request->getMethod(true) === 'POST') {
            $email = $this->request->getPost('email');
            $pass = $this->request->getPost('password');
             
            $id = model('Core')->select("id", "account", "email='$email' and password = '$pass' and presence = 1 and status = 1 ");
            if ($id) {

                $key = $_ENV['SECRETKEY']; 
                $payload = [
                    "account" => $this->db->query("SELECT id, email, name, picture, inviteLink, username
                    FROM account WHERE id = '" . $id . "' ")->getResultArray()[0],
                    'iss' => 'https://www.mirrel.com',
                    'iat' => time() . microtime(),
                    'nbf' => strtotime(date("Y-m-d H:i:s")),
                ];
                $jwt = JWT::encode($payload, $key, 'HS256');

                $this->db->table("account_login")->insert([
                    "accountId" => $id,
                    "ip" => $this->request->getIPAddress(),
                    'iss' => 'https://www.mirrel.com',
                    "getUserAgent" => $this->request->getUserAgent(),
                    "input_date" => date("Y-m-d H:i:s"),
                    'expDate' => date('Y-m-d H:i:s', strtotime(date('Y-m-d H:i:s'). ' +30 days')),
                    'jti' =>  md5(uniqid().' '),
                ]);
                $accountTokenId = uniqid();
                $this->db->table("account_token")->insert([
                    "id" => $accountTokenId,
                    "accountId" => $id,
                    "token" => $jwt,
                ]);
                $data = array(
                    "error" => false,
                    "accountTokenId" => $accountTokenId,
                    "post" => "Login success, redirect to App",
                );
            } else {
                $data = array(
                    "post" => $this->request->getPost(),
                    "error" => true,
                    "post" => "Wrong password or email",
                );
            }
        }

        return $this->response->setJSON($data);
    }

    function jwtTokenDecode()
    {
        $jwt = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjkxMWUzOWUyNzkyOGFlOWYxZTlkMWUyMTY0NmRlOTJkMTkzNTFiNDQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0ODA3ODU2NDAyODItcHJpNHJ0M2J0YnY3Z3R2MGY2OHIwYW9qOTZ2NDQ1NTkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0ODA3ODU2NDAyODItcHJpNHJ0M2J0YnY3Z3R2MGY2OHIwYW9qOTZ2NDQ1NTkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDEyMjE2MTc4NTQ2NjU0NzgxNDgiLCJlbWFpbCI6ImZlbGl4LnJlbmFsZGlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5iZiI6MTY5MTQzMDkwNSwibmFtZSI6IkZlbGl4IFJleW5hdmUiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUFjSFR0ZUYtYUFlQ1VybnJFc0J3MEY4bWEyNEEya0hUcU96Q1hWelJsd0lNZnlkNkRNPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkZlbGl4IiwiZmFtaWx5X25hbWUiOiJSZXluYXZlIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2OTE0MzEyMDUsImV4cCI6MTY5MTQzNDgwNSwianRpIjoiYzc1NTMyNTk0ZjdjOThmYTEwNTI2ZTkyZjJlOWE2MzM4MTFhOWNmOCJ9.R_YYYUt3rOTY2r3BYZi7OEKIDcLqm09B1DYK5yuF8jM1GEuDqmIpgunq4b0wBOxAeqlUG9VThMMOSQOJvZD_nqbiceC5i4MVqx3Zm4lrfCFdTMv7QszG4mhBwfviVekFeu9hJT0K2Y5UI7a9LxVxf4Tl4HnE9DNWNMFuSZGmc9OTvlbKuuhYBEMd5wfsjR8q1bR6RNu7lXVBi9eVjbKwzHu3AyPvsD4EQLdhPQYVUjfnVaOyP77a6L2DErUNOc7nKz_sw99Uq474GC3Lr3GgE24MGodzY8f53IPxXaQbCcmXkNGvtmE1YIobXlbneHCDbEiqYhF60jX_LC3AUp9QnA";
        $key = "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";
        //  echo $token;


        // $key = 'example_key';
        // $payload = [
        //     'iss' => 'http://example.org',
        //     'aud' => 'http://example.com',
        //     'iat' => 1356999524,
        //     'nbf' => 1357000000
        // ];
        // $jwt = JWT::encode($payload, $key, 'HS256');
        // echo $jwt;
        // $decoded = JWT::decode($jwt, new Key($key, 'HS256'));
        // print_r($decoded);


        $decoded = JWT::decode($jwt, new Key($key, 'RS256'));
        print_r($decoded);
    }

}