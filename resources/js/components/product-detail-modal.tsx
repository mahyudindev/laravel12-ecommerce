import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart, ChevronLeft, ChevronRight, Loader2, Check, Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { useForm, usePage, router } from "@inertiajs/react";
import { toast } from 'sonner';

interface ProductDetailModalProps {
    product: Product | null;
    open: boolean;
    onClose: () => void;
    onAddToCart?: (product: Product, quantity: number) => void;
}

export function ProductDetailModal({ product, open, onClose, onAddToCart }: ProductDetailModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        if (open) {
            setQuantity(1);
            setActiveImageIndex(0);
        }
    }, [open]);

    if (!product) return null;

    const mainImage = product.gambar?.[activeImageIndex] || product.gambar?.[0];
    const mainImageUrl = mainImage?.url || (mainImage?.path ? `/storage/${mainImage.path}` : '');

    const { errors } = usePage().props as { errors: { stok?: string } };

    const handleAddToCart = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (onAddToCart) {
            onAddToCart(product, quantity);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
            setQuantity(1);
            return;
        }

        try {
            setIsAddingToCart(true);
            
            await router.post(route('keranjang.store'), {
                produk_id: product.produk_id,
                jumlah: quantity,
                _method: 'post'
            }, {
                onSuccess: () => {
                    setIsAdded(true);
                    toast.success('Produk berhasil ditambahkan ke keranjang');
                    setTimeout(() => setIsAdded(false), 2000);
                    setQuantity(1);
                },
                onError: (errors) => {
                    if (errors.stok) {
                        toast.error(errors.stok);
                    } else {
                        toast.error('Gagal menambahkan ke keranjang');
                    }
                },
                preserveScroll: true
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Terjadi kesalahan saat menambahkan ke keranjang');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        if (target.src.includes('storage/')) {
            target.src = 'https://via.placeholder.com/800x800?text=No+Image';
        }
        target.className = 'w-full h-full object-contain bg-gray-100 dark:bg-gray-800';
    };

    const handlePrevImage = () => {
        if (!product.gambar) return;
        setActiveImageIndex(prev => (prev === 0 ? product.gambar.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        if (!product.gambar) return;
        setActiveImageIndex(prev => (prev === product.gambar.length - 1 ? 0 : prev + 1));
    };

    const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed) return;
        
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPosition({ x, y });
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-5xl p-0 overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 rounded-full p-1.5 bg-white/80 backdrop-blur-sm hover:bg-gray-100 transition-colors"
                >
                    <X className="h-5 w-5 text-gray-600" />
                    <span className="sr-only">Close</span>
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image Gallery */}
                    <div className="relative bg-gray-50 p-6">
                        <div 
                            className="relative aspect-square overflow-hidden rounded-lg bg-white"
                            onMouseEnter={() => setIsZoomed(true)}
                            onMouseLeave={() => setIsZoomed(false)}
                            onMouseMove={handleImageMouseMove}
                        >
                            {mainImage ? (
                                <img 
                                    src={mainImageUrl}
                                    alt={product.nama_produk}
                                    className={cn(
                                        "w-full h-full object-contain transition-transform duration-300",
                                        isZoomed ? "scale-150" : "scale-100"
                                    )}
                                    style={{
                                        transformOrigin: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center',
                                    }}
                                    onError={handleImageError}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <span className="text-gray-400">No image available</span>
                                </div>
                            )}

                            {/* Navigation Arrows */}
                            {product.gambar.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePrevImage();
                                        }}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                                    >
                                        <ChevronLeft className="h-5 w-5 text-gray-700" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNextImage();
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                                    >
                                        <ChevronRight className="h-5 w-5 text-gray-700" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {product.gambar.length > 1 && (
                            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                                {product.gambar.map((img, index) => {
                                    const imgUrl = img.url || (img.path ? `/storage/${img.path}` : '');
                                    return (
                                        <button
                                            key={img.gambar_id || index}
                                            onClick={() => setActiveImageIndex(index)}
                                            className={cn(
                                                "flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all",
                                                activeImageIndex === index 
                                                    ? "border-primary ring-2 ring-primary ring-offset-1" 
                                                    : "border-transparent hover:border-gray-300"
                                            )}
                                        >
                                            {imgUrl ? (
                                                <img 
                                                    src={imgUrl}
                                                    alt={`${product.nama_produk} ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={handleImageError}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-xs text-gray-400">{index + 1}</span>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6 md:p-8 overflow-y-auto max-h-[90vh]">
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{product.nama_produk}</h1>
                                <div className="mt-1 flex items-center">
                                    <span className="text-2xl font-bold text-primary">
                                        {new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(product.harga)}
                                    </span>
                                    {product.stok > 0 && (
                                        <span className="ml-3 text-sm text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                            Stok: {product.stok}
                                        </span>
                                    )}
                                </div>
                                {product.stok === 0 && (
                                    <span className="inline-block mt-2 text-sm text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                        Stok Habis
                                    </span>
                                )}
                            </div>

                            {product.deskripsi && (
                                <div className="pt-2 border-t border-gray-100">
                                    <h3 className="text-sm font-medium text-gray-900">Deskripsi Produk</h3>
                                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">
                                        {product.deskripsi}
                                    </p>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Jumlah</span>
                                    <div className="flex items-center space-x-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="h-8 w-8 p-0 rounded-full"
                                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                            disabled={quantity <= 1 || product.stok === 0}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            className="h-8 w-8 p-0 rounded-full"
                                            onClick={() => setQuantity(prev => prev + 1)}
                                            disabled={product.stok === 0 || quantity >= product.stok}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <Button 
                                    size="lg" 
                                    className="w-full mt-6 py-6 text-base font-medium"
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart || product.stok === 0}
                                    variant={isAdded ? 'outline' : 'default'}
                                >
                                    {isAddingToCart ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menambahkan...
                                        </>
                                    ) : isAdded ? (
                                        <>
                                            <Check className="mr-2 h-5 w-5" />
                                            Ditambahkan
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="mr-2 h-5 w-5" />
                                            {product.stok > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <div>
                                    <h4 className="font-medium text-gray-900">Kategori</h4>
                                    <p className="text-gray-600">{product.kategori || '-'}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Berat</h4>
                                    <p className="text-gray-600">{product.berat ? `${product.berat} gram` : '-'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
