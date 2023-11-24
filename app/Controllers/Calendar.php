<?php

namespace App\Controllers;

use CodeIgniter\Model;

class Calendar extends BaseController
{
    public function index()
    {
        $journalId = $this->request->getVar("journalId");

        $q1 = "SELECT date_format( f1,'%m') AS 'month',
        date_format( f1,'%Y') AS 'year',
        date_format( f1,'%Y-%m-%d') AS 'startDate'
        FROM journal_detail 
        WHERE presence = 1 AND journalId = '$journalId' AND f1 != '' and archives = 0
        ORDER BY date_format( f1,'%Y-%m-%d') ASC LIMIT 1";
        $start = $this->db->query($q1)->getResultArray()[0];

        $startMonth = $start['month']; // Januari
        $startYear = $start['year'];

        $q1 = "SELECT date_format( f1,'%m') AS 'month',
        date_format( f1,'%Y') AS 'year',
        date_format( f1,'%Y-%m-%d') AS 'startDate'
        FROM journal_detail 
        WHERE presence = 1 AND journalId = '$journalId' AND f1 != '' and archives = 0
        ORDER BY date_format( f1,'%Y-%m-%d') DESC LIMIT 1";
        $end = $this->db->query($q1)->getResultArray()[0];


        $endMonth =  $end['month']; // Desember
        $endYear = $end['year']; // Desember

        $weeklyTimeline = self::generateWeeklyTimeline($startMonth, $startYear, $endMonth, $endYear,$journalId);

        $output = array('data' => $weeklyTimeline);
 

        $data = array(
            "error" => false,
            "timeline" => $output
        );
        return $this->response->setJSON($data);
    }

    function generateWeeklyTimeline($startMonth, $startYear, $endMonth, $endYear,$journalId)
    {
        $timeline = array();

        $currentMonth = $startMonth;
        $currentYear = $startYear;

        while ($currentYear < $endYear || ($currentYear == $endYear && $currentMonth <= $endMonth)) {
            $monthName = date('M Y', mktime(0, 0, 0, $currentMonth, 1, $currentYear));
            $weeklyData = array();

            $firstDay = strtotime("first day of $monthName");
            $lastDay = strtotime("last day of $monthName");

            if (date('D', $firstDay) == 'Mon') { 
                $dateTemp = ['Sun']; 
                foreach ($dateTemp as $row) { 
                    $weeklyData[] = array(
                        'day' => $row,
                        'date' => '',
                        'yyyymmdd' => '',
                        'data' => "",
                    );
                }  
            }

            if (date('D', $firstDay) == 'Tue') { 
                $dateTemp = ['Sun', 'Mon']; 
                foreach ($dateTemp as $row) { 
                    $weeklyData[] = array(
                        'day' => $row,
                        'date' => '',
                        'yyyymmdd' => '',
                        'data' => "",
                    );
                }  
            }

            if (date('D', $firstDay) == 'Wed') { 
                $dateTemp = ['Sun', 'Mon', 'Tue']; 
                foreach ($dateTemp as $row) { 
                    $weeklyData[] = array(
                        'day' => $row,
                        'date' => '',
                        'yyyymmdd' => '',
                        'data' => "",
                    );
                }  
            }

            if (date('D', $firstDay) == 'Thu') { 
                $dateTemp = ['Sun', 'Mon', 'Tue', 'Wed']; 
                foreach ($dateTemp as $row) { 
                    $weeklyData[] = array(
                        'day' => $row,
                        'date' => '',
                        'yyyymmdd' => '',
                        'data' => "",
                    );
                }  
            }

            if (date('D', $firstDay) == 'Fri') {

                $dateTemp = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu']; 
                foreach ($dateTemp as $row) { 
                    $weeklyData[] = array(
                        'day' => $row,
                        'date' => '',
                        'yyyymmdd' => '',
                        'data' => "",
                    );
                }  
            }

            if (date('D', $firstDay) == 'Sat') {

                $dateTemp = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu','Fri']; 
                foreach ($dateTemp as $row) { 
                    $weeklyData[] = array(
                        'day' => $row,
                        'date' => '',
                        'yyyymmdd' => '',
                        'data' => "",
                    );
                } 

            }

            $profit = 0;
            while ($firstDay <= $lastDay) {
                $dayOfWeek = date('D', $firstDay);
                $dayOfMonth = date('d', $firstDay);
                $strTime = $currentYear . "-" . str_pad($currentMonth, 2, "0", STR_PAD_LEFT) . '-' . $dayOfMonth;

                $subProfit = model("Core")->select("sum(f6)","journal_detail","journalId = '$journalId' and f1 = '$strTime' and presence = 1 and archives = 0 ");
                $weeklyData[] = array(
                    'day' => $dayOfWeek,
                    'date' => $dayOfMonth,
                    'strtime' => $strTime,
                    'data' => array(
                        "profit" =>   $subProfit,
                    ),
                );
                $profit +=  $subProfit;

                $firstDay = strtotime('+1 day', $firstDay);
            }

            if (date('D', $firstDay) == 'Wed') {   
                for($i =0 ; $i< 6; $i++) { 
                    $weeklyData[] = array(
                        'day' => $i,
                        'date' => '-',
                        'yyyymmdd' => '',
                        'data' => "",
                    );
                }  
            }

            if (date('D', $firstDay) == 'Thu') {   
                for($i =0 ; $i< 5; $i++) { 
                    $weeklyData[] = array(
                        'day' => $i,
                        'date' => '-',
                        'yyyymmdd' => '',
                        'data' => "",
                    );
                }  
            }

            if (date('D', $firstDay) == 'Fri') {   
                for($i =0 ; $i< 4; $i++) { 
                    $weeklyData[] = array(
                        'day' => $i,
                        'date' => '-',
                        'yyyymmdd' => '',
                        'data' => "",
                    );
                }  
            }

            if (date('D', $firstDay) == 'Sat') {   
                for($i =0 ; $i< 3; $i++) { 
                    $weeklyData[] = array(
                        'day' => $i,
                        'date' => '-',
                        'yyyymmdd' => '',
                        'data' => "",
                    );
                }  
            }

            if (date('D', $firstDay) == 'Sun') {   
                for($i =0 ; $i< 2; $i++) { 
                    $weeklyData[] = array(
                        'day' => $i,
                        'date' => '-',
                        'yyyymmdd' => '',
                        'data' => "",
                    );
                }  
            }

            
            if (date('D', $firstDay) == 'Mon') {   
                
                    $weeklyData[] = array(
                        'day' => 1,
                        'date' => '-',
                        'yyyymmdd' => '',
                        'data' => "",
                    );
                
            }


            $timeline[] = array(
                'date' => $monthName,
                'weekly' => $weeklyData,
                "data" => array(
                    "profit"=>    $profit,
                ),
            );

            

            // Move to the next month
            if ($currentMonth == 12) {
                $currentMonth = 1;
                $currentYear++;
            } else {
                $currentMonth++;
            }
        }

        return $timeline;
    }

}