async function OpenPDFWindow(main) {
  let pdf = (await "data:application/pdf;base64,") + main;
  let mywindow = await window.open(
    "",
    "",
    "width=800,height=600,left=200,top=200"
  );
  if (mywindow) {
    await mywindow.document.write(
      " <iframe  src='" + pdf + "' width='100%' height='100%' />"
    );
  }
}
export default OpenPDFWindow;
/**
 *
 * async function OpenPDFWindow(mainobject){
 //send object must contain url
   let ob=''
   // preparing object to be send to the url parameter
   for (const property in mainobject) {
       if(typeof mainobject[property]==='string' || mainobject[property] instanceof String){
         let te=""
         for (const j in mainobject[property]){
             if(mainobject[property][j]=="/")
            te+="!"
             else
              te+=mainobject[property][j]
         }
         mainobject[property]=te
       }
       ob+=property+"@"+mainobject[property]+"`"
     }
        // open window function to prevent
window.open("#/user/View/"+ob, "", "width=800,height=600,left=200,top=200")

}
export default OpenPDFWindow
 */
