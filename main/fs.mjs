import fs from'fs'
import path from'path'
async function createReadStream(p){
    let fh
    try{
        fh=await fs.promises.open(p,'r')
    }catch(e){
        throw['ENOENT'].includes(e.code)?createReadStream.badPath:e
    }
    if(!(await fh.stat()).isFile()){
        fh.close()
        throw createReadStream.badPath
    }
    return fs.createReadStream(0,{fd:fh.fd,autoClose:false}).on('end',()=>
        fh.close()
    )
}
createReadStream.badPath=Symbol()
async function fsyncByPath(p){
    let h=await fs.promises.open(p)
    await h.sync()
    await h.close()
}
async function fsyncWithParentByPath(p){
    await Promise.all([
        fsyncByPath(path.resolve(p,'..')),
        fsyncByPath(p),
    ])
}
async function mkdirFsync(p){
    await fs.promises.mkdir(p)
    await fsyncWithParentByPath(p)
}
async function renameFsync(a,b){
    await fs.promises.rename(a,b)
    await fsyncWithParentByPath(b)
}
export default{
    createReadStream,
    fsyncByPath,
    fsyncWithParentByPath,
    mkdirFsync,
    renameFsync,
}
