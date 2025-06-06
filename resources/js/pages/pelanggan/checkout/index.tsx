import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';

type CartItem = {
    id_keranjang: number;
    jumlah: number;
    subtotal: number;
    harga_satuan: number;
    produk: {
        produk_id: number;
        nama_produk: string;
        harga: number;
        stok: number;
        gambar: Array<{
            path: string;
            url: string;
        }>;
    };
};

type CheckoutPageProps = {
    keranjang: {
        data: CartItem[];
        total: number;
    };
};

export default function Checkout({ keranjang }: CheckoutPageProps) {
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [shippingAddress, setShippingAddress] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle checkout submission
        alert('Checkout berhasil!');
    };

    return (
        <AppLayout>
            <Head title="Checkout" />
            
            <div className="container py-8">
                <h1 className="text-2xl font-bold mb-6">Checkout</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Pemesanan */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Alamat Pengiriman</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Nama Penerima</Label>
                                        <Input id="name" className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">No. Telepon</Label>
                                        <Input id="phone" className="mt-1" />
                                    </div>
                                    <div>
                                        <Label htmlFor="address">Alamat Lengkap</Label>
                                        <textarea
                                            id="address"
                                            className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                                            value={shippingAddress}
                                            onChange={(e) => setShippingAddress(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Metode Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup 
                                    value={paymentMethod} 
                                    onValueChange={setPaymentMethod}
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
                                    {keranjang.data.map((item) => (
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
                                        <span>Rp {keranjang.total.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Ongkos Kirim</span>
                                        <span>Rp 0</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                        <span>Total</span>
                                        <span>Rp {keranjang.total.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    className="w-full" 
                                    size="lg"
                                    onClick={handleSubmit}
                                >
                                    Bayar Sekarang
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
