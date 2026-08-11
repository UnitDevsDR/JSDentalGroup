import type { Dictionary } from './es';

/**
 * English dictionary. Typed as `Dictionary`, so the build fails if any key
 * from `es.ts` is missing here.
 */
export const en: Dictionary = {
  lang: 'en',
  htmlLang: 'en',
  ogLocale: 'en_US',
  label: 'English',
  labelShort: 'EN',

  titles: { dra: 'Dr.', dr: 'Dr.' },

  nav: {
    home: 'Home',
    services: 'Services',
    about: 'About us',
    contact: 'Contact',
    allServices: 'See all services',
    book: 'Book an appointment',
    bookWhatsapp: 'Book on WhatsApp',
    call: 'Call',
    callAria: (phone: string) => `Call ${phone}`,
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    skipToContent: 'Skip to content',
    switchLanguage: 'Change language',
    homeAria: 'JS Dental Group — Home',
    mainMenu: 'Main menu',
    breadcrumb: 'Breadcrumb',
  },

  home: {
    title: 'JS Dental Group — Dental Clinic in Santiago | Orthodontics & Implants',
    description:
      'Dental clinic in Santiago, Dominican Republic. Specialists in orthodontics, dental implants, endodontics, periodontics, maxillofacial surgery and pediatric dentistry. Complete care for the whole family. Book your appointment.',
    badge: 'Santiago, D.R.',
    badgeAnnouncement: 'Care for the whole family',
    badgeAnnouncementShort: 'Whole family',
    headingWords: ['It', 'is', 'your', "smile's"],
    headingHighlight: 'turn',
    heroDescription:
      'Guided by advanced technology and genuine human care, at JS Dental Group we offer an experience that lets you smile without limits.',
    heroSecondary: 'Our services',
    statPatients: 'Happy patients',
    statSpecialists: 'Specialists',
    statSince: 'Caring for smiles',
    meetDoctors: 'Meet our doctors',
    heroSlideTitle: 'Smile with confidence',
    heroSlideRole: 'Care for the whole family',
    specialtiesHeading: 'Eight specialties, one single team',
    specialtiesDescription:
      'Every treatment is handled jointly by our specialists, so your care is complete from start to finish.',
    servicesHeading: 'Our services',
    servicesDescription: 'Discover everything you can achieve with first-class dental care.',
    ctaByline: 'We care for your smile',
    ctaHeading: "With today's science and the passion of always",
    ctaDescription:
      'A group of experts working across specialties to approach every case with the highest standard: more complete, personalized and successful treatments.',
    ctaHighlights: [
      'State-of-the-art technology',
      'Certified multidisciplinary team',
      'Care for the whole family',
    ],
    ctaSecondary: 'About the clinic',
    instagramHeading: 'Our smile is on Instagram too',
    instagramDescription: 'Real moments from our patients and our team.',
    faqHeading: 'Frequently asked questions',
    faqNote: "These are some common questions about the clinic. If you can't find what you need,",
    faqWhatsapp: 'message us on WhatsApp',
    faqCategory: 'About the clinic',
  },

  team: {
    heading: 'Meet our specialists',
    description: 'A multidisciplinary team that works every case together.',
    specialist: 'Specialist',
    staff: 'Team',
    book: 'Book',
    certified: 'Certified specialist',
  },

  servicesPage: {
    title: 'Dental Services in Santiago | JS Dental Group',
    description:
      'All our dental services in Santiago: oral rehabilitation, implantology, endodontics, orthodontics, periodontics, maxillofacial surgery, general dentistry and pediatric dentistry.',
    h1Before: 'Complete dental care,',
    h1Highlight: 'all in one place',
    intro:
      'Eight specialties working as one team so your treatment is complete, personalized and successful.',
    heading: 'Our services',
    description2: 'Every service is performed by certified specialists.',
    viewTreatment: 'View treatment',
  },

  serviceDetail: {
    specialistInCharge: 'Specialist in charge',
    bookEvaluation: 'Book your evaluation',
    bookWithSpecialist: 'Book with the specialist',
    bookAppointment: 'Book appointment',
    whatIsIt: 'What does this treatment involve?',
    teamNote:
      'Every treatment starts with a complete evaluation to understand your case and design a personalized plan. We work together with the clinic’s other specialties, so your care is comprehensive from start to finish.',
    clinicHours: 'Clinic hours',
    relatedServices: 'Related services',
    consultHeading: (service: string) => `Book your ${service} consultation`,
  },

  about: {
    title: 'About Us | Our Story and Specialists | JS Dental Group',
    description:
      'Discover the story of J Saint Hilaire Dental Expert Group: a multidisciplinary team of dental specialists in Santiago, Dominican Republic, founded in 2020. Ethics, respect and love for what we do.',
    heading: 'Our clinic story',
    sideLabel: 'Our story',
    intro:
      'In 2020, J Saint Hilaire Dental Expert Group was born — a dream come true, driven by the desire to offer comprehensive, modern dental care built on teamwork.',
    founderRole: 'Founder and General Manager',
    statement:
      'More than a clinic, we are a group of experts committed to delivering functional and aesthetic solutions, working across specialties to approach every case with the highest standard.',
    support:
      'Each specialist contributes their part, ensuring more complete, personalized and successful treatments. Our goal is not only to care for smiles, but to build relationships of trust with every patient, always guided by ethics, respect and love for what we do.',
    imageAlt: 'JS Dental Group, dental clinic in Santiago de los Caballeros',
  },

  contact: {
    title: 'Contact Us | Book an Appointment | JS Dental Group Santiago',
    description:
      'Book your appointment at JS Dental Group: WhatsApp, phone +1 (809) 966-3113, or visit us at Calle México No. 42, Plaza Catrina, Santiago de los Caballeros. Monday to Saturday.',
    h1: 'Contact us',
    intro: "We're ready to welcome you. Message us on WhatsApp, call us, or visit the clinic.",
    heading: 'Have questions? Book your consultation',
    body:
      'Our team of specialists is ready to answer your questions and help you get the best version of your smile.',
    formHeading: 'Send us a message',
    formNote: 'On submit, WhatsApp opens with your message ready for our team.',
    fieldName: 'Full name',
    fieldPhone: 'Phone number',
    fieldSubject: 'Subject',
    fieldMessage: 'Your question',
    submit: 'Send on WhatsApp',
    sent: 'Message ready in WhatsApp: check the tab that just opened.',
    labelPhone: 'Phone',
    labelEmergency: 'Emergencies',
    labelEmail: 'Email',
    labelAddress: 'Address',
    labelHours: 'Hours',
    labelInstagram: 'Instagram',
    mapTitle: 'Map: JS Dental Group, Calle México No. 42, Santiago de los Caballeros',
    mapAria: 'Location',
    whatsappFloat: 'Book your appointment on WhatsApp',
    waGreeting: (name: string) => `Hello, my name is ${name}.`,
    waPhone: (phone: string) => `My phone: ${phone}.`,
    waSubject: (subject: string) => `Subject: ${subject}.`,
  },

  footer: {
    tagline: (year: number) =>
      `J Saint Hilaire Dental Expert Group. Comprehensive, modern dental care as a team, in Santiago de los Caballeros since ${year}.`,
    services: 'Services',
    moreServices: 'More services',
    clinic: 'Clinic',
    terms: 'Terms and conditions',
    hoursLabel: 'Clinic hours',
    instagramAria: 'Follow us on Instagram',
    linksAria: 'Footer links',
    rights: 'All rights reserved.',
    madeBy: 'Made by',
  },

  terms: {
    title: 'Terms and Conditions | JS Dental Group',
    description:
      'Terms and conditions for the JS Dental Group website: appointment booking, cancellation policy, privacy and more.',
    heading: 'Terms and conditions',
    sections: [
      {
        t: '1. Introduction',
        c: 'Welcome to the JS Dental Group website. By accessing and using this site you accept these terms and conditions. We recommend reading them carefully before using our services.',
      },
      {
        t: '2. About JS Dental Group',
        c: 'J Saint Hilaire Dental Expert Group is a trusted dental clinic specializing in comprehensive care for the whole family: implantology, orthodontics, root canal treatment, teeth whitening and much more.',
      },
      {
        t: '3. Use of the website',
        c: 'The content of this site is for informational purposes and does not replace a professional consultation. You agree to use the site lawfully and not to take actions that affect its operation or other users’ experience.',
      },
      {
        t: '4. Appointment booking',
        c: 'You can book your appointment through the website, by phone, using the contact form or via WhatsApp. Appointment confirmation will be sent by email or WhatsApp.',
      },
      {
        t: '5. Cancellation policy',
        c: 'If you need to cancel or reschedule your appointment, we ask that you let us know at least 24 hours in advance. No-shows without prior notice may incur a fee.',
      },
      {
        t: '6. Liability',
        c: 'The clinic is not liable for damages arising from the use of the website or from being unable to access it. Treatment results may vary from patient to patient.',
      },
      {
        t: '7. Intellectual property',
        c: 'All content on this site (text, images, logos and design) is the property of JS Dental Group and is protected by intellectual property law. It may not be reproduced without prior authorization.',
      },
      {
        t: '8. Third-party links',
        c: 'This site may contain links to third-party sites (such as WhatsApp or Instagram). We are not responsible for the content or privacy policies of those sites.',
      },
      {
        t: '9. Privacy',
        c: 'The personal data you provide is used solely to manage your appointments and inquiries. We do not share your information with third parties without your consent.',
      },
      {
        t: '10. Changes',
        c: 'We reserve the right to modify these terms at any time. Changes take effect once published on this site.',
      },
      {
        t: '11. Governing law',
        c: 'These terms are governed by the laws of the Dominican Republic. Any dispute will be submitted to the competent courts of that country.',
      },
      {
        t: '12. Contact',
        c: 'For any questions about these terms, email us at jsainthilaireclinic@gmail.com or call +1 (809) 966-3113.',
      },
    ],
  },

  notFound: {
    title: 'Page not found | JS Dental Group',
    description:
      "The page you're looking for doesn't exist. Go back home or explore our dental services in Santiago.",
    heading: "This page doesn't exist",
    body: 'But your smile does. Head back home or explore our services.',
    home: 'Go home',
    services: 'View services',
  },

  roles: {
    'julissa-saint-hilaire': 'Oral Rehabilitation · General Manager',
    'rosangel-tatis': 'Endodontics',
    'melissa-lantigua': 'Endodontics',
    'mairenys-estevez': 'General Dentistry',
    'denisse-dominguez': 'Periodontics',
    'siddy-dominguez': 'Orthodontics',
    'laura-bueno': 'Oral & Maxillofacial Surgery and Facial Harmonization',
    'simon-dominguez': 'Oral Implantology',
    'rosanny-minaya': 'Pediatric Dentistry',
    'arianny-pena': 'Administrative Assistant',
  },

  services: {
    'rehabilitacion-bucal': {
      name: 'Oral Rehabilitation',
      title: 'Oral Rehabilitation in Santiago | Crowns & Prosthetics | JS Dental Group',
      metaDescription:
        'Complete oral rehabilitation in Santiago. Dental prosthetics, crowns, bridges and restorations. Recover your smile and chewing function with certified specialists.',
      h1: 'Oral Rehabilitation and Aesthetics',
      tagline: 'Improve your smile',
      copy: 'Oral rehabilitation restores the function of your mouth — chewing, speech, correct bite — while dental aesthetics focuses on making your smile look healthy, harmonious and beautiful. Our personalized approach helps you achieve a healthier, brighter smile.',
      longCopy:
        'Transform your smile with personalized treatments that restore the function, health and beauty of your mouth. From crowns, veneers and prosthetics to whitening and smile design, we combine advanced techniques with an aesthetic approach to give you back confidence and well-being.',
      specialistRole: 'Oral Rehabilitation and Aesthetics',
    },
    implantologia: {
      name: 'Implantology',
      title: 'Dental Implants in Santiago | Implantology | JS Dental Group',
      metaDescription:
        'State-of-the-art dental implants in Santiago. Restore your smile with advanced technology and oral implantology specialists. Book your consultation.',
      h1: 'Implantology',
      tagline: 'Transform your smile today',
      copy: 'Discover how our personalized treatments can give you a healthier, brighter and more confident smile. At JS Dental Group we are committed to offering you the best dental care, tailored to your needs for visible, lasting results.',
      longCopy:
        'Recover the function and aesthetics of your smile with our oral implantology treatments. We place safe, long-lasting dental implants to replace missing teeth, preserving the health of your mouth and giving you back confidence, comfort and a complete smile.',
      specialistRole: 'Oral Implantology',
    },
    endodoncia: {
      name: 'Endodontics',
      title: 'Endodontics in Santiago | Root Canal Treatment | JS Dental Group',
      metaDescription:
        'Endodontic and root canal treatment in Santiago. Save your teeth with our specialists and modern technology. Book at JS Dental Group.',
      h1: 'Endodontics',
      tagline: 'We save your teeth from the root',
      copy: 'Endodontics, known as root canal treatment, makes it possible to keep teeth damaged by deep cavities, trauma or infection. We eliminate the pain, clean the inside of the tooth and seal it to restore its function and health.',
      longCopy:
        'Protect your smile from the root. Our endodontic treatments eliminate infection, relieve pain and save teeth that would otherwise be lost. With modern technology and specialized care, we restore strength, health and peace of mind to your mouth so you can keep smiling without worry.',
      specialistRole: 'Endodontics',
    },
    ortodoncia: {
      name: 'Orthodontics',
      title: 'Orthodontics in Santiago | Braces & Clear Aligners | JS Dental Group',
      metaDescription:
        'Orthodontic treatment in Santiago. Traditional braces and clear aligners with certified specialists. Book your consultation at JS Dental Group.',
      h1: 'Orthodontics',
      tagline: 'Transform your smile with advanced orthodontics',
      copy: 'Orthodontic treatment improves dental health by restoring the function and aesthetics of your teeth. With our expert team and advanced technology — traditional braces or clear aligners — we restore your smile and your confidence.',
      longCopy:
        'Achieve the smile you have always wanted with our orthodontic treatments. We correct the position of your teeth and jaws, improving both the function and the aesthetics of your mouth. Whether with traditional braces or modern, discreet techniques, we help you align your smile in a personalized, comfortable and effective way.',
      specialistRole: 'Orthodontics',
    },
    periodoncia: {
      name: 'Periodontics',
      title: 'Periodontics in Santiago | Gum Health | JS Dental Group',
      metaDescription:
        'Periodontal and gum disease treatment in Santiago. Prevention and treatment with periodontal health specialists. Book your consultation.',
      h1: 'Periodontics',
      tagline: 'The solution for your gums',
      copy: 'Restore the health of your gums with advanced periodontal treatments. We offer periodontal care designed to bring your gums back to health, ensuring a healthier, longer-lasting smile.',
      longCopy:
        'Protect the foundation of your smile with specialized periodontal treatment. We focus on preventing, diagnosing and caring for the gums and supporting tissues, avoiding problems such as gingivitis and periodontitis. With a comprehensive approach, we work to keep your teeth firm, your mouth healthy and your smile full of confidence.',
      specialistRole: 'Periodontics',
    },
    'cirugia-maxilofacial': {
      name: 'Maxillofacial Surgery',
      title: 'Maxillofacial Surgery in Santiago | JS Dental Group',
      metaDescription:
        'Oral and maxillofacial surgery in Santiago: complex extractions, cysts, fractures, jaw joint issues and facial harmonization. Safe, precise care.',
      h1: 'Maxillofacial Surgery',
      tagline: 'Surgical solutions for your oral and facial health',
      copy: 'Maxillofacial surgery treats everything from complex extractions, cysts and fractures to jaw joint problems and the correction of facial malformations. Our specialized team offers safe, precise care in every procedure.',
      longCopy:
        'We combine oral and maxillofacial surgery with facial harmonization to deliver comprehensive care. We restore function and correct alterations while balancing and enhancing your features, giving you back well-being, confidence and a natural appearance.',
      specialistRole: 'Oral & Maxillofacial Surgery and Facial Harmonization',
    },
    'odontologia-general': {
      name: 'General Dentistry',
      title: 'General Dentistry in Santiago | JS Dental Group',
      metaDescription:
        'General dentistry in Santiago: cleanings, fillings, cavity treatment and complete check-ups for the whole family. Prevention and personalized care.',
      h1: 'General Dentistry',
      tagline: 'Your dental health starts with good general care',
      copy: 'General dentistry is the foundation of a healthy smile. We perform cleanings, fillings, cavity treatment and complete check-ups to catch any problem early. Prevention, diagnosis and personalized care for the whole family.',
      longCopy:
        'General dentistry is the foundation of a healthy smile. With check-ups, cleanings and preventive treatments, we care for your mouth day to day, catching any problem early and keeping your teeth and gums in optimal condition.',
      specialistRole: 'General Dentistry',
    },
    odontopediatria: {
      name: 'Pediatric Dentistry',
      title: 'Pediatric Dentistry in Santiago | Kids Dentist | JS Dental Group',
      metaDescription:
        'Specialized dental care for children in Santiago. Pediatric dentistry with a friendly approach, from the first teeth through adolescence. Book their appointment.',
      h1: 'Pediatric Dentistry',
      tagline: 'We care for the most important smiles: your children’s',
      copy: 'Pediatric dentistry looks after the oral health of the youngest patients, from their first teeth through adolescence. We provide warm, specialized care so every visit to the dentist is a positive, fear-free experience.',
      longCopy:
        'Care for your little ones’ smiles with our specialized pediatric dentistry. We provide check-ups, cleanings and preventive treatments adapted to each age, teaching healthy habits and making sure their teeth and gums grow strong and healthy, so they enjoy a happy, confident smile.',
      specialistRole: 'Pediatric Dentistry',
    },
  },

  faqs: [
    {
      q: 'How do I book an appointment?',
      a: 'You can call us at +1 (809) 966-3113 or message us on WhatsApp using the "Book an appointment" button to arrange it quickly and easily. You can also book directly at our front desk.',
    },
    {
      q: 'What services does the dental clinic offer?',
      a: 'We offer routine cleanings and check-ups, teeth whitening, orthodontics (braces and clear aligners), dental implants, root canal treatment (endodontics), dental surgery, cosmetic dentistry (veneers, crowns), gum treatment and pediatric dentistry. Every service is performed by certified specialists.',
    },
    {
      q: 'Is teeth whitening safe for my teeth?',
      a: 'Yes. Teeth whitening performed under a dentist’s supervision is completely safe: we use high-quality products and approved techniques to guarantee effective results without damaging the enamel. Beforehand we assess your dental health to rule out pre-existing conditions such as cavities or gum disease.',
    },
    {
      q: 'How can I prevent cavities?',
      a: 'Brush twice a day with fluoride toothpaste, floss daily, limit sugar intake, use a fluoride rinse, and visit the dentist every 6 months for a cleaning and check-up.',
    },
  ],

  schema: {
    clinicDescription:
      'Dental clinic in Santiago, Dominican Republic. Specialists in orthodontics, dental implants, endodontics, periodontics, maxillofacial surgery and pediatric dentistry.',
  },
};
