import {getContactSettings} from '../../../lib/contact-service';
export async function GET(){return Response.json(await getContactSettings(),{headers:{'Cache-Control':'no-store'}})}
