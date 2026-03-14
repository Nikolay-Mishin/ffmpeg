import { log } from 'console';
import { getJSON, isObj, arrToObj } from './baseHelpers.js';
import { resetProps } from './proto.js';
import { defaultPresetsFile, presetsFile } from './presets.config.js';
import { nv, preset as presetName, type } from './ffmpeg.config.js';
import { getEncoder, opts } from './presets.opts.js';

const _is264 = encoder => encoder.includes('264'),
    _isHevc = encoder => encoder.includes('265') || encoder.includes('hevc'),
    _isNV = encoder => encoder.includes('nvenc');

const defaultPresetsArr = (await getJSON(defaultPresetsFile))?.PresetList || [];
const presetsArr = (await getJSON(presetsFile))?.PresetList || [];

//log(defaultPresetsFile);
//log(presetsFile);

//log(defaultPresetsArr);
//log(presetsArr);

const setPresets = (presets) => arrToObj(presets, 'PresetName', 'ChildrenArray', (cb, el) => {
    const [k, v] = cb(el);
    const o = arrToObj(v, 'PresetName');
    //const result = [k, o]; // with renameProp()
    const result = [k.replace(' Presets', ''), o];
    return result;
});//.renameProp('Custom Presets', 'Custom'); // при переименовании новое свойство оказывается в конце

const
    defaultPresets = setPresets(defaultPresetsArr),
    presets = setPresets(presetsArr),
    { Custom: Custom1, General: General1, Web: Web1, Devices: Devices1, Matroska: Matroska1, Hardware: Hardware1, Professional: Professional1 } = defaultPresets,
    { Custom, General, Web, Devices, Matroska, Hardware, Professional } = presets;

//log(defaultPresets);
//log(presets);

//log(defaultPresets['Custom Presets']);
//log(presets['Custom Presets']);
//log(Custom1);
//log(Custom);

const getPreset = (presets, rec = true) => {
    const { o } = getPreset;
    const result = () => (presetName && o.preset) || o.default;
    //log(presets);
    for (const p of Object.values(presets)) {
        if (result()) { getPreset.result = true; break; }
        //log(p);
        const { PresetName, Default, VideoEncoder } = p;
        if (PresetName) o[PresetName === presetName ? 'preset' : nv && _isNV(VideoEncoder) ? 'nv' : Default ? 'default' : ''] = p;
        if (isObj(p) && !PresetName && rec) getPreset(p, false);
    }
    if (getPreset.result && rec) {
        delete getPreset.o[''];
        //log(getPreset.o);
        const o = Object.assign(getPreset.o);
        //log(o);
        resetProps(getPreset, { o: {}, result: false });
    }
    return o;
};
getPreset.o = {};
getPreset.result = false;

const defaultPresetObj = getPreset(defaultPresets);
const presetObj = getPreset(presets);

//log(defaultPresetObj);
//log(presetObj);

const { preset: preset1, nv: nv1, default: default1 } = defaultPresetObj;
const { preset: preset0, nv: nv0, default: default0 } = presetObj;

//log(preset0);
//log(preset1);

//log(default0);
//log(default1);

const presetOpts = preset0 || preset1 || nv0 || nv1 || default0 || default1;

opts.assignProps(presetOpts);
opts.assign(getEncoder(opts.encoder));

const { encoder } = opts;
opts.is264 = _is264(encoder);
opts.isHevc = _isHevc(encoder);
opts.isNV = _isNV(encoder);

export const
    preset = opts,
    { isHevc, isNV } = preset;

export default preset;

//log(preset);

/*
log(Matroska[7]);
log(Custom[29]);
log(Custom[30]);
log(Custom[32]);
log(Custom[33]);
log(Hardware[2]);
log(Custom[0]);
log(Custom[31]);
log(Matroska[2]);
log(Custom[4]);
*/

/*
H.264 MKV 1080p30: x264 // Matroska
H.264 MKV 1080p30 (10-bit): x264_10bit // Custom
H.264 NVENC 1080p: nvenc_h264 // Custom

H.265 1080p (10-bit abr): x265_10bit // Custom
H.265 NVEnc 1080p (10-bit abr): nvenc_h265_10bit // Custom

H.265 NVENC 1080p: nvenc_h265 // Hardware
H.265 NVEnc 1080p (10-bit): nvenc_h265_10bit // Custom
H.265 MKV 1080p30 (8-bit): x265 // Custom
H.265 MKV 1080p30: x265_10bit // Matroska
H.265 1080p (10-bit): x265_10bit // Custom
*/

/*
log(Matroska[7].PresetName); // x264 - H.264 MKV 1080p30
log(Matroska[7].VideoEncoder); // x264 - H.264 MKV 1080p30

log(Custom[29].PresetName); // x264 10-bit - H.264 MKV 1080p30 (10-bit)
log(Custom[29].VideoEncoder); // x264 10-bit - H.264 MKV 1080p30 (10-bit)
log(Custom[30].PresetName); // x264 NV - H.264 NVENC 1080p
log(Custom[30].VideoEncoder); // x264 NV - H.264 NVENC 1080p

log(Custom[32].PresetName); // x265 NV 10-bit abr - H.265 NVEnc 1080p (10-bit abr)
log(Custom[32].VideoEncoder); // x265 NV 10-bit abr - H.265 NVEnc 1080p (10-bit abr)
log(Custom[33].PresetName); // x265 10-bit abr - H.265 1080p (10-bit abr)
log(Custom[33].VideoEncoder); // x265 10-bit abr - H.265 1080p (10-bit abr)

log(Hardware[2].PresetName); // x265 NV - H.265 NVENC 1080p
log(Hardware[2].VideoEncoder); // x265 NV - H.265 NVENC 1080p

log(Custom[0].PresetName); // x265 NV 10-bit - H.265 NVEnc 1080p (10-bit)
log(Custom[0].VideoEncoder); // x265 NV 10-bit - H.265 NVEnc 1080p (10-bit)

log(Custom[31].PresetName); // x265 - H.265 MKV 1080p30 (8-bit)
log(Custom[31].VideoEncoder); // x265 - H.265 MKV 1080p30 (8-bit)

log(Matroska[2].PresetName); // x265 10-bit - H.265 MKV 1080p30
log(Matroska[2].VideoEncoder); // x265 10-bit - H.265 MKV 1080p30

log(Custom[4].PresetName); // x265 10-bit - H.265 1080p (10-bit)
log(Custom[4].VideoEncoder); // x265 10-bit - H.265 1080p (10-bit)
*/
