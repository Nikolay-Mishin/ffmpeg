import { log } from 'console';
import { parseFloat } from './baseHelpers.js';
import { ar } from './ffmpeg.config.js';

const encoderList = [ 'h264_nvenc', 'hevc_nvenc', 'libx264', 'libx265' ];

const encoders = {
    'nvenc': {
        'h264': 'h264_nvenc', // nvenc_h264
        'h265': 'hevc_nvenc' // nvenc_h265_10bit
    },
    'x264': 'libx264', // x264
    'x265': 'libx265' // x265_10bit
};

const setEncoder = (hw, encoder, bit = '8bit') => { return { hw, encoder, bit }; };

export const getEncoder = (encoder, bit = '8bit') => {
    if (encoderList.includes(encoder)) return setEncoder(encoder.includes('nvenc'), encoder.replace('_nvenc', ''), bit);
    const encoderOpts = encoder.toArr('_');
    const hw = encoderOpts[0];
    const enableHW = hw === Object.keys(encoders)[0];
    const _encoders = enableHW ? encoders[hw] : encoders;
    return setEncoder(enableHW, _encoders[encoderOpts[enableHW ? 1 : 0]], encoderOpts[enableHW ? 2 : 1] || '8bit');
};

const presetBaseTypes = ['faster', 'fast', 'medium', 'slow', 'slower'];
const presetExtTypes = ['ultrafast', 'superfast', 'veryfast', 'veryslow', 'placebo'];
const presetHWTypes = ['fastest', 'slowest'];

export const getPresetType = preset => [...presetBaseTypes, ...presetExtTypes, ...presetHWTypes].includes(preset) ? preset : null;

export const res = {
    1080: {
        w: 1920,
        h: 1080,
        par: '16:9',
        darW: 1920,
        parW: 1,
        parH: 1
    },
    720: {
        w: 1280,
        h: 720,
        par: '16:9',
        darW: 1280,
        parW: 1,
        parH: 1
    },
    576: {
        w: 720,
        h: 576,
        par: '16:9',
        darW: 1024,
        parW: 64,
        parH: 45
    },
    480: {
        w: 720,
        h: 480,
        par: '16:9',
        darW: 853,
        parW: 32,
        parH: 27
    }
};

const format = v => v.replace('av_', '');

export const opts = {
    //hw: false,
    "aMask": "AudioCopyMask",
    /*"aMask": "AudioCopyMask", : [
        "copy:aac"
    ],*/
    //"aEncoder": "AudioEncoderFallback", //: "av_aac",
    "aEncoder": { v: "AudioEncoderFallback", fn: format },
    //"a": "AudioList",
    //"a": { v: "AudioList", fn: (v) => v.map(o => { o.AudioEncoder = format(o.AudioEncoder); return o; }) },
    "a": {
        "AudioList": {
            "b": "AudioBitrate", //: 192,
            //"encoder": "AudioEncoder", //: "av_aac",
            "ca": { v: "AudioEncoder", fn: format },
            "mixdown": "AudioMixdown", //: "stereo",
            //"ar": "AudioSamplerate" //: "auto", // 48000
            "r": { v: "AudioSamplerate", fn: v => v === 'auto' ? ar : v },
        }
    },
    "chapters": "ChapterMarkers", //: true,
    //"ext": "FileFormat", //: "av_mkv",
    "ext": { v: "FileFormat", fn: format },
    "crop": "PictureCropMode", //: 2,
    "cropB": "PictureBottomCrop", //: 0,
    "cropL": "PictureLeftCrop", //: 0,
    "cropR": "PictureRightCrop", //: 0,
    "cropT": "PictureTopCrop", //: 0,
    "darW": "PictureDARWidth", //: 1920, // 0 - avc
    //"space": "PictureColorspacePreset", //: "bt709", // bt2020 9-14-9 | bt601-6-525=smpte170m 6-1-6 | bt601-6-625=bt470bg 5-1-6
    "primaries": { v: "PictureColorspacePreset", fn: v => v === "off" ? null : v === "bt601-6-525" ? "smpte170m" : v === "bt601-6-625" ? "bt470bg" : v },
    "trc": { v: "PictureColorspacePreset", fn: v => v === "off" ? null : v === "bt2020" ? "bt2020-10" : "bt709" },
    "matrix": { v: "PictureColorspacePreset", fn: v => v === "off" ? null : v === "bt2020" ? "bt2020nc" : v === "bt601-6-525" || v === "bt601-6-625" ? "smpte170m" : v },
    "ituPAR": "PictureItuPAR", //: false,
    "ratio": "PictureKeepRatio", //: true, // 
    "par": "PicturePAR", //: "auto",
    "parW": "PicturePARWidth", //: 1, // 0 - avc
    "parH": "PicturePARHeight", //: 1, // 0 - avc
    "w": "PictureWidth", //: 1920,
    "h": "PictureHeight", //: 1080,
    "maxSize": "PictureUseMaximumSize", //: true,
    "upscaling": "PictureAllowUpscaling", //: false,
    "forceH": "PictureForceHeight", //: 0,
    "forceW": "PictureForceWidth", //: 0,
    "pad": "PicturePadMode", //: "none",
    "padT": "PicturePadTop", //: 0,
    "padB": "PicturePadBottom", //: 0,
    "padL": "PicturePadLeft", //: 0,
    "padR": "PicturePadRight", //: 0,
    //"color": "PicturePadColor", //: "black",
    "color": { v: "PicturePadColor", fn: v => v || "black" },
    "presetName": "PresetName", //: "H.265 NVEnc 1080p (10-bit)",
    "b": "VideoAvgBitrate", //: 0,
    //"VideoColorRange": "VideoColorRange", //: "limited",
    "range": { v: "VideoColorRange", fn: v => v !== "auto" ? v : null },
    "matrixCode": "VideoColorMatrixCode", //: 0,
    "encoder": "VideoEncoder", //: "nvenc_h265_10bit",
    //"fps": "VideoFramerate", // 23.976
    "fps": { v: "VideoFramerate", fn: (v = '') => parseFloat(v.replace(',', '.')) },
    "fps_mode": "VideoFramerateMode", //: "cfr",
    "grayScale": "VideoGrayScale", //: false,
    "scaler": "VideoScaler", //: "swscale",
    "preset": "VideoPreset", //: "slowest",
    "tune": "VideoTune", //: "",
    "profile": "VideoProfile", //: "main10",
    "level": "VideoLevel", //: "5.1",
    "params": "VideoOptionExtra", //: "tier=high:rc-lookahead=60:aq-strength=1.0:subq=10:qcomp=0.60:trellis=2:no-deblock:no-fast-pskip",
    //"crfType": "VideoQualityType", //: 2,
    "crfType": { v: "VideoQualityType", fn: v => v === 2 ? 'crf' : 'qp' },
    "crf": "VideoQualitySlider", //: 26.5,
    "pass2": "VideoMultiPass", //: false,
    "turbo": "VideoTurboMultiPass", //: false,
    "x264UseAdvancedOptions": "x264UseAdvancedOptions", //: false,
    "presetDisabled": "PresetDisabled", //: false,
    "metadataPassthru": "MetadataPassthru", //: false
};
