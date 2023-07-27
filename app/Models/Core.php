<?php

namespace App\Models;

use CodeIgniter\Model;
use CodeIgniter\CodeIgniter;

class Core extends Model
{
    protected   $id    =  null;
    protected   $db    =  null;
    protected   $request    =  null;

    function __construct()
    {
        $this->request = \Config\Services::request();
        $this->db = \Config\Database::connect();
    }


    function select($field = "", $table = "", $where = " 1 ")
    {
        $data = null;
        if ($field != "") {
            $query = $this->db->query("SELECT $field  FROM $table WHERE $where LIMIT 1");
            if ($query->getRowArray()) {
                $row   = $query->getRowArray();
                $data  = $row[$field];
            }
        } else {
            $data  =  null;
        }
        return   $data;
    }
    function header(){
        if(service('request')->getHeaderLine('Token')) {
            $jwtObj = explode('.', service('request')->getHeaderLine('Token'));
            $user = base64_decode($jwtObj[1]); 
            $data = json_decode($user , true);
        }else{
            $data = false;
        }
      
        return   $data;
    }
    function accountId() {
        return self::header() != false ? self::header()['account']['id'] : "";
    }


    function number($name = "")
    {
        if ($name) {
            $number = self::select('runningNumber', 'auto_number', "name = '" . $name . "'") + 1;
            $prefix = self::select('prefix', 'auto_number', "name = '" . $name . "'");
            if ($prefix == '$year') {
                $prefix = date("Y");
            }
          
            $this->db->table("auto_number")->update([ 
                "runningNumber" => $number,
                "updateDate" => time(),
            ],"name = '" . $name . "' ");

            $new_number = str_pad($number, self::select('digit', 'auto_number', "name = '" . $name . "'"), "0", STR_PAD_LEFT);

            return $prefix . $new_number;
        }
    }

    function buildTree($arr, $parentId = 0)
    {
        $tree = [];

        foreach ($arr as $item) {
            if ($item['parent_id'] == $parentId) {
                $item['children'] = self::buildTree($arr, $item['id']);
                $tree[] = $item;
            }
        }

        return $tree;
    }

    function deleteNode($parentId) {
  
        
        // Mengupdate nilai presence menjadi 0 pada parent yang dihapus
        $this->db->table('pages')->where('id', $parentId)->update(['presence' => 0]);
    
        // Mengambil semua child yang terkait dengan parent yang dihapus
        $children = $this->db->table('pages')->where('parent_id', $parentId)->get()->getResultArray();
    
        // Menghapus atau mengupdate presence pada setiap child secara rekursif
        foreach ($children as $child) {
            self::deleteNode($child['id']);
        }
    }
    function journalTable($id = "", $journalTableViewId = "", $where = "") {
        $c = "SELECT *, CONCAT('f',f) AS 'key' FROM journal_custom_field WHERE journalId = '$id' ORDER BY sorting ASC ";
         
        $journal_custom_field = [];
        foreach ($this->db->query($c)->getResultArray() as $r) { 
            if(model("Core")->select("board","journal_table_view","id =  '$journalTableViewId' ") == 'chart' ){
                $temp = array(
                    "hide" => 0,
                );
            }else{ 
                $temp = array(
                    "hide" => model("Core")->select("hide","journal_table_view_show","journalTableViewId = '$journalTableViewId'  AND journalCustomFieldId = '".$r['id']."' ") ? 1:0,
                ); 
            }
            
            array_push($journal_custom_field, array_merge($r,$temp));
        }
        

        $customField = "";
        $customFieldNo = [];
        foreach ($journal_custom_field as $r) {
            $customField .= ", f" . $r['f'];
            array_push($customFieldNo, "f" . $r['f']);
        }


        $q = "SELECT id, ilock, journalId, false AS 'checkbox' $customField 
        FROM journal_detail 
        where journalId = '$id' $where
        AND presence = 1 order by sorting ASC";
        $detail = $this->db->query($q)->getResultArray();

        $evaluateFormula = function ($data, $formula) {
            extract($data);
            return eval("return $formula;");
        };

        $index = 0;
        foreach ($detail as $rec) {
            $data = [];
            foreach ($journal_custom_field as $field) {
                if ($field['iType'] == 'formula') {
                    foreach (array_keys($rec) as $key) {
                        $data[$key] = (int) $rec[$key];
                    }
                    $detail[$index][$field['key']] = $evaluateFormula($data, $field['eval']);
                }
            }
            $index++;
        }
        $data = array(  
            "customFieldNo" => $customFieldNo,
            "journal_custom_field" => $journal_custom_field,
            "detail" => $detail, 
        );

        return $data;
    }
}