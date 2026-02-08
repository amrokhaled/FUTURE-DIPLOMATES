"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Save, User, Phone, MapPin, Heart, ShieldCheck, Upload } from "lucide-react";

interface Profile {
    id: string;
    email: string;
    full_name: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    phone: string;
    country: string;
    address: string;
    gender: string;
    marital_status: string;
    nationality: string;
    emergency_contact_name: string;
    emergency_contact_number: string;
    role: string;
    created_at: string;
    updated_at: string;
}

export default function ProfilePage() {
    const supabase = createClient();
    const router = useRouter(); // Initialize useRouter
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setLoading(false);
        }, 8000); // 8 second safety timeout

        async function loadProfile() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const user = session?.user;

                if (!user) {
                    router.push('/login');
                    return;
                }

                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                // Initialize profile with existing data or default values
                setProfile({
                    id: user.id,
                    email: data?.email || user.email || '',
                    full_name: data?.full_name || user.user_metadata?.full_name || '',
                    first_name: data?.first_name || '',
                    last_name: data?.last_name || '',
                    avatar_url: data?.avatar_url || '',
                    phone: data?.phone || '',
                    country: data?.country || '',
                    address: data?.address || '',
                    gender: data?.gender || '',
                    marital_status: data?.marital_status || '',
                    nationality: data?.nationality || '',
                    emergency_contact_name: data?.emergency_contact_name || '',
                    emergency_contact_number: data?.emergency_contact_number || '',
                    role: data?.role || 'user',
                    created_at: data?.created_at || new Date().toISOString(),
                    updated_at: data?.updated_at || new Date().toISOString(),
                });

            } catch (err) {
                console.error("Error loading profile:", err);
            } finally {
                setLoading(false);
                clearTimeout(timeoutId);
            }
        }
        loadProfile();
    }, [supabase, router]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !profile) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setProfile({ ...profile, avatar_url: publicUrl });
            alert("Avatar uploaded successfully! Don't forget to save changes.");
        } catch (error) {
            console.error("Error uploading avatar:", error);
            alert("Failed to upload image. Please ensure the 'avatars' bucket exists and is public.");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!profile) return;
        setSaving(true);
        const { error } = await supabase
            .from('profiles')
            .upsert({
                ...profile,
                updated_at: new Date().toISOString(),
            });

        if (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile. Please try again.");
        } else {
            alert("Profile updated successfully!");
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Please log in to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Personal Profile</h1>
                <p className="text-gray-500 mt-1">Manage your account information and preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avatar Section */}
                <Card className="border-none shadow-sm bg-white overflow-hidden md:col-span-2">
                    <CardHeader className="bg-slate-50 border-b">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <User className="w-5 h-5 text-brand" />
                            Profile Picture
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-6 pt-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-slate-200">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-slate-300" />
                                )}
                            </div>
                            {uploading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">Profile Picture</label>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={uploading}
                                        onClick={() => document.getElementById('avatar-upload')?.click()}
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Image
                                    </Button>
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                    {profile.avatar_url && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => setProfile({ ...profile, avatar_url: '' })}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Avatar URL (Direct Link)</label>
                                <Input
                                    value={profile.avatar_url}
                                    onChange={e => setProfile({ ...profile, avatar_url: e.target.value })}
                                    placeholder="https://example.com/avatar.jpg"
                                    className="w-full text-xs h-8"
                                />
                                <p className="text-[10px] text-slate-400 italic">Upload a file or paste a direct image link.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Basic Information */}
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <User className="w-5 h-5 text-brand" />
                            Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <Input
                                value={profile.full_name}
                                onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                                placeholder="Full Name"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">First Name</label>
                                <Input
                                    value={profile.first_name}
                                    onChange={e => setProfile({ ...profile, first_name: e.target.value })}
                                    placeholder="First"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Last Name</label>
                                <Input
                                    value={profile.last_name}
                                    onChange={e => setProfile({ ...profile, last_name: e.target.value })}
                                    placeholder="Last"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Gender</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={profile.gender}
                                    onChange={e => setProfile({ ...profile, gender: e.target.value })}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Marital Status</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={profile.marital_status}
                                    onChange={e => setProfile({ ...profile, marital_status: e.target.value })}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Phone className="w-5 h-5 text-brand" />
                            Contact & Geography
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Phone Number</label>
                            <Input
                                value={profile.phone}
                                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nationality</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={profile.nationality}
                                    onChange={e => setProfile({ ...profile, nationality: e.target.value })}
                                >
                                    <option value="">Select Nationality</option>
                                    <option value="Egyptian">Egyptian</option>
                                    <option value="Saudi">Saudi</option>
                                    <option value="Emirati">Emirati</option>
                                    <option value="Jordanian">Jordanian</option>
                                    <option value="Kuwaiti">Kuwaiti</option>
                                    <option value="Qatari">Qatari</option>
                                    <option value="Bahraini">Bahraini</option>
                                    <option value="Omani">Omani</option>
                                    <option value="American">American</option>
                                    <option value="British">British</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Country</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={profile.country}
                                    onChange={e => setProfile({ ...profile, country: e.target.value })}
                                >
                                    <option value="">Select Country</option>
                                    <option value="Egypt">Egypt</option>
                                    <option value="Saudi Arabia">Saudi Arabia</option>
                                    <option value="United Arab Emirates">United Arab Emirates</option>
                                    <option value="Jordan">Jordan</option>
                                    <option value="Kuwait">Kuwait</option>
                                    <option value="Qatar">Qatar</option>
                                    <option value="Bahrain">Bahrain</option>
                                    <option value="Oman">Oman</option>
                                    <option value="USA">USA</option>
                                    <option value="UK">UK</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Address</label>
                            <Textarea
                                value={profile.address}
                                onChange={e => setProfile({ ...profile, address: e.target.value })}
                                placeholder="Full Address"
                                className="min-h-[80px]"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="border-none shadow-sm bg-white overflow-hidden md:col-span-2">
                    <CardHeader className="bg-slate-50 border-b">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-brand" />
                            Emergency Contact
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Contact Name</label>
                            <Input
                                value={profile.emergency_contact_name}
                                onChange={e => setProfile({ ...profile, emergency_contact_name: e.target.value })}
                                placeholder="Next of Kin Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Contact Number</label>
                            <Input
                                value={profile.emergency_contact_number}
                                onChange={e => setProfile({ ...profile, emergency_contact_number: e.target.value })}
                                placeholder="Emergency Phone"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    variant="gold"
                    className="w-full md:w-auto min-w-[150px] shadow-lg"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
