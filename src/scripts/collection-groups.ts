function initMergedCards(){
 document.querySelectorAll<HTMLElement>('[data-season-card]').forEach(card=>{
  if(card.dataset.ready)return;card.dataset.ready='true';
  const panes=Array.from(card.querySelectorAll<HTMLElement>('[data-pane]'));
  const tabs=Array.from(card.querySelectorAll<HTMLButtonElement>('[data-season]'));
  let index=0;let available=panes.map((_,i)=>i);let touchX:number|null=null;let touchY=0;let suppressClickUntil=0;
  const show=(next:number)=>{
   if(!available.includes(next))return;
   index=next;card.style.setProperty('--season-index',String(index));
   panes.forEach((pane,i)=>{pane.inert=i!==index;pane.setAttribute('aria-hidden',String(i!==index));if(i!==index){pane.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(details=>details.open=false);pane.querySelectorAll<HTMLInputElement>('.card-info-toggle input').forEach(input=>input.checked=false);}});
   tabs.forEach((tab,i)=>tab.setAttribute('aria-pressed',String(i===index)));
   card.dataset.status=panes[index].dataset.status;
   const badge=card.querySelector<HTMLElement>('[data-season-badge]');
   if(badge){badge.textContent=`${index+1} / ${panes.length}`;badge.setAttribute('aria-label',`当前第${index+1}项，共${panes.length}项`);}
   const live=card.querySelector('[data-season-live]');if(live)live.textContent=panes[index].querySelector('h2')?.textContent??'';
  };
  const step=(direction:number)=>{if(available.length)show(available[(available.indexOf(index)+direction+available.length)%available.length]);};
  tabs.forEach((tab,i)=>tab.addEventListener('click',()=>show(i)));
  card.querySelectorAll<HTMLButtonElement>('[data-step]').forEach(button=>button.addEventListener('click',()=>step(Number(button.dataset.step))));
  card.addEventListener('keydown',event=>{if(event.target instanceof Element&&event.target.closest('summary,details'))return;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();step(event.key==='ArrowLeft'?-1:1);}});
  card.addEventListener('collection:filter',event=>{
   available=(event as CustomEvent<number[]>).detail;
   tabs.forEach((tab,i)=>tab.disabled=!available.includes(i));
   card.querySelectorAll<HTMLButtonElement>('[data-step]').forEach(button=>button.disabled=available.length<2);
   if(available.length&&!available.includes(index))show(available[0]);
  });
  card.addEventListener('touchstart',event=>{touchX=event.touches[0].clientX;touchY=event.touches[0].clientY;},{passive:true});
  card.addEventListener('touchend',event=>{if(touchX!==null){const delta=event.changedTouches[0].clientX-touchX;const vertical=event.changedTouches[0].clientY-touchY;if(Math.abs(delta)>45&&Math.abs(delta)>Math.abs(vertical)){step(delta<0?1:-1);suppressClickUntil=Date.now()+400;}touchX=null;}},{passive:true});
  card.addEventListener('touchcancel',()=>{touchX=null;},{passive:true});
  card.addEventListener('click',event=>{if(Date.now()<suppressClickUntil){event.preventDefault();event.stopPropagation();}},true);
 });
}
initMergedCards();
document.addEventListener('astro:page-load',initMergedCards);
document.addEventListener('swup:contentReplaced',initMergedCards);
