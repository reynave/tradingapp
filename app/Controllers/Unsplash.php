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
        
        $endpoint = $this->api.'photos?page=1&per_page=30'; 
        $response = Services::curlrequest()->get($endpoint, $this->headers() );

        $data['photos'] = json_decode($response->getBody(), true);

       // return view('unsplash_view', $data);
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