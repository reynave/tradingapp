<?php

namespace App\Models;

use CodeIgniter\Model;
use CodeIgniter\CodeIgniter;

class Core extends Model
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
    function header()
    {
        if (service('request')->getHeaderLine('Token')) {
            $jwtObj = explode('.', service('request')->getHeaderLine('Token'));
            $user = base64_decode($jwtObj[1]);
            $data = json_decode($user, true);
        } else {
            $data = false;
        }

        return $data;
    }
    function accountId()
    {
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
            ], "name = '" . $name . "' ");

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

    function deleteNode($parentId)
    {

        // Mengupdate nilai presence menjadi 0 pada parent yang dihapus
        $this->db->table('pages')->where('id', $parentId)->update(['presence' => 0]);

        // Mengambil semua child yang terkait dengan parent yang dihapus
        $children = $this->db->table('pages')->where('parent_id', $parentId)->get()->getResultArray();

        // Menghapus atau mengupdate presence pada setiap child secara rekursif
        foreach ($children as $child) {
            self::deleteNode($child['id']);
        }
    }

    function put($data = [], $table = "", $where = "")
    {
        $res = false;
        if ($where != "") {
            $id = self::select("id", $table, $where);
            if (!$id) {
                $res = $this->db->table($table)->insert([
                    "presence" => 1,
                    "update_date" => date("Y-m-d H:i:s"),
                    "update_by" => model("Core")->accountId(),
                    "input_date" => date("Y-m-d H:i:s"),
                    "input_by" => model("Core")->accountId(),
                ]);
                $id = self::select("id", $table, " input_by = '" . model("Core")->accountId() . "' order by input_by DESC ");
            }

            foreach ($data as $key => $value) {

                $this->db->table($table)->update([
                    $key => $value,
                    "update_date" => date("Y-m-d H:i:s"),
                    "update_by" => model("Core")->accountId(),
                ], "id = $id ");
            }

        }


        return $res;



    }

    function journalTable($id = "", $journalTableViewId = "", $where = "", $order = 0, $limit = 10000)
    {
        $filterDetail = "";
        // FILTER  journal_table_view_filter
        $users = "SELECT   a.id, a.name as 'value',
             concat('" . base_url() . "uploads/picture/',a.picture) as 'picture' 
            FROM journal_access AS ja
            LEFT join account AS a ON a.id = ja.accountId
            WHERE ja.journalId = '$id' AND ja.presence = 1
            ORDER BY a.name asc;";
            $users = $this->db->query($users)->getResultArray(); 

        $d = "SELECT id as 'journalCustomFieldId', name, iType, CONCAT('f',f) AS 'field', '' as selectId
        FROM journal_custom_field 
        WHERE journalId = '$id' AND presence = 1 AND (iType = 'select' OR  iType = 'user') 
        ORDER BY sorting ASC ";
        $filterSelect = [];
        $and = '';
        foreach ($this->db->query($d)->getResultArray() as $rec) {
            $select = [];
            if ($rec['iType'] == 'select') {
                $g = "SELECT id, color, value
                FROM journal_select 
                WHERE journalId = '$id' AND presence = 1 AND field = '" . $rec['field'] . "'
                ORDER BY sorting ASC ";
                $select  = $this->db->query($g)->getResultArray();
            }

            if ($rec['iType'] == 'user') {
                $select =  $users; 
            } 
            $where1 = "journalTableViewId = '$journalTableViewId' AND journalCustomFieldId = '".$rec['journalCustomFieldId']."' AND field = '".$rec['field']."'";
            $rec['selectId'] = self::select("selectId","journal_table_view_filter",$where1);

            $filterSelect[] = array_merge($rec, [
                "select" => $select,
            ]);
           
            $filterDetail .=  $rec['selectId'] != '' ?  $and." ".$rec['field'].' = "' .$rec['selectId']. '" ' : '';
            $and = $filterDetail != '' ? ' AND ': '';
        }
        // END FILTER

        $c = "SELECT *, CONCAT('f',f) AS 'key', '' as showEvalDev , '' as 'total'
        FROM journal_custom_field 
        WHERE journalId = '$id' AND presence = 1
        ORDER BY sorting ASC ";

        $journal_custom_field = [];
        foreach ($this->db->query($c)->getResultArray() as $r) {
            if (model("Core")->select("board", "journal_table_view", "id =  '$journalTableViewId' ") == 'chart') {
                $temp = array(
                    "hide" => 0,
                );
            } 
            else {
                $temp = array(
                    "hide" => model("Core")->select("hide", "journal_table_view_show", "journalTableViewId = '$journalTableViewId'  AND journalCustomFieldId = '" . $r['id'] . "' ") ? 1 : 0,
                );
            }

            array_push($journal_custom_field, array_merge($r, $temp));
        }
 
        $customField = "";
        $customFieldNo = [];
        foreach ($journal_custom_field as $r) {
            $customField .= ", f" . $r['f'];
            array_push($customFieldNo, "f" . $r['f']);
        }

        $filterDetail = trim(preg_replace('/\s\s+/', ' ', str_replace("\n", " ", $filterDetail)));
        $q = "SELECT id, ilock, journalId, archives,  archives as 'historyArchives', false AS 'checkbox' $customField 
        FROM journal_detail 
        where journalId = '$id' $where
        AND presence = 1 AND archives = 0 ". ($filterDetail == '' ?  "" : " AND ( $filterDetail)" )."
        order by sorting 
        ASC limit $order, $limit";
        $detail = $this->db->query($q)->getResultArray();

        $evaluateFormula = function ($data, $formula) {
            extract($data);
            $formula = preg_replace("/(EVAL|SELECT|INSERT|UPDATE|DELETE|ALTER|DROP)/i", "", $formula);

            $result = @eval("return $formula;");
            return ($result !== false) ? $result : "!Error";
        };

        $index = 0;
        foreach ($detail as $rec) {
            $data = [];
            foreach ($journal_custom_field as $field) {
                if ($field['iType'] == 'formula') {
                    foreach (array_keys($rec) as $key) {

                        if ((int) $rec[$key] == $rec[$key]) {
                            $data[$key] = (int) $rec[$key];
                        } else if ($rec[$key] == '') {
                            $data[$key] = 0;
                        } else {
                            $data[$key] = $rec[$key];
                        }


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
            "filterSelect" => $filterSelect,
            "filterDetail" => $filterDetail,
            "q" => $q,
        );

        return $data;
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
        where journalId = '$id' and f10 != '' AND f11 != ''
         $where
        AND presence = 1 and archives = 0 order by sorting ASC";
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
                        $data[$key] = $rec[$key];
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
        AND presence = 1 and archives = 0 order by sorting ASC";
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

    function chartJsDataDEL($journal_chart, $detail, $y, $iWhere)
    {
        $datasets = [];
        $labels = [];


        // Xaxis | LABELS
        if ($journal_chart['xaxis'] != null) {
            foreach ($detail as $rec) {
                //echo $row[$journal_chart['xaxis']];
                $input = false;


                foreach ($journal_chart['idWhere'] as $whereKey) {
                    foreach ($iWhere as $w) {
                        if ($whereKey == $w['key']) {
                            foreach ($w['option'] as $opt) {
                                if ($rec[$whereKey] == $opt['id'] && $opt['checkbox'] == '1') {
                                    $input = true;
                                }
                            }
                        }
                    }
                }


                if ($input == true || count($journal_chart['idWhere']) == 0) {
                    array_push($labels, $rec[$journal_chart['xaxis']]);
                }

            }
        }

        // Yaxix  | DATASETS
        $idSelect = [];
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
                    $input = false;
                    // foreach( $journal_chart['idWhere'] as  $whereKey ){
                    //     if($rec[$whereKey] == '23'){
                    //         $input = true;
                    //     } 
                    // }

                    foreach ($journal_chart['idWhere'] as $whereKey) {
                        foreach ($iWhere as $w) {
                            if ($whereKey == $w['key']) {
                                foreach ($w['option'] as $opt) {
                                    if ($rec[$whereKey] == $opt['id'] && $opt['checkbox'] == '1') {
                                        $input = true;
                                    }
                                }
                            }
                        }
                    }



                    if ($input == true || count($journal_chart['idWhere']) == 0) {
                        array_push($data, (float) $rec[$row['value']]);

                    }

                }

                $dataDetail = array(
                    "key" => $row['value'],
                    "label" => $label,
                    "data" => $data,
                    "idSelect" => $idSelect,
                    "fill" => (bool) $row['fill'],
                );
                array_push($datasets, $dataDetail);
            }
        }

        // SAMPLE
        // $dataDetail = array(
        //     "label" => "data Lable 1",
        //     "data" => [0, -21, -43, -64, 20, -1, -23, -45, 39, 123, 102, 80],
        //     "fill" => false,
        // );

        // array_push($datasets , $dataDetail); 

        $obj = array(
            "labels" => $labels,
            "datasets" => $datasets
        );
        return $obj;
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
                $cal = 0;
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
                        $cal += (float) $rec[$row['value']];
                        array_push($data, $row['accumulation'] == '1' ? $cal : (float) $rec[$row['value']]);
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


    /**
     * SELECT
     */
    function journal_select($id = '')
    {

        $c = "SELECT * FROM journal_custom_field
             WHERE journalId = '$id'  and presence = 1 
             ORDER BY sorting ASC ";
        $journal_custom_field = $this->db->query($c)->getResultArray();

        $customField = "";
        $customFieldNo = [];
        foreach ($journal_custom_field as $r) {
            $customField .= ", f" . $r['f'];
            array_push($customFieldNo, "f" . $r['f']);
        }

        $select = [];
        foreach ($customFieldNo as $rec) {
            $option = "SELECT *
                FROM journal_select 
                where journalId = '$id' and field = '$rec' and presence = 1 order by sorting ASC, id DESC";

            $optionDelete = "SELECT *
                FROM journal_select 
                where journalId = '$id' and field = '$rec' and presence = 0 order by sorting ASC, id DESC";

            $temp = array(
                "field" => $rec,
                "option" => $this->db->query($option)->getResultArray(),
                "optionDelete" => $this->db->query($optionDelete)->getResultArray(),

                "q" => $option,
            );
            array_push($select, $temp);
        }

        $data = array(
            "error" => false,
            "customFieldNo" => $customFieldNo,
            "select" => $select,
            "customField" => $journal_custom_field,
        );
        return $data;
    }


    // SOFT DELETE
    function delete_Journal_detail($journalId)
    {
        $this->db->table("journal")->update([
            "presence" => 0,
            "update_by" => self::accountId(),
            "update_date" => date("Y-m-d H:i:s"),
        ], " id = '$journalId' ");

        $this->db->table("journal_detail")->update([
            "presence" => 0,
            "update_by" => self::accountId(),
            "update_date" => date("Y-m-d H:i:s"),
        ], " journalId = '$journalId' ");

        $journalDetailId = model("Core")->select("id", "journal_detail", " journalId = '$journalId' ");
        $this->db->table("journal_detail_images")->update([
            "presence" => 0,
            "update_by" => self::accountId(),
            "update_date" => date("Y-m-d H:i:s"),
        ], " journalDetailId = $journalDetailId ");

        $this->db->table("journal_select")->update([
            "presence" => 0,
            "update_by" => self::accountId(),
            "update_date" => date("Y-m-d H:i:s"),
        ], " journalId = '$journalId' ");

        $this->db->table("journal_table_view")->update([
            "presence" => 0,
            "update_by" => self::accountId(),
            "update_date" => date("Y-m-d H:i:s"),
        ], " journalId = '$journalId' ");


        $q1 = "SELECT id  FROM journal_table_view WHERE journalId = '$journalId' ";
        $journal_table_view = $this->db->query($q1)->getResultArray();

        foreach ($journal_table_view as $row) {
            $this->db->table("journal_table_view_show")->update([
                "presence" => 0,
            ], " journalTableViewId =  " . $row['id']);

            $this->db->table("journal_chart_xaxis")->update([
                "presence" => 0,
                "update_by" => self::accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], " journalTableViewId =  " . $row['id']);

            $this->db->table("journal_chart_yaxis")->update([
                "presence" => 0,
                "update_by" => self::accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], " journalTableViewId =  " . $row['id']);

            $this->db->table("journal_chart_where_select")->update([
                "presence" => 0,
                "update_by" => self::accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], " journalTableViewId =  " . $row['id']);

            $this->db->table("journal_chart_where")->update([
                "presence" => 0,
                "update_by" => self::accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], " journalTableViewId =  " . $row['id']);

            $this->db->table("journal_chart_type")->update([
                "presence" => 0,
                "update_by" => self::accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], " journalTableViewId =  " . $row['id']);

        }

        $this->db->table("journal_custom_field")->update([
            "presence" => 0,
            "update_by" => self::accountId(),
            "update_date" => date("Y-m-d H:i:s"),
        ], " journalId = '$journalId' ");


    }


    function isUrlValid($url)
    {
        // Menggunakan fungsi strpos untuk mencari "http://" atau "https://"
        return (strpos($url, "http://") === 0 || strpos($url, "https://") === 0);
    }
}