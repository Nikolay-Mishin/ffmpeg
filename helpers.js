import { log } from 'console';
import { defaultScripts, scripts } from './config.js';
import { setErr, setMsg, getPromises, getDatetime, getPaths, writeFile, appendFile, rm, readFile, isStr, getJSON, exec } from './baseHelpers.js';

export const getScripts = async (path = defaultScripts) => {
    const json = await getJSON(path);
    const { scripts = {} } = json;
    //log(json);
    //log(scripts);
    return scripts;
};

export const getScript = async (name, path = defaultScripts) => {
    const script = (await getScripts(path))[name];
    //log(script);
    return script;
};

export const run = async (name, args, scriptsArg = true, path = defaultScripts, std = true) => {
    const script = await getScript(name, path);
    if (!script) return;
    const cmd = `${script}${!args ? '' : ` ${!scriptsArg ? '' : '-scripts=false '}${args}`}`;
    //log(scripts);
    const out = !scripts ? '' : await exec(cmd, std);
    //log(out);
    return out;
};

const getMode = (test = true, testMir = true, mir = true) => {
    const mode = test ? "Тестовый" : "Синхронизация";
    const modeMir = testMir ? "Тестовый (Зеркалирование)" : (mir ? "Зеркалирование" : null);
    return modeMir ? `${mode} | ${modeMir}` : mode;
};

const getLogMsg = (dateStart, dateFinish, src, dest, changes) => `
    Дата: ${dateStart}
    Исходная директория : ${src}
    Целевая директория : ${dest}
    Режим: ${getMode()}

-------------------------------------------------------------------------------

${changes}

-------------------------------------------------------------------------------

    Дата завершения: ${dateFinish}

-------------------------------------------------------------------------------
-------------------------------------------------------------------------------
-------------------------------------------------------------------------------

`.slice(1);

export const mirDirs = async (destPath, dest, src, testMir = true) => {
    const srcObj = Object.fromEntries(src.map(({ name }, i) => [name, i]));
    const del = dest.filter(({ name }) => srcObj[name] == undefined);
    const delPaths = await getPaths(destPath, del);
    const errDel = [];
    log(del);
    log(delPaths);
    await getPromises(delPaths, async ({ name }) => {
        if (!testMir) {
            const { err } = await rm(name);
            if (err) return errDel.push(setErr(err, name));
        }
        setMsg("Delete", name);
    });
    return errDel.length ? {} : { err: errDel };
};

export const setLog = async (dateNow, dateStart, src, dest, logAppend = true, logPath = '') => {
    let dateFinish = getDatetime();
    if (dateStart == dateFinish) dateFinish += ` (+${Date.now() - dateNow} мс)`;
    const { changes } = setMsg;
    const changesStr = changes.join("\n");
    const logMsg = getLogMsg(dateStart, dateFinish, src, dest, changesStr);

    log(changes);
    log(changesStr);
    log(logMsg);

    logAppend ? await appendFile(logPath, logMsg) : await writeFile(logPath, logMsg);
    setMsg.changes = [];
    log(`----------finish at ${dateFinish}----------`);
};
