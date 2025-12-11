import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs'
import { z } from 'zod'

export enum SortOrderEnums {
  priceAsc = 'PRICE_ASC',
  priceDesc = 'PRICE_DESC',
  nameAsc = 'NAME_ASC',
  nameDesc = 'NAME_DESC',
}

interface Location {
  Id: number
  Code: string
  CountryCode: string
  Name: string
  IsDomestic: boolean
  // ProviderName: string
  Slug: string
}

export const carSearchEngineSchema = z.object({
  driverAge: z.number(),
  drop_time: z.string(),
  dropoff: z.object({
    Id: z.number(),
    Code: z.string(),
    CountryCode: z.string(),
    IsDomestic: z.boolean(),
    Name: z.string(),
    Slug: z.string().min(3),
    // ProviderName: z.string(),
  }),
  pickup: z.object({
    Id: z.number(),
    Slug: z.string().min(3),
    Code: z.string(),
    CountryCode: z.string(),
    IsDomestic: z.boolean(),
    Name: z.string(),
    // ProviderName: z.string(),
  }),
  drop_date: z.coerce.date(),
  pickup_date: z.coerce.date(),
  pickup_time: z.string(),
  isDiffrentLocation: z.boolean(),
})

export type CarSearchEngineSchemaTypeInfer = z.infer<
  typeof carSearchEngineSchema
>

export interface CarSearchEngine {
  Origin: Location[]
  Destination: Location[]
  PickupDate: string
  PickupHour: string
  ReturnDate: string
  ReturnHour: string
  DriverAge: number
  ReceivedProviders: string[]
  CustomerId: ID
  CustomerUserId: ID
  SessionToken: string
  ApiRoute: null
  ApiAction: null
  AppName: null
  ScopeName: null
  SearchToken: string
  ScopeCode: string
}

export interface CarSearchParams {
  Params: {
    CarRentalSearchPanel: CarSearchEngine
    SessionToken: string
    ApiAction: 'api/CarRental/Search'
    ApiRoute: 'CarRentalService'
    SearchToken: string
    AppName: string
    ScopeName: string
    ScopeCode: string
    CustomerId: ID
    CustomerUserId: ID
  }
  SessionToken: string
  ApiRoute: 'CarRentalService'
  ApiAction: 'api/CarRental/Search'
  RequestType: 'Service.Models.RequestModels.CarRentalSearchRequestModel, Service.Models, Version=1.2.8.0, Culture=neutral, PublicKeyToken=null'
  ReturnType: 'Service.Models.ResultModels.RestResult`1[[TravelAccess.Core.Models.CarRental.CarRentalSearchResponse, Core.Models.CarRental, Version=1.0.23.0, Culture=neutral, PublicKeyToken=null]], Service.Models, Version=1.2.8.0, Culture=neutral, PublicKeyToken=null'
  Device: string
  LanguageCode: string
  IPAddress: string
  MLToken: string
}

export enum FuelTypes {
  'Belirtilmemiş',
  'Diesel',
  'Hibrid',
  'Elektirikli',
  'LPG',
  'Hidrojen',
  'Benzin',
  'Benzin/Diesel',
}
export const filterParsers = {
  order: parseAsStringEnum<SortOrderEnums>(
    Object.values(SortOrderEnums)
  ).withDefault(SortOrderEnums.priceAsc),
  fuelTypes: parseAsArrayOf<FuelTypes>(parseAsInteger),
  transmission: parseAsArrayOf(parseAsInteger),
  provider: parseAsArrayOf(parseAsString),
  seatCount: parseAsArrayOf(parseAsString),
  category: parseAsArrayOf(parseAsString),
  brand: parseAsArrayOf(parseAsString),
}
