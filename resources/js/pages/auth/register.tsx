import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    email: string;
    password: string;
    password_confirmation: string;
    nama_lengkap: string;
    no_telepon: string;
    alamat: string;
    tipe_alamat: 'Rumah' | 'Kantor' | 'Kos';
    kota: string;
    kode_pos: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        email: '',
        password: '',
        password_confirmation: '',
        nama_lengkap: '',
        no_telepon: '',
        alamat: '',
        tipe_alamat: 'Rumah',
        kota: '',
        kode_pos: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <h3 className="text-lg font-medium">Informasi Akun</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                            <Input
                                id="nama_lengkap"
                                type="text"
                                required
                                tabIndex={2}
                                autoComplete="name"
                                value={data.nama_lengkap}
                                onChange={(e) => setData('nama_lengkap', e.target.value)}
                                disabled={processing}
                                placeholder="Nama lengkap"
                            />
                            <InputError message={errors.nama_lengkap} className="mt-2" />
                        </div>
                    </div>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Konfirmasi password"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-4">Informasi Kontak</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="no_telepon">Nomor Telepon</Label>
                            <Input
                                id="no_telepon"
                                type="tel"
                                required
                                tabIndex={5}
                                autoComplete="tel"
                                value={data.no_telepon}
                                onChange={(e) => setData('no_telepon', e.target.value)}
                                disabled={processing}
                                placeholder="08xxxxxxxxxx"
                            />
                            <InputError message={errors.no_telepon} />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="tipe_alamat">Tipe Alamat</Label>
                            <Select 
                                value={data.tipe_alamat} 
                                onValueChange={(value) => setData('tipe_alamat', value as 'Rumah' | 'Kantor' | 'Kos')}
                                disabled={processing}
                            >
                                <SelectTrigger id="tipe_alamat" tabIndex={6}>
                                    <SelectValue placeholder="Pilih tipe alamat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Rumah">Rumah</SelectItem>
                                    <SelectItem value="Kantor">Kantor</SelectItem>
                                    <SelectItem value="Kos">Kos</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.tipe_alamat} />
                        </div>
                    </div>
                    
                    <div className="grid gap-2">
                        <Label htmlFor="alamat">Alamat Lengkap</Label>
                        <Input
                            id="alamat"
                            type="text"
                            required
                            tabIndex={7}
                            value={data.alamat}
                            onChange={(e) => setData('alamat', e.target.value)}
                            disabled={processing}
                            placeholder="Alamat lengkap"
                            className="min-h-[80px]"
                        />
                        <InputError message={errors.alamat} />
                    </div>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="kota">Kota</Label>
                            <Input
                                id="kota"
                                type="text"
                                tabIndex={8}
                                value={data.kota}
                                onChange={(e) => setData('kota', e.target.value)}
                                disabled={processing}
                                placeholder="Nama kota"
                            />
                            <InputError message={errors.kota} />
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="kode_pos">Kode Pos</Label>
                            <Input
                                id="kode_pos"
                                type="text"
                                tabIndex={9}
                                value={data.kode_pos}
                                onChange={(e) => setData('kode_pos', e.target.value)}
                                disabled={processing}
                                placeholder="Kode pos"
                            />
                            <InputError message={errors.kode_pos} />
                        </div>
                    </div>

                    <Button type="submit" className="mt-6 w-full" tabIndex={10} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
