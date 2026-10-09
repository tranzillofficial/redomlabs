import Link from 'next/link';
export function AboutPage({ar}:{ar:boolean}){
 const locale=ar?'ar':'en';
 const pillars=ar?[
 ['التكنولوجيا وهندسة البرمجيات','نحوّل الأفكار إلى مواقع وتطبيقات وأنظمة SaaS، بداية من تحديد المتطلبات وتجربة المستخدم وحتى التطوير والإطلاق.'],
 ['التسويق وبناء العلامة','نربط الهوية البصرية والمحتوى والحملات بأهداف نشاطك، لتكون تجربة العملاء متناسقة في كل نقطة تواصل.'],
 ['الذكاء الاصطناعي والأتمتة','نطوّر تكاملات وأدوات داخلية تقلل المهام المتكررة، ونستكشف أفكارًا يمكن تحويلها إلى منتجات مفيدة.']
 ]:[
 ['Technology & engineering','We turn ideas into websites, applications and SaaS platforms, from requirements and user experience through development and launch.'],
 ['Marketing & brand building','We connect visual identity, content and campaigns with business goals, creating a consistent experience across customer touchpoints.'],
 ['AI & automation','We develop integrations and internal tools to reduce repetitive work and explore ideas that can become useful products.']
 ];
 const process=ar?[
 ['نفهم الهدف','نبدأ بطبيعة نشاطك والمشكلة والجمهور، ثم نحدد أولويات واضحة ونطاقًا عمليًا.'],
 ['نصمم ونبني','نحوّل المتطلبات إلى تجربة بسيطة، مع مراجعات أثناء التصميم والتطوير.'],
 ['نطلق ونتطور','نجهّز الإطلاق ونحدد احتياجات الدعم والتحسين وفق نطاق المشروع.']
 ]:[
 ['Understand the goal','We begin with your business, challenge and audience, then agree on clear priorities and practical scope.'],
 ['Design and build','We turn requirements into a simple experience, with reviews throughout design and development.'],
 ['Launch and improve','We prepare for launch and define support and improvement needs within the project scope.']
 ];
 return <><section className="section about-introduction"><h2>{ar?'شريك يجمع التقنية والإبداع.':'A partner in technology and creativity.'}</h2><div><p>{ar?'Redom Labs شركة للتكنولوجيا والتسويق الرقمي. نجمع الاستراتيجية والتصميم وهندسة البرمجيات لتقديم حلول تتناسب مع طريقة عمل كل نشاط.':'Redom Labs is a technology and digital marketing company. We bring strategy, design and software engineering together to create solutions that fit how each business works.'}</p><p>{ar?'نعمل في مسارين متكاملين: تنفيذ حلول للعملاء، وبناء منتجات خاصة بنا مثل MenuzQR. ونخصص مساحة للاستكشاف في الذكاء الاصطناعي والأتمتة وتطوير أفكار جديدة.':'We work along two connected paths: delivering solutions for clients and building our own products, such as MenuzQR. We also explore AI, automation and new product ideas.'}</p></div></section>
 <section className="section"><p className="eyebrow">{ar?'مجالات تركيزنا':'Our focus'}</p><div className="about-pillars">{pillars.map(([title,body])=><article key={title}><h3>{title}</h3><p>{body}</p></article>)}</div></section>
 <section className="section about-process"><div><p className="eyebrow">{ar?'طريقة عملنا':'How we work'}</p><h2>{ar?'وضوح في كل مرحلة.':'Clarity at every stage.'}</h2></div><ol>{process.map(([title,body])=><li key={title}><h3>{title}</h3><p>{body}</p></li>)}</ol></section>
 <section className="section about-principles"><h2>{ar?'ما يوجّه قراراتنا.':'What guides our decisions.'}</h2><div className="values">{(ar?[['بساطة مفيدة','واجهة سهلة، ومحتوى واضح، وخطوات تخدم المستخدم.'],['جودة قابلة للاستمرار','حلول يمكن صيانتها وتطويرها مع نمو المشروع.'],['تعاون وشفافية','نطاق واضح ومراجعات مشتركة وتوقعات متفق عليها.']]:[['Useful simplicity','Clear content, straightforward interfaces and steps that serve the user.'],['Lasting quality','Solutions that can be maintained and developed as the project grows.'],['Collaboration & transparency','Clear scope, shared reviews and agreed expectations.']]).map(([title,body])=><div key={title}><h3>{title}</h3><p>{body}</p></div>)}</div></section>
 <section className="service-invitation"><div><h2>{ar?'خلّينا نتعرف على مشروعك.':'Let’s learn about your project.'}</h2><p>{ar?'شاركنا احتياجك ونناقش معك البداية المناسبة.':'Share what you need and we’ll discuss a suitable starting point.'}</p></div><Link className="button" href={`/${locale}/contact`}>{ar?'تواصل معنا':'Get in touch'} ↗</Link></section></>;
}
