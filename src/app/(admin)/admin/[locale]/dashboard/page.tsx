import {notFound,redirect} from 'next/navigation';
import {currentAccess} from '../../../../../lib/admin-auth';
import {AdminDashboard} from '../../../../../components/AdminDashboard';
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(locale!=='ar'&&locale!=='en')notFound();const access=await currentAccess();if(!access)redirect(`/admin/${locale}/login`);return <AdminDashboard ar={locale==='ar'} access={access}/>}
