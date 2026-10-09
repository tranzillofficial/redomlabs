import '@fontsource/tajawal/400.css';
import '@fontsource/tajawal/500.css';
import '@fontsource/tajawal/700.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '../../../globals.css';
import '../admin.css';
export const metadata={title:'Redom Labs | Administration',robots:{index:false,follow:false}};
export default async function Layout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;return <html lang={locale==='en'?'en':'ar'} dir={locale==='en'?'ltr':'rtl'}><body className="admin-body">{children}</body></html>}
