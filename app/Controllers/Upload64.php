<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\Model;
use CodeIgniter\Files\File;

class Upload64 extends BaseController
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
    public function base64ToJpg()
    {

        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $base64_string = $post['clipboardImage']; // Ambil string base64 dari permintaan POST
            $base64_string = str_replace('data:image/png;base64,', '', $base64_string);

            // Buat direktori penyimpanan jika belum ada
            $upload_path = './uploads/journal/'.$post['journalId'].'/';
            if (!is_dir($upload_path)) {
                 mkdir($upload_path, 0777, true);
            }

            // Konversi base64 menjadi data biner
            $image_data = base64_decode($base64_string);

            // Generate nama unik untuk gambar
            $file_name = uniqid() . '.png';

            // Simpan data biner sebagai gambar JPG
            file_put_contents($upload_path. $file_name, $image_data);

            // Mengembalikan URL gambar yang telah dibuat
            $image_url = base_url($upload_path . $file_name);
            $id = $post['id'];
            $this->db->table("journal_detail_images")->insert([
                "journalId" => $post['journalId'],
                "journalDetailId" => $id,
                "fn" => $post['fn'],
                "source" => "mirrel.com",
                "path" => base_url().$upload_path,
                "fileName" => $file_name, 
                "caption" => $post['caption'],
                "input_date" => date("Y-m-d H:i:s"),
                "input_by" => model("Core")->accountId(),
            ]);

            $this->db->table("journal_detail")->update([
                "f".$post['fn'] => model("Core")->select("count(id)","journal_detail_images","presence = 1 and journalDetailId = '$id'"),
            ]," id =  ".$id  );



            $newId = $id;
            $journalId = model("Core")->select("journalId", "journal_detail", "id = '$newId' ");

            $journalTable = model("Core")->journalTable($journalId, '', " AND  id = '$newId'  ");
            $tableViewOnly = model("TableViewOnly")->journalTable($journalId, '', " AND  id = '$newId'  ");

            for ($i = 0; $i < count($journalTable['detail']); $i++) {
                $journalTable['detail'][$i]['searchable'] = $tableViewOnly['detail'][$i];
            }
            $detail =  $journalTable['detail'];


            $data = array(
                "error" => false,
                "file_name" => $file_name,
                "image_url" => $image_url,
                "base64_string " => $base64_string,
                "row" =>   $detail[0],
            );
        }
        return $this->response->setJSON($data);
    }
}