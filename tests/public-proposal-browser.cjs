const {chromium}=require('playwright'),assert=require('node:assert/strict'),{spawn}=require('node:child_process');
(async()=>{
 const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3104',server=process.env.TEST_BASE_URL?null:spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3104'],{stdio:'ignore'});
 if(server)for(let i=0;i<80;i++){try{if((await fetch(base+'/proposal/general')).ok)break}catch{}await new Promise(r=>setTimeout(r,250))}
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE,args:['--no-sandbox']});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/proposal/general');assert.equal(await page.locator('#proposal-password').count(),0);assert.equal(await page.locator('.client-badge').count(),0);assert.equal(await page.locator('.service-select input').count(),13);
 const last=page.locator('.general-body>section').last();assert.equal(await last.getAttribute('class'),'executed-services');const headings=await last.locator('article h2').allTextContents();assert.equal(headings.length,3);assert.ok(headings[0].includes('MenuzQR'));assert.ok(headings[1].includes('Genaan'));assert.ok(headings[2].includes('النوتة'));
 assert.equal(await page.locator('.executed-services input:checked').count(),0);
 const card=name=>page.locator('article.general-service').filter({has:page.getByRole('heading',{name,exact:true})});
 await card('النوتة — العملاء والفواتير والتحصيل').locator('input').check();assert.ok((await page.locator('[data-total=once]').innerText()).includes('١٬٠٠٠'));
 await card('تطبيقات سطح المكتب والأدوات الداخلية').locator('input').check();assert.ok((await page.locator('.selection-totals').innerText()).includes('بعض الخدمات'));
 await page.getByRole('button',{name:'اطلب عرض مخصص',exact:true}).click();assert.equal(await page.locator('dialog').evaluate(d=>d.open),true);assert.equal(await page.locator('input[type=tel]').getAttribute('required'),'');await page.keyboard.press('Escape');
 await page.screenshot({path:'/tmp/redom-general-desktop.png',fullPage:true});
 await page.getByRole('button',{name:'English',exact:true}).click();assert.equal(await page.locator('html').getAttribute('dir'),'ltr');assert.equal(await page.getByRole('heading',{name:'Services developed by Redom Labs'}).count(),1);
 for(const width of [320,390,768]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);}
 await page.setViewportSize({width:390,height:900});await page.getByRole('button',{name:'العربية',exact:true}).click();await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'/tmp/redom-general-mobile.png',fullPage:true});
 await page.goto(base+'/proposal/munaya');assert.equal(await page.locator('#proposal-password').count(),1);assert.equal(await page.locator('.general-proposal').count(),0);assert.deepEqual(errors,[]);
 console.log('PASS: public access without password/client identity, 13 services, technology-first grouping, final MenuzQR/Genaan/ElNota group, scoped pricing, selections/totals, contact dialog, AR/EN and 320/390/768 mobile; private MUNAYA remains protected.');
 }finally{await browser.close();server?.kill()}
})().catch(e=>{console.error(e);process.exit(1)});
