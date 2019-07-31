import fs from'fs'
import rollup from'rollup'
let
    nodeVersion='1.0.0',
    skip=[
        'fs',
        'path',
    ]
async function link(input,file){
    let bundle=await rollup.rollup({
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
    fs.promises.writeFile('dist/node/package.json',JSON.stringify({
        main:'fs.mjs',
        name:'@anliting/fs',
        version:nodeVersion,
    }))
    fs.promises.copyFile('license','dist/node/license')
    fs.promises.writeFile(
        'dist/node/fs.mjs',
        await link(`main/fs.mjs`)
    )
})()
