const state = {
  meta: null,
  config: null,
  campaign: null,
  poller: null,
  cameoTimer: null,
  currentCameoIndex: -1,
  currentCameo: null,
  spriteFrame: 0,
  spriteBlink: 0,
  spriteRaf: null,
  lastCampaignStatus: "idle",
  tourOpen: false,
  tourIndex: 0,
  focusedTourNode: null,
  tourGuideSeed: 0,
  lang: "es"
};

const SPRITE_WIDTH = 216;
const SPRITE_HEIGHT = 96;
const TOUR_AVATAR_SIZE = 88;
const I18N = {
  es: {
    "app.title": "MasivoMail | Correo por lotes",
    "shell.stageTitle": "Cambiar cameo pixel",
    "shell.roamers": "ROAMERS",
    "shell.auto": "AUTO",
    "shell.kicker": "PIXEL CAMEO EN VIVO",
    "hero.micro": "TERMINAL DE ENVIO POR LOTES",
    "hero.lead": "Pixel oscuro, dos pestanas y menos ruido para enviar por tandas.",
    "lang.groupLabel": "Idioma",
    "tabs.ariaLabel": "Paneles",
    "tab.main": "Principal",
    "tab.config": "Configuracion",
    "tab.guide": "Guia",
    "tab.guideAria": "Abrir guia",
    "send.micro": "ENVIO",
    "send.title": "Prepara y lanza la cola.",
    "send.copy": "Pega correos, ajusta el ritmo y manda.",
    "send.recipients": "Destinatarios",
    "send.recipientsPlaceholder": "Aqui van los correos a los que quieres escribir\nuno@correo.com\ndos@correo.com",
    "send.recipientCountDefault": "0 destinatarios validos",
    "send.paceDefault": "Sin cadencia definida",
    "send.subject": "Asunto",
    "send.subjectPlaceholder": "Aqui va el asunto que vera la otra persona",
    "send.batchSize": "Correos por tanda",
    "send.each": "Cada",
    "send.unit": "Unidad",
    "send.unitMinutes": "Minutos",
    "send.unitSeconds": "Segundos",
    "send.window": "Durante",
    "send.windowUnit": "Unidad",
    "send.windowHours": "Horas",
    "send.windowMinutes": "Minutos",
    "send.repeatWindow": "Reiniciar al terminar",
    "send.repeatWindowCopy": "Cuando se acabe la ventana, arranca otra igual.",
    "send.mode": "Modo de envio",
    "send.modeBurst": "De golpe",
    "send.modeStaggered": "Encolado",
    "send.rampTitle": "Rampa suave",
    "send.rampCopy": "Empieza con tandas mas cortas para no arrancar de golpe.",
    "send.body": "Cuerpo del correo",
    "send.bodyPlaceholder": "Aqui va el mensaje que quieres mandar.",
    "send.attachments": "Adjuntos",
    "send.attachButton": "Adjuntar PNG / PDF",
    "send.attachEmpty": "Sin adjuntos",
    "send.start": "Iniciar cola",
    "send.stop": "Detener cola",
    "send.stopping": "Deteniendo...",
    "status.micro": "CONEXION ACTIVA",
    "status.mode": "Modo",
    "status.provider": "Proveedor",
    "status.tls": "TLS",
    "status.sender": "Remitente",
    "status.idle": "SIN COLA",
    "guardrail.micro": "GUARDRAIL",
    "guardrail.default": "Carga la salida para ver el ritmo recomendado.",
    "progress.micro": "PROGRESO",
    "progress.total": "Total",
    "progress.pending": "Pendientes",
    "progress.sent": "Enviados",
    "progress.failed": "Fallos",
    "progress.idle": "Sin cola activa.",
    "progress.completedWithErrors": "Cola terminada con {count} fallo(s). Mira el log.",
    "log.micro": "LOG",
    "log.empty": "Sin eventos todavia.",
    "log.failureLine": "Fallo para {email}: {error}",
    "schedule.micro": "AGENDA",
    "schedule.empty": "Sin agenda todavia.",
    "schedule.last": "Ultimo correo",
    "schedule.next": "Siguiente tanda",
    "schedule.windowEnd": "Fin de ventana",
    "schedule.restart": "Reinicio",
    "config.micro": "CONFIG",
    "config.title": "Conecta la salida.",
    "config.copy": "Elige el modo y veras solo lo que ese modo necesita.",
    "config.modeGmail": "Gmail key",
    "config.modePreset": "SMTP guiado",
    "config.modeManual": "SMTP manual",
    "config.provider": "Proveedor",
    "config.fromName": "Nombre remitente",
    "config.fromNamePlaceholder": "Aqui va el nombre que quieres mostrar",
    "config.fromEmail": "Correo saliente",
    "config.fromEmailGmail": "Correo Gmail",
    "config.fromEmailPlaceholder": "Aqui va el correo desde el que quieres enviar",
    "config.fromEmailGmailPlaceholder": "Aqui va tu Gmail; se usa tambien como usuario",
    "config.user": "Usuario SMTP",
    "config.userPlaceholder": "Si tu servidor usa otro usuario, ponlo aqui",
    "config.secret": "Clave",
    "config.secretPlaceholder": "Pega aqui la clave; si Google la muestra con espacios, da igual",
    "config.secretMissing": "Nada guardado. Si recargas, se limpia.",
    "config.host": "Host SMTP",
    "config.hostPlaceholder": "Aqui va el servidor SMTP, por ejemplo smtp.tudominio.com",
    "config.port": "Puerto",
    "config.tls": "TLS",
    "config.none": "Ninguno",
    "config.save": "Guardar",
    "config.test": "Probar conexion",
    "profile.micro": "PERFIL",
    "profile.defaultTitle": "Gmail + clave app",
    "profile.defaultHint": "Este modo te muestra solo lo que hace falta.",
    "profile.docs": "Abrir documentacion oficial",
    "profile.notes": "NOTAS",
    "profile.current": "SALIDA ACTUAL",
    "profile.currentEmpty": "Aun no hay una configuracion confirmada.",
    "feedback.waiting": "Esperando acciones.",
    "feedback.ready": "Interfaz lista para trabajar.",
    "feedback.readMetaError": "No se pudo leer la configuracion base de la app.",
    "feedback.readConfigError": "No se pudo preparar la configuracion base.",
    "feedback.savingConfig": "Guardando configuracion...",
    "feedback.saveConfigError": "No se pudo guardar la configuracion.",
    "feedback.saveConfigOk": "Configuracion lista solo para esta pestana.",
    "feedback.testingConfig": "Probando conexion...",
    "feedback.testConfigError": "La prueba de conexion fallo.",
    "feedback.testConfigOk": "Conexion correcta. Ya puedes usar esta salida.",
    "feedback.startingCampaign": "Creando cola y verificando salida...",
    "feedback.startCampaignError": "No se pudo iniciar la cola.",
    "feedback.startCampaignOk": "Cola lanzada correctamente.",
    "feedback.stoppingCampaign": "Deteniendo cola...",
    "feedback.stopCampaignError": "No se pudo detener la cola.",
    "feedback.stopCampaignOk": "Cola detenida.",
    "config.secretStored": "La clave solo vive en esta pestana. Si recargas, se limpia.",
    "config.secretLabelGmail": "Clave app",
    "config.secretLabelDefault": "Clave",
    "config.manual": "Manual",
    "config.noUser": "sin usuario",
    "guardrail.copy": "Ritmo recomendado para {label}.",
    "guardrail.batchMax": "Lote maximo: {value}",
    "guardrail.minInterval": "Intervalo minimo: {value}",
    "guardrail.maxAverage": "Promedio maximo: {value}/min",
    "guardrail.dailyCap": "Tope por cola: {value}",
    "mode.gmail": "Clave Gmail",
    "mode.preset": "SMTP guiado",
    "mode.manual": "SMTP manual",
    "recipients.validOnly": "{valid} destinatarios validos",
    "recipients.withInvalid": "{valid} validos / {invalid} invalidos",
    "attachments.none": "Sin adjuntos",
    "pace.preview": "{batch} por tanda | cada {interval} | {batches} tandas en {window}",
    "pace.windowPlan": "{messages} correos/ventana | {recipients} destinatarios",
    "timing.currentBatch": "Tanda {number} en curso con {size} correos.",
    "timing.nextRun": "Siguiente tanda: {time}.",
    "timing.windowEnds": "Ventana {cycle} hasta {time}.",
    "timing.restartAt": "Reinicio: {time}.",
    "timing.status": "Estado actual: {status}.",
    "log.none": "Sin eventos todavia.",
    "tour.micro": "GUIA",
    "tour.closeAria": "Cerrar guia",
    "tour.defaultTitle": "Bienvenido",
    "tour.defaultBody": "La guia te muestra la app sin saturarte.",
    "tour.skip": "Cerrar",
    "tour.prev": "Atras",
    "tour.next": "Siguiente",
    "tour.done": "Listo",
    "tour.profileFallback": "tu proveedor",
    "tour.step1.title": "1. Lista y mensaje",
    "tour.step1.body": "Pega la lista, revisa validos y deja el cuerpo base del correo.",
    "tour.step1.point1": "La app quita duplicados y te avisa cuando una direccion no parece valida.",
    "tour.step1.point2": "Todo arranca aqui antes de pensar en velocidad.",
    "tour.step2.title": "2. De golpe o encolado",
    "tour.step2.body": "Aqui decides cada cuanto sale una tanda y si se lanza junta o mas repartida.",
    "tour.step2.point1": "De golpe: toda la tanda sale dentro del mismo turno.",
    "tour.step2.point2": "Encolado: la tanda se reparte una a una para verse menos brusca.",
    "tour.step3.title": "3. Rampa suave",
    "tour.step3.body": "La rampa hace que las primeras tandas salgan mas cortas.",
    "tour.step3.point1": "Sirve para cuentas pequenas o listas frias.",
    "tour.step3.point2": "Ayuda a no empezar con un pico brusco.",
    "tour.step4.title": "4. Guardrails",
    "tour.step4.body": "Ahora mismo el perfil activo es {profile}.",
    "tour.step4.point1": "La app limita lote, intervalo y promedio por minuto.",
    "tour.step4.point2": "Asi evitas combinaciones absurdas para una cuenta gratis.",
    "tour.step5.title": "5. Modos de conexion",
    "tour.step5.body": "Cada modo cambia la logica real de host, puerto y TLS.",
    "tour.step5.point1": "Clave Gmail fija Gmail y espera una app password.",
    "tour.step5.point2": "SMTP guiado bloquea los datos oficiales del proveedor.",
    "tour.step5.point3": "SMTP manual te deja mover host, puerto y TLS a mano.",
    "tour.step6.title": "6. Prueba antes de mandar",
    "tour.step6.body": "Prueba la conexion antes de guardar y antes de disparar una cola.",
    "tour.step6.point1": "Si falla aqui, corriges sin tocar el envio.",
    "tour.step6.point2": "Luego vuelves a Principal y lanzas la tanda con mas calma."
  },
  en: {
    "app.title": "MasivoMail | Batch mail",
    "shell.stageTitle": "Change pixel cameo",
    "shell.roamers": "ROAMERS",
    "shell.auto": "AUTO",
    "shell.kicker": "LIVE PIXEL CAMEO",
    "hero.micro": "BATCH DELIVERY TERMINAL",
    "hero.lead": "Dark pixel UI, two tabs, and less noise to send in rounds.",
    "lang.groupLabel": "Language",
    "tabs.ariaLabel": "Panels",
    "tab.main": "Main",
    "tab.config": "Setup",
    "tab.guide": "Guide",
    "tab.guideAria": "Open guide",
    "send.micro": "DELIVERY",
    "send.title": "Set the queue and launch it.",
    "send.copy": "Drop the emails, set the pace, and send.",
    "send.recipients": "Recipients",
    "send.recipientsPlaceholder": "Drop the emails you want to write to here\none@mail.com\ntwo@mail.com",
    "send.recipientCountDefault": "0 valid recipients",
    "send.paceDefault": "No cadence defined",
    "send.subject": "Subject",
    "send.subjectPlaceholder": "Put the subject the other person will see here",
    "send.batchSize": "Emails per batch",
    "send.each": "Every",
    "send.unit": "Unit",
    "send.unitMinutes": "Minutes",
    "send.unitSeconds": "Seconds",
    "send.window": "For",
    "send.windowUnit": "Unit",
    "send.windowHours": "Hours",
    "send.windowMinutes": "Minutes",
    "send.repeatWindow": "Restart after it ends",
    "send.repeatWindowCopy": "When the window ends, another one just like it starts.",
    "send.mode": "Delivery mode",
    "send.modeBurst": "Burst",
    "send.modeStaggered": "Queued",
    "send.rampTitle": "Soft ramp",
    "send.rampCopy": "Start with smaller rounds so it does not hit all at once.",
    "send.body": "Email body",
    "send.bodyPlaceholder": "Write the message you want to send here.",
    "send.attachments": "Attachments",
    "send.attachButton": "Attach PNG / PDF",
    "send.attachEmpty": "No attachments",
    "send.start": "Start queue",
    "send.stop": "Stop queue",
    "send.stopping": "Stopping...",
    "status.micro": "ACTIVE CONNECTION",
    "status.mode": "Mode",
    "status.provider": "Provider",
    "status.tls": "TLS",
    "status.sender": "Sender",
    "status.idle": "NO QUEUE",
    "guardrail.micro": "GUARDRAIL",
    "guardrail.default": "Load the output to see the recommended pace.",
    "progress.micro": "PROGRESS",
    "progress.total": "Total",
    "progress.pending": "Pending",
    "progress.sent": "Sent",
    "progress.failed": "Failed",
    "progress.idle": "No active queue.",
    "progress.completedWithErrors": "Queue finished with {count} failure(s). Check the log.",
    "log.micro": "LOG",
    "log.empty": "No events yet.",
    "log.failureLine": "Failed for {email}: {error}",
    "schedule.micro": "SCHEDULE",
    "schedule.empty": "No schedule yet.",
    "schedule.last": "Last email",
    "schedule.next": "Next batch",
    "schedule.windowEnd": "Window ends",
    "schedule.restart": "Restart",
    "config.micro": "CONFIG",
    "config.title": "Connect the output.",
    "config.copy": "Pick a mode and you will only see what that mode needs.",
    "config.modeGmail": "Gmail key",
    "config.modePreset": "Guided SMTP",
    "config.modeManual": "Manual SMTP",
    "config.provider": "Provider",
    "config.fromName": "Sender name",
    "config.fromNamePlaceholder": "Put the name you want people to see here",
    "config.fromEmail": "Outgoing email",
    "config.fromEmailGmail": "Gmail address",
    "config.fromEmailPlaceholder": "Put the email you want to send from here",
    "config.fromEmailGmailPlaceholder": "Put your Gmail here; it will also be used as the login",
    "config.user": "SMTP user",
    "config.userPlaceholder": "If your server uses a different user, put it here",
    "config.secret": "Secret",
    "config.secretPlaceholder": "Paste the key here; if Google shows spaces, that is fine",
    "config.secretMissing": "Nothing is saved. Refreshing clears it.",
    "config.host": "SMTP host",
    "config.hostPlaceholder": "Put the SMTP server here, for example smtp.yourdomain.com",
    "config.port": "Port",
    "config.tls": "TLS",
    "config.none": "None",
    "config.save": "Save",
    "config.test": "Test connection",
    "profile.micro": "PROFILE",
    "profile.defaultTitle": "Gmail + app key",
    "profile.defaultHint": "This mode only shows what you actually need.",
    "profile.docs": "Open official docs",
    "profile.notes": "NOTES",
    "profile.current": "CURRENT SETUP",
    "profile.currentEmpty": "There is no confirmed configuration yet.",
    "feedback.waiting": "Waiting for actions.",
    "feedback.ready": "Interface ready to work.",
    "feedback.readMetaError": "Could not read the app baseline configuration.",
    "feedback.readConfigError": "Could not prepare the base configuration.",
    "feedback.savingConfig": "Saving configuration...",
    "feedback.saveConfigError": "Could not save the configuration.",
    "feedback.saveConfigOk": "Configuration is ready only for this tab.",
    "feedback.testingConfig": "Testing connection...",
    "feedback.testConfigError": "Connection test failed.",
    "feedback.testConfigOk": "Connection is valid. You can use this setup now.",
    "feedback.startingCampaign": "Creating queue and checking output...",
    "feedback.startCampaignError": "Could not start the queue.",
    "feedback.startCampaignOk": "Queue started successfully.",
    "feedback.stoppingCampaign": "Stopping queue...",
    "feedback.stopCampaignError": "Could not stop the queue.",
    "feedback.stopCampaignOk": "Queue stopped.",
    "config.secretStored": "The secret only lives in this tab. Refreshing clears it.",
    "config.secretLabelGmail": "App key",
    "config.secretLabelDefault": "Secret",
    "config.manual": "Manual",
    "config.noUser": "no user",
    "guardrail.copy": "Recommended pace for {label}.",
    "guardrail.batchMax": "Max batch: {value}",
    "guardrail.minInterval": "Min interval: {value}",
    "guardrail.maxAverage": "Max average: {value}/min",
    "guardrail.dailyCap": "Queue cap: {value}",
    "mode.gmail": "Gmail key",
    "mode.preset": "Guided SMTP",
    "mode.manual": "Manual SMTP",
    "recipients.validOnly": "{valid} valid recipients",
    "recipients.withInvalid": "{valid} valid / {invalid} invalid",
    "attachments.none": "No attachments",
    "pace.preview": "{batch} per batch | every {interval} | {batches} batches in {window}",
    "pace.windowPlan": "{messages} emails/window | {recipients} recipients",
    "timing.currentBatch": "Batch {number} is running with {size} emails.",
    "timing.nextRun": "Next batch: {time}.",
    "timing.windowEnds": "Window {cycle} until {time}.",
    "timing.restartAt": "Restart: {time}.",
    "timing.status": "Current status: {status}.",
    "log.none": "No events yet.",
    "tour.micro": "GUIDE",
    "tour.closeAria": "Close guide",
    "tour.defaultTitle": "Welcome",
    "tour.defaultBody": "This guide walks the app without drowning you in detail.",
    "tour.skip": "Close",
    "tour.prev": "Back",
    "tour.next": "Next",
    "tour.done": "Done",
    "tour.profileFallback": "your provider",
    "tour.step1.title": "1. List and message",
    "tour.step1.body": "Paste the list, review valid emails, and leave the base email body ready.",
    "tour.step1.point1": "The app removes duplicates and flags addresses that do not look valid.",
    "tour.step1.point2": "Everything starts here before you think about speed.",
    "tour.step2.title": "2. Burst or queued",
    "tour.step2.body": "Here you decide how often a round goes out and whether it launches together or spread out.",
    "tour.step2.point1": "Burst: the whole round goes out in the same slot.",
    "tour.step2.point2": "Queued: the round is spread one by one to look less abrupt.",
    "tour.step3.title": "3. Soft ramp",
    "tour.step3.body": "Soft ramp makes the first rounds smaller.",
    "tour.step3.point1": "Useful for smaller accounts or colder lists.",
    "tour.step3.point2": "It helps you avoid a sharp opening spike.",
    "tour.step4.title": "4. Guardrails",
    "tour.step4.body": "Right now the active profile is {profile}.",
    "tour.step4.point1": "The app limits batch size, interval, and average per minute.",
    "tour.step4.point2": "That keeps you away from absurd combinations on a free account.",
    "tour.step5.title": "5. Connection modes",
    "tour.step5.body": "Each mode changes the real host, port, and TLS logic.",
    "tour.step5.point1": "Gmail key locks Gmail and expects an app password.",
    "tour.step5.point2": "Guided SMTP locks the official provider values.",
    "tour.step5.point3": "Manual SMTP lets you set host, port, and TLS by hand.",
    "tour.step6.title": "6. Test before sending",
    "tour.step6.body": "Test the connection before saving and before triggering a queue.",
    "tour.step6.point1": "If it fails here, you fix it without touching the delivery flow.",
    "tour.step6.point2": "Then go back to Main and launch the round calmly."
  }
};

const PROFILE_COPY = {
  gmail_app_password: {
    es: {
      label: "Gmail + clave app",
      hint: "Pon tu Gmail y la clave app.",
      notes: [
        "No repites usuario.",
        "La clave puede ir con espacios.",
        "Necesita verificacion en dos pasos."
      ]
    },
    en: {
      label: "Gmail + app key",
      hint: "Put your Gmail address and the app key.",
      notes: [
        "No separate user needed.",
        "The key can include spaces.",
        "2-Step Verification is required."
      ]
    }
  },
  gmail: {
    es: {
      label: "Gmail SMTP",
      hint: "Usa Gmail con el preset listo.",
      notes: [
        "Host y TLS ya vienen listos.",
        "Solo pones correo y clave."
      ]
    },
    en: {
      label: "Gmail SMTP",
      hint: "Use Gmail with the preset values.",
      notes: [
        "Host and TLS are already set.",
        "You only enter email and secret."
      ]
    }
  },
  outlook: {
    es: {
      label: "Outlook.com / Hotmail",
      hint: "Usa Outlook con el preset listo.",
      notes: [
        "Sale por 587 con STARTTLS.",
        "Algunas cuentas piden clave app."
      ]
    },
    en: {
      label: "Outlook.com / Hotmail",
      hint: "Use Outlook with the preset values.",
      notes: [
        "Runs on port 587 with STARTTLS.",
        "Some accounts may need an app password."
      ]
    }
  },
  office365: {
    es: {
      label: "Microsoft 365",
      hint: "Usa 365 con el preset oficial.",
      notes: [
        "SMTP AUTH debe estar activo.",
        "Sale por 587 con STARTTLS."
      ]
    },
    en: {
      label: "Microsoft 365",
      hint: "Use the official 365 preset.",
      notes: [
        "SMTP AUTH must be enabled.",
        "Runs on port 587 with STARTTLS."
      ]
    }
  },
  hostinger: {
    es: {
      label: "Hostinger",
      hint: "Usa Hostinger con el preset listo.",
      notes: [
        "Va por 465 con SSL.",
        "No hace falta tocar host ni TLS."
      ]
    },
    en: {
      label: "Hostinger",
      hint: "Use Hostinger with the preset values.",
      notes: [
        "Runs on 465 with SSL.",
        "No need to edit host or TLS."
      ]
    }
  },
  custom: {
    es: {
      label: "SMTP manual",
      hint: "Aqui si llenas host, puerto, TLS y usuario.",
      notes: [
        "Usalo si tu salida no esta en la lista.",
        "Aqui si puedes tocar todo."
      ]
    },
    en: {
      label: "Manual SMTP",
      hint: "Here you fill host, port, TLS, and user yourself.",
      notes: [
        "Use this when your output is not listed.",
        "This is the only mode where you change everything."
      ]
    }
  }
};

const CAMEOS = [
  {
    title: "Rocco Ladrillo",
    copy: "Salta en tandas cortas y no rompas el primer nivel del inbox.",
    copyEn: "Use shorter rounds and do not smash the first inbox level.",
    type: "brick_runner",
    theme: { skin: "#f4d4a8", hair: "#9d4f22", jacket: "#d05b3d", pants: "#2f4870", accent: "#ffd16b", accessory: "cap" }
  },
  {
    title: "Nara Pager",
    copy: "Prueba conexion primero. El drama se resuelve antes de la cola.",
    copyEn: "Test the connection first. The drama gets solved before the queue.",
    type: "pager_walk",
    theme: { skin: "#efcfaa", hair: "#7ac8ff", jacket: "#6fbe7d", pants: "#2a3543", accent: "#f08b4f", accessory: "pager" }
  },
  {
    title: "Turbo Azul",
    copy: "De golpe funciona mejor cuando ya mediste el carril y el lote.",
    copyEn: "Burst works best once you have measured the lane and the batch.",
    type: "blue_dash",
    theme: { skin: "#e5d1bb", hair: "#4d8cff", jacket: "#4d8cff", pants: "#1f2738", accent: "#f6efd5", accessory: "trail" }
  },
  {
    title: "Chispa Volt",
    copy: "Si el buzon se pone nervioso, baja el ritmo antes del siguiente salto.",
    copyEn: "If the mailbox gets nervous, slow down before the next jump.",
    type: "volt_critter",
    theme: { skin: "#f6efd5", hair: "#f0c04f", jacket: "#f0c04f", pants: "#29334a", accent: "#7ac8ff", accessory: "spark" }
  },
  {
    title: "Teo Modem",
    copy: "SMTP manual pide cabeza fria: host, puerto y TLS bien puestos.",
    copyEn: "Manual SMTP needs a cool head: host, port, and TLS set the right way.",
    type: "tech_runner",
    theme: { skin: "#efcba1", hair: "#d7d7d7", jacket: "#4f9675", pants: "#20293b", accent: "#7ac8ff", accessory: "visor" }
  },
  {
    title: "Vera Byte",
    copy: "La rampa suave evita que la salida arranque como martillo.",
    copyEn: "Soft ramp keeps the queue from opening like a hammer.",
    type: "guide_runner",
    theme: { skin: "#f1d3b0", hair: "#e46f5a", jacket: "#7f6be0", pants: "#223046", accent: "#f0c04f", accessory: "satchel" }
  },
  {
    title: "Kumo Nova",
    copy: "Escalonado deja una nube mas limpia cuando la salida va justa.",
    copyEn: "Queued delivery leaves a cleaner cloud when the queue is tight.",
    type: "cloud_fighter",
    theme: { skin: "#f2d7bd", hair: "#1f1f1f", jacket: "#f08b4f", pants: "#2a3145", accent: "#9fdb88", accessory: "cloud" }
  },
  {
    title: "Milo Diskette",
    copy: "Primero prueba la salida. Luego deja que la cola haga el resto.",
    copyEn: "Test the output first. Then let the queue do the rest.",
    type: "tech_runner",
    theme: { skin: "#efcfaa", hair: "#e7d36c", jacket: "#6e79ff", pants: "#243046", accent: "#f08b4f", accessory: "visor" }
  },
  {
    title: "Ari Meteora",
    copy: "Si calienta la cuenta, baja lote y abre mas aire entre tandas.",
    copyEn: "If the account heats up, shrink the batch and leave more air between rounds.",
    type: "guide_runner",
    theme: { skin: "#f3d2b4", hair: "#ff9167", jacket: "#f08b4f", pants: "#20293b", accent: "#9fdb88", accessory: "satchel" }
  }
];

const el = {
  langButtons: [...document.querySelectorAll(".lang-button[data-lang]")],
  tabs: [...document.querySelectorAll(".tab-button[data-target]")],
  panels: [...document.querySelectorAll(".panel")],
  modeChips: [...document.querySelectorAll(".mode-chip")],
  connectionMode: document.getElementById("connectionMode"),
  providerField: document.getElementById("provider-field"),
  providerKey: document.getElementById("providerKey"),
  host: document.getElementById("host"),
  port: document.getElementById("port"),
  tlsMode: document.getElementById("tlsMode"),
  networkRow: document.getElementById("network-row"),
  fromName: document.getElementById("fromName"),
  fromEmailLabel: document.getElementById("from-email-label"),
  fromEmail: document.getElementById("fromEmail"),
  authRow: document.getElementById("auth-row"),
  userField: document.getElementById("user-field"),
  user: document.getElementById("user"),
  secret: document.getElementById("secret"),
  secretHint: document.getElementById("secret-hint"),
  secretLabel: document.getElementById("secret-label"),
  configForm: document.getElementById("config-form"),
  testConfig: document.getElementById("test-config"),
  profileTitle: document.getElementById("profile-title"),
  profileHint: document.getElementById("profile-hint"),
  profileLines: document.getElementById("profile-lines"),
  profileNotes: document.getElementById("profile-notes"),
  profileDocs: document.getElementById("profile-docs"),
  currentConfigSummary: document.getElementById("current-config-summary"),
  sendForm: document.getElementById("send-form"),
  recipients: document.getElementById("recipients"),
  recipientCount: document.getElementById("recipient-count"),
  pacePreview: document.getElementById("pace-preview"),
  subject: document.getElementById("subject"),
  body: document.getElementById("body"),
  batchSize: document.getElementById("batchSize"),
  intervalValue: document.getElementById("intervalValue"),
  intervalUnit: document.getElementById("intervalUnit"),
  windowValue: document.getElementById("windowValue"),
  windowUnit: document.getElementById("windowUnit"),
  deliveryMode: document.getElementById("deliveryMode"),
  repeatWindow: document.getElementById("repeatWindow"),
  rampUp: document.getElementById("rampUp"),
  attachments: document.getElementById("attachments"),
  attachmentCount: document.getElementById("attachment-count"),
  pickFiles: document.getElementById("pick-files"),
  startCampaign: document.getElementById("start-campaign"),
  stopCampaign: document.getElementById("stop-campaign"),
  statusPill: document.getElementById("status-pill"),
  statusMode: document.getElementById("status-mode"),
  statusProvider: document.getElementById("status-provider"),
  statusTls: document.getElementById("status-tls"),
  statusSender: document.getElementById("status-sender"),
  guardrailCopy: document.getElementById("guardrail-copy"),
  guardrailList: document.getElementById("guardrail-list"),
  progressFill: document.getElementById("progress-fill"),
  summaryTotal: document.getElementById("summary-total"),
  summaryPending: document.getElementById("summary-pending"),
  summaryDelivered: document.getElementById("summary-delivered"),
  summaryFailed: document.getElementById("summary-failed"),
  campaignTiming: document.getElementById("campaign-timing"),
  scheduleBox: document.getElementById("schedule-box"),
  logBox: document.getElementById("log-box"),
  feedbackBox: document.getElementById("feedback-box"),
  easterStage: document.getElementById("easter-stage"),
  spriteCanvas: document.getElementById("sprite-canvas"),
  cameoTitle: document.getElementById("cameo-title"),
  cameoCopy: document.getElementById("cameo-copy"),
  openTour: document.getElementById("open-tour"),
  tourOverlay: document.getElementById("tour-overlay"),
  tourBeam: document.getElementById("tour-beam"),
  tourPanel: document.querySelector(".tour-panel"),
  tourArrow: document.getElementById("tour-arrow"),
  tourAvatar: document.getElementById("tour-avatar"),
  tourAvatarTag: document.getElementById("tour-avatar-tag"),
  tourTitle: document.getElementById("tour-title"),
  tourBody: document.getElementById("tour-body"),
  tourPoints: document.getElementById("tour-points"),
  tourProgress: document.getElementById("tour-progress"),
  tourPrev: document.getElementById("tour-prev"),
  tourNext: document.getElementById("tour-next"),
  tourSkip: document.getElementById("tour-skip"),
  tourClose: document.getElementById("tour-close")
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  bindUi();
  handleHashPanel();
  setLanguage("es", false);

  try {
    await loadMeta();
    resetUiForms();
    await loadConfig();
    await refreshCampaign(true);
    applyDemoPreset();
    renderRecipientCount();
    renderAttachmentCount();
    renderPacePreview();
    showRandomCameo();
    startSpriteLoop();
    startCameoLoop();
    maybeOpenTour();
    setFeedback(t("feedback.ready"), "success");
  } catch (error) {
    setFeedback(error.message || t("feedback.readMetaError"), "error");
  }
}

function bindUi() {
  el.langButtons.forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.lang)));
  el.tabs.forEach((button) => button.addEventListener("click", () => activatePanel(button.dataset.target)));
  el.modeChips.forEach((chip) => chip.addEventListener("click", () => setMode(chip.dataset.mode)));
  el.easterStage.addEventListener("click", showRandomCameo);
  el.openTour.addEventListener("click", () => openTour(0));
  el.providerKey.addEventListener("change", renderProfilePreview);
  el.fromEmail.addEventListener("input", syncAuthFields);
  el.attachments.addEventListener("change", renderAttachmentCount);
  el.pickFiles.addEventListener("click", () => el.attachments.click());
  el.recipients.addEventListener("input", renderRecipientCount);
  [el.batchSize, el.intervalValue, el.intervalUnit, el.windowValue, el.windowUnit, el.deliveryMode, el.repeatWindow, el.rampUp].forEach((node) => node.addEventListener("input", renderPacePreview));
  el.configForm.addEventListener("submit", saveConfig);
  el.testConfig.addEventListener("click", testConfig);
  el.sendForm.addEventListener("submit", startCampaign);
  el.stopCampaign.addEventListener("click", stopCampaign);
  el.tourPrev.addEventListener("click", previousTourStep);
  el.tourNext.addEventListener("click", nextTourStep);
  el.tourSkip.addEventListener("click", closeTour);
  el.tourClose.addEventListener("click", closeTour);
  window.addEventListener("hashchange", handleHashPanel);
  window.addEventListener("resize", handleViewportMove);
  window.addEventListener("scroll", handleViewportMove, { passive: true });
}

async function apiFetch(url, options = {}) {
  const nextOptions = {
    cache: "no-store",
    ...options
  };
  return fetch(url, nextOptions);
}

function t(key, vars = {}) {
  const pack = I18N[state.lang] || I18N.es;
  const fallback = I18N.es[key] || key;
  const template = pack[key] || fallback;

  return template.replace(/\{(\w+)\}/g, (_, token) => String(vars[token] ?? ""));
}

function applyStaticTranslations() {
  document.documentElement.lang = state.lang;
  document.title = t("app.title");

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  });

  document.querySelectorAll("[data-i18n-title]").forEach((node) => {
    node.setAttribute("title", t(node.dataset.i18nTitle));
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel));
  });
}

function getProfileLocaleKey(mode, providerKey) {
  if (mode === "gmail_app_password") {
    return "gmail_app_password";
  }
  if (mode === "smtp_custom") {
    return "custom";
  }
  return providerKey || "gmail";
}

function localizeProfile(profile, mode, providerKey) {
  const copy = PROFILE_COPY[getProfileLocaleKey(mode, providerKey)]?.[state.lang];
  return copy ? { ...profile, label: copy.label, hint: copy.hint, notes: copy.notes } : profile;
}

function renderProviderOptions() {
  if (!state.meta) {
    return;
  }

  const current = el.providerKey.value;
  el.providerKey.innerHTML = Object.entries(state.meta.smtpPresets)
    .map(([key, profile]) => {
      const localized = localizeProfile(profile, "smtp_preset", key);
      return `<option value="${profile.providerKey}">${localized.label}</option>`;
    })
    .join("");
  el.providerKey.value = current || "gmail";
}

function setLanguage(lang, persist = true) {
  state.lang = I18N[lang] ? lang : "es";

  el.langButtons.forEach((button) => button.classList.toggle("active", button.dataset.lang === state.lang));
  applyStaticTranslations();
  renderProviderOptions();
  renderCurrentCameo();

  if (state.config) {
    el.secretHint.textContent = state.config.hasSecret ? t("config.secretStored") : t("config.secretMissing");
    renderProfilePreview(state.config);
    renderConfigSummary(state.config);
    renderStatus(state.config);
  }

  if (state.campaign) {
    renderCampaign(state.campaign);
  }

  renderRecipientCount();
  renderAttachmentCount();
  renderPacePreview();

  if (state.tourOpen) {
    renderTourStep();
  }
}

function handleViewportMove() {
  if (state.tourOpen) {
    positionTourPanel();
  }
}

function panelIdFromHash() {
  const hash = String(window.location.hash || "").replace(/^#/, "").toLowerCase();
  if (hash === "config" || hash === "panel-config") {
    return "panel-config";
  }
  return "panel-send";
}

function syncHashWithPanel(panelId) {
  const nextHash = panelId === "panel-config" ? "#config" : "#main";
  if (window.location.hash !== nextHash) {
    history.replaceState(null, "", nextHash);
  }
}

function handleHashPanel() {
  const panelId = panelIdFromHash();
  el.panels.forEach((panel) => panel.classList.toggle("active", panel.id === panelId));
  el.tabs.forEach((button) => {
    const active = button.dataset.target === panelId;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
}

function blankConfig() {
  return {
    connectionMode: "gmail_app_password",
    providerKey: "gmail",
    host: state.meta?.gmailAppProfile?.host || "smtp.gmail.com",
    port: state.meta?.gmailAppProfile?.port || 465,
    tlsMode: state.meta?.gmailAppProfile?.tlsMode || "ssl",
    user: "",
    fromName: "",
    fromEmail: "",
    hasSecret: false
  };
}

function resetUiForms() {
  el.sendForm.reset();
  el.configForm.reset();
  el.attachments.value = "";
  el.connectionMode.value = "gmail_app_password";
  renderProviderOptions();
  fillConfigForm(blankConfig());
  state.config = blankConfig();
  renderConfigSummary(state.config);
  renderStatus(state.config);
  renderAttachmentCount();
  renderRecipientCount();
}

function applyDemoPreset() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("demo") !== "1") {
    return;
  }

  const demoConfig = {
    connectionMode: "gmail_app_password",
    providerKey: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    tlsMode: "ssl",
    user: "demo.pixel.mail@gmail.com",
    fromName: "Equipo Pixel Demo",
    fromEmail: "demo.pixel.mail@gmail.com",
    hasSecret: false
  };

  state.config = demoConfig;
  fillConfigForm(demoConfig);
  renderConfigSummary(demoConfig);
  renderStatus(demoConfig);

  el.recipients.value = "soporte@empresa-demo.com\nreclamos@empresa-demo.com";
  el.subject.value = "Seguimiento demo de servicio";
  el.batchSize.value = "10";
  el.intervalValue.value = "4";
  el.intervalUnit.value = "minutes";
  el.deliveryMode.value = "burst";
  el.windowValue.value = "2";
  el.windowUnit.value = "hours";
  el.repeatWindow.checked = false;
  el.rampUp.checked = true;
  el.body.value = "Hola,\n\nEste es un ejemplo visual de MasivoMail con datos de prueba.\n\nGracias.";
  renderRecipientCount();
  renderAttachmentCount();
  renderPacePreview();
}

async function loadMeta() {
  const response = await apiFetch("/api/meta");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(state.lang === "es" ? (data.message || t("feedback.readMetaError")) : t("feedback.readMetaError"));
  }

  state.meta = data;
  renderProviderOptions();
}

async function loadConfig() {
  const response = await apiFetch("/api/config");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(state.lang === "es" ? (data.message || t("feedback.readConfigError")) : t("feedback.readConfigError"));
  }

  state.config = data;
  fillConfigForm(data);
  renderConfigSummary(data);
  renderStatus(data);
}

async function refreshCampaign(resetView = false) {
  const response = await apiFetch("/api/campaign", {
    headers: resetView ? { "x-reset-view": "1" } : undefined
  });
  const data = await response.json();
  state.campaign = data;
  renderCampaign(data);
  syncPoller(data);
}

function activatePanel(panelId) {
  el.panels.forEach((panel) => panel.classList.toggle("active", panel.id === panelId));
  el.tabs.forEach((button) => {
    const active = button.dataset.target === panelId;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  syncHashWithPanel(panelId);
  showRandomCameo();
}

function setMode(mode) {
  el.connectionMode.value = mode;
  el.modeChips.forEach((chip) => chip.classList.toggle("active", chip.dataset.mode === mode));
  renderProfilePreview();
  showRandomCameo();
}

function fillConfigForm(config, options = {}) {
  setMode(config.connectionMode);
  el.providerKey.value = config.providerKey || "gmail";
  el.fromName.value = config.fromName || "";
  el.fromEmail.value = config.fromEmail || "";
  el.user.value = config.user || "";
  if (!options.preserveSecret) {
    el.secret.value = "";
  }
  el.secretHint.textContent = config.hasSecret ? t("config.secretStored") : t("config.secretMissing");
  renderProfilePreview(config);
}

function syncAuthFields() {
  if (el.connectionMode.value !== "smtp_custom") {
    el.user.value = el.fromEmail.value.trim();
  }
}

function getSelectedProfile(formConfig = null) {
  const mode = formConfig ? formConfig.connectionMode : el.connectionMode.value;
  const providerKey = formConfig ? formConfig.providerKey : el.providerKey.value;

  if (mode === "gmail_app_password") {
    return state.meta.gmailAppProfile;
  }

  if (mode === "smtp_preset") {
    return state.meta.smtpPresets[providerKey] || state.meta.smtpPresets.gmail;
  }

  return {
    ...state.meta.customProfile,
    host: formConfig ? formConfig.host : el.host.value.trim(),
    port: Number.parseInt(String(formConfig ? formConfig.port : el.port.value), 10) || state.meta.customProfile.port,
    tlsMode: formConfig ? formConfig.tlsMode : el.tlsMode.value
  };
}

function renderProfilePreview(configOverride = null) {
  const mode = configOverride ? configOverride.connectionMode : el.connectionMode.value;
  const providerKey = configOverride ? configOverride.providerKey : el.providerKey.value;
  const profile = localizeProfile(getSelectedProfile(configOverride), mode, providerKey);
  const manual = mode === "smtp_custom";
  const preset = mode === "smtp_preset";
  const gmailMode = mode === "gmail_app_password";

  el.providerField.style.display = preset ? "grid" : "none";
  el.networkRow.hidden = !manual;
  el.host.disabled = !manual;
  el.port.disabled = !manual;
  el.tlsMode.disabled = !manual;
  el.userField.hidden = !manual;
  el.authRow.classList.toggle("single-field", !manual);
  el.fromEmailLabel.textContent = gmailMode ? t("config.fromEmailGmail") : t("config.fromEmail");
  el.fromEmail.placeholder = gmailMode ? t("config.fromEmailGmailPlaceholder") : t("config.fromEmailPlaceholder");
  el.secretLabel.textContent = mode === "gmail_app_password" ? t("config.secretLabelGmail") : t("config.secretLabelDefault");
  el.profileTitle.textContent = profile.label;
  el.profileHint.textContent = profile.hint;
  el.host.value = profile.host || "";
  el.port.value = profile.port || "";
  el.tlsMode.value = profile.tlsMode || "starttls";
  syncAuthFields();
  el.profileLines.innerHTML = [
    `<div><strong>HOST</strong><span>${profile.host || t("config.manual")}</span></div>`,
    `<div><strong>${t("config.port").toUpperCase()}</strong><span>${profile.port || "-"}</span></div>`,
    `<div><strong>TLS</strong><span>${String(profile.tlsMode || "-").toUpperCase()}</span></div>`
  ].join("");
  el.profileNotes.innerHTML = profile.notes.map((note) => `<div>${note}</div>`).join("");

  if (profile.docsUrl) {
    el.profileDocs.href = profile.docsUrl;
    el.profileDocs.style.display = "inline-block";
  } else {
    el.profileDocs.style.display = "none";
  }

  renderGuardrails(profile);
  renderPacePreview();
}

function renderGuardrails(profile) {
  const rules = profile.guardrails;
  el.guardrailCopy.textContent = t("guardrail.copy", { label: profile.label });
  el.guardrailList.innerHTML = [
    `<div>${t("guardrail.batchMax", { value: rules.batchMax })}</div>`,
    `<div>${t("guardrail.minInterval", { value: humanizeSeconds(rules.minIntervalSeconds) })}</div>`,
    `<div>${t("guardrail.maxAverage", { value: rules.maxAveragePerMinute })}</div>`,
    `<div>${t("guardrail.dailyCap", { value: rules.dailyCap })}</div>`
  ].join("");
}

function renderStatus(config) {
  const profile = localizeProfile(getSelectedProfile(config), config.connectionMode, config.providerKey);
  el.statusMode.textContent = modeLabel(config.connectionMode);
  el.statusProvider.textContent = profile.label;
  el.statusTls.textContent = String(profile.tlsMode || "-").toUpperCase();
  el.statusSender.textContent = config.fromEmail || config.user || "-";
}

function renderConfigSummary(config) {
  const profile = localizeProfile(getSelectedProfile(config), config.connectionMode, config.providerKey);
  el.currentConfigSummary.textContent = `${profile.label} | ${config.fromEmail || config.user || t("config.noUser")} | ${profile.host}:${profile.port} | ${String(profile.tlsMode || "-").toUpperCase()}`;
}

function renderRecipientCount() {
  const split = splitRecipients(el.recipients.value);
  el.recipientCount.textContent = split.invalid.length
    ? t("recipients.withInvalid", { valid: split.valid.length, invalid: split.invalid.length })
    : t("recipients.validOnly", { valid: split.valid.length });
  renderPacePreview();
}

function renderAttachmentCount() {
  const files = [...(el.attachments.files || [])];
  el.attachmentCount.textContent = files.length ? files.map((file) => file.name).join(", ") : t("attachments.none");
}

function renderPacePreview() {
  const split = splitRecipients(el.recipients.value);
  const total = split.valid.length;
  const batchSize = Number.parseInt(el.batchSize.value, 10) || 0;
  const intervalValue = Number.parseInt(el.intervalValue.value, 10) || 0;
  const intervalUnit = el.intervalUnit.value === "seconds" ? "seconds" : "minutes";
  const seconds = intervalUnit === "seconds" ? intervalValue : intervalValue * 60;
  const windowValue = Number.parseInt(el.windowValue.value, 10) || 0;
  const windowUnit = el.windowUnit.value === "minutes" ? "minutes" : "hours";
  const windowSeconds = windowUnit === "minutes" ? windowValue * 60 : windowValue * 3600;
  const repeatWindow = el.repeatWindow.checked;

  if (!batchSize || !seconds || !windowSeconds) {
    el.pacePreview.textContent = t("send.paceDefault");
    return;
  }

  const batches = Math.max(1, Math.floor(Math.max(windowSeconds - 1, 0) / Math.max(seconds, 1)) + 1);
  let messages = 0;
  for (let index = 1; index <= batches; index += 1) {
    if (el.rampUp.checked && index === 1) {
      messages += Math.max(1, Math.ceil(batchSize * 0.5));
    } else if (el.rampUp.checked && index === 2) {
      messages += Math.max(1, Math.ceil(batchSize * 0.75));
    } else {
      messages += batchSize;
    }
  }

  const intervalLabel = intervalUnit === "seconds"
    ? `${intervalValue} s`
    : `${intervalValue} min`;
  const windowLabel = windowUnit === "minutes" ? `${windowValue}m` : `${windowValue}h`;
  const repeatLabel = repeatWindow ? (state.lang === "en" ? " | repeats" : " | reinicia") : "";
  el.pacePreview.textContent = `${t("pace.preview", { batch: batchSize, interval: intervalLabel, batches, window: windowLabel })} | ${t("pace.windowPlan", { messages, recipients: total })}${repeatLabel}`;
}

async function saveConfig(event) {
  event.preventDefault();
  const payload = collectConfigPayload();
  setFeedback(t("feedback.savingConfig"), null);

  const response = await apiFetch("/api/config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json();

  if (!response.ok) {
    setFeedback(state.lang === "es" ? (data.message || t("feedback.saveConfigError")) : t("feedback.saveConfigError"), "error");
    return;
  }

  state.config = data.config;
  fillConfigForm(data.config, { preserveSecret: true });
  renderConfigSummary(data.config);
  renderStatus(data.config);
  showRandomCameo();
  setFeedback(t("feedback.saveConfigOk"), "success");
}

async function testConfig() {
  const payload = collectConfigPayload();
  setFeedback(t("feedback.testingConfig"), null);

  const response = await apiFetch("/api/config/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json();

  if (!response.ok) {
    setFeedback(state.lang === "es" ? (data.message || t("feedback.testConfigError")) : t("feedback.testConfigError"), "error");
    return;
  }

  showRandomCameo();
  setFeedback(state.lang === "es" ? data.message : t("feedback.testConfigOk"), "success");
}

async function startCampaign(event) {
  event.preventDefault();
  const formData = new FormData(el.sendForm);
  const configPayload = collectConfigPayload();
  Object.entries(configPayload).forEach(([key, value]) => {
    formData.set(key, value ?? "");
  });

  el.startCampaign.disabled = true;
  setFeedback(t("feedback.startingCampaign"), null);

  try {
    const response = await apiFetch("/api/campaign", { method: "POST", body: formData });
    const data = await response.json();

    if (!response.ok) {
      setFeedback(state.lang === "es" ? (data.message || t("feedback.startCampaignError")) : t("feedback.startCampaignError"), "error");
      return;
    }

    showRandomCameo();
    setFeedback(state.lang === "es" ? data.message : t("feedback.startCampaignOk"), "success");
    await refreshCampaign();
  } catch (error) {
    setFeedback(error.message || t("feedback.startCampaignError"), "error");
  } finally {
    el.startCampaign.disabled = false;
  }
}

async function stopCampaign() {
  if (!state.campaign || !state.campaign.id) {
    return;
  }

  if (!["queued", "running", "waiting", "stopping"].includes(state.campaign.status)) {
    setFeedback(state.lang === "es" ? "La cola ya termino o ya estaba detenida." : "The queue already finished or was already stopped.", "error");
    await refreshCampaign();
    return;
  }

  el.stopCampaign.disabled = true;
  setFeedback(t("feedback.stoppingCampaign"), null);

  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);
    const response = await apiFetch(`/api/campaign/${state.campaign.id}/stop`, { method: "POST", signal: controller.signal });
    window.clearTimeout(timer);
    const data = await response.json();

    if (!response.ok) {
      setFeedback(state.lang === "es" ? (data.message || t("feedback.stopCampaignError")) : t("feedback.stopCampaignError"), "error");
      return;
    }

    showRandomCameo();
    setFeedback(state.lang === "es" ? data.message : t("feedback.stopCampaignOk"), "success");
    await refreshCampaign();
  } catch (error) {
    const message = error.name === "AbortError"
      ? (state.lang === "es" ? "Tardo demasiado en detenerse. Refresca el estado y vuelve a probar." : "Stopping took too long. Refresh the status and try again.")
      : (error.message || t("feedback.stopCampaignError"));
    setFeedback(message, "error");
    await refreshCampaign();
  } finally {
    el.stopCampaign.disabled = !state.campaign || !["queued", "running", "waiting", "stopping"].includes(state.campaign.status);
  }
}

function renderCampaign(data) {
  const summary = data.summary || { total: 0, pending: 0, delivered: 0, failed: 0 };
  const total = summary.total || 0;
  const done = (summary.delivered || 0) + (summary.failed || 0);
  const percent = summary.windowProgressPercent || (total ? Math.max(0, Math.min(100, Math.round((done / total) * 100))) : 0);
  const logLines = (data.logs || []).map((item) => `[${new Date(item.at).toLocaleTimeString()}] ${item.message}`);
  const failureLines = (data.recentFailed || [])
    .map((item) => t("log.failureLine", { email: item.email, error: item.error || "-" }))
    .filter((line) => !logLines.some((entry) => entry.includes(line)));

  el.progressFill.style.width = `${percent}%`;
  el.summaryTotal.textContent = String(summary.total || 0);
  el.summaryPending.textContent = String(summary.pending || 0);
  el.summaryDelivered.textContent = String(summary.delivered || 0);
  el.summaryFailed.textContent = String(summary.failed || 0);
  el.statusPill.textContent = statusLabel(data.status);
  el.statusPill.dataset.state = data.status || "idle";
  el.stopCampaign.disabled = !["queued", "running", "waiting", "stopping"].includes(data.status);
  el.stopCampaign.textContent = data.status === "stopping" ? t("send.stopping") : t("send.stop");
  el.campaignTiming.textContent = buildTiming(data);
  renderSchedule(data);
  el.logBox.textContent = (logLines.length || failureLines.length)
    ? [...logLines, ...failureLines].join("\n")
    : t("log.none");

  if (data.activeOutput) {
    renderStatus(data.activeOutput);
    renderGuardrails(localizeProfile(getSelectedProfile(data.activeOutput), data.activeOutput.connectionMode, data.activeOutput.providerKey));
  }

  if (state.lastCampaignStatus !== data.status) {
    state.lastCampaignStatus = data.status;
    showRandomCameo();
  }
}

function buildTiming(data) {
  if (!data.status || data.status === "idle") {
    return t("progress.idle");
  }
  if (data.status === "completed" && data.summary && data.summary.failed) {
    return t("progress.completedWithErrors", { count: data.summary.failed });
  }
  if (data.currentBatch) {
    return t("timing.currentBatch", { number: data.currentBatch.number, size: data.currentBatch.size });
  }
  if (data.nextRunAt) {
    const nextRun = t("timing.nextRun", { time: formatClock(data.nextRunAt) });
    if (data.cycle?.endsAt && data.cycle?.repeatWindow) {
      return `${nextRun} ${t("timing.restartAt", { time: formatClock(data.cycle.endsAt) })}`;
    }
    if (data.cycle?.endsAt) {
      return `${nextRun} ${t("timing.windowEnds", { cycle: data.cycle.number, time: formatClock(data.cycle.endsAt) })}`;
    }
    return nextRun;
  }
  if (data.cycle?.endsAt) {
    return t("timing.windowEnds", { cycle: data.cycle.number, time: formatClock(data.cycle.endsAt) });
  }
  return t("timing.status", { status: statusLabel(data.status) });
}

function renderSchedule(data) {
  const items = data.schedulePreview || [];

  if (!items.length) {
    el.scheduleBox.textContent = t("schedule.empty");
    return;
  }

  el.scheduleBox.innerHTML = items.map((item) => `
    <div class="schedule-item">
      <span>${localizeScheduleLabel(item.label)}</span>
      <strong>${formatClock(item.at)}</strong>
    </div>
  `).join("");
}

function syncPoller(data) {
  const active = ["queued", "running", "waiting", "stopping"].includes(data.status);

  if (active && !state.poller) {
    state.poller = setInterval(refreshCampaign, 2500);
  }

  if (!active && state.poller) {
    clearInterval(state.poller);
    state.poller = null;
  }
}

function collectConfigPayload() {
  const mirroredUser = el.connectionMode.value === "smtp_custom"
    ? (el.user.value || el.fromEmail.value)
    : el.fromEmail.value;
  const secret = el.connectionMode.value === "gmail_app_password"
    ? el.secret.value.replace(/\s+/g, "").trim()
    : el.secret.value.trim();

  return {
    connectionMode: el.connectionMode.value,
    providerKey: el.providerKey.value,
    fromName: el.fromName.value,
    fromEmail: el.fromEmail.value,
    user: mirroredUser,
    secret,
    host: el.host.value,
    port: el.port.value,
    tlsMode: el.tlsMode.value
  };
}

function setFeedback(message, type) {
  el.feedbackBox.textContent = message;
  el.feedbackBox.classList.remove("success", "error");
  if (type) {
    el.feedbackBox.classList.add(type);
  }
}

function getCameoCopy(cameo) {
  if (!cameo) {
    return "";
  }
  return state.lang === "en" && cameo.copyEn ? cameo.copyEn : cameo.copy;
}

function renderCurrentCameo() {
  if (!state.currentCameo) {
    return;
  }
  const copy = getCameoCopy(state.currentCameo);
  el.cameoTitle.textContent = state.currentCameo.title;
  el.cameoCopy.textContent = copy;
  el.easterStage.setAttribute("aria-label", `${state.currentCameo.title}. ${copy}`);
}

function showRandomCameo() {
  if (!CAMEOS.length) {
    return;
  }

  let nextIndex = Math.floor(Math.random() * CAMEOS.length);
  if (CAMEOS.length > 1 && nextIndex === state.currentCameoIndex) {
    nextIndex = (nextIndex + 1) % CAMEOS.length;
  }

  state.currentCameoIndex = nextIndex;
  state.currentCameo = CAMEOS[nextIndex];
  renderCurrentCameo();
  el.easterStage.classList.remove("pulse");
  void el.easterStage.offsetWidth;
  el.easterStage.classList.add("pulse");
}

function startCameoLoop() {
  if (state.cameoTimer) {
    clearInterval(state.cameoTimer);
  }
  state.cameoTimer = setInterval(showRandomCameo, 6500);
}

function startSpriteLoop() {
  const context = el.spriteCanvas.getContext("2d");
  const tourContext = el.tourAvatar.getContext("2d");
  context.imageSmoothingEnabled = false;
  tourContext.imageSmoothingEnabled = false;
  let lastSwap = performance.now();

  const tick = (time) => {
    if (time - lastSwap > 220) {
      state.spriteFrame = state.spriteFrame === 0 ? 1 : 0;
      lastSwap = time;
      if (state.spriteBlink > 0) {
        state.spriteBlink -= 1;
      } else if (Math.random() < 0.14) {
        state.spriteBlink = 2;
      }
    }

    drawScene(context, time);
    drawTourAvatar(tourContext, time);
    state.spriteRaf = requestAnimationFrame(tick);
  };

  state.spriteRaf = requestAnimationFrame(tick);
}

function drawScene(ctx, time) {
  const cameo = state.currentCameo || CAMEOS[0];
  const theme = cameo.theme;
  const bob = state.spriteFrame === 0 ? 0 : -1;
  const blink = state.spriteBlink > 0;
  const t = time / 1000;

  ctx.clearRect(0, 0, SPRITE_WIDTH, SPRITE_HEIGHT);
  drawSky(ctx, t, theme.accent);
  drawBackdrop(ctx, t, theme.accent);
  drawAmbientVisitors(ctx, time);
  drawGround(ctx, time);

  if (cameo.type === "brick_runner") {
    drawWalker(ctx, 18 + ((time / 32) % 152), 49 + bob, theme, blink);
    drawBrickTrail(ctx, time);
  } else if (cameo.type === "blue_dash") {
    drawSpeedLines(ctx, time);
    drawWalker(ctx, 30 + ((time / 18) % 128), 48 + bob, theme, blink, true);
  } else if (cameo.type === "volt_critter") {
    drawCritter(ctx, 102, 50 + Math.round(Math.sin(time / 180) * 4), theme, blink);
    drawSparks(ctx, time);
  } else if (cameo.type === "cloud_fighter") {
    drawCloud(ctx, 76 + Math.sin(time / 400) * 22, 38);
    drawWalker(ctx, 92 + Math.sin(time / 400) * 22, 31 + bob, theme, blink);
    drawAura(ctx, 100 + Math.sin(time / 400) * 22, 42, theme.accent);
  } else {
    drawWalker(ctx, 26 + ((time / 28) % 140), 49 + bob, theme, blink);
    drawUtilityProp(ctx, cameo.type, time, theme);
  }

  drawForegroundGlow(ctx, time, theme.accent);
}

function drawSky(ctx, t, accent) {
  ctx.fillStyle = "#17202e";
  ctx.fillRect(0, 0, SPRITE_WIDTH, SPRITE_HEIGHT);
  ctx.fillStyle = "#1f2c40";
  ctx.fillRect(0, 0, SPRITE_WIDTH, 44);
  ctx.fillStyle = accent;
  ctx.fillRect(176, 10, 10, 10);
  ctx.fillStyle = "#7ac8ff";
  ctx.fillRect(18, 12, 2, 2);
  ctx.fillRect(34, 26, 2, 2);
  ctx.fillRect(116, 18, 2, 2);
  ctx.fillRect(142, 30, 2, 2);
  ctx.fillRect(196, 22, 2, 2);
  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.fillRect(0, 40, SPRITE_WIDTH, 2);
  ctx.fillStyle = "#273248";
  ctx.fillRect(0, 42, SPRITE_WIDTH, 10);
  ctx.fillStyle = "#1a2434";
  ctx.fillRect((t * 10) % (SPRITE_WIDTH + 48) - 48, 16, 34, 6);
  ctx.fillRect((t * 8) % (SPRITE_WIDTH + 36) + 14, 24, 26, 4);
  ctx.fillRect((t * 6) % (SPRITE_WIDTH + 64) + 88, 18, 18, 4);
}

function drawBackdrop(ctx, t, accent) {
  ctx.fillStyle = "#243247";
  ctx.fillRect(0, 52, SPRITE_WIDTH, 14);
  ctx.fillStyle = "#1b2535";
  for (let i = 0; i < 9; i += 1) {
    const x = (i * 30) - ((t * 18) % 30);
    ctx.fillRect(x, 40 + (i % 2 === 0 ? 10 : 14), 18, 24);
    ctx.fillRect(x + 4, 46 + (i % 3), 3, 3);
    ctx.fillRect(x + 10, 52 + (i % 2), 3, 3);
  }

  ctx.fillStyle = "#2f3d55";
  for (let i = 0; i < 7; i += 1) {
    const x = (i * 38) - ((t * 12) % 38);
    ctx.fillRect(x, 58, 26, 10);
  }

  ctx.fillStyle = accent;
  ctx.fillRect(150 - ((t * 16) % 70), 56, 14, 2);
  ctx.fillRect(28 + ((t * 9) % 88), 60, 10, 2);
}

function drawGround(ctx, time) {
  ctx.fillStyle = "#1a2230";
  ctx.fillRect(0, 78, SPRITE_WIDTH, 18);
  ctx.fillStyle = "#2f3d55";
  for (let i = 0; i < 15; i += 1) {
    const x = (i * 18) - ((time / 18) % 18);
    ctx.fillRect(x, 84, 10, 2);
  }
  ctx.fillStyle = "#0f141d";
  ctx.fillRect(0, 90, SPRITE_WIDTH, 6);
}

function drawBrickTrail(ctx, time) {
  ctx.fillStyle = "#9d4f22";
  for (let i = 0; i < 5; i += 1) {
    const x = 12 + i * 26 - ((time / 20) % 12);
    ctx.fillRect(x, 60 - (i % 2 === 0 ? 4 : 0), 10, 8);
  }
}

function drawSpeedLines(ctx, time) {
  ctx.fillStyle = "#7ac8ff";
  for (let i = 0; i < 7; i += 1) {
    const x = 10 + i * 22 - ((time / 10) % 22);
    ctx.fillRect(x, 44 + i * 4, 12, 2);
  }
}

function drawSparks(ctx, time) {
  ctx.fillStyle = "#f0c04f";
  const base = Math.round((time / 80) % 10);
  ctx.fillRect(52 + base, 34, 4, 4);
  ctx.fillRect(98 - base, 30, 4, 4);
  ctx.fillRect(44 + base, 56, 4, 4);
}

function drawCloud(ctx, x, y) {
  ctx.fillStyle = "#f6efd5";
  ctx.fillRect(x, y, 28, 8);
  ctx.fillRect(x + 4, y - 4, 10, 8);
  ctx.fillRect(x + 14, y - 6, 10, 10);
}

function drawAura(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x - 12, y - 2, 4, 4);
  ctx.fillRect(x + 14, y + 6, 4, 4);
  ctx.fillRect(x - 4, y - 10, 4, 4);
}

function drawUtilityProp(ctx, type, time, theme) {
  if (type === "pager_walk") {
    ctx.fillStyle = theme.accent;
    ctx.fillRect(158, 52, 12, 12);
    ctx.fillStyle = "#9fdb88";
    ctx.fillRect(161, 56, 6, 2);
  }

  if (type === "tech_runner") {
    ctx.fillStyle = theme.accent;
    ctx.fillRect(160, 46 + Math.sin(time / 220) * 3, 18, 12);
    ctx.fillStyle = "#11161f";
    ctx.fillRect(164, 50 + Math.sin(time / 220) * 3, 10, 2);
  }

  if (type === "guide_runner") {
    ctx.fillStyle = theme.accent;
    ctx.fillRect(18, 32 + Math.sin(time / 200) * 2, 10, 14);
    ctx.fillStyle = "#7ac8ff";
    ctx.fillRect(22, 36 + Math.sin(time / 200) * 2, 2, 8);
  }
}

function drawCritter(ctx, x, y, theme, blink) {
  ctx.fillStyle = theme.jacket;
  ctx.fillRect(x, y, 18, 14);
  ctx.fillRect(x - 4, y + 4, 6, 6);
  ctx.fillRect(x + 16, y + 4, 6, 6);
  ctx.fillRect(x + 4, y - 4, 10, 6);
  ctx.fillStyle = theme.accent;
  ctx.fillRect(x + 2, y - 8, 4, 6);
  ctx.fillRect(x + 12, y - 8, 4, 6);
  ctx.fillStyle = "#11161f";
  if (!blink) {
    ctx.fillRect(x + 4, y + 4, 3, 3);
    ctx.fillRect(x + 11, y + 4, 3, 3);
  } else {
    ctx.fillRect(x + 4, y + 5, 3, 1);
    ctx.fillRect(x + 11, y + 5, 3, 1);
  }
}

function drawWalker(ctx, x, y, theme, blink, lean = false) {
  const pxX = Math.round(x);
  const pxY = Math.round(y);

  ctx.fillStyle = theme.pants;
  ctx.fillRect(pxX + 10, pxY + 24, 6, 14);
  ctx.fillRect(pxX + 18, pxY + 24, 6, 14);
  ctx.fillRect(pxX + 8, pxY + 38, 10, 4);
  ctx.fillRect(pxX + 18, pxY + 38, 10, 4);

  ctx.fillStyle = theme.jacket;
  ctx.fillRect(pxX + 6, pxY + 8, 22, 18);
  ctx.fillRect(pxX + (lean ? 2 : 0), pxY + 14, 8, 6);
  ctx.fillRect(pxX + 24, pxY + 14, 8, 6);
  ctx.fillStyle = theme.accent;
  ctx.fillRect(pxX + 13, pxY + 12, 8, 8);

  ctx.fillStyle = theme.skin;
  ctx.fillRect(pxX + 10, pxY - 8, 16, 16);
  ctx.fillRect(pxX + 6, pxY - 4, 4, 10);
  ctx.fillRect(pxX + 26, pxY - 4, 4, 10);

  ctx.fillStyle = theme.hair;
  ctx.fillRect(pxX + 8, pxY - 10, 20, 6);
  ctx.fillRect(pxX + 8, pxY - 8, 4, 12);
  ctx.fillRect(pxX + 24, pxY - 8, 4, 12);

  if (theme.accessory === "cap") {
    ctx.fillStyle = theme.accent;
    ctx.fillRect(pxX + 8, pxY - 12, 20, 4);
    ctx.fillRect(pxX + 4, pxY - 8, 10, 4);
  }

  if (theme.accessory === "visor") {
    ctx.fillStyle = theme.accent;
    ctx.fillRect(pxX + 12, pxY - 2, 12, 4);
  }

  if (theme.accessory === "satchel") {
    ctx.fillStyle = theme.accent;
    ctx.fillRect(pxX + 23, pxY + 15, 8, 10);
    ctx.fillRect(pxX + 18, pxY + 6, 3, 12);
  }

  if (theme.accessory === "pager") {
    ctx.fillStyle = "#2b3447";
    ctx.fillRect(pxX + 20, pxY + 16, 6, 6);
    ctx.fillStyle = "#9fdb88";
    ctx.fillRect(pxX + 21, pxY + 18, 4, 1);
  }

  ctx.fillStyle = "#11161f";
  if (!blink) {
    ctx.fillRect(pxX + 14, pxY - 2, 2, 2);
    ctx.fillRect(pxX + 20, pxY - 2, 2, 2);
  } else {
    ctx.fillRect(pxX + 14, pxY - 1, 2, 1);
    ctx.fillRect(pxX + 20, pxY - 1, 2, 1);
  }
  ctx.fillRect(pxX + 16, pxY + 3, 4, 1);
}

function drawAmbientVisitors(ctx, time) {
  const cycle = Math.floor(time / 2400) % 5;
  const walkerX = SPRITE_WIDTH - ((time / 18) % (SPRITE_WIDTH + 30)) - 18;
  const critterX = ((time / 16) % (SPRITE_WIDTH + 24)) - 24;
  const cloudX = 18 + ((time / 28) % (SPRITE_WIDTH - 52));
  const orbX = 12 + ((time / 20) % (SPRITE_WIDTH - 24));

  if (cycle === 0) {
    drawMiniRunner(ctx, walkerX, 64, "#d05b3d", "#2f4870", "#ffd16b");
  }

  if (cycle === 1) {
    drawMiniCritter(ctx, critterX, 64, "#f0c04f", "#7ac8ff");
  }

  if (cycle === 2) {
    drawMiniCloudRider(ctx, cloudX, 30);
  }

  if (cycle === 3) {
    drawMiniOrb(ctx, orbX, 26 + Math.round(Math.sin(time / 180) * 3), "#7ac8ff");
    drawMiniRunner(ctx, 24 + ((time / 14) % 44), 64, "#4d8cff", "#20293b", "#f6efd5");
  }

  if (cycle === 4) {
    drawMiniOrb(ctx, SPRITE_WIDTH - orbX, 24 + Math.round(Math.cos(time / 170) * 2), "#9fdb88");
    drawMiniCritter(ctx, SPRITE_WIDTH - walkerX - 10, 64, "#f08b4f", "#9fdb88");
  }
}

function drawMiniRunner(ctx, x, y, jacket, pants, accent) {
  const pxX = Math.round(x);
  const pxY = Math.round(y);
  px(ctx, pxX + 3, pxY - 6, 8, 6, "#f1d3b0");
  px(ctx, pxX + 2, pxY - 8, 10, 3, accent);
  px(ctx, pxX + 1, pxY, 12, 8, jacket);
  px(ctx, pxX + 3, pxY + 8, 4, 6, pants);
  px(ctx, pxX + 8, pxY + 8, 4, 6, pants);
  px(ctx, pxX + 1, pxY + 14, 6, 2, "#0f141d");
  px(ctx, pxX + 7, pxY + 14, 6, 2, "#0f141d");
}

function drawMiniCritter(ctx, x, y, body, accent) {
  const pxX = Math.round(x);
  const pxY = Math.round(y);
  px(ctx, pxX + 2, pxY, 12, 9, body);
  px(ctx, pxX, pxY + 3, 4, 4, body);
  px(ctx, pxX + 12, pxY + 3, 4, 4, body);
  px(ctx, pxX + 4, pxY - 4, 3, 4, accent);
  px(ctx, pxX + 9, pxY - 4, 3, 4, accent);
  px(ctx, pxX + 4, pxY + 3, 2, 2, "#11161f");
  px(ctx, pxX + 10, pxY + 3, 2, 2, "#11161f");
}

function drawMiniCloudRider(ctx, x, y) {
  const pxX = Math.round(x);
  const pxY = Math.round(y);
  px(ctx, pxX, pxY + 6, 22, 6, "#f6efd5");
  px(ctx, pxX + 4, pxY + 2, 8, 6, "#f6efd5");
  px(ctx, pxX + 12, pxY, 8, 8, "#f6efd5");
  px(ctx, pxX + 7, pxY - 8, 8, 8, "#f08b4f");
  px(ctx, pxX + 8, pxY - 12, 6, 4, "#1f1f1f");
}

function drawMiniOrb(ctx, x, y, color) {
  const pxX = Math.round(x);
  const pxY = Math.round(y);
  px(ctx, pxX, pxY, 8, 8, color);
  px(ctx, pxX + 2, pxY + 2, 4, 4, "#f6efd5");
}

function drawForegroundGlow(ctx, time, accent) {
  ctx.fillStyle = "rgba(0,0,0,0.14)";
  ctx.fillRect(0, 0, SPRITE_WIDTH, SPRITE_HEIGHT);
  ctx.fillStyle = accent;
  ctx.fillRect(((time / 14) % (SPRITE_WIDTH + 20)) - 20, 72, 12, 2);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(((time / 14) % (SPRITE_WIDTH + 20)) - 16, 72, 4, 2);
}

function getActiveTourGuide() {
  return CAMEOS[(state.tourGuideSeed + state.tourIndex) % CAMEOS.length] || state.currentCameo || CAMEOS[0];
}

function drawTourAvatar(ctx, time) {
  const guide = getActiveTourGuide();
  const blink = state.spriteBlink > 0;
  const bob = state.spriteFrame === 0 ? 0 : -1;
  const theme = guide.theme;

  ctx.clearRect(0, 0, TOUR_AVATAR_SIZE, TOUR_AVATAR_SIZE);
  px(ctx, 0, 0, TOUR_AVATAR_SIZE, TOUR_AVATAR_SIZE, "#101722");

  for (let index = 0; index < 5; index += 1) {
    px(ctx, 8 + (index * 14), 12 + ((index % 2) * 4), 2, 2, "#2f3d55");
    px(ctx, 10 + (index * 12), 30 + ((index % 2) * 5), 2, 2, "#243247");
  }

  px(ctx, 10, 58, 68, 12, "#1a2230");
  px(ctx, 14, 62, 60, 6, "#2f3d55");
  px(ctx, 24, 44, 40, 18, theme.jacket);
  px(ctx, 30, 30 + bob, 28, 20, theme.skin);
  px(ctx, 28, 24 + bob, 32, 8, theme.hair);
  px(ctx, 28, 28 + bob, 4, 14, theme.hair);
  px(ctx, 56, 28 + bob, 4, 14, theme.hair);

  if (theme.accessory === "visor") {
    px(ctx, 36, 36 + bob, 18, 4, theme.accent);
  }

  if (theme.accessory === "cap") {
    px(ctx, 28, 22 + bob, 32, 4, theme.accent);
    px(ctx, 24, 26 + bob, 12, 4, theme.accent);
  }

  if (theme.accessory === "satchel") {
    px(ctx, 52, 48, 8, 12, theme.accent);
    px(ctx, 46, 42, 3, 10, theme.accent);
  }

  if (!blink) {
    px(ctx, 38, 38 + bob, 3, 3, "#11161f");
    px(ctx, 48, 38 + bob, 3, 3, "#11161f");
  } else {
    px(ctx, 38, 39 + bob, 3, 1, "#11161f");
    px(ctx, 48, 39 + bob, 3, 1, "#11161f");
  }

  px(ctx, 42, 46 + bob, 6, 2, "#11161f");
  px(ctx, 8 + ((time / 90) % 58), 16, 10, 2, theme.accent);
  px(ctx, 8 + ((time / 90) % 58), 18, 4, 2, "#f6efd5");
}

function px(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function buildTourSteps() {
  const profile = state.config ? localizeProfile(getSelectedProfile(state.config), state.config.connectionMode, state.config.providerKey) : null;
  return [
    {
      panel: "panel-send",
      targetId: "tour-recipients",
      title: t("tour.step1.title"),
      body: t("tour.step1.body"),
      points: [
        t("tour.step1.point1"),
        t("tour.step1.point2")
      ]
    },
    {
      panel: "panel-send",
      targetId: "tour-cadence",
      title: t("tour.step2.title"),
      body: t("tour.step2.body"),
      points: [
        t("tour.step2.point1"),
        t("tour.step2.point2")
      ]
    },
    {
      panel: "panel-send",
      targetId: "tour-ramp",
      title: t("tour.step3.title"),
      body: t("tour.step3.body"),
      points: [
        t("tour.step3.point1"),
        t("tour.step3.point2")
      ]
    },
    {
      panel: "panel-send",
      targetId: "tour-guardrail",
      title: t("tour.step4.title"),
      body: t("tour.step4.body", { profile: profile ? profile.label : t("tour.profileFallback") }),
      points: [
        t("tour.step4.point1"),
        t("tour.step4.point2")
      ]
    },
    {
      panel: "panel-config",
      targetId: "mode-strip",
      title: t("tour.step5.title"),
      body: t("tour.step5.body"),
      points: [
        t("tour.step5.point1"),
        t("tour.step5.point2"),
        t("tour.step5.point3")
      ]
    },
    {
      panel: "panel-config",
      targetId: "tour-config-actions",
      title: t("tour.step6.title"),
      body: t("tour.step6.body"),
      points: [
        t("tour.step6.point1"),
        t("tour.step6.point2")
      ]
    }
  ];
}

function maybeOpenTour() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("demo") === "1") {
    return;
  }
  setTimeout(() => openTour(0), 900);
}

function openTour(index = 0) {
  state.tourOpen = true;
  state.tourIndex = index;
  state.tourGuideSeed = Math.floor(Math.random() * CAMEOS.length);
  el.tourOverlay.hidden = false;
  el.tourPanel.dataset.ready = "false";
  el.tourBeam.style.opacity = "0";
  renderTourStep();
}

function closeTour() {
  state.tourOpen = false;
  el.tourOverlay.hidden = true;
  el.tourPanel.dataset.ready = "false";
  el.tourBeam.style.opacity = "0";
  clearTourFocus();
}

function nextTourStep() {
  const steps = buildTourSteps();
  if (state.tourIndex >= steps.length - 1) {
    closeTour();
    return;
  }
  state.tourIndex += 1;
  renderTourStep();
}

function previousTourStep() {
  if (state.tourIndex <= 0) {
    return;
  }
  state.tourIndex -= 1;
  renderTourStep();
}

function renderTourStep() {
  const steps = buildTourSteps();
  const step = steps[state.tourIndex];
  const guide = getActiveTourGuide();

  activatePanel(step.panel);
  clearTourFocus();
  el.tourPanel.dataset.ready = "false";
  el.tourBeam.style.opacity = "0";

  const target = document.getElementById(step.targetId);
  if (target) {
    state.focusedTourNode = target;
    target.classList.add("tour-focus");
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  el.tourAvatarTag.textContent = guide.title;
  el.tourTitle.textContent = step.title;
  el.tourBody.textContent = step.body;
  el.tourPoints.innerHTML = step.points.map((point) => `<div>${point}</div>`).join("");
  el.tourProgress.innerHTML = steps.map((_, index) => `<span class="${index === state.tourIndex ? "active" : ""}"></span>`).join("");
  el.tourPrev.disabled = state.tourIndex === 0;
  el.tourNext.textContent = state.tourIndex === steps.length - 1 ? t("tour.done") : t("tour.next");

  requestAnimationFrame(() => {
    positionTourPanel();
    window.setTimeout(positionTourPanel, 180);
  });
}

function positionTourPanel() {
  if (!state.tourOpen || !state.focusedTourNode) {
    return;
  }

  const targetRect = state.focusedTourNode.getBoundingClientRect();
  const panelRect = el.tourPanel.getBoundingClientRect();
  const panelWidth = panelRect.width || 420;
  const panelHeight = panelRect.height || 260;
  const gap = 18;
  const margin = 12;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let side = "right";
  let left = targetRect.right + gap;
  let top = clamp(targetRect.top + (targetRect.height / 2) - (panelHeight / 2), margin, viewportHeight - panelHeight - margin);

  if (viewportWidth - targetRect.right < panelWidth + gap) {
    side = "left";
    left = targetRect.left - panelWidth - gap;
  }

  if (left < margin) {
    side = "bottom";
    left = clamp(targetRect.left + (targetRect.width / 2) - (panelWidth / 2), margin, viewportWidth - panelWidth - margin);
    top = targetRect.bottom + gap;
  }

  if (side === "bottom" && top + panelHeight > viewportHeight - margin) {
    side = "top";
    top = targetRect.top - panelHeight - gap;
  }

  if (side === "top" && top < margin) {
    side = "bottom";
    top = clamp(targetRect.bottom + gap, margin, viewportHeight - panelHeight - margin);
  }

  left = clamp(left, margin, viewportWidth - panelWidth - margin);
  top = clamp(top, margin, viewportHeight - panelHeight - margin);

  el.tourPanel.style.left = `${Math.round(left)}px`;
  el.tourPanel.style.top = `${Math.round(top)}px`;
  el.tourPanel.dataset.side = side;
  positionTourArrow(side, targetRect, left, top, panelWidth, panelHeight);
  positionTourBeam(side, targetRect, left, top, panelWidth, panelHeight);
  el.tourPanel.dataset.ready = "true";
  el.tourBeam.style.opacity = "1";
}

function positionTourArrow(side, targetRect, panelLeft, panelTop, panelWidth, panelHeight) {
  const arrow = el.tourArrow;

  if (side === "right") {
    arrow.style.left = "-12px";
    arrow.style.right = "auto";
    arrow.style.top = `${clamp((targetRect.top + targetRect.height / 2) - panelTop - 8, 18, panelHeight - 26)}px`;
    arrow.style.bottom = "auto";
    arrow.style.transform = "rotate(45deg)";
  }

  if (side === "left") {
    arrow.style.left = "auto";
    arrow.style.right = "-12px";
    arrow.style.top = `${clamp((targetRect.top + targetRect.height / 2) - panelTop - 8, 18, panelHeight - 26)}px`;
    arrow.style.bottom = "auto";
    arrow.style.transform = "rotate(225deg)";
  }

  if (side === "bottom") {
    arrow.style.left = `${clamp((targetRect.left + targetRect.width / 2) - panelLeft - 8, 18, panelWidth - 26)}px`;
    arrow.style.right = "auto";
    arrow.style.top = "-12px";
    arrow.style.bottom = "auto";
    arrow.style.transform = "rotate(45deg)";
  }

  if (side === "top") {
    arrow.style.left = `${clamp((targetRect.left + targetRect.width / 2) - panelLeft - 8, 18, panelWidth - 26)}px`;
    arrow.style.right = "auto";
    arrow.style.top = "auto";
    arrow.style.bottom = "-12px";
    arrow.style.transform = "rotate(225deg)";
  }
}

function positionTourBeam(side, targetRect, panelLeft, panelTop, panelWidth, panelHeight) {
  const targetX = targetRect.left + (targetRect.width / 2);
  const targetY = targetRect.top + (targetRect.height / 2);
  let startX = panelLeft + (panelWidth / 2);
  let startY = panelTop + (panelHeight / 2);

  if (side === "right") {
    startX = panelLeft;
    startY = panelTop + clamp((targetRect.top + targetRect.height / 2) - panelTop, 22, panelHeight - 22);
  }

  if (side === "left") {
    startX = panelLeft + panelWidth;
    startY = panelTop + clamp((targetRect.top + targetRect.height / 2) - panelTop, 22, panelHeight - 22);
  }

  if (side === "bottom") {
    startX = panelLeft + clamp((targetRect.left + targetRect.width / 2) - panelLeft, 22, panelWidth - 22);
    startY = panelTop;
  }

  if (side === "top") {
    startX = panelLeft + clamp((targetRect.left + targetRect.width / 2) - panelLeft, 22, panelWidth - 22);
    startY = panelTop + panelHeight;
  }

  const dx = targetX - startX;
  const dy = targetY - startY;
  const length = Math.max(20, Math.sqrt((dx * dx) + (dy * dy)));

  el.tourBeam.style.left = `${Math.round(startX)}px`;
  el.tourBeam.style.top = `${Math.round(startY - 3)}px`;
  el.tourBeam.style.width = `${Math.round(length)}px`;
  el.tourBeam.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
}

function clearTourFocus() {
  if (state.focusedTourNode) {
    state.focusedTourNode.classList.remove("tour-focus");
    state.focusedTourNode = null;
  }
}

function splitRecipients(value) {
  const seen = new Set();
  const valid = [];
  const invalid = [];

  value.split(/[\n,;]+/).map((item) => item.trim()).filter(Boolean).forEach((item) => {
    const email = item.toLowerCase();
    if (seen.has(email)) {
      return;
    }
    seen.add(email);
    (isEmail(email) ? valid : invalid).push(isEmail(email) ? email : item);
  });

  return { valid, invalid };
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function modeLabel(mode) {
  if (mode === "gmail_app_password") {
    return t("mode.gmail");
  }
  if (mode === "smtp_preset") {
    return t("mode.preset");
  }
  return t("mode.manual");
}

function statusLabel(status) {
  return ({
    idle: state.lang === "en" ? "NO QUEUE" : "SIN COLA",
    queued: state.lang === "en" ? "QUEUED" : "EN COLA",
    running: state.lang === "en" ? "SENDING" : "ENVIANDO",
    waiting: state.lang === "en" ? "WAITING" : "EN ESPERA",
    stopping: state.lang === "en" ? "STOPPING" : "DETENIENDO",
    stopped: state.lang === "en" ? "STOPPED" : "DETENIDA",
    completed: state.lang === "en" ? "DONE" : "COMPLETA",
    failed: state.lang === "en" ? "FAILED" : "FALLO"
  })[status] || t("status.idle");
}

function humanizeSeconds(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest ? `${minutes}m ${rest}s` : `${minutes}m`;
}

function formatClock(value) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function localizeScheduleLabel(label) {
  if (!label) {
    return "";
  }
  if (label === "Ultimo correo") {
    return t("schedule.last");
  }
  if (label === "Siguiente tanda") {
    return t("schedule.next");
  }
  if (label === "Fin de ventana") {
    return t("schedule.windowEnd");
  }
  if (label.startsWith("Reinicio")) {
    return state.lang === "en" ? label.replace("Reinicio ventana", "Restart window") : label;
  }
  if (label.startsWith("Tanda")) {
    return state.lang === "en" ? label.replace("Tanda", "Batch") : label;
  }
  return label;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
