const fs = require('fs');
const path = require('path');

// 音乐目录路径
const musicDir = path.join(__dirname, 'music');
// 输出的JSON文件路径
const outputFile = path.join(musicDir, 'music-list.json');

const defaultCover = './img/icon/logo.png';
const defaultTheme = '#171513';

function parseMusicFile(file) {
    const fileName = path.basename(file, '.mp3').trim();
    let displayName = fileName;
    let artist = '本地音乐';
    let duration = '';

    const durationMatch = displayName.match(/^(\d+)s\s+(.+)$/i);
    if (durationMatch) {
        duration = durationMatch[1];
        displayName = durationMatch[2].trim();
    }

    const artistMatch = displayName.match(/^(.+?)\s+-\s+(.+)$/);
    if (artistMatch) {
        artist = artistMatch[1].trim();
        displayName = artistMatch[2].trim();
    }

    return {
        name: displayName,
        artist,
        url: `./music/${encodeURIComponent(file).replace(/%2F/g, '/')}`,
        cover: defaultCover,
        theme: defaultTheme,
        duration: duration ? Number(duration) : undefined
    };
}

// 扫描目录下的所有mp3文件
function scanMusicFiles(dir) {
    if (!fs.existsSync(dir)) {
        return [];
    }

    const files = fs.readdirSync(dir, { withFileTypes: true });

    return files
        .filter(file => file.isFile() && path.extname(file.name).toLowerCase() === '.mp3')
        .map(file => file.name)
        .sort((a, b) => a.localeCompare(b, 'zh-CN', { numeric: true }))
        .map(parseMusicFile);
}

// 保留旧版调用方式的兼容函数
function scanMusicFilesLegacy(dir) {
    const files = fs.readdirSync(dir);
    const musicFiles = [];

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isFile() && path.extname(file).toLowerCase() === '.mp3') {
            musicFiles.push(parseMusicFile(file));
        }
    });

    return musicFiles;
}

// 生成音乐列表JSON文件
function generateMusicList() {
    try {
        const musicFiles = scanMusicFiles(musicDir);
        const musicList = JSON.stringify(musicFiles, null, 2) + '\n';

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

module.exports = { scanMusicFiles, scanMusicFilesLegacy, generateMusicList };
