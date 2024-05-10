import { Icons } from '@/components/icons'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ViewModeToggle({
  currentMode,
  setMode,
}: {
  currentMode: 'grid' | 'list'
  setMode: Function
}) {
  return (
    <Tabs defaultValue='list' value={currentMode}>
      <TabsList className='inline-flex rounded-sm border-2 p-0'>
        <TabsTrigger value='grid' onClick={() => setMode('grid')}>
          <Icons.grid />
        </TabsTrigger>
        <TabsTrigger value='list' onClick={() => setMode('list')}>
          <Icons.list />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
