uccess:!1,error:T instanceof Error?T.message:String(T)})}}s(lt,"respondToWorkspaceReconnectRequest");function Jo(h,b,T){h.mobileViewState=b,T&&(h.mobileDeviceInfo=T)}s(Jo,"applyMobileViewStateUpdate");function Yo(h,b){xt(h,b)}s(Yo,"routeRpcTransportPayload");function xt(h,b){let T=h.currentBridge;return!T||T.degraded?!1:T.relayProtocol?.acceptPayload(b)??!1}s(xt,"routeRawTransportCandidate");function tc(h,b){e.logger.info("[web-remote-control] mobile diagnostic",{window:h.windowId,session:h.deviceSid,event:b.event,state:b.state,previousState:b.previousState,pairStatus:b.pairStatus,closeCode:b.closeCode,closeReason:b.closeReason,wasClean:b.wasClean,wasPaired:b.wasPaired,failureReason:b.failureReason,failureMessage:b.failureMessage,visibilityState:b.visibilityState,online:b.online,hiddenDurationMs:b.hiddenDurationMs,timestamp:b.timestamp})}s(tc,"logMobileDiagnostic");function oI(h,b){switch(b.zcode_type){case"bootstrap-request":de(h,{zcode_type:"bootstrap-response",requestId:b.requestId,success:!0,result:E(h)});break;case"workspace-list-request":de(h,{zcode_type:"workspace-list-response",requestId:b.requestId,success:!0,result:O(h)});break;case"platform-request":q(h,b);break;case"mobile-view-state-update":Jo(h,b.viewState,b.deviceInfo);break;case"workspace-bridge-open":ee(h,b);break;case"workspace-reconnect-request":lt(h,b);break;case"rpc-frame":case"rpc-frame-ack":Yo(h,b);break;case"telemetry-report":e.reportRendererTelemetryEvent?.(b.event);break;case"mobile-diagnostic":tc(h,b);break;default:break}}s(oI,"routePayload");function nI(h,b){let T=h.transportState;if(h.transportState=b,b==="connecting"||b==="registering"||b==="authenticating"){if(h.mobileConnected){h.status="active",pe(h),V(h);return}h.status="starting",V(h);return}if(b==="waiting_terminal"){if(h.mobileConnected){h.status="active",pe(h),V(h);return}h.status="running",h.mobileConnected=!1,V(h);return}if(b==="paired"){if(T!=="paired"){let L=a(h);n(h.windowId,Ss({result:"success",pairKind:h.hasEverPaired?"reconnect":"initial",...L}))}h.hasEverPaired=!0,D(h),h.status="active",h.mobileConnected=!0,V(h),Te(h);return}if(b==="kicked"){if(T!=="kicked"){let L=a(h);n(h.windowId,Ss({result:"failure",pairKind:h.hasEverPaired?"reconnect":"initial",...L,errorCategory:"relay"}))}dt(h.windowId,h,"external-relay-kicked",Fb("session-conflict","Web remote control connection was kicked by relay."));return}if(b==="error"){if(T!=="error"){let L=a(h);n(h.windowId,Ss({result:"failure",pairKind:h.hasEverPaired?"reconnect":"initial",...L,errorCategory:"relay"}))}h.status="error",V(h)}}s(nI,"mapTransportState");function sI(h,b,T){return Im({baseUrl:b,deviceSid:h.deviceSid,passHash:h.passHash,timestamp:Date.now(),deviceMid:e.deviceMid,deviceName:e.deviceName,appVersion:e.appVersion,theme:T})}return s(sI,"createQrUrl"),{authorizeStart:S,async startAuthorized(h,b,T){return P(h,b,T),this.start(h,b)},async start(h,b){f(h),e.featureGate.assertEnabled(),u=!0,await re(h,"restart");let T=await e.getEndpointUrls?.(),L=T?.relayWsUrl??e.relayWsUrl,K=T?.remoteUrl??e.mobileRemoteControlUrl;e.logger.info(`[web-remote-control] start window=${h} workspace=${b.workspacePath} remoteSession=${b.remoteSessionId??"none"} relay=${L}`);let te=await e.authStorageProvider.load(),ve=te?{mode:"persisted",deviceSid:te.deviceSid,passHash:te.passHash}:{mode:"register",passHash:e.authProvider.createPassHash(e.authProvider.createPassword())},Ne=ve.mode==="persisted"?{deviceSid:ve.deviceSid,passHash:ve.passHash}:void 0,Xo,ge,rc=new Promise((Oe,ps)=>{let iI=setTimeout(()=>{ps(new Error("External relay device did not reach QR-ready state before timeout."))},BW),aI=s(()=>{clearTimeout(iI),Oe()},"resolveReady"),yp=g({relayWsUrl:L,deviceMid:e.deviceMid,auth:ve,meta:{platform:process.platform,version:e.appVersion,name:e.deviceName},authProvider:e.authProvider,logger:e.logger,relayMessageLogger:e.relayMessageLogger,onRegisteredAuth:s(ke=>{Xo=ke,Ne=ke},"onRegisteredAuth"),onStateChange:s(ke=>{nI(ge,ke),(ke==="waiting_terminal"||ke==="paired")&&Ne&&aI()},"onStateChange"),onPayload:s(ke=>oI(ge,ke),"onPayload"),onRawTransportPayload:s(ke=>xt(ge,ke),"onRawTransportPayload"),onRawTransportFault:s(ke=>{ge.currentBridge?.relayProtocol?.markDegraded(ke)},"onRawTransportFault"),onSendReady:s(()=>{Te(ge);let ke=ge.currentBridge?.relayProtocol;!ke||ke.isDegraded()||ke.replayUnacknowledged()},"onSendReady"),onError:s(ke=>{e.logger.warn("[web-remote-control] external relay device error",{message:ke.message})},"onError"),onInvalidPersistedAuth:s(async()=>{await $b(e.authStorageProvider,e.logger,"auth-failed")},"onInvalidPersistedAuth")});ge={windowId:h,workspacePath:b.workspacePath,workspaceIdentity:b.workspaceIdentity,remoteSessionId:b.remoteSessionId,initialTaskId:b.initialTaskId,theme:b.theme,status:"starting",deviceSid:Ne?.deviceSid??"pending",passHash:Ne?.passHash??ve.passHash,deviceMid:e.deviceMid,connectUrl:"",qrUrl:"",transport:yp,mobileConnected:!1,hasEverPaired:!1,pendingOutboundPayloads:[]},t.set(h,ge),V(ge),yp.start()});try{await rc}catch(Oe){throw t.delete(h),W(ge),D(ge),ge.pendingOutboundPayloads.length=0,ge.transport.dispose(),Oe}let Jt=Ne;if(!Jt)throw new Error("External relay auth was not available after transport became ready.");Xo&&await e.authStorageProvider.save(Xo);try{await e.startupRestoreStorageProvider.save({workspacePath:b.workspacePath,workspaceIdentity:b.workspaceIdentity,initialTaskId:b.initialTaskId})}catch(Oe){throw await re(h,"startup-restore-persist-failed"),Oe}let Jr=sI(Jt,K,b.theme);return ge.deviceSid=Jt.deviceSid,ge.passHash=Jt.passHash,ge.qrUrl=Jr,ge.connectUrl=Jr,V(ge),{status:ge.status==="active"?"active":"running",sessionId:Jt.deviceSid,windowControlSessionId:Jt.deviceSid,qrUrl:Jr,connectUrl:Jr,workspacePath:b.workspacePath,workspaceIdentity:b.workspaceIdentity,remoteSessionId:b.remoteSessionId,initialTaskId:b.initialTaskId}},async stop(h){f(h),await re(h,"manual-stop"),await e.startupRestoreStorageProvider.clear()},async suspend(h,b){f(h),await re(h,b)},async restorePreviouslyEnabled(h,b){if(u||t.has(h))return!1;let T=await l;if(u||!T)return!1;let L=Ue(T),K=b.find(te=>Ue(te)===L);if(!K)return!1;u=!0,e.logger.info(`[web-remote-control] restoring previous enabled state window=${h} workspace=${K.workspacePath} remoteSession=${K.remoteSessionId??"none"}`);try{return await this.start(h,{workspacePath:K.workspacePath,workspaceIdentity:K.workspaceIdentity,remoteSessionId:K.remoteSessionId,initialTaskId:T.initialTaskId}),!0}catch(te){return u=!1,e.logger.warn("[web-remote-control] restore previous enabled state failed",te),!1}},async resetPairing(h,b){return e.featureGate.assertEnabled(),await re(h,"leaked-qr"),await $b(e.authStorageProvider,e.logger,"leaked-qr"),this.start(h,b)},async resetPairingAuthorized(h,b,T){return P(h,b,T),this.resetPairing(h,b)},getStatus(h){if(!e.featureGate.isEnabled())return{status:"idle",failure:Fb("unsupported-action","Web remote control is disabled in this build.")};let b=t.get(h);return b?N(b):{status:"idle"}},syncAvailableWorkspaces(h,b){let T=t.get(h);T&&(o.set(h,b),B(T))},syncAvailableTasks(h,b){let T=t.get(h);T&&(c.set(h,b),B(T))},async disposeWindow(h){f(h),await re(h,"window-disposed"),o.delete(h),c.delete(h),d.delete(h)},failRemoteSession(h,b,T){for(let[L,K]of t){let te=K.currentBridge,ve=te?.remoteSessionId===h,Ne=K.remoteSessionId===h;!ve&&!Ne||(ve&&(y(K),de(K,{zcode_type:"workspace-bridge-error",bridgeSessionId:te.bridgeSessionId,...te.bridgeGeneration!==void 0?{bridgeGeneration:te.bridgeGeneration}:{},...te.recoveryId?{recoveryId:te.recoveryId}:{},requestId:`remote-session-closed:${h}`,reason:T.reason,error:T.message??T.reason})),Ne&&(K.remoteSessionId=void 0),K.status=K.mobileConnected?"active":"running",K.error=void 0,K.failure=void 0,t.set(L,K),V(K))}e.disposeWorkspaceHostAttachmentsForRemoteSession(h,b)}}}s(Hb,"createWebRemoteControlManager");p();m();import{createHash as VW,createHmac as GW,randomBytes as KW}from"crypto";function zb(){return{createPassword:s(()=>KW(24).toString("base64url"),"createPassword"),createPassHash:s(e=>VW("sha256").update(e).digest("base64"),"createPassHash"),calculateProof:s((e,t,r,o)=>GW("sha256",e).update(`${t}|${r}|${o}`).digest("base64url"),"calculateProof")}}s(zb,"createNodeWebRemoteControlRelayAuthProvider");p();m();var ml="web-remote-control:external-relay:pass_hash";function fl(e){let t=e.deviceSid?.trim();return{hasDeviceSid:!!t,deviceSidSuffix:t?t.slice(-6):void 0,hasPassHash:!!e.passHash?.trim()}}s(fl,"safeAuthLogFields");function Vb({credentialService:e,loadSettings:t,patchSettings:r,logger:o}){let n=s(async()=>{await r({webRemoteControlExternalRelayDevice:void 0}),await e.delete(ml),o?.info("[web-remote-control] external relay auth cleared",{hasDeviceSid:!1,hasPassHash:!1})},"clear");return{async load(){let a=(await t()).webRemoteControlExternalRelayDevice?.deviceSid.trim(),c=(await e.load(ml))?.trim();if(!(!a&&!c)){if(!a||!c){o?.warn("[web-remote-control] external relay auth partial state cleared",{hasDeviceSid:!!a,hasPassHash:!!c}),await n();return}return o?.info("[web-remote-control] external relay auth loaded",{...fl({deviceSid:a,passHash:c})}),{deviceSid:a,passHash:c}}},async save(i){await r({webRemoteControlExternalRelayDevice:{deviceSid:i.deviceSid}}),await e.save(ml,i.passHash),o?.info("[web-remote-control] external relay auth saved",{...fl(i)})},clear:n,async rotate(i){await n(),await this.save(i),o?.info("[web-remote-control] external relay auth rotated",{...fl(i)})}}}s(Vb,"createWebRemoteControlRelayAuthStorageProvider");p();m();function Gb(e=!0){return{isEnabled:s(()=>e,"isEnabled"),assertEnabled:s(()=>{if(!e)throw new Error("Web remote control is disabled in this build")},"assertEnabled")}}s(Gb,"createWebRemoteControlFeatureGate");p();m();import{BrowserWindow as ZW,ipcMain as Kb}from"electron";function qb(e,t){let r=ZW.fromId(e);if(!r||r.isDestroyed())throw new Error("Desktop window is not available for Web remote control reconnect.");let o={requestId:`web-remote-reconnect-${Date.now()}-${Math.random().toString(36).slice(2)}`,workspaceKey:t};return new Promise((n,i)=>{let a=s(()=>{clearTimeout(c),Kb.removeListener(k.WebRemoteControlReconnectWorkspace,d)},"dispose"),c=setTimeout(()=>{a(),i(new Error("Web remote control reconnect request timed out."))},12e4),d=s((l,u)=>{if(l.sender.id!==r.webContents.id)return;let g=qp.safeParse(u);if(!(!g.success||g.data.requestId!==o.requestId)){if(a(),g.data.success){n();return}i(new Error(g.data.error))}},"handleResult");Kb.on(k.WebRemoteControlReconnectWorkspace,d),r.webContents.send(k.WebRemoteControlReconnectWorkspace,o)})}s(qb,"reconnectWebRemoteControlWorkspaceInRenderer");p();m();function Zb(e,t){!e||e.isDestroyed()||e.webContents.isDestroyed()||e.webContents.send(k.WebRemoteControlStatusChanged,t)}s(Zb,"sendWebRemoteControlStatusChangedToWindow");p();m();import{readFile as q0}from"fs/promises";import{join as tS}from"path";import{app as oa,BrowserWindow as Un,dialog as Il,session as rS,shell as El}from"electron";p();m();import{existsSync as Yb,readFileSync as jW}from"fs";import{arch as JW,hostname as YW,platform as XW,release as QW,type as eL,version as tL}from"os";import{join as Vi}from"path";p();m();function sr(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}s(sr,"escapeHtml");function jb(e){return`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'"
    />
    <title>${sr(e.applicationName)}</title>
    <style>
      :root {
        color-scheme: light dark;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif;
        --startup-page-bg: #f4f4f5;
        --about-primary: #0a0a0a;
        --about-primary-foreground: #fafafa;
        --about-primary-active: color-mix(in oklab, var(--about-primary) 80%, transparent);
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        width: 100%;
        height: 100%;
        margin: 0;
        overflow: hidden;
        background: var(--startup-page-bg);
      }

      body {
        display: grid;
        place-items: center;
        padding: 0;
        user-select: none;
      }

      .about-window {
        width: 100%;
        max-width: 256px;
        height: 280px;
        display: grid;
        place-items: stretch;
        padding: 0;
        background: transparent;
      }

      .about-card {
        width: 100%;
        height: 100%;
        padding: 22px 15px 14px;
        display: flex;
        flex-direction: column;
        border: 0;
        border-radius: 0;
        background: transparent;
        color: #1d1d1f;
        box-shadow: none;
        -webkit-app-region: drag;
      }

      .content {
        width: 100%;
        max-width: 222px;
        margin: 0 auto;
        flex: 1;
        min-height: 0;
      }

      .app-icon {
        width: 52px;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        background: linear-gradient(180deg, #000000 0%, #151718 100%);
        color: #ffffff;
        box-shadow: 0 10px 13px -3px rgb(0 0 0 / 0.2), 0 4px 5px -3px rgb(0 0 0 / 0.2);
      }

      .app-logo {
        width: 30px;
        height: auto;
        display: block;
      }

      .title {
        margin: 20px 0 0;
        font-size: 13.5px;
        line-height: 1.18;
        font-weight: 700;
        letter-spacing: 0;
      }

      .meta {
        margin-top: 28px;
        display: flex;
        flex-direction: column;
        gap: 17px;
        font-size: 13px;
        line-height: 1.2;
        font-weight: 400;
        letter-spacing: 0;
        color: #303033;
      }


      .ok-button {
        width: 100%;
        height: 36px;
        border: 0;
        border-radius: 18px;
        background: var(--about-primary);
        color: var(--about-primary-foreground);
        font: inherit;
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 0;
        outline: none;
        cursor: default;
        -webkit-app-region: no-drag;
      }

      .ok-button:active {
        background: var(--about-primary-active);
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --startup-page-bg: #171717;
          --about-primary: #fafafa;
          --about-primary-foreground: #0a0a0a;
          --about-primary-active: color-mix(in oklab, var(--about-primary) 80%, transparent);
        }

        .about-card {
          color: #e8e8e8;
        }

        .meta {
          color: #e2e2e2;
        }
      }
    </style>
  </head>
  <body>
    <main class="about-window" aria-label="${sr(e.applicationName)} About Window">
      <section class="about-card" role="dialog" aria-modal="true" aria-labelledby="about-ti