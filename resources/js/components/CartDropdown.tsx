import { Link, router, usePage } from '@inertiajs/react';
import { ShoppingCart, X, Loader2, Plus, Minus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import type { Produk, ProdukGambar } from '@/types';

// Extend ProdukGambar to include path
interface ExtendedProdukGambar extends ProdukGambar {
    path: string;
    url: string;
}

interface CartItem {
    id_keranjang: number;
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
    jumlah: number;
    subtotal: number;
    harga_satuan: number;
}

interface PageProps extends InertiaPageProps {
    keranjang?: {
        data: CartItem[];
        total: number;
    };
}

interface CartDropdownProps {
    keranjang?: {
        data: Array<{
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
        }>;
        total: number;
    };
}

export default function CartDropdown({ keranjang: propKeranjang }: CartDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const pageKeranjang = usePage<PageProps>().props.keranjang;
    const keranjang = propKeranjang || pageKeranjang;
    
    // Inisialisasi items dan total dari props Inertia
    const [items, setItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Update items dan total ketika keranjang berubah
    useEffect(() => {
        if (keranjang?.data) {
            setItems(keranjang.data);
            setTotal(keranjang.data.length);
        } else {
            setItems([]);
            setTotal(0);
        }
        setIsLoading(false);
    }, [keranjang]);

    // Fungsi untuk memuat ulang data keranjang
    const reloadCart = async () => {
        try {
            setIsLoading(true);
            await router.reload({
                only: ['keranjang']
            });
        } catch (error) {
            console.error('Error reloading cart:', error);
            toast.error('Gagal memuat keranjang');
        } finally {
            setIsLoading(false);
            setIsUpdating(false);
        }
    };

    // Handle flash messages
    useEffect(() => {
        const flash = (window as any).flash;
        if (flash) {
            if (flash.message) {
                toast.success(flash.message);
            }
            if (flash.error) {
                toast.error(flash.error);
            }
        }
    }, []);

    // Inisialisasi data keranjang saat pertama kali mount
    useEffect(() => {
        if (keranjang?.data) {
            setItems(keranjang.data);
            setTotal(keranjang.data.length);
        } else {
            // Jika tidak ada data, coba muat dari server
            reloadCart();
        }
    }, []);
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isOpen && !target.closest('.cart-dropdown')) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

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

            setIsUpdating(true);
            
            await router.put(route('keranjang.update', id), {
                jumlah: newQuantity
            });
            
            toast.success('Jumlah produk berhasil diperbarui');
            await reloadCart();
        } catch (error: any) {
            console.error('Error updating cart:', error);
            toast.error(error?.response?.data?.message || 'Terjadi kesalahan saat memperbarui keranjang');
        }
    };

    const removeFromCart = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini dari keranjang?')) {
            return;
        }

        try {
            setIsUpdating(true);
            
            await router.delete(route('keranjang.destroy', id));
            
            toast.success('Produk berhasil dihapus dari keranjang');
            await reloadCart();
        } catch (error: any) {
            console.error('Error removing from cart:', error);
            toast.error(error?.response?.data?.message || 'Terjadi kesalahan saat menghapus produk');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="relative cart-dropdown">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                disabled={isLoading}
                className="relative p-2 text-gray-700 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-expanded={isOpen}
                aria-controls="cart-dropdown-content"
            >
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <>
                        <ShoppingCart size={20} />
                        {total > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {total}
                            </span>
                        )}
                    </>
                )}
            </button>

            {isOpen && (
                <div 
                    id="cart-dropdown-content"
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-4 border-b">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium">Keranjang Belanja</h3>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center p-8">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                            </div>
                        ) : items.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                <ShoppingCart size={40} className="mx-auto mb-2 text-gray-300" />
                                <p>Keranjang belanja kosong</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {items.map((item) => (
                                    <div key={item.id_keranjang} className="p-4">
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0">
                                                <img 
                                                    src={item.produk.gambar?.[0]?.url 
                                                        ? item.produk.gambar[0].url
                                                        : '/images/placeholder-product.png'}
                                                    alt={item.produk.nama_produk}
                                                    className="w-16 h-16 object-cover rounded"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/images/placeholder-product.png';
                                                    }}
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm">{item.produk.nama_produk}</h4>
                                                <p className="text-sm text-gray-500">{item.jumlah} x {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.produk.harga)}</p>
                                                
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateQuantity(item.id_keranjang, -1);
                                                        }}
                                                        className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-100"
                                                        disabled={item.jumlah <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-8 text-center">
                                                        {item.jumlah}
                                                    </span>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateQuantity(item.id_keranjang, 1);
                                                        }}
                                                        className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-100"
                                                        disabled={item.jumlah >= item.produk.stok}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Stok: {item.produk.stok}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="font-medium">
                                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.subtotal)}
                                                </div>
                                                <button 
                                                    onClick={() => removeFromCart(item.id_keranjang)}
                                                    disabled={isUpdating}
                                                    className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {items.length > 0 && (
                        <div className="p-4 border-t">
                            <div className="flex justify-between mb-4">
                                <span>Total</span>
                                <span className="font-semibold">
                                    Rp {items.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString('id-ID')}
                                </span>
                            </div>
                            <Link
                                href={route('checkout')}
                                className="block w-full bg-primary text-white text-center py-2 rounded hover:bg-primary/90 transition-colors"
                            >
                                Lanjut ke Pembayaran
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
