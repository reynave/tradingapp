<?php

namespace App\Models;

use CodeIgniter\Model;
use CodeIgniter\CodeIgniter;

class TableViewOnly extends Model
{
    protected $id = null;
    protected $db = null;
    protected $request = null;

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
                $row = $query->getRowArray();
                $data = $row[$field];
            }
        } else {
            $data = null;
        }
        return $data;
    }

    function accountId()
    {
        return self::header() != false ? self::header()['account']['id'] : "";
    }


    function journalTable($id = "", $journalTableViewId = "", $where = "", $order = 0, $limit = 10000)
    {
        $cell = [];
        $journal_select = $this->db->query("SELECT id, value, color FROM journal_select WHERE journalId = '$id'  ");
        $journal_select = $journal_select->getResultArray();

        $a = $this->db->query("SELECT c.accountId as id,  a.username as value
            FROM journal_access AS c
            LEFT JOIN account AS a ON a.id = c.accountId
            WHERE c.journalId = '$id' 
            GROUP BY c.accountId ");
        $account = $a->getResultArray();

        $c = "SELECT id, ilock, hideDEL, name, f,iType, width, textAlign, suffix, sorting, eval, 
        CONCAT('f',f) AS 'key', '' as showEvalDev , '' as 'total'
        FROM journal_custom_field 
        WHERE journalId = '$id' AND presence = 1
        ORDER BY sorting ASC ";

        $journal_custom_field = [];
        foreach ($this->db->query($c)->getResultArray() as $r) {
            $hide = (bool) model("Core")->select("hide", "journal_table_view_show", " presence = 1 and  journalTableViewId = '$journalTableViewId' AND journalCustomFieldId = '" . $r['id'] . "'");
            if ($hide != true) {
                if (model("Core")->select("board", "journal_table_view", "id =  '$journalTableViewId' ") == 'chart') {
                    $temp = array(
                        "hide" => 0,
                    );
                } else {
                    $temp = array(
                        "hide" => model("Core")->select("hide", "journal_table_view_show", "journalTableViewId = '$journalTableViewId'  AND journalCustomFieldId = '" . $r['id'] . "' ") ? 1 : 0,
                    );
                }

                array_push($journal_custom_field, array_merge($r, $temp));
            }
        }


        $customField = "";
        $customFieldNo = [];
        $i = 0;
        foreach ($journal_custom_field as $r) {
            if ($i == 0)
                $customField .= " f" . $r['f'];
            else {
                $customField .= ", f" . $r['f'];
            }
            array_push($customFieldNo, "f" . $r['f']);
            $i++;
        }


        $q = "SELECT    $customField  
        FROM journal_detail 
        where journalId = '$id' $where
        AND presence = 1 order by sorting ASC limit $order, $limit ";
        $detail = $this->db->query($q)->getResultArray();

        $evaluateFormula = function ($data, $formula) {
            extract($data);
            return eval("return $formula;");
        };

        $index = 0;   $value = []; 
        foreach ($detail as $rec) {
            $data = [];
            $culumn = [];
            $temp = "";
            foreach ($journal_custom_field as $field) {
             
                $val = [ 
                    "value" => $rec[$field['key']], 
                    "suffix" => $field['suffix'],
                ];
                if ($field['iType'] == 'formula') {
                    foreach (array_keys($rec) as $key) {
                        $data[$key] = (int) $rec[$key];
                    }
                    $val['value'] = $evaluateFormula($data, $field['eval']);
                }

                if ($field['iType'] == 'select') {
                    //$val = self::select("value","journal_select"," field = '".$field['key']."' and id =  '".$val."' ");  
                    if ($val['value'] != "") {
                        $i = self::index2d($journal_select, $val['value']);
                        $val['value'] = $journal_select[$i]['value'];
                        $val['color'] = $journal_select[$i]['color'];
                    }

                }
                
                if ($field['iType'] == 'user') {
                    // $val['value'] = self::select("username", "account", "  id =  '" . $val['value'] . "' ");
                    if ($val['value'] != "") {
                        $i = self::index2d($account, $val['value']);
                        $val['value'] = $account[$i]['value'];
                    }
                }
                $temp .= strval($val['value'])." ";
               // $detail[$index][$field['key']] = strval($val['value']);
                $culumn[] = 0;
            }
          
            $index++;
            $value[] =  $temp;
           // array_push($value, $temp);
            array_push($cell, $culumn);
        }

       // self::transformDetailArray($detail);

        $data = array(
            "detail" => $value,
            "cell" => $cell,
            "q" =>  $q,
        );

        return $data;
    }

    function transformDetailArray(&$array)
    {
        foreach ($array as &$item) {
            $transformedItem = [];
            foreach ($item as $key => $value) {
                $transformedItem[] = [
                    //     'key' => $key, 
                    'value' => $value['value'],
                   // 'color' => $value['color'],
                    'suffix' => $value['suffix'],
                    //'iType' => $value['iType'],

                ];
                // array_push( $transformedItem, $value['value']);
            }

            $item = $transformedItem;
        }
    }


    function index2d($array = [], $id = "")
    {

        for ($i = 0; $i < $array; $i++) {
            if ($array[$i]['id'] == $id) {
                return $i;
            }
        }
        return false;
    }

    function journalTableFormula($id = "", $journalTableViewId = "", $evalDev = "", $f = "")
    {
        $c = "SELECT *, CONCAT('f',f) AS 'key'  FROM journal_custom_field WHERE  journalId = '$id' ORDER BY sorting ASC ";
        $journal_custom_field = $this->db->query($c)->getResultArray();

        $customField = "";
        $customFieldNo = [];
        foreach ($journal_custom_field as $r) {
            $customField .= ", f" . $r['f'];
            array_push($customFieldNo, "f" . $r['f']);
        }


        $q = "SELECT id $customField 
        FROM journal_detail 
        where journalId = '$id' 
        AND presence = 1 order by sorting ASC";
        $detail = $this->db->query($q)->getResultArray();

        $evaluateFormula = function ($data, $formula) {
            extract($data);
            try {
                return eval("return $formula;");
            } catch (Throwable $e) {
                return 0;
            }
        };

        $index = 0;
        $detailEval = [];
        foreach ($detail as $rec) {
            $data = [];
            foreach ($journal_custom_field as $field) {
                if ($field['iType'] == 'formula' && $field['key'] == $f) {
                    foreach (array_keys($rec) as $key) {
                        $data[$key] = (int) $rec[$key];
                    }
                    $detailEval[$index][$field['key']] = $evaluateFormula($data, $evalDev);

                }
            }
            $index++;
        }

        // $data = array(  
        //     "detailEval" =>$detailEval
        // );

        return $detailEval;
    }



}