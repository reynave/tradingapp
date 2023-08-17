<?php

namespace App\Controllers;
use Config\Services;

class Unsplash extends BaseController
{
    private string $api = 'https://api.unsplash.com/';   
    
    private function headers(){
        return [
            'headers' => [
                'Authorization' => 'Client-ID ' . $_ENV['ACCESSKEY'],
            ]
        ];
    }

    public function index()
    {
        $get = $this->request->getVar();
        $per_page = 28;
        $p = isset($get['p']) ? $get['p']  : "1";

        $endpoint = $this->api."photos?page=$p&per_page=$per_page"; 
        if(isset($get['searchPhotos'])  && $get['searchPhotos'] != "" ){
            $endpoint = $this->api."search/photos?page=$p&query=".$get['searchPhotos']."&per_page=$per_page"; 
            $response = Services::curlrequest()->get($endpoint, $this->headers() );
            $data = array(
                "searchPhotos" => isset($get['searchPhotos'])  ? $get['searchPhotos'] : "",
                "photos" =>  json_decode($response->getBody(), true),
            );
        }else{ 
            $response = Services::curlrequest()->get($endpoint, $this->headers() );
            $data = array(
                "searchPhotos" => "",
                "photos" =>  array(
                    "results" => json_decode($response->getBody(), true),
                ),
            );
        }
        
        return $this->response->setJSON($data);
    }


    public function view()
    {
        $endpoint = $this->api.'photos/'.$this->request->getVar()['id']; 
        $response = Services::curlrequest()->get($endpoint, $this->headers() );

        $data  = json_decode($response->getBody(), true);

       // return view('unsplash_view', $data);
        return $this->response->setJSON($data);
    }
    public function search()
    {
        $endpoint = $this->api.'search/photos?page=1&query=office&per_page=30'; 
        $response = Services::curlrequest()->get($endpoint, $this->headers() );

        $data  = json_decode($response->getBody(), true);

       // return view('unsplash_view', $data);
        return $this->response->setJSON($data);
    }
    
    
    
}