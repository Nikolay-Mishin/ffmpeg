import { log } from 'console';
import { resolve } from 'path';
import { args, mkdir, writeFile } from './baseHelpers.js';
import { getPresetType } from './presets.opts.js';

const {
    i: input = null, o = true,
    includeBaseMetrics = false, psnr = true, ssim = true, vmaf = false, hide_banner = false, m_r = false, endall = false, scale = false, format = false, scaleOriginal = true,
    type: presetType = null
} = args;

export const {
    filesRootDir = 'Convert',
    rootDir = `D:/${filesRootDir}`,
    root = `${rootDir}/FFMetrics`,
    filesRoot = `F:/${filesRootDir}`,
} = args;

export const
    [fps, ca, ba, ar, ac, v_ext, a_ext, rm_und_a, rm_tmp, aReport] = [23.976, 'aac', 192, 48000, 2, 'mkv', 'mka', true, false, true],
    mkvExt = ['mkv', 'mka'],
    lang_remove = ['ja', 'en'],
    codec_remove = ['AC-3'];

export const {
    test = false, withMetrics = false, parse = false, n = 71,
    mi: setInfo = true, metrics: setMetrics = false, exec: execute = false, execS = false, propedit = true, report: setReport = execute || execS,
    vstats = false, map: setMap = true, chapters: setChapters = true, metadata: setMetadata = false, cv = null, fmt = null, bit = null,
    sar_v = '1/1', sar: setSar = true, dar: setDar = true, vf_sar = true, vf_dar = true, m_sar = vf_sar, m_dar = vf_dar,
    fr = true, ifr = fr, vf_fps = false, r: setR = true, m_fps = setR,
    /*
    passthrough (0) Каждый кадр с меткой времени передаётся из демультиплексора в мультиплексор.
    cfr (1) Кадры будут дублироваться и отбрасываться для достижения заданной постоянной частоты кадров.
    vfr (2) Кадры передаются с указанием временной метки или отбрасываются, чтобы у двух кадров не было одинаковой временной метки.
    auto (-1) Выбор между cfr и vfr зависит от возможностей мультиплексора. Это метод по умолчанию.
    */
    fpsMode = fr || vf_fps ? 'cfr' : 'passthrough', // passthrough|cfr|vfr
    c_range = true, c_space = c_range, c_chroma = c_range, vf_flags = 'lanczos', // bicubic|lanczos
    vf: setVf = true, vf_in = false, vf_range = true, scale_range = vf_range, scale_space = vf_range, chroma_loc = vf_range, vf_space = true, vf_ispace = vf_space, format_space = vf_space,
    crop: setCrop = false, border: setBorder = false, bsf: setBsf = false, out_scale_m = true, scale_m = true,
    hw = false, nv = false, crf = null, cq = null, qp = null,
    bv = null, preset = null, type = getPresetType(presetType) || getPresetType(preset), profile = null, level: setLvl = true, tier: setTier = false, tune = null,
    space: setSpace = true, p_space = setSpace, ca: setCa = null, ba: setBa = null, cs = null, s = true, y = true, postfix = '_HEVC', t = 120, // 30
    // lookahead_threads=0:min-keyint=23:keyint=250:
    // rc-lookahead=20:rect=0:amp=0:rd=3:psy-rd=1.50:psy-rdoq=1.50:rdoq-level=2:rskip=1:aq-mode=3:aq-strength=0.4:
    // bframes=6:ref=8:me=1:subme=2:merange=57:strong-intra-smoothing=1:b-intra=1:deblock=0:qcomp=0.60:limit-refs=3:limit-modes=0:sao=1:selective-sao=4:early-skip=1
    // limit-tu=4:weight-b=1
    lookahead_threads = 0, min_keyint = 0, keyint = 0,
    rc_lookahead = 20, lookahead_slices = 0, rect = 0, amp = 0, rd = 3, psy_rd = "1.50", psy_rdoq = "1.50", rdoq_level = 2, rskip = 1, aq_mode = 3, aq_strength = "0.40",
    bframes = 6, ref = 8, me = 1, subme = 2, merange = 57, strong_intra_smoothing = 1, deblock = 0, qcomp = "0.60", limit_refs = 3, limit_modes = 0, sao = 1, early_skip = 1,
    limit_tu = 0, weight_b = 0, // limit_tu > 0 ? 1 : 0
    params = {
        lookahead_threads, min_keyint, keyint, rc_lookahead, lookahead_slices, rect, amp, rd, psy_rd, psy_rdoq, rdoq_level, rskip, aq_mode, aq_strength,
        bframes, ref, me, subme, merange, strong_intra_smoothing, deblock, qcomp, limit_refs, limit_modes, sao, early_skip, weight_b, limit_tu
    }
} = args;

export const
    reportDir = `${root}/reports`,
    reportLogsDir = `${reportDir}/logs`,
    logDir = `${root}/logs`,
    ffreportDir = `${root}/ffreports`,
    reportFile = `${root}/FFMetrics_report.txt`,
    logFile = `${root}/FFMetrics_log.txt`,
    FFreportFile = resolve(`${root}/ffreport.txt`),
    FFreportCopy = resolve(`${root}/ffreports_copy.txt`),
    FFreportCopyLog = resolve(`${root}/ffreports_copy_log.txt`),
    FFreportErr = resolve(`${root}/ffreports_err.txt`),
    FFreport = FFreportFile.replace('report', '-report'),
    FFlog = FFreportFile.replace('report', 'report_log'),
    FFcmdLog = FFreportFile.replace('report', 'report-cmd');

export const
    i = input || `${filesRoot}/files`,
    out = o === false ? i : (o === true ? `${filesRoot}/out` : o),
    ffmpeg_c_dir = 'ffmpeg_c',
    ffmpeg_a_dir = 'ffmpeg_a',
    [a_dir, mkvMergeRoot, ffmpeg_a_root] = [`${out}/a`, `${out}/mkvMerge`, `${out}/${ffmpeg_a_dir}`];

const metricOpts = { psnr, ssim, vmaf };
const parseOpts = { hide_banner, m_r, endall, scale, format, scaleOriginal };
const metricList = Object.entries(metricOpts).map(([k, v]) => v ? k : v).filter(m => m);

export const metrics = [];
metricList.forEach(m => { if (includeBaseMetrics) metrics.push(m); Object.entries(parseOpts).forEach(([k, v], i) => { if (v) metrics.push(`${m}${i + 1}`); }); });

await mkdir(reportLogsDir);
await mkdir(logDir);
await mkdir(ffreportDir);
await mkdir(out);

//log(args);
//log(parseOpts);
//log(metrics);

//await writeFile(reportFile, '');
//await writeFile(logFile, '');
//await writeFile(FFreport, '');
//await writeFile(FFlog, '');
