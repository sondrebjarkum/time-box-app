// export const _getAllFilesFromFolder = function(dir : string) {

//     var filesystem = require("fs");
//     var results : string[] = [];

//     filesystem.readdirSync(dir).forEach(function(file : any) {

//         file = dir+'/'+file;
//         var stat = filesystem.statSync(file);

//         if (stat && stat.isDirectory()) {
//             results = results.concat(_getAllFilesFromFolder(file))
//         } else results.push(file);

//     });

//     return results;

// };

export const storage = {
    write : (key : string, val : string) => {
        localStorage.setItem(key, val)
    },
    get : (key : string) => {
        return localStorage.getItem(key) as string
    },
    delete : (key : string) => {
        localStorage.removeItem(key)
    },
    clear : () => localStorage.clear(),
    parse : <T extends object | string>(obj : T) : object | string => typeof(obj) == "object" ? JSON.stringify(obj) :  JSON.parse(obj)
    
}
