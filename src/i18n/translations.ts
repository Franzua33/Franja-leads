export const TRANSLATIONS = {
  es: {
    // Header & Brand
    'brand-tagline': 'B2B Lead Intelligence',
    'nav-search': 'Búsqueda',
    'nav-history': 'Historial',
    'nav-plans': 'Planes y Créditos',
    'nav-architecture': 'Arquitectura & API',
    'btn-login': 'Acceder con Google',
    'btn-logout': 'Cerrar sesión',
    'lang-toggle': 'English',

    // Hero
    'hero-badge': 'B2B Extractor · Motor de Prospección',
    'hero-title-prefix': 'Extrae prospectos de',
    'hero-title-highlight': 'cualquier negocio del mundo',
    'hero-title-suffix': 'en tiempo real',
    'hero-subtitle': 'Teléfono, WhatsApp directo, correo electrónico, web y coordenadas. Sincronizado con Google Maps, Supabase PostgreSQL y exportación a Sheets + CSV.',

    // Stats
    'stat-extractions': 'Prospectos procesados',
    'stat-countries': 'Países y regiones',
    'stat-accuracy': 'Precisión de geolocalización',
    'stat-speed': 'Promedio de extracción',

    // Auth Section
    'login-card-title': 'Inicia sesión con Supabase Auth',
    'login-card-desc': 'Identifícate con tu cuenta de Google mediante Supabase OAuth para acceder al panel y gestionar tus créditos.',
    'login-btn-text': 'Continuar con Google',
    'login-secure-notice': 'Conexión segura SSL · Tokens cifrados · Sin contraseñas locales',
    'login-free-badge': '✦ Prueba de bienvenida · 20 prospectos iniciales',

    // Search Form
    'search-title': 'Configurar extracción de prospectos',
    'label-business-type': 'Tipo de negocio o rubro',
    'placeholder-business-type': 'Ej: Clínicas odontológicas, Restaurantes, Agencias de marketing...',
    'label-location': 'Ciudad o área geográfica',
    'placeholder-location': 'Ej: Lima Centro, Bogotá Norte, Madrid, Santiago...',
    'label-country': 'País',
    'label-quantity': 'Cantidad de resultados solicitados',
    'btn-run-search': 'EJECUTAR EXTRACCIÓN',
    'btn-running': 'PROCESANDO CON N8N & GOOGLE PLACES...',
    'credits-available': 'Créditos disponibles',
    'credits-reserved': 'Reservados',
    'credits-consumed': 'Consumidos',
    'credits-source-backend': 'Validado en PostgreSQL',
    'credits-source-unconfigured': 'Sin sincronización backend',

    // Results & Actions
    'results-title': 'Prospectos obtenidos',
    'results-count': '{count} empresas extraídas',
    'search-filter-placeholder': 'Filtrar por nombre, teléfono, web o email...',
    'btn-open-sheets': 'Ver en Google Sheets',
    'btn-download-csv': 'Descargar CSV',
    'col-name': 'Negocio',
    'col-phone': 'Teléfono',
    'col-whatsapp': 'WhatsApp',
    'col-website': 'Sitio Web',
    'col-address': 'Dirección',
    'col-maps': 'Google Maps',
    'col-email': 'Email',
    'empty-results-title': 'No hay prospectos en esta vista',
    'empty-results-desc': 'Completa el formulario superior para extraer nuevos prospectos comerciales en tiempo real.',
    'no-filter-match': 'No hay negocios que coincidan con tu filtro de búsqueda.',
    'pagination-prev': 'Anterior',
    'pagination-next': 'Siguiente',
    'pagination-page': 'Página {page} de {totalPages}',

    // History
    'history-title': 'Historial de trabajos',
    'history-desc': 'Tus consultas de extracción registradas en la plataforma.',
    'history-empty': 'Aún no has ejecutado ninguna extracción.',
    'status-completed': 'Completado',
    'status-processing': 'En proceso',
    'status-pending': 'Pendiente',
    'status-failed': 'Fallido',
    'status-unconfigured': 'Pendiente de n8n',

    // Plans & Payments
    'plans-section-title': 'Planes de prospección B2B',
    'plans-section-subtitle': 'Elige el volumen de prospección adaptado a tu pipeline de ventas. Los créditos son validados en el servidor.',
    'plan-btn-buy': 'ADQUIRIR PLAN',
    'plan-current': 'PLAN ACTUAL',
    'modal-mp-title': 'Adquirir créditos con Mercado Pago',
    'modal-mp-desc': 'El backend genera la preferencia oficial en Mercado Pago. Serás redirigido para completar el abono seguro.',
    'mp-step-1': 'Haz clic en "Pagar con Mercado Pago" para abrir el checkout oficial.',
    'mp-step-2': 'Abona mediante tarjeta de crédito, débito o tu saldo de Mercado Pago.',
    'mp-step-3': 'El webhook de n8n recibe la notificación del banco y acredita tus créditos en Supabase.',
    'btn-pay-mp': 'Pagar con Mercado Pago',
    'mp-verify-box-title': 'Comprobación de acreditación',
    'mp-verify-box-desc': 'Una vez pagado en Mercado Pago, pulsa para consultar si el backend ya registró la aprobación bancaria:',
    'btn-check-mp-status': 'Consultar Acreditación',
    'mp-security-note': 'Transacción procesada por Mercado Pago · No almacenamos datos de tarjeta en el frontend',

    // Architecture & Docs
    'arch-tab-title': 'Especificaciones Técnicas & Entregables',
    'arch-tab-desc': 'Arquitectura de integración, contratos de webhooks n8n, esquema de Supabase y checklist de puesta en producción.',

    // Messages
    'msg-unconfigured-env': 'Aviso de entorno: Variables pendientes de configuración en .env',
    'msg-click-to-docs': 'Ver documentación técnica',
  },
  en: {
    // Header & Brand
    'brand-tagline': 'B2B Lead Intelligence',
    'nav-search': 'Search',
    'nav-history': 'History',
    'nav-plans': 'Plans & Credits',
    'nav-architecture': 'Architecture & API',
    'btn-login': 'Sign in with Google',
    'btn-logout': 'Sign out',
    'lang-toggle': 'Español',

    // Hero
    'hero-badge': 'B2B Extractor · Outbound Intelligence',
    'hero-title-prefix': 'Extract verified leads from',
    'hero-title-highlight': 'any business worldwide',
    'hero-title-suffix': 'in real-time',
    'hero-subtitle': 'Phone, direct WhatsApp, email, website and location data. Powered by Google Maps, Supabase PostgreSQL, and Google Sheets + CSV export.',

    // Stats
    'stat-extractions': 'Leads extracted',
    'stat-countries': 'Countries supported',
    'stat-accuracy': 'Geolocation accuracy',
    'stat-speed': 'Average extraction',

    // Auth Section
    'login-card-title': 'Sign in with Supabase Auth',
    'login-card-desc': 'Authenticate using your Google account via Supabase OAuth to access the console and manage your prospecting credits.',
    'login-btn-text': 'Continue with Google',
    'login-secure-notice': 'SSL Encrypted connection · Signed tokens · Zero client secrets',
    'login-free-badge': '✦ Trial Credits · 20 initial prospects',

    // Search Form
    'search-title': 'Configure Lead Extraction',
    'label-business-type': 'Business type / Category',
    'placeholder-business-type': 'E.g: Dental clinics, Software agencies, Restaurants...',
    'label-location': 'City or geographic zone',
    'placeholder-location': 'E.g: Miami Downtown, London Central, Madrid, Mexico City...',
    'label-country': 'Country',
    'label-quantity': 'Requested lead volume',
    'btn-run-search': 'EXECUTE EXTRACTION',
    'btn-running': 'EXTRACTING VIA N8N & GOOGLE PLACES...',
    'credits-available': 'Available credits',
    'credits-reserved': 'Reserved',
    'credits-consumed': 'Consumed',
    'credits-source-backend': 'Verified on PostgreSQL',
    'credits-source-unconfigured': 'Pending backend sync',

    // Results & Actions
    'results-title': 'Extracted Leads',
    'results-count': '{count} companies found',
    'search-filter-placeholder': 'Filter by name, phone, website, or email...',
    'btn-open-sheets': 'View on Google Sheets',
    'btn-download-csv': 'Download CSV',
    'col-name': 'Company',
    'col-phone': 'Phone',
    'col-whatsapp': 'WhatsApp',
    'col-website': 'Website',
    'col-address': 'Address',
    'col-maps': 'Google Maps',
    'col-email': 'Email',
    'empty-results-title': 'No leads in current view',
    'empty-results-desc': 'Fill out the form above to extract qualified business leads in real-time.',
    'no-filter-match': 'No companies match your current search filter.',
    'pagination-prev': 'Previous',
    'pagination-next': 'Next',
    'pagination-page': 'Page {page} of {totalPages}',

    // History
    'history-title': 'Job History',
    'history-desc': 'Your business extraction requests logged on the platform.',
    'history-empty': 'You have not executed any extractions yet.',
    'status-completed': 'Completed',
    'status-processing': 'Processing',
    'status-pending': 'Pending',
    'status-failed': 'Failed',
    'status-unconfigured': 'Pending n8n',

    // Plans & Payments
    'plans-section-title': 'B2B Prospecting Plans',
    'plans-section-subtitle': 'Choose the lead volume adapted to your sales pipeline. All credits are strictly enforced server-side.',
    'plan-btn-buy': 'SELECT PLAN',
    'plan-current': 'CURRENT PLAN',
    'modal-mp-title': 'Purchase Credits with Mercado Pago',
    'modal-mp-desc': 'The backend generates the official Mercado Pago checkout preference. You will be redirected to complete payment securely.',
    'mp-step-1': 'Click "Pay with Mercado Pago" to open the official checkout.',
    'mp-step-2': 'Pay with credit card, debit card, or your Mercado Pago wallet balance.',
    'mp-step-3': 'The n8n webhook receives the bank confirmation and credits your balance in Supabase.',
    'btn-pay-mp': 'Pay with Mercado Pago',
    'mp-verify-box-title': 'Credit Verification',
    'mp-verify-box-desc': 'Once paid on Mercado Pago, click below to verify if the backend webhook has confirmed the transaction:',
    'btn-check-mp-status': 'Check Payment Status',
    'mp-security-note': 'Processed securely by Mercado Pago · No card data is stored in the frontend',

    // Architecture & Docs
    'arch-tab-title': 'Technical Architecture & Deliverables',
    'arch-tab-desc': 'Integration specifications, n8n webhook contracts, Supabase schema notes, and production deployment checklist.',

    // Messages
    'msg-unconfigured-env': 'Environment alert: Variables pending configuration in .env',
    'msg-click-to-docs': 'View technical specs',
  },
};
