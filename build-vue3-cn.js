/**
 * Vue.js 3.x 中文文档 Dash Docset 构建脚本
 * 基于官方 Docset 索引结构优化
 * author: lyonjiang
 * date: 2024-10-21
 */

const fs = require('fs');
const path = require('path');
const exec = require('sync-exec');
const db = require('sqlite-sync');
const cheerio = require('cheerio');
const { simplifyPageLayout } = require('./simplify-page-layout');

// Docset 配置
let docset = {
  name: `VueJS_3_(Composition).docset`,
  path: path.join(__dirname, `VueJS_3_(Composition).docset`),
  resPath: path.join(__dirname, `VueJS_3_(Composition).docset/Contents/Resources`),
  // Vue3 文档目录结构
  include: {
    api: ['api'], // API 参考文档
    guide: ['guide'] // 教程指南
  }
};

const resPath = path.join(`${docset.resPath}/Documents/cn.vuejs.org`);

// Dash 类型映射 - 完全基于官方版本
// 官方只支持: Component, Directive, Method, Attribute, Guide, Section
const dashTypes = {
  // API 文档分类映射 - h2 作为主索引
  api: {
    // 文件名到 Dash 类型的映射
    'built-in-components': 'Component',
    'built-in-directives': 'Directive',
    'built-in-special-attributes': 'Attribute',

    // 其他所有 API 文档统一使用 Method 类型
    'built-in-special-elements': 'Method',
    'composition-api-setup': 'Method',
    'composition-api-lifecycle': 'Method',
    'composition-api-dependency-injection': 'Method',
    'composition-api-helpers': 'Method',
    'reactivity-core': 'Method',
    'reactivity-advanced': 'Method',
    'reactivity-utilities': 'Method',
    'options-state': 'Method',
    'options-rendering': 'Method',
    'options-lifecycle': 'Method',
    'options-composition': 'Method',
    'options-misc': 'Method',
    'application': 'Method',
    'general': 'Method',
    'component-instance': 'Method',
    'render-function': 'Method',
    'custom-renderer': 'Method',
    'custom-elements': 'Method',
    'compile-time-flags': 'Method',
    'sfc-spec': 'Method',
    'sfc-script-setup': 'Method',
    'sfc-css-features': 'Method',
    'utility-types': 'Method',
    'ssr': 'Method'
  },

  // 默认类型
  default: {
    h1: 'Guide',   // h1 标题作为 Guide
    h2: 'Section', // h2 标题作为 Section
    h3: 'Section'  // h3 标题作为 Section（不作为主索引）
  }
};

// 主流程
createDocsetIndex();
createIndexSqlite();
addSpecialEntries();  // 添加特殊索引条目
readDirSync(resPath);

console.log('\n✓ Docset 构建完成!');

/**
 * 添加特殊索引条目（Main Page、Playground 等）
 */
function addSpecialEntries() {
  console.log('正在添加特殊索引条目...');

  // 添加 Main Page 索引
  insertIndex('Vue.js 3 中文文档 Composition ', 'Guide', 'cn.vuejs.org/index.html');
  console.log('  ✓ Main Page 索引添加成功');

  // 添加 Playground 索引（如果存在）
  if (fs.existsSync(path.join(resPath, 'tutorial/index.html'))) {
    insertIndex('演练场', 'Guide', 'cn.vuejs.org/tutorial/index.html');
    console.log('  ✓ Playground 索引添加成功');
  }

  console.log('✓ 特殊索引条目添加完成\n');
}

/** 创建 Docset 目录结构和配置文件 */
function createDocsetIndex() {
  console.log('正在创建 Docset 目录结构...');

  exec(`rm -rf "${docset.resPath}"`);
  exec(`mkdir -p "${docset.resPath}/Documents"`);
  exec(`cp "${__dirname}/icon.png" "${docset.path}"`);
  exec(`cp -r "${__dirname}/cn.vuejs.org" "${docset.resPath}/Documents/"`);
  exec(`find "${__dirname}" -name '*.DS_Store' -type f -delete`);

  // 生成 Info.plist
  fs.writeFileSync(`${docset.path}/Contents/Info.plist`,
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleIdentifier</key>
    <string>VueJS</string>
    <key>CFBundleName</key>
    <string>Vue.js 3 中文文档 Composition </string>
    <key>DocSetPlatformFamily</key>
    <string>VueJS</string>
    <key>isDashDocset</key>
    <true/>
    <key>isJavaScriptEnabled</key>
    <true/>
    <key>DashDocSetFamily</key>
    <string>dashtoc3</string>
    <key>dashIndexFilePath</key>
    <string>cn.vuejs.org/index.html</string>
</dict>
</plist>`
  );

  console.log('✓ Docset 目录结构创建完成');
}

/** 创建 SQLite 索引数据库 */
function createIndexSqlite() {
  console.log('正在创建索引数据库...');

  exec(`rm -rf "${docset.resPath}/docSet.dsidx"`);
  db.connect(`${docset.resPath}/docSet.dsidx`);

  // 创建主索引表
  db.run(`CREATE TABLE searchIndex (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT, path TEXT);`);
  db.run(`CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);`);

  // 创建全文搜索索引表 (FTS4)
  // 注意：需要 SQLite 支持 FTS4 扩展
  try {
    db.run(`CREATE VIRTUAL TABLE optimizedIndex USING fts4(
      name TEXT,
      type TEXT,
      path TEXT,
      content TEXT
    );`);
    console.log('✓ 全文搜索索引表创建成功');
  } catch (e) {
    console.log('⚠ 全文搜索索引创建失败（可能不支持 FTS4）:', e.message);
  }

  console.log('✓ 索引数据库创建完成');
}

/**
 * 递归遍历文件夹，处理 HTML 文件
 * @param dirPath 当前路径
 * @param moduleName 模块名称 (api/guide)
 */
function readDirSync(dirPath, moduleName) {
  let items = fs.readdirSync(dirPath);

  items.forEach(function(item) {
    let itemPath = path.join(dirPath, item);
    let stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      // 只处理指定的模块目录
      if (!moduleName && (docset.include.api.includes(item) || docset.include.guide.includes(item))) {
        let newModuleName = docset.include.api.includes(item) ? 'api' : 'guide';
        console.log(`\n处理模块: ${newModuleName}/${item}`);
        readDirSync(itemPath, newModuleName);
      } else if (moduleName) {
        readDirSync(itemPath, moduleName);
      }
      return;
    }

    // 只处理 HTML 文件
    if (!item.endsWith('.html') || !moduleName) return;

    console.log(`  处理文件: ${item}`);

    let relativePath = itemPath.split('Documents/')[1];
    let html = fs.readFileSync(itemPath, {encoding: 'utf8'});
    let $ = cheerio.load(html, {decodeEntities: false});

    // 处理索引和锚点
    handleDocument($, relativePath, moduleName, item);

    // 简化页面布局 - 移除导航栏，只保留主内容
    simplifyPageLayout($);

    // 写回文件
    writeFile(itemPath, $.html());
  });
}

/**
 * 处理文档，提取标题并生成索引
 * @param $ Cheerio 对象
 * @param relativePath 相对路径
 * @param moduleName 模块名 (api/guide)
 * @param fileName 文件名
 */
function handleDocument($, relativePath, moduleName, fileName) {
  // 获取文件的基础名称（去掉 .html）
  let fileBaseName = path.basename(fileName, '.html');

  // 确定文件类型（用于索引）
  let fileType = moduleName === 'api'
    ? (dashTypes.api[fileBaseName] || 'Method')
    : 'Guide';

  // 存储页面标题描述（用于生成 titleDescription）
  let pageTitle = '';

  // 存储章节内容（用于全文搜索）
  let sectionContents = [];

  // 收集所有 Dash 锚点引用（用于生成 <head> 中的 <link> 标签）
  let dashAnchors = [];

  // 1. 处理 h1 标题
  $('h1').each(function(i, h) {
    let h1Data = extractTitle(h, $);
    if (!h1Data.id) return;

    pageTitle = h1Data.text; // 保存页面标题

    // h1 在两种模块中都要生成主索引(num=1)
    // anchorType: 决定 Dash 锚点和 link 标签中的类型
    // indexType: 录入 searchIndex 的类型（保持与官方一致，统一使用 Guide）
    let h1AnchorType = moduleName === 'guide' ? 'Guide' : 'Section';
    let h1IndexType = 'Guide';
    let h1Num = 1; // 主索引标记为 1

    addDashAnchor(h, h1Data.id, h1Data.text, h1AnchorType, h1Num, $);

    // 生成带 Dash 锚点格式的路径
    let dashAnchor = `//dash_ref_${h1Data.id}/${h1AnchorType}/${encodeURIComponent(h1Data.text)}/${h1Num}`;
    dashAnchors.push(dashAnchor); // 收集锚点

    // h1 必须写入 searchIndex 才能作为 Dash TOC 的父级节点
    insertIndex(h1Data.text, h1IndexType, `${relativePath}#${dashAnchor}`);
    console.log(`    [${h1AnchorType}] ${h1Data.text}`);
  });

  // 2. 处理 h2 标题
  $('h2').each(function(i, h) {
    let h2Data = extractTitle(h, $);
    if (!h2Data.id) return;

    // API 文档: h2 作为主索引（Component/Directive/Method/Attribute）
    // Guide 文档: h2 作为子索引（Section）
    let h2Type, h2Num, h2Path;

    let dashAnchor; // 声明在外部作用域

    if (moduleName === 'api') {
      // API 文档中，h2 是主索引
      h2Type = fileType;  // Component/Directive/Method/Attribute
      h2Num = 0;  // API 的主索引也用 0（根据官方格式）

      // 生成带 Dash 锚点格式的路径
      dashAnchor = `//dash_ref_${h2Data.id}/${h2Type}/${encodeURIComponent(h2Data.text)}/${h2Num}`;
      h2Path = pageTitle
        ? `<dash_entry_titleDescription=${encodeURIComponent(pageTitle)}>${relativePath}#${dashAnchor}`
        : `${relativePath}#${dashAnchor}`;
    } else {
      // Guide 文档中，h2 是子索引
      h2Type = 'Section';
      h2Num = 0;

      // 生成带 Dash 锚点格式的路径
      dashAnchor = `//dash_ref_${h2Data.id}/${h2Type}/${encodeURIComponent(h2Data.text)}/${h2Num}`;
      h2Path = pageTitle
        ? `<dash_entry_titleDescription=${encodeURIComponent(pageTitle)}>${relativePath}#${dashAnchor}`
        : `${relativePath}#${dashAnchor}`;
    }

    addDashAnchor(h, h2Data.id, h2Data.text, h2Type, h2Num, $);
    dashAnchors.push(dashAnchor); // 收集锚点

    // 提取章节内容（用于全文搜索）
    let sectionContent = extractSectionContent(h, $);

    insertIndex(h2Data.text, h2Type, h2Path);
    insertFullTextIndex(h2Data.text, h2Type, h2Path, sectionContent);

    console.log(`      [${h2Type}] ${h2Data.text}`);
  });

  // 3. 不处理 h3 标题作为索引（官方版本不包含 h3 索引）
  // h3 只添加锚点但不生成索引条目
  $('h3').each(function(i, h) {
    let h3Data = extractTitle(h, $);
    if (!h3Data.id) return;

    // 只添加锚点，不生成索引
    addDashAnchor(h, h3Data.id, h3Data.text, 'Section', 0, $);
  });

  // 4. 在 <head> 中插入 Dash 锚点的 <link> 标签（用于 Dash 生成页面 TOC）
  if (dashAnchors.length > 0) {
    let linkTags = dashAnchors.map(anchor => `<link href="${anchor}">`).join('\n    ');
    let $head = $('head');
    if ($head.length > 0) {
      $head.append('\n    ' + linkTags + '\n');
      console.log(`    ✓ 添加了 ${dashAnchors.length} 个 Dash TOC 链接`);
    }
  }
}

/**
 * 提取标题的 ID 和文本内容
 * @param h 标题元素
 * @param $ Cheerio 对象
 * @returns {{id: string, text: string}}
 */
function extractTitle(h, $) {
  let $h = $(h);
  let id = $h.attr('id') || '';

  // 提取纯文本内容（移除内部标签）
  let text = $h.clone()
    .children('a.header-anchor').remove().end() // 移除锚点链接
    .text()
    .trim();

  // HTML 转义处理
  text = htmlUnescape(text);

  return { id, text };
}

/**
 * HTML 转义字符还原
 */
function htmlUnescape(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, `'`)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

/**
 * 添加 Dash 规定格式的锚点
 * @param h 标题元素
 * @param id 锚点 ID (用于第一个占位符)
 * @param name 显示名称 (用于 URL 编码的第三个占位符)
 * @param type Dash 类型
 * @param num 编号 (0=子索引, 1=主索引)
 * @param $ Cheerio 对象
 */
function addDashAnchor(h, id, name, type, num, $) {
  // 使用 dash_ref 格式(根据官方 Vue.js Docset 的格式)
  let nameStr = `//dash_ref_${id}/${type}/${encodeURIComponent(name)}/${num}`;
  let dashAnchor = `<a class="dashAnchor" name="${nameStr}"></a>`;

  // 移除原有的锚点链接
  $(h).children('a.header-anchor').remove();

  // 在标题前插入 Dash 锚点
  $(h).before(dashAnchor);
}

/**
 * 提取章节内容（从标题到下一个同级或更高级标题之间的文本）
 * @param h 标题元素
 * @param $ Cheerio 对象
 * @returns {string} 章节文本内容
 */
function extractSectionContent(h, $) {
  let content = [];
  let currentLevel = h.tagName; // h1, h2, h3
  let next = h.nextSibling;

  while (next) {
    // 遇到同级或更高级标题，停止提取
    if (next.tagName && ['h1', 'h2', 'h3'].includes(next.tagName.toLowerCase())) {
      let nextLevel = next.tagName.toLowerCase();
      if (nextLevel <= currentLevel) {
        break;
      }
    }

    // 提取文本内容
    if (next.type === 'tag') {
      let $elem = $(next);
      // 移除代码块和脚本标签
      $elem.find('script, style').remove();
      let text = $elem.text().trim();
      if (text) {
        content.push(text);
      }
    }

    next = next.nextSibling;
  }

  // 限制内容长度（避免数据库过大）
  let fullText = content.join(' ').replace(/\s+/g, ' ').trim();
  return fullText.substring(0, 5000); // 限制 5000 字符
}

/**
 * 插入索引到数据库
 * @param name 显示名称
 * @param type Dash 类型
 * @param path 路径
 */
function insertIndex(name, type, path) {
  // 转义单引号避免 SQL 注入
  name = name.replace(/'/g, "''");

  db.run(
    `INSERT OR IGNORE INTO searchIndex (name, type, path) VALUES ('${name}', '${type}', '${path}')`,
    function(res) {
      if (res.error) {
        console.error(`    ✗ 索引插入失败: ${name}`);
        console.error(`      错误: ${res.error}`);
      }
    }
  );
}

/**
 * 插入全文搜索索引
 * @param name 显示名称
 * @param type Dash 类型
 * @param path 路径
 * @param content 内容文本
 */
function insertFullTextIndex(name, type, path, content) {
  // 如果全文搜索表不存在，直接返回
  try {
    // 转义单引号
    name = name.replace(/'/g, "''");
    content = content.replace(/'/g, "''");

    db.run(
      `INSERT INTO optimizedIndex (name, type, path, content) VALUES ('${name}', '${type}', '${path}', '${content}')`,
      function(res) {
        if (res.error && !res.error.includes('no such table')) {
          console.error(`    ⚠ 全文索引插入失败: ${name}`);
        }
      }
    );
  } catch (e) {
    // 忽略全文搜索索引错误（可能不支持 FTS4）
  }
}

/**
 * 写入文件
 */
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf-8');
}
