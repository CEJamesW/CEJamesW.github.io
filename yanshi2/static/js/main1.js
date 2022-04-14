let test = new Vue({
  el: '#m-app',

  data() {
    return {
      url: '', // 在线链接
	  remoteurl: '',//中转链接
      urlList: [], //解析历史记录url
      tips: 'm3u8 online video extractor', // 顶部提示
      isPause: false, // 是否暂停下载
      isGetMP4: false, // 是否转码为 MP4 下载
      durationSecond: 0, // 视频持续时长
      isShowRefer: true, // 是否显示推送
      isComplete: false,
      downloading: false, // 是否下载中
      beginTime: '', // 开始下载的时间
      errorNum: 0, // 错误数
      finishNum: 0, // 已下载数
      errorList: [], //错误的条目
      downloadIndex: 0, // 当前下载片段
      finishList: [], // 下载完成项目
      tsUrlList: [], // ts URL数组
      mediaFileList: [], // 下载的媒体数组
      aesConf: { // AES 视频解密配置
        method: '', // 加密算法
        uri: '', // key 所在文件路径
        iv: '', // 偏移值
        key: '', // 秘钥
        decryptor: null, // 解码器对象

        stringToBuffer: function (str) {
          return new TextEncoder().encode(str)
        },
      },
    }
  },

  created() {
    this.getSource();
    window.addEventListener('keyup', this.onKeyup)
  },

  beforeDestroy() {
    window.removeEventListener('keyup', this.onKeyup)
  },

  methods: {
    // 获取链接中携带的资源链接
    getSource() {
      let { href } = location
      if (href.indexOf('?source=') > -1) {
        this.url = href.split('?source=')[1]
      }
    },

    // 退出弹窗
    onKeyup(event) {
      if (event.keyCode === 13) { // 键入ESC
        this.getM3U8()
      }
    },

    // ajax 请求
    ajax(options) {
      options = options || {};
      let xhr = new XMLHttpRequest();
      if (options.type === 'file') {
        xhr.responseType = 'arraybuffer';
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          let status = xhr.status;
          if (status >= 200 && status < 300) {
            options.success && options.success(xhr.response);
          } else {
            options.fail && options.fail(status);
          }
        }
      };
	  
	  if(options.method == "post"){
		  xhr.open("POST", "/api/m3u8.html", true);
		  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		  xhr.send("snifer="+encodeURIComponent(options.url));
	  }else{
		  xhr.open("GET", options.url, true);
		  xhr.send(null);
	  }
    },

    // 合成URL
    applyURL(targetURL, baseURL) {
      baseURL = baseURL || location.href
      if (targetURL.indexOf('http') === 0) {
        return targetURL
      } else if (targetURL[0] === '/') {
        let domain = baseURL.split('/')
        return domain[0] + '//' + domain[2] + targetURL
      } else {
        let domain = baseURL.split('/')
        domain.pop()
        return domain.join('/') + '/' + targetURL
      }
    },

    // 解析为 mp4 下载
    getMP4() {
      this.isGetMP4 = true
      this.getM3U8()
    },

    // 获取在线文件
    getM3U8() {		
      if (!this.url) {
		toastr.error("请输入u3u8的下载地址。");
        return
      } else if (this.url.toLowerCase().indexOf('m3u8') === -1) {
		toastr.warning("该地址未检测到m3u8后缀,请确认您输入的是m3u8的下载地址。");
        return
      } else if (this.downloading) {
        toastr.warning("请刷新浏览器,以便从新使用");
        return
      }

      this.downloading = true

      this.tips = '正在下载中,请稍等'
      this.beginTime = new Date()
	  $("#yincangwo").show();
      this.ajax({
        url: this.url,
		method:"get",
        success: (m3u8Str) => {
          this.tsUrlList = []
          // 提取 ts 视频片段地址
		  let jishu = 0;
          m3u8Str.split('\n').forEach((item) => {
            if (this.isGetMP4 && item.toUpperCase().indexOf('#EXTINF:') > -1) { // 计算视频总时长，设置 mp4 信息时使用
              this.durationSecond += parseFloat(item.split('#EXTINF:')[1])
            }
            if (item.toLowerCase().indexOf('.ts') > -1) {
				jishu++;
              this.tsUrlList.push(this.applyURL(item, this.url))
              this.finishList.push({
                title: item,
                status: ''
              })
            }
          })
		  //这里展示切片
			for (var i=0;i<this.tsUrlList.length;i++)
			{
				$("section").append('<div title="'+this.tsUrlList[i]+'" class="item" id="'+(i+1)+'">'+(i+1)+'</div>');
			}
          // 检测视频 AES 加密
          if (m3u8Str.indexOf('#EXT-X-KEY') > -1) {
            this.aesConf.method = (m3u8Str.match(/(.*METHOD=([^,\s]+))/) || ['', '', ''])[2]
            this.aesConf.uri = (m3u8Str.match(/(.*URI="([^"]+))"/) || ['', '', ''])[2]
            this.aesConf.iv = (m3u8Str.match(/(.*IV=([^,\s]+))/) || ['', '', ''])[2]
            this.aesConf.iv = this.aesConf.iv ? this.aesConf.stringToBuffer(this.aesConf.iv) : ''
            this.aesConf.uri = this.applyURL(this.aesConf.uri, this.url)

            // let params = m3u8Str.match(/#EXT-X-KEY:([^,]*,?METHOD=([^,]+))?([^,]*,?URI="([^,]+)")?([^,]*,?IV=([^,^\n]+))?/)
            // this.aesConf.method = params[2]
            // this.aesConf.uri = this.applyURL(params[4], this.url)
            // this.aesConf.iv = params[6] ? this.aesConf.stringToBuffer(params[6]) : ''
            this.getAES();
          } else if (this.tsUrlList.length > 0) { // 如果视频没加密，则直接下载片段，否则先下载秘钥
            this.downloadTS()
          } else {
			toastr.warning("当前资源不可用,未找到相关ts资源.");
          }
        },
        fail: () => {
          toastr.warning("可能是由于该m3u8的跨域限制,采用第二套方案,请稍等1到2秒");
		  this.getM3U8_HTML()
        }
      })
    },
	//跨域问题导致的不可访问问题,这里才用二次备用方案
	getM3U8_HTML(){
      this.ajax({
        url: this.url,
		method:"post",
        success: (m3u8Str) => {
          this.tsUrlList = []
          // 提取 ts 视频片段地址
		  let jishu = 0;
		  //这里判断远端返回的相关备注内容
		  if (m3u8Str.indexOf('bugscaner1')>-1){
			  toastr.error("第二套方案失败:输入的m3u8的地址不能为空");
			  return;
		  }
		  if (m3u8Str.indexOf('bugscaner2')>-1){
			  toastr.error("第二套方案失败:m3u8不存在");
			  return;
		  }
		  if (m3u8Str.indexOf('bugscaner3')>-1){
			  toastr.error("第二套方案失败:m3u8文件太大仅支持小于1M的文件");
			  return;
		  }
		  if (m3u8Str.indexOf('bugscaner4')>-1){
			  toastr.error("第二套方案失败:出现了致命错误");
			  return;
		  }
          m3u8Str.split('\n').forEach((item) => {
            if (this.isGetMP4 && item.toUpperCase().indexOf('#EXTINF:') > -1) { // 计算视频总时长，设置 mp4 信息时使用
              this.durationSecond += parseFloat(item.split('#EXTINF:')[1])
            }
            if (item.toLowerCase().indexOf('.ts') > -1) {
				jishu++;
              this.tsUrlList.push(this.applyURL(item, this.url))
              this.finishList.push({
                title: item,
                status: ''
              })
            }
          })
		  //这里展示切片
			for (var i=0;i<this.tsUrlList.length;i++)
			{
				$("section").append('<div title="'+this.tsUrlList[i]+'" class="item" id="'+(i+1)+'">'+(i+1)+'</div>');
			}
          // 检测视频 AES 加密
          if (m3u8Str.indexOf('#EXT-X-KEY') > -1) {
            this.aesConf.method = (m3u8Str.match(/(.*METHOD=([^,\s]+))/) || ['', '', ''])[2]
            this.aesConf.uri = (m3u8Str.match(/(.*URI="([^"]+))"/) || ['', '', ''])[2]
            this.aesConf.iv = (m3u8Str.match(/(.*IV=([^,\s]+))/) || ['', '', ''])[2]
            this.aesConf.iv = this.aesConf.iv ? this.aesConf.stringToBuffer(this.aesConf.iv) : ''
            this.aesConf.uri = this.applyURL(this.aesConf.uri, this.url)

            // let params = m3u8Str.match(/#EXT-X-KEY:([^,]*,?METHOD=([^,]+))?([^,]*,?URI="([^,]+)")?([^,]*,?IV=([^,^\n]+))?/)
            // this.aesConf.method = params[2]
            // this.aesConf.uri = this.applyURL(params[4], this.url)
            // this.aesConf.iv = params[6] ? this.aesConf.stringToBuffer(params[6]) : ''
            this.getAES();
          } else if (this.tsUrlList.length > 0) { // 如果视频没加密，则直接下载片段，否则先下载秘钥
            this.downloadTS()
          } else {
			toastr.warning("当前资源不可用,未找到相关ts资源.");
          }
        },
        fail: () => {
          toastr.warning("备用下载方案失败,请检查您的链接是否有问题,也可以联系我们进行修复.");
        }
      })
	},
	
	
    // 获取AES配置
    getAES() {
		toastr.warning("当前视频进行了AES加密,已自动为您解密");
      this.ajax({
        type: 'file',
        url: this.aesConf.uri,
		method:"get",
        success: (key) => {
          // console.log('getAES', key)
          // this.aesConf.key = this.aesConf.stringToBuffer(key)
          this.aesConf.key = key
          this.aesConf.decryptor = new AESDecryptor()
          this.aesConf.decryptor.constructor()
          this.aesConf.decryptor.expandKey(this.aesConf.key);
          this.downloadTS()
        },
        fail: () => {
		  toastr.error("AES错误");
        }
      })
    },

    // ts 片段的 AES 解码
    aesDecrypt(data, index) {
      let iv = this.aesConf.iv || new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, index])
      return this.aesConf.decryptor.decrypt(data, 0, iv.buffer || iv, true)
    },

    // 下载分片
    downloadTS() {
      this.tips = 'ts fragment downloading, please wait'
      let download = () => {
        let isPause = this.isPause // 使用另一个变量来保持下载前的暂停状态，避免回调后没修改
        let index = this.downloadIndex
        this.downloadIndex++
        if (this.finishList[index] && this.finishList[index].status === '') {
          this.ajax({
            url: this.tsUrlList[index],
            type: 'file',
			method:"get",
            success: (file) => {
              this.dealTS(file, index, () => this.downloadIndex < this.tsUrlList.length && !isPause && download())
			  //这里下载完了,设置颜色
			  $("#"+(index+1)).addClass("finish");
			  $("#split_video").text("总分片数量:"+this.tsUrlList.length+" 已下载分片数量:"+this.downloadIndex);
            },
            fail: () => {
				$("#"+(index+1)).addClass("error");
              this.errorNum++
              this.finishList[index].status = "error";
              this.finishList[index].errorIndex = index;
              this.errorList.push(this.finishList[index]);
              if (this.downloadIndex < this.tsUrlList.length) {
                !isPause && download()
              }
            }
          })
        } else if (this.downloadIndex < this.tsUrlList.length) { // 跳过已经成功的片段
          !isPause && download()
        }
      }
      // 建立多10个 ajax 线程
      for (let i = 0; i < 10; i++) {
        download(i)
      }
    },

    // 处理 ts 片段，AES 解密、mp4 转码
    dealTS(file, index, callback) {
      const data = this.aesConf.uri ? this.aesDecrypt(file, index) : file
      this.conversionMp4(data, index, (afterData) => { // mp4 转码
        this.mediaFileList[index] = afterData // 判断文件是否需要解密
        this.finishList[index].status = 'finish'
        this.finishNum++
		//在这里添加进度条
		//计算进度
		let finish_pr = this.tsUrlList.length== 0?0:(this.finishNum / this.tsUrlList.length*100).toFixed(2);
        if (this.finishNum === this.tsUrlList.length) {
			//这里是完成%100
			$("#run").css("width","100%").text("下载完成,请留意浏览器自动下载。");
          this.downloadFile(this.mediaFileList, this.formatTime(this.beginTime, 'YYYY_MM_DD hh_mm_ss'))
        }else{
			//这里不到%100
			$("#run").css("width",finish_pr+"%").text(finish_pr+"%");
		}
        callback && callback()
      })
    },

    // 转码为 mp4
    conversionMp4(data, index, callback) {
      if (this.isGetMP4) {
        let transmuxer = new muxjs.Transmuxer({
          keepOriginalTimestamps: true,
          duration: parseInt(this.durationSecond),
        });
        transmuxer.on('data', segment => {
          if (index === 0) {
            let data = new Uint8Array(segment.initSegment.byteLength + segment.data.byteLength);
            data.set(segment.initSegment, 0);
            data.set(segment.data, segment.initSegment.byteLength);
            callback(data.buffer)
          } else {
            callback(segment.data)
          }
        })
        transmuxer.push(new Uint8Array(data));
        transmuxer.flush();
      } else {
        callback(data, index)
      }
    },

    // 暂停与恢复
    togglePause() {
      this.isPause = !this.isPause
      !this.isPause && this.retryAll()
    },

    // 重新下载某个片段
    retry(index) {
      if (this.finishList[index].status === 'error') {
        this.finishList[index].status = ''
        this.ajax({
          url: this.tsUrlList[index],
          type: 'file',
		  method:"get",
          success: (file) => {
            this.errorNum--
            this.dealTS(file, index)
          },
          fail: () => {
            this.finishList[index].status = 'error'
          }
        })
      }
    },

    // 重新下载所有错误片段
    retryAll() {
      this.finishList.forEach((item) => { // 重置所有片段状态
        if (item.status === 'error') {
          item.status = ''
          let listIndex = index;
          that.errorList.forEach((item, index) => {
            if (item.errorIndex == listIndex) {
              that.errorList.splice(index, 1);
            }
          });
        }
      })
      this.errorNum = 0
      this.downloadIndex = 0
      this.downloadTS()
    },

    // 下载整合后的TS文件
    downloadFile(fileDataList, fileName) {
      this.tips = 'ts fragment integration, please pay attention to the browser download'
      let fileBlob = null
      let a = document.createElement('a')
      if (this.isGetMP4) {
        fileBlob = new Blob(fileDataList, { type: 'video/mp4' }) // 创建一个Blob对象，并设置文件的 MIME 类型
        a.download = fileName + '.mp4'
      } else {
        fileBlob = new Blob(fileDataList, { type: 'video/MP2T' }) // 创建一个Blob对象，并设置文件的 MIME 类型
        a.download = fileName + '.ts'
      }
      a.href = URL.createObjectURL(fileBlob)
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      a.remove()
      // 下载完成
      this.isComplete = true
    },

    // 格式化时间
    formatTime(date, formatStr) {
      const formatType = {
        Y: date.getFullYear(),
        M: date.getMonth() + 1,
        D: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
      }
      return formatStr.replace(
        /Y+|M+|D+|h+|m+|s+/g,
        target => (new Array(target.length).join('0') + formatType[target[0]]).substr(-target.length)
      )
    },

    // 强制下载现有片段
    forceDownload() {
      if (this.mediaFileList.length) {
        this.downloadFile(this.mediaFileList, this.formatTime(this.beginTime, 'YYYY_MM_DD hh_mm_ss'))
      } else {
        alert('There are currently no downloaded fragment')
      }
    },

    // 发生错误，进行提示
    alertError(tips) {
      alert(tips)
      this.downloading = false
      this.tips = 'm3u8 online video extractor';
    },

    // 拷贝本页面本身，解决跨域问题
    copyCode() {
      if (this.tips !== 'Code downloading, please wait' && this.tips !== '复制成功，打开视频网页控制台，注入本代码') {
        this.tips = 'Copy success, open the video web console, inject this code';
        this.ajax({
          url: './index.html',
		  method:"get",
          success: (fileStr) => {
            let fileList = fileStr.split(`<!--vue 前端框架--\>`);
            let dom = fileList[0];
            let script = fileList[1] + fileList[2];
            script = script.split('// script注入');
            script = script[1] + script[2];

            if (this.url) {
              script = script.replace(`url: '', // 在线链接`, `url: '${this.url}',`);
            }

            let codeStr = `
          // 注入html
          let $section = document.createElement('section')
          $section.innerHTML = \`${dom}\`
          $section.style.width = '100%'
          $section.style.height = '800px'
          $section.style.top = '0'
          $section.style.left = '0'
          $section.style.position = 'relative'
          $section.style.zIndex = '9999'
          $section.style.backgroundColor = 'white'
          document.body.appendChild($section);

          // 加载 ASE 解密
          let $ase = document.createElement('script')
          $ase.src = 'http://blog.luckly-mjw.cn/tool-show/m3u8-downloader/aes-decryptor.js'

          // 加载 mp4 转码
          let $mp4 = document.createElement('script')
          $mp4.src = 'http://blog.luckly-mjw.cn/tool-show/m3u8-downloader/mux-mp4.js'

          // 加载 vue
          let $vue = document.createElement('script')
          $vue.src = 'https://cdn.bootcss.com/vue/2.6.10/vue.min.js'

          // 监听 vue 加载完成，执行业务代码
          $vue.addEventListener('load', () => {${script}})
          document.body.appendChild($vue);
          document.body.appendChild($mp4);
          document.body.appendChild($ase);
          alert('注入成功，请滚动到页面底部')
          `;
            this.copyToClipboard(codeStr);
            this.tips = 'Copy success, open the video web console, inject this code';
          },
          fail: () => {
            this.alertError('The link is not correct, please check if the link is valid');
          },
        })
      }
    },

    // 拷贝剪切板
    copyToClipboard(content) {
      clearTimeout(this.timeouter)

      if (!document.queryCommandSupported('copy')) {
        return false
      }

      let $input = document.createElement('textarea')
      $input.style.opacity = '0'
      $input.value = content
      document.body.appendChild($input)
      $input.select()

      const result = document.execCommand('copy')
      document.body.removeChild($input)
      $input = null

      return result
    },
    startAgain() {
      window.location.reload();
    }
  }
})