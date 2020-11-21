import fs from'fs'
import{rollup}from'rollup'
let
    skip=[
        'fs',
        'path',
    ]
async function link(input,file){
    let bundle=await rollup({
        input,
        external:s=>skip.includes(s),
    })
    return(await bundle.generate({
        file,
        format:'es',
        paths:s=>skip.includes(s)&&s,
    })).output[0].code
}
;(async()=>{
    fs.promises.writeFile('package.json',JSON.stringify({
        main:'main.mjs',
        name:'@anliting/fs',
        version:'0.0.0',
    }))
    fs.promises.writeFile(
        'main.mjs',
        await link(`main/fs.mjs`)
    )
})()
