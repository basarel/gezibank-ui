import { OperationResultType } from '@/app/(frontend)/reservation/types'

import EmailTourOrderResult from './tour/tour'

export default function EmailBookResult({
  data,
}: {
  data: OperationResultType
}) {
  const { moduleName } = data.product.summaryResponse
  switch (moduleName) {
    case 'Tour':
      return <EmailTourOrderResult data={data} />
    default:
      return <div>Please choose a product</div>
  }
}

EmailBookResult.PreviewProps = {
  data: {
    product: {
      summaryResponse: {
        moduleName: '',
      },
    },
  },
}
