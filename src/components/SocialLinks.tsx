import {safeSocialUrl,socialPlatforms} from '../lib/contact-settings';
export function SocialLinks({links,ar}:{links?:Record<string,string>;ar:boolean}){
 const visible=socialPlatforms.flatMap(([key,label])=>{const href=safeSocialUrl(links?.[key]);return href?[{key,label,href}]:[]});
 if(!visible.length)return null;
 return <nav className="contact-social-links" aria-label={ar?'صفحات السوشيال ميديا':'Social media pages'}>{visible.map(({key,label,href})=><a key={key} href={href} target="_blank" rel="noopener noreferrer">{label}<span aria-hidden="true">↗</span><span className="sr-only">{ar?' (يفتح في نافذة جديدة)':' (opens in a new tab)'}</span></a>)}</nav>;
}
