import{_ as n,c as a,b as l,o as p}from"./chunks/framework.B2oIMGqn.js";const d=JSON.parse('{"title":"模板引用","description":"","frontmatter":{},"headers":[{"level":2,"title":"访问模板引用","slug":"accessing-the-refs","link":"#accessing-the-refs","children":[]},{"level":2,"title":"组件上的 ref","slug":"ref-on-component","link":"#ref-on-component","children":[]},{"level":2,"title":"v-for 中的模板引用","slug":"refs-inside-v-for","link":"#refs-inside-v-for","children":[]},{"level":2,"title":"函数模板引用","slug":"function-refs","link":"#function-refs","children":[]}],"relativePath":"guide/essentials/template-refs.md","filePath":"guide/essentials/template-refs.md"}'),o={name:"guide/essentials/template-refs.md"};function e(t,s,c,E,r,i){return p(),a("div",null,s[0]||(s[0]=[l(`<h1 id="template-refs" tabindex="-1">模板引用 <a class="header-anchor" href="#template-refs" aria-label="Permalink to &quot;模板引用 {#template-refs}&quot;">​</a></h1><p>虽然 Vue 的声明性渲染模型为你抽象了大部分对 DOM 的直接操作，但在某些情况下，我们仍然需要直接访问底层 DOM 元素。要实现这一点，我们可以使用特殊的 <code>ref</code> attribute：</p><div class="language-template"><button title="Copy Code" class="copy"></button><span class="lang">template</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">input</span><span style="color:#B392F0;"> ref</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;input&quot;</span><span style="color:#E1E4E8;">&gt;</span></span></code></pre></div><p><code>ref</code> 是一个特殊的 attribute，和 <code>v-for</code> 章节中提到的 <code>key</code> 类似。它允许我们在一个特定的 DOM 元素或子组件实例被挂载后，获得对它的直接引用。这可能很有用，比如说在组件挂载时将焦点设置到一个 input 元素上，或在一个元素上初始化一个第三方库。</p><h2 id="accessing-the-refs" tabindex="-1">访问模板引用 <a class="header-anchor" href="#accessing-the-refs" aria-label="Permalink to &quot;访问模板引用 {#accessing-the-refs}&quot;">​</a></h2><div class="composition-api"><p>要在组合式 API 中获取引用，我们可以使用辅助函数 <a href="/api/composition-api-helpers.html#usetemplateref"><code>useTemplateRef()</code></a> <sup class="vt-badge" data-text="3.5+"></sup>：</p><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">script</span><span style="color:#B392F0;"> setup</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { useTemplateRef, onMounted } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 第一个参数必须与模板中的 ref 值匹配</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#79B8FF;"> input</span><span style="color:#F97583;"> =</span><span style="color:#B392F0;"> useTemplateRef</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;my-input&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">onMounted</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  input.value.</span><span style="color:#B392F0;">focus</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">script</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;</span><span style="color:#85E89D;">input</span><span style="color:#B392F0;"> ref</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;my-input&quot;</span><span style="color:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span></code></pre></div><p>在使用 TypeScript 时，Vue 的 IDE 支持和 <code>vue-tsc</code> 将根据匹配的 <code>ref</code> attribute 所用的元素或组件自动推断 <code>input.value</code> 的类型。</p><details><summary>3.5 前的用法</summary><p>在 3.5 之前的版本尚未引入 <code>useTemplateRef()</code>，我们需要声明一个与模板里 ref attribute 匹配的引用：</p><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">script</span><span style="color:#B392F0;"> setup</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { ref, onMounted } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 声明一个 ref 来存放该元素的引用</span></span>
<span class="line"><span style="color:#6A737D;">// 必须和模板里的 ref 同名</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#79B8FF;"> input</span><span style="color:#F97583;"> =</span><span style="color:#B392F0;"> ref</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">onMounted</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  input.value.</span><span style="color:#B392F0;">focus</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">script</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;</span><span style="color:#85E89D;">input</span><span style="color:#B392F0;"> ref</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;input&quot;</span><span style="color:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span></code></pre></div><p>如果不使用 <code>&lt;script setup&gt;</code>，需确保从 <code>setup()</code> 返回 ref：</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#F97583;">export</span><span style="color:#F97583;"> default</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#B392F0;">  setup</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#F97583;">    const</span><span style="color:#79B8FF;"> input</span><span style="color:#F97583;"> =</span><span style="color:#B392F0;"> ref</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#6A737D;">    // ...</span></span>
<span class="line"><span style="color:#F97583;">    return</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line highlighted"><span style="color:#E1E4E8;">      input</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre></div></details></div><div class="options-api"><p>挂载结束后引用都会被暴露在 <code>this.$refs</code> 之上：</p><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">script</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#F97583;"> default</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#B392F0;">  mounted</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#79B8FF;">    this</span><span style="color:#E1E4E8;">.$refs.input.</span><span style="color:#B392F0;">focus</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">script</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;</span><span style="color:#85E89D;">input</span><span style="color:#B392F0;"> ref</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;input&quot;</span><span style="color:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span></code></pre></div></div><p>注意，你只可以<strong>在组件挂载后</strong>才能访问模板引用。如果你想在模板中的表达式上访问 <span class="options-api"><code>$refs.input</code></span><span class="composition-api"><code>input</code></span>，在初次渲染时会是 <span class="options-api"><code>undefined</code></span><span class="composition-api"><code>null</code></span>。这是因为在初次渲染前这个元素还不存在呢！</p><div class="composition-api"><p>如果你需要侦听一个模板引用 ref 的变化，确保考虑到其值为 <code>null</code> 的情况：</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#B392F0;">watchEffect</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#F97583;">  if</span><span style="color:#E1E4E8;"> (input.value) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    input.value.</span><span style="color:#B392F0;">focus</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">  } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#6A737D;">    // 此时还未挂载，或此元素已经被卸载（例如通过 v-if 控制）</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span></code></pre></div><p>也可参考：<a href="/guide/typescript/composition-api.html#typing-template-refs">为模板引用标注类型</a> <sup class="vt-badge ts"></sup></p></div><h2 id="ref-on-component" tabindex="-1">组件上的 ref <a class="header-anchor" href="#ref-on-component" aria-label="Permalink to &quot;组件上的 ref {#ref-on-component}&quot;">​</a></h2><blockquote><p>这一小节假设你已了解<a href="/guide/essentials/component-basics.html">组件</a>的相关知识，或者你也可以先跳过这里，之后再回来看。</p></blockquote><p>模板引用也可以被用在一个子组件上。这种情况下引用中获得的值是组件实例：</p><div class="composition-api"><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">script</span><span style="color:#B392F0;"> setup</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { useTemplateRef, onMounted } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> Child </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;./Child.vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#79B8FF;"> childRef</span><span style="color:#F97583;"> =</span><span style="color:#B392F0;"> useTemplateRef</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;child&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">onMounted</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#6A737D;">  // childRef.value 将持有 &lt;Child /&gt; 的实例</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">script</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;</span><span style="color:#85E89D;">Child</span><span style="color:#B392F0;"> ref</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;child&quot;</span><span style="color:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span></code></pre></div><details><summary>3.5 前的用法</summary><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">script</span><span style="color:#B392F0;"> setup</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { ref, onMounted } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> Child </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;./Child.vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#79B8FF;"> child</span><span style="color:#F97583;"> =</span><span style="color:#B392F0;"> ref</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">onMounted</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#6A737D;">  // child.value 是 &lt;Child /&gt; 组件的实例</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">script</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;</span><span style="color:#85E89D;">Child</span><span style="color:#B392F0;"> ref</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;child&quot;</span><span style="color:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span></code></pre></div></details></div><div class="options-api"><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">script</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> Child </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;./Child.vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#F97583;"> default</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  components: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    Child</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#B392F0;">  mounted</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#6A737D;">    // this.$refs.child 是 &lt;Child /&gt; 组件的实例</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">script</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;</span><span style="color:#85E89D;">Child</span><span style="color:#B392F0;"> ref</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;child&quot;</span><span style="color:#E1E4E8;"> /&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span></code></pre></div></div><p>如果一个子组件使用的是选项式 API <span class="composition-api">或没有使用 <code>&lt;script setup&gt;</code></span>，被引用的组件实例和该子组件的 <code>this</code> 完全一致，这意味着父组件对子组件的每一个属性和方法都有完全的访问权。这使得在父组件和子组件之间创建紧密耦合的实现细节变得很容易，当然也因此，应该只在绝对需要时才使用组件引用。大多数情况下，你应该首先使用标准的 props 和 emit 接口来实现父子组件交互。</p><div class="composition-api"><p>有一个例外的情况，使用了 <code>&lt;script setup&gt;</code> 的组件是<strong>默认私有</strong>的：一个父组件无法访问到一个使用了 <code>&lt;script setup&gt;</code> 的子组件中的任何东西，除非子组件在其中通过 <code>defineExpose</code> 宏显式暴露：</p><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">script</span><span style="color:#B392F0;"> setup</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { ref } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#79B8FF;"> a</span><span style="color:#F97583;"> =</span><span style="color:#79B8FF;"> 1</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#79B8FF;"> b</span><span style="color:#F97583;"> =</span><span style="color:#B392F0;"> ref</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 像 defineExpose 这样的编译器宏不需要导入</span></span>
<span class="line"><span style="color:#B392F0;">defineExpose</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">  a,</span></span>
<span class="line"><span style="color:#E1E4E8;">  b</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">script</span><span style="color:#E1E4E8;">&gt;</span></span></code></pre></div><p>当父组件通过模板引用获取到了该组件的实例时，得到的实例类型为 <code>{ a: number, b: number }</code> (ref 都会自动解包，和一般的实例一样)。</p><p>请注意，defineExpose 必须在任何 await 操作之前调用。否则，在 await 操作后暴露的属性和方法将无法访问。</p><p>TypeScript 用户请参考：<a href="/guide/typescript/composition-api.html#typing-component-template-refs">为组件的模板引用标注类型</a> <sup class="vt-badge ts"></sup></p></div><div class="options-api"><p><code>expose</code> 选项可以用于限制对子组件实例的访问：</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#F97583;">export</span><span style="color:#F97583;"> default</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  expose: [</span><span style="color:#9ECBFF;">&#39;publicData&#39;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&#39;publicMethod&#39;</span><span style="color:#E1E4E8;">],</span></span>
<span class="line"><span style="color:#B392F0;">  data</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#F97583;">    return</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      publicData: </span><span style="color:#9ECBFF;">&#39;foo&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">      privateData: </span><span style="color:#9ECBFF;">&#39;bar&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">  methods: {</span></span>
<span class="line"><span style="color:#B392F0;">    publicMethod</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#6A737D;">      /* ... */</span></span>
<span class="line"><span style="color:#E1E4E8;">    },</span></span>
<span class="line"><span style="color:#B392F0;">    privateMethod</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#6A737D;">      /* ... */</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre></div><p>在上面这个例子中，父组件通过模板引用访问到子组件实例后，仅能访问 <code>publicData</code> 和 <code>publicMethod</code>。</p></div><h2 id="refs-inside-v-for" tabindex="-1"><code>v-for</code> 中的模板引用 <a class="header-anchor" href="#refs-inside-v-for" aria-label="Permalink to &quot;\`v-for\` 中的模板引用 {#refs-inside-v-for}&quot;">​</a></h2><blockquote><p>需要 v3.5 及以上版本</p></blockquote><div class="composition-api"><p>当在 <code>v-for</code> 中使用模板引用时，对应的 ref 中包含的值是一个数组，它将在元素被挂载后包含对应整个列表的所有元素：</p><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">script</span><span style="color:#B392F0;"> setup</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { ref, useTemplateRef, onMounted } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#79B8FF;"> list</span><span style="color:#F97583;"> =</span><span style="color:#B392F0;"> ref</span><span style="color:#E1E4E8;">([</span></span>
<span class="line"><span style="color:#6A737D;">  /* ... */</span></span>
<span class="line"><span style="color:#E1E4E8;">])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#79B8FF;"> itemRefs</span><span style="color:#F97583;"> =</span><span style="color:#B392F0;"> useTemplateRef</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;items&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">onMounted</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(itemRefs.value))</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">script</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;</span><span style="color:#85E89D;">ul</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;</span><span style="color:#85E89D;">li</span><span style="color:#B392F0;"> v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;item in list&quot;</span><span style="color:#B392F0;"> ref</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;items&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      {{ item }}</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;/</span><span style="color:#85E89D;">li</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;/</span><span style="color:#85E89D;">ul</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span></code></pre></div><p><a href="https://play.vuejs.org/#eNp9UsluwjAQ/ZWRLwQpDepyQoDUIg6t1EWUW91DFAZq6tiWF4oU5d87dtgqVRyyzLw3b+aN3bB7Y4ptQDZkI1dZYTw49MFMuBK10dZDAxZXOQSHC6yNLD3OY6zVsw7K4xJaWFldQ49UelxxVWnlPEhBr3GszT6uc7jJ4fazf4KFx5p0HFH+Kme9CLle4h6bZFkfxhNouAIoJVqfHQSKbSkDFnVpMhEpovC481NNVcr3SaWlZzTovJErCqgydaMIYBRk+tKfFLC9Wmk75iyqg1DJBWfRxT7pONvTAZom2YC23QsMpOg0B0l0NDh2YjnzjpyvxLrYOK1o3ckLZ5WujSBHr8YL2gxnw85lxEop9c9TynkbMD/kqy+svv/Jb9wu5jh7s+jQbpGzI+ZLu0byEuHZ+wvt6Ays9TJIYl8A5+i0DHHGjvYQ1JLGPuOlaR/TpRFqvXCzHR2BO5iKg0Zmm/ic0W2ZXrB+Gve2uEt1dJKs/QXbwePE" target="_blank" rel="noreferrer">在演练场中尝试一下</a></p><details><summary>3.5 前的用法</summary><p>在 3.5 版本以前，<code>useTemplateRef()</code> 尚未引入，需要声明一个与模板引用 attribute 同名的 ref。该 ref 的值需要是一个数组。</p><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">script</span><span style="color:#B392F0;"> setup</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { ref, onMounted } </span><span style="color:#F97583;">from</span><span style="color:#9ECBFF;"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#79B8FF;"> list</span><span style="color:#F97583;"> =</span><span style="color:#B392F0;"> ref</span><span style="color:#E1E4E8;">([</span></span>
<span class="line"><span style="color:#6A737D;">  /* ... */</span></span>
<span class="line"><span style="color:#E1E4E8;">])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#79B8FF;"> itemRefs</span><span style="color:#F97583;"> =</span><span style="color:#B392F0;"> ref</span><span style="color:#E1E4E8;">([])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">onMounted</span><span style="color:#E1E4E8;">(() </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(itemRefs.value))</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">script</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;</span><span style="color:#85E89D;">ul</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;</span><span style="color:#85E89D;">li</span><span style="color:#B392F0;"> v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;item in list&quot;</span><span style="color:#B392F0;"> ref</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;itemRefs&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      {{ item }}</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;/</span><span style="color:#85E89D;">li</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;/</span><span style="color:#85E89D;">ul</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span></code></pre></div></details></div><div class="options-api"><p>当在 <code>v-for</code> 中使用模板引用时，相应的引用中包含的值是一个数组：</p><div class="language-vue"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">script</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#F97583;"> default</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#B392F0;">  data</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#F97583;">    return</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      list: [</span></span>
<span class="line"><span style="color:#6A737D;">        /* ... */</span></span>
<span class="line"><span style="color:#E1E4E8;">      ]</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#B392F0;">  mounted</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.$refs.items)</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">script</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;</span><span style="color:#85E89D;">ul</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;</span><span style="color:#85E89D;">li</span><span style="color:#B392F0;"> v-for</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;item in list&quot;</span><span style="color:#B392F0;"> ref</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;items&quot;</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      {{ item }}</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;/</span><span style="color:#85E89D;">li</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  &lt;/</span><span style="color:#85E89D;">ul</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">&lt;/</span><span style="color:#85E89D;">template</span><span style="color:#E1E4E8;">&gt;</span></span></code></pre></div><p><a href="https://play.vuejs.org/#eNpFjk0KwjAQha/yCC4Uaou6kyp4DuOi2KkGYhKSiQildzdNa4WQmTc/37xeXJwr35HEUdTh7pXjszT0cdYzWuqaqBm9NEDbcLPeTDngiaM3PwVoFfiI667AvsDhNpWHMQzF+L9sNEztH3C3JlhNpbaPNT9VKFeeulAqplfY5D1p0qurxVQSqel0w5QUUEedY8q0wnvbWX+SYgRAmWxIiuSzm4tBinkc6HvkuSE7TIBKq4lZZWhdLZfE8AWp4l3T" target="_blank" rel="noreferrer">在演练场中尝试一下</a></p></div><p>应该注意的是，ref 数组<strong>并不</strong>保证与源数组相同的顺序。</p><h2 id="function-refs" tabindex="-1">函数模板引用 <a class="header-anchor" href="#function-refs" aria-label="Permalink to &quot;函数模板引用 {#function-refs}&quot;">​</a></h2><p>除了使用字符串值作名字，<code>ref</code> attribute 还可以绑定为一个函数，会在每次组件更新时都被调用。该函数会收到元素引用作为其第一个参数：</p><div class="language-template"><button title="Copy Code" class="copy"></button><span class="lang">template</span><pre class="shiki github-dark vp-code" tabindex="0"><code><span class="line"><span style="color:#E1E4E8;">&lt;</span><span style="color:#85E89D;">input</span><span style="color:#E1E4E8;"> :</span><span style="color:#B392F0;">ref</span><span style="color:#E1E4E8;">=</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">el</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> { </span><span style="color:#6A737D;">/* 将 el 赋值给一个数据属性或 ref 变量 */</span><span style="color:#E1E4E8;"> }</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#E1E4E8;">&gt;</span></span></code></pre></div><p>注意我们这里需要使用动态的 <code>:ref</code> 绑定才能够传入一个函数。当绑定的元素被卸载时，函数也会被调用一次，此时的 <code>el</code> 参数会是 <code>null</code>。你当然也可以绑定一个组件方法而不是内联函数。</p>`,26)]))}const u=n(o,[["render",e]]);export{d as __pageData,u as default};
