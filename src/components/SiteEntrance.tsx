'use client';
import {useEffect,useState} from 'react';
import {Brand} from './Brand';

// Replay on a new document or refresh, but not internal navigation.
let entrancePlayed=false;
const ENTRANCE_MS=1500;

export function SiteEntrance({children}:{children:React.ReactNode}){
 const [active,setActive]=useState(()=>!entrancePlayed);
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  setReady(true);
  if(!active)return;
  entrancePlayed=true;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(motion.matches){setActive(false);return}
  const previousOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const finish=()=>setActive(false);
  const timer=window.setTimeout(finish,ENTRANCE_MS);
  motion.addEventListener('change',finish);
  return ()=>{
   window.clearTimeout(timer);
   motion.removeEventListener('change',finish);
   document.body.style.overflow=previousOverflow;
  };
 },[active]);
 return <>
  {active&&<div className={`site-splash-screen ${ready?'splash-running':''}`} aria-hidden="true"><div className="splash-logo"><Brand/></div></div>}
  <div className={active?'site-content entrance-waiting':'site-content'} inert={active&&ready}>{children}</div>
  <noscript><style>{'.site-splash-screen{display:none!important}.entrance-waiting{visibility:visible!important}'}</style></noscript>
 </>;
}
