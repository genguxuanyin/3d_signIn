const fs = require('fs');
module.exports = {
    write: function (url, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(url, data, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(console.log('写入完成'))
            });

        })
    },
    remove: function (url) {
        return new Promise((resolve, reject) => {
            fs.unlink(url, (err) => {
                if (err) {
                    return resolve(err);
                }
                resolve(console.log('删除文件成功'));
            });
        })
    }
}