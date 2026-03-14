import { log } from 'console';
import { fileToArr, writeFile, mkdir } from './baseHelpers.js';
import { root } from './ffmpeg.config.js';

const filePath = `${root}/FFMetrics.csv`;
const resultFile = `${root}/FFMetrics.txt`;

const data = await fileToArr(filePath, '\n', /"/g);
const opts = data.shift().toArr('\t');
const optsMetrics = opts.slice(0, opts.length - 5);
const optsInfo = opts.slice(-5);

//log(data);
//log(data.length);
//log(opts);
//log(optsMetrics);
//log(optsInfo);

const str = data.map(line => {
    const info = {};
    const lineArr = line.toArr('\t');
    //log(lineArr);
    line = opts.map((opt, i) => {
        //log(`${opt}\t${lineArr[i]}`);
        if (optsInfo.includes(opt)) info[opt] = lineArr[i];
        return `${opt}\t${lineArr[i]}`;
    });
    const { FileSpec, Frame, Bitrate } = info;
    const metrics = line.slice(0, opts.length - 5).join('\r\n');
    log(info);
    log(metrics);
    return `${FileSpec}\r\n${Frame}, ${Bitrate} kb/s\r\n${metrics}\r\n`;
}).join('\r\n');

log(str);

await writeFile(resultFile, str);
