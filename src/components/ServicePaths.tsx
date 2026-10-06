import Image from 'next/image';
import { photos } from '../photos';
import Link from 'next/link';
export function ServicePaths({ar, detailed=false}:{ar:boolean;detailed?:boolean}) {
 const locale=ar?'ar':'en';
 const paths=ar?[
 ['technology','التكنولوجيا والبرمجة','من فكرة إلى منتج رقمي متكامل.',['مواقع ومنصات SaaS','تطبيقات موبايل وديسكتوب','ذكاء اصطناعي وأتمتة','تصميم واجهات وتجربة مستخدم']],
 ['marketing','التسويق الرقمي','حضور واضح يصل إلى جمهورك.',['استراتيجية وهوية العلامة','إدارة السوشيال ميديا','صناعة المحتوى','حملات إعلانية وتحسين الأداء']]
 ]:[
 ['technology','Technology & development','Turn your idea into a useful digital product.',['Websites & SaaS platforms','Mobile & desktop applications','AI & workflow automation','Interface & experience design']],
 ['marketing','Digital marketing','Build a presence that reaches your audience.',['Brand strategy & identity','Social media management','Content creation','Advertising & performance optimization']]
 ];
 return <div className="path-grid">{paths.map(([id,title,desc,items],i)=><article className="path-card" id={id as string} key={id as string}><span className="path-number" aria-hidden="true">{i === 0 ? '‹/›' : '▥'}</span><h2>{title}</h2><p>{desc}</p><ul>{(items as string[]).map(item=><li key={item}>{item}</li>)}</ul>{!detailed && <div className="service-photo" aria-hidden="true"><Image src={i === 0 ? photos.technology.src : photos.marketing.src} alt="" fill quality={90} sizes="(max-width: 760px) 90vw, 43vw" /></div>}<Link className="textlink" href={detailed?`/${locale}/contact`:`/${locale}/services#${id}`}>{ar?(detailed?'جهّز ملخص مشروعك':'اكتشف المسار'):(detailed?'Prepare your project brief':'Explore this path')} <span aria-hidden>↗</span></Link></article>)}</div>;
}
