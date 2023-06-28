<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\Model;
use CodeIgniter\Files\File;

class Upload extends BaseController
{
    protected $helpers = ['form'];
    public function index()
    {
        $data = array(
            "error" => false,
            "request" =>  $this->request->getVar(),
        );
        return $this->response->setJSON($data);
    }
    function removeImages()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data  = [
            "error" => true,
            "post" => $post,
        ];
        if ($data) {
            $img = model("Core")->select("img", "widget", "id=" . $data['post']['id']);

            $img = explode("/",$img);
            $img = end($img); 
            if (file_exists('./uploads/' . $data['post']['table'] . '/' . $img)) {
                unlink('./uploads/' . $data['post']['table'] . '/' . $img);
            }
            if (file_exists('./uploads/thumbs/' . $img)) {
                unlink('./uploads/thumbs/' . $img);
            }
            $this->db->table($data['post']['table'])->update([
                "img"    => "",
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $data['post']['id'] . "' ");

            $data  = [
                "error" => false,
                "post" => $post,
                "img" =>  $img,
            ];
        }
        return $this->response->setJSON($data);
    }
    function uploadImages()
    {
        $data = array(
            "error" => true,
            "post" => $this->request->getVar(),
        );
        if ($data['post']['token']) {
            $validationRule = [
                'userfile' => [
                    'label' => 'Image File',
                    'rules' => [
                        'uploaded[userfile]',
                        'is_image[userfile]',
                        'mime_in[userfile,image/jpg,image/jpeg,image/gif,image/png,image/webp]',
                        'max_size[userfile,900]',
                        'max_dims[userfile,2048,1536]',
                    ],
                ],
            ];
            if (!$this->validate($validationRule)) {
                $data = [
                    'errors' => $this->validator->getErrors(),
                    "post" => $this->request->getVar(),
                ];
            }

            $file = $this->request->getFile('userfile');

            if (!$file->hasMoved()) {
                $overwrite = false;
                // if (file_exists('./uploads/' . $data['post']['table'] . '/' . $file->getName())) {
                //     $overwrite = true;
                //     unlink('./uploads/' . $data['post']['table'] . '/' . $file->getName());
                // }

                $file->move('./uploads/');
                $data = [
                    "overwrite" => $overwrite,
                    "name" => $file->getName(),
                    "filepath" => $file,
                    "post" => $this->request->getVar(),
                ];

                /**
                 * Call : http://localhost/website/cms7/public/thumb.app
                 *  */ 
                // $image = \Config\Services::image();

                // $path = './uploads/'.$data['post']['table'].'/'.$file->getName();
                // $pathSave = './uploads/thumbs/'.$file->getName();
                // $w = 200;
                // $h = 200; 
                // if (!file_exists($pathSave)) { 
                //     $image->withFile($path)
                //         ->fit($w, $h, 'center')
                //         ->save($pathSave);
                // }
 
                $this->db->table('journal_detail_images')->insert([ 
                    "img"               => base_url() . 'uploads/' . $file->getName(),
                    "journalDetailId"  => $data['post']['journalDetailId'],
                    "input_date"        => date("Y-m-d H:i:s"),
                    "update_date"       => date("Y-m-d H:i:s"), 
                ]);
            } else {
                $data = [
                    'errors' =>  'The file has already been moved.',
                    "post" => $this->request->getVar(),
                ];
            }
        }

        return $this->response->setJSON($data);
    }
}