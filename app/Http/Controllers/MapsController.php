<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;

class MapsController extends Controller
{
    public function getDataGeoKecamatan($id_kabupaten)
    {

        $data = DB::table('kecamatan')->where('id_kab', $id_kabupaten);

        $data_with_suspect = [];

        foreach ($data->get() as $geo) {
            $data_with_suspect[$geo->id_kec] = [
                'id_kab' => $geo->id_kab,
                'id_kec' => $geo->id_kec,
                'kecamatan' => $geo->kecamatan,
                'poly_type' => $geo->poly_type,
                'geometry' => $geo->geometry
            ];
        }

        $rows = $data->count();
        $geojson = [];

        foreach($data_with_suspect as $key => $item){

            $color = "#f6f6f6";

            $geojson[] = [
                "type" => "Feature",
                "properties" => [
                    "id_kab" => $item['id_kab'],
                    "id_kec" => $item['id_kec'],
                    "kecamatan" => $item['kecamatan'],
                    'infopeta' => "none", // Kabupaten::getNamaKabupaten($item['id_kab'])
                    "color" => $color,
                ],
                "geometry" => [
                    "type" => $item['poly_type'],
                    "coordinates" => json_decode($item['geometry'])
                ]
            ];
        }

        $result = [
            "type" => "FeatureCollection",
            "features" => $geojson
        ];

        return response()->json($result);
    }
    public function getDataGeoKabupaten(){

        $data = DB::table('kabupaten');

        $data_with_suspect = [];
        foreach ($data->get() as $geo) {

            $data_with_suspect[$geo->id_kab] = [
                'id_kab' => $geo->id_kab,
                'tipe' => $geo->tipe,
                'kabupaten' => $geo->kabupaten,
                'poly_type' => $geo->poly_type,
                'geometry' => $geo->geometry
            ];
        }

        $rows = $data->count();
        $geojson = [];

        foreach($data_with_suspect as $key => $item){
            $color = "#f6f6f6";

            $geojson[] = [
                "type" => "Feature",
                "properties" => [
                    "id_kab" => $item['id_kab'],
                    "tipe" => $item['tipe'],
                    "kabupaten" => $item['kabupaten'],
                    "color" => $color,
                ],
                "geometry" => [
                    "type" => $item['poly_type'],
                    "coordinates" => json_decode($item['geometry'])
                ]
            ];
        }

        $result = [
            "type" => "FeatureCollection",
            "features" => $geojson
        ];

        return response()->json($result);
    }

    public function getDataGeoKelurahan($id_kab, $id_kec){
  
        $data = DB::table('kelurahan')
                    ->where('id_kab', $id_kab)
                    ->where('id_kec', $id_kec);
                    $data_with_suspect = [];
        foreach ($data->get() as $geo) {
            $data_with_suspect[$geo->id_desa] = [
                'id_kab' => $geo->id_kab,
                'id_kec' => $geo->id_kec,
                'id_kel' => $geo->id_desa,
                'kecamatan' => $geo->kecamatan,
                'kelurahan' => $geo->desa,
                'poly_type' => $geo->poly_type,
                'geometry' => $geo->geometry
            ];

        }

        $rows = $data->count();
        $geojson = [];

        foreach($data_with_suspect as $key => $item){
            $color = "#f6f6f6";
            $geojson[] = [
                "type" => "Feature",
                "properties" => [
                    "id_kab" => $item['id_kab'],
                    "id_kec" => $item['id_kec'],
                    "kelurahan" => $item['kelurahan'],
                    "color" => $color,
                    'infopeta' => 'ok', // Kabupaten::getNamaKabupaten($item['id_kab']) . ' > Kecamatan ' . Kecamatan::getNamaKecamatan($item['id_kec'])
                ],
                "geometry" => [
                    "type" => $item['poly_type'],
                    "coordinates" => json_decode($item['geometry'])
                ]
            ];
        }

        $result = [
            "type" => "FeatureCollection",
            "features" => $geojson
        ];

        return response()->json($result);
    }
}
