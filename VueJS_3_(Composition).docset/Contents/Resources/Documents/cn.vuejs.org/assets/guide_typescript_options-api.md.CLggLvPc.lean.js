import{_ as n,c as a,b as p,o as l}from"./chunks/framework.B2oIMGqn.js";const F=JSON.parse('{"title":"TypeScript 与选项式 API","description":"","frontmatter":{},"headers":[{"level":2,"title":"为组件的 props 标注类型","slug":"typing-component-props","link":"#typing-component-props","children":[{"level":3,"title":"注意事项","slug":"caveats","link":"#caveats","children":[]}]},{"level":2,"title":"为组件的 emits 标注类型","slug":"typing-component-emits","link":"#typing-component-emits","children":[]},{"level":2,"title":"为计算属性标记类型","slug":"typing-computed-properties","link":"#typing-computed-properties","children":[]},{"level":2,"title":"为事件处理函数标注类型","slug":"typing-event-handlers","link":"#typing-event-handlers","children":[]},{"level":2,"title":"扩展全局属性","slug":"augmenting-global-properties","link":"#augmenting-global-properties","children":[{"level":3,"title":"类型扩展的位置","slug":"type-augmentation-placement","link":"#type-augmentation-placement","children":[]}]},{"level":2,"title":"扩展自定义选项","slug":"augmenting-custom-options","link":"#augmenting-custom-options","children":[]}],"relativePath":"guide/typescript/options-api.md","filePath":"guide/typescript/options-api.md"}'),o={name:"guide/typescript/options-api.md"};function e(t,s,c,r,E,i){return l(),a("div",null,s[0]||(s[0]=[p(`<h1 id="typescript-with-options-api" tabindex="-1">TypeScript 与选项式 API <a class="header-anchor" href="#typescript-with-options-api" aria-label="Permalink to &quot;TypeScript 与选项式 API {#typescript-with-options-api}&quot;">​</a></h1><blockquote><p>这一章假设你已经阅读了<a href="./overview.html">搭配 TypeScript 使用 Vue</a> 的概览。</p></blockquote><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>虽然 Vue 的确支持在选项式 API 中使用 TypeScript，但在使用 TypeScript 的前提下更推荐使用组合式 API，因为它提供了更简单、高效和可靠的类型推导。</p></div><h2 id="typing-component-props" tabindex="-1">为组件的 props 标注类型 <a class="header-anchor" href="#typing-component-props" aria-label="Permalink to &quot;为组件的 props 标注类型 {#typing-component-props}&quot;">​</a></h2><p>选项式 API 中对 props 的类型推导需要用 <code>defineComponent()</code> 来包装组件。有了它，Vue 才可以通过 <code>props</code> 以及一些额外的选项，比如 <code>required: true</code> 和 <code>default</code> 来推导出 props 的类型：</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { defineComponent } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#F97583;"> default</span><span style="color:#B392F0;"> defineComponent</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#6A737D;">  // 启用了类型推导</span></span>
<span class="line"><span style="color:#E1E4E8;">  props: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    name: String,</span></span>
<span class="line"><span style="color:#E1E4E8;">    id: [Number, String],</span></span>
<span class="line"><span style="color:#E1E4E8;">    msg: { type: String, required: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;"> },</span></span>
<span class="line"><span style="color:#E1E4E8;">    metadata: </span><span style="color:#79B8FF;">null</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#B392F0;">  mounted</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#79B8FF;">    this</span><span style="color:#E1E4E8;">.name </span><span style="color:#6A737D;">// 类型：string | undefined</span></span>
<span class="line"><span style="color:#79B8FF;">    this</span><span style="color:#E1E4E8;">.id </span><span style="color:#6A737D;">// 类型：number | string | undefined</span></span>
<span class="line"><span style="color:#79B8FF;">    this</span><span style="color:#E1E4E8;">.msg </span><span style="color:#6A737D;">// 类型：string</span></span>
<span class="line"><span style="color:#79B8FF;">    this</span><span style="color:#E1E4E8;">.metadata </span><span style="color:#6A737D;">// 类型：any</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span></code></pre></div><p>然而，这种运行时 <code>props</code> 选项仅支持使用构造函数来作为一个 prop 的类型——没有办法指定多层级对象或函数签名之类的复杂类型。</p><p>我们可以使用 <code>PropType</code> 这个工具类型来标记更复杂的 props 类型：</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { defineComponent } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#F97583;"> type</span><span style="color:#E1E4E8;"> { PropType } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">interface</span><span style="color:#B392F0;"> Book</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#FFAB70;">  title</span><span style="color:#F97583;">:</span><span style="color:#79B8FF;"> string</span></span>
<span class="line"><span style="color:#FFAB70;">  author</span><span style="color:#F97583;">:</span><span style="color:#79B8FF;"> string</span></span>
<span class="line"><span style="color:#FFAB70;">  year</span><span style="color:#F97583;">:</span><span style="color:#79B8FF;"> number</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#F97583;"> default</span><span style="color:#B392F0;"> defineComponent</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">  props: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    book: {</span></span>
<span class="line"><span style="color:#6A737D;">      // 提供相对 \`Object\` 更确定的类型</span></span>
<span class="line"><span style="color:#E1E4E8;">      type: Object </span><span style="color:#F97583;">as</span><span style="color:#B392F0;"> PropType</span><span style="color:#E1E4E8;">&lt;</span><span style="color:#B392F0;">Book</span><span style="color:#E1E4E8;">&gt;,</span></span>
<span class="line"><span style="color:#E1E4E8;">      required: </span><span style="color:#79B8FF;">true</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#6A737D;">    // 也可以标记函数</span></span>
<span class="line"><span style="color:#E1E4E8;">    callback: Function </span><span style="color:#F97583;">as</span><span style="color:#B392F0;"> PropType</span><span style="color:#E1E4E8;">&lt;(</span><span style="color:#FFAB70;">id</span><span style="color:#F97583;">:</span><span style="color:#79B8FF;"> number</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#79B8FF;"> void</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#B392F0;">  mounted</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#79B8FF;">    this</span><span style="color:#E1E4E8;">.book.title </span><span style="color:#6A737D;">// string</span></span>
<span class="line"><span style="color:#79B8FF;">    this</span><span style="color:#E1E4E8;">.book.year </span><span style="color:#6A737D;">// number</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    // TS Error: argument of type &#39;string&#39; is not</span></span>
<span class="line"><span style="color:#6A737D;">    // assignable to parameter of type &#39;number&#39;</span></span>
<span class="line"><span style="color:#79B8FF;">    this</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">callback</span><span style="color:#E1E4E8;">?.(</span><span style="color:#9ECBFF;">&#39;123&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span></code></pre></div><h3 id="caveats" tabindex="-1">注意事项 <a class="header-anchor" href="#caveats" aria-label="Permalink to &quot;注意事项 {#caveats}&quot;">​</a></h3><p>如果你的 TypeScript 版本低于 <code>4.7</code>，在使用函数作为 prop 的 <code>validator</code> 和 <code>default</code> 选项值时需要格外小心——确保使用箭头函数：</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { defineComponent } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#F97583;"> type</span><span style="color:#E1E4E8;"> { PropType } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">interface</span><span style="color:#B392F0;"> Book</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#FFAB70;">  title</span><span style="color:#F97583;">:</span><span style="color:#79B8FF;"> string</span></span>
<span class="line"><span style="color:#FFAB70;">  year</span><span style="color:#F97583;">?:</span><span style="color:#79B8FF;"> number</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#F97583;"> default</span><span style="color:#B392F0;"> defineComponent</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">  props: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    bookA: {</span></span>
<span class="line"><span style="color:#E1E4E8;">      type: Object </span><span style="color:#F97583;">as</span><span style="color:#B392F0;"> PropType</span><span style="color:#E1E4E8;">&lt;</span><span style="color:#B392F0;">Book</span><span style="color:#E1E4E8;">&gt;,</span></span>
<span class="line"><span style="color:#6A737D;">      // 如果你的 TypeScript 版本低于 4.7，确保使用箭头函数</span></span>
<span class="line"><span style="color:#B392F0;">      default</span><span style="color:#E1E4E8;">: () </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> ({</span></span>
<span class="line"><span style="color:#E1E4E8;">        title: </span><span style="color:#9ECBFF;">&#39;Arrow Function Expression&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">      }),</span></span>
<span class="line"><span style="color:#B392F0;">      validator</span><span style="color:#E1E4E8;">: (</span><span style="color:#FFAB70;">book</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> Book</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#F97583;"> !!</span><span style="color:#E1E4E8;">book.title</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span></code></pre></div><p>这会防止 TypeScript 将 <code>this</code> 根据函数内的环境作出不符合我们期望的类型推导。这是之前版本的一个<a href="https://github.com/microsoft/TypeScript/issues/38845" target="_blank" rel="noreferrer">设计限制</a>，不过现在已经在 <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#improved-function-inference-in-objects-and-methods" target="_blank" rel="noreferrer">TypeScript 4.7</a> 中解决了。</p><h2 id="typing-component-emits" tabindex="-1">为组件的 emits 标注类型 <a class="header-anchor" href="#typing-component-emits" aria-label="Permalink to &quot;为组件的 emits 标注类型 {#typing-component-emits}&quot;">​</a></h2><p>我们可以给 <code>emits</code> 选项提供一个对象来声明组件所触发的事件，以及这些事件所期望的参数类型。试图触发未声明的事件会抛出一个类型错误：</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { defineComponent } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#F97583;"> default</span><span style="color:#B392F0;"> defineComponent</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">  emits: {</span></span>
<span class="line"><span style="color:#B392F0;">    addBook</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">payload</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> { </span><span style="color:#FFAB70;">bookName</span><span style="color:#F97583;">:</span><span style="color:#79B8FF;"> string</span><span style="color:#E1E4E8;"> }) {</span></span>
<span class="line"><span style="color:#6A737D;">      // 执行运行时校验</span></span>
<span class="line"><span style="color:#F97583;">      return</span><span style="color:#E1E4E8;"> payload.bookName.</span><span style="color:#79B8FF;">length</span><span style="color:#F97583;"> &gt;</span><span style="color:#79B8FF;"> 0</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">  methods: {</span></span>
<span class="line"><span style="color:#B392F0;">    onSubmit</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#79B8FF;">      this</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">$emit</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;addBook&#39;</span><span style="color:#E1E4E8;">, {</span></span>
<span class="line"><span style="color:#E1E4E8;">        bookName: </span><span style="color:#79B8FF;">123</span><span style="color:#6A737D;"> // 类型错误</span></span>
<span class="line"><span style="color:#E1E4E8;">      })</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;">      this</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">$emit</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;non-declared-event&#39;</span><span style="color:#E1E4E8;">) </span><span style="color:#6A737D;">// 类型错误</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span></code></pre></div><h2 id="typing-computed-properties" tabindex="-1">为计算属性标记类型 <a class="header-anchor" href="#typing-computed-properties" aria-label="Permalink to &quot;为计算属性标记类型 {#typing-computed-properties}&quot;">​</a></h2><p>计算属性会自动根据其返回值来推导其类型：</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { defineComponent } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#F97583;"> default</span><span style="color:#B392F0;"> defineComponent</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#B392F0;">  data</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#F97583;">    return</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      message: </span><span style="color:#9ECBFF;">&#39;Hello!&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">  computed: {</span></span>
<span class="line"><span style="color:#B392F0;">    greeting</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#F97583;">      return</span><span style="color:#79B8FF;"> this</span><span style="color:#E1E4E8;">.message </span><span style="color:#F97583;">+</span><span style="color:#9ECBFF;"> &#39;!&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#B392F0;">  mounted</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#79B8FF;">    this</span><span style="color:#E1E4E8;">.greeting </span><span style="color:#6A737D;">// 类型：string</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span></code></pre></div><p>在某些场景中，你可能想要显式地标记出计算属性的类型以确保其实现是正确的：</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { defineComponent } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#F97583;"> default</span><span style="color:#B392F0;"> defineComponent</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#B392F0;">  data</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#F97583;">    return</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      message: </span><span style="color:#9ECBFF;">&#39;Hello!&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">  computed: {</span></span>
<span class="line"><span style="color:#6A737D;">    // 显式标注返回类型</span></span>
<span class="line"><span style="color:#B392F0;">    greeting</span><span style="color:#E1E4E8;">()</span><span style="color:#F97583;">:</span><span style="color:#79B8FF;"> string</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">      return</span><span style="color:#79B8FF;"> this</span><span style="color:#E1E4E8;">.message </span><span style="color:#F97583;">+</span><span style="color:#9ECBFF;"> &#39;!&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">    // 标注一个可写的计算属性</span></span>
<span class="line"><span style="color:#E1E4E8;">    greetingUppercased: {</span></span>
<span class="line"><span style="color:#B392F0;">      get</span><span style="color:#E1E4E8;">()</span><span style="color:#F97583;">:</span><span style="color:#79B8FF;"> string</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">        return</span><span style="color:#79B8FF;"> this</span><span style="color:#E1E4E8;">.greeting.</span><span style="color:#B392F0;">toUpperCase</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">      },</span></span>
<span class="line"><span style="color:#B392F0;">      set</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">newValue</span><span style="color:#F97583;">:</span><span style="color:#79B8FF;"> string</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#79B8FF;">        this</span><span style="color:#E1E4E8;">.message </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> newValue.</span><span style="color:#B392F0;">toUpperCase</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">      }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span></code></pre></div><p>在某些 TypeScript 因循环引用而无法推导类型的情况下，可能必须进行显式的类型标注。</p><h2 id="typing-event-handlers" tabindex="-1">为事件处理函数标注类型 <a class="header-anchor" href="#typing-event-handlers" aria-label="Permalink to &quot;为事件处理函数标注类型 {#typing-event-handlers}&quot;">​</a></h2><p>在处理原生 DOM 事件时，应该为我们传递给事件处理函数的参数正确地标注类型。让我们看一下这个例子：</p><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">script</span><span style="color:#B392F0;"> lang</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;ts&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { defineComponent } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#F97583;"> default</span><span style="color:#B392F0;"> defineComponent</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">  methods: {</span></span>
<span class="line"><span style="color:#B392F0;">    handleChange</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">event</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#6A737D;">      // \`event\` 隐式地标注为 \`any\` 类型</span></span>
<span class="line"><span style="color:#E1E4E8;">      console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(event.target.value)</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">script</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;</span><span style="color:#85E89D;">input</span><span style="color:#B392F0;"> type</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;text&quot;</span><span style="color:#B392F0;"> @change</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;handleChange&quot;</span><span style="color:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span></code></pre></div><p>没有类型标注时，这个 <code>event</code> 参数会隐式地标注为 <code>any</code> 类型。这也会在 <code>tsconfig.json</code> 中配置了 <code>&quot;strict&quot;: true</code> 或 <code>&quot;noImplicitAny&quot;: true</code> 时抛出一个 TS 错误。因此，建议显式地为事件处理函数的参数标注类型。此外，在访问 <code>event</code> 上的属性时你可能需要使用类型断言：</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { defineComponent } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#F97583;"> default</span><span style="color:#B392F0;"> defineComponent</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">  methods: {</span></span>
<span class="line"><span style="color:#B392F0;">    handleChange</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">event</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> Event</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">      console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">((event.target </span><span style="color:#F97583;">as</span><span style="color:#B392F0;"> HTMLInputElement</span><span style="color:#E1E4E8;">).value)</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span></code></pre></div><h2 id="augmenting-global-properties" tabindex="-1">扩展全局属性 <a class="header-anchor" href="#augmenting-global-properties" aria-label="Permalink to &quot;扩展全局属性 {#augmenting-global-properties}&quot;">​</a></h2><p>某些插件会通过 <a href="/api/application.html#app-config-globalproperties"><code>app.config.globalProperties</code></a> 为所有组件都安装全局可用的属性。举例来说，我们可能为了请求数据而安装了 <code>this.$http</code>，或者为了国际化而安装了 <code>this.$translate</code>。为了使 TypeScript 更好地支持这个行为，Vue 暴露了一个被设计为可以通过 <a href="https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation" target="_blank" rel="noreferrer">TypeScript 模块扩展</a>来扩展的 <code>ComponentCustomProperties</code> 接口：</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> axios </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;axios&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">declare</span><span style="color:#F97583;"> module</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">  interface</span><span style="color:#B392F0;"> ComponentCustomProperties</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#FFAB70;">    $http</span><span style="color:#F97583;">:</span><span style="color:#F97583;"> typeof</span><span style="color:#E1E4E8;"> axios</span></span>
<span class="line"><span style="color:#B392F0;">    $translate</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">key</span><span style="color:#F97583;">:</span><span style="color:#79B8FF;"> string</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#79B8FF;"> string</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre></div><p>参考：</p><ul><li><a href="https://github.com/vuejs/core/blob/main/packages-private/dts-test/componentTypeExtensions.test-d.tsx" target="_blank" rel="noreferrer">对组件类型扩展的 TypeScript 单元测试</a></li></ul><h3 id="type-augmentation-placement" tabindex="-1">类型扩展的位置 <a class="header-anchor" href="#type-augmentation-placement" aria-label="Permalink to &quot;类型扩展的位置 {#type-augmentation-placement}&quot;">​</a></h3><p>我们可以将这些类型扩展放在一个 <code>.ts</code> 文件，或是一个影响整个项目的 <code>*.d.ts</code> 文件中。无论哪一种，都应确保在 <code>tsconfig.json</code> 中包括了此文件。对于库或插件作者，这个文件应该在 <code>package.json</code> 的 <code>types</code> 属性中被列出。</p><p>为了利用模块扩展的优势，你需要确保将扩展的模块放在 <a href="https://www.typescriptlang.org/docs/handbook/modules.html" target="_blank" rel="noreferrer">TypeScript 模块</a> 中。 也就是说，该文件需要包含至少一个顶级的 <code>import</code> 或 <code>export</code>，即使它只是 <code>export {}</code>。如果扩展被放在模块之外，它将覆盖原始类型，而不是扩展!</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#6A737D;">// 不工作，将覆盖原始类型。</span></span>
<span class="line"><span style="color:#F97583;">declare</span><span style="color:#F97583;"> module</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">  interface</span><span style="color:#B392F0;"> ComponentCustomProperties</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#B392F0;">    $translate</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">key</span><span style="color:#F97583;">:</span><span style="color:#79B8FF;"> string</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#79B8FF;"> string</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre></div><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#6A737D;">// 正常工作。</span></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> {}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">declare</span><span style="color:#F97583;"> module</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">  interface</span><span style="color:#B392F0;"> ComponentCustomProperties</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#B392F0;">    $translate</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> (</span><span style="color:#FFAB70;">key</span><span style="color:#F97583;">:</span><span style="color:#79B8FF;"> string</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#79B8FF;"> string</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre></div><h2 id="augmenting-custom-options" tabindex="-1">扩展自定义选项 <a class="header-anchor" href="#augmenting-custom-options" aria-label="Permalink to &quot;扩展自定义选项 {#augmenting-custom-options}&quot;">​</a></h2><p>某些插件，比如 <code>vue-router</code>，提供了一些自定义的组件选项，比如 <code>beforeRouteEnter</code>：</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { defineComponent } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#F97583;"> default</span><span style="color:#B392F0;"> defineComponent</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#B392F0;">  beforeRouteEnter</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">to</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">from</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">next</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#6A737D;">    // ...</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span></code></pre></div><p>如果没有确切的类型标注，这个钩子函数的参数会隐式地标注为 <code>any</code> 类型。我们可以为 <code>ComponentCustomOptions</code> 接口扩展自定义的选项来支持：</p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { Route } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue-router&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">declare</span><span style="color:#F97583;"> module</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">  interface</span><span style="color:#B392F0;"> ComponentCustomOptions</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#B392F0;">    beforeRouteEnter</span><span style="color:#F97583;">?</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">to</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> Route</span><span style="color:#E1E4E8;">, </span><span style="color:#FFAB70;">from</span><span style="color:#F97583;">:</span><span style="color:#B392F0;"> Route</span><span style="color:#E1E4E8;">, </span><span style="color:#B392F0;">next</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> () </span><span style="color:#F97583;">=&gt;</span><span style="color:#79B8FF;"> void</span><span style="color:#E1E4E8;">)</span><span style="color:#F97583;">:</span><span style="color:#79B8FF;"> void</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre></div><p>现在这个 <code>beforeRouteEnter</code> 选项会被准确地标注类型。注意这只是一个例子——像 <code>vue-router</code> 这种类型完备的库应该在它们自己的类型定义中自动执行这些扩展。</p><p>这种类型扩展和全局属性扩展受到<a href="#type-augmentation-placement">相同的限制</a>。</p><p>参考：</p><ul><li><a href="https://github.com/vuejs/core/blob/main/packages-private/dts-test/componentTypeExtensions.test-d.tsx" target="_blank" rel="noreferrer">对组件类型扩展的 TypeScript 单元测试</a></li></ul>`,46)]))}const d=n(o,[["render",e]]);export{F as __pageData,d as default};
