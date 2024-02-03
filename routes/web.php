<?php

use App\Http\Controllers\MapsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('geojson/kabupaten/{id_kabupaten}/kecamatan', [MapsController::class, 'getDataGeoKecamatan']);
Route::get('geojson/kabupaten', [MapsController::class, 'getDataGeoKabupaten']);
Route::get('geojson/kabupaten/{id_kab}/kecamatan/{id_kec}/kelurahan', [MapsController::class, 'getDataGeoKelurahan']);

Route::get('/map', function(){
    return view('map.map');
});

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
