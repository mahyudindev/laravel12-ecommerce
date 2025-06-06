import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Loader2, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatRupiah } from '@/lib/utils';

interface PageProps {
    keranjang: any[];
    total: number;
    [key: string]: any;
}

interface CartItem {
    id_keranjang: number;
    produk: {
        id: number;
        nama_produk: string;
        harga: number;
        stok: number;
        gambar: Array<{
            path: string;
            url: string;
        }>;
    };
    jumlah: number;
    subtotal: number;
}

interface CartPageProps extends PageProps {
    keranjang: CartItem[];
    total: number;
}

export default function Keranjang({ keranjang: initialCart, total: initialTotal }: CartPageProps) {
    const [items, setItems] = useState<CartItem[]>(initialCart || []);
    const [total, setTotal] = useState<number>(initialTotal || 0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const loadCart = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(route('pelanggan.keranjang.index'));
            const data = await response.json();
            setItems(data.keranjang || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error('Error loading cart:', error);
            toast.error('Gagal memuat keranjang');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const updateQuantity = async (id: number, change: number) => {
        try {
            const item = items.find(i => i.id_keranjang === id);
            if (!item) return;

            const newQuantity = item.jumlah + change;
            if (newQuantity < 1) return;

            // Validasi stok
            if (newQuantity > item.produk.stok) {
                toast.error(`Stok tersisa: ${item.produk.stok}`);
                return;
            }

            await router.put(route('pelanggan.keranjang.update', id), {
                jumlah: newQuantity,
                _method: 'put'
            }, {
                onSuccess: () => {
                    loadCart();
                    toast.success('Keranjang berhasil diperbarui');
                },
                onError: (errors) => {
                    if (errors.stok) {
                        toast.error(errors.stok);
                    } else {
                        toast.error('Gagal memperbarui keranjang');
                    }
                },
                preserveScroll: true
            });
        } catch (error) {
            console.error('Error updating cart:', error);
            toast.error('Terjadi kesalahan saat memperbarui keranjang');
        }
    };

    const removeItem = async (id: number) => {
        if (!confirm('Hapus item dari keranjang?')) return;
        
        try {
            await router.delete(route('pelanggan.keranjang.destroy', id), {
                onSuccess: () => {
                    loadCart();
                    toast.success('Item berhasil dihapus dari keranjang');
                },
                onError: () => {
                    toast.error('Gagal menghapus item dari keranjang');
                },
                preserveScroll: true
            });
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Terjadi kesalahan saat menghapus item');
        }
    };

    const handleCheckout = () => {
        // Arahkan ke halaman checkout
        router.visit(route('pelanggan.checkout.index'));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Head title="Keranjang Belanja" />
            
            <div className="container mx-auto px-4">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 mb-4"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Button>
                    <h1 className="text-2xl font-bold">Keranjang Belanja</h1>
                </div>

                {items.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                            <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">Keranjang belanja kosong</h3>
                            <p className="mt-1 text-sm text-gray-500">Tambahkan beberapa produk ke keranjang Anda</p>
                            <Button className="mt-6" onClick={() => router.visit(route('pelanggan.dashboard'))}>
                                Lihat Produk
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <Card key={item.id_keranjang}>
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            <div className="w-24 h-24 flex-shrink-0">
                                                <img
                                                    src={item.produk.gambar?.[0]?.path 
                                                        ? `/storage/${item.produk.gambar[0].path}` 
                                                        : '/images/placeholder-product.png'}
                                                    alt={item.produk.nama_produk}
                                                    className="w-full h-full object-cover rounded"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/images/placeholder-product.png';
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium">{item.produk.nama_produk}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {formatRupiah(item.produk.harga)} x {item.jumlah}
                                                </p>
                                                
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => updateQuantity(item.id_keranjang, -1)}
                                                        disabled={item.jumlah <= 1}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-8 text-center">
                                                        {item.jumlah}
                                                    </span>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => updateQuantity(item.id_keranjang, 1)}
                                                        disabled={item.jumlah >= item.produk.stok}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Stok: {item.produk.stok}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="font-medium">
                                                    {formatRupiah(item.subtotal)}
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="text-red-500 hover:text-red-700 mt-2"
                                                    onClick={() => removeItem(item.id_keranjang)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Hapus
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <Card className="sticky top-4">
                                <CardHeader>
                                    <CardTitle>Ringkasan Belanja</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>Total Harga ({items.length} {items.length > 1 ? 'produk' : 'produk'})</span>
                                        <span className="font-medium">{formatRupiah(total)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>{formatRupiah(total)}</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button 
                                        className="w-full" 
                                        size="lg"
                                        onClick={handleCheckout}
                                        disabled={items.length === 0}
                                    >
                                        Lanjut ke Pembayaran
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
