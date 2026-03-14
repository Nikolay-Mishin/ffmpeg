import { log } from 'console';
import preset from './presets.js';

const { params } = preset;

/**
 * 
 * @param {Number|null} p
 * @returns
 */
export const setParams = (p = null) => {
    switch (p) {
        case 0: return preset.params = params
            .replace(/(rc-lookahead)=10/, '$1=20')
            .replace(/(psy-rd)=1.00/, '$1=0.40')
            .replace(/(aq-mode)=3/, '$1=2')
            .replace(/(ref)=8/, '$1=6')
            .replace(/(deblock)=0/, '$1=1')
            .replace(/(limit-refs)=3/, '$1=1');
        case 1: return preset.params = params
            .replace(/(rc-lookahead)=10/, '$1=20')
            .replace(/(psy-rd)=1.00/, '$1=0.40')
            .replace(/(aq-mode)=3/, '$1=2')
            .replace(/(deblock)=0/, '$1=1')
            .replace(/(limit-refs)=3/, '$1=1');
        case 2: return preset.params = params
            .replace(/(rc-lookahead)=10/, '$1=20')
            .replace(/(psy-rd)=1.00/, '$1=0.40')
            .replace(/(deblock)=0/, '$1=1')
            .replace(/(limit-refs)=3/, '$1=1');
        case 3: return preset.params = params
            .replace(/(rc-lookahead)=10/, '$1=20')
            .replace(/(deblock)=0/, '$1=1')
            .replace(/(limit-refs)=3/, '$1=1');

        case 4: return preset.params = params
            .replace(/(limit-refs)=3/, '$1=1');
        case 5: return preset.params = params
            .replace(/(deblock)=0/, '$1=1');
        case 6: return preset.params = params
            .replace(/(aq-strength)=0.4/, '$1=0.8');
        case 7: return preset.params = params
            .replace(/(bframes)=6/, '$1=8');
        case 8: return preset.params = params
            .replace(/(psy-rdoq)=1.50/, '$1=0.00');

        case 9: return preset.params = params
            .replace(/(rc-lookahead)=20/, '$1=60')
            .replace(/(psy-rdoq)=1.50/, '$1=0.00')
            .replace(/(rdoq-level)=2/, '$1=0');

        case 10: return preset.params = params
            .replace(/(strong-intra-smoothing)=1:(b-intra)=1/, '$1=0:$2=0');
        case 11: return preset.params = params
            .replace(/(psy-rdoq)=1.50/, '$1=0.00')
            .replace(/(strong-intra-smoothing)=1:(b-intra)=1/, '$1=0:$2=0');
        case 12: return preset.params = params
            .replace(/(psy-rdoq)=1.50/, '$1=0.00')
            .replace(/(strong-intra-smoothing)=1:(b-intra)=1/, '$1=0:$2=0')
            .replace(/(sao)=1:(selective-sao)=4/, '$1=0:$2=0');
        case 13: return preset.params = params
            .replace(/(psy-rdoq)=1.50/, '$1=0.00')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(strong-intra-smoothing)=1:(b-intra)=1/, '$1=0:$2=0')
            .replace(/(sao)=1:(selective-sao)=4/, '$1=0:$2=0');
        case 14: return preset.params = params
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(strong-intra-smoothing)=1:(b-intra)=1/, '$1=0:$2=0');

        case 15: return preset.params = params
            .replace(/(me)=1/, '$1=2');
        case 16: return preset.params = params
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2');
        case 17: return preset.params = params
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(merange)=57/, '$1=24');
        case 18: return preset.params = params
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=3')
            .replace(/(merange)=57/, '$1=24');
        case 19: return preset.params = params
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=3')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(deblock)=0/, '$1=1');

        case 20: return preset.params = params
            .replace(/(me)=1/, '$1=3');
        case 21: return preset.params = params
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=3');
        case 22: return preset.params = params
            .replace(/(b-frame)s=6/, '$1=8')
            .replace(/(me)=1/, '$1=3')
            .replace(/(merange)=57/, '$1=24');
        case 23: return preset.params = params
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=3')
            .replace(/(subme)=2/, '$1=3')
            .replace(/(merange)=57/, '$1=24');
        case 24: return preset.params = params
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=3')
            .replace(/(subme)=2/, '$1=3')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(deblock)=0/, '$1=1');

        case 25: return preset.params = params
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(deblock)=0/, '$1=1');

        case 26: return preset.params = params
            .replace(/(psy-rd)=1.00/, '$1=1.50');
        case 27: return preset.params = params
            .replace(/(rc-lookahead)=10/, '$1=60')
            .replace(/(psy-rd)=1.00/, '$1=1.50');
        case 28: return preset.params = params
            .replace(/(rc-lookahead)=10/, '$1=60')
            .replace(/(psy-rd)=1.00/, '$1=1.50')
            .replace(/(aq-strength)=0.4/, '$1=0.8');

        case 29: return preset.params = params
            .replace(/(rc-lookahead)=10/, '$1=60')
            .replace(/(psy-rd)=1.00/, '$1=1.50')
            .replace(/(aq-strength)=0.4/, '$1=0.8')
            .replace(/(bframes)=6/, '$1=8');
        case 30: return preset.params = params
            .replace(/(rc-lookahead)=10/, '$1=60')
            .replace(/(psy-rd)=1.00/, '$1=1.50')
            .replace(/(aq-strength)=0.4/, '$1=0.8')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(subme)=2/, '$1=7');
        case 31: return preset.params = params
            .replace(/(rc-lookahead)=10/, '$1=60')
            .replace(/(psy-rd)=1.00/, '$1=1.50')
            .replace(/(aq-strength)=0.4/, '$1=0.8')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');
        case 32: return preset.params = params
            .replace(/(rc-lookahead)=10/, '$1=60')
            .replace(/(psy-rd)=1.00/, '$1=2.00')
            .replace(/(aq-strength)=0.4/, '$1=0.8')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');
        case 33: return preset.params = params
            .replace(/(rc-lookahead)=10/, '$1=60')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(psy-rd)=1.00/, '$1=2.00')
            .replace(/(aq-strength)=0.4/, '$1=0.8')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');

        case 34: return preset.params = params
            .replace(/(rc-lookahead)=10/, '$1=60')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(psy-rd)=1.00/, '$1=2.00')
            .replace(/(aq-strength)=0.4/, '$1=1.0')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');
        case 35: return preset.params = params
            .replace(/(rc-lookahead)=10/, '$1=60')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(psy-rd)=1.00/, '$1=2.00')
            .replace(/(aq-mode)=3/, '$1=2')
            .replace(/(aq-strength)=0.4/, '$1=1.0')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');
        case 36: return preset.params = params
            .replace(/(rc-lookahead)=10/, '$1=60')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(psy-rd)=1.00/, '$1=2.00')
            .replace(/(aq-strength)=0.4/, '$1=1.0')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(strong-intra-smoothing)=1:(b-intra)=1/, '$1=0:$2=0');
        case 37: return preset.params = params
            .replace(/(rc-lookahead)=10/, '$1=60')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(psy-rd)=1.00/, '$1=2.00')
            .replace(/(aq-strength)=0.4/, '$1=1.0')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(strong-intra-smoothing)=1:(b-intra)=1/, '$1=0:$2=0')
            .replace(/(sao)=1:(selective-sao)=4/, '$1=0:$2=0');

        case 38: return preset.params = params
            .replace(/(rc-lookahead)=10/, '$1=60')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(psy-rd)=1.00/, '$1=2.00')
            .replace(/(rdoq-level)=0/, '$1=2')
            .replace(/(aq-strength)=0.4/, '$1=1.0')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(strong-intra-smoothing)=1:(b-intra)=1/, '$1=0:$2=0')
            .replace(/(sao)=1:(selective-sao)=4/, '$1=0:$2=0');

        case 39: return preset.params = params
            .replace(/(rc-lookahead)=10/, '$1=60')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(psy-rd)=1.00/, '$1=2.00')
            .replace(/(psy-rdoq)=0.00/, '$1=2.00')
            .replace(/(rdoq-level)=0/, '$1=2')
            .replace(/(aq-strength)=0.4/, '$1=1.0')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(strong-intra-smoothing)=1:(b-intra)=1/, '$1=0:$2=0')
            .replace(/(sao)=1:(selective-sao)=4/, '$1=0:$2=0');

        case 40: return preset.params = params
            .replace(/(rc-lookahead)=20/, '$1=60');

        case 41: return preset.params = params
            .replace(/(rdoq-level)=2/, '$1=0');

        case 42: return preset.params = params
            .replace(/(psy-rd)=1.50/, '$1=0.00');

        case 43: return preset.params = params
            .replace(/(psy-rd)=1.50/, '$1=1.00');
        case 44: return preset.params = params
            .replace(/(psy-rd)=1.50/, '$1=2.00');
        case 45: return preset.params = params
            .replace(/(psy-rdoq)=1.50/, '$1=1.00');
        case 46: return preset.params = params
            .replace(/(psy-rdoq)=1.50/, '$1=2.00');
        case 47: return preset.params = params
            .replace(/(rd)=3/, '$1=4');

        case 48: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(psy-rd)=1.50/, '$1=1.00');
        case 49: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(psy-rdoq)=1.50/, '$1=1.00');
        case 50: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(psy-rd)=1.50/, '$1=2.00');
        case 51: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(psy-rdoq)=1.50/, '$1=2.00');
        case 52: return preset.params = params
            .replace(/(aq-strength)=0.4/, '$1=1.0');
        case 53: return preset.params = params
            .replace(/(aq-strength)=0.4/, '$1=0.8');

        case 54: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(aq-strength)=0.4/, '$1=0.8');
        case 55: return preset.params = params
            .replace(/(rc-lookahead)=20/, '$1=60')
            .replace(/(aq-strength)=0.4/, '$1=0.8');

        case 56: return preset.params = params
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(aq-strength)=0.4/, '$1=0.8');

        case 57: return preset.params = params
            .replace(/(subme)=2/, '$1=7');

        case 58: return preset.params = params
            .replace(/(me)=1/, '$1=2');
        case 59: return preset.params = params
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7');
        case 60: return preset.params = params
            .replace(/(me)=1/, '$1=2')
            .replace(/(merange)=57/, '$1=24');
        case 61: return preset.params = params
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');

        case 62: return preset.params = params
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');
        case 63: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');
        case 64: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');
        case 65: return preset.params = params
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(early-skip)=1/, '$1=0');

        case 66: return preset.params = params
            .replace(/(aq-mode)=3/, '$1=2')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');
        case 67: return preset.params = params
            .replace(/(aq-strength)=0.4/, '$1=0.8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');
        case 68: return preset.params = params
            .replace(/(aq-mode)=3/, '$1=2')
            .replace(/(aq-strength)=0.4/, '$1=0.8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');

        case 69: return preset.params = params
            .replace(/(rc-lookahead)=20/, '$1=60')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');
        case 70: return preset.params = params
            .replace(/(rc-lookahead)=20/, '$1=60')
            .replace(/(aq-strength)=0.4/, '$1=0.8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');
        case 71: return preset.params = params
            .replace(/(rc-lookahead)=20/, '$1=60')
            .replace(/(aq-mode)=3/, '$1=2')
            .replace(/(aq-strength)=0.4/, '$1=0.8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');

        case 72: return preset.params = params
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(limit-refs)=3/, '$1=1');
        case 73: return preset.params = params
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(limit-modes)=0/, '$1=1');

        case 74: return preset.params = params
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(strong-intra-smoothing)=1:(b-intra)=1/, '$1=0:$2=0');
        case 75: return preset.params = params
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(strong-intra-smoothing)=1:(b-intra)=1/, '$1=0:$2=0')
            .replace(/(sao)=1:(selective-sao)=4/, '$1=0:$2=0');
        case 76: return preset.params = params
            .replace(/(psy-rdoq)=1.50/, '$1=0.00')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(strong-intra-smoothing)=1:(b-intra)=1/, '$1=0:$2=0')
            .replace(/(sao)=1:(selective-sao)=4/, '$1=0:$2=0');

        case 77: return preset.params = params
            .replace(/(psy-rd)=1.50/, '$1=1.00')
            .replace(/(psy-rdoq)=1.50/, '$1=1.00');
        case 78: return preset.params = params
            .replace(/(psy-rd)=1.50/, '$1=1.00')
            .replace(/(psy-rdoq)=1.50/, '$1=1.00')
            .replace(/(bframes)=6/, '$1=8');

        case 79: return preset.params = params
            .replace(/(psy-rdoq)=1.50/, '$1=<1-2>');
        case 80: return preset.params = params
            .replace(/(psy-rd)=1.50/, '$1=<1-2>');
        case 81: return preset.params = params
            .replace(/(psy-rd)=1.50/, '$1=<1-2>')
            .replace(/(psy-rdoq)=1.50/, '$1=<1-2>');
        case 82: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(psy-rd)=1.50/, '$1=<1-2>')
            .replace(/(psy-rdoq)=1.50/, '$1=<1-2>');
        case 83: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(psy-rd)=1.50/, '$1=<1-2>')
            .replace(/(psy-rdoq)=1.50/, '$1=<1-2>')
            .replace(/(rskip)=1/, '$1=2');
        case 84: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(psy-rd)=1.50/, '$1=<1-2>')
            .replace(/(psy-rdoq)=1.50/, '$1=<1-2>')
            .replace(/(bframes)=6/, '$1=8');

        case 85: return preset.params = params
            .replace(/(psy-rdoq)=1.50/, '$1=<1-5>');
        case 86: return preset.params = params
            .replace(/(psy-rd)=1.50/, '$1=<1-5>');
        case 87: return preset.params = params
            .replace(/(psy-rd)=1.50/, '$1=<1-5>')
            .replace(/(psy-rdoq)=1.50/, '$1=<1-5>');
        case 88: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(psy-rd)=1.50/, '$1=<1-5>')
            .replace(/(psy-rdoq)=1.50/, '$1=<1-5>');
        case 89: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(psy-rd)=1.50/, '$1=<1-5>')
            .replace(/(psy-rdoq)=1.50/, '$1=<1-5>')
            .replace(/(rskip)=1/, '$1=2');
        case 90: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(psy-rd)=1.50/, '$1=<1-5>')
            .replace(/(psy-rdoq)=1.50/, '$1=<1-5>')
            .replace(/(bframes)=6/, '$1=8');

        case 91: return preset.params = params
            .replace(/(aq-mode)=3/, '$1=2');
        case 92: return preset.params = params
            .replace(/(aq-mode)=3/, '$1=2');
        case 93: return preset.params = params
            .replace(/(aq-mode)=3/, '$1=2')
            .replace(/(aq-strength)=0.4/, '$1=0.8');
        case 94: return preset.params = params
            .replace(/(rc-lookahead)=20/, '$1=60');
        case 95: return preset.params = params
            .replace(/(rc-lookahead)=20/, '$1=60')
            .replace(/(aq-mode)=3/, '$1=2')
            .replace(/(aq-strength)=0.4/, '$1=0.8');

        case 96: return preset.params = params
            .replace(/(early-skip)=1/, '$1=0');
        case 97: return preset.params = params
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(early-skip)=1/, '$1=0');
        case 98: return preset.params = params
            .replace(/(rskip)=1/, '$1=2');
        case 99: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2');
        case 100: return preset.params = params
            .replace(/(limit-sao)=0/, '$1=1');
        case 101: return preset.params = params
            .replace(/(limit-modes)=0/, '$1=1');
        case 102: return preset.params = params
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(limit-sao)=0/, '$1=1');
        case 103: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(limit-modes)=0/, '$1=1');
        case 104: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(limit-modes)=0/, '$1=1');
        case 105: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(limit-sao)=0/, '$1=1');

        case 106: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(bframes)=6/, '$1=8');
        case 107: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(bframes)=6/, '$1=8');
        case 108: return preset.params = params
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(limit-sao)=0/, '$1=1');
        case 109: return preset.params = params
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(limit-modes)=0/, '$1=1');
        case 110: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(limit-modes)=0/, '$1=1');
        case 111: return preset.params = params
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(limit-sao)=0/, '$1=1');

        case 112: return preset.params = params
            .replace(/(rect)=0/, '$1=1');
        case 113: return preset.params = params
            .replace(/(amp)=0/, '$1=1');
        case 114: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1');
        case 115: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(limit-modes)=0/, '$1=1');
        case 116: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(limit-sao)=0/, '$1=1');
        case 117: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4');
        case 118: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2');
        case 119: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(limit-modes)=0/, '$1=1');
        case 120: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(limit-sao)=0/, '$1=1');

        case 121: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(bframes)=6/, '$1=8');
        case 122: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(limit-modes)=0/, '$1=1');
        case 123: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(limit-sao)=0/, '$1=1');
        case 124: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(bframes)=6/, '$1=8');
        case 125: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(limit-modes)=0/, '$1=1');
        case 126: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(limit-sao)=0/, '$1=1');

        case 127: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(early-skip)=1/, '$1=0');
        case 128: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(early-skip)=1/, '$1=0');
        case 129: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(limit-sao)=0/, '$1=1')
            .replace(/(early-skip)=1/, '$1=0');
        case 130: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(early-skip)=1/, '$1=0');
        case 131: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(early-skip)=1/, '$1=0');

        case 132: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(limit-sao)=0/, '$1=1')
            .replace(/(early-skip)=1/, '$1=0');

        case 133: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(limit-sao)=0/, '$1=1')
            .replace(/(early-skip)=1/, '$1=0');

        case 134: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');
        case 135: return preset.params = params
            .replace(/(amp)=0/, '$1=1')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');
        case 136: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');
        case 137: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');
        case 138: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(limit-modes)=0/, '$1=1');
        case 139: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(limit-sao)=0/, '$1=1');
        case 140: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');
        case 141: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(limit-modes)=0/, '$1=1');
        case 142: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(limit-sao)=0/, '$1=1');

        case 143: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');
        case 144: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(limit-modes)=0/, '$1=1');
        case 145: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(limit-sao)=0/, '$1=1');
        case 146: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24');
        case 147: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(limit-modes)=0/, '$1=1');
        case 148: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(limit-sao)=0/, '$1=1');

        case 149: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(early-skip)=1/, '$1=0');
        case 150: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(early-skip)=1/, '$1=0');
        case 151: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(limit-sao)=0/, '$1=1')
            .replace(/(early-skip)=1/, '$1=0');
        case 152: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(early-skip)=1/, '$1=0');
        case 153: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(early-skip)=1/, '$1=0');
        case 154: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(limit-sao)=0/, '$1=1')
            .replace(/(early-skip)=1/, '$1=0');
        case 155: return preset.params = params
            .replace(/(rect)=0/, '$1=1')
            .replace(/(amp)=0/, '$1=1')
            .replace(/(rd)=3/, '$1=4')
            .replace(/(rskip)=1/, '$1=2')
            .replace(/(bframes)=6/, '$1=8')
            .replace(/(me)=1/, '$1=2')
            .replace(/(subme)=2/, '$1=7')
            .replace(/(merange)=57/, '$1=24')
            .replace(/(limit-modes)=0/, '$1=1')
            .replace(/(limit-sao)=0/, '$1=1')
            .replace(/(early-skip)=1/, '$1=0');


        case 156: return preset.params = params
            .replace(/(rc-lookahead)=20/, 'min-keyint=24:keyint=240:$1=20');
        case 157: return preset.params = params
            .replace(/(rc-lookahead)=20/, 'min-keyint=23:keyint=240:$1=20');
        case 158: return preset.params = params
            .replace(/(rc-lookahead)=20/, 'min-keyint=0:$1=20');
        case 159: return preset.params = params
            .replace(/(rc-lookahead)=20/, 'min-keyint=23:$1=20');
        case 160: return preset.params = params
            .replace(/(rc-lookahead)=20/, 'min-keyint=23:keyint=250:$1=20');

        default: return preset.params = params;
    }
}
