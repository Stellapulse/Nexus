const parseBody = async (req) => {
        return new Promise((resolve, reject) => {

            let body = '';
           // const writeableStream = fs.createWriteStream('requestBody.json');
            req.on('data', (chunk) => {

                body+=chunk.toString('utf-8');
                
               // const canwrite = writeableStream.write(chunk);
               // if(!canwrite){
                //     req.pause();
                //     writeableStream.once('drain', () => {
                //         req.resume();
                //     });
                // }
            });
            req.on('end',()=>{
               // writeableStream.end();
               // fs.open('requestBody.json','r',(err,data)=> {
                   
                    try{
                        const parsedData = JSON.parse(body);
                       
                        resolve(parsedData);
                        
                    } catch (error) {
                        reject(error);
                    }
                // });
            });
            req.on('error', (err) => {
                reject(err);
            });

        });
};

module.exports = parseBody;