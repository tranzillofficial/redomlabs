'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {defaultContact,normalizeContact,type ContactSettings} from '../lib/contact-settings';
import {SocialLinks} from './SocialLinks';
export function FooterContact({ar}:{ar:boolean}){
 const [contact,setContact]=useState<ContactSettings>(defaultContact);
 useEffect(()=>{const controller=new AbortController();fetch('/api/contact-details',{cache:'no-store',signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(r=>{if(!controller.signal.aborted)setContact(normalizeContact(r))}).catch(()=>{});return ()=>controller.abort()},[]);
 return <div className="footer-contact"><SocialLinks links={contact.social_links} ar={ar}/>{contact.phone&&<a dir="ltr" className="footer-phone" href={`tel:${contact.phone.replace(/[^+0-9]/g,'')}`}>{contact.phone}</a>}<Link className="footer-contact-link" href={`/${ar?'ar':'en'}/contact`}>{ar?'تواصل معنا':'Contact us'} ↗</Link></div>;
}
