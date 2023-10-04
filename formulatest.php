<?php 
// String tanggal dan waktu pertama
$f2 = "2023-09-23" ;
// String tanggal dan waktu kedua
$f9 = "2023-09-26" ;

// Mengonversi string ke Unix Timestamp
 
// Menghitung selisih antara dua Unix Timestamp dalam jam
$selisihJam = ((strtotime($f9) - strtotime($f2)) / (60 * 60));
echo strtotime("2023-10-6").' 1696191780';
// Output selisih dalam jam
echo "<br>Selisih antara tanggal 1 dan tanggal 2 adalah: $selisihJam jam";

echo "<br>";
echo (int)$f2;


// Data JSON
$data = [1,2,3,4,5,6,'a',8,9,0,32,3,24,1,2,3,2];

// Loop untuk memproses data
foreach ($data as $record) {
    try {
        // Proses data di sini
        // Misalnya, Anda ingin menyimpan data ke database

        // Jika terjadi kesalahan pada rekaman ini, throw exception
        if ((int)$record!= $record) {
             echo " RROR ";
        }else{
            echo $record;
        }

        // Lanjutkan pemrosesan data lainnya
    } catch (Exception $e) {
        // Tangani kesalahan di sini, misalnya, log pesan kesalahan
        error_log($e->getMessage());

        // Lanjutkan pemrosesan dengan rekaman berikutnya
        continue;
    }
}