<?php

namespace App\Controllers;

use CodeIgniter\Model;

class Tablesprintable extends BaseController
{
    public function index()
    {
        $data = [
            "error" => false,
        ];

        return $this->response->setJSON($data);
    }


    function printable()
    {

        $post = $this->request->getVar();

        $data = [
            "error" => true,
            "post" => $post,
        ];
 
        $journalId = $post['id'];
        $journalTableViewId = $post['journalTableViewId'];


        $viewName = model("Core")->select("name", "journal_table_view", "journalId = '$journalId' AND  id= '$journalTableViewId' AND presence = 1 ");
        $name = model("Core")->select("name", "journal", "id = '$journalId' AND presence = 1 ");

        $journalTable = model("Shared")->journalTable($journalId, $journalTableViewId, "");
        $header = $journalTable['header'];

        $data = array( 
            "name" => $name,
            "viewName" => $viewName,
            "tableHeader" => [$header],
            "table" => $journalTable['detail'],
         
        );
        

       
        return $this->response->setJSON($data);
    }

}