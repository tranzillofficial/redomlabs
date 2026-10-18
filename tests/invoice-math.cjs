const ts=require('typescript'),vm=require('vm'),fs=require('fs'),assert=require('assert/strict');
const loaded={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/invoice-math.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports:loaded});
assert.equal(loaded.invoiceNet(.3,.1),.2);assert.equal(loaded.invoiceRemaining(.3,.1,.2),0);assert.equal(loaded.invoiceRemaining(1000.33,.1,.23),1000);assert.equal(loaded.invoiceNet(100,100),0);assert.equal(loaded.invoiceRemaining(100,0,110),-10);
console.log('PASS decimal previews, zero balance, full discount and overpayment preview');
