const crypto = require("crypto");
const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs/promises");

const app = express();
const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "storage");
const CONFIG_FILE = path.join(DATA_DIR, "config.json");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

const CONNECTION_MODES = [
  { key: "gmail_app_password", label: "Gmail + clave", description: "Gmail fijo con clave de aplicacion." },
  { key: "smtp_preset", label: "SMTP preset", description: "Proveedor comun con parametros cerrados." },
  { key: "smtp_custom", label: "SMTP manual", description: "Host, puerto y TLS manuales." }
];

const PROFILES = {
  gmail_app_password: {
    key: "gmail_app_password",
    mode: "gmail_app_password",
    providerKey: "gmail",
    label: "Gmail + clave de aplicacion",
    host: "smtp.gmail.com",
    port: 465,
    tlsMode: "ssl",
    docsUrl: "https://support.google.com/mail/answer/185833?hl=en",
    hint: "Google exige 2-Step Verification para generar la clave de aplicacion.",
    notes: [
      "Google indica que las app passwords solo funcionan con 2-Step Verification.",
      "Google recomienda usarlas solo cuando no existe Sign in with Google."
    ],
    guardrails: { batchMax: 20, minIntervalSeconds: 120, maxAveragePerMinute: 10, dailyCap: 400 }
  },
  gmail: {
    key: "gmail",
    mode: "smtp_preset",
    providerKey: "gmail",
    label: "Gmail SMTP",
    host: "smtp.gmail.com",
    port: 465,
    tlsMode: "ssl",
    docsUrl: "https://support.google.com/mail/answer/185833?hl=en",
    hint: "Usa tu correo completo y una clave de aplicacion.",
    notes: [
      "Misma salida SMTP de Gmail, pero como preset SMTP.",
      "Las claves de aplicacion no son la opcion recomendada si existe OAuth."
    ],
    guardrails: { batchMax: 20, minIntervalSeconds: 120, maxAveragePerMinute: 10, dailyCap: 400 }
  },
  outlook: {
    key: "outlook",
    mode: "smtp_preset",
    providerKey: "outlook",
    label: "Outlook.com / Hotmail",
    host: "smtp-mail.outlook.com",
    port: 587,
    tlsMode: "starttls",
    docsUrl: "https://support.microsoft.com/office/pop-imap-and-smtp-settings-for-outlook-com-d088b986-291d-42b8-9564-9c414e2aa040",
    hint: "STARTTLS en 587. Algunas cuentas personales requieren autenticacion moderna o clave de aplicacion.",
    notes: [
      "Microsoft publica smtp-mail.outlook.com en 587 con STARTTLS para Outlook.com.",
      "En cuentas personales, usuario + clave puede no funcionar en todos los casos."
    ],
    guardrails: { batchMax: 10, minIntervalSeconds: 180, maxAveragePerMinute: 4, dailyCap: 200 }
  },
  office365: {
    key: "office365",
    mode: "smtp_preset",
    providerKey: "office365",
    label: "Microsoft 365",
    host: "smtp.office365.com",
    port: 587,
    tlsMode: "starttls",
    docsUrl: "https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/how-to-set-up-a-multifunction-device-or-application-to-send-email-using-microsoft-365-or-office-365",
    hint: "SMTP AUTH debe estar habilitado en el buzon.",
    notes: [
      "Microsoft documenta 30 mensajes por minuto y 10.000 destinatarios por dia.",
      "Esta app usa un guardrail mas conservador por defecto."
    ],
    guardrails: { batchMax: 30, minIntervalSeconds: 60, maxAveragePerMinute: 20, dailyCap: 10000 }
  },
  hostinger: {
    key: "hostinger",
    mode: "smtp_preset",
    providerKey: "hostinger",
    label: "Hostinger",
    host: "smtp.hostinger.com",
    port: 465,
    tlsMode: "ssl",
    docsUrl: "https://www.hostinger.com/support/1575756-how-to-get-email-account-configuration-details-for-hostinger-email/",
    hint: "Hostinger usa SSL en 465 y tambien STARTTLS en 587 como alternativo.",
    notes: [
      "Hostinger publica smtp.hostinger.com con SSL en 465.",
      "Si hay problemas de cifrado, Hostinger sugiere STARTTLS en 587."
    ],
    guardrails: { batchMax: 25, minIntervalSeconds: 60, maxAveragePerMinute: 12, dailyCap: 600 }
  },
  custom: {
    key: "custom",
    mode: "smtp_custom",
    providerKey: "custom",
    label: "SMTP manual",
    host: "",
    port: 587,
    tlsMode: "starttls",
    docsUrl: "",
    hint: "Configura host, puerto y TLS manualmente.",
    notes: [
      "No conocemos los limites reales de tu servidor custom.",
      "Se aplican guardrails conservadores hasta que valides tu infraestructura."
    ],
    guardrails: { batchMax: 15, minIntervalSeconds: 60, maxAveragePerMinute: 8, dailyCap: 300 }
  }
};

const DEFAULT_CONFIG = {
  connectionMode: "gmail_app_password",
  providerKey: "gmail",
  host: PROFILES.gmail_app_password.host,
  port: PROFILES.gmail_app_password.port,
  tlsMode: PROFILES.gmail_app_password.tlsMode,
  user: "",
  secret: "",
  fromName: "",
  fromEmail: ""
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 5, fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const mime = String(file.mimetype || "");
    if (mime.startsWith("image/") || mime === "application/pdf") {
      callback(null, true);
      return;
    }
    callback(new Error("Solo se permiten imagenes o archivos PDF."));
  }
});

let campaign = emptyCampaign();
let campaignTimer = null;

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/meta", (_req, res) => {
  res.json({
    connectionModes: CONNECTION_MODES,
    smtpPresets: Object.fromEntries(Object.entries(PROFILES).filter(([, item]) => item.mode === "smtp_preset")),
    customProfile: PROFILES.custom,
    gmailAppProfile: PROFILES.gmail_app_password,
    attachmentRules: { maxFiles: 5, maxFileSizeMb: 10, accepted: ["image/*", "application/pdf"] },
    deliveryGuidance: [
      "Mantener una cadencia estable ayuda mas que disparar picos bruscos.",
      "Usa remitente del mismo dominio autenticado con SPF, DKIM y DMARC cuando sea posible.",
      "Si aparecen rebotes o diferidos, reduce el ritmo antes de seguir."
    ]
  });
});

app.get("/api/config", async (_req, res, next) => {
  try {
    res.json(stripSecret(await readConfig()));
  } catch (error) {
    next(error);
  }
});

app.post("/api/config", async (req, res, next) => {
  try {
    const nextConfig = buildConfigPayload(req.body, await readConfig());
    await saveConfig(nextConfig);
    res.json({ ok: true, message: "Configuracion guardada.", config: stripSecret(nextConfig) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/config/test", async (req, res, next) => {
  try {
    const config = buildConfigPayload(req.body, await readConfig());
    const { transporter, profile } = createTransport(config);
    await transporter.verify();
    res.json({ ok: true, message: `Conexion verificada con ${profile.label}.`, profile });
  } catch (error) {
    next(error);
  }
});

app.get("/api/campaign", (_req, res) => {
  res.json(publicCampaign());
});

app.post("/api/campaign", upload.array("attachments", 5), async (req, res, next) => {
  try {
    if (isActive()) {
      return res.status(409).json({ ok: false, message: "Ya hay una cola activa. Detenla o espera a que termine." });
    }
    const config = await readConfig();
    const nextCampaign = buildCampaignPayload(req.body, config);
    const { transporter } = createTransport(config);
    await transporter.verify();
    nextCampaign.attachments = await persistAttachments(nextCampaign.id, req.files || []);
    pushLogs(nextCampaign, ["Conexion validada. Cola creada."]);
    saveCampaign(nextCampaign);
    scheduleRun(nextCampaign.id, 250);
    res.status(202).json({ ok: true, message: "Cola creada. El primer lote sale enseguida.", campaign: publicCampaign() });
  } catch (error) {
    next(error);
  }
});

app.post("/api/campaign/:id/stop", async (req, res, next) => {
  try {
    if (!campaign.id || campaign.id !== req.params.id) {
      return res.status(404).json({ ok: false, message: "No existe esa cola activa." });
    }
    if (!isActive()) {
      return res.status(400).json({ ok: false, message: "La cola ya no esta activa." });
    }
    if (campaign.status === "running") {
      campaign.stopRequested = true;
      campaign.status = "stopping";
      pushLogs(campaign, ["Se detendra al finalizar el lote actual."]);
      return res.json({ ok: true, message: "La cola se detendra al terminar el lote actual.", campaign: publicCampaign() });
    }
    clearTimer();
    campaign.status = "stopped";
    campaign.stopRequested = true;
    campaign.nextRunAt = null;
    campaign.currentBatch = null;
    campaign.completedAt = now();
    pushLogs(campaign, ["Cola detenida."]);
    await cleanupAttachments(campaign.id);
    res.json({ ok: true, message: "Cola detenida.", campaign: publicCampaign() });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ ok: false, message: error.code === "LIMIT_FILE_SIZE" ? "Cada archivo debe pesar menos de 10 MB." : "No se pudo procesar el archivo adjunto." });
  }
  res.status(400).json({ ok: false, message: error.message || "Ocurrio un error inesperado." });
});

bootstrap().then(() => {
  app.listen(PORT, () => {
    console.log(`MasivoMail listo en http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("No se pudo iniciar la aplicacion:", error);
  process.exit(1);
});

async function bootstrap() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  try {
    await fs.access(CONFIG_FILE);
  } catch (_error) {
    await saveConfig(DEFAULT_CONFIG);
  }
}

async function readConfig() {
  try {
    const raw = JSON.parse(await fs.readFile(CONFIG_FILE, "utf8"));
    if (raw.connectionMode) {
      const profile = resolveProfile(raw.connectionMode, raw.providerKey, raw);
      return { ...DEFAULT_CONFIG, ...raw, host: profile.host, port: profile.port, tlsMode: profile.tlsMode, providerKey: profile.providerKey };
    }
    const mode = raw.mode === "google_app_password" ? "gmail_app_password" : (raw.provider === "custom" ? "smtp_custom" : "smtp_preset");
    return readConfigCompat({ ...raw, connectionMode: mode, providerKey: raw.provider || "gmail", tlsMode: raw.secure ? "ssl" : "starttls" });
  } catch (_error) {
    return { ...DEFAULT_CONFIG };
  }
}

function readConfigCompat(raw) {
  const email = normalizeEmail(raw.fromEmail) || normalizeEmail(raw.user);
  const profile = resolveProfile(raw.connectionMode, raw.providerKey, raw);
  const connectionMode = raw.connectionMode || DEFAULT_CONFIG.connectionMode;
  return {
    ...DEFAULT_CONFIG,
    connectionMode,
    providerKey: profile.providerKey,
    host: profile.host,
    port: profile.port,
    tlsMode: profile.tlsMode,
    user: email,
    secret: normalizeSecret(raw.secret, connectionMode),
    fromName: normalizeText(raw.fromName),
    fromEmail: email
  };
}

async function saveConfig(config) {
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
}

function buildConfigPayload(input, current) {
  const connectionMode = CONNECTION_MODES.some((item) => item.key === input.connectionMode) ? input.connectionMode : DEFAULT_CONFIG.connectionMode;
  const providerKey = connectionMode === "smtp_preset" ? normalizePresetKey(input.providerKey) : (connectionMode === "smtp_custom" ? "custom" : "gmail");
  const profile = resolveProfile(connectionMode, providerKey, input);
  const resolvedEmail = normalizeEmail(input.fromEmail) || normalizeEmail(input.user);
  const user = normalizeEmail(input.user) || resolvedEmail;
  const secret = normalizeSecret(input.secret, connectionMode) || normalizeSecret(current.secret, connectionMode);
  const fromEmail = normalizeEmail(input.fromEmail) || resolvedEmail;
  if (!user) throw new Error("Define un correo o usuario valido.");
  if (!secret) throw new Error("La clave o clave de aplicacion es obligatoria.");
  if (!profile.host) throw new Error("El host SMTP es obligatorio.");
  if (!Number.isInteger(profile.port) || profile.port <= 0) throw new Error("El puerto SMTP no es valido.");
  return {
    connectionMode,
    providerKey: profile.providerKey,
    host: profile.host,
    port: profile.port,
    tlsMode: profile.tlsMode,
    user,
    secret,
    fromName: normalizeText(input.fromName),
    fromEmail
  };
}

function resolveProfile(connectionMode, providerKey, raw = {}) {
  if (connectionMode === "gmail_app_password") return { ...PROFILES.gmail_app_password };
  if (connectionMode === "smtp_preset") return { ...PROFILES[normalizePresetKey(providerKey)] };
  return {
    ...PROFILES.custom,
    host: normalizeText(raw.host),
    port: Number.isInteger(raw.port) ? raw.port : Number.parseInt(String(raw.port || PROFILES.custom.port), 10),
    tlsMode: ["ssl", "starttls", "none"].includes(raw.tlsMode) ? raw.tlsMode : PROFILES.custom.tlsMode
  };
}

function createTransport(config, options = {}) {
  const profile = resolveProfile(config.connectionMode, config.providerKey, config);
  const transporter = nodemailer.createTransport({
    host: profile.host,
    port: profile.port,
    secure: profile.tlsMode === "ssl",
    requireTLS: profile.tlsMode === "starttls",
    auth: { user: config.user, pass: config.secret },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    pool: Boolean(options.pool),
    maxConnections: options.pool ? Math.min(options.maxConnections || 1, 5) : undefined,
    maxMessages: options.pool ? Infinity : undefined
  });
  return { transporter, sender: formatSender(config), profile };
}

function formatSender(config) {
  const from = normalizeEmail(config.fromEmail) || normalizeEmail(config.user);
  if (!from) throw new Error("Define un correo saliente valido.");
  return config.fromName ? `"${config.fromName.replace(/"/g, '\\"')}" <${from}>` : from;
}

function stripSecret(config) {
  const { secret, ...safe } = config;
  return { ...safe, profile: resolveProfile(config.connectionMode, config.providerKey, config), hasSecret: Boolean(secret) };
}

function buildCampaignPayload(input, config) {
  const recipients = splitRecipients(input.recipients);
  const batchSize = Number.parseInt(String(input.batchSize || ""), 10);
  const intervalValue = Number.parseInt(String(input.intervalValue || ""), 10);
  const intervalUnit = input.intervalUnit === "seconds" ? "seconds" : "minutes";
  const intervalSeconds = intervalUnit === "seconds" ? intervalValue : intervalValue * 60;
  const windowValue = Number.parseInt(String(input.windowValue || ""), 10);
  const windowUnit = input.windowUnit === "minutes" ? "minutes" : "hours";
  const windowSeconds = windowUnit === "minutes" ? windowValue * 60 : windowValue * 3600;
  const deliveryMode = input.deliveryMode === "staggered" ? "staggered" : "burst";
  const rampUp = String(input.rampUp) === "true";
  const repeatWindow = String(input.repeatWindow) === "true";
  const profile = resolveProfile(config.connectionMode, config.providerKey, config);
  const subject = normalizeText(input.subject);
  const body = normalizeText(input.body);
  if (!recipients.valid.length) throw new Error("Agrega al menos un destinatario valido.");
  if (recipients.invalid.length) throw new Error(`Hay correos invalidos: ${recipients.invalid.slice(0, 6).join(", ")}.`);
  if (!subject) throw new Error("El asunto es obligatorio.");
  if (!body) throw new Error("El cuerpo del correo es obligatorio.");
  if (!Number.isInteger(batchSize) || batchSize <= 0) throw new Error("El tamano del lote debe ser mayor que cero.");
  if (!Number.isInteger(intervalValue) || intervalValue <= 0) throw new Error("El intervalo debe ser mayor que cero.");
  if (!Number.isInteger(windowValue) || windowValue <= 0) throw new Error("La duracion de la ventana debe ser mayor que cero.");
  validateGuardrails(recipients.valid.length, batchSize, intervalSeconds, windowSeconds, Number((batchSize * 60) / intervalSeconds), profile);
  return {
    id: crypto.randomUUID(),
    status: "queued",
    stopRequested: false,
    createdAt: now(),
    startedAt: null,
    completedAt: null,
    nextRunAt: null,
    subject,
    body,
    providerProfile: profile,
    configSnapshot: { ...config },
    options: { batchSize, intervalValue, intervalUnit, intervalSeconds, windowValue, windowUnit, windowSeconds, deliveryMode, rampUp, repeatWindow },
    attachments: [],
    recipients: recipients.valid,
    pendingRecipients: [...recipients.valid],
    recipientCursor: 0,
    sent: [],
    failed: [],
    sentCount: 0,
    failedCount: 0,
    cycleSentCount: 0,
    cycleFailedCount: 0,
    currentBatch: null,
    cycleNumber: 0,
    cycleStartedAt: null,
    cycleEndsAt: null,
    cycleBatchCount: 0,
    lastActivityAt: null,
    logs: []
  };
}

function validateGuardrails(total, batchSize, intervalSeconds, windowSeconds, averagePerMinute, profile) {
  const rules = profile.guardrails;
  const plannedMessages = plannedMessagesForCycle({
    batchSize,
    intervalSeconds,
    windowSeconds,
    rampUp: false
  });
  if (batchSize > rules.batchMax) throw new Error(`Con ${profile.label}, la app limita el lote a ${rules.batchMax} correos.`);
  if (intervalSeconds < rules.minIntervalSeconds) throw new Error(`Con ${profile.label}, el intervalo minimo es ${humanizeSeconds(rules.minIntervalSeconds)}.`);
  if (averagePerMinute > rules.maxAveragePerMinute) throw new Error(`Con ${profile.label}, la app limita el promedio a ${rules.maxAveragePerMinute} correos por minuto.`);
  if (total > rules.dailyCap) throw new Error(`Con ${profile.label}, la app no permite mas de ${rules.dailyCap} correos en una sola cola.`);
  if (plannedMessages > rules.dailyCap) throw new Error(`Con ${profile.label}, esa ventana supera el tope de ${rules.dailyCap} correos.`);
}

async function persistAttachments(id, files) {
  if (!files.length) return [];
  const dir = path.join(UPLOAD_DIR, id);
  await fs.mkdir(dir, { recursive: true });
  const items = [];
  for (const [index, file] of files.entries()) {
    const safeName = `${String(index + 1).padStart(2, "0")}-${String(file.originalname || "file").replace(/[^\w.\-]+/g, "_")}`;
    const target = path.join(dir, safeName);
    await fs.writeFile(target, file.buffer);
    items.push({ filename: file.originalname, path: target, contentType: file.mimetype, size: file.size });
  }
  return items;
}

async function cleanupAttachments(id) {
  if (!id) return;
  await fs.rm(path.join(UPLOAD_DIR, id), { recursive: true, force: true });
}

function saveCampaign(next) {
  campaign = next;
}

function publicCampaign() {
  return {
    id: campaign.id,
    status: campaign.status,
    createdAt: campaign.createdAt,
    startedAt: campaign.startedAt,
    completedAt: campaign.completedAt,
    nextRunAt: campaign.nextRunAt,
    stopRequested: campaign.stopRequested,
    subject: campaign.subject,
    providerProfile: campaign.providerProfile,
    options: campaign.options,
    summary: summary(),
    cycle: campaign.cycleNumber ? {
      number: campaign.cycleNumber,
      startedAt: campaign.cycleStartedAt,
      endsAt: campaign.cycleEndsAt,
      repeatWindow: campaign.options?.repeatWindow || false
    } : null,
    currentBatch: campaign.currentBatch,
    attachments: campaign.attachments.map(({ filename, size, contentType }) => ({ filename, size, contentType })),
    recipientCount: campaign.recipients.length,
    recentFailed: campaign.failed.slice(-6),
    recentSent: campaign.sent.slice(-6),
    lastActivityAt: campaign.lastActivityAt,
    schedulePreview: buildSchedulePreview(),
    logs: campaign.logs.slice(-8)
  };
}

function summary() {
  const batchSize = campaign.options ? campaign.options.batchSize : 0;
  const plannedBatches = campaign.options ? plannedBatchesPerCycle(campaign.options) : 0;
  const plannedMessages = campaign.options ? plannedMessagesForCycle(campaign.options) : 0;
  const cycleStartMs = campaign.cycleStartedAt ? Date.parse(campaign.cycleStartedAt) : 0;
  const cycleEndMs = campaign.cycleEndsAt ? Date.parse(campaign.cycleEndsAt) : 0;
  const windowProgressPercent = cycleStartMs && cycleEndMs
    ? Math.max(0, Math.min(100, Math.round(((Math.min(Date.now(), cycleEndMs) - cycleStartMs) / Math.max(1, cycleEndMs - cycleStartMs)) * 100)))
    : 0;
  const delivered = campaign.cycleSentCount || 0;
  const failed = campaign.cycleFailedCount || 0;
  return {
    total: plannedMessages,
    pending: Math.max(plannedMessages - delivered - failed, 0),
    delivered,
    failed,
    batchesDone: campaign.cycleBatchCount || 0,
    batchesTotal: plannedBatches,
    averagePerMinute: campaign.options ? Number(((batchSize * 60) / campaign.options.intervalSeconds).toFixed(2)) : 0,
    cycleNumber: campaign.cycleNumber || 0,
    windowProgressPercent
  };
}

function isActive() {
  return ["queued", "running", "waiting", "stopping"].includes(campaign.status);
}

function scheduleRun(id, delayMs) {
  clearTimer();
  campaign.nextRunAt = new Date(Date.now() + delayMs).toISOString();
  campaignTimer = setTimeout(() => runCampaign(id).catch(failCampaign), delayMs);
}

async function runCampaign(id) {
  clearTimer();
  if (!campaign.id || campaign.id !== id || ["completed", "failed", "stopped", "idle"].includes(campaign.status)) return;
  if (!campaign.cycleStartedAt) {
    startCycle(1);
  }
  if (await handleCycleBoundary(id)) return;
  const batchRecipients = buildBatchRecipients(currentBatchSize());
  if (!batchRecipients.length) {
    return finalize("completed", "No hay destinatarios pendientes para esta ventana.");
  }

  const batchNumber = (campaign.cycleBatchCount || 0) + 1;
  campaign.status = "running";
  campaign.startedAt = campaign.startedAt || now();
  campaign.nextRunAt = null;
  campaign.currentBatch = { number: batchNumber, cycle: campaign.cycleNumber, size: batchRecipients.length, startedAt: now(), recipients: batchRecipients };
  pushLogs(campaign, [`Ventana ${campaign.cycleNumber} · lote ${batchNumber} arrancando con ${batchRecipients.length} correos.`]);
  const results = await sendBatch(batchRecipients);
  const successes = results.filter((item) => item.accepted);
  const failures = results.filter((item) => !item.accepted);
  campaign.sentCount += successes.length;
  campaign.failedCount += failures.length;
  campaign.cycleSentCount += successes.length;
  campaign.cycleFailedCount += failures.length;
  campaign.sent.push(...successes);
  campaign.failed.push(...failures);
  campaign.sent = campaign.sent.slice(-120);
  campaign.failed = campaign.failed.slice(-120);
  campaign.lastActivityAt = results[results.length - 1]?.at || now();
  campaign.cycleBatchCount += 1;
  campaign.currentBatch = null;
  pushLogs(campaign, [`Ventana ${campaign.cycleNumber} · lote ${batchNumber} terminado. OK ${successes.length}, fallo ${failures.length}.`]);
  if (failures.length) {
    pushLogs(campaign, failures.slice(0, 3).map((item) => `Fallo para ${item.email}: ${summarizeSendError(item.error)}`));
  }
  if (campaign.stopRequested) return finalize("stopped", "Cola detenida al terminar el lote actual.");
  if (await handleCycleBoundary(id)) return;
  campaign.status = "waiting";
  scheduleNextRun(id);
}

async function sendBatch(batchRecipients) {
  const usePool = campaign.options.deliveryMode === "burst" && batchRecipients.length > 1;
  const { transporter, sender } = createTransport(campaign.configSnapshot, { pool: usePool, maxConnections: batchRecipients.length });
  const attachments = campaign.attachments.map((item) => ({ filename: item.filename, path: item.path, contentType: item.contentType }));
  try {
    if (campaign.options.deliveryMode === "burst") {
      const results = await Promise.all(batchRecipients.map((email) => sendOne(transporter, sender, email, attachments)));
      return results;
    }
    const results = [];
    for (const email of batchRecipients) {
      results.push(await sendOne(transporter, sender, email, attachments));
      await wait(900);
    }
    return results;
  } finally {
    if (typeof transporter.close === "function") transporter.close();
  }
}

async function sendOne(transporter, sender, email, attachments) {
  try {
    const info = await transporter.sendMail({ from: sender, to: email, subject: campaign.subject, text: campaign.body, html: renderHtml(campaign.body), attachments });
    return { email, accepted: Array.isArray(info.accepted) ? info.accepted.length > 0 : true, at: now() };
  } catch (error) {
    return { email, accepted: false, error: error.message, at: now() };
  }
}

async function finalize(status, message) {
  clearTimer();
  campaign.status = status;
  campaign.completedAt = now();
  campaign.nextRunAt = null;
  campaign.currentBatch = null;
  pushLogs(campaign, [message]);
  await cleanupAttachments(campaign.id);
}

async function failCampaign(error) {
  clearTimer();
  campaign.status = "failed";
  campaign.completedAt = now();
  campaign.nextRunAt = null;
  campaign.currentBatch = null;
  pushLogs(campaign, [error.message || "La cola fallo."]);
  await cleanupAttachments(campaign.id);
}

function currentBatchSize() {
  const base = campaign.options.batchSize;
  if (!campaign.options.rampUp) return base;
  const done = campaign.cycleBatchCount || 0;
  if (done === 0) return Math.max(1, Math.ceil(base * 0.5));
  if (done === 1) return Math.max(1, Math.ceil(base * 0.75));
  return base;
}

function startCycle(number) {
  campaign.cycleNumber = number;
  campaign.cycleStartedAt = now();
  campaign.cycleEndsAt = new Date(Date.now() + (campaign.options.windowSeconds * 1000)).toISOString();
  campaign.cycleBatchCount = 0;
  campaign.cycleSentCount = 0;
  campaign.cycleFailedCount = 0;
  campaign.recipientCursor = 0;
  pushLogs(campaign, [
    campaign.options.repeatWindow && number > 1
      ? `Ventana ${number} reiniciada. Corre hasta ${formatClock(campaign.cycleEndsAt)}.`
      : `Ventana ${number} abierta. Corre hasta ${formatClock(campaign.cycleEndsAt)}.`
  ]);
}

async function handleCycleBoundary(id) {
  if (!campaign.cycleEndsAt || Date.now() < Date.parse(campaign.cycleEndsAt)) {
    return false;
  }

  if (campaign.options.repeatWindow && !campaign.stopRequested) {
    pushLogs(campaign, [`Ventana ${campaign.cycleNumber} cerrada. Se reinicia enseguida.`]);
    startCycle((campaign.cycleNumber || 0) + 1);
    campaign.status = "waiting";
    scheduleRun(id, 250);
    return true;
  }

  await finalize("completed", "Ventana completada.");
  return true;
}

function scheduleNextRun(id) {
  const intervalMs = campaign.options.intervalSeconds * 1000;
  if (!campaign.cycleEndsAt) {
    scheduleRun(id, intervalMs);
    return;
  }

  const cycleEndsMs = Date.parse(campaign.cycleEndsAt);
  const nextBatchMs = Date.now() + intervalMs;
  if (nextBatchMs < cycleEndsMs) {
    scheduleRun(id, intervalMs);
    return;
  }

  scheduleRun(id, Math.max(250, cycleEndsMs - Date.now()));
}

function buildBatchRecipients(size) {
  if (!campaign.recipients.length || size <= 0) {
    return [];
  }

  const batch = [];
  for (let index = 0; index < size; index += 1) {
    batch.push(campaign.recipients[campaign.recipientCursor]);
    campaign.recipientCursor = (campaign.recipientCursor + 1) % campaign.recipients.length;
  }
  return batch;
}

function buildSchedulePreview() {
  if (!campaign.options) {
    return [];
  }

  const items = [];
  const cycleEndMs = campaign.cycleEndsAt ? Date.parse(campaign.cycleEndsAt) : 0;
  const intervalMs = campaign.options.intervalSeconds * 1000;

  if (campaign.lastActivityAt) {
    items.push({ at: campaign.lastActivityAt, label: "Ultimo correo" });
  }

  if (campaign.nextRunAt) {
    items.push({ at: campaign.nextRunAt, label: "Siguiente tanda" });
  }

  if (campaign.cycleEndsAt) {
    items.push({
      at: campaign.cycleEndsAt,
      label: campaign.options.repeatWindow ? `Reinicio ventana ${campaign.cycleNumber + 1}` : "Fin de ventana"
    });
  }

  if (campaign.nextRunAt && intervalMs && cycleEndMs) {
    let cursor = Date.parse(campaign.nextRunAt) + intervalMs;
    let batchNumber = (campaign.cycleBatchCount || 0) + 2;
    for (let index = 0; index < 4; index += 1) {
      if (cursor >= cycleEndMs) break;
      items.push({ at: new Date(cursor).toISOString(), label: `Tanda ${batchNumber}` });
      cursor += intervalMs;
      batchNumber += 1;
    }
  }

  return items
    .filter((item) => item.at)
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
    .filter((item, index, list) => index === list.findIndex((entry) => entry.at === item.at && entry.label === item.label))
    .slice(0, 6);
}

function plannedBatchesPerCycle(options) {
  return Math.max(1, Math.floor(Math.max(options.windowSeconds - 1, 0) / Math.max(options.intervalSeconds, 1)) + 1);
}

function batchSizeForCycleIndex(options, batchIndex) {
  const base = options.batchSize;
  if (!options.rampUp) return base;
  if (batchIndex === 1) return Math.max(1, Math.ceil(base * 0.5));
  if (batchIndex === 2) return Math.max(1, Math.ceil(base * 0.75));
  return base;
}

function plannedMessagesForCycle(options) {
  let total = 0;
  const batches = plannedBatchesPerCycle(options);
  for (let index = 1; index <= batches; index += 1) {
    total += batchSizeForCycleIndex(options, index);
  }
  return total;
}

function splitRecipients(input) {
  const seen = new Set();
  const valid = [];
  const invalid = [];
  for (const item of normalizeText(input).split(/[\n,;]+/).map((entry) => entry.trim()).filter(Boolean)) {
    const email = item.toLowerCase();
    if (seen.has(email)) continue;
    seen.add(email);
    (isEmail(email) ? valid : invalid).push(isEmail(email) ? email : item);
  }
  return { valid, invalid };
}

function pushLogs(target, lines) {
  target.logs.push(...lines.map((message) => ({ at: now(), message })));
  target.logs = target.logs.slice(-30);
}

function emptyCampaign() {
  return {
    id: null,
    status: "idle",
    stopRequested: false,
    createdAt: null,
    startedAt: null,
    completedAt: null,
    nextRunAt: null,
    subject: "",
    providerProfile: null,
    options: null,
    attachments: [],
    recipients: [],
    pendingRecipients: [],
    sent: [],
    failed: [],
    sentCount: 0,
    failedCount: 0,
    currentBatch: null,
    cycleNumber: 0,
    cycleStartedAt: null,
    cycleEndsAt: null,
    cycleBatchCount: 0,
    lastActivityAt: null,
    logs: [{ at: now(), message: "Sin cola activa." }]
  };
}

function renderHtml(body) {
  return `<div style="font-family:Arial,sans-serif;background:#11161f;color:#f4ecd6;padding:20px;"><div style="max-width:640px;margin:0 auto;border:4px solid #2b3447;padding:24px;background:#1a2230;">${escapeHtml(body).replace(/\n/g, "<br>")}</div></div>`;
}

function clearTimer() {
  if (campaignTimer) {
    clearTimeout(campaignTimer);
    campaignTimer = null;
  }
}

function normalizePresetKey(value) {
  return ["gmail", "outlook", "office365", "hostinger"].includes(value) ? value : "gmail";
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeSecret(value, connectionMode) {
  const secret = normalizeText(value);
  if (!secret) return "";
  return connectionMode === "gmail_app_password" ? secret.replace(/\s+/g, "") : secret;
}

function normalizeEmail(value) {
  const email = normalizeText(value).toLowerCase();
  return isEmail(email) ? email : "";
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
}

function humanizeSeconds(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest ? `${minutes}m ${rest}s` : `${minutes}m`;
}

function formatClock(value) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function escapeHtml(value) {
  return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function now() {
  return new Date().toISOString();
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function summarizeSendError(message) {
  const text = normalizeText(message);
  if (!text) return "Error desconocido.";
  return text.replace(/\s+/g, " ");
}
