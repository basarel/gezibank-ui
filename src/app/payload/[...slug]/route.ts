import { getPayload } from 'payload'
import config from '../../../../payload.config'
import { REST } from '@payloadcms/next'

const payload = await getPayload({ config })

export const { GET, POST, PUT, PATCH, DELETE } = REST({ config, payload })

