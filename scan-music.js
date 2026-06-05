const fs = require('fs');
const path = require('path');

// 音乐目录路径
const musicDir = path.join(__dirname, 'music');
// 输出的JSON文件路径
const outputFile = path.join(musicDir, 'music-list.json');

// 扫描目录下的所有mp3文件
function scanMusicFiles(dir) {
    const files = fs.readdirSync(dir);
    const musicFiles = [];
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isFile() && path.extname(file).toLowerCase() === '.mp3') {
            // 解析文件名，尝试提取歌曲名和艺术家
            const fileName = path.basename(file, '.mp3');
            let name = fileName;
            let artist = '未知艺术家';
            
            // 尝试从文件名中提取艺术家和歌曲名（格式：艺术家 - 歌曲名）
            const match = fileName.match(/^(.+)\s+-\s+(.+)$/);
            if (match) {
                artist = match[1];
                name = match[2];
            }
            
            musicFiles.push({
                name: name,
                artist: artist,
                url: `./music/${file}`,
                cover: './img/icon/logo.png', // 默认封面
                theme: '#171513' // 默认主题色
            });
        }
    });
    
    return musicFiles;
}

// 生成音乐列表JSON文件
function generateMusicList() {
    try {
        const musicFiles = scanMusicFiles(musicDir);
        const musicList = JSON.stringify(musicFiles, null, 2);
        
        fs.writeFileSync(outputFile, musicList);
        console.log(`成功生成音乐列表，共 ${musicFiles.length} 首歌曲`);
        console.log(`输出文件：${outputFile}`);
    } catch (error) {
        console.error('生成音乐列表失败：', error.message);
    }
}

// 执行生成
if (require.main === module) {
    generateMusicList();
}

module.exports = { scanMusicFiles, generateMusicList };