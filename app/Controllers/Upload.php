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
            "request" => $this->request->getVar(),
        );
        return $this->response->setJSON($data);
    }
    function removeImages()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($data) {
            $img = model("Core")->select("img", "widget", "id=" . $data['post']['id']);

            $img = explode("/", $img);
            $img = end($img);
            if (file_exists('./uploads/' . $data['post']['table'] . '/' . $img)) {
                unlink('./uploads/' . $data['post']['table'] . '/' . $img);
            }
            if (file_exists('./uploads/thumbs/' . $img)) {
                unlink('./uploads/thumbs/' . $img);
            }
            $this->db->table($data['post']['table'])->update([
                "img" => "",
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $data['post']['id'] . "' ");

            $data = [
                "error" => false,
                "post" => $post,
                "img" => $img,
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
                    "img" => base_url() . 'uploads/' . $file->getName(),
                    "journalDetailId" => $data['post']['journalDetailId'],
                    "input_date" => date("Y-m-d H:i:s"),
                    "update_date" => date("Y-m-d H:i:s"),
                ]);
            } else {
                $data = [
                    'errors' => 'The file has already been moved.',
                    "post" => $this->request->getVar(),
                ];
            }
        }

        return $this->response->setJSON($data);
    }

    function profilePicture()
    {
        $data = array(
            "error" => true,
            "post" => $this->request->getVar(),
        );
        $accountId = model("Core")->select("accountId", "account_login", "jti = '" . $data['post']['jti'] . "' ");
        if ($data['post']['jti'] && $accountId) {

            $validateImage = $this->validate([
                'file' => [
                    'uploaded[userfile]',
                    'is_image[userfile]',
                    'mime_in[userfile,image/jpg,image/jpeg,image/png]',
                    'max_size[userfile,200]',
                    'max_dims[userfile,100,100]',
                ],
            ]);


            $data = [
                'errors' => $this->validator->getErrors(),
                "post" => $this->request->getVar(),
            ];

            if ($validateImage) {
                $curImage = model("Core")->select("picture", "account", "id = '" . $accountId . "' ");
                if (file_exists('./uploads/picture/' . $curImage)) {
                    unlink('./uploads/picture/' . $curImage);
                }


                $file = $this->request->getFile('userfile');

                if (!$file->hasMoved()) {
                    $newName = $file->getRandomName();
                    $file->move('./uploads/picture/', $newName);

                    $this->db->table('account')->update([
                        "picture" => $file->getName(),
                        "update_date" => date("Y-m-d H:i:s"),
                    ], " id = '$accountId' ");
                    $data = [
                        'error' => false,
                        'note' => 'upload',
                        "name" => $file->getName(),
                        "filepath" => $file,
                        "post" => $this->request->getVar(),
                    ];
                } else {
                    $data = [
                        'error' => true,
                        'note' => 'The file has already been moved.',
                        "post" => $this->request->getVar(),

                    ];
                }
            }

        }

        return $this->response->setJSON($data);
    }

    function uploadCsv()
    {
        $file = $this->request->getFile('csvFile');
        $data = array(
            "error" => false,
            "note" => ""
        );
        if ($file && $file->isValid() && $file->getExtension() == 'csv') {
            // Membaca file CSV ke dalam array
            $csvData = file($file->getTempName());
            $i=0;
            $get = $this->request->getVar();
            $journalId = $get['journalId'];
            $template = $get['template'];
            $accountId = $get['accountId'];
            // Menambahkan "HAHA01" ke setiap kolom pertama (elemen pertama dalam setiap baris)
            foreach ($csvData as &$row) {
                // Pisahkan baris menjadi array kolom dengan delimiter koma
                $columns = str_getcsv($row);

                // Tambahkan "HAHA01" ke kolom pertama
                $datetime  = explode(" ",$columns[0]);
                if($i < 1){
                    array_unshift($columns, "ID","Date","Time"); 
                }else{
                    $columns[0] =  preg_replace('/\xc2\xa0/', '', $columns[0]);
                    $columns[1] =  (float)preg_replace('/\xc2\xa0/', '', $columns[1]);
                    $columns[2] =  (float)preg_replace('/\xc2\xa0/', '', $columns[2]);
                    $columns[3] =  (float)preg_replace('/\xc2\xa0/', '', $columns[3]);
                    $columns[4] =  preg_replace('/\xc2\xa0/', '', $columns[4]); 
                   
                    array_unshift($columns, $journalId, $datetime[0], date('h:i', strtotime($datetime[1] )) ); 
                   
                }
               

                unset($columns[3]);
               
                // Gabungkan kembali kolom ke dalam baris
                $row = implode(",", $columns) . "\n";
                $i++;
            }


            // Simpan file CSV yang telah diperbarui
            $newName = $file->getRandomName(); 
            $newFilePath = WRITEPATH . 'uploads/' . $newName;
            file_put_contents($newFilePath, $csvData);
          
            // Selanjutnya, Anda dapat menjalankan perintah LOAD DATA INFILE dengan file yang telah diperbarui.
            // Gantilah nama tabel dan kolom sesuai kebutuhan Anda.
            // C:\xampp\htdocs\app\tradingapp\public\uploads
            // Selanjutnya, Anda dapat menjalankan perintah SQL LOAD DATA INFILE untuk mengimpor data
            // Gantilah nama tabel dan sesuaikan kolom-kolomnya sesuai dengan kebutuhan Anda
         
            //  $path = 'C:/xampp/htdocs/app/tradingapp/public/uploads/a.csv';

            $this->db->table("upload_history")->insert([
                "journalId" => $journalId,
                "template" => $template,
                "accountId" =>$accountId,
                "total" => $i-1,
                "files" =>  $newName,
                "path" =>  WRITEPATH . 'uploads',
                "input_date" => date("Y-m-d H:i:s"),
                "exp_date" => date("Y-m-d H:i:s"), 

            ]);
            $WRITEABLE_UPLOADS = $_ENV['WRITEABLE_UPLOADS'];
            $query = false;
            $databaseCommand = "LOAD DATA INFILE '".$WRITEABLE_UPLOADS.$newName."'
                    INTO TABLE journal_detail
                    FIELDS TERMINATED BY ','
                    ENCLOSED BY '\"'
                    LINES TERMINATED BY '\n'
                    IGNORE 1 LINES
                    (journalId, f1,f2,f3,f4,f5,f6);";

            // // Eksekusi perintah SQL dengan koneksi database Anda
  
             $query = $this->db->query($databaseCommand);

            if ($query) { 
                $data = [
                    "error" => false,
                    "note" => 'File berhasil diunggah dan data berhasil diperbarui.'
                ];
            } else {
                $data = [
                    "error" => true,
                    "note" => 'Gagal mengimpor data dari file CSV.'
                ];
            }


            $data = array(
                "error" => false,
                "bulkInsert" => $query,
                "note" => 'File berhasil diunggah.',
                "newFilePath" =>  $newFilePath ,
          //      "fixpath" => $path,
                "get"=>$this->request->getVar()
            );
        } else {
            $data = array(
                "error" => false, 
                "note" => 'Pilih file CSV yang valid.'
            );
        }
        return $this->response->setJSON($data);
    }
}