<?php

namespace App\Models;

use CodeIgniter\Model;
use CodeIgniter\CodeIgniter;

class Shared extends Model
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
  

    function journalTable($id = "", $journalTableViewId = "", $where = "",  $order = 0, $limit = 10000)
    {
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
        $header = [];
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
                $header[] = strval($r['name']);
            }
        }


        $customField = "";
        $customFieldNo = [];
        $i = 0;
        foreach ($journal_custom_field as $r) {
            if($i == 0) $customField .= " f" . $r['f'];
            else{
                $customField .= ", f" . $r['f'];
            } 
            array_push($customFieldNo, "f" . $r['f']);
            $i++;
        }


        $q = "SELECT   $customField 
        FROM journal_detail 
        where journalId = '$id' $where
        AND presence = 1 order by sorting ASC limit $order, $limit";
        $detail = $this->db->query($q)->getResultArray();

        $evaluateFormula = function ($data, $formula) {
            extract($data);
            return eval("return $formula;");
        };

        $index = 0;
        foreach ($detail as $rec) {
            $data = [];
            foreach ($journal_custom_field as $field) {
                $val = [
                   // "key" => [$index][$field['key']],
                    "value" => $rec[$field['key']], 
                    
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
                        $i = self::index2d($account, $val['value'] );
                        $val['value'] = $account[$i]['value'];
                    } 
                }
 
                $detail[$index][$field['key']] = $val;
                
            }
            $index++;
        }
 
        self::transformDetailArray($detail);
        
        $data = array(
            "header" => $header,
            "journal_custom_field" => $journal_custom_field,
            "detail" => $detail, 
            "journal_select" => $journal_select,
            "account" => $account,
            "total" => (int)self::select("count(id)","journal_detail","journalId = '$id' $where AND presence = 1 "),
        );

        return $data;
    }


    function transformDetailArray(&$array) {
        foreach ($array as &$item) {
            $transformedItem = []; 
            foreach ($item as $key => $value) {
                // $transformedItem[] = [
                //     'key' => $key,
                //     'value' => $value['value'],
                //     'color' => $value['color'],
                //     'suffix' => $value['suffix'],
                //     'iType' => $value['iType'],
                    
                // ];
                array_push( $transformedItem, $value['value']);
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

    function journalChart($id = "", $journalTableViewId = "", $where = "")
    {

        $c = "SELECT *, CONCAT('f',f) AS 'key', '' as showEvalDev , presence
        FROM journal_custom_field 
        WHERE journalId = '$id' 
        ORDER BY sorting ASC ";

        $journal_custom_field = $this->db->query($c)->getResultArray();

        $customField = "";
        $customFieldNo = [];
        foreach ($journal_custom_field as $r) {
            $customField .= ", f" . $r['f'];
            array_push($customFieldNo, "f" . $r['f']);
        }


        $q = "SELECT id, ilock, journalId, archives,  archives as 'historyArchives', false AS 'checkbox' $customField 
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
            "customFieldKey" => $customFieldNo,
            "journal_custom_field" => $journal_custom_field,
            "detail" => $detail,
            "archives" => (int) self::select("count(id)", "journal_detail", "presence = 1 and archives = 1 and journalId = '$id' "),
        );

        return $data;
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
 
    function chartJsData($journal_chart, $detail, $y, $selectWhereOption)
    {
        $datasets = [];
        $labels = [];
        // Xaxis
        foreach ($detail as $rec) {
            $insert = false;
            if (count($selectWhereOption) > 0) {
                foreach ($selectWhereOption as $opt) {
                    if ($rec[$opt['field']] == $opt['id'] && $opt['checkbox'] == '1') {
                        $insert = true;
                    }
                }
            } else {
                $insert = true;
            }

            if ($insert == true) {
                array_push($labels, $rec[$journal_chart['xaxis']]);
            }
        }
        //YAXIS
        foreach ($journal_chart['yaxis'] as $row) {
            if ($row['status'] == '1') {

                // $yItem = [];
                // foreach($detail as $rec){
                //     //echo $row[$journal_chart['xaxis']];
                //     array_push($yItem,$row['value']);
                // }
                $label = $row['value'];
                foreach ($y as $src) {
                    if ($src['key'] == $row['value']) {
                        $label = $src['name'];
                        break;
                    }
                }
                $data = [];
                foreach ($detail as $rec) {
                    $insert = false;
                    if (count($selectWhereOption) > 0) {
                        foreach ($selectWhereOption as $opt) {
                            if ($rec[$opt['field']] == $opt['id'] && $opt['checkbox'] == '1') {
                                $insert = true;
                            }
                        }
                    } else {
                        $insert = true;
                    }

                    if ($insert == true) {
                        array_push($data, (float) $rec[$row['value']]);
                    }

                }

                $dataDetail = array(
                    "key" => $row['value'],
                    "label" => $label,
                    "data" => $data,
                    "fill" => (bool) $row['fill'],
                );
                array_push($datasets, $dataDetail);
            }
        }

        // $dataDetail = array(
        //     "label" => "data Lable 1",
        //     "data" => [0, -21, -43, -64, 20, -1, -23, -45, 39, 123, 102, 80],
        //     "fill" => false,
        // );

        // array_push($datasets , $dataDetail); 

        $obj = array(
            "labels" => $labels,
            "datasets" => $datasets,
            "selectWhereOption" => $selectWhereOption,
        );
        return $obj;
    }
 
}