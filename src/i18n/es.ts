/**
 * Diccionario en español (idioma por defecto).
 *
 * `en.ts` se declara con el tipo de este objeto, así TypeScript falla el build
 * si falta cualquier clave en la traducción: no hay forma de publicar una
 * cadena sin traducir.
 */
export const es = {
  lang: 'es',
  htmlLang: 'es',
  ogLocale: 'es_DO',
  label: 'Español',
  labelShort: 'ES',

  titles: { dra: 'Dra.', dr: 'Dr.' },

  nav: {
    home: 'Inicio',
    services: 'Servicios',
    about: 'Sobre nosotros',
    contact: 'Contáctanos',
    allServices: 'Ver todos los servicios',
    book: 'Agenda tu cita',
    bookWhatsapp: 'Agenda tu cita por WhatsApp',
    call: 'Llamar',
    callAria: (phone: string) => `Llamar al ${phone}`,
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    skipToContent: 'Saltar al contenido',
    switchLanguage: 'Cambiar idioma',
    homeAria: 'JS Dental Group — Inicio',
    mainMenu: 'Menú principal',
    breadcrumb: 'Miga de pan',
  },

  home: {
    title: 'JS Dental Group — Clínica Dental en Santiago | Ortodoncia e Implantes',
    description:
      'Clínica dental en Santiago, República Dominicana. Especialistas en ortodoncia, implantes dentales, endodoncia, periodoncia, cirugía maxilofacial y odontopediatría. Atención integral para toda la familia. Agenda tu cita.',
    badge: 'Santiago, R.D.',
    badgeAnnouncement: 'Atención para toda la familia',
    badgeAnnouncementShort: 'Toda la familia',
    headingWords: ['Es', 'el', 'turno', 'de', 'tu'],
    headingHighlight: 'sonrisa',
    heroDescription:
      'Inspirados en la más avanzada tecnología y un trato humano, en JS Dental Group te ofrecemos una experiencia única para que sonrías sin límites.',
    heroSecondary: 'Nuestros servicios',
    statPatients: 'Pacientes felices',
    statSpecialists: 'Especialistas',
    statSince: 'Cuidando sonrisas',
    meetDoctors: 'Conoce a nuestros doctores',
    heroSlideTitle: 'Sonríe con confianza',
    heroSlideRole: 'Atención para toda la familia',
    specialtiesHeading: 'Ocho especialidades, un solo equipo',
    specialtiesDescription:
      'Cada tratamiento se aborda en conjunto entre nuestros especialistas, para que tu atención sea completa de principio a fin.',
    servicesHeading: 'Nuestros servicios',
    servicesDescription: 'Descubre todo lo que puedes lograr con una atención dental de primer nivel.',
    ctaByline: 'Cuidamos tu sonrisa',
    ctaHeading: 'Con la ciencia de hoy y la pasión de siempre',
    ctaDescription:
      'Un grupo de expertos que trabaja de forma multidisciplinaria para abordar cada caso con la máxima excelencia: tratamientos más completos, personalizados y exitosos.',
    ctaHighlights: [
      'Tecnología de vanguardia',
      'Equipo multidisciplinario certificado',
      'Atención para toda la familia',
    ],
    ctaSecondary: 'Conoce la clínica',
    instagramHeading: 'Nuestra sonrisa también está en Instagram',
    instagramDescription: 'Momentos reales de nuestros pacientes y nuestro equipo.',
    faqHeading: 'Preguntas frecuentes',
    faqNote:
      'Estas son algunas de las preguntas comunes sobre la clínica. Si no encuentras lo que buscas,',
    faqWhatsapp: 'escríbenos por WhatsApp',
    faqCategory: 'Sobre la clínica',
  },

  team: {
    heading: 'Conoce a nuestros especialistas',
    description: 'Un equipo multidisciplinario que trabaja cada caso en conjunto.',
    specialist: 'Especialista',
    staff: 'Equipo',
    book: 'Agendar',
    certified: 'Especialista certificado',
  },

  servicesPage: {
    title: 'Servicios Dentales en Santiago | JS Dental Group',
    description:
      'Todos nuestros servicios dentales en Santiago: rehabilitación bucal, implantología, endodoncia, ortodoncia, periodoncia, cirugía maxilofacial, odontología general y odontopediatría.',
    h1Before: 'Atención dental integral,',
    h1Highlight: 'en un solo lugar',
    intro:
      'Ocho especialidades trabajando en equipo para que tu tratamiento sea completo, personalizado y exitoso.',
    heading: 'Nuestros servicios',
    description2: 'Cada servicio es realizado por especialistas certificados.',
    viewTreatment: 'Ver tratamiento',
  },

  serviceDetail: {
    specialistInCharge: 'Especialista a cargo',
    bookEvaluation: 'Agenda tu evaluación',
    bookWithSpecialist: 'Agendar cita con el especialista',
    bookAppointment: 'Agendar cita',
    whatIsIt: '¿En qué consiste este tratamiento?',
    teamNote:
      'Cada tratamiento comienza con una evaluación completa para entender tu caso y diseñar un plan personalizado. Trabajamos en equipo con las demás especialidades de la clínica, para que tu atención sea integral de principio a fin.',
    clinicHours: 'Horario de la clínica',
    relatedServices: 'Servicios relacionados',
    consultHeading: (service: string) => `Agenda tu consulta de ${service}`,
  },

  about: {
    title: 'Sobre Nosotros | Historia y Especialistas | JS Dental Group',
    description:
      'Conoce la historia de J Saint Hilaire Dental Expert Group: un equipo multidisciplinario de especialistas dentales en Santiago, R.D., fundado en 2020. Ética, respeto y amor por lo que hacemos.',
    heading: 'Historia de la clínica',
    sideLabel: 'Nuestra historia',
    intro:
      'En el año 2020 nace J Saint Hilaire Dental Expert Group, un sueño hecho realidad que surge del deseo de ofrecer una atención odontológica integral, moderna y basada en el trabajo en equipo.',
    founderRole: 'Fundadora y Gerente General',
    statement:
      'Más que una clínica, somos un grupo de expertos comprometidos con brindar soluciones funcionales y estéticas, trabajando de forma multidisciplinaria para abordar cada caso con la máxima excelencia.',
    support:
      'Cada especialista aporta su granito de arena, garantizando tratamientos más completos, personalizados y exitosos. Nuestro objetivo no es solo cuidar sonrisas, sino construir relaciones de confianza con cada paciente, guiados siempre por la ética, el respeto y el amor por lo que hacemos.',
    imageAlt: 'JS Dental Group, clínica dental en Santiago de los Caballeros',
  },

  contact: {
    title: 'Contáctanos | Agenda tu Cita | JS Dental Group Santiago',
    description:
      'Agenda tu cita en JS Dental Group: WhatsApp, teléfono +1 (809) 966-3113 o visítanos en Calle México No. 42, Plaza Catrina, Santiago de los Caballeros. Lunes a sábado.',
    h1: 'Contáctanos',
    intro: 'Estamos listos para recibirte. Escríbenos por WhatsApp, llámanos o visítanos en la clínica.',
    heading: '¿Tienes dudas? Agenda tu consulta',
    body:
      'Nuestro equipo de especialistas está listo para resolver tus dudas y ayudarte a conseguir la mejor versión de tu sonrisa.',
    formHeading: 'Envíanos un mensaje',
    formNote: 'Al enviar se abre WhatsApp con tu mensaje listo para nuestro equipo.',
    fieldName: 'Nombre completo',
    fieldPhone: 'Número de teléfono',
    fieldSubject: 'Asunto',
    fieldMessage: 'Tu pregunta',
    submit: 'Enviar por WhatsApp',
    sent: 'Mensaje preparado en WhatsApp: revisa la pestaña que se abrió.',
    labelPhone: 'Teléfono',
    labelEmergency: 'Emergencias',
    labelEmail: 'Correo',
    labelAddress: 'Dirección',
    labelHours: 'Horario',
    labelInstagram: 'Instagram',
    mapTitle: 'Mapa: JS Dental Group, Calle México No. 42, Santiago de los Caballeros',
    mapAria: 'Ubicación',
    whatsappFloat: 'Agenda tu cita por WhatsApp',
    /** plantilla del mensaje de WhatsApp que compone el formulario */
    waGreeting: (name: string) => `Hola, soy ${name}.`,
    waPhone: (phone: string) => `Mi teléfono: ${phone}.`,
    waSubject: (subject: string) => `Asunto: ${subject}.`,
  },

  footer: {
    tagline: (year: number) =>
      `J Saint Hilaire Dental Expert Group. Atención odontológica integral, moderna y en equipo, en Santiago de los Caballeros desde ${year}.`,
    services: 'Servicios',
    moreServices: 'Más servicios',
    clinic: 'Clínica',
    terms: 'Términos y condiciones',
    hoursLabel: 'Horario de la Clínica',
    instagramAria: 'Síguenos en Instagram',
    linksAria: 'Enlaces del pie de página',
    rights: 'Todos los derechos reservados.',
    madeBy: 'Hecha por',
  },

  terms: {
    title: 'Términos y Condiciones | JS Dental Group',
    description:
      'Términos y condiciones de uso del sitio web de JS Dental Group: agendamiento de citas, política de cancelación, privacidad y más.',
    heading: 'Términos y condiciones',
    sections: [
      {
        t: '1. Introducción',
        c: 'Bienvenido al sitio web de JS Dental Group. Al acceder y utilizar este sitio, aceptas los presentes términos y condiciones. Te recomendamos leerlos con atención antes de usar nuestros servicios.',
      },
      {
        t: '2. Información sobre JS Dental Group',
        c: 'J Saint Hilaire Dental Expert Group es una clínica dental de confianza, especializada en brindar atención integral para toda la familia: implantología, ortodoncia, tratamientos de conducto, blanqueamiento dental y mucho más.',
      },
      {
        t: '3. Uso del sitio web',
        c: 'El contenido de este sitio tiene fines informativos y no sustituye una consulta profesional. Te comprometes a usar el sitio de forma lícita y a no realizar acciones que afecten su funcionamiento o la experiencia de otros usuarios.',
      },
      {
        t: '4. Agendamiento de citas',
        c: 'Puedes agendar tu cita a través del sitio web, por teléfono, mediante el formulario de contacto o por WhatsApp. La confirmación de la cita se realizará por correo electrónico o WhatsApp.',
      },
      {
        t: '5. Política de cancelación',
        c: 'Si necesitas cancelar o reprogramar tu cita, agradecemos que nos avises con al menos 24 horas de anticipación. La no presentación sin aviso previo puede conllevar una tarifa.',
      },
      {
        t: '6. Responsabilidad',
        c: 'La clínica no se hace responsable por daños derivados del uso del sitio web o de la imposibilidad de acceder a él. Los resultados de los tratamientos pueden variar según cada paciente.',
      },
      {
        t: '7. Propiedad intelectual',
        c: 'Todo el contenido de este sitio (textos, imágenes, logotipos y diseño) es propiedad de JS Dental Group y está protegido por las leyes de propiedad intelectual. No puede reproducirse sin autorización previa.',
      },
      {
        t: '8. Enlaces a terceros',
        c: 'Este sitio puede contener enlaces a sitios de terceros (como WhatsApp o Instagram). No somos responsables del contenido ni de las políticas de privacidad de esos sitios.',
      },
      {
        t: '9. Privacidad',
        c: 'Los datos personales que nos proporciones se utilizan únicamente para gestionar tus citas y consultas. No compartimos tu información con terceros sin tu consentimiento.',
      },
      {
        t: '10. Modificaciones',
        c: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entran en vigor desde su publicación en este sitio.',
      },
      {
        t: '11. Ley aplicable',
        c: 'Estos términos se rigen por las leyes de la República Dominicana. Cualquier controversia será sometida a los tribunales competentes de dicho país.',
      },
      {
        t: '12. Contacto',
        c: 'Para cualquier consulta sobre estos términos, escríbenos a jsainthilaireclinic@gmail.com o llámanos al +1 (809) 966-3113.',
      },
    ],
  },

  notFound: {
    title: 'Página no encontrada | JS Dental Group',
    description:
      'La página que buscas no existe. Vuelve al inicio o explora nuestros servicios dentales en Santiago.',
    heading: 'Esta página no existe',
    body: 'Pero tu sonrisa sí. Vuelve al inicio o explora nuestros servicios.',
    home: 'Ir al inicio',
    services: 'Ver servicios',
  },

  /** Rol de cada miembro del equipo (clave = carpeta de su foto) */
  roles: {
    'julissa-saint-hilaire': 'Rehabilitación Bucal · Gerente General',
    'rosangel-tatis': 'Endodoncia',
    'melissa-lantigua': 'Endodoncia',
    'mairenys-estevez': 'Odontología General',
    'denisse-dominguez': 'Periodoncia',
    'siddy-dominguez': 'Ortodoncia',
    'laura-bueno': 'Cirugía Buco-Maxilofacial y Armonización Facial',
    'simon-dominguez': 'Implantología Oral',
    'rosanny-minaya': 'Odontopediatría',
    'arianny-pena': 'Asistente Administrativa',
  },

  /** Contenido de cada especialidad (clave = slug español, estable) */
  services: {
    'rehabilitacion-bucal': {
      name: 'Rehabilitación Bucal',
      title: 'Rehabilitación Bucal en Santiago | Prótesis y Coronas | JS Dental Group',
      metaDescription:
        'Rehabilitación bucal completa en Santiago. Prótesis dentales, coronas, puentes y restauraciones. Recupera tu sonrisa y función masticatoria con especialistas certificados.',
      h1: 'Rehabilitación Bucal y Estética',
      tagline: 'Mejore su sonrisa',
      copy: 'La rehabilitación bucal restaura la función de tu boca —masticación, habla, mordida correcta— y la estética dental se enfoca en que tu sonrisa luzca saludable, armónica y bonita. Nuestro enfoque personalizado le ayudará a lograr una sonrisa más saludable y radiante.',
      longCopy:
        'Transforma tu sonrisa con tratamientos personalizados que restauran la función, salud y belleza de tu boca. Desde coronas, carillas y prótesis hasta blanqueamientos y diseño de sonrisa, combinamos técnicas avanzadas con un enfoque estético para devolverte confianza y bienestar.',
      specialistRole: 'Rehabilitación Bucal y Estética',
    },
    implantologia: {
      name: 'Implantología',
      title: 'Implantes Dentales en Santiago | Implantología | JS Dental Group',
      metaDescription:
        'Implantes dentales de última generación en Santiago. Restaura tu sonrisa con tecnología avanzada y especialistas en implantología oral. Agenda tu consulta.',
      h1: 'Implantología',
      tagline: 'Transforme su sonrisa hoy',
      copy: 'Descubra cómo nuestros tratamientos personalizados pueden brindarle una sonrisa más saludable, brillante y llena de confianza. En JS Dental Group nos comprometemos a ofrecerte el mejor cuidado dental, adaptado a tus necesidades para lograr resultados visibles y duraderos.',
      longCopy:
        'Recupera la funcionalidad y estética de tu sonrisa con nuestros tratamientos de implantología oral. Colocamos implantes dentales seguros y duraderos para reemplazar dientes perdidos, preservando la salud de tu boca y devolviéndote confianza, comodidad y una sonrisa completa.',
      specialistRole: 'Implantología Oral',
    },
    endodoncia: {
      name: 'Endodoncia',
      title: 'Endodoncia en Santiago | Tratamiento de Conducto | JS Dental Group',
      metaDescription:
        'Tratamiento de endodoncia y conducto radicular en Santiago. Salva tus dientes con nuestros especialistas y tecnología moderna. Agenda en JS Dental Group.',
      h1: 'Endodoncia',
      tagline: 'Salvamos tus dientes desde la raíz',
      copy: 'La endodoncia, conocida como tratamiento de conducto, permite conservar dientes dañados por caries profundas, traumatismos o infecciones. Eliminamos el dolor, limpiamos el interior del diente y lo sellamos para devolverle su función y salud.',
      longCopy:
        'Protege tu sonrisa desde la raíz. Nuestros tratamientos de endodoncia eliminan infecciones, calman el dolor y salvan piezas dentales que de otro modo se perderían. Con tecnología moderna y un cuidado especializado, devolvemos fuerza, salud y tranquilidad a tu boca, para que sigas sonriendo sin preocupaciones.',
      specialistRole: 'Endodoncia',
    },
    ortodoncia: {
      name: 'Ortodoncia',
      title: 'Ortodoncia en Santiago | Brackets y Alineadores Invisibles | JS Dental Group',
      metaDescription:
        'Tratamiento de ortodoncia en Santiago. Brackets tradicionales y alineadores invisibles con especialistas certificados. Agenda tu consulta en JS Dental Group.',
      h1: 'Ortodoncia',
      tagline: 'Transforme su sonrisa con ortodoncia avanzada',
      copy: 'El tratamiento de ortodoncia mejora la salud dental restaurando la funcionalidad y estética de sus dientes. Con nuestro equipo experto y tecnología avanzada —brackets tradicionales o alineadores invisibles— restauramos su sonrisa y su confianza.',
      longCopy:
        'Logra la sonrisa que siempre soñaste con nuestros tratamientos de ortodoncia. Corregimos la posición de tus dientes y maxilares, mejorando la función y la estética de tu boca. Ya sea con brackets tradicionales o técnicas modernas y discretas, te ayudamos a alinear tu sonrisa de forma personalizada, cómoda y efectiva.',
      specialistRole: 'Ortodoncia',
    },
    periodoncia: {
      name: 'Periodoncia',
      title: 'Periodoncia en Santiago | Salud de las Encías | JS Dental Group',
      metaDescription:
        'Tratamiento de periodoncia y enfermedades de las encías en Santiago. Prevención y tratamiento con especialistas en salud periodontal. Agenda tu consulta.',
      h1: 'Periodoncia',
      tagline: 'La solución para sus encías',
      copy: 'Recupere la salud de sus encías con tratamientos periodontales avanzados. Le ofrecemos un tratamiento periodontal diseñado para restaurar la salud de sus encías, garantizando una sonrisa más saludable y duradera.',
      longCopy:
        'Protege la base de tu sonrisa con tratamientos de periodoncia especializados. Nos enfocamos en la prevención, diagnóstico y cuidado de las encías y tejidos de soporte dental, evitando problemas como la gingivitis y la periodontitis. Con un abordaje integral, trabajamos para mantener tus dientes firmes, tu boca saludable y tu sonrisa llena de confianza.',
      specialistRole: 'Periodoncia',
    },
    'cirugia-maxilofacial': {
      name: 'Cirugía Maxilofacial',
      title: 'Cirugía Maxilofacial en Santiago | JS Dental Group',
      metaDescription:
        'Cirugía buco-maxilofacial en Santiago: extracciones complejas, quistes, fracturas, articulación mandibular y armonización facial. Atención segura y precisa.',
      h1: 'Cirugía Maxilofacial',
      tagline: 'Soluciones quirúrgicas para tu salud bucal y facial',
      copy: 'La cirugía maxilofacial trata desde extracciones complejas, quistes y fracturas, hasta problemas de articulación mandibular y corrección de malformaciones faciales. Nuestro equipo especializado te ofrece atención segura y precisa en cada procedimiento.',
      longCopy:
        'Combinamos cirugía buco-maxilofacial y armonización facial para ofrecer un cuidado integral. Restauramos la función y corregimos alteraciones, mientras equilibramos y realzamos tus rasgos, devolviéndote bienestar, seguridad y una apariencia natural.',
      specialistRole: 'Cirugía Buco-Maxilofacial y Armonización Facial',
    },
    'odontologia-general': {
      name: 'Odontología General',
      title: 'Odontología General en Santiago | JS Dental Group',
      metaDescription:
        'Odontología general en Santiago: limpiezas, empastes, tratamiento de caries y evaluaciones completas para toda la familia. Prevención y cuidado personalizado.',
      h1: 'Odontología General',
      tagline: 'Tu salud dental comienza con una buena atención general',
      copy: 'La odontología general es la base para mantener una sonrisa sana. Realizamos limpiezas, empastes, tratamientos contra caries y evaluaciones completas para detectar cualquier problema a tiempo. Prevención, diagnóstico y cuidado personalizado para toda la familia.',
      longCopy:
        'La odontología general es la base de una sonrisa saludable. Con revisiones, limpiezas y tratamientos preventivos, cuidamos tu boca día a día, detectando a tiempo cualquier problema y manteniendo tus dientes y encías en óptimas condiciones.',
      specialistRole: 'Odontología General',
    },
    odontopediatria: {
      name: 'Odontopediatría',
      title: 'Odontopediatría en Santiago | Dentista para Niños | JS Dental Group',
      metaDescription:
        'Atención dental especializada para niños en Santiago. Odontopediatría con trato amigable, desde los primeros dientes hasta la adolescencia. Agenda su cita.',
      h1: 'Odontopediatría',
      tagline: 'Cuidamos las sonrisas más importantes: las de tus hijos',
      copy: 'La odontopediatría se encarga de la salud bucal de los más pequeños, desde los primeros dientes hasta la adolescencia. Brindamos atención cálida y especializada para que cada visita al dentista sea una experiencia positiva y sin miedo.',
      longCopy:
        'Cuida la sonrisa de los más pequeños con nuestra odontopediatría especializada. Realizamos revisiones, limpiezas y tratamientos preventivos adaptados a cada edad, enseñando hábitos saludables y asegurando que sus dientes y encías crezcan fuertes y sanos, para que disfruten de una sonrisa feliz y confiada.',
      specialistRole: 'Odontopediatría',
    },
  },

  faqs: [
    {
      q: '¿Cómo puedo hacer una cita?',
      a: 'Puedes llamarnos al +1 (809) 966-3113 o escribirnos por WhatsApp con el botón "Agenda tu cita" para coordinarla de forma rápida y cómoda. También puedes agendar directamente en nuestra recepción.',
    },
    {
      q: '¿Qué servicios ofrecen en la clínica dental?',
      a: 'Ofrecemos limpiezas y revisiones periódicas, blanqueamiento dental, ortodoncia (brackets y alineadores invisibles), implantes dentales, tratamientos de conducto (endodoncia), cirugía dental, estética dental (carillas, coronas), tratamientos para las encías y odontología pediátrica. Cada servicio es realizado por especialistas certificados.',
    },
    {
      q: '¿El blanqueamiento dental es seguro para mis dientes?',
      a: 'Sí. El blanqueamiento dental realizado bajo la supervisión de un dentista es completamente seguro: usamos productos de alta calidad y técnicas aprobadas para garantizar resultados efectivos sin dañar el esmalte. Antes evaluamos tu salud dental para descartar condiciones preexistentes como caries o enfermedades de las encías.',
    },
    {
      q: '¿Cómo puedo prevenir las caries dentales?',
      a: 'Cepíllate dos veces al día con pasta con fluoruro, usa hilo dental a diario, limita el consumo de azúcares, usa enjuague con fluoruro y visita al dentista cada 6 meses para limpieza y revisión.',
    },
  ],

  schema: {
    clinicDescription:
      'Clínica dental en Santiago, República Dominicana. Especialistas en ortodoncia, implantes dentales, endodoncia, periodoncia, cirugía maxilofacial y odontopediatría.',
  },
};

export type Dictionary = typeof es;
