import {safeSocialUrl,socialPlatforms} from '../lib/contact-settings';
type Platform=(typeof socialPlatforms)[number][0];
function SocialIcon({platform}:{platform:Platform}){
 const paths:Record<Platform,React.ReactNode>={
 facebook:<path d="M14 22v-9h3l.5-4H14V7c0-1.2.4-2 2-2h2V1.4C17.2 1.1 16.1 1 15 1c-3 0-5 1.9-5 5v3H7v4h3v9z"/>,
 instagram:<><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.3"/></>,
 linkedin:<><rect x="3" y="8" width="4" height="13"/><circle cx="5" cy="4.5" r="2"/><path d="M10 8h4v2c1-1.6 2.2-2.3 4-2.3 3 0 4 2 4 5V21h-4v-7.5c0-1.8-.5-2.8-2-2.8s-2 1.1-2 2.8V21h-4z"/></>,
 whatsapp:<><path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" d="M20.5 12a8.5 8.5 0 0 1-12.7 7.4L3 21l1.6-4.8A8.5 8.5 0 1 1 20.5 12Z"/><path d="M8 7c-.5 0-1.4.9-1.4 2.1 0 2.7 4.3 6.7 7.2 7 .9.1 2.2-.8 2.5-1.8.1-.4 0-.6-.3-.8l-2-1c-.3-.1-.5-.1-.7.2l-.8 1c-.2.2-.4.2-.7.1-1.3-.6-2.6-1.7-3.2-2.9-.2-.3-.1-.5.1-.7l.6-.8c.2-.2.2-.4.1-.7l-.9-1.9c-.1-.4-.3-.8-.5-.8Z"/></>,
 x:<path d="M3 3h5l5.2 7L19 3h2l-6.8 8.5L22 21h-5l-5.8-7.7L5 21H3l7-8.9zm3.5 1.5 11.3 15h1.7l-11.3-15z"/>,
 youtube:<><path d="M22 7c-.2-1.4-1-2.1-2.4-2.3C17.8 4.4 14 4.3 12 4.3s-5.8.1-7.6.4C3 4.9 2.2 5.6 2 7c-.3 1.5-.4 3.3-.4 5s.1 3.5.4 5c.2 1.4 1 2.1 2.4 2.3 1.8.3 5.6.4 7.6.4s5.8-.1 7.6-.4c1.4-.2 2.2-.9 2.4-2.3.3-1.5.4-3.3.4-5s-.1-3.5-.4-5Z"/><path fill="var(--bg)" d="m10 8 6 4-6 4z"/></>,
 tiktok:<path d="M14 2h4c.2 2.7 1.7 4.3 4 4.7v4c-1.7 0-3.1-.5-4-1.3V16a6 6 0 1 1-6-6v4a2 2 0 1 0 2 2z"/>,
 github:<path d="M12 2a10 10 0 0 0-3.2 19.5v-2.2c-2.7.6-3.3-1.2-3.3-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.7-1.4-2.2-.2-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .9-.3 2.8 1a9.5 9.5 0 0 1 5.1 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.7-4.5 4.9.4.3.7.9.7 1.8v3.2A10 10 0 0 0 12 2Z"/>,
 };
 return <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor" aria-hidden="true" focusable="false">{paths[platform]}</svg>;
}
export function SocialLinks({links,ar}:{links?:Record<string,string>;ar:boolean}){
 const visible=socialPlatforms.flatMap(([key,label])=>{const href=safeSocialUrl(links?.[key]);return href?[{key,label,href}]:[]});
 if(!visible.length)return null;
 return <nav className="contact-social-links" aria-label={ar?'صفحات السوشيال ميديا':'Social media pages'}>{visible.map(({key,label,href})=><a className={`social-icon social-${key}`} key={key} href={href} target="_blank" rel="noopener noreferrer" title={label} aria-label={label+(ar?' (يفتح في نافذة جديدة)':' (opens in a new tab)')}><SocialIcon platform={key}/><span className="sr-only">{label}</span><span className="sr-only">{ar?' (يفتح في نافذة جديدة)':' (opens in a new tab)'}</span></a>)}</nav>;
}
