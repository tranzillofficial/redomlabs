import '@fontsource/tajawal/400.css';
import '@fontsource/tajawal/500.css';
import '@fontsource/tajawal/700.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '../../../globals.css';
import '../admin.css';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}){const {locale}=await params;return {title:'Redom Labs | Administration',robots:{index:false,follow:false},manifest:`/admin/${locale==='en'?'en':'ar'}/manifest.webmanifest`,appleWebApp:{capable:true,title:'Redom Admin',statusBarStyle:'default'},icons:{apple:'/admin/icon-192.png'}}}
export const viewport={themeColor:'#285f49',width:'device-width',initialScale:1};
export default async function Layout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;return <html lang={locale==='en'?'en':'ar'} dir={locale==='en'?'ltr':'rtl'}><body className="admin-body">{children}</body></html>}
