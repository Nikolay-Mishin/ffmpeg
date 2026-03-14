import { log } from 'console';
import { resolve } from 'path';
import {
    parseFloat, getInt, getStr, setEnv, exec, fileName, appendFile, getEnv, copyFile, appendFiles, dirName, isPath, writeFile, mkdir, isArr, isObj, isStr, ext, replaceStr, isRe, isFile,
    fileToArr
} from './baseHelpers.js';
import {
    reportDir, logDir, FFreportFile, setMetrics, ffreportDir, setReport, fps,
    mkvMergeRoot, ffmpeg_a_dir as $ffmpeg_a_dir, lang_remove as $lang_remove, codec_remove as $codec_remove, rm_und_a, aReport, mkvExt,
    format_space, vf_space, vf_range, scale_space, chroma_loc, vf_in, scale_range, scale_m, out_scale_m, FFreportCopy, FFreportCopyLog, execute,
    c_range, c_chroma, m_sar, m_dar, vf_sar, vf_dar, setSpace, vf_flags, c_space, p_space, vf_ispace, m_fps
} from './ffmpeg.config.js';
import { miOpts, size } from './mi.js';
import preset, { isNV } from './presets.js';

const fpsList = {
    'ntsc': '30000/1001',
    'pal': '25/1',
    'qntsc': '30000/1001',
    'qpal': '25/1',
    'sntsc': '30000/1001',
    'spal': '25/1',
    'film': '24/1',
    'ntsc_film': '24000/1001', // ntsc-film
    'ntsc_60': '60000/1001', // ntsc-film
    'youtube_60': '60/1'
};
const { ntsc_film, film, pal, ntsc, ntsc_60, youtube_60 } = fpsList;

const rList = {
    [fps]: ntsc_film,
    24: film,
    25: pal,
    29.97: ntsc,
    59.94: ntsc_60,
    60: youtube_60
};

const reportPostfix = type => { const i = getInt(type); return i ? `-${i}` : ''; },
    mkvMergeDir = path => `${dirName(path)}\\${mkvMergeRoot}`;

export const
    wList = [720, 1280, 1920],
    hList = [360, 400, 480, 576, 720, 1080],
    getR = (r = fps) => rList[parseFloat(r)] || rList[fps],
    ffOpts = [
        '-hide_banner', '-lavfi', '[1:v]', '[main][ref]',
        '-map', '-metadata', '-c copy', '-c:v', '-pix_fmt', '-sar', '-fps_mode', '-color_range', '-filter:v', '-vsync', '-vf', '-filter:a', '-af', '-bsf:v', '-filter_complex',
        '-crf', '-qp', '-b:v', '-preset', '-x264-params', '-x265-params', '-t ', '-c:a', '-c:s', '-y'
    ],
    cmdLog = cmd => {
        cmd = cmd.replace(/-threads (\d+)/, '\n\t-threads $1').replace(/-r (\d+)/g, '\n\t-r $1').replace(/-f (.+)/, '\n\t-f $1');
        if (!/-r .+ -i/g.test(cmd)) cmd = !/-i .+ -i/g.test(cmd) ? cmd.replace(/-i (.+)/g, '\n\t-i $1') : cmd.replace(/-i (.+) (-i .+)/g, '\n\t-i $1\n\t$2');
        ffOpts.forEach(s => cmd = cmd.replace(s, `\n\t${s}`));
        if (!cmd.includes('-y')) cmd = cmd.replace(/("\w+:.+"$)/, '\n\t$1');
        return cmd;
    },
    reportPath = (type, dir = reportDir, isLog = false) => {
        const path = `${dir}/${getStr(type)}_report${reportPostfix(type)}.txt`;
        const filePath = dir === '' ? path.replace('/', '') : path;
        return isLog ? filePath.replace('report', 'logfile') : resolve(filePath);
    },
    logPath = (type, dir = logDir) => reportPath(type, dir, true),
    ffmpeg_a_dir = (path, dir = $ffmpeg_a_dir) => `${dirName(path)}\\${dir}`,
    ffTypes = { 'ff': 'out', 'crop': 'cropdetect' },
    setFFReport = async (file, lvl = 32) => setEnv('FFREPORT', `file='${file}':level=${lvl}`),
    isMkv = ext => mkvExt.includes(ext),
    lang_remove = l => (rm_und_a && !l) || $lang_remove.includes(l),
    codec_remove = c => $codec_remove.includes(c),
    map_remove = (l, c) => lang_remove(l) || codec_remove(c),
    map_filter = (l, c) => !lang_remove(l) && codec_remove(c),
    ffprobe = async (path, args = '') => await exec(`ffprobe -v error -show_streams "${path}" ${args}`, false),
    ffError = async path => (await ffprobe(path, '| grep error')).replace(/Error: Command exited with code: .+\./, '').toArr().filter(el => el !== ''),
    ffColor = async path => {
        const errors = [];
        const setError = e => { errors.push(e); return errors; };
        const colors = await ffprobe(path, '| grep -E "color|chroma"');
        const replace = el => el === 'unknown' ? undefined : el.replace('color_', '').replace('transfer', 'trc').replace('chroma_location', 'chroma').replace('tv', 'limited');
        const colorsObj = colors.toArr().map(s => !/\w+=.+/.test(s) ? ['errors', setError(s)] : s.toArr('=').map(replace)).fromEntries();
        const { range, primaries, trc, space, chroma } = colorsObj;
        const _ffColor = { range, primaries, trc, space, chroma };
        //log(colors);
        //log(colorsObj);
        return _ffColor;
    },
    getColor = color => color.entries().map(([k, v]) => `${k}: ${k === 'errors' ? v.length : v || null}`).join(', ').replace('limited', 'tv'),
    aCodecs = a => a.map(({ format, lang, b, b_max }) => `${format} (${lang || 'und'}, ${b_max || b})`).join(', '),
    mkvpropedit = async (path, args) => await exec(`mkvpropedit -v "${resolve(path)}" ${args}`),
    mkvAddTags = async path => { const _ext = ext(path, true); return _ext !== 'mkv' ? `ext: ${_ext}` : await mkvpropedit(resolve(path), `--add-track-statistics-tags`); },
    mkvAddAtt = async (path, a) => await mkvpropedit(resolve(path), `--add-attachment "${a}"`),
    mkvReplaceAtt = async (path, i, a) => await mkvpropedit(resolve(path), `--replace-attachment ${i}:"${a}"`),
    mkvMerge = async path => {
        const json = JSON.parse(await exec(`mkvmerge -v -i "${resolve(path)}" -F json`, false));
        const { file_name: file, chapters } = json;
        const { name, ext } = fileName(file, true, false, true);
        const tracks = json.tracks.map(({ id, properties: { track_name, codec_id }, type, codec }) => {
            const isVideo = type === 'video';
            track_name = isVideo && track_name === 'Original' ? '' : `.${track_name.replace('.', '_')}`;
            type = isVideo ? ext : (type === 'audio' ? codec : codec_id.replace(/.+\/(.+)/, '$1')).lower();
            return `${id}:${name}${track_name}.${type}`;
        });
        const attachments = json.attachments.map(({ id, file_name }) => `${id}:${file_name}`);
        //log(file);
        //log(t);
        //log(a);
        //log(chapters);
        const out = { file, name, ext, tracks, attachments, chapters };
        //log(out);
        return out;
    },
    mkvExtract = async (path, type, args) => await exec(`mkvextract -v "${resolve(path)}" ${type} ${args}`),
    mkvExtTrack = async (path, i, t) => await mkvExtract(path, 'tracks', `${i}:"${t}"`),
    mkvExtAtt = async (path, i, a) => await mkvExtract(path, 'attachments', `${i}:"${a}"`),
    mkvExtCh = async (path, out, opts = null) => await mkvExtract(path, 'chapters', `${opts ? `${opts} ` : ''}"${out}"`),
    mkvExtTag = async (path, out, opts = null) => await mkvExtract(path, 'tags', `${opts ? `${opts} ` : ''}"${out}"`),
    mkvExtArr = async (path, type, arr, o) => {
        if (isStr(arr)) o = arr;
        if (!isArr(arr)) arr = (await mkvMerge(path))[type];
        if (!o) o = mkvMergeDir(path);
        await mkdir(o);
        //log(path);
        //log(type);
        //log(arr);
        //log(o);
        const out = [];
        arr = arr.map(i => { out.push(i.replace(/(\d+):(.+)/, `${o}\\$2`)); return i.replace(/(\d+):(.+)/, `$1:"${o}\\$2"`); });
        //log(arr);
        await mkvExtract(path, type, arr.join(' '));
        return out;
    },
    mkvExtAll = async (path, obj, o) => {
        const types = ['tracks', 'attachments'];
        if (!isObj(obj)) {
            o = obj;
            obj = await mkvMerge(path);
        }
        if (!o) o = mkvMergeDir(path);
        for await (const [k, v] of obj.entries()) {
            log([k, v]);
            if (types.includes(k)) obj[k] = await mkvExtArr(path, k, v, o);
        }
        //log(obj);
        return obj;
    },
    mkvExtTracks = async (path, o) => await mkvExtArr(path, 'tracks', o),
    mkvExtAttList = async (path, o) => await mkvExtArr(path, 'attachments', o);

export const checkTags = ({ v: { b }, a, s }) => b === 0 || a.find?.(({ b }) => b === 0) || s.find?.(({ b }) => b === 0);

/**
 * 
 * @param {Array|object} mi
 * @returns
 */
export const setTags = async (...mi) => {
    //log(mi);
    //log(isArr(mi));
    //log(mi.length === 1);
    if (mi.length === 1) mi = mi[0];
    if (await isFile(mi)) mi = await miOpts(mi);
    //log(mi.length === 1);
    //log(mi);
    if (isArr(mi)) {
        let i = 0;
        const miList = [];
        for await (const m of mi) { miList.push(await setTags(m)); i++; }
        return miList;
    }
    log('>>> setTags');
    const { v: { i } } = mi;
    const addTags = checkTags(mi);
    //log(i);
    //log(addTags);
    if (addTags) {
        if (execute) await mkvAddTags(i);
        mi = await miOpts(i);
        //log(mi);
    }
    return mi;
};

export const mkvReport = async (i) => {
    const { o, s, fc: fc_o, fps_mode, fps_mode_i, fr: fps_o, ffColor: color } = i;
    const str = i.mkvReportStr = await mkvAddTags(o);
    const data = str.toArr();
    i.mkvReport = data[data.length - 2];
    const out = await miOpts(o),
        { v: { fps_mode: fps_mode_o, fr }, a } = out;
    const { s: _s } = i.s = await size(o, 1);
    i.s.s += ' KB';
    i.s.b += ' kb/s';
    i.s.assign({ c: `${parseFloat(_s / parseInt(s / 1024) * 100, 3)}%` });
    i.s.fc_o = fc_o;
    i.s.fps_mode = fps_mode.replace(/-fps_mode (.+) /, '$1');
    i.s.fps_mode_i = fps_mode_i;
    i.s.fps_o = fps_o;
    i.s.fps_mode_o = fps_mode_o;
    i.s.fps = fr;
    i.s.color = color;
    i.s.out_color = await ffColor(o);
    i.aCodecsOut = await aCodecs(a);
    //log(i);
    //log(out);
    //log(str);
    //log(data);
    //log(i.mkvReport);
    //log(inputMI);
    //log(i.s);
    return i;
};

export const copyReport = async (i, out, map) => {
    //log(i);
    //log(o);
    const { o, logStr } = out;
    if (!await isFile(o)) throw new Error(`Output file not exist: ${o}`);
    const { g: { b: gb }, v: { b }, a, s } = await miOpts(i);
    const { g: { b: gb1 }, v: { b: b1 }, a: a1, s: s1 } = await miOpts(o);
    const join = (a, old) => a.map(({ title, b, default: def, forced }, i) => `${title} (${old[i].b} => ${b}, ${def}, ${forced})`).join(', ');
    let report = `${i}\n`;
    report += `[i_aCodecs] ${aCodecs(a)}\n`;
    report += `[o_aCodecs] ${aCodecs(a1)}\n`;
    report += `[g] ${gb} => ${gb1}\n`;
    report += `[b] ${b} => ${b1}\n`;
    report += `[a] ${join(a1, a)}\n`;
    report += `[s] ${join(s1, s)}\n`;
    if (map) report += `[m] ${map}\n`;
    report += '\n';
    //log({ b, a, s });
    //log({ b: b1, a: a1, s: s1 });
    //log(FFreportCopy);
    //log(aCodecs(a1));
    log(report);
    if (setReport) {
        await appendFile(FFreportCopy, report);
        await appendFile(FFreportCopyLog, `${i}\n${logStr}\n\n`);
    };
};

export const getReportInfo = async (type, copy = true, i = {}) => {
    const { i: input, o, setFFmpeg, report, reportFile, logFile, logStr, mkvReport, s, ext, aCodecs, aCodecsOut } = i;
    const { ext: ext_p } = preset;
    const isFF = ffTypes.k().includes(type);
    const isFFmpeg = type === 'ff';
    //log(i);
    //log(type);
    //log(copy);
    //log(isFF);
    //log(isFFmpeg);
    //log(setFFmpeg);
    const resultFile = isFF ? report : reportPath(type);
    type = isFF ? ffTypes[type] : type.upper();
    //log(resultFile);
    //log(type);
    const data = await fileToArr(resultFile);
    //log(data);
    const reportLine = data.filter(v => v.includes('Parsed') || (isFFmpeg && (v.includes('encoded') || v.includes('frame=')))).join('\n');
    const reportArr = reportLine.toArr(getStr(type));
    const reportInfo = { [type]: isFFmpeg ? reportLine : reportArr.pop() };
    //log(reportLine);
    //log(reportArr);
    //log(reportInfo);
    const _type = Object.keys(reportInfo)[0];
    const v = reportInfo[_type].trimFirst();
    //log({_type, v});
    //log(type);
    log(resultFile);
    //log(reportFile);
    //log(logFile);
    if (setReport) {
        if (setFFmpeg) await appendFiles(`${o}\n`, reportFile, logFile);
        if (reportFile) await appendFile(reportFile, `${setFFmpeg ? '' : `${_type}: `}${v}\n`);
        if (aReport) {
            await appendFile(reportFile, !setFFmpeg ? '' : `[i_aCodecs] ${aCodecs}\n`);
            await appendFile(reportFile, !setFFmpeg ? '' : `[o_aCodecs] ${aCodecsOut}\n`);
        }
        if (s) {
            const _ext = ext => ext.upper();
            await appendFile(reportFile, !setFFmpeg ? '' : `[fps] ${_ext(ext)} => ${_ext(ext_p)} fps_mode: ${s.fps_mode}, ${s.fps_mode_i} => ${s.fps_mode_o}, ${s.fps_o} => ${s.fps}\n`);
            await appendFile(reportFile, !setFFmpeg ? '' : `[i_color] ${getColor(s.color)}\n`);
            await appendFile(reportFile, !setFFmpeg ? '' : `[o_color] ${getColor(s.out_color)}\n`);
        }
        if (mkvReport) await appendFile(reportFile, !setFFmpeg ? '' : `[mkvpropedit] ${mkvReport}\n`);
        if (s) await appendFile(reportFile, !setFFmpeg ? '' : `[mi] s: ${s.s}, b: ${s.b}, c: ${s.c}, fc_o: ${s.fc_o}\n`);
        if (logFile) await appendFile(logFile, `${setFFmpeg ? '' : `FFREPORT=${getEnv('FFREPORT')}\n`}${logStr}\n`);
        if (setFFmpeg) await appendFiles('\n', reportFile, logFile);
        if (copy) {
            const file = `${setFFmpeg ? `${ffreportDir}/${fileName(o, true)}.txt` : resultFile.replace('reports', 'reports\\logs')}`.replace('report-', '').replace('_report', '_0');
            const reportName = fileName(file);
            const reportCopy = setFFmpeg ? file : file.replace(reportName, `${fileName(input, true)}-${reportName}`);
            //log(file);
            log(reportCopy);
            await copyFile(resultFile, reportCopy);
        }
    }
    log(s);
    return reportInfo;
};

export const parseReport = async (reportFile) => {
    log(reportFile);
    const data = await fileToArr(reportFile);
    //log(data);
    const dataObj = {};
    let k;
    data.forEach(line => {
        const _isPath = isPath(line);
        if (_isPath) {
            k = line;
            dataObj[k] = dataObj[k] || [];
        } else if (line !== '') {
            dataObj[k].push(line);
        }
    });
    //log(dataObj);
    let str = '';
    Object.keys(dataObj).forEach(k => str += `${k}\n${dataObj[k].join('\n')}\n\n`);
    //log(str);
    await writeFile(reportFile, str);
    return str;
};

export const parseReports = async (...reports) => { for await (const r of reports) await parseReport(r); };

export const getCrop = async (i) => {
    // [Parsed_cropdetect_0 @ 00000000003d4740] x1:0 x2:399 y1:17 y2:232 w:400 h:208 x:0 y:22 pts:127488 t:9.960000 crop=1920:800:0:2 // w:h - 1920:804
    const file = FFreportFile.replace('report', 'report-crop');
    setFFReport(file);
    const { cropdetect: crop } = await getReportInfo('crop', false, { report: file });
    //log(getEnv('FFREPORT'));
    //log(crop);
    return crop.replace(/.+(crop=.+)/, '$1');
};

const re = /:/g;

export const
    getFormat = (format, withLe = false) => { format = format.replace(/pix_fmts=(.+)/, '$1'); return withLe ? format : format.replace('le', ''); },
    // ColorSpace: 'YUV', ChromaSubsampling: '4:2:0', BitDepth: '10' => 'yuv420p10' => 'yuv420p10le'
    setFormat = (space, chroma, bit) => {
        space = space.lower();
        bit = getInt(bit, 8);
        const format = `${!setMetrics ? '' : 'format='}pix_fmts=${space === 'yuv' ? space : ''}${chroma.replace(re, '')}p${bit === 8 ? '' : bit}${bit === 10 ? 'le' : ''}`;
        //log(format);
        //log(!isNV && bit === 10);
        //log(format.replace('(pix_fmts)=.+', '$1=p010le'));
        return isNV && bit === 10 ? format.replace(/(pix_fmts)=.+/, '$1=p010le') : format;
    },
    getFlags = (flags = vf_flags) => `flags=${flags}${flags !== 'lanczos' ? '' : ':param0=3'}`,
    // scale=1920x1080:flags=bicubic,format=pix_fmts=yuv420p10,fps=fps=23.976
    setFilter = (format, fps, scale, space = '', flags = vf_flags, sar = false, dar = false) => {
        const _sar = !sar ? '' : `,setsar=${sar}`;
        const _dar = !dar ? '' : `,setdar=${dar}`;
        const _fps = !fps ? '' : `fps=${fps},`;
        return `${format}${format === '' ? '' : ','}${_fps}scale=${scale}:${getFlags(flags)}${space}${_sar}${_dar}`;
    },
    setPrefixLavfi = (endall, filter = '', filter1 = '', noScale = true) => {
        const prefix = !endall ? '' : ',';
        return !endall ? (noScale ? `${filter}${filter1}` : `${filter}[main];[main]`) :
            `[0:v]settb=AVTB,setpts=PTS-STARTPTS${filter === '' ? '' : prefix}${filter}[main];[1:v]settb=AVTB,setpts=PTS-STARTPTS${filter1 === '' ? '' : prefix}${filter1}[ref];[main][ref]`;
    },
    getBsf = (range, primaries, trc, space, chroma) => {
        // Mark the video as BT.709 "TV range" (Limited range) using bsf filter
        const [rangeType, primariesType, trcType, spaceType, chromaLocType] = [getRange(range), getPrimaries(primaries), getTrc(trc), getSpaceMatrix(space), getChromaLoc(chroma)];
        const rangeFlag = `video_full_range_flag=${rangeType === 2 ? 1 : 0}`;
        const c_primaries = `colour_primaries=${primariesType}`;
        const c_trc = `transfer_characteristics=${trcType}`;
        const c_space = `matrix_coefficients=${spaceType}`;
        const bsf_chroma = !chroma_loc ? '' : `:chroma_sample_loc_type=${chromaLocType}`;
        return { c_bsf: `${rangeFlag}:${c_primaries}:${c_trc}:${c_space}${bsf_chroma}`, rangeType, primariesType, trcType, spaceType, chromaLocType };
    },
    newParam = (s, p, replace) => s.replace(p, replace),
    getParam = (old, v, p) => {
        const s = ` -${old} `,
            param = `${s}${v}`;
        return !p ? param : newParam(param, s, `:${p}=`);
    },
    setParam = (con, v) => !con ? '' : v,
    getChroma = (chroma = default_chroma, p) => getParam('chroma_sample_location', chroma, p),
    getPrimP = (prim, p) => getParam('color_primaries', prim, p),
    getTrcP = (trc, p) => getParam('color_trc', trc, p),
    getSpaceP = (space, p) => getParam('colorspace', space, p),
    // colorspace=irange=tv:iprimaries=bt709:itrc=bt709:ispace=bt709:range=tv:primaries=bt709:trc=bt709:space=bt709:fast=0
    setColorspace = (i, format, fast = 0) => {
        const { h, space: _space, chroma: _chroma, bit, ffColor, sar, dar } = i;
        //log(i);
        if (setMetrics) {
            log(ffColor);
            if (!scale_m) return { space: '', colorspace: '' };
        }
        const { range: irange, primaries: iprimaries = null, trc: itrc = null, space: ispace = null, chroma = default_chroma } = ffColor;
        if (!format) format = setFormat(_space, _chroma, bit);
        const { range = default_range, primaries = default_primaries(h), trc = default_trc, space = default_matrix(h) } = ffColor;
        const _ffColor = { range, primaries, trc, space, chroma };
        const setChroma = (p, con = c_chroma) => setParam(con, getChroma(chroma, p));
        const setPrim = (p, con = c_space/* && iprimaries*/) => setParam(con, getPrimP(primaries, p));
        const setTrc = (p, con = c_space/* && itrc*/) => setParam(con, getTrcP(trc, p));
        const setCspace = (p, con = c_space/* && ispace*/) => setParam(con, getSpaceP(space, p));
        const chromaLoc = setChroma();
        // -color_range tv -color_primaries bt709 -color_trc bt709 -colorspace bt709 -chroma_sample_location left`
        const cRange = !c_range ? '' : `-color_range ${range}${setPrim()}${setTrc()}${setCspace()}${chromaLoc} `;
        const in_range = !vf_in ? '' : `:in_range=${range}:in_color_matrix=${space}:in_chroma_loc=${chroma_loc}`;
        const _scale_range = !scale_range ? '' : `:out_range=${range}${setCspace('out_color_matrix', scale_space/* && ispace*/)}${setChroma('out_chroma_loc', chroma_loc)}`;
        const out_range = !vf_range ? '' : `${in_range}${_scale_range}`;
        // -vf "colorspace=format=yuv420p10:irange=tv:iprimaries=bt709:itrc=bt709:ispace=bt709:range=tv:primaries=bt709:trc=bt709:space=bt709:fast=0"
        const range_space = range.replace('limited', 'tv');
        const _format_space = !format_space ? '' : `${setMetrics ? '' : 'format='}${getFormat(format)}`;
        const _irange = irange ? '' : `:irange=${range_space}`;
        const _iprimaries = setPrim('iprimaries', !iprimaries);
        const _itrc = setTrc('itrc', !itrc);
        const _ispace = setCspace('ispace', !ispace);
        const _oprimaries1 = setPrim('primaries', !iprimaries);
        const _otrc1 = setTrc('trc', !itrc);
        const _ospace1 = setCspace('space', !ispace);
        const _oprimaries = setPrim('primaries', iprimaries)/* || _oprimaries1*/;
        const _otrc = setTrc('trc', itrc)/* || _otrc1*/;
        const _ospace = setCspace('space', ispace)/* || _ospace1*/;
        const set_vf_space = itrc && iprimaries && ispace;
        const in_space = !vf_ispace && set_vf_space ? '' : `${_irange}${_iprimaries}${_itrc}${_ispace}`;
        const colorspace = !(vf_space && set_vf_space) ? '' : `,colorspace=${_format_space}${in_space}:range=${range_space}${_oprimaries}${_otrc}${_ospace}:fast=${fast}`;
        const { c_bsf, chromaLocType } = getBsf(range, primaries, trc, space, chroma);
        // -x265-params "range=limited:colorprim=bt709:transfer=bt709:colormatrix=bt709:chromaloc=0"
        const _pprimaries = setPrim('colorprim', p_space && iprimaries);
        const _ptrc = setTrc('transfer', p_space && itrc);
        const _pspace = setCspace('colormatrix', p_space && ispace);
        const c_params = !setSpace ? '' : `range=${range}${_pprimaries}${_ptrc}${_pspace}:chromaloc=${chromaLocType - 1}`;
        const sarV = !((setMetrics && m_sar) || (!setMetrics && vf_sar)) ? '' : `,setsar=${sar}`;
        const darV = !((setMetrics && m_dar) || (!setMetrics && vf_dar)) ? '' : `,setdar=${dar}`;
        const vf = out_range + sarV + darV + colorspace;
        //log(_ffColor);
        //log(chromaLoc);
        //log(colorspace);
        //log(c_bsf);
        //log(c_params);
        //log(sarV);
        //log(darV);
        //log(vf);
        return { cRange, ffColor: _ffColor, space: vf, out_range, colorspace, format, range, primaries, trc, matrix: space, chroma, chromaLoc, c_bsf, c_params };
    },
    getSpace = (i, format, fast = 0) => setColorspace(i, format, fast).space,
    getColorspace = (i, format, fast = 0) => setColorspace(i, format, fast).colorspace;

export const getPrefixLavfi = (i, o = {}) => {
    //log(i);
    //log(o);
    //if (!o) o = i;
    const { parse, setFFmpeg } = i;
    const endall = parse >= 3;
    const { w, h, space, chroma, bit, fps, setR, fps_mode, fr } = i;
    const { w: w1, h: h1, space: space1, chroma: chroma1, bit: bit1, fps: fps1, fps_mode: fps_mode1, fr: fr1 } = o;
    const noScale = w === w1 && h === h1;
    //log({ w, h, space, chroma, bit, fps, fr, fps_mode });
    //log({ w1, h1, space1, chroma1, bit1, fps1, fr1, fps_mode1 });
    const scale = `${w1 || w}:${h1 || h}`; // w:h | WxH
    const format = parse >= 5 || setFFmpeg ? setFormat(space, chroma, bit) : '';
    const format1 = parse >= 5 ? setFormat(space1, chroma1, bit1) : '';
    const _fps = !m_fps ? null : fps;
    const filter = parse >= 4 || !noScale ? setFilter(format, _fps, scale, !out_scale_m ? '' : getSpace(i, format)) : parse === 2 ? `[0:v]fps=${fps}[main];` : '';
    const filter1 = setMetrics && (parse === 6 || !noScale) ? setFilter(format1, _fps, scale, getSpace(o, format1)) : parse === 2 ? `[1:v]fps=${fps}[ref];[main][ref]` : '';
    return setPrefixLavfi(endall, filter, filter1, noScale);
};

export const getLavfi = (i, o) => {
    const { type, parse, r } = i;
    //log(type);
    //log(i);
    //log(o);
    if (!type) return '';
    const { i: original } = o;
    const fftype = getStr(type);
    const vmaf = fftype.includes('vmaf');
    const endall = parse >= 3;
    const prefixLavfi = getPrefixLavfi(i, o);
    const vmaffi = !vmaf ? '' : ':n_threads=32:pool=Mean:model=version=vmaf_v0.6.1';
    const lavfi = `${prefixLavfi}${vmaf ? `lib${fftype}` : fftype}=${!endall ? '' : 'eof_action=endall:'}${vmaf ? 'log_path' : 'stats_file'}='${logPath(type).replace(':', '\\:')}'${vmaffi}`;
    return `${r}-i "${original}" -lavfi "${lavfi}" -f null -`;
};

export const getVBV = (i, def = true) => {
    const { params, b, b_max, b_mode } = i;
    const paramsList = params?.toArr(' / ') || [],
        pass2 = (paramsList.find(p => /rc=2pass/.test(p))) ? true : false,
        bs = (paramsList.find(p => /vbv_bufsize=(\d+)/.test(p)) || '').replace(/vbv_bufsize=(\d+)/, '$1'),
        maxrate = (paramsList.find(p => /vbv_maxrate=(\d+)/.test(p)) || '').replace(/vbv_maxrate=(\d+)/, '$1');
    //log(params);
    //log(paramsList);
    //log(pass2);
    //log(b);
    //log(b_max);
    //log(bs === params);
    //log(maxrate === params);
    //log(bs);
    //log(maxrate);
    return {
        b, pass2,
        bs: bs === '' ? (def || b_mode === 'vbr' ? b : 0) : getInt(bs),
        b_max: maxrate === '' ? (def && b_max === 0 ? b : b_max) : getInt(maxrate)
    };
};

export const
    params_trim = [/fade_compensate=\d\.\d+ \/ /, /mixed_ref=\d \/ /, /8x8dct=\d \/ /, /cqm=\d \/ /, /deadzone=\d+,\d+ \/ /, /chroma_qp_offset=-?\d+ \/ /, /lookahead_threads=\d+ \/ /, /sliced_threads=\d+ \/ /, /nr=\d \/ /, /decimate=\d \/ /, /interlaced=\d \/ /, /bluray_compat=\d \/ /, /fgo=\d \/ /, /weightb=\d \/ /, /open_gop=\d \/ /, /weightp=\d \/ /, /keyint=\d+ \/ /, /keyint_min=\d+ \/ /, /scenecut=\d+ \/ /, /intra_refresh=\d \/ /, /rc=\w+ \/ /, /mbtree=\d \/ /, /crf=\d+\.\d \/ /, /bitrate=\d+ \/ /, /ratetol=\d+\.\d \/ /, /qpmin=\d+ \/ /, /qpmax=\d+ \/ /, /qpstep=\d+ \/ /, /cplxblur=\d+\.\d \/ /, /qblur=\d\.\d \/ /, /crf_max=\d+\.\d \/ /, /nal_hrd=\w+ \/ /, /filler=\d \/ /, /ip_ratio=\d\.\d+ \/ /, /pb_ratio=\d\.\d+ \/ /]
        .map(v => isRe(v) ? v : `${v} / `),
    trimParams = (params, ...trim) => replaceStr(params, ...trim),
    getParams = (params, ...replace) => trimParams(params, ...replace).replaceAll(' / ', ':'),
    getTrimParams = (params, ...replace) => getParams(params, ...replace, ...params_trim),
    //[JamClub] Tsue to Tsurugi no Wistoria - 11 [1080p].mp4
    h264_params_base0 = 'cabac=1 / ref=4 / deblock=1:1:1 / analyse=0x3:0x113 / me=hex / subme=4 / psy=1 / psy_rd=0.40:0.00 / mixed_ref=0 / me_range=16 / chroma_me=1 / trellis=1 / 8x8dct=1 / cqm=0 / deadzone=21,11 / fast_pskip=1 / chroma_qp_offset=0 / threads=34 / lookahead_threads=8 / sliced_threads=0 / nr=0 / decimate=1 / interlaced=0 / bluray_compat=0 / constrained_intra=0 / bframes=1 / b_pyramid=0 / b_adapt=1 / b_bias=0 / direct=1 / weightb=1 / open_gop=0 / weightp=1 / keyint=240 / keyint_min=23 / scenecut=40 / intra_refresh=0 / rc_lookahead=20 / rc=crf / mbtree=1 / crf=16.0 / qcomp=0.60 / qpmin=0 / qpmax=69 / qpstep=4 / vbv_maxrate=8000 / vbv_bufsize=6500 / crf_max=0.0 / nal_hrd=none / filler=0 / ip_ratio=1.40 / aq=1:0.60'
        .replace('me=hex', 'me=1'),
    //Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv
    h264_params_base1 = replaceStr(h264_params_base0, {
        'subme=4': 'subme=8',
        'mixed_ref=0': 'mixed_ref=1',
        'trellis=1': 'trellis=2',
        'chroma_qp_offset=0': 'chroma_qp_offset=-2',
        'threads=34': 'threads=32',
        'lookahead_threads=8': 'lookahead_threads=5',
        'bframes=1 / b_pyramid=0 / b_adapt=1 / b_bias=0': 'bframes=0',
        'direct=1 / ': '',
        'weightb=1 / open_gop=0 / weightp=1': 'weightp=2',
        'keyint=240': 'keyint=96',
        'keyint_min=23': 'keyint_min=48',
        'rc_lookahead=20': 'rc_lookahead=48',
        'rc=crf': 'rc=2pass',
        'crf=16.0': 'bitrate=8000 / ratetol=1.0',
        'qpstep=4': 'qpstep=4 / cplxblur=20.0 / qblur=0.5',
        'vbv_maxrate=8000': 'vbv_maxrate=12000',
        'vbv_bufsize=6500': 'vbv_bufsize=18000',
        'crf_max=0.0 / ': ''
    }),
    //[AniDub] Maken-ki! [01] [BDrip1080p x264 FLAC] [Ancord].mkv
    h264_params_base2 = replaceStr(h264_params_base0, {
        'deblock=1:1:1': 'deblock=1:-2:-2',
        'analyse=0x3:0x113': 'analyse=0x3:0x133',
        'me=1': 'me=2', // umh
        'subme=4': 'subme=9',
        'psy_rd=0.40:0.00': 'fade_compensate=0.00 / psy_rd=0.90:0.00',
        'mixed_ref=0': 'mixed_ref=1',
        'me_range=16': 'me_range=24',
        'trellis=1': 'trellis=2',
        'chroma_qp_offset=0': 'chroma_qp_offset=-2',
        'threads=34': 'threads=32',
        'lookahead_threads=8 / ': '',
        'decimate=1': 'decimate=0',
        'constrained_intra=0': 'constrained_intra=0 / fgo=0',
        'bframes=1 / b_pyramid=0 / b_adapt=1': 'bframes=8 / b_pyramid=2 / b_adapt=2',
        'weightp=1': 'weightp=2',
        'keyint=240': 'keyint=250',
        'keyint_min=23': 'keyint_min=23',
        'rc_lookahead=20 / ': '',
        'mbtree=1': 'mbtree=0',
        'qpmin=0': 'qpmin=9',
        'qpmax=69': 'qpmax=50',
        'vbv_maxrate=8000 / ': '',
        'vbv_bufsize=6500 / ': '',
        'crf_max=0.0 / nal_hrd=none / filler=0 / ': '',
        'ip_ratio=1.40': 'ip_ratio=1.40 / pb_ratio=1.30',
        'aq=1:0.60': 'aq=1:0.90'
    }),
    h264_params_default = getTrimParams(h264_params_base0, { 'subme=4': 'subme=8', 'trellis=1': 'trellis=2', 'vbv_maxrate=8000 / ': '', 'vbv_bufsize=6500 / ': '' }),
    h264_params_default1 = getTrimParams(h264_params_base1, { 'vbv_maxrate=12000 / ': '', 'vbv_bufsize=18000 / ': '' }),
    h264_params_default2 = getTrimParams(h264_params_base2),
    h264_params = (params, cabac = 'Yes', ref = 4) => !params ? h264_params_default :
        getTrimParams(params, { 'cabac=1': `cabac=${cabac === 'Yes' ? 1 : 0}`, 'ref=4': `ref=${ref}` });

//log(h264_params_base0);
//log(h264_params_base1);
//log(h264_params_base2);
//log(h264_params_default);
//log(h264_params_default1);
//log(h264_params_default2);
//log(h264_params());

export const
    default_range = 'limited', // limited|tv
    default_space = 'bt709',
    default_primaries = h => h < 720 ? 'smpte170m' : h < 480 ? 'bt470bg' : default_space,
    default_trc = default_space,
    default_matrix = h => h < 720 ? 'smpte170m' : default_space,
    default_chroma = 'left';

const c_opts = {
    range: { // color_range | Color range | --range
        unknown: 0,
        tv: 1,
        pc: 2,
        unspecified: 0,
        mpeg: 1,
        jpeg: 2,
        limited: 1,
        full: 2
    },
    primaries: { // color_primaries | Color primaries | --colorprim
        bt709: 1, // 1080p, 720p
        unknown: 2,
        bt470m: 4,
        bt470bg: 5, // 360p
        smpte170m: 6, // 576p, 480p
        smpte240m: 7,
        film: 8,
        bt2020: 9,
        smpte428: 10,
        smpte428_1: 10,
        smpte431: 11,
        smpte432: 12,
        'jedec-p22': 22,
        ebu3213: 22,
        unspecified: 2
    },
    trc: { // color_trc | Transfer characteristics | --transfer
        bt709: 1, // 1080p, 720p
        unknown: 2,
        gamma22: 4,
        gamma28: 5,
        smpte170m: 6,
        smpte240m: 7,
        linear: 8,
        log100: 9,
        log316: 10,
        'iec61966-2-4': 11,
        bt1361e: 12,
        'iec61966-2-1': 13,
        'bt2020-10': 14,
        'bt2020-12': 15,
        smpte2084: 16,
        smpte428: 17,
        'arib-std-b67': 18,
        unspecified: 2,
        log: 9,
        log_sqrt: 10,
        iec61966_2_4: 11,
        bt1361: 12,
        iec61966_2_1: 13,
        bt2020_10bit: 14,
        bt2020_12bit: 15,
        smpte428_1: 17
    },
    space: { // colorspace | Matrix coefficients | --colormatrix
        rgb: 0,
        bt709: 1, // 1080p, 720p
        unknown: 2,
        fcc: 4,
        bt470bg: 5,
        smpte170m: 6, // 576p, 480p, 360p
        smpte240m: 7,
        ycgco: 8,
        bt2020nc: 9,
        bt2020c: 10,
        smpte2085: 11,
        'chroma-derived-nc': 12,
        'chroma-derived-c': 13,
        ictcp: 14,
        'ipt-c2': 15,
        unspecified: 2,
        ycocg: 8,
        'ycgco-re': 16,
        'ycgco-ro': 17,
        bt2020_ncl: 9,
        bt2020_cl: 10
    },
    chroma: { // chroma_sample_location | --chromaloc
        unknown: 0,
        left: 1,
        center: 2,
        topleft: 3,
        top: 4,
        bottomleft: 5,
        bottom: 6,
        unspecified: 0
    }
};

export const
    { range, primaries, trc, space, chroma } = c_opts,
    getRange = range => c_opts.range[range],
    getPrimaries = primaries => c_opts.primaries[primaries],
    getTrc = trc => c_opts.trc[trc],
    getSpaceMatrix = space => c_opts.space[space],
    getChromaLoc = chroma => c_opts.chroma[chroma];

/*
Color range                 : Full

Color range                 : Limited
Color primaries             : BT.2020
Transfer characteristics    : PQ
Matrix coefficients         : BT.2020 non-constant
Mastering display color pri : Display P3
Mastering display luminance : min: 0.0001 cd/m2, max: 1000 cd/m2

// bt2020 9-14-9
Color primaries             : BT.2020
Transfer characteristics    : BT.2020 (10-bit)
Matrix coefficients         : BT.2020 non-constant

// bt601-6-525=smpte170m 6-1-6
Color primaries             : BT.601 NTSC
Transfer characteristics    : BT.709
Matrix coefficients         : BT.601

// bt601-6-625=bt470bg 5-1-6
Color primaries             : BT.601 PAL
Transfer characteristics    : BT.709
Matrix coefficients         : BT.601

Output colour space	Output EOTF	    $X	$Y	$Z
Rec709	            Gamma 2.4	    1	1	1
P3D65	            PQ (ST.2084)	12	16	1
Rec2020	            PQ (ST.2084)	9	16	9
Rec2020	            HLG	            9	18	9

colour_primaries (X):           Defines the color primaries of the output color space.
transfer_characteristics (Y):   Defines the EOTF (gamma or HDR curve) of the output.
matrix_coefficients (Z):        Defines the matrix coefficients used for converting between YUV and RGB color spaces. For example, 1 for BT.709 and 9 for BT.2020.

In this example:

// To output a video with Rec.2020 color space and PQ (ST.2084) EOTF
ffmpeg -i input.mp4 -c:v libx265 -x265-params "colorprim=9:transfer=14:colormatrix=9" output.mp4

colorprim=9     corresponds to BT.2020 color primaries.
transfer=14     corresponds to PQ (ST.2084) EOTF.
colormatrix=9   corresponds to BT.2020 matrix coefficients.

[colorspace]

Convert colorspace, transfer characteristics or color primaries. Input video needs to have an even size.

range - Specify output color range.

‘tv’ - TV (restricted) range
‘mpeg’ - MPEG (restricted) range
‘pc’ - PC (full) range
‘jpeg’ - JPEG (full) range

all - Specify all color properties at once.

‘bt470m’ - BT.470M
‘bt470bg’ - BT.470BG
‘bt601-6-525’ - BT.601-6 525
‘bt601-6-625’ - BT.601-6 625
‘bt709’ - BT.709
‘smpte170m’ - SMPTE-170M
‘smpte240m’ - SMPTE-240M
‘bt2020’ - BT.2020

space - Specify output colorspace.

‘bt709’ - BT.709
‘fcc’ - FCC
‘bt470bg’ - BT.470BG or BT.601-6 625
‘smpte170m’ - SMPTE-170M or BT.601-6 525
‘smpte240m’ - SMPTE-240M
‘ycgco’ - YCgCo
‘bt2020ncl’ - BT.2020 with non-constant luminance

trc - Specify output transfer characteristics.

‘bt709’ - BT.709
‘bt470m’ - BT.470M
‘bt470bg’ - BT.470BG
‘gamma22’ - Constant gamma of 2.2
‘gamma28’ - Constant gamma of 2.8
‘smpte170m’ - SMPTE-170M, BT.601-6 625 or BT.601-6 525
‘smpte240m’ - SMPTE-240M
‘srgb’ - SRGB
‘iec61966-2-1’ - iec61966-2-1
‘iec61966-2-4’ - iec61966-2-4
‘xvycc’ - xvycc
‘bt2020-10’ - BT.2020 for 10-bits content
‘bt2020-12’ - BT.2020 for 12-bits content

primaries - Specify output color primaries.

‘bt709’ - BT.709
‘bt470m’ - BT.470M
‘bt470bg’ - BT.470BG or BT.601-6 625
‘smpte170m’ - SMPTE-170M or BT.601-6 525
‘smpte240m’ - SMPTE-240M
‘film’ - film
‘smpte431’ - SMPTE-431
‘smpte432’ - SMPTE-432
‘bt2020’ - BT.2020
‘jedec-p22’ - JEDEC P22 phosphors

fast
Do a fast conversion, which skips gamma/primary correction. This will take significantly less CPU, but will be mathematically incorrect. To get output compatible with that produced by the colormatrix filter, use fast=1.

irange - Override input color range. Same accepted values as range.
iall - Override all input properties at once. Same accepted values as all.
ispace - Override input colorspace. Same accepted values as space.
iprimaries - Override input color primaries. Same accepted values as primaries.
itrc - Override input transfer characteristics. Same accepted values as trc.

format - Specify output color format.

‘yuv420p’ - YUV 4:2:0 planar 8-bits
‘yuv420p10’ - YUV 4:2:0 planar 10-bits
‘yuv420p12’ - YUV 4:2:0 planar 12-bits
‘yuv422p’ - YUV 4:2:2 planar 8-bits
‘yuv422p10’ - YUV 4:2:2 planar 10-bits
‘yuv422p12’ - YUV 4:2:2 planar 12-bits
‘yuv444p’ - YUV 4:4:4 planar 8-bits
‘yuv444p10’ - YUV 4:4:4 planar 10-bits
‘yuv444p12’ - YUV 4:4:4 planar 12-bits

[-x265-params]

--range <full|limited> - Specify output range of black level and range of luma and chroma signals. Default undefined (not signaled)

--colorprim <integer|string> - Specify color primaries to use when converting to RGB. Default undefined (not signaled)

1. bt709
2. unknown
3. reserved
4. bt470m
5. bt470bg
6. smpte170m
7. smpte240m
8. film
9. bt2020
10. smpte428
11. smpte431
12. smpte432

--transfer <integer|string> - Specify transfer characteristics. Default undefined (not signaled)

1. bt709
2. unknown
3. reserved
4. bt470m
5. bt470bg
6. smpte170m
7. smpte240m
8. linear
9. log100
10. log316
11. iec61966-2-4
12. bt1361e
13. iec61966-2-1
14. bt2020-10
15. bt2020-12
16. smpte2084
17. smpte428
18. arib-std-b67

--colormatrix <integer|string> - Specify color matrix setting i.e set the matrix coefficients used in deriving the luma and chroma. Default undefined (not signaled)

0. gbr
1. bt709
2. unknown
3. reserved
4. fcc
5. bt470bg
6. smpte170m
7. smpte240m
8. ycgco
9. bt2020nc
10. bt2020c
11. smpte2085
12. chroma-derived-nc
13. chroma-derived-c
14. ictcp

--chromaloc <0..5> - Specify chroma sample location for 4:2:0 inputs. Consult the HEVC specification for a description of these values. Default undefined (not signaled)
*/
