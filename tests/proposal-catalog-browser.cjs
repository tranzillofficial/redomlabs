const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{
 const {spawn}=require('node:child_process');
 const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3103';
 const server=process.env.TEST_BASE_URL?null:spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3103'],{stdio:['ignore','pipe','pipe']});
 if(server){server.stderr.on('data',x=>process.stderr.write(x));for(let i=0;i<60;i++){try{if((await fetch(base+'/proposal/munaya',{signal:AbortSignal.timeout(1000)})).ok)break}catch{}await new Promise(r=>setTimeout(r,250))}}
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE,args:['--no-sandbox']});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',msg=>{if(msg.type()==='log')console.log(msg.text())});
 await page.goto(base+'/proposal/munaya');assert.equal(await page.locator('.general-proposal').count(),0);
 await page.locator('#proposal-password').fill(process.env.TEST_PROPOSAL_PASSCODE);await page.getByRole('button',{name:'استعرض العرض',exact:true}).click();await page.locator('.general-proposal').waitFor();
 assert.equal(await page.locator('.service-select input').count(),11);
 assert.equal(await page.locator('.highlight-price').count(),0);
 const total=type=>page.locator(`[data-total=${type}]`);
 assert.ok((await total('once').innerText()).includes('٠'));assert.ok((await total('annual').innerText()).includes('٠'));
 const request=page.getByRole('button',{name:'اطلب عرض مخصص',exact:true});assert.equal(await request.isDisabled(),true);
 const card=name=>page.locator('article.general-service').filter({has:page.getByRole('heading',{name,exact:true})});
 const website=card('ويب سايت خاص');await website.locator('input').check();assert.ok((await total('once').innerText()).includes('٥٬٠٠٠'));assert.equal(await request.isDisabled(),false);
 await page.getByRole('button',{name:'متجر إلكتروني',exact:true}).click();assert.ok((await total('once').innerText()).includes('٦٬٠٠٠'));assert.ok((await website.innerText()).includes('كتالوج المنتجات'));
 await page.getByRole('button',{name:'شركة',exact:true}).click();assert.ok((await total('once').innerText()).includes('٤٬٥٠٠'));
 await page.getByRole('button',{name:'مطعم / كافيه',exact:true}).click();
 await card('سيستم كاشير').locator('input').check();assert.ok((await total('once').innerText()).includes('٦٬٥٠٠'));assert.ok((await total('monthly').innerText()).includes('١٠٠'));assert.ok((await total('annual').innerText()).includes('٠'));
 await card('دومين واستضافة باسم البراند').locator('input').check();assert.ok((await total('annual').innerText()).includes('٣٬٢٠٠'));assert.ok((await total('once').innerText()).includes('٦٬٥٠٠'));
 await card('التسويق والسوشيال ميديا').locator('input').check();assert.ok((await total('monthly').innerText()).includes('١٬٣٠٠'));assert.ok((await total('annual').innerText()).includes('٣٬٢٠٠'));
 await card('التسويق والسوشيال ميديا').locator('input').uncheck();
 await request.click();assert.equal(await page.locator('dialog').evaluate(d=>d.open),true);assert.equal(await page.locator('input[type=tel]').getAttribute('required'),'');assert.equal(await page.locator('textarea').getAttribute('required'),null);
 await page.locator('input[type=tel]').fill('01012345678');assert.equal(await page.locator('input[type=tel]').evaluate(i=>i.checkValidity()),true);
 await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').evaluate(d=>d.open),false);
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'/tmp/redom-proposal-ar-desktop.png',fullPage:true});
 await page.getByRole('button',{name:'English',exact:true}).click();assert.equal(await page.locator('html').getAttribute('dir'),'ltr');assert.ok((await total('once').innerText()).includes('6,500'));
 assert.ok((await card('Marketing & social media').locator('a').getAttribute('href')).includes('/en/services#marketing-packages'));
 for(const width of [320,390,768]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>{const bad=[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1||e.getBoundingClientRect().left< -1).map(e=>[e.tagName,e.className,e.getBoundingClientRect().width]);if(document.documentElement.scrollWidth>innerWidth)console.log(JSON.stringify(bad));return document.documentElement.scrollWidth<=innerWidth}),'overflow '+width);await page.screenshot({path:`/tmp/redom-proposal-mobile-${width}.png`,fullPage:true});await page.getByRole('button',{name:'Request a custom quote',exact:true}).click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'dialog overflow '+width);await page.keyboard.press('Escape');}
 await page.getByRole('button',{name:'العربية',exact:true}).click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/tmp/redom-proposal-ar-mobile.png',fullPage:true});
 await page.getByRole('button',{name:'إزالة دومين واستضافة باسم البراند',exact:true}).click();assert.ok((await total('annual').innerText()).includes('٠'));
 assert.deepEqual(errors,[]);
 console.log('PASS: protected gate, 11 service choices, no headline price, empty totals, per-business features/prices, independent once/annual/monthly totals, removal, phone required and notes optional, dialog/Escape, both locales, 320/390/768 mobile without overflow or browser errors.');
 }finally{await browser.close();server?.kill()}
})().catch(e=>{console.error(e);process.exit(1)});
