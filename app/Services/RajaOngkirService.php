<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RajaOngkirService
{
    protected $apiKey;
    protected $baseUrl;
    protected $timeout;

    public function __construct()
    {
        $this->apiKey = config('services.rajaongkir.key');
        $this->baseUrl = config('services.rajaongkir.base_url');
        $this->timeout = config('services.rajaongkir.timeout', 30);
    }

    /**
     * Mengambil daftar provinsi
     */
    public function getProvinces()
    {
        return $this->makeRequest('/province');
    }

    /**
     * Mengambil daftar kota berdasarkan ID provinsi
     */
    public function getCities($provinceId = null)
    {
        $params = [];
        if ($provinceId) {
            $params['province'] = $provinceId;
        }
        return $this->makeRequest('/city', $params);
    }

    /**
     * Mengambil data kecamatan berdasarkan ID kota
     */
    public function getSubdistricts($cityId)
    {
        return $this->makeRequest('/subdistrict', ['city' => $cityId]);
    }

    /**
     * Menghitung ongkos kirim
     */
    public function getShippingCost($origin, $destination, $weight, $courier)
    {
        $data = [
            'origin' => $origin, // ID kota/kecamatan asal
            'originType' => 'city', // 'city' atau 'subdistrict'
            'destination' => $destination, // ID kota/kecamatan tujuan
            'destinationType' => 'subdistrict', // 'city' atau 'subdistrict'
            'weight' => $weight, // dalam gram
            'courier' => $courier, // jne, pos, tiki, dll
        ];

        return $this->makeRequest('/cost', $data, 'POST');
    }

    /**
     * Melacak pengiriman
     */
    public function trackShipment($waybill, $courier)
    {
        return $this->makeRequest('/waybill', [
            'waybill' => $waybill,
            'courier' => $courier,
        ], 'POST');
    }

    /**
     * Eksekusi request ke API RajaOngkir
     */
    protected function makeRequest($endpoint, $params = [], $method = 'GET')
    {
        try {
            $url = rtrim($this->baseUrl, '/') . $endpoint;
            $headers = [
                'key' => $this->apiKey,
                'content-type' => 'application/x-www-form-urlencoded',
            ];

            $options = [
                'headers' => $headers,
                'timeout' => $this->timeout,
            ];

            if (strtoupper($method) === 'GET') {
                $response = Http::withHeaders($headers)
                    ->timeout($this->timeout)
                    ->get($url, $params);
            } else {
                $response = Http::withHeaders($headers)
                    ->timeout($this->timeout)
                    ->asForm()
                    ->post($url, $params);
            }

            $result = $response->json();

            if (!isset($result['rajaongkir'])) {
                throw new \Exception('Invalid response from RajaOngkir API');
            }

            if (isset($result['rajaongkir']['status']['code']) && $result['rajaongkir']['status']['code'] !== 200) {
                throw new \Exception($result['rajaongkir']['status']['description']);
            }

            return $result['rajaongkir']['results'] ?? [];

        } catch (\Exception $e) {
            Log::error('RajaOngkir API Error: ' . $e->getMessage(), [
                'endpoint' => $endpoint,
                'params' => $params,
                'method' => $method,
            ]);

            // Return response error yang konsisten
            return [
                'error' => true,
                'message' => 'Gagal terhubung ke layanan pengiriman. Silakan coba lagi nanti.',
                'debug' => config('app.debug') ? $e->getMessage() : null,
            ];
        }
    }
}
