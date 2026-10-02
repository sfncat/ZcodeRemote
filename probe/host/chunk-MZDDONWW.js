import{a as Ee,b as Q}from"./chunk-LL2TIAQ2.js";import{A as Y,Ae as it,Gb as rr,Ib as nr,Lf as pr,Sf as ct,Ta as er,id as O,le as U,lf as at,me as sr,mf as ur,ne as or,nf as dt,oe as ir,of as lr,q as Vt,se as ar,t as zt,u as Jt,ub as nt,v as Yt,vd as st,ve as dr,w as rt,x as Qt,xb as tr,ye as cr,zd as ke,ze as ot}from"./chunk-AIU63WBB.js";import{b as L}from"./chunk-UHHNTW2R.js";import{a as i,e as f}from"./chunk-IYVG6UP7.js";f();f();f();import{createHash as ft}from"crypto";f();var ut=`
      CREATE TABLE IF NOT EXISTS tasks (
        workspace_key TEXT NOT NULL,
        workspace_path TEXT NOT NULL,
        workspace_identity TEXT,
        task_id TEXT NOT NULL,
        title TEXT NOT NULL DEFAULT '',
        task_status TEXT,
        provider TEXT,
        mode TEXT NOT NULL DEFAULT 'build',
        model TEXT,
        migration_source TEXT,
        forked_from_task_id TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        unread_at INTEGER,
        last_unread_at INTEGER NOT NULL DEFAULT 0,
        pinned INTEGER NOT NULL DEFAULT 0,
        archived INTEGER NOT NULL DEFAULT 0,
        deleted INTEGER NOT NULL DEFAULT 0,
        title_overridden INTEGER NOT NULL DEFAULT 0,
        meta_json TEXT NOT NULL DEFAULT '{}',
        PRIMARY KEY (workspace_key, task_id)
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_workspace_archived_updated
      ON tasks (workspace_key, archived, updated_at DESC)
      WHERE deleted = 0;

      CREATE INDEX IF NOT EXISTS idx_tasks_workspace_pinned_updated
      ON tasks (workspace_key, pinned, updated_at DESC)
      WHERE deleted = 0;

      CREATE TABLE IF NOT EXISTS task_groups (
        group_id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        color TEXT NOT NULL DEFAULT 'gray',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS task_group_members (
        group_id TEXT NOT NULL,
        workspace_key TEXT NOT NULL,
        workspace_path TEXT NOT NULL,
        workspace_identity TEXT,
        task_id TEXT NOT NULL,
        sort_order INTEGER,
        added_at INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (workspace_key, task_id),
        FOREIGN KEY (group_id) REFERENCES task_groups(group_id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS task_group_view_node_orders (
        node_type TEXT NOT NULL,
        node_key TEXT NOT NULL,
        sort_order INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        PRIMARY KEY (node_type, node_key)
      );

      CREATE TABLE IF NOT EXISTS task_group_workspace_bootstraps (
        workspace_key TEXT PRIMARY KEY,
        group_id TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_task_group_members_group_order
      ON task_group_members (group_id, sort_order, added_at);

      CREATE INDEX IF NOT EXISTS idx_task_group_view_node_orders_order
      ON task_group_view_node_orders (sort_order, created_at);
    `,lt=`
      CREATE TABLE IF NOT EXISTS automations (
        automation_id TEXT PRIMARY KEY,
        title TEXT NOT NULL DEFAULT '',
        cron_expr TEXT NOT NULL,
        prompt TEXT NOT NULL,
        model TEXT,
        provider TEXT,
        mode TEXT,
        thought_level TEXT,
        model_selection TEXT,
        workspace_key TEXT NOT NULL,
        workspace_path TEXT NOT NULL,
        workspace_identity TEXT,
        target_task_id TEXT,
        bot_delivery_target TEXT,
        location_kind TEXT NOT NULL DEFAULT 'local',
        recurring INTEGER NOT NULL DEFAULT 1,
        max_runs INTEGER,
        end_at INTEGER,
        schedule_rule TEXT,
        schedule_edited_by_user INTEGER NOT NULL DEFAULT 0,
        run_count INTEGER NOT NULL DEFAULT 0,
        scheduled_run_count INTEGER NOT NULL DEFAULT 0,
        enabled INTEGER NOT NULL DEFAULT 1,
        lifecycle_status TEXT NOT NULL DEFAULT 'active',
        next_run_at INTEGER,
        last_run_at INTEGER,
        running INTEGER NOT NULL DEFAULT 0,
        claimed_at INTEGER,
        dispatch_status TEXT NOT NULL DEFAULT 'idle',
        dispatch_attempts INTEGER NOT NULL DEFAULT 0,
        retry_at INTEGER,
        last_error TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_automations_due
      ON automations (enabled, next_run_at);

      CREATE INDEX IF NOT EXISTS idx_automations_retry
      ON automations (enabled, retry_at);

      CREATE INDEX IF NOT EXISTS idx_automations_workspace
      ON automations (workspace_key);

      CREATE TABLE IF NOT EXISTS automation_runs (
        run_id TEXT PRIMARY KEY,
        automation_id TEXT NOT NULL,
        workspace_key TEXT NOT NULL,
        scheduled_at INTEGER,
        trigger TEXT NOT NULL DEFAULT 'schedule',
        model_selection TEXT,
        dispatch_status TEXT NOT NULL DEFAULT 'claimed',
        outcome TEXT,
        session_id TEXT,
        error TEXT,
        attempts INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_automation_runs_by_automation
      ON automation_runs (automation_id, created_at DESC);
    `,pt=`
      CREATE TABLE IF NOT EXISTS off_peak_tasks (
        off_peak_task_id   TEXT PRIMARY KEY,
        server_ticket_id   TEXT,
        title              TEXT NOT NULL DEFAULT '',
        conversation_id    TEXT,
        session_id         TEXT,
        prompt             TEXT NOT NULL,
        permission_mode    TEXT NOT NULL,
        model              TEXT,
        thought_level      TEXT,
        model_selection    TEXT,
        workspace_key      TEXT NOT NULL,
        workspace_path     TEXT NOT NULL,
        workspace_identity TEXT,
        status             TEXT NOT NULL,
        queued_at          INTEGER NOT NULL,
        started_at         INTEGER,
        ended_at           INTEGER,
        failure_reason     TEXT,
        files_changed      INTEGER,
        settled_at         INTEGER,
        history_deleted_at INTEGER,
        registered_at      INTEGER,
        schedulable        INTEGER NOT NULL DEFAULT 0,
        queue_position     INTEGER,
        next_poll_at       INTEGER,
        claim_running      INTEGER NOT NULL DEFAULT 0,
        claimed_at         INTEGER,
        attempt_count      INTEGER NOT NULL DEFAULT 0,
        last_error         TEXT,
        created_at         INTEGER NOT NULL,
        updated_at         INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_off_peak_pick
      ON off_peak_tasks (status, queued_at);

      CREATE INDEX IF NOT EXISTS idx_off_peak_ws
      ON off_peak_tasks (workspace_key, status);
    `;f();var Un={"builtin:bigmodel":"bigmodel-api","builtin:zai":"zai-api","builtin:bigmodel-start-plan":"account:bigmodel-start-plan","builtin:zai-start-plan":"account:zai-start-plan","builtin:bigmodel-coding-plan":"account:bigmodel-individual-coding-plan","builtin:zai-coding-plan":"account:zai-individual-coding-plan"};function _t(r){try{return decodeURIComponent(r)}catch{return r}}i(_t,"decodeComponent");function Zn(r){let e=r.model?.trim();if(!e)return;let t=r.provider?.trim()??"",n=e,s=r.thought_level?.trim();if(e.startsWith("custom:")){let d=e.slice(7),a=d.indexOf(":");if(a<0)return;let c=d.split(":");c.length>=3&&c[0]==="builtin"?(t=`builtin:${c[1]}`,n=_t(c.slice(2).join(":"))):(t=_t(d.slice(0,a)),n=_t(d.slice(a+1)))}else if(e.includes("/")){let d=e.indexOf("/");t=e.slice(0,d),n=e.slice(d+1);let a=n.indexOf("$");if(a>0&&a<n.length-1){if(s=n.slice(a+1).trim(),!s)return;n=n.slice(0,a)}}else if(["glm","zcode"].includes(t))return;if(t=t.trim(),n=n.trim(),!t||!n)return;let o=t.startsWith("builtin:")?Un[t]:t;if(o)return{providerId:o,modelId:n,...s?{options:{reasoningLevel:s}}:{}}}i(Zn,"decodeLegacySelection");function _r(r){let e=r.prepare("SELECT automation_id, model, provider, thought_level FROM automations WHERE model IS NOT NULL").all();for(let t of e){let n=Zn(t);if(!n){t.model?.trim()&&r.prepare("UPDATE automations SET model_selection=NULL WHERE automation_id=?").run(t.automation_id);continue}r.prepare(`UPDATE automations SET model_selection = ?
       WHERE automation_id = ?
         AND model IS ? AND provider IS ? AND thought_level IS ?`).run(JSON.stringify(n),t.automation_id,t.model,t.provider,t.thought_level)}r.exec(`UPDATE automations SET model_selection='null'
    WHERE model_selection IS NULL AND (model IS NULL OR trim(model)='')`)}i(_r,"importLegacyAutomationSelections");f();var mt=`
UPDATE automations
SET model_selection = json_set(model_selection, '$.modelId',
  CASE lower(json_extract(model_selection, '$.modelId'))
    WHEN 'glm-5.3' THEN 'GLM-5.3'
    WHEN 'glm-5.3-flash' THEN 'GLM-5.3-Flash'
    WHEN 'glm-5v-turbo' THEN 'GLM-5V-Turbo'
    WHEN 'glm-5.2' THEN 'GLM-5.2'
    WHEN 'glm-5.1' THEN 'GLM-5.1'
    WHEN 'glm-5.1-highspeed' THEN 'GLM-5.1-Highspeed'
    WHEN 'glm-5' THEN 'GLM-5'
    WHEN 'glm-5-turbo' THEN 'GLM-5-Turbo'
    WHEN 'glm-4.7' THEN 'GLM-4.7'
    WHEN 'glm-4.7-flashx' THEN 'GLM-4.7-FlashX'
    WHEN 'glm-4.7-flash' THEN 'GLM-4.7-Flash'
    WHEN 'glm-4.6' THEN 'GLM-4.6'
    WHEN 'glm-4.5-air' THEN 'GLM-4.5-Air'
    WHEN 'glm-4.5' THEN 'GLM-4.5'
    WHEN 'glm-4.6v' THEN 'GLM-4.6V'
    WHEN 'glm-4.6v-flash' THEN 'GLM-4.6V-Flash'
    WHEN 'glm-4.6v-flashx' THEN 'GLM-4.6V-FlashX'
    WHEN 'glm-4.1v-thinking-flashx' THEN 'GLM-4.1V-Thinking-FlashX'
    WHEN 'glm-4.1v-thinking-flash' THEN 'GLM-4.1V-Thinking-Flash'
    WHEN 'glm-4-flashx-250414' THEN 'GLM-4-FlashX-250414'
    WHEN 'glm-4-flash-250414' THEN 'GLM-4-Flash-250414'
    WHEN 'glm-4v-flash' THEN 'GLM-4V-Flash'
    ELSE json_extract(model_selection, '$.modelId')
  END)
WHERE CASE WHEN json_valid(model_selection) THEN
  json_extract(model_selection, '$.providerId') IN ('account:zai-start-plan', 'account:bigmodel-start-plan', 'account:zai-individual-coding-plan', 'account:bigmodel-individual-coding-plan', 'account:zai-team-coding-plan', 'account:bigmodel-team-coding-plan')
  AND lower(json_extract(model_selection, '$.modelId')) IN ('glm-5.3', 'glm-5.3-flash', 'glm-5v-turbo', 'glm-5.2', 'glm-5.1', 'glm-5.1-highspeed', 'glm-5', 'glm-5-turbo', 'glm-4.7', 'glm-4.7-flashx', 'glm-4.7-flash', 'glm-4.6', 'glm-4.5-air', 'glm-4.5', 'glm-4.6v', 'glm-4.6v-flash', 'glm-4.6v-flashx', 'glm-4.1v-thinking-flashx', 'glm-4.1v-thinking-flash', 'glm-4-flashx-250414', 'glm-4-flash-250414', 'glm-4v-flash')
  ELSE 0 END;
`;var mr=[["tasks","title_overridden","INTEGER NOT NULL DEFAULT 0"],["tasks","last_unread_at","INTEGER NOT NULL DEFAULT 0"],["tasks","searchable_text","TEXT NOT NULL DEFAULT ''"],["tasks","cron_automation_id","TEXT"],["tasks","off_peak_task_id","TEXT"],["automations","target_task_id","TEXT"],["automations","bot_delivery_target","TEXT"],["automations","mode","TEXT"],["automations","end_at","INTEGER"],["automations","schedule_rule","TEXT"],["automations","schedule_edited_by_user","INTEGER NOT NULL DEFAULT 0"],["automations","thought_level","TEXT"],["automations","model_selection","TEXT"],["automations","scheduled_run_count","INTEGER NOT NULL DEFAULT 0"],["automation_runs","model_selection","TEXT"],["off_peak_tasks","thought_level","TEXT"],["off_peak_tasks","model_selection","TEXT"],["off_peak_tasks","history_deleted_at","INTEGER"]],fr=`
  CREATE INDEX IF NOT EXISTS idx_tasks_cron_automation ON tasks(cron_automation_id, updated_at DESC)
    WHERE cron_automation_id IS NOT NULL AND deleted=0;
  CREATE INDEX IF NOT EXISTS idx_tasks_off_peak_task ON tasks(off_peak_task_id, updated_at DESC)
    WHERE off_peak_task_id IS NOT NULL AND deleted=0;
  CREATE INDEX IF NOT EXISTS idx_automations_target_task ON automations(target_task_id) WHERE target_task_id IS NOT NULL;
`,Fn="'completed','failed','cancelled'",gr=`session_id IS NOT NULL AND status NOT IN (${Fn})`,hr=`CREATE UNIQUE INDEX IF NOT EXISTS idx_off_peak_bound_active ON off_peak_tasks(workspace_key,session_id) WHERE ${gr}`,gt=[{id:"0001_adopt_task_schema",checksumInput:[ut,lt,pt,mr,fr,hr,"scheduled-count-backfill-v1"]},{id:"0002_provider_selection",checksumInput:["legacy-automation-selection-v1","no-provider-for-legacy-off-peak-v1"]},{id:"0003_official_glm_selection",checksumInput:[mt]}];function B(r,e={}){e.transactionOpen||r.exec("BEGIN IMMEDIATE");let t=e.migration??{kind:"none",executedCount:0,committedCount:0},n;try{e.migration||(t.kind=kt(r)),r.exec(`CREATE TABLE IF NOT EXISTS tasks_schema_migration (
      id TEXT PRIMARY KEY, checksum TEXT NOT NULL, time_applied INTEGER NOT NULL
    )`);let s=r.prepare("SELECT id FROM tasks_schema_migration ORDER BY id DESC LIMIT 1").get();t.lastAppliedMigrationId=s?Vt.safeParse(s.id).data:null;for(let o of gt){n=o.id;let d=ft("sha256").update(JSON.stringify(o.checksumInput)).digest("hex"),a=r.prepare("SELECT checksum FROM tasks_schema_migration WHERE id=?").get(o.id);if(a){if(a.checksum!==d)throw Object.assign(new Error(`Task database migration checksum mismatch: ${o.id}`),{kind:"checksum_mismatch"});continue}t.kind==="none"&&(t.kind="upgrade"),e.onProgress?.("migrating",{...t}),o.id==="0001_adopt_task_schema"?Hn(r):o.id==="0002_provider_selection"?_r(r):r.exec(mt),t.executedCount++,r.prepare("INSERT INTO tasks_schema_migration VALUES(?,?,?)").run(o.id,d,Date.now())}e.onProgress?.("committing",{...t}),r.exec("COMMIT"),t.committedCount=t.executedCount}catch(s){try{r.isTransaction&&r.exec("ROLLBACK")}catch{}throw s&&typeof s=="object"&&n&&Object.assign(s,{migrationId:n}),s}}i(B,"runTasksDatabaseMigrations");function Hn(r){r.exec(ut+lt+pt);for(let[t,n,s]of mr)r.prepare(`PRAGMA table_info(${t})`).all().some(d=>d.name===n)||(r.exec(`ALTER TABLE ${t} ADD COLUMN ${n} ${s}`),t==="automations"&&n==="scheduled_run_count"&&r.exec("UPDATE automations SET scheduled_run_count=run_count"));r.exec(fr),r.prepare(`SELECT 1 FROM off_peak_tasks WHERE ${gr}
    GROUP BY workspace_key, session_id HAVING count(*)>1 LIMIT 1`).get()||r.exec(hr)}i(Hn,"adoptSchema");function ht(r){if(!r.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='tasks_schema_migration'").get())return!1;for(let e of gt){let t=r.prepare("SELECT checksum FROM tasks_schema_migration WHERE id=?").get(e.id);if(!t)return!1;let n=ft("sha256").update(JSON.stringify(e.checksumInput)).digest("hex");if(t.checksum!==n)throw Object.assign(new Error(`Task database migration checksum mismatch: ${e.id}`),{kind:"checksum_mismatch"})}return!0}i(ht,"areTasksDatabaseMigrationsApplied");function kt(r){let e=r.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='tasks_schema_migration'").get(),t=!1;for(let n of gt){let s=e?r.prepare("SELECT checksum FROM tasks_schema_migration WHERE id=?").get(n.id):void 0;if(!s)t=!0;else if(s.checksum!==ft("sha256").update(JSON.stringify(n.checksumInput)).digest("hex"))throw Object.assign(new Error(`Task database migration checksum mismatch: ${n.id}`),{kind:"checksum_mismatch",migrationId:n.id})}return t?r.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name NOT IN ('tasks_schema_migration', 'sqlite_sequence') LIMIT 1").get()?"upgrade":"initialize":"none"}i(kt,"inspectTasksMigrationKind");var Et=new Set,kr=new Set;function Er(r){Et.add(r)}i(Er,"markTasksStorageMigrated");function Tt(r){Et.add(r),kr.add(r)}i(Tt,"markTasksStoragePrepared");function ee(r,e){return Et.has(r)&&ht(e)}i(ee,"isTasksStorageMigrated");function te(r,e){return kr.has(r)&&ht(e)}i(te,"isTasksStoragePrepared");import{mkdir as rs}from"fs/promises";import{createRequire as ns}from"module";import{dirname as ss}from"path";import{randomUUID as Pr}from"crypto";f();import{copyFileSync as _a,existsSync as ma,lstatSync as Bn,mkdirSync as fa,readFileSync as ga,unlinkSync as ha,writeFileSync as ka}from"fs";import{cp as $n}from"fs/promises";import{createHash as Kn}from"crypto";import{basename as qn,join as b,win32 as re}from"path";import{homedir as Xn}from"os";f();import{readFileSync as sa,writeFileSync as oa}from"fs";var jn={claude:{nativeConfigDir:".claude",nativeConfigFileName:"settings.json"},opencode:{nativeConfigDir:".config/opencode",nativeConfigFileName:"opencode.json"},gemini:{nativeConfigDir:".gemini",nativeConfigFileName:"settings.json",nativeConfigExtraFiles:["oauth_creds.json","google_accounts.json"]},codex:{nativeConfigDir:".codex",nativeConfigFileName:"config.toml"},glm:{nativeConfigDir:U.nativeConfigDir,nativeConfigFileName:U.nativeConfigFileName}},Tr=null,Vn="ZCODE_WINDOWS_APP_INSTALL_DIR",yr=process.env.ZCODE_DATA_BASE_DIR?.trim()||null,zn=process.env.HOME?.trim()||Xn();function Te(){return Tr||yr||zn}i(Te,"getDataBaseDir");function ye(){return b(Te(),".zcode")}i(ye,"getZCodeDataRootDir");function Sa(){return b(ye(),"workspace","default")}i(Sa,"getConversationWorkspaceDir");function ne(){return b(ye(),"v2")}i(ne,"getAppConfigDir");function de(r,e){let t=r[e]?.trim();if(t)return t;let n=e.toLowerCase();for(let[s,o]of Object.entries(r)){if(s.toLowerCase()!==n)continue;let d=o?.trim();if(d)return d}}i(de,"readEnvValue");function yt(r){let e=r.trim();if(!e)return null;let t=re.normalize(e).replace(/[\\/]+$/,"");return t?re.resolve(t).replace(/[\\/]+$/,"").toLowerCase():null}i(yt,"normalizeWindowsComparablePath");function Jn(r,e){let t=yt(r),n=yt(e);return!t||!n?!1:t===n||t.startsWith(`${n}\\`)}i(Jn,"isWindowsPathEqualOrInside");function Yn(r){let e=r.env,t=de(e,"ProgramFiles"),n=de(e,"ProgramFiles(x86)"),s=de(e,"ProgramW6432"),o=de(e,"LOCALAPPDATA"),d=[r.appInstallDir,de(e,Vn),t?re.join(t,"ZCode"):null,n?re.join(n,"ZCode"):null,s?re.join(s,"ZCode"):null,o?re.join(o,"Programs","ZCode"):null],a=new Set,c=[];for(let u of d){let _=typeof u=="string"?yt(u):null;!u||!_||a.has(_)||(a.add(_),c.push(u))}return c}i(Yn,"collectWindowsForbiddenAppInstallDirs");function Aa(r,e={}){if((e.platform??process.platform)!=="win32")return{ok:!0};for(let t of Yn({env:e.env??process.env,appInstallDir:e.appInstallDir??null}))if(Jn(r,t))return{ok:!1,code:pr,forbiddenDir:t};return{ok:!0}}i(Aa,"validateDataBaseDirTarget");function wr(){return b(ye(),"feedback")}i(wr,"getFeedbackRootDir");function Ia(){return b(wr(),"attachments")}i(Ia,"getFeedbackAttachmentDir");function Ca(){return b(wr(),"logs")}i(Ca,"getFeedbackLogArchiveDir");function va(){return b(ye(),"git-checkpoint-index")}i(va,"getGitCheckpointIndexRootDir");function j(){return b(ne(),"tasks-index.sqlite")}i(j,"getTasksIndexDatabasePath");function Qn(r,e){return e?.trim()||r}i(Qn,"getWorkspaceKey");function wt(r,e){return Kn("sha256").update(Qn(r,e)).digest("hex").slice(0,12)}i(wt,"getWorkspaceHash");function Rr(r,e){return b(ne(),"sessions",wt(r,e))}i(Rr,"getTaskSessionDir");function ba(r,e,t){return b(Rr(r,t),`${e}.json`)}i(ba,"getLegacyTaskSessionSnapshotPath");function Na(r,e,t){return b(Rr(r,t),`${e}.deleted.json`)}i(Na,"getLegacyDeletedTaskSessionSnapshotPath");function es(r,e,t){if(r==="gemini")return b(ts(r,e,t),".gemini");if(r==="glm"){let n=jn.glm;return n.nativeConfigDir?b(Te(),n.nativeConfigDir):b(Te(),".zcode","cli")}return b(ne(),"agent-config",r,wt(e,t))}i(es,"getProviderWorkspaceConfigDir");function ts(r,e,t){return b(ne(),"agent-config",r,wt(e,t))}i(ts,"getProviderWorkspaceZCodeConfigIsolationDir");async function Oa(r,e){let t=b(r,".zcode","v2"),n=b(e,".zcode","v2");await $n(t,n,{recursive:!0,force:!1,filter:i(s=>{let o=qn(s);if(o==="setting.json"||o.startsWith("setting.json."))return!1;try{if(Bn(s).isSymbolicLink())return!1}catch{}return!0},"filter")})}i(Oa,"copyDataDirectory");var os=ns(import.meta.url),{DatabaseSync:is}=os("node:sqlite"),as=3e4,ds=15*6e4,cs=5,we=10*6e4,Rt=class extends Error{static{i(this,"AutomationCreateLimitError")}code=dt;constructor(){super(`[${dt}] At most ${20} automations may be retained. Delete an existing automation before creating another.`),this.name="AutomationCreateLimitError"}};function V(r){let e=Ir(r);return{automationId:r.automation_id,title:r.title,cronExpr:r.cron_expr,prompt:r.prompt,...e?{modelSelection:e}:{},mode:us(r.mode),workspaceKey:r.workspace_key,workspacePath:r.workspace_path,workspaceIdentity:r.workspace_identity??void 0,targetTaskId:r.target_task_id??void 0,locationKind:r.location_kind==="remote"?"remote":"local",recurring:r.recurring===1,maxRuns:r.max_runs??void 0,endAt:r.end_at??void 0,scheduleRule:r.schedule_rule?JSON.parse(r.schedule_rule):void 0,...r.schedule_edited_by_user===1?{scheduleEditedByUser:!0}:{},runCount:r.run_count,enabled:r.enabled===1,lifecycleStatus:r.lifecycle_status,nextRunAt:r.next_run_at??void 0,lastRunAt:r.last_run_at??void 0,dispatchStatus:r.dispatch_status,dispatchAttempts:r.dispatch_attempts,retryAt:r.retry_at??void 0,lastError:r.last_error??void 0,createdAt:r.created_at,updatedAt:r.updated_at}}i(V,"rowToAutomation");function Ir(r){return Pt(r.model_selection)}i(Ir,"readAutomationModelSelection");function Re(r){if(!r)return null;let e=r.options,t=Y.parse({providerId:r.providerId,modelId:r.modelId,...e&&Object.keys(e).length>0?{options:e}:{}});return JSON.stringify(t)}i(Re,"serializeAutomationModelSelection");function us(r){let e=nt.safeParse(r);return e.success?e.data:void 0}i(us,"normalizeAutomationMode");function Sr(r){if(r!=null&&!nt.safeParse(r).success)throw new Error(`Invalid automation mode: ${String(r)}`)}i(Sr,"assertValidAutomationMode");function Pe(r){let e=Pt(r.model_selection);return{runId:r.run_id,automationId:r.automation_id,workspaceKey:r.workspace_key,scheduledAt:r.scheduled_at??void 0,trigger:r.trigger,...e?{modelSelection:e}:{},dispatchStatus:r.dispatch_status,outcome:r.outcome??void 0,sessionId:r.session_id??void 0,error:r.error??void 0,attempts:r.attempts,createdAt:r.created_at,updatedAt:r.updated_at}}i(Pe,"rowToRun");function Pt(r){if(r)try{let e=Y.safeParse(JSON.parse(r));return e.success?e.data:void 0}catch{return}}i(Pt,"readSerializedModelSelection");function ls(r,e){let t=Math.min(as*2**Math.max(0,e-1),ds);return r+t}i(ls,"computeRetryAt");var Se=class{constructor(e,t=5e3){this.startupBusyTimeoutMs=t;this.resolvedDbPath=e?.trim()||null}startupBusyTimeoutMs;static{i(this,"AutomationRepo")}db=null;dbPath=null;initializePromise=null;resolvedDbPath;resolveDbPath(){return this.resolvedDbPath??j()}async ensureReady(){let e=this.resolveDbPath();this.dbPath&&this.dbPath!==e&&this.close(),this.initializePromise||(this.initializePromise=this.initialize(e).catch(t=>{throw this.close(),t})),await this.initializePromise}close(e){let t;try{this.db?.close()}catch(n){t=n}if(this.db=null,this.dbPath=null,this.initializePromise=null,e?.throwOnError&&t)throw t}async initialize(e){await rs(ss(e),{recursive:!0}),this.db||(this.db=new is(e),this.dbPath=e,this.db.exec(`PRAGMA busy_timeout = ${this.startupBusyTimeoutMs}`),this.db.exec("PRAGMA journal_mode = WAL"),this.db.exec("PRAGMA synchronous = NORMAL")),!te(e,this.db)&&(ee(e,this.db)||B(this.db))}getDatabase(){if(!this.db)throw new Error("AutomationRepo \u672A\u521D\u59CB\u5316\uFF1A\u8BF7\u5148 await ensureReady()");return this.db}getRow(e,t){return this.getDatabase().prepare(`SELECT * FROM automations
        WHERE automation_id = @id
          AND (@workspace_key IS NULL OR workspace_key = @workspace_key)`).get({id:e,workspace_key:t??null})??null}async create(e,t){Sr(e.mode),await this.ensureReady();let n=Date.now(),s=`automation-${Pr()}`,o=O({workspacePath:e.workspacePath,workspaceIdentity:e.workspaceIdentity}),d=this.getDatabase();d.exec("BEGIN IMMEDIATE");try{let a=d.prepare("SELECT COUNT(*) AS count FROM automations").get();if(Number(a.count)>=20)throw new Rt;d.prepare(`INSERT INTO automations (
          automation_id, title, cron_expr, prompt, model, provider, model_selection,
          workspace_key, workspace_path, workspace_identity, target_task_id, bot_delivery_target, location_kind,
          recurring, max_runs, end_at, schedule_rule, schedule_edited_by_user,
          run_count, enabled, lifecycle_status,
          next_run_at, last_run_at, running, claimed_at,
          dispatch_status, dispatch_attempts, retry_at, last_error,
          mode, thought_level,
          created_at, updated_at
        ) VALUES (
          @automation_id, @title, @cron_expr, @prompt, @model, @provider, @model_selection,
          @workspace_key, @workspace_path, @workspace_identity, @target_task_id, @bot_delivery_target, 'local',
          @recurring, @max_runs, @end_at, @schedule_rule, 0,
          0, @enabled, @lifecycle_status,
          @next_run_at, NULL, 0, NULL,
          'idle', 0, NULL, NULL,
          @mode, @thought_level,
          @created_at, @updated_at
        )`).run({automation_id:s,title:e.title,cron_expr:e.cronExpr,prompt:e.prompt,model:null,provider:null,model_selection:Re(e.modelSelection)??"null",mode:e.mode??null,thought_level:null,workspace_key:o,workspace_path:e.workspacePath,workspace_identity:e.workspaceIdentity??null,target_task_id:e.targetTaskId??null,bot_delivery_target:e.botDeliveryTarget?JSON.stringify(e.botDeliveryTarget):null,recurring:e.recurring?1:0,max_runs:e.maxRuns??null,end_at:e.endAt??null,schedule_rule:e.scheduleRule?JSON.stringify(e.scheduleRule):null,enabled:t.lifecycleStatus==="completed"?0:1,lifecycle_status:t.lifecycleStatus??"active",next_run_at:t.nextRunAt,created_at:n,updated_at:n}),d.exec("COMMIT")}catch(a){throw d.exec("ROLLBACK"),a}return V(this.getRow(s))}async list(e){await this.ensureReady();let t=e?.workspacePath?O({workspacePath:e.workspacePath,workspaceIdentity:e.workspaceIdentity}):null;return this.getDatabase().prepare(`SELECT * FROM automations
        WHERE (@workspace_key IS NULL OR workspace_key = @workspace_key)
        ORDER BY created_at DESC`).all({workspace_key:t}).map(V)}async getModelSelectionForDispatch(e,t){await this.ensureReady();let n=this.getRow(e,t);if(!n)throw new Error("Automation \u4E0D\u5B58\u5728\u6216\u4E0D\u5C5E\u4E8E\u5F53\u524D\u5DE5\u4F5C\u533A");let s=Ir(n);if(s)return s;if(!(n.model_selection==="null"))throw new Error("Automation \u6A21\u578B\u9009\u62E9\u4E0D\u53EF\u7528\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u6A21\u578B\u4E0E\u601D\u8003\u6863\u4F4D")}async getBotDeliveryTarget(e,t){await this.ensureReady();let n=this.getRow(e,t)?.bot_delivery_target;if(n)try{let s=er.safeParse(JSON.parse(n));return s.success?s.data:void 0}catch{return}}async hasTaskBinding(e){await this.ensureReady();let t=O(e);return this.getDatabase().prepare(`SELECT 1 AS bound FROM automations
        WHERE workspace_key = @workspace_key AND target_task_id = @target_task_id
        LIMIT 1`).get({workspace_key:t,target_task_id:e.targetTaskId})!==void 0}async get(e,t){await this.ensureReady();let n=this.getRow(e,t);return n?V(n):null}async getScheduledRunCount(e,t){return await this.ensureReady(),this.getRow(e,t)?.scheduled_run_count??null}async update(e,t,n,s){Sr(t.mode),await this.ensureReady();let o=this.getRow(e,s);if(!o)return null;let d=Date.now(),a={...o,title:t.title??o.title,cron_expr:t.cronExpr??o.cron_expr,prompt:t.prompt??o.prompt,model:o.model,provider:o.provider,model_selection:t.modelSelection===void 0?o.model_selection:Re(t.modelSelection??void 0)??"null",mode:t.mode===void 0?o.mode:t.mode,thought_level:o.thought_level,recurring:t.recurring===void 0?o.recurring:t.recurring?1:0,max_runs:t.maxRuns===void 0?o.max_runs:t.maxRuns,end_at:t.endAt===void 0?o.end_at:t.endAt,schedule_rule:t.scheduleRule===void 0?o.schedule_rule:t.scheduleRule?JSON.stringify(t.scheduleRule):null,schedule_edited_by_user:t.scheduleEditedByUser===void 0?o.schedule_edited_by_user:t.scheduleEditedByUser?1:0,next_run_at:n?.nextRunAt===void 0?o.next_run_at:n.nextRunAt,lifecycle_status:n?.lifecycleStatus??o.lifecycle_status,dispatch_attempts:n?.resetRetry?0:o.dispatch_attempts,retry_at:n?.resetRetry?null:o.retry_at,dispatch_status:n?.resetRetry?"idle":o.dispatch_status,enabled:n?.lifecycleStatus?n.lifecycleStatus==="active"?1:0:o.enabled,updated_at:d};return this.writeRow(a),V(a)}async delete(e,t){return await this.ensureReady(),this.getDatabase().prepare(`DELETE FROM automations
        WHERE automation_id = @id
          AND (@workspace_key IS NULL OR workspace_key = @workspace_key)`).run({id:e,workspace_key:t??null}).changes>0}async setEnabled(e,t,n){await this.ensureReady(),this.getDatabase().prepare(`UPDATE automations
        SET enabled = @enabled,
            lifecycle_status = @lifecycle_status,
            updated_at = @now
        WHERE automation_id = @id
          AND (@workspace_key IS NULL OR workspace_key = @workspace_key)`).run({id:e,enabled:t?1:0,lifecycle_status:t?"active":"paused",now:Date.now(),workspace_key:n??null})}async restart(e,t,n){await this.ensureReady(),this.getDatabase().prepare(`UPDATE automations
        SET lifecycle_status = 'active',
            enabled = 1,
            run_count = 0,
            scheduled_run_count = 0,
            dispatch_attempts = 0,
            retry_at = NULL,
            dispatch_status = 'idle',
            running = 0,
            claimed_at = NULL,
            next_run_at = @next_run_at,
            last_error = NULL,
            updated_at = @now
        WHERE automation_id = @id
          AND (@workspace_key IS NULL OR workspace_key = @workspace_key)`).run({id:e,next_run_at:t.nextRunAt,now:Date.now(),workspace_key:n??null})}async runNow(e,t,n){await this.ensureReady();let s=this.getDatabase();s.exec("BEGIN IMMEDIATE");try{s.prepare(`UPDATE automations
        SET running = 0, claimed_at = NULL
        WHERE running = 1 AND claimed_at IS NOT NULL AND claimed_at <= @stale`).run({stale:t.now-we});let o=this.getRow(e,n);if(!o||s.prepare(`UPDATE automations
          SET running = 1, claimed_at = @now, updated_at = @now
          WHERE automation_id = @id
            AND running = 0
            AND (@workspace_key IS NULL OR workspace_key = @workspace_key)`).run({id:e,now:t.now,workspace_key:n??null}).changes!==1)return s.exec("COMMIT"),null;let a=`${e}:manual:${Pr()}`;return s.prepare(`INSERT INTO automation_runs (
          run_id, automation_id, workspace_key, scheduled_at, trigger,
          model_selection, dispatch_status, attempts, created_at, updated_at
        ) VALUES (
          @run_id, @automation_id, @workspace_key, @scheduled_at, 'manual',
          @model_selection, 'claimed', 1, @now, @now
        )`).run({run_id:a,automation_id:e,workspace_key:o.workspace_key,scheduled_at:t.now,model_selection:null,now:t.now}),s.exec("COMMIT"),{automation:V({...o,running:1,claimed_at:t.now,updated_at:t.now}),run:Pe({run_id:a,automation_id:e,workspace_key:o.workspace_key,scheduled_at:t.now,trigger:"manual",model_selection:null,dispatch_status:"claimed",outcome:null,session_id:null,error:null,attempts:1,created_at:t.now,updated_at:t.now})}}catch(o){throw s.exec("ROLLBACK"),o}}async claimDue(e){await this.ensureReady();let t=this.getDatabase();t.exec("BEGIN IMMEDIATE");try{t.prepare(`UPDATE automations
        SET lifecycle_status = 'completed', enabled = 0, next_run_at = NULL,
            retry_at = NULL, running = 0, claimed_at = NULL, updated_at = @now
        WHERE enabled = 1 AND end_at IS NOT NULL AND end_at < @now`).run({now:e}),t.prepare(`UPDATE automations
        SET running = 0, claimed_at = NULL
        WHERE running = 1 AND claimed_at IS NOT NULL AND claimed_at <= @stale`).run({stale:e-we});let n=t.prepare(`SELECT * FROM automations
          WHERE enabled = 1 AND running = 0
            AND (
              (retry_at IS NOT NULL AND retry_at <= @now)
              OR (retry_at IS NULL AND next_run_at IS NOT NULL AND next_run_at <= @now)
            )`).all({now:e}),s=[],o=t.prepare(`UPDATE automations
        SET running = 1, claimed_at = @now, dispatch_status = 'claimed', updated_at = @now
        WHERE automation_id = @id AND running = 0`);for(let d of n)o.run({id:d.automation_id,now:e}).changes===1&&s.push(V({...d,running:1,claimed_at:e,dispatch_status:"claimed"}));return t.exec("COMMIT"),s}catch(n){throw t.exec("ROLLBACK"),n}}async claimManualRuns(e){await this.ensureReady();let t=this.getDatabase();t.exec("BEGIN IMMEDIATE");try{t.prepare(`UPDATE automations
        SET running = 0, claimed_at = NULL
        WHERE running = 1 AND claimed_at IS NOT NULL AND claimed_at <= @stale`).run({stale:e-we});let n=t.prepare(`SELECT
            a.automation_id AS a_automation_id,
            a.title AS a_title,
            a.cron_expr AS a_cron_expr,
            a.prompt AS a_prompt,
            a.model AS a_model,
            a.provider AS a_provider,
            a.model_selection AS a_model_selection,
            a.mode AS a_mode,
            a.thought_level AS a_thought_level,
            a.workspace_key AS a_workspace_key,
            a.workspace_path AS a_workspace_path,
            a.workspace_identity AS a_workspace_identity,
            a.target_task_id AS a_target_task_id,
            a.location_kind AS a_location_kind,
            a.recurring AS a_recurring,
            a.max_runs AS a_max_runs,
            a.end_at AS a_end_at,
            a.schedule_rule AS a_schedule_rule,
            a.schedule_edited_by_user AS a_schedule_edited_by_user,
            a.run_count AS a_run_count,
            a.scheduled_run_count AS a_scheduled_run_count,
            a.enabled AS a_enabled,
            a.lifecycle_status AS a_lifecycle_status,
            a.next_run_at AS a_next_run_at,
            a.last_run_at AS a_last_run_at,
            a.running AS a_running,
            a.claimed_at AS a_claimed_at,
            a.dispatch_status AS a_dispatch_status,
            a.dispatch_attempts AS a_dispatch_attempts,
            a.retry_at AS a_retry_at,
            a.last_error AS a_last_error,
            a.bot_delivery_target AS a_bot_delivery_target,
            a.created_at AS a_created_at,
            a.updated_at AS a_updated_at,
            r.run_id AS r_run_id,
            r.automation_id AS r_automation_id,
            r.workspace_key AS r_workspace_key,
            r.scheduled_at AS r_scheduled_at,
            r.trigger AS r_trigger,
            r.model_selection AS r_model_selection,
            r.dispatch_status AS r_dispatch_status,
            r.outcome AS r_outcome,
            r.session_id AS r_session_id,
            r.error AS r_error,
            r.attempts AS r_attempts,
            r.created_at AS r_created_at,
            r.updated_at AS r_updated_at
          FROM automation_runs r
          JOIN automations a ON a.automation_id = r.automation_id
          WHERE r.trigger = 'manual'
            AND r.dispatch_status = 'claimed'
            AND a.running = 0
            AND (r.attempts = 0 OR r.updated_at <= @stale)
          ORDER BY r.created_at ASC`).all({stale:e-we}),s=[],o=t.prepare(`UPDATE automations
        SET running = 1, claimed_at = @now, updated_at = @now
        WHERE automation_id = @id AND running = 0`),d=t.prepare(`UPDATE automation_runs
        SET attempts = attempts + 1, updated_at = @now
        WHERE run_id = @run_id AND trigger = 'manual' AND dispatch_status = 'claimed'`);for(let a of n){let c=a.a_automation_id,u=a.r_run_id;o.run({id:c,now:e}).changes===1&&(d.run({run_id:u,now:e}),s.push({automation:V({automation_id:c,title:a.a_title,cron_expr:a.a_cron_expr,prompt:a.a_prompt,model:a.a_model??null,provider:a.a_provider??null,model_selection:a.a_model_selection??null,mode:a.a_mode??null,thought_level:a.a_thought_level??null,workspace_key:a.a_workspace_key,workspace_path:a.a_workspace_path,workspace_identity:a.a_workspace_identity??null,target_task_id:a.a_target_task_id??null,location_kind:a.a_location_kind,recurring:a.a_recurring,max_runs:a.a_max_runs??null,end_at:a.a_end_at??null,schedule_rule:a.a_schedule_rule??null,schedule_edited_by_user:a.a_schedule_edited_by_user,run_count:a.a_run_count,scheduled_run_count:a.a_scheduled_run_count,enabled:a.a_enabled,lifecycle_status:a.a_lifecycle_status,next_run_at:a.a_next_run_at??null,last_run_at:a.a_last_run_at??null,running:1,claimed_at:e,dispatch_status:a.a_dispatch_status,dispatch_attempts:a.a_dispatch_attempts,retry_at:a.a_retry_at??null,last_error:a.a_last_error??null,bot_delivery_target:a.a_bot_delivery_target??null,created_at:a.a_created_at,updated_at:e}),run:Pe({run_id:u,automation_id:a.r_automation_id,workspace_key:a.r_workspace_key,scheduled_at:a.r_scheduled_at??null,trigger:a.r_trigger,model_selection:a.r_model_selection??null,dispatch_status:a.r_dispatch_status,outcome:a.r_outcome??null,session_id:a.r_session_id??null,error:a.r_error??null,attempts:a.r_attempts+1,created_at:a.r_created_at,updated_at:e})}))}return t.exec("COMMIT"),s}catch(n){throw t.exec("ROLLBACK"),n}}async markDispatched(e,t){await this.ensureReady();let n=this.getRow(e);if(!n)return;let s=n.run_count+1,o=n.scheduled_run_count+1,d=n.recurring===0&&o>=(n.max_runs??1),a=n.end_at!==null&&(t.nextRunAt??1/0)>n.end_at;this.getDatabase().prepare(`UPDATE automations
        SET run_count = @run_count,
            scheduled_run_count = @scheduled_run_count,
            last_run_at = @dispatched_at,
            dispatch_status = 'dispatched',
            dispatch_attempts = 0,
            retry_at = NULL,
            last_error = NULL,
            running = 0,
            claimed_at = NULL,
            lifecycle_status = @lifecycle_status,
            enabled = @enabled,
            next_run_at = @next_run_at,
            updated_at = @now
        WHERE automation_id = @id`).run({id:e,run_count:s,scheduled_run_count:o,dispatched_at:t.dispatchedAt,lifecycle_status:d||a?"completed":"active",enabled:d||a?0:1,next_run_at:d||a?null:t.nextRunAt,now:t.dispatchedAt})}async markDispatchFailed(e,t){await this.ensureReady();let n=this.getRow(e);if(!n)return;let s=this.getDatabase(),o=t.failedAt;if(t.kind==="permanent"){s.prepare(`UPDATE automations
        SET dispatch_status = 'failed_to_dispatch', lifecycle_status = 'failed',
            enabled = 0, running = 0, claimed_at = NULL,
            last_error = @error, updated_at = @now
        WHERE automation_id = @id`).run({id:e,error:t.error,now:o});return}let d=n.dispatch_attempts+1;if(d>=cs){n.recurring===1?s.prepare(`UPDATE automations
          SET dispatch_status = 'idle', dispatch_attempts = 0, retry_at = NULL,
              running = 0, claimed_at = NULL, next_run_at = @next_run_at,
              last_error = @error, updated_at = @now
          WHERE automation_id = @id`).run({id:e,next_run_at:t.nextRunAt??null,error:t.error,now:o}):s.prepare(`UPDATE automations
          SET dispatch_status = 'failed_to_dispatch', lifecycle_status = 'failed',
              enabled = 0, running = 0, claimed_at = NULL,
              last_error = @error, updated_at = @now
          WHERE automation_id = @id`).run({id:e,error:t.error,now:o});return}s.prepare(`UPDATE automations
      SET dispatch_status = 'failed_to_dispatch', dispatch_attempts = @attempts,
          retry_at = @retry_at, running = 0, claimed_at = NULL,
          last_error = @error, updated_at = @now
      WHERE automation_id = @id`).run({id:e,attempts:d,retry_at:ls(o,d),error:t.error,now:o})}async releaseClaim(e){await this.ensureReady(),this.getDatabase().prepare(`UPDATE automations
        SET running = 0, claimed_at = NULL, dispatch_status = 'idle', updated_at = @now
        WHERE automation_id = @id AND running = 1`).run({id:e,now:Date.now()})}async releaseManualClaim(e,t){await this.ensureReady(),this.getDatabase().prepare(`UPDATE automations
        SET running = 0, claimed_at = NULL, updated_at = @now
        WHERE automation_id = @id
          AND workspace_key = @workspace_key
          AND running = 1`).run({id:e,workspace_key:t,now:Date.now()})}async touchManualClaim(e,t){await this.ensureReady(),this.getDatabase().prepare(`UPDATE automations
        SET claimed_at = @now, updated_at = @now
        WHERE automation_id = @id
          AND workspace_key = @workspace_key
          AND running = 1`).run({id:e,workspace_key:t,now:Date.now()})}async skipAndReschedule(e){await this.ensureReady();let t=this.getDatabase(),n=Date.now();t.exec("BEGIN IMMEDIATE");try{t.prepare(`INSERT INTO automation_runs (
          run_id, automation_id, workspace_key, scheduled_at, trigger,
          dispatch_status, error, attempts, created_at, updated_at
        ) VALUES (@run_id, @automation_id, @workspace_key, @scheduled_at, 'schedule', 'skipped', @reason, 0, @now, @now)
        ON CONFLICT(run_id) DO UPDATE SET
          dispatch_status = 'skipped', error = excluded.error, updated_at = excluded.updated_at`).run({run_id:e.runId,automation_id:e.automationId,workspace_key:e.workspaceKey,scheduled_at:e.scheduledAt,reason:e.reason,now:n}),e.finalize?t.prepare(`UPDATE automations
          SET lifecycle_status = 'completed', enabled = 0, next_run_at = NULL,
              running = 0, claimed_at = NULL,
              dispatch_status = 'idle', dispatch_attempts = 0, retry_at = NULL,
              updated_at = @now
          WHERE automation_id = @id`).run({id:e.automationId,now:n}):t.prepare(`UPDATE automations
          SET next_run_at = @next_run_at, running = 0, claimed_at = NULL,
              dispatch_status = 'idle', dispatch_attempts = 0, retry_at = NULL,
              updated_at = @now
          WHERE automation_id = @id`).run({id:e.automationId,next_run_at:e.nextRunAt,now:n}),t.exec("COMMIT")}catch(s){throw t.exec("ROLLBACK"),s}}async ensureRunClaimed(e){await this.ensureReady();let t=Date.now();this.getDatabase().prepare(`INSERT INTO automation_runs (
          run_id, automation_id, workspace_key, scheduled_at, trigger,
          dispatch_status, attempts, created_at, updated_at
        ) VALUES (@run_id, @automation_id, @workspace_key, @scheduled_at, @trigger, 'claimed', 0, @now, @now)
        ON CONFLICT(run_id) DO NOTHING`).run({run_id:e.runId,automation_id:e.automationId,workspace_key:e.workspaceKey,scheduled_at:e.scheduledAt,trigger:e.trigger,now:t})}async upsertRunClaimed(e){await this.ensureReady();let t=Date.now();this.getDatabase().prepare(`INSERT INTO automation_runs (
          run_id, automation_id, workspace_key, scheduled_at, trigger,
          model_selection, dispatch_status, attempts, created_at, updated_at
        ) VALUES (@run_id, @automation_id, @workspace_key, @scheduled_at, @trigger, @model_selection, 'claimed', 0, @now, @now)
        ON CONFLICT(run_id) DO UPDATE SET
          dispatch_status = 'claimed',
          model_selection = COALESCE(automation_runs.model_selection, excluded.model_selection),
          outcome = NULL,
          error = NULL,
          attempts = attempts + 1,
          updated_at = excluded.updated_at`).run({run_id:e.runId,automation_id:e.automationId,workspace_key:e.workspaceKey,scheduled_at:e.scheduledAt,trigger:e.trigger,model_selection:Re(e.modelSelection),now:t})}async fixRunModelSelection(e,t){await this.ensureReady();let n=this.getDatabase();n.prepare(`UPDATE automation_runs
       SET model_selection = COALESCE(model_selection, @model_selection), updated_at = @now
       WHERE run_id = @run_id`).run({run_id:e,model_selection:Re(t),now:Date.now()});let s=n.prepare("SELECT model_selection FROM automation_runs WHERE run_id = @run_id").get({run_id:e}),o=s?Pt(s.model_selection):void 0;if(!o)throw new Error(`Automation run \u4E0D\u5B58\u5728\u6216\u65E0\u6CD5\u56FA\u5B9A\u6A21\u578B\u9009\u62E9: ${e}`);return o}async markRunDispatch(e){await this.ensureReady(),this.getDatabase().prepare(`UPDATE automation_runs
        SET dispatch_status = @dispatch_status,
            session_id = COALESCE(@session_id, session_id),
            error = @error,
            updated_at = @now
        WHERE run_id = @run_id`).run({run_id:e.runId,dispatch_status:e.dispatchStatus,session_id:e.sessionId??null,error:e.error??null,now:Date.now()})}async markManualRunDispatched(e){await this.ensureReady();let t=this.getDatabase();t.exec("BEGIN IMMEDIATE");try{let n=t.prepare(`SELECT automation_id, workspace_key, dispatch_status
          FROM automation_runs
          WHERE run_id = @run_id AND trigger = 'manual'`).get({run_id:e.runId});if(!n||n.dispatch_status==="dispatched")return t.exec("COMMIT"),!1;t.prepare(`UPDATE automation_runs
        SET dispatch_status = 'dispatched',
            session_id = COALESCE(@session_id, session_id),
            error = NULL,
            updated_at = @now
        WHERE run_id = @run_id AND trigger = 'manual' AND dispatch_status <> 'dispatched'`).run({run_id:e.runId,session_id:e.sessionId??null,now:e.dispatchedAt});let s=t.prepare(`UPDATE automations
          SET run_count = run_count + 1,
              last_run_at = @dispatched_at,
              updated_at = @now
          WHERE automation_id = @automation_id AND workspace_key = @workspace_key`).run({automation_id:n.automation_id,workspace_key:n.workspace_key,dispatched_at:e.dispatchedAt,now:e.dispatchedAt});return t.exec("COMMIT"),s.changes>0}catch(n){throw t.exec("ROLLBACK"),n}}async markRunOutcome(e,t,n){await this.ensureReady(),this.getDatabase().prepare(`UPDATE automation_runs
        SET outcome = CASE
              WHEN @outcome = 'running' AND outcome IS NOT NULL AND outcome <> 'running' THEN outcome
              ELSE @outcome
            END,
            error = CASE
              WHEN @outcome = 'running' AND outcome IS NOT NULL AND outcome <> 'running' THEN error
              ELSE COALESCE(@error, error)
            END,
            updated_at = @now
        WHERE run_id = @run_id`).run({run_id:e,outcome:t,error:n??null,now:Date.now()})}async recordSkippedRun(e){await this.ensureReady();let t=Date.now();this.getDatabase().prepare(`INSERT INTO automation_runs (
          run_id, automation_id, workspace_key, scheduled_at, trigger,
          dispatch_status, error, attempts, created_at, updated_at
        ) VALUES (@run_id, @automation_id, @workspace_key, @scheduled_at, @trigger, 'skipped', @reason, 0, @now, @now)
        ON CONFLICT(run_id) DO UPDATE SET
          dispatch_status = 'skipped', error = excluded.error, updated_at = excluded.updated_at`).run({run_id:e.runId,automation_id:e.automationId,workspace_key:e.workspaceKey,scheduled_at:e.scheduledAt,trigger:e.trigger,reason:e.reason,now:t})}async listRuns(e,t){return await this.ensureReady(),this.getDatabase().prepare(`SELECT * FROM automation_runs
        WHERE automation_id = @id
          AND (@workspace_key IS NULL OR workspace_key = @workspace_key)
        ORDER BY created_at DESC`).all({id:e,workspace_key:t??null}).map(Pe)}async getRun(e){await this.ensureReady();let t=this.getDatabase().prepare("SELECT * FROM automation_runs WHERE run_id = @run_id").get({run_id:e});return t?Pe(t):null}async deleteRun(e,t){await this.ensureReady(),this.getDatabase().prepare(`DELETE FROM automation_runs
        WHERE run_id = @run_id
          AND (@workspace_key IS NULL OR workspace_key = @workspace_key)`).run({run_id:e,workspace_key:t??null})}async pruneRuns(e){await this.ensureReady();let t=this.getDatabase().prepare("DELETE FROM automation_runs WHERE created_at < ?").run(Date.now()-e);return Number(t.changes??0)}writeRow(e){this.getDatabase().prepare(`UPDATE automations SET
          title = @title, cron_expr = @cron_expr, prompt = @prompt, model = @model, provider = @provider,
          model_selection = @model_selection,
          mode = @mode, thought_level = @thought_level,
          recurring = @recurring, max_runs = @max_runs, end_at = @end_at,
          schedule_rule = @schedule_rule,
          schedule_edited_by_user = @schedule_edited_by_user,
          next_run_at = @next_run_at, lifecycle_status = @lifecycle_status,
          dispatch_attempts = @dispatch_attempts, retry_at = @retry_at, dispatch_status = @dispatch_status,
          enabled = @enabled, updated_at = @updated_at
        WHERE automation_id = @automation_id`).run({automation_id:e.automation_id,title:e.title,cron_expr:e.cron_expr,prompt:e.prompt,model:e.model,provider:e.provider,model_selection:e.model_selection,mode:e.mode,thought_level:e.thought_level,recurring:e.recurring,max_runs:e.max_runs,end_at:e.end_at,schedule_rule:e.schedule_rule,schedule_edited_by_user:e.schedule_edited_by_user,next_run_at:e.next_run_at,lifecycle_status:e.lifecycle_status,dispatch_attempts:e.dispatch_attempts,retry_at:e.retry_at,dispatch_status:e.dispatch_status,enabled:e.enabled,updated_at:e.updated_at})}};f();import{mkdir as ps}from"fs/promises";import{createRequire as _s}from"module";import{dirname as ms}from"path";import{randomUUID as fs}from"crypto";var gs=_s(import.meta.url),{DatabaseSync:hs}=gs("node:sqlite"),Cr=10*6e4,se=lr.map(r=>`'${r}'`).join(", ");function D(r){let e=Ae(r);return{offPeakTaskId:r.off_peak_task_id,serverTicketId:r.server_ticket_id??void 0,title:r.title,conversationId:r.conversation_id??void 0,sessionId:r.session_id??void 0,...r.session_title?{sessionTitle:r.session_title}:{},prompt:r.prompt,permissionMode:r.permission_mode,...e?{modelSelection:e}:{},...e?{}:{modelSelectionIssue:{code:"repair-required"}},workspaceKey:r.workspace_key,workspacePath:r.workspace_path,workspaceIdentity:r.workspace_identity??void 0,status:r.status,queuedAt:r.queued_at,startedAt:r.started_at??void 0,endedAt:r.ended_at??void 0,failureReason:r.failure_reason??void 0,filesChanged:r.files_changed??void 0,settledAt:r.settled_at??void 0,historyDeletedAt:r.history_deleted_at??void 0,registeredAt:r.registered_at??void 0,schedulable:r.schedulable===1,queuePosition:r.queue_position??void 0,nextPollAt:r.next_poll_at??void 0,createdAt:r.created_at,updatedAt:r.updated_at}}i(D,"rowToTask");function Ae(r){if(r.model_selection)try{let e=Y.safeParse(JSON.parse(r.model_selection));if(e.success)return e.data}catch{}return null}i(Ae,"readOffPeakModelSelection");function vr(r){let e=r.options;return JSON.stringify(Y.parse({providerId:r.providerId,modelId:r.modelId,...e&&Object.keys(e).length>0?{options:e}:{}}))}i(vr,"serializeOffPeakModelSelection");function td(r){return r instanceof Error&&/UNIQUE constraint failed: off_peak_tasks\.workspace_key, off_peak_tasks\.session_id/.test(r.message)}i(td,"isOffPeakBoundSessionConflict");var Ie=class{constructor(e,t=5e3){this.startupBusyTimeoutMs=t;this.resolvedDbPath=e?.trim()||null}startupBusyTimeoutMs;static{i(this,"OffPeakTaskRepo")}db=null;dbPath=null;initializePromise=null;resolvedDbPath;resolveDbPath(){return this.resolvedDbPath??j()}async ensureReady(){let e=this.resolveDbPath();this.dbPath&&this.dbPath!==e&&this.close(),this.initializePromise||(this.initializePromise=this.initialize(e).catch(t=>{throw this.close(),t})),await this.initializePromise}close(e){let t;try{this.db?.close()}catch(n){t=n}if(this.db=null,this.dbPath=null,this.initializePromise=null,e?.throwOnError&&t)throw t}async initialize(e){await ps(ms(e),{recursive:!0}),this.db||(this.db=new hs(e),this.dbPath=e,this.db.exec(`PRAGMA busy_timeout = ${this.startupBusyTimeoutMs}`),this.db.exec("PRAGMA journal_mode = WAL"),this.db.exec("PRAGMA synchronous = NORMAL")),!te(e,this.db)&&(ee(e,this.db)||B(this.db),this.getDatabase().prepare(`UPDATE off_peak_tasks
        SET status = 'running', updated_at = @now
        WHERE status = 'awaiting_approval'`).run({now:Date.now()}))}getDatabase(){if(!this.db)throw new Error("OffPeakTaskRepo \u672A\u521D\u59CB\u5316\uFF1A\u8BF7\u5148 await ensureReady()");return this.db}hasTasksIndexTable(){return!!this.getDatabase().prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'tasks'").get()}getRow(e){return this.getDatabase().prepare("SELECT * FROM off_peak_tasks WHERE off_peak_task_id = ?").get(e)??null}async create(e,t){await this.ensureReady();let n=t?.now??Date.now(),s=t?.offPeakTaskId??`offpeak-${fs()}`,o=O({workspacePath:e.workspacePath,workspaceIdentity:e.workspaceIdentity});return this.getDatabase().prepare(`INSERT INTO off_peak_tasks (
          off_peak_task_id, server_ticket_id, title, conversation_id, session_id,
          prompt, permission_mode, model, thought_level, model_selection,
          workspace_key, workspace_path, workspace_identity,
          status, queued_at, registered_at, schedulable, queue_position,
          claim_running, attempt_count, created_at, updated_at
        ) VALUES (
          @off_peak_task_id, @server_ticket_id, @title, NULL, @session_id,
          @prompt, @permission_mode, @model, @thought_level, @model_selection,
          @workspace_key, @workspace_path, @workspace_identity,
          'queued', @queued_at, @registered_at, @schedulable, @queue_position,
          0, 0, @now, @now
        )`).run({off_peak_task_id:s,server_ticket_id:t?.serverTicketId??null,title:e.title,session_id:e.boundSessionId??null,prompt:e.prompt,permission_mode:e.permissionMode,model:null,thought_level:null,model_selection:vr(e.modelSelection),workspace_key:o,workspace_path:e.workspacePath,workspace_identity:e.workspaceIdentity??null,queued_at:n,registered_at:t?.registeredAt??null,schedulable:t?.schedulable?1:0,queue_position:t?.queuePosition??null,now:n}),D(this.getRow(s))}async list(e){await this.ensureReady();let t=e?.workspacePath?O({workspacePath:e.workspacePath,workspaceIdentity:e.workspaceIdentity}):null,n=this.hasTasksIndexTable();return this.getDatabase().prepare(n?`SELECT t.*, s.title AS session_title FROM off_peak_tasks t
            LEFT JOIN tasks s ON s.workspace_key = t.workspace_key AND s.task_id = t.session_id
            WHERE (@workspace_key IS NULL OR t.workspace_key = @workspace_key)
            ORDER BY t.created_at DESC`:`SELECT * FROM off_peak_tasks
            WHERE (@workspace_key IS NULL OR workspace_key = @workspace_key)
            ORDER BY created_at DESC`).all({workspace_key:t}).map(D)}async get(e){await this.ensureReady();let t=this.getRow(e);return t?D(t):null}async invalidateModelSelection(e,t,n){await this.ensureReady();let s=this.getDatabase();s.exec("BEGIN IMMEDIATE");try{let o=this.getRow(e);if(!o)return s.exec("COMMIT"),null;let d=Ae(o);if(d&&(d.providerId!==t.providerId||d.modelId!==t.modelId||d.options?.reasoningLevel!==t.options?.reasoningLevel))return s.exec("COMMIT"),D(o);s.prepare(`UPDATE off_peak_tasks
         SET model = @model, thought_level = @thought_level,
             model_selection = NULL, schedulable = 0, updated_at = @now
         WHERE off_peak_task_id = @id`).run({id:e,model:t.modelId,thought_level:t.options?.reasoningLevel??null,now:n?.now??Date.now()});let a=this.getRow(e);return s.exec("COMMIT"),a?D(a):null}catch(o){throw s.exec("ROLLBACK"),o}}async delete(e){await this.ensureReady(),this.getDatabase().prepare("DELETE FROM off_peak_tasks WHERE off_peak_task_id = ?").run(e)}async markHistoryDeleted(e,t){await this.ensureReady();let n=this.getRow(e);if(!n||n.started_at===null)return n?D(n):null;if(n.history_deleted_at!==null)return D(n);let s=t?.now??Date.now();return this.getDatabase().prepare(`UPDATE off_peak_tasks
        SET history_deleted_at = @now, updated_at = @now
        WHERE off_peak_task_id = @id AND started_at IS NOT NULL`).run({id:e,now:s}),D(this.getRow(e))}async countNonTerminal(){return await this.ensureReady(),this.getDatabase().prepare(`SELECT COUNT(*) AS n FROM off_peak_tasks WHERE status NOT IN (${se})`).get().n}async hasActiveBoundTask(e,t){return await this.ensureReady(),this.getDatabase().prepare(`SELECT 1 AS hit FROM off_peak_tasks
         WHERE workspace_key = @workspace_key AND session_id = @session_id
           AND status NOT IN (${se})
         LIMIT 1`).get({workspace_key:e,session_id:t})!==void 0}async countActive(){return await this.ensureReady(),this.getDatabase().prepare("SELECT COUNT(*) AS n FROM off_peak_tasks WHERE status = 'running'").get().n}async updateEditableFields(e,t,n){await this.ensureReady();let s=this.getRow(e);if(!s||s.status!=="queued"&&s.status!=="paused"||t.modelSelection===null)return null;let o=t.modelSelection??Ae(s);if(!o)throw new Error(`Off-Peak task \u7F3A\u5C11\u6709\u6548 ModelSelection: ${e}`);return this.getDatabase().prepare(`UPDATE off_peak_tasks SET
          title = @title, prompt = @prompt, permission_mode = @permission_mode,
          model_selection = @model_selection, updated_at = @now
        WHERE off_peak_task_id = @id`).run({id:e,title:t.title??s.title,prompt:t.prompt??s.prompt,permission_mode:t.permissionMode??s.permission_mode,model_selection:vr(o),now:n?.now??Date.now()}),D(this.getRow(e))}async updateSchedulingSnapshot(e,t){await this.ensureReady();let n=this.getRow(e);n&&this.getDatabase().prepare(`UPDATE off_peak_tasks SET
          schedulable = @schedulable,
          queue_position = @queue_position,
          next_poll_at = @next_poll_at,
          server_ticket_id = @server_ticket_id,
          registered_at = @registered_at,
          updated_at = @now
        WHERE off_peak_task_id = @id`).run({id:e,schedulable:t.schedulable===void 0?n.schedulable:t.schedulable?1:0,queue_position:t.queuePosition===void 0?n.queue_position:t.queuePosition,next_poll_at:t.nextPollAt===void 0?n.next_poll_at:t.nextPollAt,server_ticket_id:t.serverTicketId??n.server_ticket_id,registered_at:t.registeredAt??n.registered_at,now:t.now??Date.now()})}async claimDue(e){await this.ensureReady();let t=this.getDatabase();t.exec("BEGIN IMMEDIATE");try{t.prepare(`UPDATE off_peak_tasks
        SET claim_running = 0, claimed_at = NULL
        WHERE claim_running = 1 AND claimed_at IS NOT NULL AND claimed_at <= @stale`).run({stale:e-Cr});let n=t.prepare(`SELECT * FROM off_peak_tasks
          WHERE status = 'queued' AND schedulable = 1 AND claim_running = 0
          ORDER BY queued_at ASC, created_at ASC`).all(),s=[],o=t.prepare(`UPDATE off_peak_tasks
        SET claim_running = 1, claimed_at = @now, updated_at = @now
        WHERE off_peak_task_id = @id AND claim_running = 0`);for(let d of n){if(!Ae(d))continue;o.run({id:d.off_peak_task_id,now:e}).changes===1&&s.push(D({...d,claim_running:1,claimed_at:e}))}return t.exec("COMMIT"),s}catch(n){throw t.exec("ROLLBACK"),n}}async markRunning(e,t){return await this.ensureReady(),this.getDatabase().prepare(`UPDATE off_peak_tasks
        SET status = 'running',
            started_at = COALESCE(started_at, @started_at),
            conversation_id = COALESCE(@conversation_id, conversation_id),
            session_id = COALESCE(@session_id, session_id),
            server_ticket_id = COALESCE(@server_ticket_id, server_ticket_id),
            claim_running = 0, claimed_at = NULL,
            last_error = NULL,
            updated_at = @started_at
        WHERE off_peak_task_id = @id AND status = 'queued'`).run({id:e,started_at:t.startedAt,conversation_id:t.conversationId??null,session_id:t.sessionId??null,server_ticket_id:t.serverTicketId??null}).changes!==1?null:D(this.getRow(e))}async markTerminal(e,t){return await this.ensureReady(),this.getDatabase().prepare(`UPDATE off_peak_tasks
        SET status = @status,
            ended_at = @ended_at,
            failure_reason = @failure_reason,
            files_changed = COALESCE(@files_changed, files_changed),
            attempt_count = attempt_count + @dispatch_attempt_inc,
            last_error = COALESCE(@dispatch_error, last_error),
            schedulable = 0,
            claim_running = 0, claimed_at = NULL,
            updated_at = @ended_at
        WHERE off_peak_task_id = @id AND status NOT IN (${se})`).run({id:e,status:t.status,ended_at:t.endedAt,failure_reason:t.failureReason??null,files_changed:t.filesChanged??null,dispatch_attempt_inc:t.dispatchError?1:0,dispatch_error:t.dispatchError??null}).changes!==1?null:D(this.getRow(e))}async setPaused(e,t,n){return await this.ensureReady(),this.getDatabase().prepare(`UPDATE off_peak_tasks
        SET status = @to, updated_at = @now
        WHERE off_peak_task_id = @id AND status = @from AND claim_running = 0`).run({id:e,to:t?"paused":"queued",from:t?"queued":"paused",now:n?.now??Date.now()}).changes!==1?null:D(this.getRow(e))}async releaseClaim(e,t){await this.ensureReady(),this.getDatabase().prepare(`UPDATE off_peak_tasks
        SET claim_running = 0, claimed_at = NULL,
            attempt_count = attempt_count + @attempt_inc,
            last_error = COALESCE(@error, last_error),
            updated_at = @now
        WHERE off_peak_task_id = @id AND claim_running = 1`).run({id:e,attempt_inc:t?.error?1:0,error:t?.error??null,now:t?.now??Date.now()})}async recoverInterrupted(e){await this.ensureReady();let t=this.getDatabase();t.exec("BEGIN IMMEDIATE");try{let n=t.prepare(`UPDATE off_peak_tasks
          SET status = 'queued', claim_running = 0, claimed_at = NULL, updated_at = @now
          WHERE status = 'running'`).run({now:e});return t.prepare(`UPDATE off_peak_tasks
        SET claim_running = 0, claimed_at = NULL, updated_at = @now
        WHERE claim_running = 1 AND claimed_at IS NOT NULL AND claimed_at <= @stale`).run({now:e,stale:e-Cr}),t.exec("COMMIT"),Number(n.changes??0)}catch(n){throw t.exec("ROLLBACK"),n}}async requeueForContinuation(e,t){return await this.ensureReady(),this.getDatabase().prepare(`UPDATE off_peak_tasks
        SET status = 'queued', schedulable = 0, queue_position = NULL,
            claim_running = 0, claimed_at = NULL, updated_at = @now
        WHERE off_peak_task_id = @id AND status = 'running'`).run({id:e,now:t?.now??Date.now()}).changes!==1?null:D(this.getRow(e))}async listNonTerminal(){return await this.ensureReady(),this.getDatabase().prepare(`SELECT * FROM off_peak_tasks
        WHERE status NOT IN (${se})
        ORDER BY queued_at ASC`).all().map(D)}async markSettled(e,t){await this.ensureReady(),this.getDatabase().prepare(`UPDATE off_peak_tasks
        SET settled_at = @settled_at, updated_at = @settled_at
        WHERE off_peak_task_id = @id AND status IN (${se})`).run({id:e,settled_at:t})}async listUnsettledTerminal(){return await this.ensureReady(),this.getDatabase().prepare(`SELECT * FROM off_peak_tasks
        WHERE status IN (${se}) AND settled_at IS NULL
        ORDER BY ended_at ASC`).all().map(D)}};f();import{mkdir as Fs}from"fs/promises";import{dirname as Hs}from"path";import{createRequire as Bs}from"module";f();import{mkdir as ks}from"fs/promises";import{createHash as Mr,randomUUID as Es}from"crypto";import{createRequire as Ts}from"module";import{dirname as ys}from"path";var ws=Ts(import.meta.url),{DatabaseSync:Rs}=ws("node:sqlite");function St(r,e,t){r.push("provider = ?"),e.push(t)}i(St,"appendZCodeAgentIndexedProviderFilter");var Ps=2e5,Ss=20,As=72,Is=140,Cs=4,$=1e3,At="__zcode_internal_grouped_workspace_bootstrap_once__",Ct="gray",br=["red","orange","yellow","green","blue","purple"],It=Q("task-index-repo");function M(r){return O(r)}i(M,"workspaceKey");function vs(r){return r==="completed"||r==="error"}i(vs,"isTerminalTaskStatus");function bs(r,e){return!r||!vs(r.status)||e.status&&e.status!=="running"?!1:r.updatedAt>e.updatedAt}i(bs,"shouldPreserveNewerTerminalStatus");function Ns(r){let e=r.workspace_identity?.trim();if(e===r.workspace_key)return e;if(ke(r.workspace_key))return r.workspace_key}i(Ns,"resolveTaskIndexRowWorkspaceIdentity");function G(r){let e=Ns(r);try{let t=st.safeParse(JSON.parse(r.meta_json));if(t.success)return{...t.data,taskId:r.task_id,workspacePath:r.workspace_path,workspaceIdentity:e,unreadAt:r.unread_at??void 0,cronAutomationId:t.data.cronAutomationId??r.cron_automation_id??void 0,offPeakTaskId:t.data.offPeakTaskId??r.off_peak_task_id??void 0,titleOverridden:r.title_overridden===1};It.warn(void 0,`\u8BFB\u53D6 task index meta_json \u975E\u6CD5 taskId=${r.task_id}`,t.error.flatten())}catch(t){It.warn(void 0,`\u8BFB\u53D6 task index meta_json \u5931\u8D25 taskId=${r.task_id}`,t)}return{taskId:r.task_id,traceId:`zcode-${r.task_id}`,title:r.title,titleOverridden:r.title_overridden===1,workspacePath:r.workspace_path,workspaceIdentity:e,createdAt:r.created_at,updatedAt:r.updated_at,mode:r.mode,model:r.model??void 0,provider:r.provider??void 0,migrationSource:r.migration_source??void 0,forkedFromTaskId:r.forked_from_task_id??void 0,cronAutomationId:r.cron_automation_id??void 0,offPeakTaskId:r.off_peak_task_id??void 0,unreadAt:r.unread_at??void 0,status:r.task_status??void 0}}i(G,"rowToMeta");function Os(r){return JSON.stringify(r)}i(Os,"serializeMetaJson");function Ds(r){return typeof r=="number"&&Number.isFinite(r)&&r>0?Math.floor(r):null}i(Ds,"normalizeLimit");function Ce(r){return[...new Set(r.map(e=>M(e)).filter(e=>e.trim().length>0))].sort((e,t)=>e.localeCompare(t))}i(Ce,"normalizeWorkspaceKeys");function Nr(r){let e=new Set,t=[];for(let n of r){if(n.workspacePurpose==="conversation")continue;let s=M(n);!s.trim()||e.has(s)||(e.add(s),t.push({workspaceKey:s,workspacePath:n.workspacePath,workspaceIdentity:n.workspaceIdentity}))}return t}i(Nr,"normalizeWorkspaceBootstrapScopes");function Or(r){return r.replace(/\s+/g," ").trim().slice(0,Is)}i(Or,"normalizeSearchSnippetText");function Ls(r,e){if(!e||!r.trim())return[];let t=e.toLocaleLowerCase(),n=r.toLocaleLowerCase(),s=[],o=[],d=0;for(;s.length<Cs&&d<n.length;){let a=n.indexOf(t,d);if(a<0)break;let c=Math.max(0,a-Ss),u=Math.min(r.length,a+t.length+As),_=c>0?"...":"",l=u<r.length?"...":"",g=Or(`${_}${r.slice(c,u)}${l}`),h=o.some(m=>Math.min(m.end,u)-Math.max(m.start,c)>0);g&&!h&&(s.push(g),o.push({start:c,end:u})),d=a+t.length}if(s.length===0){let a=Or(r);return a?[a]:[]}return s}i(Ls,"buildSearchSnippets");function Dr(r,e){let t=G(r),n=Ls(r.searchable_text,e);return n.length===0?t:{...t,searchSnippet:n[0],searchSnippets:n}}i(Dr,"rowToTaskListItem");function Lr(r,e){let t={};try{let s=JSON.parse(r);typeof s=="object"&&s!==null&&!Array.isArray(s)&&(t=s)}catch{t={}}let n={...t,taskId:e.taskId,traceId:typeof t.traceId=="string"&&t.traceId?t.traceId:`zcode-${e.taskId}`,title:e.title,workspacePath:e.workspacePath,workspaceIdentity:e.workspaceIdentity,createdAt:typeof t.createdAt=="number"?t.createdAt:e.createdAt,updatedAt:e.updatedAt,mode:typeof t.mode=="string"?t.mode:e.mode,provider:typeof t.provider=="string"?t.provider:e.provider,model:typeof t.model=="string"?t.model:e.model,status:typeof t.status=="string"?t.status:e.status,migrationSource:void 0};return st.parse(n)}i(Lr,"migrateLegacyTaskMetaJson");function xr(r){return r==="gray"||r==="red"||r==="orange"||r==="yellow"||r==="green"||r==="blue"||r==="purple"}i(xr,"isTaskGroupColor");function ve(r){return{id:r.group_id,title:r.title,color:xr(r.color)?r.color:Ct,createdAt:r.created_at,updatedAt:r.updated_at}}i(ve,"rowToTaskGroup");function Ms(r){return`workspace-group-${Mr("sha256").update(r).digest("hex").slice(0,24)}`}i(Ms,"workspaceGroupId");function xs(r){let e=r.replace(/[\\/]+$/u,"");return e.split(/[\\/]/u).filter(Boolean).at(-1)?.trim()||e.trim()||"Workspace"}i(xs,"workspaceGroupTitle");function Ws(r){let t=Mr("sha256").update(r).digest().readUInt8(0)%br.length;return br[t]??Ct}i(Ws,"workspaceGroupColor");function x(r){return`${M(r)}\0${r.taskId}`}i(x,"taskNodeKey");function ce(r){return JSON.stringify([M(r),r.taskId])}i(ce,"taskOrderNodeKey");function oe(r){if(r.type==="group")return{nodeType:"group",nodeKey:r.group.id,mapKey:`group:${r.group.id}`};let e=ce(r.task);return{nodeType:"task",nodeKey:e,mapKey:`task:${e}`}}i(oe,"groupedTopNodeOrderRef");function Gs(r,e){let t=r.sortOrder??0,n=e.sortOrder??0;return t!==n?t-n:oe(r).mapKey.localeCompare(oe(e).mapKey)}i(Gs,"compareGroupedNodes");function Us(r,e){return e.createdAt!==r.createdAt?e.createdAt-r.createdAt:x(e).localeCompare(x(r))}i(Us,"compareCronGroupTasks");function Zs(r,e,t){let n=t.get(x(r)),s=t.get(x(e)),o=n?.sort_order??0,d=s?.sort_order??0;return o!==d?o-d:x(r).localeCompare(x(e))}i(Zs,"compareGroupTasks");var be=class{constructor(e,t=5e3){this.startupDbPath=e;this.startupBusyTimeoutMs=t}startupDbPath;startupBusyTimeoutMs;static{i(this,"TaskIndexRepo")}db=null;dbPath=null;initializePromise=null;writeChains=new Map;async ensureReady(){let e=this.startupDbPath??j();this.dbPath&&this.dbPath!==e&&this.close(),this.initializePromise||(this.initializePromise=this.initialize(e).catch(t=>{throw this.close(),t})),await this.initializePromise}close(e){let t;try{this.db?.close()}catch(n){t=n}if(this.db=null,this.dbPath=null,this.initializePromise=null,this.writeChains.clear(),e?.throwOnError&&t)throw t}async initialize(e){await ks(ys(e),{recursive:!0}),this.db||(this.db=new Rs(e),this.dbPath=e,this.db.exec(`PRAGMA busy_timeout = ${this.startupBusyTimeoutMs}`),this.db.exec("PRAGMA foreign_keys = ON"),this.db.exec("PRAGMA journal_mode = WAL"),this.db.exec("PRAGMA synchronous = NORMAL")),!te(e,this.db)&&(ee(e,this.db)||B(this.db),this.backfillOffPeakTaskMarkers(),this.backfillOffPeakGroupMemberships(),this.migrateLegacyAcpTaskIds(),this.cleanupDeletedTaskGroupingReferences())}hasColumn(e,t){return this.getDatabase().prepare(`PRAGMA table_info(${e})`).all().some(s=>s.name===t)}backfillOffPeakTaskMarkers(){let e=this.getDatabase();e.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'off_peak_tasks'").get()&&e.prepare(`UPDATE tasks SET off_peak_task_id = (
          SELECT o.off_peak_task_id FROM off_peak_tasks o
          WHERE o.session_id = tasks.task_id AND o.workspace_key = tasks.workspace_key
        )
        WHERE off_peak_task_id IS NULL
          AND EXISTS (
            SELECT 1 FROM off_peak_tasks o
            WHERE o.session_id = tasks.task_id AND o.workspace_key = tasks.workspace_key
          )`).run()}backfillOffPeakGroupMemberships(){let t=this.getDatabase().prepare(`SELECT workspace_key, workspace_path, workspace_identity, task_id FROM tasks
         WHERE off_peak_task_id IS NOT NULL AND deleted = 0`).all();for(let n of t)ke(n.workspace_key)||this.ensureOffPeakGroupMembership({workspacePath:n.workspace_path,workspaceIdentity:n.workspace_identity??void 0,taskId:n.task_id})}migrateLegacyAcpTaskIds(){if(!this.hasColumn("tasks","acp_session_id"))return;let e=this.getDatabase(),t=e.prepare(`SELECT
          workspace_key,
          workspace_path,
          workspace_identity,
          task_id,
          title,
          task_status,
          provider,
          acp_session_id,
          mode,
          model,
          migration_source,
          forked_from_task_id,
          cron_automation_id,
          off_peak_task_id,
          created_at,
          updated_at,
          unread_at,
          last_unread_at,
          pinned,
          archived,
          deleted,
          title_overridden,
          searchable_text,
          meta_json
        FROM tasks
        WHERE acp_session_id IS NOT NULL
          AND trim(acp_session_id) <> ''
          AND trim(acp_session_id) <> task_id`).all();if(t.length===0)return;let n=e.prepare(`SELECT
        workspace_key,
        workspace_path,
        workspace_identity,
        task_id,
        title,
        task_status,
        provider,
        mode,
        model,
        migration_source,
        forked_from_task_id,
        created_at,
        updated_at,
        unread_at,
        last_unread_at,
        pinned,
        archived,
        deleted,
        title_overridden,
        searchable_text,
        meta_json
      FROM tasks
      WHERE workspace_key = ? AND task_id = ?`),s=e.prepare(`UPDATE tasks
      SET task_id = @task_id,
        title = @title,
        task_status = @task_status,
        provider = @provider,
        mode = @mode,
        model = @model,
        migration_source = @migration_source,
        forked_from_task_id = @forked_from_task_id,
        created_at = @created_at,
        updated_at = @updated_at,
        unread_at = @unread_at,
        last_unread_at = @last_unread_at,
        pinned = @pinned,
        archived = @archived,
        deleted = @deleted,
        title_overridden = @title_overridden,
        searchable_text = @searchable_text,
        meta_json = @meta_json,
        acp_session_id = NULL
      WHERE workspace_key = @workspace_key AND task_id = @old_task_id`),o=e.prepare(`UPDATE tasks
      SET title = @title,
        task_status = @task_status,
        provider = @provider,
        mode = @mode,
        model = @model,
        migration_source = @migration_source,
        forked_from_task_id = @forked_from_task_id,
        created_at = @created_at,
        updated_at = @updated_at,
        unread_at = @unread_at,
        last_unread_at = @last_unread_at,
        pinned = @pinned,
        archived = @archived,
        deleted = @deleted,
        title_overridden = @title_overridden,
        searchable_text = @searchable_text,
        meta_json = @meta_json
      WHERE workspace_key = @workspace_key AND task_id = @task_id`),d=e.prepare("DELETE FROM tasks WHERE workspace_key = ? AND task_id = ?");e.exec("BEGIN IMMEDIATE");try{let a=0;for(let c of t){let u=c.acp_session_id?.trim();if(!u)continue;let _=n.get(c.workspace_key,u),l=this.buildLegacyAcpMigratedRow(c,_??null,u);_?(o.run(l),d.run(c.workspace_key,c.task_id)):s.run({...l,old_task_id:c.task_id}),this.migrateLegacyAcpTaskGroupingReferences(c.workspace_key,c.task_id,u),a+=1}e.exec("COMMIT"),a>0&&It.info(void 0,`\u5DF2\u8FC1\u79FB legacy ACP task_id \u5230 ZCode session id \u6570\u91CF=${a}`)}catch(a){throw e.exec("ROLLBACK"),a}}migrateLegacyAcpTaskGroupingReferences(e,t,n){let s=this.getDatabase(),o=Date.now(),d=`${e}\0${t}`,a=`${e}\0${n}`;if(s.prepare(`SELECT 1 AS found
        FROM task_group_members
        WHERE workspace_key = ? AND task_id = ?
        LIMIT 1`).get(e,n)?s.prepare(`DELETE FROM task_group_members
        WHERE workspace_key = ? AND task_id = ?`).run(e,t):s.prepare(`UPDATE task_group_members
        SET task_id = ?, updated_at = ?
        WHERE workspace_key = ? AND task_id = ?`).run(n,o,e,t),s.prepare(`SELECT 1 AS found
        FROM task_group_view_node_orders
        WHERE node_type = 'task' AND node_key = ?
        LIMIT 1`).get(a)){s.prepare(`DELETE FROM task_group_view_node_orders
        WHERE node_type = 'task' AND node_key = ?`).run(d);return}s.prepare(`UPDATE task_group_view_node_orders
      SET node_key = ?, updated_at = ?
      WHERE node_type = 'task' AND node_key = ?`).run(a,o,d)}deleteTaskGroupingReferencesReady(e,t){let n=this.getDatabase();n.prepare(`DELETE FROM task_group_members
        WHERE workspace_key = ? AND task_id = ?`).run(e,t),n.prepare(`DELETE FROM task_group_view_node_orders
        WHERE node_type = 'task' AND (node_key = ? OR node_key = ?)`).run(JSON.stringify([e,t]),e)}cleanupDeletedTaskGroupingReferences(){let e=this.getDatabase(),t=e.prepare(`SELECT workspace_key, task_id
        FROM tasks
        WHERE deleted = 1`).all();if(t.length!==0){e.exec("BEGIN IMMEDIATE");try{for(let n of t)this.deleteTaskGroupingReferencesReady(n.workspace_key,n.task_id);e.exec("COMMIT")}catch(n){throw e.exec("ROLLBACK"),n}}}buildLegacyAcpMigratedRow(e,t,n){let s=Lr(e.meta_json,{taskId:n,workspacePath:e.workspace_path,workspaceIdentity:e.workspace_identity??void 0,title:e.title,createdAt:e.created_at,updatedAt:e.updated_at,mode:e.mode,provider:e.provider??void 0,model:e.model??void 0,status:e.task_status?e.task_status:void 0});if(!t)return{workspace_key:e.workspace_key,task_id:n,title:e.title,task_status:e.task_status,provider:e.provider,mode:e.mode,model:e.model,migration_source:null,forked_from_task_id:e.forked_from_task_id,created_at:e.created_at,updated_at:e.updated_at,unread_at:e.unread_at,last_unread_at:Math.max(e.last_unread_at,e.unread_at??0),pinned:e.pinned,archived:e.archived,deleted:e.deleted,title_overridden:e.title_overridden,searchable_text:e.searchable_text,meta_json:JSON.stringify(s)};let o=Lr(t.meta_json,{...s,taskId:n,workspacePath:t.workspace_path,workspaceIdentity:t.workspace_identity??void 0,title:t.title||e.title,createdAt:Math.min(t.created_at,e.created_at),updatedAt:Math.max(t.updated_at,e.updated_at),mode:t.mode||e.mode,provider:t.provider??e.provider??void 0,model:t.model??e.model??void 0,status:t.task_status?t.task_status:e.task_status?e.task_status:void 0}),d=e.title_overridden===1?e.title:t.title||e.title,a=Math.max(t.updated_at,e.updated_at),c=e.unread_at!==null&&t.unread_at!==null?Math.max(e.unread_at,t.unread_at):e.unread_at??t.unread_at;return{workspace_key:e.workspace_key,task_id:n,title:d,task_status:t.task_status??e.task_status,provider:t.provider??e.provider,mode:t.mode||e.mode,model:t.model??e.model,migration_source:null,forked_from_task_id:t.forked_from_task_id??e.forked_from_task_id,created_at:Math.min(t.created_at,e.created_at),updated_at:a,unread_at:c,last_unread_at:Math.max(e.last_unread_at,t.last_unread_at,c??0),pinned:e.pinned===1||t.pinned===1?1:0,archived:e.archived===1||t.archived===1?1:0,deleted:e.deleted===1?1:t.deleted,title_overridden:e.title_overridden===1||t.title_overridden===1?1:0,searchable_text:t.searchable_text||e.searchable_text,meta_json:JSON.stringify({...o,title:d,updatedAt:a,unreadAt:c??void 0,migrationSource:void 0})}}getDatabase(){if(!this.db)throw new Error("task index sqlite \u5C1A\u672A\u521D\u59CB\u5316");return this.db}writeKey(e){return`${M(e)}\0${e.taskId}`}enqueueWrite(e,t){let n=this.writeKey(e),o=(this.writeChains.get(n)??Promise.resolve()).catch(()=>{}).then(t),d=o.then(()=>{},()=>{});return this.writeChains.set(n,d),d.finally(()=>{this.writeChains.get(n)===d&&this.writeChains.delete(n)}),o}getTaskRow(e){return this.getDatabase().prepare(`SELECT
          workspace_key,
          workspace_path,
          workspace_identity,
          task_id,
          title,
          task_status,
          provider,
          mode,
          model,
          migration_source,
          forked_from_task_id,
          cron_automation_id,
          off_peak_task_id,
          created_at,
          updated_at,
          unread_at,
          last_unread_at,
          pinned,
          archived,
          deleted,
          title_overridden,
          searchable_text,
          meta_json
        FROM tasks
        WHERE workspace_key = ? AND task_id = ?`).get(M(e),e.taskId)??null}getNextGroupedTopSortOrder(){return(this.getDatabase().prepare(`SELECT MIN(sort_order) AS min_sort_order
        FROM task_group_view_node_orders`).get()?.min_sort_order??$*2)-$}upsertGroupedTopOrder(e){this.getDatabase().prepare(`INSERT INTO task_group_view_node_orders (
          node_type,
          node_key,
          sort_order,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(node_type, node_key) DO UPDATE SET
          sort_order = excluded.sort_order,
          updated_at = excluded.updated_at`).run(e.nodeType,e.nodeKey,e.sortOrder,e.now,e.now)}normalizeGroupedTopNodeOrders(e,t){let n=e.filter(c=>!t.has(oe(c).mapKey)).sort((c,u)=>{let _=c.type==="group"?c.group.createdAt:c.task.createdAt,l=u.type==="group"?u.group.createdAt:u.task.createdAt;return l!==_?l-_:oe(c).mapKey.localeCompare(oe(u).mapKey)});if(n.length===0)return;let o=this.getDatabase().prepare(`SELECT MAX(sort_order) AS max_sort_order
        FROM task_group_view_node_orders`).get()?.max_sort_order??0,d=Date.now(),a=this.getDatabase().prepare(`INSERT INTO task_group_view_node_orders (
        node_type,
        node_key,
        sort_order,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?)`);this.getDatabase().exec("BEGIN IMMEDIATE");try{for(let c of n){o+=$;let u=oe(c);a.run(u.nodeType,u.nodeKey,o,d,d);let _={node_type:u.nodeType,node_key:u.nodeKey,sort_order:o,created_at:d,updated_at:d};t.set(u.mapKey,_),c.sortOrder=o}this.getDatabase().exec("COMMIT")}catch(c){throw this.getDatabase().exec("ROLLBACK"),c}}normalizeGroupMemberOrders(e,t,n){let s=t.filter(u=>{let _=n.get(x(u));return!!_&&_?.sort_order===null}).sort((u,_)=>{let l=n.get(x(u)),g=n.get(x(_)),h=l?.added_at??u.createdAt,m=g?.added_at??_.createdAt;return m!==h?m-h:x(u).localeCompare(x(_))});if(s.length===0)return;let d=this.getDatabase().prepare(`SELECT MAX(sort_order) AS max_sort_order
        FROM task_group_members
        WHERE group_id = ?`).get(e)?.max_sort_order??0,a=Date.now(),c=this.getDatabase().prepare(`UPDATE task_group_members
      SET sort_order = ?, updated_at = ?
      WHERE workspace_key = ? AND task_id = ?`);this.getDatabase().exec("BEGIN IMMEDIATE");try{for(let u of s){let _=x(u),l=n.get(_);l&&(d+=$,c.run(d,a,l.workspace_key,l.task_id),l.sort_order=d,l.updated_at=a)}this.getDatabase().exec("COMMIT")}catch(u){throw this.getDatabase().exec("ROLLBACK"),u}}async hasGroupedWorkspaceBootstrapRun(){return await this.ensureReady(),this.hasGroupedWorkspaceBootstrapRunSync()}async archiveStaleTasks(e){await this.ensureReady();let t=Math.max(1,Math.floor(e.olderThanDays)),n=Date.now()-t*24*60*60*1e3,s=["workspace_key = ?","deleted = 0","archived = 0","pinned = 0","unread_at IS NULL","updated_at < ?","task_status = 'completed'"],o=[M(e),n];e.provider&&St(s,o,e.provider);let d=this.getDatabase().prepare(`SELECT
          workspace_key,
          workspace_path,
          workspace_identity,
          task_id,
          title,
          task_status,
          provider,
          mode,
          model,
          migration_source,
          forked_from_task_id,
          cron_automation_id,
          off_peak_task_id,
          created_at,
          updated_at,
          unread_at,
          last_unread_at,
          pinned,
          archived,
          deleted,
          title_overridden,
          searchable_text,
          meta_json
        FROM tasks
        WHERE ${s.join(" AND ")}
        ORDER BY updated_at DESC, created_at DESC, task_id DESC`).all(...o);if(d.length===0)return[];let a=this.getDatabase().prepare(`UPDATE tasks
      SET archived = 1
      WHERE workspace_key = ? AND task_id = ?`);this.getDatabase().exec("BEGIN IMMEDIATE");try{for(let c of d)a.run(c.workspace_key,c.task_id);this.getDatabase().exec("COMMIT")}catch(c){throw this.getDatabase().exec("ROLLBACK"),c}return d.map(G)}hasGroupedWorkspaceBootstrapRunSync(){return!!this.getDatabase().prepare(`SELECT 1 AS found
        FROM task_group_workspace_bootstraps
        LIMIT 1`).get()}bootstrapWorkspaceGroupsForActiveTasks(e){if(e.scopes.length===0||this.hasGroupedWorkspaceBootstrapRunSync())return;let t=this.getDatabase(),n=new Map;for(let k of e.activeTasks){let E=n.get(k.workspace_key)??[];E.push(k),n.set(k.workspace_key,E)}let s=Date.now(),o=t.prepare(`INSERT INTO task_group_workspace_bootstraps (
        workspace_key,
        group_id,
        created_at,
        updated_at
      ) VALUES (?, NULL, ?, ?)
      ON CONFLICT(workspace_key) DO UPDATE SET
        updated_at = excluded.updated_at`);if(n.size===0){o.run(At,s,s);return}let d=new Set(t.prepare(`SELECT node_key
            FROM task_group_view_node_orders
            WHERE node_type = 'group'`).all().map(k=>k.node_key)),c=t.prepare(`SELECT MAX(sort_order) AS max_sort_order
        FROM task_group_view_node_orders`).get()?.max_sort_order??0,u=t.prepare(`INSERT OR IGNORE INTO task_groups (
        group_id,
        title,
        color,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?)`),_=t.prepare(`INSERT OR IGNORE INTO task_group_view_node_orders (
        node_type,
        node_key,
        sort_order,
        created_at,
        updated_at
      ) VALUES ('group', ?, ?, ?, ?)`),l=t.prepare(`DELETE FROM task_group_members
      WHERE workspace_key = ? AND task_id = ?`),g=t.prepare(`INSERT INTO task_group_members (
        group_id,
        workspace_key,
        workspace_path,
        workspace_identity,
        task_id,
        sort_order,
        added_at,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(workspace_key, task_id) DO UPDATE SET
        group_id = excluded.group_id,
        workspace_path = excluded.workspace_path,
        workspace_identity = excluded.workspace_identity,
        sort_order = excluded.sort_order,
        updated_at = excluded.updated_at`),h=t.prepare(`DELETE FROM task_group_view_node_orders
      WHERE node_type = 'task' AND node_key = ?`),m=t.prepare(`INSERT INTO task_group_workspace_bootstraps (
        workspace_key,
        group_id,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?)
      ON CONFLICT(workspace_key) DO UPDATE SET
        group_id = excluded.group_id,
        updated_at = excluded.updated_at`),C=t.prepare(`DELETE FROM task_groups
      WHERE group_id NOT IN (
        SELECT DISTINCT group_id
        FROM task_group_members
      )`),y=t.prepare(`DELETE FROM task_group_view_node_orders
      WHERE node_type = 'group'
        AND node_key NOT IN (
          SELECT group_id
          FROM task_groups
        )`);t.exec("BEGIN IMMEDIATE");try{o.run(At,s,s);for(let k of e.scopes){let E=n.get(k.workspaceKey);if(!E)continue;let w=E.sort((p,P)=>P.updated_at!==p.updated_at?P.updated_at-p.updated_at:P.created_at!==p.created_at?P.created_at-p.created_at:p.task_id.localeCompare(P.task_id));if(w.length===0)continue;let A=Ms(k.workspaceKey),v=xs(k.workspacePath);u.run(A,v,Ws(k.workspaceKey),s,s),d.has(A)||(c+=$,_.run(A,c,s,s),d.add(A)),w.forEach((p,P)=>{l.run(p.workspace_key,p.task_id),g.run(A,p.workspace_key,p.workspace_path,p.workspace_identity,p.task_id,(P+1)*$,s,s,s),h.run(ce({workspacePath:p.workspace_path,workspaceIdentity:p.workspace_identity??void 0,taskId:p.task_id}))}),m.run(k.workspaceKey,A,s,s)}C.run(),y.run(),t.exec("COMMIT")}catch(k){throw t.exec("ROLLBACK"),k}}writeRecord(e){let t=e.searchableText===void 0?this.getTaskRow({workspacePath:e.meta.workspacePath,workspaceIdentity:e.meta.workspaceIdentity,taskId:e.meta.taskId}):null,n=e.searchableText!==void 0?e.searchableText.slice(0,Ps):t?.searchable_text??"";this.getDatabase().prepare(`INSERT INTO tasks (
          workspace_key,
          workspace_path,
          workspace_identity,
          task_id,
          title,
          task_status,
          provider,
          mode,
          model,
          migration_source,
          forked_from_task_id,
          cron_automation_id,
          off_peak_task_id,
          created_at,
          updated_at,
          unread_at,
          last_unread_at,
          pinned,
          archived,
          deleted,
          title_overridden,
          searchable_text,
          meta_json
        ) VALUES (
          @workspace_key,
          @workspace_path,
          @workspace_identity,
          @task_id,
          @title,
          @task_status,
          @provider,
          @mode,
          @model,
          @migration_source,
          @forked_from_task_id,
          @cron_automation_id,
          @off_peak_task_id,
          @created_at,
          @updated_at,
          @unread_at,
          @last_unread_at,
          @pinned,
          @archived,
          @deleted,
          @title_overridden,
          @searchable_text,
          @meta_json
        )
        ON CONFLICT(workspace_key, task_id) DO UPDATE SET
          workspace_path = excluded.workspace_path,
          workspace_identity = excluded.workspace_identity,
          title = excluded.title,
          task_status = excluded.task_status,
          provider = excluded.provider,
          mode = excluded.mode,
          model = excluded.model,
          migration_source = excluded.migration_source,
          forked_from_task_id = excluded.forked_from_task_id,
          cron_automation_id = excluded.cron_automation_id,
          off_peak_task_id = excluded.off_peak_task_id,
          created_at = excluded.created_at,
          updated_at = excluded.updated_at,
          unread_at = CASE
            WHEN @write_unread_at = 1 THEN excluded.unread_at
            ELSE tasks.unread_at
          END,
          last_unread_at = MAX(
            tasks.last_unread_at,
            COALESCE(tasks.unread_at, 0),
            CASE WHEN @write_unread_at = 1 THEN excluded.last_unread_at ELSE 0 END
          ),
          pinned = excluded.pinned,
          archived = excluded.archived,
          deleted = excluded.deleted,
          title_overridden = excluded.title_overridden,
          searchable_text = excluded.searchable_text,
          meta_json = excluded.meta_json`).run({workspace_key:M(e.meta),workspace_path:e.meta.workspacePath,workspace_identity:e.meta.workspaceIdentity??null,task_id:e.meta.taskId,title:e.meta.title,task_status:e.meta.status??null,provider:e.meta.provider??null,mode:e.meta.mode,model:e.meta.model??null,migration_source:e.meta.migrationSource??null,forked_from_task_id:e.meta.forkedFromTaskId??null,cron_automation_id:e.meta.cronAutomationId??null,off_peak_task_id:e.meta.offPeakTaskId??null,created_at:e.meta.createdAt,updated_at:e.meta.updatedAt,unread_at:e.meta.unreadAt??null,last_unread_at:e.meta.unreadAt??0,write_unread_at:e.writeUnreadAt?1:0,pinned:e.pinned?1:0,archived:e.archived?1:0,deleted:e.deleted?1:0,title_overridden:e.titleOverridden?1:0,searchable_text:n,meta_json:Os(e.meta)});let s=this.getTaskRow(e.meta);if(!s)throw new Error(`task index \u5199\u5165\u540E\u7F3A\u5C11 task: ${e.meta.taskId}`);return G(s)}async syncTaskMeta(e){return(await this.syncTaskMetaWithGroupedAdmission(e,!1)).meta}async syncTaskMetaAtGroupedTop(e){return this.syncTaskMetaWithGroupedAdmission(e,!0)}async syncTaskMetaWithGroupedAdmission(e,t){return await this.ensureReady(),this.enqueueWrite(e.meta,()=>{let n=this.getDatabase();t&&n.exec("BEGIN IMMEDIATE");try{let s=this.getTaskRow(e.meta),o=s?G(s):null,d=e.titleOverridden??s?.title_overridden===1,a=Math.max(e.meta.updatedAt,o?.updatedAt??0),c=bs(o,e.meta),u={...e.meta,title:d&&o?o.title:e.meta.title,titleOverridden:d,status:c?o?.status:e.meta.status,lastError:c?o?.lastError:e.meta.lastError,target:Object.prototype.hasOwnProperty.call(e.meta,"target")?e.meta.target:o?.target,migrationSource:e.meta.migrationSource??o?.migrationSource,cronAutomationId:e.meta.cronAutomationId??o?.cronAutomationId,offPeakTaskId:e.meta.offPeakTaskId??o?.offPeakTaskId,updatedAt:a,unreadAt:e.meta.unreadAt??o?.unreadAt},_=this.writeRecord({meta:u,pinned:e.pinned??s?.pinned===1,archived:e.archived??s?.archived===1,deleted:e.deleted??s?.deleted===1,titleOverridden:d,searchableText:e.searchableText});u.cronAutomationId&&!o?.cronAutomationId&&this.ensureCronGroupMembership(u),u.offPeakTaskId&&!o?.offPeakTaskId&&this.ensureOffPeakGroupMembership(u);let l=t?this.initializeGroupedTaskAtTopReady(u):!1;return t&&n.exec("COMMIT"),{meta:_,initializedGroupedOrder:l}}catch(s){throw t&&n.exec("ROLLBACK"),s}})}ensureCronGroupMembership(e){this.ensureSystemGroupMembership(e,{groupId:at,title:"cron",color:"blue"})}ensureOffPeakGroupMembership(e){e.workspaceIdentity&&ke(e.workspaceIdentity)||this.ensureSystemGroupMembership(e,{groupId:ur,title:"off-peak",color:"purple"})}ensureSystemGroupMembership(e,t){let n=this.getDatabase(),s=Date.now();n.prepare(`INSERT OR IGNORE INTO task_groups (group_id, title, color, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)`).run(t.groupId,t.title,t.color,s,s),n.prepare(`INSERT OR IGNORE INTO task_group_view_node_orders (node_type, node_key, sort_order, created_at, updated_at)
        VALUES ('group', ?, ?, ?, ?)`).run(t.groupId,this.getNextGroupedTopSortOrder(),s,s),n.prepare(`INSERT OR IGNORE INTO task_group_members (
          group_id,
          workspace_key,
          workspace_path,
          workspace_identity,
          task_id,
          sort_order,
          added_at,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, NULL, ?, ?, ?)`).run(t.groupId,M(e),e.workspacePath,e.workspaceIdentity??null,e.taskId,s,s,s)}async seedTaskMetaIfMissing(e){return await this.ensureReady(),this.enqueueWrite(e,()=>{let t=this.getTaskRow(e);return t?G(t):this.writeRecord({meta:e,pinned:!1,archived:!1,deleted:!1,titleOverridden:e.titleOverridden??!1})})}async clearTaskUnreadIfMatches(e){return await this.ensureReady(),this.enqueueWrite(e,()=>{let t=this.getDatabase();t.exec("BEGIN IMMEDIATE");try{let n=this.getTaskRow(e);if(!n||n.deleted===1)throw new Error(`task index \u4E2D\u4E0D\u5B58\u5728 task: ${e.taskId}`);let s=G(n);if(s.unreadAt!==e.expectedUnreadAt)return t.exec("COMMIT"),{meta:s,cleared:!1};let o={...s,unreadAt:void 0},d=this.writeRecord({meta:o,pinned:n.pinned===1,archived:n.archived===1,deleted:!1,titleOverridden:n.title_overridden===1,writeUnreadAt:!0});return t.exec("COMMIT"),{meta:d,cleared:!0}}catch(n){throw t.exec("ROLLBACK"),n}})}async deleteArchivedTask(e){return await this.ensureReady(),this.enqueueWrite(e,()=>{let t=this.getDatabase();t.exec("BEGIN IMMEDIATE");try{let n=this.getTaskRow(e);if(!n||n.deleted===1||n.archived!==1)return t.exec("COMMIT"),null;let s=this.writeRecord({meta:G(n),pinned:n.pinned===1,archived:!0,deleted:!0,titleOverridden:n.title_overridden===1});return this.deleteTaskGroupingReferencesReady(n.workspace_key,n.task_id),t.exec("COMMIT"),s}catch(n){throw t.exec("ROLLBACK"),n}})}async updateTaskState(e){return await this.ensureReady(),this.enqueueWrite(e,()=>{let t=this.getDatabase(),n=e.patch.deleted===!0,s=e.patch.unreadAt,o=typeof s=="number",d="unreadAt"in e.patch,a=n||d;a&&t.exec("BEGIN IMMEDIATE");try{let c=this.getTaskRow(e);if(!c||c.deleted===1)throw new Error(`task index \u4E2D\u4E0D\u5B58\u5728 task: ${e.taskId}`);let u=G(c),_=Math.max(c.last_unread_at,c.unread_at??0,u.unreadAt??0),l=o?Math.max(s,_+1):"unreadAt"in e.patch?void 0:u.unreadAt,g={...u,title:e.patch.title??u.title,titleOverridden:e.patch.titleOverridden??u.titleOverridden,model:e.patch.model??u.model,updatedAt:e.patch.updatedAt??u.updatedAt,unreadAt:l,status:e.patch.status??u.status,lastError:"lastError"in e.patch?e.patch.lastError:u.lastError,target:"target"in e.patch?e.patch.target:u.target},h=this.writeRecord({meta:g,pinned:e.patch.pinned??c.pinned===1,archived:e.patch.archived??c.archived===1,deleted:e.patch.deleted??c.deleted===1,titleOverridden:e.patch.titleOverridden??c.title_overridden===1,writeUnreadAt:d});return n&&this.deleteTaskGroupingReferencesReady(c.workspace_key,c.task_id),a&&t.exec("COMMIT"),h}catch(c){throw a&&t.exec("ROLLBACK"),c}})}async applyAgentPatch(e){return await this.ensureReady(),this.enqueueWrite(e,()=>{let t=this.getTaskRow(e);if(!t||t.deleted===1)return null;let n=G(t),s=t.title_overridden!==1,o={...n,title:s&&e.patch.title?e.patch.title:n.title,titleOverridden:t.title_overridden===1,updatedAt:e.patch.updatedAt??n.updatedAt,status:e.patch.status??n.status,lastError:"lastError"in e.patch?e.patch.lastError:n.lastError,target:"target"in e.patch?e.patch.target:n.target};return this.writeRecord({meta:o,pinned:t.pinned===1,archived:t.archived===1,deleted:t.deleted===1,titleOverridden:t.title_overridden===1})})}async listTaskMetas(e){await this.ensureReady();let t=e.workspacePath?M({workspacePath:e.workspacePath,workspaceIdentity:e.workspaceIdentity}):null;return this.getDatabase().prepare(`SELECT
          workspace_key,
          workspace_path,
          workspace_identity,
          task_id,
          title,
          task_status,
          provider,
          mode,
          model,
          migration_source,
          forked_from_task_id,
          cron_automation_id,
          off_peak_task_id,
          created_at,
          updated_at,
          unread_at,
          pinned,
          archived,
          deleted,
          title_overridden,
          searchable_text,
          meta_json
        FROM tasks
        WHERE (@workspace_key IS NULL OR workspace_key = @workspace_key)
          AND (@include_deleted = 1 OR deleted = 0)
          -- Bugfix: ZCode Agent \u5217\u8868\u53EA\u63A5\u53D7\u5F53\u524D glm provider\uFF1BClaude Code \u5BFC\u5165\u4E5F\u5C5E\u4E8E\u975E glm \u5386\u53F2\u6570\u636E\u3002
          AND (@provider IS NULL OR provider = @provider)
          AND (@pinned IS NULL OR pinned = @pinned)
          AND (@archived IS NULL OR archived = @archived)
        ORDER BY updated_at DESC, created_at DESC, task_id DESC`).all({workspace_key:t,include_deleted:e.includeDeleted?1:0,provider:e.provider??null,pinned:typeof e.pinned=="boolean"?e.pinned?1:0:null,archived:typeof e.archived=="boolean"?e.archived?1:0:null}).map(G)}async listDeletedTaskIds(e){await this.ensureReady();let t=M({workspacePath:e.workspacePath,workspaceIdentity:e.workspaceIdentity});return this.getDatabase().prepare(`SELECT task_id
        FROM tasks
        WHERE workspace_key = @workspace_key
          AND deleted = 1
          AND (@provider IS NULL OR provider = @provider)
        ORDER BY task_id`).all({workspace_key:t,provider:e.provider??null}).map(s=>s.task_id)}async listSessionsByAutomation(e){return await this.ensureReady(),this.getDatabase().prepare(`SELECT
          workspace_key,
          workspace_path,
          workspace_identity,
          task_id,
          title,
          task_status,
          provider,
          mode,
          model,
          migration_source,
          forked_from_task_id,
          cron_automation_id,
          off_peak_task_id,
          created_at,
          updated_at,
          unread_at,
          pinned,
          archived,
          deleted,
          title_overridden,
          searchable_text,
          meta_json
        FROM tasks
        WHERE cron_automation_id = @automation_id
          AND deleted = 0
        ORDER BY created_at DESC, task_id DESC`).all({automation_id:e}).map(G)}async queryTaskList(e){await this.ensureReady();let t=Ce(e.workspaceScopes);if(t.length===0)return{items:[],total:0,hasMore:!1};let n=e.search?.trim(),s=n&&n.length>0?`%${n.toLocaleLowerCase()}%`:null,o=["deleted = 0",`workspace_key IN (${t.map(()=>"?").join(", ")})`],d=[...t];e.provider&&St(o,d,e.provider),e.kind==="pinned"?o.push("pinned = 1","archived = 0"):e.kind==="archived"?o.push("archived = 1"):o.push("pinned = 0","archived = 0"),s&&o.push("(LOWER(title) LIKE ? OR LOWER(searchable_text) LIKE ?)"),s&&d.push(s,s);let a=o.join(" AND "),u=this.getDatabase().prepare(`SELECT COUNT(1) AS total FROM tasks WHERE ${a}`).get(...d)?.total??0,_=Ds(e.limit),l=[...d];_!==null&&l.push(_);let g=e.sortBy==="created"?"created_at DESC, updated_at DESC, task_id DESC":"updated_at DESC, created_at DESC, task_id DESC",h=this.getDatabase().prepare(`SELECT
          workspace_key,
          workspace_path,
          workspace_identity,
          task_id,
          title,
          task_status,
          provider,
          mode,
          model,
          migration_source,
          forked_from_task_id,
          cron_automation_id,
          off_peak_task_id,
          created_at,
          updated_at,
          unread_at,
          pinned,
          archived,
          deleted,
          title_overridden,
          searchable_text,
          meta_json
        FROM tasks
        WHERE ${a}
        ORDER BY ${g}${_===null?"":" LIMIT ?"}`).all(...l),m=new Map(e.workspaceScopes.flatMap(C=>C.workspacePurpose?[[M(C),C.workspacePurpose]]:[]));return{items:h.map(C=>{let y=Dr(C,n??null),k=m.get(C.workspace_key);return k?{...y,workspacePurpose:k}:y}),total:u,hasMore:u>h.length}}async createTaskGroup(e){await this.ensureReady();let t=Date.now(),n=`task-group-${Es()}`,s=e?.title?.trim()||"New Group",o=e?.color??Ct;return this.getDatabase().prepare(`INSERT INTO task_groups (
          group_id,
          title,
          color,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?)`).run(n,s,o,t,t),this.upsertGroupedTopOrder({nodeType:"group",nodeKey:n,sortOrder:this.getNextGroupedTopSortOrder(),now:t}),{id:n,title:s,color:o,createdAt:t,updatedAt:t}}async renameTaskGroup(e){await this.ensureReady();let t=e.title.trim()||"New Group",n=Date.now(),s=this.getDatabase();if(s.prepare(`UPDATE task_groups
        SET title = ?, updated_at = ?
        WHERE group_id = ?`).run(t,n,e.groupId).changes===0)throw new Error("Task group \u4E0D\u5B58\u5728\uFF0C\u65E0\u6CD5\u91CD\u547D\u540D");let d=s.prepare(`SELECT
          group_id,
          title,
          color,
          created_at,
          updated_at
        FROM task_groups
        WHERE group_id = ?`).get(e.groupId);if(!d)throw new Error("Task group \u91CD\u547D\u540D\u540E\u8BFB\u53D6\u5931\u8D25");return ve(d)}async updateTaskGroupColor(e){if(await this.ensureReady(),!xr(e.color))throw new Error("Task group \u989C\u8272\u65E0\u6548");let t=Date.now(),n=this.getDatabase();if(n.prepare(`UPDATE task_groups
        SET color = ?, updated_at = ?
        WHERE group_id = ?`).run(e.color,t,e.groupId).changes===0)throw new Error("Task group \u4E0D\u5B58\u5728\uFF0C\u65E0\u6CD5\u66F4\u65B0\u989C\u8272");let o=n.prepare(`SELECT
          group_id,
          title,
          color,
          created_at,
          updated_at
        FROM task_groups
        WHERE group_id = ?`).get(e.groupId);if(!o)throw new Error("Task group \u66F4\u65B0\u989C\u8272\u540E\u8BFB\u53D6\u5931\u8D25");return ve(o)}async deleteTaskGroup(e){await this.ensureReady();let t=this.getDatabase();t.exec("BEGIN IMMEDIATE");try{if(t.prepare("DELETE FROM task_groups WHERE group_id = ?").run(e.groupId).changes===0)throw new Error("Task group \u4E0D\u5B58\u5728\uFF0C\u65E0\u6CD5\u5220\u9664");t.prepare(`DELETE FROM task_group_view_node_orders
          WHERE node_type = 'group' AND node_key = ?`).run(e.groupId),t.exec("COMMIT")}catch(n){throw t.exec("ROLLBACK"),n}}async initializeGroupedTaskAtTop(e){return await this.ensureReady(),this.initializeGroupedTaskAtTopReady(e)}initializeGroupedTaskAtTopReady(e){let t=this.getTaskRow(e);if(!t||t.deleted===1||t.archived===1||t.pinned===1)return!1;let n=this.getDatabase(),s=n.prepare(`SELECT 1 AS found
        FROM task_group_members
        WHERE workspace_key = ? AND task_id = ?
        LIMIT 1`).get(M(e),e.taskId),o=ce(e),d=n.prepare(`SELECT 1 AS found
        FROM task_group_view_node_orders
        WHERE node_type = 'task' AND node_key = ?
        LIMIT 1`).get(o);if(s||d)return!1;let a=Date.now();return this.upsertGroupedTopOrder({nodeType:"task",nodeKey:o,sortOrder:this.getNextGroupedTopSortOrder(),now:a}),!0}async queryGroupedTaskView(e){await this.ensureReady();let t=e.includeAllWorkspaces===!0,n=Nr(e.workspaceScopes),s=Ce(e.workspaceScopes),o=["deleted = 0","archived = 0","pinned = 0",...t?[]:[`workspace_key IN (${s.map(()=>"?").join(", ")})`]],d=t?[]:[...s];e.provider&&St(o,d,e.provider);let a=!t&&s.length===0?[]:this.getDatabase().prepare(`SELECT
                workspace_key,
                workspace_path,
                workspace_identity,
                task_id,
                title,
                task_status,
                provider,
                mode,
                model,
                migration_source,
                forked_from_task_id,
                cron_automation_id,
                created_at,
                updated_at,
                unread_at,
                pinned,
                archived,
                deleted,
                title_overridden,
                searchable_text,
                meta_json
              FROM tasks
              WHERE ${o.join(" AND ")}`).all(...d),c=t?Nr(a.map(p=>({workspacePath:p.workspace_path,workspaceIdentity:p.workspace_identity??void 0}))):n;this.bootstrapWorkspaceGroupsForActiveTasks({scopes:c,activeTasks:a});let u=this.getDatabase().prepare(`SELECT workspace_key, group_id
        FROM task_group_workspace_bootstraps
        WHERE group_id IS NOT NULL`).all(),_=new Map(u.filter(p=>p.group_id).map(p=>[p.group_id,p.workspace_key])),l=new Set(t?a.map(p=>p.workspace_key):s),h=this.getDatabase().prepare(`SELECT
          group_id,
          title,
          color,
          created_at,
          updated_at
        FROM task_groups`).all().filter(p=>{let P=_.get(p.group_id);return!P||l.has(P)}).map(ve),m=this.getDatabase().prepare(`SELECT
          group_id,
          workspace_key,
          workspace_path,
          workspace_identity,
          task_id,
          sort_order,
          added_at,
          created_at,
          updated_at
        FROM task_group_members`).all(),C=this.getDatabase().prepare(`SELECT
          node_type,
          node_key,
          sort_order,
          created_at,
          updated_at
        FROM task_group_view_node_orders`).all(),y=new Map(C.map(p=>[`${p.node_type}:${p.node_key}`,p])),k=new Map(m.map(p=>[`${p.workspace_key}\0${p.task_id}`,p])),E=new Map;for(let p of m){let P=E.get(p.group_id)??[];P.push(p),E.set(p.group_id,P)}let w=new Map(a.map(p=>[`${p.workspace_key}\0${p.task_id}`,Dr(p,null)])),A=new Set,v=h.map(p=>{let P=(E.get(p.id)??[]).map(S=>w.get(`${S.workspace_key}\0${S.task_id}`)).filter(S=>!!S);p.id===at?P.sort(Us):(this.normalizeGroupMemberOrders(p.id,P,k),P.sort((S,W)=>Zs(S,W,k)));for(let S of P)A.add(x(S));let T=y.get(`group:${p.id}`);return{type:"group",group:p,tasks:P,...T?{sortOrder:T.sort_order}:{}}});for(let p of w.values()){let P=x(p);if(k.has(P)||A.has(P))continue;let T=y.get(`task:${ce(p)}`);v.push({type:"task",task:p,...T?{sortOrder:T.sort_order}:{}})}return this.normalizeGroupedTopNodeOrders(v,y),v.sort(Gs),{nodes:v}}async queryGroupedTaskViewStructure(e){await this.ensureReady();let t=new Set(Ce(e.workspaceScopes)),n=this.getDatabase().prepare(`SELECT workspace_key, group_id
        FROM task_group_workspace_bootstraps
        WHERE group_id IS NOT NULL`).all(),s=new Map(n.filter(l=>l.group_id).map(l=>[l.group_id,l.workspace_key])),d=this.getDatabase().prepare(`SELECT
          group_id,
          title,
          color,
          created_at,
          updated_at
        FROM task_groups`).all().filter(l=>{let g=s.get(l.group_id);return!g||t.has(g)}).map(ve),c=this.getDatabase().prepare(`SELECT
          group_id,
          workspace_key,
          workspace_path,
          workspace_identity,
          task_id,
          sort_order,
          added_at,
          created_at,
          updated_at
        FROM task_group_members`).all().map(l=>({groupId:l.group_id,workspaceKey:l.workspace_key,workspacePath:l.workspace_path,...l.workspace_identity?{workspaceIdentity:l.workspace_identity}:{},taskId:l.task_id,sortOrder:l.sort_order,addedAt:l.added_at})),u=this.getDatabase().prepare(`SELECT
          node_type,
          node_key,
          sort_order,
          created_at,
          updated_at
        FROM task_group_view_node_orders`).all(),_=[];for(let l of u){if(l.node_type==="group"){_.push({type:"group",groupId:l.node_key,sortOrder:l.sort_order});continue}try{let g=JSON.parse(l.node_key);Array.isArray(g)&&typeof g[0]=="string"&&typeof g[1]=="string"&&_.push({type:"task",workspaceKey:g[0],taskId:g[1],sortOrder:l.sort_order})}catch{}}return{groups:d,members:c,topLevelOrders:_}}async applyGroupedTaskViewOrder(e){await this.ensureReady();let t=new Set(Ce(e.workspaceScopes)),n=Date.now(),s=this.getDatabase(),o=new Set(s.prepare("SELECT group_id FROM task_groups").all().map(g=>g.group_id)),d=i(g=>{let h=M(g);if(!t.has(h))throw new Error("Grouped task order \u5305\u542B\u5F53\u524D scope \u5916\u7684 task");let m=this.getTaskRow(g);if(!m||m.deleted===1||m.archived===1||m.pinned===1)throw new Error("Grouped task order \u5305\u542B\u4E0D\u53EF\u89C1 task");return e.provider&&m.provider!==e.provider?null:h},"validateTaskRef"),a=new Set,c=new Set,u=[],_=[];for(let g of e.topLevelNodes){if(g.type==="group"){if(!o.has(g.groupId))throw new Error("Grouped task order \u5305\u542B\u4E0D\u5B58\u5728\u7684 group");u.push(g);continue}let h=d(g.task);if(!h)continue;let m=`${h}\0${g.task.taskId}`;a.add(m),u.push(g)}for(let g of e.groups){if(!o.has(g.groupId))throw new Error("Grouped task order \u5305\u542B\u4E0D\u5B58\u5728\u7684 group");let h=[];for(let m of g.taskRefs){let C=d(m);if(!C)continue;let y=`${C}\0${m.taskId}`;if(c.has(y))throw new Error("Grouped task order \u4E0D\u80FD\u8BA9\u540C\u4E00\u4E2A task \u8FDB\u5165\u591A\u4E2A group");c.add(y),h.push(m)}_.push({groupId:g.groupId,taskRefs:h})}let l=t.size===0?[]:s.prepare(`SELECT workspace_key, task_id
              FROM tasks
              WHERE workspace_key IN (${[...t].map(()=>"?").join(", ")})`).all(...t).map(g=>`${g.workspace_key}\0${g.task_id}`);s.exec("BEGIN IMMEDIATE");try{s.prepare(`INSERT INTO task_group_workspace_bootstraps (
          workspace_key,
          group_id,
          created_at,
          updated_at
        ) VALUES (?, NULL, ?, ?)
        ON CONFLICT(workspace_key) DO UPDATE SET
          updated_at = excluded.updated_at`).run(At,n,n);let h=s.prepare(`DELETE FROM task_group_members
        WHERE workspace_key = ? AND task_id = ?`),m=s.prepare(`INSERT INTO task_group_members (
          group_id,
          workspace_key,
          workspace_path,
          workspace_identity,
          task_id,
          sort_order,
          added_at,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(workspace_key, task_id) DO UPDATE SET
          group_id = excluded.group_id,
          workspace_path = excluded.workspace_path,
          workspace_identity = excluded.workspace_identity,
          sort_order = excluded.sort_order,
          updated_at = excluded.updated_at`);for(let k of a){let[E,w]=k.split("\0");if(!E||!w)throw new Error("Grouped task order \u9876\u5C42 task key \u975E\u6CD5");h.run(E,w)}for(let k of _)k.taskRefs.forEach((E,w)=>{let A=M(E);m.run(k.groupId,A,E.workspacePath,E.workspaceIdentity??null,E.taskId,(w+1)*$,n,n,n)});s.prepare("DELETE FROM task_group_view_node_orders WHERE node_type = 'group'").run();let C=s.prepare(`DELETE FROM task_group_view_node_orders
        WHERE node_type = 'task' AND (node_key = ? OR node_key = ?)`);for(let k of l){let[E,w]=k.split("\0");!E||!w||C.run(JSON.stringify([E,w]),E)}let y=s.prepare(`INSERT INTO task_group_view_node_orders (
          node_type,
          node_key,
          sort_order,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?)`);u.forEach((k,E)=>{let w=k.type,A=k.type==="group"?k.groupId:ce(k.task);y.run(w,A,(E+1)*$,n,n)}),s.exec("COMMIT")}catch(g){throw s.exec("ROLLBACK"),g}return this.queryGroupedTaskView({workspaceScopes:e.workspaceScopes,provider:e.provider})}async getTaskMeta(e){await this.ensureReady();let t=this.getTaskRow(e);return!t||t.deleted===1?null:G(t)}};var{DatabaseSync:$s}=Bs(import.meta.url)("node:sqlite"),Ne=60*6e4;async function Ks(r,e){let t=i((c,u)=>e(c,u?{...u}:void 0),"report");t("checking"),await Fs(Hs(r),{recursive:!0});let n=new $s(r),s,o;try{n.exec("PRAGMA busy_timeout = 25"),n.exec("PRAGMA foreign_keys = ON");let c=Date.now()+Ne,u=i(async _=>{let l=!1;for(;;)try{typeof _=="string"?n.exec(_):_();return}catch(g){let h=g.errcode;if(typeof h!="number"||(h&255)!==5)throw g;if(Date.now()>=c)throw Object.assign(new Error("Task storage lock wait expired",{cause:g}),{kind:"lock_timeout"});l||(l=!0,t("waiting_for_lock",o)),await new Promise(m=>setTimeout(m,100))}},"acquire");await u("PRAGMA journal_mode = WAL"),n.exec("PRAGMA synchronous = NORMAL"),await u(()=>{o={kind:kt(n),executedCount:0,committedCount:0}}),t("checking",o),await u("BEGIN IMMEDIATE"),B(n,{transactionOpen:!0,migration:o,onProgress:t}),t("maintaining",o)}catch(c){if(s=c,o&&c&&typeof c=="object")try{Object.assign(c,{startupMigration:{...o}})}catch{}throw c}finally{try{n.close()}catch(c){if(!s)throw c}}Er(r);let d=[new be(r,Ne),new Se(r,Ne),new Ie(r,Ne)],a;try{for(let c of d)await c.ensureReady()}catch(c){throw a=c,c}finally{let c;for(let u of d)try{u.close({throwOnError:!0})}catch(_){c??=_}if(!a&&c)throw c}Tt(r),t("ready",o)}i(Ks,"prepareTasksIndexStorage");f();f();f();import{stat as qs}from"fs/promises";async function vt(r,e=qs){let t=i(async s=>{if(!s)return!1;try{return(await e(s)).isDirectory()}catch{return!1}},"usable"),n=await t(r.requestedCwd);return r.requestedCwd===r.workspacePath&&!n&&await t(r.spawnFallbackCwd)?{cwd:r.spawnFallbackCwd,usedFallback:!0,cwdExists:!0}:{cwd:r.requestedCwd,usedFallback:!1,cwdExists:n}}i(vt,"resolveZCodeAgentSpawnCwd");import{spawn as Ti}from"child_process";import{randomUUID as yi}from"crypto";import{existsSync as jt,mkdirSync as wi,writeFileSync as Ri}from"fs";import{dirname as Dn,isAbsolute as Pi,join as Ln,resolve as vn}from"path";f();import{existsSync as Xr}from"fs";import{homedir as jr}from"os";import{dirname as sc,resolve as N}from"path";f();import{existsSync as _o}from"fs";import{delimiter as mo}from"path";f();import{accessSync as Xs,constants as js,existsSync as Wr}from"fs";import{delimiter as Oe,dirname as Vs,join as zs,resolve as K}from"path";function bt(r){try{return Xs(r,js.X_OK),!0}catch{return!1}}i(bt,"isExecutableFile");function Js(r){for(let e of r)if(e&&Wr(e)&&bt(e))return e;return null}i(Js,"resolveExistingPath");function Ys(r,e=process.env){let t=e.PATH;if(!t)return null;let n=process.platform==="win32"?e.PATHEXT?.split(";").filter(Boolean)??[".EXE",".CMD",".BAT",".COM"]:[""],s=process.platform==="win32"&&!r.includes(".")?n:[""];for(let o of t.split(Oe))if(o)for(let d of s){let a=zs(o,`${r}${d}`);if(bt(a))return a}return null}i(Ys,"resolveCommandOnPath");function Qs(r){let e=`${process.platform}-${process.arch}`;return[K(process.cwd(),"bundled-tools",e),K(process.cwd(),"packages","desktop","bundled-tools",e),K(process.cwd(),"..","desktop","bundled-tools",e),r?K(r,"..","..","..","desktop","bundled-tools",e):null,r?K(r,"..","..","desktop","bundled-tools",e):null]}i(Qs,"resolvePlatformScopedBundledToolRoots");function Gr(r,e){let t=r?.split(Oe).filter(Boolean)??[];return Ur([...e,...t])}i(Gr,"prependPathEntries");function Nt(r,e){let t=r?.split(Oe).filter(Boolean)??[];return Ur([...t,...e])}i(Nt,"appendPathEntries");function Ur(r){let e=[],t=new Set;for(let n of r)!n||t.has(n)||(t.add(n),e.push(n));return e.join(Oe)}i(Ur,"joinUniquePathEntries");function eo(r,e=process.env){let t=ct(r),n=t.resolveEntrySegments(process.platform),s=e[t.binaryEnvVar]?.trim();if(s&&Wr(s)&&bt(s))return s;let o=typeof process.resourcesPath=="string"?process.resourcesPath:null,d=e.ZCODE_SERVER_RUNTIME_ROOT?.trim(),a=import.meta.dirname,c=Js([d?K(d,"tools",t.bundledResourceDir,...n):null,o?K(o,"tools",t.bundledResourceDir,...n):null,...Qs(a).map(_=>_?K(_,t.bundledResourceDir,...n):null)]);if(c)return c;let u=n[n.length-1];return u?Ys(u.replace(/\.exe$/i,""),e):null}i(eo,"findRuntimeToolBinary");function Zr(r,e=process.env){let t={},n=[];for(let s of r){let o=ct(s),d=eo(s,e);d&&(t[o.binaryEnvVar]=d,n.push(Vs(d)))}return n.length>0&&(t.PATH=Nt(e.PATH,n)),t}i(Zr,"buildRuntimeToolEnvPatch");f();import{execFileSync as to,spawn as Ud}from"child_process";import{accessSync as ro,constants as no}from"fs";var Fr="__ZCODE_LOGIN_ENV_START__",Hr="__ZCODE_LOGIN_ENV_END__",so=process.platform==="darwin"?"/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin":"/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",Z;function oo(r){try{return ro(r,no.X_OK),!0}catch{return!1}}i(oo,"isExecutableFile");function io(r){let e=[r.SHELL,"/bin/zsh","/bin/bash","/bin/sh"];for(let t of e)if(t&&oo(t))return t;return null}i(io,"resolveShellPathForLoginEnv");function Ot(r){return Gr(r,so.split(":"))}i(Ot,"buildShellBootstrapPath");function ao(r){let e=`printf '%s\\0' '${Fr}'; env -0; printf '%s\\0' '${Hr}'`;return r.endsWith("/zsh")||r.endsWith("/bash")?["-ilc",e]:["-lc",e]}i(ao,"buildLoginShellArgs");function co(r){return{encoding:"utf8",windowsHide:!0,timeout:4e3,maxBuffer:2*1024*1024,env:{...r,PATH:Ot(r.PATH),TERM:"dumb",CI:"1"}}}i(co,"buildLoginShellExecutionOptions");function uo(r){let e=`${Fr}\0`,t=`${Hr}\0`,n=r.lastIndexOf(e),s=r.lastIndexOf(t);return n<0||s<=n?null:lo(r.slice(n+e.length,s))}i(uo,"extractCapturedEnvSnapshot");function lo(r){let e={};for(let t of r.split("\0")){if(!t)continue;let n=t.indexOf("=");if(n<=0)continue;let s=t.slice(0,n).trim();/^[A-Za-z_][A-Za-z0-9_]*$/.test(s)&&(e[s]=t.slice(n+1))}return e}i(lo,"parseNullSeparatedEnvSnapshot");function Br(r){if(Z!==void 0)return Z;if(process.platform==="win32"||process.env.VITEST)return Z=null,Z;let e=io(r);if(!e)return Z=null,Z;try{let t=to(e,ao(e),co(r));Z=uo(t)}catch{Z=null}return Z}i(Br,"captureLoginShellEnvSnapshotSync");var fo=["%APPDATA%\\npm","%ProgramFiles%\\nodejs","%ProgramFiles(x86)%\\nodejs","%LOCALAPPDATA%\\Programs\\nodejs"],go={PYTHONIOENCODING:"utf-8",PYTHONUTF8:"1"},$r=!1;function ho(r,e){let t=Object.keys(r).find(n=>n.toUpperCase()===e.toUpperCase());return t?r[t]:void 0}i(ho,"readWindowsEnvValue");function ko(r,e){return r.replace(/%([^%]+)%/g,(t,n)=>ho(e,n)||"")}i(ko,"expandWindowsEnvVars");function Eo(r){let e=[];for(let t of fo){let n=ko(t,r);n&&_o(n)&&e.push(n)}return e}i(Eo,"resolveWindowsNodePaths");var To=[/^KUBECONFIG$/i,/^KUBE_CONFIG_PATH$/i,/^KUBECTL_KUBECONFIG$/i,/^SSH_AUTH_SOCK$/i,/^AWS_PROFILE$/i,/^AWS_REGION$/i,/^AWS_DEFAULT_REGION$/i,/^AWS_SDK_LOAD_CONFIG$/i,/^GOOGLE_APPLICATION_CREDENTIALS$/i,/^LANG$/i,/^LC_[A-Z0-9_]+$/i,/^XDG_CONFIG_HOME$/i,/^XDG_DATA_HOME$/i,/^XDG_CACHE_HOME$/i,/^TERM$/i,/^COLORTERM$/i,/^TERM_PROGRAM$/i,/^TERM_PROGRAM_VERSION$/i,/^NPM_CONFIG_USERCONFIG$/i,/^NPM_CONFIG_PREFIX$/i,/^PNPM_HOME$/i,/^NVM_DIR$/i,/^NVM_CD_FLAGS$/i,/^FNM_[A-Z0-9_]+$/i,/^VOLTA_HOME$/i,/^CARGO_HOME$/i,/^RUSTUP_HOME$/i,/^GOPATH$/i,/^GOROOT$/i,/^GOENV_ROOT$/i,/^GVM_ROOT$/i,/^gvm_[A-Za-z0-9_]+$/i,/^JAVA_HOME$/i,/^JENV_ROOT$/i,/^SDKMAN_DIR$/i,/^SDKMAN_CANDIDATES_DIR$/i,/^SDKMAN_PLATFORM$/i,/^VIRTUAL_ENV$/i,/^CONDA_PREFIX$/i,/^PYENV_ROOT$/i,/^PYENV_VERSION$/i,/^PYENV_VIRTUALENV_[A-Z0-9_]+$/i,/^PIP_CONFIG_FILE$/i,/^DIRENV_[A-Z0-9_]+$/i,/^MISE_[A-Z0-9_]+$/i,/^rvm_[A-Za-z0-9_]+$/i,/^MY_RUBY_HOME$/i,/^GEM_HOME$/i,/^GEM_PATH$/i,/^RUBIES$/i,/^CHRUBY_ROOT$/i,/^RBENV_ROOT$/i,/^NODENV_ROOT$/i,/^AUTOENV_[A-Z0-9_]+$/i];function yo(r){return To.some(e=>e.test(r))}i(yo,"shouldInheritLoginShellEnvKey");function wo(r){let e={};for(let[t,n]of Object.entries(r))n!==void 0&&yo(t)&&(e[t]=n);return{...e,...ot(r)}}i(wo,"buildLoginShellEnvPatch");function Kr(r,e=process.platform){let t={...r};if(e!=="win32")return t;let n;for(let[s,o]of Object.entries(r))s.toUpperCase()==="PATH"&&o!==void 0&&(n=o);for(let s of Object.keys(t))s.toUpperCase()==="PATH"&&delete t[s];return n!==void 0&&(t.PATH=n),t}i(Kr,"normalizeRuntimeProcessEnv");function qr(r=process.env,e=Br(r),t={}){let n=t.platform??process.platform,s=Kr(r,n),o=e?.PATH?.trim()||null,d=e?wo(e):{},a=ot({...s,...d}),c=Zr(["bfs","ripgrep","ugrep"],{...s,PATH:void 0}),u=c.PATH?.split(mo).filter(Boolean)??[],_=n==="win32"?s.PATH:Ot(s.PATH),l=o??_,g={...d,...a,...c,...go};if(n==="win32"){let m=t.windowsNodePaths??Eo(s);u.push(...m)}if(!!o||u.length>0||n==="win32"&&!!s.PATH||n!=="win32"&&l!==s.PATH){let m=Nt(l,u);m&&(g.PATH=m)}return g}i(qr,"buildRuntimeProcessEnvPatch");function zd(r){if($r)return;$r=!0;let e=Kr(process.env);if(process.platform==="win32"){for(let n of Object.keys(process.env))n.toUpperCase()==="PATH"&&delete process.env[n];e.PATH!==void 0&&(process.env.PATH=e.PATH)}let t=r??qr(e);it(process.env),Object.assign(process.env,t)}i(zd,"initializeRuntimeProcessEnv");var De=typeof process.resourcesPath=="string"?process.resourcesPath:null;function Vr(r){for(let e of r)if(e&&Xr(e))return e;return null}i(Vr,"resolveExistingPath");function zr(r){let e=`${process.platform}-${process.arch}`;return[N(process.cwd(),"bundled-agents",e),N(process.cwd(),"packages","desktop","bundled-agents",e),N(process.cwd(),"..","desktop","bundled-agents",e),r?N(r,"..","..","desktop","bundled-agents",e):null,r?N(r,"..","..","bundled-agents",e):null]}i(zr,"resolvePlatformScopedBundledAgentRoots");function Jr(r){return[N(process.cwd(),"bundled-resources"),N(process.cwd(),"packages","desktop","bundled-resources"),N(process.cwd(),"..","desktop","bundled-resources"),r?N(r,"..","..","desktop","bundled-resources"):null,r?N(r,"..","..","bundled-resources"):null]}i(Jr,"resolveLegacyBundledResourceRoots");function Yr(){let r=U,e=r.resolveEntrySegments(process.platform),t=[r.bundledResourceDir,...e],n=process.env[r.binaryEnvVar];if(n&&Xr(n))return n;let s=import.meta.dirname,o=zr(s),d=Jr(s),a=[De?N(De,...t):null,N(jr(),".zcode","server","agents",...t),...o.map(c=>c?N(c,r.bundledResourceDir,...e):null),...d.map(c=>c?N(c,...t):null)];return Vr(a)}i(Yr,"findZCodeAgentRuntimeBinary");function Qr(){let r=U,e=r.resolveNodeBundleSegments(),t=[r.bundledResourceDir,...e],n=import.meta.dirname,s=zr(n),o=Jr(n),d=[De?N(De,...t):null,N(jr(),".zcode","server","agents",...t),...s.map(a=>a?N(a,r.bundledResourceDir,...e):null),...o.map(a=>a?N(a,...t):null)];return Vr(d)}i(Qr,"findZCodeAgentRuntimeNodeBundle");f();f();import{randomUUID as en}from"crypto";var Ro=3e4,Le=class{static{i(this,"ZCodeStorageStartupGate")}current;terminalError;pending;resolve;reject;timer;changed=new L;onDidChange=this.changed.event;constructor(e,t=Ro){e&&(this.ensurePending(),this.timer=setTimeout(()=>this.fail("startup_status_timeout"),t),this.timer.unref?.())}get isWaiting(){return!!(this.terminalError||this.pending&&this.current?.phase!=="ready")}get snapshot(){return this.current}accept(e){let t=nr.safeParse(e);if(!t.success||this.terminalError)return!1;let n=t.data;return this.current&&(n.attemptId!==this.current.attemptId||n.databaseId!==this.current.databaseId||n.sequence<=this.current.sequence||this.current.phase==="ready"||this.current.phase==="failed")?!1:(clearTimeout(this.timer),this.current=n,n.phase==="ready"?this.resolve?.():n.phase==="failed"?this.fail(n.errorCode??"sql_failed"):this.ensurePending(),this.changed.fire(n),!0)}async wait(e){if(e?.throwIfAborted(),this.terminalError)throw this.terminalError;if(!this.pending||this.current?.phase==="ready")return;if(!e)return this.pending;let t;try{await Promise.race([this.pending,new Promise((n,s)=>{t=i(()=>s(e.reason),"abort"),e.addEventListener("abort",t,{once:!0})})])}finally{e.removeEventListener("abort",t)}}dispose(){clearTimeout(this.timer),this.pending&&this.current?.phase!=="ready"&&!this.terminalError&&this.fail("transport_closed"),this.changed.dispose()}ensurePending(){this.pending||(this.pending=new Promise((e,t)=>{this.resolve=e,this.reject=t}),this.pending.catch(()=>{}))}fail(e){this.current?.phase!=="failed"&&(this.current=this.current?{...this.current,phase:"failed",errorCode:e,sequence:this.current.sequence+1}:{schemaVersion:1,attemptId:en(),databaseId:`unresolved:${en()}`,databaseKind:"session",sequence:1,phase:"failed",elapsedMs:0,errorCode:e},this.changed.fire(this.current)),this.terminalError=new Error(`SQLite startup failed: ${e}`),this.reject?.(this.terminalError)}};var Po=3*6e4,Dt=class extends Error{constructor(t,n,s){super(t);this.code=n;this.data=s;this.name="ZCodeProtocolClientError"}code;data;static{i(this,"ZCodeProtocolClientError")}},Lt=class extends Error{constructor(t,n,s){super(`ZCode Protocol request timed out: ${t}`);this.method=t;this.requestId=n;this.timeoutMs=s;this.name="ZCodeProtocolRequestTimeoutError"}method;requestId;timeoutMs;static{i(this,"ZCodeProtocolRequestTimeoutError")}},Me=class{constructor(e,t){this.transport=e;this.storageStartup=new Le(t?.requireStorageStartup??!1),this.requestTimeoutMs=t?.requestTimeoutMs??Po,this.disposables.push(e.onMessage(n=>this.handleMessage(n)),e.onClose(n=>{this.storageStartup.dispose();let s=n.reason?`: ${n.reason}`:"";this.rejectAll(new Error(`ZCode agent transport closed${s}`)),this.closeEmitter.fire()}))}transport;static{i(this,"ZCodeProtocolClient")}storageStartup;pending=new Map;notificationEmitter=new L;requestEmitter=new L;requestTimeoutEmitter=new L;pendingDrainedEmitter=new L;closeEmitter=new L;disposables=[];nextRequestId=1;disposed=!1;requestTimeoutMs;get isDisposed(){return this.disposed}onNotification=this.notificationEmitter.event;onRequest=this.requestEmitter.event;onRequestTimeout=this.requestTimeoutEmitter.event;onPendingRequestsDrained=this.pendingDrainedEmitter.event;onClose=this.closeEmitter.event;get pendingRequestCount(){return this.pending.size}get pendingOperationRequestCount(){let e=0;for(let t of this.pending.values())t.observation||(e+=1);return e}get transportKind(){return this.transport.kind}async request(e,t,n,s){this.assertNotDisposed(),this.storageStartup.isWaiting&&await this.storageStartup.wait(s?.signal),this.assertNotDisposed(),s?.signal?.throwIfAborted();let o=this.nextRequestId++,d=String(o),a=s?.timeoutMs??this.requestTimeoutMs,c=s?.lifecycle==="observation",u=new Promise((_,l)=>{let g=i(()=>{this.pending.get(d)?.cleanupAbort?.(),this.deletePending(d);let k=new Lt(e,o,a);c||this.requestTimeoutEmitter.fire({method:e,requestId:o,timeoutMs:a}),l(k)},"expire"),h=setTimeout(g,a),m=i(()=>{let y=this.pending.get(d);if(!y)return;clearTimeout(y.timeout),y.cleanupAbort?.(),this.deletePending(d);let k=s?.signal?.reason;l(k instanceof Error?k:new DOMException("Request aborted","AbortError"))},"abortHandler"),C={method:e,observation:c,timeout:h,resumeTimeout:i(()=>{C.timeout=setTimeout(g,a)},"resumeTimeout"),resolve:_,reject:l,resultSchema:n,cleanupAbort:i(()=>s?.signal?.removeEventListener("abort",m),"cleanupAbort")};this.pending.set(d,C),s?.signal?.aborted?m():s?.signal?.addEventListener("abort",m,{once:!0})});if(!this.pending.has(d))return u;try{await this.transport.send({id:o,method:e,params:t,...s?.trace?{trace:s.trace}:{}})}catch(_){let l=this.pending.get(d);throw l&&(clearTimeout(l.timeout),l.cleanupAbort?.(),this.deletePending(d)),_}return u}async notify(e,t){this.assertNotDisposed(),await this.transport.send({method:e,params:t})}async respond(e,t){this.assertNotDisposed(),await this.transport.send({id:e,result:t})}async respondError(e,t){this.assertNotDisposed(),await this.transport.send({id:e,error:t})}dispose(){this.disposed||(this.disposed=!0,this.disposeLocalResources(),this.transport.dispose())}async disposeAndWait(){let e=this.disposed;if(e||(this.disposed=!0,this.disposeLocalResources()),this.transport.disposeAndWait){await this.transport.disposeAndWait();return}e||this.transport.dispose()}handleMessage(e){if(!(!e||typeof e!="object")){if("result"in e&&"id"in e){this.resolveResponse(e.id,e.result);return}if("error"in e&&"id"in e){let t=e;this.rejectResponse(t.id,new Dt(t.error.message,t.error.code,t.error.data));return}if("method"in e&&"id"in e){this.requestEmitter.fire(e);return}if("method"in e){if(e.method==="startup/storageState"&&this.storageStartup.accept(e.params)){for(let t of this.pending.values())clearTimeout(t.timeout),this.storageStartup.snapshot?.phase==="ready"&&t.resumeTimeout();this.storageStartup.snapshot?.phase==="failed"&&this.rejectAll(new Error(`SQLite startup failed: ${this.storageStartup.snapshot.errorCode}`))}this.notificationEmitter.fire(e)}}}resolveResponse(e,t){let n=String(e),s=this.pending.get(n);if(s){clearTimeout(s.timeout),s.cleanupAbort?.(),this.deletePending(n);try{let o=s.resultSchema?s.resultSchema.parse(t):t;s.resolve(o)}catch(o){s.reject(o instanceof Error?o:new Error(`ZCode Protocol response parse failed: ${s.method}`))}}}rejectResponse(e,t){let n=String(e),s=this.pending.get(n);s&&(clearTimeout(s.timeout),s.cleanupAbort?.(),this.deletePending(n),s.reject(t))}rejectAll(e){let t=this.pendingOperationRequestCount>0;for(let n of this.pending.values())clearTimeout(n.timeout),n.cleanupAbort?.(),n.reject(e);this.pending.clear(),t&&!this.disposed&&this.pendingDrainedEmitter.fire()}deletePending(e){let t=this.pending.get(e);this.pending.delete(e)&&!t?.observation&&this.pendingOperationRequestCount===0&&!this.disposed&&this.pendingDrainedEmitter.fire()}disposeLocalResources(){this.rejectAll(new Error("ZCode Protocol client disposed"));for(let e of this.disposables)e.dispose();this.disposables.length=0,this.storageStartup.dispose(),this.notificationEmitter.dispose(),this.requestEmitter.dispose(),this.requestTimeoutEmitter.dispose(),this.pendingDrainedEmitter.dispose(),this.closeEmitter.dispose()}assertNotDisposed(){if(this.disposed)throw new Error("ZCode Protocol client is disposed")}};f();import{StringDecoder as ti}from"string_decoder";f();f();import{spawnSync as tn}from"child_process";import{readFileSync as So}from"fs";var rn=1e3,Ao=621355968000000000n,Io=10000n,ue;function xe(r,e,...t){r.log?.warn(r.traceId,e,...t)}i(xe,"warn");function We(r){let e=Number(r);return Number.isInteger(e)&&e>0?e:void 0}i(We,"parsePositiveInteger");function Mt(r){let e=Number(r);return Number.isInteger(e)&&e>=0?e:void 0}i(Mt,"parseNonNegativeInteger");function Co(r,e){let t=[];for(let n of r.split(/\r?\n/)){let s=n.trim().split(/\s+/),[o,d,a]=s,c=We(o),u=Mt(d),_=We(a),l=s.slice(3,8).join(" "),g=e?s.slice(8).join(" "):"",h=e?`${l}|command:${g}`:l;c===void 0||u===void 0||!_||!h||t.push({parentPid:u,pid:c,processGroupId:_,startTime:h})}return t}i(Co,"parsePosixProcessList");function vo(r){let e=[];for(let t of r.split(/\r?\n/)){let[n,s,o]=t.trim().split(/\s+/),d=We(n),a=Mt(s);d===void 0||a===void 0||!o||e.push({parentPid:a,pid:d,startTime:o})}return e}i(vo,"parseWindowsProcessList");function bo(r){try{let e=BigInt(r)-Ao,t=Number(e/Io);return Number.isSafeInteger(t)?t:void 0}catch{return}}i(bo,"parseWindowsCreationTimeMs");function No(r){let e=process.platform==="darwin",t=tn("ps",e?["-axo","pid=,ppid=,pgid=,lstart=,command="]:["-eo","pid=,ppid=,pgid=,lstart="],{encoding:"utf8",timeout:rn});return t.error?(xe(r,"\u67E5\u8BE2 runtime \u540E\u4EE3\u8FDB\u7A0B\u5931\u8D25\uFF08\u8FDB\u7A0B\u8868\u67E5\u8BE2\uFF09:",t.error),[]):t.signal==="SIGTERM"||t.signal==="SIGKILL"?(xe(r,`\u67E5\u8BE2 runtime \u540E\u4EE3\u8FDB\u7A0B\u5931\u8D25\uFF08\u8FDB\u7A0B\u8868\u8D85\u65F6\uFF09 signal=${t.signal}`),[]):t.status!==0||!t.stdout?(xe(r,`\u67E5\u8BE2 runtime \u540E\u4EE3\u8FDB\u7A0B\u5931\u8D25\uFF08\u8FDB\u7A0B\u8868\u67E5\u8BE2\uFF09 status=${t.status??"unknown"}`),[]):Co(t.stdout,e)}i(No,"readPosixProcessList");function Oo(r){if(ue)return ue;let e=tn("powershell.exe",["-NoLogo","-NoProfile","-NonInteractive","-Command","Get-CimInstance Win32_Process | ForEach-Object { '{0} {1} {2}' -f $_.ProcessId, $_.ParentProcessId, $_.CreationDate.ToUniversalTime().Ticks }"],{encoding:"utf8",timeout:rn,windowsHide:!0});if(e.error||e.status!==0||!e.stdout)return xe(r,`\u67E5\u8BE2 Windows runtime \u8FDB\u7A0B\u8868\u5931\u8D25 status=${e.status??"unknown"}:`,e.error??e.stderr),[];let t=vo(e.stdout);return ue=t,queueMicrotask(()=>{ue===t&&(ue=void 0)}),t}i(Oo,"readWindowsProcessList");function Ge(r){return process.platform==="win32"?Oo(r):No(r)}i(Ge,"readProcessList");function Do(r){if(process.platform!=="linux")return r;try{let e=So(`/proc/${r.pid}/stat`,"utf8"),t=e.lastIndexOf(")");if(t<0)return;let n=e.slice(t+2).trim().split(/\s+/),s=Mt(n[1]),o=We(n[2]),d=n[19];return s===void 0||!o||!d||s!==r.parentPid||o!==r.processGroupId?void 0:{...r,parentPid:s,processGroupId:o,startTime:`linux-ticks:${d}`}}catch{return}}i(Do,"refineLinuxProcessIdentity");function xt(r){return process.platform!=="linux"?[...r]:r.map(e=>Do(e)).filter(e=>e!==void 0)}i(xt,"refineProcessIdentities");function nn(r,e){let t=new Map;for(let d of e){let a=t.get(d.parentPid)??[];a.push(d),t.set(d.parentPid,a)}let n=[],s=new Set([r]),o=i(d=>{for(let a of t.get(d)??[])s.has(a.pid)||(s.add(a.pid),n.push(a),o(a.pid))},"visit");return o(r),n}i(nn,"collectDescendantIdentitiesFromProcessList");function q(r,e){if(r.length===0)return[];let t=new Set(r.map(s=>s.pid)),n=new Map(xt(Ge(e).filter(s=>t.has(s.pid))).map(s=>[s.pid,s]));return r.filter(s=>{let o=n.get(s.pid);return o?.startTime===s.startTime&&(s.processGroupId===void 0||o.processGroupId===s.processGroupId)})}i(q,"filterCurrentProcessIdentities");function le(r,e={}){if(r.pid==null)return;let t=Ge(e),n=t.find(c=>c.pid===r.pid);if(!n)return;let s=nn(r.pid,t),o=process.platform!=="win32"&&n.processGroupId===r.pid?t.filter(c=>c.processGroupId===r.pid):[],d=new Map([n,...s,...o].map(c=>[c.pid,c])),a=xt([...d.values()]);if(a.some(c=>c.pid===r.pid))return{rootPid:r.pid,descendantPids:a.filter(c=>c.pid!==r.pid).map(c=>c.pid),identities:a}}i(le,"captureProcessTreeSnapshot");function pe(r,e={}){if(process.platform==="win32"||!Number.isInteger(r)||r<=0)return;let t=xt(Ge(e).filter(n=>n.processGroupId===r));if(t.length!==0)return{rootPid:r,descendantPids:t.filter(n=>n.pid!==r).map(n=>n.pid),identities:t}}i(pe,"captureProcessGroupSnapshot");function _e(r,e={}){let t=e.ownedProcessStartedAtMs,n=e.ownedProcessExitedAtMs;if(process.platform!=="win32"||!Number.isInteger(r)||r<=0||typeof t!="number"||!Number.isFinite(t)||typeof n!="number"||!Number.isFinite(n))return;let s=Ge(e).filter(d=>{let a=bo(d.startTime);return a!==void 0&&a>=t&&a<=n}),o=nn(r,s);if(o.length!==0)return{rootPid:r,descendantPids:o.map(d=>d.pid),identities:o}}i(_e,"captureExitedRootDescendantsSnapshot");f();f();import{execFile as on}from"child_process";var Lo=2500,Mo=621355968000000000n,xo=10n,Wo="windows-utc-us:",ie,ae;function an(r){let e=r?.code;return e==="ENOENT"||e==="EACCES"||e==="EPERM"}i(an,"isHardCimUnavailable");function dn(r){return r.windowsCleanupDeadlineAtMs===void 0?void 0:Math.max(r.windowsCleanupDeadlineAtMs-Date.now(),0)}i(dn,"remainingWindowsCleanupMs");function Go(r,e){let t=dn(e);return t===void 0?r:Math.max(Math.min(r,t),0)}i(Go,"boundedWindowsLookupTimeoutMs");async function sn(r,e){let t=dn(e);if(t===void 0)return await r;if(t<=0)return[];let n;try{return await Promise.race([r,new Promise(s=>{n=setTimeout(()=>s([]),t)})])}finally{n&&clearTimeout(n)}}i(sn,"awaitWindowsProcessListWithinDeadline");function Wt(r,e,...t){r.log?.warn(r.traceId,e,...t)}i(Wt,"warn");function Uo(r){let e=Number(r);return Number.isInteger(e)&&e>0?e:void 0}i(Uo,"parsePositiveInteger");function Zo(r){let e=Number(r);return Number.isInteger(e)&&e>=0?e:void 0}i(Zo,"parseNonNegativeInteger");function cn(r){let e=[];for(let t of r.split(/\r?\n/)){let[n,s,o]=t.trim().split(/\s+/),d=Uo(n),a=Zo(s),c=Fo(o);d===void 0||a===void 0||!c||e.push({parentPid:a,pid:d,startTime:c})}return e}i(cn,"parseWindowsProcessList");function Fo(r){if(r)try{let e=(BigInt(r)-Mo)/xo;return`${Wo}${e}`}catch{return}}i(Fo,"normalizePowerShellStartTime");async function Gt(r,e,t={}){return process.platform!=="win32"||e<=0||ae==="identity-unavailable"?!1:await new Promise(n=>{on("powershell.exe",["-NoLogo","-NoProfile","-NonInteractive","-Command",`Get-CimInstance Win32_Process -Filter "ProcessId = ${r.pid}" | ForEach-Object { '{0} {1} {2}' -f $_.ProcessId, $_.ParentProcessId, $_.CreationDate.ToUniversalTime().Ticks }`],{encoding:"utf8",timeout:e,windowsHide:!0},(s,o,d)=>{if(s||!o){an(s)&&(ae="identity-unavailable"),Wt(t,`Windows root \u8EAB\u4EFD PowerShell \u590D\u6838\u5931\u8D25 pid=${r.pid}:`,s??d),n(!1);return}let a=cn(o).find(c=>c.pid===r.pid);ae="cim",n(a?.startTime===r.startTime)})})}i(Gt,"verifyWindowsProcessIdentityAsync");async function Ue(r){if(ae==="identity-unavailable")return[];let e=r.ownedProcessStartedAtMs;if(ie&&(e===void 0||e<ie.startedAtMs))return await sn(ie.promise,r);let t=Date.now(),n=new Promise(s=>{let o=Go(Lo,r);if(o<=0){s([]);return}on("powershell.exe",["-NoLogo","-NoProfile","-NonInteractive","-Command","Get-CimInstance Win32_Process | ForEach-Object { '{0} {1} {2}' -f $_.ProcessId, $_.ParentProcessId, $_.CreationDate.ToUniversalTime().Ticks }"],{encoding:"utf8",timeout:o,windowsHide:!0},(d,a,c)=>{if(d||!a){an(d)&&(ae="identity-unavailable"),Wt(r,"\u67E5\u8BE2 Windows runtime \u8FDB\u7A0B\u8868\u5931\u8D25\uFF08\u5F02\u6B65\uFF09:",d??c),s([]);return}let u=cn(a);u.length===0&&Wt(r,"PowerShell \u672A\u8FD4\u56DE\u53EF\u89E3\u6790\u7684 Windows runtime \u8FDB\u7A0B\u8868"),u.length>0&&(ae="cim"),s(u)})}).finally(()=>{ie?.promise===n&&(ie=void 0)});return ie={promise:n,startedAtMs:t},await sn(n,r)}i(Ue,"readWindowsProcessListAsync");var un="windows-utc-us:";function Ho(r){if(r.startsWith(un))try{let e=BigInt(r.slice(un.length)),t=Number(e/1000n);return Number.isSafeInteger(t)?t:void 0}catch{return}}i(Ho,"parseWindowsCreationTimeMs");function ln(r,e){let t=new Map;for(let d of e){let a=t.get(d.parentPid)??[];a.push(d),t.set(d.parentPid,a)}let n=[],s=new Set([r]),o=i(d=>{for(let a of t.get(d)??[])s.has(a.pid)||(s.add(a.pid),n.push(a),o(a.pid))},"visit");return o(r),n}i(ln,"collectDescendants");async function Ze(r,e){if(process.platform!=="win32")return q(r,e);if(r.length===0)return[];let t=new Set(r.map(s=>s.pid)),n=new Map((await Ue(e)).filter(s=>t.has(s.pid)).map(s=>[s.pid,s]));return r.filter(s=>n.get(s.pid)?.startTime===s.startTime)}i(Ze,"filterCurrentProcessIdentitiesAsync");async function me(r,e={}){if(process.platform!=="win32")return le(r,e);if(r.pid==null)return;let t=await Ue(e),n=r.exitCode!==null||r.signalCode!==null,s=e.ownedProcessExitedAtMs??e.resolveOwnedProcessExitedAtMs?.(),o=t.find(a=>a.pid===r.pid),d=o&&!n?[o,...ln(r.pid,t)]:pn(r.pid,t,e.ownedProcessStartedAtMs,s);if(d.length!==0)return{rootPid:r.pid,descendantPids:d.filter(a=>a.pid!==r.pid).map(a=>a.pid),identities:d}}i(me,"captureProcessTreeSnapshotAsync");function pn(r,e,t,n){if(typeof t!="number"||!Number.isFinite(t)||typeof n!="number"||!Number.isFinite(n))return[];let s=e.filter(o=>{let d=Ho(o.startTime);return d!==void 0&&d>=t&&d<n});return ln(r,s)}i(pn,"collectExitedRootDescendants");async function fe(r,e={}){if(process.platform!=="win32")return _e(r,e);let t=e.ownedProcessStartedAtMs,n=e.ownedProcessExitedAtMs;if(!Number.isInteger(r)||r<=0||typeof t!="number"||!Number.isFinite(t)||typeof n!="number"||!Number.isFinite(n))return;let s=pn(r,await Ue(e),t,n);return s.length===0?void 0:{rootPid:r,descendantPids:s.map(o=>o.pid),identities:s}}i(fe,"captureExitedRootDescendantsSnapshotAsync");f();function Ut(r){return r.exitCode!==null||r.signalCode!==null}i(Ut,"hasChildExited");function Bo(r){try{return process.kill(r,0),!0}catch{return!1}}i(Bo,"isPidAlive");function $o(...r){let e=new Map;for(let t of r)for(let n of t)e.set(n.pid,n);return[...e.values()]}i($o,"mergeIdentities");function Ko(r,e){return Ut(r)?[]:[...le(r,e)?.identities??[]]}i(Ko,"captureLiveIdentities");function qo(r,e){return r.pid===e.pid&&r.startTime===e.startTime&&r.processGroupId===e.processGroupId}i(qo,"isSameProcessIdentity");function Fe(r,e,t,n=!0){let s=r.pid,o=e.find(l=>l.pid===s);if(!!Ut(r))return{childStillOwned:!1,currentIdentities:q(e,t),knownIdentities:[...e]};if(o&&!(q([o],t).length===1))return{childStillOwned:!1,currentIdentities:q(e,t),knownIdentities:[...e]};if(!o&&!n)return{childStillOwned:!1,currentIdentities:[],knownIdentities:[]};let a=Ko(r,t),c=a.find(l=>l.pid===s);if(!o&&!c)return{childStillOwned:!1,currentIdentities:[],knownIdentities:[]};if(o&&c&&!qo(o,c))return{childStillOwned:!1,currentIdentities:q(e,t),knownIdentities:[...e]};let u=$o(e,c?a:[]),_=q(u,t);return{childStillOwned:_.some(l=>l.pid===s),currentIdentities:_,knownIdentities:u}}i(Fe,"resolveCurrentOwnedIdentities");async function He(r,e,t,n=!0){if(process.platform!=="win32")return Fe(r,e,t,n);let s=r.pid,o=e.find(c=>c.pid===s);if(Ut(r))return e.some(c=>Bo(c.pid))?{childStillOwned:!1,currentIdentities:await Ze(e,t),knownIdentities:[...e]}:{childStillOwned:!1,currentIdentities:[],knownIdentities:[...e]};if(o){let c=await Ze(e,t);return{childStillOwned:c.some(u=>u.pid===s),currentIdentities:c,knownIdentities:[...e]}}if(!n)return{childStillOwned:!1,currentIdentities:[],knownIdentities:[]};let d=[...(await me(r,t))?.identities??[]],a=d.find(c=>c.pid===s);return{childStillOwned:!!a,currentIdentities:a?d:[],knownIdentities:a?d:[]}}i(He,"resolveCurrentOwnedIdentitiesAsync");f();function _n(r,e){r.log?.warn(r.traceId,e)}i(_n,"warn");function Zt(r,e,t){r.log?.debug?.(r.traceId,e,t)}i(Zt,"debug");function Be(r){return r.exitCode!==null||r.signalCode!==null}i(Be,"hasChildExited");function $e(r){try{return process.kill(r,0),!0}catch{return!1}}i($e,"isPidAlive");async function mn(r,e,t,n,s){if(r.pid==null)return{remainingPids:[]};let o=Date.now(),d=Math.max(e.forceAfterMs??2e3,0),a=Math.max(e.waitAfterForceMs??250,0),c=process.platform==="win32",u=n?Math.max(e.windowsTaskkillTimeoutMs??2e3,1):0,_=d+u+a,l=e.windowsCleanupDeadlineAtMs===void 0?_:Math.max(e.windowsCleanupDeadlineAtMs-o,0),g=Math.max(_,750),h=!n&&e.windowsCleanupDeadlineAtMs!==void 0?Math.min(g,l):Math.min(_,l),m=t.knownIdentities;return await new Promise(C=>{let y=!1,k=t.currentIdentities,E=t.childStillOwned&&!k.some(I=>I.pid===r.pid)?r.pid:void 0,w,A,v,p,P=i(()=>{r.off?.("exit",z),w&&clearTimeout(w),A&&clearTimeout(A),v&&clearTimeout(v),p&&clearInterval(p),w=void 0,A=void 0,v=void 0,p=void 0},"cleanup"),T=i((I=[])=>{y||(y=!0,P(),C({remainingPids:I}))},"settle"),S=i(()=>{let I=k.some(Gn=>$e(Gn.pid)),X=E!==void 0&&!Be(r)&&$e(E);if(!I&&!X){if(c&&!Be(r))return;T()}},"settleIfTreeExited"),W=i(()=>{!p&&!y&&(p=setInterval(S,25))},"startTreePolling"),H=i(()=>{let I=k.filter(X=>$e(X.pid)).map(X=>X.pid);return E!==void 0&&!Be(r)&&$e(E)&&I.push(E),I},"collectRemainingPids"),z=i(()=>{E=void 0,S(),y||W()},"onExit"),J=i(()=>{if(!(A||y)){if(a===0){T(H());return}A=setTimeout(()=>{let I=H();I.length>0&&_n(e,`runtime \u8FDB\u7A0B\u6811\u5F3A\u5236\u56DE\u6536\u540E\u4ECD\u6709\u6B8B\u7559 pid=${I.join(",")}`),T(I)},a)}},"scheduleForceWait"),he=i(()=>{!c||v||y||(Zt(e,"Windows runtime \u8FDB\u7A0B\u6811 cleanup deadline scheduled",{forceAfterMs:d,hasWindowsTaskkillTargets:n,waitAfterForceMs:a,windowsRelativeDeadlineMs:_,windowsTaskkillBudgetMs:u,windowsCleanupDeadlineMs:h,windowsCleanupDeadlineAtMs:e.windowsCleanupDeadlineAtMs}),v=setTimeout(()=>{let I=H();I.length>0&&_n(e,`runtime \u8FDB\u7A0B\u6811\u7EDD\u5BF9 deadline \u540E\u4ECD\u6709\u6B8B\u7559 pid=${I.join(",")}`),T(I)},h))},"scheduleWindowsCleanupDeadline"),tt=i(I=>{Zt(e,"Windows runtime \u8FDB\u7A0B\u6811 force cleanup completed",{trackedPids:I.identities.map(X=>X.pid),unverifiedRootPid:I.unverifiedRootPid}),k=I.identities,E=I.unverifiedRootPid,S(),y||(W(),c||J())},"onForceCleanup");r.once("exit",z);let Wn={...e,forceAfterMs:d,keepForceTimerRef:!0,knownIdentities:m,resolvedOwnership:t,onForceCleanup:tt,onForceTimerScheduled:i(I=>{w=I},"onForceTimerScheduled"),onGracefulCleanupScheduled:i(I=>{I.then(()=>{Zt(e,"Windows runtime \u8FDB\u7A0B\u6811 graceful cleanup flight settled"),S(),y||W()})},"onGracefulCleanupScheduled")};he(),s(r,Wn),S(),!y&&Be(r)&&W()})}i(mn,"waitForProcessTreeTermination");f();import{execFile as Xo}from"child_process";var fn=i(({force:r,pid:e,timeoutMs:t})=>new Promise(n=>{Xo("taskkill",["/PID",String(e),"/T",...r?["/F"]:[]],{encoding:"utf8",timeout:t,windowsHide:!0},(s,o,d)=>{n({...s?{error:s}:{},...d?{stderr:d}:{}})})}),"defaultWindowsTaskkillRunner");var Ke="SIGTERM",Ft="SIGKILL",jo=2e3,Ht=750,kn=2e3;function En(){return process.platform!=="win32"}i(En,"shouldSpawnInDetachedProcessGroup");function Xe(r,e,...t){r.log?.warn(r.traceId,e,...t)}i(Xe,"warn");function gn(r,e,...t){r.log?.debug?.(r.traceId,e,...t)}i(gn,"debug");function Vo(r){return typeof r=="object"&&r!==null&&"code"in r?String(r.code):void 0}i(Vo,"getErrorCode");function Tn(r){return Vo(r)==="ESRCH"}i(Tn,"isMissingProcessError");function Bt(r){try{return process.kill(r,0),!0}catch{return!1}}i(Bt,"isPidAlive");function yn(r,e,t){let n=setTimeout(r,Math.max(e,0));return t||n.unref(),n}i(yn,"scheduleForceCleanup");function qe(r,e,t){try{return process.kill(r,e),!0}catch(n){return Tn(n)||Xe(t,`\u53D1\u9001 runtime \u8FDB\u7A0B\u7EC8\u6B62\u4FE1\u53F7\u5931\u8D25 pid=${r} signal=${e}:`,n),!1}}i(qe,"killPid");function wn(r,e,t){try{return process.kill(-r,e),!0}catch(n){return Tn(n)||Xe(t,`\u53D1\u9001 runtime \u8FDB\u7A0B\u7EC4\u7EC8\u6B62\u4FE1\u53F7\u5931\u8D25 pgid=${r} signal=${e}:`,n),!1}}i(wn,"killPosixProcessGroup");async function Rn(r,e,t){let n=Math.max(t.windowsTaskkillTimeoutMs??jo,1),s=t.windowsTaskkillRunner??fn,o=Date.now();gn(t,"Windows runtime \u8FDB\u7A0B\u6811 taskkill started",{force:e,pid:r,timeoutMs:n});let d;try{d=await s({force:e,pid:r,timeoutMs:n})}catch(a){d={error:a}}gn(t,"Windows runtime \u8FDB\u7A0B\u6811 taskkill completed",{durationMs:Date.now()-o,force:e,pid:r,success:!d.error}),d.error&&Bt(r)&&Xe(t,`${e?"\u5F3A\u5236\u6E05\u7406":"\u8BF7\u6C42"} runtime \u8FDB\u7A0B\u6811\u9000\u51FA\u5931\u8D25 pid=${r} status=${String(typeof d.error=="object"&&d.error!==null&&"code"in d.error?d.error.code??"unknown":"unknown")}:`,d.error,d.stderr)}i(Rn,"runWindowsTaskkill");async function zo(r,e,t,n,s=!1,o=[]){let{childStillOwned:d,currentIdentities:a}=n??await He(r,e,t,!1),c=new Set(s?o.map(l=>l.pid):a.map(l=>l.pid)),u=t.unverifiedRootOnly;d&&r.pid!=null&&!u&&!s&&c.add(r.pid),s&&!u&&r.pid!=null&&typeof r.kill=="function"&&r.exitCode===null&&r.signalCode===null&&Bt(r.pid)&&c.add(r.pid),await Promise.all([...c].map(l=>Rn(l,!0,t)));let _=a.some(l=>l.pid===r.pid);return{identities:a,...d&&!_?{unverifiedRootPid:r.pid}:{}}}i(zo,"forceTerminateWindowsProcessTree");function hn(r,e,t,n){let s=r.pid,o=e,d=!o.unverifiedRootOnly&&typeof r.kill=="function"&&r.exitCode===null&&r.signalCode===null&&Bt(s),a=t.childStillOwned&&!o.unverifiedRootOnly?[s]:t.currentIdentities.map(h=>h.pid);a.length===0&&d&&a.push(s);let c=Promise.all([...new Set(a)].map(h=>Rn(h,!1,e))).then(()=>{});o.onGracefulCleanupScheduled?.(c);let u=Math.max((e.forceAfterMs??kn)-(Date.now()-n),0),_=t.currentIdentities.filter(h=>!o.unverifiedRootOnly||h.pid!==s),l=_.length>0&&u>=Ht,g=yn(()=>{(async()=>{let h=l?(await Promise.all(_.map(async m=>await Gt(m,Ht,e)?m:void 0))).filter(m=>m!==void 0):[];return await zo(r,t.knownIdentities,e,t,!0,h)})().then(h=>o.onForceCleanup?.(h))},l?u-Ht:u,!!e.keepForceTimerRef);o.onForceTimerScheduled?.(g)}i(hn,"terminateWindowsProcessTreeWithOwnership");function Jo(r,e){let t=e,n=Date.now();if(t.resolvedOwnership){hn(r,e,t.resolvedOwnership,n);return}He(r,t.knownIdentities??[],e).then(s=>{hn(r,e,s,n)})}i(Jo,"terminateWindowsProcessTree");function Yo(r,e,t){let n=r.pid,{childStillOwned:s,currentIdentities:o}=Fe(r,e,t,!1),d=s||o.some(c=>c.processGroupId===n);d&&wn(n,Ft,t);for(let c of o.toReversed())c.pid!==n&&qe(c.pid,Ft,t);if(!d){let c=o.find(u=>u.pid===n);c&&qe(c.pid,Ft,t)}let a=o.some(c=>c.pid===n);return{identities:o,...s&&!a?{unverifiedRootPid:n}:{}}}i(Yo,"forceTerminatePosixProcessTree");function Qo(r,e){let t=r.pid,n=e,s=n.resolvedOwnership??Fe(r,n.knownIdentities??[],e),d=s.childStillOwned||s.currentIdentities.some(c=>c.processGroupId===t)?wn(t,Ke,e):!1;for(let c of s.currentIdentities)c.pid!==t&&qe(c.pid,Ke,e);!d&&s.childStillOwned&&qe(t,Ke,e);let a=yn(()=>{let c=Yo(r,s.knownIdentities,e);n.onForceCleanup?.(c)},e.forceAfterMs??kn,!!e.keepForceTimerRef);n.onForceTimerScheduled?.(a)}i(Qo,"terminatePosixProcessTree");function $t(r,e={}){if(r.pid==null){try{r.kill(Ke)}catch(t){Xe(e,"\u53D1\u9001 runtime \u8FDB\u7A0B\u7EC8\u6B62\u4FE1\u53F7\u5931\u8D25 pid=unknown:",t)}return}if(process.platform==="win32"){Jo(r,e);return}Qo(r,e)}i($t,"terminateProcessTree");async function Pn(r,e={}){if(r.pid==null)return{remainingPids:[]};let t=e.snapshot?.rootPid===r.pid?e.snapshot:e.ownedProcessGroupId===r.pid?pe(e.ownedProcessGroupId,e):process.platform==="win32"?await fe(r.pid,e):_e(r.pid,e),n=t?.identities??[],s=t?.identityVerification==="unavailable",o=process.platform==="win32"&&t&&r.exitCode===null&&r.signalCode===null?{childStillOwned:s||n.some(d=>d.pid===r.pid),currentIdentities:[...n],knownIdentities:[...n]}:await He(r,n,e);return await mn(r,s?{...e,unverifiedRootOnly:!0}:e,o,o.currentIdentities.length>0||!s&&o.childStillOwned,$t)}i(Pn,"terminateProcessTreeAndWait");f();import{createInterface as ei}from"readline";var Kt=250,je=class{static{i(this,"AgentStderrCollector")}reader;drained;resolveDrained;done=!1;deadlineAt=1/0;timer;constructor(e,t){this.drained=new Promise(n=>{this.resolveDrained=n}),this.reader=ei({input:e}),this.reader.on("line",n=>t?.(n)),this.reader.once("close",this.finish),this.reader.on("error",this.finish),e.on("error",this.finish),e.once("close",this.finish),(e.destroyed||e.readableEnded)&&this.finish()}waitForDrain(e=Kt){let t=Date.now()+e;return!this.done&&t<this.deadlineAt&&(this.deadlineAt=t,this.timer&&clearTimeout(this.timer),this.timer=setTimeout(this.finish,Math.max(0,e))),this.drained}finish=i(()=>{this.done||(this.done=!0,this.timer&&clearTimeout(this.timer),this.reader.close(),this.resolveDrained())},"finish")};var ri=1800,ni=3250,si=5e3,oi=2e3,Sn=1e3,ii=250,qt=Q("zcode-agent-process-tree"),Ve=class{constructor(e,t){this.child=e;this.options=t;this.stderrCollector=new je(e.stderr,t?.onStderrLine),e.stdout.on("data",this.handleStdoutData),e.stdout.once("end",this.handleStdoutEnd),e.stdout.once("close",this.handleStdoutEnd),e.stdin.on("error",n=>this.handleStreamError("stdin",n)),e.stdout.on("error",n=>this.handleStreamError("stdout",n)),e.once("exit",(n,s)=>{this.childExitedAtMs=Date.now(),this.fireClose({code:n,signal:s}),this.disposeReaders(),this.waitForStderrDrain()}),e.once("error",n=>{this.fireClose({reason:n.message}),this.disposeReaders(),this.waitForStderrDrain()})}child;options;static{i(this,"ZCodeStdioTransport")}kind="stdio";messageEmitter=new L;closeEmitter=new L;stderrCollector;stdoutDecoder=new ti("utf8");stdoutBuffer="";stdoutFlushed=!1;readersDisposed=!1;disposed=!1;closed=!1;disposeAndWaitPromise;cleanupProcessTreeSnapshot;cleanupAttemptCount=0;childExitedAtMs;onMessage=this.messageEmitter.event;onClose=this.closeEmitter.event;async send(e){if(this.disposed||this.closed||this.child.killed||!this.child.stdin.writable)throw new Error("ZCode agent stdio transport is closed");let t=`${JSON.stringify(e)}
`;await new Promise((n,s)=>{this.child.stdin.write(t,o=>{if(o){s(o);return}n()})})}dispose(){if(!this.disposed&&(this.disposed=!0,this.disposeLocalResources(),this.stderrCollector.waitForDrain(ni),!this.hasChildExited())){let e=this.options?.ownedProcessGroupId;$t(this.child,e?{ownedProcessGroupId:e}:{})}}disposeAndWait(){if(!this.disposeAndWaitPromise){let e=this.disposeAndWaitOnce().finally(()=>{this.disposeAndWaitPromise===e&&(this.disposeAndWaitPromise=void 0)});this.disposeAndWaitPromise=e}return this.disposeAndWaitPromise}waitForStderrDrain(){return this.stderrCollector.waitForDrain()}async disposeAndWaitOnce(){this.disposed||(this.disposed=!0,this.disposeLocalResources()),this.cleanupAttemptCount+=1;let e=Date.now(),t=this.cleanupAttemptCount>1?0:oi,n=process.platform==="win32"?e+t+Sn+ii:void 0;this.cleanupProcessTreeSnapshot??=await this.captureCleanupSnapshot(n);let s=this.cleanupProcessTreeSnapshot;if(!this.hasChildExited()){this.requestStdioClose();let a=process.env.ZCODE_E2E_COVERAGE==="1"?si:ri,c=n===void 0?a:Math.max(n-Date.now(),0);await this.waitForChildExit(Math.min(a,c))}let d=(await Pn(this.child,{...this.options?.ownedProcessGroupId?{ownedProcessGroupId:this.options.ownedProcessGroupId}:{},...this.options?.ownedProcessStartedAtMs?{ownedProcessStartedAtMs:this.options.ownedProcessStartedAtMs,ownedProcessExitedAtMs:this.childExitedAtMs??Date.now()}:{},...s?{snapshot:s}:{},log:qt,windowsTaskkillTimeoutMs:Sn,...n===void 0?{}:{windowsCleanupDeadlineAtMs:n},forceAfterMs:Math.max(t-(Date.now()-e),0)})).remainingPids;if(await this.stderrCollector.waitForDrain(n===void 0?void 0:Math.max(0,Math.min(Kt,n-Date.now()))),d.length>0)throw new Error(`runtime process tree cleanup incomplete; remaining pid=${[...new Set(d)].join(",")}`)}handleStdoutData=i(e=>{this.closed||(this.stdoutBuffer+=typeof e=="string"?e:this.stdoutDecoder.write(e),this.drainStdoutFrames())},"handleStdoutData");handleStdoutEnd=i(()=>{if(this.stdoutFlushed)return;this.stdoutFlushed=!0,this.stdoutBuffer+=this.stdoutDecoder.end();let e=this.stdoutBuffer;this.stdoutBuffer="",e.length>0&&!this.closed&&this.handleStdoutFrame(e),this.fireClose({reason:"stdout_closed"})},"handleStdoutEnd");drainStdoutFrames(){let e=this.stdoutBuffer.indexOf(`
`);for(;e>=0;){let t=this.stdoutBuffer.slice(0,e);if(this.stdoutBuffer=this.stdoutBuffer.slice(e+1),this.handleStdoutFrame(t),this.closed)return;e=this.stdoutBuffer.indexOf(`
`)}}handleStdoutFrame(e){let t=e.endsWith("\r")?e.slice(0,-1):e;if(t.trim().length!==0)try{let n=rr.parse(JSON.parse(t));this.messageEmitter.fire(n)}catch(n){let s=n instanceof Error?n.message:String(n);this.fireClose({reason:`protocol_parse_error: ${s}`})}}handleStreamError(e,t){this.fireClose({reason:`${e}_error: ${t.message}`})}fireClose(e){this.closed||(this.closed=!0,this.closeEmitter.fire(e))}disposeReaders(){this.readersDisposed||(this.readersDisposed=!0,this.child.stdout.off("data",this.handleStdoutData),this.child.stdout.off("end",this.handleStdoutEnd),this.child.stdout.off("close",this.handleStdoutEnd),this.child.stdout.resume())}disposeLocalResources(){this.disposeReaders(),this.messageEmitter.dispose(),this.closeEmitter.dispose()}requestStdioClose(){if(!(this.child.stdin.destroyed||!this.child.stdin.writable))try{this.child.stdin.once("error",()=>{}),this.child.stdin.end()}catch{}}waitForChildExit(e){return this.hasChildExited()?Promise.resolve():new Promise(t=>{let n=!1,s,o=i(()=>{n||(n=!0,s&&(clearTimeout(s),s=void 0),this.child.off?.("exit",o),t())},"settle");this.child.once("exit",o),s=setTimeout(o,e),s.unref?.()})}hasChildExited(){return this.child.exitCode!==null||this.child.signalCode!==null}async captureCleanupSnapshot(e){let t=this.hasChildExited(),n=t?void 0:await me(this.child,{log:qt,...e===void 0?{}:{windowsCleanupDeadlineAtMs:e},ownedProcessStartedAtMs:this.options?.ownedProcessStartedAtMs,resolveOwnedProcessExitedAtMs:i(()=>this.childExitedAtMs,"resolveOwnedProcessExitedAtMs")});if(n)return n;if(process.platform==="win32"&&!t&&this.child.pid)return{rootPid:this.child.pid,descendantPids:[],identities:[],identityVerification:"unavailable"};let s=this.options?.ownedProcessGroupId;if(s)return pe(s);let o=await fe(this.child.pid??0,{log:qt,...e===void 0?{}:{windowsCleanupDeadlineAtMs:e},ownedProcessStartedAtMs:this.options?.ownedProcessStartedAtMs,ownedProcessExitedAtMs:this.childExitedAtMs??Date.now()});return o||(process.platform==="win32"&&this.child.pid?{rootPid:this.child.pid,descendantPids:[],identities:[],identityVerification:"unavailable"}:void 0)}};f();import{existsSync as ai,mkdirSync as Tu,readFileSync as di,writeFileSync as yu}from"fs";import{join as Xt}from"path";function ci(){return Ee()}i(ci,"isZCodeStdioTapDevVisible");function An(){return Xt(ne(),"dev")}i(An,"getZCodeStdioTapDevDir");function ui(){return Xt(An(),"stdio-traffic")}i(ui,"getZCodeStdioTapDevLogDir");function li(){return Xt(An(),"zcode-stdio-tap.json")}i(li,"getZCodeStdioTapDevStatePath");function pi(r){if(!ai(r))return{};try{let e=JSON.parse(di(r,"utf-8"));return e&&typeof e=="object"?e:{}}catch{return{}}}i(pi,"readStateFile");function In(){let r=ci(),e=li(),t=pi(e);return{enabled:r&&t.enabled===!0,visible:r,logDir:ui(),statePath:e}}i(In,"readZCodeStdioTapDevState");f();var _i=["HTTP_PROXY","HTTPS_PROXY","ALL_PROXY",or],mi=["NO_PROXY","no_proxy",ir];function fi(r){let e=ki(r);if(!e)return{};let t={};for(let n of _i)t[n]=e;return t}i(fi,"buildAgentProxyEnv");function gi(r){let e=r?.trim();return e?{NODE_EXTRA_CA_CERTS:e,[ar]:e}:{}}i(gi,"buildAgentCaCertEnv");function hi(r){let e=Ei(r);if(!e)return{};let t={};for(let n of mi)t[n]=e;return t}i(hi,"buildAgentNoProxyEnv");function vu(r){return{...fi(r.httpProxy),...hi(r.noProxy),...gi(r.caCertPath)}}i(vu,"buildAgentRuntimeEnv");function bu(r){let e=r?.trim();return e?{ZCODE_BASE_URL:e}:{}}i(bu,"buildAgentEndpointOriginEnv");function Cn(r){let e=r?.trim();return e?{[tr]:e}:{}}i(Cn,"buildAgentWorkspaceIdentityEnv");function ki(r){let e=r?.trim();if(e)return/^[a-z][a-z0-9+.-]*:\/\//i.test(e)?e:`http://${e}`}i(ki,"normalizeProxyValue");function Ei(r){let e=r?.split(",").map(t=>t.trim()).filter(Boolean);return e&&e.length>0?e.join(","):void 0}i(Ei,"normalizeNoProxyValue");var Si=`
const { takeCoverage } = require("node:v8");
const { writeFileSync } = require("node:fs");
const { resolve } = require("node:path");
const coverageDirectory = process.env.NODE_V8_COVERAGE;
let coverageFlushStarted = false;
for (const signal of process.platform === "win32"
  ? ["SIGINT", "SIGTERM"]
  : ["SIGINT", "SIGTERM", "SIGHUP"]) {
  const flushCoverage = () => {
    if (coverageFlushStarted) return;
    coverageFlushStarted = true;
    if (coverageDirectory) {
      writeFileSync(
        resolve(coverageDirectory, \`coverage-signal-\${process.pid}.marker\`),
        signal,
      );
    }
    try {
      takeCoverage();
    } catch (error) {
      if (coverageDirectory) {
        writeFileSync(
          resolve(coverageDirectory, \`coverage-signal-error-\${process.pid}.txt\`),
          error instanceof Error ? error.stack || error.message : String(error),
        );
      }
    }
    if (process.listenerCount(signal) !== 1) return;
    setTimeout(() => {
      process.exit(signal === "SIGINT" ? 130 : signal === "SIGTERM" ? 143 : 129);
    }, 1000);
  };
  process.prependListener(signal, flushCoverage);
}
if (coverageDirectory) {
  writeFileSync(resolve(coverageDirectory, \`coverage-ready-\${process.pid}.marker\`), "");
}
`;function Ai(r=process.env){let e=r.ZCODE_E2E_ARTIFACT_DIR?.trim();if(r.ZCODE_E2E_COVERAGE!=="1"||!e)return{};let t=vn(e,"coverage","raw","cli");wi(t,{recursive:!0});let n=vn(t,"zcode-e2e-coverage-preload.cjs");Ri(n,Si,"utf8");let s=`--require=${JSON.stringify(n)}`;return{NODE_OPTIONS:[r.NODE_OPTIONS?.trim(),s].filter(Boolean).join(" "),NODE_V8_COVERAGE:t}}i(Ai,"buildE2EAgentCoverageEnv");var et=Q("zcode-agent"),F=i((...r)=>et.info(void 0,...r),"log"),ze=i((...r)=>et.warn(void 0,...r),"warnLog"),Je=i((...r)=>et.error(void 0,...r),"errorLog"),Ii=20,bn=1e3,Ci=/(["']?(?:api[-_]?key|authorization|cookie|credential|password|secret|token)["']?\s*[:=]\s*)(?:"[^"]*"|'[^']*'|[^\s,;}]+)/gi,vi=/\b(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]+/gi,bi=/\b(sk-)[A-Za-z0-9_-]{16,}\b/gi;function Ye(r){return r.replace(Ci,"$1<redacted>").replace(vi,"$1 <redacted>").replace(bi,"$1<redacted>")}i(Ye,"redactAgentDiagnostic");var Mn=i((...r)=>{Ee()&&et.debug(void 0,...r)},"debugLog");function Ni(){let r=[],e=0;return{append(t){e+=1;let n=Ye(t),s=n.length>bn?`${n.slice(0,bn)}\u2026[truncated]`:n;r.push(s),r.length>Ii&&r.shift()},snapshot(){return{lineCount:e,tail:[...r]}}}}i(Ni,"createAgentStderrTail");function Oi(r){let e=r?.trim();if(!e)return;let t=JSON.parse(e);if(!Array.isArray(t)||t.some(n=>typeof n!="string"))throw new Error("ZCODE_AGENT_SERVER_ARGS_JSON must be a JSON string array");return t}i(Oi,"parseArgsJson");function Qe(r){let e=process.cwd();for(;;){let t=Ln(e,r);if(jt(t))return t;let n=Dn(e);if(n===e)return null;e=n}}i(Qe,"findUpward");async function Di(r,e,t){let n=Pi(r.command)?"absolute":"path-search",s=r.cwd??e,{cwd:o,usedFallback:d,cwdExists:a}=await vt({requestedCwd:s,workspacePath:e,spawnFallbackCwd:t});return{command:r.command,args:r.args??[],requestedCwd:s,cwd:o,cwdSource:d?"workspace-fallback":r.cwd===void 0?"workspace":"command",commandPathKind:n,commandExists:n==="absolute"?jt(r.command):null,cwdExists:a}}i(Di,"buildZCodeAgentSpawnPreflight");function Li(r){let e=Qe("apps/zcode-cli/packages/cli/dist/zcode.cjs");if(e){let s=process.versions.electron&&process.env.ZCODE_DESKTOP_AGENT_BYTECODE==="1",o=s?Ln(Dn(e),"zcode.bytecode.cjs"):e;if(s&&!jt(o))throw new Error("\u684C\u9762 Agent \u5B57\u8282\u7801\u5165\u53E3\u7F3A\u5931\uFF0C\u8BF7\u8FD0\u884C pnpm build:desktop-agent:bytecode");return{command:process.execPath,args:[o,"app-server","--stdio"],storagePreparationEntry:e,cwd:r.workspacePath,env:{ELECTRON_RUN_AS_NODE:"1"}}}let t=Qe("apps/zcode-cli/packages/cli/src/main.ts"),n=Qe("node_modules/.bin/tsx");return!t||!n?null:{command:n,args:[t,"app-server","--stdio"],cwd:r.workspacePath}}i(Li,"resolveBundledWorkspaceZCodeAgentCommand");function Mi(r){let e=Yr();return e?{command:e,args:U.spawnArgs,cwd:r.workspacePath}:null}i(Mi,"resolveDeployedZCodeAgentBinaryCommand");function xi(r){if(!process.versions.electron)return null;let e=Qr();return e?{command:process.execPath,args:[e,...U.spawnArgs],storagePreparationEntry:e,cwd:r.workspacePath,env:{ELECTRON_RUN_AS_NODE:"1"}}:null}i(xi,"resolveElectronRuntimeZCodeAgentCommand");function xn(r){let e=process.env.ZCODE_AGENT_SERVER_COMMAND?.trim();if(e)return Nn({command:e,args:Oi(process.env.ZCODE_AGENT_SERVER_ARGS_JSON)??["app-server","--stdio"],cwd:process.env.ZCODE_AGENT_SERVER_CWD?.trim()||r.workspacePath},r.presentationSurface);let t=Li(r)??xi(r);return Nn(t?{...t,supportsStorageStartup:!0}:Mi(r),r.presentationSurface)}i(xn,"resolveDefaultZCodeAgentCommand");function Nn(r,e){if(!r||e!=="desktop")return r;let t=r.args??[],n=[];for(let s=0;s<t.length;s+=1){let o=t[s];if(o==="--surface"){let d=t[s+1];d!==void 0&&!d.startsWith("-")&&(s+=1);continue}o.startsWith("--surface=")||n.push(o)}return{...r,args:[...n,"--surface","desktop"]}}i(Nn,"applyPresentationSurfaceToCommand");function Wi(r,e){let t=In();if(!t.enabled)return r;let n=Qe("scripts/dev/zcode-stdio-tap.mjs");return n?{supportsStorageStartup:r.supportsStorageStartup,command:process.execPath,args:[n,"--workspace-key",e,"--log-dir",t.logDir,"--",r.command,...r.args??[]],cwd:r.cwd,env:{...r.env,ELECTRON_RUN_AS_NODE:"1"}}:(Mn("ZCode stdio tap proxy enabled but script not found"),r)}i(Wi,"wrapZCodeAgentCommandWithStdioTapDevProxy");var On=class{static{i(this,"ZCodeAgentProcessManager")}processesByWorkspaceKey=new Map;ownedProcesses=new Set;startingByWorkspaceKey=new Map;restartGenerationByWorkspaceKey=new Map;runtimeGenerationByWorkspaceKey=new Map;availableRuntimeIdentityByWorkspaceKey=new Map;startAdmissionAbortControllersByWorkspaceKey=new Map;storageStartupEmitter=new L;onStorageStartupChanged=this.storageStartupEmitter.event;getStorageStartupState(e){let t=this.processesByWorkspaceKey.get(O(e));return t?{generation:t.runtimeIdentity.generation,state:t.client.storageStartup.snapshot??null}:null}commandResolver;presentationSurface;requestTimeoutMs;processLifecycleReporter;resolveSpawnEnv;waitForSpawnAdmission;spawnFallbackCwd;lane;idleTimeoutMs;runtimeRestartedEmitter=new L;runtimeLifecycleEmitter=new L;disposeAllInFlight;disposed=!1;onRuntimeRestarted=this.runtimeRestartedEmitter.event;onRuntimeLifecycle=this.runtimeLifecycleEmitter.event;constructor(e){this.commandResolver=e?.commandResolver??xn,this.presentationSurface=e?.presentationSurface,this.requestTimeoutMs=e?.requestTimeoutMs,this.processLifecycleReporter=e?.processLifecycleReporter,this.resolveSpawnEnv=e?.resolveSpawnEnv,this.waitForSpawnAdmission=e?.waitForSpawnAdmission,this.spawnFallbackCwd=e?.spawnFallbackCwd,this.lane=e?.lane?.trim()||void 0,this.idleTimeoutMs=e?.idleTimeoutMs&&e.idleTimeoutMs>0?e.idleTimeoutMs:void 0}reportProcessLifecycle(e){let t=this.processLifecycleReporter;if(t)try{e(t)}catch(n){ze("ZCode agent process lifecycle reporter failed",n)}}clearIdleTimer(e){e.idleTimer&&(clearTimeout(e.idleTimer),delete e.idleTimer)}scheduleIdleReclaim(e,t){if(!this.idleTimeoutMs||this.disposed||t.exited)return;this.clearIdleTimer(t);let n=setTimeout(()=>{delete t.idleTimer,!(this.disposed||t.exited)&&this.processesByWorkspaceKey.get(e)===t&&(t.client.pendingOperationRequestCount>0||t.client.storageStartup.isWaiting||(F("ZCode agent process idle timeout; reclaiming",{workspaceKey:e,pid:t.child.pid,runtimeIdentity:t.runtimeIdentity.identity,idleTimeoutMs:this.idleTimeoutMs}),this.processesByWorkspaceKey.delete(e),this.reportRuntimeUnavailable(t),this.cleanupManagedProcessWithRetry(t,"idle-timeout","idle-timeout-retry","idle timeout").catch(()=>{})))},this.idleTimeoutMs);n.unref?.(),t.idleTimer=n}recordTerminationIntent(e,t){e.firstCleanupReason||(e.firstCleanupReason=t,t!=="protocol-close"&&(e.terminationIntent={kind:t==="request-timeout"?"watchdog_recycle":"expected",reason:t,requestedAt:Date.now()}))}reportRuntimeUnavailable(e){let t=e.runtimeIdentity.workspaceKey;this.availableRuntimeIdentityByWorkspaceKey.get(t)===e.runtimeIdentity.identity&&(this.availableRuntimeIdentityByWorkspaceKey.delete(t),this.runtimeLifecycleEmitter.fire({workspacePath:e.workspace.workspacePath,...e.workspace.workspaceIdentity?{workspaceIdentity:e.workspace.workspaceIdentity}:{},workspaceKey:t,runtimeIdentity:e.runtimeIdentity,state:"unavailable"}))}reportRuntimeReady(e){!e.spawned||e.exited||e.readyReported||e.readyAt==null||typeof e.child.pid!="number"||(e.readyReported=!0,this.reportProcessLifecycle(t=>t.onReady?.({pid:e.child.pid,provider:"glm",...this.lane?{lane:this.lane}:{},workspacePath:e.workspace.workspacePath,readyAt:e.readyAt,startupDurationMs:Math.max(0,e.readyAt-e.startedAt),runtimeGeneration:e.runtimeIdentity.generation,runtimeInstanceId:e.runtimeInstanceId})))}cleanupManagedProcess(e,t,n={}){if(this.recordTerminationIntent(e,t),this.clearIdleTimer(e),e.cleanupPromise)return e.cleanupPromise;let s=!1,o=e.client.disposeAndWait().then(()=>{s=!0,F("ZCode agent process cleanup completed",{workspaceKey:e.runtimeIdentity.workspaceKey,pid:e.child.pid,runtimeIdentity:e.runtimeIdentity.identity,reason:t})}).finally(()=>{e.cleanupPromise===o&&delete e.cleanupPromise,s&&this.ownedProcesses.delete(e)});return e.cleanupPromise=o,n.reportError!==!1&&o.catch(d=>{Je("ZCode agent process cleanup failed",{workspaceKey:e.runtimeIdentity.workspaceKey,pid:e.child.pid,runtimeIdentity:e.runtimeIdentity.identity,reason:t,error:d})}),o}async cleanupManagedProcessForShutdown(e){await this.cleanupManagedProcessWithRetry(e,"manager-dispose","manager-dispose-retry","manager dispose")}async cleanupManagedProcessWithRetry(e,t,n,s){try{await this.cleanupManagedProcess(e,t,{reportError:!1})}catch(o){let d=o;ze(`ZCode agent process cleanup retrying during ${s}`,{workspaceKey:e.runtimeIdentity.workspaceKey,pid:e.child.pid,runtimeIdentity:e.runtimeIdentity.identity,cleanupStage:t,errorName:o instanceof Error?o.name||"Error":"UnknownError",...typeof d.code=="string"?{errorCode:d.code}:{},error:o});try{await this.cleanupManagedProcess(e,n,{reportError:!1})}catch(a){throw Je("ZCode agent process cleanup failed",{workspaceKey:e.runtimeIdentity.workspaceKey,pid:e.child.pid,runtimeIdentity:e.runtimeIdentity.identity,reason:n,retryScope:s,error:a}),a}}}async getClient(e){if(this.disposed)throw new Error("ZCode agent process manager is disposed.");let t=O(e),n=this.processesByWorkspaceKey.get(t);if(n&&!n.child.killed)return n.client;let s=this.startingByWorkspaceKey.get(t);if(s){let u=Date.now();F("ZCode agent process start already in progress",{workspaceKey:t});let _=await s;return F("ZCode agent process start wait completed",{workspaceKey:t,durationMs:Date.now()-u}),_}let o=this.restartGenerationByWorkspaceKey.get(t)??0,d=new AbortController,a=this.startAdmissionAbortControllersByWorkspaceKey.get(t);a||(a=new Set,this.startAdmissionAbortControllersByWorkspaceKey.set(t,a)),a.add(d);let c=this.startClient(e,t,o,d.signal);this.startingByWorkspaceKey.set(t,c);try{return await c}finally{a.delete(d),a.size===0&&this.startAdmissionAbortControllersByWorkspaceKey.delete(t),this.startingByWorkspaceKey.get(t)===c&&this.startingByWorkspaceKey.delete(t)}}getExistingClient(e){let t=this.processesByWorkspaceKey.get(O(e));return t&&!t.child.killed?t.client:void 0}listManagedProcesses(){let e=[];for(let t of this.processesByWorkspaceKey.values())t.exited||t.child.killed||typeof t.child.pid!="number"||e.push({pid:t.child.pid,workspacePath:t.workspace.workspacePath,...t.workspace.workspaceIdentity?{workspaceIdentity:t.workspace.workspaceIdentity}:{},...this.lane?{lane:this.lane}:{},client:t.client});return e}markReady(e,t){let n=this.processesByWorkspaceKey.get(O(e));!n||n.client!==t||n.readyAt!=null||n.exited||(n.readyAt=Date.now(),this.reportRuntimeReady(n))}async startClient(e,t,n,s){let o=Date.now(),d=Date.now(),a=await this.commandResolver({...e,...this.presentationSurface?{presentationSurface:this.presentationSurface}:{},workspaceKey:t}),c=Date.now()-d;if(!a)throw new Error("ZCode agent server command is not configured. Set ZCODE_AGENT_SERVER_COMMAND before integration.");if(s.aborted)throw s.reason??new Error("ZCode agent process start was cancelled.");let u=Wi(a,t);F("ZCode agent command resolved",{workspaceKey:t,command:a.command,effectiveCommand:u.command,resolveCommandDurationMs:c}),await this.waitForSpawnAdmission?.({...e,workspaceKey:t,signal:s});let _=await this.resolveSpawnEnv?.({...e,workspaceKey:t})??{};if(this.disposed)throw new Error("ZCode agent process manager is disposed.");if((this.restartGenerationByWorkspaceKey.get(t)??0)!==n)throw new Error("ZCode agent process start was cancelled.");let l=await Di(u,e.workspacePath,this.spawnFallbackCwd);if(s.throwIfAborted(),await this.waitForSpawnAdmission?.({...e,workspaceKey:t,signal:s}),this.disposed)throw new Error("ZCode agent process manager is disposed.");if((this.restartGenerationByWorkspaceKey.get(t)??0)!==n)throw new Error("ZCode agent process start was cancelled.");let g=dr(process.env);F("ZCode agent spawn preflight",{workspaceKey:t,spawnPreflight:l});let h=Date.now(),m=Ti(u.command,l.args,{cwd:l.cwd,detached:En(),env:{...cr(process.env),[sr]:g,..._,...u.env,...Cn(e.workspaceIdentity),...Ai()},stdio:["pipe","pipe","pipe"]}),C=Date.now(),y=Ni(),k=new Ve(m,{onStderrLine:i(T=>{let S=Qt(T);if(S&&typeof m.pid=="number"){this.reportProcessLifecycle(W=>W.onException?.({pid:m.pid,provider:"glm",...this.lane?{lane:this.lane}:{},workspacePath:e.workspacePath,runtimeGeneration:w,runtimeInstanceId:A,diagnostic:{...S,name:Ye(S.name).slice(0,zt),message:Ye(S.message).slice(0,Jt),...S.stack!==void 0?{stack:Ye(S.stack).slice(0,Yt)}:{}}}));return}y.append(T),Mn(T)},"onStderrLine"),ownedProcessStartedAtMs:h,...process.platform!=="win32"&&m.pid?{ownedProcessGroupId:m.pid}:{}}),E=new Me(k,{requireStorageStartup:u.supportsStorageStartup,requestTimeoutMs:this.requestTimeoutMs}),w=(this.runtimeGenerationByWorkspaceKey.get(t)??0)+1;this.runtimeGenerationByWorkspaceKey.set(t,w);let A=`agent-${yi()}`,v={generation:w,identity:this.lane?`${t}:${w}:${m.pid??"unknown"}:${this.lane}`:`${t}:${w}:${m.pid??"unknown"}`,...typeof m.pid=="number"?{processId:m.pid}:{},...this.lane?{lane:this.lane}:{},workspaceKey:t},p={child:m,client:E,exited:!1,readyReported:!1,runtimeIdentity:v,runtimeInstanceId:A,spawned:!1,startedAt:C,workspace:{workspacePath:e.workspacePath,...e.workspaceIdentity?{workspaceIdentity:e.workspaceIdentity}:{}}};this.processesByWorkspaceKey.set(t,p),this.ownedProcesses.add(p);let P=i(()=>{this.processesByWorkspaceKey.get(t)===p&&(E.storageStartup.isWaiting?this.clearIdleTimer(p):E.storageStartup.snapshot?.phase==="ready"&&E.pendingOperationRequestCount===0&&this.scheduleIdleReclaim(t,p),this.storageStartupEmitter.fire({workspaceKey:t,snapshot:{generation:w,state:E.storageStartup.snapshot??null}}))},"publishStorage");return E.storageStartup.onDidChange(P),P(),this.idleTimeoutMs&&E.onPendingRequestsDrained(()=>this.scheduleIdleReclaim(t,p)),m.once("spawn",()=>{p.spawned=!0,w>1&&this.processesByWorkspaceKey.get(t)===p&&this.runtimeRestartedEmitter.fire({workspaceKey:t,runtimeIdentity:v}),this.processesByWorkspaceKey.get(t)===p&&(this.availableRuntimeIdentityByWorkspaceKey.set(t,v.identity),this.runtimeLifecycleEmitter.fire({workspacePath:e.workspacePath,...e.workspaceIdentity?{workspaceIdentity:e.workspaceIdentity}:{},workspaceKey:t,runtimeIdentity:v,state:"available"})),typeof m.pid=="number"&&this.reportProcessLifecycle(T=>T.onSpawn({pid:m.pid,provider:"glm",...this.lane?{lane:this.lane}:{},workspacePath:e.workspacePath,command:u.command,args:u.args??[],startedAt:C,runtimeGeneration:w,runtimeInstanceId:A})),this.reportRuntimeReady(p),F("ZCode agent process started",{workspaceKey:t,command:u.command,cwd:l.cwd,pid:m.pid,durationMs:Date.now()-o})}),m.once("error",T=>{Je(`ZCode agent process error${this.processLifecycleReporter?.onError?` ${rt}`:""}`,{workspaceKey:t,pid:m.pid,runtimeIdentity:v.identity,errorName:T.name,errorMessage:T.message,errorStack:T.stack,spawnPreflight:l});let S=T;this.reportProcessLifecycle(W=>W.onError?.({pid:typeof m.pid=="number"?m.pid:null,provider:"glm",...this.lane?{lane:this.lane}:{},workspacePath:e.workspacePath,command:u.command,args:u.args??[],errorName:T.name||"Error",...typeof S.code=="string"?{errorCode:S.code}:{},errorMessage:T.message,...T.stack?{errorStack:T.stack}:{},runtimeGeneration:w,runtimeInstanceId:A,occurredAt:Date.now()})),m.pid==null&&this.ownedProcesses.delete(p)}),m.once("exit",async(T,S)=>{p.exited=!0,this.clearIdleTimer(p);let W=Date.now(),H=p.terminationIntent?.kind??"unexpected",z=p.terminationIntent?.reason??p.firstCleanupReason;await k.waitForStderrDrain();let J=y.snapshot(),he={workspaceKey:t,pid:m.pid,runtimeIdentity:v.identity,code:T,signal:S,terminationKind:H,terminationReason:z};F("ZCode agent process exited",he),H==="unexpected"&&Je(`ZCode agent process exited unexpectedly${this.processLifecycleReporter?` ${rt}`:""}`,{...he,stderr:J}),typeof m.pid=="number"&&this.reportProcessLifecycle(tt=>tt.onExit({pid:m.pid,provider:"glm",...this.lane?{lane:this.lane}:{},workspacePath:e.workspacePath,exitCode:T,signal:S,endedAt:W,terminationKind:H,runtimeReady:p.readyAt!=null,...z?{terminationReason:z}:{},runtimeGeneration:w,runtimeInstanceId:A,uptimeMs:Math.max(0,W-C),stderrLineCount:J.lineCount,...H==="unexpected"&&J.tail.length>0?{stderrTail:J.tail}:{}}))}),E.onRequestTimeout(T=>{if(this.processesByWorkspaceKey.get(t)===p){if(T.method==="workspace/cancelGenerateText"){ze("ZCode agent cancel notification timed out; keeping client (best-effort control plane)",{workspaceKey:t,method:T.method,requestId:T.requestId,timeoutMs:T.timeoutMs,pid:m.pid});return}ze("ZCode agent request timed out; disposing stale protocol client",{workspaceKey:t,method:T.method,requestId:T.requestId,timeoutMs:T.timeoutMs,pid:m.pid}),this.processesByWorkspaceKey.delete(t),this.reportRuntimeUnavailable(p),this.cleanupManagedProcessWithRetry(p,"request-timeout","request-timeout","request timeout").catch(()=>{})}}),E.onClose(()=>{let T=this.processesByWorkspaceKey.get(t)===p;F("ZCode agent protocol client closed",{workspaceKey:t,pid:m.pid,runtimeIdentity:v.identity,wasActiveClient:T}),T&&this.processesByWorkspaceKey.delete(t),this.reportRuntimeUnavailable(p),this.ownedProcesses.has(p)&&this.cleanupManagedProcessWithRetry(p,"protocol-close","protocol-close","protocol close").catch(()=>{})}),E}async getRuntimeIdentity(e){let t=O(e),n=this.processesByWorkspaceKey.get(t);if(!n||n.exited||n.child.killed)throw new Error("ZCode agent runtime identity is unavailable.");return n.runtimeIdentity}async canStart(e){let t=O(e);try{return await this.commandResolver({...e,...this.presentationSurface?{presentationSurface:this.presentationSurface}:{},workspaceKey:t})?{available:!0,workspaceKey:t}:{available:!1,workspaceKey:t,reason:"ZCODE_AGENT_SERVER_COMMAND is not configured"}}catch(n){return{available:!1,workspaceKey:t,reason:n instanceof Error?n.message:String(n)}}}async disposeWorkspace(e){let t=O(e);this.restartGenerationByWorkspaceKey.set(t,(this.restartGenerationByWorkspaceKey.get(t)??0)+1),this.abortPendingStarts(t);let n=this.processesByWorkspaceKey.get(t);this.processesByWorkspaceKey.delete(t),n&&(this.reportRuntimeUnavailable(n),await this.cleanupManagedProcessWithRetry(n,"workspace-dispose","workspace-dispose-retry","workspace dispose"))}abortPendingStarts(e,t=new Error("ZCode agent process start was cancelled.")){let n=this.startAdmissionAbortControllersByWorkspaceKey.get(e);if(n)for(let s of n)s.abort(t)}abortAllPendingStarts(e=new Error("ZCode agent process manager is disposed.")){for(let t of this.startAdmissionAbortControllersByWorkspaceKey.keys())this.abortPendingStarts(t,e)}disposeAll(){this.disposed=!0,this.storageStartupEmitter.dispose(),this.abortAllPendingStarts();for(let e of this.ownedProcesses)this.recordTerminationIntent(e,"manager-dispose"),this.reportRuntimeUnavailable(e),e.client.dispose();this.processesByWorkspaceKey.clear(),this.startingByWorkspaceKey.clear()}async disposeAllAndWait(){if(this.disposeAllInFlight)return this.disposeAllInFlight;this.disposed=!0,this.storageStartupEmitter.dispose(),this.abortAllPendingStarts();let e=[...this.ownedProcesses];for(let t of e)this.reportRuntimeUnavailable(t);this.processesByWorkspaceKey.clear(),this.startingByWorkspaceKey.clear(),this.disposeAllInFlight=Promise.all(e.map(t=>this.cleanupManagedProcessForShutdown(t))).then(()=>{});try{await this.disposeAllInFlight}finally{this.disposeAllInFlight=void 0}}};export{Tt as a,Te as b,ye as c,Sa as d,ne as e,Aa as f,wr as g,Ia as h,Ca as i,va as j,j as k,wt as l,ba as m,Na as n,es as o,Oa as p,be as q,Se as r,td as s,Ie as t,Ks as u,vt as v,zd as w,Lt as x,vu as y,bu as z,xn as A,On as B};
