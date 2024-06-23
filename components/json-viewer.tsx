import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const ReactJson = dynamic(() => import('@microlink/react-json-view'), {
  ssr: false,
})

export default function JsonViewer({ json }: { json?: any }) {
  const themeData = useTheme()

  if (typeof window === 'undefined') return null

  if (json === null || json === undefined) {
    return '<empty data>'
  }

  if (typeof json !== 'object') {
    return json.toString()
  }

  return (
    <ReactJson
      src={json}
      name={false}
      collapsed={1}
      quotesOnKeys={false}
      enableClipboard={false}
      displayDataTypes={false}
      displayObjectSize={false}
      iconStyle='square'
      style={{ padding: 8, backgroundColor: 'transparent' }}
      theme={themeData.resolvedTheme === 'light' ? 'rjv-default' : 'harmonic'}
    />
  )
}
