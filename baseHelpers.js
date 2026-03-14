import os from 'os';
import { error, log } from 'console';
import { resolve, basename, extname, dirname } from 'path';
import {
    readdir, stat, mkdir as $mkdir, readFile as $readFile, writeFile as $writeFile, appendFile as $appendFile, rm as $rm, copyFile as $copyFile, rename as $rename
} from 'fs/promises';
import { cwd, argv, env } from 'process';
import { execSync as $execSync, spawn as spawner, exec as executor } from 'child_process';
import { root, envRoot, libRoot, std as $std, rewrite as $rewrite, setRoot as $setRoot, exclude } from './env.config.js';
import { arrToObj, fileToArr } from './proto.js';

export { arrToObj, fileToArr };

export const
    { userInfo } = os,
    { username, homedir } = userInfo();

export const { min, max, round } = Math;

const { parseInt: int, parseFloat: float } = Number;

export const
    parseFloat = (str, rnd = 3) => float(float(str).toFixed(rnd)),
    parseInt = (str, ceil = true, rnd = true) => rnd ? (ceil ? Math.ceil(str) : parseFloat(str, 0)) : int(str);

const libFilter = async ({ path, name }) => !exclude.find(dir => path.includes(`${root}\\${libRoot}\\${dir}`)) && await isExe(`${path}\\${name}`, false);

export const
    parseArgs = (argList, sep = /^\-+/) => {
        let args = {}, optList, opt;
        argList.slice(2).forEach(arg => {
            optList = arg.trim().replace(sep, "").split("=");
            opt = optList[0];
            const v = optList[1] || true;
            args[opt] = v !== 'false' ? v : false;
        });
        return args;
    },
    args = parseArgs(argv),
    getEnv = k => env[k],
    setEnv = (k, v, rewrite = true) => {
        const isPath = k === 'Path';
        if ((isPath && env[k]?.includes(v)) || rewrite || !getEnv(k)) {
            if (!isPath) env[k] = '';
            return env[k] += `${isPath ? ';' : ''}${v.join?.(';') || v }`;
        }
        return env[k];
    },
    addPath = (path) => setEnv('Path', path),
    getPath = () => getEnv('Path')?.toArr(';'),
    loadLibs = async (dir = libRoot, stdout = $std, rewrite = $rewrite, cb = cbFiles, opts = _opts, filter = libFilter) => {
        if (stdout) log('Load libraries');
        if (!isFn(cb)) {
            opts = cb;
            cb = cbFiles;
            if (isBool(opts)) opts = _opts.assign({ recursive: opts });
        }
        if (isFn(opts)) {
            filter = opts;
            opts = _opts;
        }
        const libList = await getFiles(dir, cb, opts, filter);
        const Path = [];
        const libs = libList.map(({ f, fName, dir }) => {
            fName = fName.replace('-', '_').upper();
            setEnv(fName, f, rewrite);
            addPath(dir);
            if (!Path.includes(dir)) Path.push(dir);
            if (stdout) log(getEnv(fName));
            return [fName, f];
        }).fromEntries();
        libs.Path = Path;
        //log(libList);
        //log(Path);
        if (stdout) log(libs);
        if (stdout) log('Complete load libraries');
        return libs;
    },
    getEnvs = async (path = envRoot) => (await fileToArr(path, '\n', s => s.toArr('=', true))).fromEntries(),
    /**
    * Load enviroment variables from .env file & 'lib' directiry.
    * @param {string|boolean} lib
    * @returns
    */
    loadEnv = async (path = envRoot, lib = libRoot, std = $std, rewrite = $rewrite, setRoot = $setRoot) => {
        if (std) log('Load enviroment variables');
        const [envList, _env] = [{}, await getEnvs(path)];
        _env.Path = _env.Path.toArr(';', true, str => !setRoot ? str : /\w:\\.+/.test(str = str.replace('$root', root)) ? str : `${root}\\${str}`).unique();
        _env.entries().forEach(([k, v]) => setEnv(k, v, rewrite));
        //log(env.Path);
        if (lib) {
            const libList = await loadLibs(lib, false, false);
            libList.Path.forEach(dir => _env.Path.includes(dir) ? null : _env.Path.push(dir));
            envList.assign(libList);
        }
        envList.assign(_env);
        //log(_env);
        if (std) log(envList);
        if (std) log('Complete load enviroment variables');
        return envList;
    };

export const
    isSet = (v, ...ex) => v || ex.includes(v) ? true : false,
    isNull = (v) => v == null,
    notNull = (v) => !isNull(v),
    equals = (a, a1) => a.length === a1.length,
    notEquals = (a, a1) => !equals(a, a1),
    isStr = (v) => typeof v === 'string',
    isNum = (v) => typeof v === 'number',
    isBool = (v) => typeof v === 'boolean',
    isFn = (v) => v instanceof Function,
    isArr = (v) => v instanceof Array,
    isRe = (v) => v instanceof RegExp,
    isObj = (v) => typeof v === 'object' && !(isArr(v) || isRe(v)) && notNull(v),
    isDir = async (dirent) => (await getStat(dirent)).isDirectory?.() || false,
    isFile = async (dirent) => (await getStat(dirent)).isFile?.() || false,
    isPath = str => {
        const dName = dirName(str);
        const fName = fileName(str, true);
        const fPath = dName + "\\" + fName;
        const _isPath = fPath === str;
        //log(str);
        //log(fPath);
        //log(dName);
        //log(fName);
        //log(_isPath);
        return _isPath && /^\w\:.+\.\w+/.test(str);
    };

export const tryCatch = async (_try, _catch = async (err) => { }, errOn = true) => {
    try {
        return await _try() || {};
    } catch (err) {
        if (_catch & errOn) error(err);
        await _catch(err);
        return { err };
    }
};

export const getErrCode = ({ code }) => {
    switch (code) {
        case "ENOENT":
            return "Not Exists";
            break;
        case "EPERM":
            return "Not Permitted";
            break;
        default: return code
    }
};

export const setErr = (err, path, cb = () => { }) => {
    error(err);
    setMsg("Error", path, getErrCode(err));
    cb();
    return { err };
};

export const
    getMsg = (msg, path) => `${msg} | ${path}`,
    setMsg = (_msg, path, errCode = null) => {
        if (_msg == "Error") _msg += ` | ${errCode === "Not Exists" ? "Not Exists" : errCode}`;
        const msg = getMsg(_msg, path);
        setMsg.changes.push(msg);
        log(msg);
    };

setMsg.changes = [];

export const getPromises = async (arr, cb = async (v, i) => { }) => await Promise.all(arr.map(async (v, i) => await cb(v, i)));

export const getDatetime = () => {
    const date = new Date(Date.now());
    return `${date.toLocaleDateString("ru-RU")} ${date.toLocaleTimeString("ru-RU")}`;
};

export const getPaths = async (path, direntList) => direntList.map(async dirent => {
    return {
        name: resolve(path, dirent.name),
        isDir: await isDir(dirent),
        isFile: await isFile(dirent)
    };
});

/* Начиная с Node 20, fs.readdir есть { recursive: true } опция
withFileTypes - это вернёт все элементы с информацией об их типе, поэтому нам вообще не нужно будет вызывать stat для получения информации, которую readdir теперь возвращает нам.
*/
const _opts = { recursive: true, withFileTypes: true };
const setOpts = (opts) => Object.assign(_opts, opts);

export const
    getDir = async (path, opts = _opts) => await tryCatch(async () => await readdir(path, setOpts(opts))),
    mkdir = async (path, opts = { recursive: true }) => await tryCatch(async () => await $mkdir(path, opts)),
    readFile = async (path, opts = { encoding: 'utf8' }) => await tryCatch(async () => await $readFile(path, opts)),
    writeFile = async (path, data, opts = { encoding: 'utf8' }) => await tryCatch(async () => await $writeFile(path, data, opts)),
    appendFile = async (path, data, opts = { encoding: 'utf8' }) => await tryCatch(async () => await $appendFile(path, data, opts)),
    appendFiles = async (str, ...files) => { for await (const f of files) await appendFile(f, str); },
    copyFile = async (src, dest, mode) => await tryCatch(async () => await $copyFile(src, dest)),
    rm = async (path, opts = { recursive: true, force: true }) => await tryCatch(async () => await $rm(path, opts)),
    getJSON = async (path, data = null) => await tryCatch(async () => !data ? JSON.parse(await readFile(path)) : await writeFile(path, JSON.stringify(data))),
    dirName = (path) => resolve(dirname(path)),
    ext = (path, noDot = false) => !noDot ? extname(path) : extname(path).replace('.', ''),
    fileName = (path, getExt = false, full = true, noDot = false) => {
        const _ext = ext(path);
        const _fileName = basename(path, _ext);
        return !getExt ? _fileName : (full ? _fileName + _ext : { name: _fileName, ext: !noDot ? _ext : _ext.replace('.', '') });
    },
    rename = async (path, replace) => {
        const files = await getFiles(path);
        const keys = replace.k();
        log(files);
        for await (const { f, dir, name } of files) {
            const newPath = keys.reduce((s, k) => s.replace(k, replace[k]), name);
            //log(name !== newPath);
            if (name !== newPath) {
                //log(f);
                //log(`${dir}\\${newPath}`);
                await tryCatch(async () => await $rename(f, `${dir}\\${newPath}`));
            }
        }
    },
    compare = (a, b) => new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare(a, b);

export const reWrite = async (src, dest) => {
    const data = await readFile(src);
    log("file: ", src);
    log("dest: ", dest);
    const { err: errR } = data;
    if (errR) return setErr(errR, src);
    log("data: ", data);

    const file = await writeFile(dest, data);
    const { err: errW } = file;
    if (errW) return setErr(errW, dest);
    log(file);
    return file;
};

/*
 * dev: device identifier in numeric,
 * mode: file type in bits,
 * nlink: hard links count,
 * uid: file owner identifier,
 * gid: group identifier of an owner for a file,
 * rdev: special file identifier,
 * blksize: file system block size,
 * ino: inode number for a file,
 * size: file size in bytes,
 * blocks: blocks allocated for a file,
 * atimeMs: last accessed timestamp in milliseconds,
 * mtimeMs: file modified timestamp in milliseconds,
 * ctimeMs: file status changed timestamp in milliseconds,
 * birthtimeMs: created timestamp in milliseconds,
 * atime: last accessed Date format with timezone information,
 * mtime: file modified Date format with timezone information,
 * ctime: file changed Date format with timezone information,
 * birthtime: file created Date format with timezone information
 * */
export const getStat = async path => {
    //log(path);
    if (typeof path === 'object') return path;
    const _stat = await tryCatch(async () => await stat(path));
    const { err } = _stat;
    //log(_stat);
    if (err) return { err, exists: err.code !== "ENOENT" };
    return _stat;
};

export const
    remove = (str, replace = /[^\w\s]/g) => str.replace(replace, ''),
    getInt = (str, NaN = 0) => parseInt(str?.replace(/\D+/, '')) || NaN,
    getStr = (str) => str.replace(/\d+/, ''),
    findFirstDiff = (str1, str2) => {
        if (str1.length === 0 || str2.length === 0) return "";
        return str2[[...str1].findIndex((el, i) => el !== str2[i])];
    },
    replaceStr = (str, ...trim) => {
        //log('===replaceStr===');
        //log(str);
        //log(trim);
        const reduce = trim.reduce((s, v) => {
            const _isObj = isObj(v),
                keys = _isObj ? v.k() : [];
            //log(v);
            //log(_isObj);
            //log(keys);
            if (_isObj && keys.length > 1) return s = replaceStr(s, ...v.entries().map(e => [e].fromEntries()));
            const k = _isObj ? keys[0] : null;
            //log(k || v);
            //log(k ? v[k] : '');
            return s.replace(k || v, k ? v[k] : '');
        }, str);
        //log(reduce);
        //log('===replaceStr-End===');
        return reduce;
    };

export const sliceTo = (arr, i, joinDiff = ' ') => {
    const end = i + 1;
    if (arr.length === end) return arr;
    //log(i);
    //log(arr);
    const slice = i === 0 ? [arr[i]] : arr.slice(0, end);
    if (joinDiff !== false) slice[i] += joinDiff + arr.slice(end).join(joinDiff);
    //log(slice);
    return slice;
};

const _filter = (v, i) => v;

/* Асинхронный итератор.
Позволяет получать результаты по одному, что лучше подходит для очень больших каталогов.
*/
async function* _getFiles(dir, opts = _opts, filter = _filter) {
    dir = resolve(dir);
    const { recursive } = opts;
    //log(recursive);
    //log(dir);
    const dirents = await getDir(dir, opts);
    //log(dirents);
    const filtered = await getPromises(dirents, filter);
    const direntsF = dirents.filter((v, i) => filtered[i]).sort((a, b) => compare(a.path, b.path));
    //log(filtered);
    //log(direntsF);
    //log(opts);
    for await (const dirent of direntsF) {
        const { path, name } = dirent;
        const f = resolve(path, name);
        const { name: fName, ext } = fileName(f, true, false);
        //log(dirent);
        //log(await isDir(dirent) && recursive);
        //log({ name: _fileName, ext });
        if (await isDir(dirent) && recursive) {
            //yield* _getFiles(f);
        } else {
            yield { f, dir, name, fName, ext };
        }
    }
}

const cbFiles = ({ f, dir, name, fName, ext }) => { };

// Использование изменилось, потому что теперь тип возвращаемого значения — асинхронный итератор, а не обещание
export const getFiles = async (dir, cb = cbFiles, opts = _opts, filter = _filter) => {
    if (!isFn(cb)) {
        opts = cb;
        cb = cbFiles;
        if (isBool(opts)) opts = _opts.assign({ recursive: opts });
    }
    if (isFn(opts)) {
        filter = opts;
        opts = _opts;
    }
    const files = [];
    //log(dir);
    for await (const { f, dir: _dir, name, fName, ext } of _getFiles(dir, opts, filter)) {
        //log(f);
        if (await isDir(f)) continue;
        const fDir = dirName(f);
        const file = { f, dir: fDir, name, fName, ext };
        files.push(file);
        await cb(file);
    }
    return files;
};

export const getVideos = async (dir, cb = cbFiles, opts = _opts, filter = async ({ path, name }) => await isVideo(`${path}\\${name}`)) => {
    if (!isFn(cb)) {
        opts = cb;
        cb = cbFiles;
        if (isBool(opts)) opts = _opts.assign({ recursive: opts });
    }
    if (isFn(opts)) {
        filter = opts;
        opts = _opts;
    }
    return await getFiles(dir, cb, opts, filter);
};

export const execSync = (cmd, cwd = root) => {
    try {
        log(`cwd: ${cwd}\nrun: ${cmd}`);
        const p = $execSync(cmd, { cwd, stdio: 'inherit', encoding: 'utf-8' });
        const { stdout, stderr } = process;
        return stdout;
    } catch (err) {
        error(err.message);
        return err;
    }
};

const cbExec = async (data, e) => data;

const execute = async (p, cmd, std = true, cb = cbExec, cwd = root, resolve, reject) => {
    const { stdout, stderr } = process;
    let out = '';
    if (isFn(std)) {
        cb = std;
        std = true;
    }
    if (std) log(`cwd: ${cwd}\nrun: ${cmd}\nstd: ${std}`);
    p.stdout.setEncoding('utf8');
    p.stderr.setEncoding('utf8');
    const setStd = async (_std, data, e, msg = e) => {
        const isErr = e === 'error';
        if (data && !isStr(data)) data = data.toString();
        //log(`\n===${msg}===`);
        //isErr ? error(data) : log(data);
        ////if (isErr) reject(data);
        //log(`===/${msg}===\n`);
        if (e !== 'exit') {
            const _out = await cb(data, e);
            if (notNull(_out)) {
                out += _out;
                if (std) _std.write(data);
            }
        }
        if (e === 'exit') {
            if (data !== 0) {
                const err = new Error(`Command exited with code: ${data}.`);
                out += err;
                //log(`\n===error-${msg}===`);
                //error(err);
                ////reject(err);
                //log(`===/error-${msg}===\n`);
                _std.write(`\n${err.toString()}\n`);
            }
            resolve(out);
        }
    };
    await p.stdout.on('data', async data => await setStd(stdout, data, 'out', 'stdout'));
    await p.stderr.on('data', async data => await setStd(stderr, data, 'err', 'stderr'));
    await p.on('error', async err => await setStd(stderr, err, 'error'));
    await p.on('exit', async code => await setStd(stderr, code, 'exit'));
};

const executeExec = async (cmd, std = true, cb = cbExec, cwd = root, resolve, reject) => await execute(executor(cmd, { cwd }), cmd, std, cb, cwd, resolve, reject),
    executeSpawn = async (command, std = true, cb = cbExec, cwd = root, resolve, reject) => {
        const [cmd, ...args] = command.split(' ');
        return await execute(spawner(cmd, args, { cwd }), command, std, cb, cwd, resolve, reject);
    };

export const
    exec = async (cmd, std = true, cb = cbExec, cwd = root) => await new Promise(async (resolve, reject) => await executeExec(cmd, std, cb, cwd, resolve, reject)),
    spawn = async (cmd, std = true, cb = cbExec, cwd = root) => await new Promise(async (resolve, reject) => await executeSpawn(cmd, std, cb, cwd, resolve, reject));

// file --mime-type -b "E:\\Convert\\files\\FBS NF 124 (1080P AVC).mp4"
/**
 * Get MIME type with file.exe from Git for Windows (C:\Program Files\Git\usr\bin\file.exe).
 * @param {any} path
 * @returns
 */
export const
    mime = async (path, getExt = false, std = false) => {
        const mm = await exec(`file --mime-type -b "${path}"`, std);
        const [type, ext] = mm.toArr('/');
        return !getExt ? mm : { type, ext }
    },
    isVideo = async (path, std = false) => (await mime(path, true, std)).type === 'video',
    isExe = async (path, std = false) => (await mime(path, true, std)).type === 'application' && ext(path, true) === 'exe';
