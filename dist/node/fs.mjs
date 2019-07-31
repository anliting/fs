import fs$1 from 'fs';
import path from 'path';

async function createReadStream(p){
    let fh;
    try{
        fh=await fs$1.promises.open(p,'r');
    }catch(e){
        throw['ENOENT'].includes(e.code)?createReadStream.badPath:e
    }
    if(!(await fh.stat()).isFile()){
        fh.close();
        throw createReadStream.badPath
    }
    return fs$1.createReadStream(0,{fd:fh.fd,autoClose:false}).on('end',()=>
        fh.close()
    )
}
createReadStream.badPath=Symbol();
async function fsyncByPath(p){
    let h=await fs$1.promises.open(p);
    await h.sync();
    await h.close();
}
async function fsyncWithParentByPath(p){
    await Promise.all([
        fsyncByPath(path.resolve(p,'..')),
        fsyncByPath(p),
    ]);
}
async function mkdirFsync(p){
    await fs$1.promises.mkdir(p);
    await fsyncWithParentByPath(p);
}
async function renameFsync(a,b){
    await fs$1.promises.rename(a,b);
    await fsyncWithParentByPath(b);
}
var fs = {
    createReadStream,
    fsyncByPath,
    fsyncWithParentByPath,
    mkdirFsync,
    renameFsync,
};

export default fs;
