import { useState, useEffect } from 'react';
import { Save, Loader2, AlertCircle, CheckCircle2, ShieldCheck, Globe, Key } from 'lucide-react';
import { tuyaService } from '../../services/tuyaService';

const REGIONS = [
    { id: 'us', name: 'Western America', url: 'https://openapi.tuyaus.com' },
    { id: 'eu', name: 'Central Europe', url: 'https://openapi.tuyaeu.com' },
    { id: 'cn', name: 'China Data Center', url: 'https://openapi.tuyacn.com' },
    { id: 'ind', name: 'India Data Center', url: 'https://openapi.tuyain.com' },
];

const TuyaConfig = () => {
    const [accessId, setAccessId] = useState('');
    const [accessSecret, setAccessSecret] = useState('');
    const [region, setRegion] = useState('us');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const config = await tuyaService.getConfig();
                if (config) {
                    setAccessId(config.access_id);
                    setAccessSecret(config.access_secret);
                    setRegion(config.region);
                }
            } catch (error) {
                console.error('Error loading Tuya config:', error);
            } finally {
                setLoading(false);
            }
        };
        loadConfig();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus(null);
        try {
            await tuyaService.saveConfig(accessId, accessSecret, region);
            setStatus({ type: 'success', message: 'Configurations saved successfully!' });
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Failed to save configuration.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-8 border-b border-gray-50 bg-gradient-to-r from-emerald-50/50 to-transparent">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Tuya Cloud Integration</h2>
                </div>
                <p className="text-gray-500 text-sm max-w-lg">
                    Connect your Tuya Developer account to control smart devices directly from the platform.
                </p>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
                {status && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 animate-in zoom-in-95 duration-200 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="text-sm font-bold uppercase tracking-wide">{status.message}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                            <Key className="w-3 h-3" /> Access ID
                        </label>
                        <input
                            type="text"
                            required
                            value={accessId}
                            onChange={(e) => setAccessId(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-gray-900"
                            placeholder="Enter your Access ID"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                            <Key className="w-3 h-3" /> Access Secret
                        </label>
                        <input
                            type="password"
                            required
                            value={accessSecret}
                            onChange={(e) => setAccessSecret(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-gray-900"
                            placeholder="Enter your Access Secret"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                        <Globe className="w-3 h-3" /> API Region
                    </label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {REGIONS.map((r) => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setRegion(r.id)}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center ${region === r.id ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-gray-100 bg-gray-50/50 text-gray-500 hover:bg-gray-50'}`}
                            >
                                <span className="text-xs font-black uppercase tracking-tight mb-1">{r.id}</span>
                                <span className="text-[10px] font-medium opacity-70">{r.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold transition-all shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        SAVE CONFIGURATION
                    </button>
                </div>
            </form>

            <div className="p-8 bg-gray-50/50 border-t border-gray-50">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">How to find these keys?</h3>
                <ul className="space-y-3">
                    {[
                        'Login to the Tuya Developer Platform.',
                        'Go to Cloud > Development > My Project.',
                        'Select your project and go to "Service API" (ensure IoT Core is authorized).',
                        'Find your keys under the "Project Overview" tab.'
                    ].map((step, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] font-black">{i + 1}</div>
                            {step}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TuyaConfig;
