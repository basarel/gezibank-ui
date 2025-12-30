// import { z } from 'zod'
import { z } from '@/libs/zod'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

import { isMobilePhone } from 'validator'

import {
  AgeCalculationType,
  PassengerTypesEnum,
  GenderEnums,
} from '@/types/passengerViewModel'
import { validTCKN } from '@/libs/tckn-validate'

const baseDateSchema = z.string().date()

const notEmptyForNames = z.string().trim().min(3).max(50)

const createPassengerValidation = (
  isSingleMaleRestriction: boolean = false,
  rooms?: Array<{ passengerKeys: string[] }> | null,
  childAge?: number
) =>
  z.object({
    passengers: z
      .array(
        z
          .object({
            declaredAge: z.string().readonly(),
            // declaredAge: z.number().readonly(),
            checkinDate: z.string().readonly(),
            birthDate_day: z.string().min(1).max(2),
            birthDate_month: z.string().min(2).max(2),
            birthDate_year: z.string().min(4).max(4),
            birthDate: z.coerce.date(),
            calculationYearType: z.nativeEnum(AgeCalculationType).readonly(),
            citizenNo: z.string().optional(),
            firstName: z.string().pipe(notEmptyForNames),
            gender: z.string().nonempty(),
            hesCode: z.string(),
            lastName: z.string().pipe(notEmptyForNames),
            model_PassengerId: z.string().or(z.number()),
            nationality_Check: z.boolean().optional(),
            passengerId: z.string().or(z.number()),
            passengerKey: z.string(),
            passportCountry: z.string().optional(),
            passportNo: z.string().optional(),
            passportValidity_1: z.string().optional(),
            passportValidity_2: z.string().optional(),
            passportValidity_3: z.string().optional(),
            passportValidityDate: z.string().optional().nullable(),
            registeredPassengerId: z.string().or(z.number()),
            type: z.nativeEnum(PassengerTypesEnum).readonly(),
            moduleName: z.string().readonly(),
            childAge: z.number().optional(),
            isRecord: z.boolean().default(false),
          })
          .superRefine((value, ctx) => {
            const moduleName = value.moduleName.toLowerCase()
            const passengerType = +value.type

            if (!value.nationality_Check && !validTCKN(value.citizenNo!)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['citizenNo'],
                message: 'Gecerli tc giriniz',
              })
            }

            const passportCountry = value.passportCountry!
            const passportNo = value.passportNo!
            const passportDate = value.passportValidityDate!
            if (value.nationality_Check) {
              if (passportCountry?.length < 2) {
                ctx.addIssue({
                  code: z.ZodIssueCode.too_small,
                  minimum: 2,
                  inclusive: true,
                  type: 'string',
                  path: ['passportCountry'],
                })
              }
              if (passportNo.length < 3) {
                ctx.addIssue({
                  code: z.ZodIssueCode.too_small,
                  path: ['passportNo'],
                  minimum: 3,
                  inclusive: true,
                  type: 'string',
                })
              }
              if (!baseDateSchema.safeParse(passportDate).success) {
                ctx.addIssue({
                  code: z.ZodIssueCode.invalid_date,
                  path: ['passportValidityDate'],
                })
              }
            }

            const birthDayVal = value.birthDate
            const dayjsBirthDay = dayjs(
              birthDayVal,
              {
                utc: true,
              },
              true
            )
            const dayjsToday = dayjs()
            const dateDiff = dayjsToday.diff(dayjsBirthDay, 'day')
            const checkinDate = dayjs(value.checkinDate)
            const declaredAge = +value.declaredAge

            if (baseDateSchema.safeParse(birthDayVal).success) {
              let minBirthDay
              let maxBirthDay
              if (moduleName === 'hotel' && passengerType === 1) {
                switch (value.calculationYearType) {
                  case AgeCalculationType.YearBased:
                    minBirthDay = dayjs(checkinDate).subtract(
                      declaredAge * 2 + 1 - declaredAge,
                      'year'
                    )
                    maxBirthDay = dayjs(minBirthDay).add(1, 'year')

                    return (
                      dayjsBirthDay.isSameOrAfter(minBirthDay) &&
                      dayjsBirthDay.isBefore(maxBirthDay)
                    )

                  case AgeCalculationType.DayBased:
                    minBirthDay = dayjs(checkinDate).subtract(
                      declaredAge * 2 + 1 - declaredAge,
                      'year'
                    )
                    maxBirthDay = dayjs(minBirthDay)
                      .add(1, 'year')
                      .subtract(1, 'day')

                    if (
                      !(
                        dayjsBirthDay.isSameOrAfter(minBirthDay) &&
                        dayjsBirthDay.isSameOrBefore(maxBirthDay)
                      )
                    ) {
                      {
                        ctx.addIssue({
                          code: z.ZodIssueCode.custom,
                          message: `${minBirthDay.format('DD-MM-YYYY')}-${maxBirthDay.format('DD-MM-YYYY')} tarihleri arasında olmalıdır.`,
                          path: ['birthDate'],
                        })
                      }
                    }
                    break

                  case AgeCalculationType.DayOver:
                    if (
                      dayjs(
                        checkinDate.millisecond() - dayjsBirthDay.millisecond()
                      ).day() +
                        1 !==
                      declaredAge
                    ) {
                      ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'bebek yasi hatali ',
                        path: ['birthDate'],
                      })
                    }
                    break
                }
              }
              return z.NEVER
            }

            switch (value.type) {
              case PassengerTypesEnum.Adult:
                if (dateDiff < 4380 && moduleName !== 'carrental') {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                      'Yetişkin yolcuların yaşı, seyahat tarihinde çocuk yaşından büyük olmalıdır.',
                    path: ['birthDate'],
                  })
                } else if (dateDiff < 7300 && moduleName === 'carrental') {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                      'Araç kiralama için 20 yaş ve üstü olmalısınız. 20 yaş altı kiralama yapılamaz.',
                    path: ['birthDate'],
                  })
                }
                break
              case PassengerTypesEnum.Child:
                if (
                  moduleName.toLowerCase() === 'tour' &&
                  childAge !== undefined
                ) {
                  const calculatedAge = Math.floor(dateDiff / 365)

                  if (calculatedAge !== childAge) {
                    ctx.addIssue({
                      code: z.ZodIssueCode.custom,
                      message: `Çocuk yaşı ${childAge} olmalıdır. Doğum tarihini buna göre ayarlayın.`,
                      path: ['birthDate'],
                    })
                  }
                } else {
                  if (!(dateDiff >= 730 && dateDiff <= 4380)) {
                    ctx.addIssue({
                      code: z.ZodIssueCode.custom,
                      message:
                        'Çocuk yolcuların yaşı, seyahat tarihinde 2 ve 12 yaş aralığında olmalıdır.',
                      path: ['birthDate'],
                    })
                  }
                }
                break
              case PassengerTypesEnum.Infant:
                if (!(dateDiff >= 0 && dateDiff < 730)) {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                      'Bebek yolcuların yaşı, seyahat tarihinde 0 ve 2 yaş aralığında olmalıdır.',
                    path: ['birthDate'],
                  })
                }
                break
              default:
                break
            }
          })
      )
      .superRefine((values, ctx) => {
        const citizenNoArr = values.map((val) => val.citizenNo)

        const uniqCitizenNo = new Set(citizenNoArr)
        const withoutUniqCitizenNo = [...new Set(citizenNoArr)]

        if (
          citizenNoArr.filter(Boolean).length > 0 &&
          uniqCitizenNo.size !== citizenNoArr.length
        ) {
          let citizenNoArrDuplicate = [...citizenNoArr]

          withoutUniqCitizenNo.forEach((item) => {
            const i = citizenNoArrDuplicate.indexOf(item)
            citizenNoArrDuplicate = citizenNoArrDuplicate
              .slice(0, i)
              .concat(
                citizenNoArrDuplicate.slice(i + 1, citizenNoArrDuplicate.length)
              )
          })

          citizenNoArrDuplicate.forEach((citizenNo, citizenNoIndex) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Aynı TC kimlik No girilemez',
              path: [`[${citizenNoArr.indexOf(citizenNo)}].citizenNo`],
            })
          })
        }
      })
      .superRefine((values, ctx) => {
        const moduleName = values[0]?.moduleName?.toLowerCase()

        if (moduleName === 'hotel' && isSingleMaleRestriction) {
          if (rooms && rooms.length > 0) {
            for (const room of rooms) {
              const roomPassengers = values.filter((passenger) =>
                room.passengerKeys.includes(passenger.passengerKey)
              )
              const hasAdultFemale = roomPassengers.some(
                (passenger) =>
                  passenger.type === PassengerTypesEnum.Adult &&
                  passenger.gender === GenderEnums.Female.toString()
              )

              if (!hasAdultFemale) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message:
                    'Seçim yapılan tesisin koşulları sebebiyle bu tesiste konaklamak için <a href="tel:0850878400" style="color: #3b82f6; text-decoration: underline;">0850 840 01 51</a> arayabilir veya Müşteri Hizmetlerimizden yardım isteyebilirsiniz.',
                  path: [],
                })
                break
              }
            }
          }
        }
      }),
  })

export const phoneSchema = z
  .string()
  .optional()
  .refine((value) => isMobilePhone(value ?? ''))
// Define the individual billing schema with required fields
const billingIndividualSchema = z.object({
  billingInfoName: z.string().min(3).max(50),
  name: z.string().min(3).max(50),
  lastName: z.string().min(3).max(50),
  title: z.union([z.literal('Bay'), z.literal('Bayan')]),
  tcKimlikNo: z.string().refine((value) => validTCKN(value)),
  countryCode: z.string(),
  city: z.string().nonempty(),
  district: z.string().nonempty(),
  address: z.string().min(4).max(255),
  email: z.string().email(),
  mobilPhoneNumber: phoneSchema,
})
// Define the corporate billing schema with required fields
const billingCorporateSchema = z.object({
  billingInfoName: z.string().min(3).max(50),
  title: z.string().nonempty(),
  vergiDairesi: z.string().min(3).max(50),
  vergiNo: z.string().min(3).max(50),
  tcKimlikNo: z.string().refine((value) => validTCKN(value)),
  countryCode: z.string(),
  city: z.string().nonempty(),
  district: z.string().nonempty(),
  address: z.string().min(4).max(255),
  email: z.string().email(),
  phoneNumber: phoneSchema,
})

// General form schema
const generalFormSchema = z.object({
  contactEmail: z.string().email(),
  contactGSM: phoneSchema,
  // moduleName: z.string(),
  isInPromoList: z.boolean(),
  fillBillingInfosCheck: z.boolean(),
  invoiceType: z.union([z.literal('0'), z.literal('1')]).optional(),
  // individual is not optional anymore; we'll conditionally handle its validation
  billingIndiviual: z
    .unknown()
    .or(billingIndividualSchema.partial().optional()), // We'll handle the validation conditionally in .refine()
  billingCorporate: z.unknown().or(billingCorporateSchema.partial().optional()), // We'll handle the validation conditionally in .refine()
})

// Default passenger validation (backward compatibility)
const passengerValidation = createPassengerValidation(false)
// Create dynamic checkout schema
export const createCheckoutSchema = (
  isSingleMaleRestriction: boolean = false,
  rooms?: Array<{ passengerKeys: string[] }> | null,
  childAge?: number
) => {
  const passengerValidation = createPassengerValidation(
    isSingleMaleRestriction,
    rooms,
    childAge
  )
  const checkoutSchemaBeforeRefine =
    generalFormSchema.merge(passengerValidation)

  // Refine the schema to enforce required fields in `individual` if `fillBillingInfosCheck` is true
  return checkoutSchemaBeforeRefine.superRefine((data, ctx) => {
    // When fillBillingInfosCheck is true, `individual` should match `billingSchemaIndividual`
    if (data.fillBillingInfosCheck) {
      // Check if `individual` exists and validate it with billingSchemaIndividual
      // `0` means this is indivual billing type
      if (data.invoiceType === '0') {
        const results = billingIndividualSchema.safeParse(data.billingIndiviual)

        return results.success
          ? true
          : results?.error?.issues.map((issue) => ctx.addIssue(issue))
      }
      if (data.invoiceType === '1') {
        const corporateResults = billingCorporateSchema.safeParse(
          data.billingCorporate
        )

        return corporateResults.success
          ? true
          : corporateResults?.error?.issues.map((issue) => ctx.addIssue(issue))
      }
    }

    // If fillBillingInfosCheck is false, we don't need to validate `individual` at all
    return true
  })
}
// Default checkout schema (backward compatibility)
export const checkoutSchemaMerged = createCheckoutSchema(false)
// Export the functions for dynamic validation
export { createPassengerValidation }

export type PassengerSchemaType = z.infer<typeof passengerValidation>
export type CheckoutSchemaMergedFieldTypes = z.infer<
  typeof checkoutSchemaMerged
>
