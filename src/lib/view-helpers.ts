import { SITE, hours } from '../data/site';
import { useTranslations, type Lang } from '../i18n';

/**
 * Props del bloque de contacto (contact2). Se resuelven aquí porque el
 * componente es una isla: solo puede recibir datos serializables, nunca las
 * funciones del diccionario.
 */
export const contactProps = (lang: Lang, title?: string) => {
  const t = useTranslations(lang);
  const h = hours(lang);

  return {
    title: title ?? t.contact.heading,
    description: t.contact.body,
    copy: {
      formHeading: t.contact.formHeading,
      formNote: t.contact.formNote,
      fieldName: t.contact.fieldName,
      fieldPhone: t.contact.fieldPhone,
      fieldSubject: t.contact.fieldSubject,
      fieldMessage: t.contact.fieldMessage,
      submit: t.contact.submit,
      sent: t.contact.sent,
      labelPhone: t.contact.labelPhone,
      labelEmergency: t.contact.labelEmergency,
      labelEmail: t.contact.labelEmail,
      labelAddress: t.contact.labelAddress,
      labelHours: t.contact.labelHours,
      labelInstagram: t.contact.labelInstagram,
    },
    info: {
      phone: SITE.phone,
      phoneDisplay: SITE.phoneDisplay,
      emergencyPhone: SITE.emergencyPhone,
      emergencyPhoneDisplay: SITE.emergencyPhoneDisplay,
      email: SITE.email,
      address: `${SITE.address.street}, ${SITE.address.city}, R.D.`,
      hoursWeekdays: h.weekdays,
      hoursSaturday: h.saturday,
      instagram: SITE.instagram,
      instagramUser: SITE.instagramUser,
      waNumber: SITE.phone.replace('+', ''),
    },
    // plantillas con marcador: el componente sustituye {name} / {phone} / {subject}
    wa: {
      greeting: t.contact.waGreeting('{name}'),
      phone: t.contact.waPhone('{phone}'),
      subject: t.contact.waSubject('{subject}'),
    },
  };
};

/** Props del sidebar y CTAs de la página de servicio. */
export const serviceCopy = (lang: Lang) => {
  const t = useTranslations(lang);
  const h = hours(lang);
  return {
    specialistInCharge: t.serviceDetail.specialistInCharge,
    bookWithSpecialist: t.serviceDetail.bookWithSpecialist,
    bookEvaluation: t.serviceDetail.bookEvaluation,
    clinicHours: t.serviceDetail.clinicHours,
    relatedServices: t.serviceDetail.relatedServices,
    hoursWeekdays: h.weekdays,
    hoursSaturday: h.saturday,
    phoneDisplay: SITE.phoneDisplay,
  };
};
