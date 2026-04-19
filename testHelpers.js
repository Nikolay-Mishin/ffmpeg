import { log } from 'console';
import { argv, env } from 'process';
import { resolve } from 'path';
import { getFiles, getVideos, appendFiles, isArr, isNull, addPath, getEnv, rename, loadEnv, args } from './baseHelpers.js';
import { FFreport, FFlog, setMetrics, ffreportDir, execute, metrics, reportFile, logFile, test } from './ffmpeg.config.js';
import { ffColor, ffError, getFormat, getReportInfo, mkvAddTags, mkvExtAll, mkvExtAttList, mkvExtTracks, mkvMerge, mkvReport, parseReports, primaries, space, trc } from './opts.js';
import { exif, matrix, mi, size } from './mi.js';
import { check_sei, check_v, copyAtt, copyAttExt, copy_v, ffmpeg, getMetrics, scan } from './core.js';
import { setParams } from './params.js';
import { envRoot, root } from './env.config.js';
import { run } from './helpers.js';

const _testScripts = async (n = 0, s, args) => {
    const isMetrics = s === 'metrics',
        notMetrics = !isMetrics;
    if (n === 0) await run('test', '-c_range=false');
    if (n > 0 && s) {
        const a = !args ? '' : ` ${args}`;

        if (n <= 3) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -n=0${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=false -vf_space=true -space=true -n=1${a}`);
            await run(s, `-c_range=true -vf_range=false -scale_space=false -vf_space=true -space=true -n=2${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=false -space=true -n=3${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=false -vf_space=false -space=true -n=4${a}`);
            if (n >= 2) await run(s, `-c_range=true -vf_range=false -scale_space=false -vf_space=false -space=true -n=5${a}`);

            if (n == 3 && isMetrics) await testScripts(1, `-out_scale_m=false`);
        }

        if (n === 4) {
            if (notMetrics) {
                await run(s, `-c_range=false -vf_range=false -scale_space=false -vf_space=false -space=false -n=6${a}`);
                await run(s, `-c_range=true -vf_range=false -scale_space=false -vf_space=false -space=false -n=7${a}`);
                await run(s, `-c_range=false -vf_range=false -scale_space=false -vf_space=false -space=true -n=8${a}`);
            }
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_flags=lanczos -n=9${a}`);
            if (isMetrics) {
                await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_flags=lanczos -out_scale_m=false -n=9${a}`);
            }
        }

        if (n == 5 || n == 6) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=false -m_sar=true -m_dar=false -n=10${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -m_sar=true -m_dar=true -n=11${a}`);
            await run(s, `-c_range=false -vf_range=true -scale_space=true -vf_space=false -space=false -vf_sar=true -vf_dar=true -m_sar=true -m_dar=true -n=12${a}`);
            await run(s, `-c_range=false -vf_range=true -scale_space=true -vf_space=false -space=false -vf_sar=true -vf_dar=false -m_sar=true -m_dar=false -n=13${a}`);

            if (n == 6 && isMetrics) await testScripts(5, `-out_scale_m=false`);
        }

        if (n == 7) {
            await run(s, `-c_range=false -vf_range=false -scale_space=false -vf_space=false -space=false -vf_sar=false -vf_dar=false -n=14${a}`);
            await run(s, `-c_range=false -vf_range=false -scale_space=false -vf_space=true -space=false -vf_sar=false -vf_dar=false -n=15${a}`);

            await run(s, `-c_range=false -vf_range=false -scale_space=false -vf_space=false -space=true -p_space=false -vf_sar=false -vf_dar=false -n=16${a}`);
            await run(s, `-c_range=false -vf_range=false -scale_space=false -vf_space=false -space=true -p_space=true -vf_sar=false -vf_dar=false -n=17${a}`);

            await run(s, `-c_range=true -c_space=false -vf_range=false -scale_space=false -vf_space=false -space=false -vf_sar=false -vf_dar=false -n=18${a}`);
            await run(s, `-c_range=true -c_space=true -vf_range=false -scale_space=false -vf_space=false -space=false -vf_sar=false -vf_dar=false -n=19${a}`);

            await run(s, `-c_range=false -vf_range=false -scale_space=false -vf_space=false -space=false -vf_sar=false -vf_dar=true -n=20${a}`);
            await run(s, `-c_range=false -vf_range=false -scale_space=false -vf_space=false -space=false -vf_sar=true -vf_dar=false -n=21${a}`);

            await run(s, `-c_range=false -vf_range=false -scale_space=false -vf_space=false -space=false -vf_sar=false -vf_dar=false -n=22${a}`);
            await run(s, `-c_range=false -vf_range=true -scale_space=false -vf_space=false -space=false -vf_sar=false -vf_dar=false -n=23${a}`);
        }

        if (n == 8) {
            await run(s, `-c_range=false -vf_range=true -scale_space=true -vf_space=false -space=false -vf_sar=false -vf_dar=false -n=24${a}`);
            await run(s, `-c_range=false -vf_range=true -scale_space=true -vf_space=true -space=false -vf_sar=false -vf_dar=false -n=25${a}`);

            await run(s, `-c_range=false -vf_range=true -scale_space=true -vf_space=true -space=true -p_space=false -vf_sar=false -vf_dar=false -n=26${a}`);
            await run(s, `-c_range=false -vf_range=true -scale_space=true -vf_space=true -space=true -p_space=true -vf_sar=false -vf_dar=false -n=27${a}`);

            await run(s, `-c_range=true -c_space=false -vf_range=true -scale_space=true -vf_space=true -space=false -vf_sar=false -vf_dar=false -n=28${a}`);
            await run(s, `-c_range=true -c_space=true -vf_range=true -scale_space=true -vf_space=true -space=false -vf_sar=false -vf_dar=false -n=29${a}`);

            await run(s, `-c_range=false -vf_range=true -scale_space=true -vf_space=true -space=false -vf_sar=false -vf_dar=true -n=30${a}`);
            await run(s, `-c_range=false -vf_range=true -scale_space=true -vf_space=true -space=false -vf_sar=true -vf_dar=false -n=31${a}`);

            await run(s, `-c_range=false -vf_range=true -scale_space=true -vf_space=true -space=false -vf_sar=false -vf_dar=false -n=32${a}`);
        }

        if (n == 9) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=false -vf_dar=false -n=42${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=false -vf_sar=false -vf_dar=false -n=43${a}`);
            await run(s, `-c_range=false -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=false -vf_dar=false -n=44${a}`);
            await run(s, `-c_range=true -vf_range=false -scale_space=false -vf_space=true -space=true -vf_sar=false -vf_dar=false -n=45${a}`);
            await run(s, `-c_range=false -vf_range=false -scale_space=false -vf_space=false -space=false -vf_sar=false -vf_dar=false -n=46${a}`);
        }

        if (n == 10) {
            await run(s, `-c_range=true -vf_range=true -scale_space=false -vf_space=false -space=false -vf_sar=false -vf_dar=false -n=47${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=false -vf_space=false -space=true -vf_sar=false -vf_dar=false -n=48${a}`);
            await run(s, `-c_range=false -vf_range=true -scale_space=false -vf_space=false -space=true -p_space=false -vf_sar=false -vf_dar=false -n=49${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=false -vf_space=true -space=true -vf_sar=false -vf_dar=false -n=50${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=false -vf_dar=false -n=51${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=false -space=true -vf_sar=false -vf_dar=false -n=52${a}`);
        }

        if (n == 11) {
            if (notMetrics) {
                await run(s, `-c_range=false -vf_range=false -scale_space=false -vf_space=false -space=false -vf_sar=false -vf_dar=false -fr=false -ifr=false -vf_fps=false -r=false -m_fps=false -n=53${a}`);
            };

            await run(s, `-c_range=false -vf_range=false -scale_space=false -vf_space=false -space=false -vf_sar=false -vf_dar=false -fr=false -ifr=false -vf_fps=true -r=false -m_fps=true -n=54${a}`);
            await run(s, `-c_range=false -vf_range=false -scale_space=false -vf_space=false -space=false -vf_sar=false -vf_dar=false -fr=true -ifr=true -vf_fps=false -r=true -m_fps=false -n=55${a}`);
            await run(s, `-c_range=false -vf_range=false -scale_space=false -vf_space=false -space=false -vf_sar=false -vf_dar=false -fr=true -ifr=true -vf_fps=true -r=true -m_fps=true -n=56${a}`);

            if (notMetrics) {
                await run(s, `-c_range=false -vf_range=false -scale_space=false -vf_space=false -space=false -vf_sar=false -vf_dar=false -fr=true -ifr=false -vf_fps=false -r=true -m_fps=false -n=57${a}`);
                await run(s, `-c_range=false -vf_range=false -scale_space=false -vf_space=false -space=false -vf_sar=false -vf_dar=false -fr=true -ifr=false -vf_fps=true -r=true -m_fps=true -n=58${a}`);
            };
        }


        if (n == 12) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=false -vf_dar=false -n=65${a}`);
        }

        if (n == 13) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -n=70${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -vf_flags=lanczos -n=71${a}`);
        }

        if (n == 14) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -n=72${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -aq_mode=2 -n=73${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -n=74${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=60 -n=75${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rdoq=0.00 -n=76${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -psy_rdoq=0.00 -n=77${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rdoq=0.00 -rdoq_level=0 -n=78${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -aq_strength=0.8 -n=79${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=60 -aq_strength=0.8 -n=80${a}`);
        }

        if (n == 15) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rdoq=0.00 -strong_intra_smoothing=0 -n=81${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -psy_rdoq=0.00 -strong_intra_smoothing=0 -n=82${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rdoq=0.00 -strong_intra_smoothing=0 -sao=0 -n=83${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -psy_rdoq=0.00 -strong_intra_smoothing=0 -sao=0 -n=84${a}`);
        }

        if (n == 16) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -limit_refs=1 -n=85${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -limit_modes=1 -n=86${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -limit_refs=2 -limit_modes=1 -n=87${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -amp=1 -limit_refs=2 -limit_modes=1 -n=88${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -amp=1 -limit_refs=2 -limit_modes=1 -n=89${a}`);
        }

        if (n == 17) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -weight_b=1 -n=90${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -limit_tu=4 -n=91${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -weight_b=1 -limit_tu=4 -n=92${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -weight_b=1 -limit_tu=4 -n=93${a}`);
        }

        if (n == 18) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -subme=7 -n=94${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=60 -subme=7 -n=95${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -subme=7 -n=96${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=60 -bframes=8 -subme=7 -n=97${a}`);
        }

        if (n == 19) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -me=2 -n=98${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -me=2 -subme=7 -n=99${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -me=2 -merange=24 -n=100${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=60 -me=2 -n=101${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=60 -me=2 -subme=7 -n=102${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=60 -me=2 -merange=24 -n=103${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -me=2 -n=104${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -me=2 -subme=7 -n=105${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -me=2 -merange=24 -n=106${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=60 -bframes=8 -me=2 -n=107${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=60 -bframes=8 -me=2 -subme=7 -n=108${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=60 -bframes=8 -me=2 -merange=24 -n=109${a}`);
        }

        if (n == 20) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -me=3 -n=110${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -me=3 -subme=7 -n=111${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -me=3 -merange=24 -n=112${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=60 -me=3 -n=113${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=60 -me=3 -subme=7 -n=114${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=60 -me=3 -merange=24 -n=115${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -me=3 -n=116${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -me=3 -subme=7 -n=117${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -me=3 -merange=24 -n=118${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=60 -bframes=8 -me=3 -n=119${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=60 -bframes=8 -me=3 -subme=7 -n=120${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=60 -bframes=8 -me=3 -merange=24 -n=121${a}`);
        }

        if (n == 21) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -me=2 -subme=7 -merange=24 -n=122${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -me=2 -subme=7 -merange=24 -n=123${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=60 -bframes=8 -me=2 -subme=7 -merange=24 -n=124${a}`);
        }

        if (n == 22) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -me=3 -subme=7 -merange=24 -n=125${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -me=3 -subme=7 -merange=24 -n=126${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=60 -bframes=8 -me=3 -subme=7 -merange=24 -n=127${a}`);
        }

        if (n == 23) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -limit_refs=2 -weight_b=1 -n=128${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -limit_refs=2 -limit_modes=1 -weight_b=1 -n=129${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -amp=1 -limit_refs=2 -limit_modes=1 -weight_b=1 -n=130${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -amp=1 -limit_refs=2 -limit_modes=1 -weight_b=1 -n=131${a}`);
        }

        if (n == 24) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -weight_b=1 -n=132${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -limit_modes=1 -weight_b=1 -n=133${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -amp=1 -limit_modes=1 -weight_b=1 -n=134${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -amp=1 -limit_modes=1 -weight_b=1 -n=135${a}`);
        }

        if (n == 25) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -n=136${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -limit_refs=1 -n=137${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -limit_refs=2 -n=138${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -limit_refs=0 -n=139${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=-1 -n=140${a}`);
        }

        if (n == 26) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -n=141${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -amp=1 -n=142${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -limit_modes=1 -n=143${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -amp=1 -limit_modes=1 -n=144${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -strong_intra_smoothing=0 -n=145${a}`);
        }

        if (n == 27) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -limit_refs=1 -n=146${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -limit_refs=2 -n=147${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -limit_refs=0 -n=148${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=-1 -limit_refs=1 -n=149${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=-1 -limit_refs=2 -n=150${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=-1 -limit_refs=0 -n=151${a}`);
        }

        if (n == 28) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -min_keyint=23 -keyint=250 -n=152${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -min_keyint=24 -keyint=250 -n=153${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -min_keyint=23 -keyint=240 -n=154${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -min_keyint=24 -keyint=240 -n=155${a}`);
        }

        if (n == 29) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -lookahead_slices=4 -n=156${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=10 -n=157${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=25 -n=158${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rc_lookahead=25 -lookahead_slices=4 -n=159${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -early_skip=0 -n=160${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rskip=2 -n=161${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -n=162${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=4 -n=163${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=4 -n=164${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -me=3 -subme=3 -n=165${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -me=2 -subme=3 -n=166${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -me=3 -subme=3 -merange=24 -n=167${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -me=2 -subme=3 -merange=24 -n=168${a}`);
        }

        if (n == 30) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -aq_strength=1.0 -n=169${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -aq_mode=1 -n=170${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -aq_mode=1 -aq_strength=0.8 -n=171${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -aq_mode=1 -aq_strength=1.0 -n=172${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rd=4 -n=173${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rdoq_level=0 -n=174${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rdoq_level=1 -n=175${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.00 -n=176${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=2.00 -n=177${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.75 -n=178${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rdoq=1.00 -n=179${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rdoq=2.00 -n=180${a}`);
        }

        if (n == 31) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=1.00 -n=181${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.75 -psy_rdoq=4.00 -n=182${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.75 -psy_rdoq=4.00 -rdoq_level=1 -n=183${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=1.00 -rskip=2 -n=184${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.75 -psy_rdoq=4.00 -rskip=2 -n=185${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.75 -psy_rdoq=4.00 -rdoq_level=1 -rskip=2 -n=186${a}`);
        }

        if (n == 32) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -deblock=1 -n=187${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -amp=1 -deblock=1 -n=188${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -deblock=1 -limit_modes=1 -n=189${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -amp=1 -deblock=1 -limit_modes=1 -n=190${a}`);
        }

        if (n == 33) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -deblock=-1 -n=191${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -amp=1 -deblock=-1 -n=192${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -deblock=-1 -limit_modes=1 -n=193${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -amp=1 -deblock=-1 -limit_modes=1 -n=194${a}`);
        }

        if (n == 34) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -limit_refs=1 -n=195${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -amp=1 -limit_refs=1 -n=196${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -limit_refs=1 -limit_modes=1 -n=197${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -amp=1 -limit_refs=1 -limit_modes=1 -n=198${a}`);
        }

        if (n == 35) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -limit_refs=2 -n=199${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -amp=1 -limit_refs=2 -n=200${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -limit_refs=2 -limit_modes=1 -n=201${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -amp=1 -limit_refs=2 -limit_modes=1 -n=202${a}`);
        }

        if (n == 36) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -limit_refs=0 -n=203${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -amp=1 -limit_refs=0 -n=204${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -limit_refs=0 -limit_modes=1 -n=205${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rect=1 -amp=1 -limit_refs=0 -limit_modes=1 -n=206${a}`);
        }

        if (n == 37) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -ref=6 -deblock=1 -limit_refs=1 -n=207${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -ref=6 -deblock=1 -limit_refs=3 -n=208${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -ref=6 -deblock=1 -limit_refs=0 -n=209${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -ref=6 -deblock=0 -limit_refs=1 -n=210${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -ref=6 -deblock=0 -limit_refs=3 -n=211${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -ref=6 -deblock=0 -limit_refs=0 -n=212${a}`);
        }

        if (n == 38) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -ref=7 -deblock=1 -limit_refs=1 -n=213${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.00 -psy_rdoq=0.00 -rdoq_level=0 -ref=6 -deblock=1 -limit_refs=1 -n=214${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.50 -psy_rdoq=0.00 -rdoq_level=0 -ref=6 -deblock=1 -limit_refs=1 -n=215${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=2 -ref=6 -deblock=1 -limit_refs=1 -n=216${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -ref=6 -deblock=1 -limit_refs=1 -n=217${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=1.50 -rdoq_level=2 -ref=6 -deblock=1 -limit_refs=1 -n=218${a}`);
        }

        if (n == 39) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=2 -bframes=8 -ref=6 -deblock=1 -limit_refs=1 -n=219${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=2 -aq_mode=2 -ref=6 -deblock=1 -limit_refs=1 -n=220${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=2 -rskip=2 -ref=6 -deblock=1 -limit_refs=1 -n=221${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rd=4 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=2 -ref=6 -deblock=1 -limit_refs=1 -n=222${a}`);
        }

        if (n == 40) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -aq_strength=0.8 -n=223${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -aq_mode=4 -aq_strength=0.8 -n=224${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=1.57 -limit_refs=0 -limit_modes=1 -n=225${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=1.57 -limit_refs=1 -limit_modes=1 -n=226${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=1.57 -limit_refs=2 -limit_modes=1 -n=227${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=1.57 -limit_refs=0 -n=228${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=1.57 -limit_refs=1 -n=229${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=1.57 -limit_refs=2 -n=230${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -limit_refs=0 -limit_modes=1 -n=231${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -limit_refs=1 -limit_modes=1 -n=232${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -limit_refs=2 -limit_modes=1 -n=233${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -limit_refs=0 -n=234${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -limit_refs=1 -n=235${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -limit_refs=2 -n=236${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -limit_refs=2 -n=237${a}`);
        }

        if (n == 41) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rd=4 -n=238${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=2.00 -n=239${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rdoq=2.00 -n=240${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=2.00 -psy_rdoq=2.00 -n=241${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rd=4 -psy_rd=2.00 -n=242${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rd=4 -psy_rdoq=2.00 -n=243${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rd=4 -psy_rd=2.00 -psy_rdoq=2.00 -n=244${a}`);
        }

        if (n == 42) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -min_keyint=0 -n=245${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -keyint=0 -n=246${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -min_keyint=0 -keyint=0 -n=247${a}`);
        }

        if (n == 43) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -min_keyint=23 -limit_refs=0 -n=248${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -min_keyint=23 -limit_refs=1 -n=249${a}`);
        }

        if (n == 44) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.50 -psy_rdoq=1.50 -n=250${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -psy_rdoq=1.50 -n=251${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=1.50 -n=252${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.00 -psy_rdoq=1.50 -n=253${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=2.00 -psy_rdoq=1.50 -n=254${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.50 -psy_rdoq=1.57 -n=255${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -psy_rdoq=1.57 -n=256${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=1.57 -n=257${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.00 -psy_rdoq=1.57 -n=258${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=2.00 -psy_rdoq=1.57 -n=259${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.50 -psy_rdoq=0.00 -n=260${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -psy_rdoq=0.00 -n=261${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -n=262${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.00 -psy_rdoq=0.00 -n=263${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=2.00 -psy_rdoq=0.00 -n=264${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.50 -psy_rdoq=0.40 -n=265${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -psy_rdoq=0.40 -n=266${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.40 -n=267${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.00 -psy_rdoq=0.40 -n=268${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=2.00 -psy_rdoq=0.40 -n=269${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.50 -psy_rdoq=1.00 -n=270${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -psy_rdoq=1.00 -n=271${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=1.00 -n=272${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.00 -psy_rdoq=1.00 -n=273${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=2.00 -psy_rdoq=1.00 -n=274${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.50 -psy_rdoq=2.00 -n=275${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -psy_rdoq=2.00 -n=276${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=2.00 -n=277${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.00 -psy_rdoq=2.00 -n=278${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=2.00 -psy_rdoq=2.00 -n=279${a}`);
        }

        if (n == 45) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -aq_mode=2 -n=280${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -aq_strength=0.8 -n=281${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -aq_strength=1.0 -n=282${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -aq_mode=2 -aq_strength=1.0 -n=283${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -n=284${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -aq_mode=2 -n=285${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -aq_strength=1.0 -n=286${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -aq_mode=2 -aq_strength=1.0 -n=287${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -psy_rdoq=0.00 -n=288${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -psy_rdoq=1.00 -n=289${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -psy_rd=0.40 -psy_rdoq=0.00 -n=290${a}`);
        }

        if (n == 46) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -psy_rd=1.00 -psy_rdoq=0.00 -n=291${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -psy_rd=2.00 -psy_rdoq=0.00 -n=292${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -psy_rd=0.40 -psy_rdoq=1.00 -n=293${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -psy_rd=1.00 -psy_rdoq=1.00 -n=294${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -psy_rd=2.00 -psy_rdoq=1.00 -n=295${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -psy_rd=0.40 -psy_rdoq=2.00 -n=296${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -psy_rd=1.00 -psy_rdoq=2.00 -n=297${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -deblock=1 -psy_rd=2.00 -psy_rdoq=2.00 -n=298${a}`);
        }

        if (n == 47) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -aq_mode=2 -n=299${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -aq_mode=2 -aq_strength=1.0 -n=300${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -aq_mode=2 -deblock=1 -n=301${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -aq_mode=2 -aq_strength=1.0 -deblock=1 -n=302${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -n=303${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -aq_strength=1.0 -n=304${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -deblock=1 -n=305${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -aq_strength=1.0 -deblock=1 -n=306${a}`);
        }

        if (n == 48) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -aq_mode=2 -limit_refs=1 -deblock=1 -n=307${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -limit_refs=1 -deblock=1 -n=308${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -deblock=1 -n=309${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -n=310${a}`);
        }

        if (n == 49) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -early_skip=0 -n=311${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rdoq=1.00 -early_skip=0 -n=312${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=1.00 -early_skip=0 -n=313${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rd=4 -early_skip=0 -n=314${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rd=4 -psy_rdoq=1.00 -early_skip=0 -n=315${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -early_skip=0 -n=316${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -me=3 -n=317${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -subme=3 -n=318${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -me=3 -subme=3 -n=319${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -me=3 -early_skip=0 -n=320${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -subme=3 -early_skip=0 -n=321${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -me=3 -subme=3 -early_skip=0 -n=322${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -me=3 -subme=3 -early_skip=0 -n=323${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -me=3 -subme=3 -n=324${a}`);
        }

        if (n == 50) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rdoq_level=0 -n=325${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -rdoq_level=0 -n=326${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -psy_rdoq=0.00 -rdoq_level=0 -n=327${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -psy_rdoq=0.00 -rdoq_level=0 limit_refs=1 -n=328${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rdoq_level=0 -aq_strength=1.00 -n=329${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -psy_rdoq=0.00 -rdoq_level=0 -aq_strength=1.00 -n=330${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -psy_rdoq=0.00 -rdoq_level=0 -aq_strength=1.00 -limit_refs=1 -n=331${a}`);
        }

        if (n == 51) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -aq_mode=2 -limit_refs=1 -deblock=1 -n=332${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -limit_refs=1 -deblock=1 -n=333${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -deblock=1 -n=334${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -n=335${a}`);
        }

        if (n == 52) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -aq_mode=2 -limit_refs=1 -deblock=1 -n=336${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -limit_refs=1 -deblock=1 -n=337${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -deblock=1 -n=338${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -n=339${a}`);
        }

        if (n == 53) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=4 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -aq_mode=2 -limit_refs=1 -deblock=1 -n=340${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=4 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -limit_refs=1 -deblock=1 -n=341${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=4 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -deblock=1 -n=342${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=4 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -n=343${a}`);
        }

        if (n == 54) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -aq_mode=2 -limit_refs=1 -deblock=1 -n=344${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -limit_refs=1 -deblock=1 -n=345${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -deblock=1 -n=346${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -n=347${a}`);
        }

        if (n == 55) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -n=348${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=4 -n=349${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -n=350${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -bframes=8 -n=351${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -limit_refs=1 -n=352${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -bframes=8 -limit_refs=1 -n=353${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -limit_refs=0 -n=354${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -bframes=8 -limit_refs=0 -n=355${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes= -rdoq_level=08 -limit_refs=1 -n=356${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -bframes=8 -rdoq_level=0 -limit_refs=1 -n=357${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -rdoq_level=0 -n=358${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -bframes=8 -rdoq_level=0 -n=359${a}`);
        }

        if (n == 56) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -limit_modes=1 -n=360${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -limit_modes=1 -early_skip=0 -n=361${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -limit_modes=1 -n=362${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -limit_modes=1 -early_skip=0 -n=363${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -bframes=8 -early_skip=0 -n=364${a}`);
        }

        if (n == 57) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -aq_mode=2 -limit_refs=1 -deblock=1 -limit_modes=1 -n=365${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -aq_mode=2 -limit_refs=1 -deblock=1 -limit_modes=1 -n=366${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -limit_refs=1 -deblock=1 -limit_modes=1 -n=367${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=0 -limit_refs=1 -deblock=1 -limit_modes=1 -n=368${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=0 -deblock=1 -limit_modes=1 -n=369${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=0 -deblock=0 -limit_modes=1 -n=370${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=0 -deblock=0 -limit_modes=0 -n=370${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=0 -deblock=0 -limit_modes=0 -n=371${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -deblock=0 -limit_modes=0 -n=372${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.00 -psy_rdoq=0.00 -rdoq_level=0 -deblock=0 -limit_modes=0 -n=373${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.00 -psy_rdoq=1.00 -rdoq_level=0 -deblock=0 -limit_modes=0 -n=374${a}`);
        }

        if (n == 58) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=4 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -aq_mode=2 -limit_refs=1 -deblock=1 -limit_modes=1 -n=374${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -aq_mode=2 -limit_refs=1 -deblock=1 -limit_modes=1 -n=375${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -limit_refs=1 -deblock=1 -limit_modes=1 -n=376${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=4 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=2 -aq_mode=2 -limit_refs=1 -deblock=1 -limit_modes=1 -n=377${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=2 -aq_mode=2 -limit_refs=1 -deblock=1 -limit_modes=1 -n=378${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=2 -limit_refs=1 -deblock=1 -limit_modes=1 -n=379${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -limit_refs=1 -deblock=1 -limit_modes=1 -n=380${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -deblock=1 -limit_modes=1 -n=381${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -deblock=0 -limit_modes=1 -n=382${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -deblock=0 -limit_modes=0 -n=383${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -deblock=0 -limit_modes=0 -n=384${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -deblock=0 -limit_modes=0 -n=385${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.00 -psy_rdoq=0.00 -rdoq_level=0 -deblock=0 -limit_modes=0 -n=386${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.00 -psy_rdoq=1.00 -rdoq_level=0 -deblock=0 -limit_modes=0 -n=387${a}`);
        }

        if (n == 59) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -aq_mode=2 -limit_refs=1 -deblock=1 -limit_modes=1 -n=388${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -n=389${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=2 -n=390${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=2.00 -psy_rdoq=1.00 -rdoq_level=2 -n=391${a}`);
        }

        if (n == 60) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -aq_mode=2 -limit_refs=1 -deblock=1 -limit_modes=1 -n=392${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -aq_mode=2 -limit_refs=1 -deblock=1 -limit_modes=1 -n=392${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -n=393${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=0 -n=394${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -n=395${a}`);
        }

        if (n == 61) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -aq_strength=1.00 -limit_refs=1 -deblock=1 -limit_modes=1 -n=396${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -aq_mode=2 -aq_strength=1.00 -limit_refs=1 -deblock=1 -limit_modes=1 -n=397${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -aq_strength=1.00 -limit_refs=1 -deblock=1 -limit_modes=1 -n=398${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -aq_mode=2 -aq_strength=1.00 -limit_refs=1 -deblock=1 -limit_modes=1 -n=399${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=2.00 -psy_rdoq=1.00 -rdoq_level=2 -aq_strength=1.00 -n=400${a}`);
        }

        if (n == 62) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -aq_mode=2 -aq_strength=1.00 -limit_refs=1 -deblock=1 -limit_modes=1 -n=401${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -aq_mode=2 -aq_strength=1.00 -limit_refs=1 -deblock=1 -limit_modes=1 -n=402${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -aq_mode=2 -aq_strength=1.00 -limit_refs=1 -deblock=1 -limit_modes=1 -n=403${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -aq_mode=2 -aq_strength=1.00 -limit_refs=1 -deblock=1 -limit_modes=1 -n=404${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -aq_strength=1.00 -n=405${a}`);
        }

        if (n == 63) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -aq_mode=2 -aq_strength=0.40 -limit_refs=1 -deblock=0 -n=406${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -aq_mode=2 -aq_strength=0.40 -limit_refs=1 -deblock=1 -n=407${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -aq_mode=2 -aq_strength=1.00 -limit_refs=1 -deblock=1 -n=408${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -aq_mode=2 -aq_strength=1.00 -limit_refs=3 -deblock=1 -n=409${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -aq_mode=2 -aq_strength=1.00 -limit_refs=3 -deblock=1 -early_skip=0 -n=410${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -aq_mode=2 -aq_strength=1.00 -me=3 -subme=3 -limit_refs=3 -deblock=1 -early_skip=0 -n=410${a}`);
        }

        if (n == 64) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -aq_strength=0.40 -limit_refs=1 -deblock=0 -n=411${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -aq_strength=0.40 -limit_refs=1 -deblock=1 -n=412${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -aq_strength=1.00 -limit_refs=1 -deblock=1 -n=413${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -aq_strength=1.00 -limit_refs=3 -deblock=1 -n=414${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -aq_strength=1.00 -limit_refs=3 -deblock=1 -early_skip=0 -n=415${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -aq_strength=1.00 -me=3 -subme=3 -limit_refs=3 -deblock=1 -early_skip=0 -n=416${a}`);
        }

        if (n == 64) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -aq_strength=0.40 -limit_refs=1 -deblock=0 -n=417${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -aq_strength=0.40 -limit_refs=1 -deblock=0 -n=418${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=0 -aq_strength=1.00 -limit_refs=1 -deblock=0 -n=419${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -aq_strength=1.00 -limit_refs=3 -deblock=0 -n=420${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -aq_strength=1.00 -limit_refs=3 -deblock=0 -early_skip=0 -n=421${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -aq_strength=1.00 -me=3 -subme=3 -limit_refs=3 -deblock=0 -early_skip=0 -n=422${a}`);
        }

        if (n == 65) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=2 -aq_strength=0.40 -limit_refs=1 -deblock=0 -n=423${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=2 -aq_strength=0.40 -limit_refs=1 -deblock=0 -n=424${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=0.00 -rdoq_level=2 -aq_strength=1.00 -limit_refs=1 -deblock=0 -n=425${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=0 -aq_strength=1.00 -limit_refs=3 -deblock=0 -n=426${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=0 -aq_strength=1.00 -limit_refs=3 -deblock=0 -early_skip=0 -n=427${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=0 -aq_strength=1.00 -me=3 -subme=3 -limit_refs=3 -deblock=0 -early_skip=0 -n=428${a}`);
        }

        if (n == 65) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=1.50 -rdoq_level=2 -aq_strength=0.40 -limit_refs=1 -deblock=0 -n=429${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=1.50 -rdoq_level=2 -aq_strength=0.40 -limit_refs=1 -deblock=0 -n=430${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=1.50 -rdoq_level=2 -aq_strength=1.00 -limit_refs=1 -deblock=0 -n=431${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.50 -rdoq_level=0 -aq_strength=1.00 -limit_refs=3 -deblock=0 -n=432${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.50 -rdoq_level=0 -aq_strength=1.00 -limit_refs=3 -deblock=0 -early_skip=0 -n=433${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=1.50 -rdoq_level=0 -aq_strength=1.00 -me=3 -subme=3 -limit_refs=3 -deblock=0 -early_skip=0 -n=434${a}`);
        }

        if (n == 66) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=2 -aq_strength=0.40 -limit_refs=1 -deblock=0 -n=435${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=1.00 -rdoq_level=2 -aq_strength=0.40 -limit_refs=1 -deblock=0 -n=436${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=1.00 -rdoq_level=2 -aq_strength=1.00 -limit_refs=1 -deblock=0 -n=437${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -aq_strength=1.00 -limit_refs=3 -deblock=0 -n=438${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -aq_strength=1.00 -limit_refs=3 -deblock=0 -early_skip=0 -n=439${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -rd=4 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -aq_strength=1.00 -me=3 -subme=3 -limit_refs=3 -deblock=0 -early_skip=0 -n=440${a}`);
        }

        if (n == 67) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=0.40 -psy_rdoq=1.00 -rdoq_level=0 -aq_strength=0.40 -deblock=0 -n=411${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=1.00 -rdoq_level=0 -aq_strength=0.40 -deblock=0 -n=412${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -psy_rd=2.00 -psy_rdoq=1.00 -rdoq_level=0 -aq_strength=1.00 -deblock=0 -n=413${a}`);
        }

        if (n == -1) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -n=70${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -vf_flags=lanczos -n=71${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -n=72${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -limit_modes=1 -n=86${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -weight_b=1 -n=90${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -weight_b=1 -n=132${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -limit_modes=1 -weight_b=1 -n=133${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -amp=1 -limit_modes=1 -weight_b=1 -n=134${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -limit_refs=1 -n=137${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -limit_refs=0 -n=139${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -min_keyint=23 -keyint=250 -n=152${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -min_keyint=24 -keyint=250 -n=153${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=6 -n=162${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -ref=4 -n=163${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -min_keyint=0 -n=245${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -keyint=0 -n=246${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -min_keyint=0 -keyint=0 -n=247${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.50 -psy_rdoq=1.50 -n=250${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -aq_strength=1.0 -n=304${a}`);
        }

        if (n == -2) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rdoq=0.00 -rdoq_level=0 -n=78${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rdoq=0.00 -strong_intra_smoothing=0 -n=81${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -psy_rdoq=0.00 -strong_intra_smoothing=0 -n=82${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rdoq=0.00 -strong_intra_smoothing=0 -sao=0 -n=83${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.57 -psy_rdoq=0.00 -strong_intra_smoothing=0 -sao=0 -n=84${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -aq_mode=1 -n=170${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -aq_mode=1 -aq_strength=0.8 -n=171${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -aq_mode=1 -aq_strength=1.0 -n=172${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rd=4 -n=173${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rdoq_level=0 -n=174${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=2 -ref=6 -deblock=1 -limit_refs=1 -n=216${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=2 -bframes=8 -ref=6 -deblock=1 -limit_refs=1 -n=219${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=2 -aq_mode=2 -ref=6 -deblock=1 -limit_refs=1 -n=220${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=2 -rskip=2 -ref=6 -deblock=1 -limit_refs=1 -n=221${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rd=4 -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=2 -ref=6 -deblock=1 -limit_refs=1 -n=222${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -aq_mode=2 -limit_refs=1 -deblock=1 -n=307${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -limit_refs=1 -deblock=1 -n=308${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -deblock=1 -n=309${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -n=310${a}`);
        }

        if (n == -3) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -ref=6 -deblock=1 -limit_refs=1 -n=207${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -ref=6 -deblock=1 -limit_refs=3 -n=208${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -ref=6 -deblock=1 -limit_refs=0 -n=209${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -ref=6 -deblock=0 -limit_refs=1 -n=210${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -ref=6 -deblock=0 -limit_refs=3 -n=211${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -ref=6 -deblock=0 -limit_refs=0 -n=212${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.40 -psy_rdoq=0.00 -rdoq_level=0 -ref=7 -deblock=1 -limit_refs=1 -n=213${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.00 -psy_rdoq=0.00 -rdoq_level=0 -ref=6 -deblock=1 -limit_refs=1 -n=214${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=1.50 -psy_rdoq=0.00 -rdoq_level=0 -ref=6 -deblock=1 -limit_refs=1 -n=215${a}`);
        }

        if (n == -4) {
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -aq_strength=1.0 -n=169${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -aq_mode=1 -n=170${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -rdoq_level=1 -n=175${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.75 -psy_rdoq=4.00 -rdoq_level=1 -n=183${a}`);
            await run(s, `-c_range=true -vf_range=true -scale_space=true -vf_space=true -space=true -vf_sar=true -vf_dar=true -psy_rd=0.75 -psy_rdoq=4.00 -rdoq_level=1 -rskip=2 -n=186${a}`);
        }
    }
};

export const
    testScripts = async (n = 0, args) => await _testScripts(n, 'start', args),
    testScriptsMetrics = async (n = 0, args) => await _testScripts(n, 'metrics', args);

export const testArgs = () => {
    log(argv);
    log(args);
};

export const testEnv = () => {
    log(root);

    addPath('lib/ffmpeg/bin');

    log(env);
    log(env.Path);

    log(getEnv('ffmpeg'));
};

export const testFormat = () => {
    log(getFormat('pix_fmts=yuv420p10le'));
    log(getFormat('pix_fmts=yuv420p10'));
    log(getFormat('pix_fmts=yuv420p'));
};

export const testRename = async () => {
    const replace = { '(1)': '(1-5)', '(2)': '(2-10)', '(3)': '(3-7)', '(2-5)': '(5-11)', '(2-6)': '(5-12)', '(2-7)': '(5-13)', '(2-8)': '(5-14)', '(3-9)': '(6-25)' };
    await rename('D:\\Convert\\frames\\2', replace);
};

const testFF = async (pathList, fn, env = false) => {
    if (env) await loadEnv(envRoot, false);
    for await (const p of pathList) {
        const out = await fn(p);
        log(out);
    }
};

export const
    testColor = async (pathList) => await testFF(pathList, ffColor),
    testError = async (pathList) => await testFF(pathList, ffError),
    testDirExist = async (dir = "F:\\Convert\\test") => await scan(dir),
    testFileExist = async (f = "F:\\Convert\\files\\test.mkv") => await ffmpeg(f);

export const testFFmpeg = async (n = 0) => {
    // 0 - Default
    // 01 - Max
    // 02 - Max + Отклонение (разрешить)
    // 03 - MFAA (off)
    // 04 - FXAA (off)
    // 05 - Прозрачность (off)
    // 06 - Сглаживание (off)
    // 07 - Сглаживание (приложение)
    // 08 - Анизатропная (off)
    // 09 - Анизатропная (приложение)
    // 10 - Отклонение (разрешить)
    // 11 - Гамма (off) + Отклонение (привязка)
    // 12 - All Off + Отклонение (разрешить)

    await ffmpeg("G:\\Convert\\files\\FBS NF 124 (1080P AVC).mp4", `_HEVC(${n})`, true);
    await ffmpeg("G:\\Convert\\files\\Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv", `_HEVC(${n})`, true);
    await ffmpeg("G:\\Convert\\files\\[DC] Make Heroine ga Oosugiru - 07_Telegram.mp4", `_HEVC(${n})`, true);
    await ffmpeg("G:\\Convert\\files\\[JamClub] Tsue to Tsurugi no Wistoria - 11 [1080p].mp4", `_HEVC(${n})`, true);
    await ffmpeg("G:\\Аниме\\Новое\\Макен-ки\\ТВ-1\\[AniDub] Maken-ki! [01] [BDrip1080p x264 FLAC] [Ancord].mkv", `_HEVC(${n})`, true);
};

export const testMI = async () => {
    log(await mi("F:\\Аниме\\Онгоинги\\!_38_Весна_2025\\Дьявол может плакать\\Devil_May_Cry_[01]_[AniLibria]_[WEBRip_1080p_HEVC].mkv"));
    log(await mi("F:\\Аниме\\Онгоинги\\!_38_Весна_2025\\Дьявол может плакать\\Devil.May.Cry.s01e01.WEBRip.x264.Rus.RuDub.tv.mp4"));
    log(await mi("F:\\Аниме\\[Фильмы]\\[Фильм] Алита - Боевой ангел\\Alita Battle Angel 2019 WEBRip 1080p-LQ.mkv"));
    log(await mi("F:\\Convert\\files\\[DC] Make Heroine ga Oosugiru - 07_Telegram.mp4"));
};

export const testCheck = async path => {
    await check_v(path);
    await check_sei(path);
};

export const testParams = async (files, params) => {
    for await (const f of files) {
        let p_i = 0;
        for await (const p of params) {
            //p_i++;
            setParams(p);
            await ffmpeg(f, `_HEVC${p_i === 0 ? '' : '(' + (p_i !== 0 || p_i < 10 ? '0' : '') + p_i + ')'}`, true);
        }
    }
};

export const testParams2 = async (iList, skip = 0, ...p) => {
    let { i, rec } = testParams2;
    //log(p);
    //log(i);
    for await (const _p of p) {
        if (i < skip) { testParams2.i = ++i; continue; }
        const prefix_search = [5, 9, 10, 15, 20, 22, 23, 24, 26, 32, 38, 43, 53, 59, 60, 64, 68, 71, 74, 76, 79, 88, 94, 101, 110, 116];
        const prefix_i = prefix_search.findIndex((v, _i) => i < v) + 1;
        const prefix = i < 5 ? '' : `${prefix_i === 0 ? prefix_search.length + 1 : prefix_i}-`;
        if (isArr(_p)) {
            let p_min = _p[0];
            const p_max = _p.pop();
            while (p_min++ < p_max) _p.push(p_min);
            testParams2.i = i;
            testParams2.rec = true;
            i = await testParams2(iList, skip, ..._p);
        } else {
            log(isNull(_p) || i === _p ? i : `${i}-${_p}`);
            setParams(_p);
            for await (const _i of iList) await ffmpeg(_i, `_HEVC(${isNull(_p) || i === _p ? i : `${i}-${_p}`})`, true);
            if (!rec) i++;
        }
    }
    testParams2.rec = false;
    return testParams2.i = ++i;
};
testParams2.i = 0;
testParams2.rec = false;

export const testAtt = async (i, o, a) => {
    //await copyAtt(o, i, a);
    await copyAttExt(i, o);
    //await mkvMerge(i);
    //await mkvExtAll(i);
    //await mkvExtAll(i, "a");
    //await mkvExtAttList(i, "a");
    //await mkvExtTracks(i);
};

export const testCopy = async (ext, i, i0, i1, i2, i3) => {
    //await mkvAddTags(i);
    //await copy_v(i, ext);
    //await copy_v(i);
    //await copy_v(i0);
    //await copy_v(i1);
    await copy_v(i2, ext);
    await copy_v(i3);
};

export const testMatrix = (mList) => {
    mList.forEach(m => log(matrix(m)));
    [primaries, trc, space].forEach((m, i) => log(m[matrix(mList[i])]));
};

// task queue
export const arr = async (dir, dirJ, dirDC, n = 0) => {
    //5
    const dirs = {
        "Поднятие уровня в одиночку\\ТВ-2": [
            //"JamClub_Ore_dake_Level_Up_na_Ken_Season_2_01_1080p.mp4",
            //"JamClub_Ore_dake_Level_Up_na_Ken_Season_2_03_1080p.mp4",
            //"JamClub_Ore_dake_Level_Up_na_Ken_Season_2_06_1080p.mp4",
            //"JamClub_Ore_dake_Level_Up_na_Ken_Season_2_07_1080p.mp4",
            //"JamClub_Ore_dake_Level_Up_na_Ken_Season_2_08_1080p.mp4"
        ]
    };

    //13
    const dirs0 = {
        "Меч и жезл Вистории": [
            //"JamClub_Tsue_to_Tsurugi_no_Wistoria_02_1080p.mp4",
            //"JamClub_Tsue_to_Tsurugi_no_Wistoria_03_1080p.mp4",
            //"JamClub_Tsue_to_Tsurugi_no_Wistoria_04_1080p.mp4",
            //"JamClub_Tsue_to_Tsurugi_no_Wistoria_05_1080p.mp4",
            //"JamClub_Tsue_to_Tsurugi_no_Wistoria_06_1080p.mp4",
            //"JamClub_Tsue_to_Tsurugi_no_Wistoria_07_1080p.mp4",
            //"JamClub_Tsue_to_Tsurugi_no_Wistoria_09_1080p.mp4",
            //"JamClub_Tsue_to_Tsurugi_no_Wistoria_10_1080p.mp4",
            //"JamClub_Tsue_to_Tsurugi_no_Wistoria_11_1080p.mp4",
            //"JamClub_Tsue_to_Tsurugi_no_Wistoria_12_1080p.mp4"
        ],
        "Моя сэмпай - парень": [
            //"JamClub_Senpai_wa_Otokonoko_02_1080p.mp4",
            //"JamClub_Senpai_wa_Otokonoko_03_1080p.mp4",
            //"JamClub_Senpai_wa_Otokonoko_04_1080p.mp4",
            //"JamClub_Senpai_wa_Otokonoko_05_1080p.mp4",
            //"JamClub_Senpai_wa_Otokonoko_06_1080p.mp4",
            //"JamClub_Senpai_wa_Otokonoko_08_1080p.mp4",
            //"JamClub_Senpai_wa_Otokonoko_09_1080p.mp4",
            //"JamClub_Senpai_wa_Otokonoko_10_1080p.mp4",
            //"JamClub_Senpai_wa_Otokonoko_12_1080p.mp4"
        ],
        "Почему все забыли мой мир": [
            //"JamClub_Naze_Boku_no_Sekai_o_Dare_mo_Oboeteinai_no_ka_02_1080p.mp4",
            //"JamClub_Naze_Boku_no_Sekai_o_Dare_mo_Oboeteinai_no_ka_04_1080p.mp4",
            //"JamClub_Naze_Boku_no_Sekai_o_Dare_mo_Oboeteinai_no_ka_06_1080p.mp4",
            //"JamClub_Naze_Boku_no_Sekai_o_Dare_mo_Oboeteinai_no_ka_08_1080p.mp4",
            //"JamClub_Naze_Boku_no_Sekai_o_Dare_mo_Oboeteinai_no_ka_09_1080p.mp4",
            //"JamClub_Naze_Boku_no_Sekai_o_Dare_mo_Oboeteinai_no_ka_10_1080p.mp4",
            //"JamClub_Naze_Boku_no_Sekai_o_Dare_mo_Oboeteinai_no_ka_11_1080p.mp4"
        ],
        "Псевдогарем": [
            //"JamClub_Giji_Harem_03_1080p.mp4",
            //"JamClub_Giji_Harem_04_1080p.mp4",
            //"JamClub_Giji_Harem_05_1080p.mp4",
            //"JamClub_Giji_Harem_06_1080p.mp4",
            //"JamClub_Giji_Harem_07_1080p.mp4",
            //"JamClub_Giji_Harem_08_1080p.mp4",
            //"JamClub_Giji_Harem_10_1080p.mp4",
            //"JamClub_Giji_Harem_11_1080p.mp4",
            //"JamClub_Giji_Harem_12_1080p.mp4"
        ]
    };

    //22
    const dirs1 = {
        "Аля иногда кокетничает со мной по-русски": [
            //"[DC] Roshidere - 02_Telegram.mp4",
            //"[DC] Roshidere - 03_Telegram.mp4",
            //"[DC] Roshidere - 04_Telegram.mp4",
            //"[DC] Roshidere - 05_Telegram.mp4",
            //"[DC] Roshidere - 06_Telegram.mp4",
            //"[DC] Roshidere - 07_Telegram.mp4",
            //"[DC] Roshidere - 08_Telegram.mp4",
            //"[DC] Roshidere - 09_Telegram.mp4",
            //"[DC] Roshidere - 10_Telegram.mp4",
            //"[DC] Roshidere - 11_Telegram.mp4"
        ],
        "Атри - Мои дорогие моменты": [
            //"[DC] Atri - My Dear Moments - 02_Telegram.mp4",
            //"[DC] Atri - My Dear Moments - 03_Telegram.mp4",
            //"[DC] Atri - My Dear Moments - 04_Telegram.mp4",
            //"[DC] Atri - My Dear Moments - 06_Telegram.mp4",
            //"[DC] Atri - My Dear Moments - 07_Telegram.mp4",
            //"[DC] Atri - My Dear Moments - 08_Telegram.mp4",
            //"[DC] Atri - My Dear Moments - 09_Telegram.mp4",
            //"[DC] Atri - My Dear Moments - 10_Telegram.mp4",
            //"[DC] Atri - My Dear Moments - 11_Telegram.mp4",
            //"[DC] Atri - My Dear Moments - 12_Telegram.mp4",
            //"[DC] Atri - My Dear Moments - 13_Telegram.mp4"
        ],
        "Дисквалифицирован по жизни": [
            //"[DC] Isekai Shikkaku - 02_Telegram.mp4",
            //"[DC] Isekai Shikkaku - 03_Telegram.mp4",
            //"[DC] Isekai Shikkaku - 04_Telegram.mp4",
            //"[DC] Isekai Shikkaku - 05_Telegram.mp4",
            //"[DC] Isekai Shikkaku - 06_Telegram.mp4",
            //"[DC] Isekai Shikkaku - 07_Telegram.mp4",
            //"[DC] Isekai Shikkaku - 08_Telegram.mp4",
            //"[DC] Isekai Shikkaku - 09_Telegram.mp4",
            //"[DC] Isekai Shikkaku - 10_Telegram.mp4",
            //"[DC] Isekai Shikkaku - 11_Telegram.mp4"
        ],
        "Жизнь с моей сводной сестрой": [
            //"[DC] Gimai Seikatsu - 02_Telegram.mp4",
            //"[DC] Gimai Seikatsu - 03_Telegram.mp4",
            //"[DC] Gimai Seikatsu - 04_Telegram.mp4",
            //"[DC] Gimai Seikatsu - 05_Telegram.mp4",
            //"[DC] Gimai Seikatsu - 06_Telegram.mp4",
            //"[DC] Gimai Seikatsu - 07_Telegram.mp4",
            //"[DC] Gimai Seikatsu - 08_Telegram.mp4",
            //"[DC] Gimai Seikatsu - 09_Telegram.mp4",
            //"[DC] Gimai Seikatsu - 10_Telegram.mp4",
            //"[DC] Gimai Seikatsu - 11_Telegram.mp4",
            //"[DC] Gimai Seikatsu - 12_Telegram.mp4"
        ],
        "Маленький гражданин": [
            //"[DC] Shoushimin Series - 02_Telegram.mp4",
            //"[DC] Shoushimin Series - 04_Telegram.mp4",
            //"[DC] Shoushimin Series - 05_Telegram.mp4",
            //"[DC] Shoushimin Series - 06_Telegram.mp4",
            //"[DC] Shoushimin Series - 07_Telegram.mp4",
            //"[DC] Shoushimin Series - 08_Telegram.mp4",
            //"[DC] Shoushimin Series - 09_Telegram.mp4"
        ],
        "Пока-пока, Земля": [
            //"[DC] Bye Bye Earth - 02_Telegram.mp4",
            //"[DC] Bye Bye Earth - 04_Telegram.mp4",
            //"[DC] Bye Bye Earth - 05_Telegram.mp4",
            //"[DC] Bye Bye Earth - 06_Telegram.mp4",
            //"[DC] Bye Bye Earth - 07_Telegram.mp4",
            //"[DC] Bye Bye Earth - 09_Telegram.mp4",
            //"[DC] Bye Bye Earth - 10_Telegram.mp4"
        ],
        "Слишком много проигравших героинь!": [
            //"[DC] Make Heroine ga Oosugiru - 03_Telegram.mp4",
            //"[DC] Make Heroine ga Oosugiru - 04_Telegram.mp4",
            //"[DC] Make Heroine ga Oosugiru - 06_Telegram.mp4",
            //"[DC] Make Heroine ga Oosugiru - 08_Telegram.mp4",
            //"[DC] Make Heroine ga Oosugiru - 09_Telegram.mp4",
            //"[DC] Make Heroine ga Oosugiru - 10_Telegram.mp4",
            //"[DC] Make Heroine ga Oosugiru - 11_Telegram.mp4"
        ],
        "Я стал самым сильным с провальным навыком «ненормальное состояние», я разрушу всё": [
            //"[DC] Hazurewaku - 02_Telegram.mp4",
            //"[DC] Hazurewaku - 03_Telegram.mp4",
            //"[DC] Hazurewaku - 04_Telegram.mp4",
            //"[DC] Hazurewaku - 06_Telegram.mp4",
            //"[DC] Hazurewaku - 07_Telegram.mp4",
            //"[DC] Hazurewaku - 08_Telegram.mp4",
            //"[DC] Hazurewaku - 09_Telegram.mp4",
            //"[DC] Hazurewaku - 10_Telegram.mp4",
            //"[DC] Hazurewaku - 11_Telegram.mp4"
        ]
    };

    const files = async (dir, obj) => {
        for (const d of obj.k()) {
            const files = obj[d];
            //log(d);
            //log(files);
            for await (const f of files) {
                const path = resolve(dir, d, f)
                log(path);
                if (execute || !setMetrics) await ffmpeg(path);
            }
        }
    };

    if (n === 0 || n === 1) await files(dir, dirs);
    if (n === 0 || n === 2) await files(dirJ, dirs0);
    if (n === 0 || n === 3) await files(dirDC, dirs1);
};

export const testParams0 = async (i, i1, i2, out, n = 0) => {
    if (!setMetrics) {
        setParams(25);
        if (n === 0) await ffmpeg(i, out, '_HEVC-0');
        if (n === 1) await ffmpeg(i1, out, '_HEVC-cmd-05');
        if (n === 2) await ffmpeg(i2, out, '_HEVC-25');
    }
};

export const _mi = async (o, o1, o2) => {
    const info0 = await mi(o.replace('HEVC', 'HEVC-10'));
    log(info0);
    const info1 = await mi(o1.replace('-cmd', '-cmd(05)'));
    log(info1);
    const info2 = await mi(o2.replace('HEVC', 'HEVC-05'));
    log(info2);
};

export const mkv = async (out) => {
    await getVideos(out, async ({ name }) => {
        const o = resolve(`${out}/${name}`);
        log(o);
        await mkvAddTags(o);
    });
};

export const s = async (i) => {
    const _mi = await mi(i);
    const _s = await size(_mi);
    log(_mi);
    log(_s);
    return _s;
};

export const _setMetrics = async (i, o) => {
    await appendFiles(`${i}\n`, reportFile, logFile);
    await getMetrics(i, o);
    await appendFiles('\n', reportFile, logFile);
};

export const testMetrics = async (i, o) => {
    log(metrics);
    await _setMetrics(i, o);
};

export const opts = async (i, o, out, report = false, info = false) => {
    const n0 = 0;
    const n2 = 10;
    const n3 = 15;
    const n4 = 25;
    const l0 = 13;
    const l1 = 13;
    const l3 = 24;
    const l4 = 28; //38
    let n = n4;
    const l = n === n0 ? l0 : (n === n4 ? l4 : l3);

    const ffArr0 = ['ref', 'aq', 'psy', 'limit', 'rc', 'deblock', 'aq-s', 'aq-s=1', 'rc=60', '', 'no-intra', 'rdoq-lvl=2', 'rdoq:rc=60', 'no-sao']; // 0-13 | 25-38
    const ffArr1 = ffArr0.slice(n0, n2); // 0-9 | 15-19 + 20-24 | 25-28 + 29-33
    const ffArr2 = ffArr0.slice(n2, l1 + 1); // 10-13
    const ffArr = n === n0 || n === n4 ? ffArr0 : l === l0 ? ffArr1 : n === n2 ? ffArr2 : ffArr1;

    log(n);
    log(l);
    log(ffArr);

    if (setMetrics) log(metrics);

    for await (const p of ffArr) {
        const _p = `HEVC-${n > 0 && n < 10 ? `0${n}` : n}`;
        const _o = o.replace('HEVC', _p);
        if (n === l + 1) break;
        if (n === 9 || n === 14/* || n < 32*/) { n++; continue; }
        log(_o);
        setParams(n);
        if (execute) {
            if (setMetrics) await _setMetrics(_o, i);
            else await ffmpeg(i, out, `_${_p}`);
            if (report) {
                const { s: _s } = await mkvReport({ _o, s: (await s(i)).s });
                log(_s);
            }
            if (info) {
                const _info = await mi(_o);
                log(_info);
            }
        }
        n++;
    }
};

export const params = (params) => {
    log(params);
    setParams();
    log(params);
};

export const testSingle = async (o, i, i1, out) => {
    if (setMetrics) await _setMetrics(o, i);
    else await ffmpeg(i1, out, `_HEVC-39`);
};

export const report = async (get = false) => {
    const reports = await getFiles(ffreportDir, false);
    log(reports);

    if (!get) return;

    for await (const r of reports) {
        await appendFiles(`${r}\n`, FFreport, FFlog);
        log(await getReportInfo('ff', false, { report: r }));
        await appendFiles('\n', FFreport, FFlog);
    }
};

export const img = async (img1, img2) => {
    //const info1 = await mi(img1);
    //log(info1);
    //const info2 = await mi(img2);
    //log(info2);
    const tags1 = await exif(img1);
    log(tags1);
    const tags2 = await exif(img2);
    log(tags2);
};

export const parse = async () => await parseReports(reportFile, logFile);

export default testParams2;
