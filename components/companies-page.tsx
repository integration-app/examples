import React, { useState, useContext } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CompaniesTable } from '@/components/companies-table'
import { FlowPageProps } from '@/app/[scenario]/[connection]/page'
import {
  CompaniesContext,
  type CompaniesContextType,
} from '@/components/companies-provider'
import { Company } from '@/lib/types'
import FlowRunLog from '@/components/flow-run-log'

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Company name can't be blank.",
  }),
  domain: z
    .string()
    .refine((i) => /^[a-zA-Z0-9]{0,62}[a-zA-Z0-9-]\.[a-zA-Z]{2,}$/.test(i), {
      message: 'This value must be a valid domain.',
    })
    .transform((i) => {
      return i.toLowerCase().trim()
    }),
})

export default function CompaniesPage({ params }: FlowPageProps) {
  const { dataRepo, companies, setCompanies } = useContext(
    CompaniesContext,
  ) as CompaniesContextType

  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', domain: '' },
  })

  function onSubmit(company: z.infer<typeof formSchema>) {
    company = {
      ...company,
      id: Math.max(...companies.map((i) => i.id)) + 1,
      pushedInto: {},
    } as Company
    dataRepo.addItem(company)
    setCompanies(dataRepo.getAll())
    form.reset()
    setOpen(false)
  }

  return (
    <>
      <div className='flex justify-left mt-2'>
        <h2 className='mr-4 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-slate-200 sm:text-4xl gap-6'>
          Companies
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create new</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new company</DialogTitle>
              <DialogDescription>
                Next you will be able to push it to a CRM
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8'
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='gap-4'>
                      <FormLabel>Company name</FormLabel>
                      <FormControl>
                        <Input placeholder='Acme Inc.' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='domain'
                  render={({ field }) => (
                    <FormItem className='gap-4'>
                      <FormLabel>Company domain</FormLabel>
                      <FormControl>
                        <Input placeholder='acme.com' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className='w-full' type='submit'>
                  Submit
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <CompaniesTable params={params} />
      <FlowRunLog integrationKey={params.connection} />
    </>
  )
}
