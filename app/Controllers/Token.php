<?php

namespace App\Controllers;

use CodeIgniter\Model;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Token extends BaseController
{
    public function index()
    {
        $data = array(
            "error" => false,
        );
        return $this->response->setJSON($data);
    }


    public function validateToken()
    {
        $jwt = service('request')->getHeaderLine('Token');
        $key = $_ENV['SECRETKEY'];
        // Pass a stdClass in as the third parameter to get the decoded header values
        $decoded = JWT::decode($jwt, new Key($key, 'HS256'), $headers = new \stdClass());
       
        /*
         NOTE: This will now be an object instead of an associative array. To get
         an associative array, you will need to cast it as such:
        */

        $decoded_array = (array) $decoded;
 
        $data = array(
            "data" =>  $decoded_array,
            //"decoded_array" => $decoded_array,
        );
        return $this->response->setJSON($data);
 
    }

    public function decodeToken()
    {
        $jwt = service('request')->getHeaderLine('Token');
        $key = $_ENV['SECRETKEY'];
        // Pass a stdClass in as the third parameter to get the decoded header values
        $decoded = JWT::decode($jwt, new Key($key, 'HS256'), $headers = new \stdClass());
       
        /*
         NOTE: This will now be an object instead of an associative array. To get
         an associative array, you will need to cast it as such:
        */

        $decoded_array = (array) $decoded;
 
        $data = array(
            "data" => true,
            //"decoded_array" => $decoded_array,
        );
        return $this->response->setJSON($data);
    }
}