import { log } from 'console';
import mediainfo from 'node-mediainfo';
import { exiftool, ExifTool } from 'exiftool-vendored';
import { ext, getInt, isFile, isStr, parseFloat, parseInt, arrToObj } from './baseHelpers.js';
import { fps } from './ffmpeg.config.js';
import { lower } from './proto.js';

export { mediainfo, exiftool, ExifTool };

const setCount = async (g, v) => {
    const { VideoCount: vCount, AudioCount: aCount = '', TextCount: sCount = '' } = g || {};
    //log({ vCount, aCount, sCount });
    Object.entries({ vCount, aCount, sCount }).forEach(([k, _v]) => v[k] = getInt(_v));
};

export const
    mi = async (path, concat = true) => {
        if (!await isFile(path)) return !concat ? [] : {};
        const mi = (await mediainfo(path))?.media?.track || [];
        const v = mi[1] || {};
        //log(mi);
        v.i = path;
        v.ext = ext(path).replace('.', '');
        setCount(mi[0], v);
        //log(v);
        return !concat ? mi : arrToObj(mi, '@type', true, 'General', 'Video');
    },
    miList = async (...path) => {
        const concat = path[0] === false ? path.shift() : true;
        //return await getPromises(path, async f => await getMI(f, concat));
        let i = 0; for await (const f of path) { path[i] = await mi(f, concat); i++; }
        return path;
    },
    exif = async path => {
        const _exif = new ExifTool();
        const tags = await _exif.read(path);
        _exif.end();
        return tags;
    };

export const
    baseMI = {
        Width: 1920,
        Height: 1080,
        ColorSpace: 'YUV',
        ChromaSubsampling: '4:2:0',
        BitDepth: '10',
        FrameRate: fps,
        FrameRate_Mode: 'CFR'
    },
    baseMI1 = Object.assign(baseMI, { bit: '8' }),
    int = v => getInt(v);

export const
    order = v => getInt(v, 1),
    b = v => parseFloat(getInt(v) / 1000, 0),
    matrix = (v, type = 'matrix') => {
        v = v?.replace('.', '')
            .replace(/(.+)\s(\w{1})\w+-(\w{1})\w+/, '$1$2$3')
            .replace(/PQ|ST2084/, 'smpte2084')
            .replace('HLG', 'arib-std-b67')
            .replace(/\s\((10|12)-bit\)/, '-$1')
            .replace('BT601 NTSC', 'smpte170m')
            .replace('BT601 PAL', type === 'matrix' ? 'smpte170m' : 'bt470bg');
        return lower(v);
    };

const opts = {
    g: {
        General: {
            type: '@type', //: 'General',
            //vCount: 'VideoCount', //: '1',
            vCount: { v: 'VideoCount', fn: getInt }, //: '1',
            //aCount: 'AudioCount', //: '2',
            aCount: { v: 'AudioCount', fn: getInt }, //: '2',
            //sCount: 'TextCount', //: '2',
            sCount: { v: 'TextCount', fn: getInt }, //: '2',
            format: 'Format', //: 'Matroska',
            d: 'Duration', //: '1420.117',
            s: 'FileSize', // 177811861
            //b: 'OverallBitRate', //: '8335664',
            b: { v: 'OverallBitRate', fn: b },
            b_mode: 'OverallBitRate_Mode', //: 'VBR', // AVC
            fps: 'FrameRate', //: '23.976',
            //e: 'extra'
            e: {
                extra: {
                    a: 'Attachments'
                }
            }
        }
    },
    v: {
        Video: {
            type: '@type', //: 'Video',
            //order: '@typeorder', //: '1',
            order: { v: '@typeorder', fn: order },
            //stream: 'StreamOrder', //: '0',
            stream: { v: 'StreamOrder', fn: order },
            //stream: { v: 'StreamOrder', fn: v => { log(v); return getInt(v); } },
            //id: 'ID', //: '1',
            id: { v: 'ID', fn: getInt },
            format: 'Format', //: 'HEVC',
            codec: 'CodecID', //: 'V_MPEGH/ISO/HEVC',
            profile: 'Format_Profile', //: 'Main 10', // 'High' // AVC
            level: 'Format_Level', //: '5.1',
            tier: 'Format_Tier', //: 'High', // 'undefined' // AVC
            cabac: 'Format_Settings_CABAC', //: 'Yes', // AVC
            ref: 'Format_Settings_RefFrames', //: '4', // AVC
            d: 'Duration', //: '1420.044000000',
            //b_mode: 'BitRate_Mode', //: 'VBR', // AVC
            b_mode: { v: 'BitRate_Mode', fn: v => lower(v) || 'cbr' },
            //b: 'BitRate', //: '820862'
            b: { v: 'BitRate', fn: b },
            //b_max: 'BitRate_Maximum', //: '6000000', // AVC
            b_max: { v: 'BitRate_Maximum', fn: b },
            //w: 'Width', //: '1920',
            w: { v: 'Width', fn: getInt },
            //h: 'Height', //: '1080',
            h: { v: 'Height', fn: getInt },
            //stored_h: 'Stored_Height', //: '1088', // AVC
            //stored_h: { v: 'Stored_Height', fn: getInt },
            stored_h: { v: 'Stored_Height', fn: int },
            //sampled_w: 'Sampled_Width', //: '1920',
            sampled_w: { v: 'Sampled_Width', fn: getInt },
            //sampled_h: 'Sampled_Height', //: '1080',
            sampled_h: { v: 'Sampled_Height', fn: getInt },
            sar: 'PixelAspectRatio', //: '1.000',
            dar: 'DisplayAspectRatio', //: '1.778',
            //fps_mode: 'FrameRate_Mode', //: 'CFR',
            fps_mode: { v: 'FrameRate_Mode', fn: lower },
            fps_mode_o: 'FrameRate_Mode_Original', //: 'VFR', // AVC
            fr: 'FrameRate', //: '23.976',
            fr_o: 'FrameRate_Original', //: '23.976',
            fc: 'FrameCount', //: '34579',
            space: 'ColorSpace', //: 'YUV',
            chroma: 'ChromaSubsampling', //: '4:2:0',
            bit: 'BitDepth', //: '10',
            scan: 'ScanType', //: 'Progressive', // AVC
            params: 'Encoded_Library_Settings', //: '',
            default: 'Default', //: 'Yes',
            forced: 'Forced', //: 'No',
            //range: 'colour_range', //: 'Limited',
            range: { v: 'colour_range', fn: lower },
            //primaries: 'colour_primaries', //: 'BT.709',
            //trc: 'transfer_characteristics', //: 'BT.709',
            //matrix: 'matrix_coefficients', //: 'BT.709'
            primaries: { v: 'colour_primaries', fn: v => matrix(v, 'primaries') },
            trc: { v: 'transfer_characteristics', fn: matrix },
            matrix: { v: 'matrix_coefficients', fn: matrix },
            i: 'i',
            ext: 'ext',
            vCount: 'vCount',
            aCount: 'aCount',
            sCount: 'sCount'
        }
    },
    a: {
        Audio: {
            type: '@type', //: 'Audio',
            //order: '@typeorder', //: '1',
            order: { v: '@typeorder', fn: order },
            //stream: 'StreamOrder', //: '1',
            stream: { v: 'StreamOrder', fn: order },
            //id: 'ID', //: '2',
            id: { v: 'ID', fn: getInt },
            codec: 'CodecID', //: 'A_AAC-2',
            format: 'Format', //: 'AAC',
            format_t: 'Format_Commercial_IfAny', //: 'HE-AACv2',
            format_sbr: 'Format_Settings_SBR', //: 'Yes (NBC)',
            format_ps: 'Format_Settings_PS', //: 'Yes (NBC)',
            format_p: 'Format_AdditionalFeatures', //: 'LC SBR PS',
            d: 'Duration', //: '1420.117000000',
            //b_mode: 'BitRate_Mode', //: 'VBR', // AVC
            b_mode: { v: 'BitRate_Mode', fn: v => lower(v) || 'cbr' },
            //b: 'BitRate', //: '192000',
            b: { v: 'BitRate', fn: b },
            //b_max: 'BitRate_Maximum', //: '192000 / 192000',
            b_max: { v: 'BitRate_Maximum', fn: v => b(v?.replace(/(\d+) \/ \d+/, '$1'), null) },
            //ar: 'Channels', //: '2',
            ar: { v: 'Channels', fn: getInt },
            //rate: 'SamplingRate', //: '48000',
            rate: { v: 'SamplingRate', fn: getInt },
            mode: 'Compression_Mode', //: 'Lossy',
            title: 'Title', //: 'AniLibria.TV',
            lang: 'Language', //: 'ru',
            default: 'Default', //: 'Yes',
            forced: 'Forced', //: 'No'
        }
    },
    s: {
        Text: {
            type: '@type', //: 'Text',
            //order: '@typeorder', //: '1',
            order: { v: '@typeorder', fn: order },
            //id: 'ID', //: '4',
            id: { v: 'ID', fn: getInt },
            format: 'Format', //: 'ASS',
            codec: 'CodecID', //: 'S_TEXT/ASS',
            d: 'Duration', //: '1334.570000000',
            //b: 'BitRate', //: '340',
            b: { v: 'BitRate', fn: int },
            rate: 'FrameRate', //: '0.285',
            mode: 'Compression_Mode', //: 'Lossless',
            title: 'Title', //: 'Надписи',
            lang: 'Language', //: 'ru',
            default: 'Default', //: 'Yes',
            forced: 'Forced', //: 'No'
        }
    }
};

export const
    assignMI = mi => {
        //log('===assignMI===');
        //log(mi);
        const props = {}.assign(opts).assignProps(mi);
        const { v } = props;
        if (v.k().length) v.tier = v.tier || v.profile
        //log(props);
        return props;
    },
    miOpts = async (...mi) => { const arr = (!isStr(mi[0]) ? mi : await miList(...mi)).map(mi => assignMI(mi)); return arr.length < 2 ? arr[0] : arr; },
    size = async (i, digit = 0) => {
        if (isStr(i)) i = await mi(i) || { g: {}, v: {} };
        //log(i);
        const v = i.Video || i.v;
        //log(v);
        const { fc = v.FrameCount } = v;
        i = i.General || i.g;
        const { s = i.FileSize || 0, b = i.OverallBitRate || 0 } = i;
        return { s: parseInt(s / (digit * 1024 || 1)), b: parseInt(b / (digit * 1000 || 1), false), fc };
    };
