import {matchesCollection} from '../../scripts/collection-groups.mjs';
function filterShelf(root:Element){
  const query=(root.querySelector<HTMLInputElement>('[data-collection-search]')?.value??'').toLowerCase().trim();
  const status=root.querySelector<HTMLElement>('[data-filter][aria-pressed="true"]')?.dataset.filter??'';
  let visible=0;
  root.querySelectorAll<HTMLElement>('[data-entry]').forEach(card=>{
   const panes=Array.from(card.querySelectorAll<HTMLElement>('[data-pane]'));
   if(panes.length){
    const matches=panes.map((pane,index)=>matchesCollection(pane.dataset.search??'',pane.dataset.status??'',query,status)?index:-1).filter(index=>index>=0);
    card.hidden=!matches.length;card.dispatchEvent(new CustomEvent('collection:filter',{detail:matches}));
   }else card.hidden=!matchesCollection(card.dataset.search??'',card.dataset.status??'',query,status);
   if(!card.hidden)visible++;
  });
  const empty=root.querySelector<HTMLElement>('[data-no-results]');if(empty)empty.hidden=visible>0;
 }
 // Delegated handlers work after Shirone replaces content with Swup.
 document.addEventListener('input',event=>{const input=event.target;if(input instanceof HTMLInputElement&&input.matches('[data-collection-search]')){const root=input.closest('[data-collection]');if(root)filterShelf(root);}});
 document.addEventListener('click',event=>{const target=event.target;if(!(target instanceof Element))return;const button=target.closest<HTMLElement>('[data-filter]');const root=button?.closest('[data-collection]');if(!button||!root)return;root.querySelectorAll('[data-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));filterShelf(root);});
