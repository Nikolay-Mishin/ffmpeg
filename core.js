import { log } from 'console';
import { resolve } from 'path';
import {
    getInt, getEnv, exec, fileName, isStr, writeFile, execSync, getVideos, dirName, isFile, isDir, appendFiles, appendFile, isBool, isFn, mkdir, rm, args, ext,
    getFiles, readFile, max, notEquals, notNull
} from './baseHelpers.js';
import {
    i, out, metrics, reportFile, logFile, FFreportFile, FFreport, FFlog,
    setMetrics, setInfo, setMap, setSar, setDar, chroma_loc, setR, setCrop, setBorder, t, s, y, type, setBsf, setVf, vstats, setTier, setLvl,
    execute, FFcmdLog, execS, postfix, setMetadata, propedit, setReport, test, withMetrics, parse,
    ffmpeg_a_root, a_dir, a_ext, ca, ba as $ba, ar as $ar, ac as $ac, rm_tmp, fpsMode, setSpace, ffreportDir, FFreportErr, v_ext, ffmpeg_c_dir, vf_flags, fr as ff_r, vf_fps, ifr,
    params as p_list
} from './ffmpeg.config.js';
import {
    ffOpts, getR, range, primaries, trc, space, chroma, setFormat, getCrop, getLavfi, reportPath, setFFReport, getReportInfo, mkvReport, parseReports,
    mkvAddAtt, mkvExtAttList, mkvAddTags, map_remove, map_filter, ffmpeg_a_dir, codec_remove, isMkv, getVBV, h264_params, wList, hList,
    getPrefixLavfi, setColorspace, ffColor, aCodecs, copyReport, lang_remove, cmdLog, setTags, getFlags
} from './opts.js';
import { baseMI, baseMI1, miList, miOpts } from './mi.js';
import preset from './presets.js';
import { res } from './presets.opts.js';

const
    opts_copy_v = '-map 0 -c copy',
    opts_copy_a = '-map 0:a -c:a copy',
    opts_copy = `-map 0 -c:v copy -c:a copy -c:s copy`,
    opts_copy_map = opts => {
        const _opts = opts_copy_v.replace(/(-map 0)/, '$1:v:0 -map 0:a -map 0:s? -map 0:t? -map_chapters 0');
        return !opts ? _opts : _opts.replace('-map 0:a', opts);
    },
    opts_a = (encoder = ca, ba = $ba, ar = $ar, ac = $ac) => `-map 0:a -c:a ${encoder} -b:a ${ba}k -ar ${ar} -ac ${ac}`,
    bsf_sei = '-ec 0 -bsf:v "h264_metadata=sei_user_data=dc45e9bde6d948b7962cd820d923eeef+x264 - core 150"',
    opts_sei = `${opts_copy_v} ${bsf_sei}`,
    errList = [
        '[h264 @ 000001e3df4b0080] SEI type 5 size 765 truncated at 25',
        '[h264 @ 000001e3df4e40c0] number of reference frames (0+5) exceeds max (4; probably corrupt input), discarding one',
        '[h264_metadata @ 000001b138914780] Invalid SEI message: payload_size too large (765 bytes).',
        '[h264_metadata @ 000001b138914780] Failed to read unit 3(type 6).',
        '[h264_metadata @ 000001b138914780] Failed to read access unit from packet.',
        '[vost#0:0/copy @ 000001b139053a80] Error applying bitstream filters to a packet: Invalid data found when processing inputcounting_type out of range: 7, but must be in [0, 6].',
        '[swscaler @ 000001d09bc09ec0] No accelerated colorspace conversion found from yuv420p to bgr48le.' //-vf super2xsai,scale=w=iw/2:h=ih/2
    ];

export const ffmpegExt = async (i, opts, ext = v_ext, o, f = false, t = 0) => {
    //log(i);
    const [dir, fName] = [o ? o : ffmpeg_a_root, fileName(i)];
    o = resolve(`${dir}/${fName}.${ext}`);
    const cmd = `ffmpeg -i "${i}" ${opts} ${/*!f && */t === 0 ? '' : `-t ${t} `}${!f ? `-y "${o}"` : `-f null -`}`;
    const logStr = cmdLog(cmd);
    const result = { o, cmd, logStr };
    if (!execute) log(logStr);
    await mkdir(dir);
    if (execute) {
        result.out = await exec(cmd);
        if (!f) await mkvAddTags(o);
    }
    return result;
};

export const
    check_v = async (i, opts = opts_copy_v, ext = preset.ext, o, t = 0) => await ffmpegExt(i, opts, ext, o, true, t),
    check_sei = async (i, ext = preset.ext, o, t = 0) => await check_v(i, opts_sei, ext, o, t),
    check_err = async (i, opts = opts_copy_v, ext = preset.ext, o, t = 0) => {
        const errors = [];
        const { out } = await check_v(i, opts, ext, o, t);
        log(out);
        errList.forEach(err => log(out?.includes(err)));
    },
    copy = async (i, opts = opts_copy_v, ext = preset.ext, o) => await ffmpegExt(i, opts, ext, o),
    copy_map = async (i, opts, ext = preset.ext, o) => await copy(i, opts ? opts_copy_v : opts_copy_v.replace(/-map \d+/, opts), ext, o),
    copy_v = async (i, ext = preset.ext, o) => await copy(i, opts_copy_v, ext, o),
    copyFilter = async (i, o, rm_codecs = false) => {
        if (!await isFile(i)) throw new Error(`Input file not exist: ${i}`);
        if (!o) o = `${dirName(i)}\\${ffmpeg_c_dir}`;
        const mi = await setTags(i);
        //log(mi);
        const { map_a } = await getAmap(mi, rm_codecs);
        const opts_map = opts_copy_map(map_a);
        //log(opts_map);
        //log(o);
        await copyReport(i, await copy(i, opts_map, preset.ext, o), map_a);
    },
    copyScan = async (dir, o = ffmpeg_c_dir) => {
        if (!await isDir(dir)) throw new Error(`Input directory is invalid: ${dir}`);
        //log(dir);
        //log(`${dir}\\${ffmpeg_c_dir}`);
        const files = (await getVideos(dir, { recursive: false }));//.map(({ f }) => f);
        //log(files);
        for await (const { f } of files) await copyFilter(f, `${dir}\\${o}`);
        return files;
    },
    copy_a = async (i, ext, o) => await copy(i, opts_copy_a, ext, o),
    ffmpeg_a = async (i, encoder = ca, ba = $ba, ar = $ar, ac = $ac, ext = encoder, o) => await copy(i, opts_a(encoder, ba, ar, ac), ext, o),
    set_a = async (a, map, i, ext, id = 1, o) => {
        //a.push(`-i "${await ffmpeg_a(i, encoder, ba, ar, ac, ext, o)}"`);
        a.push(`-i "${(await copy_a(i, ext, o)).o}"`);
        map.push(`-map ${id++}:a`);
        return id;
    };

const ffmpegSei = async (i, cmd) => {
    const { i: input, ext, params, cabac, ref, bit, b_mode, profile, level, tier } = i;
    const { ext: ext_p } = preset;
    //await ffmpegExt(i, opts_sei, ext || encoder, o);
    const { b, bs, b_max, pass2 } = getVBV(i, false),
        crf = `${b_mode === 'cbr' ? '-crf 16' : `-2pass -b:v ${b}`}${bs === 0 ? '' : ` -bufsize ${bs} -maxrate ${b_max}`}`;
    //log(h264_params);
    //log(b_mode);
    //log(pass2);
    //log(bs);
    //log(bs);
    //log(b_max);
    const _cmd = cmd
        .replace(/-i ".+" -map/, '-map')
        .replace(/-map .+ -map_chapters 0/, '-map 0')
        .replace(/-c:v .+ -pix_fmt/, '-c:v libx264 -pix_fmt')
        .replaceAll('yuv420p10le', bit === '8' ? 'yuv420p' : 'yuv420p10')
        .replace(/-bsf:v ".+" -crf/, `${bsf_sei} -crf`)
        .replace(/-crf \d+/, crf)
        .replace(/-profile:v .+ -level:v \d\.\d/, `-profile:v ${profile.lower()} -level:v ${level}`)
        .replace(/-x265-params ".+" -c:a/, `-x264-params "${h264_params(params, cabac, ref)}" -c:a`)
        .replace(/-c:a .+ -c:s copy/, '-c:a copy -c:s copy')
        .replace(`_HEVC.${ext_p}`, `_h264.${ext_p}`);
    const ffmpeg = `ffmpeg -i "${input}" ${_cmd}`,
        o = input.replace(`.${ext}`, `_h264.${ext_p}`);
    log(ffmpeg);
    log(o);
    if (execute) {
        //await exec(ffmpeg);
        //await mkvAddTags(o);
    }
    return o;
};

export const getAmap = async (i, rm_codecs = true) => {
    //log(i);
    if (await isFile(i)) i = await miOpts(i);

    const
        { a, i: input = i.v.i } = i,
        { a: a_p } = preset,
        { format } = a[0],
        { ca: c, b, r: ar } = a_p[0],
        b_max = max(...a.map(({ b, b_max }) => b_max || b)),
        ca = format !== 'Opus' ? c : 'libopus',
        ba = b <= b_max ? b : b_max,
        a_rm_list = a.filter(({ lang, format }) => map_filter(lang, format)),
        _a = { i_a: '', map_a: '-map 0:a', a_list: [], ca, ba, ar };

    i.aCodecs = aCodecs(a);

    //log(input);
    //log(a);
    //log(a_p);
    //log(format);
    //log(a.map(({ b_max, b }) => b_max || b));
    //log(b_max);
    //log(map_remove(a[0].lang, a[0].format));
    //log(_a);
    log(i.aCodecs);

    const a_list = _a.a_list = a
        .map?.(({ stream, lang, format }) => rm_codecs && map_remove(lang, format) || lang_remove(lang) ? null : `-map 0:a:${stream === 0 ? stream : stream - 1}`)
        .filter(a => notNull(a)) || [];

    //log(a_rm_list);
    //log(a_list);
    //log(notEquals(a, a_list));

    const map_a_empty = a_list.length === 0;

    //log(a_rm_list.length === 0 && map_a_empty && codec_remove(a[0].format));

    let i_a_list = [],
        map_a_list = [],
        _id = 1;

    if (rm_codecs) for await (const a of a_rm_list) await set_a(i_a_list, map_a_list, input, a_ext, _id, ffmpeg_a_root);
    if (a_rm_list.length === 0 && map_a_empty && codec_remove(a[0].format)) await set_a(i_a_list, map_a_list, input, a_ext, _id, ffmpeg_a_root);

    const
        _map_a = map_a_list.length === 0 ? '' : `${map_a_empty ? '' : ' '}${map_a_list.join(' ')}`,
        map_a_str = (map_a_empty ? '' : a_list.join(' ')) + _map_a;

    _a.i_a = `${i_a_list.join(' ')}${i_a_list.length === 0 ? '' : ' '}`;
    //if (notEquals(a, a_list)) _a.map_a = map_a_str === '' ? '-map 0:a:0' : map_a_str;
    if (map_a_str !== '' && notEquals(a, a_list)) _a.map_a = map_a_str;

    //log(_a);
    //log(i_a_list);
    //log(map_a_list);
    //log(_a.map_a);
    //log(a[0].format);
    //log(codec_remove(a[0].format));
    //log(a_rm_empty && map_a_empty);
    //log(`'${_a.i_a}'`);
    //log(`'${map_a_str}'`);

    return _a;
};

const getFFmpeg = async (i) => {
    const { i: input, o, fc, w, h, sar: sarV, dar: darV, fps, r, fps_mode, tier, space: _space, chroma: _chroma, ffColor, ext } = i;
    const { w: _w, h: _h, encoder, is264, isHevc, fps: fps_p, fps_mode: _fps_mode, preset: _type, profile, level, crfType, crf, bit, b, pass2, a, ext: ext_p } = preset;
    const colorspace = setColorspace(i, setFormat(_space, _chroma, bit));
    const { cRange, space: $space, ffColor: _ffColor, format: _format, range: _range, primaries: _primaries, trc: $trc, matrix, chroma: $chroma, c_bsf, c_params } = colorspace;
    let { params } = preset;
    const { tune = preset.tune } = args,
        { i_a, map_a, ca, ba, ar } = await getAmap(i);

    //log(i);
    //log(o);
    //log(preset);
    //log(params);
    //log(colorspace);
    //log(_format);
    log(ffColor);
    log(_ffColor);

    log(`frames: ${fc}`);

    const _vstats = !vstats ? '' : `-vstats_file "${FFreportFile.replace('report', 'report-vstats')}" `;
    const metadata = !setMetadata ? '' : ' -map_metadata 0 -movflags use_metadata_tags'; // -1
    // 1st video, 1st audio (0:a:0), all subtitles, выбирает все вложения (t) из первого входного файла
    const map = !setMap ? '-map 0' : `-map 0:v:0 ${map_a} -map 0:s? -map 0:t? -map_chapters 0${metadata}`;
    const cv = `-c:v ${encoder}${!isHevc ? '' : ' -tag:v hvc1'}`;
    const format = `-${_format.replace('s=', ' ')}`;
    const setLslices = w < 1920 || h < 1080;
    const sar = !setSar ? '' : `-sar ${sarV} `; // Sample Aspect ratio
    //const dar = !setDar ? '' : `-aspect ${setLslices ? darV : res[_h].par} `; // Display Aspect ratio
    const dar = !setDar ? '' : `-aspect ${darV} `; // Display Aspect ratio
    // задать цветовой диапазон для кодировщика и контейнера
    // -movflags faststart+write_colr -movflags use_metadata_tags // если записываете в MP4
    // -color_range tv -color_primaries bt709 -color_trc bt709 -colorspace bt709 -chroma_sample_location left`;
    // Convert the video to BT.709 "TV range" (Limited range) using scale filter
    // -vf "scale=out_range=limited|tv:out_primaries=bt709:out_transfer=bt709:out_color_matrix=bt709:out_chroma_loc=left"
    // -vf "colorspace=range=tv:all=bt709:primaries=bt709:trc=bt709:space=bt709:fast=0"
    // irange|iall|iprimaries|itrc|ispace - Override input properties
    // |0| "disable" (default)
    //͏ |1| "decrease": auto - decrease output dimensions on need.
    //͏ |2| "increase": auto - increase output dimensions on need.
    // scale=320:240:force_original_aspect_ratio=decrease,pad=320:240:(( (ow - iw)/2 )):(( (oh - ih)/2 ))
    // Фильтр масштаба
    // -vf fps=24000/1001,scale=1920:1080:flags=bicubic,setsar=1/1,setdar=1920/1080*(1/1)
    //const prefixLavfi = getPrefixLavfi(i);
    //log(prefixLavfi);
    const crop = !setCrop ? '' : `,${await getCrop(input)}`;
    // Set Color - add black frames
    // -vf "color=c=black:sar=1/1:r=24000/1001:s=1920x1080:d=10"
    const border = !setBorder ? '' : `,color=c=black:sar=${sarV}:r=${fps}:s=1920x1080`;
    const wCut = !wList.includes(w);
    const hCut = !hList.includes(h);
    const scale = wCut && wCut ? `${w}:${h}` : `${!wCut ? w : '-1'}:${!hCut ? h : '-1'}`;
    //log(w);
    //log(h);
    //log(wCut);
    //log(hCut);
    //log(scale);
    // ${!setR ? '' : `fps=${fps},`}
    const _fps_vf = `,fps=${fps_p ? getR(fps_p) : fps}`;
    const fps_vf = vf_fps || fps_p/* || (ext !== ext_p && (ext == 'mp4' || ext_p == 'mp4'))*/ ? _fps_vf : '';
    const vf = !setVf ? '' : `-vf "format=${_format}${fps_vf},scale=${scale}:${getFlags()}${$space}${crop}${border}"`;
    // Mark the video as BT.709 "TV range" (Limited range) using bsf filter
    // -bsf:v h264_metadata
    // -bsf:v hevc_metadata=level=5.1:sample_aspect_ratio=1/1:video_full_range_flag=0:colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:chroma_sample_loc_type=1
    // -bsf:v hevc_metadata=width=1920:height=1080:crop_left=0:crop_right=0:crop_top=0:crop_bottom=0 // crop offset, w/h after crop
    const bsf = !setBsf ? '' : ` -bsf:v "hevc_metadata=level=${level}:sample_aspect_ratio=${sarV}:${c_bsf}"`;
    // -b:v -bufsize 2M -maxrate 1M -x264-params "nal-hrd=vbr"
    const minrate = `-minrate 1M`; // -minrate 1M -x264-params "nal-hrd=cbr"
    const { bs, b_max } = getVBV(i);
    const bv = b === 0;
    const _crf = bv ? `-${crfType} ${crf}` : `${!pass2 ? '' : '-2pass '}-b:v ${b} -bufsize ${bs} -maxrate ${b_max}`;
    //${b_mode === 'vbr' ? `-b:v ${b} ` : ''}
    const _preset = `-preset ${type || _type}`;
    const _profile = `-profile:v ${profile}`;
    const _level = !setLvl ? '' : `-level:v ${level}`;
    const _tier = !setTier ? '' : ` -tier ${tier} `;
    const _tune = tune === 'none' ? '' : ` -tune ${tune}`;
    // -x265-params "range=limited:colorprim=9:transfer=14:colormatrix=9:chromaloc=1"
    if (setSpace) params = params.replace(/(min-keyint=\d+)/, `${c_params}:$1`);
    if (setLslices) params = params.replace(/(lookahead-slices)=\d+/, `$1=${w > 1280 || h > 720 ? 5 : w === 1280 || h === 720 ? 4 : 0}`);
    if (p_list) {
        //log(p_list);
        for (const param in p_list) {
            const p = param.replaceAll('_', '-');
            const v = p_list[param];
            const re = new RegExp(`(:${p})=\\d+(\\.\\d+)?`);
            //log(re);
            //log(`${p}: ${v}`);
            if (p == "lookahead-threads" && v > 0) params = params.replace(/(frame-threads=\d+)/, `$1:lookahead-threads=${v}`);
            else if (p != "lookahead-slices") params = params.replace(re, `$1=${v}`);
            if (p == "lookahead-slices" && v > 0) params = params.replace(/(lookahead-slices)=\d+/, `$1=${v}`);
            if (p == "strong-intra-smoothing") params = params.replace(/(b-intra)=\d+/, `$1=${v}`);
            if (p == "sao") params = params.replace(/(selective-sao)=\d+/, `$1=${v > 0 ? 4 : 0}`);
            if (p == "weight-b" && v > 0) params = `${params}:weight-b=${v}`
            if (p == "limit-tu" && v > 0) params = `${params}:limit-tu=${v}`
                .replace(/(amp)=\d+/, `$1=1`).replace(/(limit-refs)=\d+/, `$1=2`).replace(/(limit-modes)=\d+/, `$1=1`);
        }
    }
    const nal_hrd = !(is264 && bv) ? '' : 'nal-hrd=vbr:';
    params = `-x265-params "${nal_hrd}${params.replace(/(:high)/, `${_level.replace(/-(level):v (.+)/, ':$1=$2')}$1`)}"`;
    const cut = t === 0 ? '' : `-t ${t} `;
    // -deinterlace — удаление «гребенки».
    // -ar — устанавливает частоту дискретизации звука. По умолчанию: 44100Гц (-ar 48000).
    //ffmpeg -i "F:\\Аниме\\Дорамы\\\Стеклянное сердце\\Glass.Heart.s01e03.HD1080p.WEBRip.Rus.AniDub.com.ac3" -c:a aac -b:a 192k -ac 2 "F:\\Аниме\\Дорамы\\\Стеклянное сердце\\Glass.Heart.s01e03.HD1080p.WEBRip.Rus.AniDub.com.aac"
    const _a = `-c:a ${ca} -b:a ${ba}k -ar ${ar} -ac ${$ac}`; // AC-3 => libfdk_aac | libfaac | aac_at || libopus
    const _s = !s ? '' : `-c:s copy `;
    const out = `${!y ? '' : '-y '}"${o}"`;

    const ffmpeg = `${i_a}${_vstats}${map} ${cv} ${format} ${sar}${dar}${fps_mode}${r}${cRange}${vf}${bsf} ${_crf} ${_preset} ${_profile} ${_level}${_tier}${_tune} ${params} ${_a} ${_s}${cut}${out}`;

    //await ffmpegSei(i, ffmpeg);

    return ffmpeg;
};

const getMIlist = async (i, o) => {
    const getMIopts = async () => await miOpts(...!setInfo ? [] : await miList(i, setMetrics ? o : '')),
        [mi, mi1] = await getMIopts(),
        _miList = await setTags(mi, mi1);
    //log(mi);
    //log(mi1);
    //log(miList);
    return _miList;
};

/**
 * 
 * @param {string|object} i
 * @param {string|object} o
 * @param {string|number} type
 * @returns
 */
const getMI = async (i, o, type = 0) => {
    //log(i);
    //log(o);
    const [mi, mi1] = await getMIlist(i, o);
    //log(mi);
    //log(mi1);
    const [{ g: { s }, v, a }, { v: v1, a: a1 }] = [mi, mi1];
    //if (v.b === 0 || a.find(({b}) => b === 0)) await mkvAddTags(v.i);
    const [input, out] = [{ v, baseMI, i }, { v: v1, baseMI: baseMI1, i: o }].map(({ v, baseMI, i }) => setInfo ? v : Object.assign(baseMI, { i }));
    const { w, h, sar } = input;
    input.o = o;
    input.type = type;
    input.s = s;
    input.sar = `${parseFloat(sar)}/1`; // Sample Aspect ratio
    input.dar = `(${w}/${h})*(${input.sar})`; // Display Aspect ratio
    if (w > preset.w) input.w = preset.w;
    if (h > preset.h) input.h = preset.h;
    input.a = mi.a;
    input.ffColor = await ffColor(i);
    if (setMetrics) out.ffColor = await ffColor(o);
    return { i: input, o: out };
};

const cmdLine = async (i, o) => {
    const { i: input, type, setFFmpeg, parse, fr, fps_mode } = i;
    //log(type);
    //log(parse);
    //log(i);
    //log(await miOpts(i.i));
    //log(o);
    const hide_banner = parse > 0;
    const prefix = setFFmpeg || !hide_banner ? '' : '-hide_banner -nostdin ';
    const fps = i.fps = o.fps = getR(fr);
    const _r = !((setFFmpeg && ff_r) || (!setFFmpeg && setR)) ? '' : `-r ${fps} `;
    const ir = !((setFFmpeg && ifr) || (!setFFmpeg && setR)) ? '' : _r;
    i.setR = o.setR = !(parse == 1 && setR) || parse >= 3;
    i.r = o.r = !setFFmpeg && (parse == 0 || parse == 2) ? '' : _r;
    i.fps_mode_i = fps_mode;
    i.fps_mode = o.fps_mode = !setFFmpeg ? '' : `-fps_mode ${fpsMode || fps_mode} `;
    const ffmpeg = !setFFmpeg ? '' : await getFFmpeg(i);
    const lavfi = setFFmpeg ? '' : getLavfi(i, o);
    //log(i.setR);
    //log(ffmpeg);
    //log(lavfi);
    //log(i);
    //log(o);
    return `ffmpeg ${prefix}${ir}-i "${input}" ${ffmpeg}${lavfi}`;
};

export const copyAttExt = async (i, o) => {
    //log(i);
    //log(o);
    const aList = await mkvExtAttList(i, a_dir);
    log(aList);
    for await (const a of aList) await mkvAddAtt(o, a);
    if (rm_tmp) await rm(a_dir);
};

export const copyAtt = async (i, a, o) => {
    //log(i);
    //log(a);
    //log(o);
    if (execute) await exec(`ffmpeg -i "${i}" -i "${a}" -map 0:v:0 -map 0:a:0 -map 0:s -map 1:t -map_chapters 0 -c:v copy -c:a copy -c:s copy -y "${o}"`);
};

/**
 * 
 * @param {string|object} i
 * @param {string|object} o
 * @param {boolean|string} isPostfix
 * @param {string|number} type
 */
export const ffmpeg = async (i, o = '', isPostfix = false, type = 0) => {
    //log(i);
    //log(o);
    const _postfix = isStr(isPostfix) ? isPostfix : (isPostfix === true ? o : postfix);
    if (isStr(i) && isStr(o)) {
        if (!await isFile(i)) throw new Error(`Input file not exist: ${i}`);
        const isF = await isFile(o);
        if (o === '' || !(await isDir(o) || isF)) o = dirName(i);
        if (!isF) o = resolve(`${o}\\${fileName(i)}${_postfix}.${preset.ext}`);
        const { i: input, o: out } = await getMI(i, o, type);
        i = input;
        o = out;
    }
    //log(i);
    //log(o);
    i.type = type;
    const setFFmpeg = i.setFFmpeg = type === 0;
    i.parse = getInt(setFFmpeg ? '' : type);
    const cmd = await cmdLine(i, o);
    const logStr = i.logStr = cmdLog(cmd);
    i.report = setFFmpeg ? FFreportFile : reportPath(type);
    i.reportFile = setFFmpeg ? FFreport : reportFile;
    i.logFile = setFFmpeg ? FFlog : logFile;
    setFFReport(i.report);
    log(getEnv('FFREPORT'));
    if (!execute) log(cmd);
    if (execS) execSync(cmd);
    //if (execute) await spawn(cmd, async (data, e) => await appendFile(FFcmdLog, data));
    if (execute) {
        const out = await exec(cmd, (data, e) => {
            if (data.includes('ffmpeg version')) return data = `Command line:\n${cmd}\n${data}`;
            if (/\[null .+\]/.test(data) || data.includes('Application provided invalid')) return null;
            if (data.includes('frame=') && !data.includes('Lsize')) return '';
            if (data.includes('\r\nencoded')) return data = data.replace(/\r\nencoded/, 'encoded');
            return data;
        });
        //log('\n===exec===');
        //log(out);
        //log('===/exec===');
        if (setFFmpeg) {
            if (preset.ext === 'mkv' && propedit) await mkvReport(i);
            i.report = FFcmdLog;
            await writeFile(FFcmdLog, out);
        }
    }
    log(logStr);
    await getReportInfo(setFFmpeg ? 'ff' : type, true, i);
    const { mkvReportStr } = i;
    if (mkvReportStr) await appendFile(FFcmdLog, `${mkvReportStr}\n`);
    if (withMetrics) await getMetrics(o, i);
    const _ffmpeg_a_dir = ffmpeg_a_dir(i.i);
    log(_ffmpeg_a_dir);
    if (rm_tmp) await rm(ffmpeg_a_root);
};

export const getMetrics = async (i, o, filter = v => v) => { for await (const type of metrics.filter(filter)) await ffmpeg(i, o, false, type); },
    ffmetrics = async (f, o) => await scanOutCb(f, o, reportFile, logFile);

const scanOutCb = async (f, o, report, logFile) => {
    log(f);
    if (setReport) await appendFiles(`${f}\n`, report, logFile);
    const { i, o: _out } = await getMI(f, o);
    await getMetrics(i, _out);
    if (setReport) await appendFiles('\n', report, logFile);
};

const scanOut = async (outList, o, name, report, logFile, cb = scanOutCb) => {
    const files = outList.filter(f => { f = fileName(f); return f !== name && f.includes(name); });
    //log(o);
    //log(files);
    for await (const f of files) await cb(f, o, report, logFile);
};

const scanCb = async (f, o, outList, name, report, logFile, cbOut = scanOutCb) => {
    //log(f);
    //log(o);
    //log(name);
    if (setMetrics) await scanOut(outList, o, name, report, logFile, cbOut);
    else await ffmpeg(f);
    if (parse) await parseReports(report, logFile);
}

/**
 * 
 * @param {string} dir
 * @param {string|boolean} out
 * @param {Function|boolean} cb
 * @param {Function|boolean} cbOut
 * @param {boolean} recursive
 */
export const scan = async (dir, out = '', cb = scanCb, cbOut = scanOutCb, recursive = true) => {
    if (out === '') out = dir;
    if (isBool(out)) {
        recursive = out;
        out = dir;
    }
    if (isFn(out)) {
        cb = out;
        out = dir;
    }
    if (isBool(cb)) {
        recursive = cb;
        cb = scanCb;
    }
    if (isBool(cbOut)) {
        recursive = cbOut;
        cbOut = scanOutCb;
    }
    if (!await isDir(dir)) throw new Error(`Input directory is invalid: ${dir}`);
    if (!await isDir(out)) throw new Error(`Output directory is invalid: ${out}`);
    //log(dir);
    //log(out);
    const isOut = out === dir;
    const files = await getVideos(dir, { recursive });
    const outList = !setMetrics ? [] : (isOut ? files : await getVideos(out, { recursive })).map(({ f }) => f);
    //log(files);
    //log(outList);
    for await (const { f, name, fName } of files) await cb(f, isOut ? f : resolve(`${out}/${name}`), outList, fName, reportFile, logFile, cbOut);
}

const checkFramesCb = async (f, o, outList, name, report, logFile) => {
    //log(f);
    //log(o);
    //log(outList);
    //log(name);
    await scanOut(outList, o, name, report, logFile, async (f, o) => {
        log(f);
        log(o);
        const { i, o: out } = await getMI(f, o);
        const { i: { fps_mode, fc, fr_o }, out: { fps_mode: fps_modeO, fc: fcO, fr_o: fr_O } } = { i, out };
        //log(i);
        //log(out);
        log(`${fps_mode}: ${fc}${!fr_o ? '' : `, FR_O: ${fr_o}`}`);
        log(`${fps_modeO}: ${fcO}${!fr_O ? '' : `, FR_O: ${fr_O}`}`);
    });
};

/**
 * 
 * @param {string} dir
 * @param {string} out
 * @param {Function} cb
 */
export const checkFrames = async (dir, out = '', cb = checkFramesCb, recursive = true) => {
    if (isFn(out)) {
        cb = out;
        out = dir;
    }
    if (isBool(cb)) {
        recursive = cb;
        cb = checkFramesCb;
    }
    await scan(dir, out, cb, recursive);
};

export const reportsError = async () => {
    const reports = await getFiles(ffreportDir);
    const errors = [];
    //log(reports);
    for await (const { f } of reports) {
        const file = await readFile(f);
        if (file.includes('unknown')) {
            //log(f);
            errors.push(f);
        }
    }
    await writeFile(FFreportErr, errors.join('\n'));
};
