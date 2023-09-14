<?php

namespace App\Controllers; 
use CodeIgniter\Model; 
class Home extends BaseController
{
    public function index()
    {
        $data = [
            "error" => false, 
            "time" => time(),
            "server" => date("Y-m-d H:i:s"),
            "mysql" =>(int) model("Core")->select('unix_timestamp(NOW())',"book","1"), 
            "FCPATH" => FCPATH,
        ];

        return $this->response->setJSON($data);
    }

    function tableViewReset($id,$viewId)
    {
  
        $q1 = "SELECT  *  FROM journal_custom_field 
        WHERE journalId = 'B1-000027'
        ORDER BY sorting ASC, input_date ASC";
        $items = $this->db->query($q1)->getResultArray();

        foreach($items as $row){
            $this->db->table("journal_table_view_show")->insert([
                "journalId" => $row['journalId'],
                "journalTableViewId" => $viewId,
                "customFieldId" => $row['id'],
                "hide" => 0,
            ]);
        }

        $data = [
            "error" => false, 
            "items" =>  $items, 
        ];

        return $this->response->setJSON($data);
    }

    function welcome(){
        $accountId = model("Core")->accountId();
        $qbooks = "SELECT id, name, sorting  FROM book
        WHERE  accountId = '$accountId' AND presence = 1 
        ORDER BY sorting ASC, input_date ASC";
        $books = $this->db->query($qbooks)->getResultArray();

        $qjournal = "SELECT a.id, a.journalId, a.owner , j.name AS 'journal', b.name AS 'book', a.star,
        a.update_date, j.image
        FROM journal_access AS a
        LEFT JOIN journal AS j ON j.id = a.journalId
        LEFT JOIN book AS b ON b.id = a.bookId
        WHERE a.accountId = '$accountId' AND a.presence = 1  AND a.star = 1
        ORDER BY update_date DESC";
        $journalsData = $this->db->query($qjournal)->getResultArray();
        
        $journals = [];
        foreach( $journalsData as $row){
            array_push( $journals, array_merge($row,[
                "viewId" => model("Core")->select("id","journal_table_view","journalId = '".$row['journalId']."' order by id ASC "),
            ]));
        }
  
        $data = array(
            "error" => false,
            "books" => $books,
            "journals" => $journals, 
        );
        return $this->response->setJSON($data); 
    }

    function user($username) {
        echo 'masuk '.$username;
    }

    function eval() {
        echo "ok"."\n";

        $evaluateFormula = function ($data, $formula) {
            extract($data);
            $result = @eval("return $formula;"); 
            return ($result !== false) ? $result : null;
        };

        $data = array("a" => 42, "b" => 12, "c" => 5); 
        $result = $evaluateFormula($data, '$data["a"] + $data["d"]'); 

        if ($result !== null) {
            echo "Hasil: " . $result . "\n";
        } else {
            echo "Error: Formula tidak valid.\n";
        }
   
    } 
}