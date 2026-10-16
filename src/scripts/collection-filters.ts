function filterShelf(root:Element){
  const query=(root.querySelector<HTMLInputElement>('[data-collection-search]')?.value??'').toLowerCase().trim();
  const status=root.querySelector<HTMLElement>('[data-filter][aria-pressed="true"]')?.dataset.filter??'';
  let visible=0;
  root.querySelectorAll<HTMLElement>('[data-entry]').forEach(card=>{card.hidden=Boolean((status&&card.dataset.status!==status)||(query&&!card.dataset.search?.includes(query)));if(!card.hidden)visible++;});
  const empty=root.querySelector<HTMLElement>('[data-no-results]');if(empty)empty.hidden=visible>0;
 }
 // Delegated handlers work after Shirone replaces content with Swup.
 document.addEventListener('input',event=>{const input=event.target;if(input instanceof HTMLInputElement&&input.matches('[data-collection-search]')){const root=input.closest('[data-collection]');if(root)filterShelf(root);}});
 document.addEventListener('click',event=>{const target=event.target;if(!(target instanceof Element))return;const button=target.closest<HTMLElement>('[data-filter]');const root=button?.closest('[data-collection]');if(!button||!root)return;root.querySelectorAll('[data-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));filterShelf(root);});
