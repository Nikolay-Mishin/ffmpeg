import { log } from 'console';
import { env } from 'process';
import { resolve } from 'path';
import { root } from './env.config.js';
import { addPath, ext, getEnv, rename } from './baseHelpers.js';
import { i, n, out } from './ffmpeg.config.js';
import { mi, miOpts, size } from './mi.js';
import { checkFrames, check_sei, check_v, ffmpeg, scan, getMetrics, reportsError, ffmetrics, checkParams } from './core.js';
import testParams2, {
    _mi, arr, img, mkv, opts, params, parse, report, s, testParams0, testAtt, testCopy, testMatrix, testMetrics, testParams, testSingle,
    testFormat, testColor, testEnv, testCheck, testScripts, testError, testArgs, testDirExist, testFileExist, testMI, testScriptsMetrics
} from './testHelpers.js';
import preset from './presets.js';
import { setParams } from './params.js';
import { getFormat, ffColor, ffmetadata, ffformat, ffinfo } from './opts.js';

export const test = async () => {
    //if (!test) await scan(i, out);

    //await reportsError();

    //await testScripts();

    //testArgs();
    //testEnv();
    //testFormat();
    //await testRename();

    const pathList = [
        "F:\\Аниме\\Онгоинги\\!_37_Зима_2025\\JamClub\\Доктор Стоун\\ТВ-4\\JamClub_Dr_Stone_Science_Future_02_1080p.mp4",
        "F:\\Аниме\\Онгоинги\\!_37_Зима_2025\\JamClub\\Доктор Стоун\\ТВ-4\\JamClub_Dr_Stone_Science_Future_03_1080p.mp4",
        "F:\\Аниме\\Онгоинги\\!_37_Зима_2025\\JamClub\\Драконий жемчуг Дайма\\JamClub_Dragon_Ball_Daima_01_1080p.mp4",
        "F:\\Аниме\\Онгоинги\\!_37_Зима_2025\\DreamCast\\Безымянная память\\ТВ-1\\[DC] Unnamed Memory - 01_Telegram.mp4",
        "F:\\Аниме\\Онгоинги\\!_37_Зима_2025\\DreamCast\\Безымянная память\\ТВ-2\\[DC] Unnamed Memory Act 2 - 01_Telegram.mp4",
        "D:\\Аниме\\Онгоинги\\!_39_Лето_2025\\DreamCast\\Молчаливая ведьма - Тайна молчаливой колдуньи\\[DC] Silent Witch - 01_Telegram.mp4",
        "F:\\Аниме\\[Фильмы]\\[Фильм] Алита - Боевой ангел\\Alita Battle Angel 2019 WEBRip 1080p-LQ.mkv",
        "D:\\Аниме\\[Топ]\\[Топ-3]\\Аркейн\\ТВ-1\\S01E01.Welcome.to.the.Playground.2160p.UHD.BDRip-002p013.mkv"
    ];

    //await testColor(pathList);
    //await testError(pathList);
    //await testDirExist();
    //await testFileExist();

    //await testFFmpeg();

    const path = "F:\\Аниме\\[Фильмы]\\[Фильм] Алита - Боевой ангел\\Alita Battle Angel 2019 WEBRip 1080p-LQ.mkv";

    //await testCheck(path);
    //await ffmpeg(path);

    //await testMI();

    const series = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        s1 = "D:\\Аниме\\Онгоинги\\!_07_Лето_2017\\Семь - верно, три - неверно\\[AniDub]_Nana_Maru_San_Batsu_[$1]_[720p_x264_Aac]_[MVO].mp4",
        s2 = "D:\\Аниме\\Онгоинги\\!_10_Весна_2018\\Потерянная песня\\[SHIZA Project] Lost Song ONA [$1] [MVO].mkv",
        s3 = "D:\\Аниме\\Онгоинги\\!_10_Весна_2018\\Потерянная песня\\[SHIZA Project] Lost Song ONA [$1] [MVO].mkv";

    //for await (const s of series) log(await mi(s1.replace('$1', s)));
    //for await (const s of series) log(await mi(s2.replace('$1', s)));
    //for await (const s of series) log(await mi(s3.replace('$1', s)));

    //await mi("F:\\Аниме\\Онгоинги\\!_07_Лето_2017\\Семь - верно, три - неверно\\[AniDub]_Nana_Maru_San_Batsu_[11]_[720p_x264_Aac]_[MVO].mp4");
    //await mi("F:\\Аниме\\Онгоинги\\!_10_Весна_2018\\Потерянная песня\\[SHIZA Project] Lost Song ONA [01] [MVO].mkv");

    const iList = [
        "F:\\Convert\\files\\[DC] Make Heroine ga Oosugiru - 07_Telegram.mp4",
        //"F:\\Convert\\files\\[JamClub] Tsue to Tsurugi no Wistoria - 11 [1080p].mp4",
        //"F:\\Аниме\\Онгоинги\\!_37_Зима_2025\\JamClub\\Доктор Стоун\\ТВ-4\\JamClub_Dr_Stone_Science_Future_03_1080p.mp4",
        //"F:\\Convert\\files\\Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv",
        //"F:\\Аниме\\Новое\\Макен-ки\\ТВ-1\\[AniDub] Maken-ki! [01] [BDrip1080p x264 FLAC] [Ancord].mkv",
        //"F:\\Convert\\files\\FBS NF 124 (1080P AVC).mp4"
    ];

    const postfix = `_HEVC(${n > 9 ? n : `0${n}`})`,
        fname = f => f.replace(ext(f), `${postfix}.mkv`),
        fd = "E:\\Convert\\files",
        f0 = `${fd}\\[DC] Make Heroine ga Oosugiru - 07_Telegram.mp4`,
        f1 = fname(f0),
        f2 = `${fd}\\JamClub_Dr_Stone_Science_Future_03_1080p.mp4`,
        f3 = fname(f2),
        f4 = `${fd}\\JamClub_Ore_dake_Level_Up_na_Ken_Season_2_13_1080p.mp4`,
        f5 = fname(f4),
        f6 = `${fd}\\Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv`,
        f7 = fname(f6),
        f8 = `${fd}\\FBS NF 124 (1080P AVC).mp4`,
        f9 = fname(f8),
        f10 = `${fd}\\Glass.Heart.s01e01.HD1080p.WEBRip.Rus.AniDub.com.mp4`,
        f11 = fname(f10),
        f12 = `${fd}\\Dungeon_ni_Deai_wo_Motomeru_no_wa_Machigatteiru_no_Darou_ka_V_[01]_[AniLibria]_[WEBRip_1080p].mkv`,
        f13 = fname(f12);

    //setParams(43);

    //await ffmpeg(f0);
    //await ffmpeg(f2);
    //await ffmpeg(f4);
    //await ffmpeg(f6);
    //await ffmpeg(f8);

    await ffmpeg(f0, postfix, true);
    //await ffmpeg(f2, postfix, true);
    //await ffmpeg(f4, postfix, true);
    //await ffmpeg(f6, postfix, true);
    //await ffmpeg(f8, postfix, true);
    //await ffmpeg(f10, postfix, true);
    //await ffmpeg(f12, postfix, true);

    //await testScripts(76);

    //await scan("F:\\Аниме\\Онгоинги\\!_37_Зима_2025\\JamClub\\Доктор Стоун\\ТВ-4");
    //await scan(fd);

    //await ffmetrics(f1, f0);
    //await ffmetrics(f3, f2);
    //await ffmetrics(f5, f4);
    //await ffmetrics(f7, f6);
    //await ffmetrics(f9, f8);
    //await ffmetrics(f11, f10);
    //await ffmetrics(f13, f12);

    //await testScriptsMetrics(12);
    //await testScriptsMetrics(2, `-out_scale_m=false`);

    //await testParams2(iList, 31, null, 5, 10, 7, 4, [11, 14], 25, [43, 47], [48, 53], [54, 55], 56, 8, [77, 78], [79, 84], [85, 90], [91, 95], [96, 105], [106, 111], 57, [58, 61], [62, 65], [66, 68], [69, 71], [72, 73], [74, 76], [112, 120], [121, 126], [127, 133], [134, 142], [143, 148], [149, 155], [156, 160]);

    //await ffmetadata(f0);
    //await ffformat(f0);
    //await ffinfo(f0);

    //await checkFrames("D:\\Аниме\\Онгоинги\\!_41_Зима_2026\\Адский режим - Хардкорный геймер отправляется в другой мир");
    //await checkFrames(fd);

    //await checkParams("D:\\Аниме\\[Топ]\\SAO\\[Фильм] Прогрессив - Скерцо глубокой ночи\\Sword_Art_Online_the_Movie_-Progressive-_Kuraki_Yuuyami_no_Scherzo_[AniLibria_TV]_[BDRip_1080p_HEVC].mkv");
    //await checkParams("D:\\Аниме\\[Топ]\\Fate\\Прикосновение небес\\III. Весенняя песнь\\Fate_stay_night_Heaven's_Feel_III_Spring_Song_2020_[AniLibria_TV]_[BDRip_1080p_HEVC].mkv");

    //await checkFrames("I:\\Аниме\\Онгоинги\\!_42_Весна_2026\\Subs\\Чёрная кошка и класс ведьм");

    //await checkParams("I:\\Аниме\\Онгоинги\\!_42_Весна_2026\\Subs\\Чёрная кошка и класс ведьм\\[Erai-raws] Kuroneko to Majo no Kyoushitsu - 01 [1080p CR WEBRip HEVC AAC][MultiSub][A1B48EDD].mkv");
    //await checkParams("I:\\Аниме\\Онгоинги\\!_42_Весна_2026\\Subs\\Чёрная кошка и класс ведьм\\[Erai-raws] Kuroneko to Majo no Kyoushitsu - 02 [1080p CR WEBRip HEVC AAC][MultiSub][3D7FF210].mkv");
    //await checkParams("I:\\Аниме\\Онгоинги\\!_42_Весна_2026\\Subs\\Чёрная кошка и класс ведьм\\Kuroneko to Majo no Kyoushitsu - 01 [1080p x265 10bit].mkv");
    //await checkParams("I:\\Аниме\\Онгоинги\\!_42_Весна_2026\\Subs\\Чёрная кошка и класс ведьм\\Kuroneko to Majo no Kyoushitsu - 02 [1080p x265 10bit].mkv");

    /*
    D:\Аниме\Онгоинги\!_41_Зима_2026\Адский режим - Хардкорный геймер отправляется в другой мир\Hell_Mode_Yarikomizuki_no_Gamer_wa_Hai_Sette_[08]_[HEVC].mkv
    crf: 23.0, rc_lookahead: 30 => 20, ref: 2 => 6, bframes: 2 => 4, b_adapt: 1 => 2, b_pyramid: 2 => 1, b_bias: 0 => 0, me: hex => 1, subme: 6 => 2, merange: 16 => 57,
    deblock: 1:0:0 => 0:0, rd: 3, psy: 1 => 2.00, psy_rd: 1.00:0.00 => 0.00, rdoq-level: 0, aq: 1:1.00 => 1.00, aq-mode: 2,
    strong-intra-smoothing: 1, limit-refs: 1, limit-modes: 0, sao: 1, early-skip: 1

    D:\Аниме\Онгоинги\!_41_Зима_2026\Адский режим - Хардкорный геймер отправляется в другой мир\Hell_Mode_Yarikomizuki_no_Gamer_wa_Hai_Sette_[09]_[HEVC].mkv
    crf: 23.0, rc_lookahead: 40 => 20, ref: 4 => 6, bframes: 5 => 4, b_adapt: 2 => 2, b_pyramid: 2 => 1, b_bias: 0 => 0, me: hex => 1, subme: 7 => 2, merange: 16 => 57,
    deblock: 1:1:1 => 0:0, rd: 3, psy: 1 => 2.00, psy_rd: 0.40:0.00 => 0.00, rdoq-level: 0, aq: 1:0.60 => 1.00, aq-mode: 2,
    strong-intra-smoothing: 1, limit-refs: 1, limit-modes: 0, sao: 1, early-skip: 1

    F:\Convert\files\Dungeon_ni_Deai_wo_Motomeru_no_wa_Machigatteiru_no_Darou_ka_V_[01]_[AniLibria]_[WEBRip_1080p]_HEVC.mkv
    crf: 23.0, rc_lookahead: 30 => 20, ref: 2 => 3, bframes: 2 => 6, b_adapt: 1 => 2, b_pyramid: 2 => 1, b_bias: 0 => 0, me: hex => 1, subme: 6 => 2, merange: 16 => 57,
    deblock: 1:0:0 => 1:1, rd: 3, psy: 1 => 0.40, psy_rd: 1.00:0.00 => 0.00, rdoq-level: 0, aq: 1:1.00 => 0.40, aq-mode: 2,
    strong-intra-smoothing: 1, limit-refs: 1, limit-modes: 0, sao: 1, early-skip: 1

    F:\Convert\files\Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC.mkv
    crf: 23.0, rc_lookahead: 48 => 20, ref: 4 => 6, bframes: 0 => 6, b_adapt: und => 2, b_pyramid: und => 1, b_bias: und => 0, me: hex => 1, subme: 8 => 2, merange: 16 => 57,
    deblock: 1:1:1 => 1:1, rd: 3, psy: 1 => 0.40, psy_rd: 0.40:0.00 => 0.00, rdoq-level: 0, aq: 1:0.60 => 0.40, aq-mode: 2,
    strong-intra-smoothing: 1, limit-refs: 1, limit-modes: 0, sao: 1, early-skip: 1

    D:\Аниме\[Топ]\SAO\[Фильм] Прогрессив - Скерцо глубокой ночи\Sword_Art_Online_the_Movie_-Progressive-_Kuraki_Yuuyami_no_Scherzo_[AniLibria_TV]_[BDRip_1080p_HEVC].mkv
    crf: 21.0, rc_lookahead: 25, ref: 6, bframes: 6, b_adapt: 2, b_pyramid: 1, b_bias: 0, me: 3, subme: 3, merange: 57,
    deblock: 1:1, rd: 4, psy: 0.40, psy_rd: 1.00, rdoq-level: 2, aq: 0.40, aq-mode: 2,
    strong-intra-smoothing: 1, limit-refs: 3, limit-modes: 1, sao: 1, early-skip: 0

    D:\Аниме\[Топ]\Fate\Прикосновение небес\III. Весенняя песнь\Fate_stay_night_Heaven's_Feel_III_Spring_Song_2020_[AniLibria_TV]_[BDRip_1080p_HEVC].mkv
    crf: 23.0, rc_lookahead: 20, ref: 6, bframes: 4, b_adapt: 2, b_pyramid: 1, b_bias: 0, me: 1, subme: 2, merange: 57,
    deblock: 0:0, rd: 3, psy: 2.00, psy_rd: 0.00, rdoq-level: 0, aq: 1.00, aq-mode: 2,
    strong-intra-smoothing: 1, limit-refs: 1, limit-modes: 0, sao: 1, early-skip: 1

    I:\Аниме\Онгоинги\!_42_Весна_2026\Subs\Чёрная кошка и класс ведьм\[Erai-raws] Kuroneko to Majo no Kyoushitsu - 01 [1080p CR WEB-DL AVC AAC]_HEVC.mkv
    crf: 18.0, rc_lookahead: 48 => 120, ref: 4 => 5, bframes: 0 => 10, b_adapt: und => 2, b_pyramid: und => 1, b_bias: und => 0, me: hex => 3, subme: 8 => 5, merange: 16 => 57,
    deblock: 1:1:1 => -1:-1, rd: 5, psy: 1 => 1.00, psy_rd: 0.40:0.00 => 1.00, rdoq-level: 2, aq: 1:0.60 => 0.70, aq-mode: 5,
    strong-intra-smoothing: 0, limit-refs: 0, limit-modes: 0, sao: 0, early-skip: 0

    I:\Аниме\Онгоинги\!_42_Весна_2026\Subs\Чёрная кошка и класс ведьм\[Erai-raws] Kuroneko to Majo no Kyoushitsu - 02 [1080p CR WEB-DL AVC AAC]_HEVC.mkv
    crf: 18.0, rc_lookahead: 48 => 120, ref: 4 => 5, bframes: 0 => 10, b_adapt: und => 2, b_pyramid: und => 1, b_bias: und => 0, me: hex => 3, subme: 8 => 5, merange: 16 => 57,
    deblock: 1:1:1 => -1:-1, rd: 5, psy: 1 => 1.00, psy_rd: 0.40:0.00 => 1.00, rdoq-level: 2, aq: 1:0.60 => 0.70, aq-mode: 5,
    strong-intra-smoothing: 0, limit-refs: 0, limit-modes: 0, sao: 0, early-skip: 0

    I:\Аниме\Онгоинги\!_42_Весна_2026\Subs\Чёрная кошка и класс ведьм\[Erai-raws] Kuroneko to Majo no Kyoushitsu - 01 [1080p CR WEB-DL AVC AAC]_HEVC(1).mkv
    crf: 20.5, rc_lookahead: 48 => 250, ref: 4 => 6, bframes: 0 => 8, b_adapt: und => 2, b_pyramid: und => 1, b_bias: und => 0, me: hex => 3, subme: 8 => 4, merange: 16 => 57,
    deblock: 1:1:1 => -1:-1, rd: 4, psy: 1 => 0.50, psy_rd: 0.40:0.00 => 1.00, rdoq-level: 2, aq: 1:0.60 => 0.75, aq-mode: 3,
    strong-intra-smoothing: 1, limit-refs: 0, limit-modes: 1, sao: 1, early-skip: 0

    I:\Аниме\Онгоинги\!_42_Весна_2026\Subs\Чёрная кошка и класс ведьм\[Erai-raws] Kuroneko to Majo no Kyoushitsu - 02 [1080p CR WEB-DL AVC AAC]_HEVC(1).mkv
    crf: 20.5, rc_lookahead: 48 => 15, ref: 4 => 2, bframes: 0 => 4, b_adapt: und => 0, b_pyramid: und => 1, b_bias: und => 0, me: hex => 1, subme: 8 => 2, merange: 16 => 57,
    deblock: 1:1:1 => 0:0, rd: 2, psy: 1 => 2.00, psy_rd: 0.40:0.00 => 0.00, rdoq-level: 0, aq: 1:0.60 => 1.00, aq-mode: 2,
    strong-intra-smoothing: 1, limit-refs: 3, limit-modes: 0, sao: 1, early-skip: 1
    */

    const
        p0 = "G:\\Аниме\\Онгоинги\\!_35_Лето_2024\\DreamCast\\Слишком много проигравших героинь!\\[DC] Make Heroine ga Oosugiru - 07_Telegram.mp4",
        p1 = "G:\\Аниме\\Онгоинги\\!_35_Лето_2024\\JamClub\\Моя сэмпай - парень\\JamClub_Senpai_wa_Otokonoko_01_1080p.mp4",
        p2 = "G:\\Аниме\\Онгоинги\\!_35_Лето_2024\\JamClub\\Почему все забыли мой мир\\JamClub_Naze_Boku_no_Sekai_o_Dare_mo_Oboeteinai_no_ka_03_1080p.mp4",
        p3 = "G:\\Аниме\\Онгоинги\\!_35_Лето_2024\\JamClub\\Меч и жезл Вистории\\JamClub_Tsue_to_Tsurugi_no_Wistoria_11_1080p.mp4",
        p4 = "G:\\Аниме\\Онгоинги\\!_35_Лето_2024\\JamClub\\Меч и жезл Вистории\\JamClub_Tsue_to_Tsurugi_no_Wistoria_12_1080p.mp4",
        p5 = "G:\\Аниме\\Онгоинги\\!_37_Зима_2025\\JamClub\\Поднятие уровня в одиночку\\ТВ-2\\JamClub_Ore_dake_Level_Up_na_Ken_Season_2_12_1080p.mp4",
        p6 = "G:\\Аниме\\Онгоинги\\!_37_Зима_2025\\JamClub\\Поднятие уровня в одиночку\\ТВ-2\\JamClub_Ore_dake_Level_Up_na_Ken_Season_2_13_1080p.mp4",
        p7 = "G:\\Аниме\\Онгоинги\\!_35_Лето_2024\\JamClub\\Псевдогарем\\JamClub_Giji_Harem_01_1080p.mp4",
        p8 = "G:\\Convert\\files\\[DC] Make Heroine ga Oosugiru - 06_Telegram.mp4",
        p9 = "G:\\Convert\\files\\[DC] Make Heroine ga Oosugiru - 07_Telegram.mp4",
        p10 = "G:\\Convert\\files\\[JamClub] Tsue to Tsurugi no Wistoria - 11 [1080p].mp4",
        p11 = "G:\\Convert\\files\\[JamClub] Tsue to Tsurugi no Wistoria - 12 [1080p].mp4";

    const
        files = [/*p0, p1, p2, p3, p4, p5, p6, p7, p8, */p9, p10, p11],
        pList = ['', /*8, 9, 10, 11, 12, 13, 14, 41, 54, 40, 45, 47, 64, 65, 66, 42, 49, 50, 48, 51, 49, 50, 42, 65, 67*/];

    //await ffmpeg(p0, `_HEVC(07)`, true);

    //await testParams(files, pList);

    const a = "G:\\Convert\\files\\Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv",
        a0 = "G:\\Convert\\files\\Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(0).mkv",
        a1 = "G:\\Convert\\files\\Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(1).mkv";

    const c = "G:\\Аниме\\Дорамы\\Стеклянное сердце\\Glass.Heart.s01e03.HD1080p.WEBRip.Rus.AniDub.com.mp4",
        c0 = "G:\\Аниме\\Дорамы\\Стеклянное сердце\\Glass.Heart.s01e03.HD1080p.WEBRip.Rus.AniDub.com.mkv",
        c1 = "G:\\Convert\\out\\ffmpeg_a\\Glass.Heart.s01e03.HD1080p.WEBRip.Rus.AniDub.com.mp4",
        c2 = "G:\\Аниме\\Новое\\Макен-ки\\ТВ-1\\[AniDub] Maken-ki! [01] [BDrip1080p x264 FLAC] [Ancord].mkv",
        c3 = "G:\\Convert\\out\\ffmpeg_a\\[AniDub] Maken-ki! [01] [BDrip1080p x264 FLAC] [Ancord].mp4";

    const mList = ['BT.2020', 'PQ', 'BT.2020 non-constant', 'ST.2084', 'BT.2020 (10-bit)', 'BT.601 NTSC', 'BT.601 PAL'];

    //await testAtt(a, a0, a1);
    //await testCopy('mp4', c, c0, c1, c2, c3);
    //testMatrix(mList);

    //log(miOpts(await mi("G:\\Аниме\\Онгоинги\\!_35_Лето_2024\\DreamCast\\Аля иногда кокетничает со мной по-русски\\[DC] Roshidere - 01_Telegram.mp4")));
    //log(miOpts(await mi("G:\\Аниме\\Онгоинги\\!_35_Лето_2024\\DreamCast\\Жизнь с моей сводной сестрой\\[DC] Gimai Seikatsu - 01_Telegram.mp4")));

    //await checkFrames("G:\\Аниме\\Онгоинги\\!_37_Зима_2025\\JamClub\\Поднятие уровня в одиночку\\ТВ-2");
    //await checkFrames("G:\\Аниме\\Онгоинги\\!_35_Лето_2024\\DreamCast-1\\Аля иногда кокетничает со мной по-русски");

    //log((await miOpts("G:\\Convert\\files\\Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(4).mkv")));
    //log(await size("G:\\Convert\\files\\Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC(4).mkv", 1)); // 212151971
    //log(await size("G:\\Convert\\files\\[DC] Make Heroine ga Oosugiru - 07_Telegram_HEVC(4).mkv", 1)); // 212151971
    //log(await size("G:\\Convert\\files\\[JamClub] Tsue to Tsurugi no Wistoria - 11 [1080p]_HEVC(4).mkv", 1)); // 212151971

    //log((await miOpts("D:\\Аниме\\[Топ-3]\\Bleach\\Тысячелетняя кровавая война\\ТВ-1\\Bleach_-_Thousand_Year_Blood_War_[07]_[BDRip_1080p_AV1].mkv")));
    //log((await miOpts("D:\\Аниме\\[Топ-3]\\Bleach\\Тысячелетняя кровавая война\\ТВ-2\\Bleach TBW II - 08 (21) [BDRip][H.264].mkv")));
    //log((await miOpts("G:\\Аниме\\Новое\\Макен-ки\\ТВ-1\\[AniDub] Maken-ki! [01] [BDrip1080p x264 FLAC] [Ancord].mkv")).v.fc);
    //log((await miOpts("G:\\Аниме\\Новое\\Макен-ки\\ТВ-1\\New\\[AniDub] Maken-ki! [01] [BDrip1080p x264 FLAC] [Ancord].mkv")).v.fc);
    //log((await miOpts("G:\\Аниме\\Новое\\Макен-ки\\ТВ-1\\[AniDub] Maken-ki! [02] [BDrip1080p x264 FLAC] [Ancord].mkv")).v.fc);
    //log((await miOpts("G:\\Аниме\\Новое\\Макен-ки\\ТВ-1\\New\\[AniDub] Maken-ki! [02] [BDrip1080p x264 FLAC] [Ancord].mkv")).v.fc);

    const
        baseDir = 'G:\\Аниме\\Онгоинги',
        dir = resolve(`${baseDir}\\!_37_Зима_2025\\JamClub`),
        dirJ = resolve(`${baseDir}\\!_35_Лето_2024\\JamClub`),
        dirDC = resolve(`${baseDir}\\!_35_Лето_2024\\DreamCast`);

    const
        i0 = resolve(`${i}\\Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p].mkv`),
        o0 = resolve(`${out}\\Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p]_HEVC.mkv`),
        o00 = resolve(`${i}\\Nanatsu_no_Maken_ga_Shihai_suru_[02]_[AniLibria_TV]_[WEBRip_1080p_HEVC].mkv`),
        i1 = resolve(`${i}\\JamClub_Tsue_to_Tsurugi_no_Wistoria_11_1080p.mp4`),
        o1 = resolve(`${out}\\JamClub_Tsue_to_Tsurugi_no_Wistoria_11_1080p_HEVC.mkv`),
        i2 = resolve(`${i}\\FBS NF 124 (1080P AVC).mp4`),
        o2 = resolve(`${out}\\FBS NF 124 (1080P AVC)_HEVC.mkv`),
        i3 = "G:\\Аниме\\Онгоинги\\!_37_Зима_2025\\JamClub\\Поднятие уровня в одиночку\\ТВ-2\\JamClub_Ore_dake_Level_Up_na_Ken_Season_2_13_1080p.mp4",
        o3 = "G:\\Аниме\\Онгоинги\\!_37_Зима_2025\\JamClub\\Поднятие уровня в одиночку\\ТВ-2\\JamClub_Ore_dake_Level_Up_na_Ken_Season_2_13_1080p_HEVC.mkv";

    const
        dirImg = "D:\\Work\\Itorum\\TDEMD\\Big Arts",
        img1 = `${dirImg}\\OKMB2.png`,
        img2 = `${dirImg}\\photo_2025-03-11_18-29-23.jpg`;

    //await arr(dir, dirJ, dirDC);
    //await testParams0(i0, i1, i2, out, 2);
    //await _mi(o0, o1, o2);
    //await mkv(out);
    //await s(i2);
    //await opts(i1, o1, out);
    //params(preset.params);
    //await testSingle(o0, i0, i2, out);
    //await report();
    //await img(img1, img2);
    //await testMetrics(o0, i0);
    //await testMetrics(o00, i0);
    //await testMetrics(o3, i3);
    //await parse();

    //await ffmpeg(o3);
    //await getMetrics(o3, i3);

    //await ffmpeg(i0);
    //log(await mi(o0.replace('out', 'files')));

    //log(await miOpts(i0));

    //await checkFrames(i);

    //await scan(i);
};

export default test;
