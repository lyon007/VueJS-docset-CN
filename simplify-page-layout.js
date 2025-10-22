'use strict';

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

/**
 * 页面布局简化逻辑，移除导航、侧栏、脚本等不必要元素。
 * @param {import('cheerio').CheerioAPI} $
 * @returns {string[]} 被移除元素的描述
 */
function simplifyPageLayout($) {
  const removed = [];

  const $nav = $('.VPNav, header.VPNav, .VPNavBar, header.VPNavBar');
  if ($nav.length > 0) {
    $nav.remove();
    removed.push('顶部导航');
  }

  const $sidebar = $('.VPSidebar, aside.VPSidebar');
  if ($sidebar.length > 0) {
    $sidebar.remove();
    removed.push('左侧边栏');
  }

  const $asideContainer = $('.aside-container, .VPDocAsideOutline, aside.VPDocAsideOutline');
  if ($asideContainer.length > 0) {
    $asideContainer.remove();
    removed.push('右侧目录');
  }

  $('.VPLocalNav, .VPFooter').remove();

  const $container = $('.container');
  // 右侧侧栏
  if($container.length > 0) {
    $container.children(' .aside').remove();
    removed.push('右侧侧栏');
  }

  const $appScripts = $('script[type="module"][src*="assets/app"]');
  if ($appScripts.length > 0) {
    $appScripts.remove();
    removed.push('VitePress 应用脚本');
  }
  $('link[rel="modulepreload"]').remove();
  $('link[rel="preload"][href$=".lean.js"]').remove();



  const $content = $('.VPContent, .VPDoc, main');
  if ($content.length > 0) {
    $content.removeClass('has-sidebar has-aside');
    $content.attr('style', 'max-width: 100%; padding-left: 2rem; padding-right: 2rem;');
  }

  return removed;
}

module.exports = {
  simplifyPageLayout,
};

if (require.main === module) {
  const targetDir = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.join(__dirname, 'cn.vuejs.org');

  if (!fs.existsSync(targetDir)) {
    console.error(`目标目录不存在: ${targetDir}`);
    process.exit(1);
  }

  const htmlFiles = [];

  const walk = dir => {
    fs.readdirSync(dir).forEach(name => {
      const fullPath = path.join(dir, name);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
        return;
      }
      if (stat.isFile() && name.endsWith('.html')) {
        htmlFiles.push(fullPath);
      }
    });
  };

  walk(targetDir);

  let written = 0;

  htmlFiles.forEach(file => {
    const original = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(original, { decodeEntities: false });
    const removed = simplifyPageLayout($);
    const output = $.html();

    if (output !== original) {
      fs.writeFileSync(file, output, 'utf8');
      written += 1;
      const rel = path.relative(targetDir, file);
      if (removed.length > 0) {
        console.log(`✓ ${rel} (移除: ${removed.join(', ')})`);
      } else {
        console.log(`✓ ${rel} (无结构变更)`);
      }
    }
  });

  console.log(`处理完成: ${written}/${htmlFiles.length} 个文件写入`);
}
