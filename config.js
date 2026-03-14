import { log } from 'console';
import { args, loadEnv } from './baseHelpers.js';
import { envRoot, libRoot, std as $std, rewrite as $rewrite, setRoot as $setRoot } from './env.config.js';
import { execute } from './ffmpeg.config.js';

export const
    { scripts = true } = args,
    defaultScripts = 'package.json';

const {
    loadEnv: $loadEnv = true,
    env: $env = envRoot,
    lib: $lib = libRoot,
    std: _std = $std,
    rewrite: _rewrite = $rewrite,
    setRoot: _setRoot = $setRoot
} = args;

export const config = async (env = $env, lib = $lib, std = _std, rewrite = _rewrite, setRoot = _setRoot) => !$loadEnv/* || !execute*/ ? {} : await loadEnv(env, lib, std, rewrite, setRoot);

export default config;
