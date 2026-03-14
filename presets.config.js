import { args, username } from './baseHelpers.js';

const { hb = true, presetsDir = !hb ? '' : `C:/Users/${username}/AppData/Roaming/HandBrake` } = args;

export const
    defaultPresetsFile = 'presets.json',
    { presets: presetsFile = presetsDir === '' ? '' : `${presetsDir}/${defaultPresetsFile}` } = args;
