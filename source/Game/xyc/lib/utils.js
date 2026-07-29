/* utils.js - 随机/辅助/名字生成函数 */

// ========== 可种子化的随机数生成器 ==========
// 基于 xorshift128+ 算法的简单伪随机数生成器
class SeededRandom {
  constructor(seed) {
    // 当 seed === -1 时，表示显式要求使用原生 Math.random()
    this.useNative = (seed === -1);
    // 如果未指定种子或为 null/undefined，则使用当前时间
    this.seed = (seed === undefined || seed === null) ? Date.now() : seed;
    // 对于非原生模式，使用种子初始化状态
    if (!this.useNative) {
      this.state0 = this.seed ^ 0x12345678;
      this.state1 = (this.seed * 0x9E3779B9) ^ 0x87654321;
    }
  }
  
  next() {
    // 如果构造时选择了原生随机，则直接返回 Math.random()
    if (this.useNative) return Math.random();

    let s1 = this.state0;
    let s0 = this.state1;
    this.state0 = s0;
    s1 ^= s1 << 23;
    s1 ^= s1 >> 17;
    s1 ^= s0;
    s1 ^= s0 >> 26;
    this.state1 = s1;
    const result = (this.state0 + this.state1) >>> 0;
    return result / 0x100000000;
  }
}

// 全局随机数生成器实例
let _globalRng = null;

// 设置全局种子
function setRandomSeed(seed) {
  if (seed !== null && seed !== undefined) {
    // 允许通过 -1 明确请求使用原生 Math.random()
    _globalRng = new SeededRandom(seed);
    if (seed === -1) {
      console.log('[Random] 已设置为使用原生 Math.random()（种子 -1）');
    } else {
      console.log(`[Random] 随机种子已设置: ${seed}`);
    }
  } else {
    _globalRng = null;
    console.log(`[Random] 使用默认随机数生成器`);
  }
}

// 获取随机数（0-1之间）
function getRandom() {
  if (_globalRng) {
    return _globalRng.next();
  }
  return Math.random();
}

function uniform(min, max){ return min + getRandom()*(max-min); }
function uniformInt(min, max){ return Math.floor(min + getRandom()*(max - min + 1)); }
function normal(mean=0, stddev=1){
  let u=0,v=0;
  while(u===0) u=getRandom();
  while(v===0) v=getRandom();
  let z=Math.sqrt(-2.0*Math.log(u))*Math.cos(2*Math.PI*v);
  return z*stddev + mean;
}
function clamp(val,min,max){ return Math.max(min,Math.min(max,val)); }
function clampInt(v,min,max){ return Math.max(min,Math.min(max,Math.round(v))); }
function sigmoid(x){ return 1.0 / (1.0 + Math.exp(-x)); }

/* 今日挑战：根据日期生成种子和挑战参数 */
function getDailyChallengeParams() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  
  // 使用日期字符串作为种子生成随机数
  function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }
  
  const seed = parseInt(dateStr);
  
  // 使用种子生成省份（1-33之间）
  const provinceId = Math.floor(seededRandom(seed) * 33) + 1;
  
  // 使用种子生成初始随机种子（用于游戏内RNG）
  const gameSeed = Math.floor(seededRandom(seed + 1) * 1000000);
  
  return {
    date: dateStr,
    provinceId: provinceId,
    difficulty: 2, // 固定普通难度
    seed: gameSeed,
    displayDate: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
  };
}

function getLetterGradeAbility(val){
    return getLetterGrade(val / 2);
}

function getLetterGrade(val) {
  // 更细化的字母等级，包含带+的中间值。阈值略微上调以匹配数值显示
  // 等级（从低到高）： E, E+, D, D+, C, C+, B, B+, A, A+, S, S+, SS, SS+, SSS
  if (val < 8) return 'E';
  if (val < 16) return 'E+';
  if (val < 30) return 'D';
  if (val < 40) return 'D+';
  if (val < 50) return 'C';
  if (val < 60) return 'C+';
  if (val < 68) return 'B';
  if (val < 76) return 'B+';
  if (val < 82) return 'A';
  if (val < 88) return 'A+';
  if (val < 92) return 'S';
  if (val < 96) return 'S+';
  if (val < 99) return 'SS';
  if (val < 100) return 'SS+';
  // 保持 100 为 SSS，且在 100 之后扩展为不封顶的 U 级别：U1e ... U1sss, U2e ...
  const n = Math.floor(val);
  if (n === 100) return 'SSS';
  if (n > 100) {
    const subs = ['e','e+','d','d+','c','c+','b','b+','a','a+','s','s+','ss','ss+','sss'];
    const v = Number(val);
    // 保留 101-109 的向后兼容整数步进映射（原有行为）
    if (v > 100 && v < 110) {
      const offset = n - 101; // 0-based offset after 100
      const tier = Math.floor(offset / subs.length) + 1;
      const idx = offset % subs.length;
      return `U${tier}${subs[idx]}`;
    }
    // 从 110 起，每个 100 的区间对应 U1, U2, U3...，区间内按 subs 均匀映射
    if (v >= 110) {
      const tier = Math.floor((v - 110) / 100) + 1; // 110-209.999 -> tier 1, 210-309.999 -> tier 2
      const rangeStart = 110 + (tier - 1) * 100;
      const rel = (v - rangeStart) / 100.0; // [0,1)
      let idx = Math.floor(rel * subs.length);
      if (idx < 0) idx = 0;
      if (idx >= subs.length) idx = subs.length - 1;
      return `U${tier}${subs[idx]}`;
    }
    // 兜底：保留原有按整数步进的映射
    const offset = n - 101;
    const tier = Math.floor(offset / subs.length) + 1;
    const idx = offset % subs.length;
    return `U${tier}${subs[idx]}`;
  }
  return 'SSS';
}

/* 名字生成 */
const surnames = [
  "马"
];

const namesPool = [
  "琳","峰"
];

// 固定的汉族名字列表（已去重）
const fixedHanNames = [
  "马琳峰", "郑植", "赵泓迪", "吴清岚", "王馨钏", 
  "卿哲浩", "樊思瑞", "张蜀珺","赵思诚","张根睿","袁文灏","蓝昊天","江中旭","张奔",
  "肖雅涵","张恩炫","林家可","雷智天","曾顺康","姜盼","admax","admin","admex","Xyc","黄川懿","张芮铭","武衍霆","徐守中","强昊森","易子博","尹清澈","陈诚","杨智涵","陆海川","罗立棵","杨皓","代庭宇"
];

// 已使用的汉族名字记录
let usedHanNames = new Set();

// 少数民族姓名池
const minorityPools = {
  '西藏': {
    // 藏族名字多为2-3个音节，有固定搭配
    fullNames: [
      "扎西多吉", "次仁旺堆", "丹增旺姆", "洛桑次仁", "强巴赤列",
      "贡布扎西", "索朗卓玛", "才让卓玛", "尼玛次仁", "普布次仁",
      "德吉卓玛", "白玛旺杰", "格桑次仁", "央金拉姆", "达瓦次仁",
      "次仁卓嘎", "扎西平措", "洛桑江村", "丹增曲扎", "贡觉次旦",
      "旺堆次仁", "尼玛扎西", "白玛曲珍", "格桑德吉", "次仁罗布",
      "扎西顿珠", "强巴格列", "德庆卓玛", "普布顿珠", "边巴次仁",
      "曲珍卓玛", "洛桑平措", "次仁德吉", "扎西旺堆", "才旦卓玛"
    ]
  },
  '新疆': {
    // 维吾尔族名字分男女，常见结构：本名（1-2词），不用姓
    uyghurNames: [
      "阿迪力", "艾力", "买买提", "阿不都热依木", "努尔买买提",
      "古丽娜尔", "热依汗", "阿依努尔", "帕提古丽", "伊明江",
      "图尔逊", "麦麦提", "赛比热", "阿布都卡德尔", "玉素甫",
      "阿布都拉", "阿不都克里木", "艾合买提", "古丽巴哈尔", "热娜古丽",
      "阿依夏木", "木合塔尔", "努尔艾力", "阿曼尼莎", "库尔班",
      "古丽仙", "阿布都热合曼", "赛福鼎", "哈丽旦", "依明尼亚孜",
      "买买提明", "阿依古丽", "帕尔哈提", "热合曼", "吐尔逊娜依"
    ],
    // 哈萨克族（新疆北部）
    kazakhNames: [
      "叶尔肯", "巴合提", "阿依波力", "加那尔", "努尔兰",
      "萨吾列", "卡米拉", "阿娜尔", "别克江", "阿依努尔",
      "努尔别克", "叶尔扎提", "阿尔达克", "玛依拉", "赛力克",
      "古丽娜孜", "哈依沙", "阿斯卡尔", "库力江", "阿依达娜",
      "布尔兰", "阿克江", "沙娜", "托合塔尔", "达列力汗",
      "巴合提江", "古丽孜娜", "阿勒腾", "叶尔兰", "赛依娜"
    ],
  },
  '内蒙古': {
    // 蒙古族：部分有汉化姓（如包、白、乌），部分无姓
    mongolianWithSurname: [
      "巴特尔", "那日松", "乌云其其格", "包志强", "白图雅",
      "乌兰巴特", "额尔敦", "苏和", "宝音", "其木格",
      "包海燕", "白嘎达", "乌力吉", "那顺", "宝音达来",
      "苏日娜", "额尔德尼", "孟和", "朝鲁", "乌日娜",
      "包玉山", "白秀兰", "乌云格日乐", "那顺乌力吉", "宝音其其格",
      "苏雅拉", "额尔敦巴特", "孟根", "朝克", "乌仁其木格"
    ],
    mongolianWithoutSurname: [
      "成吉思", "呼和", "巴音", "嘎达梅林", "朝鲁",
      "阿拉坦", "乌力吉", "娜仁", "孟和", "达来",
      "巴雅尔", "赛音", "其木德", "额尔敦", "敖登",
      "特木尔", "乌兰", "其其格", "宝力德", "哈斯巴根",
      "斯琴", "高娃", "伊德", "那顺", "呼格吉乐",
      "巴特尔苏和", "呼和巴特", "阿拉坦仓", "达木林", "赛罕"
    ],
    // 蒙古姓氏（汉化后使用）
    surnames: ["包", "白", "乌", "那", "宝", "苏", "额", "图", "朝", "孟",
              "敖", "达", "巴", "哈", "云", "胡", "特", "呼", "斯", "高"]
  }
};

// 已使用的少数民族名字记录
const usedMinorityNames = {
  '西藏': new Set(),
  '新疆': new Set(),
  '内蒙古': new Set()
};

/**
 * 生成少数民族名字（合理结构）
 */
function generateMinorityName(region) {
  const pool = minorityPools[region];
  if (!pool) return null;

  if (region === '西藏') {
    const availableNames = pool.fullNames.filter(name => !usedMinorityNames[region].has(name));
    if (availableNames.length === 0) {
      // 如果所有名字都已使用，重置记录
      usedMinorityNames[region].clear();
      return pool.fullNames[uniformInt(0, pool.fullNames.length - 1)];
    }
    const name = availableNames[uniformInt(0, availableNames.length - 1)];
    usedMinorityNames[region].add(name);
    return name;
  }

  if (region === '新疆') {
    const r = getRandom();
    let namePool, poolType;
    if (r < 0.7) {
      namePool = pool.uyghurNames;
      poolType = 'uyghur';
    } else {
      namePool = pool.kazakhNames;
      poolType = 'kazakh';
    }
    
    const availableNames = namePool.filter(name => !usedMinorityNames[region].has(name));
    if (availableNames.length === 0) {
      // 如果所有名字都已使用，重置记录
      usedMinorityNames[region].clear();
      return namePool[uniformInt(0, namePool.length - 1)];
    }
    const name = availableNames[uniformInt(0, availableNames.length - 1)];
    usedMinorityNames[region].add(name);
    return name;
  }

  if (region === '内蒙古') {
    if (getRandom() < 0.6) {
      // 60% 带汉化姓
      const availableSurnames = pool.surnames.filter(name => !usedMinorityNames[region].has(name));
      const availableGiven = pool.mongolianWithSurname.filter(name => !usedMinorityNames[region].has(name));
      
      if (availableSurnames.length === 0 || availableGiven.length === 0) {
        // 如果名字已用完，重置记录
        usedMinorityNames[region].clear();
        const surname = pool.surnames[uniformInt(0, pool.surnames.length - 1)];
        const given = pool.mongolianWithSurname[uniformInt(0, pool.mongolianWithSurname.length - 1)];
        return surname + given;
      }
      
      const surname = availableSurnames[uniformInt(0, availableSurnames.length - 1)];
      const given = availableGiven[uniformInt(0, availableGiven.length - 1)];
      const name = surname + given;
      usedMinorityNames[region].add(name);
      return name;
    } else {
      // 40% 用传统无姓名
      const availableNames = pool.mongolianWithoutSurname.filter(name => !usedMinorityNames[region].has(name));
      if (availableNames.length === 0) {
        // 如果所有名字都已使用，重置记录
        usedMinorityNames[region].clear();
        return pool.mongolianWithoutSurname[uniformInt(0, pool.mongolianWithoutSurname.length - 1)];
      }
      const name = availableNames[uniformInt(0, availableNames.length - 1)];
      usedMinorityNames[region].add(name);
      return name;
    }
  }

  return null;
}

/**
 * 重置所有已使用的名字记录
 */
function resetUsedNames() {
  usedHanNames.clear();
  Object.keys(usedMinorityNames).forEach(region => {
    usedMinorityNames[region].clear();
  });
  console.log('[NameGen] 已重置所有名字使用记录');
}

/**
 * 主生成函数
 */
function generateName(opts = {}) {
  const region = opts.region || null;

  // 1. 小概率复姓（2%）
  if (getRandom() < 0.02) {
    const cs = compoundSurnames[uniformInt(0, compoundSurnames.length - 1)];
    let n = namesPool[uniformInt(0, namesPool.length - 1)];
    if (getRandom() > 0.4) n += namesPool[uniformInt(0, namesPool.length - 1)];
    return cs + n;
  }

  // 2. 少数民族名字概率（按地区调整）
  let minorityProb = 0.005; // 全国默认
  if (region === '西藏') minorityProb = 0.9;
  else if (region === '新疆') minorityProb = 0.6;
  else if (region === '内蒙古') minorityProb = 0.3;

  if (getRandom() < minorityProb) {
    const name = generateMinorityName(region);
    if (name) return name;
  }

  // 3. 默认汉族名字 - 从固定列表中随机选取不重复的名字
  const availableHanNames = fixedHanNames.filter(name => !usedHanNames.has(name));
  
  if (availableHanNames.length === 0) {
    // 如果所有汉族名字都已使用，重置记录
    console.log('[NameGen] 所有汉族名字已使用，重置记录');
    usedHanNames.clear();
    const name = fixedHanNames[uniformInt(0, fixedHanNames.length - 1)];
    usedHanNames.add(name);
    return name;
  }
  
  const name = availableHanNames[uniformInt(0, availableHanNames.length - 1)];
  usedHanNames.add(name);
  return name;
}