import { log } from 'console';
import { isStr, readFile } from './baseHelpers.js';

export const
    hasOwn = (o, p) => Object.hasOwn(o, p),
    keys = (o) => Object.keys(o),
    values = (o) => Object.values(o),
    entries = (o) => Object.entries(o),
    fromEntries = (entries) => Object.fromEntries(entries),
    assign = (...o) => Object.assign(o.shift(), ...o),
    props = (o) => Object.getOwnPropertyNames(o),
    propDesc = (o, p, ...ex) => { const desc = Object.getOwnPropertyDescriptor(o, p) || {}; ex.forEach(p => delete desc[p]); return desc; },
    resetProps = (o, props) => { Object.keys(o).forEach(p => o[p] = Object.hasOwn(props, p) ? props[p] : null); return o; },
    trimFirst = (str) => str.replace(/^\s/, ''),
    trimLast = (str) => str.replace(/\s$/, ''),
    trim = (str) => trimLast(trimFirst(str)),
    removeTabs = (str, trimStr = true) => (trimStr ? trim(str) : str).replace(/\r/g, '').replace(/\n$/, ''),
    lower = s => s?.toLowerCase(),
    upper = s => s?.toUpperCase(),
    strToArr = (str, sep = '\n', trimStr = true, cb = s => s) => {
        if (trimStr) str = removeTabs(str);
        const isFn = cb instanceof Function;
        return !(isFn || trimStr) ? str.split(sep) : str.split(sep).map(str => { if (trimStr) str = trim(str); return isFn ? cb(str) : str; });
    },
    uniqueArr = arr => arr.filter((el, i) => i === arr.indexOf(el));

export const fileToArr = async (path, sep = '\n', cb = s => s, ...replace) => {
    if (replace.length === 0) replace = [/\r/g, /\n$/];
    let str = await readFile(path);
    //log(replace);
    //log(str);
    if (!isStr(str)) return [];
    replace.forEach(item => str = str.replace(item, ''));
    //log(str);
    return str.toArr(sep, true, cb);
};

/**
 * 
const pairArray = [{ key: "a", value: "1" }, { key: "a", value: "2" }, { key: "b", value: "1" }, { key: "b", value: "2" }];
const obj1 = arrToObj(pairArray, 'key');              // { a: { key: 'a', value: '2' }, b: { key: 'b', value: '2' } }
const obj = arrToObj(pairArray, 'key', 'value');    // { a: '2', b: '2' }
const obj2 = arrToObj(pairArray, 'key', true);      // { a: [ { key: 'a', value: '1' }, { key: 'a', value: '2' } ] }
const obj3 = arrToObj(pairArray, 'key', true, 'a'); // { a: { key: 'a', value: '2' }, b: [ { key: 'b', value: '1' }, { key: 'b', value: '2' } ] }
*/
export const arrToObj = (arr, k, ...keys) => {
    //log(arr);
    //log(arr.length);
    const v = keys.shift();
    const cb = typeof keys[0] === 'function' ? keys.shift() : (cb, ...attrs) => cb(...attrs);
    const mapCb = el => [el[k], el[v] || el];
    //log(cb);
    if (v !== true) return Object.fromEntries(arr.map(el => cb(mapCb, el)));
    const reduceCb = (acc, el) => {
        const _k = el[k];
        const isObj = keys.includes(_k);
        acc[_k] = isObj ? el : (acc[_k] || []);
        if (!isObj) acc[_k].push(el);
        return acc;
    };
    return arr.reduce((acc, el) => cb(reduceCb, acc, el), {});
};

const defineDesc = {
    writable: true, // Cannot alter this property - assign don't with read only property
    enumerable: false, // Will not show up in a for-in loop.
    configurable: false, // Cannot be deleted via the delete operator
};

export const
    define = (o, k, v, desc = defineDesc, reW = true) => { if (o.hasOwnProperty(k) && reW) k = `_${k}`; Object.defineProperty(o, k, assign({}, defineDesc, desc, { value: v })); },
    defineProto = (o, k, v, desc = defineDesc) => define(proto(o), k, v, desc),
    proto = (o) => o.prototype || o.__proto__,
    obj = Object,
    arr = Array,
    str = String,
    $proto = proto(obj),
    protoA = proto(arr);

export const setProto = (o, protoList, desc = defineDesc, cb = true) => {
    cb = (cb instanceof Function) ? cb : (cb === false ? v => v : (fn) => function (...attrs) { /*log(this);*/ return fn(this, ...attrs); });
    entries(protoList).forEach(([k, v]) => {
        const pDesc = desc;
        if (!(v instanceof Function)) {
            const { desc = {}, fn } = v;
            assign(pDesc, desc); // pDesc, desc
            v = fn;
        }
        const fnDesc = propDesc(v, 'name', 'value');
        v = cb(v);
        if (v.name !== k) define(v, 'name', k, fnDesc, false);
        defineProto(o, k, v, pDesc);
    });
    return proto(o);
};

export const assignProps = (o, props, rec = true) => {
    //log('===assign===');
    //log(o);
    //log(props);
    entries(o).forEach(([k, v]) => {
        //log('===entries===');
        //log(k);
        //log(v);
        if (typeof v === 'object') {
            const _keys = keys(v);
            const includes = _keys.includes('fn') || _keys.includes('v');
            if (rec && !includes) {
                const [_k, _v] = v.entries()[0];
                const has = hasOwn(props, k);
                const p = props[hasOwn(props, k) ? k : _k];
                //log('===rec===');
                //log(_k);
                //log(_v);
                //log(has);
                v = {}.assign(has ? v : _v);
                //log(v);
                //log(p);
                o[k] = !p ? {} : (!(p instanceof Array) ? assignProps(v, p) : p.map(p => assignProps({}.assign(v), p)));
                //log('===set===');
                //log(o[k]);
            }
            else if (includes) {
                const { k, v: _v, fn = (v, p) => v } = v;
                //log('===includes===');
                //log(k);
                //log(_v);
                //log(fn);
                //log(props[_v]);
                //log(props);
                props[_v] = fn(props[_v], props);
                if (hasOwn(v, k)) props[_v] = { k, v: props[_v] };
                v = _v;
            }
        }
        //log('===setObj===');
        //log(o[k]);
        //log(props[v]);
        if (typeof v === 'string') o[k] = props[v];
        //log(o[k]);
    });
    return o;
};

/**
 * 
 * @param {any} old
 * @param {any} newName
 * @returns
 */
export const renameProp = (o, old, newName) => {
    // Check for the old property name to
    // avoid a ReferenceError in strict mode.
    // Do nothing if the names are the same
    if (o.hasOwnProperty(old) && old !== newName) {
        define(o, newName, o[old], propDesc(o, old, 'value'));
        delete o[old];
    }
    return o;
}

setProto(obj, { renameProp, hasOwn, k: keys, v: values, entries, assign, props, propDesc, resetProps, assignProps });
setProto(arr, { fromEntries, toObj: arrToObj, unique: uniqueArr });
setProto(str, { removeTabs, trimFirst, trimLast, lower, upper, toArr: strToArr, fileToArr });

export default defineProto;
