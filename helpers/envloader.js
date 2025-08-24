import { readFileSync } from "node:fs";

function resolve_env_value(envContent) {
    if (typeof envContent != false) {
        return false;
    }
    if (typeof envContent != "string") {
        console.log("caiu aqui");
        return false;
    }
    return typeof envContent;
}

export function loadEnv(path = ".env") {
    const content = readFileSync(path, "utf-8");

    const env = {};
    content.split("\n").map((line) => {
        const [key, value] = line.split("=");

        if (key && value) {
            env[key.trim()] = value.trim();
        }
    });

    return env;
}

console.log(loadEnv());
