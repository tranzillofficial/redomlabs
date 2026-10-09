import 'server-only';
import {contactClient} from './contact-service';
import {menuzProject,type ProjectKind,type SiteProject} from './project-types';
export async function publicProjects(kind:ProjectKind):Promise<SiteProject[]>{try{const {data,error}=await contactClient().from('site_projects').select('*').eq('kind',kind).eq('published',true).order('sort_order').order('created_at');if(error)throw error;return data||[]}catch{return kind==='product'?[menuzProject]:[]}}
