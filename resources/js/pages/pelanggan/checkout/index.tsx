import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
console.log('Imported RadioGroup:', RadioGroup, 'Imported RadioGroupItem:', RadioGroupItem);
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define types
interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
}

interface Auth {
    user: User | null;
}

interface PageProps {
    auth: Auth;
    [key: string]: any;
}

interface ProductImage {
    path: string;
    url: string;
}

interface Product {
    produk_id: number;
    nama_produk: string;
    harga: number;
    stok: number;
    gambar: ProductImage[];
}

interface CartItem {
    id_keranjang: number;
    jumlah: number;
    subtotal: number;
    harga_satuan: number;
    produk: Product;
}

interface CartData {
    data: CartItem[];
    total: number;
}

interface CheckoutPageProps extends PageProps {
    keranjang: CartData;
}

const Checkout: React.FC<CheckoutPageProps> = ({ keranjang, auth }) => {
    // Provide safe defaults if keranjang is undefined
    const safeKeranjang: CartData = keranjang ?? { data: [], total: 0 };

    const { data, setData, post, processing } = useForm({
        nama_penerima: auth.user?.name || '',
        no_telepon: '',
        provinsi_id: '',
        kota_id: '',
        alamat_lengkap: '',
        kode_pos: '',
        catatan: '',
        metode_pembayaran: 'cod',
    });

    const [cities, setCities] = useState<Array<{id: string; name: string}>>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('checkout.store'), {
            onSuccess: () => {
                toast.success('Pesanan berhasil dibuat');
                router.visit('/pesanan-saya');
            },
            onError: (errors) => {
                Object.values(errors).forEach(error => {
                    toast.error(error);
                });
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Checkout" />
            
            <div className="container py-8">
                <h1 className="text-2xl font-bold mb-6">Checkout</h1>
                
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Pemesanan */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Alamat Pengiriman</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="nama_penerima">Nama Penerima</Label>
                                        <Input
                                            id="nama_penerima"
                                            value={data.nama_penerima}
                                            onChange={e => setData('nama_penerima', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="no_telepon">No. Telepon</Label>
                                        <Input
                                            id="no_telepon"
                                            type="tel"
                                            value={data.no_telepon}
                                            onChange={e => setData('no_telepon', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Provinsi</Label>
                                            <Select
                                                value={data.provinsi_id}
                                                onValueChange={value => setData('provinsi_id', value)}
                                                disabled={isLoading}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Provinsi" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="jabar">Jawa Barat</SelectItem>
                                                    <SelectItem value="jatim">Jawa Timur</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>Kota/Kabupaten</Label>
                                            <Select
                                                value={data.kota_id}
                                                onValueChange={value => setData('kota_id', value)}
                                                disabled={!data.provinsi_id || isLoading}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Kota/Kabupaten" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {cities.map(city => (
                                                        <SelectItem key={city.id} value={city.id}>
                                                            {city.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="alamat_lengkap">Alamat Lengkap</Label>
                                        <textarea
                                            id="alamat_lengkap"
                                            className="w-full p-2 border rounded-md mt-1 min-h-[100px]"
                                            value={data.alamat_lengkap}
                                            onChange={e => setData('alamat_lengkap', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="kode_pos">Kode Pos</Label>
                                            <Input
                                                id="kode_pos"
                                                value={data.kode_pos}
                                                onChange={e => setData('kode_pos', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="catatan">Catatan (Opsional)</Label>
                                        <Input
                                            id="catatan"
                                            value={data.catatan}
                                            onChange={e => setData('catatan', e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Metode Pembayaran</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup 
                                        value={data.metode_pembayaran} 
                                        onValueChange={(value: string) => setData('metode_pembayaran', value)}
                                        className="space-y-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="cod" id="cod" />
                                            <Label htmlFor="cod">Bayar di Tempat (COD)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="transfer" id="transfer" />
                                            <Label htmlFor="transfer">Transfer Bank</Label>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Ringkasan Pesanan */}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ringkasan Pesanan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {safeKeranjang.data.map((item) => (
                                            <div key={item.id_keranjang} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    {item.produk.gambar[0]?.url ? (
                                                        <img 
                                                            src={item.produk.gambar[0].url} 
                                                            alt={item.produk.nama_produk}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gray-200 rounded"></div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{item.produk.nama_produk}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {item.jumlah} x Rp {item.harga_satuan.toLocaleString('id-ID')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="font-medium">
                                                    Rp {item.subtotal.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 space-y-2 border-t pt-4">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span>Rp {safeKeranjang.total.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Ongkos Kirim</span>
                                            <span>Rp 0</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                            <span>Total</span>
                                            <span>Rp {safeKeranjang.total.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button 
                                        type="submit"
                                        className="w-full" 
                                        size="lg"
                                        disabled={processing || isLoading}
                                    >
                                        {processing || isLoading ? 'Memproses...' : 'Buat Pesanan'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

export default Checkout;
