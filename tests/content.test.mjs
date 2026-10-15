import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateEntry,validateSite,validateUrl} from '../scripts/content-validation.mjs';

const valid={id:'test-item',title:'验证条目',date:'2026-10-16',status:'常听'};
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
test('CMS covers exactly the editable site keys and separates four collections',()=>{
  const config=JSON.parse(fs.readFileSync(new URL('../.pages.yml',import.meta.url),'utf8'));
  const settings=JSON.parse(fs.readFileSync(new URL('../content/site.json',import.meta.url),'utf8'));
  assert.deepEqual(config.content.filter(entry=>entry.type==='collection').map(entry=>entry.name),['music','movies','games','works']);
  assert.deepEqual(config.content.find(entry=>entry.name==='site').fields.map(field=>field.name).sort(),Object.keys(settings).sort());
  assert.equal(config.media.input,'public/uploads');assert.equal(config.media.output,'/uploads');
});
