import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateEntry,validateSite,validateUrl} from '../scripts/content-validation.mjs';
import {newestFirst} from '../scripts/collection-order.mjs';

const valid={id:'test-item',title:'验证条目',date:'2026-10-16',status:'常听'};
test('Songs can be saved without a listening status after removing the classification',()=>{
  for(const status of [undefined,null,'']) assert.doesNotThrow(()=>validateEntry({...valid,status},'music','fixture'));
  const config=JSON.parse(fs.readFileSync(new URL('../.pages.yml',import.meta.url),'utf8'));
  assert.ok(!config.content.find(item=>item.name==='music').fields.some(field=>field.name==='status'));
});
test('accepts CMS entries with empty optional fields and true/false visibility',()=>{
  assert.doesNotThrow(()=>validateEntry({...valid,cover:null,url:'',note:null,tags:[],draft:true},'music','fixture'));
});
test('rejects missing titles, invalid dates and status values from another shelf',()=>{
  for(const change of [{title:''},{date:'2026-02-30'},{date:'bad'},{status:'已通关'},{draft:'false'},{tags:'音乐'}]) assert.throws(()=>validateEntry({...valid,...change},'music','fixture'));
});
test('validates film, game and design schemas',()=>{
  for(const [kind,status] of [['movies','已看'],['games','在玩'],['works',undefined]]) assert.doesNotThrow(()=>validateEntry({...valid,status},kind,'fixture'));
});
test('rejects executable URLs, protocol-relative URLs and path traversal',()=>{
  for(const url of ['javascript:alert(1)','data:text/html,test','//example.com/a.png','/../secret','/a\\b','https://user:password@example.com']) assert.throws(()=>validateUrl(url,'fixture',true));
  for(const url of ['/uploads/封面.webp','https://example.com/a?q=test']) assert.doesNotThrow(()=>validateUrl(url,'fixture',true));
});
test('site configuration accepts defaults and rejects broken required fields or hue',()=>{
  const settings=JSON.parse(fs.readFileSync(new URL('../content/site.json',import.meta.url),'utf8'));
  assert.doesNotThrow(()=>validateSite(settings));
  for(const change of [{title:''},{themeHue:361},{themeHue:'315'},{avatar:''},{githubUrl:'https://example.com'}]) assert.throws(()=>validateSite({...settings,...change}));
});
test('CMS covers saved settings and requires only mandatory fields',()=>{
  const config=JSON.parse(fs.readFileSync(new URL('../.pages.yml',import.meta.url),'utf8'));
  const settings=JSON.parse(fs.readFileSync(new URL('../content/site.json',import.meta.url),'utf8'));
  assert.deepEqual(config.content.filter(entry=>entry.type==='collection').map(entry=>entry.name),['music','artists','movies','series','games','works']);
  const fields=config.content.find(entry=>entry.name==='site').fields;
  const editable=new Set(fields.map(field=>field.name));
  for(const key of Object.keys(settings)) assert.ok(editable.has(key),`No editor field for ${key}`);
  for(const field of fields.filter(field=>field.required)) assert.ok(Object.hasOwn(settings,field.name),`Missing required field ${field.name}`);
  const withoutOptional={...settings};
  for(const field of fields.filter(field=>!field.required)) delete withoutOptional[field.name];
  assert.doesNotThrow(()=>validateSite(withoutOptional));
  assert.equal(config.media.input,'public/uploads');assert.equal(config.media.output,'/uploads');
});
test('artists support empty optional fields, photo walls and custom official links',()=>{
  const artist={id:'artist',title:'Test artist',date:'2026-10-16'};
  for(const fields of [{},{artistType:'Solo',photos:[]},{artistType:'Band',photos:['/uploads/photo.webp','https://example.com/live.jpg'],url:'https://example.com/artist'},{artistType:null,photos:null,url:''}]) assert.doesNotThrow(()=>validateEntry({...artist,...fields},'artists','fixture'));
  for(const fields of [{photos:'photo.webp'},{photos:[null]},{photos:['javascript:alert(1)']},{photos:['/../secret']},{artistType:'other'},{url:'javascript:alert(1)'}]) assert.throws(()=>validateEntry({...artist,...fields},'artists','fixture'));
});
test('series has its own shelf and uses viewing statuses',()=>{
  assert.doesNotThrow(()=>validateEntry({...valid,status:'在看'},'series','fixture'));
  assert.throws(()=>validateEntry({...valid,status:'已通关'},'series','fixture'));
});
test('collection dates determine newest-first order with a stable same-day tie break',()=>{
  const entries=[{id:'old',date:'2021-12-31'},{id:'b',date:'2026-01-01'},{id:'a',date:'2026-01-01'},{id:'middle',date:'2025-10-16'}];
  assert.deepEqual(entries.sort(newestFirst).map(item=>item.id),['a','b','middle','old']);
});
test('CMS offers a multi-image artist gallery and separate film and series collections',()=>{
  const config=JSON.parse(fs.readFileSync(new URL('../.pages.yml',import.meta.url),'utf8'));
  const artist=config.content.find(item=>item.name==='artists');
  assert.equal(artist.fields.find(field=>field.name==='photos').type,'image');
  assert.equal(artist.fields.find(field=>field.name==='photos').options.multiple,true);
  assert.equal(artist.fields.find(field=>field.name==='url').required,undefined);
  assert.equal(config.content.find(item=>item.name==='movies').path,'content/movies');
  assert.equal(config.content.find(item=>item.name==='series').path,'content/series');
});
test('CMS optional link validation accepts blank values but rejects unsafe schemes',()=>{
  const config=JSON.parse(fs.readFileSync(new URL('../.pages.yml',import.meta.url),'utf8'));
  for(const entry of config.content.filter(entry=>entry.type==='collection')){
    const pattern=new RegExp(entry.fields.find(field=>field.name==='url').pattern);
    assert.ok(pattern.test(''));
    assert.ok(pattern.test('https://example.com/'));
    assert.ok(!pattern.test('javascript:alert(1)'));
  }
});
