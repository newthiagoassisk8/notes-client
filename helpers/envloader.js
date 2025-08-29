import { readFileSync } from 'node:fs';
import ping from 'ping';

export function loadEnv(path = '.env') {
    const content = readFileSync(path, 'utf-8');

    const env = {};
    content.split('\n').map((line) => {
        const [key, value] = line.split('=');

        if (key && value) {
            env[key.trim()] = value.trim();
        }
    });

    return env;
}

export async function getHost() {
    const env = loadEnv() || {};
    var hosts = [env?.HOST, env?.HOST_VPN];

    for (let host of hosts) {
        const res = await ping.promise.probe(host);
        if (res.alive) {
            return host;
        }

    }
    return;
}
