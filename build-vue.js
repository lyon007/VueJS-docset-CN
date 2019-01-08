/**
 * Created By WebStorm.
 * author jiangshunxin
 * date 2018-12-31
 */

const fs = require('fs');
const path = require('path');
const exec = require('sync-exec');
const db = require('sqlite-sync');
const cheerio = require('cheerio');



let docset = {
    name: `VueJS.docset`,
    path: path.join(__dirname, `VueJS.docset`),
    resPath: path.join(__dirname, `VueJS.docset/Contents/Resources`),
    include: ['api','guide']
};

const resPath = path.join( `${docset.resPath}/Documents/cn.vuejs.org/v2`);
let type =  {
    "属性": "Property",
    "全局配置": "Property",
    "全局-API": "Method",
    "选项-数据": "Option",
    "选项-DOM": "Option",
    "选项-生命周期钩子": "Option",
    "选项-资源": "Option",
    "选项-组合": "Option",
    "选项-其它": "Option",
    "实例属性": "Property",
    "实例方法-数据": "Method",
    "实例方法-事件": "Method",
    "实例方法-生命周期": "Method",
    "指令": "Directive",
    "特殊特性": "Attribute",
    "内置的组件": "Component",
    "h2": 'Section',
    "guide": 'Guide'
};

createDocsetIndex();

createIndexSqlite();

readDirSync(resPath);


/** create docset index */
function  createDocsetIndex(){
    exec(`rm -rf ${docset.resPath}`);
    exec(`mkdir -p ${docset.resPath}`);
    exec(`cp ${__dirname}/icon.png ${docset.path}`);
    exec(`cp -r  ${__dirname}/Documents  ${docset.resPath}`);
    exec(`find ${path.join(__dirname)} -name '*.DS_Store' -type f -delete;`);  // 删除当前目录下的 .DS_Store 文件

    fs.writeFile(`${docset.path}/Contents/Info.plist`,
        `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
        <key>CFBundleIdentifier</key>
        <string>VueJS</string>
        <key>CFBundleName</key>
        <string>VueJS-CN</string>
        <key>DocSetPlatformFamily</key>
        <string>VueJS</string>
        <key>isDashDocset</key>
        <true/>
        <key>DashDocSetFamily</key>
        <string>dashtoc3</string>
        <key>dashIndexFilePath</key>
        <string>cn.vuejs.org/index.html</string>
    </dict>
    </plist>`,
        (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
}

/** create index sqlite	 */
function  createIndexSqlite(){
    exec(`rm -rf ${docset.resPath}/docSet.dsidx`);
    db.connect(`${docset.resPath}/docSet.dsidx`);
    db.run(`CREATE TABLE searchIndex (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT, path TEXT);`);
    db.run(`CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);`);
}

/**
 * 递归遍历文件夹，读取相应的html文件,提取索引信息
 * @param path  当前路径
 * @param dirName 上一级文件夹名称
 */
function readDirSync(path,dirName){
    let pa = fs.readdirSync(path);
    pa.forEach(function(ele){
        let info = fs.statSync(path+"/"+ele);
        if(info.isDirectory()){
            if(!docset.include.includes(ele)) return;  // 只需要添加部分文件的索引
            readDirSync(path+"/"+ele,ele);  // 如果是文件夹、接着递归
            return;
        }
        console.log(' 文件夹/文件名：' + dirName + '/' + ele);
        let filePath = `${path}/${ele}`; // 文件路径
        let relativePath = filePath.split('Documents/')[1]; // 当前文件相对于 Documents的 相对路径,
        let html = fs.readFileSync(filePath, {encoding: 'utf8'});
        let $ = cheerio.load(html,{decodeEntities: false});  //  decodeEntities 关闭转换实体编码的功能,解决中文网页乱码问题
        handleTitles($,relativePath,dirName);
        writeFile(filePath,$.html());
    })
}


/**
 * 根据各个标题处理相应的锚点 添加索引
 *
 * @param $ dom对象
 * @param relativePath 相对路径
 * @param dir 文件夹名称
 */
function handleTitles($,relativePath,dir) {
    // 教程模块 以h2 为索引，需要添加一个h1 的索引
    let h1Title = '';
    if(dir === 'guide'){
        $('h1').each(function (i,h) {
            h1Title = Array.from(h.childNodes).map((node) => node.data ).join('');
            db.run(`INSERT INTO searchIndex (name, type, path) VALUES ('${h1Title}', '${type['guide']}', '${relativePath}')`,function(res){
                if(res.error) throw res.error;
                console.log(res);
            });
        });
    }
    $('h2').each(function (i,h) {
        if(!h.attribs.id) return;
        let h2s = extractText(h); // 提取标题中的ID、文本内容
        let h3s = [];
        if(dir === 'api'){
            h3s = collectH3s(h);
            if(h3s.length<1) return
        }
        let entryType = type[h2s.id] || type['h2'];  // 默认 Section
        console.log(h2s);
        let h2Num = dir === 'api' ? 1 : 0;
        let h2Type = type['h2'];  // h2 归类为 Section
        addDashAnchor(h,h2s.id,h2Type,h2Num);
        let inTitle = `${h2s.text} ${dir === 'guide' ? ' - '+ h1Title : ''}`;
        let iniType =  dir ==='api' ? type['guide'] : h2Type;
        db.run(`INSERT INTO searchIndex (name, type, path) VALUES ('${inTitle}', '${iniType}', '${relativePath}#${encodeURIComponent(h2s.id)}')`,function(res){
            if(res.error) throw res.error;
            console.log(res);
        });
        // api下 需要处理 h3 标题，生成相应的索引
        if(dir === 'api'){
            h3s.forEach(function (titleNode,index) {
                let id =  titleNode.attribs.id;
                let text = [].slice.call(titleNode.childNodes).map( (node) => node.data).join('');
                // 需要处理括号
                if(text.match(/^([^(]+)\(/)) text= text.match(/^([^(]+)\(/)[1];
                console.log(id,text,entryType);
                addDashAnchor(titleNode,id,entryType,0);
                db.run(`INSERT INTO searchIndex (name, type, path) VALUES ('${text}', '${entryType}', '${relativePath}#${encodeURIComponent(id)}')`,function(res){
                    if(res.error) throw res.error;
                    console.log(res);
                });
            });
        }
    });

    /**
     *  提取标题中的ID、文本内容
     * @param h node
     * @returns {{id: *, text: *}}   id 用来生成锚点、text当做标题
     */
    function extractText (h) {
        let title =  [].slice.call(h.childNodes).map( (node) => node.tagName === 'a' ?  node.attribs.title : '').join('');
        let id = h.attribs.id;
        return {
            id: id,
            text:  title ? htmlEscape(title) : id // 如果没有就用ID 代替
        }
    }

    // 字符转义
    function htmlEscape (text) {
        return text
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, `'`)
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
    }
    // 提取h2 附近的h3 标题列表
    function collectH3s (h) {
        let h3s = [];
        let next = h.nextSibling;
        while (next && next.tagName !== 'h2') {
            if (next.tagName === 'h3') {
                next.childNodes = removeTagA(next);
                h3s.push(next)
            }
            next = next.nextSibling
        }
        return h3s
    }
    // 移除A标签
    function removeTagA(h) {
       return [].slice.call(h.childNodes).filter(function (node) {
            return node.tagName !== 'a'
        })
    }
    // 添加dash规定格式的 锚点
    function addDashAnchor(h,name,types,num) {
        let nameStr = (`//dash_ref_${name}/${types}/${encodeURIComponent(name)}/${num}`); // 需要对URL 进行URL编码（百分比转义）
        let dashAnchor = `<a class="dashAnchor" name="${nameStr}"/>`;
        h.childNodes = removeTagA(h); // 取完title之后移除原有的锚点，添加 dash规定格式的锚点
        $(h).before(dashAnchor).html();
    }
}


// 写进文件的函数
function writeFile (path,file){
    fs.writeFile(path, file , 'utf-8', function(err) {
        if (err) {
            console.error("文件生成时发生错误.");
            throw err;
        }
        console.info('文件已经成功生成.');
    });
}

// 删除文件
function deleteFiles(path){
    fs.stat(path, function(err, stat){
        if(stat&&stat.isFile()) {
            console.log('文件存在');
            fs.unlink(path, function(err) {
                if (err) throw err;
                console.log('文件删除成功');
            });
        } else {
            console.log('文件不存在或不是标准文件');
        }
    });
}



