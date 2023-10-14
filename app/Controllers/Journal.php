<?php

namespace App\Controllers;

use CodeIgniter\Model;

class Journal extends BaseController
{
    function index($id)
    {

        $accountId = model("Core")->accountId();

        $permission = "SELECT * FROM permission  ORDER BY id ASC";
        $permission = $this->db->query($permission)->getResultArray();


        $itemJoin = [];
        $book = [];
        $items = [];

        $itemFields = " ja.id as journal_accessID,
        ja.bookId,
        p.name AS 'permission',
        p.fontIcon,
        a.name AS 'ownBy',
        j.*,
        ja.owner,  '' AS checkbox , ja.presence, ja.admin, ja.star";

        if ($id == 'undefined' || !$id) {

            $q1 = "SELECT  $itemFields
            FROM journal_access AS ja
            LEFT JOIN journal AS j ON j.id = ja.journalId
            LEFT JOIN permission AS p ON p.id = j.permissionId
            JOIN account AS a ON a.id = j.accountId
            WHERE ja.accountId = '$accountId' AND ja.owner = 0;";

            $items = $this->db->query($q1)->getResultArray();
            $book = array(
                "id" => 0,
                "name" => "Share to Me",
                "iLock" => 1,
            );
        } else {
            $bookId = model("Core")->select("id", "book", "id='$id' and presence = 1 ");
            if ($bookId) {


                $q1 = "SELECT  $itemFields
                FROM journal_access AS ja
                LEFT JOIN journal AS j ON j.id = ja.journalId
                LEFT JOIN permission AS p ON p.id = j.permissionId
                JOIN account AS a ON a.id = j.accountId
                WHERE ja.accountId = '$accountId' and (ja.presence = 1 OR ja.presence = 4) and ja.bookId = '$bookId'
                ORDER BY ja.sorting ASC, ja.input_date ASC";

                $items = $this->db->query($q1)->getResultArray();
                $book = "SELECT * FROM book WHERE presence = 1 and accountId  = '$accountId' and id = '$id'";
                $book = $this->db->query($book)->getResultArray()[0];
            } else {
                $items = [];
                $book = false;
            }
        }
        foreach ($items as $rec) {
            array_push($itemJoin, array_merge($rec, [
                "viewId" => model("Core")->select("id", "journal_table_view", "ilock = 1 and journalId = '" . $rec['id'] . "' order by id ASC "),
            ]));
        }

        $bookSelect = "SELECT  * from book where presence  = 1 and  accountId = '$accountId' order by sorting ASC, name ASC";
        $bookSelect = $this->db->query($bookSelect)->getResultArray();


        $templatejson = "SELECT  * FROM template WHERE presence  = 1  order by id ASC, name ASC";
        $templatejson = $this->db->query($templatejson)->getResultArray();

        $items = [];
        foreach ($itemJoin as $rec) {
            array_push($items, array_merge($rec, [
                "rows" => model("Core")->select("count(id)", "journal_detail", "journalId = '" . $rec['id'] . "' and presence = 1"),
                "template" => model("Core")->select("name", "template", "code = '" . $rec['templateCode'] . "' and presence = 1"),
            ]));
        }

        $data = array(
            "error" => false,
            "items" => $items,
            "book" => $book,
            "bookSelect" => $bookSelect,
            "permission" => $permission,
            "header" => model("Core")->header(),
            "templatejson" => $templatejson,
            "q" => $q1,
        );
        return $this->response->setJSON($data);
    }

    function onChangesBook()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->table("journal_access")->update([
                "bookId" => $post['book']['id'],
                "update_date" => date("Y-m-d H:i:s"),
                "update_by" => model("Core")->accountId(),
            ], " id = '" . $post['item']['journal_accessID'] . "' ");

            $data = array(
                "error" => false,
                "post" => $post,
            );

        }
        return $this->response->setJSON($data);
    }

    function access()
    {
        // $accountId = model("Core")->accountId();

        $q1 = "SELECT ja.*, a.name, a.email, concat('" . base_url() . "uploads/picture/',a.picture) as 'picture'
        FROM journal_access AS ja
        JOIN account AS a ON a.id = ja.accountId
        WHERE ja.presence = 1 and ja.journalId = '" . $this->request->getVar()['journalId'] . "'
        ORDER BY  ja.owner DESC, ja.input_date  ASC ";
        $journal_access = $this->db->query($q1)->getResultArray();
        $i = 0;
        foreach ($journal_access as $row) {
            $journal_access[$i]['picture'] = model("Core")->isUrlValid($journal_access[$i]['picture']) ? $journal_access[$i]['picture'] : base_url() . 'uploads/picture/' . $journal_access[$i]['picture'];
            $i++;
        }

        $accountId = model("Core")->accountId();
        $q2 = "SELECT a.id, a.name, concat('" . base_url() . "uploads/picture/',a.picture) as 'picture', a.email, t.accountId
        FROM account_team AS t
        LEFT JOIN account AS a ON a.id = t.invitedId
        WHERE t.presence = 1 and  t.accountId = '$accountId' AND a.id != '$accountId' ";
        $teams = $this->db->query($q2)->getResultArray();

        $i = 0;
        foreach ($teams as $row) {
            $teams[$i]['picture'] = model("Core")->isUrlValid($teams[$i]['picture']) ? $teams[$i]['picture'] : base_url() . 'uploads/picture/' . $teams[$i]['picture'];
            $i++;
        }
        $data = array(
            "error" => false,
            "q1" => $q1,
            "journal_access" => $journal_access,
            "teams" => $teams,

        );
        return $this->response->setJSON($data);
    }

    function onCreateNew()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post && $post['model']['name'] != "") {
            $this->db->transStart();
            $journalId = model("Core")->number("backtest");

            $this->db->table("journal")->insert([
                "id" => $journalId,
                "name" => $post['model']['name'],
                "permissionId" => $post['model']['permissionId'],
                "url" => uniqid(),
                "templateCode" => $post['model']['template'],
                "startBalance" => $post['model']['startBalance'],
                "image" => base_url() . "uploads/share/books.jpg",
                "accountId" => model("Core")->accountId(),
                "presence" => 1,
                "version" => 1,
                "update_date" => date("Y-m-d H:i:s"),
                "update_by" => model("Core")->accountId(),
                "input_date" => date("Y-m-d H:i:s"),
                "input_by" => model("Core")->accountId(),
            ]);

            $this->db->table("journal_table_view")->insert([
                "journalId" => $journalId,
                "board" => 'table',
                "name" => 'Master Table',
                "ilock" => 1,
                "presence" => 1,
                "update_date" => date("Y-m-d H:i:s"),
                "update_by" => model("Core")->accountId(),
                "input_date" => date("Y-m-d H:i:s"),
                "input_by" => model("Core")->accountId(),
            ]);

            $this->db->table("journal_access")->insert([
                "bookId" => $post['id'],
                "accountId" => model("Core")->accountId(),
                "journalId" => $journalId,
                "owner" => 1,
                "changeable" => 1,
                "editable" => 1,
                "admin" => 1,
                "presence" => 1,
                "sorting" => 99,
                "update_date" => date("Y-m-d H:i:s"),
                "update_by" => model("Core")->accountId(),
                "input_date" => date("Y-m-d H:i:s"),
                "input_by" => model("Core")->accountId(),
            ]);

            if ($post['model']['sample'] != 'true') {
                $this->db->table("journal_detail")->insert([
                    "journalId" => $journalId,
                    "presence" => 1,
                    "sorting" => 1,
                    "update_date" => date("Y-m-d H:i:s"),
                    "update_by" => model("Core")->accountId(),
                    "input_date" => date("Y-m-d H:i:s"),
                    "input_by" => model("Core")->accountId(),
                ]);
            }


            if ($post['model']['template'] != "") {
                $path = './template/master/' . $post['model']['template'] . '.json';
                $jsonString = file_get_contents($path);
                $jsonData = json_decode($jsonString, true);
                $i = 0;
                foreach ($jsonData['field'] as $rec) {
                    $i++;
                    $this->db->table("journal_custom_field")->insert([
                        "journalId" => $journalId,
                        "f" => $rec['f'],
                        "name" => $rec['name'],
                        "iType" => $rec['iType'],
                        "ilock" => isset($rec['ilock']) ? $rec['ilock'] : 0,
                        "suffix" => isset($rec['suffix']) ? $rec['suffix'] : "",
                        "width" => 150,
                        "eval" => $rec['iType'] == 'formula' ? $rec['eval'] : "",
                        "sorting" => isset($rec['sorting']) ? $rec['sorting'] : $i,
                        "input_date" => date("Y-m-d H:i:s")
                    ]);
                    if (!empty($rec['journal_select'])) {
                        $n = 0;
                        foreach ($rec['journal_select'] as $a) {
                            $this->db->table("journal_select")->insert([
                                "journalId" => $journalId,
                                "field" => 'f' . $rec['f'],
                                "value" => $a['value'],
                                "color" => $a['color'],
                                "ilock" => isset($a['ilock']) ? $a['ilock'] : 0,
                                "sorting" => $n,
                                "input_date" => date("Y-m-d H:i:s")
                            ]);
                            $n++;
                        }
                    }

                }

                foreach ($jsonData['view'] as $rec) {
                    $this->db->table("journal_table_view")->insert([
                        "journalId" => $journalId,
                        "name" => $rec['name'],
                        "board" => $rec['board'],
                        "share" => $rec['share'],
                        "presence" => 1,
                        "ilock" => 0,
                        "input_date" => date("Y-m-d H:i:s"),
                        "input_by" => model("Core")->accountId(),
                    ]);



                    $q3 = "SELECT * FROM journal_table_view WHERE journalId = '$journalId' and ilock = 0 ";
                    $journal_table_view = $this->db->query($q3)->getResultArray();
                    foreach ($journal_table_view as $row) {
                        $journalTableViewId = $row['id'];

                        if ($rec['board'] == 'table') {

                            $q2 = "SELECT * from journal_custom_field WHERE journalId = '$journalId' ";
                            foreach ($this->db->query($q2)->getResultArray() as $c) {
                                $insert = [
                                    "journalCustomFieldId" => $c['id'],
                                    "journalTableViewId" => $journalTableViewId,
                                    "hide" => 1,
                                    "presence" => 1,
                                ];
                                $this->db->table("journal_table_view_show")->insert($insert);
                            }

                            foreach ($rec['field'] as $a) {
                                $f = $a['f'];
                                $journalCustomFieldId = model("Core")->select("id", "journal_custom_field", "journalId = '$journalId' and f = $f ");

                                $this->db->table("journal_table_view_show")->update([
                                    "hide" => 0,
                                    "presence" => 1,
                                ], " journalCustomFieldId = '$journalCustomFieldId' and journalTableViewId = '$journalTableViewId' ");

                            }
                        } else if ($rec['board'] == 'chart') {
                            $this->db->table("journal_chart_type")->insert([
                                "journalTableViewId" => $journalTableViewId,
                                "chartjsTypeId" => $rec['chart_type_id'],
                                "presence" => 1,
                                "input_date" => date("Y-m-d H:i:s"),
                                "input_by" => model("Core")->accountId(),
                            ]);
                            $this->db->table("journal_chart_xaxis")->insert([
                                "journalTableViewId" => $journalTableViewId,
                                "value" => $rec['chart_xasis'],
                                "presence" => 1,
                                "input_date" => date("Y-m-d H:i:s"),
                                "input_by" => model("Core")->accountId(),
                            ]);

                            foreach ($rec['chart_yaxis'] as $y) {
                                $this->db->table("journal_chart_yaxis")->insert([
                                    "journalTableViewId" => $journalTableViewId,
                                    "value" => $y['value'],
                                    "accumulation" => $y['accumulation'],
                                    "fill" => $y['fill'],
                                    "presence" => 1,
                                    "input_date" => date("Y-m-d H:i:s"),
                                    "input_by" => model("Core")->accountId(),
                                ]);
                            }

                        }
                    }

                }

            }


            if ($post['model']['sample'] == 'true') {
                model("Dummy")->faker($journalId);
            }


            $this->db->transComplete();
            if ($this->db->transStatus() === false) {
                $this->db->transRollback();
            } else {
                $this->db->transCommit();
            }

            $data = array(
                //  "error" => false,
                "transStatus" => $this->db->transStatus(),
            );

        }
        return $this->response->setJSON($data);
    }

    function fnEditableChange()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post && $post['book']['name'] != "") {

            $this->db->table("book")->update([
                "name" => $post['book']['name'],
                "update_date" => date("Y-m-d H:i:s"),
                "update_by" => model("Core")->accountId(),
            ], " id = '" . $post['book']['id'] . "' AND ilock = 0 AND accountId = '" . model("Core")->accountId() . "' ");

            $data = array(
                "error" => false,
            );

        }
        return $this->response->setJSON($data);
    }

    function onUpdatePermission()
    {

        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {

            $data = [
                "error" => false,
                "post" => $post,
            ];
            $this->db->table("journal")->update([
                "permissionId" => $post['permission']['id'],
                "update_by" => model("Core")->accountId(),
                "update_date" => date("Y-m-d H:i:s"),
            ], "id = '" . $post['item']['id'] . "' ");
        }

        return $this->response->setJSON($data);
    }

    function fnDeleteAll()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $data = [
                "error" => false,
                "post" => $post,
            ];
            foreach ($post['items'] as $row) {
                if ($row['checkbox'] === true) {
                    if ($row['owner'] == 1) {
                        $this->db->table("journal")->update([
                            "presence" => 0,
                            "update_date" => date("Y-m-d H:i:s"),
                            "update_by" => model("Core")->accountId(),
                        ], "id = '" . $row['id'] . "' ");

                        $this->db->table("journal_detail")->update([
                            "presence" => 0,
                            "update_date" => date("Y-m-d H:i:s"),
                            "update_by" => model("Core")->accountId(),
                        ], "journalId = '" . $row['id'] . "' ");
                        //journal_detail_images
                        //journal_custom_field
                        $this->db->table("journal_access")->update([
                            "presence" => 4,
                            "update_date" => date("Y-m-d H:i:s"),
                            "update_by" => model("Core")->accountId(),
                        ], "journalId = '" . $row['id'] . "' ");

                    } else {
                        $this->db->table("journal_access")->update([
                            "bookId" => "",
                            "update_date" => date("Y-m-d H:i:s"),
                            "update_by" => model("Core")->accountId(),
                        ], "journalId = '" . $row['id'] . "' and accountId = '" . model("Core")->accountId() . "' ");
                    }
                }
            }
        }

        return $this->response->setJSON($data);
    }

    function onSubmitUser()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $journalId = $post['item']['id'];
            $addUserId = model("Core")->select("id", "account", "id = '" . $post['addUser']['id'] . "' and presence = 1 ");
            $account_team = model("Core")->select("id", "account_team", "invitedId = '" . $post['addUser']['id'] . "' and presence = 1 ");

            $avaiable = $addUserId ? true : false;
            $duplicate = false;
            $journal_access = [];
            $note = "";
            $addUser = model("Core")->select("name", "account", "id = '$addUserId' ");
            if ($avaiable == true) {
                $id = model("Core")->select("id", "journal_access", "accountId = '" . $addUserId . "' and journalId = '" . $journalId . "'  ");

                if ($id == '') {
                    $this->db->table("journal_access")->insert([
                        "accountId" => $addUserId,
                        "journalId" => $post['item']['id'],
                        "owner" => 0,
                        "editable" => 1,
                        "changeable" => 0,
                        "presence" => 1,
                        "input_date" => date("Y-m-d H:i:s"),
                        "input_by" => model("Core")->accountId(),
                        "update_date" => date("Y-m-d H:i:s"),
                        "update_by" => model("Core")->accountId(),
                    ]);
                } else {
                    $this->db->table("journal_access")->update([
                        "presence" => 1,
                        "input_date" => date("Y-m-d H:i:s"),
                        "input_by" => model("Core")->accountId(),
                        "update_date" => date("Y-m-d H:i:s"),
                        "update_by" => model("Core")->accountId(),
                    ], " id  = '$id' ");
                    $note = $addUser . " Add has joined the team";
                }


            } else {
                $note = "The email you entered has not been registered,<br> please invite via the link below ";

            }

            $q1 = "SELECT ja.*, a.name, a.email, concat('" . base_url() . "uploads/picture/',a.picture) as 'picture'
            FROM journal_access AS ja
            JOIN account AS a ON a.id = ja.accountId
            WHERE ja.presence = 1 and ja.journalId = '" . $post['item']['id'] . "'
            ORDER BY  ja.owner DESC, ja.input_date  ASC ";


            $journal_access = $this->db->query($q1)->getResultArray();

            $data = [
                "error" => false,
                "journal_access" => $journal_access,
                "note" => $note,
                "q" => $q1,
            ];

        }

        return $this->response->setJSON($data);
    }

    function onRemoveAccess()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->table("journal_access")->update([
                "presence" => 0,
                "update_date" => date("Y-m-d H:i:s"),
                "update_by" => model("Core")->accountId(),
            ], "id = '" . $post['access']['id'] . "' and accountId = '" . $post['access']['accountId'] . "' ");

            $q1 = "SELECT ja.*, a.name, a.email, concat('" . base_url() . "uploads/picture/',a.picture) as 'picture'
            FROM journal_access AS ja
            JOIN account AS a ON a.id = ja.accountId
            WHERE ja.presence = 1 and ja.journalId = '" . $post['item']['id'] . "'
            ORDER BY  ja.owner DESC, ja.input_date  ASC ";
            $journal_access = $this->db->query($q1)->getResultArray();
            $data = [
                "error" => false,
                "post" => $post,
                "journal_access" => $journal_access,
            ];

        }

        return $this->response->setJSON($data);
    }

    function fnClearTrashBin()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $data = [
                "error" => false,
                "post" => $post,
            ];
            $this->db->table("journal_access")->update([
                "presence" => 0,
                "update_date" => date("Y-m-d H:i:s"),
                "update_by" => model("Core")->accountId(),
            ], "presence  = 4 AND accountId =  '" . model("Core")->accountId() . "' ");

        }

        return $this->response->setJSON($data);
    }

    function sorting()
    {
        $post = $this->request->getVar();

        $i = 1;
        foreach ($post as $row) {
            $this->db->table("journal_access")->update([
                "sorting" => $i,
                "update_date" => date("Y-m-d H:i:s"),
                "update_by" => model("Core")->accountId(),
            ], " journalId = '$row' AND accountId =  '" . model("Core")->accountId() . "' ");
            $i++;
        }
        $data = [
            "error" => false,
            "post" => $post,
        ];

        return $this->response->setJSON($data);
    }

    function updateStar()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->table("journal_access")->update([
                "star" => $post['journal']['star'],
                "update_date" => date("Y-m-d H:i:s"),
                "update_by" => model("Core")->accountId(),
            ], " id = '" . $post['journal']['journal_accessID'] . "'");

            $data = [
                "error" => false,
                "post" => $post,
            ];
        }

        return $this->response->setJSON($data);
    }

    function jsonfile()
    {
        $path = './template/master/backtest.json';
        $jsonString = file_get_contents($path);
        $jsonData = json_decode($jsonString, true);
        return $this->response->setJSON($jsonData);
    }

    function updatePhoto()
    {
        $json = file_get_contents('php://input');
        $post = json_decode($json, true);
        $data = [
            "error" => true,
            "post" => $post,
        ];
        if ($post) {
            $this->db->table("journal")->update([
                "image" => $post['image'],
                "update_date" => date("Y-m-d H:i:s"),
                "update_by" => model("Core")->accountId(),
            ], " id = '" . $post['id'] . "'");

            $data = [
                "error" => false,
                "post" => $post,
            ];
        }

        return $this->response->setJSON($data);
    }
}