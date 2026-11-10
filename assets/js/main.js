(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const loader = $('.loader');

  // QR code (decorative)
  (function(){
    const svg=$('#qr'); if(!svg) return; let h=''; let seed=7;
    const rnd=()=> (seed=(seed*9301+49297)%233280)/233280;
    const finder=(x,y)=>{h+=`<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x+1}" y="${y+1}" width="5" height="5" fill="#F1EFE9"/><rect x="${x+2}" y="${y+2}" width="3" height="3"/>`};
    for(let y=0;y<25;y++)for(let x=0;x<25;x++){const inF=(x<8&&y<8)||(x>16&&y<8)||(x<8&&y>16); if(!inF&&rnd()>.52) h+=`<rect x="${x}" y="${y}" width="1" height="1"/>`}
    finder(0,0);finder(18,0);finder(0,18); svg.innerHTML=`<g fill="#0B0B0C">${h}</g>`;
  })();

  if(!window.gsap || !window.ScrollTrigger){ loader && loader.remove(); return; }
  gsap.registerPlugin(ScrollTrigger);

  // ---------- split text ----------
  function split(el){
    const walk = node => {
      [...node.childNodes].forEach(n=>{
        if(n.nodeType===3){
          const frag=document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(tok=>{
            if(!tok) return;
            if(/^\s+$/.test(tok)){frag.appendChild(document.createTextNode(' '));return;}
            const w=document.createElement('span'); w.className='w';
            [...tok].forEach(ch=>{const c=document.createElement('span');c.className='c';c.textContent=ch;w.appendChild(c)});
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if(n.nodeType===1 && n.tagName!=='BR'){ walk(n); }
      });
    };
    walk(el);
  }
  $$('.split').forEach(split);

  // ---------- smooth scroll ----------
  let lenis=null;
  if(!reduce && window.Lenis){
    lenis = new Lenis({lerp:.085, wheelMultiplier:1}); 
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t=>lenis.raf(t*1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('[data-link]').forEach(a=>a.addEventListener('click',e=>{
    const id=a.getAttribute('href'); if(!id||id[0]!=='#') return;
    const t = id==='#top' ? 0 : $(id); if(t===null) return;
    e.preventDefault(); lenis ? lenis.scrollTo(t,{duration:1.6}) : (t===0?scrollTo({top:0,behavior:'smooth'}):t.scrollIntoView({behavior:'smooth'}));
  }));

  // ---------- progress + nav ----------
  gsap.to('.progress',{scaleX:1,ease:'none',scrollTrigger:{trigger:document.documentElement,start:0,end:'max',scrub:.3}});
  const nav=$('.nav'); let lastY=0;
  ScrollTrigger.create({start:0,end:'max',onUpdate:s=>{const y=s.scroll(); nav.classList.toggle('hide', y>lastY && y>300); lastY=y;}});

  // ---------- cursor ----------
  const cur=$('.cursor');
  if(matchMedia('(hover:hover)').matches){
    const xTo=gsap.quickTo(cur,'x',{duration:.35,ease:'power3'}), yTo=gsap.quickTo(cur,'y',{duration:.35,ease:'power3'});
    addEventListener('mousemove',e=>{xTo(e.clientX);yTo(e.clientY)});
    $$('a,button,.fcard').forEach(el=>{el.addEventListener('mouseenter',()=>cur.classList.add('big'));el.addEventListener('mouseleave',()=>cur.classList.remove('big'))});
  }

  if(reduce){ loader && loader.remove();
    // ---------- theme transitions between sections ----------
  const setTheme = t => { document.body.classList.remove('t-dark','t-light','t-gold'); document.body.classList.add('t-'+t); };
  $$('[data-theme]').forEach(sec=>{
    ScrollTrigger.create({trigger:sec,start:'top 50%',end:'bottom 50%',onToggle:s=>{ if(s.isActive) setTheme(sec.dataset.theme) }});
  });

    return; }

  // ---------- loader → hero intro ----------
  gsap.set('.hero__back .c, .hero__front .c',{yPercent:110});
  gsap.set('.hero__media',{clipPath:'inset(100% 0% 0% 0% round 28px)'});
  gsap.set(['.hero__chip','.hero__badge'],{scale:0,rotate:-20});
  gsap.set(['.hero__top','.hero__foot','.nav'],{autoAlpha:0});
  lenis && lenis.stop();

  const counter={v:0};
  const intro=gsap.timeline({defaults:{ease:'expo.out'}});
  intro.fromTo('.loader__word span',{yPercent:105},{yPercent:0,duration:1,stagger:.06},0)
    .to('.loader__bar i',{scaleX:1,duration:1.6,ease:'power2.inOut'},0)
    .to(counter,{v:100,duration:1.6,ease:'power2.inOut',onUpdate:()=>$('.loader__count').textContent=Math.round(counter.v)},0)
    .to('.loader__word span',{yPercent:-110,duration:.7,stagger:.04,ease:'expo.in'},1.65)
    .to('.loader',{clipPath:'inset(0% 0% 100% 0%)',duration:1.1,ease:'expo.inOut'},2.1)
    .set('.loader',{display:'none'})
    .to('.hero__media',{clipPath:'inset(0% 0% 0% 0% round 28px)',duration:1.4,ease:'expo.inOut'},2.35)
    .to('.hero__media img',{scale:1.25,duration:1.8,startAt:{scale:1.6}},2.35)
    .to('.hero__back .c',{yPercent:0,duration:1.2,stagger:.035},2.75)
    .to('.hero__front .c',{yPercent:0,duration:1.2,stagger:.035},2.9)
    .to(['.hero__chip','.hero__badge'],{scale:1,rotate:0,duration:1.1,stagger:.12,ease:'back.out(1.6)'},3.3)
    .to(['.hero__top','.hero__foot','.nav'],{autoAlpha:1,duration:1},3.4)
    .add(()=>{ lenis && lenis.start(); },3.2);

  const mm=gsap.matchMedia();

  // ---------- hero scroll: image expands, type separates ----------
  const heroTl=gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'+=130%',scrub:true,pin:true,anticipatePin:1}});
  heroTl.to('.hero__media',{width:'100vw',height:'100vh',borderRadius:0,ease:'none'},0)
    .to('.hero__media img',{scale:1,ease:'none'},0)
    .to('.hero__shade',{opacity:1,ease:'none'},0)
    .to('.hero__back',{yPercent:-120,scale:.85,opacity:0,ease:'none'},0)
    .to('.hero__front .w1',{xPercent:-38,ease:'none'},0)
    .to('.hero__front .w2',{xPercent:38,ease:'none'},0)
    .to('.hero__front',{yPercent:-60,scale:1.2,ease:'none'},0)
    .to('.hero__chip',{y:-260,x:-120,rotate:-18,opacity:0,ease:'none'},0)
    .to('.hero__badge',{y:-200,x:140,rotate:90,opacity:0,ease:'none'},0)
    .to(['.hero__foot','.hero__top'],{opacity:0,ease:'none',duration:.3},0);

  // ---------- marquee: scroll-velocity driven ----------
  $$('.marquee__track').forEach(tr=>{
    tr.innerHTML += tr.innerHTML + tr.innerHTML;
    const dir=+tr.dataset.dir; let x=0, w=0; const measure=()=> w=tr.scrollWidth/3; measure(); addEventListener('resize',measure);
    let vel=0;
    ScrollTrigger.create({start:0,end:'max',onUpdate:s=>{vel=s.getVelocity()/200}});
    gsap.ticker.add(()=>{ vel*=.92; x+= dir*(1+Math.abs(vel))*0.9; if(x<-w) x+=w; if(x>0) x-=w; gsap.set(tr,{x}); });
  });
  gsap.fromTo('.marquee',{rotate:-6},{rotate:-1,ease:'none',scrollTrigger:{trigger:'.marquee',start:'top bottom',end:'bottom top',scrub:true}});

  // ---------- manifesto: word-by-word fill ----------
  (function(){
    const p=$('#manifesto');
    const walk=node=>{[...node.childNodes].forEach(n=>{
      if(n.nodeType===3){const f=document.createDocumentFragment();n.textContent.split(/\s+/).filter(Boolean).forEach(t=>{const s=document.createElement('span');s.className='mw';s.textContent=t;f.appendChild(s)});n.replaceWith(f);}
      else if(n.nodeType===1 && n.classList.contains('gold')){ n.classList.add('mw'); }
      else if(n.nodeType===1 && n.classList.contains('pill')){ n.classList.add('mw'); }
    })};
    walk(p);
    gsap.to($$('.mw',p),{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:p,start:'top 78%',end:'bottom 45%',scrub:true}});
    $$('.pill',p).forEach(pl=>gsap.from(pl,{width:0,ease:'none',scrollTrigger:{trigger:pl,start:'top 85%',end:'top 55%',scrub:true}}));
  })();

  // ---------- generic split heading reveals ----------
  $$('.split').filter(el=>!el.closest('.hero')).forEach(el=>{
    gsap.from($$('.c',el),{yPercent:115,rotate:6,duration:1.1,ease:'expo.out',stagger:.022,scrollTrigger:{trigger:el,start:'top 85%'}});
  });

  // ---------- facilities: section curtain + horizontal scroll + 3D perspective ----------
  gsap.fromTo('.fac',{clipPath:'inset(8% 5% 0% 5% round 48px)'},{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'none',scrollTrigger:{trigger:'.fac',start:'top bottom',end:'top top',scrub:true}});
  mm.add('(min-width: 0px)',()=>{
    const track=$('.fac__track'), cards=$$('.fcard'), cur=$('.fac__cur');
    const dist=()=>track.scrollWidth-innerWidth;
    const apply=()=>{
      const cx=innerWidth/2; let best=0,bd=1e9;
      cards.forEach((c,i)=>{
        const r=c.getBoundingClientRect(); const off=(r.left+r.width/2-cx)/innerWidth;
        const ry=gsap.utils.clamp(-38,38,-off*55); const z=-Math.abs(off)*260;
        gsap.set(c,{rotateY:ry,z,transformPerspective:1600});
        gsap.set(c.querySelector('img'),{xPercent:-off*12});
        if(Math.abs(off)<bd){bd=Math.abs(off);best=i}
      });
      cur.textContent=String(best+1).padStart(2,'0');
    };
    const t=gsap.to(track,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:'.fac__pin',start:'top top',end:()=>'+='+dist(),pin:true,scrub:.6,invalidateOnRefresh:true,onUpdate:s=>{apply();gsap.set('.fac__bar i',{scaleX:s.progress})}}});
    apply();
    return ()=>t.kill();
  });

  // ---------- recovery: circular reveal + list ----------
  (function(){
    const items=$$('.rz__list li');
    const tl=gsap.timeline({scrollTrigger:{trigger:'.rz',start:'top top',end:'bottom bottom',scrub:true,
      onUpdate:s=>{const k=Math.min(items.length-1,Math.floor(gsap.utils.mapRange(.35,1,0,items.length,s.progress)));items.forEach((li,i)=>li.classList.toggle('on',s.progress>.35&&i<=k))}}});
    tl.to('.rz__media',{clipPath:'circle(80% at 50% 50%)',ease:'none',duration:.45},0)
      .to('.rz__media img',{scale:1,ease:'none',duration:.6},0)
      .fromTo('.rz__title',{scale:.7},{scale:1.08,ease:'none',duration:.45},0)
      .to('.rz__title',{yPercent:-40,opacity:.0,ease:'none',duration:.25},.55)
      .from('.rz__note',{y:40,opacity:0,duration:.15},.5);
  })();

  // ---------- stats: perspective tilt + counters ----------
  gsap.fromTo('.stats__grid',{rotateX:55,y:120,opacity:.2},{rotateX:0,y:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.stats__grid',start:'top bottom',end:'top 45%',scrub:true}});
  $$('[data-count]').forEach(el=>{
    const end=+el.dataset.count, start= end>1000 ? 1990 : 0, o={v:start};
    el.textContent=start;
    gsap.to(o,{v:end,duration:end>1000?1.6:1.4,ease:'power3.out',onUpdate:()=>el.textContent=Math.round(o.v),scrollTrigger:{trigger:el,start:'top 80%'}});
  });

  // ---------- plans: 3D flip-up ----------
  gsap.fromTo('.plan',{rotateX:-70,y:160,opacity:0},{rotateX:0,y:0,opacity:1,stagger:.12,ease:'power2.out',scrollTrigger:{trigger:'.plans__grid',start:'top 95%',end:'top 40%',scrub:true}});

  // ---------- clubs: cursor-follow preview ----------
  (function(){
    const pv=$('.preview'), imgs=$$('img',pv);
    if(!matchMedia('(hover:hover)').matches) return;
    const xTo=gsap.quickTo(pv,'x',{duration:.6,ease:'power3'}), yTo=gsap.quickTo(pv,'y',{duration:.6,ease:'power3'});
    let lx=0;
    addEventListener('mousemove',e=>{xTo(e.clientX-150);yTo(e.clientY-190);const dx=e.clientX-lx;lx=e.clientX;gsap.to(pv,{rotate:gsap.utils.clamp(-14,14,dx*.6),duration:.6})});
    $$('.club').forEach(c=>{
      c.addEventListener('mouseenter',()=>{imgs.forEach((im,i)=>im.classList.toggle('on',i==c.dataset.img));gsap.to(pv,{opacity:1,scale:1,duration:.5,ease:'expo.out'})});
      c.addEventListener('mouseleave',()=>gsap.to(pv,{opacity:0,scale:.6,duration:.4}));
    });
  })();
  gsap.from('.club',{yPercent:60,opacity:0,stagger:.12,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:'.club-list',start:'top 80%'}});
  gsap.from('.hours > div',{y:60,opacity:0,stagger:.08,duration:1,ease:'expo.out',scrollTrigger:{trigger:'.hours',start:'top 85%'}});

  // ---------- app: phone in 3D ----------
  gsap.fromTo('.phone',{rotateY:-38,rotateX:18,rotateZ:-8,y:180},{rotateY:-12,rotateX:6,rotateZ:4,y:-40,ease:'none',scrollTrigger:{trigger:'.app',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.fromTo('.fc1',{y:120},{y:-120,ease:'none',scrollTrigger:{trigger:'.app',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.fromTo('.fc2',{y:-60},{y:160,ease:'none',scrollTrigger:{trigger:'.app',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.from('.app__feats li',{x:-60,opacity:0,stagger:.08,duration:1,ease:'expo.out',scrollTrigger:{trigger:'.app__feats',start:'top 85%'}});

  // ---------- family: parallax superimposed images ----------
  $$('.family [data-speed]').forEach(im=>{
    gsap.fromTo(im,{yPercent:-(+im.dataset.speed)},{yPercent:+im.dataset.speed,ease:'none',scrollTrigger:{trigger:'.family',start:'top bottom',end:'bottom top',scrub:true}});
  });
  gsap.fromTo('.family__imgs .m2',{y:120},{y:-60,ease:'none',scrollTrigger:{trigger:'.family',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.fromTo('.family__year',{xPercent:-30,opacity:0},{xPercent:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.family__imgs',start:'top 80%',end:'center 50%',scrub:true}});

  // ---------- CTA: window opens to full bleed ----------
  (function(){
    const tl=gsap.timeline({scrollTrigger:{trigger:'.cta',start:'top top',end:'bottom bottom',scrub:true}});
    tl.to('.cta__bg',{clipPath:'inset(0% 0% round 0px)',ease:'none',duration:.6},0)
      .to('.cta__bg img',{scale:1,ease:'none',duration:.8},0)
      .fromTo('.cta__title .row:first-child',{xPercent:-40},{xPercent:0,ease:'none',duration:.6},0)
      .fromTo('.cta__title .row:last-child',{xPercent:40},{xPercent:0,ease:'none',duration:.6},0)
      .from(['.cta__sub','.cta__btns'],{y:40,opacity:0,stagger:.1,duration:.25},.45);
  })();

  // ---------- footer giant wordmark ----------
  gsap.from('.footer__giant span',{yPercent:100,stagger:.06,ease:'none',scrollTrigger:{trigger:'.footer',start:'top 70%',end:'bottom bottom',scrub:true}});

  // ---------- theme transitions between sections ----------
  const setTheme = t => { document.body.classList.remove('t-dark','t-light','t-gold'); document.body.classList.add('t-'+t); };
  $$('[data-theme]').forEach(sec=>{
    ScrollTrigger.create({trigger:sec,start:'top 50%',end:'bottom 50%',onToggle:s=>{ if(s.isActive) setTheme(sec.dataset.theme) }});
  });

  ScrollTrigger.refresh();
  addEventListener('load',()=>ScrollTrigger.refresh());
})();
