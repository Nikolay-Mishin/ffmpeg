import { log } from 'console';
import { resolve } from 'path';
import { fileToArr, getFiles, readFile, writeFile, appendFile, mkdir, sliceTo, min } from './baseHelpers.js';
import { rootDir } from './ffmpeg.config.js';

const mediaInfoOpts = await fileToArr('mediaInfoOpts.txt');
const mediaInfo = await fileToArr('mediaInfo.txt');

const root = `${rootDir}/MediaInfo`;
const resultFile = `${rootDir}/.scan.txt`;
const resultDir = `${root}/out`;

await mkdir(resultDir);

await writeFile(resultFile, '');

const scanDir = async (dir, recursive = true) => {
    await getFiles(dir, async ({f, name, fName}) => {
        //log({ f, name, fName });
        let file = await parseFile(f, name);
        log(fName);
        const diff = getDiff(file);
        log(diff);
        await appendFile(resultFile, `${fName}\r\n${diff}\r\n`);
    }, { recursive });
};

const parseFile = async (res, name) => {
    let file = await readFile(res);
    //log(res);
    //log(file);
    const isParsed = file.includes('\n');
    if (!isParsed) mediaInfoOpts.forEach((prop) => file = file.replace((prop.includes('/') ? '' : '/ ') + prop, (prop === 'frame-threads' ? '' : '\r\n') + prop));
    await writeFile(resolve(resultDir, name), file);
    return file;
};

const getDiff = (data, base = mediaInfo, recursive = true) => {
    const arr = typeof data === 'string' ? data.toArr() : data;
    //log(base);
    //log(arr);
    //log(arr.length);
    let diff = arr.reduce((acc, item, i, arr) => {
        const baseOpt = base[i];
        let result = item === baseOpt ? '' : `${baseOpt} => ${item}\r\n`;
        //log(i);
        //log(baseOpt);
        //log(item);
        //log(item === baseOpt);
        //log(result);
        if (recursive && (baseOpt.match(' /') || item.match(' /'))) {
            const baseList = baseOpt.replace(/ \//g, '\n/').toArr();
            const itemList = item.replace(/ \//g, '\n/').toArr();
            const baseLen = baseList.length;
            const itemLen = itemList.length;
            const _min = min(baseLen, itemLen);
            const max = baseLen === _min ? itemLen : baseLen;
            //log(_min);
            //log(max);
            //log(baseList);
            //log(itemList);
            const baseSlice = sliceTo(baseList, _min - 1);
            const itemSlice = sliceTo(itemList, _min - 1);
            //log(baseSlice);
            //log(itemSlice);
            if (max > 1) result = getDiff(itemSlice, baseSlice, false);
        }
        //log(result);
        return acc + result;
    }, '');
    return diff;
};

await scanDir(root, false);

//log(mediaInfoOpts);
//log(mediaInfo);
//log(mediaInfo.length);
