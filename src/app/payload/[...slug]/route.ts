import config from '../../../../payload.config'
import { payloadRestRoute } from '@payloadcms/next/routes'

const route = payloadRestRoute(config)

export const GET = route
export const POST = route
export const PUT = route
export const PATCH = route
export const DELETE = route
