export const THUMBNAIL_WIDTH=1200;
export const THUMBNAIL_HEIGHT=750;
export function cropGeometry(naturalWidth:number,naturalHeight:number,width:number,height:number,zoom:number,panX:number,panY:number){
 const scale=Math.max(width/naturalWidth,height/naturalHeight)*Math.max(1,Math.min(3,zoom));
 const imageWidth=naturalWidth*scale,imageHeight=naturalHeight*scale;
 const overflowX=Math.max(0,imageWidth-width),overflowY=Math.max(0,imageHeight-height);
 return {imageWidth,imageHeight,overflowX,overflowY,left:(width-imageWidth)/2+Math.max(-1,Math.min(1,panX))*overflowX/2,top:(height-imageHeight)/2+Math.max(-1,Math.min(1,panY))*overflowY/2};
}
