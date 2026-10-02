import{a as t,e as B,g as x}from"./chunk-HH7N2YVI.js";B();x();import{randomUUID as W}from"crypto";import{mkdir as H,open as N,rm as D,writeFile as A}from"fs/promises";import{dirname as F,join as V}from"path";import{BrowserWindow as z,MessageChannelMain as Q,session as U}from"electron";var $="zcode-browser-video-recorder:port",L=15e3,O=15e3;function T(){let e,o,i=!1,s=new Promise((d,a)=>{e=d,o=a});return s.catch(()=>{}),{promise:s,resolve:t(d=>{i||(i=!0,e(d))},"resolve"),reject:t(d=>{i||(i=!0,o(d))},"reject")}}t(T,"deferred");function c(e){return new Error(`Electron WebM recorder failed: ${e}`)}t(c,"recorderError");function I(){return new DOMException("Browser recording cancelled","AbortError")}t(I,"abortError");async function v(e,o,i){let s;try{return await Promise.race([e,new Promise((d,a)=>{s=setTimeout(()=>a(c(i)),o)})])}finally{s&&clearTimeout(s)}}t(v,"withTimeout");function q(e){return e instanceof ArrayBuffer?Buffer.from(e):ArrayBuffer.isView(e)?Buffer.from(e.buffer,e.byteOffset,e.byteLength):Buffer.isBuffer(e)?e:null}t(q,"toChunkBuffer");function J(){return`<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'">
  </head>
  <body>
    <script>
      (() => {
        const channel = ${JSON.stringify($)};
        let mediaRecorder = null;
        let mediaStream = null;
        let recordingStream = null;
        let sourceVideo = null;
        let recordingCanvas = null;
        let drawTimer = null;
        let chunkQueue = Promise.resolve();
        let cancelling = false;

        const messageText = (error) => error instanceof Error ? error.message : String(error);
        const stopTracks = () => {
          for (const track of mediaStream?.getTracks?.() ?? []) track.stop();
          for (const track of recordingStream?.getTracks?.() ?? []) track.stop();
          mediaStream = null;
          recordingStream = null;
          if (drawTimer !== null) clearInterval(drawTimer);
          drawTimer = null;
          sourceVideo?.remove();
          recordingCanvas?.remove();
          sourceVideo = null;
          recordingCanvas = null;
        };

        window.addEventListener("message", (event) => {
          if (event.source !== window || event.data !== channel) return;
          const port = event.ports[0];
          if (!port) return;
          port.onmessage = async ({ data }) => {
            if (data?.type === "start") {
              try {
                const candidates = ["video/webm;codecs=vp8", "video/webm"];
                const mimeType = candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate));
                if (!mimeType) throw new Error("Chromium does not support VP8 WebM MediaRecorder");
                const fps = Number(data.fps) || 25;
                const width = Number(data.width);
                const height = Number(data.height);
                if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0) {
                  throw new Error("invalid recorder viewport");
                }
                mediaStream = await navigator.mediaDevices.getDisplayMedia({
                  video: { frameRate: fps },
                  audio: false,
                });
                const [videoTrack] = mediaStream.getVideoTracks();
                port.postMessage({
                  type: "diagnostic",
                  message: "track=" + JSON.stringify({
                    active: mediaStream.active,
                    muted: videoTrack?.muted,
                    readyState: videoTrack?.readyState,
                    settings: videoTrack?.getSettings?.(),
                  }),
                });
                videoTrack?.addEventListener("mute", () => port.postMessage({ type: "diagnostic", message: "track muted" }));
                videoTrack?.addEventListener("unmute", () => port.postMessage({ type: "diagnostic", message: "track unmuted" }));
                videoTrack?.addEventListener("ended", () => port.postMessage({ type: "diagnostic", message: "track ended" }));
                sourceVideo = document.createElement("video");
                sourceVideo.muted = true;
                sourceVideo.playsInline = true;
                sourceVideo.srcObject = mediaStream;
                sourceVideo.style.position = "fixed";
                sourceVideo.style.opacity = "0";
                document.body.append(sourceVideo);
                await sourceVideo.play();

                recordingCanvas = document.createElement("canvas");
                recordingCanvas.width = width;
                recordingCanvas.height = height;
                const context = recordingCanvas.getContext("2d", { alpha: false });
                if (!context) throw new Error("2D canvas recorder is unavailable");
                const drawFrame = () => context.drawImage(sourceVideo, 0, 0, width, height);
                drawFrame();
                drawTimer = setInterval(drawFrame, Math.max(1, Math.round(1000 / fps)));
                recordingStream = recordingCanvas.captureStream(fps);
                mediaRecorder = new MediaRecorder(recordingStream, { mimeType });
                mediaRecorder.addEventListener("dataavailable", (chunkEvent) => {
                  port.postMessage({ type: "diagnostic", message: "dataavailable bytes=" + chunkEvent.data?.size });
                  if (!chunkEvent.data || chunkEvent.data.size === 0) return;
                  chunkQueue = chunkQueue.then(async () => {
                    const bytes = await chunkEvent.data.arrayBuffer();
                    // Bug \u539F\u56E0\uFF1ADOM MessagePort \u2192 Electron MessagePortMain \u5BF9 ArrayBuffer transfer
                    // \u5728\u90E8\u5206 Electron \u5E73\u53F0\u4F1A\u9759\u9ED8\u4E22\u5F03\u6574\u6761\u6D88\u606F\uFF1B\u8BA9 structured clone \u590D\u5236\u5206\u7247\u624D\u80FD
                    // \u4FDD\u8BC1 dataavailable \u4E0E\u540E\u7EED stopped \u90FD\u6309\u5E8F\u62B5\u8FBE main\u3002
                    port.postMessage({ type: "chunk", data: bytes });
                  });
                });
                mediaRecorder.addEventListener("error", (recorderEvent) => {
                  port.postMessage({
                    type: "error",
                    message: messageText(recorderEvent.error ?? "MediaRecorder error"),
                  });
                });
                mediaRecorder.addEventListener("stop", async () => {
                  try {
                    await chunkQueue;
                    port.postMessage({ type: cancelling ? "cancelled" : "stopped" });
                  } catch (error) {
                    port.postMessage({ type: "error", message: messageText(error) });
                  } finally {
                    stopTracks();
                  }
                }, { once: true });
                mediaRecorder.start(1000);
                port.postMessage({ type: "started", mimeType: mediaRecorder.mimeType || mimeType });
              } catch (error) {
                stopTracks();
                port.postMessage({ type: "error", message: messageText(error) });
              }
              return;
            }
            if (data?.type === "stop") {
              if (mediaRecorder?.state === "recording" || mediaRecorder?.state === "paused") {
                mediaRecorder.stop();
              } else {
                port.postMessage({ type: "error", message: "MediaRecorder is not recording" });
              }
              return;
            }
            if (data?.type === "cancel") {
              cancelling = true;
              if (mediaRecorder?.state === "recording" || mediaRecorder?.state === "paused") {
                mediaRecorder.stop();
              } else {
                stopTracks();
                port.postMessage({ type: "cancelled" });
              }
            }
          };
          port.start();
          port.postMessage({ type: "ready" });
        }, { once: true });
      })();
    </script>
  </body>
</html>`}t(J,"recorderHtml");function G(e){let o=e;if(!o||typeof o.isDestroyed!="function"||o.isDestroyed()||o.detached)throw c("target WebFrameMain is unavailable");return o}t(G,"asTargetFrame");function _(e){try{e.close()}catch{}}t(_,"closePort");function K(e){e.isDestroyed()||e.destroy()}t(K,"closeWindow");function X(e){try{e.setDisplayMediaRequestHandler(null)}catch{}}t(X,"clearDisplayMediaHandler");async function Y(e,o){if(e.signal.aborted)throw I();let i=G(e.targetFrame);await H(F(e.outputPath),{recursive:!0});let s=V(F(e.outputPath),`.${W()}-browser-video-recorder.html`),d=U.fromPartition(`zcode-browser-video-recorder-${W()}`),a=new z({show:!1,width:Math.max(1,e.viewport.width),height:Math.max(1,e.viewport.height),webPreferences:{session:d,preload:V(import.meta.dirname,"../preload/browserVideoRecorder.cjs"),sandbox:!0,contextIsolation:!0,nodeIntegration:!1,backgroundThrottling:!1,webSecurity:!0}});a.webContents.setWindowOpenHandler(()=>({action:"deny"}));let{port1:m,port2:R}=new Q,h=T(),b=T(),f=T(),l,M,g=Promise.resolve(),u=!1,k=!1,p=t(n=>{let r=n instanceof Error?n:c(String(n));h.reject(r),b.reject(r),f.reject(r)},"fail"),E=t(n=>{let r=n.data;if(!(!r||typeof r.type!="string")){if(o?.(`[browser-recording] recorder message type=${r.type}`),r.type==="ready"){h.resolve();return}if(r.type==="started"){if(r.mimeType!=="video/webm;codecs=vp8"&&r.mimeType!=="video/webm"){p(c(`unexpected MediaRecorder MIME type: ${String(r.mimeType)}`));return}b.resolve();return}if(r.type==="chunk"){let y=q(r.data);if(!y||y.byteLength===0){o?.(`[browser-recording] ignored empty chunk value=${Object.prototype.toString.call(r.data)}`);return}o?.(`[browser-recording] received WebM chunk bytes=${y.byteLength}`),g=g.then(async()=>{if(!l)throw c("output file is already closed");await l.write(y)}).catch(j=>{M??=j});return}if(r.type==="stopped"){f.resolve();return}if(r.type==="error"){p(c(typeof r.message=="string"?r.message:"unknown error"));return}r.type==="diagnostic"&&o?.(`[browser-recording] ${String(r.message??"")}`)}},"onPortMessage");m.on("message",E),m.on("close",()=>{u||p(c("recorder MessagePort closed unexpectedly"))}),m.start();let S=t((n,r)=>{u||p(c(`recorder renderer exited: ${r.reason??"unknown"}`))},"onRendererGone");a.webContents.on("render-process-gone",S);let P=t((n,r)=>{o?.(`[browser-recording] recorder console level=${r.level??"unknown"} message=${r.message??""}`)},"onConsoleMessage");a.webContents.on("console-message",P);let w=t(async n=>{if(!u){if(u=!0,e.signal.removeEventListener("abort",C),n)try{m.postMessage({type:"cancel"})}catch{}await g.catch(()=>{}),await l?.close().catch(()=>{}),l=void 0,m.removeListener("message",E),_(m),_(R),X(d),a.webContents.removeListener("render-process-gone",S),a.webContents.removeListener("console-message",P),K(a),await D(s,{force:!0}).catch(()=>{})}},"cleanup"),C=t(()=>{p(I()),w(!0)},"onAbort");e.signal.addEventListener("abort",C,{once:!0});try{await A(s,J(),{encoding:"utf8",mode:384}),d.setDisplayMediaRequestHandler((n,r)=>{if(u||n.frame!==a.webContents.mainFrame||!n.videoRequested||n.audioRequested||i.isDestroyed()||i.detached){r({});return}r({video:i})}),l=await N(e.outputPath,"w"),await a.loadFile(s),await D(s,{force:!0}).catch(()=>{}),a.webContents.postMessage($,null,[R]),await v(h.promise,L,"recorder renderer did not become ready"),m.postMessage({type:"start",fps:e.fps,width:e.viewport.width,height:e.viewport.height}),await v(b.promise,L,"MediaRecorder did not start")}catch(n){throw p(n),await w(!0),n}return{stop:t(async()=>{if(u)throw c("recorder is already closed");if(k){await v(f.promise,O,"MediaRecorder did not stop");return}k=!0,m.postMessage({type:"stop"});try{if(await v(f.promise,O,"MediaRecorder did not stop"),await g,M)throw M}finally{await w(!1)}},"stop"),cancel:t(()=>w(!0),"cancel")}}t(Y,"createElectronBrowserWebmRecorder");var se=Y;export{Y as a,se as b};
