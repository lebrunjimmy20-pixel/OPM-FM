import { User, Mail, Shield, Camera, Save, ArrowLeft, Lock, KeyRound, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/auth/AuthContext';

type Tab = 'personal' | 'security';

const Profile = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('personal');
    const [loading, setLoading] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Profile State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    // Security State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (user) {
            setFullName(user.user_metadata?.full_name || '');
            setEmail(user.email || '');
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        if (!user) return;
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (data) {
            setFullName(data.full_name || '');
            setAvatarUrl(data.avatar_url || null);
        }
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploadingAvatar(true);
            setMessage(null);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${user?.id}/${Math.random()}.${fileExt}`;

            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // 3. Update Profiles Table
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user?.id);

            if (updateError) throw updateError;

            // 4. Update Auth Metadata (so it shows up in TopNav immediately)
            await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            setAvatarUrl(publicUrl);
            setMessage({ type: 'success', text: 'Avatar updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Error uploading avatar' });
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            // Update Auth Metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            });
            if (authError) throw authError;

            // Update Profiles Table
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user?.id);

            if (profileError) throw profileError;

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'An error occurred' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });
            if (error) throw error;

            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'An error occurred' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 font-sans">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Profile Settings</h1>
                    <p className="text-gray-500 font-medium">Manage your personal information and account security.</p>
                </div>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 border ${message.type === 'success'
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                    : 'bg-red-50 border-red-100 text-red-700'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
                    <p className="text-sm font-bold">{message.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Left: Menu Section */}
                <div className="md:col-span-1 space-y-4">
                    <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-3xl p-6 shadow-sm text-center">
                        <div className="relative inline-block group mb-3">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-emerald-50 mx-auto flex items-center justify-center">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt="User Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-12 h-12 text-emerald-200" />
                                )}
                                {uploadingAvatar && (
                                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center rounded-full">
                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingAvatar}
                                className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full shadow-lg border-2 border-white scale-75 hover:scale-90 transition-transform active:scale-75 disabled:opacity-50"
                                title="Upload new photo"
                            >
                                <Camera className="w-3 h-3" />
                            </button>
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 truncate px-2">{fullName || 'User'}</h3>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Administrator</p>
                    </div>

                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab('personal')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all ${activeTab === 'personal'
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                                : 'text-gray-500 hover:bg-white hover:text-gray-900'
                                }`}
                        >
                            <User className={`w-4 h-4 ${activeTab === 'personal' ? 'text-white' : 'text-gray-400'}`} />
                            General
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all ${activeTab === 'security'
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                                : 'text-gray-500 hover:bg-white hover:text-gray-900'
                                }`}
                        >
                            <Shield className={`w-4 h-4 ${activeTab === 'security' ? 'text-white' : 'text-gray-400'}`} />
                            Security
                        </button>
                    </nav>
                </div>

                {/* Right: Content Section */}
                <div className="md:col-span-3">
                    <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-3xl shadow-sm overflow-hidden min-h-[400px]">
                        {activeTab === 'personal' ? (
                            <form onSubmit={handleUpdateProfile}>
                                <div className="px-8 py-6 border-b border-gray-50">
                                    <h2 className="text-lg font-extrabold text-gray-900">Personal Information</h2>
                                    <p className="text-xs text-gray-400 font-medium">Update your profile details.</p>
                                </div>

                                <div className="p-8 space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all font-bold text-gray-700"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Email Address</label>
                                            <div className="relative opacity-60">
                                                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    disabled
                                                    value={email}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl font-bold text-gray-500 cursor-not-allowed"
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-400 ml-1 mt-1 font-bold">Email changes restricted for security</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-8 py-6 border-t border-gray-50 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-2xl font-bold transition-all shadow-[0_10px_20px_-10px_rgba(5,150,105,0.4)] hover:shadow-[0_20px_40px_-15px_rgba(5,150,105,0.5)] active:scale-95"
                                    >
                                        <Save className="w-5 h-5" />
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleUpdatePassword}>
                                <div className="px-8 py-6 border-b border-gray-50">
                                    <h2 className="text-lg font-extrabold text-gray-900">Security Settings</h2>
                                    <p className="text-xs text-gray-400 font-medium">Update your account password.</p>
                                </div>

                                <div className="p-8 space-y-6 max-w-xl">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">New Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Enter new password"
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all font-bold text-gray-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Confirm New Password</label>
                                        <div className="relative group">
                                            <KeyRound className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm new password"
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all font-bold text-gray-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="px-8 py-6 border-t border-gray-50 flex justify-end mt-auto">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-2xl font-bold transition-all shadow-[0_10px_20px_-10px_rgba(5,150,105,0.4)] hover:shadow-[0_20px_40px_-15px_rgba(5,150,105,0.5)] active:scale-95"
                                    >
                                        <Lock className="w-5 h-5" />
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
