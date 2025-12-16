export const airlineLinks: Record<string, string> = {
  // Turkish Airlines
  TK: 'https://www.turkishairlines.com/tr-tr/ucak-bileti/rezervasyonu-yonet/index.html?surname={1}&pnr={0}',

  // Anadolujet
  AJ: 'https://www4.thy.com/onlinecheckin/checkpax.tk?pnr={0}&name={1}&surname={2}',

  // Pegasus
  PC: 'https://web.flypgs.com/check-in?language=tr&pnrNo={0}&surname={2}',

  // Sunexpress
  XQ: 'https://www.sunexpress.com/WebCheckIn/web/checkin?mode=webCheckIn&locale=tr&firstName={1}&pnrNumber={0}&lastName={2}',

  // Etihad
  EY: 'https://www.etihad.com/tr-tr/before-you-fly/check-in-online/?CheckinForm_LastName={2}&CheckinForm_TypeOfIdentification=PNR&CheckinForm_Identification={0}',

  // Qantas
  QF: 'https://www.qantas.com/gb/en/travel-info/check-in.html?bookingRef={0}&surname={2}',

  // Royal Brunei
  BI: 'https://www.flyroyalbrunei.com/en/australia/manage/?pnr={0}&last_name={2}',

  // Aegeanair
  A3: 'https://en.aegeanair.com/Checkin.axd?checkin-language=en&pnr={0}&lastname={2}',

  // Airberlin
  AB: 'https://www.airberlin.com/en/webcheckin?imark=BN&lastname={2}&bnumber={0}',

  // Icelandair
  FI: 'https://checkin.si.amadeus.net/1ASIHSSCWEBFI/sscwfi/checkindirect?ISurname={2}&IIdentificationBookingRef={0}&IIdentificationBookingRef=en',

  // Croatia Airlines
  OU: 'https://wci.croatiaairlines.hr/ck.fly?languageChange=true&l=en&identificationType=booking&lastName={2}&identificationNumber={0}#ck_retrieve',

  // Flybe Limited
  BE: 'https://www.flybe.com/web-app/check-in.php?__formTokenKey=&isRetrieved=true&target=o&action=&pnrLocator={0}&forename={1}&surname={2}',

  // British Airways
  BA: 'https://www.britishairways.com/travel/managebooking/public/en_gb?eId=104510&bookingRef={0}&lastname={2}',

  // Azerbaijan Hava Yolları
  J2: 'https://icheck.sita.aero/iCheckWebJ2/?pnr={0}&name={1}&surname={2}',

  // AirFrance
  AF: 'https://www.airfrance.fr/FR/en/local/core/engine/echeckin/IciFormAction.do?identNumber={0}&name={1}&surname={2}',

  // Air Algerie
  AH: 'https://fly.airalgerie.dz/CKIN/OLCI/FlightInfo.aspx?ctl00$hdnTabValue=1&ctl00$hdnWWS=WWS&ctl00$c$txtLastName={2}&ctl00$c$txtPNR={0}',

  // Virgin Australia International Airlines
  VA: 'https://check-in.virginaustralia.com/checkin/?reservationNumber={0}&surname={2}',

  // Middle East Airlines AirLiban
  ME: 'https://www.mea.com.lb/english/Plan-and-Book/Online-Check-in?pnr={0}&surname={2}',

  // LOT Polish Airlines
  LO: 'https://www.lot.com/us/en/check-in?pnr={0}&surname={2}',

  // Bangkok Airways Public Co., Ltd.
  PG: 'http://www.bangkokair.com/pages/view/online-check-in?pnr-lookup-form=&pnr={0}&LastName={2}',

  // Air Malta
  KM: 'https://checkin.si.amadeus.net/1ASIHSSCMCIKM/sscmkm/checkindirect?ISurname={2}&IIdentificationBookingRef={0}&IIdentificationBookingRef=en',

  // Qatar Airways
  QR: 'https://www.qatarairways.com/turkish_turkey/tabs/Flights_Tab_3.page?submit=true&componentID=1303799844800&validate=1&hdnFOID=BKG_REF&hdnFOIDAL=&hdnFOIDNo=&hdnLn=&hdnLang=en&hdnCountry=qa&hdnOffload=&hdnEntryPoint=default&hdnsc=SumsDrGTfjA=&radio=BKG_REF&check_lastname={2}&BKG_REF={0}',

  // Air Serbia
  JU: 'https://checkin.airserbia.com/SSW2010/JUM0/#checkin?deepLinkPage=true&searchOption=PNR&pnr={0}&lastName={2}&lang=en_US',

  // TAP Portugal
  TP: 'https://www.flytap.com/en-pt/check-in?checkinradio=1&reservationCode2={0}&lastname={2}',

  // Air Astana
  KC: 'https://checkin.si.amadeus.net/1ASIHSSCWCIKC/sscwkc/checkindirect?Action=CONFIRM&IBoardPoint=undefined&IFormOfIdentification=PNR&IGroupTravel=ON&IIdentification={0}&ISurname={2}&LANGUAGE=en&SKIN=DEFAULT&type=W&Redirected=true',

  // Tarom
  RO: 'https://icheck.sita.aero/iCheckWebRO/?pnr={0}&name={1}&surname={2}',

  // LATAM
  LA: 'https://www.latam.com/en_uk/apps/personas/mybookings#reservas?recordLocator={0}&lastName={1}',

  // Czech Airlines
  OK: 'https://checkin.si.amadeus.net/1ASIHSSCWEBOK/sscwok/checkindirectcheckindirect?ISurname={2}&IIdentificationBookingRef={0}&IIdentificationBookingRef=en',

  // Malaysia Airlines
  MH: 'https://checkin.si.amadeus.net/static/PRD/MH/#/identification?ISurname={2}&IIdentificationBookingRef={0}&IIdentificationBookingRef=en',

  // Air Europa
  UX: 'https://www.aireuropa.com/en/vuelos/checkin#/check-in?checkin_form_reserve_number={0}&checkin_form_surname={2}',

  // Ukraine International Airlines
  PS: 'https://ocki.flyuia.com/checkin/#/login?login-booking-tkne={0}&login-booking-lastname={2}',

  // Lufthansa
  LH: 'https://www.lufthansa.com/tr/en/Online-check-in?foidInput=radioBtnFileKeyOrTicketNumber&txtFieldFilekeyOrTicketNumber={0}&txtFieldLastName={2}&txtFieldGivenName={1}',

  // Emirates
  EK: 'https://www.emirates.com/english/manage-booking/online-check-in.aspx?lastname={2}&bookref={0}',

  // Germanwings
  '4U': 'https://www.eurowings.com/skysales/CheckInInfo.aspx?culture=en-GB&CheckinInfoViewControlGroupCheckinInfo$CheckinInfoViewLoginControlAnonymous$FIRST_INPUT_CONTROL_WebCheckIn={0}&CheckinInfoViewControlGroupCheckinInfo$CheckinInfoViewLoginControlAnonymous$SECOND_INPUT_CONTROL_WebCheckIn={2}',

  // Thai Airways International
  TG: 'http://www.thaiairways.com/en_PK/Manage_My_Booking/My_Booking.page?pnrCode={0}&lastName={2}',

  // KLM
  KL: 'https://www.klm.com/ams/checkin/web/kl/tr/tr?identificationValue={0}&surname={2}',

  // Aeroflot
  SU: 'https://www.aeroflot.ru/ru-en/information/checkin/web_checkin?pnr={0}&lastname={2}',

  // Brussels Airlines
  SN: 'https://checkin.brusselsairlines.com/CI/WebForms/PaxByQuery.aspx?ctl00$cplhLevelOne$txtCriteriaValue={0}&ctl00$cplhLevelOne$txtLastName={2}',

  // Alitalia
  AZ: 'https://www.alitalia.com/en_en/check-in.html?code={0}&name={1}&surname={2}',

  // Egyptair
  MS: 'https://checkin.si.amadeus.net/static/PRD/MS/#/identification?ssci_text_form_input_0={2}&identification_PNR={0}&languages_selector=en',

  // Eurowings
  EW: 'https://mobile.eurowings.com/booking/BookingList.aspx?context=checkin&input=checkin&recordLocator={0}&lastname={2}',

  // Luxair
  LG: 'https://wftc2.e-travel.com/plnext/mobile4LG/Override.action#merci-checkin-MSSCICheckinIndex_A&recLoc={0}&lastName={2}',

  // AccesRail
  '9B': 'https://check-in.accesrail.com/#/step1?46=PNR&firstName={1}&lastName={2}&pnr={0}',

  // Austrian Airlines
  OS: 'https://wci.austrian.com/app/ck.fly?lastNameEtix={2}&pnr={0}',

  // Iran Air
  IR: 'http://ebooking.iranair.com/Booking?pnr={0}&surname={2}',

  // Oman Air
  WY: 'http://www.omanair.com/en/manage-bookings/online-check-in?LastName={2}&RecordLocator={0}',

  // Scandinavian Airlines
  SK: 'https://www.flysas.com/en/Generic/Services/Checkin/?ctl00$FullRegion$MainRegion$ContentRegion$ContentFullRegion$ContentLeftRegion$CISearch$txtpassenger1={2}&ctl00$FullRegion$MainRegion$ContentRegion$ContentFullRegion$ContentLeftRegion$CISearch$txtPNR={0}',

  // Royal Jordanian
  RJ: 'https://mcheckin.rj.com/itraveljs/#!advancedSearch?e-ticket={0}&lastName={2}&firstname={1}',

  // Adria Airways
  JP: 'https://www.adria.si/en/check-in/dangerousGoods?value={0}&pax={2}&locale=en_US&L=1&cname=adr&type=PNR',

  // Eurostar International
  '9F': 'https://www.eurostar.com/rw-en/travel-info/your-trip/check-in?pnr={0}&surname={2}',

  // Blue Air
  '0B': 'https://www.blueairweb.com/en/gb/Online-Check-in/?last-name={2}&booking-reference={0}',

  // American Airlines
  AA: 'https://www.aa.com/reservation/view/find-your-trip?firstName={1}&lastName={2}&recordLocator={0}',

  // UTair Aviation
  UT: 'https://www.utair.ru/en/information/check-in/#pravila-onlayn-registratsii_check-in-now?pnr={0}&lastname={2}',
}

/**
 * Havayolu check-in linkini oluşturur
 * @param airlineCode - Havayolu kodu (örn: PC, TK, etc.)
 * @param bookingCode - PNR/Booking kodu
 * @param name - Yolcu adı
 * @param surname - Yolcu soyadı
 * @returns Oluşturulmuş URL veya null
 */
export function buildAirlineCheckInLink(
  airlineCode: string,
  bookingCode: string,
  name: string,
  surname: string
): string | null {
  const template = airlineLinks[airlineCode]

  if (!template) {
    return null
  }

  // {0} = bookingCode, {1} = name, {2} = surname
  return template
    .replace(/\{0\}/g, encodeURIComponent(bookingCode))
    .replace(/\{1\}/g, encodeURIComponent(name))
    .replace(/\{2\}/g, encodeURIComponent(surname))
}
