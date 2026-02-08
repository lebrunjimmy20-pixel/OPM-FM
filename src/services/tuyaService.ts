import { supabase } from '../lib/supabase';

export interface TuyaDeviceStatus {
    online: boolean;
    power: boolean;
    brightness: number;
    color_temp: number;
    color?: {
        h: number;
        s: number;
        v: number;
    };
}

class TuyaService {
    private async callEdgeFunction(body: any) {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        const response = await fetch(`${supabaseUrl}/functions/v1/tuya-control`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'apikey': supabaseAnonKey
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            // Now we can access the error details!
            const error: any = new Error(data.error || 'Request failed');
            error.details = data.details;
            error.code = data.code;
            throw error;
        }

        return data;
    }

    async controlDevice(deviceId: string, commands: any[]) {
        return await this.callEdgeFunction({
            action: 'control',
            device_id: deviceId,
            commands
        });
    }

    async getDeviceStatus(deviceId: string): Promise<TuyaDeviceStatus> {
        const data = await this.callEdgeFunction({
            action: 'get_status',
            device_id: deviceId
        });
        return data.status;
    }

    async saveConfig(accessId: string, accessSecret: string, region: string) {
        const { error } = await supabase
            .from('tuya_config')
            .upsert({
                access_id: accessId,
                access_secret: accessSecret,
                region,
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

        if (error) throw error;
    }

    async getConfig() {
        const { data, error } = await supabase
            .from('tuya_config')
            .select('*')
            .maybeSingle();

        if (error) throw error;
        return data;
    }
}

export const tuyaService = new TuyaService();
