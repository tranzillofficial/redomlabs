'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {defaultContact,normalizeContact,safeSocialUrl,type ContactSettings} from '../lib/contact-settings';
import {ContactPeople} from './ContactPeople';
import {SocialLinks} from './SocialLinks';
export function FooterContact({ar}:{ar:boolean}){
 const [contact,setContact]=useState<ContactSettings>(defaultContact);
 useEffect(()=>{const controller=new AbortController();fetch('/api/contact-details',{cache:'no-store',signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(r=>{if(!controller.signal.aborted)setContact(normalizeContact(r))}).catch(()=>{});return ()=>controller.abort()},[]);
 return <div className="footer-contact"><SocialLinks links={contact.social_links} ar={ar}/>{!!contact.contact_people.length&&!safeSocialUrl(contact.social_links.whatsapp)&&<ContactPeople people={contact.contact_people}/>}<Link className="footer-contact-link" href={`/${ar?'ar':'en'}/contact`}>{ar?'تواصل معنا':'Contact us'} ↗</Link></div>;
}
