import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

async function hmac(key: string, message: string) {
    const enc = new TextEncoder()
    const keyBuf = enc.encode(key)
    const messageBuf = enc.encode(message)
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyBuf,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageBuf)
    return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()
}

async function sha256(message: string) {
    const msgUint8 = new TextEncoder().encode(message)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders, status: 200 })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Get Tuya Config
        const { data: config, error: configError } = await supabaseClient
            .from('tuya_config')
            .select('*')
            .limit(1)
            .single()

        if (configError || !config) {
            return new Response(JSON.stringify({
                error: 'Tuya configuration not found. Please set your credentials in Settings.',
                hint: 'Go to Settings > Tuya Integration and save your Access ID and Secret'
            }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const { access_id, access_secret } = config
        const region = config.region || 'us'
        const baseUrl = `https://openapi.tuya${region === 'us' ? 'us' : region}.com`

        const { action, device_id, commands } = await req.json()
        const t = Date.now().toString()

        console.log(`[Tuya Control] Action: ${action}, Device: ${device_id}, Region: ${region}`)

        // 1. Get Access Token - Standard Mode (v2.0)
        // Sign = HMAC-SHA256(client_id + t + nonce + stringToSign, secret).toUpperCase()
        // StringToSign for Token = "GET\n" + hash("") + "\n\n" + "/v1.0/token?grant_type=1"

        const nonce = '' // Empty nonce is fine for token
        const method = 'GET'
        const path = '/v1.0/token?grant_type=1'
        const contentHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' // SHA256 of empty string
        const stringToSign = [method, contentHash, '', path].join('\n')

        const signStr = access_id + t + nonce + stringToSign
        const sign = await hmac(access_secret, signStr)

        console.log(`[Tuya v2.0] Requesting token...`)
        console.log(`  ID: ${access_id.substring(0, 6)}...`)
        console.log(`  String to Sign: ${JSON.stringify(stringToSign)}`)
        console.log(`  SignStr: ${signStr}`)
        console.log(`  Calculated Sign: ${sign}`)

        const tokenResponse = await fetch(`${baseUrl}/v1.0/token?grant_type=1`, {
            headers: {
                'client_id': access_id,
                'sign': sign,
                't': t,
                'sign_method': 'HMAC-SHA256',
                'nonce': nonce,
                'stringToSign': ''
            }
        })

        const tokenData = await tokenResponse.json()

        if (!tokenData.success) {
            return new Response(JSON.stringify({
                error: `Tuya Auth Failed: ${tokenData.msg}`,
                details: tokenData
            }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }
        const token = tokenData.result.access_token

        if (action === 'get_status') {
            const t2 = Date.now().toString()
            const path = `/v1.0/devices/${device_id}/status`
            const contentHash = await sha256("")
            const stringToSign = ["GET", contentHash, "", path].join("\n")
            const signStr = access_id + token + t2 + stringToSign
            const sign2 = await hmac(access_secret, signStr)

            console.log(`[Tuya Status] Fetching status for device ${device_id}`)
            const statusRes = await fetch(`${baseUrl}${path}`, {
                headers: {
                    'client_id': access_id,
                    'access_token': token,
                    'sign': sign2,
                    't': t2,
                    'sign_method': 'HMAC-SHA256'
                }
            })
            const statusData = await statusRes.json()
            console.log(`[Tuya Status] Response:`, JSON.stringify(statusData))

            if (!statusData.success) {
                return new Response(JSON.stringify({
                    error: `Failed to get device status: ${statusData.msg || 'Unknown error'}`,
                    details: {
                        code: statusData.code,
                        message: statusData.msg,
                        device_id: device_id,
                        hint: statusData.code === 1106 ? 'Device not found or wrong region. Check device ID and region settings.' :
                            'Check if device is online and accessible.'
                    }
                }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                })
            }

            // Map Tuya status to our app format
            const result = statusData.result || []
            const power = result.find((f: any) => f.code === 'switch_led' || f.code === 'switch_1')?.value || false
            const brightness = (result.find((f: any) => f.code === 'bright_value_v2' || f.code === 'bright_value')?.value / 10) || 0
            const color_temp = (result.find((f: any) => f.code === 'temp_value_v2' || f.code === 'temp_value')?.value / 10) || 0

            return new Response(JSON.stringify({
                status: { online: true, power, brightness, color_temp }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })

        } else if (action === 'control') {
            const t3 = Date.now().toString()
            const path = `/v1.0/devices/${device_id}/commands`
            const body = JSON.stringify({ commands })
            const contentHash = await sha256(body)
            const stringToSign = ["POST", contentHash, "", path].join("\n")
            const signStr = access_id + token + t3 + stringToSign
            const sign3 = await hmac(access_secret, signStr)

            console.log(`[Tuya Control] Sending commands to device ${device_id}:`, commands)
            const controlRes = await fetch(`${baseUrl}${path}`, {
                method: 'POST',
                headers: {
                    'client_id': access_id,
                    'access_token': token,
                    'sign': sign3,
                    't': t3,
                    'sign_method': 'HMAC-SHA256',
                    'Content-Type': 'application/json'
                },
                body
            })
            const controlData = await controlRes.json()
            console.log(`[Tuya Control] Response:`, JSON.stringify(controlData))

            if (!controlData.success) {
                return new Response(JSON.stringify({
                    error: `Control command failed: ${controlData.msg || 'Unknown error'}`,
                    details: {
                        code: controlData.code,
                        message: controlData.msg
                    }
                }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                })
            }
            return new Response(JSON.stringify(controlData), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        return new Response(JSON.stringify({ error: 'Invalid action' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error: any) {
        console.error('[Tuya Error]', error)
        return new Response(JSON.stringify({
            error: error.message,
            stack: error.stack
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
