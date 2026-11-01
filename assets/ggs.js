/* G.G.S Agrotech — site script (served from GitHub). Designed & Developed by Nivesh Sahayak.
   Pages from GitHub: a Blogger page holds only <div data-ggs-page="contact">short fallback text</div>. The real
   content is pages/contact.html next to this file: edit it and push, and the live page changes with nothing to paste.
   Phone and email stay in the theme (window.GGS). In page files: {{tel}} {{wa}} {{show}} {{email}} {{base}}. */
(function(){
  var CFG=window.GGS||{}, ME=document.currentScript||document.querySelector('script[src*="ggs.js"]');
  var BASE=ME&&ME.src?ME.src.replace(/ggs\.js.*$/,''):'';
  function fillTokens(h){
    var wa=String(CFG.whatsapp||'').replace(/\D/g,'');
    return h.replace(/\{\{(\w+)\}\}/g,function(m,k){
      if(k==='base') return BASE;
      if(k==='email') return CFG.email||'';
      if(k==='tel') return wa?'tel:+'+wa:'/p/contact.html';
      if(k==='wa') return wa?'https://wa.me/'+wa:'/p/contact.html';
      if(k==='show') return wa?'+'+wa.replace(/^(\d{2})(\d{5})(\d{5})$/,'$1 $2 $3'):'';
      return m;
    });
  }
  function loadPages(done){
    var slots=document.querySelectorAll('[data-ggs-page]'), left=slots.length;
    if(!left) return done();
    Array.prototype.forEach.call(slots,function(el){
      el.classList.add('is-loading');   /* shimmer skeleton (ggs.css) until the content arrives */
      fetch(BASE+'pages/'+el.getAttribute('data-ggs-page')+'.html',{cache:'no-cache'})
        .then(function(r){ if(!r.ok) throw new Error(r.status); return r.text(); })
        .then(function(h){
          el.innerHTML=fillTokens(h);
          Array.prototype.forEach.call(el.querySelectorAll('script'),function(old){   /* scripts added with innerHTML don't run */
            var s=document.createElement('script');
            Array.prototype.forEach.call(old.attributes,function(x){ s.setAttribute(x.name,x.value); });
            s.text=old.text; old.parentNode.replaceChild(s,old);
          });
          el.classList.add('is-loaded');   /* sections fade up one after another */
        })
        .catch(function () { el.classList.add('is-failed'); })   /* keep the fallback text from the Blogger page */
        .then(function(){ el.classList.remove('is-loading'); if(--left===0) done(); });
    });
  }
  function ggsMain(){
(function(){
  var d=document,root=d.documentElement,body=d.body;
  function qs(s,c){return (c||d).querySelector(s)}
  function qsa(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))}
  var toastEl=qs('#toast');if(toastEl)toastEl.textContent='';
  function toast(m){if(!toastEl)return;toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(toastEl._t);toastEl._t=setTimeout(function(){toastEl.classList.remove('show')},2200)}

  /* Theme toggle */
  var tt=qs('#themeToggle');
  function syncTheme(){if(tt)tt.setAttribute('aria-pressed',root.getAttribute('data-theme')==='dark'?'true':'false')}
  if(tt){syncTheme();tt.addEventListener('click',function(){var n=root.getAttribute('data-theme')==='dark'?'light':'dark';root.setAttribute('data-theme',n);try{localStorage.setItem('ggs-theme',n)}catch(e){}syncTheme()})}

  /* Mobile menu */
  var mt=qs('#menuToggle');
  function setNav(open){body.classList.toggle('nav-open',open);if(mt){mt.setAttribute('aria-expanded',open?'true':'false');mt.setAttribute('aria-label',open?'Close menu':'Open menu')}}
  if(mt)mt.addEventListener('click',function(){setNav(!body.classList.contains('nav-open'))});
  qsa('.nav-link').forEach(function(a){a.addEventListener('click',function(){setNav(false)})});

  /* Active menu link */
  var norm=function(p){return p.replace(/\/+$/,'')||'/'};
  var here=norm(location.pathname);
  qsa('.nav-link').forEach(function(a){try{if(norm(new URL(a.href,location.href).pathname)===here){a.classList.add('active');a.setAttribute('aria-current','page')}}catch(e){}});

  /* Search overlay  ( Ctrl/⌘+K  or  / ) */
  var so=qs('#searchOverlay'),si=so&&qs('input',so),lastFocus=null;
  function openSearch(){if(!so)return;setNav(false);lastFocus=d.activeElement;so.hidden=false;body.style.overflow='hidden';setTimeout(function(){si&&si.focus()},30)}
  function closeSearch(){if(!so||so.hidden)return;so.hidden=true;body.style.overflow='';if(lastFocus&&lastFocus.focus)lastFocus.focus()}
  qsa('[data-open-search]').forEach(function(b){b.addEventListener('click',openSearch)});
  if(so)so.addEventListener('click',function(e){if(e.target===so||e.target.closest('[data-close-search]'))closeSearch()});
  d.addEventListener('keydown',function(e){
    var t=e.target,tag=(t.tagName||'').toLowerCase(),typing=tag==='input'||tag==='textarea'||t.isContentEditable;
    if(((e.key==='k'||e.key==='K')&&(e.metaKey||e.ctrlKey))||(e.key==='/'&&!typing)){e.preventDefault();openSearch();return}
    if(e.key==='Escape'){closeSearch();setNav(false)}
  });
  var isMac=/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent);
  qsa('.kbd-mod').forEach(function(k){k.textContent=isMac?'⌘K':'Ctrl K'});

  /* Scroll: header border, back-to-top, reading progress */
  var hdr=qs('.site-header'),top=qs('#toTop'),prog=qs('#progress');
  if(prog)prog.textContent='';
  var ticking=false;
  function onScroll(){
    var y=window.pageYOffset,entry=qs('.entry');
    if(hdr)hdr.classList.toggle('scrolled',y>8);
    if(top)top.classList.toggle('show',y>700);
    if(prog&&entry){var r=entry.getBoundingClientRect(),total=r.height-window.innerHeight*.6,p=total>0?(-r.top+window.innerHeight*.2)/total:1;prog.style.transform='scaleX('+Math.min(1,Math.max(0,p))+')'}
    ticking=false;
  }
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
  onScroll();
  if(top)top.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});

  /* When the copyright row is on screen, lift the chat / back-to-top buttons above it */
  var fbRow=qs('.footer-bottom');
  if(fbRow&&'IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      var on=es[0].isIntersecting;
      if(on)root.style.setProperty('--lift',(fbRow.offsetHeight+44)+'px');
      body.classList.toggle('at-footer',on);
    }).observe(fbRow);
  }

  /* Reveal on scroll */
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{threshold:.1,rootMargin:'0px 0px -40px 0px'}):null;
  function watchReveal(scope){qsa('.reveal',scope).forEach(function(el){if(io)io.observe(el);else el.classList.add('in')})}
  watchReveal();

  /* EDIT: WhatsApp number used by product "Enquire" buttons and the contact form */
  var WA=String((window.GGS||{}).whatsapp||'');   /* set in the theme (window.GGS), not in this public file */
  var WA_ICON='<svg aria-hidden="true" class="i f" viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2z"/></svg>';
  function waLink(text){return 'https://wa.me/'+WA+'?text='+encodeURIComponent(text)}

  /* Products page: search box + WhatsApp "Enquire" on every product */
  function enhanceProducts(entry){
    var list=qs('.products_list',entry);
    if(!list||qs('.product-controls',entry)||qs('.product-tools',entry))return;
    var items=qsa('.product_item',list);if(!items.length)return;
    items.forEach(function(it){
      var h=qs('h2,h3',it),name=h?h.textContent.trim():'this product';
      var a=d.createElement('a');a.className='enquire';a.target='_blank';a.rel='noopener';
      a.href=waLink('Hi G.G.S Agrotech, I want a quote for: '+name);a.innerHTML=WA_ICON+'Enquire';
      it.appendChild(a);
      /* light "studio tray" behind the photo: white backgrounds blend in, looks right in dark mode too */
      var img=qs('img',it);
      if(img&&!(img.getAttribute('alt')||'').trim())img.setAttribute('alt',name+' – G.G.S Agrotech, Ludhiana');
      if(img&&!img.closest('.product-tray')){var tray=d.createElement('span');tray.className='product-tray';img.parentNode.insertBefore(tray,img);tray.appendChild(img)}
    });
    var bar=d.createElement('div');bar.className='product-tools';
    bar.innerHTML='<label><svg aria-hidden="true" class="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><span class="sr-only">Search products</span><input type="search" placeholder="Search '+items.length+' products, e.g. blade, gear, PTO…"/></label><span class="count">'+items.length+' items</span>';
    var none=d.createElement('p');none.className='product-empty';none.textContent='No match. Ask us on WhatsApp — we probably make it.';
    list.parentNode.insertBefore(bar,list);list.parentNode.insertBefore(none,list.nextSibling);
    var inp=qs('input',bar),cnt=qs('.count',bar);
    inp.addEventListener('input',function(){
      var q=inp.value.trim().toLowerCase(),n=0;
      items.forEach(function(it){var box=it.closest('.row > *')||it,hit=!q||it.textContent.toLowerCase().indexOf(q)>-1;box.classList.toggle('is-hidden',!hit);if(hit)n++});
      cnt.textContent=n+' item'+(n===1?'':'s');none.style.display=n?'none':'block';
    });
    /* /p/products.html?q=blade opens pre-filtered (used by the footer "Popular parts" chips) */
    var q0=new URLSearchParams(location.search).get('q');
    if(q0){inp.value=q0;inp.dispatchEvent(new Event('input'));setTimeout(function(){bar.scrollIntoView({block:'start'})},60)}
  }

  /* Contact forms send via WhatsApp (no gadget needed).
     Works with the new page form (form.wa-form) and the old one (.contact_fields). */
  function enhanceContact(entry){
    var f=qs('form.wa-form',entry)||qs('.contact_fields',entry);if(!f||f._wa)return;f._wa=1;
    var btn=qs('button[type="submit"],input[type="submit"],.contact-form-button',f);
    var isSubmit=btn&&btn.type==='submit';
    if(btn&&btn.tagName==='INPUT'&&!isSubmit)btn.value='Send via WhatsApp';
    var note=qs('.wa-form-note',f)||qs('.contact-form-success-message',entry),err=qs('.contact-form-error-message',entry)||note;
    function say(el,m,bad){qsa('.wa-form-note,.contact-form-success-message,.contact-form-error-message',entry).forEach(function(x){x.textContent=''});if(el){el.textContent=m;el.classList.toggle('is-error',!!bad)}}
    function send(e){
      if(e)e.preventDefault();
      var lines=[],missing=false;
      qsa('input,textarea,select',f).forEach(function(x){
        if(/^(submit|button|hidden|reset)$/.test(x.type))return;
        var v=(x.value||'').trim(),label=(x.getAttribute('data-label')||x.name||x.placeholder||'Info').replace(/[-_]/g,' ');
        if(x.required&&!v)missing=true;
        if(v)lines.push(label.charAt(0).toUpperCase()+label.slice(1)+': '+v);
      });
      if(missing||!lines.length){say(err,'Please fill in your name and a message.',true);return}
      window.open(waLink('Hi G.G.S Agrotech!\n'+lines.join('\n')),'_blank');
      say(note,'Opening WhatsApp… tap send there and we’ll reply soon.');if(f.reset)f.reset();
    }
    f.addEventListener('submit',send);
    if(btn&&!isSubmit)btn.addEventListener('click',send);
  }

  /* Tools page (div.gg-tools): live search + category filter chips */
  function enhanceTools(entry){
    var box=qs('.gg-tools',entry);if(!box||box._t)return;box._t=1;
    var cards=qsa('.tool-card',box),inp=qs('.tool-search input',box),empty=qs('.tool-empty',box),filter='all';
    function apply(){
      var q=inp?inp.value.trim().toLowerCase():'',n=0;
      cards.forEach(function(c){var tags=' '+(c.getAttribute('data-tags')||'')+' ',hit=(filter==='all'||tags.indexOf(' '+filter+' ')>-1)&&(!q||c.textContent.toLowerCase().indexOf(q)>-1);c.hidden=!hit;if(hit)n++});
      if(empty)empty.hidden=n>0;
    }
    qsa('[data-filter]',box).forEach(function(b){b.setAttribute('aria-pressed',b.classList.contains('is-on')?'true':'false');b.addEventListener('click',function(){
      filter=b.getAttribute('data-filter');qsa('[data-filter]',box).forEach(function(x){var on=x===b;x.classList.toggle('is-on',on);x.setAttribute('aria-pressed',on?'true':'false')});apply();
    })});
    if(inp)inp.addEventListener('input',apply);
  }

  /* Some posts carry their own <style> (written for a standalone page): it recoloured the
     whole site (body text, fonts, padding). Re-scope those rules to the article only. */
  var PAGE_PROPS=/^(background|color|font|padding|margin|line-height|max-width|width|min-height|height)/;
  function scopeRules(rules){
    var out='';
    for(var i=0;i<rules.length;i++){
      var r=rules[i];
      if(r.selectorText!==undefined&&r.style){
        var whole=false;
        var sel=r.selectorText.split(',').map(function(s){s=s.trim();if(/^(html|body|:root)(?![\w-])/.test(s)){whole=true;return s.replace(/^(html|body|:root)/,'.entry')}return '.entry '+s}).join(',');
        var css='';
        for(var j=0;j<r.style.length;j++){var p=r.style[j];if(whole&&p.indexOf('--')!==0&&PAGE_PROPS.test(p))continue;css+=p+':'+r.style.getPropertyValue(p)+(r.style.getPropertyPriority(p)?' !important':'')+';'}
        if(css)out+=sel+'{'+css+'}';
      }else if(r.media&&r.cssRules){out+='@media '+r.media.mediaText+'{'+scopeRules(r.cssRules)+'}'}
      else if(r.cssText){out+=r.cssText}
    }
    return out;
  }
  function scopeEntryStyles(entry){
    qsa('style',entry).forEach(function(s){
      if(s._scoped||!s.sheet)return;
      try{var txt=scopeRules(s.sheet.cssRules);s._scoped=1;s.textContent=txt;s._scoped=1}catch(e){}
    });
    /* light boxes the post styles itself (notes, tables): mark them so dark mode can tone them down */
    qsa('*',entry).forEach(function(el){
      if(el.tagName==='IMG'||el.closest('.share,.post-cta,.product_item,.gg-tools,.contact-card,.bento,.pc-steps'))return;
      var bg=getComputedStyle(el).backgroundColor,m=bg&&bg.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/);
      if(!m||(m[4]!==undefined&&+m[4]<.5))return;
      if((.2126*m[1]+.7152*m[2]+.0722*m[3])/255>.8)el.classList.add('dm-soft');
    });
  }

  /* Post/page enhancements: read time, lazy images, table of contents */
  function enhanceEntry(){
    var entry=qs('.entry');if(!entry)return;
    scopeEntryStyles(entry);enhanceProducts(entry);enhanceContact(entry);enhanceTools(entry);
    var words=(entry.textContent||'').trim().split(/\s+/).length,rt=qs('#readTime');
    if(rt)rt.textContent=Math.max(1,Math.round(words/200))+' min read';
    qsa('img',entry).forEach(function(i){i.setAttribute('loading','lazy');i.setAttribute('decoding','async')});
    var toc=qs('#toc'),hs=qsa('h2, h3',entry);
    if(toc&&hs.length>=3){
      var ol=d.createElement('ol');
      hs.forEach(function(h,i){
        if(!h.id)h.id='s'+(i+1)+'-'+h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48);
        var li=d.createElement('li'),a=d.createElement('a');
        li.className='lvl-'+h.tagName.charAt(1);a.href='#'+h.id;a.textContent=h.textContent.trim();
        li.appendChild(a);ol.appendChild(li);
      });
      toc.appendChild(ol);toc.hidden=false;
      if(window.innerWidth<700)toc.removeAttribute('open');
    }
  }

  /* ---------- Blog layout ----------
     The Blog gadget uses Blogger's own built-in markup (always rendered, good for
     Google). The code below restyles it into the theme's cards / post layout.
     If the gadget ever comes back empty, feedFallback() loads content from the
     blog's JSON feed instead, so a page is never blank. */
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function bigImg(u){return u?u.replace(/\/(s\d+|w\d+-h\d+)(-[a-z0-9-]+)?\//,'/w640-h360-c/').replace(/=(s\d+|w\d+-h\d+)(-[a-z0-9-]+)?$/,'=w640-h360-c'):''}
  function niceDate(s){var t=new Date(s);return isNaN(t)?s:t.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}
  function chip(l){return '<a class="chip" href="/search/label/'+encodeURIComponent(l)+'">#'+esc(l)+'</a>'}
  /* visible text only: drops <style>/<script> that some posts embed */
  function plainText(el){if(!el)return '';var c=el.cloneNode(true);qsa('style,script,noscript',c).forEach(function(n){n.parentNode.removeChild(n)});return (c.textContent||'').replace(/\s+/g,' ').trim()}
  function chips(ls){return ls.slice(0,4).map(chip).join('')+(ls.length>4?'<span class="chip chip-more">+'+(ls.length-4)+'</span>':'')}
  var LEAF='<svg class="i" viewBox="0 0 24 24"><path d="M7 20h10M12 20v-8M12 12c0-4-3-6-7-6 0 4 3 6 7 6zM12 12c0-4 3-6 7-6 0 4-3 6-7 6z"/></svg>';
  function card(o){
    return '<article class="card reveal"><a class="card-media" href="'+esc(o.url)+'" tabindex="-1">'+(o.img?'<img alt="'+esc(o.title)+'" loading="lazy" src="'+esc(bigImg(o.img))+'"/>':'<span aria-hidden="true" class="card-ph">'+LEAF+'</span>')+'</a>'+
      '<div class="card-body">'+(o.label?chip(o.label):'')+'<h2 class="card-title"><a href="'+esc(o.url)+'">'+esc(o.title)+'</a></h2><p class="card-snippet">'+esc((o.text||'').slice(0,180))+'</p>'+
      '<div class="card-meta"><time>'+esc(o.date||'')+'</time><a aria-hidden="true" class="read" href="'+esc(o.url)+'" tabindex="-1">Read →</a></div></div></article>';
  }
  var path=location.pathname,sp=new URLSearchParams(location.search),Q=sp.get('q'),LM=/^\/search\/label\/([^\/?#]+)/.exec(path);
  var IS_HOME=body.classList.contains('is-home'),IS_ERROR=body.classList.contains('is-error');
  if(/^\/p\/powder-coating\.html$/.test(path))body.classList.add('is-pc');
  var IS_PAGE=body.classList.contains('is-page')||/^\/p\/.+\.html$/.test(path),IS_POST=body.classList.contains('is-post')||/^\/\d{4}\/\d{2}\/.+\.html$/.test(path);
  function feedHead(){
    return IS_HOME?'<div class="block-head"><div><span class="eyebrow">from the field journal</span><h2>Latest from the blog</h2></div><a class="btn btn-ghost" href="/search">View all posts →</a></div>'
      :LM?'<header class="feed-head"><span class="eyebrow">topic</span><h1>#'+esc(decodeURIComponent(LM[1]))+'</h1><p>All posts tagged “'+esc(decodeURIComponent(LM[1]))+'”.</p></header>'
      :Q?'<header class="feed-head"><span class="eyebrow">search</span><h1>Results for “'+esc(Q)+'”</h1></header>'
      :'<header class="feed-head"><span class="eyebrow">the blog</span><h1>Field notes, <span class="grad">made simple.</span></h1><p>Guides, how-tos and maintenance tips for modern farm machinery.</p></header>';
  }
  var NOTFOUND='<div class="notfound"><div class="code grad">404</div><h1>This page took a wrong turn.</h1><p>The link may be broken or the page was moved. Try a search, or head back home.</p><a class="btn btn-primary" href="/">Back to home</a> <button class="btn btn-ghost" data-open-search="1" type="button">Search the site</button></div>';
  var EMPTY='<div class="empty"><h2>Nothing here yet</h2><p>No posts matched. Try another keyword.</p><button class="btn btn-ghost" data-open-search="1" type="button">Search again</button></div>';
  function crumbs(label){return '<nav aria-label="Breadcrumb" class="crumbs"><a href="/">home</a>'+(label&&IS_POST?'<span class="sep">/</span><a href="/search/label/'+encodeURIComponent(label)+'">'+esc(label)+'</a>':'')+'<span class="sep">/</span><span aria-current="page">'+(IS_PAGE?'page':'post')+'</span></nav>'}
  var TOC='<details class="toc" hidden="hidden" id="toc" open="open"><summary>On this page</summary></details>';
  function shareCta(title){
    return '<div class="share"><span class="share-label">Share this 👇</span>'+
      '<a aria-label="Share on WhatsApp" class="icon-btn" data-share="wa" href="#" rel="noopener" target="_blank">'+WA_ICON+'</a>'+
      '<a aria-label="Share on Facebook" class="icon-btn" data-share="fb" href="#" rel="noopener" target="_blank"><svg aria-hidden="true" class="i f" viewBox="0 0 24 24"><path d="M14 9h3V5.5h-3c-2.2 0-4 1.8-4 4V12H7.5v3.5H10V22h3.5v-6.5H16l.7-3.5h-3.2V9.5c0-.3.2-.5.5-.5z"/></svg></a>'+
      '<a aria-label="Share on X" class="icon-btn" data-share="x" href="#" rel="noopener" target="_blank"><svg aria-hidden="true" class="i f" viewBox="0 0 24 24"><path d="M17.5 3h3.2l-7 8 8.3 10h-6.5l-5-6.2L4.8 21H1.6l7.5-8.6L1.2 3h6.6l4.6 5.7L17.5 3zm-1.1 16h1.8L6.7 4.9H4.8L16.4 19z"/></svg></a>'+
      '<a aria-label="Share on LinkedIn" class="icon-btn" data-share="li" href="#" rel="noopener" target="_blank"><svg aria-hidden="true" class="i f" viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z"/></svg></a>'+
      '<button aria-label="Copy link" class="icon-btn" data-copy="1" type="button"><svg aria-hidden="true" class="i" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg></button></div>'+
      '<aside class="post-cta"><div><h3>Need this part or machine?</h3><p>Send us a message — we’ll help you pick the right fit.</p></div><a class="btn btn-dark" href="'+esc(waLink('Hi, I read: '+title))+'" rel="noopener" target="_blank">WhatsApp us →</a></aside>';
  }

  /* Share + copy-link buttons (call again after injecting new ones) */
  var shareUrl=location.href.split('#')[0].replace(/([?&])m=1&?/,'$1').replace(/[?&]$/,''),enc=encodeURIComponent;
  function bindShare(scope){
    var title=d.title,links={wa:'https://wa.me/?text='+enc(title+' '+shareUrl),fb:'https://www.facebook.com/sharer/sharer.php?u='+enc(shareUrl),x:'https://twitter.com/intent/tweet?text='+enc(title)+'&url='+enc(shareUrl),li:'https://www.linkedin.com/sharing/share-offsite/?url='+enc(shareUrl)};
    qsa('[data-share]',scope).forEach(function(a){var k=a.getAttribute('data-share');if(links[k])a.href=links[k]});
    qsa('[data-copy]',scope).forEach(function(b){if(b._bound)return;b._bound=1;b.addEventListener('click',function(){
      if(navigator.clipboard){navigator.clipboard.writeText(shareUrl).then(function(){toast('Link copied ✓')},function(){toast(shareUrl)})}else{toast(shareUrl)}
    })});
    qsa('[data-open-search]',scope).forEach(function(b){if(b._bound)return;b._bound=1;b.addEventListener('click',openSearch)});
  }

  /* Native Blog gadget → theme layout */
  function adaptNative(){
    var w=qs('#Blog1');if(!w)return;
    if(IS_ERROR){w.innerHTML=NOTFOUND;return}
    var pb=(IS_POST||IS_PAGE)&&qs('.post-body',w);
    if(pb){
      var post=pb.closest('.post-outer-container')||pb.closest('.post-outer')||pb.closest('.post')||pb.parentNode;
      pb.classList.add('entry');post.classList.add('post-wrap');if(IS_PAGE)post.classList.add('is-static');
      var labels=qsa('.post-labels a, a[rel="tag"]',post).map(function(a){return a.textContent.trim()});
      var t=qs('.post-title',post)||qs('h1,h2,h3',post),h1=d.createElement('h1');
      h1.className='post-title';h1.textContent=t?t.textContent.trim():d.title;
      if(t)t.parentNode.replaceChild(h1,t);else pb.parentNode.insertBefore(h1,pb);
      h1.insertAdjacentHTML('beforebegin',crumbs(labels[0])+(IS_POST&&labels.length?'<div class="post-labels">'+chips(labels)+'</div>':''));
      var ph=qs('.post-header',post);
      if(IS_POST){
        if(ph){ph.classList.add('post-meta');ph.insertAdjacentHTML('beforeend','<span id="readTime">quick read</span>')}
        pb.insertAdjacentHTML('beforebegin',TOC);pb.insertAdjacentHTML('afterend',shareCta(h1.textContent));
      }else if(ph){ph.style.display='none'}
      return;
    }
    var outs=qsa('.post-outer',w);if(!outs.length)outs=qsa('.post',w);
    var items=outs.map(function(o){
      var a=qs('.post-title a,.entry-title a,h3 a,h2 a',o);if(!a)return null;
      var b=qs('.post-body,.snippet-item,.post-snippet,.entry-content',o),img=qs('img',o),tm=qs('time,.published',o),lb=qs('.post-labels a,a[rel="tag"]',o);
      return {url:a.href,title:a.textContent.trim(),img:img&&(img.getAttribute('src')||img.getAttribute('data-src')),label:lb&&lb.textContent.trim(),text:plainText(b),date:tm?tm.textContent.trim():''};
    }).filter(Boolean);
    var pager=qs('.blog-pager',w),list=qs('.blog-posts',w)||w;
    list.innerHTML=feedHead()+(items.length?'<div class="post-grid">'+items.map(card).join('')+'</div>':EMPTY);
    qsa('.status-msg-wrap',w).forEach(function(s){s.parentNode.removeChild(s)});
    if(pager){if(IS_HOME)pager.parentNode&&pager.parentNode.removeChild(pager);else if(!w.contains(pager))w.appendChild(pager)}
  }

  /* Safety net: gadget came back empty → build the same layout from the JSON feed */
  function altLink(e){var l=(e.link||[]).filter(function(x){return x.rel==='alternate'})[0];return l?l.href:'#'}
  function feedItem(e){
    var t=e.media$thumbnail&&e.media$thumbnail.url;
    if(!t&&e.content){var m=/<img[^>]+src="([^"]+)"/i.exec(e.content.$t);t=m&&m[1]}
    var x=d.createElement('div');x.innerHTML=(e.summary||e.content||{}).$t||'';x=plainText(x);
    return {url:altLink(e),title:e.title.$t,img:t,label:(e.category||[])[0]&&e.category[0].term,text:x,date:niceDate(e.published.$t)};
  }
  function getFeed(u,cb){fetch(u).then(function(r){return r.json()}).then(function(j){cb((j.feed&&j.feed.entry)||[])}).catch(function(){cb(null)})}
  function runScripts(box){
    qsa('script',box).forEach(function(s){var n=d.createElement('script');if(s.src)n.src=s.src;else n.textContent=s.textContent;s.parentNode.replaceChild(n,s)});
    try{d.dispatchEvent(new Event('DOMContentLoaded'))}catch(_){}
  }
  function feedFallback(){
    var host=qs('#blog-main');
    if(!host||qs('#Blog1')||host.children.length)return;
    host.innerHTML='<div class="loading">loading…</div>';
    if(IS_ERROR){host.innerHTML=NOTFOUND;bindShare(host);return}
    if(IS_PAGE||IS_POST){
      getFeed('/feeds/'+(IS_PAGE?'pages':'posts')+'/default?alt=json&max-results=150',function(list){
        var e=(list||[]).filter(function(x){try{return new URL(altLink(x)).pathname===path}catch(_){return false}})[0];
        if(!e){host.innerHTML=NOTFOUND;bindShare(host);return}
        var labels=(e.category||[]).map(function(c){return c.term});
        host.innerHTML='<article class="post-wrap'+(IS_PAGE?' is-static':'')+'">'+crumbs(labels[0])+(IS_POST&&labels.length?'<div class="post-labels">'+chips(labels)+'</div>':'')+
          '<h1 class="post-title">'+esc(e.title.$t)+'</h1>'+
          (IS_POST?'<div class="post-meta"><span aria-hidden="true" class="avatar">G</span><span class="author">'+esc((e.author&&e.author[0]&&e.author[0].name.$t)||'G.G.S Agrotech')+'</span><span aria-hidden="true" class="sep">·</span><time>'+esc(niceDate(e.published.$t))+'</time><span aria-hidden="true" class="sep">·</span><span id="readTime">quick read</span></div>'+TOC:'')+
          '<div class="entry">'+e.content.$t+'</div>'+(IS_POST?shareCta(e.title.$t):'')+'</article>';
        runScripts(host);enhanceEntry();bindShare(host);
      });
      return;
    }
    getFeed('/feeds/posts/default'+(LM?'/-/'+LM[1]:'')+'?alt=json&max-results='+(IS_HOME?6:12)+(Q?'&q='+encodeURIComponent(Q):''),function(list){
      host.innerHTML=feedHead()+(list&&list.length?'<div class="post-grid">'+list.map(feedItem).map(card).join('')+'</div>':EMPTY);
      watchReveal(host);bindShare(host);
    });
  }

  adaptNative();
  feedFallback();
  enhanceEntry();
  bindShare();
  watchReveal(qs('#Blog1'));

  /* Live open/closed badge — Mon–Sat 09:00–18:00 IST  (EDIT hours here) */
  var OPEN_MIN=9*60,CLOSE_MIN=18*60,CLOSED_DAY='Sun';
  var st=qsa('[data-open-status]');
  if(st.length&&window.Intl){
    try{
      var parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
      var g=function(t){for(var i=0;i<parts.length;i++){if(parts[i].type===t)return parts[i].value}return ''};
      var mins=(parseInt(g('hour'),10)%24)*60+parseInt(g('minute'),10),open=g('weekday')!==CLOSED_DAY&&mins>=OPEN_MIN&&mins<CLOSE_MIN;
      st.forEach(function(s){s.classList.add(open?'open':'closed');var t=qs('.txt',s);if(t)t.textContent=open?'Open now':'Closed now'});
    }catch(e){}
  }
  qsa('.status .dot,.live').forEach(function(x){x.textContent=''});

  /* Footer year */
  qsa('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear()});
})();
  }
  loadPages(ggsMain);
})();

/* "Add as a preferred source on Google" (Google Search Top Stories): Google's official button at the top of the footer.
   Docs: developers.google.com/search/docs/appearance/preferred-sources. If Google's script can't load (blocked or offline),
   a plain link to the same Google page is shown instead. */
;(function () {
  function add() {
    var foot = document.querySelector('footer');
    if (!foot || document.querySelector('[google-add-preferred-source-btn]')) return;
    var root = document.documentElement, t = (root.getAttribute('data-theme') || root.className || '') + ' ' + (document.body.className || '');
    var dark = /dark|black/.test(t) || (!/light|sepia/.test(t) && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    var box = document.createElement('div'), btn = document.createElement('div');
    box.className = 'pref-source'; box.style.cssText = 'display:flex;justify-content:center;padding:16px 12px 4px;min-height:40px';
    btn.setAttribute('google-add-preferred-source-btn', ''); btn.setAttribute('data-theme', dark ? 'dark' : 'light');
    box.appendChild(btn); foot.insertBefore(box, foot.firstChild);
    var s = document.createElement('script'); s.async = true; s.src = 'https://news.google.com/swg/js/v1/publisher.js';
    document.head.appendChild(s);
    setTimeout(function () {   // fallback: Google's deep link
      if (btn.childNodes.length) return;
      var a = document.createElement('a');
      a.href = 'https://www.google.com/preferences/source?q=' + encodeURIComponent(location.hostname.replace(/^www\./, ''));
      a.target = '_blank'; a.rel = 'noopener'; a.textContent = '★ Add us as a preferred source on Google';
      a.style.cssText = 'display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border:1px solid currentColor;border-radius:999px;font:600 14px/1.2 system-ui,sans-serif;text-decoration:none;color:inherit;opacity:.85';
      btn.appendChild(a);
    }, 6000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
})();

/* Header: a compact "Preferred source on Google" button (Google's G; the words show on wide screens). It opens Google's own
   page for adding this site as a preferred source, the deep link Google documents for custom buttons. */
;(function () {
  function add() {
    if (document.querySelector('.pref-src-head')) return;
    var box = document.querySelector('.nav-actions, .ns-actions'), before = null;
    if (box) before = box.querySelector('[aria-label*="dark" i], [aria-label*="light" i]') || box.firstElementChild;
    else { var cta = document.querySelector('header .header-cta'); if (!cta) return; box = cta.parentNode; before = cta; }
    var a = document.createElement('a');
    a.className = 'pref-src-head';
    a.href = 'https://www.google.com/preferences/source?q=' + encodeURIComponent(location.hostname.replace(/^www\./, ''));
    a.target = '_blank'; a.rel = 'noopener';
    a.title = 'Add us as a preferred source on Google'; a.setAttribute('aria-label', a.title);
    a.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true">' +
      '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>' +
      '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +
      '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +
      '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>' +
      '</svg><span>Preferred source</span>';
    box.insertBefore(a, before);
    var st = document.createElement('style');
    st.textContent = '.pref-src-head{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-width:38px;height:38px;padding:0 9px;box-sizing:border-box;' +
      'border-radius:999px;border:1px solid color-mix(in srgb,currentColor 22%,transparent);color:inherit;text-decoration:none;font:600 13px/1 system-ui,sans-serif;white-space:nowrap;flex:none}' +
      '.pref-src-head:hover{border-color:color-mix(in srgb,currentColor 45%,transparent)}.pref-src-head svg{width:18px;height:18px;flex:none}' +
      '.pref-src-head span{display:none}@media (min-width:1100px){.pref-src-head{padding:0 13px}.pref-src-head span{display:inline}}';
    document.head.appendChild(st);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
})();
