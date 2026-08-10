// Contenido real migrado de jsdentalgroup.com (Odoo) — fuente única de verdad
export const SITE = {
  url: 'https://jsdentalgroup.com',
  name: 'JS Dental Group',
  legalName: 'J Saint Hilaire Dental Expert Group',
  founded: 2020,
  slogan: 'Sonríe con Confianza',
  phone: '+18099663113',
  phoneDisplay: '+1 (809) 966-3113',
  emergencyPhone: '+18099472400',
  emergencyPhoneDisplay: '+1 (809) 947-2400',
  whatsapp: 'https://api.whatsapp.com/message/V7DLSNIT2ZATE1',
  email: 'jsainthilaireclinic@gmail.com',
  address: {
    street: 'Calle México No. 42, Reparto del Este; Plaza Catrina, módulo 103',
    city: 'Santiago de los Caballeros',
    region: 'Santiago',
    country: 'DO',
  },
  hours: {
    weekdays: 'Lunes a Viernes · 8:00 a.m. – 6:00 p.m.',
    saturday: 'Sábados · 8:00 a.m. – 12:00 p.m.',
  },
  instagram: 'https://www.instagram.com/jsdentalgrouprd/',
};

export interface Service {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  h1: string;
  tagline: string;
  copy: string;
  icon: string; // nombre de icono lucide
  image: string; // clave en src/assets/img/services
}

export const SERVICES: Service[] = [
  {
    slug: 'rehabilitacion-bucal',
    name: 'Rehabilitación Bucal',
    title: 'Rehabilitación Bucal en Santiago | Prótesis y Coronas | JS Dental Group',
    metaDescription:
      'Rehabilitación bucal completa en Santiago. Prótesis dentales, coronas, puentes y restauraciones. Recupera tu sonrisa y función masticatoria con especialistas certificados.',
    h1: 'Rehabilitación Bucal y Estética',
    tagline: 'Mejore su sonrisa',
    copy: 'La rehabilitación bucal restaura la función de tu boca —masticación, habla, mordida correcta— y la estética dental se enfoca en que tu sonrisa luzca saludable, armónica y bonita. Nuestro enfoque personalizado le ayudará a lograr una sonrisa más saludable y radiante.',
    icon: 'Sparkles',
    image: 'rehabilitacion-bucal',
  },
  {
    slug: 'implantologia',
    name: 'Implantología',
    title: 'Implantes Dentales en Santiago | Implantología | JS Dental Group',
    metaDescription:
      'Implantes dentales de última generación en Santiago. Restaura tu sonrisa con tecnología avanzada y especialistas en implantología oral. Agenda tu consulta.',
    h1: 'Implantología',
    tagline: 'Transforme su sonrisa hoy',
    copy: 'Descubra cómo nuestros tratamientos personalizados pueden brindarle una sonrisa más saludable, brillante y llena de confianza. En JS Dental Group nos comprometemos a ofrecerte el mejor cuidado dental, adaptado a tus necesidades para lograr resultados visibles y duraderos.',
    icon: 'Anchor',
    image: 'implantologia',
  },
  {
    slug: 'endodoncia',
    name: 'Endodoncia',
    title: 'Endodoncia en Santiago | Tratamiento de Conducto | JS Dental Group',
    metaDescription:
      'Tratamiento de endodoncia y conducto radicular en Santiago. Salva tus dientes con nuestros especialistas y tecnología moderna. Agenda en JS Dental Group.',
    h1: 'Endodoncia',
    tagline: 'Salvamos tus dientes desde la raíz',
    copy: 'La endodoncia, conocida como tratamiento de conducto, permite conservar dientes dañados por caries profundas, traumatismos o infecciones. Eliminamos el dolor, limpiamos el interior del diente y lo sellamos para devolverle su función y salud.',
    icon: 'Activity',
    image: 'endodoncia',
  },
  {
    slug: 'ortodoncia',
    name: 'Ortodoncia',
    title: 'Ortodoncia en Santiago | Brackets y Alineadores Invisibles | JS Dental Group',
    metaDescription:
      'Tratamiento de ortodoncia en Santiago. Brackets tradicionales y alineadores invisibles con especialistas certificados. Agenda tu consulta en JS Dental Group.',
    h1: 'Ortodoncia',
    tagline: 'Transforme su sonrisa con ortodoncia avanzada',
    copy: 'El tratamiento de ortodoncia mejora la salud dental restaurando la funcionalidad y estética de sus dientes. Con nuestro equipo experto y tecnología avanzada —brackets tradicionales o alineadores invisibles— restauramos su sonrisa y su confianza.',
    icon: 'AlignHorizontalDistributeCenter',
    image: 'ortodoncia',
  },
  {
    slug: 'periodoncia',
    name: 'Periodoncia',
    title: 'Periodoncia en Santiago | Salud de las Encías | JS Dental Group',
    metaDescription:
      'Tratamiento de periodoncia y enfermedades de las encías en Santiago. Prevención y tratamiento con especialistas en salud periodontal. Agenda tu consulta.',
    h1: 'Periodoncia',
    tagline: 'La solución para sus encías',
    copy: 'Recupere la salud de sus encías con tratamientos periodontales avanzados. Le ofrecemos un tratamiento periodontal diseñado para restaurar la salud de sus encías, garantizando una sonrisa más saludable y duradera.',
    icon: 'ShieldCheck',
    image: 'periodoncia',
  },
  {
    slug: 'cirugia-maxilofacial',
    name: 'Cirugía Maxilofacial',
    title: 'Cirugía Maxilofacial en Santiago | JS Dental Group',
    metaDescription:
      'Cirugía buco-maxilofacial en Santiago: extracciones complejas, quistes, fracturas, articulación mandibular y armonización facial. Atención segura y precisa.',
    h1: 'Cirugía Maxilofacial',
    tagline: 'Soluciones quirúrgicas para tu salud bucal y facial',
    copy: 'La cirugía maxilofacial trata desde extracciones complejas, quistes y fracturas, hasta problemas de articulación mandibular y corrección de malformaciones faciales. Nuestro equipo especializado te ofrece atención segura y precisa en cada procedimiento.',
    icon: 'Scissors',
    image: 'cirugia-maxilofacial',
  },
  {
    slug: 'odontologia-general',
    name: 'Odontología General',
    title: 'Odontología General en Santiago | JS Dental Group',
    metaDescription:
      'Odontología general en Santiago: limpiezas, empastes, tratamiento de caries y evaluaciones completas para toda la familia. Prevención y cuidado personalizado.',
    h1: 'Odontología General',
    tagline: 'Tu salud dental comienza con una buena atención general',
    copy: 'La odontología general es la base para mantener una sonrisa sana. Realizamos limpiezas, empastes, tratamientos contra caries y evaluaciones completas para detectar cualquier problema a tiempo. Prevención, diagnóstico y cuidado personalizado para toda la familia.',
    icon: 'Stethoscope',
    image: 'odontologia-general',
  },
  {
    slug: 'odontopediatria',
    name: 'Odontopediatría',
    title: 'Odontopediatría en Santiago | Dentista para Niños | JS Dental Group',
    metaDescription:
      'Atención dental especializada para niños en Santiago. Odontopediatría con trato amigable, desde los primeros dientes hasta la adolescencia. Agenda su cita.',
    h1: 'Odontopediatría',
    tagline: 'Cuidamos las sonrisas más importantes: las de tus hijos',
    copy: 'La odontopediatría se encarga de la salud bucal de los más pequeños, desde los primeros dientes hasta la adolescencia. Brindamos atención cálida y especializada para que cada visita al dentista sea una experiencia positiva y sin miedo.',
    icon: 'Baby',
    image: 'odontopediatria',
  },
];

export interface TeamMember {
  name: string;
  role: string;
  image: string; // clave en src/assets/img/team
}

export const TEAM: TeamMember[] = [
  { name: 'Dra. Julissa Saint-Hilaire Espinal', role: 'Rehabilitación Bucal · Gerente General', image: 'julissa-saint-hilaire' },
  { name: 'Dra. Rosangel A. Tatis Soto', role: 'Endodoncia', image: 'rosangel-tatis' },
  { name: 'Dra. Melissa Lantigua Domínguez', role: 'Endodoncia', image: 'melissa-lantigua' },
  { name: 'Dra. Mairenys J. Estévez García', role: 'Odontología General', image: 'mairenys-estevez' },
  { name: 'Dra. Denisse Domínguez Iglesia', role: 'Periodoncia', image: 'denisse-dominguez' },
  { name: 'Dra. Siddy Domínguez', role: 'Ortodoncia', image: 'siddy-dominguez' },
  { name: 'Dra. Laura P. Bueno', role: 'Cirugía Buco-Maxilofacial y Armonización Facial', image: 'laura-bueno' },
  { name: 'Dr. Simón Domínguez', role: 'Implantología Oral', image: 'simon-dominguez' },
  { name: 'Dra. Rosanny Minaya', role: 'Odontopediatría', image: 'rosanny-minaya' },
  { name: 'Arianny Peña', role: 'Asistente Administrativa', image: 'arianny-pena' },
];

export const FAQS = [
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
];
