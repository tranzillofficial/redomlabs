import type {ContactPerson} from '../lib/contact-settings';
export function ContactPeople({people}:{people:ContactPerson[]}){
 return <div className="public-contact-people">{people.map((person,index)=><div className={`public-contact-person${person.name||person.job_title||person.email?' has-details':''}`} key={index}>
  {(person.name||person.job_title)&&<div className="public-contact-identity">{person.name&&<strong dir="auto">{person.name}</strong>}{person.job_title&&<span dir="auto">{person.job_title}</span>}</div>}
  <a dir="ltr" className="public-contact-phone" href={`tel:${person.phone.replace(/[^+0-9]/g,'')}`}>{person.phone}</a>
  {person.email&&<a dir="ltr" className="public-contact-email" href={`mailto:${person.email}`}>{person.email}</a>}
 </div>)}</div>;
}
